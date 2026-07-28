---
title: 'GitHub Copilot app統制、既定有効の管理線'
description: 'GitHub Copilot appの独立ポリシーとmanaged settings拡張を解説。日本企業が既定有効のagentアプリ、cloud agent、plugins、承認ルールをどう管理すべきか整理する。'
pubDate: '2026-07-28'
category: 'news'
tags: ['GitHub Copilot', '管理者設定', 'AIガバナンス', 'セキュリティ', '開発者ツール', 'AIエージェント', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年7月27日**、GitHub Copilot appの利用可否を制御する専用ポリシーを追加した。同じ日に、enterprise managed settingsの対象をGitHub Copilot appとCopilot cloud agentへ広げたことも発表している。

今回の更新は、単なる管理画面の項目追加ではない。Copilot appは、開発者が複数のagent sessionを並行に動かし、branch、pull request、CI、issueをまたいで作業するデスクトップ面である。[Copilot app BYOK](/blog/github-copilot-app-byok-model-providers-2026/)でモデル調達の選択肢が増え、[Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/)で企業管理の配布面が広がった後、今度は「誰にappを使わせ、どのguardrailを全clientへ効かせるか」が焦点になった。

日本企業にとって重要なのは、Copilot app policyが**既定で有効**だという点だ。何もしなければ、利用できる開発者はappを始められる。便利だが、AI agentの実行面を広げる前に、plugin、marketplace、承認prompt、cloud agent、監査ログ、費用管理の境界を決めておく必要がある。

## 事実: Copilot app policyはCLI policyから分離された

GitHub Changelogによると、Copilot appは独自のpolicyを持つようになった。これまでは、Copilot appへのアクセスがGitHub Copilot CLI policyの有効状態に依存していた。今回の変更で、Copilot appとCopilot CLIを別々に管理できる。

管理者が選べる状態は3つである。`Enabled everywhere`は開発者にappを使わせる。`Disabled everywhere`はenterprise全体でappを止める。`Let organizations decide`は判断を各organization adminへ委ねる。設定場所はenterpriseまたはorganization settingsのAI Controlsタブで、Copilot Clients sectionからCopilot app policyを選ぶ。

GitHubは、Copilot appを使う開発者はisolated workspacesでagent sessionを進め、変更はpull requestを通じて入ると説明している。つまり、review、checks、audit historyというGitHub上の通常の開発統制を使える。ただし、これは「何も管理しなくてよい」という意味ではない。どのclientを誰に開けるかを、CLI、VS Code、Copilot appで分けて考えられるようになったということだ。

Docs上でも、Copilot appは全Copilot planで利用でき、BusinessとEnterpriseではCopilot app policyが有効である必要があると説明されている。対応OSはmacOS、Linux、Windowsで、複数のisolated agent session、cloud sandbox、model selection、BYOK、MCP servers、skills、automations、canvasesなどを扱える。

## 事実: managed settingsがappとcloud agentへ広がった

同日の別発表では、GitHub Copilot appとCopilot cloud agentがenterprise managed settingsの対象になった。managed settingsは、enterprise ownerが`managed-settings.json`でCopilot clientの振る舞いを中央管理する仕組みである。

GitHubは、今回の対象拡大により、Copilot appとcloud agentがCopilot CLI、VS Codeと同じguardrailの下に入ると説明している。appでは、利用可能なplugins、plugin marketplace、command実行やfile accessやURL取得前のapproval promptを開発者がbypassできるか、new conversationsのdefaultにauto model selectionを使うか、といった設定を管理できる。cloud agentも、適用されるmanaged settingsを読み、承認済みのpluginsとmarketplaceだけを使う。

ただし、bypass prompt controlはinteractive clientにだけ適用される。具体的にはapp、Copilot CLI、VS Codeであり、cloud agentには同じ意味では適用されない。ここは日本企業の運用で誤解しやすい。cloud agentは無人または非同期で動くため、interactive clientの承認promptと同じ制御を期待してはいけない。

GitHub Docsは、server-managed、MDM-managed、file-basedの3方式でenterprise managed settingsを配布できると説明している。server-managedでは`.github-private` repositoryの`copilot/managed-settings.json`を使い、変更はおおむね1時間以内、client再起動、再sign-inで反映される。MDM-managedはIntuneやJamfなどの端末管理に向き、file-basedはcontainerやCodespacesなどにも使える。

## 分析: 既定有効のagent desktopは棚卸し対象になる

ここからは分析である。

今回の更新は、GitHubがCopilot appを「試験的な別client」ではなく、企業管理の対象clientとして扱い始めたことを示している。app policyが独立し、managed settingsが効くようになったことで、管理者はappを広げやすくなる。一方で、既定有効という設計は、情シスや開発基盤チームが何もしない場合に、現場が先に使い始める可能性も高める。

Copilot appは、単なるチャット画面ではない。複数worktree、branch作成、pull request、CI確認、MCP、skills、automations、model selection、BYOK、cloud sandboxを扱う。つまり、利用者にとっては開発作業の入口であり、管理者にとってはagentがコード、terminal、repository、外部tool、費用を横断する面である。

このため、appを有効化する判断は、IDE拡張を1つ追加する判断より重い。特に、以前扱った[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)のようにprompt、response、tool callを追う仕組みを検討している企業では、app policy、managed settings、session record、pull request reviewを同じ運用設計で扱うべきだ。

日本企業では、部門別に開発環境の成熟度が違うことも多い。GitHub Enterpriseを使い慣れたプロダクト開発部門なら、appを早めにpilotしてよいかもしれない。一方、委託開発、顧客環境、金融・医療・公共系、閉域ネットワーク、持ち出し制限が強い環境では、既定有効をそのまま放置しないほうがよい。

## 日本企業が先に決める5つの管理ルール

第一に、client別の利用可否を決める。Copilot CLI、VS Code、Copilot app、cloud agentを一括で「Copilot」と呼ぶと、管理が粗くなる。appは既定有効なので、全社で使わせるのか、pilot organizationだけにするのか、organization adminに委ねるのかを明文化する。

第二に、managed settingsの配布方式を決める。GitHub Enterpriseの標準運用に寄せるならserver-managedが扱いやすい。端末グループごとに差をつけたいならMDM-managed、containerやCodespacesまで見るならfile-basedも検討する。いずれの場合も、appとCLIとVS Codeで同じキーがどう適用されるかを確認する。

第三に、pluginとmarketplaceの許可表を作る。Copilot appがmanaged settingsの対象になったことで、app内のplugin利用も企業標準に近づけられる。社内MCP、承認済みplugin、禁止marketplace、個人pluginの扱いを分ける。ここを曖昧にすると、appだけが管理外のtool入口になりやすい。

第四に、approval promptのbypassを決める。開発者がcommand、file access、URL fetchの承認を省略できるかは、生産性と事故リスクの両方に効く。標準はbypass不可にし、成熟したteamだけ例外を認める設計が現実的だ。cloud agentには同じprompt制御が直接効かない点も、runbookに書く必要がある。

第五に、費用と監査の担当を分ける。[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)以降、agent利用は費用にも直結する。appを有効にするなら、誰がAI Creditsを見て、誰がsession logを見て、誰がpull requestの最終責任を持つかを分ける。全部をGitHub管理者だけに寄せると、運用が詰まりやすい。

## 30日で段階展開する運用手順

最初の1週間は、AI Controlsの現状を棚卸しする。Copilot app policyがどのenterpriseとorganizationで有効か、CLI policyとどう違うか、対象license、利用者、既存BYOK設定、plugin利用、cloud agent利用を確認する。既定有効のまま全社に出ている場合は、少なくとも利用ガイドを先に更新する。

2週目は、`managed-settings.json`をpilot用に作る。最初から全設定を詰め込む必要はない。利用可能plugin、marketplace、approval bypass、auto model selectionの既定値など、事故時に説明が必要な項目から始める。server-managedを使うなら`.github-private` repositoryのreview workflowも確認する。

3週目は、少数のteamでappを使わせる。対象は、GitHub flow、pull request review、CI、branch保護、secret scanning、code scanningが整っているrepositoryに絞る。agent sessionがどのようにbranchを作り、どのタイミングで人間がreviewし、どの設定がclientに反映されるかを実測する。

4週目は、運用判断を分ける。全社有効、organization任せ、無効化、pilot継続のどれにするかを決める。判断材料は、便利だったかではなく、plugin統制、承認prompt、費用、review負荷、監査ログ、利用者教育が回るかである。必要なら、appはpilot継続、CLIは既存運用、cloud agentは対象repository限定、という分割もあり得る。

## まとめ

GitHub Copilot appの独立policyとmanaged settings拡張は、Copilot appを企業の標準管理対象へ近づける更新である。appは既定有効で、CLI policyとは別に制御できる。さらに`managed-settings.json`により、appとcloud agentにもplugins、marketplace、承認promptなどのguardrailを広げられる。

日本企業は、この更新を「appが使いやすくなった」とだけ見ないほうがよい。Copilot appは、モデル、agent session、branch、PR、MCP、plugin、費用、監査を横断する開発面である。まずはAI Controlsとmanaged settingsを棚卸しし、pilot組織で実測し、全社展開するかどうかを管理線で判断するべきだ。

## 出典

- [Manage GitHub Copilot app access with a dedicated policy](https://github.blog/changelog/2026-07-27-manage-github-copilot-app-access-with-a-dedicated-policy/) - GitHub Changelog, 2026-07-27
- [Enterprise managed settings in the GitHub Copilot app and Copilot cloud agent](https://github.blog/changelog/2026-07-27-enterprise-managed-settings-now-apply-to-the-github-copilot-app/) - GitHub Changelog, 2026-07-27
- [Configuring enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings) - GitHub Docs
- [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app) - GitHub Docs
