---
article: 'microsoft-365-copilot-cowork-agent-2026'
level: 'expert'
---

Microsoftの2026年5月5日のMicrosoft 365 Copilot更新は、単一製品の機能追加として読むより、エンタープライズAIの設計思想の更新として読むべきだ。Microsoftは、AIを「会話による支援」から「人間が責任を持って委任する実行系」へ移し、その実行系をMicrosoft 365 Copilot、Copilot Cowork、Work IQ、federated Copilot connectors、Agent 365で束ねようとしている。

この構図は、4月末に整理した[Microsoft Agent 365の企業ガバナンス](/blog/microsoft-agent-365-enterprise-governance-2026-04-28/)と地続きだ。前回の焦点は、Agent 365のGA前に価格、ライセンス、統制機能をどう読むかだった。今回は、Agent 365がGAした後に、Copilot Coworkやconnectorsが実際の業務委任をどう広げるかが見えてきた。つまり、統制面だけでなく、仕事の委任面まで同時に設計しなければならない。

日本企業では、Microsoft 365、Entra、Purview、Defender、Azure、GitHubが既存ITの標準面に深く入っている会社が多い。[Microsoftの日本AI投資](/blog/microsoft-japan-ai-investment-2026/)で見たように、同社は日本市場をAI需要が大きい市場として扱っている。だから今回の更新は、米国本社向けの働き方論ではなく、日本の情シス、CISO室、業務改革部門、開発組織にも直接関係する。

## 事実: MicrosoftはWork Trend Indexを製品更新の土台に置いた

まず、5月5日のMicrosoft 365 Blog記事は、2026 Work Trend Indexを起点にしている。Microsoftは、匿名化されたMicrosoft 365の生産性シグナル、AIを利用する10か国2万人への調査、AI・仕事・組織心理の専門家へのインタビューをもとに、AIとエージェントが仕事の実行を担うほど、人間はより大きなagencyを持つと説明している。

ここでのagencyは、単に自由度が上がるという意味ではない。AIが作業を実行するなら、人間は何を任せ、何を自分で判断し、成果物にどう責任を持つかを決めなければならない。Microsoftは、この構図を「人が実行する」から「人が仕事を設計する」への変化として描いている。

記事には、Copilot内の10万件超のチャート分析で会話の49%がcognitive workを支えていたこと、AI利用者の58%が1年前には作れなかった成果物を作れるようになったと答えたこと、Frontier Professionalsではその割合が80%になることが示されている。これらは、AIが単純な時短だけでなく、分析、思考、構造化、成果物化の領域まで広がっているという根拠として置かれている。

一方で、Microsoftは組織側の遅れも強調している。AI利用者のうち、自社のリーダーシップがAIについて明確かつ一貫していると答えた人は4人に1人にとどまる。AIを使わなければ遅れるという不安と、既存目標に集中するほうが安全だという心理が同時に存在する。MicrosoftはこれをTransformation Paradoxとしている。

この点は日本企業にとって特に重要だ。生成AIの導入は、現場主導のPoCでは速く進む。しかし、全社展開では、業務プロセス、権限、データ分類、監査、調達、教育、人事評価が絡む。個人のAI利用能力が上がっても、組織の設計が変わらなければ、AIは正式業務の外側にとどまりやすい。

## 事実: Copilot Coworkはクラウド常駐型の業務委任へ寄った

Copilot Coworkの記事でMicrosoftが強調しているのは、AIが情報を探して答える段階から、実際に作業を進める段階へ移ることだ。Coworkは、クラウド上で動くため、PCを閉じても作業が継続する。今回、iOSとAndroidへの展開が説明され、移動中や会議の間にタスクを委任し、デスクトップで結果を拾う流れが示された。

これはUXの拡張に見えるが、業務設計上は大きな変化だ。従来の生成AI利用は、利用者がPCの前でプロンプトを入力し、その場で結果を受け取る形が中心だった。Coworkがモバイルとクラウド常駐へ寄ると、AIへの委任は「その場の会話」ではなく、非同期の業務実行になる。つまり、タスクの開始、進捗、成果物、確認、修正、承認をどう扱うかが必要になる。

