---
article: 'anthropic-claude-hipaa-self-serve-2026'
level: 'child'
---

Anthropic は 2026年7月14日、Claude の HIPAA 設定を管理者が自分で有効化できるようにしたと発表しました。対象は Claude Enterprise と Claude Platform API です。

HIPAA は米国の医療情報に関する制度です。日本の会社にとっては少し遠く聞こえますが、医療、ヘルスケア、保険、製薬、臨床研究、健康データを扱う AI サービスでは重要です。患者情報や健康情報を AI に入れるなら、「便利だから使う」だけでは足りません。契約、対象機能、ログ、アクセス権限を分けて考える必要があります。

## 何が変わったのか

今回の更新では、対象となる管理者が Business Associate Agreement、つまり BAA を確認し、implementation guide をダウンロードし、HIPAA configuration を有効化できるようになりました。

Claude Enterprise 向けには、PHI と呼ばれる protected health information を Claude で処理する組織向けの HIPAA-ready offering が説明されています。これは医療機関、保険者、医療データ処理事業者、その委託先のような組織を想定しています。

API 向けには、Claude API で PHI を処理するための HIPAA readiness が説明されています。自社アプリや業務システムから Claude API を呼び出す場合はこちらが関係します。

## 何でも対象になるわけではない

大事なのは、Claude のすべての機能が同じように対象になるわけではないことです。

API documentation では、HIPAA readiness の対象になる機能と対象外になる機能が分けられています。たとえば、consumer products、Console や Workbench での PHI 処理、外部ツール、Claude Code、beta features などは注意が必要です。

Claude Code も誤解しやすい点です。Enterprise plan の seat で Claude Code を使える場合がありますが、HIPAA-ready offering の対象外だと説明されています。医療系の開発で、患者情報を含むログやテストデータを扱うなら、Claude Code に入れてよいかは別に判断しなければなりません。

## 日本企業への意味

日本企業にとって重要なのは、HIPAA という名前そのものより、患者情報を扱う AI 環境を一般用途から分けることです。

たとえば、一般社員が文書作成に使う Claude、開発者が使う Claude Code、患者情報を扱う API、医療部門だけが使う Enterprise project を同じ感覚で扱うと危険です。どの組織、どの機能、どのユーザー、どのログが対象なのかを分ける必要があります。

また、医療 AI では、AI が答えを出せるかだけではなく、あとで説明できるかが大切です。誰が患者情報を入力したのか、どの API key が使われたのか、対象外機能が使われていないか、外部ツールに情報が渡っていないかを確認できるようにします。

## 最初にやること

まず、一般用途と医療情報用途の organization を分けます。API documentation では、HIPAA readiness は organization level で適用されると説明されています。試しに有効化して簡単に戻す設定ではないため、検証環境と本番環境も分けるべきです。

次に、使える機能を決めます。Messages API だけで十分なのか、files、batch、code execution、MCP connector、managed agents が必要なのかを確認します。PHI を扱う経路では、対象外機能を使わない設計にします。

最後に、ユーザーとログを決めます。医療情報を扱う人、一般部門、開発者、委託先、監査担当を分け、誰がどこまで使えるかを記録します。ログは保存するだけでなく、誰が確認し、問題があったときにどう止めるかまで決めます。

## まとめ

Claude の HIPAA self-serve 設定は、医療情報を扱う会社が Claude を導入しやすくする更新です。ただし、設定できるようになったからすぐ患者情報を入れてよい、という意味ではありません。

日本の医療・ヘルスケア企業は、一般用途の Claude、開発者向け Claude Code、PHI を扱う API、外部ツール、監査ログを分けて設計する必要があります。便利な AI 機能より先に、どの情報をどの契約と機能の範囲で扱うかを決めることが重要です。

## 出典

- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) - Claude Help Center, 2026-07-14
- [HIPAA-ready Enterprise plans](https://support.claude.com/en/articles/13296973-hipaa-ready-enterprise-plans) - Claude Help Center
- [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) - Claude Platform Docs
