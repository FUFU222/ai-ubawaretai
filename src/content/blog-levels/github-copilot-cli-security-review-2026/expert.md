---
article: 'github-copilot-cli-security-review-2026'
level: 'expert'
---

GitHub Copilot CLI の `/security-review` は、AI コーディングのセキュリティ統制を「PR後の検出」だけに置かないための更新として見るべきだ。GitHub は 2026年6月10日、Copilot CLI でコード変更に対する security review を直接実行できる slash command を公開プレビューとして発表した。これは GitHub code scanning、Dependabot、secret scanning に依存しない Copilot-driven scan と説明されている。

この設計上の意味は大きい。従来、企業のセキュリティ検査は CI と PR に寄りやすかった。CodeQL、secret scanning、dependency scanning、branch protection、required status check、人間レビューは、標準化されたゲートとして強い。一方で、AI agent がローカルや CLI で長い作業を進める時代には、PR を作る前にかなり大きな差分ができる。`/security-review` は、その大きな差分を PR に投げる前に一度絞るための手段になる。

すでに [GitHub第三者agent検証、AIコード安全運用の焦点](/blog/github-third-party-agent-security-validation-2026/) では、third-party coding agents が作った変更を GitHub 側の security validation へ載せる話を扱った。今回の `/security-review` は、同じ security でも位置が違う。third-party agent validation は、GitHub に入ってきた PR や変更をどう受け入れるかの話である。`/security-review` は、Copilot CLI を使っている開発者が、変更を外に出す前に自分の working tree を見る話である。

## 事実関係: 公開プレビューの範囲

GitHub Changelog によると、`/security-review` はローカルコード変更を分析し、高確度の security finding を severity と confidence つきで返す。さらに、terminal から離れずに扱える actionable suggestion を返すことが意図されている。

GitHub が例示している対象は、injection flaws、cross-site scripting、insecure data handling、path traversal、weak cryptography などだ。これらは、AI agent が実装時に作り込みやすく、かつ PR レビューで見落とすと影響が大きい領域である。特に path traversal、入力検証、ログ出力、暗号鍵の扱い、認可条件の欠落は、差分が小さく見えても事故が大きくなりやすい。

一方、GitHub はこの機能を experimental feature in public preview と位置づけている。GitHub Docs の CLI command reference では、実験機能を `/experimental` や `--experimental` で有効化できることが示されている。したがって、企業の統制文書では「正式なセキュリティゲート」としてではなく、「pilot 対象の早期検査」として扱うべき段階だ。

また、CLI command reference には既存の `/review` command も載っている。`/review` は code review agent を実行して変更を分析する汎用レビューの入口であり、`/rubber-duck` は plan、code、tests への second opinion を得る入口だ。`/security-review` は、これらと並ぶ「セキュリティ特化の前段レビュー」として運用上の位置を決める必要がある。

## 役割分担: 早期検査、標準ゲート、専門判断

企業運用で大事なのは、セキュリティ検査を一枚岩にしないことだ。`/security-review`、CodeQL、secret scanning、Dependabot、人間レビューは、それぞれ得意領域が違う。

`/security-review` は、開発者の作業中に使える。差分の文脈をもとに、危ない実装パターンを早く見つけるには向く。たとえば、AI agent が file upload の保存処理を作った直後、OAuth callback の state 検証を触った直後、SQL query builder を置き換えた直後、CI secret の名前を変更した直後に実行する価値がある。

CodeQL は、GitHub 上の継続的な解析として強い。言語と query に応じてデータフローや既知の脆弱パターンを見られる。secret scanning は秘密情報の検出に強く、Dependabot や Advisory Database は依存関係の既知脆弱性に強い。これらは個々の開発者が忘れても required check として強制できる点が重要だ。

人間レビューは、AI と静的解析が苦手な領域を担う。仕様上その権限でよいのか、個人情報をそのログに出してよいのか、監査証跡として十分か、顧客契約や社内規程に反しないか、ロールバックできるか、移行時に既存データを壊さないか。この判断は、`/security-review` で finding がないことでは代替できない。

したがって、日本企業での運用基準は「`/security-review` が通れば OK」ではない。「対象変更では `/security-review` を前段で実行し、PR では標準ゲートを通し、重要領域では domain owner と security reviewer が見る」という三層構造が妥当だ。

## 対象変更を絞る

全変更に `/security-review` を必須化すると失敗しやすい。開発者は形だけ実行し、finding を読まなくなる。AI Credits も消費し、レビュー待ち時間も増える。最初は対象変更を絞るべきだ。

優先度が高いのは、認証、認可、session、cookie、CSRF、OAuth、SAML、OIDC、JWT、API key、secret、環境変数、file upload、path 操作、外部 URL 取得、SQL、NoSQL query、template rendering、HTML sanitization、暗号、署名、監査ログ、PII、CI/CD、GitHub Actions、package manager、dependency update である。

逆に、文言、CSS、軽いドキュメント、テストデータの表記変更などは、通常は必須にしなくてよい。もちろん、ドキュメントに実 secret が混じる可能性や、テスト fixture に個人情報が混じる可能性はあるため、secret scanning や reviewer の目は別に残す。

この絞り込みは [GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) の論点とも補完関係にある。MCP Server や GitHub 側の scanning で秘密情報と依存関係を見る。`/security-review` では、作業差分に出た実装上の危険を先に見る。PR では required checks を通す。これにより、1つの機能に過剰な期待を載せずに済む。

## CLI権限設計を同時に見る

`/security-review` はセキュリティ目的の command だが、実行面は Copilot CLI である。Copilot CLI は terminal agent であり、利用者の許可に応じて shell command や file 操作へ近づく。GitHub Docs は、特に変更や削除を伴う command を実行する前に注意し、許可した command には利用者が責任を負うべきだとしている。

