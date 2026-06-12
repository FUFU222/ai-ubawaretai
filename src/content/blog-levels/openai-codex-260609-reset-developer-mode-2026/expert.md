---
article: 'openai-codex-260609-reset-developer-mode-2026'
level: 'expert'
---

OpenAI の Codex app 26.609 は、単なる機能追加の束ではありません。rate-limit reset banking、referral invitations、Business workspace credits、Developer mode、`/init`、usage-limit error の改善が同じ更新に入ったことで、Codex の運用対象が「モデル選択」から「利用枠、ブラウザ診断、プロジェクト標準、承認境界」へ広がったことが見えます。

このシリーズでは、[Codex利用枠とクレジット](/blog/openai-codex-plan-credits-limits-2026/)、[rate limits障害時の耐障害設計](/blog/openai-codex-rate-limit-incident-resilience-2026/)、[Goal modeとin-app browser注釈](/blog/openai-codex-goal-appshots-browser-2026/) を扱ってきました。今回の更新は、それらを実際のデスクトップアプリ運用に近づけるものです。[Windows Computer UseとProfiles](/blog/openai-codex-windows-profiles-usage-2026/) で見た端末運用や usage statistics の流れとも接続します。

## 事実: reset bankingはrate-limit運用の緩衝材である

OpenAI Help Center の 2026年6月11日リリースノートでは、対象の Plus / Pro ユーザーに rate-limit reset banking が追加され、ローンチ時に無料の reset が付与されると説明されています。さらに、Codex app から referral invitations を送れるようになり、対象者が最初の Codex message を送ると、招待者と受信者の双方に banked reset が付与されます。

OpenAI Developers の pricing ページでは、紹介期間は 2026年6月11日から6月24日まで、対象の Plus / Pro ユーザーは最大3人まで招待でき、banked reset は付与から30日間利用できるとされています。Business referrals は別枠で、shared workspace credit rewards として扱われます。Enterprise では referrals は現在利用できないと説明されています。

ここで設計上大事なのは、reset banking が「予算管理」ではなく「rate-limit制御への緩衝材」である点です。credit pool や token consumption を直接なくすものではありません。個人ユーザーが制限に当たったとき、一定回数だけ作業を戻せる。Business では workspace credit として共有される。Enterprise では別の契約・credit・rate-limit設計を確認する。この粒度で分ける必要があります。

日本企業が誤読しやすいのは、reset を「追加購入の代替」のように扱うことです。実際には、リリース前の大規模修正、長時間の調査、複数人同時利用、cloud task の集中では、reset banking だけでは足りません。優先度の低い作業を止める、タスクを小さくする、使用モデルや実行面を分ける、Business / Enterprise の credit policy を整えるほうが本筋です。

## 事実: Developer modeはCDP accessを明示的な承認対象にする

Developer mode は、Browser use in Chrome と Codex in-app browser の両方で使える機能です。OpenAI Developers の in-app browser ドキュメントは、Developer mode が Codex に controlled Chrome DevTools Protocol access を与え、JavaScript profiling、console output、network traffic、DOM、applied styles、runtime errors を調べられると説明しています。

これは、フロントエンドQAの質を上げる更新です。画面の見た目だけでは、問題の原因が分からないことがあります。例外が出ているのか、APIが遅いのか、CORSや認証で失敗しているのか、DOM上の状態と見た目がずれているのか、CSS cascade が意図と違うのか。CDP に触れると、Codex は観察できる情報が増えます。

一方で、CDP access は高リスクな情報面でもあります。network payload、cookie、localStorage、認証済みセッション、DOM内の個人情報、非公開APIのレスポンス、社内管理画面の構造など、画面上に見えていない情報へ近づく可能性があります。OpenAI は full CDP access について、サイト、タスク、要求される access を確認してから承認するよう促しています。

ここは企業統制の論点です。Developer mode を「便利だから全員オン」にはしないほうがよい。対象をローカル開発、検証環境、デモ環境、本番環境、社内SaaS、顧客データありの管理画面に分け、どこまで許可するかを決める必要があります。組織が無効化している場合はローカルで有効化できないという設計も、管理者が明示的に方針を持つべき領域であることを示しています。

