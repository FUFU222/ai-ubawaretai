---
article: 'huggingface-open-model-cyber-defense-ir-2026'
level: 'child'
---

Hugging Face は、AIを使った攻撃に備えるため、会社の中で動かせるAIモデルを準備する実務ガイドを公開しました。ポイントは、攻撃を受けたあとに「どのAIにログを読ませるか」を考えるのでは遅いということです。

背景には、Hugging Face が2026年7月に開示したセキュリティインシデントがあります。同社は、攻撃が自律的なAIエージェントの仕組みで進められたと説明しています。さらに、防御側もAIを使って攻撃ログを分析しました。

## 何が問題なのか

インシデント対応では、攻撃コマンド、悪性payload、C2 artifact、credentialらしき文字列を調べる必要があります。ところが、こうした内容を商用AI APIに送ると、安全対策によって拒否されることがあります。AIサービス側から見ると、攻撃者が悪用しようとしているのか、守る側が調査しているのかを見分けにくいからです。

Hugging Face は、実際の分析で商用APIのモデルを使おうとして止まり、最終的には GLM 5.2 という open-weight model を自社インフラで動かしたと説明しています。これにより、攻撃データやcredentialを外部へ出さずに分析できました。

これは、普段のAI利用とは違う話です。普段の業務では「機密情報をAIに入れない」が基本です。しかし事故対応では、機密ログを見なければ影響範囲を調べられません。そのため、事故対応専用のAI環境が必要になります。

## 日本企業で大事なこと

日本企業では、まず「通常業務のAI」と「事故対応のAI」を分けるべきです。たとえば、一般社員が使うChatGPTには攻撃ログを入れない。一方で、CSIRTやSOCが承認した閉域モデルには、必要なログを入れられるようにする。このように分けると、禁止だけで業務が止まることを避けられます。

[ChatGPTロックダウンモード](/blog/openai-chatgpt-lockdown-mode-all-users-2026/)のような設定は、日常業務で外部送信を抑えるために役立ちます。しかし、事故対応では「外に出さないまま分析する」仕組みが別に必要です。

また、[OpenAI TanStack対応](/blog/openai-tanstack-npm-supply-chain-2026/)で見たように、AI企業や開発者ツールもCI/CD、npm、署名証明書のリスクと無関係ではありません。AIの安全性は、モデルだけでなく、その周りの開発基盤や運用にも左右されます。

## 何を準備するか

最初に決めるべきなのは、どのログをどのAIに入れてよいかです。EDRログ、SIEMログ、GitHub Actionsログ、Kubernetesの監査ログ、内部IP、顧客名、credentialらしき文字列などを分類します。

次に、閉域で動くモデルを一つ検証します。Hugging Faceのガイドは GLM 5.2 を例にし、Dell Enterprise Hub、Microsoft Foundry、AWS SageMakerで動かす選択肢を説明しています。大切なのは、事故当日に初めて試すのではなく、平時にSOCの訓練で使っておくことです。

最後に、人間が確認する流れを残します。AIは大量ログからtimelineやIOC候補を出すのに役立ちますが、最終判断は responder が行う必要があります。AIは判断者ではなく、調査速度を上げる補助として使うのが現実的です。

## まとめ

Hugging Face のガイドは、AI攻撃にAIで対抗するという派手な話に見えます。しかし実務上の本題は、事故対応時に安全にログを読ませられるAI環境を準備しておくことです。

日本企業は、日常のAI利用ルールとは別に、CSIRT/SOC向けの閉域AI運用を設計する必要があります。商用API、閉域モデル、入力できるログ、監査、訓練を分けておくことが、AI時代のインシデント対応の初動になります。

## 出典

- [Be Ready Before the Attack: A Practical Guide to Self-Hosting an Open Model for Cyber Defense](https://huggingface.co/blog/jeffboudier/open-model-cyber-defense) - Hugging Face, 2026-07-20
- [Security incident disclosure — July 2026](https://huggingface.co/blog/security-incident-july-2026) - Hugging Face, 2026-07-16
- [Dell Enterprise Hub documentation](https://dell.huggingface.co/docs) - Hugging Face / Dell
