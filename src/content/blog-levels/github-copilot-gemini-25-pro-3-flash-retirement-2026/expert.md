---
article: 'github-copilot-gemini-25-pro-3-flash-retirement-2026'
level: 'expert'
---

GitHub CopilotにおけるGemini 2.5 ProとGemini 3 Flashの廃止は、モデルピッカーの整理ではなく、企業のAIコーディング運用に期限付きのconfiguration migrationを発生させる。2026年7月31日以降、両モデルはCopilot Chat、inline edits、ask mode、agent mode、code completionsを含む全Copilot体験から外れる。公式代替はGemini 3.1 ProとGemini 3.5 Flashである。

重要なのは、model availability、model policy、client compatibility、prompt behavior、agent trajectory、cost attributionを別の層として扱うことだ。管理画面で代替モデルを有効にしても、旧モデル名を固定したwrapperやrunbookは直らない。IDEを更新しても、評価基準は更新されない。廃止日を越えないことと、安全に移行できたことは同義ではない。

既存の[Gemini 3.5 Flash一般提供とモデル選定](/blog/github-copilot-gemini-35-flash-ga-2026/)は新モデルを使い始める判断を扱った。[Copilot Auto model selection](/blog/github-copilot-auto-model-selection-vscode-2026/)はモデル選択を標準運用へ寄せる方法を扱った。今回の廃止対応は、その両方を実際のmigration controlへ接続する作業になる。

## 事実の境界: Copilot提供終了とGemini API終了を分離する

GitHub Changelogが発表した事実は明確である。Gemini 2.5 ProとGemini 3 Flashは、2026年7月31日にGitHub Copilotの全体験で廃止される。推奨代替は前者がGemini 3.1 Pro、後者がGemini 3.5 Flashである。管理者は、必要に応じて代替モデルへのアクセスをCopilotのモデルポリシーで有効化し、個人設定とモデルセレクターで利用可能性を確認する。

一方、この発表からGoogle Gemini APIやVertex AI上のendpoint廃止を推論してはいけない。GitHub Copilotは複数providerのモデルをGitHubの製品面、policy、billing、content filtering、client compatibilityへ載せるサービスである。GitHub側の提供終了は、Google側のmodel lifecycleと独立して起き得る。

この区別はasset inventoryで重要になる。同じ「Gemini 2.5 Pro」という文字列でも、GitHub Copilotのmodel selection、Google AI StudioのAPI model id、Vertex AIのdeployment、社内model gatewayのaliasでは、ownerと期限が違う。検索結果を一括置換すると、対象外のAPI設定まで変更する危険がある。

inventoryには少なくともprovider surfaceを持たせる。

| 参照箇所 | provider surface | 今回の対象 |
| --- | --- | --- |
| Copilot Chatのモデル選択 | GitHub Copilot | 対象 |
| Copilot agentのモデル指定 | GitHub Copilot | 対象 |
| CLI・IDEのCopilot設定 | GitHub Copilot | 対象 |
| Gemini APIのmodel id | Google Gemini API | 本発表だけでは対象外 |
| Vertex AIのendpoint | Google Cloud | 本発表だけでは対象外 |
| 社内gatewayのmodel alias | 自社基盤 | upstreamを個別確認 |

## Availability plane: policy、plan、clientを別々に確認する

GitHub Docsでは、Copilotモデルの利用可否はplan、client、organizationまたはenterpriseの制限に依存すると説明している。したがって、移行確認は単純なbooleanではなく、少なくとも次のtupleで管理する必要がある。

`enterprise × organization × plan × client × client version × model policy × user cohort`

Copilot BusinessとEnterpriseでは、ownerがモデルアクセスを有効化または無効化できる。代替モデルがGitHubのsupported models一覧に載っていても、organization policyで無効なら利用者は選べない。enterprise policyとorganization policyが重なる場合は、どちらがeffective policyを決めているかも確認する。

client差もある。GitHub Docsは、Gemini 3.1 ProとGemini 3.5 Flashについて、VS Code、Visual Studio、JetBrains IDE、Xcode、Eclipseの最低バージョンを示している。標準開発環境を中央管理している会社でも、次の例外が残りやすい。

- 長期保守案件でIDEを固定した端末
- 顧客ネットワーク内のVDI
- 外部委託先が管理する開発PC
- extension marketplaceへ直接接続できない閉域環境
- developerが自分で更新を止めたlocal environment
- CI imageやremote development container内の古いextension

