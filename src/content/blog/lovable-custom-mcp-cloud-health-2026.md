---
title: 'Lovable Custom MCP全開放、開発運用の統制点'
description: 'Lovable Custom MCP全プラン開放とCloud database health checkを整理。日本の開発・プロダクトチームが接続権限、DB運用、AIアプリ開発をどう管理すべきか解説する。'
pubDate: '2026-05-26'
category: 'news'
tags: ['Lovable', 'MCP', 'AIエージェント', '開発者ツール', '開発基盤', '企業導入']
draft: false
---

Lovableは2026年5月25日の公式Changelogで、Custom MCP serversを全プランで利用可能にしたと発表した。前日の5月24日には、Lovable Cloudのdatabase health checkも追加している。どちらも単体では小さな機能に見えるが、AIアプリビルダーを日本の開発・プロダクトチームが業務利用するうえでは重要な更新だ。

理由は、AIでアプリを作る作業が「プロンプトを入れて画面を生成する」だけでは終わらなくなっているからだ。要件はNotion、Jira、Linear、Miro、社内API、分析基盤、DBに散らばる。LovableのCustom MCP開放は、そうした外部文脈をAIアプリビルダーへ接続しやすくする。一方、database health checkは、作った後のLovable Cloud運用で、遅延やタイムアウトの原因をチャットから切り分けるための機能である。

この動きは、以前扱った[AWSのAmazon Quickデスクトップ版](/blog/amazon-quick-desktop-free-plus-2026/)とも近い。AIアシスタントやAIアプリビルダーは、単体のチャットから、MCPを通じて業務ツールやローカル環境へ接続する方向へ進んでいる。さらに[Cursor Cloud Agentの開発環境管理](/blog/cursor-cloud-agent-dev-environments-2026/)で見たように、AIがコードや環境へ触れるほど、接続先、権限、実行環境、監査の設計が導入判断の中心になる。

## 事実: Custom MCPが全プランで使えるようになった

LovableのChangelogは、2026年5月25日付でCustom MCP serversが全プランで利用可能になり、有料プラン不要でConnectorsからChat connectorsへ追加できると説明している。MCPはModel Context Protocolの略で、AIシステムが外部ツール、サービス、データソースへ接続するための標準的な仕組みとして広がっている。

Lovableのドキュメントでは、Chat connectorsはLovable Agentが外部ツールの文脈を読み、場合によっては限定的な操作を実行するための接続面として説明されている。Notion、Linear、Jira、Miroのようなチームの作業文脈を、AIアプリ生成の入力にできる。Custom MCP serverを使えば、公開済みの標準連携だけでなく、社内API、内部CRM、独自分析基盤のようなシステムも接続候補になる。

ここで重要なのは、Custom MCPが「便利な追加データ」ではなく、業務データへの入口になり得ることだ。Lovableがチケット、仕様書、顧客メモ、分析結果、社内APIの応答を読むなら、生成されるアプリの精度は上がる。しかし同時に、AIがどの情報へアクセスできるか、どの操作を実行できるか、誰の認証で呼び出すかを決めなければならない。

## 事実: Chat connectorsとLovable MCP serverは向きが違う

Lovableには、今回の主題であるChat connectorsと、別の「Lovable MCP server」がある。名前が似ているため混同しやすいが、向きが違う。

Chat connectorsは、Lovable Agentが外部サービスへ接続するためのものだ。たとえば、Lovableの中で「今スプリントのLinear issueをもとに管理画面を作って」と依頼すると、接続済みのissue情報を文脈として使える。これは、AIアプリビルダーが外へ取りに行く流れである。

一方、Lovable MCP serverは、Claude Desktop、Cursor、ほかのMCP対応クライアントなど外部のAIエージェントからLovableを操作するための研究プレビューだ。ドキュメントでは、プロジェクト一覧、ファイル読み取り、プロジェクト作成、Lovable Agentへのメッセージ送信、デプロイなどのツールが説明されている。こちらは、外部エージェントがLovableをツールとして呼ぶ流れである。

日本のチームでは、この違いを管理台帳に分けて書くべきだ。Chat connectorsは「Lovableから社内システムへ出る権限」、Lovable MCP serverは「外部AIからLovableを動かす権限」である。どちらもMCPだが、リスクの向きは違う。

## 事実: Cloud database health checkは運用の入口になる

2026年5月24日のChangelogでは、Lovable Cloud database health checkも追加された。Lovable CloudのDBに対して、チャットからhealth checkを依頼でき、接続数、メモリ、ディスク使用量、稼働時間などの状態を要約する機能だと説明されている。遅いクエリ、タイムアウト、接続増加、メモリ圧迫、ディスク不足、compute limitのどれが疑わしいかを切り分けるために使う。

