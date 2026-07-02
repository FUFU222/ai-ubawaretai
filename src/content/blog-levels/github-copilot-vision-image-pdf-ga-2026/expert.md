---
article: 'github-copilot-vision-image-pdf-ga-2026'
level: 'expert'
---

GitHub Copilot visionの一般提供は、Copilot Chatへ新しいinput typeが増えたというだけではない。画像・PDF入力がpreview policyの内側から外れ、FreeからEnterpriseまで利用できる標準経路になった。日本企業にとっては、feature enablementよりも**data plane、evidence、review boundaryをどう設計するか**が主要課題になる。

GitHubは2026年7月1日、visionをVS Code、github.com、Copilot CLIへ一般提供した。画像はJPEG、PNG、GIF、WebP、文書はPDFを扱える。Business / Enterpriseで従来必要だったEditor Preview Features設定は不要になり、追加の管理操作なしに既定で使える。さらに同プランの画像・PDF添付は、サービス提供のため約24時間保持されると説明している。

既定有効化は、管理者の責任がなくなったことを意味しない。[Copilot plugin marketplaceの統制](/blog/github-copilot-strict-marketplaces-plugin-controls-2026/)ではtool配布範囲を、[Copilot code reviewの組織設定](/blog/github-copilot-code-review-org-controls-2026/)ではAI reviewの利用範囲を扱った。visionでは、それらに加えて、画像やdocumentに埋め込まれた情報をprompt dataとして管理する必要がある。

## 事実: 利用面、形式、plan、保持

GitHub Changelogで確認できる提供面は三つある。

| Surface | Input | Mode / operation | 主な利用文脈 |
|---|---|---|---|
| VS Code Copilot Chat | paste、drag and drop、右クリック | ask、plan、agent | code編集とUI・diagramの往復 |
| Copilot Chat on github.com | 画像・PDFを直接添付 | Web chat | Issue、PR、repository文脈 |
| GitHub Copilot CLI | image path | terminal session | local artifactとrepository調査 |

画像形式は`.jpg`、`.jpeg`、`.png`、`.gif`、`.webp`、documentはPDFである。全Copilot planが対象で、GitHubは機能を有効にするためのpolicy変更やadmin actionは不要としている。

Business / Enterpriseでは、preview時にEditor Preview Features policyが必要だった。GA後はvisionが既定で利用可能になる。ここで注意すべきなのは、Changelogが「no policy changes or admin actions are required to turn it on」と説明している点だ。公開時点の情報から、visionだけを従来のpreview policyで停止できると想定して運用設計してはいけない。

保持について、GitHubはBusiness / Enterpriseの画像・PDF添付を約24時間保持すると明記している。保持目的はサービス提供である。ただし、公開情報だけから、個別添付の削除API、管理者による添付一覧、region別storage location、incident時の即時purge手順まで断定することはできない。必要な企業は、契約文書、Trust Center、Support回答を含めて確認すべきである。

GitHub Docsのresponsible use guidanceは、Copilot Chatの回答を利用者が確認し、生成codeをtestし、安全性と要件適合性を検証する責任を示している。visionによる画像読解も、同じprobabilistic systemのinput processingである。OCR、object detection、diagram reasoning、document understandingの正確性を、仕様上の保証として扱わない。

## 分析: text prompt中心のDLPでは不足する

ここからは分析である。

企業の生成AI policyは、clipboardへ貼るtextとsource codeを中心に作られていることが多い。しかしvisionでは、次の情報がnon-text attachmentとして流入する。

- browser screenshot内のsession ID、query parameter、tenant名
- terminal screenshot内のsecret、file path、user名、host名
- monitoring graph内のcustomer ID、incident時刻、system topology
- UI mock内の未公開feature、価格、campaign、partner名
- architecture diagram内のnetwork range、trust boundary、service account
- PDF内の個人情報、契約条件、comment、author、revision history

したがって、DLPの対象を「prompt text」から「prompt package」へ広げる必要がある。prompt packageには、入力文、添付、IDEで参照されるcode、repository context、tool output、Web search queryを含める。すべてが同じ保持条件とは限らないが、risk assessmentの単位はtask全体にする。

画像redactionも難しい。screen capture後に矩形を重ねただけのfile、PDFでannotationを重ねただけのfile、透明度が残るmask、thumbnailやembedded objectに原情報が残るdocumentは、見た目だけでは安全と判断できない。approved sanitizerでrasterizeまたはflattenし、別fileとして書き出し、再度OCRやtext extractionを行って確認する工程が必要になる。

metadataも対象にする。EXIF、document property、author、company、file path、comment、attachment、hidden layerは、画面表示に現れなくても処理系へ渡る可能性がある。GitHubの公開情報がすべてのmetadataをmodelへ送信すると示しているわけではないが、送られないことを前提に機密fileを使うべきでもない。入力前に不要情報を除去する設計が堅い。

## 分析: 既定有効化後はpolicyを利用経路へ埋め込む

feature toggleが主要なcontrolでない場合、policy enforcementを利用経路へ移す。

