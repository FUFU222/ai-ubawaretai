---
article: 'github-copilot-targeted-model-rules-2026'
level: 'expert'
---

GitHub Copilotのmodel rules公開プレビューは、Copilot管理の焦点が「モデルを追加する」段階から「どの組織にどのモデルを許可するか」へ移っていることを示す更新だ。2026年5月26日のGitHub Changelogは短いが、Copilot Business/Enterpriseを複数organizationで運用している会社にはかなり重要である。

この更新は、直近のCopilotモデル運用の流れの中で読む必要がある。[Copilot Webモデル削減](/blog/github-copilot-web-models-limited-2026/)では、Web上のモデル選択肢が管理上の都合で絞られた。[Copilot Auto選択](/blog/github-copilot-auto-model-selection-vscode-2026/)では、利用者が毎回モデルを選ぶのではなく、許可された範囲でCopilotがモデルを選ぶ方向が強まった。[AI Credits使用量レポート](/blog/github-copilot-ai-credits-usage-report-2026/)では、モデル利用が部門予算や管理者説明と直結することが明確になった。model rulesは、この3つをenterprise管理の粒度で接続する。

## 事実整理: enterprise ownerがorganizationを狙ってモデルを許可する

GitHub Changelogによると、model rulesはCopilot BusinessとCopilot Enterpriseのenterprise owner向け公開プレビューで、特定organizationに対してCopilotモデルをtargetできる。従来のenterprise-wide default model設定を補完し、組織ごとに異なるモデル構成を与えられる。

Docs側のdefault model availability管理では、enterprise ownerがenterprise settingsからCopilotのModelsへ進み、モデルごとの可用性を管理する流れが説明されている。モデルは企業全体で有効化、無効化、未設定の状態を取り得る。さらに、organization ownerが自組織で選べるoptional modelの扱いもある。

organization側のDocsでは、organization ownerがCopilot model policyを管理できることも示されている。つまり、model rulesはenterprise ownerが上位からモデル候補や既定を設計し、organization ownerが現場の運用に合わせるという二層構造の中に入る。ここを誤解して「本社が全てを固定する機能」と見ると、導入設計を間違える。

また、公開プレビューである点も重要だ。現時点では、正式版と同じSLAや長期仕様を前提にした統制基盤として過信すべきではない。だが、管理設計の方向性は明確だ。Copilotは、個人のIDE拡張から、enterprise AI governanceの管理対象へ移っている。

## organization粒度が必要になる理由

大企業のGitHub Enterpriseでは、organizationは単なるチーム分けではない。事業責任、データ分類、委託先参加、地域、予算、監査の境界になることがある。AIモデル利用も、その境界に合わせないと説明が崩れる。

たとえば、同じ会社の中でも、研究開発organizationは新モデルを早く検証したい。社内基盤organizationは安定性と保守性を重視する。金融系顧客を持つorganizationはデータ取り扱いや監査の説明を重視する。委託先が入るorganizationでは、高倍率モデルの費用だけでなく、ソースコードやプロンプトの取り扱いも保守的にしたい。

enterprise-wide defaultだけだと、この差を吸収しにくい。全社で厳しくすると、PoCや先進チームの検証速度が落ちる。全社で緩くすると、制約の強い組織に過剰なリスクを持ち込む。organization単位のmodel rulesは、標準と例外を明示的に分けるための現実的な粒度だ。

この粒度は、[CopilotデータレジデンシーとFedRAMP](/blog/github-copilot-data-residency-fedramp-2026/)のような地域・準拠性の論点とも相性がよい。データレジデンシーや規制要件は、全社一律ではなく、対象顧客、契約、部署、地域で変わる。モデル許可も同じ粒度に近づけるほうが、監査時の説明が通りやすい。

## model rulesとAuto model selectionの関係

model rulesは、Auto model selectionの意味を変える。

Autoは、利用者が明示的にモデルを選ばなくても、Copilotが状況に応じてモデルを選ぶ機能だ。ただし、Autoは無制限に全モデルを見ているわけではない。プラン、管理者ポリシー、データレジデンシー、FedRAMPなどの制約に従う。つまり、管理者が許可した探索空間の中で自動選択が起きる。

model rulesでorganizationごとに許可モデルが変わると、同じ「Auto」を選んでも、実際の候補集合はorganizationごとに違う可能性がある。これは企業運用では重要だ。現場には「Autoは会社が許可した範囲での自動選択」と説明しなければならない。単に「GitHubが最適なモデルを選ぶ」と説明すると、なぜ部署によって結果や品質が違うのかを説明できなくなる。

また、Autoを標準レーンにするなら、model rulesはその標準レーンを部門別に調整するための機能になる。一般開発organizationでは0xから1x中心のモデルをAuto候補に置く。高度なAI活用チームでは上位モデルを明示選択できるようにする。機密性の高いorganizationでは、Auto候補を保守的に絞る。このように、Autoとmodel rulesは競合する機能ではなく、標準運用と組織別制約を組み合わせる関係にある。

## AI Creditsと部門予算への影響

Copilotのモデル統制は、技術設定であると同時に予算管理でもある。

AI Creditsやpremium requestの消費は、モデル、利用面、タスク量で変わる。モデルルールを持たない状態で高倍率モデルを全社に開けると、コスト増の原因が「誰が、どのorganizationで、何のために使ったか」まで追いにくくなる。特に日本企業では、部門予算、プロジェクト別原価、委託先費用、顧客別採算の説明が必要になりやすい。

model rulesを使う場合、organization設計と予算責任を近づけるべきだ。予算責任者が同じなら、同じmodel ruleを適用しやすい。予算責任が違うのに同じorganizationを使っているなら、モデル課金の前にGitHub organization設計を見直す必要がある。

