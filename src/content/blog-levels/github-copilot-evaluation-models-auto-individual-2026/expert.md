---
article: 'github-copilot-evaluation-models-auto-individual-2026'
level: 'expert'
---

GitHub Copilotの2026年6月1日更新で、個人向け非EnterpriseユーザーのAuto model selectionにevaluation modelsが入り得ることが明示された。Changelogは短いが、運用上の意味は大きい。個人ユーザーはCopilot settingsで無効化できる一方、Autoを使い続ける場合は「どのモデルが選ばれたか」「その出力をどの基準で採用するか」を自分で管理する必要がある。

この論点は、企業の管理者設定だけでは閉じない。[Copilot model rulesで組織別AI統制を行う設計](/blog/github-copilot-targeted-model-rules-2026/)はBusiness / Enterprise側の話だが、個人契約のCopilotは個人設定が中心になる。日本企業で個人契約のCopilotを学習、OSS、副業、検証、社内持ち込みの相談に使う場合、会社のAI利用規程との接点を明確にしなければならない。

また、[Copilot Auto選択のVS Codeタスク最適化](/blog/github-copilot-auto-model-selection-vscode-2026/)や[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)で見たように、Autoは利便性と費用効率のための入口になっている。evaluation modelsの追加は、その入口に評価段階のモデルが混ざり得ることを意味する。便利さと検証責任を同じ箱に入れない設計が必要だ。

## 事実関係の整理

GitHub Changelogは、GitHub Copilotが個人向け非Enterpriseユーザーにevaluation modelsへのアクセスを提供し、これらのモデルがCopilot auto model selectionで配信される可能性があると説明している。無効化するには、GitHub Copilot settingsから設定を変更する。

GitHub DocsのSupported AI modelsページは、evaluation modelsについてより具体的に説明している。これらのモデルは製品上で正式名ではなくコードネームで表示される場合がある。由来はMicrosoft、OpenAI、Anthropic、Googleのいずれか、または複数で、GitHubとproviderの既存契約の範囲でdata handlingが行われる。さらに、GitHubとMicrosoftによるtesting and verificationを経てreleaseされるとされている。

一方で、Docsは重要な制約も明記している。evaluation modelsは、security-relatedなプロンプトやその他のカテゴリで、他のモデルより性能が低い場合がある。したがって、生成されたコード、特にコードセキュリティについては、productionに取り込む前に慎重なレビューと検証が求められる。複数モデルによる確認と人間レビューを組み合わせるべきだという趣旨だ。

Auto model selection側のDocsでは、AutoがすべてのCopilot planで利用可能で、タスク複雑度、system health、availabilityを見てモデルを選ぶ仕組みだと説明されている。VS CodeのCopilot Chatではtask optimizationが一般提供されており、Chat、CLI、cloud agentではAutoがモデルのhealthやperformanceを見て選択する。paid planでは、Chat、CLI、cloud agentのAuto利用時にモデルコストの10% discountもある。

ただし、Autoは任意のモデルを自由に選ぶわけではない。Docsは、Autoがsupported modelsから選ぶ際に、plan、subscription type、administrator policies、data-resident / FedRAMP-compliant model restrictions、evaluation modelsを制限するpolicyの影響を受けると説明している。今回の変更は、この「evaluation modelsを制限するpolicy」が個人ユーザーにも実務上重要になることを示している。

## リスクはモデル品質だけではない

evaluation modelsのリスクを「精度が低いかもしれない」だけで捉えると狭すぎる。実務では、品質、セキュリティ、説明責任、再現性、費用、社内統制が重なる。

品質面では、同じpromptでも一般提供モデルと評価モデルで回答の傾向が変わる可能性がある。設計レビュー、リファクタリング、テスト生成では、出力の文体や自信度よりも、前提条件の扱い、境界ケース、既存コードへの追従が重要になる。評価モデルが速く見えても、レビューで戻りが増えるなら全体の生産性は落ちる。

