---
article: 'github-copilot-enterprise-teams-model-access-2026'
level: 'expert'
---

GitHubが2026年7月31日に発表したenterprise teams model policy targetingは、Copilot管理者にとって地味だが重要な変更である。GitHub Copilot Enterpriseのモデル可用性を、organization単位だけでなくenterprise team単位で調整できるようにする公開プレビューだからだ。GitHubは2026年8月3日から段階的に有効化するとしている。

この更新は、既存の[Copilot model rules](/blog/github-copilot-targeted-model-rules-2026/)を置き換えるものではない。むしろ、organization単位の統制では粗い場面へ、team単位の追加解禁を重ねる機能として読むべきである。さらに、[Copilot既定モデル有効化](/blog/github-copilot-default-model-enablement-policy-2026/)で扱ったdefault policyの変更、[Geminiモデル廃止対応](/blog/github-copilot-gemini-25-pro-3-flash-retirement-2026/)で扱ったモデルライフサイクル、[Copilot Claude Opus 5](/blog/github-copilot-claude-opus-5-model-policy-2026/)で扱った上位モデルの費用と用途を、同じ運用台帳へ載せる必要がある。

## 事実: team targetingは追加アクセスの管理部品

GitHub Changelogの発表では、enterprise管理者がenterprise teamsを対象にモデルポリシーを設定できるようになる。説明の中心は、特定のユーザーグループに、organization全体では一般に開いていない追加モデルへのアクセスを付与することだ。

ここで誤解しやすいのは、team targetingを「teamごとの完全な別環境」と見ることだ。実際の運用では、enterprise policy、organization policy、model availability、client対応、プラン、ロールアウト状態が重なる。team targetingはそれらの上に乗る追加アクセスの層として理解したほうがよい。

GitHub Docsのモデル可用性管理では、管理者がモデルを有効化、無効化、既定に従う状態で管理できる。Supported modelsの表では、モデルごとに対応surface、提供条件、プラン、billingに関する扱いが分かれる。つまり、teamに許可したからといって、すべてのIDE、GitHub.com、Copilot CLI、agent modeで同じように使えるとは限らない。

公開プレビューである点も重要だ。本番統制の唯一の根拠にするのではなく、現時点では限定解禁、観測、ロールバックを前提に設計するべきである。

## 統制モデル: enterprise、organization、teamの3層で考える

実務上は、Copilotのモデル統制を3層で考えると整理しやすい。

第一層はenterprise全体の既定方針である。ここでは、全社として許すモデルカテゴリ、禁止するモデルカテゴリ、default policyに従わせる範囲を決める。8月26日以降のdefault model enablementを前提にするなら、未設定モデルを「未承認」と読む運用は見直す必要がある。

第二層はorganization単位のモデルルールである。事業部、子会社、外部委託先、規制業務、研究開発のように、GitHub organization自体が責任境界を表す場合はここで分ける。顧客データ、契約条件、データレジデンシー、AI Creditsの責任者がorganization単位で違うなら、organization rulesは引き続き有効である。

第三層が今回のenterprise team targetingである。同じorganization内でも、役割や職務でモデル利用を分けたい場合に使う。たとえば、SRE teamには障害調査用に上位モデルを許可する。Security teamにはセキュリティレビュー用途を許可する。生成AI推進teamには新モデルの評価を許可する。委託先teamには標準モデルだけを渡す。こうした設計は、organizationを細かく分けるより現実的なことがある。

ただし、teamは責任境界として弱い場合がある。人事異動、兼務、短期プロジェクト、委託契約、棚卸し漏れでメンバーが変わるからだ。team targetingを使うなら、GitHub teamのowner、加入条件、削除条件、棚卸し周期を定義しなければならない。

## 費用設計: AI Creditsと例外利用を分ける

Copilotのモデル統制は、セキュリティだけでなく費用統制でもある。高性能モデルやagentic workflowは、作業品質を上げる可能性がある一方、AI Creditsや利用量の説明を難しくする。

team targetingを使う場合、まず追加モデルを開くteamごとに利用目的を決めたい。目的が「良いモデルを使いたい」では弱い。障害の一次切り分け、大規模移行の影響調査、複雑なテスト生成、設計レビュー、セキュリティ修正のように、標準モデルでは不足しやすい作業へ限定する。

