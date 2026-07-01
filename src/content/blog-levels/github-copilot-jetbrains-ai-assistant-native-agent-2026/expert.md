---
article: 'github-copilot-jetbrains-ai-assistant-native-agent-2026'
level: 'expert'
---

GitHub CopilotとJetBrains AI Assistantの2026年6月30日更新は、IDE統合の追加というより、コーディングagentの配布経路を標準化する変更として読むべきである。Copilotは以前からAgent Client Protocol（ACP）経由でAI Assistantへ接続できたが、今回からagent pickerのネイティブな選択肢になった。利用者はGitHub OAuthで認証し、対応モデルと推論深度をAI Chat内で選択できる。

開発基盤チームにとって重要なのは、UIが一体化しても、ID、契約、モデルポリシー、利用量、実行権限の責任主体は一体化しない点だ。JetBrains AI契約とは別にGitHub Copilot契約が必要で、認証もGitHub側で行う。既存のACP運用を単に削除するのではなく、Copilot固有の接続だけをネイティブ化し、他のACP agentとの境界を再設計する必要がある。

今回の更新は、[JetBrains版CopilotでClaude providerを選ぶ構成](/blog/github-copilot-jetbrains-claude-provider-2026/)、[inline agent modeの実行権限](/blog/github-copilot-jetbrains-inline-agent-mode-2026/)、[Copilot CLIをremote controlする運用](/blog/github-copilot-cli-remote-control-ga-2026/)の交点にある。agentの入口、実行面、遠隔操作を別々に管理してきた組織は、AI Assistantを共通UIとして使う場合の責任分界を更新すべきだ。

## 事実: ネイティブ統合で変わる範囲

GitHub Changelogは、JetBrains AI AssistantのAI Chatにあるagent pickerからGitHub Copilotを選べるようになったと説明している。Copilotは複数段階のタスクを推論し、プロジェクトの調査、変更提案、コマンド実行、反復修正を行える。利用者は対応するCopilotモデルを選び、推論深度を調整できる。

JetBrainsの公式ブログは、変更前後をより具体的に示している。変更前はACP Registryを通じてCopilotを利用できた。変更後は、Copilotが既定の統合エージェントとして表示され、ACPを手動設定する必要がない。JetBrainsとGitHubが共同で構築・検証した、安定性と可用性を高めた経路だとされる。

この差はdeployment pathの変更であり、agent protocol全体の廃止ではない。JetBrains AI Assistantの公式ドキュメントは、統合agentに加えて外部ACP agentを接続できる構成を説明している。したがって、企業の移行単位は「ACPを廃止する」ではなく、「Copilotのprovider registrationをネイティブ経路へ置き換える」が正確である。

GitHubは今後の項目として、Next Edit Suggestions、skills、ツール間の深いorchestrationを挙げた。これらはロードマップであり、現行機能のSLAや確定仕様として扱ってはいけない。特にskillsの配布、更新、署名、権限継承を企業標準へ組み込む判断は、実装と管理機能が公開された後に再評価する必要がある。

## 事実: identity、entitlement、billingは分離したまま

認証はGitHubアカウントによるOAuthで行う。JetBrainsは、Copilot統合を使うには有効なGitHub Copilot契約が必要で、JetBrains AI契約には含まれないと明示している。このため、AI Assistantをpresentation layer、GitHub OAuthをidentity path、Copilot seatをentitlementとして分けて捉える必要がある。

企業で起きやすい問題は、三つの台帳がずれることだ。第一に、JetBrains IDEまたはAI Assistantを利用できる人。第二に、GitHub組織へ参加している人。第三に、Copilot seatが割り当てられている人である。三つが一致しないと、agent pickerには表示されるが認証後に使えない、異動者のCopilot seatだけ残る、委託先が個人GitHubアカウントで接続するといった状態が生じる。

さらに、モデルと推論深度の選択はGitHub Copilot側の利用条件や管理者ポリシーと結びつく。AI Chat内に選択UIがあっても、モデル許可、利用量、課金の正本がJetBrainsへ移るわけではない。開発基盤チームは、モデル別の許可状態と利用量をGitHub側で確認し、JetBrains側ではIDE版、AI Assistant版、設定配布を管理する二層構成になる。

