---
article: 'anthropic-claude-security-public-beta-2026'
level: 'child'
---

Anthropic の **Claude Security** は、Claude.ai の中でコードベースをスキャンし、セキュリティ上の問題を見つけ、修正案まで出すための機能です。公式ヘルプでは、パブリックベータとして提供される機能だと説明されています。

大事なのは、これは「Claude にコードを見せて質問する」だけの話ではないことです。GitHub のリポジトリを選び、脆弱性スキャンを走らせ、見つかった問題を重大度つきで確認し、必要なら Claude Code で修正作業に進める。つまり、開発チームとセキュリティ担当が一緒に使うための機能に近いです。

## 何をしてくれるのか

Claude Security は、SQL injection、XSS、SSRF、認証の抜け、権限昇格、CSRF、危ない暗号の使い方、deserialization の問題などを探すと説明されています。見つかった問題には、どのファイルのどの場所か、何が危ないか、どう再現するか、どう直すべきか、といった情報が付く想定です。

これは初心者にも分かりやすいポイントです。普通のセキュリティスキャナーは「この行が危ない」と教えてくれても、その意味を理解して直すところで止まりがちです。Claude Security は、その説明と修正案の部分まで AI に手伝わせようとしています。

## 使うには条件がある

ただし、誰でもすぐ使える無料ツールではありません。導入チュートリアルでは、Claude Enterprise account、Claude Code on the Web、Extra Usage、Anthropic GitHub App、ユーザーごとの premium seat が必要だとされています。現時点では GitHub.com のリポジトリが対象です。

つまり、個人がローカルで小さなプロジェクトに試すというより、会社の GitHub リポジトリを対象に、管理者が設定して使うタイプの機能です。日本の会社で使うなら、まず自社のコードが GitHub.com にあるか、Claude に読ませてよい範囲はどこか、費用上限をどう決めるかを確認する必要があります。

## 何が便利なのか

便利なのは、セキュリティ対応の最初の面倒な部分を短くできる可能性があることです。

脆弱性対応では、問題が見つかってからが大変です。本当に危ないのか、どのユーザーに影響するのか、急いで直すべきか、誰が owner なのか、どう直せば副作用が少ないのかを調べる必要があります。Claude Security が再現手順や修正案をまとめてくれるなら、担当者はゼロから調べるより早く判断できます。

また、検出結果を CSV や Markdown で export したり、webhook で通知したりできると説明されています。これは監査やチケット管理にも使いやすいです。日本企業では、「直したかどうか」だけでなく「いつ見つけ、誰が判断し、どう対応したか」が重要になることが多いので、この点は実務的です。

## 注意点もある

一方で、Claude Security だけに任せるのは危険です。公式ヘルプでは、スキャンは確率的な設計だと説明されています。毎回まったく同じ結果になる静的解析ツールとは違います。そのため、SAST や依存関係スキャンや人間のレビューを置き換えるものではなく、補助として使うのが安全です。

データ保持も注意点です。FAQ では Zero Data Retention ではないと説明されています。金融、医療、公共、受託開発などでは、この条件だけで使えるリポジトリが限られるかもしれません。

## どう試すとよいか

最初は、全リポジトリではなく、1つか2つの重要なサービスで試すのが現実的です。たとえば、ログイン、決済、管理画面、個人情報を扱う API などです。週1回だけスキャンし、出てきた findings をセキュリティ担当とコード owner が一緒に見る。これなら費用も backlog も管理しやすいです。

Claude Security は、AI が勝手に脆弱性を直してくれる魔法の機能ではありません。むしろ、脆弱性対応で詰まりやすい「調べる」「説明する」「直し方を考える」という最初の仕事を助ける機能です。日本のチームでは、まずそこに絞って評価するのがよいと思います。

## 出典

- [Use Claude Security](https://support.claude.com/en/articles/14661296-use-claude-security) - Claude Help Center, accessed 2026-05-02
- [Getting started with Claude Security](https://claude.com/resources/tutorials/getting-started-with-claude-security) - Claude, accessed 2026-05-02
- [Automated Security Reviews in Claude Code](https://support.claude.com/en/articles/11932705-automated-security-reviews-in-claude-code) - Claude Help Center, 2026-03-16
