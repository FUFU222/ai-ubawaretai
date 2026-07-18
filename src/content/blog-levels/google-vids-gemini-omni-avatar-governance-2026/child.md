---
article: 'google-vids-gemini-omni-avatar-governance-2026'
level: 'child'
---

Google Vids に Gemini Omni が入り、AIで動画を作ったり、文章で動画を直したり、自分の顔と声に近い個人アバターを使ったりできるようになる。Google Workspace Updates の発表日は **2026年7月16日** で、Rapid Release は同日から、Scheduled Release は **2026年8月5日** から段階展開される。

これは、動画制作の専門チームだけに関係する話ではない。Google Vids は Google Workspace の中のアプリなので、営業、人事、研修、CS、社内ITなど、普段は動画編集をしない人も使う可能性がある。

## 何ができるようになるのか

1つ目は、AI動画クリップの生成だ。Google は、Gemini Omni によって、以前のモデルよりも文字表示、物理表現、リアルさが改善されると説明している。ユーザーはテキストの指示や参照画像、アバターを使って、短い動画クリップを作れる。

2つ目は、動画の編集だ。たとえば「色味を直して」「アニメ風にして」「背景のサイレン音を消して」のように、文章で変更を頼める。細かい編集ソフトを使わなくても、Vids の画面で修正できる方向に進んでいる。

3つ目は、個人アバターだ。ユーザーはスマートフォンなどで顔と声を記録し、自分のアバターを作って Vids の動画に使える。これは便利だが、本人の顔や声に近い表現を会社のコンテンツで使うことになるため、使い方を決めておく必要がある。

## 管理者が見るべき違い

今回の更新で特に大事なのは、管理者設定の差だ。Google の発表では、Gemini Omni による動画生成・編集には個別の admin control がないと説明されている。一方、個人アバターは既定オンだが、管理者が domain level で無効化または有効化できる。

つまり、「動画生成は使えるが、個人アバターは止める」「特定部門だけ個人アバターを使わせる」といった判断が必要になる。何も決めないまま展開すると、現場が先に使い始め、あとからルールを作ることになりやすい。

[Workspace Studioの管理者制御](/blog/google-workspace-studio-admin-controls-2026/) と同じく、Google Workspace のAI機能は、全社で一気に使わせるより、部門や用途を分けて始めるほうが扱いやすい。

## 日本企業での使い道

使いやすい場面は、社内研修、製品説明、営業資料、採用広報、オンボーディング、社内ITの操作案内などだ。短い動画で説明したほうが伝わりやすい内容は多い。これまで外注や専任担当が必要だった動画も、Vids なら現場で作れる可能性がある。

ただし、動画は文章よりも印象が強い。間違った価格、古い製品画面、未確認の法的表現、顧客名、人物の顔が入ると、問題が大きくなりやすい。[Google MeetのAI議事録](/blog/google-meet-take-notes-admin-default-2026/) では会議内容の保存と共有が論点だったが、Vids では公開物としての確認が論点になる。

個人アバターも注意が必要だ。本人が作ったものでも、会社の動画に使うなら、利用目的、公開範囲、削除方法、退職後の扱いを決めておいたほうがよい。

## 最初に決めること

まず、個人アバターを全社で使わせるかを決める。迷うなら、広報、採用、研修など、公開前レビューがある部門から始めるのがよい。

次に、動画の種類を分ける。社内向けの操作説明は低リスクだが、顧客向け、採用向け、契約・価格・法務・医療・金融に関わる動画は高リスクである。高リスク動画は、AIで作ったかどうかに関係なく、責任者レビューを必須にしたほうがよい。

最後に、素材の使い方を決める。ロゴ、顧客資料、人物写真、製品画面、社内イベント映像をAI動画に入れるなら、使ってよい素材か確認する必要がある。

## まとめ

Google Vids の Gemini Omni 対応は、動画制作をかなり身近にする更新だ。現場部門が短い動画を作りやすくなる一方、会社として公開する動画の責任は残る。

日本企業は、個人アバターの許可範囲、動画のリスク分類、素材利用、公開前レビューを先に決めたい。便利な機能ほど、使い始める前のルールが重要になる。

## 出典

- [Cast yourself in AI video clips using your personal avatar with Gemini Omni in Vids](https://workspaceupdates.googleblog.com/2026/07/cast-yourself-in-ai-video-clips-using-your-personal-avatar-with-Gemini-Omni-in-Vids.html) - Google Workspace Updates, 2026-07-16
- [Generate higher quality AI video clips and edit any video with Gemini Omni in Vids](https://workspaceupdates.googleblog.com/2026/07/generate-higher-quality-ai-video-clips-and-edit-any-video-with-Gemini-Omni-in-Vids.html) - Google Workspace Updates, 2026-07-16
- [Create, use & manage your personal avatar with Gemini in Google Vids](https://support.google.com/docs/answer/16970930) - Google Docs Editors Help
