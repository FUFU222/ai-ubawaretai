---
article: 'openai-eu-ai-act-transparency-governance-2026'
level: 'expert'
---

OpenAI が 2026年7月31日に公開した「Advancing responsible AI across Europe」は、単なる政策ブログではない。EU AI Act の透明性義務と GPAI 実装フェーズに合わせて、OpenAI が顧客、規制当局、開発者へ提示する evidence package を整理したものとして読むべきだ。日本企業が OpenAI API、ChatGPT Enterprise、Codex、Workspace Agent 的な業務AI、生成コンテンツ制作を欧州向けに使うなら、この更新は調達、法務、セキュリティ、広報、AI CoE の共通チェックリストになる。

論点は3つに分けられる。第一に、GPAI Code of Practice と system cards、Preparedness Framework、Frontier Governance Framework の関係である。第二に、AI生成コンテンツの透明性と provenance の実装である。第三に、cybersecurity のような dual-use 領域で、高度モデルへの安全なアクセスと悪用抑止をどう両立するかである。

この更新は、既存の [OpenAI C2PA対応で画像AIの出所確認は実務化するか](/blog/openai-c2pa-synthid-provenance-2026/) の続編として読むと分かりやすい。C2PA や SynthID は表示義務に対する一部の技術的手段であり、EU AI Act 対応全体ではない。また、[OpenAI Bio Bounty、GPT-5.6安全審査の実務](/blog/openai-bio-bounty-gpt56-safety-review-2026/) や [OpenAI GPT-Red、自動レッドチームで安全運用を再設計](/blog/openai-gpt-red-prompt-injection-robustness-2026/) で見たように、OpenAI の安全対応は、モデル公開前評価、外部テスト、継続レッドチーミング、顧客向け文書を組み合わせる形へ寄っている。

## 事実: EU AI Actの8月2日フェーズ

European Commission は、2026年8月2日から AI Office と加盟国当局が AI Act の実装、監督、執行を担うと説明している。AI Office は GPAI model に対して、技術文書の要求、モデル評価、是正措置、違反時の fines などの権限を持つ。高リスクAIシステムの一部は後年に移るが、透明性ルールとGPAIまわりはすでに実務上の確認対象になっている。

同じ 2026年8月2日から、新しい transparency requirements も始まる。chatbot などの対話型AIでは、ユーザーがAIとやり取りしていることを知らせる必要がある。deepfake など、AIで生成・編集された画像、動画、音声にはラベルが必要になる。AI生成・編集コンテンツには、機械可読な mark を持たせ、検出しやすくすることも求められる。

GPAI Code of Practice は、AI Act の義務を実務に落とす任意準拠ツールとして位置づけられている。European Commission のページでは、Transparency、Copyright、Safety and Security の3章が示され、OpenAI は signatory に含まれている。ここで重要なのは、Code が任意だから無視できるという話ではない。むしろ、モデル提供者、deployers、顧客企業、監査人が同じ観点で質問するための共通語になり得る。

OpenAI の Help Center も同日に実務寄りの記述を置いている。OpenAI は EU AI Act に準拠するモデル開発と、顧客が自分たちの compliance を管理するための情報提供に取り組むと説明している。一方で、記事は一般情報であり legal advice ではなく、顧客、開発者、利用者は自分たちに適用される義務を評価し、遵守する責任があるとも明記している。

## OpenAIのevidence package

OpenAI が7月31日の記事で並べた材料は、単なるブランドメッセージではない。System cards はモデル公開時の能力、安全評価、制限を読む資料になる。Model Spec はモデル挙動をどう設計するかの説明になる。Preparedness Framework は重大リスクの識別・評価・管理の枠組みであり、Frontier Governance Framework はそれを EU AI Act の GPAI Code などの法的要求へ接続する。

Red Teaming Network、外部専門家、third-party evaluation、Frontier Model Forum も重要である。AI Act 対応の文脈では、内部評価だけではなく、外部の目を入れているか、評価標準づくりに参加しているか、systemic risk をどのように検証しているかが調達上の論点になる。OpenAI がすべての詳細を公開するわけではないとしても、公開資料から確認できる範囲、顧客がリクエストできる範囲、NDA下で共有され得る範囲を分けて見る必要がある。

