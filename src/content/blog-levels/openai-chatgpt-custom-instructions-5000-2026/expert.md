---
article: 'openai-chatgpt-custom-instructions-5000-2026'
level: 'expert'
---

OpenAI の custom instructions 上限拡大は、表面的には入力欄の文字数変更である。しかし企業利用の観点では、ChatGPT に渡す persistent context の設計変更として読むべきだ。Plus、Pro、Enterprise、Business、Education では 5,000 文字まで保存できるようになり、Free と Go は 1,500 文字にとどまる。これにより、利用者は単なる文体の好みを超えて、判断基準、禁止事項、出典方針、業務手順の断片まで常時指示へ入れられる。

この変更は、ChatGPT が作業環境化している流れと重なる。[ChatGPT横断検索、Projects文書再利用の統制実務](/blog/openai-chatgpt-unified-search-project-files-2026/) では、過去チャット、Projects、画像、文書を探し直せるようになったことを扱った。[ChatGPT業務AI課金開始、ExcelとAgent費用管理](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) では、Workspace Agents や Excel/Sheets task が credits 消費を伴う業務実行面へ入ったことを整理した。[ChatGPTメモリ刷新、企業が個人化AIを管理する要点](/blog/openai-chatgpt-dreaming-memory-controls-2026/) では、個人化と長期文脈の管理を見た。custom instructions は、これらの機能が動く前に毎回効きうる初期条件である。

## 事実: Custom instructions の適用範囲

OpenAI の Custom Instructions FAQ は、custom instructions を、ChatGPT の応答時に考慮してほしい内容を共有する機能として説明している。指示は Web、Desktop、iOS、Android の全プランで利用でき、保存内容はすべてのチャットに即時適用される。利用者は将来の会話に向けて編集または削除できるが、過去の会話にすでに現れた以前の指示を消すには、会話履歴側の扱いも考えなければならない。

7月15日の Release Notes で変わったのは、この保存容量である。Plus、Pro、Enterprise、Business、Education は 5,000 文字、Free と Go は FAQ 上 1,500 文字である。ここで重要なのは、5,000 文字が「長いプロンプトを毎回貼らなくてよい」という利便性を生む一方で、「長い前提が常に効く」状態も作る点だ。

また、FAQ は third-party plug-ins 利用時の注意も示している。モデルが custom instructions の関連情報をプラグイン開発者へ提供する可能性があるため、信頼できるプラグインだけを使い、渡したくない情報は指示に入れないよう求めている。これは、custom instructions がローカルな好み設定に見えても、外部機能と接続した会話ではデータ境界に関わることを意味する。

API との境界も明確にしたい。FAQ は、ChatGPT UI の custom instructions に対応する API はなく、Chat Completions API では system message を使うと説明している。したがって、社内アプリ、業務エージェント、顧客向けチャットボットで同じ方針を適用する場合、ChatGPT の個人設定ではなく、アプリケーション側の system prompt、policy engine、template versioning として管理する必要がある。

## Projects、memory、custom instructions の責務分離

Projects の Help Center は、Projects を長期作業のためのワークスペースとして説明している。チャット、アップロードファイル、project instructions をまとめ、Project 内で ChatGPT が文脈を保ちやすくする。さらに Project settings で設定する project instructions は、その Project 内だけに効き、global custom instructions を上書きする。

この仕様は、責務分離の手がかりになる。global custom instructions は、利用者横断の応答方針、文体、確認質問、出典の基本姿勢に向いている。Project instructions は、案件、顧客、調査、プロダクト、採用、法務レビューのような局所文脈に向いている。Memory は、利用者や Project の過去文脈を参照する層である。社内ナレッジや正式な業務標準は、さらに外側の文書管理、ナレッジベース、承認済みテンプレートに置くべきだ。

この分離がないと、5,000 文字の custom instructions はすぐに肥大化する。個人の文体設定、部門ルール、顧客別注意、プロジェクト固有の前提、禁止事項、過去の反省、社内用語集が一つの欄に混ざる。結果として、利用者は「ChatGPT がなぜその回答をしたか」を説明しにくくなる。

共有 Projects ではさらに注意が必要だ。Projects の説明では、共有 Project では project-only memory が自動で有効になり、参加者個人の Project 外の文脈やメモリにはアクセスしない。これは、共同作業の文脈を Project 内に閉じる設計である。一方、global custom instructions は個人の広い設定として残る。共有 Project で成果物を作る場合、個人 custom instructions の影響と Project instructions の上書き関係を利用者に説明しておく必要がある。

## 日本企業のリスク: 個人欄が業務標準になる

日本企業で起きやすいのは、現場の工夫が個人 custom instructions に集まることだ。営業担当が提案書の型を入れる。法務担当が契約レビューの観点を入れる。開発者がコードレビュー基準を入れる。人事担当が面接評価の注意点を入れる。一見すると生産性が上がるが、会社として見ると、標準作業が個人欄に分散する。

これは統制上の弱点になる。個人欄は、誰が承認したか、いつ更新したか、どの部署に適用してよいか、退職後にどう扱うかが見えにくい。さらに、利用者が誤って古い規程や顧客別条件を入れても、周囲が気づきにくい。標準化したい業務ほど、個人欄ではなく、管理された Project template、社内テンプレート、approved Skill、業務システム側の prompt policy に置くべきである。

