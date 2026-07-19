---
title: 'Conductor Plugin、Antigravityで仕様駆動AI開発へ'
description: 'Conductor PluginがAntigravity対応へ。日本の開発チームがspec.md、plan.md、MCP、hooksをどう管理し、AI実装の再現性とレビュー責任を守るか整理する。'
pubDate: '2026-07-19'
category: 'news'
tags: ['Google', 'Gemini API', 'AIエージェント', '開発者ツール', 'コーディングエージェント', '開発基盤']
series: 'google-gemini-api-agent-platform-2026'
draft: false
---

Google は **2026年7月16日**、Spec-Driven Development を支援する Conductor を、Gemini CLI extension から **Conductor Plugin** へ進化させ、Antigravity CLI でも使えるようにしたと発表した。Conductor は、AI コーディング作業を一時的なチャット履歴だけに閉じず、`spec.md` や `plan.md` のような version-controlled Markdown artifact として残すための仕組みである。

これは、AI コーディングツールの競争がモデル選択から作業状態の管理へ移っていることを示す更新だ。[Google Antigravity移行、Code Assist開発の再設計](/blog/google-antigravity-code-assist-migration-2026/)では開発者向け agent 環境の移行を扱った。[Gemini API Managed Agents、運用設計の実務](/blog/google-gemini-api-managed-agents-2026/)では agent 実行基盤を見た。今回の Conductor Plugin は、それらの作業を「どの仕様に基づいて進めているか」というリポジトリ上の状態管理へ寄せる。

さらに、[Google ADK/A2A多言語化、エージェント連携の設計点](/blog/google-adk-a2a-cross-language-agents-2026/)で扱ったように、エージェント基盤は複数言語、複数ツール、複数実行面へ広がっている。Conductor Plugin の価値は、Antigravity、Claude Code などツールが変わっても、仕様と計画を同じ repository artifact として持ち運べる点にある。

## 事実: Conductorがポータブルなプラグインになった

Google Developers Blog によると、Conductor はもともと spec-driven development を terminal に持ち込むために導入された。プロジェクトの認識を ephemeral な chat log から、永続的で version-controlled な Markdown file へ移すことで、開発者が実装前に architecture を計画しやすくする狙いだった。

今回の更新では、Conductor が Gemini CLI extension から Conductor Plugin へ移行する。Google は、plugin が skills、rules、MCP servers、hooks をひとつの package に含められると説明している。これにより、Conductor は strict command sequence に縛られるより、会話の中で context、spec、plan を生成・更新する体験へ寄る。

発表では、`spec.md` と `plan.md` は引き続き残ると説明されている。つまり、自然言語で対話しやすくなっても、成果物はチャットの中に消えない。仕様、計画、タスクの進捗をリポジトリに残し、AI agent がその文脈を読みながら作業する設計である。

Conductor Plugin は Antigravity CLI から利用できる。Google の発表では、`agy plugins install https://github.com/gemini-cli-extensions/conductor` で Antigravity CLI に導入するコマンドも示されている。GitHub repository 側では、Conductor は Antigravity や Claude Code を含む AI coding agents 向けの plugin と説明され、Context、Spec & Plan、Implement という lifecycle を管理する。

## 事実: 仕様書がAI作業の単一参照点になる

Conductor の実務的な中心は、AI agent に「今の会話」だけで作業させないことだ。GitHub repository の README は、Conductor が context を managed artifact として code と並べることで、repository を single source of truth に変えると説明している。これは、日本の開発チームではかなり重要である。

AI コーディングでよく起きる問題は、ある chat session では良い方針が決まっていたのに、次の session や別の tool へ移ると前提が失われることだ。担当者が休む、委託先が変わる、レビュー担当が違う、CLI から IDE へ移る、といった場面で、AI がどの仕様と計画を前提にしているかが見えなくなる。

Conductor は、ここに `spec.md`、`plan.md`、project context、workflow、style guide のような artifacts を置く。もちろん、それだけで正しい実装が保証されるわけではない。しかし、レビュー担当者は「AI が何を読んで実装したか」「計画のどの task が完了したか」「仕様変更がいつ入ったか」をファイルとして確認しやすくなる。

Google は、Conductor Plugin が既存の Conductor commands、既存の plans と specs に backward compatible だとも説明している。すでに Gemini CLI extension として Conductor を使っていたチームは、既存の仕様と計画を捨てるのではなく、plugin 化された作業面へ移行できる可能性がある。

## 分析: 日本企業ではレビュー前の勝手な実装を抑えやすい

ここからは分析だ。

日本企業の開発現場で AI agent を広げると、もっとも問題になりやすいのは「速く実装したが、誰が仕様を承認したのか分からない」状態である。AI は指示が曖昧でもコードを書ける。だが、業務システム、金融、製造、医療、公共領域では、コードが動くことよりも、要求、制約、監査、レビュー責任が追えることのほうが重要になる。

