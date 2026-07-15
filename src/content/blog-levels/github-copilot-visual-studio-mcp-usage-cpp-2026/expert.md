---
article: 'github-copilot-visual-studio-mcp-usage-cpp-2026'
level: 'expert'
---

GitHub Copilot in Visual Studioの2026年7月14日更新は、Visual Studio利用企業にとって地味だが重要な節目である。MCP trust prompt、Copilot usage notification、C++ modernization agent GA、生成されたC# code review comment、ask mode改善が並んでいる。単体では小さな機能更新に見えるが、まとめて読むと、Visual Studioが「AI補完付きIDE」から「企業が管理するAI開発実行面」へ近づいていることが分かる。

このサイトではすでに、[Visual StudioからCopilot cloud agentを起動する更新](/blog/github-copilot-visual-studio-cloud-agent-2026/)を扱った。4月時点の焦点は、IDEから非同期にissueやPRへつなぐ入口だった。今回はその入口に、MCP接続の信頼判断、使用量の可視化、C++刷新の作業支援が重なる。さらに[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)や[GitHub MCP Serverの事前検査](/blog/github-mcp-server-security-scanning-2026/)と合わせると、GitHubはCopilotをIDE単位ではなく、権限、費用、セキュリティ、レガシー刷新を含む開発基盤として広げている。

## 事実: 今回の更新はVisual Studio固有の統制面を広げた

GitHub Changelogは、2026年6月分のVisual Studio向けCopilot更新として、MCP serverのtrust prompt、Copilot usage notification、C++ modernization agent GAなどを挙げている。VS CodeやJetBrains向けの更新と違い、Visual Studioの文脈では.NET、C#、C++、Windows標準端末、企業内IDE配布が強く関係する。

ここで注目すべきは、機能の向きが「より賢く回答する」だけではないことだ。MCP trust promptは接続先の信頼判断、usage notificationは使用量と費用、C++ modernization agentは既存資産の変換とレビュー責任に関わる。つまり、モデル性能ではなく、AIを業務環境へ入れるときに詰まりやすい運用論点に触れている。

Microsoft LearnのVisual Studio 2026 release notesでも、Copilotやagentic workflowは継続的な更新対象として扱われている。Visual Studioを社内標準として配布している企業では、Copilot拡張だけでなく、Visual Studio本体の更新チャネル、拡張機能ポリシー、プロキシ、証明書、社内認証、VDIの制約も確認対象になる。

## MCP trust promptの読み方

MCPは、AIエージェントが外部ツールやデータソースへ接続するための規格である。GitHub Docsでは、CopilotがMCP serverを通じて外部システムから文脈を取得したり、ツールを呼び出したりできると説明している。社内ナレッジ、issue tracker、CI、セキュリティ検査、設計文書、クラウド管理APIなどとつながる余地がある。

このため、MCP serverを信頼するかどうかは、単なるIDE上のダイアログではない。AIがどの能力を持つかを決める境界である。Visual Studioにtrust promptが入ることは、開発者が意図せずserverを使い始めるリスクを下げる。しかし、個人の判断に任せるだけでは不十分だ。

企業運用では、少なくとも4点を決める必要がある。1つ目は、許可するMCP serverの一覧である。2つ目は、serverごとの権限範囲である。3つ目は、接続先が扱うデータ分類である。4つ目は、利用ログと問い合わせ対応である。これらがないまま「信頼しますか」と聞かれても、現場の開発者は判断できない。

特に日本企業では、顧客別の受託開発や閉域環境が多い。あるプロジェクトで安全なserverが、別プロジェクトでも安全とは限らない。Visual Studio標準イメージにMCP設定を入れる場合、部門別、顧客別、リポジトリ別に許可範囲を分ける必要が出る。MCPは便利な拡張点だが、同時に「AIが呼べる社内能力の棚卸し」でもある。

## usage notificationはFinOpsの現場接点になる

Copilot usage notificationは、開発者の作業面に使用量情報を近づける更新である。GitHub Docsでは、Copilot BusinessとEnterpriseのAI Creditsが、組織やenterpriseの共有プールとして扱われ、Chat、CLI、cloud agent、Spaces、SparkなどのAI機能で消費されると説明している。

ここで重要なのは、Visual Studio利用者が費用構造を意識しにくい点だ。補完中心の時代は、IDE内でCopilotを使っても、開発者は席課金の範囲で動いている感覚を持ちやすかった。だがagentic workflowや長いchat、MCP tool callを含む作業が増えると、利用量は単なる座席数では説明できなくなる。

usage notificationは、このズレを少し埋める。開発者が長いタスクを依頼する前に、上限や使用状況を見られるなら、現場での自己調整が可能になる。ただし、通知だけを入れても運用は成立しない。user-level budget、cost center、追加利用の承認、共有プールの残量、請求月の締め、AI adoption metricsを合わせて設計する必要がある。

日本企業では、費用の説明責任が部門をまたぐ。開発部門は生産性を求め、情シスは安全性を見て、経理や購買は予算枠を見ている。Copilot usage notificationを有効にするなら、通知文言と実際の予算ルールが一致していなければならない。たとえば、通知では上限接近を示しているのに、追加利用の承認経路が不明なら、現場は結局管理者へ都度問い合わせることになる。

## C++ modernization agent GAの実務価値

C++ modernization agentの一般提供は、日本企業にとって見逃しにくい。Visual Studio利用企業には、長年のC++資産を持つ組織が多い。製造装置、組込み、CAD/CAE、金融ミドルウェア、ゲーム、画像処理、通信制御など、C++を短期間で置き換えられない領域は多い。

