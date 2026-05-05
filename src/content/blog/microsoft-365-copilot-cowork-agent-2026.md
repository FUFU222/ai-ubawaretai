---
title: 'Microsoft 365 Copilot更新、AI業務設計の焦点'
description: 'Microsoft 365 Copilot更新を、Copilot Cowork、Agent 365、Work Trend Indexから整理。日本企業がAIエージェントを業務へ委任する前に見るべき統制、データ接続、リーダーシップ課題を解説する。'
pubDate: '2026-05-05'
category: 'news'
tags: ['Microsoft', 'Agent 365', 'Copilot', 'AIエージェント', 'AIガバナンス', '業務AI']
series: 'microsoft-agent-work-platform-2026'
seriesTitle: 'MicrosoftのAIエージェント業務基盤'
draft: false
---

Microsoftが2026年5月5日に公開したMicrosoft 365 Copilot関連の更新は、単なる機能追加の一覧ではない。主題は、AIを「質問に答える道具」から、**人が責任を持ちながら仕事を委任する業務基盤**へ移すことにある。

今回の一次ソースは大きく4つある。Microsoft 365 Blogの[Copilotとhuman agencyの記事](https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/microsoft-365-copilot-human-agency-and-the-opportunity-for-every-organization/)、[Copilot Coworkの記事](https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/copilot-cowork-from-conversation-to-action-across-skills-integrations-and-devices/)、5月1日の[Agent 365一般提供記事](https://www.microsoft.com/en-us/security/blog/2026/05/01/microsoft-agent-365-now-generally-available-expands-capabilities-and-integrations/)、そして[2026 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2026)だ。これらを合わせて読むと、Microsoftが売りたいものは「便利なCopilot」だけではなく、仕事の流れ、社内データ、AIエージェント、管理面を束ねる運用モデルだと分かる。

日本企業にとっては、以前整理した[Microsoft Agent 365の統制論点](/blog/microsoft-agent-365-enterprise-governance-2026-04-28/)の続編として読むのが自然だ。4月時点では「5月1日のGA前に何を確認するか」が焦点だった。今回は、GA後のAgent 365、Copilot Coworkのモバイル化、Skillsとplugins、federated Copilot connectorsの一般提供まで出てきた。つまり論点は、管理面の準備から、**どの仕事をAIに任せるか**へ一段進んだ。

## 事実: Work Trend Indexは組織設計の問題としてAIを見ている

まず事実から確認する。

Microsoftは5月5日の記事で、2026 Work Trend Indexを参照しながら、AIとエージェントが実行作業を担うほど、人間は「何を任せ、何を自分で判断するか」を設計する側へ移ると説明している。Microsoftは、匿名化されたMicrosoft 365の生産性シグナルと、10か国のAI利用者2万人への調査を分析したとしている。

記事中で目立つ数字は3つある。Microsoft 365 Copilot内の10万件超のチャート分析では、会話の49%が分析、問題解決、思考のような cognitive work を支えていた。AI利用者の58%は、1年前には作れなかった成果物を作れるようになったと答えた。さらに、先進的なAI利用者であるFrontier Professionalsでは、その割合が80%に上がる。

ただし、Microsoftは個人の生産性だけを強調していない。むしろ重要なのは、AI利用者の組織内で「リーダーシップがAIについて明確かつ一貫して足並みをそろえている」と答えた人が4人に1人だけだったという点だ。AIで早く動かないと遅れるという不安はあるのに、現在の目標へ集中するほうが安全だと感じる人も多い。MicrosoftはこれをTransformation Paradoxとしている。

ここは日本企業にもそのまま当てはまる。現場はAIで作業を速くしたい。一方、部門長、情シス、セキュリティ、法務、調達は、責任分界と統制を求める。現場の利用意欲と、組織の受け皿がずれると、AI活用はPoC止まりになる。

## 事実: Copilot Coworkは会話から実行へ寄った

2つ目の事実は、Copilot Coworkの更新だ。

MicrosoftはCoworkを、チャットの回答ではなく、実際のタスクを委任して完了させるためのものとして説明している。今回の更新では、CoworkがiOSとAndroidに広がり、移動中や会議の合間に仕事を委任し、デスクトップで続きから確認できる流れが打ち出された。これは小さなUI追加に見えるが、業務運用上はかなり意味がある。AIへの委任が「PCの前でプロンプトを書く時間」だけに閉じなくなるからだ。

さらにCowork Skillsも発表された。Skillsは、タスクやワークフローの進め方、文書構造、トーン、手順を再利用可能な指示として持たせる仕組みだ。Microsoftは、文書作成、会議調整、リサーチのような共通業務向けのbuilt-in skillsに加えて、チーム固有のcustom skillsも作れると説明している。

もう1つ重要なのがpluginsだ。CoworkはFabric IQ with Power BI、Dynamics 365、ERPや営業・カスタマーサービス系の業務アプリへつながる。さらにLSEG、Miro、monday.com、S&P Global Energyなどの外部連携も予定されている。Microsoft 365とResearcherでは、HubSpot、LSEG、Moody's、Notionなどのfederated Copilot connectorsが一般提供になり、Excelにも今夏入るとされている。

つまりCoworkは、単なるCopilotの別UIではない。社内データ、外部SaaS、反復業務手順をつなぎ、AIに「会社のやり方で動いてもらう」方向へ進んでいる。この流れは、[SalesforceとSlackのAI work platform化](/blog/salesforce-slack-ai-work-platform-2026/)とも競合する。各社が取りにいっているのは、モデル単体ではなく、実際の仕事が流れる面だ。

## 事実: Agent 365はGA後にshadow AI管理へ広がった

3つ目の事実は、Agent 365だ。

5月1日のMicrosoft Security Blogでは、Agent 365がcommercial customers向けに一般提供を開始したとされている。価格はスタンドアロンで月額15ドル/ユーザー、またはMicrosoft 365 E7に含まれる。ここまでは4月の記事でも見えていたが、GA記事ではカバー範囲がさらに具体化された。

Agent 365は、Microsoft製エージェントだけでなく、ローカル、SaaS、クラウド上のAIエージェントを observe、govern、secure する control plane として説明されている。新しいpreview機能として、OpenClawやClaude Codeのようなローカルエージェントの発見、Intuneによるブロック、Defenderによる資産コンテキストマッピング、MCPサーバーやクラウドリソースとの関係把握が挙げられている。AWS BedrockやGoogle Cloudとのregistry syncもpublic previewとして出ている。

これは日本の情シスやセキュリティ部門にはかなり重要だ。現場が勝手にAIツールを導入するshadow AIは、すでに現実の問題になっている。しかも今後は、ブラウザで使うAIだけでなく、端末上でコードを編集するローカルエージェント、MCPサーバー、クラウド上の業務エージェントまで混ざる。Agent 365は、その増殖をMicrosoft 365 admin center、Defender、Intune、Entra、Purviewの運用に寄せて管理しようとしている。

[Microsoftの日本AI投資](/blog/microsoft-japan-ai-investment-2026/)でも見たように、日本市場ではMicrosoft 365、Azure、GitHub、セキュリティ製品が企業ITの標準面に入りやすい。だからAgent 365の価値は、AI機能そのものよりも、既存の管理基盤へ載せやすいことにある。

## 分析: 日本企業で必要なのはAI推進より委任設計

ここからは分析だ。

今回のMicrosoft更新で一番重要なのは、AI導入の問いが「誰が使うか」から「何を委任するか」に変わっていることだと思う。Copilot Coworkは、モバイルからも仕事を投げられる。Skillsは、仕事の型を再利用できる。Pluginsとconnectorsは、社内外のシステムに接続する。Agent 365は、増えたエージェントを管理する。

この組み合わせは便利だが、何も考えずに入れると危ない。AIが実行へ寄るほど、プロンプトの品質より、権限、データ境界、承認、停止条件、責任者の設計が重要になる。特に日本企業では、業務部門が作ったワークフローを情シスが後から棚卸しする形になりやすい。そこで最初に必要なのは「AIを使おう」という掛け声ではなく、委任できる仕事と委任してはいけない仕事の分類だ。

たとえば、議事録の整理、社内文書の初稿作成、営業パイプラインの要約、調査メモ作成は比較的委任しやすい。一方で、顧客への最終回答、価格条件の確定、契約文言の変更、個人情報を含む外部送信、コードの本番反映は、人間の承認や監査ログが必須になる。Cowork Skillsを作るなら、この境界をスキルごとに書き込む必要がある。

また、Microsoftの発信は「人間のagency」を前面に出している。これは単なる精神論ではない。AIに作業を任せても、成果物の責任、判断、優先順位づけは人間が持つという意味だ。日本企業で導入するなら、AI利用規程も「禁止事項」だけでなく、「どの職種が、どの成果物に、どの承認を挟んでAIを使うか」まで書く必要がある。

## 確認すべきこと

日本企業が今回の更新を受けて確認すべき点は、次の5つだ。

1つ目は、Microsoft 365 Copilotを個人の作業補助としてだけ見るのをやめることだ。Cowork、Skills、pluginsが入ると、Copilotは業務フローの一部になる。導入判断は、ライセンス配布だけでなく、どの業務を標準化するかに踏み込むべきだ。

2つ目は、Agent 365の評価を情シスとセキュリティ主導で行うことだ。現場向けCopilotと同じノリで評価すると、統制面の価値を見落とす。特にローカルエージェント、MCP、外部SaaSエージェントの棚卸しは、今のうちに課題化しておいたほうがいい。

3つ目は、社内データ接続の承認基準だ。Connectorsやpluginsは便利だが、Notion、HubSpot、Dynamics、Fabric、Excelなどを横断するほど、データの出どころとアクセス権の説明が難しくなる。部門ごとに勝手につなぐのではなく、接続先、権限、ログ、DLPの基準を先にそろえる必要がある。

4つ目は、AI人材育成をプロンプト研修で終わらせないことだ。Work Trend Indexが示すように、組織文化、マネージャー支援、人材制度はAI効果に大きく関わる。つまり、研修対象は利用者だけでなく、マネージャー、業務設計者、情シス、監査担当まで広げるべきだ。

5つ目は、外部ベンダーと内製の役割分担だ。[Anthropicの企業AIサービス会社構想](/blog/anthropic-enterprise-ai-services-company-2026/)でも見たように、AI導入はツール購入だけではなく、業務設計や人材育成を含むサービス化へ進んでいる。MicrosoftもAgent 365 launch partnersを通じて、棚卸し、最小権限、監査証跡、継続運用を支援する方向を出している。日本企業は、内製で管理面を持つ部分と、外部支援を使う部分を切り分ける必要がある。

## まとめ

2026年5月5日のMicrosoft 365 Copilot更新は、AIを仕事の横に置く段階から、仕事そのものをAIと人間で再設計する段階へ移ったことを示している。Copilot Coworkは会話から実行へ進み、Skillsとpluginsは会社固有の仕事へ寄せ、Agent 365は増えるエージェントを管理する面としてGA後の範囲を広げた。

日本企業にとっての焦点は、Copilotを使うかどうかではない。AIに何を委任し、どのデータにつなぎ、誰が責任を持ち、どの管理面で監査するかだ。今回の更新は、その設計を先送りできなくなってきたことを示す、かなり実務的なシグナルだと言える。

## 出典

- [Microsoft 365 Copilot, human agency, and the opportunity for every organization](https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/microsoft-365-copilot-human-agency-and-the-opportunity-for-every-organization/) - Microsoft
- [Copilot Cowork: From conversation to action across skills, integrations, and devices](https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/copilot-cowork-from-conversation-to-action-across-skills-integrations-and-devices/) - Microsoft
- [Microsoft Agent 365, now generally available, expands capabilities and integrations](https://www.microsoft.com/en-us/security/blog/2026/05/01/microsoft-agent-365-now-generally-available-expands-capabilities-and-integrations/) - Microsoft
- [2026 Work Trend Index Annual Report](https://www.microsoft.com/en-us/worklab/work-trend-index/2026) - Microsoft WorkLab