この責任分界を文書化しないと、費用異常時にJetBrains管理者とGitHub管理者のどちらが調べるか曖昧になる。少なくとも、ログイン失敗、seat不足、モデル非表示、利用量増加、コマンド実行失敗の一次担当を決めておくべきだ。

## 分析: configuration driftは減るがpolicy driftは残る

ここからは分析である。

ネイティブ統合によって減るのは、主に接続設定のdriftだ。ACP Registryからの追加、ローカルランタイム、設定ファイル、provider更新、接続確認といった手順がCopilotについて不要になる。端末ごとの差が減り、ヘルプデスクが確認すべき項目も少なくなる。

一方、policy driftは自動では解消しない。利用者ごとに選ぶモデル、推論深度、agentへ任せる作業、コマンド承認、対象リポジトリが異なれば、同じIDEでも運用結果はばらつく。接続が標準化されたことを、利用方針まで標準化されたと解釈すると危険だ。

特に日本のJava・Kotlin組織では、IDE標準化が強い一方、GitHub組織、端末管理、ライセンス調達、セキュリティ審査の担当が分かれていることが多い。ネイティブ統合は利用開始を簡単にするが、部門間の責任境界を省略しない。むしろ、利用者が簡単に開始できるからこそ、事前にpolicy bundleを用意する必要がある。

policy bundleには、許可アカウント、Copilot seat申請、推奨モデル、推論深度、対象リポジトリ、コマンド実行ルール、秘密情報、レビュー必須条件、利用停止手順を含める。IDE設定だけで実現できない項目は、GitHubポリシー、リポジトリルール、CI、端末管理、社内規程へ割り振る。

## 既存ACP構成の移行設計

移行前に、現在の構成を四つに分類する。

第一は、CopilotをACP Registryから追加している端末である。これはネイティブ統合の主な移行対象になる。agent pickerで二重に表示されないか、既存セッションがどちらのproviderを参照するか、認証キャッシュが競合しないかを検証する。

第二は、Claude、Codex、社内agentなど、Copilot以外の統合・ACP agentである。これらは今回の変更対象ではない。Copilot移行のために共通ACP設定やランタイムを削除すると、他agentを壊す可能性がある。provider単位のinventoryが必要だ。

第三は、組織配布の設定と個人設定が混在する端末である。個人が追加したCopilot ACP構成を管理設定で上書きする場合、削除順序と復旧方法を決める。MDMや設定リポジトリで配布しているなら、旧構成を撤去する変更を段階的に出す。

第四は、ネイティブ統合を利用できないIDE版やAI Assistant版である。最新版へ上げられない規制環境や長期サポート環境では、ACP経由を期限付きfallbackとして残す判断があり得る。fallbackには対象バージョン、終了条件、ownerを明記する。

移行は、discover、pilot、default、retireの四段階に分けると管理しやすい。discoverでproviderと端末を棚卸しし、pilotで少人数の比較を行い、defaultで新規利用者の標準をネイティブへ変え、retireで旧Copilot ACP構成を撤去する。問題が出た場合のrollbackは、旧構成を無期限に併存させるのではなく、対象端末だけ一時的にACPへ戻す。

## モデルと推論深度を用途別に制御する

モデルと推論深度を選べることは、開発者体験には利点がある。しかし企業運用では、選択肢をそのまま渡すだけではコストと再現性が崩れる。

用途を少なくとも三層に分ける。第1層は説明、検索、局所的な補完で、速度を優先する。第2層はテスト追加、限定的なリファクタリング、不具合修正で、標準的な推論を使う。第3層はアーキテクチャ変更、複数モジュール移行、難しい障害解析で、深い推論を許可する。

各層で、許可モデル、推論深度、最大作業時間、コマンド実行、レビュー担当、利用量の確認方法を決める。モデル名だけを規程に固定すると、提供モデルの変更で文書がすぐ古くなるため、「標準」「高難度」「例外承認」の役割を定義し、具体モデルは運用表で更新する方がよい。

