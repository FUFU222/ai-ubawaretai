---
article: 'salesforce-slack-ai-work-platform-2026'
level: 'expert'
---

Salesforce が **2026年4月29日** に打ち出した「Slack is the AI Work Platform for Every Salesforce Customer, Ready on Day One」は、CRM 連携の販促文として読むと見誤る。今回の本質は、**Salesforce 顧客にとっての標準的な仕事面を Slack に寄せ、その上で Slackbot と AI workflow を使って実行面まで握ろうとしている** ことにある。

生成 AI の企業導入では、モデルの性能差よりも「どこで仕事が始まり、誰が見て、どこで承認し、どこに記録が残るか」の方が導入速度を左右する。営業、カスタマーサクセス、プリセールス、マネージャー、RevOps の日常は、CRM 画面だけで完結しない。会議準備、相談、ドラフト、引き継ぎ、顧客対応方針のすり合わせ、週次レビューのほうが圧倒的に多い。Salesforce が今回狙っているのは、まさにその部分だ。

以下では、一次ソースで確認できる事実と、日本企業が実際にどう読むべきかを分けて整理する。

## 事実: Salesforce は「新規顧客の最初の状態」に Slack を組み込んだ

Salesforce 公式ブログのいちばん大きいメッセージは、**新しい Salesforce instance が作られると free-tier の Slack workspace も作られ、CRM data に自動接続される** という点だ。記事本文では「starting this summer」と書かれ、pricing and availability では **2026年5月15日から new Salesforce customers 向けに free Slack workspaces が automatically created** と、より具体的な時期が示されている。

これはかなり意味が大きい。従来、Slack は多くの企業ですでに使われていても、Salesforce との連携は追加設定、権限調整、導入判断の別タスクになりやすかった。AI 機能まで含めると、さらに「まず CRM を入れる」「次に Slack をつなぐ」「次に Slack AI や Agentforce を検討する」という段階的な流れになりやすい。今回 Salesforce は、その段取り自体を短縮しようとしている。

ブログの言い方を借りれば、Slack は **CRM、people、agents を day one でまとめる場** として位置付け直されている。つまり、Salesforce は CRM を「記録の場所」として残しつつ、日中の仕事面を Slack に寄せる構えだ。

## 事実: Slackbot Skills は「いいプロンプト共有」ではなく「業務フロー共有」である

Slack blog の 4 月 feature drop で中核に置かれているのは **Slackbot Skills** だ。Slack はこれを、team の best workflows を **repeatable, shareable, ready-to-run actions** にする仕組みとして説明している。ここで重要なのは、単なる prompt template ではなく、**実行を伴う multi-step workflow** として表現している点である。

Slack が例示している skill は実務そのものだ。Daily Priorities は Slack activity、calendar、Salesforce data を見て優先順位を出す。Meeting Prep は予定前に関連会話、files、decisions を集める。Research Synthesis は topic や channel、files から brief を作る。Incident Management は incident channel 履歴から after-action review を生成する。Project Kickoff は brief から channel、canvas、milestone tracker、suggested automations を起こす。

この並びを見ると、Slackbot Skills は「人が聞いたら答える AI」ではなく、**現場の標準作業手順を半自動化する入れ物** であることが分かる。営業で言えば account research、deal summary、会議準備、次アクション整理。CS で言えば case escalation snapshot や顧客向け update の草案。マネージャーで言えば weekly update や進捗レビューの下地。こうした業務はどの企業にもあるが、やり方は属人化しやすい。Slack はそれを AI skill として共有可能な形へ押し込もうとしている。

## 事実: Slackbot は Slack の外にも手を伸ばし、実行面を増やした

同じ feature drop では、Slackbot の実行範囲も広がっている。

1つ目は **Scheduled Automations**。Slackbot から recurring tasks を定期実行できる。

2つ目は **Slack Actions**。DM 送信、channel 作成、メンバー招待、workflow 起動まで、Slack 内アクションを代行できる。

3つ目は **Email and Calendar Actions**。Slack blog では、Google Workspace と Microsoft 365 に対して、メール下書きや calendar event 作成を Slackbot が直接行えると説明している。

4つ目は **In-Slack Awareness**。Salesforce record、List、channel など、Slack 上で開いているものを自動文脈として拾うという説明だ。