管理者テストは、自分のaccountでモデル名が見えることだけでは不十分だ。代表的なorganization、seat、client、network zoneごとにsynthetic userまたは協力者を置き、モデルセレクター、実際のprompt、agent executionまで確認する。

## Configuration plane: 文字列検索だけでは固定依存を見つけきれない

旧モデル依存の棚卸しは、repository searchから始められる。`Gemini 2.5 Pro`、`Gemini 3 Flash`、正規化されたmodel alias、社内wrapperのoptionを検索する。ただし、モデル名はコード以外にもある。

- `.github`配下のinstructions、agents、workflows
- Copilot CLIの設定とshell wrapper
- IDE profile、dev container、VDI image
- internal developer portalのtemplate
- prompt catalog、evaluation dataset、golden answer
- onboarding document、FAQ、研修動画
- service deskの回答template
- architecture decision record
- spreadsheetで管理するapproved model list

さらに、モデル名が直接書かれていなくても「高速モデル」「高精度Gemini」「標準Flash」のようなaliasに隠れる場合がある。alias registryを持つ組織は、aliasの解決先と変更履歴を確認する。registryがない組織は、この移行を機に直接名を散らす構造を減らしたい。

[Copilot Web版のモデル選択肢削減](/blog/github-copilot-web-models-limited-2026/)で示されたように、モデルavailabilityはsurfaceごとに変わる。今回の発表は全Copilot体験が対象だが、将来も同じ形とは限らない。configuration schemaには、model nameだけでなく、surface、fallback、owner、last verified dateを持たせるほうがよい。

## Behavior plane: 代替モデルを同等品と仮定しない

公式のsuggested alternativeはmigration starting pointであって、behavioral equivalenceの保証ではない。Pro系からPro系、Flash系からFlash系への対応は用途を考えやすいが、実際の品質はrepository、language、prompt、tool set、context length、task horizonで変わる。

評価はsingle-turn benchmarkだけでなく、agentic taskを含める。少なくとも次のtask classを用意する。

1. 小さなbug fixとunit test追加
2. 複数fileをまたぐ原因調査
3. pull request reviewと重大度分類
4. framework upgradeの計画作成
5. unfamiliar repositoryの探索
6. 日本語issueからの実装
7. security-sensitive codeの説明
8. tool callを伴うagent mode

測定項目は、task completion、test pass、human edit distance、review defect count、latency、tool call count、context consumption、AI Credits、policy violation、unsafe action attemptとする。全件を精密評価できなくても、旧モデルの直近実行結果と代替モデルの結果を同じrubricで比較すれば、切替後の変化を説明できる。

特にFlash系は、速度重視の用途で利用されやすい。Gemini 3 FlashからGemini 3.5 Flashへ移す際、品質が上がってもtool callやtoken consumptionが増えれば、automationのthroughputと予算が変わる可能性がある。Pro系では、高難度設計や長い文脈での判断を確認する。平均点だけでなく、重大な失敗の種類を見る。

## Auto selectionはfallback policyではない

旧モデルを直接指定するのをやめ、すべてAutoへ移せば終わるように見える。しかしAuto model selectionは、任意の廃止モデルを互換モデルへ置換するfallback layerではない。

GitHub Docsでは、Autoで利用できるモデルはorganizationまたはenterpriseのpolicyに従い、Auto候補はsupported modelsの一部として管理される。つまり、手動選択できるモデル集合とAuto候補集合は同一とは限らない。Autoはtask、availability、model healthなどを考慮する運用上の選択肢だが、固定モデルで行っていた再現性要件を自動的に満たさない。

用途を三つに分けると判断しやすい。

- daily assistance: Autoを標準にし、個別モデル依存を減らす
- evaluated workflow: 評価済み代替モデルを固定し、version changeを管理する
- critical workflow: model固定に加え、fallback、human approval、停止条件を持つ

これにより、利用者の軽い質問と、CIやagentic workflowのような再現性を求める処理を同じpolicyで扱わずに済む。

## Migration runbook: 4段階で進める

### 1. Discover

最初にasset inventoryを作る。検索対象はrepositoryだけでなく、Copilot settings、enterprise policy、organization policy、client fleet、documents、support knowledge、training assetsを含める。各assetにowner、surface、旧モデル、利用頻度、criticality、代替候補、期限を付ける。

この段階で、単なる記載と実行時依存を分ける。blogや過去議事録の文字列は参考情報であり、必ずしも変更対象ではない。一方、workflow、wrapper、standard operating procedureの固定名は実行を止める可能性がある。

### 2. Enable and validate

