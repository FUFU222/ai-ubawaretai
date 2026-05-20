---
article: 'github-copilot-cli-remote-control-ga-2026'
level: 'child'
---

GitHubは**2026年5月18日**、GitHub Copilot CLIのremote controlを一般提供した。これにより、terminalで始めたCopilot CLI sessionを、GitHub Mobileやgithub.comから見たり、質問へ答えたり、permission requestを承認または拒否したりできる。

簡単に言うと、Copilot CLIでAI agentに作業を頼んだあと、ずっとPCの前で待っていなくてもよくなる。移動中や会議の合間に、スマートフォンから進捗を見て、必要な判断だけ返せる。

## 何ができるようになったのか

GitHubの発表では、remote controlを有効にすると、Copilot CLIのsession activityがリアルタイムで見られる。作業の進み具合を確認し、途中で追加指示を出し、実装前のplanを見直し、必要ならsessionを止めることもできる。

Copilotが「この操作をしてよいですか」と聞いてきたとき、GitHub Mobileやgithub.comから承認または拒否できる。Copilotから質問された場合も、遠隔で答えられる。つまり、AI agentの作業が人間の返事待ちで止まる時間を減らせる。

使い始めるには、Copilot CLIを最新版にしたうえで、最初から `copilot --remote` で起動するか、作業中に `/remote on` を入力する。CLIに表示されるQRコードやリンクから、GitHub Mobileやgithub.comでsessionを開ける。長い作業では `/keep-alive` でマシンがスリープしないようにすることも案内されている。

## なぜ日本の開発チームに関係するのか

AIコーディングagentは、短い補完よりも、調査、修正、テスト、再修正のような長い作業で価値を出しやすい。ただし、その途中で人間の判断が必要になる。開発者が席を外していると、そこで作業が止まってしまう。

remote controlがあれば、開発者はPCの前に戻らなくても、必要な判断を返せる。会議中の休憩、通勤中、別作業の合間などに、Copilotの質問へ答えられる。これは、CIが長いプロジェクトや、複数回のテストが必要な修正ではかなり実用的だ。

ただし、スマートフォンから承認できることは、便利さだけでなくリスクでもある。小さな画面でpermission requestを確認すると、どのfile pathやcommandを許可しているのか見落としやすい。個人スマートフォンで使うのか、会社管理端末だけにするのかも決める必要がある。

## 企業では設定が必要になる

GitHub Docsでは、organizationやenterpriseのseatでremote controlを使う場合、管理者がRemote Control policyを有効にする必要があると説明されている。このpolicyは既定ではoffだ。つまり、企業では利用者が勝手に全員使うというより、管理者が許可範囲を決める機能になる。

ここは、[Copilot CLI企業管理plugin](/blog/github-copilot-cli-enterprise-plugins-2026/)や[Copilot cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)とも関係する。AI agentをどこまで動かしてよいか、どんなMCPやhooksを使わせるか、どのリポジトリで許可するかをそろえないと、遠隔操作だけが先に広がってしまう。

また、GitHubはremote controlが非GitHubリポジトリやリポジトリ外ディレクトリにも対応したと説明している。この場合は `github.com/copilot/agents` にsessionが表示される。GitHub上のPR作業だけでなく、ローカル調査や社内template作成でも使われる可能性がある。

## 最初に試すなら

最初は低リスクな作業に限定するのがよい。たとえば、ドキュメント更新、テスト追加、lint修正、小さなrefactor、原因調査などだ。認証、課金、DB migration、本番データ、個人情報に関わる作業では、移動中の短い確認だけで承認しないほうがよい。

社内で使うなら、次の点を決めておきたい。

- どのチームにremote controlを許可するか
- 個人スマートフォンを許すか、管理済み端末だけにするか
- どんなpermission requestは遠隔で承認してよいか
- 承認した理由をPRやissueに残す必要があるか
- 端末がスリープした場合や紛失した場合にどう止めるか

[Copilot Spaces API](/blog/github-copilot-spaces-api-ga-context-2026/)のような共有文脈管理や、[Copilot Autopilot](/blog/github-copilot-autopilot-vscode-2026/)のような自律実行機能と組み合わせるほど、こうしたルールは重要になる。

## まとめ

GitHub Copilot CLIのremote control GAは、Copilot CLIをPCのterminalだけで使うものから、Mobile、Web、IDEをまたいで操作できるagent sessionへ広げる更新だ。日本の開発チームでは、承認待ちを減らす効果が期待できる。

一方で、遠隔操作は端末管理、権限、ログ、承認ルールとセットで考える必要がある。最初は少人数、低リスクな作業、管理済み端末から試し、どれだけ待ち時間が減るかと、どんなリスクが出るかを同時に見るのが現実的だ。

## 出典

- [Remote control for Copilot CLI sessions now generally available on mobile, web, and VS Code](https://github.blog/changelog/2026-05-18-remote-control-for-copilot-cli-sessions-now-generally-available-on-mobile-web-and-vs-code) - GitHub Changelog, 2026-05-18
- [About remote control of GitHub Copilot CLI sessions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-remote-control) - GitHub Docs
- [Steering a GitHub Copilot CLI session from another device](https://docs.github.com/copilot/how-tos/copilot-cli/steer-remotely) - GitHub Docs
