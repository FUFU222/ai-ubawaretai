---
article: 'github-copilot-gpt-52-codex-retirement-2026'
level: 'expert'
---

GitHub Copilotの **GPT-5.2 / GPT-5.2-Codex 廃止** は、表面上は1分で読み終わる changelog だ。しかし **2026年5月1日** の告知を、supported models、model comparison、configure access の3系統のGitHub Docsと合わせて読むと、これは単なるモデル更新ではなく、**Copilotの標準モデル運用を5月中に組み替えろ** という実務通知に近い。

すでにこのサイトでは [GitHub CopilotでGPT-5.5一般提供開始。日本チームは何を見極めるべきか](/blog/github-copilot-gpt-55-general-availability-2026/) でGPT-5.5の位置づけを、[GitHub Copilot code reviewが6月からActions minutes課金対象に。日本チームは何を見直すべきか](/blog/github-copilot-code-review-actions-minutes-2026/) でCopilotのコスト構造変化を、[GitHub CopilotのVisual Studio更新でcloud agent直起動へ。日本の.NET開発は何が変わるか](/blog/github-copilot-visual-studio-cloud-agent-2026/) でagent実行面の広がりを見てきた。今回の廃止告知は、それらをつなぐ「運用の切替日」がやってきたと読むと分かりやすい。

## 事実整理: 6月1日に何が消えて、何が残るのか

GitHub Changelogが明記している事実はシンプルだ。**2026年6月1日** に、Copilot Chat、inline edits、ask mode、agent mode、code completions を含むCopilot体験から **GPT-5.2** と **GPT-5.2-Codex** を廃止する。代替は、前者が **GPT-5.5**、後者が **GPT-5.3-Codex** だ。

ただし例外が1つある。**Copilot Code Review では GPT-5.2-Codex が今回の廃止対象に含まれない**。この一点だけで、運用上の意味がかなり変わる。つまりGitHubは、OpenAI系の同じ Codex 名称でも、**chat / agent / completion と code review を別のライフサイクルで管理し始めている**。これは4月後半から見えていた方向性とも整合する。code review は6月から [Actions minutes の従量課金対象](/blog/github-copilot-code-review-actions-minutes-2026/) に入るため、モデルの切替も「同じように一斉移行」とはならなかったのだろう。

supported models のページでも、**GPT-5.2 と GPT-5.2-Codex は現時点では GA** とされている一方、retirement history では両者とも **2026-06-01** で退役予定になっている。ここから分かるのは、**現在の model picker に並んでいることと、来月も標準運用できることは別** だということだ。

## 事実整理: GitHub自身はモデルをどう位置づけているか

model comparison の整理は、今回かなり役に立つ。そこでは、

- **GPT-5.2**: deep reasoning and debugging
- **GPT-5.2-Codex**: agentic software development
- **GPT-5.3-Codex**: agentic software development
- **GPT-5.5**: deep reasoning and debugging

という役割分担が示されている。つまり、GitHub自身のメッセージは「同じ名前の後継」ではなく、**推論系は GPT-5.5 へ、エージェント系は GPT-5.3-Codex へ** と役割で分けている。

ここで重要なのは、GPT-5.2 から GPT-5.5 への移行と、GPT-5.2-Codex から GPT-5.3-Codex への移行を、同じ手順で処理しないことだ。

### GPT-5.2 から GPT-5.5 への移行

これは「考えるモデル」の切替だ。難しい原因調査、設計比較、複数案のトレードオフ整理のような仕事では、GPT-5.5 が後継とされる。ただし supported models の multiplier 表では、**GPT-5.2 は 1x** に対し、**GPT-5.5 は 7.5x** の promotional multiplier だ。ここは見逃せない。

性能向上があっても、**今まで 1 の感覚で投げていた仕事が 7.5 の感覚になる**。この差は「高い」では済まず、使う場所を変えるべき水準だ。個人の単発チャットなら吸収できても、Copilot CLI や IDE の agent mode で試行錯誤が増えると、請求や利用枠の説明が一気に難しくなる。

### GPT-5.2-Codex から GPT-5.3-Codex への移行

こちらはかなり性格が違う。supported models の multiplier 表では、**GPT-5.2-Codex も GPT-5.3-Codex も 1x** だ。つまり少なくとも倍率面では、**後継への移行でコストが跳ね上がるわけではない**。実務上の主論点は、コストではなく **利用面の切替と標準化** になる。

CLI や agent mode、codebase exploration、複数ファイル変更案の下書きのような用途では、GPT-5.3-Codex へ寄せる判断は比較的しやすい。OpenAI側の名称が似ていても、GitHub側の標準レーンは完全に GPT-5.3-Codex 側へ移ったと考えたほうがよいだろう。

## 事実整理: Auto model selection は万能な逃げ道ではない

多くの現場が見落としやすいのがここだ。supported models の「Auto model selection」表を見ると、Auto の候補には **GPT-5.3-Codex、GPT-5.4、GPT-5.4 mini** などが並ぶ一方、**GPT-5.5 は含まれていない**。

この事実はかなり重い。なぜなら、GPT-5.2 の代替は changelog 上は GPT-5.5 なのに、**Auto は GPT-5.5 を選ぶ経路になっていない** からだ。つまり、GitHubのメッセージは少なくとも次のように解釈すべきだ。

- GPT-5.2 を明示利用していたチームは、深い推論用に GPT-5.5 を個別に評価する
- ただし日常運用の既定値は Auto や GPT-5.4 系へ寄る可能性が高い
- agent 実行は GPT-5.3-Codex を中核に置く

