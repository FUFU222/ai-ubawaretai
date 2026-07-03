---
article: 'github-copilot-gemini-25-pro-3-flash-retirement-2026'
level: 'child'
---

GitHub Copilotで使える **Gemini 2.5 Pro** と **Gemini 3 Flash** が、2026年7月31日に使えなくなります。GitHubが2026年7月2日に発表しました。

代わりに使うモデルも案内されています。

- Gemini 2.5 Proを使っていた人はGemini 3.1 Proへ移る
- Gemini 3 Flashを使っていた人はGemini 3.5 Flashへ移る

「7月31日に自動で新しいモデルへ完全移行する」と考えるのは危険です。古いモデルは消えますが、新しいモデルを選べるようにする設定や、使い方の確認は会社側で必要になることがあります。

## 何が変わるのか

対象はCopilot Chatだけではありません。GitHubの説明では、次のようなCopilotの機能全体から古い2モデルが外れます。

- チャットで質問する機能
- コードを書き換える機能
- ask mode
- agent mode
- コード補完

ただし、これはGitHub Copilotの中での提供終了です。Googleが提供するGemini API全体の終了を意味するわけではありません。どのサービスで、どのモデルが、いつまで使えるかは別々に確認します。

## なぜ設定確認が必要なのか

会社でCopilot BusinessやEnterpriseを使っている場合、管理者は利用できるAIモデルを制限できます。代替のGemini 3.1 ProやGemini 3.5 FlashがGitHubの一覧にあっても、会社の設定で許可されていなければ、利用者の画面には出ません。

また、古いVS CodeやIDEを使っていると、新しいモデルを正しく選べないことがあります。会社が配っているPC、仮想デスクトップ、開発委託先の環境も確認対象です。

モデルをAutoにしている人も確認が必要です。Autoは利用できるモデルの中から選ぶ機能であり、会社のポリシーに従います。また、手順書や自動化で古いモデル名を直接指定している部分は、Autoでは直りません。

## 何をすればよいのか

まず、古いモデルをどこで使っているか調べます。VS Code、他のIDE、GitHub.com、Copilot CLI、agent mode、社内の手順書や研修資料を確認します。

次に、代替モデルを実際に使って比べます。普段よく行うバグ修正、テスト作成、コードレビュー、設計相談などを試します。答えが正しいかだけでなく、修正にかかった時間、応答速度、作られたコードの読みやすさ、利用量も記録します。

その後、管理者設定、IDE、拡張機能、手順書を更新します。7月31日ぎりぎりではなく、数日前から新しいモデルだけで仕事をして、問題がないか確認する期間を作ります。

## 会社で決めておきたいこと

担当を分けると進めやすくなります。

- Copilot管理者は、代替モデルを選べるか確認する
- 開発基盤担当は、IDEと拡張機能を更新する
- 各開発チームは、古いモデル名を指定した設定を探す
- テックリードは、代表的な作業で品質を比べる
- 社内サポート担当は、質問を受ける窓口を決める

新しいモデルは、古いモデルとまったく同じ答えを返すとは限りません。公式が代替として案内していても、会社のコードや手順で問題なく動くかは自分たちで確認します。

## まとめ

GitHub CopilotのGemini 2.5 ProとGemini 3 Flashは、2026年7月31日に終了します。代替はGemini 3.1 ProとGemini 3.5 Flashです。

会社で使っている場合は、モデルの許可設定、IDEのバージョン、古いモデル名を使う設定、出力品質を確認します。7月31日は作業を始める日ではなく、移行を終える日として計画するのが安全です。

## 出典

- [Upcoming deprecation of Gemini 2.5 Pro and Gemini 3 Flash](https://github.blog/changelog/2026-07-02-upcoming-deprecation-of-gemini-2-5-pro-and-gemini-3-flash/) - GitHub Changelog, 2026-07-02
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Configuring access to AI models in GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models) - GitHub Docs
