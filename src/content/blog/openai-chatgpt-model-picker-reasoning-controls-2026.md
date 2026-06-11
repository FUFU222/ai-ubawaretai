---
title: 'ChatGPTモデル選択UI、社内推論設定をどう教えるか'
description: 'ChatGPTモデル選択UIの簡素化を整理。日本企業がInstant、Medium、High、Proの使い分け、Auto切替、Enterprise管理設定をどう教育・統制すべきか解説する。'
pubDate: '2026-06-11'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'GPT-5.5', 'AIガバナンス', '管理者設定', '企業導入']
series: 'openai-security-controls'
draft: false
---

OpenAI は 2026年6月10日、ChatGPT の model picker を簡素化し、推論の強さを **Instant / Medium / High / Extra High / Pro Standard / Pro Extended** という選択肢へ整理し始めた。これは小さな UI 変更に見える。しかし日本企業にとっては、社内の ChatGPT 利用ガイド、研修資料、プロンプト集、重要業務での「深く考えさせる」判断基準を更新するタイミングである。

このサイトではすでに [GPT-5.5 InstantでChatGPT標準運用はどう変わるか](/blog/openai-gpt-55-instant-chatgpt-default-2026/) で標準モデルの変更を扱い、[OpenAI o3/GPT-4.5退役、ChatGPT運用棚卸し](/blog/openai-o3-gpt45-chatgpt-retirement-2026/) で古いモデル名への依存を整理した。今回の焦点は、モデルそのものではない。利用者が毎日見る選択 UI が、モデル名から用途と推論強度へ寄っている点だ。

さらに、Enterprise / Edu では model picker が RBAC、legacy model、flexible pricing、Auto routing と結びつく。直近では [ChatGPTアプリ権限、接続SaaS承認をどう設計するか](/blog/openai-chatgpt-app-permissions-enterprise-2026/) で接続アプリの承認線を見たが、モデル選択も同じく「個人の好み」ではなく管理対象になっている。

## 事実: 6月10日に何が変わったか

OpenAI の ChatGPT Release Notes によると、今回の更新は、タスクに合わせて速度と推論 effort のバランスを選びやすくするための model picker 簡素化である。新しい表示では、日常的な応答向けの Instant、より深い推論を行う Medium / High、Pro 以上向けの Extra High、さらに Pro Standard / Pro Extended が並ぶ。

旧表記との対応も示されている。Thinking Standard は Medium、Thinking Extended は High、Thinking Heavy は Extra High へ変わる。一方、Thinking Light は削除される。Pro Standard と Pro Extended は Pro の下に残る。つまり、OpenAI は「Thinking というモデル種別を細かく選ぶ」見え方から、「どれくらい深く考えるかを選ぶ」見え方へ寄せている。

もう一つ重要なのが Auto 切替である。Release Notes は、Instant が必要に応じて Medium へ自動切替するかどうかをユーザーが設定で選べると説明している。Web では composer に model picker があり、iOS / Android では会話上部に表示される。Plus / Pro ユーザー向けにグローバル展開が始まった更新なので、日本の個人利用者や部門 PoC にも早く波及する。

## 事実: GPT-5.5の説明とどうつながるか

OpenAI の GPT-5.5 in ChatGPT ヘルプでは、Instant、Thinking、Pro の役割が整理されている。Instant は日常的な質問向け、Thinking は複雑なタスク向け、Pro は長時間・高難度の作業向けという位置づけだ。Instant を選んだ場合でも、複雑な依頼では Thinking へ自動的に切り替わることがある。

この説明と 6月10日の UI 変更を合わせると、社内教育で重要なのは「どのモデル名を押すか」ではなく、「どの作業で推論を深くするか」になる。営業メールの下書き、会議メモの要約、軽い調査は Instant で足りることが多い。複数資料の比較、原因分析、契約条項の論点整理、コードレビュー前の設計検討では Medium や High を選ぶ価値が出る。重大な意思決定や長いワークフローは Pro に寄せる、という説明のほうが利用者に伝わりやすい。

ただし、推論を深くすれば常に正しいわけではない。OpenAI は Pro について Apps、Memory、Canvas、image generation が使えない場合があるとも説明している。モデル選択は、知能の上下だけではなく、使える機能、コンテキスト長、コスト、応答速度との組み合わせである。

