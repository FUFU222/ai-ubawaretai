---
title: 'GitHub Code Quality GA、AI課金開始の運用線'
description: 'GitHub Code QualityのGAでAI Credits課金と品質ゲート運用が始まる。日本企業が有効化範囲、Actions minutes、Autofix承認をどう見直すか整理する。'
pubDate: '2026-07-20'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'CodeQL', 'SaaSコスト管理', '従量課金', '管理者設定', 'AIガバナンス']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月20日**、**GitHub Code Quality** を GitHub Enterprise Cloud と GitHub Team 向けに一般提供した。GitHub の説明では、Code Quality は CodeQL の決定的な解析と AI-assisted detection を組み合わせ、pull request 上で保守性や信頼性の問題を見つけ、Copilot Autofix による修正案も提示する。AI がコード出力量を増やすほど、レビューと品質管理の面を強くする必要がある、という位置づけだ。

この更新は、先週扱った [GitHub Code Quality見積もり](/blog/github-code-quality-license-estimate-2026/) の続報である。前回の主題は、GA 前に active committer ベースのライセンス影響を棚卸しすることだった。今回は、GA によって **課金が始まり、組織単位の展開、coverage 表示、ruleset による quality gate、API、AI findings** が実運用の対象になった点が重要である。

同じ流れは、[AI security detectionsのPR表示](/blog/github-ai-security-detections-pr-code-scanning-2026/) や [Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/) とつながる。GitHub の AI 開発基盤は、補完やチャットだけでなく、検査、修正提案、品質ゲート、請求管理へ広がっている。日本企業は「Copilot を使うか」だけでなく、「AI が増やすコードをどの仕組みで止め、直し、費用化するか」を決める段階に入った。

## 事実: GAで何が変わったか

GitHub Changelog によると、GitHub Code Quality は GitHub Enterprise Cloud と GitHub Team で一般提供になった。GitHub Enterprise Server では launch 時点で利用できない。Code Quality は単体の有料製品で、GitHub Advanced Security に同梱されるのではなく、補完的な製品として扱われる。

GA 時点で新しく強調された機能は四つある。第一に、organization-wide enablement と、複数リポジトリの maintainability / reliability score を見る org-level dashboard である。第二に、Cobertura XML 形式の既存 test report から code coverage metrics を pull request に表示する機能である。第三に、GitHub rulesets を使った quality gates で、coverage thresholds と evaluate mode を含む。第四に、repository enablement の管理と findings 取得に使う API である。

費用面では、GitHub は active committer 1人あたり月額10ドル、AI-powered work の usage-based billing、CodeQL analysis を走らせる GitHub Actions compute cost を示している。AI-powered work には AI-assisted detection と Copilot Autofix が含まれ、Copilot subscription がなくても利用できると説明されている。

また、public preview で Code Quality を使っていた企業は、移行や再設定は不要だとされる。一方で、billing は 2026年7月20日の GA から自動的に始まる。preview の勢いで広く有効化していた組織ほど、どこで Code Quality が有効なまま残っているかを確認する必要がある。

## 事実: AI findingsとCodeQL findingsは同じではない

GitHub Docs の Code Quality 説明では、Code Quality の結果は大きく二系統に分かれる。標準の findings は CodeQL quality analysis の結果で、pull request や default branch に出る。pull request では `github-code-quality[bot]` がコメントし、可能な場合は Copilot Autofix の修正提案を含む。

もう一方が AI-powered analysis である。Docs は、AI-powered analysis は rule-based な CodeQL analysis と違い、default branch に最近 push された files を対象にし、対応言語一覧を超えた問題を見つける場合があると説明している。表示面も分かれており、repository dashboard では Standard findings と AI findings が別に扱われる。

ここは運用上かなり重要だ。CodeQL findings は静的解析ルールと対象言語の範囲で説明しやすい。一方、AI findings は検出根拠や再現性、優先度付け、false positive の扱いを別に設計する必要がある。AI が見つけたから高優先度とは限らないし、AI が見つけられないから品質リスクがないとも言えない。

## 分析: 無料プレビューの判断はそのまま使えない

ここからは分析である。

日本企業で最初に起きやすい失敗は、preview 期間の設定をそのまま本番運用に持ち込むことだ。無料または低負担に見える期間は、対象を広げて価値を試す判断が合理的だった。しかし GA 後は、active committer、Actions minutes、AI Credits が同時に効く。便利だったから残す、では経理にもセキュリティにも説明しづらい。

特に active committer は、リポジトリ数よりも人の動きに依存する。少数の platform team が複数 repository を触る場合と、多数の外部委託メンバーが一時的に触る場合では、同じ有効化数でも費用の意味が違う。過去90日以内に push された commit が基準になるため、短期支援や兼務者、bot ではない automation account も棚卸し対象になる。

