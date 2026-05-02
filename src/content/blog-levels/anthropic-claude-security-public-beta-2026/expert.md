---
article: 'anthropic-claude-security-public-beta-2026'
level: 'expert'
---

Claude Security の公開ベータは、Anthropic が Claude Code 周辺のセキュリティ機能を、開発者の補助コマンドから組織的な AppSec 運用へ押し広げる動きとして見るべきだ。公式ヘルプ上の説明はシンプルだが、導入チュートリアルと Claude Code の既存 review 機能を並べると、かなり具体的な製品境界が見えてくる。

結論から言うと、Claude Security は SAST の置き換えではない。PR review の置き換えでもない。より正確には、**リポジトリ単位のセキュリティ backlog を AI エージェントで初期分析し、修正セッション、export、webhook、監査証跡へつなぐ運用面**だ。日本企業で導入価値が出るのは、検知精度の一点突破ではなく、脆弱性対応の初動と説明責任をどれだけ圧縮できるかにある。

同じ Anthropic の流れとしては、[Claude Platform on AWS](/blog/anthropic-claude-platform-aws-2026-04-22/) が調達とクラウド統制に寄った発表だったのに対し、Claude Security は開発リポジトリとセキュリティ運用に直接入る発表だ。[Claude for Creative Work](/blog/anthropic-claude-creative-work-design-2026/) が制作工程の接続を狙ったのと同じように、Claude Security は脆弱性対応工程の接続を狙っている。

## 事実: findings は開発者向けアラートではなく運用オブジェクトに近い

公式ヘルプでは、Claude Security の finding には title、details、location、impact、reproduction steps、recommended fix、severity、status、category、repository、branch、date created が含まれるとされている。この列挙は地味だが重要だ。これは単なる lint comment ではなく、チケットや監査ログに変換しやすい粒度のオブジェクトだからだ。

特に reproduction steps と recommended fix が同じ finding に含まれる点は、従来のセキュリティ運用の詰まりに対応している。多くの組織では、SAST や dependency scanner がアラートを出しても、その後に AppSec 担当が再現可否、影響範囲、修正方針を手で調べる。開発チームに渡す前に「これは本当に直すべきか」を整理しなければならない。Claude Security は、この初期 triage の一部を AI で先に組み立てる製品だと読める。

重大度の扱いも同じだ。公式ヘルプでは、severity はカテゴリそのものではなく、対象コードベースでの exploitability に基づくと説明されている。これは、ルールベースの scanner が苦手にしがちな文脈判断を取りに行く設計である。未認証公開 API の command injection と、内部運用画面の特定 role 配下の入力不備は、同じカテゴリでも対応優先度が違う。Claude Security がこの差を見に行くなら、価値は検出数より「優先度付き backlog の質」に出る。

## 事実: 導入条件はセキュリティ製品らしく重い

導入チュートリアルでは、Claude Enterprise account、Claude Code on the Web、Extra Usage、Anthropic GitHub App、ユーザーごとの premium seat が前提として挙げられている。さらに現時点では GitHub.com の repository が対象で、管理者が Anthropic GitHub App に対象 repository への権限を与える必要がある。

これは、個人向けの便利機能ではなく、企業内で権限管理と費用管理を通して使う製品であることを示している。日本企業ではここが最初の分岐になる。GitHub.com を標準化している SaaS 企業なら評価しやすい。一方で、GitHub Enterprise Server、GitLab、Bitbucket、Azure DevOps、社内 Git を使う組織では、すぐには全社対象にならない。

費用面も同じだ。公式 FAQ では、Claude Security の scan は直接トークンコストのみで課金され、追加 platform fee はないと説明されている。しかしチュートリアルでは Extra Usage を有効にし、scan の size と回数に応じて cost が変わるため spend limit を設定するよう案内している。これは固定費の scanner ではなく、AI 推論コストを前提にした security workflow だ。利用頻度、対象 scope、scan effort、review 体制を一緒に設計しないと、費用と backlog の両方が膨らむ。