この点は [ChatGPTモデル選択UI、社内推論設定をどう教えるか](/blog/openai-chatgpt-model-picker-reasoning-controls-2026/) の教育問題とも似ている。モデル選択を個人の好みに任せすぎると、重要業務での推論強度やコスト管理がばらつく。同じように、custom instructions を個人の工夫だけに任せると、業務品質、データ保護、レビュー基準がばらつく。企業利用では、個人最適と組織標準を分ける設計が必要だ。

## ガバナンス設計: 許可リストと禁止リストを分ける

まず作るべきは、custom instructions に書いてよい情報の許可リストである。回答の長さ、敬体か常体か、表や箇条書きの好み、確認質問の出し方、出典を求める場面、専門用語の説明レベル、利用者の一般的な役割、頻出する公開済み技術スタックなどは比較的扱いやすい。

次に禁止リストを明示する。顧客名と個別契約条件、未公開財務、採用候補者や社員の個人情報、医療・労務・評価情報、認証情報、アクセスキー、セキュリティインシデントの詳細、未公開ロードマップ、規制対応の未承認方針は入れない。繰り返し使うからこそ入れたくなる情報ほど、権限管理された場所へ寄せるべきである。

第三に、置き場所の判断表を用意する。個人の回答好みは global custom instructions。案件固有の前提は Project instructions。共有する資料や決定メモは Project sources。会社標準の業務手順は承認済みテンプレートまたは Skills。長期的な個人文脈は memory。正式な台帳や証跡は CRM、DMS、チケット、SIEM、監査ログ。このように分類すると、5,000 文字化を無秩序な詰め込みではなく、情報設計のきっかけにできる。

第四に、レビュー周期を決める。custom instructions は一度書くと放置されやすい。四半期に一度、長すぎる指示、古い社内ルール、機密情報、重複した禁止事項、Project に移すべき案件文脈を見直す。管理者が全員分を読む運用は現実的でないとしても、自己点検チェックリストは配布できる。

## 実装上の注意: 長い指示は品質を下げることもある

5,000 文字まで書けるからといって、長いほどよいわけではない。長い指示は、モデルに不要な制約を与え、回答を硬くし、確認質問を増やし、文脈の優先順位を曖昧にすることがある。複数の条件が矛盾していれば、出力の揺れも増える。

実務では、custom instructions を短い見出しで分けるとよい。`役割`、`回答形式`、`確認質問`、`出典`、`禁止事項`、`文体`、`仕事でよく使う公開情報` のような構造にする。各セクションは数行に抑え、業務固有の長いルールは Project instructions や別文書へ逃がす。

また、出力レビュー時には、custom instructions の影響を意識する。顧客向け提案、法務文書、採用文面、セキュリティ判断、経営資料では、ChatGPT がどの指示に従ったかを確認する。特に、過去の会話で以前の指示が文章に現れている場合、現在の指示を削除しても過去成果物から自動で消えるわけではない。

## 導入チェックリスト

日本企業が今回すぐ確認するなら、最初に社内ガイドの文言を変える。「カスタム指示には好みを書けます」だけでは足りない。5,000 文字化により業務手順を入れられるようになったため、書いてよい情報、書かない情報、Project に寄せる情報を区別する。

次に、部門ごとの代表例を作る。営業なら、顧客名を入れずに提案文のトーンだけを指定する例。開発なら、未公開コードや secret を入れず、テスト観点だけを書く例。法務なら、契約条項そのものではなく、確認観点の一般形を書く例。人事なら、候補者情報ではなく面接メモの要約形式だけを書く例である。

三つ目に、Project template を整備する。案件固有の前提を global custom instructions へ逃がさないためには、Project 側に置ける器が必要になる。営業提案 Project、月次レポート Project、採用 Project、仕様検討 Project のように、Project instructions と sources の標準を用意すれば、個人欄への詰め込みを減らせる。

四つ目に、管理者設定と教育をつなげる。Enterprise / Business では、Projects、memory、apps、plugins、Workspace Agents、data residency、retention が別々の設定に見える。しかし利用者から見ると、すべて ChatGPT の中の作業である。custom instructions の教育は、これらの機能の入口として扱うべきだ。

## まとめ

OpenAI の custom instructions 5,000 文字化は、ChatGPT の個人化を進める更新である。同時に、企業利用では persistent context の管理問題を広げる更新でもある。長く書けるようになったことで、業務ルールを入れやすくなり、同時に機密情報や古い標準も残りやすくなる。

日本企業が採るべき方針は明確だ。個人の応答好みは custom instructions、案件文脈は Projects、会社標準は承認済みテンプレートや Skills、正式な記録は業務システムに置く。5,000 文字の枠を埋めることが目的ではない。ChatGPT に渡す前提を、誰が管理し、どこで共有し、いつ見直すかを決めることが目的である。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-07-15
- [ChatGPT Custom Instructions](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions) - OpenAI Help Center
- [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) - OpenAI Help Center