代替モデルを対象organizationで有効化し、representative clientsで見えることを確認する。次に、評価セットを両代替モデルで実行する。変更前の旧モデル結果を保存できるなら、同じcommit、同じprompt、同じtool permissionで比較する。

結果にはmodel、client version、timestamp、repository commit、prompt version、tool set、policy snapshotを付ける。agent出力だけ保存しても、後から差の理由を説明できない。

### 3. Cut over

model alias、CLI wrapper、custom agent、documentationを更新する。変更は一つの巨大なcommitにせず、policy、client、workflow、documentsを分けるとrollbackしやすい。旧モデルを選べる期間中に代替モデルをdefaultへ寄せ、少なくとも数営業日運用する。

過去の[GPT-5.2とGPT-5.2-Codex廃止](/blog/github-copilot-gpt-52-codex-retirement-2026/)でも、代替モデルの有効化と固定参照の確認が要点だった。廃止イベントごとにrunbookを作り直さず、共通templateへ今回のmodel pairとdeadlineを入れる形にしたい。

### 4. Observe and close

切替後は、failure rate、help desk tickets、model-not-available error、latency、AI Credits、human correctionを監視する。7月31日後に旧モデルが自動で外れたことを確認し、inventoryをclosedへする。未対応例外は、ownerと期限を持ったrisk acceptanceとして残す。

完了条件は「管理者画面を更新した」ではなく、次のすべてが満たされた状態である。

- 代替モデルが対象cohortで実行できる
- 旧モデルのruntime referenceがない
- 代表タスクの評価結果が承認されている
- client fleetが必要条件を満たす
- supportとtraining assetsが更新されている
- costとqualityの切替後監視が動いている

## Governance: 変更記録を軽量でも残す

モデル変更はsoftware dependency updateに近い。model provider、host platform、client、policy、billingが同時に関わるため、SBOMだけでは追えないが、変更管理の考え方は再利用できる。

最低限のmodel change recordには、announcement URL、effective date、affected models、replacement models、affected organizations、policy owner、evaluation evidence、cutover date、exceptions、rollbackまたはfallbackを書き残す。日本企業で監査や顧客説明が必要な場合、誰がいつ代替モデルを承認したかも記録する。

ただし、すべてのCopilot会話に重い承認を課す必要はない。重要度で分ける。個人の補助的Chatは通知と標準設定で処理する。repositoryを書き換えるagent、自動PR、セキュリティレビュー、顧客コードを扱う処理は評価と承認を要求する。モデル廃止を機に、用途別のcontrol depthを明確にできる。

## 日本企業向けの実装判断

日本企業では、開発環境の更新が本社管理、事業部管理、委託先管理に分かれていることが多い。中央管理者がmodel policyを有効にしても、委託先のIDE更新や研修資料までは自動で届かない。enterprise-wide announcementだけで完了とせず、organization ownerとproject ownerへchecklistを配る必要がある。

また、日本語promptの回帰評価を英語benchmarkで代用しない。issue、仕様書、レビュー観点、エラーメッセージが日本語と英語で混在する実データを使う。日本語の丁寧さだけでなく、曖昧な業務語を勝手に補わないか、固有名詞を変形しないか、英語code symbolとの対応を誤らないかを見る。

費用評価もseat単位だけでは足りない。モデル変更で一回あたりの消費、agent loop、retry率が変わると、同じ利用者数でも総消費は変わる。[Copilot CLIのセッション上限](/blog/github-copilot-cli-ai-credit-session-limits-2026/)のようなrun単位の制御を持つautomationでは、新モデルで上限到達率が変わらないか確認する。

## まとめ

Gemini 2.5 ProとGemini 3 FlashのGitHub Copilot提供終了は、2026年7月31日という明確なdeadlineを持つ。代替はGemini 3.1 ProとGemini 3.5 Flashだが、移行はmodel name replacementだけでは完了しない。

企業は、Copilot提供面とGoogle API提供面を分離し、policy、plan、client、configuration、behavior、costを別々に検証する必要がある。Auto selectionを万能fallbackと見なさず、daily assistance、evaluated workflow、critical workflowでmodel strategyを分ける。7月31日をcutover dayではなくclosure deadlineにすれば、廃止後の突発対応を減らせる。

## 出典

- [Upcoming deprecation of Gemini 2.5 Pro and Gemini 3 Flash](https://github.blog/changelog/2026-07-02-upcoming-deprecation-of-gemini-2-5-pro-and-gemini-3-flash/) - GitHub Changelog, 2026-07-02
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Configuring access to AI models in GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models) - GitHub Docs