## 事実: Claude Code の security review とは別レイヤー

Claude Code には以前から security review 系の機能がある。Automated Security Reviews in Claude Code は、`/security-review` コマンドや GitHub Actions で common vulnerability patterns を見る機能として説明されている。Code Review for Claude Code は、GitHub pull request を対象に、複数の specialized agents が diff と周辺コードを分析し、logic errors、security vulnerabilities、edge cases、regressions を inline comments として出す research preview だ。

この2つと Claude Security の違いは、対象タイミングと成果物にある。

`/security-review` は開発者が手元や CI の中で使う on-demand check に近い。Code Review は PR を merge する前の変更差分レビューに近い。Claude Security は、既存 codebase 全体や repository scope を選び、scan history と findings を管理し、export と webhook を持つ。つまり、**開発プロセス内の review ではなく、セキュリティ backlog 管理の入口**だ。

この区別を間違えると、導入評価も失敗しやすい。Claude Security に「PR の全バグを防ぐ」ことを期待すると過大評価になる。逆に、SAST と同じ検出件数で比較しても本質を外す。見るべき指標は、high severity finding の妥当性、再現手順の使いやすさ、修正案のレビュー工数、false positive の dismiss 理由の残しやすさ、Jira や Slack や社内 GRC への連携しやすさだ。

## 考察: 日本企業で効くのはセキュリティ担当の時間配分

日本の多くの開発組織では、AppSec 専任者が少ない。プロダクト数、repository 数、外部委託、レガシー基盤が増える一方で、全ての脆弱性アラートを専門家が初期調査する余裕はない。結果として、SAST は導入済みでも未対応アラートが積み上がり、重要なものと雑音が混ざる。

Claude Security が価値を出す可能性があるのは、この時間配分だ。AI が scan し、finding ごとに再現手順と影響と修正方針を作り、担当者はそれをレビューして owner と期限を決める。完全自動修正ではなく、**セキュリティ担当を初期調査者から判断者へ寄せる**使い方である。

この方向性は、[GitHub Dependabot の AI エージェント修復](/blog/github-dependabot-ai-agent-remediation-2026/) と同じ市場変化に属する。GitHub は dependency alert から AI agent に修復 PR を作らせる導線を出し、Anthropic は repository scan から Claude Code remediation session に進む導線を出している。どちらも、検知と修復の間に残る人力の谷を狙っている。

日本企業では、この谷が特に深い。セキュリティ担当は事業部や開発チームごとの文脈をすべて把握していない。開発チームはセキュリティ用語や exploitability の判断に自信がない。委託先が絡むと、責任分界と証跡がさらに必要になる。Claude Security が finding を構造化し、export と webhook で既存運用に流せるなら、ここに現実的な価値がある。

## 考察: No ZDR と GitHub 限定は軽視できない

一方で、導入のハードルは明確だ。公式 FAQ では No Zero Data Retention とされ、法律上必要な場合や利用ポリシー違反対応のために Anthropic がデータを保持する場合があると説明されている。これは、セキュリティ製品としては無視できない制約だ。

日本の金融、公共、医療、通信、製造の一部では、コードそのものが機密情報であり、脆弱性の存在も機密情報になる。No ZDR の条件で、どの repository を scan してよいかは慎重に切るべきだ。最初から crown jewel の repository を対象にするのではなく、外部公開済みサービス、低機密な社内ツール、または already cloud-hosted な GitHub repository から始める方が現実的だ。

GitHub.com 限定も同様だ。GitHub Enterprise Cloud を使っていても、IP allowlist、Enterprise Managed Users、repository 権限、GitHub App の install 権限などが絡む。Code Review の setup ドキュメントでも、GitHub Enterprise Cloud の IP restrictions や GHES の公開到達性について注意が書かれている。Claude Security でも同様に、モデル性能以前に GitHub App が repository を読めるかが成否を分ける。

