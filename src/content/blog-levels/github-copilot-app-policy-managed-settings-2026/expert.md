---
article: 'github-copilot-app-policy-managed-settings-2026'
level: 'expert'
---

GitHub Copilot appのdedicated policyとenterprise managed settings拡張は、Copilot governanceの対象範囲を大きく変える更新である。GitHubは2026年7月27日、Copilot app accessを制御する独立policyを追加し、同時にCopilot appとCopilot cloud agentをenterprise managed settingsのsupported clientsへ加えた。

この2つは別々の発表だが、実務では一体で読むべきだ。dedicated policyは「誰がCopilot appを使えるか」を決める入口である。enterprise managed settingsは「使える場合に、どのplugin、marketplace、approval behavior、model defaultを強制するか」を決めるguardrailである。appを開ける判断と、開けた後の挙動を分けて管理できるようになった。

既存の[Copilot app BYOK](/blog/github-copilot-app-byok-model-providers-2026/)は、agent sessionで利用するmodel providerとdata boundaryを企業が選ぶ話だった。[Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/)は、企業管理pluginをCLIとIDEへ広げる話だった。今回の更新は、その上にclient access policyとcross-client settings enforcementを重ねるものだ。

## 事実: Copilot app policyはEnable、Disable、Org委任を選べる

GitHubの発表によると、Copilot appは独自のpolicyを持つようになった。従来、Copilot app accessはGitHub Copilot CLI policyが有効かどうかに依存していた。今回の変更により、Copilot appとCopilot CLIはそれぞれ独立したpolicyで管理される。

管理者の選択肢は3つである。`Enabled everywhere`は開発者にapp accessを与える。`Disabled everywhere`はenterprise全体でappを無効化する。`Let organizations decide`は各organization adminへ判断を委ねる。GitHubは、このpolicyをAI Controls tabのCopilot Clients sectionで確認、変更できると説明している。

重要なのは、このpolicyが既定でenabled everywhereだという点である。つまり、管理者が明示的に止めない限り、対象ユーザーはappを使い始められる可能性がある。GitHub Docsでも、Copilot appはall Copilot plansで利用でき、BusinessとEnterprise usersはGitHub Copilot app policyがenabledのままである必要があるとされている。

GitHubは、Copilot appの作業がisolated workspacesで行われ、変更はpull requestを通じてlandされるため、通常のreviews、checks、audit historyが適用されると説明している。これはGitHub flowと相性がよい。一方で、pull requestに到達する前のagent session、tool access、plugin use、model choice、command executionをどう制御するかは、別途設計が必要である。

## 事実: managed-settings.jsonはappとcloud agentにも効く

GitHubは同日、enterprise managed settingsがGitHub Copilot appとCopilot cloud agentにも適用されるようになったと発表した。managed settingsは、enterprise ownerが`managed-settings.json`でCopilot client behaviorを中央定義し、supported clientsへ配布する仕組みである。

GitHub Docsのsupported clientsには、Copilot CLI、VS Code、GitHub Copilot appが並ぶ。Changelogでは、Copilot cloud agentもapplicable managed settingsを読み、approved plugins and marketplacesだけを使うと説明されている。これにより、appとcloud agentがCopilot CLI、VS Codeと同じenterprise guardrailsの下に入る。

管理できる例として、GitHubは利用可能なplugins、plugin marketplaces、command実行・file access・URL fetch前のapproval prompt bypass可否、new conversationsのdefault auto model selectionを挙げている。各supported keyでは、managed valueがdeveloper local settingsより優先される。

ただし、適用範囲には差がある。bypass prompt controlsはinteractive clients、つまりapp、Copilot CLI、VS Codeにだけ適用される。cloud agentは、pluginsやmarketplace controlsなどのapplicable settingsを読むが、interactive prompt bypassと同じ意味の制御は持たない。cloud agent運用では、repository policy、agent task起動権限、PR review、session logsを別の層で管理する必要がある。

## 配布方式: server-managed、MDM-managed、file-basedを分ける

GitHub Docsは、enterprise managed settingsの配布方式として3つを示している。

server-managedは、多くのenterpriseで既定候補になる。`.github-private` repositoryを作り、`copilot/managed-settings.json`をcommitする。review workflowとaudit historyをGitHub上に残しやすく、設定変更をpull requestで管理できる。反映はおおむね1時間以内、client restart、sign-inで行われる。

