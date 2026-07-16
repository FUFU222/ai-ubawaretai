---
article: 'google-gmail-gemini-custom-refine-2026'
level: 'child'
---

Google Workspace Updates は **2026年7月14日**、Gmail の **Help me write** で、任意の修正指示を使えるようにしたと発表した。これまでは、下書きを作ったあとに「丁寧にする」「短くする」のような決まった修正が中心だった。今回の更新では、プロンプトバーに自分の言葉で追加指示を書き、メール下書きを直せる。

たとえば、「金曜日の締切を入れて」「少し柔らかくして」「謝罪は残しつつ原因は断定しない」といった指示ができる。営業、カスタマーサクセス、採用、社内ITのようにメールを多く書く部署では、文章を速く整える助けになる。

## 何が変わったのか

Gmail の Help me write は、メール下書きを作ったり、すでに書いた文章を整えたりする機能だ。今回の更新で、ユーザーは決まったボタンだけではなく、自由な追加指示で下書きを修正できるようになった。Google の発表では、足りない情報を2行目に足す、依頼文に締切を入れる、といった例が示されている。

展開は **2026年7月14日** から始まり、**2026年7月20日** までに完了予定とされている。対象には Google Workspace の Business、Enterprise、Frontline Plus、Google AI Pro for Education、AI Expanded Access などが含まれる。

管理者にも関係がある。Google は、この機能が Gemini for Workspace in Gmail と Workspace Intelligence access to Gmail の両方が有効な場合に使えると説明している。つまり、ただのユーザー向け機能ではなく、管理者設定とつながっている。

## なぜ大事なのか

メールは、今でも日本企業の重要な顧客接点だ。商談後のお礼、問い合わせ回答、面接調整、障害連絡、請求や契約の確認など、多くの仕事がメールで進む。AIが下書きを作れるだけでなく、相手や場面に合わせて直せるようになると、作業時間を減らせる。

ただし、便利だからといって何でも任せてよいわけではない。価格、契約、返金、謝罪、採用評価、個人情報を含むメールでは、AIが自然な文章を作っても、人間が必ず確認する必要がある。AIが書いた文面でも、送信責任は人間に残る。

[Workspace Intelligence の管理者制御](/blog/google-workspace-intelligence-admin-controls-2026/) でも見たように、Gemini は Gmail、Drive、Calendar、Chat などの文脈を使う場合がある。Gmail Help も、Help me write が他のメールや Drive ファイルを参考にする場合があると説明している。だから、出てきた文面に顧客名、金額、日程、ファイル名が入ったときは、参照元を確認したほうがよい。

## 最初に決めること

まず、使ってよいメールの種類を決める。日程調整、お礼、一般的な案内は始めやすい。一方で、契約条件、法的な見解、障害謝罪、採用可否、返金のような文面は、上長や担当部門の確認を残すべきだ。

次に、部門ごとの指示例を用意する。営業なら「価格条件は書かず、見積書を参照する」。CSなら「原因が未確定なら断定しない」。採用なら「評価理由を書かない」。このような短いルールがあると、任意の修正指示を安全に使いやすい。

さらに、管理者設定も確認する。Gemini in Gmail、Workspace Intelligence、Workspace smart features、DLP、対象となる組織部門やグループが関係する。[Workspace Studioの管理者制御](/blog/google-workspace-studio-admin-controls-2026/) と同じく、Google Workspace のAI機能は、現場の便利さと管理者設定をセットで見る必要がある。

## まとめ

Gemini in Gmail の任意修正は、メールAIをより実務で使いやすくする更新だ。定型ボタンだけでなく、自分の言葉で下書きを直せるため、営業やCS、採用メールの品質をそろえやすくなる。

ただし、メールは外部に届く成果物だ。AIが作った文面でも、送る前の確認は人間の仕事である。日本企業は、使ってよいメール種別、禁止表現、参照元確認、管理者設定を短く決めてから広げるのが現実的だ。

## 出典

- [New refinement capabilities allow custom editing with Help me write in Gmail](https://workspaceupdates.googleblog.com/2026/07/new-refinement-capabilities-allow-custom-editing-with-Help-me-write-in-Gmail.html) - Google Workspace Updates, 2026-07-14
- [Draft emails with Gemini in Gmail](https://support.google.com/mail/answer/13955415?co=GENIE.Platform%3DDesktop&hl=en) - Gmail Help
- [Control Workspace Intelligence for generative AI features](https://knowledge.workspace.google.com/admin/generative-ai/workspace-intelligence/control-workspace-intelligence) - Google Workspace Help
