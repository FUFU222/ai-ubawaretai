---
article: 'github-copilot-cli-ai-credit-session-limits-2026'
level: 'expert'
---

GitHub Copilot CLI / SDKのAI credit session limitは、agent費用の表示機能ではなく、**実行単位へ停止境界を追加するruntime control**である。interactive sessionは `/limits`、noninteractive runは `--max-ai-credits` を使い、model call、subagent、compactionを含むsession全体へsoft capを掛ける。

既存の[GitHub Copilot AI Credits課金・予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)は、共有pool、metered usage、organization / enterprise budget、user-level budgetという請求と月次統制の構造を扱った。[cost center別ユーザー予算](/blog/github-copilot-cost-center-user-budget-2026/)は、team membershipへper-user hard stopを追随させる中間層を扱った。今回のsession limitは、それらより短い「1回のagent task」を境界にする。

日本企業でagent automationを本番運用するなら、月次請求を抑えるだけでは不十分だ。一つのtaskが過剰探索、subagent増殖、巨大context、失敗retryによってcreditsを使い続ける状況を、job単位で止める必要がある。ただしsoft capは、hardな請求保証でも、transaction rollbackでも、task completion guaranteeでもない。この限界を前提に設計する必要がある。

## 事実: 公開範囲と計測対象

GitHubは2026年7月1日、AI credit session limitをCopilot CLIとCopilot SDKへ追加した。CLIは1.0.66以降、SDKは1.0.5以降が対象で、Copilot for Individuals、Business、Enterpriseへpublic previewとして提供される。CLIは `copilot update` で更新できる。

GitHub Docsは、1 AI Creditを0.01米ドルと定義している。modelとtoken量によってinteractionごとのcreditsが決まるため、同じprompt回数でも費用は一定ではない。高能力model、長いcontext、長いoutput、複数turn、subagent利用は、taskあたりのcreditsを押し上げる可能性がある。

session limitが追跡する範囲はsession全体である。Changelogはmodel calls、subagents、compactionなどのbackground workを明示している。したがって、controller agentが一度だけユーザーへ回答するtaskでも、内部で複数subagentが動けば、その消費は同じlimitへ集約される。

一方、GitHubの利用最適化ガイドでは、subagentはmain agentと別sessionを持ち、mainの会話履歴を引き継がないとも説明されている。ここでいう「別session」はcontextとmodel実行の単位であり、親taskへ設定したcredit limitの集計から外れるという意味ではない。Changelogがsubagent消費もsession全体で追跡すると明記しているため、利用者側は親runの予算へ含まれると理解すべきだ。

## 事実: soft capと停止挙動

soft capになる理由は、creditsの確定時点にある。model responseが進行している途中では最終消費量が確定しない。limitへ到達しても進行中responseは完了し、その後でagentが停止する。したがって、設定値を超過する可能性がある。

この仕様は、network requestの前に残高を予約するhard quotaとは異なる。たとえば残り5 creditsの時点で30 credits相当のresponseが始まれば、結果の確定後にlimit超過が分かる可能性がある。正確な最大超過幅はmodel、response、内部処理に依存し、公開情報から固定値は置けない。

interactive sessionでは次を使う。

```text
/limits set max-ai-credits 150
```

limitへ達するとCLIが停止を通知し、利用者は値を再設定して同じsessionを続行できる。解除は `/limits unset` である。これは、人がoutputを確認して追加費用の価値を判断するhuman-in-the-loopに向く。

noninteractive runでは次の形式になる。

```bash
copilot -p "対象repositoryの失敗testを分析し、修正候補と根拠をJSONで保存する" \
  --max-ai-credits 150
```

こちらはlimit到達時にrunが終了する。Changelogはagentがwrap upして知らせると説明するが、呼び出し側のwrapperがどのevent、message、exit codeでlimit到達を識別できるかは、利用するCLI / SDK versionとintegrationで実測すべきである。preview中のinterfaceを推測で固定すると、更新時に正常停止とtool failureを取り違える。

Docsは30 creditsより大きいlimitを勧めている。多くのmodel callsが20 creditsを超えるためである。この数値はproduction workloadの推奨budgetではない。最低限意味のある一つのturnを通すための注意であり、repository規模やtask別の初期値は実測から決める必要がある。

## 分析: sessionを費用と失敗半径の境界にする

ここからは分析である。

session limitの設計価値は、単に「1回150 credits」と書けることではない。task boundary、credit boundary、checkpoint boundaryを同じ位置へ寄せられることにある。三つがずれると、上限へ達した後の復旧が難しくなる。

悪い例は、一つのsessionへ調査、設計、実装、全test、PR作成、review comment対応を詰め込む構成だ。調査段階でcontextが膨らみ、実装中にcompactionが入り、test修正でsubagentが増え、PR作成直前にlimitへ達する可能性がある。途中fileは変更済みでも、testや説明が未完了かもしれない。

改善案は、work productごとにsessionを分けることである。

