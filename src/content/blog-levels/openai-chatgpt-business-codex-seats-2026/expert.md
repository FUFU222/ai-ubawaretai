---
article: 'openai-chatgpt-business-codex-seats-2026'
level: 'expert'
---

OpenAI Help CenterのChatGPT Business / Enterprise関連更新は、Codexを企業に入れるときの論点をかなりはっきりさせた。重要なのは、Codexが単なる機能追加ではなく、seat type、workspace credits、token-based rate card、shared credit pool、overage、workspace admin controlsをまたぐ運用対象になったことだ。

このシリーズでは、[Codexの利用枠とrate card](/blog/openai-codex-plan-credits-limits-2026/)、[Codexの企業調達カテゴリ化](/blog/openai-codex-gartner-enterprise-coding-agents-2026/)、[Codex Goalモードと長時間作業](/blog/openai-codex-goal-appshots-browser-2026/)を扱ってきた。今回の主題は、その上に載る企業の座席設計である。AI coding agentの能力が上がるほど、管理側の仕事は「契約する」だけでは終わらなくなる。

## 事実: Enterpriseはseat typeでアクセス範囲を分ける

OpenAIのEnterprise説明では、ChatGPT Enterpriseはstandard ChatGPT seatsとCodex seatsの2種類で構成される。standard ChatGPT seatはChatGPT本体に加え、GPTs、Projects、Apps、Company Knowledge、ChatGPT Agent、Deep Researchなどの機能とCodexを含む。一方、Codex seatはCodex-only accessであり、ChatGPTへのアクセスは含まれない。

この分離は、Enterprise運用ではかなり大きい。多くの企業では、ChatGPTを使う業務ユーザーと、Codexを使う開発者が完全には一致しない。PdMや開発リードは仕様整理、調査、ドキュメント作成、コード作業を横断する。実装担当はCodex中心かもしれない。情シスや管理者は利用状況と権限を見るが、日々の開発タスクは走らせないかもしれない。

OpenAIは、Codex seatのユーザーがEnterprise workspaceでChatGPTにアクセスしようとすると、そのseat typeではChatGPTが使えないと通知されると説明している。つまり、seat typeは単なる請求ラベルではなく、実際のアクセス制御である。さらにseat typeはworkspace ownerやadminが割り当てるもので、ユーザー本人が自分で変更するものではない。

Business向け請求ページでも、standard ChatGPT seatとCodex seatが明確に分かれる。standard seatは月額固定で、Businessでは月額または年額のseat billingがある。Codex seatはusage-basedで固定月額を持たず、minimum seatsも不要だが、activityにはworkspace creditsが必要になる。

## 事実: creditsはseatとは別の制御面になる

Codex seatを作っても、workspace creditsがなければ実際の利用は続かない。Businessの説明では、standard seatだけのworkspaceに初めてCodex seatを追加すると、保存済み決済方法でcredits追加を促される。Codex-only workspaceへ初めてstandard ChatGPT seatを追加する場合は、standard seatの最低数購入が必要になる。

Flexible pricingの説明では、creditsはCodexだけでなく、Deep Research、Thinking models、Image Gen、Advanced Voiceなどのadvanced featuresに使われる。Business usersはadvanced featuresに対してper-seat limitsを持ち、超過した場合にworkspaceがcreditsを持っていればshared poolから継続できる。Enterprise/Eduはcontract levelのshared credit poolを購入し、すべてのusersとseat typesがそこから引き出す。

Enterprise/Eduでshared credit poolが尽きると、Workspace Ownersがoveragesを有効化するか、OpenAI Account team経由でcreditsを追加購入しない限り、advanced featuresはpauseされる。ここは運用上の停止条件として扱うべきだ。とくにCodexをリリース前の修正、障害調査、セキュリティ対応に組み込むなら、credit exhaustionは業務リスクになる。

BusinessではcreditsをSettingsのBillingから購入でき、usage alertsも設定できる。Enterprise/Eduでは契約条件やOrder Form、overage limitsが関係する。これは日本企業の稟議、部門配賦、予算統制と相性がよい一方、導入初期に決めないと後で揉めやすい。

## 事実: token-based rate cardはworkload差を露出させる

Codex rate cardでは、Codex usageはinput tokens、cached input tokens、output tokensごとのcreditsで計算される。GPT-5.5、GPT-5.4、GPT-5.4-Mini、GPT-5.3-Codex、GPT-5.2など、モデルごとにrateが異なる。Fast modeは対応モデルで高いrateになり、code reviewはGPT-5.3-Codexを使うと説明されている。

OpenAIは、2026年4月2日にCodex pricingをper-message型からAPI token usageに合わせたと説明している。その後、既存Enterprise、Edu、Health、Gov、ChatGPT for Teachersにも広げた。一部Enterprise顧客はlegacy rate cardを継続する場合があるため、契約上どのrate cardなのかを確認しなければならない。

この変更は、seat管理だけでは費用を説明できないことを意味する。README修正、単体テスト追加、UI差分修正、古いコードの調査、設計レビュー、巨大PRのcode review、複数repoにまたがる移行作業は、同じCodex seatから実行されても消費が違う。token-basedになると、入力の大きさ、出力の長さ、キャッシュ効率、モデル選択、Fast mode、並列実行がそのまま費用に近づく。

OpenAIは平均的なCodex費用を開発者1人あたり月100から200ドル程度としつつ、モデル、同時インスタンス数、automations、Fast modeで大きな分散があると説明している。平均を予算表に置くだけでは危ない。日本企業で必要なのは、代表ワークロードごとの実測である。

