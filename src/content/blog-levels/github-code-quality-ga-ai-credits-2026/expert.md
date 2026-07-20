---
article: 'github-code-quality-ga-ai-credits-2026'
level: 'expert'
---

GitHub Code Quality の 2026年7月20日 GA は、CodeQL ベースの品質解析が正式製品になったというだけの話ではない。GitHub は、AI accelerates code output という前提を置き、Code Quality を「増えるコードを信頼して ship するための仕組み」として説明している。CodeQL の deterministic analysis、AI-assisted detection、Copilot Autofix、coverage、rulesets、API が同じ面に載ったことで、GitHub 上の品質管理は AI 開発基盤の統制レイヤーに近づいた。

このサイトでは直前に [GitHub Code Quality見積もり](/blog/github-code-quality-license-estimate-2026/) を扱った。そこでは、7月20日の GA 前に active committer の見積もりを確認し、Actions minutes と AI Credits は別に見るべきだと整理した。今回の GA では、その見積もりが実請求と実運用に変わる。さらに、[AI security detectionsのPR表示](/blog/github-ai-security-detections-pr-code-scanning-2026/) や [Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/) と合わせると、GitHub がコード生成後の検査・修正・費用化まで一体で押さえに来ていることが分かる。

日本企業にとっての論点は、Code Quality を入れるか入れないかではない。どの repository を対象にし、どの findings をどの SLA で処理し、AI findings と CodeQL findings をどう区別し、Copilot Autofix をどの承認線で受け入れ、license / Actions / AI Credits をどの部門へ説明するかである。

## GAで製品境界がはっきりした

GitHub Changelog は、Code Quality が GitHub Enterprise Cloud と GitHub Team で一般提供になったと発表した。GitHub Enterprise Server では launch 時点で利用できない。Code Quality は GitHub Advanced Security に含まれる機能ではなく、補完的な standalone paid product として扱われる。

この製品境界は重要である。セキュリティ部門が GitHub Advanced Security を契約済みでも、Code Quality の費用や有効化範囲は別に考える必要がある。逆に、GitHub Team でも対象になっているため、Enterprise Cloud だけの高度機能と見ていると、小規模な開発組織でも請求と運用の論点を見落とす。

GA で追加・強調されたものは、個別 PR のコメントだけではない。organization-wide enablement、org-level dashboards、Cobertura XML 形式の test report から pull request に出す coverage metrics、GitHub rulesets の quality gates、coverage thresholds、evaluate mode、repository enablement と findings 取得の API が含まれる。これは、品質管理を個別チームの善意から、組織の設定と監査に移す更新である。

public preview 利用者について、GitHub は移行や再設定は不要だと説明している。これは運用上は便利だが、同時に危険でもある。何もしなくても動き続け、7月20日から billing が始まるからだ。preview で試すために広く有効化した repository が、そのまま本番課金対象になる可能性を前提に見るべきである。

## Findingsの種類を混ぜない

Code Quality の findings は、監査設計上、少なくとも Standard findings と AI findings に分けて扱うべきである。GitHub Docs は、Standard findings を CodeQL quality analysis の結果として説明している。pull request では `github-code-quality[bot]` がコメントし、可能な場合は Copilot Autofix の修正提案が添えられる。default branch でも Code quality ページに結果が出る。

一方、AI-powered analysis は最近 default branch に push された files を対象にし、repository dashboard の AI findings に表示される。Docs は、対応言語一覧を超えて問題を見つける場合があると説明している。つまり、対象範囲、検出根拠、説明可能性、再現性は CodeQL の rule-based analysis と同じではない。

この違いを現場に伝えないと、二つの誤解が起きる。第一は、AI findings を CodeQL ルールと同じ重みで blocker にしてしまうことだ。初期運用では false positive、チーム固有の設計判断、生成コードや migration code への過剰反応を評価する期間がいる。第二は、AI findings を参考情報として軽く見すぎることだ。AI が見つける maintainability や reliability の問題は、静的ルールだけでは拾いにくい smell を含む可能性がある。

実務では、Standard findings、AI findings、coverage alerts、Autofix suggestions を別の列に分ける。各列に owner、SLA、dismissal reason、required reviewer、metrics を持たせる。たとえば Standard findings は code owner が2営業日以内、AI findings は初月は platform quality team が triage、coverage gate は evaluate mode で30日観測、Autofix は低リスク repository のみ即時採用可、といった運用にする。

