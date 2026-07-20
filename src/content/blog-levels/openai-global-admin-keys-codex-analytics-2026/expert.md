---
article: 'openai-global-admin-keys-codex-analytics-2026'
level: 'expert'
---

OpenAI の 2026年7月16日 release notes で追加された workspace-scoped Admin keys と Codex analytics history は、ChatGPT Enterprise / Edu の管理境界をかなり現実的な方向へ進める更新である。これは UI の便利機能ではなく、ChatGPT / Codex を enterprise SaaS として扱うための key management、cost reporting、usage governance、compliance automation の部品だ。

既存の OpenAI 管理更新は、すでに複数の面に分かれている。[ChatGPT Usage limits](/blog/openai-chatgpt-usage-limits-enterprise-2026/) は workspace / group / user 単位の月次 credit cap を扱った。[ChatGPT Library管理](/blog/openai-chatgpt-library-admin-controls-2026/) はファイル保持、自動参照、外部アプリ承認を扱った。[ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) は connected apps の読み取り、変更、重要操作の承認線を扱った。今回の Admin keys は、その上に API automation と analytics export の管理面を足す。

重要なのは、OpenAI が Admin keys を model inference 用 key と明確に分けている点である。Global Admin Console の Credentials section は、supported administration APIs のための central place として説明され、ChatGPT / Codex workspaces では compliance log access、analytics and cost reporting、service accounts、Spend Controls API による usage-limit automation、workspace group management を支える。Admin keys do not grant access to models or model inference という線引きは、企業の threat model ではかなり大きい。

## Fact: Admin keyは管理プレーンのcredential

Admin key は、data plane ではなく management plane の credential と捉えるべきだ。OpenAI API の inference key は、アプリケーションが model に入力を送り、出力を受け取るための鍵である。一方、Global Admin Console の Admin key は、workspace の運用状態を読み、場合によっては利用上限や group などの管理対象へ作用する鍵である。

リスクの性質は違う。Inference key の漏えいでは、攻撃者がモデル利用を発生させたり、アプリケーション設計次第でユーザー入力や出力にアクセスしたりする可能性が問題になる。Admin key の漏えいでは、credit reporting、analytics、group membership、service account、compliance log、Spend Controls automation などの管理面が問題になる。どちらも重要だが、検知方法、保管場所、権限分割、rotation の単位は同じでよいとは限らない。

Global Admin Console では、Admin key 作成時に expiration と permissions を設定し、one-time secret を保存する。さらに key の status、last-used date、expiration、creator、permissions を確認し、edit / revoke できる。これは auditability の最低限の材料になる。日本企業の実装では、この情報を monthly control evidence として保存するべきだ。

具体的には、Admin key inventory に key id、creator、purpose、owner group、permission set、target workspace、storage location、rotation cadence、expiration、last-used date、linked automation job、incident contact を持たせる。OpenAI の画面だけを source of truth にするのではなく、社内の secret inventory や SaaS control inventory と同期する。

## Fact: analytics履歴は用途ごとに期間が違う

Global Admin Console の Analytics は、adoption と usage を一箇所で見るための画面として説明されている。credit consumption、ChatGPT analytics、Codex analytics、leaderboards、active users、message activity などが含まれる。履歴期間は、ChatGPT & Codex credit analytics が最大120日、Codex usage analytics も最大120日、ChatGPT usage analytics は過去12カ月である。

この期間差は実務上重要だ。月次レビューなら120日で十分に見えるかもしれない。しかし四半期レビュー、半期監査、年度予算、内部監査では、120日を超える比較が必要になることがある。OpenAI は、これらの期間を超える credit data は billing settings の credit usage report から取得できると説明している。つまり、analytics UI と billing export を分けて保管しなければ、長期比較が欠ける。

Codex analytics は、active users、credits used、tokens used、message runs、lines of code generated、plugin calls、skills used、code review activity などを見る。これは単なる利用ランキングではない。Codex が開発 workflow のどの面に入り込んでいるかを示す telemetry である。plugin calls や skills used は、Codex がどの拡張面を使ったかを示し、code review activity は人間レビューやPR運用との接点を示す。

