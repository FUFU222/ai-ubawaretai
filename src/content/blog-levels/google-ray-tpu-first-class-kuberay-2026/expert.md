---
article: 'google-ray-tpu-first-class-kuberay-2026'
level: 'expert'
---

Ray 2.55 の Google Cloud TPU first-class support は、AI 基盤チームが「TPU を特殊な例外」として扱う時間を減らす更新だ。重要なのは、TPU が速いか安いかという単純な比較ではない。Ray Core、KubeRay、GKE の label、TPU slice placement、Ray Train の `ScalingConfig` がつながり、Python workload を accelerator-aware に scheduling できる運用面ができることにある。

既存記事では [Google MaxText耐障害学習](/blog/google-maxtext-elastic-training-tpu-2026/) で TPU worker failure と checkpoint 復旧を扱った。今回はその下準備に近い。slice を正しく予約できなければ、elastic recovery 以前に multi-host workload が hang する。さらに [Google Colab CLI](/blog/google-colab-cli-agent-runtime-2026/) のような個人実験入口、[Google Cloud Rapid BucketとPyTorch I/O](/blog/google-cloud-rapid-bucket-pytorch-gcsfs-2026/) のような storage I/O 更新と並べると、AI workload の本番化は model API だけではなく、実行・保存・復旧・観測の組み合わせで決まる。

## 事実: first-class supportの中身

Google Developers Blog は、Ray 2.55 で Google Cloud TPU が Ray の first-class accelerator になり、公式 pre-built images と core libraries のサポート対象に入ったと説明している。これは、TPU 利用が「自作 Dockerfile と実験的手順に依存する」状態から、Ray の標準的な release と library surface に寄ることを意味する。

Ray の基本 model は task と actor である。開発者は Python function や stateful worker を Ray cluster 上に投げ、Ray scheduler が resource request に応じて placement する。GPU の場合は `GPU` resource を要求する。TPU も Ray から custom resource として見えるが、GPU と違って slice boundary を守る必要がある。

TPU slice は、複数 host VM と chips が ICI で結ばれた固定単位である。multi-host training では、workers が同じ slice に乗らないと collective communication が成立しない。GPU cluster で言えば、NVLink でつながった1台の大きな box の内部だけに速い配線があり、それをまたいで勝手に worker を散らすと all-reduce が詰まる、というイメージに近い。

GKE では Ray Operator add-on が KubeRay と TPU webhook を入れる。KubeRay は RayCluster、RayService、RayJob を Kubernetes resource として扱う operator であり、TPU webhook は TPU host に slice name や topology を表す label を付ける。Google の記事では、`ray.io/tpu-slice-name` が slice 境界を伝える thread になると説明されている。

Ray Core 側では `ray.util.tpu.slice_placement_group()` が whole slice を atomic に予約する。Ray Docs は、bundle label selector を使い、各 slice の bundle が同じ `ray.io/tpu-slice-name` を持つ worker 上へ置かれる流れを説明している。これにより、部分的に host だけ取れた状態で job を始める危険を減らせる。

## ライブラリ利用者とplatform teamで見る点が違う

通常の Ray Train、Ray Serve、Ray Data 利用者は、`slice_placement_group()` を直接呼ばないことが多い。Google の記事も、Ray AI libraries がこの処理を内部で呼ぶため、利用者は topology を宣言するだけでよいと説明している。Ray Train の JAX guide では、`ScalingConfig(num_workers=4, use_tpu=True, topology="4x4", accelerator_type="TPU-V6E")` のように書く例がある。

これは application developer には良い抽象化である。JAX の training loop、metrics reporting、checkpoint storage を書き、hardware shape は scaling config に寄せる。GPU と TPU の比較も、training code の中心を壊さずに行いやすい。

