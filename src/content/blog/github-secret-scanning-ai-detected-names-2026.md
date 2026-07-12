---
title: 'GitHub secret scanning名称変更、AI検出運用を整理'
description: 'GitHub secret scanningの検出種別名変更を整理。日本企業がAI-detected secrets、generic patterns、API互換性をどう監査運用へ落とすか解説する。'
pubDate: '2026-07-12'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'セキュリティ', 'サプライチェーンセキュリティ', 'AIガバナンス', '開発者ツール']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月10日**、secret scanning の detector type 名称を整理した。大きな機能追加ではないが、セキュリティ運用では軽く見ないほうがよい更新である。GitHub は、従来の **Non-provider patterns** を **Generic patterns** に、**Copilot secret scanning** を **AI-detected secrets** に改めると説明した。

重要なのは、これは検出挙動の変更ではなく、名称変更だという点だ。GitHub は、product documentation のリンクは redirect され、webhook events、audit log events、REST API には変更がないとしている。つまり、既存の自動化が急に壊れる話ではない。一方で、社内手順書、監査レポート、教育資料、SIEM dashboard、GitHub Advanced Security の運用説明では、古い用語と新しい用語が混ざりやすい。

このサイトではすでに [GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) や [CodeQL AI検査、プロンプト注入をSAST標準へ入れる](/blog/github-codeql-ai-prompt-injection-2026/) を扱った。今回の更新は、その基盤にある secret scanning の説明語彙を揃える話として見ると分かりやすい。

## 事実: detector type の名称だけが変わった

GitHub Changelog によると、今回の変更は secret scanning を理解しやすくするための名称整理である。変更前の **Non-provider patterns** は **Generic patterns** になり、変更前の **Copilot secret scanning** は **AI-detected secrets** になった。

GitHub は、検出動作そのものは同じだと明記している。さらに、既存のドキュメントリンクは動き続け、用語は documentation 全体で更新され、redirect も用意される。API 連携の観点では、webhook events、audit log events、REST API に変更がないことが実務上のポイントになる。

つまり、今回の対応で最初にやるべきことは、検出ルールを作り直すことではない。むしろ、社内で「Copilot secret scanning」と呼んでいた機能が、今後は「AI-detected secrets」として表示・説明される可能性を前提に、文書、運用台帳、問い合わせ対応、教育コンテンツを整理することだ。

日本企業では、監査対応や委託先管理のために、セキュリティ機能名をそのまま管理表に写していることが多い。名称変更が小さく見えても、レポート上で別機能のように扱われると、導入率や対応率の説明がぶれる。特に GitHub Advanced Security や GitHub Secret Protection を複数組織で展開している会社では、表記の統一が必要になる。

## 事実: generic / AI-detected / provider の3分類で読む

GitHub の説明では、secret はまず provider secrets と generic secrets に分けられる。Provider secrets は AWS key や Stripe token のように特定サービスが発行する credential である。Generic secrets は private key、connection string、password のように、特定 provider に強く結びつかない秘密情報を指す。

検出方法も2種類に整理されている。Patterns は regex と entropy analysis などを組み合わせる deterministic detection である。これは、構造が分かる provider token や、private key、connection string のような generic pattern に向いている。

一方、AI-detected secrets は、決まった形に落ちにくい generic secrets を AI で見つけるための分類である。GitHub Docs の supported patterns では、AI-detected patterns の対象として password が示されており、push protection と validity checks は passwords には対応しないと説明されている。

ここを混同すると、運用設計を間違える。AI-detected secrets は「AI がすべての秘密情報を理解してくれる」機能ではない。provider patterns、generic patterns、custom patterns、validity checks、push protection、人間のレビューと組み合わせて使うものだ。

[GitHub第三者agent検証、AIコード安全運用の焦点](/blog/github-third-party-agent-security-validation-2026/) で書いた通り、AI agent が生成したコードの受け入れでは、CodeQL、secret scanning、dependency review、人間レビューを分担させる必要がある。今回の名称変更は、その分担を説明する言葉を少し正確にした更新である。

## 分析: 日本企業では監査用語と教育資料を先に揃える

ここからは分析である。

日本企業でまず起きやすい混乱は、監査資料の表記揺れだ。たとえば、古い資料に「Copilot secret scanning」と書かれ、新しい GitHub Docs には「AI-detected secrets」と書かれている場合、担当者が別機能だと誤解する可能性がある。導入済みか、費用対象か、push protection と関係するか、REST API で取れるか、といった質問が増える。

そのため、GitHub Secret Protection を運用している組織は、機能名の対照表を作るとよい。旧称、現行名、日本語説明、検出対象、検出方法、push protection 対応、validity check 対応、API・監査ログ上の扱いを1枚にまとめる。大きな文書改訂ではなくても、問い合わせ対応や監査説明では効く。

