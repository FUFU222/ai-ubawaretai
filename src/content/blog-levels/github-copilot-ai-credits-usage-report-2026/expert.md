---
article: 'github-copilot-ai-credits-usage-report-2026'
level: 'expert'
---

GitHubが**2026年5月12日**に公開したApril usage reportは、表面的にはCopilotの請求準備機能に見える。しかし実務上は、GitHub Copilotを席課金SaaSから、モデル別・機能面別・ユーザー別に管理するAI実行基盤へ移すための移行ツールと見るべきだ。

背景にあるのは、**2026年6月1日**から始まるGitHub AI Creditsベースのusage-based billingである。以前このサイトで扱った[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)は、AIレビューがGitHub Actionsの実行コストにも結びつく話だった。今回のusage reportは、より広くCopilot全体のAI Credits消費を事前に読むための話だ。

これは[Copilot CLIの企業管理プラグイン](/blog/github-copilot-cli-enterprise-plugins-2026/)や[GitHub CopilotでのGPT-5.5一般提供](/blog/github-copilot-gpt-55-general-availability-2026/)とも同じ流れにある。Copilotは、IDEの補完機能ではなく、CLI、cloud agent、code review、Spaces、外部coding agentを含む開発基盤へ広がっている。だからこそ、6月以降は「ライセンスを配ったか」ではなく「どの面でどれだけ実行されたか」を管理する必要がある。

## 事実: 2026年5月12日にApril usage reportが公開された

GitHub Changelogによると、2026年5月12日から、4月のGitHub Copilot利用をAI Credits換算で確認するためのusage reportをダウンロードできるようになった。Copilot Business / Enterpriseの管理者はenterprise向けに、Copilot Pro / Pro+の利用者は個人利用向けにレポートを取得できる。

GitHubの説明で重要なのは、このレポートが**請求の確定値ではなく、計画用の方向感**として位置づけられている点だ。4月の利用をもとに、6月1日からのGitHub AI Credits移行後にどの程度の消費になりそうか、どのモデルやsurfaceが消費を押し上げるかを把握するための材料である。

レポートには注意点もある。4月1日から24日までの0x model利用は含まれない。4月24日から30日のデータには、backfill gapにより重複行が出る可能性がある。さらに、Copilot code reviewの一部エントリではAI Credit見積もりが欠ける場合がある。特に、organizationへ直接課金される自動レビューや、Copilot licenseを持たないユーザー起点のレビューが0 AI Creditsとして見える場合がある。

したがって、April usage reportを「6月の請求額そのもの」として読むのは誤りだ。正しい使い方は、消費の偏り、見積もり欠損、モデル選択、surface別の利用傾向を見つけ、6月1日前に予算ルールを決めることだ。

## 事実: AI Creditsはモデル、トークン、利用面で決まる

GitHub Docsでは、Copilot BusinessとCopilot Enterpriseのusage-based billingについて、GitHub AI Creditsを課金単位として説明している。1 AI Creditは0.01米ドルに相当する。消費は、入力トークン、出力トークン、キャッシュトークンをモデルごとの価格に基づいて計算し、AI Creditsへ変換する。

BusinessとEnterpriseでは、ユーザーごとに含まれるAI Creditsがあり、それがbilling entity単位でプールされる。標準枠は、Businessが1ユーザーあたり月1,900 credits、Enterpriseが月3,900 creditsだ。さらに既存顧客には、2026年6月1日から9月1日まで、Business月3,000 credits、Enterprise月7,000 creditsのプロモーション枠が提供される。

このプール設計は柔軟だが、管理を簡単にするわけではない。少数のheavy userが大きく消費しても、組織全体のプールが残っていれば動き続ける。これは良い面もある。重要な開発者やプラットフォームチームが大きな作業を進める余地があるからだ。一方で、部門別の予算責任がある会社では、誰の利用がどの部門コストになるのかが見えにくくなる。

AI Creditsを消費する対象も、明確に分けて読む必要がある。Docsでは、Copilot Chat、Copilot CLI、Copilot cloud agent、Copilot Spaces、Spark、third-party coding agentsなどがAI Creditsの対象として説明されている。一方、code completionsとnext edit suggestionsは、paid planではAI Credits課金対象外として残る。つまり、日常の補完利用とagentic workflowの利用を同じメトリクスで雑に扱うと、実態を誤る。

## 事実: 超過時の挙動はポリシー次第で変わる