セキュリティ面では、Docsが明示する通り、security-related promptで他モデルより低い性能を示す場合がある。認可条件、入力検証、ログの秘匿、暗号化、依存関係の脆弱性対応、Secretsの取り扱いでは、評価モデルの出力を採用する前に別軸の検証が必要だ。ここでいう検証は、もう一度AIに聞くことだけではない。テスト、静的解析、コードレビュー、脅威モデルの確認が必要になる。

説明責任面では、モデルがコードネームで表示される場合がある点が厄介だ。社内レビューや障害調査で「どのモデルの出力を採用したか」を聞かれたとき、正式なprovider名やモデル名が見えないことがある。個人開発なら許容できても、顧客案件や監査対象システムでは説明しにくい。

再現性面でも注意が要る。Docsは、evaluation modelsが予告なく追加・更新・削除され得ると説明している。今日のAutoで選ばれたモデルが、来週も同じ候補にあるとは限らない。バグ修正や設計検討の根拠として残すなら、モデル名またはコードネーム、利用日、対象タスクを記録するほうがよい。

費用面では、Autoの10% discountとAI Creditsの消費を切り分けて考える必要がある。[Copilot使用量レポートでAI Credits予算を確認する方法](/blog/github-copilot-ai-credits-usage-report-2026/)を整えている組織でも、個人契約の利用は会社のusage reportに載らない場合がある。個人の費用最適化と会社の費用統制は同じ画面では見られない。

## 日本企業で起きやすい3つの運用ずれ

1つ目は、会社契約と個人契約の混在だ。会社はEnterpriseでmodel availabilityを管理しているが、開発者は個人契約でもCopilotを持っている。会社コードは会社契約で扱うべきだが、私物端末や個人GitHubアカウントの習慣で、境界が曖昧になることがある。

2つ目は、Autoの意味の誤解だ。現場では「AutoならGitHubがよいモデルを選ぶ」と理解されやすい。これは大筋では正しいが、今回の更新後は「Autoの候補にevaluation modelsが含まれる設定か」を確認する必要がある。Autoは責任を消す機能ではなく、選択を自動化する機能だ。

3つ目は、セキュリティレビューの省略だ。AIが生成したコードは人間が読むという原則は浸透しつつあるが、評価モデルを使った場合の追加確認までは決まっていない会社が多い。特に、修正対象がセキュリティに近いときほど、モデル出力をすぐ反映する運用は危険になる。

この3つは、禁止だけでは解決しない。個人開発者が新モデルを試すこと自体は、モデル理解を高める。企業にとっても、現場が早くモデル差を知ることには価値がある。必要なのは、検証用の利用と本番採用の利用を分けることだ。

## 個人開発者向けの実務手順

まず、GitHubのSettingsからAI controlsを開き、Evaluation models in Copilot auto model selectionの状態を確認する。無効化したい場合はDisabledを選ぶ。評価モデルを試したい場合でも、どのリポジトリ、どの種類の作業で試すかを決めておく。

次に、重要な作業ではAutoで使われたモデルを確認する。Copilot Chatでは応答上の表示、Copilot CLIではterminalの表示、cloud agentでは応答末尾の表示を見る。コードネームや見慣れないモデル名が出た場合、その出力には「評価モデル由来かもしれない」というラベルを頭の中で付ける。

3つ目に、採用基準を変える。通常の補完や軽い説明なら、その場で判断してもよい。しかし、認証、認可、セキュリティヘッダー、暗号、個人情報、SQL、依存関係更新、CI/CD、決済、ログ出力では、別モデルでの再確認やテスト追加を行う。AIの回答が自然でも、セキュリティ上正しいとは限らない。

4つ目に、会社コードを扱う場合は会社の契約と規程を優先する。会社がCopilot Business / Enterpriseを提供しているなら、会社コードはその環境で扱う。個人契約のCopilotで社内コードを扱う必要がある場合は、事前に許可範囲を確認し、少なくともevaluation modelsをDisabledにしておくのが保守的だ。

