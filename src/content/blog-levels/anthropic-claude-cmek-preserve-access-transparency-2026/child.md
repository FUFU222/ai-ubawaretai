---
article: 'anthropic-claude-cmek-preserve-access-transparency-2026'
level: 'child'
---

Anthropic は 2026年7月10日、Claude Platform の Access Transparency と CMEK に関する説明を更新しました。少し難しい言葉が並びますが、要点は「Claude に入れたデータを、誰が見たのか、なぜ残されたのか、どの鍵で守るのかを、企業が説明しやすくする更新」です。

ここで出てくる言葉は2つあります。Access Transparency は、Anthropic の担当者が対象データを人間として見た場合、その記録を残す仕組みです。CMEK は Customer-managed encryption key の略で、企業が AWS KMS、Google Cloud KMS、Azure Key Vault などで用意した鍵を使って、Claude の一部データを保存時に暗号化する仕組みです。ただし、どちらも全部を自動で安全にする魔法ではありません。対象になる製品、対象にならない製品、ログが出る場所、鍵を止めた時の影響を分けて理解する必要があります。

## 何が変わったのか

今回の更新では、`cmek_preserve` というイベントの説明が詳しくなりました。これは、CMEK で守られた内容が、調査や安全対応のために保全されたことを示す記録です。Anthropic の release notes では、`cmek_preserve` event の filter 例、event payload 例、保全理由のコードが追加されたと説明されています。保全理由には、ポリシー違反調査や CSAE 報告に関わるものがあります。

また、人間の reviewer が保全を始めた場合だけでなく、自動の safety pipeline が始めた場合にも event が書かれることが明確になりました。ここが大事です。人が内容を見た記録と、内容が保全された記録は同じではありません。Access Transparency では、Anthropic の人間が対象データを見た時に `anthropic_access` という記録が残ります。一方、`cmek_preserve` は、見たかどうかではなく、調査や安全対応のために保全されたことを示します。

## Access Transparencyの対象は限られる

Access Transparency は、Claude Messages API や Claude Code sessions など、決められた対象に対する仕組みです。Claude の名前が付いていれば何でも対象になるわけではありません。たとえば、claude.ai の Enterprise seat、Claude for Work、Cowork、Claude in Chrome、Claude Free / Pro / Max、Amazon Bedrock や Google Cloud 経由の Claude、Files API や Batch API などは対象外として説明されています。

これは日本企業では重要です。社内で Claude Code を使う部署、API を使う開発チーム、Bedrock 経由で使うシステム、業務アプリとして Claude を使う部門が混ざることがあります。その場合、「Claude のログは取れる」とまとめて言うと危険です。どの入口のログが取れるのかを表にしておく必要があります。以前の [Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) では、Claude の利用状況を SIEM や DLP へ流す話を扱いました。今回の更新は、その中でも Anthropic 側の人間アクセスや、CMEK で守られた内容の保全をより細かく見る話です。

## CMEKは鍵の運用まで含めて考える

CMEK を使うと、企業は自分たちの cloud key management service で鍵を管理できます。鍵の rotation、audit、revocation を自社側で扱えるので、規制産業や内部監査では説明しやすくなります。しかし、注意点もあります。CMEK は有効化後に書かれたデータを守る仕組みで、過去の chats、files、sessions が自動で再暗号化されるわけではありません。また、現在は US regions が前提で、multi-region keys や EU key residency はまだサポートされていないと説明されています。

そのため、日本企業が「CMEK を入れたので全データが国内要件を満たす」と説明するのは危険です。鍵を誰が持つか、データがどの地域で扱われるか、過去データはどう扱うかを分けて確認する必要があります。

## まず決めること

最初に、Claude の使い方を一覧にします。Messages API、Claude Code、Claude Enterprise、Bedrock、Google Cloud、Files API、Batch API を並べ、Access Transparency と CMEK の対象かどうかを確認します。次に、ログの見方を決めます。`anthropic_access` は人間アクセスの記録、`cmek_preserve` は保全の記録、cloud provider の KMS log は鍵操作の記録です。すべてを同じアラートとして扱うのではなく、担当者と確認手順を分けます。

最後に、鍵を止める手順を決めます。CMEK は強い統制ですが、鍵を誤って止めるとデータを読めなくなる可能性があります。誰が承認し、いつ止め、どのログで確認するかを先に決めておくべきです。

## まとめ

今回の Claude Access Transparency と CMEK の更新は、便利機能というより、企業が Claude Platform を本番利用するための監査部品です。日本企業は、ログが取れるかだけでなく、どの製品が対象か、どの event が何を意味するか、鍵をどう運用するかを確認しましょう。[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) や [Claude Codeの監査ログ設計](/blog/claude-code-otel-agents-mcp-security-2026/) と合わせて読むと、AI の安全運用は「使わせない」ではなく、「使う範囲、ログ、鍵、例外処理を説明できるようにする」ことだと分かります。

## 出典

- [API release notes](https://docs.anthropic.com/en/release-notes/api)
- [Access Transparency](https://docs.anthropic.com/en/manage-claude/access-transparency)
- [Customer-managed encryption keys](https://docs.anthropic.com/en/manage-claude/cmek)
