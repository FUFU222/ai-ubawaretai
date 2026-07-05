---
article: 'claude-code-21201-system-role-harness-reminders-2026'
level: 'child'
---

Claude Code 2.1.201は、Claude Sonnet 5との会話の途中で、Claude Code側から送る「思い出し用の情報」に `system` roleを使わなくする更新だ。公式発表は一文だけで、変更後にどのroleを使うかまでは説明していない。

`system` roleとは、AIへ「このルールを優先して守ってください」と伝えるための強い指示枠である。利用者が入力する普通の `user` messageとは役割が違う。だから、AIの回答文が同じに見えても、裏側のAPI requestやproviderの検証結果が変わる場合がある。

## 何が変わったのか

Claude Codeは、利用者の依頼を受け、ファイルを読み、commandを実行し、その結果をClaudeへ返しながら作業を進める。この長い会話の途中で、実行環境側が状態を知らせる情報を追加することがある。Anthropicは、そのharness reminderにSonnet 5ではmid-conversation `system` roleを使わなくなったと説明した。

ここで分かるのは「使わなくなった」という事実までだ。harness reminderの内容、変更理由、変更後のmessage形式は非公開である。そのため、「危険な不具合だった」「回答品質が必ず上がる」とは言えない。

[Claude Sonnet 5のAPI移行設計](/blog/anthropic-claude-sonnet-5-pricing-migration-2026/)で扱ったモデルの料金やtokenizer変更とは別の話で、今回はClaude Codeがモデルへ会話を渡す形式の更新と考えると分かりやすい。

## なぜproviderごとの確認が必要なのか

Anthropicの公式docsでは、会話途中の `system` messageはClaude Opus 4.8だけで利用できる機能とされている。また、Claude API、Claude Platform on AWS、Microsoft Foundryでは使えるが、Amazon BedrockとGoogle Cloudでは使えない。

このため、同じClaude Codeと同じように見えるtaskでも、接続先によってAPIの受け付けるmessage形式が異なる。2.1.201の変更理由は公式には説明されていないものの、providerとmodelの組み合わせを分けて試験する必要があることは明確だ。

日本企業では、開発者ごとにAnthropic直接接続とcloud経由が混在する場合がある。全員を一度に更新する前に、実際の接続経路を確認した方がよい。

## 更新時に試すこと

まず検証用repositoryを用意し、Claude Code 2.1.200と2.1.201で同じtaskを実行する。一問一答ではなく、ファイル読取、command実行、修正、testまで複数のtool callが続くtaskを選ぶ。

次の項目を比べる。

- APIの400 errorやretryが起きないか
- taskが最後まで完了するか
- 禁止した操作を回避できるか
- input tokenとcache read tokenが大きく変わらないか
- 既存の監査ログやdashboardが読み取れるか

Claude CodeのOpenTelemetry monitoringを使えば、model、token、cache、request ID、retry、status codeを記録できる。通常は、まず本文を保存しないmetadataだけで比較すればよい。

## raw API bodyは限定環境だけで使う

どうしてもmessage roleそのものを確認する場合、Claude CodeにはMessages APIのrequest/response bodyをOpenTelemetryへ出す設定がある。ただし、bodyにはsystem prompt、過去の利用者入力、AIの回答、tool resultを含む会話履歴全体が入る。

本番端末で常時記録すると、source codeや機密情報まで監査基盤へ送る恐れがある。機密情報のない検証用repositoryで、短期間だけ有効にし、保存先へのアクセスと削除期限を決める必要がある。

なお、monitoring dataにある `gen_ai.system=anthropic` はproviderを示す属性で、今回変わったmessageの `system` roleとは別物だ。名前が似ているため、監査担当者は混同しないようにしたい。

## まとめ

Claude Code 2.1.201は小さなreleaseだが、Sonnet 5へ渡す会話構造に触れる変更である。回答文だけを見るのではなく、利用中provider、API error、tool loop、token、監査ログを比較する。

公式発表にない原因を推測して断定する必要はない。日本企業は小規模な先行配布で実測し、問題がなければ段階的に広げるのが安全である。

## 出典

- [Claude Code v2.1.201 release（Anthropic公式GitHub）](https://github.com/anthropics/claude-code/releases/tag/v2.1.201)
- [Mid-conversation system messages（Claude Platform Docs）](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages)
- [Monitoring（Claude Code Docs）](https://code.claude.com/docs/en/monitoring-usage)
