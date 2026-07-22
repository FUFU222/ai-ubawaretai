---
title: 'OpenAI Presence、企業Agent運用の承認線'
description: 'OpenAI Presenceを顧客対応Agentの本番運用基盤として整理。日本企業が権限、承認、シミュレーション、guardrails、Codex改善をどう点検すべきか解説する。'
pubDate: '2026-07-23'
category: 'news'
tags: ['OpenAI', 'Codex', 'AIエージェント', '企業導入', 'ガバナンス', '管理者設定']
draft: false
series: 'openai-codex-enterprise-2026'
---

OpenAI は 2026年7月22日、企業が音声とチャットの AI Agent を本番運用するための製品として OpenAI Presence を発表した。単に新しいモデルを追加した話ではない。Presence は、顧客サポート、請求、保険請求、IT サービス依頼のような業務で、Agent がどのデータへ触れ、どの操作を実行し、どこで人間へ引き継ぐかを設計するための運用基盤として位置付けられている。

この発表は、以前整理した [OpenAI Codexの役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/) や [OpenAI Partner Network](/blog/openai-partner-network-enterprise-ai-2026/) と同じ流れにある。OpenAI はモデル提供だけではなく、業務の中で AI を動かす接続、承認、検証、改善のパッケージへ踏み込んでいる。Presence ではそこに、顧客対応や社内サービス窓口のような「間違えるとすぐ苦情や規制リスクになる」領域が加わった。

日本企業が見るべき焦点は、AI が一次応答を代替できるかどうかだけではない。むしろ、どの問い合わせを自動処理し、どの操作に承認を挟み、どの会話を監査し、変更案を誰が承認するかである。[ChatGPT SitesのBusiness統制](/blog/openai-chatgpt-sites-business-rbac-2026/) が共有物の公開範囲を問う更新だったとすれば、Presence は顧客や社員との会話そのものを業務システムへ接続する更新として読める。

## 事実: Presenceは本番Agent運用基盤として出た

OpenAI の公式発表によれば、Presence は企業向けの限定的な一般提供として始まった。セルフサービスで誰でもすぐ使える SaaS というより、OpenAI の Forward Deployed Engineers と選定されたパートナーが、企業ごとの業務、データ、ポリシーに合わせて導入を支援する形で提供される。

補助ソースの Help Net Security は、OpenAI が Presence を「スタンドアロンモデルではなく deployment platform」と説明している点を強調している。構成要素としては、policies and standard operating procedures、guardrails、approved actions、simulations、evaluation tools、Codex-powered improvement process が挙げられている。つまり、会話 AI の UI よりも、本番運用で事故を減らす管理面が主役だ。

Presence が対象にするのは、顧客向けと社内向けの両方だ。Reworked は、billing、claims、IT workflows のような例を挙げ、音声とチャットで動く enterprise agent product として紹介している。日本企業に置き換えるなら、コールセンター、保険・金融の事務、通信・SaaS の請求問い合わせ、社内ヘルプデスク、ITSM の一次受付が候補になる。

ただし、ここで注意すべき事実もある。Presence は現時点でセルフサービス製品ではない。導入は OpenAI やパートナー経由で進む。日本企業が明日から管理画面でオンにして使う製品ではなく、業務設計と検証を伴うエンタープライズ案件として見るべきだ。

## 事実: 承認とシミュレーションが中核になる

Presence の重要な構成要素は、Agent に「何をしてよいか」を細かく定義する点にある。業務ポリシー、SOP、approved actions によって、Agent が自律実行できる操作、人間承認が必要な操作、必ずエスカレーションする条件を分ける。これは従来の FAQ bot よりも重い設計である。

顧客サポートで考えると分かりやすい。住所変更の案内、契約状態の確認、パスワード再設定の誘導なら自動化しやすい。一方で、返金、契約解除、与信、保険金支払い、本人確認の例外処理、法務表現を含む説明は、Agent が文章を生成できても承認なしに実行させるべきではない。Presence が approved actions を持つ意味はここにある。

OpenAI は導入前に、よくある問い合わせ、例外ケース、リスクの高いシナリオで Agent をテストする設計を示している。Help Net Security の整理では、simulations と graders が、正しい結果に到達したか、ポリシーに従ったか、ツールを適切に使ったか、必要な時点でエスカレーションしたかを評価する。これは「良い応答」を人間が主観で見るだけではなく、業務ルールに対して Agent を検査する考え方だ。

日本企業では、この検査設計が特に重要になる。個人情報保護法、金融・保険・医療の業法、消費者契約、社内規程、委託先との責任分界が絡むからだ。Presence を導入するなら、AI 推進部門だけでシナリオを作るのではなく、業務オーナー、CS、法務、セキュリティ、監査、情シスがそれぞれ失敗例を出す必要がある。

## 事実: Codex-powered improvementは変更管理の話である

Presence のもう一つの焦点は、稼働後の改善ループだ。OpenAI は、本番の会話、エスカレーション、失敗シグナルを見て、Codex が Agent の挙動改善を提案し、チームがテストして承認できる流れを示している。ここでの Codex は、コードを書くツールというより、運用データから設定や処理の改善案を作る作業 Agent として使われる。

