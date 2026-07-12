---
article: 'github-copilot-budget-user-states-api-2026'
level: 'expert'
---

GitHub Enterprise Cloud の billing budgets REST API に追加された multi-user budget user states endpoint は、Copilot AI Credits 運用の中では小さく見えるが、実装担当者にとっては重要な観測点になる。budget の存在確認ではなく、budget 配下の各ユーザーがどの状態にあるかを API で取得できるため、社内の FinOps、ITSM、DWH、監査台帳に接続しやすい。

前提として、Copilot の費用管理はすでに単純な seat 管理ではない。[GitHub Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/) 以降、Chat、CLI、cloud agent、Spaces、Spark、third-party coding agents などは AI Credits の運用対象になった。さらに [cost center別ユーザー予算](/blog/github-copilot-cost-center-user-budget-2026/) と [AI credit pool](/blog/github-copilot-ai-credit-pool-cost-center-2026/) により、企業は部門、個人、共有プール、追加課金を分けて設計する必要が出ている。

今回の API は、この複雑化した予算設計を「設定一覧」から「状態監視」へ進める。大規模企業では、budget を作っただけでは不十分だ。誰が上限に近いか、どの override が残っているか、どの cost center owner へ通知すべきかを、請求サイクル中に継続して見る必要がある。

## APIの役割をbudget設定と分ける

GitHub Changelog は、multi-user budget の per-user state を REST API で取得できるようになったと説明している。GitHub Docs の Budgets API では、enterprise の budget id に対して user states を一覧する endpoint があり、ページング、username 絞り込み、threshold の下限・上限指定を使える。

ここで重要なのは、この endpoint を budget 設定 API と同じものとして扱わないことだ。budget 設定は、上限、対象、適用範囲、停止条件を作る操作である。user states は、その設定が請求サイクル中にどの利用者へどう効いているかを見る観測 API である。両者を同じジョブで扱うと、変更権限と閲覧権限が混ざりやすい。

実装上は、少なくとも read-only の監視ジョブと、budget を変更する管理ジョブを分けるべきだ。監視ジョブは定期実行で user states を取得し、しきい値超過や override を通知する。管理ジョブは承認済みの変更だけを反映する。日本企業では、予算変更が購買・情シス・開発部門をまたぐため、この分離は監査説明にも効く。

また、API のレスポンスをそのまま「請求額」として扱わないほうがよい。user states は budget に対する利用者の現在地を見るためのデータであり、最終請求、usage report、cost center report とは役割が違う。[GitHub AI usage reportの項目設計](/blog/github-ai-usage-report-fields-2026/) と同じく、分析用途ごとのデータソースを分ける必要がある。

## しきい値監視の設計

最も自然な使い方は、消費率のしきい値監視である。`threshold_lower_bound` を使って80%以上のユーザーを取得し、90%以上を強めのアラートにする。100%到達後だけを拾う運用では遅い。Copilot の一部機能が止まってから増枠を議論すると、重要なリリースや障害対応に影響する可能性がある。

ただし、しきい値は全社一律にしないほうがよい。研究開発、SRE、プラットフォーム移行、セキュリティ修正、通常の業務アプリ開発では、AI Credits の消費理由が違う。たとえば通常部門は80%で本人通知、90%でチームリード通知とし、障害対応チームは90%で予算 owner 通知、95%で一時増枠判断へ回す、という差を付けられる。

通知には budget id だけでなく、社内台帳の情報を join するべきだ。budget id、cost center、対象 enterprise team、費用責任者、通知先、増枠承認者、停止時の代替手順を社内側に持つ。API は GitHub 上の状態を返すが、「誰が判断するか」は会社側のデータである。

また、消費率だけでなく、前回取得との差分も見るとよい。1日で10ポイント以上増えた利用者は、上限到達前でも確認対象にできる。短期間の急増は、長い cloud agent session、失敗再実行、高コストモデル選択、研修中の試行錯誤、CI連携の誤設定など、理由が分かれる。消費率と増加速度を分けると、通知の精度が上がる。

## overrideを技術負債にしない

user states に override 情報が含まれる点は、監査上かなり重要である。個別上限は必要な機能だ。大規模リファクタ、期限付き移行、セキュリティ対応、AI活用検証では、標準上限では足りない利用者が出る。しかし、例外が残り続けると、cost center 標準や universal budget の意味が薄れる。

日本企業では、override を「上限を上げた人」ではなく「期限付きの例外承認」として扱うべきだ。申請番号、理由、対象プロジェクト、承認者、開始日、終了日、月次レビュー要否を持たせる。user states API で override を検知し、社内申請に存在しないもの、終了日を過ぎたもの、所属が変わったものを棚卸しする。

ここで [cost center予算UI](/blog/github-copilot-cost-center-budgets-ui-2026/) は便利だが、UI だけでは棚卸しの自動化に限界がある。API で override を取得し、DWH や ticket system と突き合わせることで、例外の可視化ができる。監査部門に対しても、「例外はあるが、誰が承認し、いつ戻すかを追っている」と説明しやすい。

