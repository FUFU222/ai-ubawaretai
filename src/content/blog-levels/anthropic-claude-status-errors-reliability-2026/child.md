---
article: 'anthropic-claude-status-errors-reliability-2026'
level: 'child'
---

2026年6月22日から24日にかけて、Claude の公式 status には複数のエラー率上昇が記録されました。影響範囲には claude.ai だけでなく、Claude API、Claude Code、Claude Cowork も含まれていました。

大切なのは、「Claude が一時的に不安定だった」で終わらせないことです。会社の開発や業務で Claude を使っているなら、Claude が遅い、エラーになる、使えない時間がある、という状態を前提にした設計が必要になります。

## 何が起きたのか

公式 status では、6月22日に複数モデルの elevated error rates が記録されました。Opus 4.8、Opus 4.7、Opus 4.6、Sonnet 4.6、Haiku 4.5 などが対象になった incident もあります。

6月23日には、multiple models across Claude の elevated error rate が critical impact として記録されました。この incident では claude.ai、Claude Console、Claude API、Claude Code、Claude Cowork が major outage から partial outage を経て operational に戻っています。

6月24日にも Opus 4.8 関連の elevated error rate がありました。いずれも resolved になっていますが、短い期間に何度も起きたことが重要です。

## なぜ日本の開発チームに関係するのか

Claude を個人が文章作成に使うだけなら、少し待つだけで済むかもしれません。しかし、会社の開発フローや社内ツールに入れている場合は違います。

たとえば、PRレビュー、問い合わせ分類、ドキュメント生成、社内FAQ、障害対応メモ、コード修正提案に Claude を使っているとします。このとき Claude が不安定になると、AIの返答が遅いだけでなく、人間の作業も止まります。

特に Claude Code は、ローカルファイル、shell、MCP、subagent とつながる開発エージェントです。途中でエラーが増えると、作業をどこで保存するか、どの差分をレビューするか、どのテストが未実行かを残す必要があります。

## エラーごとに対応を分ける

Anthropic の API docs では、エラーの種類が整理されています。401 や403 は認証や権限の問題です。これは何度 retry しても直りません。413 は request が大きすぎる問題なので、入力を小さくする必要があります。

429 は rate limit です。短時間に使いすぎている可能性があるので、待つ、queue に入れる、利用量を平らにする、といった対応が必要です。

500、504、529 は provider 側の不調や処理負荷に関係する可能性があります。この場合は短い retry、時間を置いた再試行、別の処理経路、または手動対応へ切り替える設計が必要になります。

## まず決めること

最初に、Claude を使っている業務をリストにします。Claude API、Claude Code、Claude Cowork、claude.ai、クラウド経由の利用、MCP 経由の利用を分けて書き出します。

次に、その業務が止まってよいかを決めます。数時間遅れてよい業務、少し遅れても人間が引き継ぐべき業務、止めると顧客や本番運用に影響する業務を分けます。

そして、代替経路を決めます。人間に戻す、queue に入れる、あとで再実行する、別モデルへ切り替える、低リスク業務だけ止める、などです。重要な業務ほど、自動切替だけでなく人間の確認を入れるほうが安全です。

## まとめ

Claude の障害は、Claude を使うなという話ではありません。むしろ、重要な業務で使うなら、失敗したときの戻し方まで設計しようという話です。

AI は便利ですが、いつも成功する前提で業務を組むと危険です。日本の開発チームは、Claude のエラーをきっかけに、retry、rate limit、代替経路、手動復旧、社内通知の手順を確認しておくべきです。

## 出典

- [Claude Status - Incident History](https://status.anthropic.com/) - Anthropic, accessed 2026-06-24
- [Anthropic Docs: Errors](https://docs.anthropic.com/en/api/errors) - Anthropic Docs
- [Anthropic Docs: Rate limits](https://docs.anthropic.com/en/api/rate-limits) - Anthropic Docs
