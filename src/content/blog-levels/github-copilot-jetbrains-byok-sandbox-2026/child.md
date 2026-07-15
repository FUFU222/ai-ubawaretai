---
article: 'github-copilot-jetbrains-byok-sandbox-2026'
level: 'child'
---

GitHub Copilot for JetBrains IDEsに、BYOKのcustom endpoint、plugin management、Claude agent provider customizations、local sandboxingが追加されました。難しく聞こえますが、ざっくり言うと「JetBrainsの中で、GitHubが用意したモデルだけでなく、自分たちのモデルやendpointを使いやすくし、agentの拡張や実行範囲も設定しやすくする更新」です。

JetBrains IDEは、日本ではJava、Kotlin、Spring、Android、業務システム開発でよく使われます。そこにCopilotのagent機能が入ると、ただコード補完を受けるだけでなく、ファイル編集、コマンド実行、plugin利用、外部モデル接続まで関係してきます。

## 事実: BYOKは自分のモデル接続を使う仕組み

BYOKはBring Your Own Keyの略です。自分のAPI keyやendpointを使って、Copilotから外部モデルや社内モデルへ接続する考え方です。今回のJetBrains更新では、OpenAI互換のcustom endpointとAPI keyを設定できるようになったことがポイントです。

GitHub Docsでは、BYOKにはローカルに設定する方式と、organizationやenterpriseの管理者が全員向けにcustom modelを設定する方式があると説明されています。ローカル設定は個人の端末側に近く、Enterprise BYOKは組織のモデル選択として配るものです。

ここを分けて理解することが大切です。個人が試すBYOKと、会社が標準として許可するBYOKは同じではありません。会社で使うなら、誰のAPI keyを使うのか、費用はどこに出るのか、ログはどこで見られるのかを決める必要があります。

## 事実: pluginとsandboxも関係する

今回の更新はBYOKだけではありません。GitHubは、JetBrainsのcustomizationsにplugin managementを入れ、Marketplaceやsource repositoryからpluginを扱えるようにしたと説明しています。つまりCopilotの動きをチームのworkflowに合わせやすくなります。

local sandboxingも追加されています。sandboxとは、Copilotが実行するshell commandの影響範囲を絞るための仕組みです。GitHub Docsでは、filesystem、network、system capabilitiesを制御できると説明されています。

ただし、sandboxをオンにすれば何でも安全になるわけではありません。許可したフォルダの中は読み書きできますし、ネットワーク制御にも制約があります。安全に使うには、sandbox、plugin許可、API key管理、人間レビューを組み合わせる必要があります。

## 分析: 日本の開発チームで重要なこと

ここからは分析です。

今回の更新で大切なのは、「JetBrainsで好きなAIモデルを選べるようになった」という話だけではありません。日本企業では、どのデータをどのAIへ送ってよいか、どの契約で費用を見るか、どのpluginを許可するかが実務上の問題になります。

たとえば、社内の軽いREADME修正ならGitHub-hosted modelで十分かもしれません。一方、顧客データや業務仕様を含むコードを扱う場合は、社内gatewayや特定クラウド契約を使いたいことがあります。BYOKはその選択肢を増やしますが、責任も増えます。

また、agentが強くなるほど、実行範囲が重要になります。モデルを自社契約にしても、pluginやterminal commandを広く許可すれば事故は起きます。逆にモデルはGitHub-hostedでも、sandboxや人間承認を保守的にすればリスクを下げられます。

## 実務: まず小さく決める

最初に決めるべきことは、使ってよいproviderの一覧です。GitHub-hosted model、OpenAI互換endpoint、Azure OpenAI、Anthropic、社内gateway、ローカルモデルを並べ、どのチームがどの用途で使えるかを決めます。

次に、pluginの扱いを決めます。Marketplaceから自由に入れてよいのか、社内で確認したsource repositoryだけにするのか、誰が更新を確認するのかを決めます。

3つ目に、sandboxの設定を決めます。書き込みできるフォルダ、外部ネットワーク接続、keychain accessをどうするかを確認します。開発者の便利さだけでなく、誤変更や資格情報の扱いも考える必要があります。

## まとめ

GitHub Copilot for JetBrains IDEsの今回の更新は、BYOK custom endpoint、plugin management、Claude agent provider、local sandboxingをまとめて進めるものです。JetBrainsをよく使う日本の開発チームでは、AIモデルの選択だけでなく、plugin、sandbox、費用、API key管理をまとめて見直すきっかけになります。

「使えるモデルが増えた」とだけ見ると軽く見えますが、実際にはIDE内AIを会社の開発基盤としてどう管理するかという話です。まずは低リスクなリポジトリと小さなチームで試し、設定台帳とレビュー手順を作ってから広げるのが現実的です。

## 出典

- [GitHub Copilot for JetBrains expands BYOK capabilities](https://github.blog/changelog/2026-07-14-github-copilot-for-jetbrains-expands-byok-capabilities/) - GitHub Changelog, 2026-07-14
- [Bring your own key for GitHub Copilot](https://docs.github.com/en/copilot/concepts/models/bring-your-own-key) - GitHub Docs
- [Configuring local sandbox settings](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/configuring-local-sandbox-settings) - GitHub Docs