このため、`/security-review` の pilot では、同時に CLI permission policy を見直す必要がある。`/allow-all` や `/yolo` は、すべての tool、path、URL を許可する方向に働く。GitHub Docs は、これらを isolated environment に限定すべきで、毎回自動適用する alias は避けるべきだと説明している。セキュリティ確認のために開いた session が、広い権限を持つ修正 session になるのは本末転倒だ。

実務では、少なくとも次を決める。

まず、`/security-review` を実行する session で許可する tool を最小化する。検査だけなら、広い write 権限や外部 URL access は不要なことが多い。

次に、finding に対する修正を同じ session で行うか、別の実装 session に切り分けるかを決める。高リスク変更では、review session と fix session を分け、fix 後に再度 review するほうが説明しやすい。

さらに、`/reset-allowed-tools` の使い方を開発者に教える。GitHub Docs は、この command が interactive session 中に付与した permissions を取り消し、起動時の default または command-line option に戻すと説明している。長い session で一時的に権限を広げた後、検査前に権限を戻す運用は現実的だ。

## findingをPR証跡へどう残すか

`/security-review` の出力をどう記録するかは難しい。finding 全文を PR に貼ると、未修正の脆弱性詳細や攻撃手順に近い情報が残る可能性がある。一方で、何も残さないと、監査時に「本当に実行したのか」「何を判断したのか」が分からない。

おすすめは、PR template に最小限の構造だけ置くことだ。

たとえば、対象変更に該当するか、`/security-review` を実行したか、high severity/high confidence finding があったか、対応済みか、未対応なら誰にエスカレーションしたか、という粒度でよい。具体的な exploit detail や secret 断片は貼らない。必要であれば、社内の脆弱性管理 ticket や security tracker へ分離する。

finding を修正しない判断も記録対象にする。AI が誤検知することはある。重要なのは、誤検知だったから無視した、既存の compensating control がある、影響範囲が test-only だった、別 PR で直す、といった理由を人間が説明できる状態にすることだ。

この考え方は、[GitHub Copilot CLI刷新、定期実行と音声入力の運用点](/blog/github-copilot-cli-scheduling-voice-rubber-duck-2026/) で扱った rubber duck の記録にも似ている。AI の second opinion は便利だが、採用・不採用の判断は人間が残す。`/security-review` でも同じである。

## 費用、データ、アカウント境界

Copilot CLI の security review を増やすと、費用面も無視できない。[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で整理した通り、Copilot Chat、CLI、cloud agent などの利用は AI Credits の管理対象になっている。セキュリティ目的だからといって、無制限に回せる前提にはできない。

評価時には、発見された有効 finding 数だけでなく、1 PR あたりの実行回数、誤検知率、修正までの時間、通常レビューの短縮効果、AI Credits 消費を見たい。特に、security champion や platform team が大量の PR を見ている場合、全 PR で `/security-review` を実行するより、対象変更だけに絞ったほうが費用対効果が高くなる可能性がある。

データ境界も見る必要がある。security review の prompt や差分には、未公開仕様、顧客名、内部 API、脆弱性の詳細、環境変数名、インフラ構成が含まれる場合がある。GitHub Copilot の企業ポリシー、データ処理条件、session data、ログ、同期設定を確認し、prompt に書いてよい情報と書いてはいけない情報を開発者向けに明文化すべきだ。

個人アカウントと企業アカウントの境界も重要だ。会社のリポジトリで個人契約の CLI を使う、委託先が別組織の Copilot 設定で review する、といった状態は、監査時の説明が難しい。少なくとも重要 repository では、企業管理された Copilot access、組織 policy、利用ログ、予算管理の下で実行するほうがよい。

## 導入手順

最初の一歩は、対象 repository を絞ることだ。認証、管理画面、課金、個人情報、外部公開 API、CI/CD を含む repository から1つ選び、security champion と platform engineer がいるチームで pilot する。

次に、対象変更の checklist を作る。認可、入力検証、file I/O、外部通信、secret、依存関係、CI/CD に触れる場合は `/security-review` を実行する。それ以外は任意にする。PR template には、実行有無と high risk finding の有無だけを残す。

三つ目に、CodeQL、secret scanning、Dependabot、required checks との関係を文書化する。`/security-review` は PR 前、CodeQL と secret scanning は PR/CI、security reviewer は重要変更の最終判断、という分担を明記する。

四つ目に、CLI 権限を見直す。`/allow-all` や `/yolo` の常用を禁止し、必要な tool permission を都度確認する。長い session では `/reset-allowed-tools` を使い、検査前に権限状態を戻す運用も検討する。

五つ目に、1か月分の実績を取る。実行回数、有効 finding、誤検知、修正時間、レビュー時間、AI Credits、開発者の負担を見て、対象範囲を広げるか、特定チームに限定するかを決める。

## まとめ

`/security-review` は、Copilot CLI を使う開発者にとって、PR 前にセキュリティ視点を差し込むための便利な入口になる。だが、現時点では公開プレビューの実験機能であり、企業の正式なセキュリティ保証として扱うべきではない。

日本企業にとっての実務価値は、AI が安全を保証することではなく、危ない差分を早く見つけ、レビュー担当者が本当に判断すべき領域へ集中できることにある。`/security-review`、CodeQL、secret scanning、Dependabot、人間レビューを役割分担し、対象変更、権限、ログ、費用、finding の扱いを決めてから pilot する。この順番なら、AI agent 時代のセキュリティレビューを無理なく前倒しできる。

## 出典

- [Dedicated security review command now available in Copilot CLI](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/) - GitHub Changelog, 2026-06-10
- [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) - GitHub Docs
- [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) - GitHub Docs
- [Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents) - GitHub Docs