次に、開発者向け教育資料を直すべきだ。AI-detected secrets という名前だけを見ると、開発者は「AI が秘密情報を見つけてくれるなら、自分は気にしなくてよい」と受け取るかもしれない。しかし、GitHub Docs は secret scanning が credential leaks を検出し、alert を出し、検出後は credential を rotate する必要があると説明している。検出は予防と対応の一部であり、秘密情報を commit しない設計そのものを置き換えない。

三つ目は、SOC や SIEM 側の dashboard である。GitHub が API や audit log events を変えないとしている以上、内部の自動処理は大きく変えないほうがよい。ただし、dashboard の表示名、アラート説明、runbook の文言は更新したほうが現場が迷わない。特に、日本語化した項目名を独自に持っている場合は、「AI検出secret」「generic pattern」「provider pattern」のように、英語名と対応する日本語を固定する。

## AI agent時代のsecret scanning運用にどうつなぐか

今回の名称変更は、GitHub の AI 関連機能全体の流れともつながる。AI コーディングエージェントが増えると、秘密情報の混入経路は増える。`.env.example`、CI 設定、README、テスト fixture、ログ出力、issue コメント、PR 説明、MCP tool の応答など、コード以外にも credential らしきものが現れ得る。

[Copilot CLI security review、PR前検査の実務](/blog/github-copilot-cli-security-review-2026/) で整理したように、開発者の手元での検査と、PR 後の標準検査は役割が違う。secret scanning は PR 後だけでなく、MCP Server や push protection と組み合わせて、commit 前、push 時、PR 時、公開 repository の監視へ広げられる。

AI-detected secrets という名称は、その中で「AI が関わる検出」の位置づけを説明しやすくする。従来の「Copilot secret scanning」という名前だと、GitHub Copilot のチャットや coding agent 専用機能に見えやすかった。新名称なら、secret scanning の検出カテゴリのひとつとして、provider patterns や generic patterns と並べて説明できる。

ただし、名称が分かりやすくなったからといって、すべてを自動承認してよいわけではない。password のような unstructured secret は誤検知も見逃しも起こり得る。社内固有の token、顧客ごとの識別子、接続先 URL、開発環境だけで有効な credential、委託先の共有情報は、GitHub の標準検出だけでは十分でない場合がある。custom patterns と人間レビューの役割は残る。

## 導入前に確認する5項目

第一に、社内資料の旧称を検索する。`Copilot secret scanning`、`Non-provider patterns`、`generic secrets`、`password detection` などを、手順書、監査資料、セキュリティ教育、FAQ、運用 runbook から探し、現行名へ寄せる。

第二に、検出カテゴリごとの対応ルールを分ける。provider secret は provider 側の revoke や validity check とつながることがある。generic pattern は private key や connection string の rotate と履歴調査が必要になる。AI-detected secrets は unstructured password の可能性を前提に、確認と例外処理を丁寧に置く。

第三に、API・webhook・audit log の自動処理を不要に変えない。GitHub は今回、これらに変更はないとしている。表示名や文書だけを変えるべきところと、検出ルールや連携コードを変えるべきところを分ける。

第四に、AI agent の作業導線に secret scanning を入れる。Copilot CLI、VS Code、GitHub MCP Server、third-party coding agents を使うなら、作業前後のどこで secret scanning、CodeQL、dependency review を走らせるかを決める。AI が作った差分ほど特別扱いするのではなく、同じ required checks に載せるほうが運用は安定する。

第五に、例外承認を記録する。AI-detected secrets や generic patterns は false positive があり得る。だからこそ、誰が、どの理由で、どの期間だけ bypass したのかを残す。例外が多いなら、開発者教育、custom pattern、テストデータ設計、サンプル credential の書き方を見直す。

## まとめ

GitHub secret scanning の detector type 名称変更は、派手な新機能ではない。検出挙動、API、webhook、audit log が変わらないなら、開発者が今日の作業で困る可能性は低い。

それでも、日本企業のセキュリティ運用では価値がある。AI-detected secrets、generic patterns、provider patterns という言葉で整理すれば、GitHub Secret Protection、Copilot、MCP Server、CodeQL、人間レビューの分担を説明しやすくなる。AI agent 時代のセキュリティは、新しい検出機能を増やすだけでなく、検出結果を誰がどう読んで、どこで止めるかを揃えることが重要だ。

## 出典

- [Clearer names for secret scanning detector types](https://github.blog/changelog/2026-07-10-clearer-names-for-secret-scanning-detector-types/) - GitHub Changelog, 2026年7月10日
- [Secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning) - GitHub Docs
- [Supported secret scanning patterns](https://docs.github.com/en/code-security/reference/secret-security/supported-secret-scanning-patterns) - GitHub Docs
