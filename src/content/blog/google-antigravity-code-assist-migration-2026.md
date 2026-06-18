---
title: 'Gemini Code Assist移行、Antigravity標準化の実務'
description: 'Gemini Code Assist移行で個人・Google AI Pro/UltraのIDE/CLI経路が2026年6月18日から変わる。日本企業がBYO利用、標準IDE、CLI統制をどう点検すべきか整理する。'
pubDate: '2026-06-18'
category: 'news'
tags: ['Google', 'Gemini API', 'AIエージェント', '開発者ツール', '開発基盤', '企業導入']
series: 'google-gemini-api-agent-platform-2026'
draft: false
---

Google が **Gemini Code Assist** と **Gemini CLI** の一部利用経路について、Antigravity への移行を明確にした。Google の release notes と Gemini Code Assist の概要ページには、個人向け、Google AI Pro、Google AI Ultra のティアで、Gemini Code Assist IDE Extensions と Gemini CLI が Gemini Code Assist へのリクエスト提供を **2026年6月18日** から停止するという注意書きが出ている。

この話は、単なるツール名変更ではない。すでに Google は [Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) で Antigravity agent を API 側の実行基盤として説明し、[Google AI Studio 連携拡張](/blog/google-ai-studio-android-workspace-2026/) では AI Studio から Antigravity へ進む導線を示していた。今回の移行告知は、その流れが個人・Pro・Ultra の IDE/CLI 利用にも降りてきたものだ。

日本の開発チームが見るべき点は、「Gemini Code Assist が終わるのか」ではない。Standard / Enterprise と個人向けの線引き、BYO アカウントで使われている IDE 拡張、Gemini CLI に依存した社内手順、Antigravity CLI へ移したときの権限とログを、いま棚卸しする必要があるということだ。

## 事実: 対象は個人・Pro・UltraのIDE/CLI経路

Google Cloud の Gemini for Google Cloud release notes と、Google for Developers の Gemini Code Assist release notes には同じ注意書きが掲載されている。内容は、Google がツールを Antigravity という単一の multi-agent platform に統合し、Antigravity CLI が利用可能になったというものだ。そのうえで、Gemini Code Assist IDE Extensions と Gemini CLI は、Gemini Code Assist for individuals、Google AI Pro、Google AI Ultra ティア向けのリクエスト提供を 2026年6月18日から停止すると説明している。

一方で、Gemini Code Assist Standard / Enterprise の概要ページは、これらが Gemini for Google Cloud の製品であり、個人向けの Gemini Code Assist とは別だと明記している。つまり、企業契約で Standard / Enterprise を使っているチームと、開発者が個人の Google アカウントや Google AI Pro / Ultra で IDE 拡張・CLI を使っているケースを分けて確認する必要がある。

同じ release notes では、2026年6月8日に Gemini 3.5 Flash が VS Code と IntelliJ の Gemini Code Assist ユーザー向けに一般提供され、agent mode、chat、code generation で使えるとも説明されている。モデル機能は強化されているが、利用面では Antigravity への統合が同時に進んでいる。この組み合わせが今回の実務上の注意点だ。

## 分析: Antigravityは新しい標準面になりつつある

ここからは分析だ。Google は Gemini 系の開発者体験を、モデル、IDE 補助、CLI、エージェント実行基盤に分けたままではなく、Antigravity を中心に再編しようとしている。

Antigravity の公開ページでは、Antigravity 2.0 を複数の自律 agent を並列に動かす platform と位置づけている。Antigravity CLI は terminal-first の操作面で、subagents、権限、slash commands、plugins、MCP、skills、hooks といった構成要素を扱える。これは、従来の IDE 拡張や単体 CLI よりも、長い作業を agent に任せる前提の作りに近い。

この方向性は [Gemini 3.5 Flash Stable 化](/blog/google-gemini-35-flash-api-stable-agents-2026/) ともつながる。Gemini 3.5 Flash は agentic coding や tool use の基盤モデルとして説明され、Gemini API、AI Studio、Antigravity、Enterprise Agent Platform などに広がっている。Google の狙いは、個々の補助機能をばらばらに改善することではなく、エージェントを実行し、監視し、成果物を確認する面を整えることだと読める。

日本企業では、この変化を「無料枠の終了」だけで処理すると見落としが出る。問題は、開発者の端末で使われていた AI 補助が、組織の管理外で突然止まること、あるいは Antigravity へ移行したあとに権限・MCP・skills・hooks の管理対象が広がることだ。IDE 補完の管理と、agent がファイルを編集しコマンドを実行する管理は、同じ強さでは扱えない。

