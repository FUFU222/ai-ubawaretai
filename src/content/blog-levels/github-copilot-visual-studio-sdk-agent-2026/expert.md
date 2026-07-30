---
article: 'github-copilot-visual-studio-sdk-agent-2026'
level: 'expert'
---

GitHub Copilot in Visual Studioの2026年7月更新は、個別機能の追加として読むより、Visual StudioをCopilotの共通agent runtimeに近づける更新として読むべきだ。GitHub Changelogは2026年7月30日に、Visual StudioのCopilot Chatへ新しい**Agent (Preview)**、.NET/Azure built-in skills、Review Selection、organization-level custom instructionsが入ったと発表した。MicrosoftのVisual Studio Blogは2026年7月28日に、Agent (Preview)がGitHub Copilot CLIと同じGitHub Copilot SDKを基盤にすることを説明している。

この組み合わせは、以前の[Visual Studio cloud agent起動](/blog/github-copilot-visual-studio-cloud-agent-2026/)や[Visual Studio MCP trust/usage管理](/blog/github-copilot-visual-studio-mcp-usage-cpp-2026/)の延長にある。4月はVisual StudioからGitHub側のcloud agentへ作業を渡す入口だった。6月はMCP trust、usage notification、C++ modernization agentなど、IDE内のAI機能を企業運用へ近づける更新だった。7月は、Visual Studio内で動くAgent自体をCopilot SDKへ寄せ、組織指示とstack-specific skillを同じIDE体験に重ねている。

日本の.NET/Azure開発組織では、Visual Studioは「開発者が好きに入れるeditor」ではなく、標準端末、顧客別環境、社内証明書、Azure subscription、古いC++ toolset、.NET Framework資産、委託先端末管理と結びつく。したがって今回の更新は、便利なAI機能の一覧ではなく、標準IDEの上に載るagent control planeの変化として扱うほうが実務に近い。

## 事実: Agent (Preview)はCopilot SDKでsurface横断へ寄る

GitHub Changelogによると、Visual StudioのCopilot ChatにはAgent (Preview)という新しい選択肢が入った。Agent pickerから選び、少ない往復でタスクを進め、応答を短く読みやすくすることが狙いとされている。GitHubは、このAgentがGitHub Copilot CLIを支えるCopilot SDKと同じ基盤で動くと説明している。

Visual Studio Blogは、よりはっきりsurface横断の意図を述べている。CLI、GitHub app、VS Code、Visual Studioの間で作業を自然に移せるようにし、Visual Studioではレビュー、調整、継続作業へつなげるという説明だ。これは、単にVisual Studio版Agentが賢くなったというより、Copilotの利用面をSDKでそろえる動きである。

この点は[Copilot CLI遠隔操作GA](/blog/github-copilot-cli-remote-control-ga-2026/)や、CLI/IDE/cloud agentをまたぐ最近のCopilot更新と同じ方向を向いている。企業管理者から見ると、利用者がどのsurfaceで作業を始めたかより、どのリポジトリ、どの権限、どのモデル、どのログ、どのレビューに流れたかが重要になる。surfaceごとの個別ルールだけでは、作業経路の移動を追いにくくなる。

## 事実: built-in skillsは専門知識だが強制ルールではない

Visual Studioは、.NETチームとAzureチームが作ったbuilt-in skillsも提供する。該当workloadがインストールされている場合、tool pickerのBuilt-inカテゴリに表示される。Microsoftは、説明やパスを確認でき、既定ではオフで、タスクに合うものだけを有効化すると説明している。

この設計は妥当だ。.NETやAzureの専門skillは、一般的なagent応答よりstack-awareな提案を出しやすくする。しかし、日本企業の.NET/Azure運用は標準形だけではない。Azure landing zone、閉域接続、監査ログ、Key Vault運用、リージョン制約、委託先の接続権限、旧.NET Framework、商用コンポーネント、オンプレ連携があり、公開情報ベースのbest practiceだけでは足りないことがある。

そのため、built-in skillsは「社内標準を置き換えるもの」ではなく「社内標準へ照合する入力」として扱うのがよい。たとえばAzure skillが一般的な構成を提案しても、自社のtagging、cost center、private endpoint、monitoring workspace、diagnostic setting、region policyに合うかを確認する。skillの有効化は、単なる個人設定ではなく、チーム別の許可リストとして管理したほうがよい。

## 事実: Review SelectionはPR前レビューの入口になる