GitHub Docsでは、含まれるAI Creditsを使い切った後の扱いも説明されている。追加利用が許可されていれば、利用は続き、追加分が課金される。許可されていなければ、次の請求サイクルまで利用がブロックされる。

さらに、user-level budgetを設定している場合、そのユーザーが予算を使い切ると、組織全体のプールが残っていてもそのユーザーの利用は止まる。ここは運用上かなり重要だ。組織全体の予算と、個人単位のhard stopは別の制御として設計しなければならない。

予算はenterprise、organization、cost center、userの各レベルで設定できる。日本企業では、ここが実務上の設計点になる。部門別配賦、子会社別管理、プロジェクト別予算、研究開発費と本番運用費の切り分けなどを行うなら、GitHub上のorganization構成やcost center設計を経理・情シス・開発組織の実態に合わせる必要がある。

## 分析: April reportは「誰が使ったか」より「何が増える構造か」を見る

ここからは分析だ。

April usage reportを見た管理者は、まず上位ユーザーランキングを見たくなるはずだ。それ自体は悪くない。しかし、CopilotのAI Credits運用で本当に重要なのは、個人を責めることではなく、消費が増える構造を理解することだ。

たとえば、あるユーザーの消費が大きいとしても、それが重要な移行作業、セキュリティ修正、基盤リファクタリングに使われているなら、費用対効果は高いかもしれない。反対に、軽い質問を常に高価なfrontier modelへ投げているだけなら、モデル選択を変えるだけで消費を下げられる。

見るべき軸は少なくとも4つある。

1つ目はモデル別の消費だ。高性能モデルは難しい設計や大規模変更で効果を出す一方、単純な質問や定型修正に使うと割高になりやすい。[GPT-5.2とGPT-5.2-Codex廃止](/blog/github-copilot-gpt-52-codex-retirement-2026/)のようにモデル移行が続く状況では、代替モデルの品質だけでなく、移行後のAI Credits消費も見積もる必要がある。

2つ目はsurface別の消費だ。IDE Chat、Copilot CLI、cloud agent、code review、Spaces、third-party coding agentsでは、利用目的もリスクも違う。CLIやcloud agentが伸びるなら、権限、ログ、リポジトリ範囲、社内プラグイン管理が重要になる。code reviewが伸びるなら、自動レビュー対象、pushごとの再レビュー、非ライセンス利用者のPRレビュー範囲を見直す必要がある。

3つ目はrepositoryまたはorganization別の偏りだ。特定の大規模repositoryでagentic workflowが集中しているなら、単に個人予算を絞るより、対象repositoryの運用ルールを変えたほうが効く。たとえば、draft PRでは自動レビューを止める、重いモデルはrelease branchだけに許可する、などの設計が考えられる。

4つ目は時間軸だ。4月のレポートは、6月以降の制度を4月の使い方に当てたものだ。もし5月にCopilot CLIやcloud agentの利用が増えたなら、4月ベースの見積もりは低く出る。逆に、4月に一時的な移行作業が集中していたなら、高く出ることもある。

## 分析: 日本企業では「便利だから許可」と「止まると困る」の間を設計する

AI Credits移行で難しいのは、追加利用を許可するかどうかだ。追加利用を許可すれば、業務は止まりにくい。しかし、予算上限を超えやすい。許可しなければ、費用は制御しやすいが、重要な作業中にCopilotが止まる可能性がある。

日本企業では、ここが特に揉めやすい。現場は「急に止まると困る」と考える。管理部門は「青天井は困る」と考える。情シスは「誰が何を許可したか説明できないと困る」と考える。どれも正しい。だから必要なのは、単純なオン・オフではなく、用途別の予算設計だ。

たとえば、本番障害対応、セキュリティ修正、期限付き移行作業を行うチームには、追加利用を許可しつつアラートを強くする。一方、学習目的や試験導入のチームにはuser-level budgetを低めに設定し、上限到達時は軽いモデルや通常の開発フローへ戻す。こうした差をつけないと、全社一律の制限が現場の反発を生む。

この観点では、GitHubのbudget階層は日本企業にとって使いやすい。enterprise、organization、cost center、userのどこで止めるかを選べるからだ。ただし、設計しないまま使うと、どこにも責任が乗らない。April usage reportを見た段階で、部門配賦と停止条件を決める必要がある。

## 分析: Copilot code reviewの見積もり欠損は別管理する

今回のChangelogで特に注意したいのが、Copilot code reviewの一部エントリでAI Credit見積もりが欠けるという説明だ。これは、日本企業にとって小さな注記ではない。

