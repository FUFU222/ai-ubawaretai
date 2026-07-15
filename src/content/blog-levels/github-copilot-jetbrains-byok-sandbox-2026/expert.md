---
article: 'github-copilot-jetbrains-byok-sandbox-2026'
level: 'expert'
---

GitHub Copilot for JetBrains IDEsの2026年7月14日更新は、JetBrains標準組織にとって、モデル、拡張、実行境界を一体で見直す契機である。発表項目は、BYOK custom endpoint support、customizations内のplugin management、Claude agent provider customizations、local sandboxing supportである。単独では小さな改善に見えるが、組み合わせると、CopilotをIDE内agent platformとして運用するための管理軸が増えたことになる。

この論点は既存のCopilot更新と連続している。[Copilot app BYOK](/blog/github-copilot-app-byok-model-providers-2026/)ではモデル調達とデータ境界が主題だった。[JetBrains版Claude Agent provider](/blog/github-copilot-jetbrains-claude-provider-2026/)では、JetBrainsのagent pickerにClaude providerや組織agentが入ることで、権限と配布の統制が問題になった。[JetBrains inline agent mode](/blog/github-copilot-jetbrains-inline-agent-mode-2026/)では、auto-approveとterminal/file editの境界が焦点だった。今回の更新は、この3つの線がJetBrains IDEの中で合流する。

## 事実: BYOKにはlocalとenterpriseの2系統がある

GitHub DocsのBYOK概念ページは、Copilotで自分のLLM providerを使う目的を、cost savingやbilling consolidationに置いている。同ページでは、BYOKには2つのmechanismがあると説明されている。Local BYOKは各クライアントでユーザーがcustom LLM keysを設定する仕組みで、client-sideでキーを扱う。Enterprise BYOKはenterprise ownerやorganization ownerがcustom modelsを追加し、Copilot BusinessまたはEnterpriseの利用者へmodel picker経由で提供する仕組みである。

この区別は実務上かなり重要だ。Local BYOKでは、端末、OS credential store、個人またはチームのAPI key、IDE設定が中心になる。Enterprise BYOKでは、GitHub organization/enterpriseのmodel policy、Copilot license、internet access、管理者が登録するAPI key、組織のmodel pickerが中心になる。どちらも「BYOK」と呼べるが、監査、失効、請求、障害対応、利用者教育の設計は別物である。

今回のJetBrains発表は、BYOK custom endpoint supportをJetBrains IDEsへ広げるものとして読める。GitHub Changelogでは、OpenAI-compatible custom endpoints with API keysを設定し、自分のmodelsを使えると説明している。ここで言うOpenAI-compatible endpointは、必ずしもOpenAIそのものを意味しない。社内gateway、vLLM、Ollama、Foundry Local、proxyされた商用API、検証環境のmodel serverなどが入り得る。

## 事実: organization custom modelsは別の統制面を持つ

GitHub Docsのorganization向けcustom modelsページでは、organization ownerが自分のLLM API keysを使い、Copilot Chat、Copilot CLI、IDEsで利用できるcustom modelsをorganization memberに提供できると説明されている。supported providerにはAnthropic、AWS Bedrock、Google AI Studio、Microsoft Foundry、OpenAI、OpenAI-compatible providers、xAIが並ぶ。fine-tuned modelsも利用可能だが、品質や機能はfine-tuning setupに依存するため、本番前のtestとreviewが必要とされている。

同ページは、BYOKの目的としてgovernance and compliance、cost management、visibility and control、flexibilityを挙げている。これは日本企業の導入理由とかなり一致する。特定リージョン、既存クラウド契約、社内gateway、業界規制、請求配賦、モデル品質評価をCopilot利用に持ち込みたい場合、Enterprise BYOKやorganization custom modelsは有効な選択肢になる。

ただし、local BYOKとorganization custom modelsを混ぜると統制が壊れやすい。たとえば、管理者はorganization custom modelとしてAzure OpenAIだけを許可したつもりでも、開発者がLocal BYOKで別のOpenAI互換endpointをJetBrainsに登録できるなら、実際のデータ経路は別になる。GitHub Docsは、Copilot Business/EnterpriseではIDEのLocal BYOK利用をenterpriseまたはorganization policyでdisableできると説明している。日本企業では、このpolicy確認を最初に行うべきだ。

## 事実: plugin managementとsandboxはモデルとは別軸

7月14日のChangelogでは、JetBrainsのcustomizationsにplugin managementが入った。Marketplaceまたはsource repositoryからpluginをbrowse/installできるため、Copilotをteam-specific workflowに合わせやすくするという説明である。これはagentの能力拡張であり、モデル接続とは別のリスクを持つ。

