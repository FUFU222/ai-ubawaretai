---
article: 'github-ai-security-detections-pr-code-scanning-2026'
level: 'expert'
---

GitHubは2026年7月14日、code scanningに**AI-powered security detections**を追加し、pull request上でAIベースのセキュリティfindingを表示する公開プレビューを発表した。CodeQLが標準で対応していない言語やフレームワークにも検出範囲を広げ、merge前のレビューで潜在的な脆弱性を見つけやすくする機能である。

この更新は、GitHubのAIセキュリティ機能が「開発者の手元」から「PRレビュー面」へ広がっていることを示す。[Copilot appのsecurity review](/blog/github-copilot-app-security-review-2026/)は開発者が作業中に`/security-review`を実行する自己点検だった。一方、今回のAI-powered security detectionsは、Code SecurityとCodeQL default setupを前提に、pull requestのcode scanning面へfindingを出す。

また、[CodeQL AI検査でprompt injectionをSASTへ入れた動き](/blog/github-codeql-ai-prompt-injection-2026/)とも役割が違う。CodeQL queryは決定的な静的解析としてCIやrequired checksへ載せやすい。今回のAI検出は、GitHub自身がadvisoryと位置づけ、mergeをblockしない追加シグナルである。運用設計では、この差を明確にしなければならない。

## 事実: AI検出はPRイベントで走り、AIラベル付きで表示される

GitHub Changelogによると、AI-powered security detectionsはpull requestが開かれたとき、または更新されたときに実行される。結果はPR上に表示され、開発者は既存のreview flowの中で確認できる。GitHubは、結果が返り次第表示されるため、すべてのanalysis sourceが完了するのを待つ必要はないと説明している。

GitHub Docsでは、AI-powered findingsはConversationとFiles changedタブでCodeQL alertと並んで見えるとされている。AIで生成されたfindingにはAI indicatorが付き、CodeQLの結果と区別できる。findingにはセキュリティ問題の説明とリスク説明が含まれ、利用可能な場合はremediation suggestionやCopilot Autofixも提示される。

ただし、AI-powered findingsはrepositoryのSecurity viewにbacklog alertとして残らない。PR上だけで利用できるadvisory findingである。この制約は、脆弱性管理台帳、SLA、監査レポート、例外承認を設計するときに効いてくる。

サポート対象としてGitHub Docsが挙げるのは、CodeQLが現在カバーしていない言語やフレームワークである。例にはPHP、Shell/Bash、Terraform configuration、Dockerfile、JavaのJSP、C#のBlazorが含まれる。検出カテゴリは、string injection、weak cryptography、broken access control、sensitive data exposureなどである。

つまり、この機能の価値は「既存のCodeQLを賢くする」ことだけではない。CodeQLのbuilt-in analysisが届かない領域で、PRレビューにセキュリティ観点を追加することにある。Terraform、Shell、Dockerfile、レガシー画面、言語混在のmonorepoを持つ企業ほど、対象範囲の棚卸しが必要になる。

## 前提条件: CodeQL default setupに依存するが、CodeQLそのものではない

利用条件は軽くない。GitHub ChangelogとDocsは、GitHub Code Security、CodeQL default setup、enterprise policyでのallow、organization levelでのopt-in、repository levelでの設定を前提としている。公開プレビュー中はGitHub Copilotライセンスが必要で、実行時にはAI Creditsを消費する。

技術的に注意すべきなのは、AI analysisとCodeQLの関係である。GitHub Docsは、CodeQLがAI analysisを実行するわけではないが、AI detection engineが機能するためにCodeQL default analysisへ依存すると説明している。したがって、CodeQL default setupが組織内で十分に標準化されていない場合、AI検出だけを単独導入する発想は成り立ちにくい。

さらに、AI scanはCodeQL statusから独立して実行される。CodeQL default setupが失敗している、または待機状態でも、AI-powered detectionsは走る可能性がある。結果の表示順も固定ではない。PRではCodeQLより先にAI findingが見えることも、その逆もあり得る。

この性質は、レビュー運用に影響する。開発者が最初に見るfindingがAI由来だった場合、まだCodeQLの結果が出ていない可能性がある。レビュアーは「AI findingを見たからcode scanning確認済み」と判断してはいけない。PR templateやreview checklistでは、AI finding、CodeQL result、secret scanning、dependency reviewを分けて確認する必要がある。

## ガバナンス: enterprise policy、organization opt-in、AI Creditsを同じ表へ置く

