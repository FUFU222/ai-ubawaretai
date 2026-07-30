---
article: 'github-copilot-default-model-enablement-policy-2026'
level: 'expert'
---

GitHub Copilotのdefault model enablementは、モデル一覧の小さな管理変更に見えるが、Enterprise運用では承認モデル管理の前提を変える。2026年8月26日以降、Copilot Business / Enterpriseで管理者がまだ明示設定していない一般提供モデルは、企業または組織のdefault policyへ従う。

この変更は、Copilotのモデル供給が増え続ける前提で読むべきだ。GitHub Copilotは、OpenAI、Anthropic、Google、xAI、Microsoftなど複数providerのモデルを、IDE、CLI、Copilot app、cloud agent、code reviewなど複数surfaceへ出している。日本企業の管理者は、モデルを「追加されたら承認する」だけでは追いつきにくい。

既存の[Copilot model rules](/blog/github-copilot-targeted-model-rules-2026/)は、enterprise-wide defaultだけでは粗いモデル統制をorganization単位へ下ろす話だった。[Grok 4.5 Copilot提供](/blog/github-copilot-grok-45-model-policy-2026/)は、新モデルごとのprovider、料金、client差を扱った。[Copilot app統制](/blog/github-copilot-app-policy-managed-settings-2026/)は、モデルが実際に使われるagent clientの管理面を整理した。今回のdefault model enablementは、それらを束ねる「既定と例外」の設計問題である。

## 事実: 未設定モデルはdefault policyを継承する

GitHubのChangelogでは、2026年8月26日から、Copilot BusinessとEnterpriseの一般提供モデルのうち、管理者がまだ明示的に設定していないものはdefault policyに従うと説明されている。これは、既存の明示設定を上書きするものではない。

GitHub Docsの管理画面説明では、モデルには有効、無効、または既定に従う状態がある。管理者が明示的に有効化または無効化していれば、その状態が残る。一方、未設定のモデルは、GitHubが定めるdefault availabilityの判断に沿って利用可否が決まる。

実装上のポイントは、未設定の意味が変わることだ。ある企業がこれまで「何も触っていないモデルは実質的に未承認」と運用していた場合、8月26日以降は同じ前提で説明できない。未設定は、保留ではなくdefault policyへの委譲になる。

この委譲は、GitHubがGAモデルの安定性、安全性、責任ある利用、製品体験を評価し、標準的な利用候補として扱うという考え方に基づく。ただし、企業側のリスク判断までGitHubが代替するわけではない。顧客データ、委託先アクセス、地域要件、業界規制、予算上限、社内AI利用規程は企業ごとに違う。

## 事実: 対象外モデルの扱いが重要になる

今回の更新では、対象外になるモデルがある。明示的に無効化されたモデル、一般提供前のモデル、open-weightモデル、GitHubの標準的なデータ保持条件に含まれないモデルなどは、自動的な既定有効化の対象として扱わない。

ここは管理上の要点である。Copilot上のモデルは、同じUIに並んでいても、データ保持、provider条件、availability、billing倍率、対応clientが同じではない。supported modelsのDocsは、モデルごとに対応surfaceやavailability、課金倍率、制約を分けている。

特に日本企業では、データ保持と地域要件の説明が必要になる。GitHub Enterprise Cloudのdata residency、FedRAMP環境、海外providerモデル、open-weightモデル、BYOKに近い運用、特定clientだけの提供などを、同じ「Copilotモデル」として一括りにしないほうがよい。

費用も分かれる。[GitHub Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)以降、Copilotの利用は席数だけでなくAI Creditsの消費とbudget controlsに左右される。default policyによって利用候補が増えると、利用者は高性能モデルやagentic workflowを選びやすくなる。モデルの可用性は、費用の可用性でもある。

## 分析: 承認フローはallowlistからdefault plus exceptionへ移る

ここからは分析である。

従来のモデル統制は、allowlist型で説明しやすかった。承認済みモデルだけを開ける。未承認モデルは開けない。新モデルが出たらセキュリティ、法務、開発基盤、FinOpsが確認し、必要なら有効化する。

しかし、Copilotのモデル供給速度とsurfaceの増加を考えると、この運用は摩擦が大きい。一般提供モデルが増えるたびに全社審査を待つと、開発者は新機能を試せない。逆に、管理者が急いで一括許可すると、費用とデータ条件の説明が粗くなる。

default model enablementは、この摩擦を下げる設計だ。標準的なGAモデルはdefault policyで扱い、企業側は明示的なdeny、organization別ルール、例外申請、評価済みモデルの推奨表に集中する。この方向自体は合理的である。

ただし、日本企業では、これをそのまま「GitHubが既定で良いと言ったから使ってよい」と読むと危ない。GitHubのdefault availabilityは、GitHub製品としての標準判断であり、各社の委託先契約、個人情報保護、金融・医療・公共案件、データ越境、監査ログ要件を自動で満たすものではない。

実務上は、allowlistを完全に捨てるのではなく、二層に分けるとよい。第一層はdefault policyに任せる通常開発領域。第二層は明示承認モデルだけを使う制限領域である。制限領域には、顧客本番データ、規制対象業務、未公開M&A、脆弱性詳細、閉域開発、外部委託先参加repositoryなどを置く。

## 実務: AI Controls棚卸しの具体手順