ただし、analytics は成果そのものではない。Lines of code generated が増えても、品質が上がったとは限らない。Message runs が増えても、業務委譲が成功したとは限らない。Credit consumption が減っても、必要な作業を止めているだけかもしれない。日本企業の月次レポートでは、analytics を PR cycle time、review rework、incident count、test pass rate、manual hours saved、user survey などと接続する必要がある。

## Control design: keyを5種類に分ける

実装時は、Admin keys を最低でも5種類に分けるのがよい。

第一は analytics-read key である。Global Admin Console の analytics export や usage report 取得に使う。目的は可視化であり、変更権限を持たせない。実行元は定期バッチや BI pipeline に限定し、last-used date が schedule と一致するかを見る。

第二は cost-reporting key である。credit reporting、Codex / ChatGPT usage、billing export の取得に使う。FinOps や経理向けの pipeline が触る。開発基盤チームの analytics と経理の billing data は似ているが、アクセスする人と保存期間が違うため、key を分ける。

第三は group-management key である。workspace group management に関わる。IdP / SCIM / HR master と連携する可能性があるため、変更操作の影響が大きい。読み取り inventory と変更 job を同じ key にしない。変更 job には approval record と dry-run mode が必要になる。

第四は spend-controls key である。Spend Controls API や usage-limit automation に関わる。これは特に危険である。上限を下げれば現場が止まり、上限を上げれば費用が増える。したがって、人間の承認、変更前後の snapshot、rollback plan、change ticket を必須にする。

第五は compliance-log key である。compliance log access や監査 export に使う。ログには利用者、アプリ、ファイル、操作に関する機微な情報が含まれ得る。閲覧者を最小化し、保存先の暗号化、保持期間、法務・セキュリティのアクセス手順を定義する。

この分割は少し面倒だが、あとから効く。監査で「どの key が何をできるか」を聞かれたとき、全権 key 1本では説明が弱い。key purpose と permission set が対応していれば、リスク評価、失効、rotation、incident response がかなり楽になる。

## Control design: Usage limitsとの二重管理を避ける

今回の release notes は、Global Admin Console に Admin keys と analytics history が入った一方で、Usage limits tab は引き続き ChatGPT 側に残ると説明している。これは、管理画面がまだ完全に一枚岩ではないことを意味する。

運用設計では、どこで何を見るかを明確にする必要がある。Global Admin Console は tenant / workspace / org の俯瞰、SSO、domains、external access、credentials、analytics、billing overview の入口である。ChatGPT Workspace settings は Usage limits、workspace permissions、app controls、plugins、Skills、Projects などの細かな operational control の入口である。API automation は、そのどちらかの画面の代替ではなく、決められた管理操作を再現性高く実行する手段である。

たとえば、月次 credit cap の変更を考えるとする。Global Admin Console の analytics で Codex credit consumption が増えていることを確認する。Workspace settings の Usage limits で対象 group の cap と override を確認する。Spend Controls automation key で変更する場合は、change ticket と承認を確認し、変更前 snapshot を保存する。変更後、次回 analytics refresh で影響を見る。この一連の流れを runbook 化する。

この runbook がないと、管理者は「Global Admin Console に見えている数字」と「Workspace settings にある上限」と「API job が実際に変更した設定」を結び付けられない。特に日本企業では、情シス、開発基盤、経理、セキュリティが別部署になりやすい。画面やAPIの所有者が違うなら、責任分担を先に書くべきである。

## Observability: Codex telemetryを成果指標へ変換する

Codex analytics の新しい価値は、開発 agent の利用面をより具体的に見られることだ。Credits used、tokens used、message runs、lines of code generated、plugin calls、skills used、code review activity は、それぞれ違う問いに答える。

Credits used は費用の入口である。Tokens used は作業の重さを示す。Message runs は agent セッションの回数に近い。Lines of code generated は出力量の一部であり、成果ではなく活動量である。Plugin calls は connected tooling の利用を示す。Skills used は組織が作った作業手順が使われているかを示す。Code review activity は、Codex が PR / review loop に入っているかを示す。

