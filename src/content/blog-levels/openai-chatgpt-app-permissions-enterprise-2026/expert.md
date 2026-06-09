---
article: 'openai-chatgpt-app-permissions-enterprise-2026'
level: 'expert'
---

OpenAI の 2026年6月8日付 ChatGPT Enterprise / Edu release notes にある **App permissions for connected apps** は、ChatGPT の enterprise control surface に「承認タイミング」の層を足す更新である。接続アプリを有効にするかどうか、どの role に使わせるか、どの action を許すかだけではなく、許された action を ChatGPT が実行する前に、どの条件で人間へ確認を出すかを workspace default と app-specific setting で扱えるようになる。

この更新は、モデル性能のニュースではない。しかし、企業導入ではかなり重い。ChatGPT が社内 SaaS、Google Drive、Microsoft 365、Slack、CRM、チケット管理、MCP アプリとつながるほど、AI のリスクは「間違った回答」から「間違った操作」へ移る。読み取りだけなら検索と要約の問題で済むことが多い。書き込み、送信、削除、共有権限変更、予定変更、購入、返金、credential 作成のような action が入ると、承認、ログ、責任分界が必要になる。

この流れは [ChatGPTロックダウン全開放](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) と連続している。Lockdown Mode は、外部接続や network-enabled capabilities を絞り、prompt injection による data exfiltration risk を下げる設定だった。App permissions は、その反対側にある。接続アプリを使う前提で、どの操作を自動化し、どの操作で確認を挟むかを設計するための設定である。[OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) が業務手順の配布と監査を扱ったのに対し、今回は業務アプリに対する操作承認を扱う。さらに [ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) のようなアカウント棚卸しと組み合わせて、誰が接続アプリを使い、どの端末やセッションから操作したのかを説明できる状態に近づける必要がある。

## 事実: Release notes が示した変更点

OpenAI は、Workspace admins が App permissions を使い、ChatGPT が connected apps を使う前に members へ確認を求める条件を設定できると説明している。管理者は workspace-wide default を設定でき、individual apps には別の permission を設定できる。選択肢として、Always ask、Any changes、Important actions が示されている。

release notes では Important actions が default とされている。これは、ChatGPT が apps から read することは automatically allowed としながら、ChatGPT の外側へ meaningful effect を与える、sensitive information を expose しうる、undo が難しい action では確認を求める設計である。さらに、App permissions は previous Action consent setting を置き換える場所がある一方で、app access、RBAC、Action control とは separate admin controls だと明記されている。

Apps in ChatGPT の Help Center 記事は、App permissions の意味をより正確に補足している。App permissions は connected apps を使う前に ChatGPT が確認を求める条件であり、アプリの接続、付与済み access の拡張、アプリ自体の permissions を変更するものではない。これにより、管理者が「permission」という語を誤解する危険が減る。App permissions は OAuth scope や app availability ではなく、実行時承認の設定である。

また、Important actions の例も具体的に示されている。メール、メッセージ、コメント、投稿、招待、予定などの送信や編集。コンテンツ削除、予定キャンセル、予約削除。購入、返金、金融取引や subscription 管理。ファイルアップロード、移動、rename。sharing permissions、account access、security settings、access credentials の変更。sensitive personal、financial、health、identity、authentication information の共有。これらは日本企業のリスク分類にそのまま使える。

## 3つの管理線を分ける

企業導入で最も重要なのは、RBAC、Action control、App permissions を混ぜないことだ。

RBAC は「誰が使えるか」を決める。OpenAI の Admin Controls, Security, and Compliance in apps 記事では、Enterprise / Edu workspaces が apps を custom roles に割り当てられると説明されている。ユーザーが app listing で Disabled by admin を見る場合、その app は workspace または role settings により利用できない。つまり、RBAC は利用者の境界である。

Action control は「アプリが何をできるか」を決める。管理者は、all actions、read actions only、custom set を選べる。Custom の場合、新しい action が後から追加されたときに、Enable all new actions、Only enable new read actions、Disable new actions のような扱いも選べる。さらに non-sync apps では parameter constraints を使い、文字列、数値、boolean、array、object fields などに制約を入れられる。つまり、Action control は capability と parameter の境界である。

App permissions は「いつ確認するか」を決める。許可された app と action の範囲内で、ChatGPT が操作しようとしたときに、人間承認が必要かを決める。OpenAI の説明では、workspace default の App permissions は Permissions & roles > Connected data から設定し、個別 app では Apps admin page の App permissions から Use workspace default または別設定を選べる。

この3層を分けると、設計が具体化する。たとえば、法務部門だけに契約管理アプリを RBAC で許可する。Action control では read と private draft 作成だけを許可し、外部送信や共有変更は無効化する。App permissions では Any changes を選び、保存や編集にも承認を挟む。営業部門の CRM では、read と activity draft は許すが、顧客への送信や商談ステータス変更は Important actions で確認する。開発チームのチケット管理では、issue read と comment draft は許し、priority change や close は確認対象にする。

