---
article: 'github-copilot-app-byok-model-providers-2026'
level: 'expert'
---

GitHub Copilot appのBYOK対応は、Copilotのagentic workflowにおけるmodel governanceの論点を一段引き上げる更新だ。GitHubは2026年6月23日、Copilot appでbring your own keyをサポートし、agent sessionを自分のモデルプロバイダーに対して実行できるようにしたと発表した。対象はOpenAI、Azure OpenAI、Microsoft Foundry、Anthropic、LM Studio、Ollama、OpenAI互換エンドポイントなどである。

これは、単なるmodel pickerの拡張ではない。[GitHub Copilot app technical preview](/blog/github-copilot-app-technical-preview-2026/)でIssue、Pull Request、prompt、過去sessionからagent作業を開始する作業面が出た。[Copilot appのcanvases更新](/blog/github-copilot-app-canvases-agent-work-2026/)では、agentが進める作業をplan、browser session、terminal、release checklist、incident boardのようなwork artifactへ寄せる方向が示された。今回のBYOKは、その作業面でどの推論経路を使うかを企業側が選ぶための入口になる。

日本企業での重要性は、モデル性能の比較だけでは説明できない。企業がCopilot appでBYOKを使うと、agent sessionの中に、既存クラウド契約、テナント境界、リージョン、内部gateway、ローカルモデル、APIキー管理、外部請求、監査ログが入ってくる。これは、CopilotをIDE補助として配る段階ではなく、開発AI基盤として扱う段階の話である。

## 事実: BYOKはpublic previewで、local credential storeにキーを保存する

GitHub Changelogは、Copilot appがBYOKに対応し、ユーザーが自分のmodel provider against agent sessionsを実行できるようになったと説明している。設定はCopilot appのSettings、Model Providersから行い、endpointとAPI key、LM StudioやOllamaの場合はhostを登録する。登録後は、providerのmodelsがCopilot-hosted modelsと並んでmodel pickerに表示され、sessionごとに選べる。

GitHub DocsのBYOKページでは、Copilot appを自分のLLM providerに接続し、GitHub-hosted modelsの代わりに使えると説明されている。対応providerはOpenAI、Azure OpenAI、Microsoft Foundry、Anthropic、Ollama、Foundry Local、LM Studio、任意のOpenAI-compatible HTTP endpointだ。追加手順は、app settingsでModel providersを開き、Add providerからproviderを選び、display name、base URL、API keyなどを入力して保存する流れである。

セキュリティ面で重要なのは、DocsがAPI keys are stored in the system credential store and are never displayed in the UIと説明している点だ。つまり、Copilot appはOS credential storeを利用する設計であり、UIからキーを再表示しない。ただし、これは個人または端末単位の保管設計を説明するものであり、企業のAPIキー発行、失効、rotation、利用者棚卸し、退職時削除まで自動で解くものではない。

また、DocsはBYOK supportがpublic previewで変更され得ると明記している。BusinessやEnterpriseでCopilot appを使う場合には、組織またはenterprise adminがCopilot CLIをpolicy settingsで有効化する必要がある。この条件から見ても、Copilot appのBYOKはアプリ内設定だけで完結する話ではなく、CLI policy、agent policy、preview feature policyと同じ管理面に置くべきだ。

## 分析: BYOKはmodel routingとdata boundaryの制御点になる

ここからは分析だ。

BYOKの最大の意味は、Copilot appのagent sessionで使う推論経路を、GitHub-hosted modelだけに閉じないことにある。これは、モデル選択というよりmodel routingである。どのtaskをどのproviderへ送り、どのtenant、region、gateway、local runtimeで処理するかを選ぶ制御点が増える。

日本企業では、AIエージェント導入の議論が「どのモデルが賢いか」に寄りがちだ。しかし実務では、モデル性能より先に、データ分類と送信先が問題になる。たとえば、OSS repositoryのREADME修正、社内libraryのテスト追加、顧客名を含む管理画面のUI確認、金融商品の仕様書を参照するbackend修正では、同じagent sessionでも許容できる推論先が違う。

