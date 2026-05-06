---
article: 'anthropic-claude-finance-agents-2026'
level: 'child'
---

Anthropic が 2026年5月5日に発表した Claude 金融エージェントは、金融機関向けに用意された AI 業務テンプレート群です。ポイントは、単に「Claude が金融に詳しくなった」という話ではありません。ピッチブック作成、KYC 確認、月次決算、財務モデル作成など、実際の金融業務ごとに AI エージェントの型を用意したことです。

## 何が発表されたのか

発表されたのは、金融サービス向けの 10 個の agent templates です。たとえば、顧客向け提案資料を作る pitch builder、会議前の情報を集める meeting preparer、決算資料を読む earnings reviewer、財務モデルを作る model builder、KYC ファイルを見る KYC reviewer などがあります。

これらはプロンプト集というより、業務手順、必要なデータ接続、補助役の AI モデルをまとめた reference architecture とされています。Claude Cowork や Claude Code の plugin として使えるほか、Claude Managed Agents の cookbook としても使えるため、現場ユーザーと開発者の両方に入口があります。

## Microsoft 365で使える意味

金融の仕事は Excel、PowerPoint、Word、Outlook に強く依存しています。Anthropic は、Claude が Microsoft 365 add-ins 経由で Excel、PowerPoint、Word、Outlook に入ることも説明しています。Outlook は coming soon ですが、Excel でモデルを作り、PowerPoint で資料を作り、Word でメモを直す流れは金融実務にかなり近いです。

これが重要なのは、AI の答えを別画面からコピーするだけでは業務効率が上がりにくいからです。金融機関では、最後の成果物が Excel モデル、投資委員会資料、稟議書、顧客向けメールになることが多い。Claude がその作業面に入るなら、AI 活用はチャットから日常業務へ近づきます。

## データ連携も大きな論点

今回の発表では、FactSet、S&P Capital IQ、MSCI、PitchBook、Morningstar、LSEG など、金融データや調査情報への connector も触れられています。さらに Moody's は MCP app を出したとされています。

ここで大事なのは、Claude が勝手に金融データを持つわけではないことです。connector は、権限管理された形でデータにアクセスするための仕組みです。金融機関では、誰がどのデータを AI に見せてよいのか、出力にどの情報を含めてよいのかを決める必要があります。

## 日本の金融機関が見るべきこと

日本の銀行、証券、保険、資産運用会社では、まず会議準備、資料のたたき台作成、決算資料の要約、モデルの数字チェックのような補助業務から見るのが現実的です。いきなり融資判断、投資判断、保険金支払い判断を AI に任せるべきではありません。

KYC や AML の補助は有望ですが、最終判断は人間が持つ必要があります。AI はファイルを読み、抜け漏れや疑問点を整理する役には向きます。一方で、誤判定したときの責任、根拠の説明、監査ログが必要です。

## まず確認すること

導入前には、どのデータを Claude に見せてよいかを分類します。公開情報、契約済み市場データ、社内資料、顧客情報、個人情報を同じ扱いにしてはいけません。

次に、誰が AI の出力を確認するかを決めます。ピッチブックなら担当者と上席、KYC ならコンプライアンス、決算なら経理責任者です。AI が便利になるほど、承認責任を曖昧にしないことが重要です。

Claude 金融エージェントは、金融 AI が「便利なチャット」から「業務テンプレートとデータ接続を持つ作業支援」へ進んでいることを示しています。日本の金融機関は、まず小さな業務単位を選び、データ、権限、レビュー、ログを決めたうえで試すのがよいでしょう。

## 出典

- [Agents for financial services](https://www.anthropic.com/news/finance-agents) - Anthropic, 2026-05-05
- [The Briefing: Financial Services](https://www.anthropic.com/events/the-briefing-financial-services-virtual-event) - Anthropic, 2026-05-05
- [Introducing Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7) - Anthropic, 2026-04-16
