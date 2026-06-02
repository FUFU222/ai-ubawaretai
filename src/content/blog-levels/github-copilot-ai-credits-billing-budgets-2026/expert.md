---
article: 'github-copilot-ai-credits-billing-budgets-2026'
level: 'expert'
---

GitHub Copilotの2026年6月1日更新は、Copilotの課金単位がGitHub AI Creditsへ移ったという単独のニュースではなく、企業の開発基盤運用を「席数管理」から「AI実行予算管理」へ変えるイベントとして読むべきだ。GitHub Changelogは、usage-based billingが全ユーザーに有効化され、Copilot code reviewがAI Creditsに加えてGitHub Actions minutesも消費し、user-level budgetsが組織・企業向けに一般提供されたと説明している。

このサイトではすでに、6月移行に備える[Copilot使用量レポート](/blog/github-copilot-ai-credits-usage-report-2026/)と、private repositoryに効く[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)を扱ってきた。今回の焦点は、準備ではなく運用開始後の設計である。日本企業の管理者は、AI Credits、共有プール、user-level budget、cost center、enterprise budget、runner設定を一つの運用モデルとしてつなぐ必要がある。

さらに、[Copilot usage metrics APIのAI adoption cohorts](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)が示すように、GitHubはCopilotを単なる補完ツールではなく、導入状況を測りながら広げる開発プラットフォームとして整えている。AI Credits課金は、その利用実態にコスト責任を結びつける仕組みだと見るほうが正確だ。

## 事実: AI Creditsはモデル別トークン課金をCopilot内の予算単位に変換する

GitHub Docsでは、GitHub AI CreditsをCopilot利用の課金単位として説明している。Copilotの各インタラクションでは、入力トークン、出力トークン、キャッシュされたトークンが発生し、モデルごとの価格に基づいて費用が計算される。その合計がAI Creditsへ変換され、1 AI Creditは0.01米ドルとして扱われる。

この設計は、従来のpremium requestよりも実行実態に近い。軽い質問、短い補完、長い設計相談、複数ファイルを読むagentic sessionでは、モデル呼び出しの重さが違う。AI Creditsは、その違いをCopilotの利用量として見えるようにする。

ただし、AI Creditsの対象範囲を誤解してはいけない。Docsでは、Copilot Chat、Copilot CLI、Copilot cloud agent、Copilot Spaces、Spark、third-party coding agentsがAI Creditsを消費する機能として説明されている。一方、code completionsとnext edit suggestionsはpaid planではAI Credits課金対象外だ。したがって、補完利用の多いチームと、CLIやcloud agentを重く使うチームを同じ利用者数だけで比較するのは不適切である。

日本企業の管理では、ここが最初の分岐になる。AI Creditsの消費を「Copilot全体の利用が増えた」と大づかみに見るのではなく、どのsurfaceで増えたかを分ける必要がある。Chatが増えたのか、CLIが増えたのか、cloud agentが増えたのか、code reviewが増えたのかで、改善策も統制策も変わる。

## 事実: Business / Enterpriseは共有プールで始まり、個人budgetで止まる

Copilot BusinessとCopilot Enterpriseでは、ユーザーごとの含有AI Creditsが請求主体の単位で共有プールになる。GitHub Docsでは、標準枠としてBusinessは1ユーザーあたり月1,900 credits、Enterpriseは月3,900 creditsと説明している。既存顧客には2026年6月1日から9月1日まで、Business月3,000 credits、Enterprise月7,000 creditsのプロモーション枠が提供される。

共有プールの設計は、組織全体の利用を吸収するには合理的だ。特定のエンジニアが重要なincident対応や大きなリファクタリングで多く使っても、組織全体に余力があれば作業は続けられる。重い利用者を一律に止めないという意味では、生産性の観点で自然な設計である。

一方で、共有プールは予算責任を曖昧にしやすい。日本企業では、開発部門、子会社、プロダクトライン、研究開発、情シス、共通基盤チームで予算科目が分かれることがある。AI Creditsがbilling entityでプールされると、実際に消費したチームと請求を負担する単位がずれる可能性がある。

