---
title: 'Copilot JetBrains BYOK、社内モデル運用の分岐点'
description: 'GitHub Copilot JetBrains版のBYOK custom endpoint拡張を解説。日本企業が社内モデル、plugin、local sandboxをどう統制するか整理する。'
pubDate: '2026-07-15'
category: 'news'
tags: ['GitHub Copilot', 'JetBrains', 'BYOK', 'AIエージェント', '開発者ツール', '管理者設定', 'SaaSコスト管理']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年7月14日**、GitHub Copilot for JetBrains IDEs の更新として、BYOKのcustom endpoint対応、customizations内のplugin management、Claude agent provider customizations、local sandboxingをまとめて発表した。JetBrainsを標準IDEにしている日本のJava/Kotlin開発組織にとって、これは単なるプラグイン改善ではない。モデル接続、agent拡張、ローカル実行境界を同じ開発面で管理する段階に入ったという更新である。

すでにこのサイトでは、[Copilot app BYOKでモデル調達をどう統制するか](/blog/github-copilot-app-byok-model-providers-2026/)を扱った。今回の焦点はアプリ全般ではなく、JetBrains IDEの中で開発者が日常的に使うCopilotに、OpenAI互換endpoint、plugin、Claude agent、sandbox設定が近づいた点にある。さらに[JetBrains版のClaude Agent統合](/blog/github-copilot-jetbrains-claude-provider-2026/)や[inline agent modeとauto-approve](/blog/github-copilot-jetbrains-inline-agent-mode-2026/)の延長として読むと、Copilotは「補完ツール」から「IDE内の統制付きagent基盤」へ寄っている。

## 事実: JetBrains版でBYOK custom endpointが広がった

GitHub Changelogによると、今回のJetBrains更新では、BYOKにcustom endpoint supportが追加された。利用者はOpenAI互換のcustom endpointとAPI keyを設定し、自分たちのモデルを使える。GitHubはこの更新を、customizationとmodel provider flexibilityを広げるものとして説明している。

GitHub DocsのBYOK概念ページでは、BYOKには大きく2つの仕組みがある。1つは利用者がローカルクライアントで鍵を設定するLocal BYOK、もう1つはEnterpriseやorganization ownerが全ユーザー向けにcustom modelを提供するEnterprise BYOKである。Local BYOKではキーはclient-sideで扱われ、Enterprise BYOKではCopilot API側で提供モデルに影響する。ここを混同すると、誰が鍵を持ち、誰の請求に出て、どのログで追えるのかが曖昧になる。

今回のJetBrains更新は、Local BYOKの利用面を広げる意味が大きい。GitHub Docsは、JetBrains、VS Code、Xcode、Copilot CLI、Copilot app、Copilot SDKなどでLocal BYOKを扱う流れを示している。つまり、JetBrainsだけの孤立した機能ではなく、Copilot全体で「GitHub-hosted model以外を選ぶ」方向が進んでいる。

## 事実: plugin managementとlocal sandboxも同時に入った

同じChangelogでは、customizations内のplugin managementも説明されている。Marketplaceやsource repositoryからpluginを参照・導入し、チーム固有のworkflowにCopilotを合わせやすくするという内容だ。これにより、モデルを差し替えるだけでなく、agentが使う拡張や手順もIDE内の設定面に寄ってくる。

Claude agent provider customizationsも含まれる。GitHubは、custom agents、skills、instructionsを設定できるとしており、Copilot Pro以上のplanでpublic previewとして利用できると説明している。6月の[Claude Agent provider記事](/blog/github-copilot-jetbrains-claude-provider-2026/)では、権限やpreview policyが主題だった。今回の更新では、その周辺にBYOK、plugin、sandboxがさらに重なる。

local sandboxingも重要である。GitHubは今回、JetBrains pluginにlocal sandboxing supportを追加し、sandbox settingsとconfiguration flowsをpublic previewとして提供するとしている。GitHub Docsのlocal sandbox設定では、Copilot CLIが実行するshell commandを隔離されたsandbox内で動かし、filesystem access、network connectivity、system capabilitiesを制御できると説明している。ネットワークのhost単位制御にはプラットフォーム制約があり、セキュリティ境界として過信すべきでないという注意もある。

## 分析: 日本企業ではモデル調達と実行境界を分けて設計する

ここからは分析である。

日本の開発組織では、JetBrains IDEはJava、Kotlin、Spring、Android、業務システム、金融・製造系の開発で使われることが多い。VS Codeの個人設定より、端末標準、IDE配布、plugin許可、社内プロキシ、ライセンス台帳と結びつく場合が多い。そこへBYOK custom endpointが入ると、モデル選択は個人の好みではなく、開発基盤チームの標準設計になる。

まず、モデル調達を分けて見る必要がある。GitHub-hosted modelを使う場合は、主にCopilotの利用条件、AI Credits、GitHub側のモデルポリシーを確認する。一方、BYOKでOpenAI互換endpoint、Azure OpenAI、Anthropic、社内gateway、ローカルモデルを使う場合は、GitHub以外の契約、請求、ログ、データ保持、障害対応が入る。開発者の画面では同じCopilotでも、裏側の責任主体は同じではない。

次に、実行境界を分ける必要がある。plugin managementやClaude agent providerが入ると、モデルが返す文章だけではなく、agentがどのtoolを使い、どのfileを読み書きし、どのcommandを実行するかが問題になる。BYOKで社内モデルを使っていても、pluginやterminalが広く許可されていれば、情報漏えいや誤変更のリスクは残る。逆にGitHub-hosted modelを使っていても、sandboxと承認フローを保守的にすれば、実行面のリスクは抑えられる。

