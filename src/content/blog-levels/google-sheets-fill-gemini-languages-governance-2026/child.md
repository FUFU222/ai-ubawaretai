---
article: 'google-sheets-fill-gemini-languages-governance-2026'
level: 'child'
---

Googleは2026年7月8日、Google SheetsのFill with GeminiとAI functionが、新たに11言語へ広がると発表しました。日本語はすでに対応済みでしたが、今回の更新で、さらにMandarin、Dutch、Malay、Hebrew、Polish、Turkish、Czech、Indonesian、Swedish、Danish、Norwegianが対象になります。

Fill with Geminiは、Google SheetsのセルをAIで埋める機能です。たとえば、文章を作る、コメントを要約する、回答を分類する、感情を分析する、といった作業を表の中で行えます。複雑な数式を書かずに、選んだセルへ結果を入れられるのが特徴です。

## 何が変わったのか

今回の更新で大きいのは、Google SheetsのAI補助が多国籍の業務に使いやすくなることです。

日本企業でも、表計算は国内だけで使われているわけではありません。海外子会社、現地営業、カスタマーサポート、BPO先が、現地語の問い合わせや商品情報をGoogle Sheetsで管理していることがあります。対応言語が増えると、英語や日本語へ毎回寄せなくても、現地語のまま初期分類や要約を試しやすくなります。

以前の[Gemini数式修正、Google Sheets運用の管理線](/blog/google-sheets-gemini-formula-fix-2026/)では、数式エラーをGeminiに聞ける更新を扱いました。今回のFill with Geminiは、式の修正よりも、表の空欄を埋めたり、文章データを処理したりする用途に近いです。

## 管理者設定も関係する

Fill with Geminiは、対象ユーザーなら必ず見える機能ではありません。Googleは、Smart features for Google Workspaceが無効ならFill with Geminiは非表示になると説明しています。ユーザー側でも、Workspace smart featuresが有効である必要があります。

対象エディションもあります。Business Standard / Plus、Enterprise Standard / Plus、Google AI Pro / Ultra、Google AI Pro for Education、AI Expanded Accessなどが対象です。つまり、同じ会社の中でも、契約や設定によって見える人と見えない人が出ます。

管理者は、まず「どの部署で使えるのか」「Smart featuresは有効なのか」「利用上限はどうなるのか」を確認する必要があります。これは[Workspace Intelligenceの管理者制御](/blog/google-workspace-intelligence-admin-controls-2026/)と同じで、便利なAI機能ほど設定と対象範囲を先に見るべきです。

## 使う前に気をつけること

Fill with Geminiは便利ですが、AIが出した結果をそのまま正解として扱うべきではありません。

たとえば、顧客コメントを「不満」「解約リスク」「好意的」と分類する場合、その結果が営業やサポートの対応に影響するかもしれません。AIが分類したセルは、人が確認してから業務判断に使うほうが安全です。

重要な表では、元データ、AIが作った列、人が確定した列を分けるとよいです。こうすると、AIの提案を見直しやすくなります。あとから「なぜこの分類になったのか」を確認するときにも役立ちます。

[Workspace Studioの管理者制御](/blog/google-workspace-studio-admin-controls-2026/)でも見たように、Google WorkspaceのAIは業務フローに近づいています。Sheetsのセル入力も小さな作業に見えますが、日常業務に入り込むと影響は大きくなります。

## まとめ

Fill with Geminiの多言語化は、日本語だけで働くチームには小さく見えるかもしれません。しかし、海外拠点や多言語の顧客対応を持つ日本企業には、表計算業務を減らす実務的な更新です。

最初にやるべきことは、全員に使わせることではありません。対象エディション、Smart features、利用上限、使ってよいデータ、人間が確認すべき用途を決めることです。Google SheetsのAI機能は、現場に入りやすいからこそ、短いルールとレビュー手順を用意してから広げるのが現実的です。

## 出典

- [Fill with Gemini in Sheets now available in 11 additional languages](https://workspaceupdates.googleblog.com/2026/07/fill-with-gemini-in-sheets-now-available-in-11-additional-languages.html?m=1) - Google Workspace Updates, 2026-07-08
- [Effortlessly automate data entry in Google Sheets using Fill with Gemini](https://workspaceupdates.googleblog.com/2026/04/effortlessly-automate-data-entry-in-Google-Sheets-using-Fill-with-Gemini.html) - Google Workspace Updates, 2026-04-22
- [Google Workspace with Gemini](https://knowledge.workspace.google.com/admin/generative-ai/workspace-with-gemini) - Google Workspace Help