日本企業で問題になりやすいのは、有効化権限と費用責任が分かれることだ。Enterprise ownerがAI security detectionsを許可し、organization administratorが有効化し、repository administratorが対象を調整し、CopilotライセンスとAI Creditsは別部門が見る、という分断が起きる。

この状態で全社に広げると、セキュリティ担当はfindingを見たいが、購買やFinOpsはAI Creditsの増加を説明できない、ということになる。[GitHub Code Quality見積もり](/blog/github-code-quality-license-estimate-2026/)で扱ったように、GitHubのコード品質・セキュリティ機能は、license cost、Actions minutes、AI Creditsが別々に効く方向へ進んでいる。

AI-powered security detectionsも同じ表で見るべきだ。対象organization、対象repository、CodeQL default setupの状態、GitHub Code Securityの適用、Copilot licenseの有無、AI Creditsの予算枠、owner、例外承認者、導入開始日、見直し日を1行にまとめる。

特に委託先や子会社が混ざる日本企業では、どのorganizationで有効化したかが責任分界に直結する。委託先がPRを出すリポジトリでAI findingが出たとき、誰が判断するのか。AI Creditsはどの部門へ配賦するのか。誤検知を誰がfeedbackするのか。機能を有効化する前に決めるべき項目である。

## 運用設計: merge gateではなくreview signalとして扱う

この機能をmerge gateとして扱わないことが重要である。GitHub Docsは、AI-powered findingsはadvisoryであり、pull request mergeをblockしないと説明している。さらに、rulesetsでmerge requirementとして使えないという制限も示されている。

したがって、運用上の正しい置き場所はreview signalである。AIラベル付きfindingは確認対象にする。妥当なら修正する。誤検知なら理由を残す。業務仕様上受け入れるなら、責任者またはセキュリティ担当者の判断を残す。ただし、mergeを止める根拠はCodeQL、secret scanning、Dependabot、test、required review、branch protectionに残す。

この線引きは、[secret scanningのAI検出名整理](/blog/github-secret-scanning-ai-detected-names-2026/)にも似ている。AIが関わる検出は便利だが、検出結果の分類、表示場所、API互換性、監査ログ、push protectionとの関係が機能ごとに違う。名前にAIが入っているだけで同じ運用にしてはいけない。

PR templateには、次のような短い項目を置くとよい。「AIラベル付きcode scanning findingを確認した」「修正しないAI findingは理由をコメントした」「CodeQL resultとsecret scanningも確認した」「high risk変更ではセキュリティ担当レビューを依頼した」。これならAI findingを承認ではなく判断材料として扱える。

## トリアージ: AI findingの扱いを4分類する

AI-powered security detectionsのトリアージは、少なくとも4分類にするのが実務的である。

第一は、妥当なfindingで修正するもの。injection、path traversal、弱い暗号、sensitive data exposureなど、PR差分上で問題が明確なものは修正する。Copilot Autofixが提案を出す場合でも、そのまま採用せず、テストと人間レビューを通す。

第二は、妥当なfindingだが別PRで直すもの。既存設計や広い影響があり、当該PRだけで直せない場合は、issue化する。ただし、AI findingはbacklog alertとして残らないため、別の管理対象へ移さないと消える。Security issue、内部チケット、脆弱性管理台帳のどれに移すかを決める必要がある。

第三は、誤検知として閉じるもの。AIは文脈を誤解することがある。誤検知を無言で無視すると学習にも監査にも残らないため、PRコメントで理由を短く残し、feedback mechanismがあれば使う。

第四は、業務仕様上の例外として受け入れるもの。たとえば内部ツールの一部でリスクを補償統制で抑える場合、誰がいつまで許可したのかを残す。AIの指摘が正しくても、修正を後回しにするなら人間の責任で説明する。

## 開発者体験: PR前の/security-reviewとの違い

同じ日に出たCopilot appの`/security-review`と混同しないよう、開発者向け説明では役割を分けるべきだ。`/security-review`は、作業中の差分に対して開発者が明示的に呼ぶ自己点検である。今回のAI-powered security detectionsは、PRイベントに紐づき、code scanningの面にfindingを出す。

前者は早い段階で手戻りを減らす。後者はPRレビューで見える安全網を増やす。両方を使うなら、開発者には「PR前に/security-reviewで粗い自己点検、PR後にAI-powered detectionsとCodeQLを確認」と説明すると分かりやすい。