日本企業では、これを三つの dashboard に分けるとよい。開発基盤 dashboard では message runs、skills used、plugin calls、code review activity を見る。FinOps dashboard では credits used、metered item、model、user / agent leaderboard を見る。セキュリティ dashboard では compliance logs、connected apps、high-risk plugin calls、admin key usage を見る。

ここで [Codex支出管理](/blog/openai-codex-business-spend-controls-2026/) のような credits / spend controls の運用と合わせる。Codex の消費が増えているが PR cycle が短くなり、review rework が減っているなら投資として説明しやすい。消費だけ増えて code review activity や merge rate に変化がないなら、プロンプトや task design、Skills の再設計が必要かもしれない。

## Failure modes: 何が壊れやすいか

第一の failure mode は、Admin key sprawl である。検証のたびに key を作り、期限や所有者を曖昧にして残す。対策は、発行前 ticket、purpose、expiration、owner、secret storage、post-test revocation を必須にすることだ。

第二は、read key と write key の混同である。Analytics export だけのつもりで変更権限を持つ key を BI pipeline に入れる。対策は、permission set の命名と automated policy check である。Key purpose に対して不要な permission があれば発行しない。

第三は、analytics retention の誤解である。Global Admin Console に120日分見えるから十分だと思い、年度監査に必要な過去データを保存しない。対策は、月次 export と長期保管である。Credit usage report や billing export を、監査要件に合わせて保存する。

第四は、Usage limits の設定場所の混乱である。Global Admin Console で analytics を見て、同じ画面で上限を変えられると誤解する。対策は、Global Admin Console、Workspace settings、API automation の責任表を作ることだ。

第五は、Codex analytics の過信である。Lines of code generated や tokens used を成果指標として扱う。対策は、PR outcome、review quality、incident impact、test result、manual effort saved と合わせて見ることだ。

## 30日導入プラン

最初の7日で、Global Admin Console の role と access を棚卸しする。Global admins、workspace admins / owners、analytics viewers、members の違いを確認し、誰が Credentials、Analytics、Billing、Agents を見られるかを一覧化する。あわせて、既存の Usage limits と Spend Controls の担当者を確認する。

8日目から14日目で、read-only に近い analytics / cost reporting key を1本ずつ発行し、expiration、owner、secret storage、last-used monitoring を設定する。まだ group management や Spend Controls automation は触らない。まず monthly report の自動取得だけを試す。

15日目から21日目で、Codex analytics を dashboard 化する。Credits used、tokens used、message runs、skills used、plugin calls、code review activity を部署、workspace、主要 role で見る。ただし、個人評価に直結させず、利用傾向と enablement 対象の把握に使う。

22日目から30日目で、変更系 key の設計に入る。Group management と Spend Controls automation は、dry-run、approval、change ticket、rollback、post-change verification を定義してから発行する。実装前にセキュリティと経理、開発基盤の合意を取る。

この順番なら、便利な automation を急ぎすぎず、まず観測と証跡を固められる。ChatGPT / Codex の enterprise adoption では、いきなり全社自動化するより、管理者が説明できる単位で小さく回すほうが長続きする。

## まとめ

OpenAI の Admin keys と Codex analytics history 更新は、ChatGPT / Codex を企業の管理プレーンへ引き寄せるものだ。workspace-scoped Admin keys により、管理APIの自動化が現実的になり、最大120日分の Codex / credit analytics により、開発 agent 利用の費用と活動を追いやすくなる。

しかし、管理しやすくなるほど、key hygiene と責任分担は重くなる。日本企業では、推論 key と Admin key を分け、analytics-read、cost-reporting、group-management、spend-controls、compliance-log の用途別に key を分けるべきだ。さらに、Global Admin Console、Workspace settings、API automation のどれが何の source of truth かを明文化する必要がある。

今回の更新は、ChatGPT / Codex を「便利なAIツール」から「管理対象の業務基盤」へ移すための部品である。導入済みの企業ほど、まずは Admin key inventory、Codex analytics export、Usage limits との突き合わせ、月次レビューの runbook を作る価値がある。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-07-16
- [Global Admin Console](https://help.openai.com/en/articles/12289294-global-admin-console) - OpenAI Help Center
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
