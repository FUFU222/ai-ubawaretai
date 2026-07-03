---
title: 'GitHub Copilot AI credit pool、部門配賦の実務'
description: 'GitHub CopilotのAI credit poolを解説。含有AI Creditsをcost center別に分け、共有枠の横取りを防ぐ仕組みと、日本企業の情シス・FinOpsが既存の個人上限や追加課金予算とどう組み合わせるべきかを整理する。'
pubDate: '2026-07-04'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '従量課金', '管理者設定', 'AIガバナンス', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは2026年7月2日、GitHub Copilotの企業向け費用管理に**cost center別のAI credit pool**を追加した。正式な機能名はincluded usage controlで、各cost centerが全社の共有プールから使える含有AI Creditsを、そのcost centerへ割り当てたCopilot BusinessまたはEnterpriseのライセンス分までに制限する。

これまでの共有プールでは、ある部門の重いagent利用が、別部門のライセンスによって積み上がった含有枠まで先に消費できた。新しい制御を使うと、部門ごとの「自分たちのライセンスが生んだ枠」を守りやすくなる。日本企業では、事業部別採算、子会社別配賦、プロジェクト原価、情シスの共通予算を分ける場面が多い。今回の更新は、Copilotを全社導入した後の費用責任を明確にする実務機能である。

ただし、AI credit poolだけで予算管理が完成するわけではない。[cost center別の1人当たり予算](/blog/github-copilot-cost-center-user-budget-2026/)や、共有プール枯渇後の追加課金を制御するcost center budgetとは、止める対象とタイミングが違う。ここを混同すると、設定したのに他部門の枠を消費した、あるいは予算が残っているのに利用者が止まった、という事故につながる。

## 事実: 含有AI Creditsをcost center単位で区切る

GitHub Copilot BusinessとEnterpriseでは、ライセンスに含まれる月次AI Creditsがenterprise内で共有される。共有には、繁閑差を吸収できる利点がある。あるチームが今月あまり使わなければ、別のチームがcloud agentやCopilot CLIを多く使えるからだ。

一方、費用負担の境界がある企業では問題も生じる。たとえば、製品A部門が100席、製品B部門が100席分を負担していても、製品A部門が先に共有プールの大半を使えば、製品B部門は自部門の席が生んだ含有枠を十分に使えない。全社最適では許容できても、事業部別の採算管理や子会社間の公平性では説明しにくい。

今回のincluded usage controlを有効にすると、GitHubはcost centerに割り当てられたライセンス数を基に上限を自動計算する。管理者が「1万credits」のような任意額を入力する方式ではない。メンバーやライセンスの増減に応じて上限も調整されるため、席数と含有枠の関係を保ちやすい。

対象はGitHub Enterprise Cloud上のCopilot BusinessとCopilot Enterpriseである。GitHub Changelogによると、公開時点ではREST APIから利用でき、cost center設定画面での管理は今後追加される予定だ。したがって初期導入では、API設定の内容、変更者、実行日時、変更前後の状態を記録する運用が必要になる。

## 事実: 上限到達後は停止か追加課金を選ぶ

cost centerが自身のAI credit pool上限へ達したとき、管理者は2つの挙動から選べる。1つは、そのcost centerの追加利用を止める方法。もう1つは、enterpriseで追加利用が許可されている場合に、以後をpaid overageとして継続させる方法である。

この選択は単なる請求設定ではない。停止を選べば、月末や大規模移行中にChat、Copilot CLI、cloud agentなどAI Creditsを消費する機能が止まる可能性がある。追加課金を選べば業務継続性は上がるが、部門予算を超える支出が発生し得る。リリース、障害対応、セキュリティ修正のような重要業務をCopilotへ依存させるほど、上限到達時の扱いを事前に決める必要がある。

注意したいのは、AI credit poolが「追加課金予算」ではない点だ。これは全社共有プールの中で、そのcost centerが使える**含有利用分**を区切る制御である。上限後にpaid overageを許可した場合、そこから先の費用は別のcost center budgetやenterprise budgetで管理する。

Copilot全体のAI Credits課金の前提は、[GitHub Copilot AI Credits課金開始と予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)で整理した。今回の機能は、その共有プールに部門境界を追加したものと捉えると分かりやすい。

## 事実: 3種類の制御は役割が違う

実務では、AI credit pool、user-level budget、cost center budgetを分けて設計する必要がある。

**AI credit pool（included usage control）**は、cost centerが全社の共有プールから使える含有枠を、その部門のライセンス由来分までに制限する。共有プールが残っている段階で効く部門単位の制御だ。上限はGitHubがライセンス数から自動計算する。

**cost center user-level budget**は、cost centerに属する1人あたりの総消費を制限する。共有プール利用中でも追加課金中でも有効で、必ずhard stopになる。重い利用者1人が部門枠を急速に使い切ることを防ぐ役割を持つ。

**cost center budget**は、共有プールを使い切った後に発生する追加課金を部門合計で制御する。含有枠の消費中には効かない。さらに「Stop usage when budget limit is reached」を有効にしなければ、設定額を超えても課金が続く場合がある。

