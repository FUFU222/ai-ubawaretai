---
article: 'anthropic-claude-science-reproducible-hpc-2026'
level: 'expert'
---

Claude Scienceは、科学向けに調整したchat UIではなく、agent、科学tools、実行環境、成果物、provenanceを1つのsessionへ束ねるworkbenchである。Anthropicは2026年6月30日にベータを公開し、macOS、Linux、SSH先、HPC login node、Modalのオンデマンドcomputeを実行先として示した。利用対象はClaude Pro、Max、Team、Enterpriseで、TeamとEnterpriseでは管理者が有効化する。

日本の製薬、素材、化学、大学、公的研究機関にとって、技術的な評価軸は「専門質問へ答えられるか」だけでは足りない。研究AIは、データ取得の決定性、実行環境の固定、成果物の追跡可能性、計算資源への権限、独立検証を同時に満たす必要がある。[Anthropicの生物学エージェント研究](/blog/anthropic-agentic-biology-data-infra-2026/)で示された決定的な検索層は、その一部だった。Claude Scienceは、そこへagent orchestration、persistent kernel、artifact rendering、HPC job管理を加えた製品化と考えられる。

一方、製品が「auditable」「reproducible」と表現していても、規制業務や査読で求められる監査可能性・再現性を自動的に満たすとは限らない。[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/)で扱った企業監査の仕組みと、研究成果自体のprovenanceは別の層である。また、長いagent sessionの品質と費用を測る際は[Claude Sonnet 5の移行評価](/blog/anthropic-claude-sonnet-5-pricing-migration-2026/)と同様、単価ではなく完了した研究task単位で見る必要がある。

## 事実: 調整agent、専門agent、reviewer agentの三層

Anthropicの発表では、利用者はgeneralist coordinating agentと対話する。このagentは、ゲノミクス、single-cell、proteomics、structural biology、cheminformaticsなどに事前設定された60超のskillsとconnectorsへアクセスし、必要に応じてsub-agentや利用者が作ったspecialist agentを動かす。研究室固有のpipelineはskillとして保存でき、既存toolはconnectorで追加できる。

出力側にはreviewer agentがある。引用の誤り、追跡不能な数値、元codeと一致しないfigureを検出し、自己修正を試みる。actorとcriticを分ける構成は、1つのagentに生成と検証を同時に任せるより役割が明確だ。ただし、同じmodel family、同じcontext、同じ誤った前提を共有すれば、両者が同じ間違いを見逃す可能性は残る。criticの存在は独立性の証明ではない。

日本企業の検証では、reviewer agentが出した指摘数よりも、blindに用意した既知の誤りをどこまで検出できたかを測るべきだ。誤ったDOI、引用先にない主張、単位変換の誤り、軸labelとdata列の不一致、不適切な統計検定、古いdatabase releaseなどをtest setに入れる。人間reviewerの検出結果との差分を、false negativeとfalse positiveに分けて記録する。

## 事実: artifactへcode、environment、conversationを結び付ける

Claude Scienceは、figure、table、notebookに、生成した正確なcode、実行environment、message historyを添える。Figureを自然言語で修正すると、agentは画像への後処理ではなく、元codeを編集する。protein structure、genome browser track、chemical structureなどのrendererを備え、MarkdownとLaTeXのpreviewを使ってmanuscriptも同じ環境で作る。

これはprovenance graphの入口になる。最低限、artifactからsource data、transformation code、environment、prompt/context、実行時刻を逆引きできる。ただし厳密な再現性には追加情報が要る。

- source datasetのchecksum、version、取得日時、license
- container image digestまたはOS、package lock、compiler、driver
- model ID、modelの変更可能性、temperatureなどの実行条件
- random seed、並列化設定、hardware差による非決定性
- connectorや外部APIのrequest、response、schema version
- 人間が加えた修正、承認者、承認時点のartifact hash

会話履歴は説明には役立つが、実行仕様ではない。自然言語の指示をそのまま再送して同じagent trajectoryになる保証はない。再現対象を「同一bit列」「統計的に同等な結果」「主要結論が同じ」「図表を説明可能」のどれにするか、taskごとに定義する必要がある。

## 事実: persistent kernelとfork可能なsession

Claude ScienceはPythonとRのkernelをsession内で維持し、variables、dataframe、読み込んだmodelを保持する。大規模datasetを各stepで読み直さずに反復できるため、探索的解析には有利だ。sessionをforkし、元の流れを失わずに2つのapproachを比較する機能も示されている。

