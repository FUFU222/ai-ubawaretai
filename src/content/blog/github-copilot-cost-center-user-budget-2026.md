---
title: 'GitHub Copilot部門別予算、cost center一括上限の実務'
description: 'GitHub Copilotのcost center別ユーザー予算を解説。共有AI Creditsを部門単位で守り、異動へ自動追随させる設定と、日本企業の情シス・FinOpsが確認すべき優先順位を整理する。'
pubDate: '2026-07-02'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '従量課金', '管理者設定', 'AIガバナンス', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年6月30日**、GitHub Copilotの企業向け予算管理に、**cost center user-level budget**を追加した。Enterprise管理者は、cost centerごとに1人あたりのAI Credits上限を1つ設定できる。個人を直接追加した場合だけでなく、enterprise team経由で所属するメンバーにも同じ上限が適用され、入社、異動、退職に伴うメンバー変更へ自動で追随する。

この更新の価値は、単に予算設定の手間が減ることではない。日本企業がCopilotを全社展開するとき、プラットフォーム開発、プロダクト開発、情シス、営業支援では必要なAI利用量が異なる。従来の全社一律上限か個人別設定かという二択に、**部門単位の標準上限**が加わった。

前提となるAI Creditsの仕組みは、[GitHub Copilot AI Credits課金と予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)で整理した。今回の焦点は、共有プールを部署別に公平配分しつつ、重いagentic workflowを担うチームへ十分な枠を渡す方法である。[AI Credits使用量レポート](/blog/github-copilot-ai-credits-usage-report-2026/)と組み合わせれば、上限を置くだけでなく、実績を見て翌月の配分を調整できる。

## 事実: cost centerに1人あたりの上限を設定できる

GitHub Changelogによると、cost center user-level budgetは、cost centerに所属する各ユーザーへ同額のAI Credits上限を適用する仕組みだ。たとえば、platform engineeringのcost centerは1人250米ドル、その他の利用者にはuniversal user-level budgetとして1人40米ドルを設定できる。数千人分のindividual budgetを作る必要はない。

適用対象は現在のメンバーだけではない。enterprise teamをcost centerへ割り当てれば、そのteamへ参加した人は自動で上限の対象になり、外れた人は対象外になる。人事異動のたびにCopilot予算を手作業で付け替えるのではなく、GitHub上のteam membershipを予算境界として再利用できる。

ただし、これは人事マスタとの完全な自動連携を意味しない。前提は、enterprise teamのメンバー構成が実際の所属と一致していることだ。IdPやSCIM、社内ディレクトリからteamを同期している企業では運用をつなぎやすい。一方、team membershipが古いままなら、予算も古い組織図へ追随する。予算機能を有効にする前に、誰がどのteamを更新するかを確認する必要がある。

2026年6月30日時点で、cost center user-level budgetの作成はREST APIからのみ利用できる。Billing UIからの作成は今後対応予定とされている。したがって、導入初期は管理画面のクリック手順ではなく、APIリクエスト、設定値のレビュー、変更履歴の保管を運用に含めるべきだ。

## 事実: 通常のcost center budgetとは止まる場所が違う

名前が似ているため、**cost center user-level budget**と**cost center budget**を混同しやすい。両者は対象も発動時点も異なる。

user-level budgetは、1人が請求サイクル中に消費できるAI Credits総量を制限する。含有AI Creditsの共有プールから使っている段階と、追加課金へ移った後の両方で有効になり、常にhard stopとして動く。ユーザーが上限へ達すると、共有プールが残っていても、そのユーザーのAI Credits消費は止まる。

一方、通常のcost center budgetは、共有プールを使い切った後に発生する**追加利用額の部門合計**を制御する。共有プールから誰がどれだけ使うかは制限しない。さらに、通常のcost center budgetやenterprise budgetでは「Stop usage when budget limit is reached」を有効にしなければ、上限到達後も課金が続く場合がある。user-level budgetにはこの選択肢がなく、必ず停止する。

したがって、2つは代替関係ではない。cost center user-level budgetで各人の消費を平準化し、通常のcost center budgetで追加課金の部門総額を抑えるという二層構成ができる。予算全体の観測には、[GitHub AI usage reportの項目設計](/blog/github-ai-usage-report-fields-2026/)も合わせて確認したい。誰が上限に近いかだけでなく、どのsurfaceやモデルが消費を押し上げたかを見なければ、適切な金額へ修正できないからだ。

## 事実: 優先順位はindividual、cost center、universal

同じユーザーへ複数のuser-level budgetが適用される場合、GitHubは最も具体的な設定を優先する。順序は次のとおりだ。

1. individual user-level budget
2. cost center user-level budget
3. universal user-level budget

たとえば、全社標準を40米ドル、platform engineeringのcost centerを250米ドルにし、その中の特定の検証担当者へ個別で400米ドルを設定した場合、その担当者には400米ドルが適用される。3つの金額が加算されるわけではない。逆に、特定ユーザーだけ10米ドルへ下げる個別設定を置けば、cost centerの250米ドルより個別の10米ドルが優先される。

