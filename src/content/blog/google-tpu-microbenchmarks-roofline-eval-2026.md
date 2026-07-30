---
title: 'Google TPUベンチマーク、性能評価をRooflineで見直す'
description: 'Google TPUベンチマークをRooflineで整理。日本のAI基盤チームがGPU/TPU比較、Ironwood検証、学習・推論のボトルネック診断をどう進めるか実務手順で解説する。'
pubDate: '2026-07-30'
category: 'news'
tags: ['Google Cloud', 'Google', 'AIインフラ', 'TPU', '開発基盤', '日本企業']
series: 'google-gemini-api-agent-platform-2026'
draft: false
---

Google Developers Blog は **2026年7月30日**、TPU の実効性能を測る microbenchmark suite の使い方を公開した。これは新しい Gemini モデルやチャット機能の発表ではない。だが、日本の AI 基盤チームにはかなり実務的な意味がある。GPU と TPU を価格表やカタログ値だけで比較するのではなく、Network、Compute、HBM、Host Transfer、Attention を分けて測り、Roofline でボトルネックを切り分ける材料になるからだ。

この文脈は、すでに扱った [Ray TPU正式対応](/blog/google-ray-tpu-first-class-kuberay-2026/) や [Google MaxText耐障害学習](/blog/google-maxtext-elastic-training-tpu-2026/) の前段にある。Ray は TPU slice をどう実行資源として扱うか、MaxText は長時間学習をどう復旧するかを扱った。今回の microbenchmark は、その前に「そもそもこの TPU 環境は、理論値に近い動きをしているのか」「自社 workload は compute、memory、network のどこで詰まるのか」を確認する話である。

## 事実: TPU性能を5つの部品に分けて測る

Google の記事は、TPU の性能評価を大きく 5 つに分けている。Network、Compute、High Bandwidth Memory、Host Transfer、Ragged-Paged Attention である。ここを分けることが重要だ。AI workload の遅さは、単に「TPU が遅い」「モデルが重い」では説明できない。

Network は、複数 chip で all-gather、all-reduce、reduce-scatter、all-to-all のような collective communication を回すときに効く。大規模学習では、行列計算が速くても chip 間通信が詰まれば全体が止まる。Compute は GEMM や matmul の生の計算能力を見る。HBM は chip 上の高帯域メモリへの読み書き速度を測る。Host Transfer は host CPU と accelerator HBM の間の転送を見る。Attention 系の benchmark は、Transformer 推論で TTFT や TPOT に効く primitive を見る。

つまり microbenchmark は、完成済みモデルを一回走らせるだけでは見えない層を分解する道具である。日本企業でよくある「同じモデルを GPU と TPU に載せてみたら期待より速くない」という場面では、まずこの分解が必要になる。計算が詰まっているのか、HBM が詰まっているのか、host から accelerator への転送が詰まっているのか、分散通信が詰まっているのかで、打つ手はまったく違う。

## Rooflineで原因を3分類する

Google Cloud の accelerator benchmarking ドキュメントは、microbenchmark、Roofline analysis、model benchmarking を分けて考えるよう勧めている。ここでの要点は、モデルの end-to-end 速度だけを見ないことだ。最初に hardware の上限と基礎特性を測り、そのうえで実モデルの測定値を置く。

Roofline は、workload が compute-bound、memory-bound、network-bound のどれに近いかを見るための地図として使える。Compute-bound なら、MXU を高く使っているため、メモリ転送だけをいじっても大きな改善は出にくい。Memory-bound なら、HBM 交通量、データ locality、activation、attention の持ち方を見直す。Network-bound なら、sharding、mesh、collective、communication overlap を疑う。

この切り分けは、[Google TunixでAgentic RL学習](/blog/google-tunix-agentic-rl-training-2026/) のような agentic workload にも効く。Agentic RL では tool 待ちや rollout 待ちが目立つが、学習側に戻った後も accelerator が compute-bound なのか memory-bound なのかは別問題だ。AI エージェント基盤では、アプリケーション側の待ち時間と accelerator 側の詰まりを混同しないことが重要になる。

## Ironwood TPU 7x事例の読み方

Google の記事は、Ironwood、つまり TPU 7x の性能分析にも触れている。110B パラメータ級の Mixture-of-Experts training workload を 4x4x4 TPU 7x 構成で見た例では、forward pass と dense core は compute-bound に近く、routing や attention primitive は HBM の影響を受けやすいと整理している。microbenchmark の結果は、collective の詰まりや HBM 側の制約を特定し、SparseCore collective offloading や Tokamax Splash Attention のような改善判断につながったとされる。

