---
article: 'openai-presence-enterprise-agent-governance-2026'
level: 'expert'
---

OpenAI Presence は、企業向け Agent 導入を「モデル選定」から「本番運用の変更管理」へ移す発表として読むべきだ。公式発表は Presence を、音声とチャットで顧客対応や社内サービス依頼を処理する enterprise agent の基盤として位置付けている。補助ソースでは、OpenAI が Presence を standalone model ではなく deployment platform と説明している点が確認できる。

既存の OpenAI 系記事で整理してきた [Codexの役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/) は、業務別にツール接続と作業面をまとめる方向だった。[OpenAI Partner Network](/blog/openai-partner-network-enterprise-ai-2026/) は、その導入を外部パートナー経由で広げる戦略だった。Presence はその延長で、コンタクトセンター、請求、ITSM、保険請求のような運用リスクの高い業務に、Agent をどう入れるかを扱う。

さらに [Codex Code ReviewのAGENTS.md規約](/blog/openai-codex-code-review-rules-agents-md-2026/) と同じく、明文化したルールを AI が読み、変更案を作り、人間が承認する構図がある。Presence では、リポジトリ規約ではなく、顧客対応 SOP、approved actions、guardrails、simulation、grader、production signal が対象になる。

## アーキテクチャ観点: Agentの権限境界を三層に分ける

Presence を検討する場合、最初に分けるべき境界は、knowledge access、tool execution、policy override の三層である。

knowledge access は、Agent が回答に使う知識と顧客データの範囲を指す。FAQ、製品マニュアル、契約プラン、障害情報、過去チケット、CRM 属性、請求状態、本人確認情報などが候補になる。ここで重要なのは、システム単位の接続許可だけでは粗すぎることだ。CRM を読めるかどうかではなく、どのフィールドを読み、どの顧客セグメントへ出し分け、会話ログへ何を残すかを決める必要がある。

tool execution は、Agent が外部システムへ操作を実行する層である。請求書再送、住所変更、チケット作成、担当者アサイン、パスワードリセット、返金申請、契約変更のような操作がここに入る。Presence の approved actions は、この層の制御として読むのが自然だ。読み取りだけの Agent と、業務システムへ書き込む Agent では、監査と承認の水準がまったく違う。

policy override は、通常ルールから外れる場面の扱いである。本人確認が不十分だが緊急性がある、顧客が法的主張をしている、社内規程にない例外対応を求めている、過去のサポート履歴と契約情報が矛盾している、といったケースだ。ここは AI の回答品質ではなく、必ず人間へ渡す条件として設計するべきである。

## 評価観点: simulationは「正答率」だけでは足りない

Presence が示す simulations と graders は、エンタープライズ Agent の評価を作り直す入口になる。通常のチャットボット評価では、FAQ に合う回答をしたか、ユーザー満足度が上がったかを見がちだ。しかし本番 Agent では、正しい回答でも、許可されていないデータを参照したり、承認なしで操作したり、エスカレーションすべき会話を抱え込んだりすれば不合格になる。

日本企業が simulation set を作るなら、少なくとも五つのカテゴリを用意したい。第一に通常問い合わせ、第二に本人確認が曖昧な問い合わせ、第三にポリシー違反を誘う問い合わせ、第四に顧客が怒っているまたは法的主張を含む問い合わせ、第五に社内データが矛盾している問い合わせである。

grader も、応答文の自然さだけでは不十分だ。正しいツールを使ったか、不要なデータを開かなかったか、操作前に承認を取ったか、禁止表現を避けたか、必要な時点で人間へ渡したか、処理結果を監査ログへ残したかを評価対象にする。これは AI 品質評価というより、業務統制のテストに近い。

ここで [ChatGPT SitesのBusiness統制](/blog/openai-chatgpt-sites-business-rbac-2026/) と共通する論点が出る。AI の出力が社内に留まらず、顧客や社員へ直接届くなら、生成品質よりも公開・実行の権限境界が重要になる。Presence の場合、その境界は文章だけでなく、業務操作に及ぶ。

## 運用観点: Codex-powered improvementは変更管理台帳が必要