## 分析: seat設計は組織図ではなく作業で切る

ここからは分析である。

Codex seatを配る基準を、単純に「開発部所属かどうか」で決めるのは粗い。開発部でも、実装中心、レビュー中心、アーキテクチャ相談中心、障害対応中心、社内ツール保守中心ではCodex利用の形が違う。逆に、PdMやQA、SRE、セキュリティ担当もCodexの価値を得る可能性がある。

実務上は、少なくとも4分類で見るとよい。第一に、standard ChatGPT seatが必要な横断職種。仕様、調査、ドキュメント、コードをまたぐPdM、EM、テックリードが該当する。第二に、Codex-only seatで始めやすい実装職種。第三に、usageだけを見たい管理者。第四に、API Platform側の権限が必要な開発者である。

最後の分類が重要だ。OpenAIは、ChatGPT Enterprise workspace membershipとAPI Platform organization membershipは別だと説明している。ChatGPT workspaceのseatを持つことはAPI keyやAPI organization権限を持つことではない。CodexをChatGPT workspaceで使う人と、OpenAI APIをプロダクトに組み込む人を同じ権限体系で扱うと、監査と権限申請が混乱する。

[OpenAI GPT-5.5とCodex/APIの整理](/blog/openai-gpt-55-codex-chatgpt-api-2026/)でも、ChatGPT、Codex、APIの利用条件は同じモデル名でも一致しないことを扱った。今回のseat設計も同じである。ChatGPT workspace、Codex利用、API Platform accessは重なるが、同じではない。

## 分析: BusinessとEnterpriseで導入設計は変える

ChatGPT Businessは、小規模チームが早く始めるには向いている。標準seatの月額が見え、Codex seatは固定席料金なしで追加でき、creditsはworkspaceで購入できる。これにより、数人の開発チームがCodexの利用量を試し、標準seatとCodex-only seatの比率を調整しやすい。

一方、Enterpriseではshared credit pool、overage limits、RBAC、契約条件が中心になる。これは重いが、部門別統制には必要である。製造、金融、公共、医療のように、開発対象やデータの機密性が高い組織では、seatの軽さより、誰がどの機能をどの上限で使えるかのほうが重要になる。

日本企業では、BusinessでPoCを始め、そのまま部門展開してしまうケースがあり得る。しかしCodex seatが便利だからといって、個人や小チームの決済で業務コードのAI作業を増やすと、あとで契約、ログ、データ管理、予算配賦が追いつかない。一定規模を超えたらEnterprise契約や管理されたworkspaceへ寄せる基準を先に決めるべきだ。

## 管理者向けチェックリスト

第一に、seat matrixを作る。standard ChatGPT seat、Codex-only seat、API Platform access、workspace admin roleを別列にして、職種ごとに必要性を整理する。ここを混ぜると、不要なChatGPT accessや不足したCodex accessが出る。

第二に、representative workloadを3つから5つ選ぶ。例として、単体テスト作成、既存コード調査、小規模UI修正、PRレビュー、障害調査がある。それぞれでcredits消費、作業時間、レビュー負荷、失敗時の戻し方を測る。

第三に、credit governanceを決める。Businessなら誰がcreditsを追加し、auto rechargeを許すか。Enterpriseならoverage limitをいくらにし、shared pool枯渇時に誰へ通知し、どの業務を止めるか。これはFinOpsだけではなく開発運用の話である。

第四に、data boundaryを説明する。Business/Enterpriseでは通常、input/outputをモデル改善に使わないという説明がある。一方、個人Plus/Proや期間限定Free/Goで業務コードを扱う場合は別のリスクがある。会社workspaceへ寄せる基準を明文化する。

第五に、connected servicesとappsを棚卸しする。Codexがコードだけでなく、ChatGPT側のconnected servicesやworkspace appsと関わる場合、不要なDrive、Slack、Notion、社内データへの接続が広がらないようにする。便利さの前に権限境界を決める。

第六に、利用者教育をseat typeごとに分ける。standard seatの利用者にはChatGPT本体の情報入力ルールを教える。Codex-only seatの利用者にはリポジトリ、branch、PR、review、credit消費、長時間taskの扱いを教える。同じ研修資料で済ませると抜けが出る。

## まとめ

OpenAIのHelp Center更新は、Codexの企業導入を座席とcreditsの問題として見直すきっかけになる。standard ChatGPT seatとCodex-only seatを分けられることは、費用最適化の材料であると同時に、アクセス制御の材料でもある。workspace creditsとtoken-based rate cardは、利用量を作業単位で観測する必要性を高める。

日本企業が今やるべきことは、Codexを「開発者全員に配るかどうか」の二択で考えないことだ。誰がChatGPT本体を必要とし、誰がCodexだけでよく、どの作業がどれだけcreditsを使い、誰がoverageを承認するのか。そこまで決めて初めて、Codexは個人の試用から管理された開発基盤へ移る。

## 出典

- [What is ChatGPT Enterprise?](https://help.openai.com/en/articles/8265053-what-is-chatgpt-team) - OpenAI Help Center
- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center
- [Managing billing and seats in ChatGPT Business](https://help.openai.com/en/articles/8792536-manage-billing-on-the-chatgpt-team-subscription-plan) - OpenAI Help Center
- [Flexible pricing for the Enterprise, Edu, and Business plans](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans) - OpenAI Help Center