この構造の意味は大きい。Slack が狙っているのは、ユーザーが毎回「今どの案件を見ているか」「どの顧客のことか」「何をしたいか」を説明しなくても、**その場の業務文脈を拾って次の実行につなぐこと** である。人間が Slack をチャットツールとして使うだけなら不要な機能だが、AI 実行面にするには必須になる。

## 事実: Workflow Builder に AI がネイティブで入り、AI を「会話」から「自動化」へ広げた

Slack blog のもう一つの重要点は、Workflow Builder に入った **Generate AI Response step** だ。Slack は、channels、canvases、lists を knowledge sources にしながら、thread summary、translation、reply drafting などを workflow の一部として埋め込めると説明している。提供は **2026年4月21日から30日** にかけて、対象は **Business+ v2 と Enterprise+**。

これにより、Slack AI はユーザーがその場で呼ぶ助手から、**定型運用の中で裏側に組み込まれる部品** に変わる。たとえば、

- エスカレーション発生時に channel 履歴をまとめる
- 週次会議前に顧客別の update を集める
- 案件レビュー依頼の thread から下書き回答を作る
- 多言語のやりとりを翻訳付きで整理する

といった処理が、手動チャットではなく workflow として動かせる。これは、日本企業の運用ではかなり大きい。なぜなら、導入担当者が求めるのは「社員全員が毎回うまくプロンプトを書くこと」ではなく、**繰り返し業務を一定品質で回すこと** だからだ。

以前取り上げた[GitHub Copilot SDKがpublic previewへ。AIエージェントを社内ツールへ埋め込む競争が始まった](/blog/github-copilot-sdk-public-preview-2026/)は、AI を社内ツールへ埋め込む話だった。Slack の今回の更新は、同じ変化が「会話と業務自動化の面」で進んでいる例と読める。

## 事実: 価格と機能開放は細かく分かれ、統制前提の設計になっている

Slack Help の pricing 更新を読むと、今回の世界観はかなり明確だ。AI 機能は一律ではない。

- **Conversation and thread summaries / Huddle notes** は paid subscriptions 全体
- **Search / Recaps / Translations / File summaries / Workflow automation** は Business+ と Enterprise+
- **Enterprise search** は Enterprise+

という形で分かれている。さらに Salesforce features についても、

- Search, view, edit Salesforce records in Slack
- Record previews

は全プランで使える一方、

- Salesforce automations in Workflow Builder
- Salesforce list views
- Sales Home

は Business+ / Enterprise+ に寄る。

加えて、owners と admins は **AI features ごとに access を制御できる**。Enterprise では、誰にも使わせない、特定グループだけ、特定グループを除く全員、全員、まで選べる。Slack は同じ Help 記事で、**Slack does not train generative AI models on Customer Data** と説明している。

この組み合わせは、「まず広く触らせて後から統制する」よりも、「最初から統制付きで広げる」設計だ。以前書いた[Microsoft「Agent 365」とは？ 5月1日GA前に日本企業が確認すべき統制ポイント](/blog/microsoft-agent-365-enterprise-governance-2026-04-28/)が示した `Observe / Govern / Secure` と同じく、**企業向け AI は実行機能と権限制御がセットでないと広げられない** という前提が、Slack 側にもかなり濃く出ている。

## 事実: Salesforce 連携は閲覧補助から、Slack 側での更新・自動化へ向かっている

Salesforce ブログの pricing and availability では、**Slackbot Salesforce actions** が 5 月中旬から対象プランに向けて提供されると書かれている。さらに Slack blog の roadmap preview には、**Create and Update Salesforce Records with Slackbot** が 2026 年 5 月〜6 月の general availability を目標とする項目として並ぶ。

この先の roadmap は確定提供とは分けて読む必要があるが、方向性は明確だ。Slack 上で record を見られるだけでなく、**Slackbot conversation から Salesforce records を作成・更新し、将来的には Agentforce や third-party agents と orchestration する** ところまで視野に入れている。

ここまで来ると、Slack は CRM にぶら下がる chat app ではない。むしろ **CRM の前で仕事を回す command surface** に近い。顧客情報の一次保管は Salesforce に置きつつ、現場の動きは Slack 側で発火させる。この役割分担は、日本の現場でも受け入れられやすい。なぜなら、多くの営業組織では「CRM が真実の記録」「Slack が実際の連携」という分業がすでにあるからだ。

## 考察: 日本市場では、AI の価値は営業日報より「案件前後の摩擦削減」に出やすい