## 課金モデルはFinOpsだけの話ではない

Code Quality GA 後の費用は三層である。active committer license、GitHub Actions minutes、GitHub AI Credits だ。Changelog は active committer あたり月額10ドル、AI-powered work の usage-based billing、CodeQL analysis の compute costs を挙げている。Docs は、GA 後に Code Quality features that use AI models が AI Credits を消費し、1 AI credit = 0.01 USD であること、model switching はサポートされないことも説明している。

model switching ができない点は、開発者体験より管理者体験に効く。Copilot Chat なら軽いモデルを選ぶ、premium model を避ける、といった使い分けを考えられる。しかし Code Quality は、分析品質を保つために調整された model、prompt、system behavior の組み合わせを使う製品であり、安いモデルへ切り替えて費用を抑える設計ではない。費用調整は repository selection、AI-powered capabilities の利用範囲、Autofix 採用運用で行うことになる。

Actions minutes も、請求だけでなく開発速度に関係する。CodeQL analysis が重い repository で pull request ごとに待ち時間が増えると、品質向上のために導入したはずの機能が cycle time を伸ばす。self-hosted runner を使えば GitHub-hosted minutes は抑えられるが、runner の capacity planning、security hardening、cache、network access、failure handling は自社責任に寄る。

active committer は、組織設計の棚卸しにもなる。過去90日以内に push された commit が基準になるため、外部委託、兼務者、短期支援、release engineer、bot ではない automation account がどの repository に残っているかが見える。Code Quality の費用を下げるためだけに人を外すのは本末転倒だが、休眠 repository や mirror repository まで有効化しているなら、対象整理は合理的である。

## Copilot Autofixは承認責任を消さない

Copilot Autofix は、Code Quality の価値を分かりやすくする機能である。finding を出すだけなら triage backlog が増えるが、修正案が添えられれば developer は早く直せる可能性がある。GitHub の発表でも、Code Quality は pull request で問題を見つけ、Copilot Autofix が merge 前に確認できる修正案を提示すると説明されている。

しかし、Autofix を「AI が直すから安全」と読むのは危ない。修正案は、コード局所の問題を直しても、仕様、互換性、データ移行、権限、監査要件、顧客影響を保証しない。AI が作った修正でも、人間が書いた修正でも、テスト、review、release note、rollback plan、change approval は同じように必要である。

日本企業では、Autofix の扱いを repository classification に紐づけるとよい。低リスクな internal tool では Autofix suggestion を通常レビューで採用できる。顧客データや決済、認証、医療・金融関連の repository では、domain owner または security reviewer の確認を必須にする。生成された修正がテストを追加していない場合は、採用前に人間がテスト観点を足す。

[Copilot appのsecurity review](/blog/github-copilot-app-security-review-2026/) のような開発者起点のレビューと、Code Quality の repository 起点の検査は、役割を分けて使うべきだ。前者は作業中の自己点検に向く。後者は組織が定めた品質基準を pull request と default branch に適用する面である。両方を入れるなら、同じ finding が重複したときの処理、AI Credits の帰属、レビュー責任を決める必要がある。

## Quality gateはevaluate modeから入る

GA で ruleset を使った quality gates が明確になった点は大きい。coverage thresholds を含む quality gate は、品質基準を「お願い」から「merge 条件」に近づける。大企業では、これがなければ repository ごとに運用品質がばらつく。

ただし、いきなり enforce すると失敗しやすい。legacy code、test debt、monorepo、外部委託チーム、生成コード、移行中の repository では、coverage threshold や findings blocker が現実と合わないことがある。evaluate mode を使い、最初は merge を止めずに影響を測る期間を置くべきである。

評価期間では、repository ごとに四つを見る。第一に、どの言語・ディレクトリで findings が多いか。第二に、coverage threshold が既存の test culture と合っているか。第三に、Actions minutes と waiting time がどれだけ増えるか。第四に、Autofix が実際に採用され、修正時間を短縮しているか。これらを見ずに全社 enforce すると、品質基準ではなく開発摩擦として受け止められる。