OpenAI Help Center は、EU AI Act model documentation のリクエスト、Copyright Chapter に関する complaint、security incident reporting への導線も示している。これは日本企業にとってかなり実務的だ。グローバル調達では「ベンダーがEU対応済みか」を Yes/No で聞くのではなく、「必要な documentation を誰が、いつ、どの契約条件で取得し、誰がレビューするか」を運用として決めるべきである。

## Provenanceは制作・配信工程の問題である

OpenAI は、AI生成コンテンツの transparency について、Content Credentials、C2PA、SynthID watermarking、public verification tool preview、Content Provenance API を挙げている。これは重要な進歩だが、企業運用では誤解しやすい。C2PA や watermark が存在しても、すべての編集、圧縮、アップロード、転載、スクリーンショット、二次加工で signal が維持されるとは限らない。

したがって、企業が管理すべき対象は「OpenAI が provenance signal を付けるか」だけではない。誰がAI生成物を作ったか。どのモデルやツールを使ったか。どの素材を入力したか。どの編集工程を通したか。掲載先は欧州向けか。人間の編集がどの程度入ったか。表示文言は誰が承認したか。これらを CMS、DAM、広告運用、SNS運用、代理店契約に落とさなければならない。

特に日本企業では、制作会社、翻訳会社、広告代理店、現地販売会社、フランチャイズ、販売代理店が関わることが多い。AI生成画像を本社が作り、代理店がトリミングし、欧州現地法人がSNSに投稿する場合、最終掲載時点で provenance metadata が消えている可能性がある。技術的な signal と、表示義務を満たすための人間のレビューは別に持つべきだ。

テキストも軽視できない。EU の透明性ルールは、public interest に関するテキストやユーザーがAIと対話していることの表示にも関わる。生成AIが作ったプレスリリース、FAQ、政策説明、金融・保険・医療・公共性のある情報では、AI利用の表示、編集責任、根拠確認をどう扱うかが問題になる。OpenAI の provenance tool は主に signal の検出を助けるが、編集責任まで自動で決めてくれるわけではない。

## サイバー用途は防御目的でも統制が要る

OpenAI は、cybersecurity を governance in practice の例として挙げ、Trusted Access for Cyber によって legitimated defenders へ高度モデルを届ける方向を説明している。EU 側の Cybersecurity and AI Action Plan も、AI は脆弱性検出、攻撃防止、重要インフラ保護に役立つ一方、攻撃の自動化、弱点発見、サイバー作戦の高速化にも使われ得ると整理している。

日本企業の SOC、CSIRT、MDR、脆弱性診断会社、製品セキュリティチームにとって、この論点は現実的である。AI に advisory を要約させる、検知ルールの草案を作らせる、ログを分類させる、脆弱性レポートを優先度付けすることは防御に役立つ。一方で、PoC exploit、credential theft、外部攻撃手順、顧客環境への自動操作に近づくほど、承認と隔離が必要になる。

防御目的だから何でも許す、という設計は危険である。必要なのは、利用者資格、対象環境、入力してよいデータ、出力してよい内容、外部ネットワークへの操作、顧客への共有、インシデント時のログ保存を分けることだ。OpenAI の Trusted Access for Cyber や EU Action Plan を読む価値は、特定の製品機能よりも、この dual-use domain を別枠で管理する発想にある。

## 日本企業の調達質問票に入れる項目

第一に、GPAI と high-risk use の切り分けを聞く。自社が使うモデルは GPAI 義務の対象か。利用企業側は deployer としてどの義務に触れる可能性があるか。高リスク用途に近いユースケースを提供側はどう分類しているか。採用、人事評価、教育、医療、与信、保険、公共サービス、監視、biometric、emotion recognition に近い用途は別枠にする。

第二に、公開文書と顧客向け文書を分ける。system card、training content summary、safety approach、usage policy、Frontier Governance Framework は公開情報として読める。一方で、契約顧客だけが受け取れる model documentation、security documentation、DPA、subprocessor list、incident reporting procedure もある。レビュー担当は法務だけでなく、セキュリティ、AI CoE、事業部門を含めるべきだ。

第三に、provenance と表示の責任範囲を確認する。OpenAI が C2PA、SynthID、verification tool、Content Provenance API を提供しても、自社の表示義務や最終掲載時の検知可能性は別問題である。APIやChatGPTで生成した画像・音声・動画・テキストをどの媒体に出すか、metadata が消えた場合に表示で補うか、代理店へ何を要求するかを契約に入れる。

