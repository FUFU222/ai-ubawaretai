---
article: 'openai-chatgpt-skills-default-enterprise-2026'
level: 'child'
---

OpenAI Help Center は、ChatGPT Enterprise の Skills について、2026年7月23日から、opt out していない Enterprise workspace で既定オンにする予定を示しています。Skills は、ChatGPT に同じ仕事を安定して進めさせるための再利用できるワークフローです。指示、例、補助ファイル、コードを含められます。

これは、ただの便利機能ではありません。会社の仕事の進め方を ChatGPT に渡す仕組みです。以前の [OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) では、Skills を管理する機能を扱いました。今回は、それが Enterprise で既定オンになる前に、管理者が何を確認すべきかが大事になります。

## 何を確認するのか

まず、Skills をこのまま有効にしてよいかを決めます。まだ社内ルールがないなら、期限前に opt out して、少人数の pilot から始めるほうが安全です。すでに権限、ログ、問い合わせ先が決まっているなら、全社ではなく role ごとに開く方法もあります。

次に、誰が何をできるかを分けます。OpenAI は、Skills の利用と作成、ファイルのアップロード、共有、workspace への公開、他メンバーへの install を別々の権限として説明しています。特に upload、publish、install は影響が大きいため、最初から全員に許す必要はありません。

## なぜ注意が必要なのか

Skills はプロンプト集より強いものです。営業メール、法務レビュー、採用文面、障害報告、コードレビューなど、仕事の型を入れられます。便利ですが、古い手順や未承認の文面が入っていると、そのまま多くの人に広がる可能性があります。

これは shadow workflow と考えると分かりやすいです。システムではなく、仕事の進め方が管理外で広がる問題です。[ChatGPTロックダウンモード](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) が外部送信リスクを抑える設定だとすれば、Skills 管理は「どの業務手順を AI に渡してよいか」を管理する設定です。

## 管理者の最初の作業

最初に、admin Skills page で既存の Skill を見ます。owner、access、users、直近30日の利用、作成日、更新日を確認し、退職者や異動者が owner のままの Skill、利用者が多いのに業務 owner がいない Skill、長く更新されていない Skill を探します。

次に、upload を絞ります。OpenAI はアップロードされた Skill をスキャンしますが、それだけで会社として安全と判断できるわけではありません。外部から受け取った Skill や、個人がダウンロードした Skill は、会社側の確認も必要です。

最後に、ログを見られるようにします。Skills は Compliance Logs Platform に対応し、会話イベントで Skill の参照を追えるようになります。これは [OpenAI Admin keysとCodex分析履歴](/blog/openai-global-admin-keys-codex-analytics-2026/) と同じく、AI の利用を後から説明するための材料です。

## まとめ

ChatGPT Skills の既定オン予定は、機能追加というより、管理者が期限前に設定を確認すべき変更です。日本企業は、7月23日前に opt out 判断をし、upload、publish、install 権限を分け、既存 Skill の owner と利用状況を確認するべきです。

Skills を正しく管理すれば、部署ごとの仕事の品質をそろえる助けになります。放置すれば、便利な個人手順が会社の標準のように広がります。[ChatGPTメモリ刷新](/blog/openai-chatgpt-dreaming-memory-controls-2026/) と同じく、便利になる機能ほど、何を任せ、何を記録し、誰が責任を持つかを先に決めることが重要です。

## 出典

- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) - OpenAI Help Center
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
- [Using skills](https://openai.com/academy/skills/) - OpenAI Academy
