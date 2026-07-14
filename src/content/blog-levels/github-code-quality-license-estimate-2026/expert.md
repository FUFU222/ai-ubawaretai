---
article: 'github-code-quality-license-estimate-2026'
level: 'expert'
---

GitHub の 2026年7月13日付 Changelog は、GitHub Code Quality の **license estimate** を public preview として提供し始めたことを告知した。Billing entity の Billing and licensing から Licensing を開くと、Code Quality card に consumed licenses と estimated monthly payment が表示される。狙いは明確で、2026年7月20日に Code Quality が paid product になる前に、enterprise 全体でどの程度の license impact があるかを把握できるようにすることだ。

この更新は、Code Quality を「品質改善機能」としてだけ見ている組織ほど重要である。GitHub Docs の billing ページでは、GA 後に active committer、GitHub Actions minutes、GitHub AI Credits の三つが別々に効くと説明されている。見積もり card はそのうち per-committer license cost だけを見るもので、Actions minutes、AI-powered capabilities の usage-based charges、個別割引は含まない。

したがって、管理者が読むべきなのは画面上の月額そのものではない。むしろ「この金額に入っていない費用と責任は何か」である。[Copilot予算API](/blog/github-copilot-budget-user-states-api-2026/) や [Copilot部門予算UI](/blog/github-copilot-cost-center-budgets-ui-2026/) で扱った Copilot 側の AI Credits 管理と、今回の Code Quality 側の有効化範囲を別の台帳で管理すると、AI 関連の開発基盤費用を説明しにくくなる。

## 費用モデルは単純なリポジトリ課金ではない

GitHub Code Quality の GA 後費用は、リポジトリ数だけでは読めない。Docs は active committer を、Code Quality が有効な repository に貢献した unique active committer として扱う。過去90日以内に push された commit が基準になり、GitHub App bot は除外される。利用者が複数 repository や複数 organization にまたがっても、組織または enterprise 全体で重複を避けて測る設計である。

この測り方は、規模の大きい日本企業では注意が必要だ。社員、協力会社、オフショア、短期支援、兼務の platform engineer、release train 用の人間アカウント、bot ではない automation account が混在する。Code Quality の対象 repository が増えるほど、「誰が active committer として課金対象になっているか」は、開発実態の棚卸しにもなる。

また、active committer あたり月額10ドルという価格だけで投資判断をすると危ない。GitHub Changelog は、この estimate が Actions minutes や AI-powered capabilities の usage-based charges を含まないと明記している。たとえば、大きな monorepo で CodeQL analysis が重く、PR 数も多い場合、Actions minutes の影響が license estimate より先に問題になることがある。逆に、AI-powered analysis や autofix を多く使う運用では AI Credits 側が見えてくる。

つまり、Code Quality の費用管理は、ライセンス、CI 実行基盤、AI 使用量の三層で見る必要がある。これは Copilot の座席数だけを見ていた頃の管理より複雑で、開発基盤チームと FinOps が同じデータを見る運用に寄せなければならない。

## Actions minutesとAI Creditsを分離して見る

GitHub Docs は、public preview 中でも Code Quality scan が GitHub Actions minutes を消費すると説明している。GA 後も、Code Quality scans は GitHub Actions workflows として実行され、self-hosted runners を使わない限り Actions minutes の対象になる。このため、preview 中に「Code Quality は無料」とだけ伝えると誤解が残る。無料なのは active committer usage や AI credits の一部であって、scan 実行の Actions cost はすでに発生し得る。

AI Credits についても分けて考えるべきだ。Docs は、Code Quality features that use AI models が AI Credits を消費し、1 AI credit = 0.01 USD と説明している。さらに Code Quality は、品質を安定させるために調整された model、prompt、system behavior の組み合わせを使い、model switching はサポートしない。ここは、開発者が Copilot Chat で軽いモデルを選ぶような節約策が使えない可能性を意味する。

この設計には合理性もある。Code Quality は、個人の質問応答ではなく、organization の品質基準や finding triage に関わる。モデル選択で結果が揺れすぎると、同じ repository に対する評価や修正提案の一貫性が落ちる。しかし、管理者から見ると、費用最適化の自由度が下がる。だからこそ、有効化する repository と使う機能を選ぶ必要がある。

Copilot Autofix も同じ文脈で見る。GitHub Docs は、Copilot Autofix が code scanning alert に対して修正提案を生成し、codebase と code scanning analysis を使うと説明している。これは [CodeQL AI検査](/blog/github-codeql-ai-prompt-injection-2026/) のような静的解析の拡張と相性が良い。一方で、修正提案を採用する判断は、仕様、権限、テスト、リリース責任を持つチーム側に残る。

## セキュリティ運用と費用統制を分けすぎない

Code Quality は請求だけの話ではない。GitHub の最近の更新を見ると、CodeQL の AI prompt injection query、secret scanning の detector type 名称整理、Copilot cloud agent の設定監査、Copilot code review、Autofix が同じ方向へ進んでいる。AI がコードを書く、レビューする、修正案を出すほど、GitHub 側の検査・統制面も AI 前提に広がる。