さらに、Cowork Skillsは、チームや組織の作業手順をAIに再利用させる仕組みとして位置づけられている。Microsoftは、文書作成、会議調整、リサーチのようなbuilt-in skillsに加え、チーム固有のcustom skillsを作れると説明している。ここで重要なのは、skillsが単なるテンプレートではなく、作業の型、トーン、プロセスをAIに適用する仕組みだという点だ。

日本企業でこれを導入するなら、Skillsはプロンプト集ではなく、業務標準の実装物になる。営業提案書の構成、稟議資料の観点、顧客問い合わせの初期分類、開発レビューの観点、会議後アクションの抽出方法などを、スキルとして標準化する可能性がある。一方で、それは業務標準をAIに委任することでもあるため、誰がスキルを承認し、更新し、廃止するのかを決めなければならない。

## 事実: pluginsとconnectorsはAIの接続範囲を広げる

Cowork pluginsとfederated Copilot connectorsは、今回の更新で見落としやすいが実務的には重要だ。Microsoftは、Fabric IQ with Power BI、Dynamics 365の営業、カスタマーサービス、ERPアプリケーションとの連携を説明している。さらに、LSEG、Miro、monday.com、S&P Global Energyなどの外部連携を今後数週間で出すとしている。

5月5日のCopilot記事では、HubSpot、LSEG、Moody's、Notionなどのfederated Copilot connectorsがMicrosoft 365とResearcherで一般提供になり、Excelにも今夏入るとされている。これは、CopilotがMicrosoft 365内の文書やメールだけでなく、業務SaaS、金融情報、ナレッジベース、CRMのような外部文脈へ広がることを意味する。

この方向性は、[SalesforceとSlackのAI work platform化](/blog/salesforce-slack-ai-work-platform-2026/)と同じ競争軸にある。SalesforceはSlackを営業・CS・社内業務のAI入口へ寄せ、MicrosoftはMicrosoft 365とCopilotを仕事の入口へ寄せる。どちらも、勝負しているのはモデル単体ではなく、業務データと実行面へのアクセスだ。

実務上のリスクも同じだ。AIが見られるデータが増えるほど、データ分類、権限継承、DLP、ログ、外部連携審査が重要になる。たとえば、Notionにある社内メモ、HubSpotにある顧客情報、Dynamics 365にある商談情報、Power BIにある経営指標を横断できるようになると、AIは強くなる。同時に、誤った権限設定や過度な接続は、情報の過剰共有につながる。

日本企業では、ここを「Copilotが便利になる」で済ませないほうがいい。AIが接続するシステムを増やすたびに、誰の権限で検索するのか、どの結果を成果物に含めてよいのか、外部への転記や送信は許されるのか、ログは監査に耐えるのかを確認する必要がある。

## 事実: Agent 365はGA後、shadow AIとマルチプラットフォームへ踏み込んだ

5月1日のMicrosoft Security Blogでは、Agent 365がcommercial customers向けに一般提供になったと説明されている。スタンドアロン価格は月額15ドル/ユーザーで、Microsoft 365 E7にも含まれる。ライセンスは、エージェントを管理またはスポンサーする個人、または自分の代理としてエージェントに仕事をさせる個人をカバーする形で説明されている。

より重要なのは、GA記事でAgent 365の対象範囲が広く描かれていることだ。Agent 365は、Microsoft AIで作られたエージェントだけでなく、ecosystem partnerのエージェント、ローカルエージェント、SaaSエージェント、クラウドエージェントをobserve、govern、secureするcontrol planeとして位置づけられている。

具体的には、Microsoft DefenderとIntuneを使ったローカルAIエージェントの発見と管理が示されている。最初はOpenClawを対象にし、GitHub Copilot CLIやClaude Codeのような広く使われるエージェントにも拡張予定とされている。さらに、2026年6月からはDefenderがエージェントの実行端末、設定されたMCPサーバー、紐づくID、到達可能なクラウドリソースをマッピングする予定だと説明されている。

