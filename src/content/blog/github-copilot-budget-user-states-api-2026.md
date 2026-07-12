---
title: 'Copilot予算API、上限接近者を一括監視する設計実務'
description: 'Copilot予算APIでmulti-user budgetの利用者別消費を一括取得。日本企業がAI Credits上限接近者、個別override、月次FinOps監視をどう設計するか整理する。'
pubDate: '2026-07-12'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '従量課金', '管理者設定', 'AIガバナンス', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月10日**、GitHub Enterprise Cloud の REST API に、**multi-user budget の user states を取得する endpoint** を追加した。Enterprise 管理者は、Copilot などの usage-based billing で設定した複数ユーザー向け budget について、各ユーザーがどれだけ消費し、上限にどれだけ近いかを API から一覧できる。

これは見た目より実務的な更新である。日本企業では、Copilot の AI Credits 管理が、全社の [AI Credits課金開始と予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/) から、cost center、個人、例外承認、月次レポートへ細かく分かれてきた。今回の API は、その運用を「月末に請求を見て驚く」状態から、「上限に近い利用者を途中で検知する」状態へ移すための部品になる。

特に、[cost center別ユーザー予算](/blog/github-copilot-cost-center-user-budget-2026/) や [AI credit pool](/blog/github-copilot-ai-credit-pool-cost-center-2026/) を使い始めた企業では、設定した budget が実際にどの利用者へ効いているのかを継続的に確認する必要がある。今回の API は、その確認を管理画面の目視だけに頼らず、社内の FinOps や情シス監視へ取り込むための入口である。

## 事実: user statesをまとめて取得できる

GitHub Changelog によると、新しい endpoint は multi-user budget に属する全ユーザーの state を返す。これまでも budget の作成や管理は REST API と UI の両方で少しずつ整備されてきたが、今回の焦点は「budgetそのもの」ではなく「budget配下の各ユーザーの状態」である。

返される情報には、ユーザーの現在の消費額、設定された budget 上限、消費率、ユーザー単位の override の有無が含まれる。つまり、管理者は「この cost center の budget は設定済みか」だけでなく、「誰が80%に近いか」「誰だけ例外上限になっているか」「どの budget が実質的に止まりかけているか」を API で確認できる。

GitHub Docs の REST API では、enterprise の billing budgets 配下に user states 取得 endpoint が追加されている。ページングに対応し、特定ユーザーで絞り込む `username`、消費率の下限・上限で絞る `threshold_lower_bound` と `threshold_upper_bound` などを使える。これは、全件を取得して表計算に貼るだけの API ではなく、しきい値監視へ使える設計だ。

今回の対象は GitHub Enterprise Cloud の REST API である。GitHub Copilot の AI Credits だけを直接名指しする endpoint ではなく、usage-based billing の budget 管理の一部として読むべきだ。ただし、Copilot Business / Enterprise の AI Credits 運用では、multi-user budget と user-level budget が実務上の中心になりやすいため、影響は大きい。

## 事実: しきい値とoverrideを監視できる

今回の API が便利なのは、消費率で絞り込める点だ。たとえば、ある multi-user budget のうち、消費率が80%以上のユーザーだけを取得すれば、月末前の警戒リストを作れる。95%以上だけを拾えば、停止や追加承認が必要な利用者を通知できる。

これは [cost center予算UI](/blog/github-copilot-cost-center-budgets-ui-2026/) のような管理画面更新とは役割が違う。UI は管理者が設定や状況を確認する場所として重要だが、大規模企業では、毎日すべての cost center と利用者を開いて確認する運用は続かない。API でしきい値を決めて、Slack、Teams、ServiceNow、社内ポータル、DWH に流すほうが現実的である。

override の確認も重要だ。個別ユーザーに例外上限を置くことは、重い agentic workflow を担う人や、期間限定の移行プロジェクトでは合理的である。一方で、例外が残り続けると、部門標準の budget が形だけになる。API で override を一覧できるなら、例外理由、承認者、期限、対象プロジェクトを社内台帳と突き合わせられる。

GitHub は同じ週に、cost center の per-user budget を billing UI から管理できるようにしたことも発表している。UI で作れるようになり、API で user states を取れるようになったため、Copilot 予算管理は「初期設定する機能」から「継続監視する運用」に近づいた。

## 分析: 日本企業では月次締めより前に効く

ここからは分析である。