## 事実: `/init`はAGENTS.md標準化の入口になる

Codex app 26.609 では、composer に `/init` コマンドが追加されました。これは Codex CLI と同じ initialization workflow で project instructions scaffold を作る機能です。リポジトリに AGENTS.md を置き、Codex にテスト、build、レビュー観点、禁止操作、作業スタイルを伝える入口になります。

AGENTS.md は、AIコーディングエージェントにとって実行前の契約書に近い役割を持ちます。人間の開発者が暗黙に知っている「このディレクトリは生成物」「このテストは遅い」「このコマンドは本番DBに触る」「この変更は必ずアクセシビリティ確認が必要」といった知識を、Codex が読む形にできます。

ただし、AGENTS.md は万能ではありません。古い手順を書けば古い手順に従います。禁止操作を書いても、権限や承認フローが別に存在しなければ防御になりません。機密情報や秘密鍵、内部URL、顧客名を直接書くのも避けるべきです。`/init` は標準化の開始点であって、統制そのものではありません。

この観点では、[OpenAI CodexのOracle Cloud調達](/blog/openai-codex-oracle-cloud-commitment-2026/) のような購買経路の記事と、今回の `/init` は別レイヤーでつながります。契約や請求を整えても、リポジトリごとの作業ルールがAIに伝わらなければ、現場の品質は安定しません。逆に、AGENTS.md だけ整えても、契約・データ・creditの統制がなければ、企業導入としては弱い。

## 分析: 利用枠の設計は「個人救済」と「組織運用」に分ける

ここからは分析です。

今回の reset banking は、個人ユーザーにはわかりやすい価値があります。制限に当たった後、追加の reset を使って作業を続けられる。紹介によって reset を得られる。短期的には、個人開発者や小規模チームの体験を改善します。

しかし、組織利用では別の見方が必要です。開発チームが業務としてCodexを使う場合、重要なのは「誰かがresetを持っているか」ではありません。どのプロジェクトがどのcredit poolを使うか、誰がoverageを承認するか、制限に当たったときにどの作業を優先するか、個人アカウントで業務コードを扱わせないかです。

たとえば、リリース当日にUI不具合が出て、Developer mode を使って複数人が検証環境を調べるとします。ここで個人の reset に依存していると、誰が作業を続けられるかが偶然に左右されます。Business / Enterprise workspace で作業を統一し、critical workflow には予算と権限を明示するほうが再現性があります。

このため、社内ガイドでは次のように分けるべきです。個人Plus / Proのreset bankingは個人検証向け。Business referral creditはworkspace運用向け。Enterprise利用は契約とcredit pool、data controls、admin policyを確認。業務コードは管理 workspace で扱う。これだけでも、混乱はかなり減ります。

## 分析: Developer modeはQAだけでなくセキュリティレビュー対象である

Developer mode は、フロントエンドQAを効率化します。特に日本の開発現場では、画面崩れ、ブラウザ互換、フォーム送信、社内認証、モバイル表示、管理画面の権限差など、手作業の確認が多い領域に効きます。

しかし、Developer mode はセキュリティレビュー対象でもあります。CDP を使えるということは、AIがページの内部状態や通信を観察できるということです。これは便利なデバッグ権限であると同時に、情報の読み取り権限でもあります。社内のセキュリティ設計では、DevToolsを誰でも自由に開ける前提の環境もあれば、顧客情報や金融データを扱う画面でブラウザ内部情報の持ち出しを厳しく見る環境もあります。

実務的には、Developer mode の利用対象を分類します。ローカルホスト、モックデータ、検証環境、匿名化データは原則許可しやすい。本番環境、実顧客データ、決済、医療、金融、人事、未公開業績情報、社内SSO管理画面は、個別承認にする。API payload を記事やチケットに貼らない。Codex の出力に秘密情報が混ざっていないかを確認する。