測定では、agent session数や生成行数だけを成果にしない。タスク完了時間、レビュー差し戻し率、CI失敗率、意図しないファイル変更、利用量、開発者の再指示回数を見る。深い推論で成功率が上がっても、レビュー時間と利用量が大幅に増えるなら、適用対象を狭める判断が必要だ。

## 実行権限と監査をUIの外で補う

GitHubの発表は、Copilot Agentがコマンドを実行し、複数段階の作業を反復できると説明する。したがって、導入評価はチャット回答品質だけでなく、実行面を含めなければならない。

最初のpilotでは、保護された本番設定、顧客データ、認証情報、リリース鍵へアクセスできないリポジトリを選ぶ。ブランチ保護、必須CI、人間レビューを維持し、agent出力を直接mainへ入れない。ローカルコマンドは、ビルド、テスト、静的解析など安全な範囲から始める。

監査証跡として、少なくとも利用者、GitHubアカウント、IDEとplugin版、選択モデル、対象リポジトリ、変更差分、実行コマンド、PR、レビュー結果を追えるようにする。すべてを一つの製品ログで取得できるとは限らないため、GitHub監査・利用量、PR履歴、CIログ、端末管理情報を組み合わせる。

また、AI Assistant内の表示だけでデータ処理経路を判断しない。選択したagentと認証方法によってproviderが異なる。利用者向けには、agent pickerの各選択肢について、認証元、契約元、送信先、利用禁止データ、問い合わせ先を一覧にする。共通UIは使いやすさを上げるが、provider境界を見えにくくもするためだ。

## 30日pilotの判定基準

第1週は環境確認に使う。対象者、IDE版、AI Assistant版、Copilot seat、OAuthアカウント、既存ACP設定を記録し、コード説明と読み取り中心のタスクを実行する。

第2週は限定的な変更へ進む。テスト追加、小さな不具合修正、局所的なリファクタリングで、変更範囲、コマンド、レビュー差し戻しを測る。モデルと推論深度を固定し、利用者差を小さくする。

第3週はモデル・推論深度を比較する。同じタスク群で速度、完了率、再指示回数、利用量を測る。比較対象は成果物の品質だけでなく、運用コストを含める。

第4週は移行可否を判断する。ネイティブ統合を既定にする条件は、接続障害が減ること、旧ACPと同等以上に作業できること、seatとOAuthを管理できること、実行権限とレビューで重大な逸脱がないことだ。条件を満たせば旧Copilot ACP構成のretire日を決める。満たさなければ、問題のあるIDE版やネットワークだけfallbackへ戻し、全面移行を延期する。

## まとめ

GitHub CopilotのJetBrains AI Assistantネイティブ統合は、Copilot固有のACP設定をなくし、agent picker、モデル選択、推論深度、複数段階の作業を一つのIDE体験へ寄せる。設定driftを減らす効果は大きい。

ただし、GitHub OAuth、Copilot別契約、モデルポリシー、利用量、実行権限はJetBrains AIへ統合されない。開発基盤チームは、Copilot providerだけをACPからネイティブへ移し、他のACP agentを切り分ける必要がある。identity、entitlement、policy、execution、auditの五つを別々に設計し、30日程度のpilotで接続負担と運用品質を比較するのが現実的だ。

## 出典

- [Copilot Agent is now available in JetBrains AI Assistant](https://github.blog/changelog/2026-06-30-copilot-agent-is-now-available-in-jetbrains-ai-assistant/) - GitHub Changelog, 2026-06-30
- [GitHub Copilot now an Integrated Agent in JetBrains IDEs](https://blog.jetbrains.com/ai/2026/06/github-copilot-now-an-integrated-agent/) - The JetBrains Blog, 2026-06
- [About AI Assistant](https://www.jetbrains.com/help/ai-assistant/about-ai-assistant.html) - JetBrains AI Assistant Documentation
- [Agents](https://www.jetbrains.com/help/ai-assistant/agents.html) - JetBrains AI Assistant Documentation