## Important actions はリスクベースの初期値として読む

Important actions は便利な default だが、万能ではない。OpenAI は、action、共有される information、action context を見て評価すると説明している。つまり、単なる action name だけで機械的に決まるわけではない。保存する private draft は低リスクかもしれないが、同じ文章を他人へ送信するなら高リスクになる。shopping cart の更新は低リスクでも purchase completion は高リスクになる。normal preference change は低リスクでも security setting change は高リスクになる。

この動的評価はユーザー体験にはよいが、監査や規程作成では注意がいる。日本企業の管理者は、OpenAI の Important actions を社内規程の唯一の分類にしないほうがよい。自社として、どの app、どの action、どの data category、どの部署では Any changes へ上げるかを別に決める必要がある。

たとえば、個人情報を含む人事データを扱う部署では、read automatically すら慎重に扱うべきケースがある。金融商品、医療相談、公共手続き、顧客別価格、未公開決算、買収検討、脆弱性対応では、読み取り結果の出力や外部 app への共有が問題になる。Important actions は「OpenAIが標準的に重要と見る操作」を止めるための初期値であり、自社のデータ分類と法務要件を置き換えない。

一方で、すべてを Always ask にすると現場は使わなくなる。接続アプリの価値は、社内文脈を自然に取り込めることにある。検索や要約まで毎回承認を求めると、ユーザーは承認疲れを起こす。結果として、別の未管理ツールにコピペする、個人アカウントへ逃げる、スクリーンショットで渡すといった shadow workflow が増える。したがって、default は Important actions、特定 app と特定 role で Any changes、例外的な低リスク内製 app だけ緩める、という設計が現実的である。

## Google Drive 統合は最初の監査対象になる

OpenAI の Admin Controls 記事は、Google Drive に関する粒度の高い注意点を含んでいる。Google Docs、Sheets、Slides actions は Google Drive actions として統合される。Standalone の Google Docs、Sheets、Slides apps は ChatGPT app directory では利用されなくなり、ユーザーは Docs、Sheets、Slides access のために Google Drive app へ接続する。Enterprise / Edu では、この unified Google Drive actions は workspace admin が有効化するまで default off である。Business では default on と説明されている。

これは日本企業にとって大きい。Google Drive は、社内資料、顧客資料、契約書、営業提案、会議メモ、採用資料、経営資料が混在しやすい。ChatGPT が Drive を read するだけでも、検索結果や要約に機密が出る。Docs や Sheets の action まで有効にすると、生成した文書や表を保存し、更新し、移動し、場合によっては共有設定に影響する可能性がある。

Google Workspace 管理者の scope authorization も関係する。OpenAI は、Enterprise / Edu で新しい unified Google Drive actions を有効化した後、Google Workspace admins が updated Google Drive scopes を re-authorize する必要がある場合があると説明している。つまり、ChatGPT workspace admin と Google Workspace admin が別組織の場合、片方だけで完結しない。

導入時は、Drive app を以下の4観点で棚卸ししたほうがよい。第一に sync 対象。specific Shared Drives または folders に制限できるか。第二に file type exclusion。PDF、Docs、Sheets、Slides、画像、CSV、動画、契約書など、どこまで indexing するか。第三に setup model。Quick setup で個人認証にするか、Admin-controlled access で中央管理にするか。第四に App permissions。read は自動でよいか、Docs/Sheets の作成や更新は Any changes にするか、共有変更はそもそも Action control で無効化するか。

## 承認カードは統制ではなく教育対象でもある

OpenAI は、action 実行前に approval card を表示し、app と proposed action の情報を確認できると説明している。Deny、Allow / Allow once、Always allow などのボタンが出る場合がある。ただし、managed workspaces では persistent permissions は workspace administrators が管理するため、members が Always allow を見ないこともある。

これは良い設計だが、承認カードの存在だけでは統制にならない。利用者が内容を読まずに Allow を押せば、承認フローは監査上の形式だけになる。特に日本企業では、稟議や承認ボタンが多い業務環境のため、ユーザーが「また確認か」と流す危険がある。

社内教育では、approval card を見たときに確認すべき項目を決めるべきだ。どの app か。どの account または workspace か。何を読もうとしているか。何を作成、更新、削除、送信しようとしているか。相手先は社内か社外か。共有先やファイル名に顧客名、個人名、未公開情報が含まれるか。操作は取り消せるか。これを読まずに許可してはいけない。

また、拒否しても業務が進む代替手順を用意する。承認カードで不安を感じたら、手動で下書きをコピーする、管理者へ確認する、別スレッドで機密情報を外す、[ChatGPTロックダウン全開放](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) で扱った Lockdown Mode を使う、といった逃げ道が必要である。承認で止まった作業がすべて現場負担になると、ユーザーは次回から回避策を探す。

## Compliance Logs を使った検証設計

Apps in ChatGPT の説明では、User conversations, including conversations using any app, are already available in the Compliance API とされ、all app calls are logged as part of the OpenAI Compliance Logs platform と説明されている。これは、App permissions の設定と運用が後から検証可能であるべきことを示している。

