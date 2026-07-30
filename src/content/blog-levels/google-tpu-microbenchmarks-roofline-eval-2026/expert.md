---
article: 'google-tpu-microbenchmarks-roofline-eval-2026'
level: 'expert'
---

Google の **How to use Google microbenchmarks for evaluating TPU performance** は、AI infrastructure の調達判断をモデル名や理論 FLOPS から、測定可能な bottleneck 診断へ戻す記事である。新しいモデルの発表ではないが、実務上は重い。TPU や GPU を比較するとき、多くの組織は価格表、代表 benchmark、クラウド営業資料、社内 PoC の単発結果を並べる。しかし、本当に必要なのは、compute、memory、network、host transfer、attention primitive のどこが支配的かを分けることだ。

この話は [Ray TPU正式対応](/blog/google-ray-tpu-first-class-kuberay-2026/)、[Google MaxText耐障害学習](/blog/google-maxtext-elastic-training-tpu-2026/)、[Google TunixでAgentic RL学習](/blog/google-tunix-agentic-rl-training-2026/) の下に置くと分かりやすい。Ray は TPU slice を Ray/GKE から使う配置面、MaxText は長時間 training の復旧面、Tunix は agentic post-training の throughput 面を扱う。今回の microbenchmark は、それらの上で何かが遅いときに、どの層を疑うべきかを示す計測面である。

## 事実: microbenchmark suiteの射程

Google の記事は、TPU performance を Network、Compute、HBM、Host Transfer、Ragged-Paged Attention に分けて測る構成を示している。これは単なる測定項目の羅列ではない。large-scale ML workload の failure mode を、hardware module と software lever に対応させるための分類である。

Network は ICI や collective communication の世界である。all-gather、all-reduce、reduce-scatter、all-to-all の throughput と latency が低ければ、data parallel、tensor parallel、expert parallel、context parallel の設計が悪く見える。実際には、model code ではなく topology、mesh、collective implementation、communication overlap が問題かもしれない。

Compute は GEMM、matmul、MXU utilization を見る。ここで MFU が低いなら、shape、dtype、kernel selection、compiler lowering、padding、batching を疑う。HBM は memory bandwidth と data movement の話であり、activation、attention KV、expert routing、rematerialization、checkpointing と絡む。Host Transfer は host CPU と accelerator HBM の間の I/O であり、input pipeline や preprocessing を雑に設計すると、accelerator は速くても待つ。

Ragged-Paged Attention は特に inference と agent workload で重要になる。TTFT、TPOT、KV cache、variable sequence length、batch packing は、単純な dense GEMM benchmark では見えにくい。日本企業が RAG、コード生成、社内チャット、agent evaluation を見るなら、attention primitive の測定を training throughput と同じ表に入れるべきではない。用途が違うからだ。

## Rooflineは説明責任の道具である

Roofline model は、performance engineering の地図として使える。Google Cloud の accelerator benchmarking ドキュメントは、microbenchmarking、roofline analysis、model benchmarking を三つの dimension として置いている。この順番は重要だ。実モデルだけを測ると、なぜ遅いか分からない。microbenchmark だけを測ると、本番 workload に効くか分からない。Roofline はその間で、hardware limit と actual workload の距離を説明する。

Compute-bound なら、MXU plateau に近づく。そこでは HBM traffic の削減だけでは効果が限られる。kernel efficiency、FLOPs の削減、operator fusion、shape alignment、dtype、specialized kernel を見る。Memory-bound なら、operational intensity が足りない。activation recomputation、KV cache layout、attention implementation、data locality、HBM pressure を見る。Network-bound なら、ICI、DCN、mesh、sharding、collective overlap、pipeline parallelism を見る。

この分類は、クラウド費用の説明にも効く。日本企業の経理や調達は、accelerator の単価と利用時間を見がちだ。しかし実際には、network-bound の workload では chip を増やしても比例して速くならない。memory-bound では大きい構成にしても HBM pressure が残る。compute-bound では小さな kernel 改善が大きく効く場合がある。Roofline は、なぜ単価だけで判断できないかを技術者以外へ説明する補助線になる。

## Ironwood TPU 7xの例をどう読むか

Google の記事は、Ironwood、つまり TPU 7x の 110B MoE training workload 例を示している。4x4x4 構成で、forward pass と dense core は compute-bound に近く、routing と attention primitive は memory-bound 寄りになった、という読み方である。さらに microbenchmark が collective や HBM の詰まりを示し、SparseCore collective offloading や Tokamax Splash Attention のような intervention へつながったとされる。

この例から持ち帰るべきことは、特定の値を自社計画にそのまま貼ることではない。むしろ、MoE workload は dense training と同じ評価表では足りないという点だ。expert routing は memory と communication の影響を受ける。attention は sequence length、batching、KV cache、kernel に影響される。dense core は compute-bound でも、全体の step time は memory-bound part に引っ張られることがある。

また、Google Cloud の benchmarking ドキュメントは、hardware に最適化されていないモデルで比較すると誤った結論になり得ると説明している。これは vendor-neutral に重要だ。GPU で自然な head dimension や kernel が TPU で最適とは限らないし、TPU 向けに整えた shape が GPU で最適とも限らない。比較を fair にするには、どこまで software optimization を許すかを先に決める必要がある。

## 実務設計: 評価パイプラインを分ける

日本企業がこの発表を使うなら、評価 pipeline を 4 段に分けるとよい。

