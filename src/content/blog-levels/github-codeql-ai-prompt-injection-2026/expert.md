---
article: 'github-codeql-ai-prompt-injection-2026'
level: 'expert'
---

GitHub の CodeQL 2.26.0 は、AI アプリケーションのセキュリティ運用にとってかなり象徴的な更新になった。新しく追加された `js/system-prompt-injection` query は、JavaScript / TypeScript のコード上で、信頼できないユーザー入力が AI model の system prompt に流れ込むケースを検出する。

この更新の意味は、prompt injection が「モデルの弱さ」や「利用者の注意不足」だけでなく、アプリケーションコードの入力境界として扱われ始めたことにある。日本企業が社内 RAG、チャットボット、営業支援 agent、開発者向け PR assistant、顧客サポート自動化を作るなら、system prompt、tool description、agent instruction を通常の trusted sink として管理しなければならない。

すでに [GitHub第三者agent検証](/blog/github-third-party-agent-security-validation-2026/) では、外部 coding agent が作った PR を GitHub 上でどう受け入れるかを整理した。[Copilot CLI security review](/blog/github-copilot-cli-security-review-2026/) では、commit 前に AI driven な検査を置く意味を扱った。今回の CodeQL 更新は、その下にある deterministic な SAST 層で、AI アプリ固有の危険なデータフローを拾う話である。

## 事実: 新queryはsystem promptへの汚染を検出する

GitHub Changelog によると、CodeQL 2.26.0 は Kotlin 2.4.0 対応、C# Razor Page handler parameter の remote flow source 追加、Go `log/slog` モデリング、複数言語の精度改善に加えて、AI prompt injection の検出を追加した。

JavaScript / TypeScript では、`js/system-prompt-injection` query が追加された。説明は明確で、untrusted user-provided values が AI model の system prompt に流れ、攻撃者が model behavior を操作できるケースを検出するというものだ。CodeQL 2.26.0 changelog でも、この release で security query が 1 つ追加されたと整理されている。

GitHub Changelog はさらに、OpenAI、Anthropic、Google GenAI SDK に対する prompt injection sink の追加を説明している。OpenAI では Sora prompts や Realtime session instructions、Anthropic では legacy completion prompts、Google GenAI では cached content と system instructions が例示されている。これは、AI SDK の表面が増えるほど、静的解析側も sink の定義を更新し続ける必要があることを示している。

ここでいう system prompt は、単に「一番上に置く文字列」ではない。モデルにとって、role、instruction、tool description、cached instruction は、それぞれ信頼度の違う文脈になる。開発者が `req.query.persona` や database の値を自然に文字列結合しただけでも、その値が trusted instruction と同じ場所へ入れば、攻撃面になる。

## 事実: tool descriptionはtrusted instructionである

CodeQL query help が良いのは、system prompt だけでなく tool description の例も示している点だ。agent framework で tool を作り、その description に user-controlled value を混ぜると、攻撃者は tool の意味を変えられる可能性がある。

これは実装者が見落としやすい。system prompt は「命令」だと意識しやすいが、tool description はコメントや UI 文言に近く見える。しかし agent にとって tool description は、どの tool をいつ使うか、どう解釈するかの判断材料である。つまり、trusted instruction の一部だ。

修正は、tool description を固定文にし、ユーザー入力は user message や validated parameter として渡すことになる。topic、persona、検索対象、文書カテゴリ、出力フォーマットのような値を自由入力で instructions に混ぜるのではなく、allowlist、enum、schema validation に寄せる。

この設計は、従来の injection 対策と似ている。SQL では query と値を分ける。HTML では markup と user content を分ける。AI アプリでは trusted instruction と untrusted content を分ける。CodeQL の新 query は、その区別をコード上の data flow として表現し始めたものだ。

## 分析: SASTで拾えるprompt injectionと拾えないprompt injectionを分ける

ここからは分析である。

日本企業がこの更新を導入するとき、最初に決めるべきなのは範囲だ。CodeQL は強力だが、prompt injection 全般を解決するわけではない。拾いやすいのは、コード上で user-controlled value が system prompt、instruction、tool description のような sink に流れるパターンである。

一方、RAG で検索された文書の中に悪意ある命令が入っている、Web ページの本文に hidden instruction がある、Slack や Jira のコメントに agent 向け命令が混ざる、MCP tool response が汚染される、といった問題は、単純な静的解析だけでは足りない。実行時のデータソース、connector、retrieval policy、egress control、human approval を見る必要がある。

ここは [Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) と同じ構図だ。モデル層の防御は必要だが、credential、filesystem、network、tool output、MCP trust を分けて設計しなければならない。CodeQL はその中の「アプリコードが最初から trust boundary を壊していないか」を見る役割になる。

つまり、CodeQL の導入効果を過大評価してはいけないが、過小評価もすべきではない。system prompt に user input を文字列結合しているようなコードは、設計上かなり明確な危険であり、CI で落とせるなら落とすべきだ。AI アプリだから判断が難しい、という話に逃がす必要はない。

## 既存のGitHub検査線にどう組み込むか

GitHub の AI 開発基盤では、検査の層が増えている。Copilot CLI の `/security-review` はローカル作業の前段検査に近い。CodeQL、secret scanning、dependency vulnerability checks は PR / CI の標準検査になる。Copilot cloud agent の設定監査 API は、MCP、enabled tools、Actions 承認、firewall を継続的に棚卸しする。

