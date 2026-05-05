---
article: 'microsoft-365-copilot-cowork-agent-2026'
level: 'child'
---

Microsoftが2026年5月5日に、Microsoft 365 Copilotまわりの大きな更新をまとめて出しました。難しく見えますが、中心にある考え方はシンプルです。AIを「聞いたら答えるもの」から、**仕事を任せて進めてもらうもの**へ変えようとしている、ということです。

今回見るべきものは、Microsoft 365 Copilot、Copilot Cowork、Agent 365、2026 Work Trend Indexです。Copilotは普段使うWord、Excel、PowerPoint、Outlookなどに入るAIです。Coworkは、AIに作業を頼んで進めてもらう仕組みです。Agent 365は、社内で増えるAIエージェントを管理するための仕組みです。

日本の会社にとって大事なのは、「便利そうだから入れる」だけでは足りないことです。AIが実際の仕事を進めるようになると、どの作業を任せてよいのか、どのデータを見せてよいのか、最後に誰が確認するのかを決める必要があります。

## 何が変わったの？

まずMicrosoft 365 Copilotの記事では、AIによって人の仕事が変わっていることが説明されています。Microsoftは、10か国のAI利用者2万人への調査や、Microsoft 365の匿名化された利用データをもとに、AIが分析や問題解決のような知的作業を支えていると説明しています。

ただし、Microsoftは「AIを使えば全部解決する」とは言っていません。むしろ、組織側の準備が追いついていないことを問題にしています。AIを使う人は増えているのに、会社としてどの仕事をAIに任せるか、どう管理するかが決まっていないと、効果が出にくいからです。

ここで出てくるのがCopilot Coworkです。Coworkは、AIと会話するだけではなく、タスクを任せるための仕組みです。今回、iOSとAndroidにも広がると説明されました。つまり、移動中や会議の合間でも、スマホから仕事をAIに頼み、あとでPCで確認するような使い方が想定されています。

## Cowork Skillsとpluginsは何？

Cowork Skillsは、仕事の進め方をAIに覚えさせるような仕組みです。たとえば、会議メモの作り方、営業資料の構成、調査レポートの形式など、毎回同じように進めたい作業があります。Skillsを使うと、その手順やトーンを再利用しやすくなります。

pluginsは、AIが他のツールとつながるための仕組みです。Microsoftは、FabricやDynamics 365との連携、さらにLSEG、Miro、monday.com、S&P Global Energyなどの外部サービスとの接続を説明しています。HubSpot、Moody's、Notionなどのfederated Copilot connectorsも一般提供になったとされています。

これは便利ですが、注意も必要です。AIがいろいろなツールにつながるほど、見られるデータも増えます。だから日本企業では、どのツールにつなぐか、誰の権限で動くか、ログをどう残すかを先に決めておく必要があります。

## Agent 365はなぜ重要？

Agent 365は、AIエージェントを管理するための仕組みです。Microsoftは5月1日に、Agent 365が商用顧客向けに一般提供になったと発表しました。価格はスタンドアロンで月額15ドル/ユーザー、またはMicrosoft 365 E7に含まれる形です。

Agent 365が重要なのは、AIエージェントが社内でどんどん増えるからです。Copilotだけでなく、ローカルPCで動くAI、クラウド上のエージェント、外部SaaSのAIなどが混ざってきます。すると、会社は「どのAIがどこで動いているのか」を見失いやすくなります。

MicrosoftはAgent 365を、エージェントを見つけ、管理し、安全に使うためのcontrol planeとして説明しています。DefenderやIntuneを使って、ローカルエージェントやshadow AIを発見、管理する機能も出てきています。

## 日本企業は何を確認すべき？

日本企業がまず確認すべきなのは、AIに任せてよい仕事と、任せてはいけない仕事の線引きです。資料の下書き、会議メモの整理、調査のたたき台は任せやすいでしょう。一方で、契約条件の最終判断、顧客への正式回答、本番コードへの反映などは、人間の承認が必要です。

次に、データ接続のルールです。CoworkやCopilot connectorsは、社内外の情報をつなげます。便利な反面、情報の出どころ、アクセス権、個人情報や機密情報の扱いを決めないまま広げると危険です。

最後に、管理する人を決めることです。AI活用は現場だけの話ではありません。情シス、セキュリティ、法務、監査、業務部門が一緒にルールを作る必要があります。

## まとめ

今回のMicrosoft 365 Copilot更新は、AIをただ使う段階から、AIに仕事を任せる段階へ進んだことを示しています。Coworkは仕事を委任しやすくし、Skillsとpluginsは会社のやり方に合わせ、Agent 365は増えるAIを管理します。

日本企業にとって大事なのは、Copilotを入れるかどうかだけではありません。どの仕事をAIに任せ、どのデータにつなぎ、誰が責任を持つのかを決めることです。そこまで設計して初めて、AIを本当の業務基盤として使いやすくなります。

## 出典

- [Microsoft 365 Copilot, human agency, and the opportunity for every organization](https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/microsoft-365-copilot-human-agency-and-the-opportunity-for-every-organization/) - Microsoft
- [Copilot Cowork: From conversation to action across skills, integrations, and devices](https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/copilot-cowork-from-conversation-to-action-across-skills-integrations-and-devices/) - Microsoft
- [Microsoft Agent 365, now generally available, expands capabilities and integrations](https://www.microsoft.com/en-us/security/blog/2026/05/01/microsoft-agent-365-now-generally-available-expands-capabilities-and-integrations/) - Microsoft
- [2026 Work Trend Index Annual Report](https://www.microsoft.com/en-us/worklab/work-trend-index/2026) - Microsoft WorkLab
