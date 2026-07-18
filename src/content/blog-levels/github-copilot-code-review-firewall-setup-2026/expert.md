---
article: 'github-copilot-code-review-firewall-setup-2026'
level: 'expert'
---

GitHub の **2026年7月17日**の Copilot code review 更新は、PRレビューAIの governance surface を大きく広げるものだ。Changelog が示した変更は、head branch custom instructions、`REVIEW.md` / `GEMINI.md` / `CLAUDE.md` support、dedicated setup steps、default firewall、code review と cloud agent の runner configuration split である。これは、Copilot code review を単体の便利機能から、enterprise PR control plane の一部へ寄せる更新と見たほうがよい。

この更新は既存の GitHub Copilot enterprise control と連続している。[Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/) では、organization runner、content exclusion、custom instructions の統制を扱った。[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/) では、AI Credits と Actions minutes の二重管理を扱った。さらに [GitHub Copilot repo指標、PR効果を測る実務](/blog/github-copilot-repo-usage-metrics-ga-2026/) では、code review activity を repository 単位で観測する流れを扱った。

今回の変更は、その3つを実行環境レベルで接続する。repository-level metrics で「どこでAIレビューが走っているか」が見え、billing と Actions minutes で「いくらかかっているか」が見え、今回の setup / firewall / instructions で「どの条件で走らせているか」を制御できるようになる。

## Fact: custom instructionsがhead branch検証へ寄る

Changelog は、Copilot code review が custom instructions を pull request の head branch から読むようになったと説明している。対象には `copilot-instructions.md`、`*.instructions.md`、agent skills、`AGENTS.md` が含まれる。これにより、review instruction の変更を feature branch 上で試し、その PR のレビュー挙動で検証できる。

これは review rule development の速度を上げる。たとえば、TypeScript repository で「unsafe any を強く指摘する」、Java repository で「transaction boundary と null handling を見る」、金融系 repository で「PII logging と audit trail を見る」といった review instruction を、main へ merge する前に検証できる。

一方、head branch から読むことは trust boundary の変更でもある。review target と review policy が同じ branch に載るため、PR author が code change と instruction change を同時に出せる。善意の変更でもレビューの厳しさが変わるし、悪用を想定するなら、AI reviewer の観点を弱める instruction を紛れ込ませることも理論上は可能になる。

したがって、日本企業の enterprise repository では、instruction file を application code より高い governance tier に置くべきケースがある。`AGENTS.md`、`REVIEW.md`、`.github/copilot-instructions.md`、`*.instructions.md` は、review behavior configuration である。CODEOWNERS で platform team、security team、repository owner の承認を要求し、変更内容を PR template で明示させるとよい。

## Fact: REVIEW.md、GEMINI.md、CLAUDE.mdがreview contextに入る

Copilot code review が `REVIEW.md`、`GEMINI.md`、`CLAUDE.md` を読むようになったことは、AI instruction sprawl への現実的な対応である。多くの repository では、Copilot 用、Claude Code 用、Gemini CLI 用、人間 reviewer 用の文書が別々に増えつつある。今回の更新により、既存の review guideline や model-specific instruction を Copilot code review が拾える余地が広がる。

ただし、これを「どのAIにも同じファイルを書けば同じレビューになる」と解釈してはいけない。ファイルが読まれることと、同じ重みで守られることは違う。GitHub Copilot、Claude、Gemini は tool surface、system policy、context construction、repository integration が違う。`GEMINI.md` や `CLAUDE.md` が読まれるとしても、Copilot code review の最終挙動は Copilot 側の実装と repository context に依存する。

実務では、共通原則と tool-specific details を分けるのがよい。たとえば `REVIEW.md` に、人間にもAIにも共通する review policy を置く。`AGENTS.md` には agent が作業する際の repository setup と安全制約を置く。`GEMINI.md`、`CLAUDE.md` は各ツール固有の実行指示に絞る。Copilot code review が複数ファイルを読む場合でも、相互矛盾が少ない構造にする。

特に日本企業では、監査説明で「AIレビューがどの規約に基づいたか」を問われることがある。複数の instruction file がある場合、どれを正とするかを明記しないと、PRごとに根拠がぶれる。release-critical repository では、instruction hierarchy を README や governance doc に残しておくべきだ。