MDM-managedは、IntuneやJamfなどで端末groupごとにpayloadを配る方式である。開発端末の管理が成熟している企業、macOS/Windowsで部署ごとに設定を変えたい企業に向く。GitHub Docsは、clientsがhourlyにpolicyを確認し、VS CodeではDeveloper: Sync Account Policy commandでtest syncできると説明している。

file-basedは、server-managedやMDM-managedが使えない環境、container、Codespaces、特殊なdeveloper environmentで有用である。ただし、配布されていないmachineは制御対象外になる。日本企業で委託先端末や個人端末、閉域環境を含む場合は、この弱点を理解したうえで使う必要がある。

専用のCopilot Business enterprise、いわゆるCopilot Standaloneでは追加の考慮がある。server-managedにはorganizationと`.github-private` repositoryが必要で、その作成にはGitHub Enterprise licenseが必要になる。licenseを追加しない場合は、MDM-managedまたはfile-basedを使う設計が現実的である。

## 分析: client単位の統制がCopilot運用の基本になる

ここからは分析である。

Copilotの企業導入は、もはや「IDE補完を許可するか」では済まない。現在のCopilot surfaceには、VS Code、JetBrains、Visual Studio、CLI、Copilot app、cloud agent、GitHub Mobile、code review、Actions failure fixes、Issues automation、MCP、plugins、BYOKがある。利用者から見ると同じCopilotでも、管理者から見ると実行面、権限、ログ、費用、データ境界が違う。

今回のapp policy分離は、このsurfaceごとの差を管理できるようにする。CLIは許すがappはpilotに限定する、appは許すがcloud agentはrepository限定にする、VS Codeは全社標準だがBYOKは一部teamだけにする、といった判断がしやすくなる。

managed settings拡張は、surfaceごとのばらつきを減らす。たとえば、CLIでは承認prompt bypassを禁止しているのに、appでは開発者が自由にbypassできる状態は危険である。VS Codeでは企業管理pluginだけを許しているのに、appでは未承認marketplaceからpluginを入れられる状態も危険である。今回の更新により、そのようなpolicy gapを縮められる。

一方で、全surfaceを完全に同じにすればよいわけではない。cloud agentはinteractive clientではないため、approval promptの意味が違う。JetBrainsやVisual Studioには各client固有の設定や更新周期がある。Copilot appはmulti-session、worktree、PR lifecycle、canvases、automationを持つ。共通guardrailとclient-specific ruleを分けることが重要だ。

## 日本企業の運用設計: appを既定有効のまま放置しない

日本企業が最初にやるべきことは、AI Controlsの棚卸しである。Copilot app policyがenabled everywhereのままか、organizationごとに委任しているか、明示的にdisabledにしているかを確認する。既定有効である以上、「まだ展開していないつもり」でも開発者が使える可能性がある。

次に、利用者群を分ける。GitHub flowに慣れ、branch protection、required reviews、CI、secret scanning、code scanningが整っているproduct engineering teamはpilot対象にしやすい。一方、委託先を含む保守開発、顧客専用repository、金融・医療・公共系、閉域開発、端末管理が弱い環境は、app policyをdisabledまたはorg委任にして段階展開するほうがよい。

三つ目に、plugin and marketplace governanceを作る。appとcloud agentでapproved pluginsだけを使わせるなら、誰がpluginを評価し、どのrepositoryで使え、version updateをどう追うかを決める必要がある。MCP serverやagent skillsは、便利な社内tool連携であると同時に、agentの権限面を広げる入口である。

四つ目に、approval prompt bypassの標準を決める。原則はbypass不可、例外はteam単位、repository単位、task category単位で承認するのが現実的である。たとえば、documentation repositoryではbypassを緩めても、本番service repositoryではcommand実行やURL fetchの承認を残す、といった分け方がある。

五つ目に、監査と費用の観測を合わせる。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)を使う企業では、prompt、response、tool callをどこまで記録するかを決める必要がある。[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)以降は、appやcloud agentのagentic workが費用にも影響する。監査担当、FinOps、開発基盤、CSIRTが同じ台帳を見られる状態が望ましい。

## 具体的な30日pilot設計

