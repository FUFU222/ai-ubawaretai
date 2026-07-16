---
title: 'ChatGPTカスタム指示5000字、業務AI管理の要点'
description: 'ChatGPTカスタム指示の上限が5000字に拡大。日本企業が個人設定、Projects、メモリ、業務標準を分け、社内AI利用ガイドとレビュー責任をどう更新すべきか実務視点で整理する。'
pubDate: '2026-07-16'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'AIガバナンス', '管理者設定', '企業導入', '知識管理']
series: 'openai-chatgpt-work-products-2026'
draft: false
---

OpenAI は 2026年7月15日の ChatGPT Release Notes で、ChatGPT の custom instructions 上限を拡大した。Plus、Pro、Enterprise、Business、Education の利用者は、従来の 1,500 文字から 5,000 文字まで保存できる。対象は ChatGPT の応答スタイルや振る舞いを調整する持続的な指示であり、単発プロンプトではない。

これは小さな入力欄の拡張に見える。しかし日本企業にとっては、ChatGPT を個人の文章作成ツールから、部門の業務AIへ広げるときの管理線に関わる更新である。5,000 文字あれば、好みの文体だけでなく、レビュー観点、禁止事項、出典の扱い、社内用語、確認質問の基準まで書ける。便利になる一方で、誰がその指示をレビューし、古くなった指示をどう直すかも問題になる。

この流れは、[ChatGPT横断検索](/blog/openai-chatgpt-unified-search-project-files-2026/) や [ChatGPT業務AI課金開始](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) と同じ線上にある。ChatGPT は会話だけでなく、Projects、ファイル、エージェント、表計算、長い作業文脈を扱う場になっている。さらに [ChatGPTメモリ刷新](/blog/openai-chatgpt-dreaming-memory-controls-2026/) で見たように、個人化の文脈も強くなっている。今回の焦点は、その入口にある「最初から ChatGPT に何を前提として渡すか」である。

## 事実: 7月15日に何が変わったか

OpenAI の Release Notes は、ChatGPT の custom instructions の文字数上限を引き上げると説明している。対象は Plus、Pro、Enterprise、Business、Education で、保存できる文字数は 5,000 文字になった。Free と Go では、Help Center の Custom Instructions FAQ 上、1,500 文字の上限が残る。

Custom instructions の説明では、利用者が ChatGPT の応答時に考慮してほしいことを共有でき、その指示はすべてのチャットにすぐ適用される。利用者は将来の会話に向けて指示を編集または削除できる。ただし、指示を変更しても過去の会話に現れた以前の指示が自動で消えるわけではなく、過去会話から消したい場合は会話履歴側の整理も必要になる。

もう一つ重要なのは、third-party plug-ins を使う場合の扱いだ。OpenAI は、プラグイン利用時に、モデルが custom instructions の関連情報をプラグイン開発者へ提供する可能性があると説明している。つまり、custom instructions は単に自分の画面の中に閉じたメモではない。接続機能や外部ツールを使う運用では、そこに書く情報の種類を制限する必要がある。

API との違いも押さえたい。Help Center は、ChatGPT UI の custom instructions に相当する API はなく、Chat Completions API では system message を使うと説明している。社内アプリや API 実装で同じ効果を出したい場合、ChatGPT の個人設定をそのまま移植するのではなく、アプリ側の system prompt 管理として設計する必要がある。

## 事実: Projects の指示とは別物である

ChatGPT には global な custom instructions だけでなく、Projects の project instructions もある。Projects は、長く続く作業をまとめるワークスペースで、チャット、アップロードファイル、カスタム指示を一箇所に置ける。Project settings から project instructions を設定でき、OpenAI は project instructions がその Project 内だけに適用され、global custom instructions を上書きすると説明している。

ここが実務上の分かれ目になる。全社や個人の日常的な応答方針は global custom instructions に置ける。一方、特定の案件、調査、顧客提案、採用プロジェクト、開発仕様のような文脈は Projects 側に寄せたほうがよい。5,000 文字になったからといって、すべての案件情報を global custom instructions に詰め込む設計は危うい。

Projects では、ファイル、Google Drive や Slack からのリンク、保存した回答、project memory も関係する。共有 Project では project-only memory が自動で有効になり、参加者個人の Project 外の文脈やメモリにはアクセスしないと説明されている。つまり、Project は業務文脈を閉じ込める器として使える。global custom instructions はそれより広く、すべての会話に影響する。

この違いを整理しないと、長くなった custom instructions が「なんとなく便利な社内メモ」になってしまう。個人設定、Project 指示、メモリ、社内ナレッジ、業務テンプレートの役割を分けることが、今回の更新を安全に使う前提である。

## 分析: 日本企業では個人設定と業務標準を分ける

ここからは分析である。