## 日本企業で最初に確認すべきこと

最初に確認すべきは、誰がどのアカウントで Gemini Code Assist を使っているかだ。Standard / Enterprise の契約配下なのか、個人アカウント、Google AI Pro、Google AI Ultra なのかを分ける。情シスや開発基盤チームが公式に導入していない場合でも、VS Code や JetBrains IDE の拡張、Gemini CLI、個人の Google アカウント経由で使われている可能性はある。

次に、Gemini CLI を前提にした手順を洗い出す。README、オンボーディング資料、社内 wiki、研修資料、開発環境構築スクリプトに Gemini CLI の呼び出しや認証手順が残っていないかを見る。特に日本企業では、若手研修、内製支援、委託先向け開発環境、PoC チームの手順に個人アカウント前提の説明が混ざりやすい。

3つ目は、Antigravity CLI に移す範囲を限定することだ。Antigravity CLI は terminal-first の agent 操作面として、subagents や slash commands を持つ。便利になる一方で、ファイル編集、コマンド実行、外部ツール接続の影響範囲は広がる。いきなり全社標準にせず、対象リポジトリ、許可する MCP、使ってよい skills、hooks の扱いを決めた検証環境から始めるべきだ。

4つ目は、既存の Google 系エージェント基盤との役割分担だ。Managed Agents は API から agent 実行基盤を使う話であり、AI Studio は試作から Android や Cloud Run へつなぐ入口だ。Antigravity CLI は開発者端末やリポジトリ操作に近い。これらを同じ「Gemini 系 AI」として一括導入すると、責任境界が曖昧になる。

## 移行時のチェックリスト

実務では、まず利用棚卸しを短期で行う。IDE 拡張のインストール状況、Gemini CLI の利用者、Google AI Pro / Ultra の業務利用、社内ドキュメント上の手順、CI やローカルスクリプトからの呼び出しを確認する。停止対象は個人・Pro・Ultra ティアの IDE/CLI 経路なので、契約区分の確認が重要になる。

次に、代替手順を決める。個人アカウント利用を止め、Gemini Code Assist Standard / Enterprise へ寄せるのか、Antigravity / Antigravity CLI を標準にするのか、別の企業向けコーディングエージェントへ寄せるのかを選ぶ。ここで「各自が動くものに移る」状態にすると、MCP サーバー、リポジトリ権限、外部 API キーの扱いがばらける。

移行テストでは、同じタスクを旧 Gemini CLI、Antigravity CLI、IDE agent mode で比較する。見るべき指標は、生成コードの正確さだけではない。承認プロンプト、コマンド実行ログ、差分の見やすさ、失敗時の復帰、社内 proxy や DLP との相性、MCP 接続先の制御、監査ログの残り方を確認する。

最後に、利用ルールを更新する。AI コーディング補助の規程に、個人向けアカウントの業務利用、CLI でのファイル編集、外部ツール接続、秘密情報を含むリポジトリ、顧客データ、委託先端末での利用をどう扱うかを書く。これは Antigravity だけの問題ではないが、移行期限が明確に出た今が見直しのタイミングだ。

## まとめ

Gemini Code Assist の今回の移行告知は、Google が IDE 拡張と CLI を Antigravity 中心の agent platform へ寄せる流れを示している。対象は、Gemini Code Assist for individuals、Google AI Pro、Google AI Ultra の IDE/CLI 経路であり、Standard / Enterprise と混同してはいけない。

日本の開発チームは、まず個人利用と企業契約の境界を棚卸しし、Gemini CLI を含む手順を確認するべきだ。そのうえで、Antigravity CLI を使うなら、MCP、skills、hooks、subagents、コマンド実行権限を最初から管理対象に入れる。モデルの性能や新 UI よりも、開発現場の認証、権限、ログ、レビューをどう標準化するかが今回の本題である。

## 出典

- [Gemini for Google Cloud release notes](https://docs.cloud.google.com/gemini/docs/release-notes) - Google Cloud Documentation
- [Gemini Code Assist release notes](https://developers.google.com/gemini-code-assist/resources/release-notes) - Google for Developers
- [Gemini Code Assist Standard and Enterprise overview](https://docs.cloud.google.com/gemini/docs/codeassist/overview) - Google Cloud Documentation
- [Google Antigravity Product pages](https://antigravity.google/product/antigravity-cli) - Google Antigravity
