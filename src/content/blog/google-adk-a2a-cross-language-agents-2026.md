---
title: 'Google ADKとA2A、混在エージェント連携の実務'
description: 'Google ADKとA2Aのクロス言語連携を整理。日本の開発チームがPython、Go、Javaの混在エージェントを契約、権限、テスト、監査ログ、運用でどう管理すべきか解説する。'
pubDate: '2026-06-23'
category: 'news'
tags: ['Google', 'Gemini API', 'AIエージェント', '開発者ツール', '開発基盤', 'MCP']
series: 'google-gemini-api-agent-platform-2026'
draft: false
---

Google が **2026年6月23日** に公開した **Build Cross-Language Multi-Agent Team with Google's Agent Development Kit and A2A** は、ADK と A2A を使って Python、Go、Java など異なる言語の agent をつなぐ実装例を示した記事だ。単なるサンプルではなく、agent をチームやシステム単位で分けて作るときの契約設計に関わる更新である。

このサイトでは [Google ADK for Android](/blog/google-adk-kotlin-android-agents-2026/) で ADK が Kotlin / Android 側へ広がる話を扱い、[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) では Google 側の agent 実行基盤を整理した。今回の主題はその間にある「別々に作られた agent 同士をどう安全につなぐか」だ。

日本の開発チームにとって重要なのは、A2A を「新しい便利な tool call」と誤解しないことだ。A2A は agent-to-agent の通信層であり、各 agent の内部実装や tool 呼び出しを置き換えるものではない。Python の orchestrator が Go の特化 agent を呼び、さらに Java の既存業務 agent と連携するような構成で、契約、権限、ログ、テストをどう置くかが実務論点になる。

## 事実: ADKとA2Aで言語の違うagentをつなぐ

Google Developers Blog の記事では、ADK と A2A を使って cross-language multi-agent team を作る例が示されている。中心にあるのは、Python 側の orchestrator agent から、Go で書かれた remote A2A-compliant agent を呼ぶ構成だ。ADK の `RemoteA2aAgent` を使うと、Agent Card の handshake、parameter serialization、JSON-RPC network request といった通信の詳細を SDK 側に寄せられる。

この構成は、1 つの巨大な agent にすべての処理を詰め込むのではなく、言語や担当領域ごとに agent を分ける考え方に近い。Go で既に書かれた高速処理、Java の既存業務ロジック、Python の LLM orchestration を、A2A という共通の通信層で接続する。

Google ADK docs も、ADK と A2A を組み合わせることで、異なる agent が安全かつ効率的に通信し、協調できる multi-agent system を作れると説明している。対応言語として Python、Go、Java が示され、exposing と consuming の quickstart が用意されている。

A2A Protocol の公式ドキュメントでは、A2A は agent development kit ではなく、agent 同士の通信層だと整理されている。また、MCP の置き換えでもない。MCP が agent-to-tool の通信を標準化するのに対し、A2A は agent-to-agent の通信を標準化する。この違いを押さえないと、設計の境界を間違える。

## 分析: A2Aはtool callではなくagent契約の層

ここからは分析だ。A2A の意味は、agent を「部品」として分けるときの契約を明示しやすくする点にある。これまでの multi-agent 実装では、同じプロセス内の subagent、独自 API、queue、tool call、RPC、workflow engine が混ざりやすかった。小さな PoC では動くが、チームや言語が分かれると境界が曖昧になる。

A2A は、agent が他の agent へどの能力を公開するかを、Agent Card や protocol の形で扱う。これは「関数を呼べる」以上の意味を持つ。相手がどの input を受け、どの output を返し、どの認証やネットワーク境界で動き、どのバージョンの契約に従うかを考える入口になるからだ。

[Gemini Code Assist の Antigravity 移行](/blog/google-antigravity-code-assist-migration-2026/) で見たように、Google は IDE/CLI 側の agent 操作面も platform 化している。そこへ A2A が入ると、agent は単体ツールではなく、別 agent と協調する分散システムの一部になる。便利になる一方で、失敗時の責任境界も複雑になる。

日本企業で特に効くのは、既存システムを一気に Python LLM stack へ寄せなくてよい点だ。基幹側に Java、性能が必要な処理に Go、AI orchestration に Python という構成は珍しくない。A2A を使えば、各チームが得意な実装を保ったまま、agent 間の通信契約を揃える設計が取りやすい。

## 日本企業で効く導入シナリオ

1つ目は、業務システムの専門 agent 化だ。たとえば、在庫、請求、契約、顧客サポートのようなドメインは、既に Java や Go のサービスとして運用されていることが多い。これを LLM agent の内部 tool として雑に呼ぶより、業務境界ごとに A2A 対応 agent として公開し、Python 側の orchestrator が必要なときだけ呼ぶほうが、所有者と契約を分けやすい。

