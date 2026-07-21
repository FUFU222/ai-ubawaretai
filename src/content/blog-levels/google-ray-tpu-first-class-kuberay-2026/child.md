---
article: 'google-ray-tpu-first-class-kuberay-2026'
level: 'child'
---

Google が、Ray 2.55 で Google Cloud TPU を正式に扱いやすくした。Ray は、Python の処理をたくさんの machine に分けて動かすための仕組みだ。これまで GPU で Ray を使っていた人が、TPU も同じような考え方で使いやすくなる。

ただし、TPU は GPU と少し違う。TPU chips は **slice** というまとまりでつながっている。大きな学習をするときは、この slice の中に worker をきれいに置かないといけない。ばらばらの slice に置くと、worker 同士が速く通信できず、学習が止まってしまう。

## 何が変わったのか

Google の発表では、Ray 2.55 から Google Cloud TPU が Ray の first-class accelerator になったと説明している。これは、TPU が Ray の公式 image や core libraries の中で扱われ、実験的な使い方から一歩進んだという意味だ。

GKE では Ray Operator add-on を使う。これにより KubeRay が入り、TPU host に slice 名や topology の label が付く。Ray はその label を見て、同じ slice の host をまとめて予約する。

つまり、開発者が毎回「この worker はこの machine へ置く」と細かく書くのではなく、Ray と GKE が slice のまとまりを守る。ここが今回の大事な点だ。

## なぜ日本の開発チームに関係するのか

日本の会社が、いきなり巨大モデルを最初から学習するとは限らない。それでも、AI の検証、fine-tuning、評価 job、大量のデータ処理は増えていく。途中から GPU だけでは足りない、または TPU も試したいという場面が出てくる。

そのとき、まったく別の基盤を作るより、Ray を共通の実行基盤にできるなら試しやすい。[Google Colab CLI](/blog/google-colab-cli-agent-runtime-2026/) は小さな実験の入口として使いやすい。一方、Ray on TPU は GKE 上でチーム運用するための入口になる。

また、[Google MaxText耐障害学習](/blog/google-maxtext-elastic-training-tpu-2026/) は、学習中に worker が落ちた時の復旧を扱っていた。今回の Ray on TPU は、その前に「そもそも TPU slice をどう正しく使うか」を整える話だ。

## まず確認したいこと

最初に見るべきなのは、TPU が使えるかどうかだけではない。GKE の cluster で Ray Operator が動き、TPU host に label が付き、Ray task が同じ slice に置かれるかを見る必要がある。

次に、JAX training を小さく動かす。Ray Docs では、`ScalingConfig` に `use_tpu=True`、`topology`、`accelerator_type` を指定する例がある。これにより、JaxTrainer が TPU 向けの分散 job を起動する。

さらに、費用と待ち時間も見る。TPU は強いが、slice の確保、container image、Cloud Storage、checkpoint、失敗時の retry まで含めると、単純な単価だけでは判断できない。

## まとめ

Ray 2.55 の TPU 対応は、AI アプリの見た目を変える更新ではない。けれど、AI を支える基盤を作る人には重要だ。TPU を特別扱いしすぎず、Ray の task、actor、Train、Serve、Data の流れに入れられる可能性が出てきた。

日本のチームは、まず小さな TPU slice で placement、JAX training、ログ、費用を確認するとよい。その結果を見て、GPU、Colab、GKE、Ray、MaxText をどう使い分けるかを決めるべきだ。

## 出典

- [Run Ray on TPU, Part 1: The foundations](https://developers.googleblog.com/run-ray-on-tpu-part-1-the-foundations/) - Google Developers Blog, 2026-07-20
- [Use TPUs with KubeRay](https://docs.ray.io/en/latest/cluster/kubernetes/user-guides/tpu.html) - Ray Docs
- [Scale ML workloads using Ray](https://docs.cloud.google.com/tpu/docs/ray-guide) - Google Cloud Documentation
- [Get Started with Distributed Training using JAX](https://docs.ray.io/en/latest/train/getting-started-jax.html) - Ray Docs