ここからは考察だ。

日本企業で Salesforce と Slack を使っている組織は少なくないが、日々の摩擦は大抵、レコード入力そのものよりも **案件前後の非同期調整** に出る。会議前に誰が何を知っているか確認する。会議後に next step を整理する。CS が営業から経緯を聞き直す。マネージャーが週次レビューで状況を集める。こうした作業は、CRM のフォームより Slack の thread や DM に散らばりやすい。

Slackbot Skills と Slackbot Actions が効くのは、まさにそこだ。meeting prep、deal summary、weekly update、research synthesis のような用途は、**案件情報を再入力せず、散らばった文脈を業務に再構成する** ことに強い。日本の営業現場では、AI がいきなり提案書を完璧に書くことより、**会議前の情報整理と会議後の次アクション整理を毎回速くする** ほうが価値として立ちやすい。

## 考察: 成功する導入は「全部入り」ではなく skill 単位の標準化から始まる

もう一つ、日本企業で実務的なのは導入の刻み方だ。今回の発表を見て、Slack 上に AI 機能が大量に並んだこと自体に目が行きやすい。しかし現場でまずやるべきことは、機能一覧を追うことではない。**どの業務を skill と workflow に切り出すか** を決めることだ。

たとえば最初の対象としては、

- 案件レビュー前の account research
- 週次パイプライン会議の summary
- 顧客ミーティング前の prep note
- エスカレーション案件の snapshot 作成
- 週報やステータス更新の下書き

あたりが妥当だろう。これらは頻度が高く、品質ばらつきが大きく、Salesforce と Slack の両方に文脈があるからだ。逆に、全社標準の業務フローや厳格な監査が絡む処理を最初から全部 AI 化すると、権限設計や期待値調整で詰まりやすい。

この点で、今回の Slack / Salesforce は良い意味で現実的である。free-tier workspace で入口を作りつつ、advanced AI と deeper Salesforce features は Business+ / Enterprise+ に置き、admin が feature ごとに access を制御できる。つまり、**小さく試しつつ、うまくいったところだけ広げる設計** だ。

## 考察: 競争相手は Teams だけではなく、業務実行面を握ろうとする全ての AI 製品である

この発表を Slack vs Teams だけで読むのは狭い。競争相手は、ローカル常駐型の[AWSがAmazon Quickをデスクトップ化。日本企業は「常駐AIアシスタント」をどう試すべきか](/blog/amazon-quick-desktop-free-plus-2026/)のような製品でもあるし、統制面を強めた Microsoft、コーディング面を広げる GitHub、業務変革パートナーを押さえる Anthropic / NEC のような動きでもある。

各社が共通して狙っているのは、「AI がどれだけ賢いか」より、**社員が日中いる場所で、どこまで作業を先回りして実行できるか** だ。Salesforce が Slack を new customer の初期状態に近づけたのは、その競争を正面から取りにきた動きとして読める。

## まとめ

Salesforce と Slack の 2026年4月29日更新は、CRM 連携強化というより、**Slack を営業・CS・マネジメントの AI work platform にする布石** である。新規顧客への free Slack workspace 自動作成、Slackbot Skills、scheduled automations、Slack Actions、email / calendar actions、Workflow Builder の AI 応答、admin による feature access 制御。この一連の組み合わせが意味するのは、Slack が「話す場所」から「仕事を実行する場所」へ寄ってきたことだ。

日本企業にとっての次の一手は明確だ。全社導入の議論より先に、Salesforce と Slack の両方にまたがる **反復業務を 2〜3 個選び、skill 化と権限設計を小さく試す** べきである。そこで会議準備時間、案件レビューの待ち時間、更新漏れ、週報作成時間が縮めば、AI の価値は要約精度ではなく、**顧客対応の流れそのものを速くすること** だと見えてくる。

## 出典

- [Slack is the AI Work Platform for Every Salesforce Customer, Ready on Day One](https://www.salesforce.com/blog/connect-slack-to-salesforce/) - Salesforce, 2026-04-29
- [Slack Feature Drop: A Downpour of “Done”](https://slack.com/blog/news/slack-feature-drop-april2026) - Slack, 2026-04-29
- [Updates to feature availability and pricing for Slack subscriptions](https://slack.com/help/articles/39264531104275-Updates-to-feature-availability-and-pricing-for-Slack-plans) - Slack Help