また、AWS BedrockとGoogle Cloud connectionsによるAgent 365 registry syncもpublic previewとして発表されている。これは、Microsoftの管理面がAzureやMicrosoft 365の中だけでなく、他社クラウド上のエージェントにも可視性を広げようとしていることを示す。

この動きは、CISO室や情シスにとって非常に実務的だ。AIエージェントは、ブラウザSaaSだけでなく、ローカルIDE、CLI、MCP、クラウド基盤、業務SaaSへ広がる。Agent 365は、その分散をMicrosoftの管理面に集めようとしている。これは、単なるCopilot管理ではなく、AIエージェント時代のIT資産管理に近い。

## 分析: Microsoftの狙いは「仕事の入口」と「統制面」を同時に押さえること

ここからは分析に入る。

Microsoftの今回の発信を一本の線で見ると、狙いはかなり明確だ。Microsoft 365 Copilotで仕事の入口を押さえ、Coworkで実行を担い、Skillsで業務標準を再利用可能にし、plugins/connectorsで業務データへつなぎ、Agent 365で統制する。これは、AI単体の競争ではなく、企業の仕事のオペレーティングシステムを取りにいく動きだ。

OpenAI、Anthropic、Google、Salesforce、Slack、GitHub、Cursorなども、それぞれの面から同じ方向へ動いている。しかしMicrosoftの強みは、既存の業務アプリ、ID、セキュリティ、管理センター、パートナー販売網を持っていることだ。AIが実行へ寄るほど、モデル性能だけでなく、ID、権限、DLP、監査、請求、教育、パートナー支援が勝負になる。Microsoftはそこをまとめて出せる。

一方、これは導入企業にとっても責任が重くなることを意味する。Copilot Coworkやpluginsを広げるほど、AIは現場の業務に深く入る。Agent 365で可視化できるとしても、そもそも委任してよい作業、接続してよいデータ、承認すべき成果物を定義していなければ、管理面は後追いになる。

[Anthropicの企業AIサービス会社構想](/blog/anthropic-enterprise-ai-services-company-2026/)でも、AI導入がツール購入からサービス設計、業務変革、人材育成へ広がる流れを見た。MicrosoftもAgent 365 launch partnersを通じて、inventory and ownership、least privilege、compliance and data protection、multi-platform estates、ongoing operationsを支援すると説明している。つまり、ベンダー側も「ライセンスを売れば終わり」ではなく、導入運用の設計まで売る方向へ進んでいる。

## 日本企業の導入設計: まず業務を3分類する

日本企業が今回のMicrosoft更新を受けて最初にやるべきことは、Copilotの追加機能を試すことではなく、業務を3つに分類することだ。

第1分類は、AIに初稿や整理を任せやすい仕事だ。議事録、要約、社内文書のたたき台、調査メモ、メール文案、Excel分析の初期視点、PowerPointの構成案などが入る。この領域は、Cowork Skillsで標準化しやすい。

第2分類は、AIに作業させるが人間承認が必要な仕事だ。営業資料の顧客向け版、問い合わせ返信案、契約レビューの論点抽出、コード変更案、購買稟議の補助、顧客セグメント分析などが入る。ここでは、AIの出力を成果物として扱う前に、承認者、ログ、変更履歴、データソースを確認する必要がある。

第3分類は、AIに直接実行させるべきではない仕事だ。価格条件の最終決定、契約条項の自動変更、顧客への正式回答送信、本番環境への反映、個人情報の外部転記、規制対象判断の確定などだ。この領域では、AIは補助にとどめ、人間の明示承認と監査証跡を必須にするべきだ。

この分類を作らないままCoworkやpluginsを広げると、現場ごとに判断がばらける。結果として、AI利用の効率化より、後からの統制修正コストが大きくなる。

## 情シスとCISO室の確認リスト

情シスとCISO室は、今回の更新を次の観点で見るべきだ。