BYOKを使えば、既存のAzure OpenAI tenantやMicrosoft Foundryに寄せる、Anthropicの法人契約に寄せる、内部gatewayでログとフィルタを挟む、OllamaやLM Studioでlocal modelに渡す、といった選択肢が生まれる。GitHubの発表も、自分のcloud account、tenant、internal gatewayを経由して、より厳しいdata-boundary requirementsを持つ環境に対応できると説明している。

ただし、BYOKは安全性を自動保証しない。Azure OpenAIを使うならAzure側のnetwork、private endpoint、logging、region、data retentionを確認する必要がある。Anthropicを使うなら契約プラン、data usage policy、workspace設定を確認する必要がある。OpenAI-compatible gatewayを使うなら、そのgatewayがどの下流providerへroutingするか、promptとcompletionをどの粒度で記録するか、PII redactionやsecret filteringを持つかを見る必要がある。

つまり、Copilot appのBYOK導入は、GitHub側の設定だけでなく、外部provider側のcontract review、security review、logging designを伴う。ここを見落とすと、「CopilotのBYOKを使っているから安全」と誤解したまま、実際には個人APIキー、個人tenant、未監査gateway、未管理local modelが混在する。

## 費用管理: Copilot AI Creditsだけでは見えなくなる

BYOKの二つ目の論点は費用である。[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)以降、GitHub CopilotのChat、CLI、cloud agent、Spaces、Spark、third-party coding agentsのようなAIモデル利用は、GitHub側のAI Creditsで見る必要が出ている。だが、BYOKで外部providerを使う場合、推論費用は外部provider側の請求に出る可能性がある。

このとき、管理者の視界は分断されやすい。開発者はCopilot app内のmodel pickerで選んでいるだけだが、実際の費用はAzure subscription、Anthropic console、OpenAI account、社内gatewayのchargebackに出るかもしれない。Copilot appのsession数だけを見ても、どのproviderでいくら使ったかは説明できない可能性がある。

日本企業では、部門別予算やプロジェクト別原価が強く求められることが多い。BYOKでモデル調達を柔軟にするなら、費用配賦も同時に設計するべきだ。たとえば、Platform EngineeringはGitHub-hosted modelを標準にし、規制業務はAzure OpenAI tenant経由、研究開発はAnthropic契約、低リスクな前処理はlocal model、という使い分けをする場合、それぞれのコストメトリクスと承認者が違う。

実務上は、Copilot利用ログ、外部provider利用ログ、cloud billing、gateway logsを結合できる粒度を先に決める必要がある。最低限、user、organization、repository、project、provider、model、task category、timestampを対応させたい。BYOKを個人裁量にすると、この対応表が作れず、費用だけでなく監査も難しくなる。

## ローカルモデル: データ境界の選択肢だが品質と端末管理が必要

Ollama、LM Studio、Foundry Localのようなlocal provider対応は、開発者には特に魅力的に見える。ローカルモデルなら、ネットワークを経由しない、クラウド推論費用を抑えられる、プロトタイプを素早く試せる、といった利点がある。

しかし企業導入では、local modelは「安全な代替」ではなく「別の運用対象」として見るべきだ。入力や生成物が端末に残る可能性がある。モデルファイルの入手元、ライセンス、更新頻度、脆弱性情報、出力品質、hallucination傾向、コード生成能力、メモリ使用量を確認する必要がある。端末がMDMで管理されていない場合、むしろクラウドよりも統制しにくい。

ローカルモデルに向くのは、低リスクで失敗を吸収しやすい作業である。ログの整形、エラーメッセージの要約、issue分類、README草案、テストケース候補、簡単なコード探索、命名案などだ。逆に、認証・認可、暗号、支払い、個人情報、法令対応、production incident、DB migration、セキュリティ修正は、ローカルモデルだけに任せるべきではない。

また、ローカルモデルをBYOKでCopilot appから使う場合でも、agent sessionが実行するツールやファイルアクセスは別問題である。モデルがローカルでも、agentが触るrepository、terminal、browser、MCP server、canvas extensionの権限は残る。モデルの実行場所とagentの操作権限を混同してはいけない。

## ガードレール: provider、task、key、reviewを分けて設計する

BYOKを企業で使うなら、最低限4種類のガードレールが必要だ。