また、Developer mode を使う指示は具体化したほうがよい。「この画面を調べて」ではなく、「ローカルの `/settings` 画面で console error と layout shift だけ確認し、network response body は要約しない」「検証環境のフォーム送信でステータスコードとエラー分類だけ見る」のように、観察範囲を絞るべきです。

## 分析: Browser useの高速化は作業分解を変える

Codex changelog では、Browser use が CDP と DOM snapshot optimizations により最大2倍速くなったとも説明されています。速度改善は地味ですが、AIエージェント運用では重要です。ブラウザ操作が遅いと、開発者は一度に大きな指示を投げがちになります。速くなると、小さく調べ、小さく直し、小さく検証するサイクルに寄せやすくなります。

これは品質にも効きます。大きなUI修正を一括で任せるより、まず console error を見せる、次に network を確認する、次に DOM と CSS を見る、最後にスクリーンショットで確認するほうが、AIの誤判断を減らせます。Developer mode と速度改善は、セットで「ブラウザQAを段階化する」方向に使うべきです。

ただし、速くなったからといって、権限確認を省いてはいけません。むしろ、短い調査を何度も回せるようになるほど、どのサイトにどの access を渡したかが散らばりやすい。Codex の出力や作業記録を、レビューできる単位に保つ必要があります。

## 日本企業向けの導入チェックリスト

第一に、アカウント境界を定義します。業務コード、顧客ログ、本番障害、社内設計文書を扱う Codex 利用は、会社管理の workspace に限定する。個人の Plus / Pro と reset banking は、業務利用の正式経路として扱わない。

第二に、credit と reset の運用表を作ります。Plus / Pro reset、Business shared workspace credits、Enterprise credit pool、overage、追加購入、利用停止時の連絡先を1枚で整理します。開発者が「制限に当たった」と言ったとき、rate limit、credit不足、契約制限、サービス障害を切り分けられるようにします。

第三に、Developer mode の環境別ルールを決めます。ローカル、検証、本番、顧客データあり、社内SaaS、外部SaaSを分け、許可、要承認、禁止を定義します。承認時には、対象サイト、目的、見てよい情報、出力に含めてよい情報を確認します。

第四に、AGENTS.md を標準化します。`/init` で作ったひな形を、各リポジトリの実態に合わせます。テストコマンド、lint、build、レビュー観点、禁止操作、依存関係更新方針、セキュリティ上の注意を明記します。古くなったら逆効果なので、定期的に見直します。

第五に、ブラウザQAの作業単位を小さくします。Developer mode を使うときは、performance、console、network、DOM、styles のどれを見るのかを分ける。AIに画面全体を漫然と渡すより、仮説を立てて調査させるほうが、情報漏えいと誤修正を抑えられます。

第六に、出力レビューを残します。Codex が Developer mode で得た情報をもとに修正した場合、どの根拠で直したか、どの環境で確認したか、どの情報を見たかをPRやチケットに短く残します。AIが見た情報を完全に再現する必要はありませんが、判断の筋道は人間が追えるようにするべきです。

## 結論

Codex app 26.609 は、個人には利用枠を戻しやすくし、開発者にはブラウザ診断を深くし、チームにはプロジェクト指示を整えやすくする更新です。しかし企業導入の観点では、便利さよりも境界設計が重要です。

reset banking は個人の救済策、Business credits は workspace の運用材料、Developer mode は強いブラウザ診断権限、`/init` はリポジトリ標準化の入口です。日本の開発組織は、この4つを同じ「Codexの新機能」としてまとめず、契約、利用枠、データ、承認、レビューの設計に分解して扱うべきです。

## 出典

- [ChatGPT Release Notes - June 11, 2026 Codex updates](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Codex changelog - Codex app 26.609](https://developers.openai.com/codex/changelog) - OpenAI Developers
- [Codex pricing - Invite friends and coworkers](https://developers.openai.com/codex/pricing) - OpenAI Developers
- [In-app browser - Developer mode](https://developers.openai.com/codex/app/browser) - OpenAI Developers
