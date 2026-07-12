---
title: 'Claude CMEK保存ログ、監査と鍵管理をどう変えるか'
description: 'Claude CMEK保存ログとAccess Transparencyを整理。日本企業がClaude Platformを監査、鍵管理、個人情報対応、SIEM連携で安全に運用するための確認点を解説する。'
pubDate: '2026-07-10'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIガバナンス', '監査ログ', 'セキュリティ', '企業導入', 'プライバシー']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は **2026年7月10日**、Claude Platform の release notes で、Access Transparency logging と CMEK content preservation に関する更新を出した。派手なモデル発表ではないが、日本企業が Claude Platform を本番利用するなら見落としにくい更新である。

今回の焦点は、Claude が何を生成できるかではない。Anthropic のサポート担当者が顧客コンテンツへアクセスした場合に、そのアクセスをどう見える化するか。顧客管理鍵、つまり CMEK を使う環境で、ポリシー違反調査や児童安全関連の報告に必要なコンテンツをどう保全するか。この二つは、監査、鍵管理、個人情報対応、法務・内部監査の説明責任に直結する。

既存の [Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) は DLP、SIEM、Purview などへ Claude の活動を流す話だった。[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) は AI エージェントの実行境界を整理した。今回の更新は、それらよりさらに狭いが重要な層、つまり「ベンダー側アクセスの可視化」と「顧客管理鍵を使うときの保全例外」に踏み込んでいる。

## 事実: 7月10日のPlatform更新で何が追加されたか

Anthropic の API release notes は、2026年7月10日付で二つの項目を示している。

一つ目は Access Transparency logging である。これは、Anthropic のサポート担当者が顧客コンテンツにアクセスした場合、そのアクセスを記録し、管理者が確認できるようにする仕組みだ。対象になるのは、サポート目的のアクセスであり、AI モデルが通常処理として入力を読むこととは分けて考える必要がある。

二つ目は CMEK content preservation である。CMEK は Customer-managed encryption keys、つまり顧客が管理する鍵でコンテンツを暗号化する仕組みだ。今回の更新では、ポリシー違反調査や child safety report のような特定目的で、フラグされたコンテンツを保全できる制御が追加されたと説明されている。

ここで重要なのは、両方とも「より多く保存するための機能」ではなく、企業利用で衝突しやすい二つの要求を扱っていることだ。企業は、自社データに対するベンダー側アクセスを知りたい。一方で、CMEK を使っていても、重大なポリシー違反や安全上の調査では一定の証跡が必要になる。今回の更新は、その緊張関係を管理機能として明示したものと読める。

## Access Transparencyはサポートアクセスの可視化である

Access Transparency は、Claude Platform の管理者が、Anthropic サポート担当者による顧客コンテンツアクセスを確認するための機能である。通常の API 利用ログや Compliance API とは役割が違う。API キー作成、ワークスペース変更、ユーザー管理のような顧客側操作ではなく、ベンダー側のサポートアクセスを説明できるようにする面が強い。

日本企業では、この違いが大きい。金融、医療、公共、製造、通信、専門サービスでは、クラウドベンダーや SaaS 事業者のサポート担当者が顧客データへアクセスする条件、承認、ログ、保存期間を確認されることがある。委託先管理や内部監査では、「自社社員が何をしたか」だけでなく、「ベンダー側がいつ何に触れたか」も問われる。

Access Transparency が効くのは、まさにこの問いである。たとえば障害調査、問い合わせ対応、ポリシー調査のために Anthropic 側の担当者がコンテンツへアクセスした場合、企業管理者はその事実を後から説明できるようになる。これは [Claude Security公開ベータ](/blog/anthropic-claude-security-public-beta-2026/) のような開発・セキュリティ運用でも重要だ。AI が扱うデータの範囲が広がるほど、サポートアクセスの監査証跡は導入審査の論点になる。

ただし、Access Transparency は万能な監査ログではない。自社アプリが Claude Platform API に送った全プロンプトと全応答を、これだけで監査できるわけではない。通常の API 入出力は、アプリ側ログ、LLM gateway、SIEM、DLP、Compliance API、クラウドログと合わせて設計する必要がある。Access Transparency は、あくまでベンダー側アクセスの透明性を補う部品として見るべきだ。

## CMEK preservationは削除と保全の運用線を変える

CMEK は、顧客が管理する鍵で Claude Platform 上のコンテンツを暗号化する仕組みである。企業にとっての価値は、ベンダー任せの鍵管理ではなく、自社の鍵管理ポリシー、失効、アクセス制御、監査と組み合わせられる点にある。

一方で、CMEK には運用上の難しさがある。顧客が鍵を無効化したり削除したりすれば、ベンダー側から見てもコンテンツへアクセスできなくなる。これはプライバシーやデータ主権の観点では強いが、ポリシー違反調査、安全上の報告、法的な証跡保全が必要な場面では、逆に問題になる場合がある。

