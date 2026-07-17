---
title: 'ChatGPT agent廃止、Work移行で変わる業務AI管理'
description: 'ChatGPT agent廃止でWorkへの移行が必要になった。日本企業が旧agent運用、デスクトップ、アプリ権限、監査ログ、費用管理、利用者案内をどう見直すか、移行前の確認点を整理する。'
pubDate: '2026-07-17'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'AIワークフロー', '企業導入', '管理者設定', 'AIエージェント']
series: 'openai-chatgpt-work-products-2026'
draft: false
---

OpenAI Help Center の ChatGPT agent ページが更新され、冒頭で **ChatGPT agent は現在利用できず、長い複数ステップ作業や完成物作成には ChatGPT Work を使う**という位置づけが示された。これは単なる名称変更ではない。ChatGPT の agent 機能を試していた企業にとっては、旧 agent の使い方、Work、Codex、デスクトップアプリ、接続アプリ権限、監査ログをまとめて見直す移行イベントである。

OpenAI は 2026年7月9日の release notes で ChatGPT Work を導入し、Chat、Work、Codex を新しい ChatGPT desktop app にまとめた。Work は調査、情報分析、文書、表計算、プレゼン、レポート、Sites などの完成物を扱い、Codex はソフトウェア開発やリポジトリ作業に特化する。これは [ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) で見た credits 管理、[ChatGPTタスク刷新](/blog/openai-chatgpt-scheduled-tasks-management-2026/) で見た定期実行、[ChatGPT求人検索と履歴書支援](/blog/openai-chatgpt-job-search-resume-2026/) で見た業務入口のチャット化と同じ流れにある。

日本企業が見るべき焦点は、「agent がなくなったのか」だけではない。旧 agent で許していた作業を Work に移すのか、開発系は Codex に寄せるのか、ブラウザ作業はどの端末で許可するのか、アプリ接続やデータ保持をどう説明するのかである。

## 事実: ChatGPT agentはWorkへ移る位置づけになった

OpenAI Help Center の ChatGPT agent ページは、更新時点で「ChatGPT agent は no longer available」と案内し、長い複数ステップ作業や finished deliverables には ChatGPT Work を使うよう促している。ページ内には旧 agent の使い方、アプリ利用、ブラウザ、セーフティ、Enterprise/Edu の制御項目も残っているが、入口の案内は Work への移行に変わっている。

この事実は、利用者向けには「今まで agent と呼んでいた作業面が Work に整理される」と説明したほうが伝わりやすい。Work は、調査、分析、ファイル処理、資料作成のような非開発業務を扱う。Codex は、コード、テスト、コマンド、リポジトリ、開発ツールを扱う。Chat は、質問、検索、壁打ち、短い相談を扱う。つまり、旧 agent のように「AI に作業を任せる」体験は残るが、入口と責任範囲が分かれた。

既存の [OpenAI Atlas終了](/blog/openai-atlas-retirement-browser-agent-migration-2026/) でも同じ再配置が起きていた。Atlas は単独の AI ブラウザとしては止まり、ブラウザ型の agentic work は ChatGPT と Codex 側へ移る。今回の agent 廃止も、OpenAI が作業面を Chat、Work、Codex、desktop app、plugins、Sites へ整理している流れの一部と読むべきだ。

## 事実: WorkとCodexは同期範囲も違う

OpenAI の Work and Codex ヘルプは、ChatGPT には Chat、ChatGPT Work、Codex が含まれると説明している。Work は長い調査や完成物作成、Codex はソフトウェア開発と技術作業である。Work は eligible paid plans の web、mobile、desktop で使えるが、desktop の Work は利用者の許可によりローカルファイルや desktop apps を扱える。Codex は ChatGPT desktop app の mode として提供され、ローカル folder、repositories、terminals、developer tools と連携する。

同期範囲も重要だ。OpenAI は、web や mobile で作った Work conversations は cloud surfaces で継続できる一方、launch 時点では desktop Work に表示されず、desktop Work threads と local files はそのコンピューターに残ると説明している。Codex desktop tasks も web には出ず、mobile の Remote tab から対応 task にアクセスする形になる。

これは日本企業の運用では見落としやすい。利用者から見ると同じ ChatGPT でも、会話履歴、ローカルファイル、desktop thread、cloud Work、Codex task の所在が違う。情報システム部門や法務が「ChatGPT に保存される」と一括で説明すると、実際の保存場所、端末依存、監査対象、退職時の引き継ぎでずれが出る。