## 考察: AI セキュリティスキャンの評価指標を変える必要がある

Claude Security のような agentic scan を評価するとき、従来の scanner と同じ指標だけでは足りない。もちろん、true positive、false positive、false negative、coverage は必要だ。しかし、それだけでは AI らしい価値とリスクを測れない。

追加で見るべき指標は次のようなものだ。

1. high severity finding の説明が code owner に伝わるか。
2. reproduction steps が手元で検証可能か。
3. recommended fix が最小変更に収まっているか。
4. remediation session が既存テストを壊さず patch を出せるか。
5. dismissed finding の理由が次回 scan に効くか。
6. export した CSV や Markdown が監査証跡として使えるか。
7. webhook から既存の ticketing や notification に自然につながるか。
8. scan effort と費用が repository size に対して予測可能か。

特に日本企業では、6 と 7 が重要になる。セキュリティ対応は「直した」だけでは終わらない。監査、委託先管理、顧客説明、ISMS、SOC2、金融庁対応、社内リスク委員会などに、判断の証跡を出せる必要がある。Claude Security が export と webhook を持つことは、モデル精度と同じくらい運用上の意味を持つ。

## 導入シナリオ: 最初は週次 scan と owner 制に絞る

現実的な初期導入は、全社 rollout ではない。まずは repository を3つ程度に絞る。候補は、外部公開 API、管理画面、認証基盤、決済周辺、個人情報処理のあるサービスだ。ただし、機密性が高すぎる repository は No ZDR 条件を踏まえて除外してもよい。

次に、週次 scan cadence を決める。チュートリアルでも weekly cadence は多くのチームに合うとされている。重要なのは、scan することではなく、scan 後に誰が triage するかを決めることだ。Security owner、service owner、reviewer、期限、dismiss ルールを先に定義しないと、AI が findings を増やすだけで backlog は減らない。

最後に、修正の出口を決める。Claude Code remediation session を使う場合でも、PR は draft にし、CI、CODEOWNERS、セキュリティ担当 review を必須にする。AI が出した patch は、初期案であって merge 権限ではない。この線引きは、[OpenAI の Codex セキュリティ管理](/blog/openai-advanced-account-security-codex-2026/) と同じく、AI agent を社内権限モデルに入れるうえで避けられない。

## まとめ

Claude Security は、Anthropic がセキュリティ領域に出した単発機能ではなく、Claude Code、Claude.ai、GitHub App、Extra Usage、enterprise admin を束ねる運用製品だ。脆弱性を検出するだけでなく、findings を構造化し、再現手順と修正案を出し、export と webhook で既存運用につなぎ、必要なら Claude Code の修正セッションへ進める。

日本企業が注目すべきなのは、「AI が脆弱性を見つけるらしい」という表面的な話ではない。AppSec の人手不足、検知後の初期調査、監査証跡、GitHub 権限、AI 推論コスト、No ZDR 制約をひとまとめに設計する必要があるという点だ。

最初の評価では、SAST より多く検出するかではなく、high severity finding の説明品質、修正案のレビュー時間、owner assign までの速度、監査ログ化のしやすさを見るべきだ。Claude Security の価値は、検出数ではなく、脆弱性対応を「積み上がるアラート」から「レビュー可能な作業単位」へ変えられるかにある。

## 出典

- [Use Claude Security](https://support.claude.com/en/articles/14661296-use-claude-security) - Claude Help Center, accessed 2026-05-02
- [Getting started with Claude Security](https://claude.com/resources/tutorials/getting-started-with-claude-security) - Claude, accessed 2026-05-02
- [Automated Security Reviews in Claude Code](https://support.claude.com/en/articles/11932705-automated-security-reviews-in-claude-code) - Claude Help Center, 2026-03-16
- [Set up Code Review for Claude Code](https://support.claude.com/en/articles/14233555-set-up-code-review-for-claude-code) - Claude Help Center, accessed 2026-05-02