この点は [Codex Code ReviewのAGENTS.md規約](/blog/openai-codex-code-review-rules-agents-md-2026/) と似ている。人間が明示したルールを Agent が読み、変更案を作り、レビューを経て反映する。Presence の場合、その対象がリポジトリではなく、顧客対応 Agent の会話設計、SOP、ツール利用、エスカレーション条件になる。

Reworked は、Codex が production signals を調査し、ライブ版に対してテストできる更新を提案する点を機能表で整理している。これは便利な一方で、変更管理の責任を重くする。Agent が「改善案」を出しても、それを本番へ入れるかどうかは人間が判断しなければならない。問い合わせの成功率が上がる案でも、法務表現や顧客説明が変わるなら、単なるプロンプト修正では済まない。

OpenAI は、Presence が自社の英語電話サポートで 75% の inbound issues を人間なしで解決しているとも説明している。これは有力な実績だが、日本語対応、業界別規制、企業ごとのデータ品質まで同じ結果になるとは限らない。日本企業はこの数字を導入効果の保証として読むのではなく、検証時の比較指標として扱うべきだ。

## 分析: 日本企業ではコンタクトセンターと情シスから試す

ここからは分析だ。

Presence の実務価値は、AI チャットボットの置き換えではなく、運用可能な Agent の制御面をまとめている点にある。日本企業で最初に検討しやすいのは、外部顧客向けなら問い合わせ種別が明確なコンタクトセンター、社内向けなら IT ヘルプデスクや総務・人事の定型依頼である。

最初の対象は「高頻度だが判断の余地が小さい」業務がよい。アカウント状態の確認、請求書再送、FAQ の案内、既知障害の説明、社内端末の申請状況確認、SaaS アカウント発行の一次受付などだ。これらは効果測定しやすく、失敗時にも人間へ戻しやすい。一方で、返金判断、契約変更、与信、解約抑止、個別法務回答、医療助言のような領域は、最初から Agent の自律実行に置くべきではない。

二つ目の論点は、データ接続の範囲である。Presence は company systems へ接続する前提の製品だが、Agent に CRM、請求、ID 管理、ナレッジベース、通話履歴、チケット管理をまとめて渡せば便利になる反面、事故時の影響も大きくなる。日本企業はシステム単位ではなく、データ分類単位で読み取りと書き込みを分ける必要がある。

三つ目は、承認ログである。Agent が答えた、ツールを実行した、人間へ渡した、Codex が改善案を出した、人間が承認した、という各イベントを残せなければ、本番運用の説明責任は弱い。特に金融、医療、通信、公共、BPO のように問い合わせ履歴が監査対象になる業界では、AI の会話品質だけでなく、変更履歴と承認者が重要になる。

## 導入前のチェックリスト

第一に、Agent が扱う問い合わせを三段階に分ける。自動回答のみ、自動実行可能、人間承認必須である。最初から全問い合わせを対象にせず、失敗時の影響が小さく、ログで検証できる業務から始める。

第二に、approved actions を業務オーナーが定義する。情シスや AI 推進だけで決めると、現場の例外処理や顧客説明の責任が抜けやすい。返金、契約変更、本人確認、外部送信、データ更新は、承認者と禁止条件を明記する。

第三に、シミュレーションの失敗例を先に作る。通常ケースだけでなく、怒っている顧客、本人確認が曖昧な顧客、規約外の要求、個人情報を含む会話、競合製品との比較、社内規程にない依頼をテストに入れる。Agent が丁寧に答えても、やってはいけない操作をすれば不合格にする。

第四に、Codex-powered improvement の承認手順を決める。改善案を誰が読み、どのテストを通し、どの時間帯に反映し、失敗時にどう戻すかを決める。Prompt や SOP の変更も、業務アプリの設定変更と同じく変更管理の対象にする。

第五に、KPI を自動解決率だけにしない。人間への適切な引き継ぎ率、誤回答率、再問い合わせ率、処理時間、顧客満足、オペレーターの修正負荷、監査指摘、承認待ち時間を一緒に見る。自動化率だけを追うと、Agent が本来人間へ渡すべき案件まで抱え込む危険がある。

## まとめ

OpenAI Presence は、企業向け AI Agent を本番で動かすための承認、検証、改善の基盤として見るべき発表である。新しいモデルの性能競争ではなく、業務システム、ポリシー、guardrails、シミュレーション、人間承認、Codex による改善提案を一つの運用ループにまとめる試みだ。

日本企業にとって重要なのは、Presence を「コールセンターを置き換えるAI」として急ぐことではない。まずは対象業務を狭く切り、Agent ができること、してはいけないこと、人間が承認すること、改善案を本番反映する条件を決めることだ。Presence の価値は、自動応答の派手さではなく、AI Agent を業務責任の中へ入れるための承認線を作れるかにかかっている。

## 出典

- [Introducing OpenAI Presence](https://openai.com/index/introducing-openai-presence/) - OpenAI, 2026-07-22
- [OpenAI Presence connects AI agents to enterprise data with built-in guardrails](https://www.helpnetsecurity.com/2026/07/22/openai-presence-ai-agent-platform/) - Help Net Security, 2026-07-22
- [OpenAI Presence Pitches 'Trusted' AI Agents to Enterprises](https://www.reworked.co/digital-workplace/openai-presence-pitches-trusted-ai-agents-to-enterprises-a-day-after-owning-the-hugging-face-hack/) - Reworked, 2026-07-22
