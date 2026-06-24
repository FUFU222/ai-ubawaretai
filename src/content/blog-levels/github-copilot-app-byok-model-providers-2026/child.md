---
article: 'github-copilot-app-byok-model-providers-2026'
level: 'child'
---

GitHubは2026年6月23日、**GitHub Copilot app**で**BYOK**を使えるようにしたと発表しました。BYOKはBring Your Own Keyの略で、自分が持っているモデルプロバイダーのAPIキーやエンドポイントをCopilot appに登録し、そのモデルをagent sessionで使う考え方です。

たとえば、OpenAI、Azure OpenAI、Microsoft Foundry、Anthropic、Ollama、LM Studio、OpenAI互換エンドポイントなどを登録できます。登録したモデルは、Copilot appのmodel pickerにGitHub-hosted modelと並んで表示されます。

## 何が変わるのか

これまでのCopilot appは、IssueやPull RequestからAI agent作業を始める入口として見られていました。[GitHub Copilot appのtechnical preview](/blog/github-copilot-app-technical-preview-2026/)では、agent sessionを作り、branchやfilesや会話を分けて作業できることが重要でした。

その後の[Copilot appキャンバス](/blog/github-copilot-app-canvases-agent-work-2026/)では、agentが進めた作業をplan、browser、terminal、checklistのような作業面で見やすくする方向が出ました。

今回のBYOKは、そのagentが使うモデルを会社側や開発者側が選べるようにする更新です。GitHubが用意したモデルだけでなく、会社がすでに契約しているAzure OpenAIやAnthropic、あるいはローカルで動かすOllamaやLM Studioを選べます。

## 日本企業で大事な理由

日本の会社では、コードや業務情報をどこへ送ってよいかが問題になりやすいです。金融、医療、製造、公共、委託開発では、顧客名、設計情報、契約情報、個人情報が開発作業に混ざることがあります。

BYOKを使うと、自社のクラウド契約、特定のテナント、社内gateway、ローカルモデルを経由させる選択肢ができます。これはデータ境界を考えるうえで役に立ちます。

ただし、BYOKなら必ず安全という意味ではありません。Azure OpenAIを使うならAzure側の契約やリージョンを確認する必要があります。Anthropicを使うならデータ取り扱い条件を確認する必要があります。ローカルモデルを使うなら、端末に何が残るか、モデル品質が十分かを見なければなりません。

## 費用も分かれやすくなる

BYOKでは費用の見方も変わります。GitHub-hosted modelを使う場合は、[Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/)の管理が中心です。一方、外部プロバイダーを使うと、AzureやOpenAIやAnthropic側の請求に費用が出る可能性があります。

開発者から見ると同じCopilot appでも、会社の経理や管理者から見ると請求元が分かれるかもしれません。そのため、どのモデルを誰が使ってよいのか、どの予算で見るのかを先に決める必要があります。

## どう始めるとよいか

最初は、低リスクな作業から試すのがよいです。READMEの下書き、ログの要約、テストケース案、軽いコード読解、issue分類などです。顧客データ、認証、課金、権限変更、本番障害対応のような作業を最初からローカルモデルや未承認providerに任せるのは危険です。

また、[Copilot CLI企業管理プラグイン](/blog/github-copilot-cli-enterprise-plugins-2026/)のような管理機能と合わせて、会社として許可するproviderやMCP、pluginを整理することも大切です。Copilot appだけでなく、CLIやagent作業全体で何を許すかをそろえる必要があります。

## まとめ

Copilot appのBYOK対応は、AI agentが使うモデルを自分たちで選べるようにする更新です。便利ですが、モデル選択、データ境界、費用、APIキー管理を一緒に考えなければなりません。

日本の開発チームは、まず「どの作業をどのモデルに任せてよいか」を決めるべきです。BYOKは自由度を増やしますが、自由にした分だけ、承認ルールとレビュー責任も必要になります。

## 出典

- [GitHub Copilot app support for BYOK](https://github.blog/changelog/2026-06-23-github-copilot-app-support-for-byok/) - GitHub Changelog, 2026-06-23
- [Using your own LLM models in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/use-byok-models) - GitHub Docs
