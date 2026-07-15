---
article: 'github-ai-security-detections-pr-code-scanning-2026'
level: 'child'
---

GitHubは、pull requestのcode scanningにAIによるセキュリティ検出を表示する機能を公開プレビューとして出しました。名前はAI-powered security detectionsです。PRを作ったり更新したりしたときにAIの検出エンジンが動き、CodeQLだけでは見つけにくい言語やフレームワークの問題をPR上で知らせます。

大事なのは、これは「AIが安全を保証する」機能ではないことです。[CodeQLのAI prompt injection検査](/blog/github-codeql-ai-prompt-injection-2026/)のような静的解析や、secret scanning、Dependabot、人間レビューは引き続き必要です。今回の機能は、PRレビュー中に気づきを増やすための追加のサインと考えると分かりやすいです。

## 何が表示されるのか

AIが見つけた問題は、pull requestのConversationやFiles changedに出ます。CodeQLのalertと似た場所に出ますが、AIで生成されたfindingにはAIラベルが付きます。

このラベルは重要です。CodeQLの結果とAIの助言を同じものとして扱うと、判断が難しくなります。AIラベルがあれば、レビュー担当者は「これはAIが追加で出した指摘だ」と分けて読めます。

GitHub Docsは、対象例としてPHP、Shell/Bash、Terraform、Dockerfile、JSP、Blazorなどを挙げています。つまり、CodeQLが十分にカバーしていない部分へ安全確認を広げる狙いがあります。

## 何が前提になるのか

この機能を使うには、GitHub Code Security、CodeQL default setup、enterprise policyでの許可、organizationでの有効化が必要です。公開プレビュー中はGitHub Copilotライセンスも必要で、AI Creditsも使います。

ここは管理者にとって大切です。単に便利そうだからオンにするのではなく、どのリポジトリでCodeQL default setupが有効か、誰がCopilotライセンスを持っているか、AI Creditsの予算を誰が見るかを決める必要があります。

また、AIのfindingはPR上の助言であり、mergeを自動で止めるものではありません。長期的な脆弱性一覧としてSecurity viewに残る通常alertとも違います。

## どう使うべきか

日本企業では、「止める検査」と「助言する検査」を分けるのが安全です。

止める検査は、CodeQL、secret scanning、Dependabot、テスト、required review、branch protectionなどです。これらは組織ルールとして説明しやすく、merge条件にしやすいものです。

助言する検査が、今回のAI-powered security detectionsです。PR上で気づきを増やし、開発者やレビュアーが早めに問題を直すために使います。ただし、AIの指摘をそのまま承認や拒否の理由にはせず、人間が判断します。

## 最初の導入手順

最初は、全社で一気に有効化しないほうがよいです。認証、管理画面、顧客データ、インフラ設定など、リスクが高く、レビュー体制があるリポジトリから始めます。

PRテンプレートには、「AIラベル付きfindingを確認したか」「修正しない指摘の理由を書いたか」「CodeQLやsecret scanningの結果も確認したか」を入れます。これにより、AIの出力をただ眺めるだけでなく、人間の判断として残せます。

費用も見ます。[GitHub Code Qualityの見積もり](/blog/github-code-quality-license-estimate-2026/)と同じように、AI機能は便利さだけでなく、AI Creditsやライセンス管理とつながります。月次でAI Creditsが増えたとき、どの機能が使っているのか説明できるようにするべきです。

## まとめ

GitHubのAI-powered security detectionsは、PR上のcode scanningにAIの追加チェックを入れる機能です。CodeQLが届きにくい領域の問題に早く気づける可能性があります。

ただし、これは最終承認ではありません。日本企業は、AI検出をPRレビューの助言として使い、CodeQL、secret scanning、Dependabot、人間レビューをmerge判断の中心に残すのが現実的です。

## 出典

- [Code scanning shows AI security detections on pull requests](https://github.blog/changelog/2026-07-14-code-scanning-shows-ai-security-detections-on-pull-requests/) - GitHub Changelog
- [AI-powered security detections in pull requests](https://docs.github.com/en/code-security/concepts/code-scanning/ai-powered-security-detections) - GitHub Docs
- [Code scanning](https://docs.github.com/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning) - GitHub Docs
