---
article: 'openai-sign-in-chatgpt-plugin-identity-2026'
level: 'expert'
---

OpenAI の 2026年7月29日付 ChatGPT release notes にある **Sign in with ChatGPT beta** は、ChatGPT / Codex の enterprise control を考えるうえで見逃しやすい変更である。発表文だけを読むと、Airtable、GitLab、HubSpot、Notion、Supabase、Vercel などの対応サイトで、ChatGPT アカウントを使ってアカウント作成やリンクができる、というログイン UX の話に見える。

しかし企業運用では、これは identity boundary の変更として扱うべきである。ChatGPT が外部 SaaS の作業入口になり、プラグインやコネクタを介して外部データや action を扱うなら、「ChatGPT に入れる人」と「外部 SaaS で何ができる人」を分けて管理しなければならない。以前の [ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) は、接続アプリ利用時にいつ確認を求めるかを扱った。今回の論点は、そのさらに手前にある external account linking と identity provenance である。

この変化は [ChatGPT Google連携の OAuth scope](/blog/openai-google-app-oauth-scopes-2026/) とも連続している。OAuth scope は「外部サービスでどの権限を許すか」の話だった。Sign in with ChatGPT は「外部サービスへどの identity で入るか」の話である。さらに [ChatGPT Businessプラグイン管理](/blog/openai-chatgpt-business-plugin-admin-controls-2026/) のような plugin distribution と組み合わさると、workspace admin、SaaS admin、IdP admin、security reviewer の境界を再定義する必要が出る。

## 事実: Sign in と plugin authorization は別物である

OpenAI の release notes は、Sign in with ChatGPT について二つの点を明示している。第一に、参加パートナーサイトや plugin directory から、ChatGPT アカウントで外部サービスのアカウントを作成またはリンクできる。第二に、サインイン時にパートナーへ共有される情報は、名前、メールアドレス、プロフィール画像がある場合の画像である。そのうえで、プラグインが受け取るアクセスは別途 review and approve すると説明している。

ここを混同すると設計を誤る。Sign in は authentication / account bootstrap の層であり、plugin authorization は外部 data / action への access grant の層である。外部 SaaS 側の role、scope、team membership、workspace membership はまた別の層である。利用者の画面では連続した flow に見えても、監査では分解して残す必要がある。

OpenAI の Codex authentication ドキュメントも、サインイン方式で適用される管理面が変わると説明している。ChatGPT でサインインした場合、Codex usage は ChatGPT workspace permissions、role-based access control、Enterprise retention / residency settings に従う。一方、API key でサインインすると API organization 側の retention や data-sharing settings に寄る。つまり identity は、利用できる製品面だけでなく、データ取り扱いと管理責任にも関係する。

Sign in with ChatGPT は、外部 SaaS へ向かう identity の入口を ChatGPT 側へ寄せる。これが便利であるほど、managed workspace では「どの ChatGPT identity を外部 SaaS と結びつけてよいか」を明文化する必要がある。特に Business / Enterprise / Edu で、個人 ChatGPT アカウント、会社 workspace、外部 SaaS の会社テナント、個人 SaaS アカウントが混ざると、後から追跡しづらい。

## 事実: plugin controls は五つ以上の層に分かれる

OpenAI の plugin controls ドキュメントは、管理対象をかなり細かく分けている。プラグインの availability / installation、bundled skills、connector access、connector actions and permissions、source-system authorization、runtime permissions は、それぞれ管理場所と意味が違う。

この分割は、Sign in with ChatGPT の導入設計にそのまま効く。たとえば、プラグインを workspace role に Installed として配布しても、そのプラグインが使うコネクタの access が別に必要になる場合がある。コネクタ access を許しても、action control で書き込みや削除を制限できる場合がある。action control を許しても、外部 SaaS 側の authenticated user がその操作権限を持たなければ実行できない。さらに、Codex や ChatGPT desktop の runtime permission によって、実行環境側で承認や sandbox が挟まる。

企業で危険なのは、これらを一つの「許可済み」に潰すことだ。特に、Sign in with ChatGPT が入ると、利用者は外部サービスへ入れた時点で「使える」と感じる。管理者側は、account linking、plugin installation、connector access、action permission、external role、runtime approval を別々に棚卸しする必要がある。

この分割は、内部監査にも効く。事故や問い合わせが起きたとき、「ChatGPT から実行された」だけでは足りない。どの ChatGPT workspace user が、どの plugin を、どの external SaaS identity とリンクし、どの connector action を、どの approval policy の下で実行したのかを追える必要がある。[OpenAI Admin keys と Codex 分析履歴](/blog/openai-global-admin-keys-codex-analytics-2026/) で扱った管理 API や analytics は、この方向の運用基盤になる。

## 分析: IdP と SaaS 管理の責任境界がずれる

ここからは分析である。

日本企業の SaaS 管理は、しばしば IdP 中心で設計されている。Google Workspace、Microsoft Entra ID、Okta などで SSO を強制し、SCIM でアカウントを払い出し、退職や異動で自動停止する。これにより、利用者は複数の SaaS を使っていても、会社は identity lifecycle を一元管理できる。

Sign in with ChatGPT は、この設計を直接壊すものではない。しかし、外部 SaaS への入口が ChatGPT / Codex の作業体験に組み込まれることで、利用者が標準の調達・SSO・管理ルートを通らずにアカウントを作る可能性を上げる。とくに beta 対象の SaaS は、開発、営業、ナレッジ管理、データアプリ、デプロイにまたがる。どれも部門主導で導入されやすく、情シスの把握が遅れやすい領域である。

