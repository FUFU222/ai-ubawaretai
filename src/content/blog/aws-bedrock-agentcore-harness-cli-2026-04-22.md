---
title: 'AWSのBedrock AgentCore新機能を整理。日本チームは何をすぐ試せる？'
description: 'AWSが2026年4月22日にBedrock AgentCoreへmanaged harnessとCLIを追加。東京リージョンで使える範囲、権限設計、料金の見方を日本の開発チーム向けに整理する。'
pubDate: '2026-04-23'
category: 'news'
tags: ['AWS', 'Amazon Bedrock', 'AgentCore', 'AIエージェント', '開発基盤', '日本市場']
draft: false
---

AWSが2026年4月22日に公開した[What's New](https://aws.amazon.com/about-aws/whats-new/2026/04/agentcore-new-features-to-build-agents-faster/)と[公式ブログ](https://aws.amazon.com/blogs/machine-learning/get-to-your-first-working-agent-in-minutes-announcing-new-features-in-amazon-bedrock-agentcore/)は、Amazon Bedrock AgentCoreを「本番運用の基盤」だけでなく、「試作をすぐ始める入口」まで一段広げた発表だった。今回追加された中心は `managed harness`、`AgentCore CLI`、そしてコーディング支援向けの `AgentCore skills` だ。

日本の開発チームにとって重要なのは、単に機能が増えたことではない。**何が4月22日時点で東京リージョンから実務で使えるのか、何はまだ東京で動かず、どこに権限やコストの注意点があるのか**を早めに見切れることだ。特にAIエージェント基盤は、PoCを始める速度と、本番前に統制を整える速度がずれると失敗しやすい。今回の発表は、その両方を見比べるのに向いている。

## 事実: 4月22日に何が追加されたのか

まず、一次ソースで確認できる事実を整理する。

AWSのWhat's Newによると、Amazon Bedrock AgentCoreは4月22日に、agent prototype を素早く作るための `managed harness` を preview で追加し、加えて `AgentCore CLI` とコーディング支援向け `AgentCore skills` を導入した。managed harness では、モデル、system prompt、tools を指定するだけで実行でき、reasoning、tool selection、action execution、response streaming といった agent loop を AWS 側が処理する。さらにセッションごとに microVM と filesystem / shell access が与えられると説明されている。

同じ内容をより詳しく書いた公式ブログでは、従来はエージェントの有用性を試す前に、オーケストレーションコード、compute、sandbox、tool 接続、永続化を自前で整える必要があったが、managed harness によって「3つの API 呼び出しで」まず動かせる方向へ寄せたとしている。ここでの主張は明確で、**エージェントの価値検証より先にインフラ準備へ時間を取られていた状況を短縮したい**ということだ。

CLI についても、単なるデプロイ補助ではない。ブログとドキュメントでは、`agentcore create` で project を起こし、ローカル検証、`agentcore deploy` によるデプロイ、`agentcore logs` や `agentcore traces` による運用確認まで、同じターミナル中心の流れにまとめている。つまり AWS が今回出したのは、「ノーコード寄りにすぐ試す managed harness」と、「コードを書きつつ IaC 前提で進める CLI」の二本立てだ。

## 事実: 日本チームが今すぐ見ておくべきリージョン差

ここは実務上かなり重要だ。

What's New とブログの両方で、managed harness preview の提供リージョンは4つに限られると書かれている。具体的には `US West (Oregon)`、`US East (N. Virginia)`、`Europe (Frankfurt)`、`Asia Pacific (Sydney)` だ。**東京リージョンは、4月22日時点の managed harness preview 対象には入っていない。**

一方で、AgentCore全体の[Supported AWS Regions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html)を見ると、`AgentCore Runtime`、`Memory`、`Gateway`、`Identity`、`Built-in Tools`、`Observability`、`Policy` などは `Asia Pacific (Tokyo)` に対応している。What's New でも、AgentCore CLI は AgentCore が使える14リージョンで利用可能と説明されている。つまり整理すると、**CLI と主要 primitives は東京で扱えるが、managed harness preview はシドニーまで取りに行く必要がある**、という構図だ。

この差は、日本の企業や開発組織にとって単なる細かい仕様ではない。PoC を短期間で回したいチームにとっては、managed harness が最も魅力的な入り口に見える。しかしデータ所在、レイテンシ、社内ルール、検証環境の分離を考えると、「試作は Sydney でよいのか」「本番を見据えた構成は Tokyo の Runtime / Gateway / Memory 前提で別途組むべきか」を最初に決める必要がある。

## 事実: CLI は便利だが、権限は開発用に広い

CLI は日本チームにとって使い勝手が良い一方、権限設計では注意が必要だ。

[CLI のクイックスタート](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html)では、Node.js 20+、Python 3.10+、AWS アカウント、IAM 権限、必要に応じたモデルアクセスを前提としている。さらに[Runtime permissions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html)には、CLI 利用時の IAM ポリシーが掲載されており、そこでは role 作成、policy 付与、CodeBuild project 操作など比較的広い権限が並ぶ。

同じページには重要な但し書きもある。CLI が作る IAM policy は development and testing purposes 向けであり、production では最小権限に絞った custom policy を使うべきだと明記されている。ここは日本企業で見落としやすい。PoC が簡単に始められるほど、そのまま運用へ持ち込んでしまいがちだが、AWS 自身が「開発用の広い権限」として線を引いている。

## 事実: 追加料金の扱い

料金も誤解しやすい。

What's New では、managed harness、CLI、skills 自体には additional charge はないと説明されている。ブログでも、CLI、harness、skills に追加料金はなく、使った resources に対してのみ支払うという整理だ。つまり「新しい入口」には別料金を課さず、実行リソースや各 AgentCore 機能の使用量に応じて課金する設計と読める。

ただし、[AgentCore Pricing](https://aws.amazon.com/bedrock/agentcore/pricing//)を見ると、Runtime や Browser Tool は CPU / memory の active consumption ベース、Gateway は API call ベース、Identity は一部 request ベースなど、サービスごとに従量課金の単位が異なる。managed harness が無料というより、**harness を使っても下で動く Runtime などの消費は普通に見なければならない**、という理解が正確だ。

## ここから考察: 日本チームはどこから始めるべきか

ここからは分析だ。

今回の発表で最も価値があるのは、「今すぐ agent を触りたい」チームと、「最終的に本番へ持って行きたい」チームの間をつなぎやすくなったことだと思う。これまでは、PoC 前に環境整備や実行基盤の選定で止まりやすかった。managed harness はそこを一気に縮める。一方 CLI は、試したものをコードと IaC に寄せていく導線として機能する。

ただし日本の現場では、何でも managed harness から始めればよいとは言いにくい。東京リージョン前提のルールが強い会社、機密データを持つ業務、運用監査が厳しいチームでは、Sydney preview をそのまま触るより、まず Tokyo で Runtime / Gateway / Memory / Observability を前提に CLI から最小構成を作る方が説明しやすい場合がある。

逆に、社内データを使わない純粋な機能検証であれば、managed harness の価値は大きい。モデル、prompt、tools の組み合わせだけで何ができるかを素早く見られるからだ。AWS が Strands Agents への export を示している点も重要で、将来カスタムオーケストレーションへ移る余地を残している。

## 日本の開発組織が見るべきチェックリスト

実務では、今回の発表を受けて次の確認が有効だ。

第一に、**PoC の目的が「体験確認」なのか「本番前提の技術検証」なのか**を切り分ける。前者なら managed harness、後者なら Tokyo リージョン前提の CLI / Runtime 寄りが合いやすい。

第二に、**リージョン制約を先に明文化する。** managed harness は Sydney、主要 primitives は Tokyo という差を、データ分類と合わせて確認したい。

第三に、**CLI 利用者へ広い IAM 権限をどこまで渡すか**を決める。少なくとも本番用の role 設計とは分離した方がよい。

第四に、**追加料金なしという表現を過信しない。** harness や CLI に追加料金がなくても、Runtime や Browser Tool などの実消費は別だ。

## まとめ

AWSの4月22日の発表は、Amazon Bedrock AgentCoreを「重い本番基盤」から「まず数分で価値検証できる基盤」へ近づけるアップデートだった。managed harness、CLI、skills によって、試作と運用の距離は確かに縮まっている。

一方で、日本チームが押さえるべき現実ははっきりしている。**managed harness preview は東京未対応、CLI と主要機能は東京対応、CLI 権限は開発用に広く、料金は入口無料でも実消費は別計上**だ。この4点を踏まえると、今回の発表は単なる新機能ニュースではなく、日本企業が AgentCore をどの順番で検証し、本番へ寄せるかを考える材料としてかなり実務的だ。

## 出典

- [Amazon Bedrock AgentCore adds new features to help developers build agents faster](https://aws.amazon.com/about-aws/whats-new/2026/04/agentcore-new-features-to-build-agents-faster/) - AWS What's New
- [Get to your first working agent in minutes: Announcing new features in Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/machine-learning/get-to-your-first-working-agent-in-minutes-announcing-new-features-in-amazon-bedrock-agentcore/) - AWS Machine Learning Blog
- [Supported AWS Regions - Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html) - AWS Documentation
- [Get started with Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html) - AWS Documentation
- [IAM Permissions for AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html) - AWS Documentation
- [Amazon Bedrock AgentCore Pricing](https://aws.amazon.com/bedrock/agentcore/pricing//) - AWS Pricing