また、local sandboxing supportも追加された。GitHub Docsのlocal sandbox設定は、Copilot CLIが利用者の代わりに実行するshell commandsをisolated sandbox内で動かし、filesystem access、network connectivity、system capabilitiesを調整できると説明している。`/sandbox` slash commandからGeneral、Filesystem、Networkの設定を扱う構成である。

ただし、同Docsはnetwork host rulesについて制約を明記している。platformによってper-host filteringは信頼できず、macOSではallowedHostsがunrestricted outbound accessへdegradeする場合があり、blockedHostsはsupportされない。Linuxでもoutbound disabled時のselected host allowとしては信頼しにくい。したがって、local sandboxは重要な防御層だが、host単位のnetwork policyを強制する最後の境界として扱うべきではない。

## 分析: 管理対象を4平面に分ける

ここからは分析である。

今回の更新を安全に扱うには、管理対象を4つの平面に分けるのがよい。第一はmodel planeである。GitHub-hosted model、Enterprise BYOK、Local BYOK、OpenAI-compatible endpoint、local modelをどのチームに許可するかを決める。第二はagent planeである。GitHub cloud agent、Claude agent provider、organization custom agents、個人custom agents、skills、instructionsを分ける。

第三はextension planeである。plugin managementで導入されるplugin、Marketplace由来のplugin、source repository由来のplugin、社内配布plugin、禁止pluginを管理する。第四はexecution planeである。local sandbox、terminal command、filesystem write、network access、keychain access、working directory、CI上の再検証を扱う。

この4平面を分けないと、会話が混線する。たとえば「社内モデルを使うから安全」という発言はmodel planeだけの話で、extension planeやexecution planeの安全性を保証しない。「sandboxを有効にしたからBYOKは自由でよい」という発言も逆で、execution planeだけを見てmodel planeの契約やデータ保持を無視している。CopilotのIDE内agent化では、各平面の責任者と正本を分ける必要がある。

## 日本企業の標準構成案

現実的な初期構成は、全社解禁ではなくtierを分ける形である。

Tier 0はGitHub-hosted modelのみ、plugin追加なし、local sandbox有効、人間承認ありの構成である。対象は一般的なコード補完、説明、テスト案、軽微なリファクタである。ここではCopilotのAI Credits、GitHub側のmodel policy、IDE plugin versionを中心に見る。

Tier 1はorganization custom modelsを限定的に許可する構成である。Azure OpenAIやAnthropic、社内gatewayなど、管理者が登録したproviderだけをmodel pickerに出す。Local BYOKは無効にするか、pilotチームだけにする。対象は、データ分類が明確で、provider側のログと請求を追えるリポジトリに絞る。

Tier 2はLocal BYOKとOpenAI-compatible endpointを許可する検証構成である。これは開発基盤チーム、AI platformチーム、低機密リポジトリに限定する。利用者はAPI keyの発行者、endpointの下流model、ログ、料金、利用目的を申請する。JetBrainsの設定はMDMやmanaged settingsで配布できる範囲を確認し、個人任せにしない。

Tier 3はplugin managementとcustom agentを含む高度なagent構成である。ここでは、plugin source、agent profile、tool permissions、sandbox、CI、PR review、audit logをセットで見る。Claude agent providerや社内agentを使う場合、model planeではなくagent planeとexecution planeのレビューを必須にする。

## 設定台帳に入れるべき項目

provider台帳には、provider名、endpoint URL、provider type、認証方式、API key owner、請求先、ログ保存先、データ保持条件、許可データ分類、利用可能チーム、失効手順を入れる。OpenAI-compatible endpointの場合は、下流model、gateway owner、fallback model、rate limit、障害時の切り戻しも入れる。

model台帳には、model id、context window、tool calling対応、streaming対応、fine-tunedの有無、評価済みタスク、禁止タスク、品質確認日を入れる。GitHub DocsのCopilot CLI BYOKでは、models must support tool calling and streamingと説明され、128k tokens以上のcontext windowが推奨されている。これはCLI向け説明だが、agent用途のmodel評価でも参考になる。

plugin台帳には、plugin名、source、version、owner、更新頻度、必要権限、外部通信、読み書き対象、レビュー者を入れる。Marketplace pluginとsource repository pluginでは、供給元リスクと更新確認の手順が違う。社内source repositoryから入れる場合でも、レビューなしでIDEへ配布してよいわけではない。