まず、Agent 365で可視化できる対象範囲だ。Microsoft製エージェント、Copilot Studio、ローカルエージェント、SaaSエージェント、AWS BedrockやGoogle Cloud上のエージェントが、どの段階でどこまで見えるのかを確認する必要がある。特にpreview機能は、GA済み機能と分けて評価すべきだ。

次に、MCPとローカルエージェントの棚卸しだ。Claude Code、GitHub Copilot CLI、OpenClawのようなローカル/CLIエージェントは、開発者端末で導入されやすい。MCPサーバーが社内システムやクラウド権限へ接続すると、影響範囲は端末内に収まらない。DefenderやIntuneによる発見、ブロック、関係マッピングがどこまで使えるかを見ておく必要がある。

3つ目は、connectors/pluginsの承認プロセスだ。Notion、HubSpot、Dynamics、Fabric、Excel、外部金融データなどに接続する場合、データオーナー、DLP分類、ログ保管、エクスポート制限を決めなければならない。Copilotの接続先は、SaaS連携の棚卸しと同じレベルで扱うべきだ。

4つ目は、ライセンスと責任者の対応だ。Agent 365のライセンス説明は、エージェントを管理・スポンサーする人、または代理で仕事をさせる人をカバーする形に寄っている。日本企業では、部門長、業務オーナー、現場利用者、IT管理者のどこに費用と責任を置くかを決める必要がある。

## 業務部門と開発チームの確認リスト

業務部門は、AIへ任せる成果物の定義を先に作るべきだ。たとえば営業部門なら、商談要約、提案書たたき台、フォローアップメール案、CRM更新案をAIに任せるのか、それとも実際の送信や更新まで許すのかを分ける。カスタマーサポートなら、問い合わせ分類、FAQ候補、返信案、エスカレーション判断をどう切るかが必要だ。

開発チームは、CoworkやAgent 365を単独で見るより、既存のGitHub Copilot、MCP、ローカルエージェント、CI/CD、セキュリティレビューと合わせて見るべきだ。AIエージェントがコードを書くだけでなく、チケットを読み、PRを作り、レビューし、環境へアクセスするなら、権限の粒度とログが重要になる。

また、Skillsやpluginsは内製の余地がある。業務手順をAIが再利用できる形に落とすには、業務部門の暗黙知を形式化する必要がある。これは単なるAI研修ではなく、業務プロセスの棚卸しだ。日本企業ではここをSIパートナーやコンサルに任せるケースも出るだろうが、最終的な業務オーナーは社内に置くべきだ。

## まとめ

Microsoft 365 Copilot、Copilot Cowork、Agent 365、2026 Work Trend Indexを合わせて読むと、MicrosoftはAIを「会話で助けるツール」から「人間が設計し、AIが実行し、管理面で統制する業務基盤」へ移そうとしている。Coworkはモバイルとクラウド常駐で委任を広げ、Skillsは仕事の型を再利用し、plugins/connectorsは業務データへつなぎ、Agent 365はshadow AIやマルチクラウドのエージェントまで見ようとしている。

日本企業にとっての論点は、Copilotの新機能をいつ使うかではない。どの業務をAIに委任し、どのデータへ接続し、誰が承認し、どの管理面で監査するかだ。今回の更新は、その設計を後回しにすると、AI活用の速度より統制の遅れが問題になることを示している。

## 出典

- [Microsoft 365 Copilot, human agency, and the opportunity for every organization](https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/microsoft-365-copilot-human-agency-and-the-opportunity-for-every-organization/) - Microsoft
- [Copilot Cowork: From conversation to action across skills, integrations, and devices](https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/copilot-cowork-from-conversation-to-action-across-skills-integrations-and-devices/) - Microsoft
- [Microsoft Agent 365, now generally available, expands capabilities and integrations](https://www.microsoft.com/en-us/security/blog/2026/05/01/microsoft-agent-365-now-generally-available-expands-capabilities-and-integrations/) - Microsoft
- [2026 Work Trend Index Annual Report](https://www.microsoft.com/en-us/worklab/work-trend-index/2026) - Microsoft WorkLab