一方、platform team は抽象化の下を見なければならない。KubeRay version、Ray image、GKE cluster mode、TPU topology、node pool availability、quota、zone、IAM、Cloud Storage、observability、upgrade policy が全部関係する。Ray libraries が placement を隠してくれても、slice が確保できない、label が想定と違う、image が古い、quota が足りない、worker が起動しないといった問題は platform 側に返ってくる。

特に注意したいのは、`slice_placement_group()` が public API でありながら alpha stability と説明されている点だ。独自 scheduler や custom distributed workload が直接この API に依存するなら、Ray version pinning と regression test が必要になる。library 経由で使う場合も、Ray 2.55 以降へ上げるだけで本番に入れず、KubeRay と container image の組み合わせを固定して検証するべきだ。

## 日本企業での導入シナリオ

日本企業では、最初から frontier model の pre-training を目的に TPU を使うケースは限られる。現実的には、既存モデルの fine-tuning、embedding 生成、大規模 batch inference、agent evaluation、synthetic data generation、JAX/Flax の研究開発、社内 benchmark が入口になる。

このとき Ray on TPU が効くのは、workload を「一回の手動実験」から「繰り返し実行する基盤」へ移す段階だ。Colab や単体 TPU VM で試したものを、GKE 上の RayCluster、RayJob、RayService へ移し、チームが同じ queue、log、dashboard、cost allocation で扱う。その流れが作れれば、個人の成功実験を platform asset に変えやすい。

[Gemini Agent Platform 13 demos](/blog/google-gemini-agent-platform-13-demos-2026/) で扱ったように、企業 agent は evaluation flywheel を必要とする。agent が答えた内容を採点し、失敗を分類し、次の prompt や tool policy を直す。この評価が小規模なら CPU/GPU で足りるが、実リポジトリ、長文ログ、画像、動画、大量ケースを含むようになると、分散 batch workload になる。Ray を evaluation runtime として使うなら、TPU も候補に入る。

また、SRE と FinOps の観点では、GPU と TPU を同じ土俵で比べる準備ができる。重要なのは accelerator 単価ではなく、job wait time、startup time、throughput、失敗率、checkpoint cost、storage egress、operator 運用、debug time である。Ray を共通面にすると、少なくとも job metadata と workload history を揃えやすい。

## Ray on TPUとMaxText/Pathwaysの境界

Ray on TPU を MaxText elastic training と混同すると設計を誤る。Ray on TPU は、Ray workload が TPU slice を正しく scheduling できるようにする基盤である。MaxText/Pathways は、特定の JAX training stack で worker failure を処理し、checkpoint から復旧する設計である。

前者の失敗は、placement、quota、image、KubeRay、GKE add-on、label、resource request に出る。後者の失敗は、checkpoint consistency、controller process、Pathways worker、Orbax、storage data path、retry policy に出る。障害調査では、この層を分ける必要がある。

たとえば multi-host TPU job が止まった場合、まず workers が同じ slice に置かれているかを見る。`ray.io/tpu-slice-name`、topology、placement group readiness、Ray task/actor の scheduling strategy を確認する。ここが壊れているなら、MaxText の retry や Orbax checkpoint を見ても意味がない。

逆に placement が正しく、training が長時間動く段階まで来たら、checkpoint period、shared storage、Cloud Storage throughput、active checkpoint write 中の failure、restart budget を測る。Ray Docs の JAX guide も、multi-node training では shared cloud storage や NFS のような共有 storage が必要になると説明している。local path のままでは checkpointing の前提が崩れる。

## 検証手順: 小さく始めて層ごとに測る

第一段階は cluster と label の確認である。GKE Autopilot か Standard かを決め、Ray Operator add-on を有効化する。小さな v6e slice を使い、RayCluster を作り、head pod と worker pod の状態を見る。TPU host に accelerator type、topology、slice name の label が付き、Ray dashboard から resources と nodes が見えることを確認する。

第二段階は Ray Core の task/actor 確認である。小さな `@ray.remote(resources={"TPU": 4})` task を動かし、どの pod と slice に乗ったかを log に出す。custom workload を書く可能性があるなら、`slice_placement_group()` の readiness、timeout、num_hosts、chips_per_host を観測する。ここでは性能ではなく、placement の正しさを測る。