日本企業で Copilot を全社展開すると、費用説明は月次や四半期の会議に乗りやすい。しかし AI Credits の消費は、月末の請求時点で初めて見ても遅い。大規模移行、障害対応、生成AI検証、cloud agent の再試行、コードレビュー自動化が数日集中するだけで、特定ユーザーや部門の消費が急に進むことがある。

今回の user states API は、月次の「結果報告」ではなく、月中の「早期警戒」に向いている。たとえば、毎朝 80% 超のユーザーを抽出し、利用者本人、チームリード、cost center owner へ通知する。90% 超なら追加承認を求める。100% 到達後の停止が業務影響を持つチームでは、事前に軽量モデルや通常ワークフローへ切り替える。こうした運用が組める。

ここで大事なのは、消費が多い利用者をただ抑えることではない。AI Credits の消費が高い人は、重要な移行作業や障害調査を進めている可能性もある。API で見つけるべきなのは「悪い利用者」ではなく、「予算上限に近づいているため、止める・増枠する・使い方を変える判断が必要な利用者」である。

[GitHub AI usage reportの項目設計](/blog/github-ai-usage-report-fields-2026/) と組み合わせると、さらに実務的になる。user states API は budget に対する現在地を見る。一方、usage report は surface、モデル、日別、組織別の分析に使う。前者でアラートし、後者で原因を分析する、という分担がよい。

## 実務: 3層のbudgetと並べて使う

Copilot 予算管理では、似た名前の制御が増えている。今回の API を導入する前に、少なくとも3層を分けておきたい。

第一に、AI credit pool は cost center が共有プールから使える含有枠を守る制御である。これは部門間の公平性に効く。第二に、cost center user-level budget は、その cost center に属する各ユーザーの上限を決める制御である。これは1人の突出利用を止める。第三に、通常の cost center budget は、共有プール枯渇後の追加課金を部門合計で見る制御である。

user states API は、このうち multi-user budget 配下の各ユーザー状態を監視するために使う。したがって、API の数値だけで「部門全体の予算が安全」と判断してはいけない。個人上限に余裕があっても、部門の追加課金 budget が近い場合がある。逆に部門枠に余裕があっても、特定ユーザーが個人上限で止まる場合がある。

導入時には、budget id、対象 cost center、対象 enterprise team、budget 上限、停止条件、override の期限、通知先を1つの表にするべきだ。API から user states を取り、社内台帳と join すれば、誰へ通知すべきか、誰が増枠を承認できるかを自動化しやすい。

## 導入前に確認する5項目

第一に、budget の対象範囲を確認する。全社、organization、cost center、enterprise team、個別ユーザーのどの単位で制御しているかを棚卸しする。API で状態を取得できても、対象範囲が曖昧なら通知先を決められない。

第二に、しきい値を決める。80%、90%、100% のような単純な段階でもよいが、重要業務チームと一般利用チームで通知の重みを変える。すべてを同じアラートにすると、すぐに見られなくなる。

第三に、override の期限を持つ。例外上限は便利だが、理由と終了日がなければ恒久化する。API で override を検知したら、社内の申請情報と照合し、期限切れの例外を戻す。

第四に、usage report と分けて読む。user states API は現在地、usage report は原因分析、請求データは最終金額である。3つを混ぜると、数字が合わないときに調査が止まる。

第五に、停止時の復旧経路を決める。AI Credits が上限に達して Copilot の一部機能が止まる場合、誰が増枠し、誰へ連絡し、どの作業を一時的に通常フローへ戻すかを先に決めておく。

今回の Copilot 予算APIは、大きな機能発表ではない。しかし日本企業が Copilot を開発基盤として使うなら、かなり重要な運用部品である。AI Credits は、導入時の見積もりだけでなく、月中の消費、例外、上限接近、追加承認を見て初めて統制できる。管理者は、budget を設定して終わりではなく、user states を使って止まる前に会話できる仕組みを作るべきだ。

## 出典

- [Per-user states for multi-user budgets in the REST API](https://github.blog/changelog/2026-07-10-per-user-states-for-multi-user-budgets-in-the-rest-api/) - GitHub Changelog, 2026-07-10
- [Budgets - GitHub Enterprise Cloud REST API](https://docs.github.com/en/enterprise-cloud@latest/rest/billing/budgets?apiVersion=2026-03-10) - GitHub Docs
- [Per-user budgets for cost centers in the billing UI](https://github.blog/changelog/2026-07-07-per-user-budgets-for-cost-centers-in-the-billing-ui/) - GitHub Changelog, 2026-07-07
