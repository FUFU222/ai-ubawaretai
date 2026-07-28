---
article: 'github-copilot-grok-45-model-policy-2026'
level: 'child'
---

GitHub Copilot で **Grok 4.5** が使えるようになります。Grok 4.5 は xAI の coding 向け reasoning model で、GitHub は 2026年7月28日に Copilot への段階提供を発表しました。

ポイントは、「新しいAIモデルが増えた」だけではありません。会社で GitHub Copilot を使っている場合、管理者がそのモデルを有効にするか、どの開発者に使わせるか、費用をどう見るかを決める必要があります。

## Grok 4.5は何に向いているのか

GitHub の発表では、Grok 4.5 は fast agentic coding と complex multi-step workflows 向けと説明されています。つまり、短い質問に答えるだけでなく、複数の手順を考えたり、terminal や tool を使う開発作業に向くモデルとして扱われています。

最大 500,000 tokens の context window、text と image input、low / medium / high の reasoning effort も示されています。大きなコードベースを調べたり、複数ファイルの変更を考えたりする場面では役に立つ可能性があります。

一方で、強いモデルはいつでも最適とは限りません。軽い説明や単純な修正なら、もっと速く安いモデルで十分なこともあります。会社では、Grok 4.5 をどの仕事で使うかを決めてから広げるほうが安全です。

## 会社では管理者が有効化する

GitHub は、Copilot Business と Copilot Enterprise の管理者は Grok 4.5 policy を有効化する必要があると説明しています。しかも既定は off です。これは重要です。発表されたからといって、会社の Copilot ですぐ全員が使えるわけではありません。

使える予定の場所としては、Visual Studio Code、Visual Studio、Copilot CLI、Copilot cloud agent、Copilot app、JetBrains、Xcode、Eclipse が挙げられています。ただし rollout は段階的です。見えない場合は、契約、管理者設定、client version、rollout 状況を確認する必要があります。

## 費用も確認する

xAI は、自社 API で Grok 4.5 を input 100万 tokens あたり 2ドル、output 100万 tokens あたり 6ドルと案内しています。ただし、GitHub Copilot の中で使う場合は、Copilot 側の usage-based billing と AI Credits の見方が入ります。

そのため、会社では xAI の API 価格だけを見て判断しないほうがよいです。Copilot でどのくらい credits を使うのか、どのモデルと比べるのか、どのタスクなら費用に見合うのかを確認する必要があります。

## 最初の使い方

最初は全社に広げるより、少数の開発チームで試すのがよいです。たとえば、テスト失敗の原因調査、複数ファイルの修正、CI エラーの切り分け、古いコードの依存関係調査など、Grok 4.5 の強みが出そうな作業を選びます。

そのうえで、完了率、かかった credits、レビューの差し戻し、CI 成功率、人間がどれだけ直したかを見ます。便利だったかどうかだけでなく、レビュー品質と費用まで見ることが大切です。

## まとめ

Grok 4.5 の Copilot 提供は、開発者にとっては選択肢が増える更新です。ただし会社にとっては、モデルを開けるかどうか、どこで使わせるか、費用をどう管理するかを決める更新でもあります。

日本企業では、まず管理者 policy、対象 client、pilot チーム、費用の見方を決めましょう。強いモデルを使えることより、強いモデルを必要な仕事にだけ使えることが大事です。

## 出典

- [Grok 4.5 is now available in GitHub Copilot](https://github.blog/changelog/2026-07-28-grok-4-5-is-now-available-in-github-copilot/) - GitHub Changelog, 2026-07-28
- [Grok 4.5 in GitHub Copilot](https://x.ai/news/grok-github-copilot) - xAI, 2026-07-28
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
