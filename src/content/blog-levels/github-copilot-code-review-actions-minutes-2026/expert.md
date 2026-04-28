---
article: 'github-copilot-code-review-actions-minutes-2026'
level: 'expert'
---

GitHubが**2026年4月27日**に発表した「GitHub Copilot code review will start consuming GitHub Actions minutes on June 1, 2026」は、一見すると単なる価格告知です。しかし実務で見ると、これはかなり大きい変更です。なぜなら、Copilot code reviewが今後は**AI機能としての利用量だけでなく、GitHub Actions運用の一部としても課金対象になる**からです。

これまで多くのチームは、Copilot code reviewを「PRごとに付けられる便利なAIレビュー」として扱ってきました。ところが**2026年6月1日**からは、private repositoryでGitHub-hosted runnerを使う限り、レビュー回数がそのままActions minutes消費にもつながります。しかもGitHubは同時に、Copilot全体をrequest-based billingからusage-based billingへ移す方針を示しています。つまり、Copilot code reviewは今後、**AI CreditsとActions minutesの両方で見る機能**になります。

日本の開発組織にとって重要なのは、この変更が単なる値上げ話ではないことです。これは、Copilot導入を「開発者の便利機能」から「予算、runner、内部統制を伴う運用対象」へ引き上げる変更です。

## 事実: GitHubは6月1日から二層課金に切り替える

GitHub Changelogには、6月1日以降のCopilot code reviewについて次の構造が明記されています。

1. Copilot利用はAI Creditsベースのusage-based billingへ移る
2. private repositoryでGitHub-hosted runner上のcode review runsはGitHub Actions minutesを消費する

ここで読み違えてはいけないのは、「Copilot code reviewがActionsに統合された」というより、**Copilot code reviewの一部コストがActionsの請求面にも現れる**ということです。レビューそのものはCopilot機能ですが、実行の裏側にあるagentic tool-calling architectureがGitHub Actions上で動くため、GitHubはその実行コストを従来より明示的に回収する形にした、と見るのが正確です。

同じChangelogでは、public repositoryには変更がないことも案内されています。したがって、影響の中心はオープンソースではなく、**private repositoryで日常的に開発を進めている企業やプロダクト組織**です。

## 事実: 影響対象はProからEnterpriseまで広い

この変更は一部の大企業プランだけの話ではありません。GitHub Changelogでは、対象プランとして次が列挙されています。

- GitHub Copilot Pro
- GitHub Copilot Pro+
- GitHub Copilot Business
- GitHub Copilot Enterprise

つまり、個人開発者の有料プランから大規模組織まで広く影響します。さらに重要なのが、**非ライセンス利用者のPRに対するreviewも含まれる**ことです。GitHubはすでに、組織管理者が2つのポリシーを有効化すれば、Copilot seatを持たないメンバーのPRにもCopilot code reviewを適用できるようにしています。

GitHub Docsでは、その仕組みを次のように説明しています。

- Premium request paid usage を有効化する
- “Allow members without a Copilot license to use Copilot code review in GitHub.com” を有効化する

この設定が入っている組織では、開発者以外のPRにもレビュー網を広げられます。便利ですが、6月1日以降はそこにAI CreditsとActions minutesの両方が効いてきます。つまり、レビューカバレッジの拡大はそのまま運用コストの拡大でもあります。

## 事実: runner選択はコスト設計そのものになる

GitHub Docsの料金ページは、ここでかなり重要です。そこでは、**GitHub-hosted runnerで動くCopilot code review runsはActions minutesを消費する**一方、**self-hosted runnerはActions minutesを消費しない**と書かれています。また、larger runnerは標準のGitHub-hosted runnerとは異なる料金体系です。

このため、6月以降はrunner設計がそのままコスト設計になります。

- GitHub-hosted runner: 導入は速いが、private repositoryでのreview頻度がそのままminutesへ跳ねやすい
- self-hosted runner: minutesは回避できるが、基盤運用と監査責任を自組織で負う
- larger runner: 実行性能は上げられるが、単価設計まで含めて別計算が必要

特に日本企業では、self-hosted runnerを「安いから選ぶ」だけでは足りません。コードレビューは機密コードを扱うため、実行ノードの権限、ネットワーク境界、ログ保全、障害時の責任範囲まで問われます。minutesの請求を避けても、**インフラ運用コストと監査コスト**が別で立つからです。

## 事実: 6月1日までは旧運用だが、5月中に観測基盤を作る必要がある

GitHubは、**6月1日までは従来どおりPRU中心で、Actions minutesは消費しない**とも明記しています。これは切り替え日が明確だという意味で助かります。

ただし、料金ページを見ると、GitHubは6月以降の観測方法まで先に案内しています。たとえば、

- GitHub Actions metricsでは `copilot-pull-request-reviewer` workflow を見る
- Billing usage reportでは `workflow_path` でcode review由来の実行を追う
- 6月1日以降は `workflow_path` の識別値が変わる

ここから分かるのは、GitHubがこの変更を単なる価格改定ではなく、**請求と可視化の運用変更**として扱っていることです。逆に言えば、企業側も5月中に「どのrepositoryで何件走っているか」「pushごと再レビューが何件あるか」を見える化しておかないと、6月の請求を正しく読めません。

