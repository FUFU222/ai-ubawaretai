---
article: 'github-secret-scanning-ai-detected-names-2026'
level: 'child'
---

GitHub は 2026年7月10日、secret scanning の検出種別の名前を分かりやすく変えました。

変わった名前は主に2つです。これまで **Non-provider patterns** と呼ばれていたものは **Generic patterns** になりました。また、**Copilot secret scanning** と呼ばれていたものは **AI-detected secrets** になりました。

大事なのは、名前が変わっただけで、検出の動きそのものは変わっていないことです。GitHub は、webhook、audit log、REST API に変更はないと説明しています。

## secret scanningとは

secret scanning は、API key、password、token、private key のような秘密情報が、誤って repository に入っていないかを見つける仕組みです。

秘密情報が GitHub に commit されると、第三者に使われる危険があります。たとえば、cloud の API key が漏れると、勝手にリソースを作られて費用が増えたり、社内データを読まれたりする可能性があります。

GitHub Docs では、secret scanning は repository の Git history や issue、pull request、discussion、wiki なども対象にできると説明されています。見つかったら alert が作られ、credential を rotate する必要があります。

## 3つの分類を覚える

今回の名前変更を理解するには、3つの分類で見ると分かりやすいです。

1つ目は **provider patterns** です。これは AWS key や Stripe token のように、特定のサービスが発行する秘密情報です。

2つ目は **generic patterns** です。これは private key や database connection string のように、特定の provider だけに結びつかない秘密情報です。

3つ目は **AI-detected secrets** です。これは password のように、形が決まりきっていない秘密情報を AI で見つける分類です。

## 名前が変わると何に困るのか

機能の動きが変わらないなら、何もしなくてよいように見えます。しかし、会社で使っている場合は注意が必要です。

古い資料に「Copilot secret scanning」と書いてあり、新しい GitHub Docs に「AI-detected secrets」と書いてあると、別の機能に見えるかもしれません。監査資料や社内FAQで名前がずれると、どの機能を有効にしているのか説明しにくくなります。

特に、GitHub Advanced Security や GitHub Secret Protection を使っている会社では、セキュリティ担当、開発者、監査担当、委託先が同じ言葉で話せるようにしておくことが大切です。

## AIが見つけるなら安全なのか

AI-detected secrets という名前を見ると、「AI が全部見つけてくれる」と思うかもしれません。しかし、そうではありません。

AI-detected secrets は、secret scanning の一部です。provider patterns、generic patterns、custom patterns、push protection、人間の review と組み合わせて使うものです。

たとえば、会社独自の token 名、開発環境だけで使う password、テスト用に見える文字列、顧客ごとの識別子は、標準機能だけで必ず正しく判断できるとは限りません。

## 会社でまずやること

まず、社内資料の古い名前を探します。`Copilot secret scanning` や `Non-provider patterns` と書かれているところを見つけ、新しい名前と対応させます。

次に、alert が出たときの対応を確認します。secret が見つかったら、基本は credential を rotate します。履歴から文字列を消すだけでは、すでに漏れた credential を安全に戻せません。

そして、AI agent がコードを書く運用でも secret scanning を使います。AI が `.env.example`、CI 設定、README、test fixture を直すときにも、秘密情報らしきものが混ざる可能性があります。

## まとめ

今回の GitHub secret scanning の更新は、機能追加というより名前の整理です。

それでも、会社で使うなら重要です。新しい名前を社内資料に反映し、provider patterns、generic patterns、AI-detected secrets の違いを説明できるようにしておくと、開発者も監査担当も迷いにくくなります。

## 出典

- [Clearer names for secret scanning detector types](https://github.blog/changelog/2026-07-10-clearer-names-for-secret-scanning-detector-types/) - GitHub Changelog
- [Secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning) - GitHub Docs
- [Supported secret scanning patterns](https://docs.github.com/en/code-security/reference/secret-security/supported-secret-scanning-patterns) - GitHub Docs
