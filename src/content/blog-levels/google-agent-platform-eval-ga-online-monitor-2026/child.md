---
article: 'google-agent-platform-eval-ga-online-monitor-2026'
level: 'child'
---

Google は 2026年7月31日、Gemini Enterprise Agent Platform の agent and model evaluations を一般提供にしたと発表しました。これは、AIエージェントが仕事をうまくできているかを、開発中だけでなく本番公開後にも測るための機能です。

たとえば、社内問い合わせエージェントが正しい部署を案内できたか、営業支援エージェントが古い顧客情報を使っていないか、チケット作成エージェントが勝手に削除操作をしていないかを、traceや評価ケースから確認しやすくなります。

以前の [Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/) では、評価を繰り返して改善する考え方を扱いました。今回の違いは、評価機能がGAになり、本番後の監視やdrift alertまで含めて使いやすくなった点です。

## 何ができるのか

まず、評価ケースを作ってエージェントを動かし、結果を採点できます。Googleの説明では、Task Success、Tool Use Quality、安全性、Grounding、Hallucinationなどのmetricが用意されています。さらに、会社ごとの基準に合わせたcustom metricも作れます。

次に、user simulatorを使って、途中で要件を変えるユーザーや、あいまいな依頼をするユーザーを再現できます。AIエージェントは一問一答よりも、会話の途中で状況が変わる場面で失敗しやすいので、この機能は実務的です。

また、environment simulatorで外部システムの失敗を再現できます。CRMが遅い、APIが503を返す、権限が足りない、といった状況を本番システムに触らず試せます。

## なぜ本番後の監視が必要なのか

AIエージェントは、公開した日だけ正しくても足りません。利用者の質問が変わる、接続先ツールが変わる、社内ルールが更新される、モデルの挙動が変わる、といった理由で品質が落ちることがあります。

そのため、online monitorが重要になります。Googleは、本番trafficのtraceを評価し、スコアの変化やdrift alertを確認できると説明しています。これは [Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/) の次に来る考え方です。ログを見るだけでなく、その動きが良かったかを判定するわけです。

## 日本企業が注意する点

注意点は、平均点だけで判断しないことです。AIの評価点が高くても、個人情報を出した、承認なしに更新した、顧客データを混ぜた、という失敗が1件あれば止めるべき場合があります。

もう一つは、評価にも費用がかかることです。LLM-as-a-judgeやonline monitorはモデルを呼び出します。すべての会話を採点するのではなく、高リスクな操作、低評価feedback、tool失敗があったsessionから始めるのが現実的です。

[Gemini Agent PlatformのRuntimeとIdentity](/blog/google-gemini-agent-platform-runtime-identity-2026/) で扱ったように、AIエージェントにはowner、権限、停止手順が必要です。評価機能も同じ台帳に入れるべきです。どのエージェントを、どの基準で、いつ評価したかを残さなければ、あとから説明できません。

## まずやること

最初は一つのエージェントに絞ります。社内FAQ、障害一次調査、チケット分類のように、人間が結果を確認できるものがよいです。

次に、過去の失敗や起きてほしくない失敗を20件ほど集めます。途中で条件が変わる、禁止されたtoolを使いそうになる、権限が足りない、個人情報が含まれる、といったケースを入れます。

最後に、重大失敗と改善指標を分けます。重大失敗は1件でも止める。回答品質やtool useの平均点は改善を見る。こう分けると、評価を現場の判断に使いやすくなります。

## まとめ

Google Agent評価GAは、AIエージェントを本番で使うための品質管理機能です。開発中のテスト、本番traceの評価、online monitor、drift alertを組み合わせることで、公開後の品質低下を見つけやすくなります。

日本企業は、評価点を見るだけではなく、承認、権限、個人情報、費用、停止条件を一緒に設計する必要があります。AIエージェントを業務へ入れるなら、評価は後付けではなく、最初から運用台帳に入れるべき項目です。

## 出典

- [Agent and Model Evaluations in Gemini Enterprise Agent Platform are now GA](https://developers.googleblog.com/agent-and-model-evaluations-in-gemini-enterprise-agent-platform-are-now-ga/) - Google Developers Blog, 2026-07-31
- [Agent evaluation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/agent-evaluation) - Google Cloud Documentation, last updated 2026-07-30
- [Scale your agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale) - Google Cloud Documentation
