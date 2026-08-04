---
title: 'GitHub Copilot team管理設定、部門別AI統制の実務'
description: 'GitHub Copilotのteam managed settingsを整理。日本企業がmanaged-settings.json、team-mappings、例外承認、監査ログをどう設計するか解説する。'
pubDate: '2026-08-04'
category: 'news'
tags: ['GitHub Copilot', '管理者設定', 'AIガバナンス', '開発者ツール', '企業導入', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年8月3日**、GitHub Copilot の enterprise managed settings を enterprise team 単位で専門化できるようにしたと発表した。管理者は `.github-private` repository の `copilot/managed-settings.json` を全社標準として置き、その中で許可した項目だけを `copilot/team-mappings.json` と `copilot/teams/` 配下の設定ファイルで team ごとに変えられる。

これは、Copilot の管理が「全社で同じ設定を配る」段階から、「全社の床を守りながら、職種や部門ごとの例外をレビュー可能にする」段階へ進んだことを示す。[Copilot teamsモデル統制](/blog/github-copilot-enterprise-teams-model-access-2026/)では team 単位のモデル解禁を扱った。今回の焦点はさらに広く、モデル選択、bypass permission、plugin、marketplace まで含む managed settings の例外運用である。

既に [Copilot遠隔操作の管理端末限定](/blog/github-copilot-remote-control-managed-devices-2026/) や [Copilot OTel管理](/blog/github-copilot-opentelemetry-managed-export-2026/) で整理したように、Copilot は VS Code、Copilot CLI、Copilot app、cloud agent をまたぐ管理対象になっている。team managed settings は、この横断管理を部門別に配るための部品として見るべきだ。

## 事実: teamごとに上書きできる設定を明示する

GitHub の発表によると、enterprise 管理者は `managed-settings.json` で一部の key を team-specific value の対象にできる。対象にする key は `{ "overridable": ... }` という形で標準値を持たせる。team 側が値を持てばそれを使い、持たなければ enterprise default に戻る。対象にしていない key は enterprise level の決定として残り、team は変更できない。

docs では、team 別の上書き対象として `permissions.model` と `permissions.disableBypassPermissionsMode` が説明されている。たとえば enterprise 標準では Auto model を既定にし、bypass permission を止める。一方で、AI 推進 team や security team だけには model 選択や bypass mode の扱いを team file で変える、といった運用が可能になる。

もうひとつ重要なのは、plugin と marketplace の扱いである。`enabledPlugins` と `extraKnownMarketplaces` は、team 側で加算できる設計として説明されている。つまり、enterprise 標準で必須 plugin や許可 marketplace の床を作り、特定の職種や業務 team だけに追加 plugin や追加 marketplace を重ねる。全社の最低基準を弱めず、必要な team だけに拡張を渡せる。

設定の対応 surface も確認しておきたい。GitHub は、`managed-settings.json` の構成が VS Code、Copilot CLI、Copilot app、Copilot cloud agent で enforcement されると説明している。ただし key ごとの対応は異なるため、設定を書いたら全 surface で同じ意味になると仮定してはいけない。

## 事実: team-mappings.jsonで設定ファイルとteamを結びつける

server-managed deployment では、企業の `.github-private` repository に `copilot/managed-settings.json` を置く。team 別設定を使う場合は、`copilot/team-mappings.json` で team settings file と enterprise team slug を対応させ、実際の差分設定を `copilot/teams/` 配下へ置く。

この設計の実務上の利点は、設定変更を GitHub の pull request と review workflow に乗せられる点である。GitHub の発表も、AI standards source repository を internal visibility にし、利用者が specialized governance configuration の変更を pull request で提案できる運用に触れている。日本企業であれば、開発基盤チームが標準値を持ち、各部門の lead が例外設定を PR で申請し、security や情シスが review する形にしやすい。

ただし、team file に何でも書けるわけではない。docs は、team file には enterprise 側で overridable として印を付けた key だけを含めると説明している。その他の key は enterprise default のまま残る。この制約は安全側に働く。部門が自由に Copilot を拡張できるのではなく、中央が「どの項目なら部門裁量にできるか」を先に決める構造だからだ。

一方で、複数 team に所属する利用者の扱いは注意が必要である。GitHub Docs は、複数 team の設定がある場合、team-level settings は key ごとに least restrictive value を組み合わせ、enterprise settings の下に適用されると説明している。つまり、兼務者が想定より緩い設定を得る可能性がある。横断 team、生成AI推進 team、委託先を含む混成 team では、この仕様を前提に棚卸ししなければならない。

## 分析: 例外を増やすほどteam台帳が重要になる

ここからは分析である。

team managed settings は、大企業の現実には合っている。同じ GitHub Enterprise の中でも、SRE、security、platform engineering、frontend、backend、data、legal review、委託先では必要な Copilot 設定が違う。全員に同じ制限をかけると生産性が落ちる。一方で、全員に広く開けると費用、plugin、外部 marketplace、bypass permission、監査の説明が重くなる。

部門別設定は、その中間を作る。たとえば、platform team には追加 marketplace を開く。security team には特定の review plugin を必須にする。AI 推進 team には model selection を unmanaged にして評価を任せる。通常開発 team は enterprise default を継承し、bypass permission は止めたままにする。こうした分け方は、日本企業の稟議や委託先統制にも合わせやすい。

しかし、例外を増やすほど GitHub team の正確性が統制そのものになる。人事異動、兼務、短期 project、退職、委託契約終了が team membership に反映されていなければ、Copilot の例外設定も古いまま残る。AI の設定ファイルだけをきれいにしても、team 台帳が崩れていれば統制は崩れる。

また、[Copilot app統制](/blog/github-copilot-app-policy-managed-settings-2026/) で扱ったように、Copilot の利用面は IDE の補完に閉じない。app、CLI、cloud agent、plugin、marketplace が絡むと、利用者がどの surface から何を実行できるかを説明する必要が出る。team managed settings は便利な粒度を増やすが、その分、問い合わせ時の切り分けも増える。

## 日本企業が最初に決める運用線

第一に、部門裁量にできる key を絞る。最初から多くの key を overridable にしない。まずは `permissions.model` と `permissions.disableBypassPermissionsMode` のように、docs が明示している範囲から始める。plugin と marketplace は便利だが、private repository、社内 plugin、外部 marketplace、供給網リスクが絡むため、別の review 基準を置くべきだ。

第二に、team の用途を文書化する。`ai-pioneers`、`security-reviewers`、`platform-admins` のような team 名だけでは、なぜ例外が必要か分からない。どの作業に、どの設定差分が必要で、誰が owner で、いつ棚卸しするのかを `plan` や pull request template に残す。これにより、後から「なぜこの team だけ plugin が追加されているのか」を説明できる。

第三に、PR review の責任者を分ける。開発基盤 team は技術的な妥当性を見る。security team は bypass permission、plugin、marketplace、content exposure を見る。FinOps や管理部門は AI Credits や seat の影響を見る。全部を一人の enterprise admin が見続けると、例外処理が bottleneck になり、現場が非公式な回避策を作りやすくなる。

第四に、least restrictive merge を前提に兼務者を確認する。複数 team に所属する人は、より緩い team setting の影響を受ける可能性がある。日本企業では、生成AI推進 team に各部署の代表者が入り、普段は別の project で顧客 code に触ることがある。pilot では、兼務者の表示設定、利用可能 model、plugin、permission mode を実機で確認したい。

第五に、問い合わせ手順を作る。設定は約1時間で反映され、再起動や再ログインで即時反映されると docs は説明している。利用者が「設定が見えない」と言ったとき、enterprise seat、対象 organization、team membership、`.github-private` の default branch、client version、再起動、SSO、対象 surface を順に確認する runbook が必要だ。

## 監査とロールバックの見方

team managed settings を入れたら、月次で3つを見る。1つ目は設定差分である。`managed-settings.json`、`team-mappings.json`、`copilot/teams/*.json` の変更履歴を見て、誰が、どの理由で、どの team に例外を渡したかを確認する。PR に ticket や承認者が残っていない例外は戻す。

2つ目は利用実態である。AI Credits、usage metrics、OpenTelemetry、GitHub audit log、問い合わせ件数を合わせて見る。team に例外を渡したのに利用されていないなら、設定を戻す判断ができる。逆に利用量が急増した場合は、目的に合う作業で使われているかを確認する。

3つ目は plugin と marketplace の供給網である。team ごとに marketplace を増やせると、職種別の拡張は進む。しかし、private plugin の host repository、更新権限、review 体制、配布先 team が曖昧なら、AI agent の拡張経路が新しいリスクになる。plugin は便利さだけでなく、誰が maintenance するかまで含めて承認したい。

ロールバックは難しく考えすぎない。team mapping を外す、team file を削除する、overridable を enterprise default に戻す、plugin を enterprise baseline から外す、といった戻し方を事前に決める。公開直後の機能は、導入よりも戻せることのほうが重要である。

## まとめ

GitHub Copilot の team managed settings は、enterprise managed settings を部門や職種の実態へ近づける更新である。事実として、GitHub は2026年8月3日に、team-specific value、`team-mappings.json`、`copilot/teams/`、overridable key、加算型 plugin 設定を含む運用を発表した。

日本企業にとっての論点は、設定ファイルの書き方だけではない。team 台帳、PR review、例外承認、兼務者、AI Credits、plugin 供給網、問い合わせ手順を一体で設計することが重要だ。まずは少数 team で始め、enterprise default を床として守りながら、必要な team だけに狭く例外を渡す。そのほうが、Copilot を便利な個人ツールではなく、説明可能な開発基盤として運用しやすい。

## 出典

- [Enterprise team specialization for managed settings](https://github.blog/changelog/2026-08-03-enterprise-team-specialization-for-managed-settings/) - GitHub Changelog, 2026-08-03
- [Enterprise managed settings reference](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/enterprise-managed-settings-reference) - GitHub Docs
- [Configuring enterprise-managed settings](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings) - GitHub Docs
