---
article: 'github-copilot-spaces-api-ga-context-2026'
level: 'child'
---

GitHubは**2026年5月18日**、Copilot Spaces APIを一般提供にした。Copilot Spacesは、Copilotに追加の文脈を渡すための場所だ。今回のAPI化で、Spacesを画面から手で作るだけでなく、プログラムから作成、取得、更新、削除できるようになった。

GitHubの発表では、Spaces APIを使うと、チームが多くのSpacesを管理するときの手作業を減らせると説明されている。Docsでは、organization向けとuser向けのCopilot Spaceを扱うendpointに加えて、collaboratorsやresourcesを管理するendpointも示されている。

簡単に言うと、これは「AIに渡すチームの前提知識」を管理しやすくする更新だ。

## Copilot Spacesとは何か

Copilot Spacesは、Copilotにプロジェクトやチームの情報をまとめて渡すための仕組みだ。たとえば、プロジェクトのREADME、設計方針、テストのやり方、レビューで注意すること、使ってはいけないライブラリ、社内の運用ルールなどをまとめておく。

AIは、何も知らない状態で質問されるより、正しい背景情報をもらったほうが役に立つ答えを出しやすい。だからSpacesは、Copilotをチームで使うときの「共有メモ」に近い役割を持つ。

ただし、共有メモは古くなりやすい。誰かが手で更新する運用だと、プロジェクトが増えるほど管理が難しくなる。今回のSpaces APIは、その管理を自動化しやすくする。

## APIで何ができるのか

GitHub Docsでは、Copilot SpacesのREST APIとして、Spaceの一覧取得、作成、取得、更新、削除が用意されている。organization Spaceとuser Spaceの両方が対象だ。

さらに、Spaceに参加するcollaboratorsも管理できる。誰を追加するか、どのroleにするか、不要になった人を外すかをAPIから扱える。resourcesも管理できるため、Spaceに入れる参照情報を作成、更新、削除できる。

つまり、入社、異動、プロジェクト開始、プロジェクト終了のようなイベントに合わせて、Spacesを自動で整備しやすくなる。

## なぜ日本の開発チームに関係するのか

日本企業では、開発ルールや設計判断がいろいろな場所に分散していることが多い。README、Notion、Google Docs、Slack、古い設計書、個人メモが混ざり、最新情報がどこにあるか分かりにくい。

この状態でCopilotを使うと、AIに正しい背景を渡せる人と渡せない人で、答えの品質が変わる。新しく入ったメンバーや委託先ほど、背景情報を知らないままAIを使いがちだ。

Spaces APIを使えば、プロジェクトごとの標準情報を最初から用意できる。たとえば、新しいリポジトリを作ったときにSpaceも作り、README、設計方針、テスト方針をresourcesとして登録する。チームに人が増えたらcollaboratorに追加し、異動したら外す。こうした運用を手作業だけにしなくてよくなる。

## ほかのCopilot管理機能との違い

Spaces APIは、Copilotのすべてを管理するものではない。[Copilot cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)は、cloud agentのMCP、検証ツール、Actions承認、firewall設定を確認するためのものだ。[Copilotチーム別metrics API](/blog/github-copilot-team-metrics-api-2026/)は、チームごとの利用量を見るためのものだ。

Spaces APIは、その前段にある「AIに渡す文脈」を管理する。個人の好みに近い情報は[Copilot Memory](/blog/github-copilot-memory-user-preferences-2026/)で扱い、チームの共通ルールはSpacesで扱う、と分けると分かりやすい。

## まとめ

Copilot Spaces APIの一般提供は、Copilotをチームで使う企業にとって重要な更新だ。AIに正しい文脈を渡す作業を、個人の努力ではなく、組織の運用にできるからだ。

まずは重要なプロジェクトから、Spaceに入れる標準情報を決めるとよい。README、設計方針、テスト方針、禁止パターン、問い合わせ先をまとめ、APIで作成と更新を自動化する。そうすれば、Copilotの回答品質をチーム全体でそろえやすくなる。

## 出典

- [Copilot Spaces API now generally available](https://github.blog/changelog/2026-05-18-copilot-spaces-api-now-generally-available/) - GitHub Changelog, 2026-05-18
- [REST API endpoints for Copilot Spaces](https://docs.github.com/en/rest/copilot-spaces) - GitHub Docs
- [About GitHub Copilot Spaces](https://docs.github.com/en/copilot/concepts/context/spaces) - GitHub Docs