ここで日本企業が読むべきなのは、特定の数値だけではない。重要なのは、TPU 7x や Ironwood を評価するときに、モデル全体を黒箱として測るのではなく、dense core、routing、attention、collective、HBM を分けて見るという方法である。AI 基盤の調達では、ベンダーの代表 benchmark と自社 workload がずれることがある。MoE、long context、retrieval、batch inference、fine-tuning、評価 job では、詰まる場所が違う。

また、Google の accelerator benchmarking ドキュメントは、モデルが特定 hardware に最適化されているかも見ろと説明している。GPU 向けに自然な head dimension や kernel が、TPU でそのまま最適とは限らない。逆も同じである。したがって、GPU 対 TPU の比較は「同じモデルをそのまま置く」だけでは不十分だ。どの程度まで両方に最適化するか、どの状態を fair comparison とみなすかを事前に決める必要がある。

## 日本企業がまず作るべき評価表

日本の AI 基盤チームがこの更新からすぐ使えるのは、評価表の作り方である。まず、対象 workload を training、inference、batch evaluation、agent post-training、RAG preprocessing のように分ける。次に、それぞれで見る metric を分ける。Training なら throughput、MFU、checkpoint 時間、collective、復旧時間。Inference なら TTFT、TPOT、P99 latency、batch size、memory pressure。評価 job なら待ち時間、失敗時の再実行、I/O、費用配賦である。

次に、microbenchmark と model benchmark の順番を固定する。最初に小さな構成で Network、Compute、HBM、Host Transfer、Attention の基礎値を取る。その後、実モデルを載せる。実モデルが遅いときに、microbenchmark の基礎値と比べることで、hardware の健康状態なのか、framework や sharding の問題なのか、モデル設計の問題なのかを切り分けやすくなる。

さらに、storage と I/O を別枠で見る。[Google Cloud Rapid BucketとPyTorch I/O](/blog/google-cloud-rapid-bucket-pytorch-gcsfs-2026/) で扱ったように、学習基盤の性能は accelerator だけでは決まらない。checkpoint、dataset shard、object storage、filesystem adapter、warmup、cache が詰まれば、TPU も GPU も待つ。microbenchmark で TPU の部品性能が出ているのに end-to-end が遅いなら、次は I/O と orchestration を見るべきだ。

## 誤解しやすい点

第一に、microbenchmark は本番性能そのものではない。部品の限界や健康状態を見る道具であって、実モデルの throughput、品質、安定性、費用を保証しない。Google Cloud のドキュメントも、microbenchmark と Roofline の後に model benchmarking を置いている。つまり、部品測定と実 workload 測定は両方必要である。

第二に、最速値だけで判断しないことだ。日本企業の本番利用では、平均 throughput より、再現性、P99、障害時の戻り方、監査ログ、リージョン、データ分類、利用者の skill set が効く。特に TPU は JAX、XLA、Pathways、MaxText、Ray、vLLM TPU などの周辺知識とセットになりやすい。高い数値が出ても、運用できなければ本番価値は出ない。

第三に、シリーズ内の他記事と層を混同しないことだ。Ray on TPU は実行資源の配置、MaxText は長時間学習の復旧、Tunix は agentic post-training、今回の microbenchmark は性能測定と診断である。これらをまとめて評価表に置くと、Google Cloud の AI 基盤を「使えるか」ではなく、「どの層にどの運用責任があるか」として判断できる。

## まとめ

Google の TPU microbenchmark suite は、派手な生成AI機能ではない。しかし、AI 基盤を実務で選ぶチームには重要な更新である。GPU と TPU の比較を、単価、理論 FLOPS、代表モデルのスコアだけで行う時代ではなくなっている。Network、Compute、HBM、Host Transfer、Attention を分け、Roofline で bottleneck を見て、最後に自社 workload の model benchmark へ進むべきだ。

日本企業が今やるべきことは、すぐ大規模 TPU 検証に進むことではない。まず小さな評価環境で microbenchmark の基礎値を取り、既存の GPU 検証表と同じ尺度に並べる。そのうえで Ray、MaxText、Tunix、storage I/O、監視、費用配賦を足す。こうすれば、TPU 採用は「速そうだから試す」ではなく、事業 workload に対する説明可能な基盤選定へ近づく。

## 出典

- [How to use Google microbenchmarks for evaluating TPU performance](https://developers.googleblog.com/how-to-use-google-microbenchmarks-for-evaluating-tpu-performance/) - Google Developers Blog, 2026年7月30日
- [AI accelerator performance and benchmarking](https://docs.cloud.google.com/docs/ai-ml/accelerator-performance-benchmarking) - Google Cloud Documentation
- [AI-Hypercomputer/accelerator-microbenchmarks](https://github.com/AI-Hypercomputer/accelerator-microbenchmarks) - GitHub
- [A developer's guide to training with Ironwood TPUs](https://cloud.google.com/blog/products/compute/training-large-models-on-ironwood-tpus) - Google Cloud Blog
