---
article: 'google-gemini-app-data-regions-workspace-2026'
level: 'child'
---

Google Workspaceの **Gemini app** が、data regions設定に対応した。これは、会社や学校の管理者が、Gemini appで扱うデータの保存や処理を、米国や欧州の地域設定に合わせやすくする更新だ。

Googleの発表では、管理者はEU storage and processing、US storage and processing、またはその両方を設定できる。しかも、組織部門、つまりOUの単位まで細かく設定できる。ユーザー側に個別設定はない。

## data regionsとは何か

data regionsは、Google Workspaceのデータをどの地域に保存するか、またプランによってはどの地域で処理するかを管理する仕組みだ。選択肢は主にUnited States、Europe、No preferenceである。

生成AIでは、文章や質問をどこで処理するかが重要になる。Gemini appに入力するプロンプトや返答が、会社のデータ管理ルールに関係するからだ。今回の更新で、Gemini appもWorkspaceの地域管理の中で扱いやすくなった。

## 使えるプランに差がある

すべてのGoogle Workspace利用者が同じ機能を使えるわけではない。Googleの発表では、Enterprise PlusとFrontline Plusは、地域内の保存と処理に対応する。Education PlusとEducation Standardは、地域内の保存だけに対応する。

つまり、学校や企業で「Gemini appも地域制御できる」と聞いても、保存だけなのか、処理まで含むのかを確認する必要がある。契約プランを見ずに判断すると、法務やセキュリティへの説明がずれる。

## 日本企業ではOU設計が大事

日本企業では、本社、海外拠点、委託先、研究部門、人事、法務などでデータの扱いが違う。全員に同じ地域設定をすると、必要以上に厳しくなったり、逆に足りなかったりする。

たとえば、欧州拠点や欧州顧客を扱う部門ではEuropeを選ぶ必要があるかもしれない。米国拠点ではUnited Statesを使うほうが自然な場合もある。日本本社では、EU/USのどちらに寄せるかだけでなく、日本の契約や個人情報保護の説明も別に必要になる。

[Workspace Intelligenceの管理者制御](/blog/google-workspace-intelligence-admin-controls-2026/)では、GeminiがGmailやDriveなどの社内文脈へ近づく話を扱った。[Workspace Studioの管理者制御](/blog/google-workspace-studio-admin-controls-2026/)では、自動化機能をどこまで許すかを見た。今回のdata regionsは、その土台になる地域管理の話だ。

## 権限管理とは別に考える

data regionsは、ユーザーの閲覧権限を決める機能ではない。誰がどのDriveファイルを見られるか、どのGemini機能を使えるかは、共有設定や管理者設定で決まる。data regionsは、許可されたデータがどこで保存・処理されるかを管理するものだ。

そのため、管理者は「Gemini appを使えるか」「どのデータを参照できるか」「どの地域で保存・処理するか」を別々に確認する必要がある。[Gemini数式修正のSheets運用](/blog/google-sheets-gemini-formula-fix-2026/)のような現場機能が増えるほど、この分け方は重要になる。

## まず確認すること

最初に、現在のOUとgroupを確認する。どの部署にEurope、United States、No preferenceが設定されているかを見る。

次に、対象プランを確認する。Enterprise PlusやFrontline Plusなら処理と保存、Education PlusやEducation Standardなら保存のみという違いがある。

最後に、利用者向けの説明を用意する。ユーザー側に設定がないため、なぜ部署ごとにGemini appの扱いが違うのか、管理者が説明できるようにしておく必要がある。

## まとめ

Gemini appのdata regions対応は、Google Workspaceで生成AIを広げるための管理機能だ。日本企業では、EU/USの選択だけでなく、OU設計、対象プラン、権限管理、国内の契約説明を合わせて考える必要がある。

便利なGemini機能を広げる前に、どの部署で、どの地域設定で、どのデータを扱うのかを整理することが大切だ。

## 出典

- [Data regions support for the Gemini app now available](https://workspaceupdates.googleblog.com/2026/06/gemini-app-data-regions-support.html) - Google Workspace Updates, 2026-06-29
- [Choose a geographic location for your data](https://knowledge.workspace.google.com/admin/compliance/choose-a-geographic-location-for-your-data) - Google Workspace Admin Help
- [Data covered by data regions](https://knowledge.workspace.google.com/admin/compliance/data-covered-by-data-regions) - Google Workspace Admin Help