この流れを、機能ごとの導入可否だけで管理すると破綻しやすい。たとえば、セキュリティ部門が Code Quality を全 repository で有効化したい、FinOps が Actions minutes と AI Credits を抑えたい、開発チームが PR 待ち時間を減らしたい、という利害は自然に衝突する。どれも正しいが、判断軸が違う。

日本企業で実務的なのは、repository classification を先に作ることだ。外部公開 API、認証、課金、個人情報、社内基幹、AI agent が作るコード、OSS 公開、検証用、休眠、教育用のように分類し、Code Quality を必須、推奨、任意、無効のどれにするか決める。そこへ Actions minutes の上限、AI Credits の budget、Autofix の許可、required checks、manual reviewer を紐づける。

[GitHub secret scanning名称変更](/blog/github-secret-scanning-ai-detected-names-2026/) でも整理したように、AI-detected や generic pattern のような分類名は、監査や教育でそのまま効く。Code Quality も同じで、active committer、Actions minutes、AI Credits、Autofix、CodeQL analysis の意味を社内用語へ落とし込まないと、請求書の数字と現場の体感が結びつかない。

## GA前の実務チェックリスト

第一に、Code Quality card の estimate を export 可能な形で記録する。画面上の数字だけを見て終わらせず、対象 billing entity、取得日時、consumed licenses、estimated monthly payment、対象 organization を残す。7月20日以降に実請求との差分を説明するためである。

第二に、active committer の内訳を repository classification と突き合わせる。重要 repository の active committer は受け入れやすい。一方、archive 予定、PoC、研修、サンプル、legacy mirror に active committer が残っているなら、有効化を続ける理由を確認する。外部協力者や pending invitation の扱いも見る。

第三に、Actions minutes の履歴を `dynamic/github-code-scanning/codeql` workflow で確認する。Docs は preview 中の usage report でもこの workflow の消費を確認できると説明している。monorepo、生成コード、長い build、頻繁な PR を持つ repository は、license ではなく Actions 側から先に詰まる可能性がある。

第四に、AI Credits の budget policy と Code Quality を接続する。Copilot の cost center や user-level budget を整えていても、Code Quality の AI-powered features が別枠で増えるなら、部門別の説明が崩れる。Copilot seat、agentic workflow、Code Quality、Autofix をまとめて AI 開発基盤費として見せるほうが、経営や管理部門に説明しやすい。

第五に、Autofix の受け入れ条件を決める。低リスク repository では提案を積極的に試し、重要 repository では security reviewer や domain owner の確認を必須にする。AI が作った修正案であっても、人間が書いた修正と同じテスト、review、change management を通す。例外承認や false positive の扱いも記録する。

第六に、7月20日を境にした before/after のレポートを作る。preview 末日の有効化範囲、GA 初月の Actions minutes、AI Credits、active committer license、主要 finding 数、Autofix 採用数を並べる。費用だけを見ると削減圧力が強くなりすぎるが、finding や修正時間も一緒に見ると、残すべき repository を説明しやすい。

## 導入判断の落としどころ

Code Quality を全社一律で無効にするのは簡単だが、AI agent 時代のコード品質管理としては後退になり得る。逆に、preview の勢いで全 repository に残すのも雑である。落としどころは、リスクが高く、修正責任者が明確で、finding を処理する運用がある repository から残すことだ。

特に、AI アプリや agent が触る repository では CodeQL と Code Quality の価値が高い。prompt injection、secret、dependency、unsafe API use のような問題は、人間レビューだけでは見落としやすい。一方で、検査が増えるほど false positive や triage 負荷も増える。そこを Autofix や code review agent で補助するなら、AI Credits とレビュー責任もセットで決める必要がある。

管理者は、Code Quality estimate を「課金前の警告」としてではなく、「品質基盤の棚卸し表を作る入口」として使うべきだ。見積もりに含まれるもの、含まれないもの、有効化範囲、active committer、Actions minutes、AI Credits、Autofix の責任を分けて書けば、7月20日以降の請求と現場運用を同じ会話に載せられる。

## まとめ

GitHub Code Quality の license estimate 公開は、一般提供直前の費用可視化であると同時に、AI 開発基盤の運用成熟を促す更新である。見積もり card が示すのは active committer license の影響だけで、Actions minutes、AI Credits、discount は別で見る必要がある。

日本企業にとって重要なのは、Code Quality をオンにするかオフにするかの単純な判断ではない。repository の重要度、active committer の実態、CodeQL analysis の実行コスト、AI-powered Autofix の責任、Copilot 側の budget と合わせて、品質と費用を同じ設計図で管理することだ。7月20日の GA は、その棚卸しを始める明確な期限になる。

## 出典

- [GitHub Code Quality license estimate in public preview](https://github.blog/changelog/2026-07-13-github-code-quality-license-estimate-in-public-preview/) - GitHub Changelog, 2026-07-13
- [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality) - GitHub Docs
- [About GitHub Code Quality](https://docs.github.com/en/code-security/concepts/about-code-quality) - GitHub Docs
- [About Copilot Autofix for code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/copilot-autofix-for-code-scanning) - GitHub Docs