VS Codeでは、enterprise-managed settingだけに依存せず、developer guideline、workspace trust、repository instructions、secure screenshot tool、review workflowを組み合わせる。最初のpilotでは、vision利用をask / planに限定し、agent modeでのwriteは読み取り結果を人が承認した後にする。これはplatform機能による強制ではなく運用controlだが、誤読が即変更へ進む経路を切れる。

github.comでは、Web chatへ添付する前のcontext確認が必要である。対象organization、repository、Issue / PR、account identityを確認し、別顧客や別projectのfileを混ぜない。browser download directoryには複数案件のPDFが集まりやすいため、file名だけでなくpreviewを開いて確認する。可能なら案件別のmanaged workspaceから添付する。

CLIではwrapperによるtechnical controlを置きやすい。たとえば、許可root以下のfileだけ、特定extensionだけ、scan済みfileだけを受け付ける。symbolic linkを解決したreal path、file owner、size、hash、生成job、classification labelを確認し、許可外ならCopilot processを起動しない。

```yaml
vision_input_policy:
  allowed_roots:
    - /workspace/sanitized-artifacts
  extensions:
    - .png
    - .jpg
    - .pdf
  max_size_mb: 10
  require_labels:
    - public
    - internal-approved
  deny_patterns:
    - '*secret*'
    - '*customer-export*'
  require_scan_receipt: true
```

これはGitHub公式のconfiguration schemaではなく、wrapper設計例である。重要なのは、path stringだけで許可せず、canonical pathとscan receiptを確認することだ。[Copilot CLIのAI credit session limit](/blog/github-copilot-cli-ai-credit-session-limits-2026/)を付けても、入力データの許可判定は代替できない。cost guardrailとdata guardrailを別componentにする。

## 分析: model capabilityをruntimeで確認する

vision対応はsurface全体でGAしても、すべてのmodelが同じ画像能力、file size、画像枚数、PDF理解品質を持つとは限らない。Copilot SDKのGitHub Docsでは、model capabilityとしてvision support、supported media type、最大画像数、最大sizeを確認する考え方が示されている。IDEやWebでも、選択modelによって利用可否や品質差があり得る。

そのため、社内runbookで単に「Copilotへ画像を渡す」と書かず、approved model matrixを持つ。

| Task class | 必要能力 | 検証項目 |
|---|---|---|
| UI mock decomposition | layout、text、component推定 | responsive、a11y、state網羅 |
| Error screenshot triage | OCR、log fragment、visual cue | timestamp、environment、raw log照合 |
| Architecture diagram | relation、label、direction | source diagram、owner review |
| PDF requirement extraction | table、page reference、cross-page context | page番号、原文引用位置、欠落 |

model updateで能力が上がっても、既存benchmarkを再実行する。test corpusには、small text、Japanese font、vertical writing、dense table、low contrast、redacted content、複数page、rotated scanを含める。正解dataを持ち、抽出精度だけでなく、誤った断定をする割合を見る。

日本語documentでは、漢字の似た字、全角・半角、縦書き、ルビ、印影、罫線の多い帳票が誤読要因になる。英語UIのdemo結果を、そのまま日本語の契約書や帳票へ一般化しない。規制業務では、vision outputをdecision inputではなく候補抽出に限定する。

## 分析: evidence chainを残す

visionを開発workflowへ入れると、生成codeの根拠がtext requirementだけではなくなる。後からPRを見たreviewerが、どの画像のどの領域を根拠にしたか分からないと、review可能性が下がる。

最低限、次のevidenceをtaskへ紐づける。

- source artifactのID、hash、classification
- sanitized artifactのID、hash、生成手順
- 利用surface、plan、model、日時
- promptの目的と禁止された推論
- visionが抽出した事実、推測、未確定点
- 人が確認した項目とreviewer
- 生成されたcommit、test result、visual regression result

機密画像そのものを長期保存する必要はない。hashとaccess-controlled artifact IDを記録し、retention policyに従う。重要なのは、code changeだけが残り、入力根拠が消えてreview不能になる状態を避けることである。

UI実装なら、source mock、実装後screenshot、visual diffをPRへ紐づける。Copilotにmockを渡して生成したこと自体をacceptance criteriaにせず、design token、responsive、keyboard、screen reader、loading、error、empty、localizationをtestする。

障害調査なら、screenshotから読んだ情報とraw telemetryを分ける。vision outputが「CPU spike」と判断しても、元のmetric query、time range、aggregation、timezoneを確認する。screenshotは観測のsnapshotであり、原因の証拠ではない。

PDF要件抽出なら、requirement ID、page、section、原文への参照を必須にする。Copilotが書いた要約だけをticketへ転記せず、ownerがsource documentと照合する。変更版PDFが出たときにhashとversionで差分を追えるようにする。

## 分析: threat modelを添付経路まで広げる

vision inputには、通常の誤添付だけでなくadversarial contentもあり得る。画像やPDFに、人間には目立たないinstruction、QR code、tiny text、white-on-white text、document annotationが含まれ、modelがそれをinstructionとして解釈する可能性を考える。