第一段階は、hardware module の baseline である。Network、Compute、HBM、Host Transfer、Attention の microbenchmark を小さな構成で取り、期待値からの乖離を記録する。ここでは本番モデルを急いで載せない。まず accelerator 環境が健康に動いているか、driver、runtime、JAX/XLA、container、topology、quota、placement が想定と合っているかを見る。

第二段階は、Roofline への配置である。代表 kernel、代表 layer、代表 inference path を選び、compute-bound、memory-bound、network-bound のどこにいるかを見る。ここで、GPU と TPU を同じ物差しで比較する。単に tokens/sec を並べるのではなく、なぜその tokens/sec になったかを説明できるようにする。

第三段階は、model benchmark である。training なら TPS/chip、MFU、checkpoint overhead、failure recovery、cost per successful step を見る。Inference なら TTFT、TPOT、P50/P95/P99、batch saturation、cache hit、cold start、cost per 1,000 successful responses を見る。Agent evaluation なら rollout latency、environment wait、tool failure、trainer starvation、replayability を見る。

第四段階は、運用評価である。これは [Google Cloud Rapid BucketとPyTorch I/O](/blog/google-cloud-rapid-bucket-pytorch-gcsfs-2026/) とも接続する。checkpoint と dataset I/O、Cloud Storage、filesystem adapter、container pull、GKE scheduling、observability、quota exhaustion、regional availability、cost allocation を同じ表に入れる。Accelerator が速くても、storage、scheduler、network egress、operator skill が弱ければ本番では詰まる。

## GPU/TPU比較で避けるべき失敗

第一の失敗は、vendor benchmark を採用判断に直結させることだ。vendor benchmark は useful signal だが、自社 workload の proxy ではない。特に日本企業では、日本語文書、社内用語、長い PDF、古いコードベース、SIer との共同運用、閉域 network、監査ログ要件が入る。モデル性能と accelerator 性能のどちらも、自社条件で再測定する必要がある。

第二の失敗は、PoC の1回目の結果を hardware の性質として解釈することだ。最初の TPU 結果が遅い場合、hardware が悪いのではなく、shape、kernel、mesh、input pipeline、data loader、host transfer、compilation warmup が未調整なだけかもしれない。逆に、最初に速く見える場合も、長時間運用、P99、障害復旧、コスト配賦で悪化するかもしれない。microbenchmark は、この過剰解釈を減らすために使う。

第三の失敗は、training と inference を同じ基準で見ることだ。Training は sustained throughput と fault tolerance が重要になりやすい。Inference は latency、tail、batching、attention、cache、serving engine が主役になりやすい。Agentic workflow はさらに tool wait と environment failure が絡む。TPU microbenchmark は共通の基礎値を与えるが、最終判断の KPI は workload ごとに分けるべきである。

## GovernanceとFinOpsへの落とし込み

この種の性能測定は、ML platform team だけの趣味にしてはいけない。日本企業では、AI 基盤の支出が大きくなるほど、経理、調達、セキュリティ、法務、事業部門が説明を求める。microbenchmark と Roofline は、その説明を技術的に支える。

たとえば、ある workload が network-bound なら、単純に chip 数を増やす予算要求は弱い。sharding 改善、communication overlap、topology 変更、framework version の更新を先に見るべきだ。Memory-bound なら、HBM 容量、activation policy、attention kernel、batch size、sequence length の見直しが費用削減策になる。Compute-bound なら、より高性能な accelerator や kernel optimization が費用対効果を持ちやすい。

FinOps では、cost per hour ではなく cost per successful unit を見る。Training なら successful step、completed epoch、validated checkpoint。Inference なら successful response、SLO 内 response、accepted answer。Agent training なら valid trajectory、useful improvement、regression-free update。Roofline による bottleneck 分類を付けると、費用増の理由を「需要が増えた」だけでなく、「memory-bound workload の再実行が増えた」「network-bound 構成で scale-out 効率が悪い」のように分解できる。

## まとめ

Google の TPU microbenchmark suite は、TPU を売り込むための単発 benchmark ではなく、AI 基盤の測定 discipline を示す更新として読むべきだ。Network、Compute、HBM、Host Transfer、Attention を分け、Roofline で bottleneck を分類し、model benchmark と運用評価へ進む。この順番があると、GPU/TPU比較は印象論から engineering decision に近づく。

日本企業が今決めるべきことは、TPU を採用するかどうかだけではない。AI workload ごとに、何を microbenchmark とし、何を model benchmark とし、どの結果を経理と調達へ説明するかである。Ray、MaxText、Tunix、storage I/O、GKE、監視を同じ評価表へ載せれば、Google Cloud の AI 基盤を、単なる新技術ではなく、事業 workload を継続的に動かす platform として判断できる。

## 出典

- [How to use Google microbenchmarks for evaluating TPU performance](https://developers.googleblog.com/how-to-use-google-microbenchmarks-for-evaluating-tpu-performance/) - Google Developers Blog, 2026年7月30日
- [AI accelerator performance and benchmarking](https://docs.cloud.google.com/docs/ai-ml/accelerator-performance-benchmarking) - Google Cloud Documentation
- [AI-Hypercomputer/accelerator-microbenchmarks](https://github.com/AI-Hypercomputer/accelerator-microbenchmarks) - GitHub
- [A developer's guide to training with Ironwood TPUs](https://cloud.google.com/blog/products/compute/training-large-models-on-ironwood-tpus) - Google Cloud Blog