5つ目に、学習用と本番用のpromptを分ける。学習やOSSでは評価モデルの挙動を観察してもよい。本番コードでは、差分を小さくし、テストを書き、レビュー可能な形にする。評価モデルを使うなら、探索には使っても、最終判断は別の安定モデルと人間レビューに戻す。

## 管理者向けの実務手順

管理者は、まず社内規程に「個人契約のAI開発ツール」を明示的に入れるべきだ。会社契約のCopilotだけを対象にした規程では、個人アカウントの利用が抜ける。個人契約の利用を完全に禁止するのか、学習やOSSに限って許すのか、社内コードへの利用条件を設けるのかを短く書く。

次に、会社支給のCopilotではmodel availabilityを確認する。Enterprise ownerは、default modelsのavailabilityを選び、targeted model rulesでorganizationごとに許可モデルを制御できる。これは個人プランのevaluation models設定とは別の統制だが、社内の標準環境を明確にすることで、個人契約へ逃げる理由を減らせる。

3つ目に、レビュー基準を更新する。AI生成コード全般のレビュー基準に加えて、evaluation modelsを使った場合の扱いを決める。たとえば、セキュリティ関連の修正では、使用モデルをPRに記録する、静的解析とテストを必須にする、レビュー担当者を増やす、といった軽いルールでよい。

4つ目に、教育資料を短くする。開発者に長い規程を読ませるより、「Autoは候補が変わる」「評価モデルは無効化できる」「会社コードは会社契約で扱う」「セキュリティ修正は別モデルと人間レビューで確認する」という4点を伝えるほうが実効性が高い。

5つ目に、費用管理と品質管理を分ける。AI Creditsやbudgetは、利用量と費用の統制に効く。一方、evaluation modelsの可否は、品質と説明責任の統制に効く。費用が安いから許す、費用が高いから禁止する、という判断だけでは足りない。

## 判断基準

evaluation modelsを許すかどうかは、作業のリスクで分けるとよい。

低リスクなのは、個人学習、OSSでの探索、技術メモ、簡単なサンプルコード、テスト対象外のプロトタイプだ。この領域では、評価モデルの挙動を知ること自体に価値がある。出力を捨てやすく、失敗の影響も小さい。

中リスクなのは、社内ツールの補助、既存コードの説明、リファクタリング案、テスト案の生成だ。ここでは、出力を直接採用せず、差分を人間が理解できる範囲に留める必要がある。

高リスクなのは、顧客データ、認証・認可、決済、法務・労務・医療・金融に近い判断、セキュリティ脆弱性修正、本番障害対応だ。この領域では、評価モデルをDisabledにするか、探索だけに使い、採用判断を安定モデルと人間レビューに戻すべきだ。

この基準は、Copilotに限らない。だが、CopilotはIDE、CLI、cloud agentに深く入り、開発フローの中で自然に使われる。だからこそ、モデル選択の責任を「あとで考える」状態にしないほうがよい。

## まとめ

GitHub Copilotのevaluation modelsが個人プランのAuto model selectionに入り得る変更は、個人開発者に設定確認を促す更新だ。無効化はGitHub Copilot settingsからできる。Autoは便利で、タスク最適化やコスト効率の利点もあるが、評価モデルが含まれる場合は、品質・セキュリティ・説明責任の扱いを明確にする必要がある。

日本企業にとっては、会社契約のCopilot統制だけでは足りない。個人契約のBYO利用、社内コードの扱い、evaluation modelsの可否、セキュリティ修正時のレビュー基準を短く決めるべきだ。個人開発者にとっては、新しいモデルを試す自由と、本番コードへ採用する責任を分けることが重要になる。

## 出典

- [Evaluation models in auto for individual plans](https://github.blog/changelog/2026-06-01-evaluation-models-in-auto-for-individual-plans/) - GitHub Changelog, 2026-06-01
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [About Copilot auto model selection](https://docs.github.com/en/copilot/concepts/models/auto-model-selection) - GitHub Docs
- [Managing availability of default models](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) - GitHub Enterprise Cloud Docs
