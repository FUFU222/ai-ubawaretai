---
article: 'github-copilot-app-all-users-byok-2026'
level: 'child'
---

GitHubは2026年7月7日、**GitHub Copilot app**を全Copilot planで使えるようにしたと発表しました。macOS、Windows、Linuxのdesktop appからGitHub accountでsign inし、AI agentに質問したり、repositoryで作業させたりできます。

今回の大事な点は、Copilotの契約を持っていない人にも「自分のmodel providerを使う」という入口があることです。これをBYOK、つまりbring your own keyと呼びます。会社が契約したCopilotだけでなく、個人やチームが別のmodel keyを使って作業する可能性が出ます。

## 何が変わったのか

GitHub Copilot appは、chatだけの画面ではありません。Docsでは、quick chatで質問するだけでなく、issueやtaskからagent sessionを作り、code changeへ進める流れが説明されています。local folder、GitHub repository、任意のGit URLを接続することもできます。

6月には、Copilot appのcanvasesやcloud sessionsが広がりました。今回の変更は、そのappをより多くの人が使えるようにするものです。つまり、AI agentを使う入口が、一部のpreview利用者から、普通の開発者toolに近づいたと言えます。

## BYOKで注意すること

BYOKは便利です。会社が選んだmodel providerを使いたい場合や、特定のmodelを試したい場合には役立ちます。しかし、会社の管理外で個人keyを入れてしまうと、誰の費用で、どのproviderへ、どのcodeやissue情報が送られるのか分かりにくくなります。

たとえば、会社支給PCで個人GitHub accountにsign inし、自分のprovider keyで社内repositoryを読ませるとします。この場合、GitHub Copilotの企業契約だけを見ても、利用実態を説明できません。provider側の請求、ログ、データ利用条件も確認が必要です。

## 日本企業が決めるべきこと

最初に決めるのは、Copilot appを誰に配るかです。全員にすぐ配るより、開発基盤、QA、SRE、社内tool teamのように、agent作業を管理しやすいチームから始める方が安全です。

次に、BYOKを許可するかを決めます。許可するなら、会社指定providerだけにするのか、個人keyを禁止するのか、keyの発行者や停止手順をどうするのかを決めます。禁止する場合も、例外申請の流れを用意した方が現場は迷いません。

repositoryの種類も分けるべきです。README修正、test追加、依存関係更新のような低リスク作業と、認証、課金、個人情報、顧客データを扱う作業を同じ扱いにしない方がよいです。Copilot appはlocal folderも接続できるため、GitHub organization設定だけでは足りない場合があります。

## 費用の見方も変わる

会社契約のCopilot利用は、AI Creditsやseat数で見られます。しかしBYOKでは、provider側の請求が別に発生します。つまり、Copilot appを使っていても、費用がGitHub請求だけにまとまらない可能性があります。

導入時は、GitHub側のAI Credits、BYOK providerの請求、CIの実行回数、作られたPR数、reviewの差し戻しをまとめて見るとよいです。便利になっただけでsessionが増え、費用とreview負荷だけが増えることもあります。

## まとめ

GitHub Copilot appの全開放は、AI agentをdesktopから使う入口を広げる更新です。開発者には便利ですが、企業ではBYOK、端末配布、account、repository、費用の境界を決める必要があります。

日本の開発チームは、まず小さな範囲で試し、どのprovider keyを使うか、どのrepositoryで使えるか、どの作業では人間reviewを必須にするかを決めるべきです。Copilot appは作業を速くする可能性がありますが、管理の設計を省いてよい理由にはなりません。

## 出典

- [GitHub Copilot app available to all](https://github.blog/changelog/2026-07-07-github-copilot-app-available-to-all/) - GitHub Changelog
- [Getting started with the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/getting-started) - GitHub Docs
- [GitHub Copilot app changelog](https://github.com/github/app/blob/main/changelog.md) - GitHub