Copilot code reviewは、開発組織が広げやすい機能だ。PRに自動でコメントが付き、レビューの初動が速くなる。だが、以前整理したように、2026年6月1日からprivate repositoryでGitHub-hosted runnerを使うレビューはActions minutesも消費する。そこにAI Credits側の見積もり欠損があると、4月レポートだけではレビュー機能の総コストを読み違える可能性がある。

したがって、code reviewについてはApril usage reportだけでなく、GitHub Actions metricsやbilling usage reportのworkflow_pathも合わせて見るべきだ。AI Credits、Actions minutes、レビュー回数、対象repository、非ライセンス利用者のPRレビュー範囲を別々に棚卸しする。特に全PR自動レビューやpushごとの再レビューを有効にしている場合は、6月前に対象を絞る判断が必要になる。

## 実務: 5月中に作るべき運用表

実務では、April usage reportを見て終わりにしないほうがよい。5月中に、少なくとも次のような運用表を作るべきだ。

- surface: IDE Chat、CLI、cloud agent、code review、Spacesなど
- 主な利用者: 個人、チーム、部門
- 主なモデル: 高性能モデルか軽量モデルか
- 予算責任: 開発部門、情シス、プロジェクト、cost center
- 超過時の挙動: 追加利用を許可するか、止めるか
- 監視方法: usage report、budget alert、Actions metrics、管理者レビュー
- 例外ルール: 障害対応、セキュリティ修正、期限付き移行など

この表を作ると、Copilotの議論が「高いか安いか」から「どの用途なら払う価値があるか」に変わる。これはかなり大きい。AI開発支援ツールは、費用をゼロにするものではなく、重要な開発作業の単価と速度を変えるものだからだ。

さらに、モデル方針も明文化したい。日常的な質問、テスト修正、ドキュメント生成、設計レビュー、大規模リファクタリング、セキュリティ修正で、使うモデルの推奨を分ける。すべてを最上位モデルへ寄せるのではなく、タスクの難度とリスクで選ぶ。これだけでも、6月以降のAI Credits消費は読みやすくなる。

## 実務: 6月1日と9月1日の二段階で見る

もう1つ重要なのは、6月1日だけでなく9月1日も見ることだ。既存Business / Enterprise顧客には、6月1日から9月1日までプロモーション枠が用意される。これは移行期間としてはありがたいが、9月以降は標準枠に戻る。

そのため、April usage reportを使った見積もりは、少なくとも二段階で見るべきだ。

まず、6月から8月のプロモーション枠で収まるかを見る。ここで超えるなら、移行初月から明確な対策が必要だ。次に、9月以降の標準枠で収まるかを見る。プロモーション枠では収まるが標準枠では超えるなら、夏の間にモデル方針、budget、追加利用ルールを整える必要がある。

この二段階確認をしないと、6月から8月は問題なく見えても、9月に急に予算超過として表面化する可能性がある。日本企業の予算運用では、期中にSaaS費用が跳ねると説明が重くなる。だから、今の段階で9月以降も含めた見積もりを出しておくほうがよい。

## まとめ

GitHub CopilotのApril usage report公開は、6月1日のAI Credits移行に向けた実務上の重要なサインだ。これは、単にCSVをダウンロードできるようになったという話ではない。Copilotを席数で管理する段階から、モデル、surface、ユーザー、cost center、停止条件で管理する段階へ移すための準備である。

日本企業にとって重要なのは、合計額を見ることではなく、消費が増える構造を見つけることだ。高性能モデル、CLI、cloud agent、code review、非ライセンス利用者のレビュー、cost center配賦、追加利用ポリシーを分けて見れば、6月1日の移行はかなり現実的に管理できる。

Copilotは、もう単なる補完機能ではない。開発組織のAI実行基盤であり、予算統制、モデル選択、権限管理、監査説明を伴う業務インフラになっている。April usage reportは、その前提で運用を作り直すための最初の材料として扱うべきだ。

## 出典

- [April reports are now available to prepare for usage-based billing](https://github.blog/changelog/2026-05-12-april-reports-are-now-available-to-prepare-for-usage-based-billing/) — GitHub Changelog, 2026-05-12
- [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) — GitHub Docs
- [Preparing your organization for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/manage-and-track-spending/prepare-for-usage-based-billing) — GitHub Docs
- [Models and pricing for GitHub Copilot](https://docs.github.com/copilot/reference/copilot-billing/models-and-pricing) — GitHub Docs
