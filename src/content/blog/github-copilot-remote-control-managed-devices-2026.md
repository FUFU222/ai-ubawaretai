---
title: 'GitHub Copilot遠隔操作、管理端末限定の設定実務'
description: 'GitHub CopilotのremoteControl設定で遠隔操作できる端末を限定できる。日本企業がSSO、MDM、BYOD、委託先PCの承認線と監査ログをどう決めるか整理する。'
pubDate: '2026-07-31'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', '管理者設定', 'AIガバナンス', '情シス', '日本企業', 'セキュリティ']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月30日**、GitHub Copilot の remote control を管理デバイス単位で制御する **`remoteControl` enterprise managed setting** を発表した。Copilot CLI の session を GitHub.com や GitHub Mobile から操作できる機能について、企業や組織が「どの端末で始まった session なら遠隔操作を許すか」を細かく決められるようにする更新である。

これは、[Copilot CLI遠隔操作GA](/blog/github-copilot-cli-remote-control-ga-2026/) の続編として読むべきだ。5月の GA は、長時間の CLI agent 作業を Web や Mobile から確認し、質問や permission request に答えられるようにした。今回の更新は、その便利な操作面を、会社支給端末、MDM 管理端末、BYOD、委託先 PC のどこまで許すかという統制面へ落とし込む。

すでに [GitHub Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/) で見たように、Copilot の企業管理は GitHub アカウント側だけではなく端末管理へ広がっている。さらに [Copilot app統制](/blog/github-copilot-app-policy-managed-settings-2026/) のように、app、CLI、VS Code、cloud agent が同じ managed settings の対象になりつつある。remote control も、この管理体系の中で扱うべき機能になった。

## 事実: remoteControlで端末側の条件を配る

GitHub の発表によると、新しい `remoteControl` enterprise managed setting は、遠隔操作される Copilot session を host する端末側の条件を制御する。既存の enterprise policy は、ユーザーに remote control を使わせるかどうかを大枠で決める。今回の managed setting は、そのうえで管理済み端末ごとに remote control の動作を絞る。

設定できる mode は3つである。`disabled` は、その端末で始まった session の remote control を止める。`enabled` は制限なく許可する。`requireSSO` は、指定した GitHub.com organization に対して remote 側の client が SSO authorization を持つ場合だけ許可する。`requireSSO` では `githubDotComOrganizations` に対象 organization login を列挙する。

GitHub Docs の managed settings reference では、`remoteControl` は「この端末で host された session を遠隔操作できるか」を制限する設定だと説明されている。重要なのは、ユーザーが別の端末で host している session を操作する能力まで一律に止める設定ではない点だ。制御対象は、あくまでその managed settings を受け取った端末で始まった session である。

配布方法は、server-managed、MDM-managed、file-based の3つだ。server-managed は `.github-private` repository の `copilot/managed-settings.json` を使い、enterprise のユーザーアカウントに適用する。MDM-managed は Intune や Jamf などの端末管理ツールから対象デバイスグループへ配る。file-based は `managed-settings.json` を受け取った端末に適用する。端末を対象にした remote control 制御では、MDM-managed と file-based の意味が特に大きい。

## 事実: policyとmanaged settingsは役割が違う

remote control には、2つの管理面がある。1つ目は「そのユーザーや organization で remote control を使えるか」という policy である。GitHub Docs は、organization や enterprise の seat で使う場合、"Store local sessions in the Cloud" policy が View and control になっている必要があると説明している。この policy が無効または未設定なら、session syncing や remote control は使えない。

2つ目が、今回の `remoteControl` managed setting である。こちらは、remote control が policy 上は許可されている場合でも、その端末で host した session を遠隔操作できる条件をさらに絞る。つまり、全社 policy で機能を開き、管理端末では `requireSSO`、検証端末では `enabled`、共有端末や BYOD では `disabled` のように使い分けられる。

この分離は、日本企業にとって扱いやすい。情シスやセキュリティ部門は、まず enterprise policy で大枠を決める。そのうえで、MDM 管理下の会社支給 PC、開発用 VDI、貸与 Mac、委託先向け端末、個人所有 PC で異なるルールを配る。GitHub アカウントの権限だけでなく、端末の管理状態を remote control の条件に入れられる。

一方で、管理面が増えるほど、説明責任も増える。policy は有効なのに端末側の `remoteControl` が `disabled` なら、利用者から見ると「なぜ自分だけ使えないのか」に見える。`requireSSO` では、対象 organization の SSO authorization が切れていると遠隔操作できない。ヘルプデスクや開発基盤チームは、policy、managed settings、SSO、client version、端末配布状態を切り分ける手順を持つ必要がある。

## 分析: 焦点はBYODと委託先端末になる

ここからは分析である。

remote control の価値は、長時間の agent 作業が人間の判断待ちで止まる時間を減らすところにある。Copilot CLI が調査、修正、テスト、再試行を進めている途中で、開発者が会議中、移動中、別作業中でも GitHub Mobile から permission request に答えられる。この便利さは、開発速度には効く。

しかし、遠隔操作の便利さは端末リスクと表裏である。session 自体は host 端末で動き、shell command、file operation、tool execution も host 端末上で実行される。remote 側のスマートフォンやブラウザは、直接マシンへログインするわけではないが、承認や追加指示を送れる。つまり、host 端末の管理状態と、remote 側 client の認証状態の両方が重要になる。