Conductor Plugin の spec-driven development は、この問題に対する現実的な制御線になる。まず spec を作り、plan に落とし、task を消化してから実装する。会話体験は自然になっても、作業の状態は repository に残る。この構造なら、AI が勝手に実装へ進んだのか、承認済み plan に沿って進んだのかをレビューしやすい。

ただし、Conductor を入れれば統制が自動で完成するわけではない。`spec.md` を誰が承認するのか、`plan.md` を誰が変更できるのか、MCP server や hooks にどこまで権限を持たせるのかを決めなければ、単に AI が参照するファイルが増えるだけになる。

特に委託開発では、spec と plan の ownership が重要だ。発注側が仕様を承認し、委託先が実装計画を出し、開発基盤チームが plugin と hooks を管理する、といった責任分界を明確にしたほうがよい。Conductor はその分界をファイルとして残す手段にはなるが、承認ルールそのものは組織が決める必要がある。

## 実務: 導入前に4つの台帳を作る

最初に、plugin 台帳を作る。Conductor Plugin をどの repository、どの developer environment、どの version で使うかを記録する。Antigravity CLI で global install するのか、workspace-level に isolation するのか、Claude Code など別 tool でも使うのかを分ける。AI coding plugin は便利だが、rules、skills、hooks を含められるため、通常の CLI tool よりも変更影響が広い。

次に、artifact 台帳を作る。`conductor/product.md`、`conductor/workflow.md`、track ごとの `spec.md` と `plan.md`、style guide、review rule をどこに置くかを決める。CODEOWNERS で、仕様と計画の変更に product owner、architect、security reviewer の承認を必須にする repository もあるだろう。

3つ目に、権限台帳を作る。MCP servers、hooks、外部 API、ローカル command、filesystem 操作、git 操作をどこまで許すかを整理する。Conductor が計画を管理しても、agent が強い tool 権限を持ちすぎると、仕様駆動というより自動実行のリスクが先に立つ。

4つ目に、レビュー台帳を作る。どの task は AI に実装させてよいか、どの task は人間が設計レビューしてから実装するか、plan の checkbox を誰が完了扱いにできるかを決める。これは [Google Jules評価、proactive coding agentの見極め方](/blog/google-jules-proactive-coding-agent-eval-2026/) ともつながる。agent の実装力だけでなく、どの評価とレビューを通すかを先に決める必要がある。

## 注意点: 仕様駆動は文書を増やすことではない

Conductor Plugin は、spec-driven development を扱いやすくする。しかし、spec と plan を作れば安全になるわけではない。悪い spec を丁寧に実装すれば、悪い実装が速くできるだけである。曖昧な plan を AI に渡せば、AI は曖昧なまま作業を進める。

重要なのは、spec と plan をレビュー可能な単位へ分けることだ。1つの track に大きすぎる要求を入れると、agent も reviewer も失敗しやすい。調査、設計、テスト追加、小さな実装、移行、ドキュメント更新を分け、PR と task を対応させる。そうして初めて、仕様駆動の artifact がレビューの助けになる。

また、plugin の portability は利点であると同時にリスクでもある。Antigravity で始めた作業を別 tool で続けられるなら便利だが、tool ごとの権限、モデル、ログ、承認画面、hook 実行の差を無視してはいけない。持ち運ぶのは spec と plan であって、統制責任まで自動で持ち運ばれるわけではない。

## まとめ

Conductor Plugin の Antigravity 対応は、Google の開発者向け AI agent 基盤が、会話 UI やモデル性能だけでなく、仕様、計画、作業状態の管理へ進んでいることを示す更新である。`spec.md` と `plan.md` を repository に残し、複数の AI coding tool から参照できるようにすることで、AI 実装の再現性とレビュー可能性を高めやすくなる。

日本の開発チームにとっての論点は、Conductor を入れるかどうかだけではない。plugin、artifact、権限、レビューの所有者を先に決め、AI agent がどの仕様に基づいて作業したかを追える状態にすることだ。AI コーディングの標準化は、モデルを選ぶ段階から、作業状態をどう管理するかへ移っている。

## 出典

- [Evolving Spec-Driven Development: Conductor Now Supports Antigravity](https://developers.googleblog.com/evolving-spec-driven-development-conductor-now-supports-antigravity/) - Google Developers Blog, 2026-07-16
- [gemini-cli-extensions/conductor](https://github.com/gemini-cli-extensions/conductor) - GitHub
- [Getting started with Spec Driven Development in Antigravity](https://codelabs.developers.google.com/codelabs/getting-started-with-spec-driven-development-in-antigravity) - Google Codelabs
