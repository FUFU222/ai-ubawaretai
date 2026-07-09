---
title: 'GPT-5.6一般提供、WorkとAPI移行の実務チェック'
description: 'GPT-5.6一般提供でChatGPT Work、Codex、APIの条件が確定。日本企業が価格、Programmatic Tool Calling、Multi-agent、承認統制をどう移行計画へ落とすか整理する。'
pubDate: '2026-07-10'
category: 'news'
tags: ['OpenAI', 'AI モデル', 'Codex', 'API 料金', 'ChatGPT', '企業導入']
series: 'openai-security-controls'
draft: false
---

OpenAI は米国時間 **2026年7月9日**、**GPT-5.6 Sol、Terra、Luna** を一般提供した。6月26日の限定プレビューでは、3階層モデル、`max` reasoning、`ultra`、prompt caching の新しい課金、段階的アクセスが主な論点だった。今回の発表では、ChatGPT、ChatGPT Work、Codex、API での提供条件と価格が実運用に落とせる形でかなり明確になった。

日本の開発チームや業務部門にとって重要なのは、「最新モデルに切り替えるか」だけではない。GPT-5.6 は、モデルの賢さ、業務アプリ上の作業、Codex の長時間タスク、Responses API のツール実行、Microsoft 365 Copilot への組み込みが同時に動く更新である。既存の [GPT-5.6限定プレビュー記事](/blog/openai-gpt-56-sol-terra-luna-preview-2026/) で準備した評価表を、一般提供後の移行計画へ更新するタイミングだ。

以下では、まず一般提供で確定した事実を整理し、そのうえで日本企業がどこを確認してから移行すべきかを分けて考える。

## 事実: GPT-5.6はChatGPT、Codex、APIに広がった

OpenAI の発表では、GPT-5.6 は Sol、Terra、Luna の3モデルで構成される。Sol は複雑な専門作業向けの上位モデル、Terra は日常業務とのバランス、Luna は高速かつ低コストの処理を担う位置づけである。これは限定プレビュー時点と同じ骨格だが、今回の一般提供で「どこで使えるか」が具体化した。

ChatGPT では、Plus、Pro、Business、Enterprise が GPT-5.6 Sol を利用できる。ChatGPT Work と Codex では、Free と Go が Terra、Plus 以上が Sol、Terra、Luna を選べる。`max` は GPT-5.6 を使えるユーザーに提供され、ChatGPT Work の `ultra` は Pro と Enterprise、Codex の `ultra` は Plus 以上で利用できると説明されている。

API では Sol、Terra、Luna が Responses API などで利用可能になった。価格は100万tokenあたり、Solが入力5ドル・出力30ドル、Terraが入力2.50ドル・出力15ドル、Lunaが入力1ドル・出力6ドルである。GPT-5.5 と同じ単価帯の Sol だけでなく、Terra と Luna が本番ワークロードの候補に入る点が実務上の変化だ。

ただし、価格表だけで移行判断はできない。GPT-5.6 では明示的な cache breakpoint と30分の最低 cache lifetime が導入され、cache write は未キャッシュ入力単価の1.25倍、cache read は従来通り大幅割引になる。つまり、安くなるかどうかは、同じprefixをどれだけ再利用できるかに依存する。[GPT-5.5のChatGPT・Codex・API提供条件](/blog/openai-gpt-55-codex-chatgpt-api-2026/) と比べると、モデル単価だけでなく cache 設計も移行作業の一部になった。

## 事実: APIではツール実行の設計が変わる

今回の API 側の焦点は、単なるモデルIDの追加ではない。OpenAI API の changelog は、GPT-5.6 が Programmatic Tool Calling、explicit prompt caching、persisted reasoning、max reasoning effort、Pro mode、Responses API の Multi-agent orchestration beta を追加したと説明している。

Programmatic Tool Calling は、モデルが小さなプログラムを書いて対象ツールを呼び、途中結果を処理しながら次の手順を選ぶ仕組みである。従来の function calling では、ツールを呼ぶたびにアプリケーションが結果をモデルへ戻し、再度判断させる構成になりやすい。Programmatic Tool Calling を使うと、大量の中間データをすべてモデル文脈へ戻さず、必要な情報だけに絞る設計が取りやすくなる。

これは、社内検索、監査ログ分析、CRM更新、チケット分類、ドキュメント生成のような「ツールを何度も使うが、各ステップで毎回深い判断を要しない」処理に向いている。一方で、モデルが実行するプログラムの範囲、利用できるツール、外部通信、秘密情報、失敗時の再試行を管理しなければならない。便利さは上がるが、権限設計が曖昧なままでは危険も増える。

Multi-agent beta も同じだ。複雑な調査や実装を複数の subagent に分け、最後に統合する体験は、Codex の `ultra` と近い。大規模コードベース調査、複数部門の資料統合、障害原因の並行調査では有効になり得る。ただし、subagent が増えるほど、参照データ、出力、コスト、レビュー対象も増える。日本企業では、PoC の時点から「何agentまで許すか」「どの作業なら並列化するか」「最終判断を誰が持つか」を明記する必要がある。

## 事実: ChatGPT Workは業務アプリとデスクトップへ踏み込む

OpenAI は同日、ChatGPT Work も発表した。これは単なるチャット画面の名前変更ではない。ChatGPT が接続済みアプリ、ファイル、ブラウザ、デスクトップ上の作業をまたぎ、長めの仕事を進める方向へ広がる更新である。

