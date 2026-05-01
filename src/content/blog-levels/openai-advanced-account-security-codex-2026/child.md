---
article: 'openai-advanced-account-security-codex-2026'
level: 'child'
---

OpenAIが **2026年4月30日** に公開した `Advanced Account Security` は、ChatGPTとCodexの個人アカウントを強く守るための新しいセキュリティ設定です。ポイントは、単に2段階認証を足すのではなく、**ログイン方式そのものを passkeys や security keys 中心へ寄せる** ところにあります。

## 何が変わる？

OpenAIの公式説明では、Advanced Account Securityを有効にすると次の変化があります。

- パスワード型ログインが無効化される
- passkeys または FIDO互換セキュリティキーが必要になる
- メールやSMSによる通常のアカウント復旧が無効になる
- recovery keys を自分で保管する必要がある
- セッションが短くなり、ログイン通知やセッション管理が強化される
- 会話がモデル学習に使われない設定が自動で有効になる

つまり、便利さよりも **アカウント乗っ取り耐性** を優先する設定です。しかもOpenAIは、この保護が **Codexにも適用される** と説明しています。

## 日本の開発チームにどう関係する？

日本企業では、正式なEnterprise契約の前に、開発者が個人アカウントのChatGPTやCodexで試し始めることが多いです。そこではコード、障害ログ、社内手順、顧客対応メモのような高感度情報が混ざりやすい。アカウントが弱いままだと、端末紛失やフィッシング被害がそのまま業務データ露出につながります。

その意味で、Advanced Account Securityは単なる個人向け機能ではありません。**正式統制の外に残る利用を少しでも堅くする手段** として見たほうがよいです。

たとえば、[OpenAIの証明書更新対応を扱った記事](/blog/openai-axios-developer-tool-compromise-2026/)が示したように、AIツールはアプリや端末側の信頼性問題ともつながっています。さらに、[Privacy Filterの記事](/blog/openai-privacy-filter-pii-redaction-2026/)で見たように、入力前のデータ保護も必要です。今回の更新は、その前段である **アカウント防御** を強める位置づけです。

## 何に注意すべき？

一番の注意点は、**復旧責任が重くなる** ことです。Advanced Account Securityでは、OpenAI Supportが通常のメール復旧やパスワードリセットで助けないと明記されています。つまり、passkeyをなくし、物理キーも失い、recovery keyも見失うと、自分で戻れなくなる可能性があります。

だから日本のチームが考えるべき順番は、「まず有効化」ではなく次の順です。

- 誰に適用するか
- 物理キーを何本持つか
- recovery key をどこへ保管するか
- 退職や端末紛失時にどう無効化するか

OpenAIはさらに、Trusted Access for Cyber の個人メンバーに **2026年6月1日** からこの設定を必須化すると案内しています。これは高権限アカウントほど、ログイン強度を厳しく見る方向へOpenAIが進んでいることを示します。

## まとめ

Advanced Account Securityは、ChatGPTとCodexを使う個人アカウント向けに、**passkeys必須化、復旧鍵管理、学習除外自動化** をまとめて入れる設定です。日本の開発組織では、SSOの外で先に使われるAIアカウントをどう守るかが課題になりやすく、この更新はかなり実務的です。

ただし、強い保護と引き換えに復旧の自己責任も増えます。導入するなら、鍵管理と事故時手順まで含めて設計するのが前提です。

## 出典

- [Introducing Advanced Account Security](https://openai.com/index/advanced-account-security/)
- [How can I keep my OpenAI accounts secure?](https://help.openai.com/en/articles/8304786-how-can-i-keep-my-openai-accounts-secure)
- [Passkeys to Secure Your OpenAI Account](https://help.openai.com/en/articles/20001039-passkeys-to-secure-your-openai-account)
