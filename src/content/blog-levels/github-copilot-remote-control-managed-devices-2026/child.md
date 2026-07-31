---
article: 'github-copilot-remote-control-managed-devices-2026'
level: 'child'
---

GitHubは**2026年7月30日**、GitHub Copilotの遠隔操作を管理デバイス単位で制御する設定を追加した。名前は `remoteControl` で、Copilot CLIのsessionをGitHub.comやGitHub Mobileから操作できるかを、端末側のmanaged settingsで決められる。

背景には、Copilot CLIのremote controlがある。開発者は、手元の端末でCopilot CLIに長い作業を任せ、離席中でもスマートフォンやブラウザから進捗を見たり、質問に答えたり、permission requestを承認したりできる。これは便利だが、会社としては「どの端末で始めた作業なら遠隔操作を許してよいか」を決める必要がある。

## 何が変わったのか

新しい `remoteControl` では、modeを3つから選べる。`disabled` は、その端末で始まったCopilot sessionの遠隔操作を止める。`enabled` は制限なく許可する。`requireSSO` は、指定したGitHub organizationにSSO承認済みのclientからだけ遠隔操作を許す。

この設定は、server-managed、MDM-managed、file-basedの3つの方法で配れる。server-managedはGitHubの`.github-private` repositoryを使う方法で、企業全体の標準に向く。MDM-managedはIntuneやJamfのような端末管理ツールで配る方法で、会社支給PCや管理済みMacに向く。file-basedは設定ファイルを置く方法で、Linuxやcontainerのような環境でも使える。

ここで大事なのは、既存のremote control policyとは役割が違うことだ。policyは、そのユーザーやorganizationでremote controlを使えるかを決める。`remoteControl` managed settingは、使える状態になっているうえで、その端末から始まったsessionを遠隔操作してよいかをさらに絞る。

## なぜ日本企業で重要なのか

日本の開発現場では、会社支給PC、個人PC、委託先PC、VDI、開発用サーバーが混ざりやすい。GitHub Copilotのseatは会社が付けていても、実際の作業端末が常に会社管理下とは限らない。

remote controlでは、Copilot CLI自体は作業を始めた端末で動き続ける。遠隔側のスマートフォンやブラウザは、直接その端末に入るわけではない。それでも、承認や追加指示を送れる。つまり、端末が管理されていないと、管理外の環境で動くagent作業を遠隔から進められてしまう。

会社としては、管理済み端末では`requireSSO`、共有端末や管理外端末では`disabled`のように分けるのが自然だ。検証チームだけ一時的に`enabled`にして、使い勝手やログを確認する方法もある。

## 最初に決めること

まず、どの端末カテゴリでremote controlを許すかを決める。会社支給PC、MDM管理Mac、VDI、委託先貸与端末、BYOD、共有端末を分けて考える。

次に、`requireSSO`で対象にするorganizationを決める。複数のGitHub organizationがある会社では、すべてを許すのではなく、業務で使うorganizationに絞るほうが安全だ。

さらに、遠隔承認してはいけない作業を決める。DB migration、本番データ、secret、課金、認証設定、顧客影響のある操作は、スマートフォンから短い確認だけで承認しないルールが必要になる。

最後に、問い合わせ手順を用意する。remote controlが動かない原因は、policy、SSO、managed settings、端末のsleep、ネットワーク、client versionのどれかかもしれない。ヘルプデスクが切り分けられるようにしておくと、展開後の混乱が減る。

## まとめ

GitHub Copilotの`remoteControl`設定は、remote controlを便利に使うためだけの機能ではない。会社が管理している端末と、管理していない端末を分けて、AI agentへの遠隔承認をどこまで許すかを決めるための機能である。

日本企業は、いきなり全社で開くより、まず管理済み端末と少人数のチームで試すのがよい。SSO、MDM、BYOD、委託先、禁止承認、ログを一緒に確認してから、段階的に広げるべきだ。

## 出典

- [Limit remote control to managed devices](https://github.blog/changelog/2026-07-30-limit-remote-control-to-managed-devices/) - GitHub Changelog, 2026-07-30
- [Configuring enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings) - GitHub Docs
- [Enterprise managed settings reference](https://docs.github.com/en/copilot/reference/enterprise-managed-settings-reference) - GitHub Docs
