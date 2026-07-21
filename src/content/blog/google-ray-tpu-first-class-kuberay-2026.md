---
title: 'Ray TPU正式対応、GKE分散AI基盤をどう設計するか'
description: 'Ray TPU正式対応で、Google Cloud TPUをRay 2.55とKubeRayから扱えるようになった。日本のAI基盤チームがGKE配置、JAX学習、費用、運用設計、導入判断をどう検証すべきか整理する。'
pubDate: '2026-07-21'
category: 'news'
tags: ['Google Cloud', 'Google', 'AIインフラ', 'TPU', '開発基盤', '日本企業']
series: 'google-gemini-api-agent-platform-2026'
draft: false
---

Google Developers Blog は **2026年7月20日**、Ray 2.55 で Google Cloud TPU が Ray の **first-class accelerator** になったと発表した。これは、Gemini の新機能やチャットUIの更新ではない。分散 Python、JAX training、Ray Serve、Ray Data のような AI workload を、GPU 前提の Ray 運用から TPU へ広げるための基盤更新である。

このサイトでは、Cloud TPU の耐障害運用として [Google MaxText耐障害学習](/blog/google-maxtext-elastic-training-tpu-2026/) を扱った。今回の Ray on TPU は、その復旧設計より手前にある「どう TPU slice を確保し、どう Ray の scheduling 対象にするか」の話だ。さらに [Google Colab CLI](/blog/google-colab-cli-agent-runtime-2026/) が実験入口を広げ、[Google Cloud Rapid BucketとPyTorch I/O](/blog/google-cloud-rapid-bucket-pytorch-gcsfs-2026/) が学習I/Oを扱った流れと合わせると、Google Cloud の AI 基盤更新は、モデルAPIだけでなく実行基盤の整備へ寄っている。

## 事実: Ray 2.55でTPUが正式な実行資源になる

Google の発表によれば、Ray 2.55 以降では Google Cloud TPU が Ray の release pipeline、公式 pre-built images、core libraries のサポート対象に入る。従来のように実験的な path で独自 container を作り、コミュニティ情報を頼りに TPU を扱う段階から、Ray の標準 API を使って扱う段階へ移ったという位置づけだ。

Ray は task と actor で Python workload を分散実行する framework である。GPU を `GPU` resource として要求するのと同じように、TPU も Ray の scheduling 対象になる。ただし、TPU は GPU と同じ感覚で任意の host へ散らしてよい資源ではない。TPU chips は slice という固定グループで配線され、multi-host training では同じ slice 内に workers を置かないと collective communication が成立しない。

このため、今回の実務上の主役は「TPU を使える」ことそのものではなく、TPU slice の境界を Ray と GKE がどう共有するかにある。Google の記事は、GKE が slice を provision し、Ray TPU webhook が `ray.io/tpu-slice-name` のような label を付け、Ray Core がその label を読んで slice をまとめて予約する構成を説明している。

Ray Docs でも、KubeRay 上の TPU workload は `TPU` custom resource として task や actor から要求できる。さらに `ray.util.tpu` の utility は、TPU slice 名、accelerator type、topology などの label を使い、multi-host や multi-slice の配置を支援する。つまり、開発者は topology と accelerator generation を宣言し、slice placement の低レベル実装を直接書かない方向へ寄せられる。

## KubeRayがslice配置を扱う意味

GKE で Ray on TPU を使う場合、Ray Operator add-on が KubeRay と TPU 向け webhook を導入する。KubeRay は RayCluster、RayService、RayJob を Kubernetes 上で動かす operator であり、GPU でも使う部品である。TPU ではそこに、slice 境界を示す label 付与と、Ray Core 側の slice placement group が組み合わさる。

Google の記事では、multi-host slice で `numOfHosts` を指定し、`cloud.google.com/gke-tpu-accelerator` と `cloud.google.com/gke-tpu-topology` を node selector に置く例が示されている。たとえば v6e の 4x4 topology なら、16 chips が4つの host VM にまたがる。重要なのは、chip 数だけを数えるのではなく、topology と host のまとまりを保つことだ。

Ray Core の `slice_placement_group()` は、このまとまりを atomic に予約する。Ray AI libraries が内部で呼ぶため、通常の Ray Train、Ray Serve、Ray Data 利用者は直接呼ばないことが多い。一方、独自の分散 workload を書く platform team には、この API の考え方を理解しておく価値がある。slice が部分的に取れた状態で job を始めると、学習や推論が hang し、障害が application bug に見えてしまうからだ。

ここからは分析だ。日本の AI 基盤チームにとって、Ray on TPU は「GPU が足りないから TPU へ逃がす」だけの話ではない。Ray を共通 runtime として採用しているなら、training、batch inference、serving、evaluation を同じ運用面で扱いながら、workload ごとに GPU と TPU を使い分ける選択肢が増える。これは調達だけでなく、運用標準化の話である。

## 日本企業に効く実務価値

第一に、既存の Ray 運用資産を TPU 検証へ流用しやすくなる。日本企業では、GPU cluster、Kubernetes、ML pipeline、社内 notebook 環境がばらばらに育ちやすい。Ray を already adopted なチームであれば、TPU 向けに完全に別の orchestration stack を作る前に、KubeRay と GKE を使って小さく検証できる。