Actions minutes も別に見るべきだ。Code Quality の CodeQL analysis は GitHub Actions workflow として動く。monorepo、生成コードが多い repository、pull request 数が多い repository では、active committer ではなく scan cost と待ち時間が先に問題になることがある。self-hosted runner を使う場合も、ゼロコストではなく、runner capacity と運用負担に変わるだけである。

AI Credits はさらに見えにくい。Copilot Chat や Copilot cloud agent の使用量だけを追っていても、Code Quality の AI-assisted detection や Copilot Autofix が別経路で AI Credits を消費するなら、部門別の AI 開発基盤費を説明できない。[Copilot appのsecurity review](/blog/github-copilot-app-security-review-2026/) のような開発者起点の点検と、Code Quality のような repository 起点の検査を同じ予算表に並べる必要がある。

## 日本企業はrepo分類から始める

Code Quality GA 後の実務は、全社一律のオン・オフではなく、repository classification から始めるのが現実的である。外部公開 API、認証、決済、個人情報、業務基幹、AI agent が頻繁に変更を出す repository は優先度が高い。PoC、研修、休眠、サンプル、archive 予定の repository は、別枠で扱う。

分類ごとに決めるべき項目は、Code Quality の有効化、coverage threshold、ruleset の enforce / evaluate、Copilot Autofix の利用可否、AI findings の triage 担当、Actions minutes の上限、AI Credits の予算、例外承認の流れである。ここまで決めないと、品質機能を入れたのに誰も findings を処理しない、または費用だけが増える、という状態になりやすい。

quality gate は特に慎重に入れるべきだ。coverage threshold を ruleset に入れると、品質基準を pull request の合否に近づけられる。一方で、古い repository やテスト文化が弱いチームに一気に enforce すると、開発停止に近い摩擦が出る。GitHub が evaluate mode を用意している点は、日本企業の段階導入と相性がよい。まず影響を測り、閾値と対象 repository を調整してから enforce へ移るほうがよい。

Copilot Autofix も同じだ。修正案の生成はレビューを速くするが、仕様判断、権限、データ移行、障害時責任は自動化されない。低リスク repository では積極的に試し、重要 repository では domain owner や security reviewer の確認を必須にする。AI が作った修正を人間が承認する、という責任線を明文化すべきである。

## 今週やるべき確認

第一に、Code Quality が有効な organization と repository を出す。preview 中に全 repository へ広げた場合は、GA 後も残す理由を分類ごとに書く。GitHub Docs では、organization level の Repository access setting によって、全 repository、選択 repository、filter matching のような対象制御ができ、必要なら repository administrator に変更させない enforcement も使える。

第二に、7月20日時点の active committer と、直近90日の commit 実態を確認する。社員、外部協力者、enterprise-managed user、pending invitation、bot ではない機械アカウントを分ける。人数だけでなく、どの repository classification に紐づく人数なのかを見る。

第三に、Actions minutes と AI Credits を別の列で見る。Code Quality の価格は月額10ドルの active committer だけではない。GitHub Changelog と Docs は、AI-powered work の usage-based billing と CodeQL analysis の compute cost を別に示している。請求書の説明では、license、Actions、AI Credits を混ぜないほうがよい。

第四に、AI findings と Standard findings の処理 SLA を分ける。Standard findings は CodeQL ルールに基づく説明をしやすい。AI findings は初期運用では false positive と重大 finding の見極めに時間がかかる可能性がある。月次で findings 数、修正率、Autofix 採用率、却下理由を出すと、どの repository に残すべきか判断しやすい。

## まとめ

GitHub Code Quality GA は、コード品質機能の正式リリースであると同時に、AI 開発基盤の費用と統制がまた一段具体化した出来事である。CodeQL、AI-assisted detection、Copilot Autofix、coverage、rulesets、API が同じ運用面に載ることで、品質管理は pull request の会話だけではなく、組織の予算と標準化の問題になった。

日本企業が見るべき焦点は、Code Quality を導入するかどうかだけではない。どの repository に適用し、どの費用を誰が払い、AI findings を誰が triage し、Autofix をどの条件で受け入れるかである。7月20日の GA は、preview のまま残した設定を本番運用へ整理する期限として扱うべきだ。

## 出典

- [GitHub Code Quality is now generally available](https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available/) - GitHub Changelog, 2026-07-20
- [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality) - GitHub Docs
- [About GitHub Code Quality](https://docs.github.com/en/code-security/concepts/about-code-quality) - GitHub Docs
- [Enabling GitHub Code Quality](https://docs.github.com/en/code-security/how-tos/maintain-quality-code/enable-code-quality) - GitHub Docs