5,000 文字の custom instructions は、個人の働き方に合わせるには有用だ。たとえば「日本語では結論から書く」「出典が必要なときは明示する」「不明点は確認質問を先に出す」「社内向け文書は敬体で書く」「表は必要なときだけ使う」といった応答方針をまとめられる。開発者なら、普段使う言語、テスト方針、コード説明の好みも入れられる。

一方で、業務標準を個人の custom instructions に寄せすぎると危険である。営業提案のレビュー基準、契約確認の観点、障害報告テンプレート、採用面談の評価項目、個人情報の扱い、顧客ごとの禁止事項は、個人設定ではなく、会社が管理する文書、Project、承認済みテンプレート、または Skills のような配布物で扱うべきである。

理由は単純だ。個人設定は本人が編集でき、上司や管理者が常にレビューする前提ではない。異動や退職で引き継がれない。古い社内ルールが残っても気づきにくい。さらに、third-party plug-ins や connected apps と組み合わさると、指示欄に書いた社内事情が外部機能の文脈に混ざる可能性もある。

したがって、日本企業では custom instructions を「個人の応答設定」として扱い、業務標準は別の場所で管理するのが現実的だ。全社共通の AI 利用ガイドには、custom instructions に書いてよいもの、書いてはいけないもの、Project instructions に寄せるべきものを短く示すべきである。

## 実務: 5,000字化で更新すべき運用

まず、社内の ChatGPT 利用ガイドを更新する。これまで「カスタム指示は簡単な好みを書く場所」と説明していたなら、5,000 文字化により業務ルールを書き込みやすくなったことを踏まえ、利用範囲を明確にする。推奨するのは、応答形式、確認質問の出し方、出典の扱い、専門用語の説明レベル、禁止データの入力注意までである。

次に、禁止事項を具体化する。顧客名と契約条件、未公開の売上、個人情報、採用候補者情報、アクセスキー、社外秘の障害情報、規制対応の未承認方針を custom instructions に入れない。何度も使う業務情報ほど入れたくなるが、繰り返し使う情報は、むしろ権限管理された Project、社内文書、業務システムで扱うべきである。

第三に、Project instructions との分担表を作る。個人の文体や回答の好みは global custom instructions、案件固有の前提や成果物の形式は Project instructions、会社標準のレビュー観点は承認済みテンプレート、長期的な個人文脈は memory、共有ナレッジは Projects や社内ナレッジベースに置く。これは細かい分類に見えるが、後から検索、共有、削除、監査を考えると重要になる。

第四に、モデル選択やコスト管理とも合わせる。[ChatGPTモデル選択UI](/blog/openai-chatgpt-model-picker-reasoning-controls-2026/) で整理したように、ChatGPT は作業の重さに応じた推論設定へ寄っている。長い custom instructions は、軽い依頼にも常に前提として効く。指示を長くすれば必ず良い出力になるわけではなく、不要な制約が応答を硬くしたり、確認質問を増やしたりすることがある。

## 注意点: 長い指示は監査しにくくなる

5,000 文字化の最大のリスクは、指示が長くなりすぎることだ。人間が読まない社内規程をそのまま貼る、複数部署のルールを混ぜる、古い注意書きを削除しない、例外条件を追加し続ける。こうした使い方では、ChatGPT がどの前提で答えたのかを利用者自身も説明しにくくなる。

運用上は、custom instructions を短いセクションに分けるとよい。役割、回答形式、確認質問、出典、禁止事項、文体のように見出しを固定する。月次または四半期で見直し、古いルールを消す。部門ごとの業務標準を入れる場合は、個人欄ではなく Project instructions や承認済みテンプレートへ移す。

また、shared link viewers には custom instructions が共有されない一方、過去の会話には以前の指示の影響が残りうる。外部共有する会話、顧客に転記する文章、監査対象の判断メモでは、出力だけでなく「どの指示で作ったか」を確認する運用が必要になる。長い指示を使うほど、成果物レビューの重要性は上がる。

## まとめ

ChatGPT の custom instructions 上限拡大は、個人化を強める小さな便利機能ではなく、業務AIの前提をどこに置くかを問う更新である。5,000 文字あれば、利用者は ChatGPT にかなり多くの行動方針を渡せる。だからこそ、個人設定、Project instructions、memory、社内ナレッジ、業務標準を分けて管理する必要がある。

日本企業が今回見るべきポイントは、文字数が増えたこと自体ではない。長く書けるようになった指示を、誰がレビューし、何を書かず、どの業務文脈は Project に閉じ、どの標準は会社管理に戻すかである。ChatGPT を仕事の場として広げるほど、custom instructions は「便利な個人メモ」ではなく、業務AIの入口設定として扱うべきになる。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-07-15
- [ChatGPT Custom Instructions](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions) - OpenAI Help Center
- [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) - OpenAI Help Center