sandbox台帳には、sandbox enabled、include working directory、read-only paths、read/write paths、network outbound、local network、keychain access、policy reset、例外理由を入れる。host rulesはセキュリティ enforcement として過信しない。外部通信を止めたい場合は、端末管理、プロキシ、DNS、network firewall、credential isolationを併用する。

## 運用で起きやすい失敗

第一の失敗は、Copilotの画面だけで費用を見ようとすることだ。BYOKを使うと、費用はGitHub CopilotのAI Creditsだけではなく、OpenAI、Anthropic、Azure、Foundry、AWS Bedrock、社内GPU基盤の請求に出る。部門別に説明するなら、Copilot usage、provider billing、gateway logsを結合する必要がある。

第二の失敗は、API keyを個人所有にすることだ。個人keyは試作には早いが、退職、異動、課金上限、漏えい、権限過大、棚卸しで弱い。企業利用では、service account、最小権限、期限、ローテーション、失効手順を使う。GitHub DocsもAPI keyにはleast privilegeを推奨している。

第三の失敗は、モデル評価だけでpilotを終えることだ。JetBrains内agentでは、モデル回答の品質だけでなく、pluginが何をしたか、sandboxがどこで止めたか、file editの差分はレビュー可能か、PRに説明が残るかが重要である。評価表には、正答率だけでなく、誤変更、余計なfile touch、tool call回数、network access、review差し戻し率を入れる。

第四の失敗は、local sandboxを全リスクの代替にすることだ。sandboxは重要だが、許可されたworking directory内では変更が起きる。agentが`.env.example`やtest fixtureを触るのは許せても、本番秘密情報、署名鍵、deployment manifest、migration scriptを触るのは別問題である。リポジトリ側の権限、branch protection、CODEOWNERS、required checksを残すべきだ。

## 導入手順

最初の2週間は、JetBrains plugin version、Copilot plan、Editor preview features policy、Local BYOK policy、custom models policy、sandbox利用可否を棚卸しする。ここで「利用者の画面に何が出るか」をスクリーンショットと設定値で確認する。管理者が意図したpolicyと実際のIDE表示が違う場合、pilotへ進まない。

次の2週間で、低機密リポジトリを対象にTier 0とTier 1を比較する。GitHub-hosted modelとorganization custom modelで、同じテスト追加、軽微な修正、README更新、コード説明を実行し、品質、速度、費用、ログ、レビュー負荷を比べる。この段階ではLocal BYOKを広げない。

その後、開発基盤チームだけでTier 2を試す。OpenAI-compatible endpoint、社内gateway、local modelをJetBrainsから使い、tool calling、streaming、context window、proxy、認証、ログ、rate limitを確認する。モデルが動くことより、失敗時に誰が切り分けられるかを見る。

最後に、plugin managementとcustom agentsを入れる。plugin sourceを限定し、agent profileをレビューし、sandbox設定とPR reviewをセットで試す。ここで初めて、業務チームへの限定展開を検討する。全社展開は、provider台帳、plugin台帳、sandbox台帳、費用台帳が更新される運用になってからでよい。

## まとめ

GitHub Copilot for JetBrains IDEsのBYOK custom endpoint拡張は、モデル選択肢の追加に見える。しかし、同じ更新でplugin management、Claude agent provider customizations、local sandboxingが進んだため、実務上はJetBrains IDE内のagent運用設計を更新する話である。

日本企業が取るべき姿勢は、BYOKを「自由なモデル選択」として扱わず、model plane、agent plane、extension plane、execution planeへ分解することだ。GitHub-hosted model、Enterprise BYOK、Local BYOK、plugin、custom agent、local sandbox、費用、ログ、API keyを同じ台帳で説明できるようにする。特にJetBrains標準組織では、IDEが開発基盤そのものなので、個人設定に任せるより、低リスクpilot、管理者policy、台帳、レビュー手順を先に固めるべきである。

## 出典

- [GitHub Copilot for JetBrains expands BYOK capabilities](https://github.blog/changelog/2026-07-14-github-copilot-for-jetbrains-expands-byok-capabilities/) - GitHub Changelog, 2026-07-14
- [Bring your own key for GitHub Copilot](https://docs.github.com/en/copilot/concepts/models/bring-your-own-key) - GitHub Docs
- [Enabling custom models for GitHub Copilot in your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/enable-custom-models) - GitHub Docs
- [Using your own LLM models in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-byok-models) - GitHub Docs
- [Configuring local sandbox settings](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/configuring-local-sandbox-settings) - GitHub Docs
