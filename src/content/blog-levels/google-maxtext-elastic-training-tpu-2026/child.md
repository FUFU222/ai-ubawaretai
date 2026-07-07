---
article: 'google-maxtext-elastic-training-tpu-2026'
level: 'child'
---

Google が、Cloud TPU で大きなモデルを学習している途中に worker が落ちても、ジョブ全体を最初からやり直さずに復旧する方法を紹介した。名前は **elastic training**。MaxText、Pathways、Orbax、GKE を組み合わせる。

難しく聞こえるが、考え方はシンプルだ。普通の分散学習では、たくさんの machine が一緒に計算する。1台でも止まると、ほかの machine も待ち続け、最後は全部の job が落ちやすい。すると、最後の checkpoint から全体を起動し直すことになる。

今回の仕組みでは、TPU worker が落ちても、CPU 側の controller process は生きている。Pathways が故障を見つけ、MaxText の retry がそれを受け取り、Orbax が最後に正しく書けた checkpoint を選ぶ。だから、全部を再起動するのではなく、壊れた部分を戻して学習を続けられる。

## 何が起きたのか

Google のデモでは、3つの TPU v5e-16 slice、合計48 chips を使った。小さめの Qwen3-0.6B というモデルで学習を動かし、途中で worker pod をわざと kill した。

その結果、最後に正しく保存された checkpoint へ戻り、次の training step まで約1分50秒で復旧した。これは、どんな本番でも必ず2分で戻るという意味ではない。実験条件の中で、故障検知、pod の再配置、checkpoint の読み戻しがどう動くかを見せたものだ。

この話は、[Google Colab CLI](/blog/google-colab-cli-agent-runtime-2026/) のような「GPU/TPU を使いやすくする入口」とは少し違う。今回は、もっと大きな学習ジョブが壊れた時に、どう短く戻すかという基盤運用の話だ。

## 3つの部品が役割を分ける

Pathways は、TPU の worker が落ちたことを見つける。落ちた時に、training process へエラーとして知らせる。

MaxText は、そのエラーを受け取って retry する。普通なら job が終わってしまうところを、同じ process の中で復旧 path へ進める。

Orbax は、どの checkpoint に戻ってよいかを決める。途中までしか書けていない checkpoint を読んでしまうと危ない。だから、完全に書き終えた印がある checkpoint だけを使う。

この分担が大切だ。単に「自動で直る」と見るのではなく、故障を見つける部品、retry する部品、データを安全に戻す部品が別々にあると理解したほうがよい。

## 日本のチームが見るポイント

日本の会社がすぐに巨大モデルを最初から学習するとは限らない。それでも、この話は役に立つ。AI の評価や fine-tuning、社内データを使った実験が長くなるほど、途中で落ちた時のやり直しコストが増えるからだ。

たとえば、夜間に評価 job を回して、朝に結果を見る運用を考える。途中で worker が落ち、全部やり直しになると、時間だけでなくクラウド費用も無駄になる。復旧時間や失う step を短くできれば、AI基盤の信頼性は上がる。

また、[Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/) のように、AIエージェントの品質を継続的に測る仕組みでも、実行基盤が安定していないと評価結果を信じにくい。モデルの賢さだけでなく、学習や評価を支える基盤も見る必要がある。

## そのまま本番に入れない

注意点もある。Google のデモは、仕組みを理解するための小さめの構成だ。モデルが大きくなると checkpoint も大きくなり、復旧時のデータ転送が重くなる。

Google の記事では、大きな checkpoint を controller 経由で戻すと proxy memory が詰まる可能性も説明されている。その場合は、TPU host が Cloud Storage から直接 shard を読み書きする Pathways Persistence のような設計が重要になる。

まず試すなら、小さな job で worker をわざと落とし、何秒で検知し、何秒で pod が戻り、どの checkpoint から再開したかを記録するのがよい。復旧できたかだけでなく、どこに時間がかかったかを見ることが大切だ。

## 出典

- [We terminated a TPU mid-training and it recovered in seconds: Introduction to elastic training with MaxText](https://developers.googleblog.com/we-terminated-a-tpu-mid-training-and-it-recovered-in-seconds-introduction-to-elastic-training-with-maxtext/) - Google Developers Blog, 2026-07-06
- [Elastic training with Pathways](https://maxtext.readthedocs.io/en/latest/run_maxtext/run_maxtext_elastic_training.html) - MaxText documentation
- [Serve LLMs using multi-host TPUs on GKE with JetStream and Pathways](https://docs.cloud.google.com/kubernetes-engine/docs/tutorials/serve-multihost-tpu-jetstream) - Google Cloud documentation