[Copilot GPT-5.6のモデルポリシー](/blog/github-copilot-gpt-56-model-policy-2026/)で見たように、企業ではモデル許可そのものが管理者判断になる。今回のJetBrains更新は、そのモデル許可に、BYOK endpoint、plugin、sandboxという別の管理軸を足す。したがって、導入判断は「新しいモデルが使えるか」ではなく、「モデル、plugin、sandbox、agent providerを同じ台帳で説明できるか」で見るべきだ。

## 実務: 導入前に決める設定台帳

最初に作るべきなのは、provider台帳である。GitHub-hosted model、OpenAI互換endpoint、Azure OpenAI、Anthropic、社内gateway、ローカルモデルを並べる。各providerについて、利用可能なチーム、対象リポジトリ、扱えるデータ分類、課金先、ログの所在、障害時の一次担当を決める。

2つ目は、JetBrains plugin台帳である。GitHub Copilot pluginのversion、配布方法、更新タイミング、利用できるcustomizations、許可するplugin source、禁止するplugin、source repositoryから入れる場合のレビュー責任を記録する。Marketplaceから入れるものと社内source repositoryから入れるものを同じ扱いにすると、審査が弱くなる。

3つ目は、agent provider台帳である。GitHub cloud agent、Claude agent provider、組織custom agents、個人custom agentsを分ける。どのagentがfile editを行えるのか、tool callを行えるのか、terminalを使うのか、preview機能なのかを記録する。特にClaude agent providerやcustom agentsは、便利さより先に権限の確認が必要である。

4つ目は、sandbox台帳である。local sandboxを有効にするか、filesystemのread/write範囲をどうするか、network outboundを許すか、keychain accessを許すかを決める。GitHub Docsはlocal sandboxでfilesystem、network、general settingsを調整できると説明しているが、host単位のnetwork filteringには信頼できない場合がある。したがって、機密コードや本番資格情報を守る設計では、sandboxだけでなく、端末管理、認証情報分離、リポジトリ権限、CIレビューを組み合わせるべきだ。

5つ目は、費用台帳である。GitHub CopilotのAI Creditsに出る利用、BYOK先のクラウド請求に出る利用、ローカルモデル利用の端末負荷を分ける。BYOKはコスト削減や既存契約活用に効く可能性がある一方、Copilot側の利用量だけを見ても全体費用が分からない状態を作りやすい。日本企業では部門配賦や委託先利用も絡むため、請求データの正本を先に決めておく必要がある。

## 注意点: BYOKは責任を消すのではなく移す

BYOKは「自社の鍵を使えるから安全」という単純な機能ではない。GitHub Docsは、organizationのcustom modelsではAnthropic、AWS Bedrock、Google AI Studio、Microsoft Foundry、OpenAI、OpenAI-compatible providers、xAIなどをサポートし、governance、data security、compliance、cost management、visibility and controlに対応できると説明している。一方で、fine-tuned modelは品質が異なるため、本番利用前にテストとレビューが必要だとも示している。

つまりBYOKは、責任をGitHubから完全に消すのではなく、自社や外部model provider側へ一部移す。API keyのscope、発行者、失効、provider dashboard、下流model、ログ保持、障害時の切り分けを見なければならない。特にOpenAI互換endpointは便利だが、互換APIの先に何があるかは組織ごとに違う。社内gateway、vLLM、Ollama、商用API、proxyが混ざると、同じ「openai」provider typeでも監査上の意味は変わる。

また、local sandboxは万能な防御壁ではない。filesystem writeを絞っても、許可したworking directory内の重要ファイルは変更できる。networkを止めても、既に端末にあるcredentialやローカルファイルの扱いは別途見る必要がある。pluginが増えれば、source repository、更新、依存関係、社内レビューも必要になる。JetBrains内のCopilot体験が便利になるほど、管理者は「どの境界で止めるか」を明文化しなければならない。

## まとめ

GitHub Copilot for JetBrains IDEsの2026年7月14日更新は、BYOK custom endpoint、plugin management、Claude agent provider customizations、local sandboxingをまとめてJetBrains利用者へ近づけた。事実としては、モデル接続の自由度が上がり、agent拡張と実行境界の設定面も広がった。

日本企業にとって重要なのは、JetBrainsで好きなモデルを使えることではない。社内モデルや外部providerをどのデータ分類で使い、pluginをどこから入れ、agent providerを誰に出し、local sandboxをどの権限で動かし、費用をどの台帳で見るかである。Copilotを開発基盤へ広げるなら、今回の更新は便利な新機能ではなく、IDE内AIの統制設計を更新する合図として扱うべきだ。

## 出典

- [GitHub Copilot for JetBrains expands BYOK capabilities](https://github.blog/changelog/2026-07-14-github-copilot-for-jetbrains-expands-byok-capabilities/) - GitHub Changelog, 2026-07-14
- [Bring your own key for GitHub Copilot](https://docs.github.com/en/copilot/concepts/models/bring-your-own-key) - GitHub Docs
- [Enabling custom models for GitHub Copilot in your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/enable-custom-models) - GitHub Docs
- [Using your own LLM models in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-byok-models) - GitHub Docs
- [Configuring local sandbox settings](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/configuring-local-sandbox-settings) - GitHub Docs