第四に、禁止用途と監査ログを確認する。OpenAI Help Center は、EU AI Act の prohibited practices の例として、操作・欺瞞、脆弱性の悪用、social scoring、職場・教育での emotion recognition、facial recognition database の untargeted scraping、sensitive characteristics の biometric categorisation などを示している。企業側は、これらに近い社内利用を検知し、止め、教育できるかを確認する。

第五に、モデル更新時の再審査を決める。GPT-5.6 やその後のモデルは、能力、拒否挙動、tool use、provenance、価格、ログ条件が変わり得る。[OpenAI Bio Bounty、GPT-5.6安全審査の実務](/blog/openai-bio-bounty-gpt56-safety-review-2026/) で見たように、安全検証の対象モデルが変わること自体が運用イベントである。自動ルーティングやモデル置換があるなら、重要業務では regression test と stakeholder review を挟むべきだ。

## 社内運用へ落とす順番

最初に作るべきものは、AI利用台帳である。EU向け、国内向け、社内向けを分け、利用部署、ツール、モデル、入力データ、出力物、対象ユーザー、掲載先、human review、ログ保存、表示要否を記録する。完璧なGRCシステムから始める必要はないが、少なくとも生成コンテンツと顧客接点AIは一覧化する。

次に、生成コンテンツの表示テンプレートを作る。画像、動画、音声、テキスト、chatbot、FAQ、広告、営業資料、採用文書、教育資料ごとに、表示が必要な場面と承認者を決める。公共性がある情報や、ユーザーが人間と誤解しやすい体験では、表示を後回しにしない。

第三に、vendor questionnaire を更新する。OpenAI 用だけでなく、Anthropic、Google、Microsoft、AWS Bedrock、GitHub Copilot、国内LLM事業者にも使える形にする。[Anthropic RSP 3.3はバイオリスク閾値をどう変えたか](/blog/anthropic-rsp-33-biorisk-threshold-governance-2026/) のように、各社の risk framework は違う。質問票では、モデル名よりも、文書、評価、顧客制御、通知、ログ、provenance、禁止用途を比較する。

第四に、サイバー・医療・採用・金融・教育のような sensitive domain を別の承認フローにする。これはEU対応だけでなく、日本国内の信頼性にも効く。AIを使ってよい下書き、専門家レビューが必要な分析、禁止すべき推定、顧客へ送る前に承認が必要な出力を分ける。AIが出力したことを、承認済み判断とみなしてはいけない。

## 結論

OpenAI の EU AI Act 対応整理は、AIベンダーが規制対応を製品外の補足資料としてではなく、モデル提供の一部として提示し始めたことを示している。system cards、Frontier Governance Framework、provenance tools、Trusted Access for Cyber、customer guidance は、これからのAI調達では標準的な確認対象になる。

日本企業は、EU法務の専門家だけにこの話を預けるべきではない。法務は義務判断を担うが、実際にAIを使うのは事業部門、開発、広報、CS、セキュリティ、代理店である。必要なのは、法令名を覚えることではなく、AI接点を棚卸しし、表示し、記録し、禁止用途を止め、モデル更新時に再審査する運用である。

OpenAI の資料は、その運用を作るための材料になる。ただし、材料は材料である。最終的に説明責任を果たすのは、AIを自社サービス、業務、コンテンツ、顧客接点へ組み込む企業自身である。

## 出典

- [Advancing responsible AI across Europe](https://openai.com/index/advancing-responsible-ai-across-europe/) - OpenAI, 2026年7月31日
- [EU AI Act: OpenAI Resources and Customer Guidance](https://help.openai.com/en/articles/12141645-eu-ai-act) - OpenAI Help Center, 2026年7月31日確認
- [The General-Purpose AI Code of Practice](https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai) - European Commission, 2026年7月31日確認
- [AI Act](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) - European Commission, 2026年7月31日確認
- [Commission starts enforcing AI Act rules and new transparency requirements on 2 August](https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august) - European Commission, 2026年7月31日
- [EU Action Plan on Cybersecurity and Artificial Intelligence](https://digital-strategy.ec.europa.eu/en/library/eu-action-plan-cybersecurity-and-artificial-intelligence) - European Commission, 2026年7月7日