ただし、ログを取れば十分ではない。日本企業が見たいのは、単に「アプリが使われた」ではなく、「どの role の誰が、どの app で、どの action を試み、承認が出たのか、拒否されたのか、Action control でブロックされたのか」である。さらに、承認が必要な action が多すぎる場合は UX の問題、承認なし action が多すぎる場合はリスクの問題として見直す必要がある。

ログ監査では、以下の条件を月次で見るとよい。新規 app が有効化された。new actions が追加された。Action control が read-only から all actions へ変更された。Never ask が設定された app がある。特定ユーザーが多くの important action を承認している。外部送信や共有変更に近い action が高頻度で発生している。Google Drive や Outlook の scope re-authorization 後に user connection error が増えている。

この考え方は、[OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) の監査と同じだ。Skills では `skill_id` を会話イベントと突合する必要があった。Apps では app call、action、permission、approval の文脈を突合する必要がある。どちらも、ChatGPT の便利機能を業務標準に入れるなら、利用状況と設定変更を後から説明できなければならない。

## MCP と custom apps は別格で扱う

OpenAI は、Apps in ChatGPT で custom app、formerly custom connectors、MCP-backed tools、Apps SDK に触れている。Admin Controls 記事でも、developer mode によって custom apps using MCP を作成、テストできる role access を説明している。ここは一般 SaaS app より慎重に扱うべきだ。

既製 SaaS app は、OpenAI と app provider の間である程度の capability や UI が整っている。一方、MCP custom app は自社や vendor が実装する tool surface である。Action naming、parameter schema、side effect、idempotency、auditability、error handling、permission mapping の品質がそのまま安全性になる。App permissions はその上に承認レイヤーを置けるが、tool 自体の設計が粗ければ意味が薄い。

たとえば、`update_customer` という action があり、実際には顧客情報、契約条件、請求先、担当者メモまで変えられるなら、App permissions は正しい重要度を判断しにくい。`send_message` が社内 Slack と社外メールの両方を扱うなら、承認カードだけではリスク分類が曖昧になる。MCP app では、tool を細かく分け、parameter constraints を使い、read-only tools と write tools を分離し、重要操作は Action control と App permissions の両方で止めるべきだ。

custom apps の publish process も監査対象にする。誰が developer mode を使えるか。誰が draft app を publish できるか。MCP server URL はどこか。OAuth credentials は誰が管理するか。action schema の変更時に誰が review するか。新しい action が追加されたときに Disable new actions を既定にするか。これらは、AIアプリ開発というより内部統制の問題である。

## 日本企業向けの推奨設定モデル

現実的な導入モデルは、4段階で考えるとよい。

第一段階は inventory である。現在 ChatGPT workspace で enabled になっている apps、Drafts、custom apps、Google Drive sync、Microsoft apps、Slack、CRM、チケット管理を棚卸しする。各 app について、read capabilities、write actions、sync、deep research、custom MCP の有無を記録する。

第二段階は least capability である。不要な app は disabled、不要な actions は Action control で disabled、new actions は Only enable new read actions または Disable new actions にする。parameter constraints が使える non-sync apps では、許可する対象ドメイン、プロジェクトID、共有先、金額、ステータス値などを制限する。

第三段階は permission policy である。workspace default は Important actions。Google Drive、Outlook、CRM、ticketing、custom MCP apps は app-specific に Any changes を検討する。Never ask は原則禁止にし、必要な場合は低リスク内製 app、read-like action、限定 role、短期 pilot に限る。

第四段階は verification である。Compliance Logs を SIEM または監査用ストレージに取り込み、monthly review を行う。承認回数、拒否回数、blocked actions、new app enablement、role access changes、Never ask 設定、Google Drive scope errors、MCP action changes を見る。これにより、設定した承認線が現場で過剰か不足かを確認する。

## まとめ

OpenAI の App permissions 更新は、ChatGPT が企業SaaSへ深く入るために必要な承認レイヤーである。重要なのは、これを単体の安全機能として見ないことだ。RBAC は誰が使えるか、Action control は何をできるか、App permissions はいつ確認するか、Compliance Logs は後から説明できるかを担当する。

日本企業にとって、接続アプリの導入判断は「便利そうだから有効化する」では足りない。Google Drive、Outlook、Slack、SharePoint、CRM、独自MCPアプリごとに、読み取り、変更、送信、共有、削除、権限変更を分け、重要操作で人間承認を挟み、ログで検証する必要がある。ChatGPT を業務SaaSの操作面に入れるほど、承認線の設計がプロダクト利用規程の中心になる。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477) - OpenAI Help Center, 2026-06-08
- [Apps in ChatGPT](https://help.openai.com/en/articles/11487775) - OpenAI Help Center
- [Admin Controls, Security, and Compliance in apps](https://help.openai.com/en/articles/11509118) - OpenAI Help Center