override のアラートは、単純な有無だけでなく、予算差分も見るとよい。標準上限が40ドルで override が400ドルの利用者と、標準上限が250ドルで300ドルの利用者ではリスクが違う。上限差、残額、消費速度、プロジェクト期限を合わせて、レビュー優先順位を作る。

## データモデルと保存期間

実装するなら、user states のスナップショットを日次で保存するのが現実的である。最低限のキーは、enterprise、budget id、budget name、username、cycle、current spend、limit、threshold ratio、override flag、取得時刻である。可能なら、cost center、enterprise team、部門コード、費用責任者、通知状態も別テーブルで持つ。

保存期間は、請求サイクルだけでなく監査要件に合わせる。短期のアラートだけなら30日から90日で足りる。しかし、半期の予算差異、部門別配賦、例外承認の検証、AI活用施策の効果確認に使うなら、少なくとも13か月は持ちたい。年度比較や監査対応を考えるなら、請求データと同じ保存ルールに寄せるほうがよい。

注意したいのは、user states が成果指標ではないことだ。AI Credits の高低は、開発成果や個人能力を直接表さない。高い利用は重要な作業の結果かもしれないし、無駄な再試行かもしれない。低い利用は効率的な利用かもしれないし、Copilot が定着していないだけかもしれない。人事評価ではなく、予算・運用・教育の判断材料として扱うべきだ。

データ連携では、GitHub API の取得失敗や権限エラーを明示的に扱う。監視ジョブが失敗した日に「上限接近者がいない」と見せるのは危険だ。取得成功件数、ページング完了、前日との差分、budget id の存在確認をログに残し、失敗時はデータ欠損として扱う。

## 既存のCopilot予算運用にどう組み込むか

既存運用がない企業は、まず3段階に分けるとよい。第一段階は可視化で、全 budget の user states を日次取得し、80%以上と override を一覧する。第二段階は通知で、budget owner と利用者へ段階的に知らせる。第三段階は変更管理で、増枠、停止、override 解除を ticket と連動させる。

すでに budget を設定している企業では、既存の alert と重複しないようにする。GitHub 側のメール通知、社内の請求アラート、DWH の月次レポート、ServiceNow の ticket が同じ事象を別々に通知すると、管理者はどれを見ればよいか分からなくなる。user states API は、日次または時間単位の「運用アラート」として位置づけるのがよい。

budget の種類も分ける。AI credit pool は含有枠を部門単位で守る。cost center user-level budget は1人の突出利用を止める。cost center budget は共有プール枯渇後の追加課金を制御する。user states API は、特に multi-user budget の利用者単位状態を見る。どの budget の user state なのかを通知本文に明記しないと、現場は「部門枠が危ない」のか「個人枠が危ない」のかを取り違える。

月次レビューでは、user states のアラート履歴と usage report を合わせて読む。アラートが多いが成果も大きい部門は、標準上限を見直す余地がある。アラートが多く、失敗再実行や高コストモデルの試行錯誤が多い部門は、モデル選択や agent 利用ガイドを整えるべきだ。アラートがほとんどない部門は、導入効果が出ていない可能性もある。

## 導入チェックリスト

1つ目は権限分離である。user states を読む job と budget を変更する job を分け、read-only token の利用を基本にする。変更系 token は承認済み workflow に閉じる。

2つ目は budget 台帳である。budget id、対象範囲、費用責任者、通知先、停止時の影響、増枠承認者、override 期限を社内側で持つ。

3つ目はアラート設計である。80%、90%、95%、100% のようなしきい値と、1日あたり増加率を組み合わせる。重要業務チームと通常チームで通知先と重みを変える。

4つ目は override 棚卸しである。API で override を検知し、申請情報、期限、所属、理由と突き合わせる。期限切れや孤立した例外は戻す。

5つ目はデータ品質である。ページング完了、取得件数、前回との差分、API失敗、budget id の消失を監視し、取得できなかった日をゼロ消費と誤解しない。

6つ目は説明責任である。user states は現在地、usage report は原因分析、請求データは最終金額と定義する。数字が違うことを前提に、用途ごとの正本を決める。

今回の API は、Copilot の予算管理を細かくするためだけの機能ではない。重要なのは、上限に達する前に、利用者、チーム、費用責任者が同じ情報で判断できるようにすることだ。日本企業が Copilot を開発基盤として使うなら、AI Credits の運用は請求後の集計ではなく、請求サイクル中の監視と例外管理へ移すべきである。

## 出典

- [Per-user states for multi-user budgets in the REST API](https://github.blog/changelog/2026-07-10-per-user-states-for-multi-user-budgets-in-the-rest-api/) - GitHub Changelog, 2026-07-10
- [Budgets - GitHub Enterprise Cloud REST API](https://docs.github.com/en/enterprise-cloud@latest/rest/billing/budgets?apiVersion=2026-03-10) - GitHub Docs
- [Per-user budgets for cost centers in the billing UI](https://github.blog/changelog/2026-07-07-per-user-budgets-for-cost-centers-in-the-billing-ui/) - GitHub Changelog, 2026-07-07