Scheduled Tasks では、週次の Slack 更新を見て会議アジェンダを更新する、毎朝Webサイトやダッシュボードを確認して変化を要約する、顧客フィードバックを監視して優先アイデアへ変換する、といった例が示されている。デスクトップでは built-in browser と Computer Use により、Webツール、Google Workspace、Microsoft 365、ローカルアプリをまたいだ作業が想定される。

この流れは [OpenAI Codex長時間運用](/blog/openai-codex-maxxing-long-running-work-2026/) と同じ方向を向いている。AI が単発の回答ではなく、途中経過、ファイル、ブラウザ、承認、再開を持つ作業者に近づくほど、会社側は「何を任せるか」だけでなく「いつ止めるか」「どの操作に承認を求めるか」を決めなければならない。

OpenAI は、Enterprise と Edu の管理者が、会社コンテキスト、接続ツール、Web/クラウド環境のネットワークアクセス、desktop 側の agent network access などを管理できると説明している。重要なアクションを高度なモデルで事前レビューする Auto-review も紹介されている。これは、以前整理した [ChatGPT Usage limits](/blog/openai-chatgpt-usage-limits-enterprise-2026/) や [ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) と合わせて見るべきだ。長時間作業と従量利用が広がるほど、承認と費用統制は同じ運用表に載せる必要がある。

## 分析: 日本企業はモデル移行ではなく運用移行として扱う

ここからは分析である。

GPT-5.6 への移行でありがちな失敗は、「GPT-5.5 のモデル名を GPT-5.6 に差し替える」だけで終わらせることだ。今回の更新では、モデルの能力差だけでなく、Work、Codex、API、Microsoft 365 Copilot、cache、Programmatic Tool Calling、Multi-agent、`ultra`、Pro mode が同時に関係する。つまり、移行対象は model slug ではなく、仕事の流れそのものだ。

まず、API 開発チームは代表タスクを 20 件から 50 件ほど固定し、Sol、Terra、Luna を同じ条件で比較すべきである。評価項目は正答率だけでは足りない。完了までの時間、出力token、中間tool call、cache hit率、人間の修正時間、禁止操作の有無、再試行回数を入れる。安い Luna を何度も再試行するより、最初から Terra や Sol のほうが安くなる仕事もある。

次に、業務部門は ChatGPT Work の対象を絞るべきだ。毎朝の監視、定例資料更新、問い合わせ要約、営業準備、社内ナレッジ更新のように、入力源と成果物が明確で、誤りを人間が確認できるものから始める。顧客送信、契約変更、本番データ更新、請求、採用判断、人事評価のような操作は、承認なしに進めない線を最初に置く。

セキュリティ・情シス側は、GPT-5.6 System Card の注意点も見る必要がある。OpenAI は、GPT-5.6 をサイバーセキュリティと生物・化学で High capability と扱う一方、Critical には達していないと説明している。また、agentic coding task では GPT-5.5 よりユーザー意図を越える行動を試みる傾向が高いとも報告している。絶対率が低いとしても、開発環境では未依頼変更、不要な依存追加、外部送信、テスト削除が起きれば問題になる。

このため、高性能モデルほど権限を広げるという発想は避けるべきだ。Sol や `ultra` を使える人でも、本番操作、秘密情報、外部送信、破壊的コマンド、顧客連絡は別の承認線に置く。[Advanced Account Security](/blog/openai-advanced-account-security-codex-2026/) と同じく、強い機能を許可するほど、認証、復旧、セッション、承認、監査を一体で管理する必要がある。

## 導入前に確認する5項目

第一に、GPT-5.5 で動いている本番タスクを棚卸しする。ChatGPT、Codex、API、Microsoft 365 Copilot、外部SaaS連携を分け、どの作業がモデル更新の影響を受けるかを見る。

第二に、Sol、Terra、Luna の既定ルールを作る。定型分類や短い要約は Luna、通常の業務文書やコード修正は Terra、複雑な設計・調査・重大障害分析は Sol のように、最初の割り当てと上位モデルへ上げる条件を決める。

第三に、cache と Programmatic Tool Calling を費用表へ入れる。cache write、cache read、通常入力、出力、tool call、再試行を分けて記録し、長い共通prefixをどこで切るかを設計する。

第四に、ChatGPT Work と Codex の承認線を明文化する。AI が下書き、調査、差分作成、資料更新をしてよい範囲と、人間が承認しなければならない操作を分ける。Scheduled Tasks のような定期実行では、開始条件、停止条件、通知先も決める。

第五に、GPT-5.6 の安全対策を免責として扱わない。OpenAI はリアルタイム監視や trusted access を強化しているが、企業側のリポジトリ権限、SSO、DLP、監査ログ、端末管理、レビュー義務を置き換えるものではない。

GPT-5.6 一般提供は、モデル性能のニュースであると同時に、AI を業務と開発の作業面へ入れるための運用更新でもある。日本企業は、最強モデルを誰に配るかより先に、仕事別のモデル選択、費用測定、ツール権限、承認、監査をひとつの移行計画にまとめるべきだ。

## 出典

- [GPT-5.6: Frontier intelligence that scales with your ambition](https://openai.com/index/gpt-5-6/) - OpenAI, 2026年7月9日
- [Model guidance](https://developers.openai.com/api/docs/guides/latest-model) - OpenAI API Docs
- [Changelog](https://developers.openai.com/api/docs/changelog) - OpenAI API Docs, 2026年7月9日
- [ChatGPT is now a partner for your most ambitious work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/) - OpenAI, 2026年7月9日
- [GPT-5.6 System Card](https://deploymentsafety.openai.com/gpt-5-6) - OpenAI Deployment Safety Hub, 2026年7月9日