[GitHub MCP Serverのsecret scanning](/blog/github-mcp-server-security-scanning-2026/)も含めると、作業中、push前、PR上、merge前、運用中という複数の検査点ができる。MCP scanはagent session内のpre-commit safety check、`/security-review`は開発者主導の差分レビュー、AI-powered detectionsはPR上のadvisory finding、CodeQLやsecret scanningは組織の標準検査である。

これを一枚の図や表にしないと、現場は「GitHubのAIセキュリティ機能が多すぎる」と感じる。機能名ではなく、いつ、誰が、何を、どの責任で見るかを軸に説明するべきだ。

## 効果測定: 検出数ではなく後工程の変化を見る

導入効果をAI finding数だけで測るのは危険である。検出数が増えたことは、品質が悪化したことも、検査範囲が広がったことも、誤検知が増えたことも意味し得る。

見るべき指標は、まず修正率である。AIラベル付きfindingのうち、妥当と判断され修正されたものがどれだけあるかを追う。次に誤検知率を見る。誤検知が多いカテゴリでは、開発者の信頼が下がるため、導入対象や運用ルールを調整する。

三つ目は後工程での重大指摘である。CodeQL、人間レビュー、セキュリティ担当レビュー、QA、本番incidentで後から見つかった問題が減っているかを見る。AI findingが本当に役立つなら、少なくとも一部の低レベルな脆弱性はPR中に直るはずである。

四つ目はレビュー負荷である。first reviewまでの時間、review cycle数、PR滞留時間、セキュリティ担当者のレビュー待ちを追う。AI findingが有益なら、レビュアーの説明負荷が減る可能性がある。一方、誤検知が多ければ逆に議論が増える。

五つ目は費用である。AI Creditsの消費を、Copilot Chat、Copilot app、Code Quality、AI-powered security detectionsなどの利用面と合わせて見る。費用が増えても、後工程指摘やreview cycleが減るなら価値がある。費用だけ増えて修正率が低いなら、対象を絞るべきだ。

## 日本企業向けの導入チェックリスト

第一に、対象リポジトリを選ぶ。CodeQL default setupが安定していて、PRレビューが機能しており、リスクの高い変更が多いリポジトリから始める。全社一括ではなく、1つから3つのorganizationまたは数十リポジトリ程度でよい。

第二に、有効化権限を確認する。Enterprise owner、organization administrator、repository administrator、security manager、billing ownerの役割を並べる。誰が許可し、誰が有効化し、誰が費用を見るかを決める。

第三に、PR templateとreview guideを更新する。AI findingは確認対象だがmerge gateではない、修正しない場合は理由を書く、CodeQLやsecret scanningも別に確認する、という文言を入れる。

第四に、トリアージ分類を導入する。修正、別PR/issue化、誤検知、例外承認の4分類を使い、PRコメントまたは内部チケットに残す。

第五に、月次レビューを行う。AI finding数、修正率、誤検知率、後工程指摘、review cycle、AI Credits、開発者からの苦情や質問を見て、対象拡大または縮小を判断する。

第六に、監査説明を用意する。「AIが承認した」ではなく、「AI findingを判断材料として使い、最終判断はCodeQL、required checks、人間レビュー、例外承認で行う」と明文化する。

## まとめ

GitHubのAI-powered security detectionsは、PR上のcode scanningへAIの追加シグナルを組み込む更新である。CodeQLが届きにくい言語やフレームワークで、injection、弱い暗号、access control不備、sensitive data exposureのような問題に早く気づける可能性がある。

ただし、これはmergeを止める検査でも、脆弱性管理台帳でも、承認者でもない。日本企業は、AI findingをreview signalとして扱い、CodeQL default setup、GitHub Code Security、Copilotライセンス、AI Credits、PRテンプレート、例外承認を一体で設計するべきだ。AI検出の価値は、見つけた数ではなく、人間が判断し、後工程の手戻りを減らせたかで測る必要がある。

## 出典

- [Code scanning shows AI security detections on pull requests](https://github.blog/changelog/2026-07-14-code-scanning-shows-ai-security-detections-on-pull-requests/) - GitHub Changelog, 2026-07-14
- [AI-powered security detections in pull requests](https://docs.github.com/en/code-security/concepts/code-scanning/ai-powered-security-detections) - GitHub Docs
- [Code scanning](https://docs.github.com/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning) - GitHub Docs
- [Application card: GitHub security and quality AI features](https://docs.github.com/en/code-security/responsible-use/security-and-quality-ai-features) - GitHub Docs