これは、AIアプリビルダーの弱点を補う方向の更新である。画面やCRUDは素早く作れても、本番に近い利用ではDBの遅さ、接続枯渇、データ量増加、クエリ設計が問題になる。非エンジニアや少人数チームが作ったアプリほど、障害時に「何が悪いのか」を見つける初動が遅れやすい。チャットからDB状態の要約を取れるなら、少なくとも問題を会話の中で分類し、開発者やSREに渡す材料を作れる。

ただし、health checkは運用監視の完全な代替ではない。日本企業が顧客向け、社内基幹、個人情報を扱うアプリに使うなら、通常のログ、バックアップ、権限管理、変更履歴、障害連絡、復旧手順は別途必要だ。Lovableのチャット診断は、初動調査を速くする道具として扱うのが現実的である。

## 分析: 日本チームは「作れるか」より「接続してよいか」を見る段階に入った

ここからは分析だ。

LovableのCustom MCP全プラン開放は、AIアプリ開発の入口を広げる。プロダクトマネージャーがJiraやNotionの文脈を渡し、デザイナーがMiroや仕様書を使い、開発者が社内APIのMCP serverを追加する。これにより、AIが作るものは空想のプロトタイプから、実際の業務文脈に近いアプリへ寄る。

一方で、業務文脈に近づくほど、情報管理の責任も増える。日本企業であれば、個人情報、顧客情報、契約情報、未公開の製品計画、業績データ、ソースコード、アクセスキーなどをどの範囲でAIツールに渡してよいかを決める必要がある。Custom MCPが無料で開かれたからといって、社内の誰もが任意のMCP serverを追加してよいとは限らない。

ここは[OpenAI Codexプラグイン戦略](/blog/openai-codex-plugins-platform-strategy-2026/)で扱った論点とも重なる。AIエージェントは、スキル、プラグイン、MCP、コネクタを通じて外部システムへ届く。開発チームは、MCPを「便利な接続規格」としてだけでなく、権限境界として扱う必要がある。

また、[Google Gemini API Docs MCP](/blog/google-gemini-api-docs-mcp-agent-skills-2026/)のように、MCPは公式ドキュメントや開発者スキルをAIへ渡す用途にも広がっている。Lovableの場合は、よりプロダクト開発の現場に近い。仕様、チケット、データ、DB診断が同じ会話面に入るため、チームのルールが曖昧だと、便利さがそのまま漏えいや誤操作の経路になる。

## 導入前に決める五つのこと

第一に、誰がCustom MCP serverを追加できるかを決める。個人ごとに自由追加を許すのか、workspace管理者が承認したサーバだけにするのかでリスクは大きく変わる。少なくとも業務利用では、サーバ名、提供元、接続先、認証方式、読み取り/書き込みの範囲、責任者を台帳化したい。

第二に、MCP経由で渡してよいデータ分類を決める。公開情報、社内一般情報、機密情報、個人情報、顧客別データ、ソースコードを同列に扱わない。とくにプロトタイプ段階では、便利さを優先して実データを接続しがちだが、最初はダミーデータや限定されたテスト環境から始めるべきだ。

第三に、Chat connectorsとLovable MCP serverを分けて監査する。前者はLovableが外部情報を使う経路、後者は外部エージェントがLovableを操作する経路である。接続ログ、OAuth認可、トークン失効、メンバー退職時の解除手順も分けて確認する。

第四に、Lovable Cloud database health checkを障害対応フローに入れる。遅延が出たとき、誰がどのプロンプトでhealth checkを実行し、結果をどこへ記録し、開発者にどう渡すのかを決める。チャット内で見て終わりにすると、再発防止や顧客説明に使いにくい。

第五に、AIアプリビルダーで作ったものの本番基準を決める。社内検証アプリ、部門内ツール、顧客向けアプリ、個人情報を扱うアプリでは、求めるレビューや監視が違う。Custom MCPとDB診断があるから本番運用できる、という判断は早い。レビュー、テスト、アクセス制御、バックアップ、監視、データ削除手順まで含めて判断すべきだ。

## まとめ

LovableのCustom MCP全プラン開放とCloud database health checkは、AIアプリビルダーが「作る道具」から「業務文脈につながり、運用も助ける道具」へ寄っていることを示している。日本の開発・プロダクトチームにとっては、プロトタイプ速度が上がるだけでなく、接続権限とDB運用をどう管理するかが新しい宿題になる。

まずは小さな社内ツールで、承認済みのMCP serverだけを使い、テストデータで試す。そのうえで、Lovable Cloudのhealth checkを障害初動の手順に組み込み、結果をチケットや運用記録へ残す。便利な接続を開くほど、接続先の棚卸しと責任分界を先に作る。この順番を守れば、Lovableの更新は日本チームにとってかなり実用的な選択肢になる。

## 出典

- [Lovable changelog](https://docs.lovable.dev/changelog?page=1) - Lovable Documentation, 2026-05-24/2026-05-25
- [Chat connectors (MCP)](https://docs.lovable.dev/integrations/mcp-servers) - Lovable Documentation
- [Lovable MCP server (research preview)](https://docs.lovable.dev/integrations/lovable-mcp-server) - Lovable Documentation
