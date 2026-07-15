---
article: 'anthropic-claude-enterprise-user-management-api-2026'
level: 'child'
---

Claude Enterprise の User Management API beta は、Claude を会社で配るときの「誰が使えるか」を API で管理しやすくする更新です。

Anthropic は 2026年7月14日、Claude Enterprise 組織のメンバー、招待、グループ、カスタムロールを Admin API で扱えるようにしたと発表しました。たとえば、メンバー一覧を見る、メールアドレスでユーザーを探す、招待を送る、招待を取り下げる、ロールを変える、メンバーを外す、といった管理が対象です。

## なぜ重要なのか

会社で Claude を使うとき、便利かどうかだけでは導入できません。退職した人のアカウントが残っていないか、異動した人が前の部署の情報に触れないか、委託先を契約終了日に外せるか、管理者権限を誰が持っているかを確認する必要があります。

これまでは管理画面や手作業で確認していた会社でも、User Management API を使えば、Claude Enterprise のユーザー情報を HR マスターや IdP、委託先台帳と突き合わせやすくなります。AI だけを特別扱いせず、通常の SaaS 管理に近づけるための更新です。

## 何から始めるべきか

最初は自動削除ではなく、読み取りの棚卸しから始めるのが安全です。週次で Claude Enterprise のメンバーと招待を取得し、退職者、異動者、所属不明ユーザー、長期間放置された招待を見つけます。

次に、グループとロールを整理します。部署名、プロジェクト名、権限レベル、費用配賦先がばらばらに混ざると、あとから監査できません。最初に命名規則を決めておくと、利用者が増えても管理しやすくなります。

最後に、削除やロール変更の自動化を検討します。ただし、いきなり完全自動にすると、誤って業務を止める可能性があります。まずは差分レポートを出し、人間が確認してから変更する運用が現実的です。

## 監査ログと一緒に見る

User Management API は「誰が使える状態だったか」を見るための部品です。それだけでは、実際に何をしたかまでは分かりません。利用状況や管理操作は、Compliance API や SIEM 連携と合わせて見る必要があります。

たとえば、退職者が残っていた場合、単にアカウントを消すだけでは足りません。その人がいつまでアクセス権を持ち、実際に利用したのか、どのデータに触れた可能性があるのかを確認する必要があります。

## まとめ

Claude Enterprise User Management API beta は、AI の新機能というより、企業が Claude を安全に配るための管理機能です。

日本企業では、AI 導入が広がるほど ID 管理、退職者棚卸し、委託先管理、内部監査が重要になります。まずは読み取りの棚卸しから始め、Claude Enterprise を通常の SaaS と同じ ID 統制に組み込むのがよいでしょう。

## 出典

- [API release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs, 2026-07-14
- [User management](https://docs.anthropic.com/en/manage-claude/user-management) - Anthropic Docs
- [Create organization invite](https://docs.anthropic.com/en/api/admin-api/invites/create-invite) - Anthropic Docs
