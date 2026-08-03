---
article: 'google-meet-visual-screenshots-notes-governance-2026'
level: 'child'
---

Google Meet の AI議事録に、画面の内容を入れる機能が加わる。Google Workspace Updates は2026年7月27日、Take notes for me の会議メモに **visual screenshots** を入れられるようにすると発表した。会議中に見せたスライド、図、チャートなどが、会議後の Google Docs に残るイメージだ。

これは、前に扱った [Google MeetのAI議事録設定](/blog/google-meet-take-notes-admin-default-2026/) と近いが、論点は少し違う。前回は「どの会議でAI議事録をオンにするか」だった。今回は「会議で見せた画面を、議事録に残してよいか」が問題になる。

## 何が変わるのか

Google Meet の Take notes for me は、Geminiを使って会議メモを作る機能だ。これまでは発言の要約や次のアクションが中心だった。visual screenshots が入ると、話された内容だけでなく、会議中に提示された資料の見た目もメモに含めやすくなる。

たとえば、営業会議で見せた提案書、開発会議で見せた構成図、経営会議で見せたグラフ、研修で使ったスライドなどが、会議メモの文脈として残る。あとから読む人にとっては、文字だけの議事録より分かりやすくなる可能性がある。

ただし、画面には機密情報が入りやすい。顧客名、価格、未公開機能、障害情報、人事情報、採用候補者の評価などを表示したままにすると、それも会議メモの一部として扱われる可能性がある。

## 管理者ができること

Google は、エンドユーザー向けの一般提供前に、管理者が設定できるようにしている。管理者は、画面スクリーンショットを常に許可するか、会議録画がオンのときだけ許可するかを選べる。

この設定は、ドメイン全体、組織部門、グループ単位で変えられる。つまり、全社で同じ設定にする必要はない。営業部門では録画時だけ、研修部門では常に許可、法務や人事ではオフに近い運用、という分け方も考えられる。

## 利用者にも通知と操作がある

Google の発表では、提示者にはスクリーンショットが会議メモに入る可能性があることが通知される。会議中には、Meet の notes panel から管理または無効化できる。

とはいえ、通知が出るだけでは十分ではない。利用者が「これは録画に近い扱いだ」と理解していなければ、止める判断はできない。会社として、どの会議では使ってよいか、どの資料は見せてはいけないかを短く説明しておく必要がある。

## 日本企業で注意する点

まず、会議の種類を分ける。全社会議、研修、営業定例、顧客会議、採用、人事、法務、障害対応、セキュリティ会議では、残してよい情報が違う。

次に、共有先を見る。Google Meet Help によると、Take notes for me のノートは Google Docs として保存され、Calendar event にも添付される。共有先は設定によって変わる。画面添付を制限しても、共有範囲が広すぎると意味が薄くなる。

最後に、他の Workspace AI と一緒に見る。[Google Slides Gemini資料生成](/blog/google-slides-gemini-editable-decks-governance-2026/) のように、会議メモや資料作成は Workspace 内でつながっていく。Meetだけを見ず、Drive共有、Vault保持、Gemini設定、管理者権限までまとめて確認したほうがよい。

## まとめ

Google Meet の visual screenshots は、AI議事録を分かりやすくする機能だ。一方で、会議中の画面情報を文書として残す機能でもある。

日本企業は、便利だからオンにする前に、録画と同じような基準で扱うべき会議を決める必要がある。特に、顧客情報、人事情報、法務相談、未公開資料を扱う会議では、管理者設定と利用者説明を先に整えることが重要だ。

## 出典

- [Visual screenshots in Google Meet meeting notes will soon be generally available, pre-configure admin settings in advance](https://workspaceupdates.googleblog.com/2026/07/visual-screenshots-in-google-meet-meeting-notes-will-soon-be-generally-available-pre-configure-admin-settings-in-advance.html) - Google Workspace Updates, 2026-07-27
- [Let Google Meet AI take notes for my users](https://knowledge.workspace.google.com/admin/meet/let-google-meet-ai-take-notes-for-my-users) - Google Workspace Admin Help, last updated 2026-07-27 UTC
- ["Take notes for me" in Google Meet](https://support.google.com/meet/answer/14754931) - Google Meet Help