Presence で最も見落としやすいのは、Codex-powered improvement を「自動改善」と誤解することだ。OpenAI の説明では、Codex が本番セッションやエスカレーションから改善案を出し、チームがテストして承認できる。これは強力だが、管理上は prompt、policy、SOP、tool routing、grader の変更が継続的に発生することを意味する。

したがって、Presence 導入時には変更管理台帳が必要になる。変更案の発生理由、対象 workflow、参照した production signal、変更前後の policy、simulation 結果、承認者、反映日時、ロールバック条件を残す。通常のシステム変更と同じ厳密さをすべての prompt に要求する必要はないが、顧客対応や請求・契約に関わる変更は監査可能にしておくべきだ。

特に日本の大企業や規制産業では、AI Agent が発話した内容の説明責任だけでなく、その発話ルールがいつ誰によって変わったのかも問われる。Codex が改善案を出したこと自体は責任主体にならない。最終的に誰が承認したか、承認前にどの失敗ケースを通したかが重要になる。

## 導入設計: 最初の90日は範囲を絞る

Presence 型の Agent を日本企業が試すなら、最初の 90 日は対象業務を狭くするべきだ。外部顧客向けなら、問い合わせカテゴリを三つ程度に絞る。たとえば請求書再送、既知障害の案内、契約プランの確認である。社内向けなら、IT ヘルプデスクの一次受付、SaaS アカウント申請、端末交換のステータス確認が扱いやすい。

この段階で見る KPI は、自動解決率だけでは足りない。適切な人間引き継ぎ率、誤回答率、再問い合わせ率、平均処理時間、承認待ち時間、オペレーターの修正負荷、禁止操作のブロック率、simulation での回帰失敗数を併せて見る。OpenAI が示した 75% の inbound issues 自動解決は有力な参考値だが、日本語、業務規程、顧客属性、既存データ品質が違えば、そのまま目標値にはならない。

データ接続も段階化する。第一段階はナレッジベースとチケット作成だけ、第二段階で顧客属性の限定読み取り、第三段階で承認付きの業務操作、という順序が現実的だ。最初から CRM、請求、ID 管理、契約管理を広く書き込み可能にすると、simulation で拾えない例外が本番で出たときの影響が大きい。

## 調達観点: セルフサービスではなく導入支援込みで見る

Presence は限定 GA で、OpenAI の Forward Deployed Engineers と選定パートナーが支援する形だと報じられている。これは調達上も重要である。単価やライセンスだけで比較するのではなく、業務分析、シナリオ作成、データ接続、simulation、監査ログ、改善ループ、運用教育まで含めたプロジェクトとして見積もる必要がある。

日本企業の場合、既存のコンタクトセンター BPO、CRM ベンダー、SIer、法務・監査部門との責任分界も関係する。Presence が Agent の中核になっても、顧客対応の最終責任が OpenAI に移るわけではない。委託先が一次対応を担う場合、Agent の発話、エスカレーション、改善承認を誰の運用手順に入れるかを契約で明確にする必要がある。

## まとめ

OpenAI Presence は、企業 Agent を「賢い会話 UI」から「承認・検証・改善される業務システム」へ近づける発表だ。policy、SOP、approved actions、guardrails、simulation、grader、Codex-powered improvement は、すべて本番運用で事故を減らすための部品である。

日本企業が注目すべきなのは、Presence が何パーセントの問い合わせを自動化できるかではない。どのデータへ触れ、どの操作を実行し、どこで人間へ渡し、どの変更を誰が承認するかを、既存の業務責任に接続できるかである。Presence を試すなら、最初の成功条件は高い自動化率ではなく、AI Agent の承認線と変更管理を作れることに置くべきだ。

## 出典

- [Introducing OpenAI Presence](https://openai.com/index/introducing-openai-presence/) - OpenAI, 2026-07-22
- [OpenAI Presence connects AI agents to enterprise data with built-in guardrails](https://www.helpnetsecurity.com/2026/07/22/openai-presence-ai-agent-platform/) - Help Net Security, 2026-07-22
- [OpenAI Presence Pitches 'Trusted' AI Agents to Enterprises](https://www.reworked.co/digital-workplace/openai-presence-pitches-trusted-ai-agents-to-enterprises-a-day-after-owning-the-hugging-face-hack/) - Reworked, 2026-07-22