最初に、enterprise全体のAI Controlsをexportまたは画面確認し、モデルごとの状態を一覧化する。列は、model name、provider、availability、current setting、default policy継承有無、対応client、AI Credits倍率、data retention注記、data residency制約、owner、判断理由にする。

次に、未設定モデルを分類する。default policyに任せる、明示的に有効化する、明示的に無効化する、organization別rulesで分ける、追加調査に回す、の5分類で足りる。大切なのは、未設定のまま残す判断にもownerを置くことだ。未設定は「誰も決めていない」ではなく「default policyへ委譲する」と明文化する。

3つ目に、organizationとrepositoryのリスク分類を突き合わせる。GitHub Enterpriseでは、同じenterprise内に、一般的なSaaS開発、顧客別受託開発、研究プロジェクト、セキュリティ調査、公共案件、海外拠点、子会社が混在し得る。モデル設定はenterprise単位だけで完結しない。

4つ目に、client別の利用面を確認する。モデルが有効でも、VS Code、Visual Studio、JetBrains、Copilot CLI、Copilot app、cloud agent、code reviewで同じように使えるとは限らない。ヘルプデスク向けには、モデルが表示されない原因として、管理者設定、license、client未対応、extension version、gradual rollout、地域・データ制約を並べた切り分け表を作る。

5つ目に、Auto model selectionとの関係を書く。default policyは利用可能候補を決める。Auto model selectionは、その候補からモデルを選ぶ。管理者が高コストモデルを候補に入れれば、Autoがそれを選ぶ可能性も出る。社内標準では、Auto利用を許す範囲、高コストモデルを明示選択してよい作業、agentic workflowでの上限を分けたい。

最後に、8月26日以降のレビュー日を決める。変更直後は、利用者の問い合わせ、AI Creditsの増減、モデル別の利用傾向、禁止モデルの例外申請、品質上の不満が出る。1か月後に見直さないと、default policyへの委譲が実際にうまく回っているか分からない。

## リスク: 費用、データ保持、説明責任が別々に動く

一つ目のリスクは費用である。Copilotの高性能モデルは、作業品質を上げる一方でAI Creditsを多く消費する場合がある。developer experienceだけを見てモデル候補を広げると、FinOpsや部門責任者が後から説明に追われる。budget controls、cost center、user-level budget、usage reportsをセットで見る必要がある。

二つ目のリスクはデータ保持である。GitHub Docsは、モデルごとの条件や例外を注記している。標準的なCopilotの条件に含まれないモデルを、同じ契約前提で顧客データへ使わせると、監査で説明できない。データ保持が通常と違うモデルは、AI Controls上の例外理由に必ず残したい。

三つ目のリスクは説明責任である。利用者は、モデル名が見えれば「会社が承認した」と受け取る。管理者がdefault policyに任せただけでも、画面上は利用可能に見える。したがって、社内FAQでは、推奨モデル、許可モデル、例外モデル、評価中モデルを分けて書くべきだ。

四つ目のリスクはagent clientとの組み合わせである。Copilot appやcloud agentでは、モデル選択がbranch作成、PR作成、MCP、plugins、terminal、長時間作業と結びつく。モデルだけを見て許可しても、実行権限や監査ログを見ていなければ不十分である。

## 判断: どの会社が保守的に始めるべきか

保守的に始めるべきなのは、顧客データを扱う受託開発、金融・医療・公共・通信の案件、国外拠点との共同開発、委託先が広く参加するorganization、閉域やデータ持ち出し制限がある環境である。ここでは、default policyを全社で有効にしても、制限organizationにはmodel rulesで別条件を置くほうがよい。

一方、内製SaaS、社内ツール、研究開発、AI評価チームでは、default policyを使って新モデルを早く試す価値がある。特に、agentic coding、障害調査、大規模リファクタリング、設計レビューでは、モデル選択肢の増加が作業品質に効く可能性がある。

ただし、どちらの場合も月次レビューは必要だ。default policyは一回設定したら終わりではない。GitHubのsupported models、provider条件、課金倍率、client対応は変わる。AI Controlsをquarterlyではなくmonthlyで見るくらいの運用が現実的である。

## まとめ

GitHub Copilot default model enablementは、2026年8月26日から未設定GAモデルをdefault policyへ従わせる変更である。明示設定は維持され、一般提供前、open-weight、標準データ保持条件に含まれないモデルなどは別扱いになる。

日本企業は、この更新をモデル追加ニュースとして処理しないほうがよい。必要なのは、AI Controlsの未設定モデル棚卸し、organization別model rules、例外モデル表、AI Credits監視、data retention確認、client別FAQである。

Copilotのモデル運用は、個別承認だけで回す段階から、defaultと例外を設計する段階へ移っている。8月26日までに未設定の意味を決め、変更後1か月で利用実績を見直す体制を作るべきである。

## 出典

- [Default model enablement for Copilot Business and Enterprise](https://github.blog/changelog/2026-07-29-default-model-enablement-for-copilot-business-and-enterprise/) - GitHub Changelog, 2026-07-29
- [About default availability of Copilot models](https://docs.github.com/en/copilot/concepts/models/default-availability) - GitHub Docs
- [Managing availability of models in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) - GitHub Docs
- [Supported AI models in GitHub Copilot](https://docs.github.com/copilot/reference/ai-models/supported-models) - GitHub Docs