日本企業では、会社支給 PC と個人端末が混ざる。GitHub Enterprise の seat は会社が付与していても、開発者が個人所有 PC で OSS 作業や検証作業をする場合がある。委託先が自社 PC で作業する場合もある。こうした端末で remote control を無条件に許すと、会社が管理していない環境で始まった agent session を、別端末から承認し続ける運用になる。

`remoteControl` は、この境界を引くための部品になる。会社支給端末では `requireSSO` にして、遠隔操作する client が自社 organization の SSO 承認済みであることを求める。管理外端末では `disabled` にする。開発基盤チームの検証端末では、短期間だけ `enabled` にして挙動を確認する。これにより、remote control を単なる個人機能ではなく、端末標準の一部として扱える。

この設計は [Copilot code reviewのAgent skillsとMCP GA](/blog/github-copilot-code-review-skills-mcp-ga-2026/) ともつながる。Copilot は補完、CLI、code review、app、cloud agent、MCP を横断する開発基盤になっている。どこから agent を起動し、どこで人間が承認し、どの端末に実行権限が残るかを分けて見なければならない。

## 管理者が最初に決める5つの設定

第一に、remote control を許す端末カテゴリを決める。会社支給 PC、MDM 管理 Mac、VDI、開発用 Linux、委託先貸与端末、BYOD、共有端末、CI runner 風の作業端末を分ける。少なくとも、管理外端末と共有端末は `disabled` を初期値にするのが現実的だ。

第二に、`requireSSO` の対象 organization を決める。複数 organization を使う企業では、どの GitHub.com organization の SSO authorization を条件にするかが重要になる。事業部 organization、子会社 organization、委託先共同 organization を一括で許すと境界が薄くなる。remote control を許す業務 organization に絞るべきだ。

第三に、MDM と server-managed の責任分担を決める。端末グループごとの差をつけるなら MDM-managed が向く。全 enterprise の利用者へ同じ標準を配るなら server-managed が扱いやすい。container、Codespaces、特殊な Linux 環境では file-based も選択肢になる。GitHub Docs の優先順位では、MDM-managed、server-managed、file-based、user-level の順に強い。複数経路を使う場合は、どれが勝つかを先に説明しておく。

第四に、承認禁止リストを作る。remote control で permission request に答えられるからといって、移動中に何でも承認してよいわけではない。production data、認証設定、課金、secret、env file、DB migration、顧客影響のあるコマンド、本番障害対応は、遠隔承認禁止または追加確認必須にする。ルールは Copilot CLI の instructions、社内 runbook、セキュリティ教育に反映する。

第五に、ログと問い合わせ手順を決める。remote control を有効にすると、session events や permission request などが GitHub 側へ送られる。管理者は、どの情報が GitHub に保存されるか、どのログを後から見られるか、GitHub Mobile 側の通知に何が出るかを確認する。ヘルプデスクには、policy、SSO、client version、MDM 配布状態、端末 sleep、network 接続を確認するチェックリストが必要だ。

## 30日で確認するpilot手順

最初の1週間は、remote control を使っているチームと端末を棚卸しする。Copilot CLI の利用者、GitHub Mobile 利用者、会社支給端末、BYOD、委託先端末、既存の managed settings を一覧化する。すでに [Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/) を配っている企業は、同じ配布経路に `remoteControl` を加えられるか確認する。

2週目は、少人数の管理端末で `requireSSO` を試す。対象 organization を1つに絞り、SSO authorization がある場合と切れている場合で、remote control が期待通りに動くか確認する。GitHub.com、GitHub Mobile、VS Code からの操作、端末 sleep、network 切断、`copilot --continue` や `copilot --resume` での再開も見る。

3週目は、禁止端末を明確にする。共有端末、個人端末、委託先所有 PC、顧客環境の端末で `disabled` を配るか、そもそも remote control policy を開かないかを決める。特に委託開発では、発注側と委託先のどちらが permission request を承認できるのか、承認履歴をどこに残すのかを契約・運用の両方で確認する。

4週目は、展開判断をする。pilot で見るべき指標は、利用者数ではなく、承認待ち時間、remote から承認した request の種類、承認後の手戻り、禁止領域への接触、問い合わせ件数、MDM 反映失敗である。便利だったかだけでなく、遠隔承認がレビュー品質と監査負荷を悪化させていないかを見る。

## まとめ

GitHub Copilot の `remoteControl` managed setting は、remote control を「使えるか」から「どの端末で始まった session なら使えるか」へ管理粒度を上げる更新である。`disabled`、`enabled`、`requireSSO` を server-managed、MDM-managed、file-based の経路で配れるため、会社支給端末と管理外端末を分けた運用がしやすくなる。

日本企業は、この更新を Copilot CLI の便利機能としてだけ扱わないほうがよい。AI agent の実行は host 端末に残り、人間の承認面だけが Mobile や Web へ広がる。だからこそ、SSO、MDM、BYOD、委託先、禁止承認、ログを一体で決める必要がある。まずは管理済み端末の pilot から始め、remote control を開発者個人の判断ではなく、端末統制の一部として扱うべきだ。

## 出典

- [Limit remote control to managed devices](https://github.blog/changelog/2026-07-30-limit-remote-control-to-managed-devices/) - GitHub Changelog, 2026-07-30
- [Configuring enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings) - GitHub Docs
- [Enterprise managed settings reference](https://docs.github.com/en/copilot/reference/enterprise-managed-settings-reference) - GitHub Docs
- [About remote control of GitHub Copilot CLI sessions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-remote-control) - GitHub Docs