しかしpersistent stateは再現性の敵にもなる。notebookでよくある「cellを実行した順番に依存する」「memory上では存在するがcodeに現れない変数がある」という問題が、そのままagent sessionでも起き得る。最終成果物を固定する時点では、clean environmentからtop-to-bottomで再実行し、暗黙stateがないことを確認したい。fork後は、共通祖先、差分、利用dataset、environmentの差をmetadataとして残す必要がある。

運用上は、探索sessionと確定pipelineを分けるとよい。探索中はpersistent kernelで速く反復し、採用する解析はversion管理されたscriptまたはworkflowへexportし、clean runnerで再実行する。人間が読む研究noteと、機械が実行するmanifestを別々に保存する。

## 事実: HPCとModalへのcompute orchestration

Anthropicは、Claude Scienceがlaptop、Linux box、SSH接続先、HPC login nodeで動くと説明する。大規模解析ではplanを作り、新しいresourceへのアクセス前に確認を求め、batch scriptを書き、既存のclusterまたはModalへjobを投入する。localの1 GPUから多数のGPUへscaleする構成も示された。

この設計では、agentがcontrol planeの一部を担う。入力を読み、resource要件を推定し、scheduler向けscriptを生成し、job statusを監視し、結果を取得する。したがって、通常のinteractive assistantより権限面のriskが大きい。login nodeへのshell access、scheduler command、object storage、secret、network egress、result directoryが攻撃面になる。

最小権限は次のように分けるべきだ。

1. loginは個人accountではなくPoC専用service identityにする
2. queue、GPU数、wall time、同時job数、月額computeに上限を置く
3. source datasetはread-only、outputは専用directoryへ限定する
4. job submit、外部network、secret利用は個別の明示承認にする
5. generated scriptとdependency install内容をsubmit前に表示する
6. session終了時のprocess、temporary storage、credentialを失効させる
7. scheduler log、shell history、artifact、承認記録を同じrun IDで結ぶ

特にHPC login nodeでは、重い処理を直接実行しない、schedulerを通す、shared filesystemへ不要なscanをかけないといった既存policyをagentにも強制する必要がある。promptに書くだけでなく、OS permission、scheduler policy、network policyで制限する。

## 事実: 大規模データを既存基盤へ置く設計

Anthropicは、大規模または機微なdatasetをlaptop、Linux box、HPC login nodeなど研究室の既存infraに置き、各stepに必要なcontextだけをClaudeへ送る構成を説明している。これはdata localityの利点があるが、「data never leaves」と同義ではない。送信されるcontextには、sample identifier、summary statistics、code snippet、error message、directory nameなどが入り得る。

評価時には、data flowを実測する。endpoint、payload size、field、retention、region、subprocessor、telemetryを確認し、proxyまたはegress logで期待と一致するかを見る。Connectorごとのcredential scopeと取得fieldも棚卸しする。ELN、LIMS、clinical data、compound information、共同研究先のdataでは、契約と同意範囲が違うため、1つの「研究データ」categoryにまとめない。

PoC用datasetには、公開dataか十分に匿名化した複製を使う。個人情報、臨床data、未公開知財、輸出管理対象、共同研究契約で再提供が禁じられたdataは、data protection impact assessmentや法務確認が終わるまで対象外にする。

## 事実: BioNeMoは科学toolboxを提供する

NVIDIAは2026年6月23日、BioNeMo Agent Toolkitを発表した。biology、chemistry、genomics、drug discovery向けに、model、library、NIM microservices、Parabricksなどをagent-callableなtoolとして提供する。Claude ScienceはBioNeMoのskillsを介し、Evo 2、Boltz-2、OpenFold3などへ接続するとAnthropicは説明している。

重要なのは、frontier modelとdomain toolを分離する構成である。LLMはtaskを分解し、toolとparameterを選び、出力を説明する。科学的な計算は専門modelやlibraryが担う。この分離により、tool単体のvalidation、version固定、入出力schemaのtestが可能になる。一方、agentが誤ったtoolやparameterを選べば、正しく動くtoolから不適切な結果が出る。toolの正確さとorchestrationの正しさは別々に測る必要がある。

研究室固有のvalidated pipelineをskill化する場合は、自由なshell snippetより、schemaを持つnarrow interfaceにする。入力type、単位、許容range、reference genome、database version、output schemaを明示し、不正な入力はtool側で拒否する。agentの自然言語理解にvalidationを任せない。

## 分析: 監査可能性を4層に分ける

ここからは分析だ。

Claude Scienceの導入評価では、「audit logがあるか」という一問では粗すぎる。少なくとも4層に分ける。