たとえば GitLab は source code、issue、CI/CD、package registry に触れる。Vercel は deployment、environment variables、domains、analytics に触れる。Supabase は database、auth、storage、edge functions に触れる。HubSpot は顧客情報、商談、メール、マーケティング action に触れる。Notion や Airtable は社内 knowledge、業務台帳、顧客別プロジェクトのような情報を持つ。これらへ ChatGPT から入りやすくなるなら、企業側は data classification と account governance を先に合わせる必要がある。

ここで重要なのは、OpenAI だけを責める話ではないということだ。OpenAI はサインイン時に共有されるプロフィール情報と、プラグインのアクセス承認が別であることを示している。管理者側に必要なのは、その分離を社内ルールへ翻訳することである。サインインを許す範囲、外部 SaaS のテナント条件、プラグイン action の許可、退職者回収、監査証跡をそれぞれ明文化する。

## 実務: 制御点は四つに分ける

第一の制御点は ChatGPT workspace identity である。誰が Business / Enterprise / Edu workspace に属し、どの role と seat を持ち、ChatGPT、Work、Codex、plugins をどこまで使えるかを管理する。Codex の ChatGPT サインインは workspace permissions と RBAC に従うため、ここが粗いとすべてが粗くなる。

第二の制御点は plugin distribution である。どの plugin を Available にするのか、Installed にするのか、どの role へ配るのかを決める。plugin が connector、MCP server、skill、app template を含む場合、その中身も見る必要がある。全員に見えるが任意導入なのか、対象 role に既定導入なのかでは、問い合わせと事故対応の前提が変わる。

第三の制御点は external SaaS identity である。Sign in with ChatGPT によって作られる、またはリンクされる外部サービスのアカウントが、会社テナント配下なのか、個人アカウントなのか、管理者が削除・移管・監査できるのかを確認する。ここは外部 SaaS 側の管理者と、ChatGPT workspace admin が共同で見る必要がある。

第四の制御点は action / approval policy である。ChatGPT や Codex が外部 SaaS で読むだけなのか、作るのか、更新するのか、削除するのか、公開するのか、送信するのか、課金を発生させるのかを分ける。OpenAI の plugin controls でいう connector actions and permissions と runtime permissions、さらに App permissions の確認タイミングを組み合わせる。重要操作は毎回承認、低リスクな読み取りは自動、書き込みは pilot role のみ、というように分けるべきだ。

## 設計パターン: pilot では SaaS ごとに危険度を変える

導入 pilot では、対応パートナーを一括で許可しない方がよい。SaaS ごとに扱うデータと操作が違うからである。

開発基盤系の GitLab、Vercel、Supabase は、リポジトリ、deployment、database、environment variables、production project に近い。ここでの主なリスクは、機密コード、シークレット、誤 deploy、データ変更、権限の広すぎる token である。pilot では sandbox project、個人所有ではない company tenant、限定 role、read-only または低リスク action から始めるべきである。

業務データ系の HubSpot、Notion、Airtable は、顧客情報、営業履歴、社内文書、業務台帳に近い。ここでの主なリスクは、個人情報、顧客情報、契約前情報、権限を超えた共有、AI による誤更新である。pilot では test workspace、匿名化データ、書き込み禁止、共有 action の承認必須から始める方がよい。

どちらの系統でも、Sign in with ChatGPT を使ってよい条件を文書化する。会社メールだけを許すのか、会社テナント配下だけを許すのか、個人アカウントのリンクを禁止するのか、外部 SaaS 側で MFA が必須なのか、退職時にどう回収するのかを決める。利用者に任せるほど、便利な beta は shadow SaaS になりやすい。

## 監査: 記録すべきメタデータ

監査で最低限残したいのは、次の種類のメタデータである。ChatGPT workspace user、workspace role、plugin name、plugin status、external SaaS provider、external account identifier、external tenant、connected scopes or actions、last used timestamp、approval policy、revocation owner である。

このうち external account identifier と external tenant は特に重要だ。ChatGPT 側のユーザーが同じでも、外部 SaaS 側で個人ワークスペースと会社ワークスペースのどちらへ入っているかでリスクは変わる。退職時に ChatGPT workspace から外しただけでは、外部 SaaS の個人アカウントや接続済み token が残る可能性がある。

また、approval policy は audit event とセットで見るべきだ。読み取りが自動だったのか、書き込み時に確認したのか、重要操作だけ確認したのか、管理者が action control で禁止していたのかを説明できる状態にする。ここを残さないと、利用者が「ChatGPT が勝手にやった」と言い、管理者が「許可した覚えはない」と言う不毛な調査になりやすい。

## まとめ

Sign in with ChatGPT beta は、ChatGPT / Codex と外部 SaaS の距離を縮める更新である。利用者体験としては、アカウント作成やリンクの摩擦が下がる。一方、企業運用では、identity、plugin authorization、external SaaS role、connector action、runtime approval を分けて管理する必要がある。

日本企業は、この機能を単純な SSO 代替として扱うべきではない。むしろ、ChatGPT が外部 SaaS の作業入口になる前提で、SSO、MFA、SCIM、SaaS 台帳、プラグイン配布、action control、App permissions、退職者回収を同じ運用設計へ載せるべきだ。最初は対応 SaaS を絞り、sandbox または低リスク workspace で pilot し、外部アカウントと plugin 権限の棚卸しが回ることを確認してから広げるのが現実的である。

## 出典

- [ChatGPT Release Notes - July 29, 2026](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [Plugin controls](https://learn.chatgpt.com/docs/enterprise/apps-and-connectors)
- [Authentication](https://learn.chatgpt.com/docs/auth)