その補助線になるのがuser-level budgetsだ。GitHub Docsのbudgets説明では、user-level budgetはユーザーごとのAI Credits消費を1請求サイクル内で制限し、共有プール中も追加課金フェーズでも常にhard stopとして働くと説明されている。共有プールが残っていても、個人のbudgetが尽きれば、そのユーザーのAI Credits消費機能はブロックされる。

ここで重要なのは、user-level budgetを「全員を低く抑える装置」と誤解しないことだ。より実務的には、heavy userを公式に認める装置である。たとえば、プラットフォームチーム、セキュリティレビュー担当、AI推進チーム、複雑な移行を担うtech leadには高い上限を設定し、一般利用者には標準上限を設定する。そうすることで、組織全体の共有プールを守りながら、成果につながる重い利用を止めずに済む。

## 事実: budget階層は足し算ではなく、ブロック条件の組み合わせになる

GitHub Docsでは、予算管理をuser-level budget、cost center budget、enterprise budget、organization-level budgetのように複数階層で説明している。ここで誤りやすいのは、これらを単純な足し算として見ることだ。

user-level budgetは、共有プールと追加課金の両方に対して個人単位で効く。cost center budgetとenterprise budgetは、共有プールが尽きた後のmetered usageを抑えるための制御として位置づけられている。enterprise budgetは月額費用全体の上限ではなく、ライセンス費用に加えて発生するmetered usageの上限として読む必要がある。

さらに、Docsでは、予算が尽きたときに自動で安いモデルへfallbackするわけではないと説明されている。budgetに到達したユーザーは、AI Creditsを消費する機能を使えなくなる。code completionsとnext edit suggestionsはAI Credits対象外なので継続するが、Chat、CLI、cloud agentなどは止まる。

この挙動は、日本企業の運用ではかなり重要だ。月末の重要リリース中にtech leadのbudgetが尽きると、共有プールが残っていてもその人のagentic workflowが止まる可能性がある。逆に、enterprise spending limitが低すぎると、個人budgetに余裕があるユーザーでも追加課金フェーズで止まることがある。

したがって、budget設計では、誰を止めたいのか、何を止めたくないのかを先に決めるべきだ。全社の最大請求額を守ることが目的なのか、公平な利用配分が目的なのか、特定チームの重い利用を許可することが目的なのかで、user-level budget、cost center budget、enterprise budgetの設定値は変わる。

## 事実: Copilot code reviewはAI Creditsだけでは完結しない

2026年6月1日から、Copilot code reviewはAI Creditsに加えてGitHub Actions minutesも消費する。GitHub Changelogは、Copilot code reviewが標準のGitHub-hosted runnerを使う一方で、組織管理者がdefault runnerを設定できるようになったと説明している。

これは、Copilot code reviewの費用管理が二重化したことを意味する。AI Credits側では、レビューに使われるモデル利用量を見る。Actions側では、private repositoryでレビューが何回実行され、どのrunnerで動いたかを見る。AI Creditsのbudgetだけを整えても、GitHub-hosted runnerのminutesが増えれば、別の請求項目で影響が出る。

日本企業では、ここでレビュー自動化の範囲を見直す必要がある。全PRで自動レビューを動かすのか、重要repositoryだけに絞るのか、draft PRでは止めるのか、pushごとの再レビューを許すのか、非ライセンス利用者のPRまで対象にするのか。これらは品質の論点であると同時に、AI CreditsとActions minutesの論点でもある。

runner方針も同時に決めるべきだ。GitHub-hosted runnerは手軽だが、private repositoryのレビュー回数が増えるほどminutesを消費する。self-hosted runnerはActions minutesを抑えやすいが、実行環境の保守、ネットワーク、秘密情報、スケール、監査ログの責任が自社に寄る。larger runnerを使うなら、標準runnerとは別の単価と性能要件を見なければならない。

## 分析: 最初の失敗パターンは「全員同じ上限」にすること

ここからは分析だ。

AI Credits運用で最初に起きやすい失敗は、全員に同じuser-level budgetを設定することだ。一見、公平に見える。しかしCopilotの価値は、職種や役割によって大きく違う。日常的に軽いChatだけ使う開発者、複数repositoryの調査をするstaff engineer、incident中にログとコードを横断するSRE、セキュリティレビューを行うAppSec担当では、必要な利用量が違う。