## 分析: 日本企業は社内手順を用途分類へ移すべき

ここからは分析だ。

日本企業では、ChatGPT の使い方が部門ごとに自然発生しやすい。ある部署は「Thinking を選んで」と言い、別の部署は「Pro で最終確認」と書き、研修資料には古い画面のスクリーンショットが残る。今回のように UI 名称が変わると、現場は「以前の Thinking Standard はどれか」「Light が見つからない」と迷う。

そのため、社内手順はモデル名ではなく用途で書くほうがよい。たとえば、軽作業、比較検討、重要判断、長時間作業という4区分を作る。軽作業は Instant、比較検討は Medium、重要判断は High、長時間作業や専門的なレビューは Pro Standard / Pro Extended の候補にする。名称がまた変わっても、用途分類が残れば教育資料を小さく直すだけで済む。

これは [ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) のようなセキュリティ機能ともつながる。企業利用では、どのモデルを選んだかだけでなく、どのアカウントで、どのセッションで、どのデータやアプリに触れたかが説明対象になる。モデル選択の教育を、アカウント保護、接続アプリ、プロンプト管理と別物にしないほうがよい。

## 管理者が確認すべき設定

Enterprise / Edu の Models & Limits では、model picker に Auto、Instant、Thinking、Pro があり、Auto は Instant と Thinking を自動で切り替えると説明されている。さらに、workspace admins は legacy models を有効化でき、flexible pricing のワークスペースでは Auto の reasoning task を Thinking mini へ向ける設定も示されている。

ここで管理者が見るべき論点は3つある。

第一に、ユーザーが見ている UI と管理画面の言葉がずれる可能性だ。利用者向けには Medium / High と見えても、管理文書やヘルプでは Thinking / Pro / Auto と説明される場合がある。社内ヘルプでは、両方の表記を対応表で示したほうがよい。

第二に、flexible pricing の費用説明である。Auto が深い推論へ切り替わると、利用者の体感では「Instant を選んだ」つもりでも、実際には重い推論が走ることがある。コスト配賦が厳しい組織では、部署ごとの利用基準と管理者設定を合わせて確認したい。

第三に、RBAC だ。Models & Limits は、GPT-5.5 Instant / Thinking / Pro が RBAC で有効な状態から無効化された場合、既存チャットの新規メッセージが送れず別モデルを使うよう促される挙動を説明している。これは、モデルアクセスを後から絞ると現場の既存作業に影響することを意味する。切り替え前には告知と代替手順が必要だ。

## 実務チェックリスト

日本企業が今回すぐ行うべきことは大きくない。

まず、社内の ChatGPT 利用ガイドから古い model picker 画面、Thinking Light / Standard / Extended / Heavy、特定モデル名だけに依存した記述を探す。該当箇所は、Instant、Medium、High、Pro という用途別の説明へ置き換える。

次に、重要業務のプロンプトを10個ほど選び、Instant、Medium、High で出力差を確認する。評価観点は正確性だけではない。根拠の出し方、長さ、曖昧さへの確認質問、機密情報を含む資料への反応、後続作業への渡しやすさを見る。

最後に、Enterprise / Edu では管理者設定を確認する。Auto routing、legacy models、RBAC、flexible pricing、usage limits for custom roles を見て、ユーザー教育と管理設定が矛盾していないかを確認する。特に「Auto を標準にするが、重要業務では High を明示する」「Pro は人間レビューを伴う作業だけにする」といった社内ルールを決めるとよい。

今回の更新は、ChatGPT が単なるモデル一覧から、作業の重さを選ぶ UI へ移っていることを示している。日本企業にとっての実務価値は、UI 名称を覚えることではない。ChatGPT を使う仕事を、軽い下書き、深い検討、重要判断、長時間ワークフローに分け、モデル選択を業務リスクと費用の管理に接続することだ。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-06-10
- [GPT-5.5 in ChatGPT](https://help.openai.com/en/articles/11909943) - OpenAI Help Center
- [ChatGPT Enterprise and Edu - Models & Limits](https://help.openai.com/en/articles/11165333-chatgpt-enterprise-and-edu-models-limits) - OpenAI Help Center
- [ChatGPT Enterprise & Edu Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
