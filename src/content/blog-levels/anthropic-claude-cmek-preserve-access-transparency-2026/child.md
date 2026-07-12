---
article: 'anthropic-claude-cmek-preserve-access-transparency-2026'
level: 'child'
---

Anthropic は **2026年7月10日**、Claude Platform の release notes で、Access Transparency logging と CMEK content preservation の更新を案内しました。

これは新しい AI モデルの発表ではありません。どちらかというと、会社が Claude Platform を安全に使うための管理機能です。特に、ベンダー側のサポート担当者が顧客コンテンツにアクセスしたときの記録と、顧客管理鍵を使う環境で問題のあるコンテンツをどう保全するかがテーマです。

以前の [Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) では、Claude の活動を DLP や SIEM などに流す話を扱いました。今回の更新はそれより細かく、サポートアクセスと鍵管理に関係します。

## Access Transparencyとは何か

Access Transparency は、Anthropic のサポート担当者が顧客コンテンツにアクセスした場合、そのアクセスを管理者が確認できるようにする仕組みです。

会社で SaaS やクラウドを使うとき、社内の人が何をしたかだけでなく、ベンダー側の担当者がデータに触れたかどうかも問題になることがあります。障害調査や問い合わせ対応のためにサポート担当者がデータを見る場合、その記録を後から説明できるかが重要です。

日本企業では、金融、医療、公共、製造、通信、専門サービスなどで特に重要になります。内部監査や委託先管理では、「誰が、いつ、どの目的で、どのデータに触れたか」を確認されることがあるからです。

ただし、Access Transparency はすべての AI 利用ログを取る機能ではありません。自社アプリが Claude API に送ったプロンプトや応答を全部見るには、アプリ側ログ、DLP、SIEM、Compliance API などを別に設計する必要があります。

## CMEK content preservationとは何か

CMEK は Customer-managed encryption keys の略で、顧客が管理する鍵でコンテンツを暗号化する仕組みです。会社側が鍵を管理できるため、クラウドや AI 基盤のデータ統制を強めたい企業に向いています。

一方で、鍵を顧客が止めると、ベンダー側からもコンテンツを読めなくなる場合があります。これはプライバシーやデータ主権の面では強いですが、ポリシー違反調査や安全上の報告が必要な場面では問題になることがあります。

今回の CMEK content preservation は、CMEK を使う顧客が、フラグされたコンテンツを特定の調査目的で保全できるようにする更新です。Anthropic は、policy violation investigation や child safety report のような用途を挙げています。

つまり、CMEK は「何でもすぐ消せる鍵」ではなく、削除、保全、調査、報告のルールとセットで使うべきものです。

## 日本企業が注意すべきこと

日本企業が見るべきポイントは三つあります。

一つ目は、監査です。Anthropic 側のサポートアクセス、自社管理者の操作、API キー作成、ワークスペース変更、アプリ側の利用ログをどうつなげるかを決める必要があります。

二つ目は、鍵管理です。CMEK の鍵を誰が作り、どこで管理し、いつローテーションし、どの条件で止めるのかを決めます。さらに、content preservation を有効にする場合、どのような調査目的でコンテンツが保全される可能性があるかを確認します。

三つ目は、個人情報対応です。Access Transparency のログや保全対象のデータには、個人情報や機密情報が含まれる可能性があります。ログを誰が見られるか、どこに保存するか、どれくらい残すかを決めなければなりません。

[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) で扱ったように、AI エージェントや AI 基盤は便利になるほど、権限とログの設計が重要になります。今回の更新も同じで、機能をオンにするだけではなく、運用ルールを作ることが大切です。

## まず確認すること

まず、Claude Platform をどこで使っているかを確認します。どのワークスペースで CMEK を使うのか、どのアプリが Claude API を呼んでいるのか、誰が管理者なのかを棚卸しします。

次に、Access Transparency のログを見る担当者を決めます。サポートアクセスがあった場合に、誰が確認し、どの部署へ共有し、どの条件でインシデント扱いにするかを決めます。

さらに、CMEK preservation の方針を決めます。ポリシー違反調査や安全報告が必要な事業なのか、保全対象が発生したときに法務、セキュリティ、個人情報保護担当の誰が判断するのかを決めます。

最後に、SIEM や DLP との接続を考えます。ログを取るだけでは不十分です。検知したあとに、誰が、どの期限で、どの権限で対応するかが必要です。

## まとめ

Claude の Access Transparency と CMEK content preservation は、企業が Claude Platform を本番利用するときの監査と鍵管理に関係する更新です。

Access Transparency は、Anthropic サポート側の顧客コンテンツアクセスを見える化するためのものです。CMEK content preservation は、顧客管理鍵を使いながら、ポリシー違反調査や安全報告に必要なコンテンツを保全するための制御です。

日本企業は、この更新を「ログが増えた」とだけ見るのではなく、AI 利用の監査、鍵管理、個人情報対応、DLP/SIEM 連携を見直すきっかけにするべきです。AI を本番業務で使うなら、便利さと同じくらい、あとから説明できることが重要になります。

## 出典

- [Claude Platform release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs, 2026-07-10
- [Access Transparency](https://docs.anthropic.com/en/manage-claude/access-transparency) - Anthropic Docs
- [Customer-managed encryption keys](https://docs.anthropic.com/en/manage-claude/cmek) - Anthropic Docs