つまり、部門の含有枠を守るAI credit pool、個人の突出利用を抑えるuser-level budget、追加課金総額を抑えるcost center budgetという三層になる。どれか1つで他を代替することはできない。

## 分析: 日本企業では「誰が払った席か」を先に揃える

ここからは分析だ。

新機能の効果は、cost centerへの割り当てが正しいことを前提にする。GitHub Docsでは、organization、repository、user、enterprise teamをcost centerへ割り当てられる。enterprise teamを使うと、参加・離脱に応じてメンバーが自動で追随する。一方、同じresourceは同時に複数のcost centerへ所属できず、別cost centerへ追加すると移動する。

日本企業では、経理上の部門、GitHub organization、開発チーム、兼務者、委託先の境界が一致しないことが多い。GitHub organizationをそのままcost centerとみなすと、複数事業のリポジトリが混ざったり、共通基盤チームの費用が特定事業へ偏ったりする。まず「どのライセンス費用を誰が負担しているか」と「利用実績をどこへ配賦したいか」を分けて棚卸しすべきだ。

とくに兼務者は注意が必要である。1人が複数の事業へ貢献していても、Copilotライセンスや利用を単純に複数cost centerへ二重配賦できるわけではない。主所属、利用目的、プロジェクトコードのどれを優先するかを経理と合意し、必要なら月次の利用レポート側で補助配賦する。

[AI Credits使用量レポート](/blog/github-copilot-ai-credits-usage-report-2026/)は、上限設定後の実績確認に使える。ただし、管理機能の数値だけで人事評価を行うべきではない。AI Creditsの多さは、成果の大きさでも浪費の証明でもない。大規模移行や障害調査では高くなり、軽い補完中心の業務では低くなる。部門間の公平性は、消費額と業務成果の両方で評価する必要がある。

## 実務: 4段階で導入する

第一段階は、cost centerとライセンスの対応表を作ることだ。cost center名、費用責任者、対象organizationまたはenterprise team、Copilot Business/Enterpriseの席数、含有枠の想定、overage可否、停止時の連絡先を1枚にまとめる。席数の根拠が曖昧なままAI credit poolを有効にすると、自動計算される上限も説明できない。

第二段階は、既存のbudgetを重ねて確認することだ。universal、cost center、individualのuser-level budget、cost center budget、enterprise budget、AI credit paid usage policyを一覧化する。利用者が止まる条件は1つではない。最も残余枠の少ない制御が先に効くため、部門のAI credit poolが残っていても個人上限で止まることがある。

第三段階は、少数部門でのpilotだ。通常月の利用が安定している部門と、Copilot CLIやcloud agentを重く使う部門を1つずつ選ぶ。AI credit pool到達前後で、利用表示、請求配賦、停止またはoverageへの移行、管理者通知を確認する。本番の重要業務で初めて挙動を知る状態は避けたい。

第四段階は、月次レビューである。[GitHub AI usage reportの項目設計](/blog/github-ai-usage-report-fields-2026/)も参照し、cost center別の含有利用、追加課金、個人上限到達、席数変更を同じ期間で見る。予算差異があれば、単に上限を上げ下げする前に、ライセンス割り当て、利用目的、モデル選択、agent sessionの長さ、失敗再実行を確認する。

## 導入前チェックリスト

- cost centerごとの費用責任者と対象resourceが決まっている
- Copilotライセンス数と請求主体を確認した
- enterprise teamのメンバーが人事異動へ追随する
- AI credit pool到達後に停止するかoverageへ進むかを決めた
- user-level budgetとcost center budgetを別物として一覧化した
- 「Stop usage when budget limit is reached」の設定を確認した
- 重要業務が停止した場合の申請・増枠・復旧経路を決めた
- REST API変更のレビューと監査記録を残せる
- 月次レポートを個人評価ではなく運用改善に使う

## まとめ

GitHub Copilotのcost center別AI credit poolは、全社共有の含有AI Creditsに部門境界を設ける機能だ。各部門が自分のライセンスで生まれた枠を確保しやすくなり、他部門の先行消費による不公平を抑えられる。

一方、これは個人上限や追加課金予算の代替ではない。AI credit poolで含有枠を守り、user-level budgetで1人の突出利用を抑え、cost center budgetでpool枯渇後の追加支出を管理する。日本企業は、GitHub上の所属だけでなく、費用負担、兼務、子会社、共通基盤の責任分界を先に整える必要がある。

まずは少数のcost centerで、上限到達時の停止とoverage、請求配賦、レポートの見え方を検証する。Copilotを止めずに予算を守るには、機能を有効化することより、どの枠がいつ効くかを関係者が同じ言葉で説明できることが重要である。

## 出典

- [Cost centers now support AI credit pools](https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps/) - GitHub Changelog, 2026-07-02
- [Budgets for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Using cost centers to allocate costs to business units](https://docs.github.com/en/enterprise-cloud@latest/billing/how-tos/products/use-cost-centers) - GitHub Docs