さらに [GPT-5.6一般提供とWork/API移行](/blog/openai-gpt-56-ga-work-codex-api-2026/) のように、Work と Codex はモデル、reasoning、usage、credits の条件にも関係する。旧 agent の感覚で「1機能」と捉えるより、業務用途ごとに Work、Codex、Chat を分け、費用とデータの流れを別々に見るほうがよい。

## 分析: 日本企業は旧agent利用の棚卸しから始める

ここからは分析だ。

日本企業が最初にやるべきことは、新しい Work の使い方を社内に広げることではない。まず旧 ChatGPT agent や agent mode として試していた作業を棚卸しすることだ。誰が使っていたか、どの plan で使っていたか、どの接続アプリを有効にしたか、どのサイトにログインしたか、どの資料を読み込ませたか、スケジュール実行に組み込んでいたかを確認する。

特に注意したいのは、agent がアプリやブラウザを使う作業である。OpenAI の agent ページは、メール、ファイル、アカウント設定のような機密データへアクセスし、利用者の代わりに action を行う可能性があるため注意が必要だと説明している。Work へ移るとしても、アプリ接続、サイトログイン、cookies、screenshots、browser history、Compliance API logs の扱いは消えない。

棚卸しでは、業務の種類を4つに分けるとよい。第一に、短い相談や検索で済むもの。これは Chat へ戻す。第二に、調査、要約、資料作成、表計算、レポート化のような完成物作成。これは Work の対象になる。第三に、コード変更、テスト、リポジトリ操作、CI 解析。これは Codex に寄せる。第四に、外部サイトへのログインやアプリ操作を含むもの。これは Work か Codex か以前に、権限と監査の承認対象にする。

この分類は、費用管理にも効く。Work は Codex と同じ usage 構造に従うとされており、[ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) で扱ったように、完成物作成や agentic work は credits 消費の管理対象になる。旧 agent の便利さだけで残すと、どの部門がどの作業で費用を作っているか見えにくくなる。

## 移行チェックリスト

第一に、利用者へ名称変更だけで説明しない。ChatGPT agent が Work へ移るだけではなく、Chat、Work、Codex の役割が分かれたと伝える。一般的な相談は Chat、長い業務成果物は Work、開発作業は Codex である。

第二に、旧 agent の prompts と scheduled tasks を確認する。定期実行や監視に組み込まれていたものは、Work の Scheduled Tasks へ移すのか、止めるのか、別の社内ワークフローへ戻すのかを決める。古い agent が毎日情報を取りに行く設計は、費用と権限の両方で放置しない。

第三に、接続アプリを棚卸しする。Google Drive、Gmail、Calendar、Slack、Box、SharePoint のようなアプリを使う場合、Work で必要な role だけに許可する。旧 agent の便利さを維持するために広い権限をそのまま渡すと、入力データの範囲も action の範囲も広がる。

第四に、desktop と cloud の違いを説明する。Work on desktop はローカルファイルや desktop apps を扱える一方、cloud Work conversations との見え方が異なる。退職、端末交換、ヘルプデスク対応、監査依頼のときに、どこに thread と files が残るかを社内手順に書く。

第五に、開発作業を Work に混ぜない。コード修正、テスト実行、リポジトリ操作は Codex に寄せる。Work は資料化や調査に強いが、技術作業まで同じ運用にすると、レビュー責任と権限が曖昧になる。[Codex役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/) や Sites のような生成物共有の論点とも分けて扱うべきだ。

## まとめ

ChatGPT agent の廃止は、OpenAI が agentic work をやめたという話ではない。むしろ、長い業務作業を Work、開発作業を Codex、短い相談を Chat へ分け、desktop app と cloud surfaces に整理する変更である。

日本企業は、旧 agent 利用の棚卸し、Work/Codex の役割分離、アプリ権限、desktop と cloud の保存範囲、Scheduled Tasks、credits 管理を同時に見直す必要がある。すぐに全社へ Work を広げるより、旧 agent で何を任せていたかを確認し、移す作業、止める作業、Codex に分ける作業を決めることが先である。

## 出典

- [ChatGPT agent](https://help.openai.com/en/articles/11752874-chatgpt-agent) - OpenAI Help Center
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Moving to the new ChatGPT desktop app](https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app) - OpenAI Help Center