全員に高い上限を与えると、共有プールを守りにくい。全員に低い上限を与えると、重いが価値のあるagentic workflowが止まりやすい。したがって、user-level budgetは少なくとも役割別に分けるべきだ。標準利用者、heavy but approved user、検証・教育用ユーザー、外部委託や短期利用者のように分けるだけでも、運用は安定する。

この分類は、人事上の等級ではなく、AI利用の業務目的で決めるほうがよい。たとえば、若手でも移行プロジェクトでcloud agentを多く使うなら一時的に高い上限が必要かもしれない。逆に、管理職でも利用が軽いなら標準上限で足りる。AI Creditsは個人の権限というより、業務タスクに対する実行予算として扱うべきだ。

## 分析: 「止める」設計と「払う」設計を混ぜない

もう一つの失敗は、budgetを設定したつもりで、実際には追加課金が続く構成にしてしまうことだ。GitHub Docsでは、追加利用に入るにはAI credit paid usage policyが関係し、cost centerやenterpriseのspending limitでは、limit到達時に止める設定を有効にする必要があると説明している。user-level budgetは常にhard stopだが、他のbudgetは設定の意味を誤解しやすい。

日本企業では、ここを社内稟議と合わせる必要がある。たとえば、開発生産性を止めないことを重視するなら、追加利用を許可し、月次レビューで上位利用を確認する設計が合う。一方、予算上限を絶対に超えられない部門では、止める設定を明示的に使う必要がある。

どちらが正しいかは会社の方針次第だ。ただし、止める設計と払う設計を曖昧に混ぜるのが最も危ない。現場は止まらないと思っていたのに月末にブロックされる、あるいは管理者は上限で止まると思っていたのに追加課金が続く、という状態が起きるからだ。

## 実務: 6月運用の初期設計

6月の初期設計では、まず過去のusage reportと6月実績を合わせて、surface別の消費を出す。Chat、CLI、cloud agent、code review、Spaces、Spark、third-party coding agentsを同じ箱に入れず、用途別に見る。ここで、[Copilot Maxの個人向けAI Credits設計](/blog/github-copilot-max-flex-individual-plans-2026/)のような個人プランの話と、Business / Enterpriseの共有プールの話を混同しないことも大事だ。

次に、役割別のuser-level budgetを作る。標準利用者には基本上限、重い利用を承認したユーザーには高い上限、検証利用者には低い上限を置く。初月から完璧な金額にする必要はないが、少なくとも「誰もが無制限」または「全員同じ低上限」は避けたい。

そのうえで、追加利用ポリシーを明文化する。含有AI Creditsを超えたら止めるのか、追加課金を許すのか、許す場合は誰が承認するのか。enterprise budgetやcost center budgetを設定するなら、請求上限を守るための設定なのか、消費を観測するための設定なのかを分けておく。

最後に、Copilot code reviewの対象とrunnerを決める。全PR自動レビューは便利だが、private repositoryではActions minutesにも効く。まず重要repositoryに絞り、draftや頻繁なpushの扱いを調整し、default runnerを組織単位で設定する。AI Creditsのbudget会議とActions runnerの設計会議を分けると、全体コストを見落としやすい。

## まとめ

GitHub CopilotのAI Credits課金開始は、Copilotを開発者ごとの月額ツールではなく、組織のAI実行基盤として管理する変更である。Business / Enterpriseでは共有プールが柔軟性を生む一方で、user-level budgets、cost center、enterprise budget、追加利用ポリシーを設計しなければ、予算責任が曖昧になる。

日本企業が6月にやるべきことは、利用を単純に抑えることではない。重い利用が価値を生む場所を特定し、そこには明示的に予算を割り、軽い利用や検証利用には適切な上限を置くことだ。さらにCopilot code reviewでは、AI CreditsだけでなくActions minutesとrunner方針を同じ設計に含める必要がある。Copilotの導入フェーズは終わり、運用設計のフェーズに入った。

## 出典

- [Updates to GitHub Copilot billing and plans](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/) - GitHub Changelog, 2026-06-01
- [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) - GitHub Docs
- [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals) - GitHub Docs