GitHub Changelogは、Visual Studioで選択したコードを右クリックし、Copilot ActionsからReview Selectionを選べるようになったと説明している。結果はinline commentとして返り、必要に応じて提案適用や提案生成を進められる。GitHubは、これがGitHub Copilot code reviewに支えられていると説明している。

この機能は、PR全体の自動レビューとは少し役割が違う。PR提出後にまとめて指摘されるより、実装途中の関数、差分、例外処理、SQL、認証、C++変換部分を局所的に見たい場面がある。Review Selectionは、その「第二意見」をVisual Studio内へ寄せる。

一方で、レビュー責任は曖昧にしないほうがよい。[Copilot code reviewスキルMCP一般提供](/blog/github-copilot-code-review-skills-mcp-ga-2026/)でも触れたように、Copilot code reviewはPR監査やMCP連携へ広がっているが、人間の承認責任を消すものではない。Review Selectionで直した差分も、最終的には通常のPRレビュー、テスト、セキュリティ検査、性能確認を通すべきだ。

## 事実: organization custom instructionsはpreference配布である

今回の更新では、GitHub organization ownersがorganization-level custom instructionsを追加できる。Visual Studio Blogは、共通の応答設定を開発者ごとに配らず、organization単位で適用するための仕組みとして説明している。対象repositoryがGitHub organizationに属すると自動で適用され、参照リストに表示される。Visual Studio側では無効化する設定もある。

ただし、Microsoftはこの仕組みをpolicy enforcementではなくpreferenceとして説明している。ここは重要だ。organization custom instructionsには、テストを優先する、説明を短くする、社内の命名規則に寄せる、例外処理を省略しない、PR説明に観点を書く、といった「望ましい振る舞い」を置ける。しかし、秘密情報を外部送信しない、特定APIを禁止する、顧客データを扱わない、特定MCP serverを使わせない、といった強制は別の制御で行う必要がある。

強制すべきものは、GitHub enterprise policy、branch protection、CODEOWNERS、CI、secret scanning、dependency review、MCP server allowlist、端末管理、ネットワーク制御へ置く。custom instructionsは、これらを補助する開発体験上のガイドであって、監査証跡やアクセス制御の代替ではない。

## 分析: .NET標準IDEでは「誰が何を許したか」が焦点になる

ここからは分析である。

Visual StudioのCopilot体験が、Agent、skills、Review Selection、organization instructionsを持つと、管理対象は「Copilotをオンにするか」から「どの能力を、どのチームに、どの作業で、どのレビュー責任で許すか」へ移る。Visual Studio標準の.NET/Azure組織では、この変化が特に大きい。

第一に、surfaceをまたぐ作業経路を想定する必要がある。CLIで調査を始め、Visual Studioで差分を確認し、GitHub上でPRを作り、Review Selectionで局所確認し、cloud agentに別issueを渡す、といった流れが自然になる。これを個人裁量に任せると、ログ、費用、レビューの境界が分かりにくい。

第二に、skillと組織指示の優先関係を決める必要がある。built-in .NET/Azure skillsはstack-specificな知識を提供するが、社内規約とは別である。organization custom instructionsは共通の好みを渡すが、強制ではない。repo内のAGENTS.md、Copilot instructions、CIルール、CODEOWNERS、既存の設計文書と衝突する場合、どれを正とするかを明文化するべきだ。

第三に、Review Selectionの成果物をPRにどう残すかが重要になる。実装中にCopilotが出した指摘で修正した場合、PR説明に「Copilot Review Selectionで例外処理を修正」などと残す必要までは常にない。しかし、安全上重要な変更、認証、暗号、個人情報、支払い、ログ、性能に関わる場合は、人間レビューで確認した観点をPRに残すほうが監査しやすい。

## 実務設計: 代表チームで評価する項目

最初に見るべきは、Agent (Preview)の成功率ではなく、タスク分類である。代表リポジトリで、次のように仕事を分ける。

- 単一ファイルのバグ修正
- .NET APIの小さな機能追加
- Azure設定やIaCの確認
- テスト補修
- C++/MSVC設定の再現性確認
- PR前の局所レビュー
- 既存コード理解と説明

それぞれについて、Visual Studio Agent、Copilot CLI、cloud agent、通常のCopilot Chatのどれが向いているかを見る。成功/失敗だけでなく、レビューにかかった時間、再実行回数、差分の大きさ、生成説明の質、費用通知の見え方を記録する。