第一はidentityとaccessの監査だ。誰がsessionを開始し、どのconnector、dataset、computeへアクセスしたか。TeamとEnterpriseの管理者有効化、group assignment、credential発行・失効が対象になる。

第二はagent actionの監査だ。どのprompt/contextから、どのtoolを、どのparameterで呼び、どのcommandやjobを実行したか。失敗とretryも必要だ。

第三はscientific provenanceだ。どのsource dataとtransformationから、どのartifactが生まれたか。Figureの見た目ではなく、数値まで逆引きできる必要がある。

第四はdecisionの監査だ。どの成果物を誰がreviewし、どの限界を認識したうえで、実験、申請、製品判断に使ったか。AIが候補を出したことと、組織が意思決定したことを分ける。

これらを共通run ID、artifact hash、timestampでつなぐ。企業向けの利用logだけ保存しても科学的provenanceは不足し、notebookだけ保存しても権限と意思決定の説明は不足する。

## 分析: PoCは既知の答えを持つtaskで設計する

新規仮説の生成から始めると、正解が分からず評価できない。最初は既知の結果を持つtaskを使う。

文献調査では、専門家が作ったgold setと比較し、precision、recall、引用主張の一致、矛盾の発見を測る。解析では、確定済みpipelineのoutputと比較し、数値差、figure差、runtime、environment差を測る。HPCでは、既存のsmall jobを使い、resource request、queue選択、retry、cleanupの正しさを見る。

評価表には少なくとも以下を入れる。

| 評価軸 | 例 |
|---|---|
| 正確性 | 引用一致率、既知エラー検出率、数値差 |
| 再現性 | clean環境での再実行成功率、artifact追跡率 |
| 安全性 | 未承認resource access、書き込み逸脱、secret露出 |
| 運用性 | 人間のreview時間、失敗復旧時間、停止成功率 |
| 経済性 | 完了task当たりmodel・compute・storage費用 |

Anthropicが紹介する時間短縮事例は参考にはなるが、自組織のbaselineにはならない。分野、data quality、既存pipeline、review基準が異なるからだ。PoC前に現行手順の時間とerror率を測り、同じtaskで比較する。

## 日本組織向けの導入構成

現実的な初期構成は、研究者端末または隔離したLinux環境にClaude Scienceを置き、承認済みの公開databaseと検証用datasetだけを接続する。Connectorはread-only、computeはPoC専用queue、egressはallowlist、outputは専用bucketまたはdirectoryに限定する。

研究者は探索を担当し、data stewardはsourceとlicense、platform teamはHPCとcredential、情報セキュリティはegressとlog、研究倫理・法務・知財は利用範囲を確認する。最終artifactには研究者と独立reviewerの承認を必要とする。役割を増やすことが目的ではなく、AIのsession内に隠れがちな責任境界を既存の研究governanceへ戻すためだ。

本番候補へ進める条件は、既知taskで基準を満たし、clean再実行ができ、未承認resourceへのaccessがなく、停止・credential失効・log取得が再現できることとする。便利なdemoができたことを本番判定にしない。

## まとめ

Claude Scienceは、科学database、専門tool、persistent Python/R kernel、artifact、reviewer agent、HPCを1つのworkbenchへ統合した。研究AIを「回答生成」から「検証可能な作業実行」へ動かす製品として、技術的には重要な更新である。

ただし、成果物にcodeと履歴が付くことは、科学的妥当性、完全なdata locality、規制適合を保証しない。日本の研究組織は、provenanceをidentity、agent action、scientific artifact、human decisionの4層に分け、既知taskで正確性と再現性を測り、HPCとconnectorを最小権限にする必要がある。

最初に問うべきなのは「新しい発見ができるか」ではない。既知の解析をclean環境で再現できるか、誤りを検出できるか、resource accessを止められるか、結果を人間が独立に説明できるかである。その基準を通過した後に、新規研究の探索範囲を段階的に広げるのが妥当だ。

## 出典

- [Claude Science, an AI workbench for scientists, is now available](https://www.anthropic.com/news/claude-science-ai-workbench) - Anthropic, 2026-06-30
- [Claude Science beta](https://claude.com/product/claude-science) - Anthropic
- [NVIDIA Announces BioNeMo Agent Toolkit](https://nvidianews.nvidia.com/news/nvidia-launches-bionemo-agent-toolkit-giving-ai-agents-the-tools-to-accelerate-scientific-discovery) - NVIDIA, 2026-06-23
- [Anthropic integration with Modal brings scalable compute to Claude Science](https://modal.com/blog/modal-integration-brings-scalable-compute-to-claude-science) - Modal, 2026-06-30
