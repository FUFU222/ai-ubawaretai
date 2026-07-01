---
article: 'google-agent-quality-flywheel-evaluation-2026'
level: 'child'
---

AIエージェントを直したあと、「本当に前より良くなった」とどう確認すればよいだろう。目の前の3例が成功しただけでは足りない。別の質問で間違いが増えたり、必要なtoolを呼ばなくなったりするかもしれない。こうした、修正によって別の場所が悪くなることを**回帰**と呼ぶ。

Googleは2026年6月30日、Agent Quality Flywheelという評価の流れをcoding agentから動かすskillを発表した。開発者が「会話途中の変更を最後の回答へ反映できるか調べたい」と自然言語で伝えると、skillが評価データ、採点方法、失敗分析、改善後の再テストを組み立てる。

## 5段階で品質を確認する

評価は5段階に分かれる。

1. 評価用の会話やtraceを準備する。
2. AIエージェントをそのデータで動かす。
3. AutoRaterや独自の基準で採点する。
4. 失敗の理由を読み、似た失敗をまとめる。
5. 原因に絞った修正を行い、同じ条件でもう一度測る。

大事なのは、一度だけ点数を出して終わらないことだ。同じデータと基準を使い、修正前と修正後を比べる。たとえば、旅行計画エージェントが途中で変更された日付を無視した割合が21%から5%へ下がったなら、改善を数で説明できる。

この流れは、[Google Julesの評価記事](/blog/google-jules-proactive-coding-agent-eval-2026/) で扱った「AIの結果だけでなく過程も見る」という考え方にも近い。最終回答が正しく見えても、禁止されたtoolを使ったり、古い情報を参照したりする場合があるからだ。

## AutoRaterは何をするのか

AutoRaterは、別のAIモデルを使って回答や実行経路を採点する仕組みだ。Gemini Enterprise Agent Platformには、最終回答の品質、hallucination、toolの使い方、安全性、multi-turnの目的達成などを測る指標が用意される。

ただし、AIが採点するから常に正しいわけではない。質問ごとに評価基準を作るadaptive metricは、幅広い失敗を見つけやすい一方、毎回まったく同じ基準にはならない。そのためGoogleは、単一の点数を絶対的な成績として見るより、同じ条件での前後差を重視するよう説明している。

会社固有の条件にはcustom metricを使う。「回答に必ず根拠文書を付けたか」のような条件は自然言語rubricで確認できる。「JSONに必須fieldがあるか」「金額が上限以下か」はPython関数で判定できる。AIに任せる判断と、codeで確実に判定する条件を分けることが重要だ。

## 自分で直して自分で採点しない

今回の発表で特に重要なのは、改善する側と採点する側を分けることだ。coding agentは修正案を作るが、その修正の合否は独立したevaluation serviceが判定する。自分の宿題を自分で採点すると、採点基準に合わせただけの答えを作りやすいからである。

学校のテストでも、問題を解いた本人ではなく先生が採点する。AIエージェント開発でも同じように、変更を作るjobと評価するjobを分け、評価データや合格基準を勝手に変えられないようにするとよい。

[Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/) で集めるtraceは、この評価材料になる。どんな質問を受け、どのtoolを使い、何を返したかを記録できれば、失敗した場所を調べやすい。

## 日本のチームが始める方法

最初から何百件も用意する必要はない。まず過去に困った失敗を20件ほど集める。顧客名やメールアドレスは削除し、評価用の固定データにする。成功条件を「良い回答」のように曖昧にせず、「最新の変更を反映する」「根拠を示す」「承認なしに更新しない」と具体化する。

次に、一つの変更だけを試す。変更前と変更後を同じデータで動かし、点数だけでなく失敗したcaseを読む。個人情報の表示や無断更新のような重大事故は、平均点が高くても一件で不合格にする。

Googleの評価機能は発表時点でPreviewだ。すぐに唯一の合否判定へ使うのではなく、既存テストと人間レビューに追加する形が安全である。安定してからCIのwarningにし、その後で重大条件だけをblockingにするとよい。

## まとめ

Agent Quality Flywheelは、AIエージェントの改善を印象ではなく反復可能な評価へ変える仕組みだ。データを準備し、動かし、採点し、失敗を調べ、直して再度測る。これを同じ条件で回すことで、修正による回帰を見つけやすくなる。

AutoRaterは便利だが、絶対に正しい先生ではない。幅広い品質はAIで見て、会社固有の条件はcustom rubricで測り、安全上の必須条件はcodeと人間で確認する。小さな評価セットから始め、失敗を一つずつ再現可能にすることが最初の一歩になる。

## 出典

- [Driving the Agent Quality Flywheel from Your Coding Agent](https://developers.googleblog.com/driving-the-agent-quality-flywheel-from-your-coding-agent/) - Google Developers Blog, 2026-06-30
- [Manage evaluation metrics](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/manage-metrics) - Google Cloud Documentation
- [Analyze evaluation results and failure clusters](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/view-results) - Google Cloud Documentation