[GitHub Copilot設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/) で見たように、enabled tools の例には CodeQL、Copilot code review、secret scanning、dependency vulnerability checks が含まれる。今回の CodeQL query 追加により、その enabled tools の価値が AI アプリにも直接効くようになった。

実務では、次のように分けるとよい。

第一に、AI SDK を使うリポジトリでは CodeQL を必須 status check にする。すべてのリポジトリで同じ重さにする必要はないが、外部入力、顧客データ、社内文書、ticket、CRM、GitHub Issues、Slack、Drive を AI に渡すサービスでは、SAST を任意実行にしないほうがよい。

第二に、AI 関連の CodeQL finding を security team だけに閉じない。prompt helper、agent tool、RAG pipeline は、アプリ開発者、ML / AI platform、security、legal、data owner の境界にまたがる。finding の修正 owner を security に丸投げすると、実装側の prompt 境界が改善されにくい。

第三に、Copilot や第三者 agent が生成したコードにも同じ required check を適用する。AI agent が AI アプリのコードを書くことは今後増える。agent が生成した prompt wrapper は自然な文章に見えやすいが、信頼境界を間違えている可能性がある。生成元ではなく、コードがどの sink へ何を流しているかを見るべきだ。

## 日本企業で起きやすい実装パターン

日本企業の AI アプリで特に注意したいパターンは、業務用 persona の自由入力である。たとえば「営業担当として答える」「法務担当向けに説明する」「社内規程に詳しい総務担当として返す」のような機能を、管理画面から自由入力で設定できるようにする。これを system prompt に直接入れると、管理者以外が編集できる項目、CSV import、外部 SaaS 同期、委託先入力が攻撃面になりうる。

次に、RAG の検索クエリや文書カテゴリを instructions に混ぜるパターンがある。「この topic について調べる tool」として tool description に topic を文字列結合すると、topic が命令文として解釈される可能性がある。topic は tool parameter にし、description は固定文にするほうがよい。

三つ目は、社内テンプレートを prompt として再利用するパターンだ。営業メール、稟議、FAQ、障害報告、契約レビューのテンプレートを DB に持ち、ユーザーが編集できるようにする。このテンプレートを system prompt と同じ位置で使うなら、テンプレート編集権限は事実上 agent behavior の編集権限になる。単なるコンテンツ管理として扱うと危ない。

四つ目は、MCP や connector の tool metadata である。tool 名、description、schema、examples が外部設定から生成される場合、その設定がどの権限で編集されるかを見る必要がある。AI agent において metadata は実行文脈であり、通常の UI ラベルより影響が大きい。

## 修正基準をコードレビューに落とす

修正の基本は、trusted instruction と untrusted content を分けることだ。

system prompt は固定文にする。ユーザー入力は user role の message、tool parameter、retrieval document、validated enum として渡す。persona や tone を変えたい場合も、自由入力ではなく allowlist にする。管理者が自由文で prompt を編集できる設計にするなら、その管理画面自体を高権限機能として扱い、監査ログ、承認、rollback を付ける。

tool description も固定文を原則にする。検索対象や topic を説明文へ埋め込まず、parameter schema と実行時引数で渡す。agent が tool を選ぶための説明文は、ユーザー入力と同じ信頼境界に置かない。

PR review では、「AI SDK の呼び出しがあるか」だけでなく、「system / developer / instruction / tool description に何が入っているか」を見る。CodeQL finding が出た箇所だけ直すのではなく、同じ helper pattern が他のファイルにないかを横展開する。

また、例外を作る場合は理由を残すべきだ。たとえば、社内管理者だけが編集できる prompt template を system prompt として使う設計は、完全に禁止できないかもしれない。その場合でも、編集権限、変更履歴、レビュー、テスト、利用範囲、外部入力との混在有無を明記する必要がある。

## まとめ

CodeQL 2.26.0 の `js/system-prompt-injection` は、AI アプリのセキュリティを通常の AppSec 運用へ入れるための具体的な一歩である。prompt injection は実行時データやモデル挙動の問題でもあるが、少なくとも system prompt や tool description へ user input を流すコードは、SAST で検出しうる。

日本企業が取るべき姿勢は、AI アプリを特別扱いしないことだ。AI SDK を使うリポジトリを棚卸しし、CodeQL 2.26.0 以降を使い、AI 関連 finding を通常の vulnerability management に入れる。そのうえで、RAG、MCP、connector、egress、human approval のような実行時対策と組み合わせる。

この更新は、モデルが賢くなったというニュースではない。AI を使うアプリケーションコードの信頼境界を、静的解析で説明できるようにする更新だ。AI 機能を増やす企業ほど、system prompt、tool description、agent instruction を「文字列」ではなく「権限を持つ実行文脈」として扱う必要がある。

## 出典

- [CodeQL 2.26.0 adds Kotlin 2.4.0 support and AI prompt injection detection](https://github.blog/changelog/2026-07-10-codeql-2-26-0-adds-kotlin-2-4-0-support-and-ai-prompt-injection-detection/) - GitHub Changelog, 2026-07-10
- [CodeQL 2.26.0 (2026-07-08)](https://codeql.github.com/docs/codeql-overview/codeql-changelog/codeql-cli-2.26.0/) - CodeQL documentation, 2026-07-08
- [System prompt injection](https://codeql.github.com/codeql-query-help/javascript/js-system-prompt-injection/) - CodeQL query help