1週目はinventoryである。enterpriseとorganizationのCopilot policies、Copilot app policy、CLI policy、preview features、BYOK利用、managed settings有無、cloud agent利用repository、existing pluginsを一覧化する。特に、app policyが既定有効のままかを確認する。

2週目はpolicy baselineを作る。`managed-settings.json`に、plugin allowlist、marketplace restriction、approval bypass禁止、auto model selection defaultなど、最小限のbaselineを入れる。server-managedを使うなら`.github-private` repositoryのreviewer、CODEOWNERS、branch protectionを設定する。MDM-managedを使うなら、対象device groupをpilotに絞る。

3週目はpilot runである。対象teamを10から30人程度に限定し、非機密repositoryまたは社内tool repositoryでCopilot appを使う。agent sessionの作成、branch生成、PR作成、CI failure、review comment対応、plugin利用、settings反映タイミングを観測する。使いやすさではなく、policyが意図通り効くかを主目的にする。

4週目はdecisionである。appを全社有効にするか、org委任にするか、disabled everywhereに戻すか、pilotを延長するかを決める。判断軸は、設定が反映されたか、未承認pluginを防げたか、approval bypassが管理できたか、agent作業がPR reviewへ自然に戻ったか、費用とsession logを追えたかである。

このpilotで重要なのは、Copilot app単体の便利さを評価しないことだ。Copilot appは、BYOK、MCP、plugins、cloud agent、PR lifecycle、AI Credits、session logsをつなぐ作業面である。評価表もその横断面に合わせる必要がある。

## 失敗しやすいパターン

1つ目は、CLI policyを有効にしているからappも管理できていると思い込むことだ。今回の更新後はapp policyが独立している。CLIとappの有効状態、対象ユーザー、例外組織を別々に確認する必要がある。

2つ目は、managed settingsを作っただけで全clientに反映されたと思い込むことだ。clientのsupported status、userのbilling entity、sign-in state、restart、MDM配布、file placementがずれると、設定が見えない場合がある。Docsは、userが複数billing entityからlicenseを受けている場合、personal Copilot settingsのUsage billed to選択も確認するよう案内している。

3つ目は、cloud agentにもinteractive prompt controlが効くと誤解することだ。cloud agentはapplicable managed settingsを読むが、bypass prompt controlはinteractive clients向けである。cloud agentは、起動権限、repository settings、tool allowlist、PR review、session recordで別途制御する。

4つ目は、plugin accessの実体を見落とすことだ。Docsは、managed settingsがprivate repository上のpluginを指定する場合、clientがそれを自動installしようとするため、ユーザーがplugin filesのhosting locationへアクセスできる必要があると説明している。pluginをprivate repoに置くなら、license、repo permission、access reviewが必要になる。

5つ目は、費用管理を後回しにすることだ。agent sessionが増えるほどAI Creditsの消費は変わる。さらにBYOKを併用すれば、外部provider側の費用も混ざる。Copilot appを広げる前に、usage report、budget、cost center、external provider billingを結ぶ設計が必要である。

## まとめ

GitHub Copilot appのdedicated policyは、Copilot appをCLIから独立して有効化、無効化、organization委任できるようにする更新である。enterprise managed settingsの拡張は、Copilot appとcloud agentを、CLIやVS Codeと同じguardrailの下へ入れる更新である。

日本企業にとっての実務価値は、Copilot appを安全に広げやすくなることだ。一方で、既定有効のappを放置すると、agent desktop、plugins、marketplace、model choice、cloud agent、費用、監査が管理外で広がる可能性がある。

最初の対応は、AI Controlsの棚卸し、managed settings baseline、pilot team限定、plugin allowlist、approval prompt標準化である。Copilot appを全社展開するかどうかは、便利さではなく、pull request review、guardrail enforcement、session logging、AI Credits管理が回るかで判断するべきだ。

## 出典

- [Manage GitHub Copilot app access with a dedicated policy](https://github.blog/changelog/2026-07-27-manage-github-copilot-app-access-with-a-dedicated-policy/) - GitHub Changelog, 2026-07-27
- [Enterprise managed settings in the GitHub Copilot app and Copilot cloud agent](https://github.blog/changelog/2026-07-27-enterprise-managed-settings-now-apply-to-the-github-copilot-app/) - GitHub Changelog, 2026-07-27
- [Configuring enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings) - GitHub Docs
- [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app) - GitHub Docs
