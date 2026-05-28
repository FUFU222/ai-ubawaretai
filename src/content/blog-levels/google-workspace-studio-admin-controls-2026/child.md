---
article: 'google-workspace-studio-admin-controls-2026'
level: 'child'
---

Google Workspace Studio に、ステップとスターターを細かく管理するための設定が追加された。Google Workspace Updates の発表日は **2026年5月27日** で、展開は **2026年5月26日** から始まっている。

Workspace Studio は、Google Workspace の中で業務フローを作るための機能だ。メールをきっかけに通知する、会議後の情報を整理する、Chat に連絡する、AIで文章を作る、といった自動化を作れる。今回の更新は、その自動化で使える部品を管理者がより細かく止められるようにするものだ。

## 何が変わったのか

今回のポイントは、Workspace Studio の「スターター」と「ステップ」を管理しやすくなったことだ。スターターは、フローが始まるきっかけである。たとえばメールが届いた、会議の出力ができた、決まった時間になった、というような入口だ。ステップは、フローの中で実行する処理である。通知する、文書を作る、AIで要約する、別のサービスへつなぐ、といった部品だ。

Google の発表では、管理者が Workspace サービス別または個別のステップ、スターターを制御できると説明されている。つまり、「Workspace Studio を全員に使わせるか、全部止めるか」だけではなく、「この部署では Gmail 関連は許可するが、外部連携は止める」といった管理がしやすくなる。

初期状態にも注意が必要だ。発表では、Workspace Studio のスターターとステップは既定でオンになり、管理者がドメイン、組織部門、グループ単位で無効化できると説明されている。管理者が止めた部品は、ユーザー画面では使えない状態で表示され、既存フローで使われている場合はエラーになる。

## なぜ大事なのか

現場にとって、自動化は便利だ。定型メールを見て担当者へ知らせる、会議のメモからタスクを作る、問い合わせ内容をまとめる、社内Chatへ通知する。こうした作業は毎日発生するので、少し自動化できるだけでも効果が出る。

ただし、自動化は便利なだけではない。メール、Drive、Chat、Calendar、AI生成、外部サービス連携がつながると、どの情報がどこへ流れるかを管理する必要がある。特に日本企業では、部門ごとに扱う情報の重要度が違う。営業、人事、法務、開発、経理で同じルールにすると、ゆるすぎるか、厳しすぎるかのどちらかになりやすい。

[Workspace Intelligence の管理者制御](/blog/google-workspace-intelligence-admin-controls-2026/) でも見たように、Google Workspace のAI機能は、便利さと管理者設定をセットで考える必要がある。今回の Workspace Studio も同じだ。現場の自動化を止めるのではなく、使ってよい部品を分けることが大事になる。

## 最初に見るべき設定

まず見るべきなのは、どのスターターを許すかだ。メールをきっかけに動くフローは便利だが、顧客情報や個人情報を含むメールを扱うかもしれない。会議やファイルをきっかけに動くフローも、対象を広げすぎると管理しにくい。

次に、AI-powered steps をどの部門に許すかを決める。Gemini を使って要約や文章作成をするステップは便利だが、外部向け文面、契約、価格、障害連絡などは人間の確認が必要だ。[Gemini Chat の日本語Refine](/blog/google-chat-gemini-refine-japanese-2026/) と同じように、AIが整えた文章でも責任は人間に残る。

外部連携も重要だ。Workspace Studio から他のSaaSやカスタムステップを使えるなら、接続先の管理、認証情報、停止手順を決める必要がある。画面で簡単に作れても、会社のデータを外へ動かす責任まで軽くなるわけではない。

## 利用上限にも注意する

Workspace Studio Help では、作れるフロー数、1日に実行できる回数、Gmail starter を使う active flow 数、1つのフローに入れられるステップ数に制限があると説明している。上限に達すると、フローが止まったり、実行に失敗したりする。

これは業務で使うなら重要だ。便利だからといって大量にフローを作ると、必要なときに止まる可能性がある。重要なフローと試験用のフローを分け、誰が上限やエラーを見るかを決めておく必要がある。

[Connected Sheets の異常検知](/blog/google-connected-sheets-anomaly-detection-2026/) のように、Google Workspace には現場が直接使えるAI・分析機能が増えている。Workspace Studio は、それらより一歩進んで業務の動きを作る機能だ。だからこそ、管理者は利用量と失敗を見える状態にしておくべきだ。

## まとめ

Workspace Studio の新しい管理者制御は、AI自動化を全社で安全に広げるための更新だ。大事なのは、全部許すか全部止めるかではない。部門ごとに、使ってよいスターター、ステップ、AI機能、外部連携を分けることだ。

日本企業は、まず小さな部門で始め、危ない部品だけ止め、利用上限やエラーを監視しながら広げるのが現実的だ。Workspace Studio は便利な自動化ツールだが、業務を実際に動かす仕組みでもある。使い始める前に、管理線を決めておく価値がある。

## 出典

- [More granular admin controls for Workspace Studio steps and starters](https://workspaceupdates.googleblog.com/2026/05/more-granular-admin-controls-for-Workspace-Studio-steps-and-starters.html) - Google Workspace Updates, 2026-05-27
- [Get started: Workspace Studio set up guide for admins](https://knowledge.workspace.google.com/admin/studio/get-started-workspace-studio-set-up-guide-for-admins) - Google Workspace Help
- [Learn about Google Workspace Studio limits](https://support.google.com/workspace-studio/answer/16765942) - Workspace Studio Help