要するに、**Auto は GPT-5.2 の完全な置換ではない**。Auto は可用性・方針・対応クライアントを踏まえた「現実的な既定経路」であり、GPT-5.5 はその外にある「明示的に使う上位レーン」に近い。これは [GPT-5.5一般提供の記事](/blog/github-copilot-gpt-55-general-availability-2026/) で見えた「高難度タスク専用の高額レーン」という理解とも噛み合う。

## 事実整理: 組織導入では管理者ポリシーが先に効く

configure access の docs は短いが、実務上は非常に重要だ。そこでは、

- Copilot Free / Pro / Pro+ は個人で直接モデルを使える
- Copilot Business / Enterprise は、組織または enterprise owner がモデルアクセスを有効化・無効化できる
- Auto model selection も組織ポリシーに従う

と整理されている。

この3点から、日本企業で起こる典型的なズレが見える。

### 個人利用では「試せる」

個人のPro+利用者なら、新しいモデルの比較は比較的速い。手元でGPT-5.5を触って、`これは思考が深い`、`これは遅いが強い`、`CLIはGPT-5.3-Codexのほうが扱いやすい` と判断できる。

### 企業利用では「使えるか」が先に来る

一方、Business / Enterprise では、評価以前に **管理者が代替モデルを開けているか** が先に来る。利用者本人が「6月からGPT-5.5へ行くはず」と思っていても、ポリシー未更新なら model picker に出ない。Auto も制限を受ける。ここで初めて、「個人のモデル選択」と「組織のモデル運用」は別問題だと分かる。

日本企業はこの点で詰まりやすい。性能比較は技術チームが進められても、ポリシー変更は情シスやプラットフォーム管理者のレビュー待ちになりやすい。今回の changelog は短いが、実務では **技術評価と運用承認を5月中に同期させろ** という意味を持つ。

## ここからは分析: 日本市場では「標準モデル」を再定義する必要がある

ここから先は分析だが、今回の本質は廃止そのものではなく、**GitHub Copilotの標準モデル設計をどう置き直すか** にあると思う。

これまで GPT-5.2 は、深い推論の標準レーンとして扱いやすかった。倍率 1x で、GitHub Docs上も deep reasoning and debugging の代表として載っている。つまり「強めのモデルだが、まだ普段使いの延長に置ける」位置だった。

しかし後継に示された GPT-5.5 は違う。7.5x という数字は、GitHubがこれを **全員向けの新標準** ではなく、**明示的に選ぶ高額レーン** として扱っていることを示している。だから日本企業は、次の2段構えで考えるほうがよい。

### 標準の深い推論は何に置くか

すべてを GPT-5.5 に置き換えるのは、コストと説明責任の面で無理がある。Auto、GPT-5.4、GPT-5.4 mini を含めた「通常レーン」を決め、その上で GPT-5.5 を例外的に使う形が自然だろう。

### agent 実行の標準は何に置くか

こちらは GPT-5.3-Codex が本命だ。倍率も 1x で、GitHub自身が agentic software development の主力として整理している。CLI や cloud agent、編集をまたぐマルチステップ実行では、ここを標準に据えるほうが整合的だ。

## 日本の開発組織が5月中にやるべきこと

実務上のアクションは、派手なものではなく運用整理になる。

### 1. 旧モデルの利用箇所を棚卸しする

少なくとも Chat、CLI、agent mode、inline edits、code review を分けて見るべきだ。GPT-5.2-Codex は code review だけ例外で残るため、「GPT-5.2-Codex は全廃」と誤解すると運用設計が崩れる。

### 2. 代替先を用途で固定する

推論系は GPT-5.5 か GPT-5.4 系か。agent 系は GPT-5.3-Codex か Auto か。ここを曖昧にすると、現場ごとに勝手な移行が起きて、比較や予算説明ができなくなる。

### 3. 管理者ポリシーを確認する

Business / Enterprise の場合、6月1日を待たずにモデルポリシーを確認すべきだ。代替モデルが開いているか、Auto で許可される範囲は何か、特定組織だけ例外扱いにするかまで見たほうがよい。

### 4. GPT-5.5 を「高難度タスク専用」に寄せる

深い推論や複雑なデバッグで価値が出る場面に限定し、軽い会話や反復作業には使わない。この切り分けがないと、7.5x の意味が重くのしかかる。

### 5. 社内ガイドを更新する

長い資料は要らない。`6月1日で終了するモデル`、`用途別の代替先`、`管理者に確認すべき項目`、`高コストモデルの利用基準` の4点だけでも共有したほうがよい。

## まとめ

GitHub Copilotの GPT-5.2 / GPT-5.2-Codex 廃止は、2026年6月1日に来る単純なモデル更新ではない。GitHub Docsと合わせて読むと、**推論レーンは高コスト化し、agent レーンは GPT-5.3-Codex へ標準化し、組織利用は管理者ポリシーが律速になる** という構造が見えてくる。

日本市場で重要なのは、これを「新モデルの話」で終わらせず、**標準モデル設計の見直し** として扱うことだろう。誰がどの仕事で GPT-5.5 を使うのか。どこまでを GPT-5.3-Codex や Auto に寄せるのか。Business / Enterprise の管理者がいつポリシーを更新するのか。今回の changelog は、その判断を5月中に前倒しさせる通知だと考えるのが実務的だ。

## 出典

- [Upcoming deprecation of GPT-5.2 and GPT-5.2-Codex](https://github.blog/changelog/2026-05-01-upcoming-deprecation-of-gpt-5-2-and-gpt-5-2-codex/) - GitHub Changelog, 2026-05-01
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [AI model comparison](https://docs.github.com/en/copilot/reference/ai-models/model-comparison) - GitHub Docs
- [Configuring access to AI models in GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models) - GitHub Docs