1. Research session: repository、Issue、logを読み、`research.json`を作る
2. Plan session: researchを入力に、変更対象、risk、test planを作る
3. Implementation session: approved planだけを実装する
4. Verification session: diff、test、security scanを評価する
5. Delivery session: PR本文とreview checklistを作る

分割するとsession数は増えるが、各sessionのcontextが小さくなり、modelをtaskへ合わせやすい。GitHub Docsもresearch、plan、implementを分け、強いreasoning modelはplan、より安価なmodelは明確な実装へ使う方針を示している。総creditsが必ず減るとは限らないが、失敗時に再実行する範囲は小さくなる。

この考え方は[Copilot cloud agent automations](/blog/github-copilot-cloud-agent-automations-2026/)にも直結する。scheduleやIssue / PR eventでagentが自動起動する場合、人間は開始前にtaskの広がりを見ていない。triggerごとにsession limitを付け、成果物をbranch、Issue comment、artifact、structured logへ残せば、無人runの失敗半径を限定できる。

## 分析: 三層の予算統制を分離する

日本企業の費用統制では、session limitを既存budgetの代替にしないことが重要だ。役割は次のように分かれる。

| 層 | 主な境界 | 守る対象 | session limitでは代替できない理由 |
|---|---|---|---|
| Enterprise / organization budget | 請求主体・月 | 全体支出 | 小さなsessionが大量実行される総量を止められない |
| User-level / cost center budget | 利用者・所属・月 | 個人や部門の公平性 | 1件のtaskが上限近くまで消費する失敗半径を小さくできない |
| Session limit | 1 agent session | 単一taskの暴走 | soft capであり、月次総額や所属別配賦を管理しない |

組織budgetはCFO、FinOps、platform ownerが月次で管理し、cost center user budgetは部門責任とidentity lifecycleへ結びつけ、session limitはrepository ownerまたはautomation ownerがjob definitionへ置く。このownershipを混ぜると、「全社budgetがあるからjob上限は不要」「session上限があるから部門budgetは不要」という誤解が生まれる。

たとえばplatform teamの1人あたり月次上限が250米ドルでも、夜間のtest調査jobへ毎回25米ドル相当を許す必要はない。逆に、sessionを1米ドル相当へ制限しても、1日500回起動すれば月次支出は大きくなる。trigger frequency、concurrency、retry数はsession limitの外側で制御する。

費用配賦にも注意がいる。automationを誰のlicenseまたはbilling entityへ紐づけるか、repository ownerとcost centerが一致するか、共通基盤jobの費用をどこへ置くかを決める。session limitはtask単位の予算仮説を作るが、会計上の配賦ルールまでは提供しない。

## 分析: 上限到達を正常系としてモデル化する

noninteractive runで最も避けたいのは、limit到達を一般的な「command failed」へ潰す実装だ。auth failure、network failure、tool permission denial、model availability、test failure、credit limit reachedは、復旧方法が異なる。

wrapperやorchestratorでは、少なくとも次のstateを分ける。

- `completed`: taskのacceptance criteriaを満たした
- `limit_reached_checkpointed`: 上限到達、再開可能なartifactあり
- `limit_reached_unrecoverable`: 上限到達、成果物が整合しない
- `tool_blocked`: 権限または承認不足
- `external_failure`: network、service、dependencyの失敗
- `quality_rejected`: agentは完了したがtestやreviewを通らない

limit到達時にartifactがあるだけでは十分ではない。schema version、task ID、source commit、使用model、消費credits、完了step、未完了step、変更file、test resultを紐づける。次回runはsource commitが動いていないか確認し、動いていればrebaseまたは再調査を選ぶ。

自動retryにはbudgetを二重に設定する。1回あたりのsession limitに加え、workflow全体の最大attempt数または総credit envelopeを持つ。たとえば1回120 credits、最大2回、合計240 creditsまでとする。2回目は同じpromptを再送せず、checkpointと未完了項目だけを入力する。

limitを上げる条件も明文化する。taskの価値が高い、進捗が十分ある、残作業が限定できる、人間が承認した、または過去の同種taskで完了率が高い場合に限る。単に「止まったから倍にする」では、soft capが形骸化する。

## 分析: model、context、toolを先に最適化する

session limitの到達率が高いとき、最初の対応をlimit増額にしない。credits消費の構造を確認する。

第一はmodel selectionである。GitHub Docsは、architectureや複雑なdebugにはreasoning model、計画が明確な実装にはmid-tier、formattingやdocumentationにはlighter modelを勧める。paid planのauto model selectionには10% discountがあるとも説明している。taskに対してmodelが過剰なら、上限を上げるよりmodelを変えるほうがよい。

第二はcontextである。open file、添付file、conversation history、tool definitionはinput tokenを増やす。`AGENTS.md`や`.github/copilot-instructions.md`へrepository mapと停止条件を短く書けば、毎回大量fileを探索する必要を減らせる。長いsessionでは `/compact` が有効だが、compaction自体もsession消費に含まれるため、そもそもtaskを分ける判断も必要になる。

