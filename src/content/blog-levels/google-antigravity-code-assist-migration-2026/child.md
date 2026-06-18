---
article: 'google-antigravity-code-assist-migration-2026'
level: 'child'
---

Google は、Gemini Code Assist と Gemini CLI の一部を Antigravity へ移す流れを出しました。ポイントは、Gemini Code Assist IDE Extensions と Gemini CLI が、Gemini Code Assist for individuals、Google AI Pro、Google AI Ultra 向けのリクエスト提供を 2026年6月18日から止めるという点です。

これは「Gemini Code Assist が全部なくなる」という意味ではありません。Google Cloud の説明では、Gemini Code Assist Standard / Enterprise は Gemini for Google Cloud の製品で、個人向けとは別です。会社で契約している場合と、個人の Google アカウントや Google AI Pro / Ultra で使っている場合を分けて見る必要があります。

## 何が変わるのか

これまで個人アカウントで VS Code や JetBrains の Gemini Code Assist 拡張を使っていた人、または Gemini CLI を使っていた人は、Antigravity や Antigravity CLI への移行を考える必要があります。Google は Antigravity を、複数の agent を動かすための platform として扱っています。

Antigravity CLI は、ターミナルから agent を操作するための入口です。単にコードを補完するだけでなく、subagents、slash commands、MCP、skills、hooks のような仕組みを扱える方向にあります。つまり、AI 補助は「横で提案してくれる道具」から、「作業を任せる道具」に近づいています。

この流れは、[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) や [Google AI Studio 連携拡張](/blog/google-ai-studio-android-workspace-2026/) と同じ方向です。Google は Gemini を、チャットだけでなく、agent を作り、動かし、確認するための基盤へ広げています。

## なぜ日本のチームに関係するのか

日本の会社では、公式には導入していなくても、開発者が個人アカウントで AI コーディング支援を使っていることがあります。研修資料、README、社内 wiki、開発環境の説明に Gemini CLI の使い方が入っていることもあります。

もしその経路が止まると、開発者が急に別のツールへ移ったり、チームごとに違う使い方を始めたりします。すると、どの AI がどのリポジトリを読んでいるのか、どのコマンドを実行できるのか、外部ツールに何を渡しているのかが見えにくくなります。

特に Antigravity CLI のような agent 型の道具では、補完よりも権限が重要になります。ファイルを編集する、テストを動かす、MCP サーバーにつなぐ、hooks を使う、といった操作は便利ですが、管理なしで広げると危険です。

## 最初にやること

まず、誰がどのアカウントで Gemini Code Assist や Gemini CLI を使っているかを確認します。会社契約なのか、個人アカウントなのか、Google AI Pro / Ultra なのかを分けます。

次に、社内資料を探します。Gemini CLI のインストール手順、ログイン手順、プロンプト例、開発環境構築スクリプトが残っていないかを見ます。古い資料を放置すると、止まった経路を新人や委託先が使おうとして混乱します。

最後に、移行先を決めます。Gemini Code Assist Standard / Enterprise に寄せるのか、Antigravity CLI を標準にするのか、別の企業向け AI コーディングツールを使うのかを決めます。[Gemini 3.5 Flash Stable 化](/blog/google-gemini-35-flash-api-stable-agents-2026/) のようにモデル面は進化していますが、会社で大事なのは「どのモデルか」だけではなく、「誰が何を実行できるか」です。

## まとめ

今回の変更は、Gemini Code Assist の個人・Google AI Pro・Ultra 向け IDE/CLI 経路を、Antigravity へ移す話です。日本の開発チームは、個人利用と会社契約を分けて棚卸しし、CLI や IDE 拡張の使い方を更新する必要があります。

AI コーディング支援は、補完ツールから agent 実行基盤へ変わっています。だからこそ、移行時には便利さだけでなく、アカウント、権限、ログ、MCP、社内ルールを一緒に確認することが大切です。

## 出典

- [Gemini for Google Cloud release notes](https://docs.cloud.google.com/gemini/docs/release-notes) - Google Cloud Documentation
- [Gemini Code Assist release notes](https://developers.google.com/gemini-code-assist/resources/release-notes) - Google for Developers
- [Gemini Code Assist Standard and Enterprise overview](https://docs.cloud.google.com/gemini/docs/codeassist/overview) - Google Cloud Documentation