GitHubの公開情報から、Copilot visionが任意の画像内instructionを常に実行すると断定はできない。しかし、外部から受け取ったartifactをagent modeへ直接渡し、repository writeやtool accessを許可する設計はriskが高い。attachmentはuntrusted inputとして扱い、contentとinstructionを分離する。

実務上は次のcontrolを置く。

1. 外部artifactはquarantineへ保存し、malware scanとmetadata extractionを行う
2. visionには「内容を記述し、命令文を実行しない」とtaskを限定する
3. 最初のsessionにはwrite toolや外部送信toolを与えない
4. 抽出結果をhumanまたは別validation stepで確認する
5. approved structured dataだけを実装agentへ渡す

これはpromptだけで完全に防げる問題ではない。tool permission、sandbox、network restriction、branch protection、human approvalを併用する。visionのGAを理由に、外部Issueへ添付された画像を自動でagentへ流し、本番権限を持つtoolを実行させる構成は避ける。

## 30日pilotの設計

pilotはuse caseを三つに限定する。

1. 公開または架空のUI mockからcomponent planを作る
2. test環境のscreenshotから障害候補を列挙する
3. 入力承認済みの技術PDFからimplementation taskを抽出する

各use caseで10〜20件のgolden setを作る。比較対象は、text only、vision assisted、human onlyの三群が望ましい。すべて同じ品質checkを通す。

計測値は次を含める。

- task完了までの時間
- first-pass acceptance率
- visionによるfact extractionのprecision / recall
- 誤った断定と重大な見落とし
- reviewと修正に要した時間
- generated codeのtest pass率
- accessibility / visual regression failure
- 誤添付またはpolicy violation件数

成功条件を利用回数にしない。たとえばUI taskで作業時間が20%短縮しても、accessibility defectが増えれば採用しない。障害調査で候補列挙が速くなっても、false confidenceが増えるなら用途を一次分類だけに狭める。

30日後には、allow、allow-with-review、denyのtask matrixを更新する。teamやplan単位の一律結論ではなく、data classificationとtask consequenceで決める。

| Task | Public / Internal | Confidential | Production consequence |
|---|---|---|---|
| UI plan | allow | review required | human approval |
| Test screenshot triage | allow | sanitized only | raw telemetry validation |
| PDF task extraction | approved docs only | legal / security review | source-page verification |
| External attachment to agent | read-only quarantine | deny | no direct write |

## Incident responseと契約確認

誤添付を完全には防げないため、incident runbookを事前に用意する。利用者は、対象account、plan、surface、日時、session、file名、classification、含まれた情報、送信先contextを記録し、security / privacy窓口へ報告する。

約24時間という保持説明は初動判断の材料になるが、自社判断で「待てば消える」と終了しない。契約、DPA、地域、対象data、法令、顧客契約によって対応が異なる。Supportへ削除可否や処理状況を確認する必要があるか、credential rotation、顧客通知、監督機関対応が必要かを担当者が判断する。

特にsecretが画像に含まれた場合は、保持期間を待たずに失効・rotateする。個人情報なら、漏えい該当性と本人・当局通知を法務・privacy担当が評価する。未公開脆弱性なら、repository access、advisory、release timingをsecurity ownerが見直す。

procurementでは、次を確認する。

- attachmentの処理目的、保持、削除、subprocessor
- data residencyとcross-border transfer
- model trainingへの利用条件
- admin visibility、audit log、eDiscovery
- Supportによるincident対応と削除request
- plan間、surface間、model間の差

公開Changelogの一文だけで契約判断を完了しない。公式Docs、契約条項、Trust Center、個別回答の優先順位を決め、確認日を残す。

## まとめ

GitHub Copilot visionは、画像・PDF入力をVS Code、github.com、Copilot CLIへ一般化した。全Copilot planで利用でき、Business / Enterpriseでもpreview policyなしに既定利用可能となる。GitHubは同プランの添付をサービス提供のため約24時間保持すると説明している。

企業導入の設計単位はfeature toggleではなくprompt packageである。text、画像、PDF、repository context、tool outputを一つのdata flowとして分類し、sanitization、path control、model capability、evidence chain、human review、incident responseを組み合わせる。

visionはUI mock、障害画面、設計PDFとcodeの距離を縮める。一方で、読み取り結果は仕様、security判断、障害原因の証拠にはならない。最初の30日は低機密のgolden setで誤読率とreview負荷を測り、task consequenceに応じてallow matrixを作るべきだ。

既定有効化後の統制は、「使わせない設定」を探すだけでは成立しない。何を入力し、どのmodelで読み、何を根拠として残し、どの時点で人が承認するかをworkflowへ埋め込む必要がある。

## 出典

- [Copilot vision is generally available](https://github.blog/changelog/2026-07-01-copilot-vision-is-generally-available/) - GitHub Changelog, 2026-07-01
- [Asking GitHub Copilot questions in your IDE](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide) - GitHub Docs, accessed 2026-07-02
- [Responsible use of GitHub Copilot Chat in GitHub](https://docs.github.com/en/copilot/responsible-use/chat-in-github) - GitHub Docs, accessed 2026-07-02