第一に、provider allowlistである。GitHub-hosted model、Azure OpenAI、Anthropic、Microsoft Foundry、OpenAI-compatible gateway、Ollama、LM Studioを並べ、どのorganization、repository、team、data classificationで許可するかを決める。個人APIキーを許すのか、組織APIキーだけにするのかもここで決める。

第二に、task classificationである。ドキュメント、テスト、軽微なbug fix、依存関係更新、UI検証、セキュリティ修正、権限変更、DB migration、顧客データ分析、incident responseを分け、どのtaskにどのproviderを使えるかを決める。これは、model capabilityとdata sensitivityを同時に見る表になる。

第三に、key lifecycleである。APIキーを誰が発行し、どのcredential storeやsecret managerに置き、誰が失効し、どの周期でrotationし、退職・異動時にどう棚卸しするかを決める。GitHub DocsがOS credential storeへの保存を説明していても、企業のkey lifecycleは別途必要である。

第四に、review policyである。BYOK providerを使ったagent sessionの差分を、通常PRと同じレビューでよいのか、model/providerによって追加レビューを要求するのかを決める。たとえば、local modelで生成したコードはセキュリティレビューを厚くする、未検証gatewayを使ったsessionは本番repositoryに出さない、規制業務ではsession logを残す、といったルールが必要になる。

ここは[Copilot CLI企業管理プラグイン](/blog/github-copilot-cli-enterprise-plugins-2026/)ともつながる。CLIやMCP、hooks、pluginを企業標準として配るなら、Copilot appのBYOK providerも同じ運用台帳に入れるべきだ。Copilot surfaceごとに許可ルールが違うと、開発者はどこで何が許されているか分からなくなる。

## 導入順序: いきなり全社開放しない

現実的な導入順序は、まずpilot teamを限定することだ。Platform Engineering、SRE、開発基盤、QA自動化、社内ツールのように、agent sessionの内容を説明しやすく、ログや費用を追いやすいチームから始める。対象repositoryも、顧客データや本番secretを含まないものに絞る。

次に、providerを2種類程度に絞る。たとえば、標準はGitHub-hosted model、規制・閉域寄りの検証はAzure OpenAI tenant、低リスクな前処理はOllama、のように用途を分ける。最初からOpenAI、Anthropic、Azure、Foundry、LM Studio、複数gatewayを全部開くと、比較実験は楽しいが運用検証にならない。

三つ目に、費用とログの突合を行う。Copilot appでどのsessionを作り、どのproviderを選び、どのrepositoryで何をしたかを、外部provider側の利用量と突き合わせる。ここで粒度が足りなければ、全社展開前にgatewayや命名規則、team別キー、project別subscriptionを見直す。

四つ目に、review ruleを調整する。BYOK providerを使ったPRで、通常よりレビュー観点が増えるかを確認する。local modelは誤りやすいが速い、frontier modelは高いが複雑作業に強い、社内gatewayは監査しやすいが遅延がある、というような実測を集める。

## まとめ

Copilot appのBYOK対応は、Copilot appを単なるagent desktopから、企業のmodel routingとdata-boundary policyを反映する作業面へ近づける。OpenAI、Azure OpenAI、Microsoft Foundry、Anthropic、Ollama、LM Studio、OpenAI互換エンドポイントをmodel pickerに並べられることで、開発者はsessionごとにモデルを選びやすくなる。

同時に、管理者は新しい責任を持つ。どのproviderを許可するか、どのtaskに使えるか、どの費用で見るか、APIキーを誰が管理するか、local modelをどこまで認めるか、agent sessionのレビューをどう厚くするかを決めなければならない。

日本企業では、BYOKを「クラウドに出さないための安全策」とだけ見るのではなく、モデル調達、データ境界、費用配賦、端末管理、レビュー責任を束ねる設計点として扱うべきだ。Copilot appを本格導入するほど、BYOKは便利なオプションではなく、AIエージェント運用の統制表に載せる項目になる。

## 出典

- [GitHub Copilot app support for BYOK](https://github.blog/changelog/2026-06-23-github-copilot-app-support-for-byok/) - GitHub Changelog, 2026-06-23
- [Using your own LLM models in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/use-byok-models) - GitHub Docs
- [Getting started with the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/getting-started) - GitHub Docs