## Fact: copilot-code-review.ymlで実行準備を分離できる

Changelog は、`.github/workflows/copilot-code-review.yml` により、Copilot code review の runtime environment を設定できると説明している。dependencies の install、tooling、repository-level runner configuration、review に必要な preparation steps を定義できる。ファイルがない場合、`copilot-setup-steps.yml` が存在すれば fallback として使われる。

この分離は重要だ。Copilot cloud agent の task execution と、Copilot code review の review execution は似ているようで目的が違う。cloud agent は issue や task を進めるために作業環境を持つ。code review は PR の差分を読み、助言を返すために環境を持つ。両者が同じ setup steps を共有すると、review には不要な権限、依存関係、外部アクセスが混ざりやすい。

`copilot-code-review.yml` では、review に必要な最小限の setup に絞るべきだ。monorepo の package manager install、language version setup、generated type の準備、静的解析の metadata 取得などは有用である。一方で、本番 secret、顧客別 configuration、private network access、deployment credential、長時間 build は原則として持ち込まない。AI reviewer が正確に読むための環境と、本番へ接続できる環境は分ける。

また、setup file 自体も code review 対象になる。ここに `curl` で外部から script を落とす、権限の広い token を使う、内部 endpoint へ接続する、といった処理が入ると、AIレビューのための設定が新たな supply-chain risk になる。platform team は `copilot-code-review.yml` の許可パターンを lint し、危険な command を検出する仕組みを用意したほうがよい。

## Fact: firewall defaultとself-hosted runner例外

今回の発表で、Copilot code review は firewall behind で動くことが既定になった。Changelog は、review 中の network access を制限し、repository と organization の settings で cloud agent とは別に設定できると説明している。つまり、cloud agent には必要な外部アクセスを許可しつつ、code review はより閉じた環境で走らせる設計が可能になる。

ただし、self-hosted runners are not currently supported by the firewall という例外がある。self-hosted runner を設定している場合、code review は従来通り firewall なしで動く。これは、日本企業でよくある「GitHub-hosted runner より self-hosted runner のほうが統制しやすい」という直感を少し複雑にする。

self-hosted runner では、自社が network egress、proxy、DNS、artifact access、secret exposure、workspace cleanup、runner isolation を管理する。GitHub 側の firewall default に頼れないなら、runner group、subnet、egress allowlist、internal package registry、credential scoping を自社で設計する必要がある。

特に委託先が関わる repository、顧客別 repository、個人情報や金融データに近い repository では、「Copilot code review は firewall で閉じている」という説明をそのまま使う前に、runner type を確認するべきである。GitHub-hosted なのか、larger runner なのか、self-hosted runner なのかで、統制の責任境界が変わる。

## Governance model: 5つのcontrolを並べる

日本企業が今回の更新を実務へ落とすなら、Copilot code review を5つの control に分解するとよい。

第一は policy control である。どの repository で Copilot code review を有効にするか、誰の PR に適用するか、自動レビューか手動依頼か、branch protection とどう関係させるかを決める。Copilot のコメントは人間承認の代替ではないため、required reviewer、CODEOWNERS、security review gate と混同しない。

第二は instruction control である。`REVIEW.md`、`AGENTS.md`、`.github/copilot-instructions.md`、`*.instructions.md`、`GEMINI.md`、`CLAUDE.md` のどれを正とし、誰が変更できるかを決める。head branch で検証しやすくなった分、instruction change の approval flow が必要になる。

第三は runtime control である。`.github/workflows/copilot-code-review.yml` の許可範囲、dependencies、network、toolchain、runner profile を決める。review が必要とする最小権限と、cloud agent が作業に必要とする権限を分ける。

第四は network control である。firewall default を前提にする repository と、self-hosted runner 例外として自社管理する repository を分ける。外部 package registry、SaaS API、internal docs、artifact storage へのアクセスが本当にレビューに必要かを棚卸しする。

第五は cost and observability control である。Copilot code review activity は repository-level metrics で見えるようになりつつあるが、請求の正は billing report である。AI Credits、Actions minutes、runner cost、review count、Fix with Copilot handoff を同じ dashboard に置き、増加理由を説明できるようにする。