## 分析: 影響が最も大きいのは“自動レビュー全面展開”の組織

ここからは分析です。

今回の変更でいちばん影響を受けやすいのは、Copilot code reviewをかなり積極的に自動化している組織です。GitHub Docsでは、自動レビューのトリガーとして少なくとも次が存在します。

- Open状態のPR作成時
- DraftからOpenへ変えた時
- 新しいpushごと
- Draft PRの段階

便利ですが、private repository中心の企業では、これらはそのままreview run数の増加要因です。特にmonorepoや小刻みpushの文化があるチームでは、**レビューの価値が高い一方で、minutes消費の立ち上がりも速い**はずです。

したがって、6月以降は「自動レビューをONにするか」ではなく、次のように粒度を下げて決めるべきです。

- どのrepositoryだけ自動レビューを有効化するか
- draft段階でレビューさせるか
- pushごと再レビューをどこまで許すか
- 非ライセンス利用者のPRにも適用するか

この設計をせずに全社展開すると、レビュー自動化は進んでも、予算説明が後追いになります。

## 分析: 日本企業では請求責任の分断が起きやすい

日本企業特有の論点として、請求責任の分断があります。CopilotのseatやAI Creditsは開発部門が認識していても、GitHub Actions超過分はプラットフォームチームや情シスが持っている、という構図は珍しくありません。

今回の変更で起こり得るのは、次のようなねじれです。

- 開発部門はレビュー品質向上のため自動レビューを拡大する
- Actions予算を持つ側は、minutesの急増を後から見る
- 非ライセンス利用者への展開まで進んでいると、利用主体と請求主体がさらにずれる

この問題は機能の良し悪しでは解決しません。必要なのは、**Copilot code reviewを誰のKPIで拡大し、誰の予算で支えるかを先に固定すること**です。GitHub Changelogが「billing administrators and engineering leads に共有してほしい」とわざわざ書いているのは、この構図を前提にしているからです。

## 分析: self-hosted runnerは節約策でもあり、統制策でもある

self-hosted runnerはminutesを消費しないため、コスト回避策として語られがちです。ただ、日本市場ではそれ以上に、**統制上の都合で選ばれる可能性**があります。

たとえば次のような組織です。

- 金融、医療、公共などで実行基盤の所在や監査証跡を厳しく見たい
- GitHub-hosted runnerに出すコード範囲を最小化したい
- 社内ネットワークや専用接続内でreview関連処理を閉じたい

こうした組織では、self-hosted runner移行はminutes回避だけでなく、ガバナンス整備の文脈でも合理性があります。ただし、その場合でも「安くなる」より先に、**保守責任と障害責任が自分たちへ移る**ことを織り込む必要があります。

## 分析: いま決めるべきなのは停止ではなく“レビュー密度”

今回の変更を受けて、Copilot code reviewを止めるべきだとまでは言えません。むしろ多くの組織では、価値が高い場面に絞って密度を上げる方が現実的です。

たとえば、次のような切り方は合理的です。

- 変更影響が広いrepositoryだけ自動レビュー
- 軽微なPRは手動レビュー中心
- pushごとの再レビューは高リスクrepositoryのみに限定
- 非ライセンス利用者のPRは、外部協力者や非エンジニア投稿が多い組織だけ有効化

要するに、今後のCopilot code reviewは「全件に均一に掛けるもの」ではなく、**レビュー価値とコストのバランスを設計する対象**になります。

## 日本の開発組織が今月中にやるべき実務

最後に、実務としては次の順で十分です。

1. private repositoryでのCopilot code review設定を棚卸しする
2. 自動レビュー、draftレビュー、pushごと再レビューの有無を一覧化する
3. GitHub Actions metricsとbilling reportでreview由来の実行を分離して観測する
4. GitHub-hosted / self-hosted / larger runnerの方針を決める
5. AI CreditsとActions minutesの予算責任者を明確化する

この5つを先にやれば、6月1日以降に「思ったより高かった」「どのPRが増やしたのか分からない」という事故はかなり減らせます。

## まとめ

GitHubの**2026年4月27日**の発表は、Copilot code reviewの価値を否定するものではありません。むしろ、コードレビューAIを本格運用に乗せるために、**利用量と実行基盤コストの両方を見える形へ出した**更新です。

日本の開発組織にとっての論点は、Copilot code reviewを使うか使わないかではありません。**どのPRで使うのか、どのrunnerで動かすのか、誰の予算で持つのか**です。そこまで設計して初めて、Copilot code reviewは便利機能ではなく、予算と統制を両立した開発基盤として扱えるようになります。

## 出典

- [GitHub Copilot code review will start consuming GitHub Actions minutes on June 1, 2026](https://github.blog/changelog/2026-04-27-github-copilot-code-review-will-start-consuming-github-actions-minutes-on-june-1-2026/) — GitHub Changelog, 2026-04-27
- [About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review) — GitHub Docs
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) — GitHub Docs
- [GitHub Copilot plans](https://github.com/features/copilot/plans) — GitHub