この優先順位は柔軟だが、例外が増えるほど説明しにくくなる。個別設定を恒久運用にすると、「なぜ同じ部署なのに上限が違うのか」「異動後も例外を残すのか」という管理負債が生まれる。個別上限には理由、承認者、開始日、失効日を持たせ、原則としてcost center標準へ戻す運用が必要だ。

もう一つ注意すべきなのは、user-level budgetと追加課金側のspending limitが独立している点だ。個人上限に余裕があっても、cost centerまたはenterpriseの追加課金予算が先に尽きれば利用は止まる。反対に、追加課金予算が残っていても、個人上限へ達した人は止まる。予算を設計するときは、残余枠が最も小さい制御が先に効くと考えると分かりやすい。

## 分析: 日本企業では「部門」より業務負荷で分ける

ここからは分析だ。

cost centerという名称から、経理上の部門コードをそのままGitHubへ移したくなる。しかしCopilot予算の境界として最適なのは、必ずしも人事組織と同じではない。必要なAI Creditsは部署名より、agentic workflowの種類と頻度で決まるからだ。

たとえば、同じ開発本部でも、補完と短いChatが中心のチーム、Copilot CLIで大規模移行を進めるチーム、cloud agentを継続実行するチーム、コードレビューやセキュリティ調査を担う共通基盤チームでは消費が違う。経理上の配賦単位を守りつつ、AI利用の重さが近い集団をenterprise teamとして管理し、そのteamをcost centerへ割り当てるほうが予測しやすい場合がある。

日本企業では組織改編が年度や半期に集中し、兼務も多い。cost centerへの直接ユーザー割り当てを増やすと、異動時に古い所属が残りやすい。可能ならenterprise teamを主経路とし、直接割り当ては役員、横断担当、短期プロジェクトなど例外に限定したい。さらに、enterprise teamのオーナー、請求責任者、Copilot管理者の三者が、月次でメンバー差分を確認できる形が望ましい。

予算額は、最初から理想値を決める必要はない。[Copilot team metrics API](/blog/github-copilot-team-metrics-api-2026/)の導入状況とAI Credits利用実績を見ながら、標準、heavy user、期間限定検証の3段階程度から始めるのが現実的だ。重要なのは、利用を一律に抑えることではなく、成果へ結びつく利用へ予算を移せることだ。

## 実務: 導入前に作る予算マトリクス

まず、cost centerごとに「対象team」「1人上限」「想定人数」「共有プール消費見込み」「追加課金上限」「停止時の業務影響」を1枚にまとめる。1人上限だけを決めると、人数が増えたときに部門全体の許容額が意図せず膨らむ。人数と1人上限の積、全社共有プール、追加課金予算の三つを同時に見る必要がある。

次に、優先順位をテストする。検証用ユーザーを1人用意し、universal、cost center、individualの設定を段階的に適用して、期待した上限が表示・適用されるかを確認する。とくに、既存のindividual budgetが残っているユーザーは、cost centerへ移しても部門標準にならない。移行前に個別設定を棚卸しする。

三つ目に、異動を模擬する。enterprise teamへの追加と削除がcost center membershipへ反映され、予算対象も切り替わるかを確認する。SCIM連携があるなら、人事変更からGitHub反映までの時間差も測る。月末の異動で旧部署と新部署のどちらへ利用が配賦されるかは、経理と事前に合意しておきたい。

四つ目に、停止時の連絡経路を決める。user-level budgetはhard stopなので、重要なリリースや障害対応中でも上限へ達すれば止まる。利用者がどこへ申請し、誰がどの基準で一時増額し、いつ元へ戻すかを定義する。個別増額を無期限に残さないため、チケット番号と失効日を設定変更記録へ残す。

最後に、REST APIの変更をコードとして管理する。公開時点ではUI作成に未対応なので、少なくともリクエスト内容とレスポンス、実行者、実行日時を保存する。API tokenは最小権限にし、本番反映前にdry-run相当の一覧取得と差分レビューを行う。UI対応後も、大規模組織では同じ手順を自動化したほうが再現性を保ちやすい。

## まとめ

GitHub Copilotのcost center user-level budgetは、全社一律と個人別の間に、部門・チーム別の標準上限を追加する機能だ。enterprise teamを使えば、現在と将来のメンバーへ同じ1人上限を適用し、異動に追随できる。

ただし、通常のcost center budgetとは役割が異なる。user-level budgetは共有プール中から各人をhard stopし、通常のcost center budgetは共有プール枯渇後の部門追加課金を制御する。individual、cost center、universalの優先順位と、enterprise側の追加課金上限まで含めて設計しなければ、想定外の停止や例外設定が増える。

日本企業は、経理上の部門をそのまま写すだけでなく、AI利用負荷、enterprise teamの保守責任、異動時の同期、例外の失効まで運用に含めるべきだ。まず少数のcost centerで予算マトリクスを検証し、利用実績を見て段階的に広げるのが安全である。

## 出典

- [Per-user AI credit budgets available for cost centers](https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers/) - GitHub Changelog, 2026-06-30
- [Budgets for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Controlling and tracking costs at scale](https://docs.github.com/en/enterprise-cloud@latest/billing/tutorials/control-costs-at-scale) - GitHub Docs
