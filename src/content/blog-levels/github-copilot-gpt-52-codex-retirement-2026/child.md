---
article: 'github-copilot-gpt-52-codex-retirement-2026'
level: 'child'
---

GitHub Copilotで使われている **GPT-5.2** と **GPT-5.2-Codex** が、**2026年6月1日** に廃止される予定です。GitHubは **2026年5月1日** の公式Changelogで、代わりに **GPT-5.5** と **GPT-5.3-Codex** を使うよう案内しました。

大事なのは、これは「新しいモデルが増えた」というだけではなく、**今の使い方を6月から続けられるか確認する必要がある** ということです。とくに会社で GitHub Copilot Business や Enterprise を使っているチームは、管理者が代替モデルを許可しているかどうかで、使えるモデルが変わります。

## 何が変わるの？

今回の変更は次の2つです。

- GPT-5.2 は 6月1日に終了し、代わりに GPT-5.5 を使う案内
- GPT-5.2-Codex は 6月1日に終了し、代わりに GPT-5.3-Codex を使う案内

ただし、**Copilot Code Review の GPT-5.2-Codex だけは今回の廃止対象から外れています**。つまり、チャットや agent では消えるのに、review ではまだ残るという少しややこしい状態です。

## 何を見ればいいの？

まず、自分やチームがどの用途で古いモデルを使っているかを見るのが先です。

- Copilot Chat で使っているのか
- Copilot CLI や agent mode で使っているのか
- code review で使っているのか

理由は、用途ごとに代替が違うからです。GitHub Docsでは、GPT-5.2 は深い推論やデバッグ向け、GPT-5.2-Codex は agent 的なソフトウェア開発向けに整理されています。だから、**難しい調査や設計相談は GPT-5.5**、**自律実行寄りの作業は GPT-5.3-Codex** と分けて考えるほうが分かりやすいです。

## 日本のチームで注意したいこと

いちばん気をつけたいのは **コスト** と **管理者設定** です。

GitHub Docsの supported models ページでは、**GPT-5.2 は 1x**、**GPT-5.2-Codex も 1x**、**GPT-5.3-Codex も 1x** ですが、**GPT-5.5 は 7.5x** と案内されています。つまり、GPT-5.2 をそのまま GPT-5.5 へ置き換えると、使い方によってはコスト感が大きく変わります。

さらに、Business / Enterprise では、管理者がモデルを有効化・無効化できます。個人プランのように「新モデルが出たらそのまま使える」わけではありません。6月1日になってから慌てないためにも、5月中にモデルポリシーを見直したほうが安全です。

## 今のうちにやること

今の段階でやることは4つで十分です。

1. 使っている場所を洗い出す
2. GPT-5.5 と GPT-5.3-Codex を試す
3. 管理者にモデルポリシーを確認する
4. 社内向けの短い利用ガイドを更新する

特に、**Auto model selection に頼っている組織** は要注意です。GitHub Docsでは Auto の候補に GPT-5.3-Codex は入っていますが、GPT-5.5 は入っていません。深い推論で GPT-5.5 を使いたいなら、明示的な設定や案内が必要になります。

## まとめ

今回のGitHub Copilotの更新は、6月1日までにやるべき小さな移行作業だと考えるのがよさそうです。モデル名の変更そのものより、**どの用途をどの代替モデルへ移すか**、**誰がそれを有効化するか**、**コストをどう説明するか** を先に決めることが大切です。

## 出典

- [Upcoming deprecation of GPT-5.2 and GPT-5.2-Codex](https://github.blog/changelog/2026-05-01-upcoming-deprecation-of-gpt-5-2-and-gpt-5-2-codex/) - GitHub Changelog
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Configuring access to AI models in GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models) - GitHub Docs