今回の CMEK content preservation は、この衝突に対応するための更新である。Anthropic は、CMEK 利用顧客が content preservation を有効化でき、フラグされたコンテンツを特定の調査目的で保全できると説明している。対象として挙げられているのは、policy violation investigation と child safety report だ。

日本企業が見るべき点は、CMEK を入れればすべてのデータをいつでも自社判断で消せる、という単純な理解では足りないことだ。鍵管理、削除、保全、調査、報告の優先順位を先に決める必要がある。特に個人情報、未成年関連リスク、ユーザー生成コンテンツ、社内利用規程違反、外部委託先の利用が絡む場合、保全すべき証跡と削除すべきデータを分ける設計が必要になる。

## 日本企業は監査、鍵管理、個人情報対応を分ける

ここからは分析だ。

日本企業が今回の更新を導入判断に使うなら、まず監査、鍵管理、個人情報対応を一つに混ぜないほうがよい。それぞれ責任者も判断基準も違う。

監査の観点では、Access Transparency と Compliance API と自社ログをどう突き合わせるかが中心になる。Anthropic サポート側のアクセス、自社管理者の操作、API キーやワークスペース変更、アプリ側のリクエスト、DLP アラートを同じインシデント管理で追えるようにする。ログが別々の場所にあっても、時刻、ワークスペース、ユーザー、サポートケース、影響データを結びつけられる必要がある。

鍵管理の観点では、CMEK の鍵ライフサイクルを設計する。鍵を誰が作り、どこに保管し、どの条件でローテーションし、どの条件で revoke するのか。さらに、preservation を有効にした場合、どのデータがどの目的で保全される可能性があるのかを、セキュリティ、法務、個人情報保護担当で確認する必要がある。

個人情報対応の観点では、ログや保全データ自体が機微情報になり得る。Access Transparency の記録を見られる管理者を絞る。SIEM や監査基盤へ送る場合は、閲覧権限、保存期間、検索条件、二次利用を決める。CMEK preservation の対象が発生した場合に、本人対応、委託先管理、社内報告、当局対応が必要になるかも事前に確認したい。

この整理は [Claude Code監査ラベル追加](/blog/claude-code-otel-agents-mcp-security-2026/) で扱った telemetry 設計ともつながる。AI 利用の監査は、ログを多く出すことではなく、あとから説明できる単位でログを設計することが重要だ。

## 実務チェック: 導入前に確認する5項目

第一に、Claude Platform の利用範囲を棚卸しする。どのワークスペースで CMEK を使っているか、どのアプリが Claude API を呼んでいるか、どのチームが管理者権限を持つかを確認する。

第二に、Access Transparency の確認担当を決める。誰がログを見られるのか、どの頻度でレビューするのか、サポートケースとどう紐づけるのか、重大アクセスがあった場合に誰へ通知するのかを決める。

第三に、CMEK preservation の方針を決める。ポリシー違反調査や child safety report に関する保全が必要な業務か、保全対象が発生したときの社内責任者は誰か、鍵失効やデータ削除の手順と矛盾しないかを確認する。

第四に、SIEM や DLP との接続を整理する。Access Transparency、Compliance API、アプリ側ログ、クラウドログをどこへ集約し、どのアラートを作るかを決める。すべてを重大アラートにするのではなく、顧客情報、個人情報、認証情報、未公開コードなどの分類で優先度を変える。

第五に、社内説明を更新する。CMEK は強い統制手段だが、保全例外やサポートアクセス透明性とセットで説明しなければ誤解を生む。AI 利用規程、クラウド利用審査、個人情報保護チェックリスト、委託先管理の文書に今回の論点を反映するべきだ。

## まとめ

Claude CMEK content preservation と Access Transparency logging は、小さな release notes に見える。しかし日本企業にとっては、Claude Platform を本番利用する際の監査、鍵管理、個人情報対応を具体化する更新である。

Access Transparency は、Anthropic サポート側の顧客コンテンツアクセスを説明するための部品になる。CMEK preservation は、顧客管理鍵による強いデータ統制と、ポリシー違反調査・安全報告に必要な保全を両立させるための制御である。

日本企業は、この更新を「ログ機能が増えた」とだけ読まないほうがよい。Claude Platform の利用範囲、鍵のライフサイクル、保全例外、サポートアクセス、SIEM/DLP 連携、個人情報対応を同じ表で確認する必要がある。AI の本番導入では、モデル性能だけでなく、誰が何に触れ、どの証跡が残り、どの例外が許されるかを説明できることが競争力になる。

## 出典

- [Claude Platform release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs, 2026-07-10
- [Access Transparency](https://docs.anthropic.com/en/manage-claude/access-transparency) - Anthropic Docs
- [Customer-managed encryption keys](https://docs.anthropic.com/en/manage-claude/cmek) - Anthropic Docs