次に、built-in skillsの利用ルールを作る。すべてを一律に有効化するのではなく、.NET API、Azure App Service、Azure Functions、SQL、認証、ログ、IaCのように分類し、代表チームで出力を確認する。社内標準と違う提案が出る場合は、organization instructionsやrepo-level instructionsで補正できるか、それでも危険ならskill利用を制限する。

第三に、organization custom instructionsを短く保つ。長い社内規程を貼ると、開発者もCopilotも扱いにくい。最初は、テスト方針、例外処理、ログ、PR説明、セキュリティ上の注意、禁止ではなく推奨として書ける内容に絞る。強制事項はCIやpolicyへ移す。

第四に、Review Selectionの使いどころを決める。全コードを毎回選択レビューするのではなく、認証、例外、SQL、外部API、並行処理、C++ interop、Azure権限など、事故時の影響が大きい範囲で使う。PR全体レビューの前に局所レビューを挟むと、手戻りを減らせる可能性がある。

## 統制: モデル、費用、ログを同じ表で見る

Copilot Visual StudioのAgent体験は、モデル選択やプランとも無関係ではない。GitHub DocsのCopilot plansは、Free、Student、Pro、Pro+、Max、Business、Enterpriseで利用できる機能やAI Creditsが異なることを示している。Business/Enterpriseでは中央管理やpolicy controlも関わる。

さらに[Copilot既定モデル有効化](/blog/github-copilot-default-model-enablement-policy-2026/)で扱ったように、モデル可用性は管理者ポリシー、対象プラン、client、ロールアウト状態で変わる。Visual StudioのAgentが見えても、同じモデルや同じ費用条件で全員が使えるとは限らない。

したがって、管理表は機能単位ではなく、作業単位で作るほうがよい。たとえば「小さな.NET修正」「Azure設定相談」「PR前レビュー」「C++ toolset調査」ごとに、許可surface、許可model、使ってよいskill、必要なレビュー、予算上限、ログ確認先を書く。これにより、Visual Studioだけ、CLIだけ、GitHub.comだけという分断を避けられる。

## 90日ロードマップ

0日目から30日目は、評価対象を絞る。Visual Studio 2026 Stable Channelの対象バージョン、Copilot plan、GitHub organization、代表リポジトリ、参加者、扱うタスクを決める。Agent (Preview)はPreviewであるため、顧客本番影響があるコードや監査対象の高い領域から始めない。

31日目から60日目は、skillsとinstructionsを整える。built-in .NET/Azure skillsを代表タスクで試し、社内標準とずれる出力を記録する。organization custom instructionsは短く作り、開発者に見える形で共有する。無効化の扱い、user-level instructionsとの衝突、repo-levelルールとの優先順位も確認する。

61日目から90日目は、レビューと費用へ接続する。Review SelectionをPR前チェックに入れる範囲を決め、どの指摘をPR説明に残すかを定義する。AI Credits、モデルポリシー、usage通知、audit logs、CI結果を月次で見られるようにする。うまくいったタスクだけを標準運用へ昇格し、失敗したタスクは継続検証に残す。

## まとめ

Copilot Visual Studioの2026年7月更新は、GitHub Copilot SDKベースのAgent、.NET/Azure built-in skills、Review Selection、organization custom instructionsを通じて、Visual StudioをCopilotの共通agent surfaceへ近づけた。これは、.NET/Azure開発チームにとって標準IDEのAI化が一段進んだということだ。

日本企業が取るべき対応は、全社オンではない。まず代表チームでタスク分類、skill許可、organization instructions、Review Selectionの使いどころ、モデル/費用/ログの管理表を作る。CopilotはIDE補助から開発基盤へ移りつつある。だからこそ、Visual Studio内の便利機能としてではなく、CLI、cloud agent、code review、管理者ポリシーを含む運用設計として扱う必要がある。

## 出典

- [GitHub Copilot in Visual Studio - July update](https://github.blog/changelog/2026-07-30-github-copilot-in-visual-studio-july-update/) - GitHub Changelog, 2026-07-30
- [Visual Studio July Update - Meet the New Agent, Powered by the GitHub Copilot SDK](https://devblogs.microsoft.com/visualstudio/visual-studio-july-update-meet-the-new-agent-powered-by-copilot-sdk/) - Visual Studio Blog, 2026-07-28
- [Plans for GitHub Copilot](https://docs.github.com/copilot/get-started/plans) - GitHub Docs
- [Visual Studio 2026 release notes](https://learn.microsoft.com/visualstudio/releases/2026/release-notes) - Microsoft Learn