次に、利用量の観測単位を置く。モデル権限をteamに渡すなら、費用説明もteam単位に近づける必要がある。月次で見るべき項目は、利用回数、AI Credits、上位モデル利用の目的、成果物のレビュー結果、差し戻し率、失敗例、問い合わせである。利用量だけを見ても、上位モデルの効果は判断できない。

また、例外申請を残す。標準では閉じているモデルを一時的に開くなら、誰が、いつまで、どのrepositoryや作業で使うのかを残したい。日本企業では、費用だけでなく委託先管理、内部監査、顧客説明が絡むことがある。team targetingの強みは限定解禁だが、限定した理由が記録されていなければ監査では弱い。

## 運用手順: 30日で小さく始める

最初の1週目は棚卸しに使う。Enterprise配下のorganization、enterprise teams、team owner、外部メンバー、休眠team、委託先teamを一覧化する。モデル権限を渡してよいteamと、渡してはいけないteamを分ける。この段階でteam台帳が信用できないなら、Copilot設定よりteam管理を先に直すべきだ。

2週目は対象モデルと用途を決める。対応surface、billing、data retention、client要件を確認し、追加モデルを開く理由を作業単位で書く。たとえば、Claude Opus系を長時間agentic codingに使う、Gemini系を特定の言語や速度重視のレビューに使う、軽量モデルを一次分類に使う、というように分ける。

3週目はpilot teamへ限定して有効化する。対象は、CODEOWNERS、branch protection、レビュー担当、CIが整っているrepositoryを持つteamがよい。上位モデルにコード変更を任せるなら、人間のレビュー線が曖昧なrepositoryを最初に選ばない。委託先が含まれるteamは、契約とデータ取り扱いを確認してからにする。

4週目は観測とロールバックを行う。AI Creditsが想定を超えた、対象外ユーザーにモデルが表示された、品質が不安定、使えるはずのclientで見えない、問い合わせが多い、といった事象を見て、権限を戻すか継続するかを判断する。公開プレビューでは、設定できたことより戻せることのほうが重要である。

## リスク: team権限は便利だが説明責任が増える

team targetingの最大のリスクは、権限の説明が複雑になることだ。利用者から見れば「なぜ自分にはこのモデルが見えないのか」「隣のteamはなぜ使えるのか」という問い合わせが増える。管理者は、enterprise policy、organization policy、team policy、client対応、モデルのrollout状態を切り分けて説明しなければならない。

もうひとつは、兼務メンバーである。日本企業では、プロジェクト横断の支援team、セキュリティレビューteam、生成AI推進teamに複数部署のメンバーが入ることがある。こうした横断teamに上位モデルを開くと、実質的に広い範囲へ解禁したのと同じになる場合がある。teamの名前だけで判断せず、実メンバーと利用repositoryを確認するべきだ。

さらに、モデル権限はデータ権限ではない。高性能モデルを開いたからといって、顧客データ、個人情報、秘密情報、未公開脆弱性をpromptに入れてよいわけではない。逆に、モデルを制限しても、repository権限が広すぎれば情報取り扱いの問題は残る。Copilotのteam targetingは、既存のGitHub権限、監査ログ、DLP、社内利用規程と一緒に運用する必要がある。

## まとめ

GitHub Copilot Enterpriseのenterprise teams model policy targetingは、モデル統制をより実務の役割に近づける更新である。事実として、GitHubは2026年7月31日に公開プレビューを発表し、2026年8月3日から段階的に有効化すると説明している。

専門的に見ると、この更新はCopilotを全社一律のAIアシスタントから、職務別に能力と費用を割り当てる開発基盤へ近づける。日本企業は、enterprise、organization、teamの3層で権限を整理し、team owner、加入条件、AI Credits、用途、ロールバックをセットで設計したい。上位モデルを開く価値はあるが、開く範囲を狭く、理由を明確に、観測を強くすることが前提である。

## 出典

- [Enterprise teams model policy targeting in public preview](https://github.blog/changelog/2026-07-31-enterprise-teams-model-policy-targeting-in-public-preview/) - GitHub Changelog, 2026-07-31
- [Managing availability of models in your enterprise](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) - GitHub Docs
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