実務では、次の3種類のレーンを作ると扱いやすい。

標準レーンは、日常のCopilot Chat、軽い実装相談、テスト追加、ドキュメント更新を対象にする。Autoまたは低倍率モデルを基本にし、広いorganizationに適用する。

例外レーンは、障害の根因分析、大規模リファクタリング、セキュリティ修正方針、設計比較、複数リポジトリ変更を対象にする。高性能モデルを許可するが、利用理由をチケットやPRに残す。

制限レーンは、顧客データ、規制業務、委託先参加、機密リポジトリを対象にする。モデル候補を絞り、社内のAI利用規程とリポジトリ権限を合わせる。

この3分類をorganization単位で表現できるなら、model rulesの導入価値は高い。逆に、organizationと実際の責任境界がずれているなら、model rulesを細かく作っても運用は安定しない。

## 導入設計: 先にモデルではなく組織を棚卸しする

導入時に最初に見るべきなのは、モデル名ではない。organizationの用途と責任境界だ。

まず、Enterprise配下のorganizationを一覧化する。各organizationについて、主要なリポジトリ、データ分類、外部メンバー有無、予算責任者、AI利用の成熟度、Copilot利用面を確認する。ここで「誰も責任者が説明できないorganization」が出るなら、model rules以前にガバナンスの問題がある。

次に、現在のdefault model availabilityを棚卸しする。どのモデルが全社でEnabledか、どれがDisabledか、どれがorganization ownerのoptional modelとして扱われているかを確認する。GitHub Docsの手順に沿ってenterprise settingsとorganization settingsを見比べると、意図しない解放や過剰な制限が見つかる可能性がある。

3つ目に、model ruleの初期分類を作る。最初から10種類以上に分けるべきではない。標準、検証、制限の3種類から始める。標準は多くの開発組織、検証はAI推進や開発基盤、制限は規制・機密・委託先を含む組織に割り当てる。

4つ目に、例外申請の手順を作る。高性能モデルを使いたいorganizationが出たとき、誰が承認するのか、期間はどれくらいか、利用後に何をレビューするのかを決める。モデルルールは永続的な許可だけでなく、期間限定の検証にも使うべきだ。

5つ目に、利用量と品質を見直す。AI Creditsの消費だけでなく、PRの手戻り、レビューコメント、CI失敗、開発者満足度、障害対応時間を合わせて見る。モデルを絞った結果、コストは下がったが手戻りが増えたなら失敗だ。高性能モデルを開けた結果、費用は増えたが障害対応が短くなったなら合理的かもしれない。

## 監査と説明責任

model rulesの最大の価値は、監査時の説明を組み立てやすくすることにある。

「全社でCopilotを使っています」だけでは、AI利用の説明として粗すぎる。監査や顧客説明で問われるのは、どのデータを扱う組織が、どのAI機能を、どの制約の下で使っているかだ。model rulesは、少なくともモデル許可の面でこの説明を組織別に分けられる。

ただし、model rulesだけでは十分ではない。リポジトリ権限、branch protection、secret scanning、MCPやcloud agent設定、Actions承認、監査ログ、社内AI利用規程と合わせる必要がある。モデルを絞っても、権限が広すぎればリスクは残る。逆に、権限が適切でもモデル許可が無秩序なら、費用と品質の説明が難しくなる。

ここで重要なのは、設定値だけでなく判断根拠を残すことだ。なぜこのorganizationは高性能モデルを使えるのか。なぜこのorganizationは制限されているのか。いつ見直すのか。誰が承認したのか。これを残しておけば、将来モデル名が変わっても運用方針を引き継げる。

## 失敗しやすいパターン

失敗しやすいのは、model rulesを「全社のAI利用を一発で安全にする機能」と捉えることだ。実際には、これは境界を表現する機能であり、境界そのものを設計するのは企業側である。

もうひとつの失敗は、モデル名ベースで細かく作りすぎることだ。モデル追加や廃止は今後も続く。モデル名ごとの個別ルールを増やしすぎると、変更のたびに管理者が追いかけることになる。ルールの主語はモデル名ではなく、組織の用途とリスク分類に置くべきだ。

3つ目は、現場への説明不足だ。開発者から見ると、ある日突然使えるモデルが変わるだけに見える可能性がある。管理者は、「標準作業はAuto」「高難度作業は申請済みモデル」「制限organizationでは承認モデルのみ」という短いルールを出す必要がある。長い管理規程だけでは定着しない。

## 結論

GitHub Copilot model rulesは、Copilotのモデル管理をenterprise-wideな一括設定からorganization単位の統制へ進める更新だ。公開プレビューではあるが、方向性は明確で、GitHubはCopilotを企業内のAI利用統制に耐える管理対象へ寄せている。

事実として、Copilot Business/Enterpriseのenterprise ownerは、organizationを対象にCopilotモデルの利用可否を設定できる。Docsのdefault model availabilityやorganization-level model policyと合わせることで、標準モデル、optional model、組織別例外を設計できる。

分析として、日本企業はmodel rulesを、AI Creditsの部門配賦、委託先organizationの制限、規制業務の保守運用、PoCチームの例外開放を分けるために使うべきだ。鍵は、モデル名ではなくorganizationの責任境界から設計することだ。

Copilotのモデル選択は、すでに個人の好みの問題ではない。モデルが増え、Autoが広がり、課金と監査が絡むほど、企業は「誰にどのモデルを許すか」を明示する必要がある。model rulesは、そのための実務的な制御点になる。

## 出典

- [Target Copilot models to organizations with model rules](https://github.blog/changelog/2026-05-26-target-copilot-models-to-organizations-with-model-rules/) - GitHub Changelog, 2026-05-26
- [Managing availability of default models](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) - GitHub Docs
- [Managing default models](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-default-models) - GitHub Docs
