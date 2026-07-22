---
article: 'openai-presence-enterprise-agent-governance-2026'
level: 'child'
---

OpenAI Presence は、会社が AI Agent を顧客対応や社内ヘルプデスクに入れるための仕組みです。ポイントは、ただ会話が上手な AI を置くことではありません。AI がどの情報を見てよいか、どの操作をしてよいか、どの場面で人間に渡すかを決めるための製品です。

たとえば、請求書の再送やよくある質問への回答なら AI が対応しやすいかもしれません。一方で、返金、契約変更、本人確認、保険金の判断などは、AI が文章を作れても勝手に実行させるべきではありません。Presence は、こうした線引きを policies、approved actions、guardrails として設計する考え方に近いです。

## 何が新しいのか

OpenAI Presence は、企業向けの限定的な一般提供として発表されました。誰でも管理画面でオンにできるセルフサービス製品ではなく、OpenAI の担当者やパートナーと一緒に導入する形です。ここからも、単なるチャット機能ではなく、業務に合わせて作り込む本番運用基盤だと分かります。

大事なのは、導入前にシミュレーションを行う点です。AI が正しい答えにたどり着いたか、会社のルールを守ったか、必要なときに人間へ渡したかをテストします。日本企業なら、個人情報、社内規程、業界ルール、顧客への説明責任を入れてテストする必要があります。

## Codexは何をするのか

Presence では、OpenAI の Codex が本番運用後の改善にも関わります。実際の会話や人間への引き継ぎから問題を見つけ、Agent のふるまいを改善する案を出します。ただし、その案をそのまま本番に入れるのではありません。人間がテストし、承認してから反映する流れが重要です。

これは「AI が自分で勝手に育つ」という話ではありません。むしろ、AI が出した改善案を人間がレビューする変更管理の話です。問い合わせ対応では、少し表現が変わるだけでも顧客への説明や法務確認が必要になることがあります。

## 日本企業が最初に見るべき点

最初は、リスクが低く件数が多い業務から試すのが現実的です。請求書再発行、障害状況の案内、社内アカウント申請の受付、FAQ の一次回答などです。逆に、返金判断、契約解除、医療・金融の個別判断は、最初から自動実行させないほうが安全です。

もう一つの注意点は、データ接続です。AI Agent に CRM、請求、チケット、ID 管理をつなぐと便利になりますが、見せてはいけない情報まで見せる危険もあります。読み取りだけでよいのか、書き込みも必要なのか、操作ごとに承認が必要なのかを分けてください。

## まとめ

OpenAI Presence は、AI Agent を会社の業務に入れるための承認線を作る製品です。日本企業は、自動解決率だけで判断せず、どの業務を任せるか、どこで人間に渡すか、改善案を誰が承認するかを先に決めるべきです。

## 出典

- [Introducing OpenAI Presence](https://openai.com/index/introducing-openai-presence/) - OpenAI, 2026-07-22
- [OpenAI Presence connects AI agents to enterprise data with built-in guardrails](https://www.helpnetsecurity.com/2026/07/22/openai-presence-ai-agent-platform/) - Help Net Security, 2026-07-22
- [OpenAI Presence Pitches 'Trusted' AI Agents to Enterprises](https://www.reworked.co/digital-workplace/openai-presence-pitches-trusted-ai-agents-to-enterprises-a-day-after-owning-the-hugging-face-hack/) - Reworked, 2026-07-22