品質 gate の導入順序は、重要 repository からではなく、重要で、かつ owner と修正 SLA が明確な repository から始めるほうがよい。重要でも owner が曖昧なら findings は滞留する。低重要度でも owner が明確なら、運用練習には向く。Code Quality は検査機能であると同時に、品質運用の maturity を映す鏡になる。

## APIは棚卸しと監査に使う

GA で repository enablement と findings 取得の API が挙げられたことは、手作業運用から抜けるために重要である。Code Quality を数十から数百 repository に広げるなら、UI で確認するだけでは足りない。対象 repository、enabled/disabled、findings count、Autofix suggestion、coverage status、ruleset status を定期取得し、社内の開発基盤台帳や FinOps dashboard と合わせる必要がある。

日本企業では、GitHub organization が事業部ごと、子会社ごと、プロダクトごとに分かれていることが多い。さらに委託先や共同開発先が入ると、どの billing entity で費用が出るか、誰が owner か、どの security baseline を適用するかがずれる。API で機械的に棚卸しできることは、請求だけでなく、監査対応にも効く。

最低限のレポート列は、organization、repository、classification、Code Quality enabled、active committer count、Actions minutes、AI Credits、Standard findings、AI findings、Autofix suggestions accepted、coverage status、ruleset mode、owner、exception expiry である。ここまで持てば、経営には費用と効果を、セキュリティには未処理リスクを、開発チームには次の改善箇所を説明できる。

このレポートは月次だけでは遅い場合がある。GA 初月は週次で見たほうがよい。特に 7月20日以降は、preview 中の有効化範囲がそのまま請求に変わるため、最初の数週間で休眠 repository、PoC repository、owner 不明 repository を整理する価値がある。

## 日本企業向けの導入順序

第一段階は inventory である。Code Quality が有効な repository と active committer を一覧にする。GitHub Team / Enterprise Cloud の対象、GitHub Enterprise Server の対象外、外部協力者、bot ではない automation account を分ける。前回の estimate と GA 後の実績を並べる。

第二段階は classification である。repository を、critical、regulated、customer-facing、internal business、developer tooling、AI-generated-heavy、PoC、training、archive 予定のように分ける。分類ごとに Code Quality の有効化、AI findings の処理、Autofix の採用条件、coverage threshold を決める。

第三段階は observe である。ruleset は evaluate mode から始める。30日ほど、findings、coverage、Actions minutes、AI Credits、cycle time、Autofix 採用率を見る。ここで「費用が高いから切る」だけでなく、「修正率が高く、後工程 defects が減る repository には残す」という判断を入れる。

第四段階は enforce である。owner、SLA、例外承認、budget が揃った repository から quality gate を強める。coverage threshold は一律値ではなく、repository の現状から段階的に上げる。AI findings は初期から blocker にせず、重大度と再現性が見えたカテゴリから扱いを固める。

第五段階は budget integration である。Copilot seat、Copilot Chat、cloud agent、Copilot app、Code Quality、AI-assisted detection、Autofix をまとめて AI development platform cost として見る。[Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/) で整理したように、AI Credits は利用面ごとに説明できなければ、現場改善ではなく予算不安として扱われる。

## まとめ

GitHub Code Quality GA は、AI 時代のコード品質を GitHub の pull request、default branch、rulesets、billing、API に接続する更新である。正式提供によって、preview の試行錯誤は、本番の費用、品質 gate、監査、責任分界へ変わった。

日本企業が取るべき姿勢は、全社一括導入でも全面停止でもない。repository classification を作り、Standard findings と AI findings を分け、Autofix の承認責任を決め、Actions minutes と AI Credits を別列で見て、evaluate mode から quality gate を育てることだ。GitHub Code Quality は単体の品質機能ではなく、AI が増やすコードを企業がどう管理するかを試す実務基盤になった。

## 出典

- [GitHub Code Quality is now generally available](https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available/) - GitHub Changelog, 2026-07-20
- [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality) - GitHub Docs
- [About GitHub Code Quality](https://docs.github.com/en/code-security/concepts/about-code-quality) - GitHub Docs
- [Enabling GitHub Code Quality](https://docs.github.com/en/code-security/how-tos/maintain-quality-code/enable-code-quality) - GitHub Docs
