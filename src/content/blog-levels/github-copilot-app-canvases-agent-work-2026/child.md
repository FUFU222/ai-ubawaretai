---
article: 'github-copilot-app-canvases-agent-work-2026'
level: 'child'
---

GitHubは2026年6月2日、**GitHub Copilot app**のtechnical previewを、既存のCopilot Pro、Pro+、Business、Enterprise利用者へ広げました。あわせて、**canvases**、cloud sessions、agentic browsing、voice dictation、rubber duck、`/chronicle` などが発表されました。

簡単に言うと、Copilot appは「AI agentに仕事を頼むアプリ」から、「AI agentが進めている仕事を見て、直して、確認する作業面」へ進んでいます。

## canvasesとは何か

canvasesは、人間とAI agentが同じ作業物を見ながら進めるための画面です。たとえば、計画表、PR、ブラウザ画面、ターミナル、リリースチェックリスト、障害対応ボード、スプレッドシートのようなものを想像すると近いです。

これまでAI agentの作業は、chatの長い履歴の中に埋もれがちでした。どこまで終わったのか、何を確認したのか、どの差分を見るべきかが分かりにくくなります。canvasでは、agentが作業面を更新し、人間も同じ面で編集や承認、方向修正をできます。

これは、すでに出ていた[GitHub Copilot appのtechnical preview](/blog/github-copilot-app-technical-preview-2026/)の続きとして見ると分かりやすいです。5月の発表は、IssueやPull Requestからagent sessionを始める入口でした。今回の発表は、そのagent作業をどう見える形にするかが中心です。

## cloud sessionやbrowser検証も増えた

今回の更新では、appからcloud sessionを始められる点も重要です。GitHub Docsでは、sessionを新しいworking tree、local repository、cloud sandboxのどこで動かすか選べると説明されています。cloud sandboxはGitHub側の分離環境なので、手元のPCに依存しにくい作業に向きます。

また、agentic browsingも追加されています。これは、agentが統合ブラウザを操作し、click、type、screenshotなどを使ってUI変更を確認できる機能です。Webアプリを作るチームでは、コードだけでなく画面の動きまでagentに確認させる入口になります。

ただし、便利だからすぐ本番画面で使うべきではありません。日本企業の管理画面には、個人情報、取引先名、売上、契約情報が出ることがあります。agentic browsingを使うなら、まずstaging環境、test account、匿名化データで試すべきです。

## 日本の開発チームが見るべきこと

最初に決めるべきなのは、誰にpreviewを開くかです。BusinessやEnterpriseでは、組織やenterprise側でpreview機能とCopilot CLIを有効化する必要があります。全員に一気に配るより、開発基盤、SRE、QA、社内ツールのようにagent作業を管理しやすいチームから試す方が安全です。

次に、canvasを個人用とチーム用に分ける必要があります。個人の作業メモなら手元のcanvasで十分です。一方、release checklistやincident boardのようにチーム判断に関わるものは、repository内の設定資産としてレビューした方がよいです。

費用も見逃せません。[GitHub Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/)が始まった後は、Copilotの費用は席数だけでは読みにくくなっています。cloud session、browser検証、rubber duck、voice入力でsessionが増えるなら、AI CreditsやCIの消費も増える可能性があります。

## どう試すとよいか

最初は、小さくて失敗しても戻しやすい作業が向いています。依存関係更新、README修正、軽いバグ調査、UIテストの失敗確認、リリースノート下書きなどです。[Copilot cloud agent automations](/blog/github-copilot-cloud-agent-automations-2026/)のような定期実行と組み合わせる前に、まず人間が見ているapp sessionで、canvasが本当に確認しやすいかを見るとよいです。

逆に、認証、課金、個人情報、権限変更、本番データ、DB migrationのような作業を最初から任せるのは危険です。canvasは作業を見やすくしますが、レビュー責任を消すものではありません。

GitHub Copilot appのcanvasesは、AI agentの作業をchatの奥から取り出し、チームが確認しやすい作業面へ移す更新です。日本の開発チームは、新機能を全部有効にするより、どの作業をcanvasに載せ、どこで人間が承認し、どの費用で止めるかを先に決めるべきです。

## 出典

- [Expanded technical preview availability for the GitHub Copilot app](https://github.blog/changelog/2026-06-02-expanded-technical-preview-availability-for-the-github-copilot-app/) - GitHub Changelog, 2026-06-02
- [Working with canvas extensions in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/working-with-canvas-extensions) - GitHub Docs
- [Working with agent sessions in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions) - GitHub Docs