2つ目は、開発基盤チームと業務アプリチームの分担だ。開発基盤チームが ADK / A2A の共通テンプレート、認証、ログ、テスト環境を用意し、各業務チームが自分の agent を実装する。これにより、中央チームがすべての業務ロジックを抱え込まずに済む。

3つ目は、委託先やグループ会社との連携だ。日本企業では、複数ベンダーが別々の言語・基盤でシステムを持つことが多い。A2A はすべての内部実装を開示せず、公開能力と通信契約を定義する方向に向いている。ただし、外部連携で使うなら、認証、監査ログ、データ最小化、契約範囲を先に決める必要がある。

4つ目は、評価と検証の自動化だ。[Google Jules のプロアクティブ評価](/blog/google-jules-proactive-coding-agent-eval-2026/) で扱ったように、agent の価値は単に動くことではなく、何を根拠に判断したかで決まる。複数 agent が関わる場合、どの agent がどの判断に寄与したかを追跡できるログが重要になる。

## 設計時に決める契約、権限、ログ

まず決めるべきは Agent Card の運用だ。どの能力を公開するか、input / output schema をどう管理するか、version をどう上げるか、deprecated な能力をいつ止めるかを、API と同じくらい丁寧に扱う必要がある。agent は自然言語を扱うからといって、契約管理が曖昧でよいわけではない。

次に、権限境界だ。orchestrator agent が remote agent を呼べるとしても、その remote agent がさらに別の tool や agent を呼べるのか、どのデータへアクセスできるのかを分ける。A2A が通信を標準化しても、認可設計を自動で解くわけではない。ユーザー、チーム、サービスアカウント、委託先ごとの権限を切る必要がある。

3つ目は、ログと trace だ。multi-agent system では、失敗時に「どの agent が何を見て、何を返し、次の agent がどう解釈したか」を追えなければならない。JSON-RPC の request / response、Agent Card の version、入力の要約、出力の採否、エラー、再試行、最終的な人間承認をつなげて保存する。

4つ目は、テストだ。単体 agent の prompt 評価だけでは足りない。契約テスト、schema 互換性テスト、権限テスト、timeout / retry テスト、異常応答テスト、旧 version agent との互換性テストが必要になる。特に Go や Java の agent を Python orchestrator から呼ぶ構成では、言語ごとの型やエラー表現の違いが事故につながりやすい。

## PoCの検証チェックリスト

PoC では、まず 2 agent から始めるのがよい。Python orchestrator と、Go または Java の特化 agent を 1 つだけつなぐ。いきなり 5 agent の複雑な workflow を作ると、A2A の価値ではなく orchestration の複雑さに埋もれる。

次に、業務データではなく再現可能なサンプルで契約を固める。Agent Card、input / output、error code、timeout、retry、認証、ログ項目を先に固定する。その後で、限定された実データを使う。これにより、LLM の出力ゆらぎと通信契約の不備を分けて調べられる。

また、MCP との関係を明示する。A2A は agent 間通信、MCP は tool 通信だ。ある業務システムを tool として直接呼ぶのか、業務システムを扱う agent として A2A で呼ぶのかを決める。人間の判断や複数 step の業務判断を含むなら agent、単純なデータ取得や操作なら tool とするのが分かりやすい。

最後に、撤退基準を置く。A2A を入れても、単一プロセスの workflow で十分な場合はある。チーム境界、言語境界、運用責任、外部接続がないなら、最初から分散 multi-agent にする必要はない。A2A は複雑さを管理する道具であって、複雑さを増やす理由ではない。

## まとめ

Google の ADK + A2A クロス言語記事は、multi-agent system を現実の開発組織へ近づける更新だ。Python、Go、Java のような混在環境で、agent を言語・チーム・責任境界ごとに分け、A2A で通信契約を揃える方向性を示している。

日本の開発チームは、A2A を単なる新機能としてではなく、agent 間の API 契約として見るべきだ。Agent Card、schema、権限、ログ、契約テスト、MCP との役割分担を先に決める。Google の agent 基盤が広がるほど、重要になるのは「どの agent を作るか」だけではなく、「どの境界で agent を分け、どう安全につなぐか」である。

## 出典

- [Build Cross-Language Multi-Agent Team with Google's Agent Development Kit and A2A](https://developers.googleblog.com/build-cross-language-multi-agent-team-with-google-agent-development-kit-and-a2a/) - Google Developers Blog, 2026-06-23
- [ADK with Agent2Agent (A2A) Protocol](https://google.github.io/adk-docs/a2a/) - Google ADK Documentation
- [A2A Protocol](https://a2a-protocol.org/latest/) - Agent2Agent Protocol Documentation
