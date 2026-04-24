---
article: 'google-workspace-intelligence-admin-controls-2026'
level: 'child'
---

Google Workspace が **Workspace Intelligence** を発表しました。

これは、Gmail、Chat、Calendar、Drive などにある仕事の情報を Gemini がまとめて理解しやすくする仕組みです。単に1つの文書を読むのではなく、**メール、予定、ファイル、会話のつながり** を見ながら返答や下書きを作る方向に進んだのがポイントです。

## 何が変わったの？

Google の公式説明では、Workspace Intelligence は Workspace 全体の仕事の文脈を Gemini に渡す基盤です。

たとえば、

- 今どの案件が重要か
- 関係者が誰か
- 関連するメールやファイルが何か

を踏まえて、より合った回答や文章を出せるようにする考え方です。

同時に Google Docs では、Drive や Gmail の情報を使って下書きを作る機能が強化され、Gmail では検索欄に自然文で質問すると複数メールをまとめて答える **AI Overviews** が追加されました。

## 管理者にとって重要なのは？

ここが一番大事です。

Google の管理者向け案内では、Workspace Intelligence は **既定で ON** です。つまり対象プランでは、何もしないとこの仕組みを前提に AI 機能が動きます。

ただし管理者は、Gmail、Chat、Calendar、Drive などのデータソースごとに、

- ドメイン単位
- OU 単位
- グループ単位

で利用を制御できます。

たとえば Drive をオフにすると、Gemini は他の Drive ファイルを自動的に探しにいかなくなります。

ただし、ユーザーが特定のファイルを自分で指定した場合は、そのファイルを参照できると Google は説明しています。なので「完全に何も見せない設定」ではなく、**自動で広く拾う範囲を管理する設定** と考えたほうが正確です。

## 日本企業はどう見るべき？

日本企業では、AI の便利さより先に、

- どの情報を AI に見せてよいか
- 共有設定が本当に整理されているか
- どの部署から始めるか

を決める必要があります。

特に Drive は、長年の運用で閲覧権限が広くなっている会社もあります。Workspace Intelligence は「元から見える情報だけ」を使う考えですが、逆に言えば **人が広く見えているなら AI も広く見える** ということです。

そのため、最初は営業企画、事業企画、PMO のように文書作成やメール整理が多い部署から始め、機密情報の多い部門は設定を絞るほうが安全です。

## まとめ

Workspace Intelligence は、Google Workspace の AI を「文書単体」から「仕事全体の文脈」へ進める更新です。

便利になる一方で、管理者には次の3点が必要です。

- どのデータソースを有効にするか決める
- 既存の共有権限を見直す
- 使えるプランとアプリ機能差を確認する

日本企業では、まず小さく有効化して効果とリスクを確かめる進め方が現実的だと思います。

## 出典

- [Introducing Workspace Intelligence](https://workspace.google.com/blog/product-announcements/introducing-workspace-intelligence)
- [Introducing Workspace Intelligence, with admin controls](https://workspaceupdates.googleblog.com/2026/04/introducing-workspace-intelligence-with-admin-controls.html)
- [New Gemini capabilities in Google Docs help you go from blank page to brilliance](https://workspaceupdates.googleblog.com/2026/04/new-gemini-capabilities-in-google-docs-help-you-go-from-blank-page-to-brilliance.html)
- [Search faster and smarter with AI Overviews in Gmail search](https://workspaceupdates.googleblog.com/2026/04/search-faster-and-smarter-with-ai-overviews-in-Gmail-search.html)
