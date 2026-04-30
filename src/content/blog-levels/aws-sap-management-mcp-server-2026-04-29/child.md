---
article: 'aws-sap-management-mcp-server-2026-04-29'
level: 'child'
---

AWS が **SAP 運用向けの MCP Server** を公開しました。名前は **AWS For SAP Management MCP Server** です。

これは、SAP を AWS 上で動かしている会社が、AI アシスタントに自然な言葉で質問しながら、状態確認や設定チェック、定期実行の操作をしやすくするための仕組みです。

## 何が新しいの？

AWS の発表では、従来の SAP HANA 運用では **6 以上の AWS サービスにまたがる 10 以上の確認作業** が必要になることがあると説明されています。今回の MCP Server は、その複雑さを AI アシスタントとの会話に寄せるのが狙いです。

たとえば、次のようなことが対象です。

- SAP アプリケーション一覧を見る
- アプリや部品の状態を確認する
- 設定チェックを実行する
- 定期チェックをスケジュールする
- ヘルスレポートを Markdown で出す

GitHub の README では、**20 以上の SAP-aware tools** を持つと案内されています。

## 既存の SAP 管理基盤を置き換える話ではない

ここは大事です。この MCP Server は単独で動く SAP 管理製品ではありません。**AWS Systems Manager for SAP を土台にして使う** 方式です。

AWS の記事では、登録済みの SAP アプリケーションを基盤として利用すると書かれています。つまり、すでに AWS 上で SAP 運用の基礎ができている企業ほど試しやすい、ということです。

さらに、この MCP Server 自体は **ローカルで動作** し、既存の `~/.aws/config` にある認証情報を使えます。新しい大きな基盤を追加するより、今の AWS 運用の上に会話型の操作面を足すイメージです。

## 日本企業は何を見るべき？

日本企業でまず見るべきなのは、**東京リージョンで使えるか** と **権限が重すぎないか** です。

AWS の公式ドキュメントでは、Systems Manager for SAP の対応リージョンに **Asia Pacific (Tokyo)** が載っています。なので、東京リージョンで SAP を運用している企業にとっては検証しやすい条件です。

一方で、必要権限は軽くありません。README には、`ssm-sap` だけでなく、**EventBridge Scheduler、IAM、SSM、CloudWatch、AWS Backup** などに関わる権限が並んでいます。誰でも自由に使うものというより、まずは情シスや SAP 運用担当が小さく試すほうが自然です。

## お金はかかるの？

MCP Server 自体は AWS の発表では **無料** です。ただし、裏で呼び出す AWS サービスの料金は発生します。

特に Systems Manager for SAP のドキュメントでは、**設定チェックは 1 アプリケーションあたり 1 回 0.25 米ドル** と説明されています。登録や基本的な開始停止は無料機能ですが、定期的にチェックを回すなら回数管理は必要です。

## まとめ

今回の発表は、「AI に SAP 運用を全部任せる」というより、**SAP 運用の確認作業を会話で扱いやすくする** 更新です。

日本企業なら、まずは

- 東京リージョンの既存環境で使えるか確認する
- 参照系と設定チェック系だけで試す
- 利用者と AWS プロファイルを限定する

この順で始めるのが現実的です。

## 出典

- [Announcing AWS For SAP Management MCP Server — Manage Your SAP Applications on AWS Using AI](https://aws.amazon.com/blogs/awsforsap/announcing-aws-for-sap-management-mcp-server-manage-your-sap-applications-on-aws-using-ai/)
- [AWS Labs AWS For SAP Management MCP Server](https://github.com/awslabs/mcp/tree/main/src/aws-for-sap-management-mcp-server)
- [What is AWS Systems Manager for SAP?](https://docs.aws.amazon.com/ssm-sap/latest/userguide/what-is-ssm-for-sap.html)
- [AWS Systems Manager for SAP endpoints and quotas](https://docs.aws.amazon.com/general/latest/gr/ssm-sap.html)