第三段階は Ray Train の JAX training である。Ray Docs の JaxTrainer 例のように、`use_tpu=True`、`topology`、`accelerator_type` を指定し、小さな training loop を走らせる。GPU 版と TPU 版を同じ metrics reporting で比較し、startup、compile、first step、steady state、checkpoint を分ける。JAX は compile time が見えにくいため、最初の数 step と安定後の throughput を分けて記録したほうがよい。

第四段階は serving と batch workload である。Ray Serve、Ray Data、LLM batch inference は training と違う bottleneck を持つ。TPU 上で本当に効く model と framework か、vLLM や XLA 対応、input pipeline、tokenizer、network、storage が詰まらないかを見る。GPU で速かった構成が TPU でそのまま速いとは限らない。

第五段階は failure と upgrade である。worker pod kill、node drain、quota exhaustion、image pull delay、Cloud Storage slowdown、Ray version upgrade を試す。Ray on TPU は placement を助けるが、失敗を消すわけではない。production readiness は、失敗時の log と runbook が揃って初めて判断できる。

## 運用設計で避けたい誤読

避けたい誤読の一つ目は、TPU support を「GPU code が何でもそのまま速くなる」と読むことだ。Ray は scheduling と runtime の共通面を提供するが、framework、model、kernel、data path は別である。JAX workload と PyTorch/XLA workload でも設計が違う。Google Cloud TPU docs は、PyTorch/XLA の device-centric mode と JAX の host-centric mode を分けて説明している。

二つ目は、slice topology を capacity planning から切り離すことだ。TPU は chip 数だけでなく topology が重要になる。4x4、v6e、multi-host、numOfHosts のような指定は、性能だけでなく scheduling 成功率、queue time、quota、zone choice に関係する。使いたい topology が常に空いているとは限らない。

三つ目は、KubeRay を「インストールしたら終わり」と見ることだ。operator は便利だが、RBAC、namespace、network policy、image registry、secret、service account、log retention、dashboard exposure、upgrade window は自社運用の責任である。AI workload はしばしば社内データやモデル重みを扱うため、Kubernetes resource と IAM を軽く見てはいけない。

四つ目は、費用を accelerator 単価だけで見ることだ。Ray on TPU では、slice 待ち、起動、compile、data loading、checkpoint、失敗時 retry、idle head pod、Cloud Storage request、ログ保存が費用になる。FinOps では、job 単位の total cost と output quality を結びつける必要がある。

## まとめ

Ray 2.55 の TPU first-class support は、Google Cloud TPU を Ray の標準的な分散 Python runtime へ近づける更新である。日本の AI 基盤チームにとっての価値は、TPU をすぐ全社標準にすることではない。Ray、KubeRay、GKE、JAX、Serve、Data を同じ検証面に載せ、GPU と TPU の使い分けを workload 単位で判断できるようにすることだ。

導入判断では、まず small slice で placement を確かめる。次に JAX training、serving、batch inference を別々に測る。最後に failure、checkpoint、upgrade、費用を runbook に落とす。Ray on TPU は、AI workload を「動いたデモ」から「説明できる基盤」へ進めるための部品として読むべきである。

## 出典

- [Run Ray on TPU, Part 1: The foundations](https://developers.googleblog.com/run-ray-on-tpu-part-1-the-foundations/) - Google Developers Blog, 2026-07-20
- [Use TPUs with KubeRay](https://docs.ray.io/en/latest/cluster/kubernetes/user-guides/tpu.html) - Ray Docs
- [Scale ML workloads using Ray](https://docs.cloud.google.com/tpu/docs/ray-guide) - Google Cloud Documentation
- [Get Started with Distributed Training using JAX](https://docs.ray.io/en/latest/train/getting-started-jax.html) - Ray Docs