第三はtool setである。MCP serverの全toolを常時有効にすると、tool definitionがcontextへ積み上がる。GitHub Docsはtaskに必要なtoolだけを有効にする考え方を示している。無人jobごとにallowlistを持ち、使わないbrowser、database、cloud toolを外すことは、securityと費用の両方に効く。

第四はsubagentである。subagentは探索を並列化できるが、各agentがmodelとcontextを使う。並列化でwall-clock timeが減っても、creditsは増える可能性がある。session limitにsubagent消費が含まれる以上、「何agentまで」「どのmodel」「どの問題だけ」をjob policyへ置くべきだ。

## 日本企業向けの導入テンプレート

pilotでは、production writeを伴わないtaskを3種類ほど選ぶ。たとえば、Issue triage、CI failure analysis、dependency update researchである。それぞれに小・中・大のtask sampleを10件程度用意し、同じmodelとtool setでcredits分布を取る。

初期limitは平均値ではなく、完了率との関係で決める。中央値だけを見ると大型taskが頻繁に止まる。p75やp90付近、またはrisk class別の値を候補にし、上限超過時の再実行費用も含めて比較する。極端なoutlierはlimitを上げず、人間へ戻す設計がよい。

job definitionには次を記録する。

```yaml
task_class: ci_failure_analysis
owner: platform-engineering
max_ai_credits: 120
max_attempts: 2
allowed_tools:
  - repository-read
  - actions-log-read
  - artifact-write
checkpoint: .automation/checkpoints/${run_id}.json
escalate_when:
  - source_commit_changed
  - second_limit_reached
  - auth_or_permission_failure
```

これはGitHub公式の設定schemaではなく、運用設計例である。実際のCLI / SDK wrapperに合わせて実装する。重要なのは、credit値だけでなくowner、tool、checkpoint、attempt、escalationを同じ定義へ置くことだ。

観測指標は、task class別に次を見る。

- creditsのp50 / p75 / p90
- 初回完了率とlimit到達率
- checkpointからの再開成功率
- 2回以上のretry率
- 人間へescalateした割合
- test pass、PR採用、Issue分類精度などの品質指標
- 人間のreview時間

費用だけを最小化すると、未完了や低品質が増える。品質だけを最大化すると、すべてを高価なmodelと高いlimitへ寄せやすい。task価値、完了率、review時間、creditsを一緒に見る必要がある。

## セキュリティとガバナンスの注意点

session limitはsecurity controlではない。tool権限、network access、secret、sandbox、branch protection、review requirementを代替しない。悪意あるpromptや誤った指示でも、limit内では許可された操作を実行できる。

無人runでは、write権限を最小化し、成果物はdraft PRやartifactへ限定する。database migration、本番deploy、identity変更、billing変更は、credit上限とは別にhuman approvalを必須にする。limitへ達した時点でprocessが止まること自体が、resourceを中間状態へ残すリスクもあるため、transactionalなtaskはagent sessionの外側でrollback可能にする。

監査ログには、誰がjobを定義したか、誰のbilling contextで実行したか、どのrepositoryとcommitを対象にしたか、limitと実消費、model、tool invocation、output artifactを残す。session limitの導入は、請求管理だけでなくagent runbookと監査schemaを整える契機にすべきだ。

[OpenAI Codexのplan / credits上限](/blog/openai-codex-plan-credits-limits-2026/)でも、agent利用はplan上限や追加creditと切り離せない。vendorごとに単位と停止挙動は異なるが、共通する設計原則は、task単位のbudget、全体budget、checkpoint、retry、human approvalを分離することだ。複数agent製品を使う企業は、vendor固有のcreditをそのまま横並びにせず、業務taskあたりの費用と完了品質へ正規化する必要がある。

## まとめ

GitHub Copilot CLI / SDKのAI credit session limitは、単一agent sessionのcreditsを追跡し、soft cap到達後に停止させるruntime guardrailである。CLI 1.0.66、SDK 1.0.5以降でpublic previewとして使え、interactiveでは再設定後に継続、noninteractiveではrunを終了する。

実務では、session limitを月次budgetの代替にせず、enterprise / organization budget、user-level / cost center budget、session limitの三層で扱う。task、credit、checkpointの境界を揃え、limit到達を正常系としてstate machineへ入れ、retry総量とhuman escalationを定義する。

日本企業が得る価値は、1回のrunを安く見せることではない。無人agentがどこまで仕事を広げ、どの条件で止まり、何を残し、誰が続行を判断するかを明文化できることだ。session limitは、その運用契約を実行時に支える一つの部品である。

## 出典

- [Set AI credit session limits in Copilot CLI and SDK](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) - GitHub Changelog, 2026-07-01
- [Setting an AI credit session limit in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) - GitHub Docs, accessed 2026-07-02
- [Optimizing your AI usage to maximize efficiency and reduce cost](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage) - GitHub Docs, accessed 2026-07-02
