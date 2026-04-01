---
title: 'OpenAI Codexがプラグイン機能を導入——コーディングツールから「開発プラットフォーム」への転換点か？'
description: 'OpenAIがCodexにプラグイン機能を追加。Slack・Figma・Notion等との連携やMCPサーバー統合により、単なるコーディング支援を超えたプラットフォーム化を目指す。その戦略と技術的背景を読み解く。'
pubDate: '2026-03-31'
category: 'news'
tags: ['OpenAI', 'Codex', 'AI エージェント', '開発ツール', 'MCP']
draft: false
---

OpenAIがCodexにプラグイン機能を追加した。[公式チェンジログ](https://developers.openai.com/codex/changelog)によると、3月25日付でプラグインが「first-class workflow」として導入され、翌26日にはCLI v0.117.0でプラグイン対応が正式リリースされている。

これだけ聞くと「ふーん、拡張機能ね」で終わりそうだけど、中身を見るとかなり野心的な設計になっている。OpenAIはCodexを「コードを書くツール」から「開発者の仕事全体を支えるプラットフォーム」に変えようとしている。

## 何が起きたか

OpenAIは3月25〜26日にかけて、Codexアプリ・CLI・VS Code拡張の全プラットフォームでプラグイン機能を展開した。[SiliconANGLE](https://siliconangle.com/2026/03/27/openai-introduces-plugins-codex-programming-assistant/)の報道では、ローンチ時点で13以上のプリパッケージ統合が用意されており、Slack、Figma、Notion、Gmail、Google Drive、Cloudflareなどが含まれる。

プラグインの正体は「インストール可能なバンドル」で、中身はスキル（再利用可能なプロンプト）、アプリ連携設定、そしてMCPサーバー設定の3つをパッケージ化したものだ。技術的には、Codexがクラウドコンテナ上でタスクを開始する際に、プラグインに含まれるMCPサーバーを自動的にスピンアップする仕組みになっている。

利用者数について言えば、[BigGo Finance](https://finance.biggo.com/news/202603272134_OpenAI-Codex-Plugins-Launch)は「3月時点で100万人以上の開発者がCodexを利用しており、GPT-5.2-Codexモデルのリリース以降、利用者は倍増した」と報じている。OpenAIの最も急成長しているビジネスセグメントの一つだという。

## 背景・文脈

このタイミングでのプラグイン投入には、明確な競争上の理由がある。

Anthropicは約5ヶ月前にClaude Codeでプラグイン機能を先行リリースしている。Claude Codeはスキル、MCPサーバー、アプリ連携をバンドルしたプラグインシステムをいち早く実装し、開発者コミュニティでの存在感を急速に高めてきた。直近ではOpenAIがSoraを終了した理由の一つとして「Claude Codeがエンジニアやエンタープライズ領域でシェアを奪っている」ことが挙げられており、Codexの強化は対Anthropic戦略の中核に位置づけられている。

価格面では、Codexが月額200ドル、Claude Codeが月額100ドルと、OpenAIは2倍の価格設定だ。この価格差を正当化するためにも、プラグインによるエコシステムの充実は急務だったのだろう。

Model Context Protocol（MCP）がプラグインの通信基盤に使われている点も見逃せない。MCPはもともとAnthropicが提唱したオープンプロトコルで、2025年12月にLinux Foundation傘下のAgentic AI Foundation（AAIF）に移管された。2026年3月時点で累計9,700万インストールを突破しており、AIエージェントの外部ツール連携における事実上の標準になっている。OpenAIがAnthropicの提唱した規格をそのまま採用しているのは、MCPの勝利を如実に示している。

## 技術的なポイント

プラグインのアーキテクチャを見ると、OpenAIがかなり練り込んだ設計をしていることがわかる。

まず、「スキル」と「プラグイン」の明確な区別がある。スキルは個人やプロジェクト単位のカスタムプロンプトで、いわば実験用の手作りワークフローだ。一方プラグインは、複数のスキル・MCP設定・アプリ連携をバージョン管理付きで1つのパッケージにまとめたもので、チームや組織全体で共有できる設計になっている。

ディレクトリ構造は `.codex-plugin/plugin.json` をマニフェストとして、オプションでスキルディレクトリ、アプリマッピング（`.app.json`）、MCP設定（`.mcp.json`）、アセットを含む形だ。インストールスコープはユーザー単位（`~/.codex/plugins/`）とリポジトリ単位の2つが用意されている。

ここで注目したいのは、Codex自身が `@plugin-creator` というビルトインスキルを備えている点だ。プラグインの雛形生成、ローカルマーケットプレイスへの登録、テストまでをCodex内で完結できる。つまり「AIツールの拡張機能をAI自身が作る」というメタな構造になっている。

MCPサーバーのスピンアップがクラウドコンテナ内で行われるアーキテクチャも重要だ。これはセキュリティ面でのサンドボックスとして機能すると同時に、ローカル環境に依存しない一貫した実行環境を保証する。Claude Codeのプラグインがローカルプロセスとして動作するのと対照的で、エンタープライズ向けのセキュリティ要件を意識した設計だと読める。

## 実務への影響・使いどころ

ここからは僕の見方だけど、このプラグイン機能で一番変わるのは「コーディングの前後の工程」だと思う。

これまでのAIコーディングツールは、エディタの中でコードを書くことに特化していた。でもプラグインでSlackやNotionに接続できるようになると、「Slackでの議論を読んで、Notionの仕様書を参照して、コードを書いて、PRを出す」という一連のフローをCodexが一気通貫で処理できるようになる。開発者が手動でコンテキストを組み立てる手間がかなり減るはずだ。

ただし現時点では、プラグインのエコシステムはまだ小さい。公式ディレクトリの13個に加えてコミュニティ作成のものがどれだけ増えるかが、プラットフォームとしての真価を問う分水嶺になるだろう。Anthropicの先行者利益を考えると、MCPサーバーの豊富さではClaude Code側にアドバンテージがあるかもしれない。

価格も気になるところだ。月額200ドルは個人開発者にはなかなか厳しい。チーム利用でプラグインの共有・標準化ができるなら価値はあるけど、個人で使うならClaude Codeの100ドルの方が手を出しやすい。この価格戦略がどう影響するかは注目に値する。

OpenAIが将来的にプラグインのマーケットプレイスを公開する計画を示唆しているのも興味深い。ChatGPTの「スーパーアプリ」構想との統合も視野に入っているようで、Codexが単なる開発ツールに留まらない可能性を感じさせる。

## まとめ

AIコーディングツールの競争は「コードの生成品質」から「プラットフォームとしての拡張性」に軸が移りつつある。OpenAIがAnthropicの5ヶ月遅れでプラグインを投入したという事実自体が、この領域でのClaude Codeの存在感の大きさを物語っている。今後数ヶ月のプラグインエコシステムの成長度合いが、両者の勢力図を大きく左右しそうだ。

---

**出典:**

- [Codex Changelog](https://developers.openai.com/codex/changelog) — OpenAI Developers, 2026-03-25
- [OpenAI introduces plugins for its Codex programming assistant](https://siliconangle.com/2026/03/27/openai-introduces-plugins-codex-programming-assistant/) — SiliconANGLE, 2026-03-27
- [OpenAI Launches Codex Plugins, Pivoting from Coding Tool to Integrated Work Platform](https://finance.biggo.com/news/202603272134_OpenAI-Codex-Plugins-Launch) — BigGo Finance, 2026-03-27
- [Why the Model Context Protocol Won](https://thenewstack.io/why-the-model-context-protocol-won/) — The New Stack, 2026-03
