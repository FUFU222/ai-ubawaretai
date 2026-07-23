---
article: 'github-copilot-issue-agent-automation-controls-2026'
level: 'child'
---

GitHubは2026年7月23日、GitHub Issuesの自動化に新しい確認機能を追加しました。Copilot cloud agent automationsやGitHub Agentic WorkflowsがIssueを整理するとき、変更の理由、AIの自信度、人間が承認するための画面を使えるようにするものです。

Issueの自動化では、AIがラベルを付けたり、担当者を決めたり、Issue typeやfieldを更新したり、場合によってはIssueをcloseしたりします。便利ですが、間違えると対応チームや優先度が変わってしまいます。そのため、AIが何をしたかだけでなく、なぜそうしたかを見る仕組みが重要になります。

## 何が追加されたのか

今回の中心は3つです。

1つ目はrationaleです。これは、AIがその変更をした理由です。たとえば、なぜbugラベルを付けたのか、なぜ特定の担当者を選んだのかをIssue上で確認できます。

2つ目はconfidenceです。AIは変更ごとにhigh、medium、lowのような自信度を付けます。repositoryの設定によって、自信度が高い変更だけ自動適用し、それ以外は人間の確認待ちにできます。

3つ目はapprovalsです。AIに「直接変更せず、提案として出して」と指示すると、変更はIssue上のpanelに残ります。人間はそれをacceptまたはdeclineできます。

## 何に使えるのか

対象になるのは、Issueのlabels、fields、issue type、close、assigneesです。つまり、Issue整理のための属性変更が中心です。Pull Requestを開く、codeをpushする、といった作業には、この承認の仕組みはそのまま適用されません。

ここを分けて理解することが大切です。Issueラベルの自動提案は便利ですが、コード変更やPR作成の安全確認とは別の話です。Issue自動化の承認画面があるから、agent全体が安全になるわけではありません。

## 注意すべき点

GitHub Docsは、approvalsはsecurity controlではないと説明しています。つまり、承認画面は人間が確認しやすくするための機能であり、AIに技術的な権限を与えないための壁ではありません。

本当に制御すべきなのは、誰がautomationを作れるか、agentにどのtoolsを許すか、repositoryでどの権限を持たせるかです。承認UIは便利ですが、権限設定の代わりにはなりません。

## 日本企業ではどう始めるか

最初は慎重に始めるのがよいです。たとえば、documentation、question、enhancementのような低リスクlabelだけを自動適用し、security、incident、privacy、billing、legalのような重要labelは人間確認に回します。

Issueをcloseする操作も、最初から完全自動にしないほうが安全です。重複や明らかなスパムを除き、closeは人間が見たほうがよい場合が多いからです。

また、automationは実行ごとにGitHub AI CreditsやActions minutesを使います。Issueが多いrepositoryで毎回動かすと、費用も増えます。便利さだけでなく、どのrepositoryで何回動かすのかも見ておく必要があります。

## まとめ

GitHub Issuesのagent automation controlsは、AIによるIssue整理を見えやすくする更新です。理由、自信度、人間承認が入ることで、全部を手作業で見るより運用しやすくなります。

ただし、承認画面は権限管理そのものではありません。日本企業が使うなら、低リスクな分類から始め、重要なlabelやcloseは人間確認に残し、agentの権限と費用を別に管理することが大切です。

## 出典

- [Agent automation controls in GitHub Issues in public preview](https://github.blog/changelog/2026-07-23-agent-automation-controls-in-github-issues-in-public-preview/) - GitHub Changelog, 2026-07-23
- [About rationale, confidence, and approvals for issues](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automation-rationale-and-approvals) - GitHub Docs
- [About Copilot automations](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automations) - GitHub Docs