## 実装手順: 既存repositoryへの展開

第一段階は inventory である。GitHub Enterprise Cloud から Copilot code review enabled repository、runner configuration、organization settings、custom instructions files、CODEOWNERS、content exclusion、repository visibility を抽出する。ここに repository data classification と cost center を join する。

第二段階は diff risk の分類である。`AGENTS.md`、`REVIEW.md`、`GEMINI.md`、`CLAUDE.md`、`.github/copilot-instructions.md`、`.github/workflows/copilot-code-review.yml` を high-impact config として扱う。これらの変更を含む PR では、Copilot code review の結果とは別に、platform reviewer の承認を必須にする。

第三段階は setup minimization である。既存の `copilot-setup-steps.yml` を code review が fallback で使う場合、cloud agent 向けの重い処理や権限が入っていないかを確認する。必要なら `copilot-code-review.yml` を新設し、review 専用の軽い setup に分ける。

第四段階は runner/firewall matrix の作成である。repository ごとに GitHub-hosted、larger runner、self-hosted runner を分類し、firewall が効く前提でよいか、自社 egress control が必要かを明記する。self-hosted runner では、GitHub の firewall default ではなく自社 network policy が source of truth になる。

第五段階は metrics 連携である。[GitHub MobileでCopilotレビューコメント修正を依頼できる更新](/blog/github-mobile-copilot-review-comments-agent-2026/) のように、レビューコメントから cloud agent 修正へ渡す導線も増えている。code review count、Fix with Copilot 起動数、runner minutes、AI Credits、merge rate、re-review count を repository 別に見て、便利さと費用と品質を同時に評価する。

## Failure modes: 何が壊れやすいか

1つ目の failure mode は、instruction bypass である。head branch instruction を許した結果、PR内の instruction change がレビューの厳しさを変える。対策は CODEOWNERS、PR template、high-impact config label、platform approval である。

2つ目は、setup overreach である。レビューのために過剰な build、secret access、internal endpoint access を許してしまう。対策は `copilot-code-review.yml` の lint、allowlisted commands、secret-free review environment、network allowlist である。

3つ目は、firewall misunderstanding である。GitHub-hosted runner の default firewall を、self-hosted runner にも効くと誤解する。対策は runner/firewall matrix と、self-hosted runner の egress policy review である。

4つ目は、cost drift である。AIレビューが増え、setup steps が重くなり、Fix with Copilot までつながることで、AI Credits と Actions minutes がじわじわ増える。対策は repository-level metrics、billing report、budget、runner minutes を同じ月次レビューで見ることだ。

5つ目は、責任分界の誤解である。Copilot code review がコメントを出すほど、人間レビューが不要に見えてしまう。GitHub Docs の前提では、Copilot の review は人間承認そのものではない。branch protection、required approvals、security signoff は別に残す必要がある。

## まとめ

Copilot code review の customization and configurability update は、GitHub Copilot の enterprise adoption における小さくない転換点である。review instructions を branch 上で試せるようになり、既存の review guideline files を拾いやすくなり、code review 専用 setup と firewall default、runner split が入ったことで、PRレビューAIを制御可能な実行基盤として扱いやすくなった。

一方で、制御面が増えるほど、責任も増える。日本企業では、instruction file、setup workflow、runner、firewall、metrics、billing を別々に管理すると抜けが出る。Copilot code review を本番 repository に広げるなら、repository master にこれらを列として持ち、変更時の承認者と月次確認項目を決めるべきである。

今回の更新は、Copilot code review を「レビューコメントを出すAI」から、「PR監査環境を設計する対象」へ押し上げる。導入済みの組織ほど、まずは self-hosted runner の例外、instruction file の承認、`copilot-code-review.yml` の最小権限化から点検する価値がある。

## 出典

- [Copilot code review: Customization and configurability improvements](https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/) - GitHub Changelog, 2026-07-17
- [Using GitHub Copilot code review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review) - GitHub Docs
- [Repository-level GitHub Copilot usage metrics generally available](https://github.blog/changelog/2026-07-17-repository-level-github-copilot-usage-metrics-generally-available/) - GitHub Changelog, 2026-07-17