第二に、JAX workload の入口が分かりやすくなる。Ray Train の JAX guide は、`ScalingConfig` に `use_tpu: true`、`topology`、`accelerator_type`、`num_workers` を指定する流れを示している。これは、開発者が「どの TPU slice を使うか」を training code の外側で宣言し、JaxTrainer が分散実行を起動する設計だ。既存 JAX script をすべて捨てるのではなく、train loop と scaling config を分けて移行できる。

第三に、AI agent 評価や大量 batch 処理にも波及する。[Gemini Agent Platform 13 demos](/blog/google-gemini-agent-platform-13-demos-2026/) で整理したように、企業 agent は作って終わりではなく、評価、監査、deploy、改善を回す必要がある。評価 job が大規模化すると、LLM 呼び出しだけでなく、embedding、rerank、合成データ生成、回帰テストなどが重くなる。Ray on TPU は、こうした Python workload を accelerator pool へ載せる選択肢になる。

第四に、FinOps の比較軸が増える。TPU は単価だけで判断できない。GKE cluster mode、node pool、slice topology、image pull、Cloud Storage I/O、checkpoint、ログ、失敗時の再実行時間が費用に効く。GPU と TPU の価格表だけを見て切り替えるのではなく、Ray job の end-to-end 時間、失敗率、待ち時間、復旧設計まで含めて比較する必要がある。

## MaxText elastic trainingとの違い

Ray on TPU と MaxText elastic training は、どちらも Cloud TPU を扱うが、解決する層が違う。MaxText の記事は、長時間 training の途中で TPU worker が落ちた時、Pathways、MaxText、Orbax checkpoint を使って復旧半径を小さくする話だった。Ray on TPU は、それ以前に Ray runtime が TPU slice を正しく見つけ、予約し、Ray libraries から使えるようにする話である。

したがって、導入順序も違う。まず Ray on TPU で、slice provisioning、label、placement、JAX training、Ray Serve、Ray Data の基本 path を確認する。その後、長時間 training や multi-slice workload へ進む段階で、checkpoint、fault injection、elastic recovery、storage path を検証する。最初から復旧設計だけを読んでも、slice 配置が不安定なら本番にはならない。

また、Colab CLI とも使い分けが必要だ。Colab CLI は個人や小チームが GPU/TPU 実験を端末から始める入口として価値がある。一方、Ray on TPU は GKE と KubeRay を前提に、複数人・複数 job・本番に近い運用面を作る話である。検証の初速は Colab、継続運用は GKE/Ray、長時間学習は MaxText/Pathways というように、用途ごとに層を分けるほうが自然だ。

## 導入前に見るチェック項目

まず、小さい TPU slice で RayCluster を作り、label と placement を確認する。`ray.io/tpu-slice-name`、accelerator type、topology が期待どおり付いているか、Ray task が同じ slice 内に配置されるかを log で見る。ここを確認せずに training code を疑うと、原因調査が遠回りになる。

次に、JAX training と serving を分けて測る。JaxTrainer の `use_tpu` と `topology` で学習が動くこと、Ray Serve や batch inference workload が TPU で本当に効くことは別問題である。モデル、framework、XLA 対応、container image、起動時間をそれぞれ測る必要がある。

さらに、GPU との比較を workload 単位にする。JAX training は TPU と相性がよくても、PyTorch/XLA、vLLM、data preprocessing、embedding pipeline が同じように速くなるとは限らない。Ray を共通 runtime にするなら、GPU job と TPU job の queue、優先度、失敗時の retry、コスト配賦を同じ dashboard で見たい。

最後に、API stability を見る。Google の記事は `slice_placement_group()` を public API として紹介しているが、alpha stability とも説明している。platform team が直接この API に依存する場合は、Ray version pinning、upgrade test、fallback path を用意するべきだ。Ray libraries 経由で使う場合でも、Ray 2.55 以降の container image と KubeRay version の組み合わせを固定してから本番評価へ進みたい。

## まとめ

Ray 2.55 の TPU first-class support は、派手なモデル更新ではない。しかし、日本の AI 基盤チームには実務的な意味がある。TPU を「特殊な別基盤」ではなく、Ray の task、actor、Train、Serve、Data から扱う方向へ寄せられるからだ。

いま見るべきなのは、TPU を使えば安く速くなるかという単純な比較ではない。GKE が slice をどう provision し、KubeRay がどう label を付け、Ray Core がどう atomic に slice を予約し、JAX や serving workload がどの程度その上で安定するかである。日本企業が AI workload を事業基盤へ移すなら、モデル選定と同じくらい、こうした実行基盤の標準化を評価項目に入れるべきだ。

## 出典

- [Run Ray on TPU, Part 1: The foundations](https://developers.googleblog.com/run-ray-on-tpu-part-1-the-foundations/) - Google Developers Blog, 2026-07-20
- [Use TPUs with KubeRay](https://docs.ray.io/en/latest/cluster/kubernetes/user-guides/tpu.html) - Ray Docs
- [Scale ML workloads using Ray](https://docs.cloud.google.com/tpu/docs/ray-guide) - Google Cloud Documentation
- [Get Started with Distributed Training using JAX](https://docs.ray.io/en/latest/train/getting-started-jax.html) - Ray Docs