ただし、modernizationは「古い構文を新しい構文へ変える」だけではない。所有権、例外安全性、スレッド、メモリアロケーション、ABI、コンパイラ設定、警告レベル、静的解析、性能、リアルタイム制約が絡む。AIが提案した変更がビルドを通しても、現場の品質要件を満たすとは限らない。

このため、C++ modernization agentは大規模自動変換ツールとしてではなく、限定範囲の改善提案者として使うのが現実的だ。まずはテストが存在し、依存関係が少なく、性能要件が明確で、レビュー担当者がいるcomponentを選ぶ。AIに変換させ、差分をPR化し、静的解析、単体テスト、ベンチマーク、コードレビューを通す。人間が受け入れ条件を定義しない限り、modernizationは単なる変更量の増加になりかねない。

一方で、うまく使えば価値は大きい。C++刷新は、経験者不足で進みにくいことが多い。AIが初期差分、警告修正、置換候補、コメント生成を補助できれば、熟練者は全行を手で書くのではなく、設計判断とレビューに集中できる。日本の製造業や組込み開発では、この役割分担が現実的な導入点になる。

## C# code review commentとask mode改善の位置づけ

今回の更新には、C#向けの生成されたcode review commentやask mode改善も含まれている。これは単独では小さく見えるが、Visual Studioの中で「質問する」「レビュー観点を得る」「変換する」「MCPで文脈を取る」「使用量を確認する」という作業がつながることを示している。

ここで注意したいのは、レビューコメントの生成が人間レビューの代替ではないことだ。C#のコメント生成やレビュー支援は、初期指摘、説明補助、学習支援には向く。一方で、業務仕様、非機能要件、顧客固有ルール、既存障害の履歴までは、AIが自動で理解できるとは限らない。生成コメントを採用するなら、リポジトリのAGENTS.md、custom instructions、レビュー観点、MCPで取得する文脈を整える必要がある。

[VS Codeの複数chat agent session](/blog/github-copilot-vscode-multichat-agent-sessions-2026/)で扱ったように、GitHub CopilotはIDEごとにagent作業面を広げている。ただし、Visual Studioでは標準化された企業端末や.NET/C++資産の制約が強く出る。VS Code向けの自由な実験と同じ感覚で広げると、権限や費用の管理が追いつかない。

## 日本企業向けの導入設計

実務では、次の順番が扱いやすい。

第一に、対象環境を棚卸しする。Visual Studioのversion、Copilot extension、GitHub Enterprise policy、ネットワーク制約、MCP server接続可否、標準端末と例外端末を確認する。発表記事だけを見て社内告知すると、機能が見えない端末から問い合わせが増える。

第二に、MCPのallowlistを作る。最初は少なくてよい。GitHub公式や社内管理のserver、セキュリティ検査、ドキュメント参照など、価値が明確で権限範囲を説明できるものに絞る。開発者が個人判断で外部serverを信頼する運用は避ける。

第三に、usage notificationと予算設定を結びつける。通知が出るだけでなく、標準上限、重いagent利用者の上限、追加利用の承認、月次レビューの指標を決める。AI Credits消費を悪と見なすのではなく、成果が出る使い方へ予算を寄せる設計にする。

第四に、C++ modernization agentのパイロット範囲を決める。対象は、テストがある、影響範囲が狭い、性能基準がある、レビュー担当者がいる、という条件を満たすcomponentがよい。PRには、AIが生成した差分であること、検証した項目、未確認のリスクを明記する。

第五に、Visual Studio cloud agentや既存Copilot運用と統合する。cloud agent、MCP、usage notification、modernization agentを別々にPoCすると、管理者は全体のリスクを見失う。代表リポジトリで、IDEから作業を始め、MCPで必要な文脈を取り、費用通知を確認し、PRレビューまで通す一連の流れを検証するのがよい。

## 失敗しやすいパターン

最も危ないのは、「開発者の生産性向上」としてだけ導入することだ。今回の更新は生産性に効くが、同時に権限と費用を動かす。MCP serverの信頼、AI Credits消費、C++コードの変換、生成レビューコメントは、いずれも組織としてのルールが必要になる。

次に危ないのは、MCPを全面禁止することだ。MCPにはリスクがあるが、secret scanningやdependency scanningのように、AI作業を安全にするための経路にもなる。禁止か自由化かの二択ではなく、許可serverと用途を絞るほうが現実的だ。

三つ目は、C++ modernizationを一括変換プロジェクトとして始めることだ。AIの提案は差分を速く作れるが、検証能力が追いつかなければ品質負債を増やす。小さな範囲から、テストとレビューを伴って進めるべきだ。

## まとめ

GitHub Copilot in Visual Studioの2026年7月更新は、Visual Studio上のAI利用を企業運用へ寄せる更新である。MCP trust promptは接続権限の入口、usage notificationはAI Credits運用の現場接点、C++ modernization agent GAはレガシー刷新への実務導線になる。

日本の.NET/C++開発組織は、今回の更新をIDE機能の追加としてではなく、開発基盤の運用変更として扱うべきだ。Visual Studio標準端末、MCP allowlist、AI Credits予算、C++刷新のレビュー条件をセットで決めれば、Copilotを「便利な個人ツール」から「統制されたAI開発基盤」へ近づけられる。

## 出典

- [GitHub Copilot in Visual Studio - June update](https://github.blog/changelog/2026-07-14-github-copilot-in-visual-studio-june-update/) - GitHub Changelog, 2026-07-14
- [Visual Studio 2026 release notes](https://learn.microsoft.com/en-us/visualstudio/releases/2026/release-notes) - Microsoft Learn, accessed 2026-07-15
- [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp) - GitHub Docs, accessed 2026-07-15
- [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) - GitHub Docs, accessed 2026-07-15
