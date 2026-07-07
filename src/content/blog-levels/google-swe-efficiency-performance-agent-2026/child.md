---
article: 'google-swe-efficiency-performance-agent-2026'
level: 'child'
---

SWE-fficiency は、AI コーディングエージェントが「実際のソフトウェアを速くできるか」を測るベンチマークです。Google の ICML 2026 採択論文一覧にも掲載され、Google DeepMind や Google の研究者が著者に含まれています。

ポイントは、ただコードを書けるかではありません。実在する Python ライブラリの中で、遅い workload を見つけ、どこを直せば速くなるかを調べ、テストを壊さずに patch を出せるかを見ます。

このサイトで以前扱った [Google Jules評価](/blog/google-jules-proactive-coding-agent-eval-2026/) は、agent が何を重要な洞察として見つけるかを扱いました。SWE-fficiency は、そこからさらに一歩進んで、性能改善という難しい作業をどこまで実行できるかを見るものです。

## 何を測っているのか

SWE-fficiency には 498 個のタスクがあります。対象は numpy、pandas、scipy、scikit-learn、matplotlib、xarray、sympy、dask、astropy の 9 つの Python リポジトリです。どれも多くの開発者が使う実際のソフトウェアです。

各タスクでは、agent にリポジトリ全体、遅い workload、既存の unit test が渡されます。agent は、コードを読み、ボトルネックを探し、修正し、テストを通す必要があります。小さなパズルではなく、実務に近い性能改善の作業です。

評価には Speedup Ratio という指標が使われます。これは、AI が達成した speedup を、人間の専門家が過去の pull request で達成した speedup と比べるものです。1.0x なら専門家と同じ、0.5x なら専門家の半分です。

## 結果は厳しい

論文とプロジェクトページによると、現在の上位 agent は平均で人間専門家の speedup の 0.23 倍未満にとどまります。つまり、AI は簡単な改善を見つけることはあっても、専門家と同じ水準で性能改善できるとはまだ言いにくい状態です。

なぜ難しいのでしょうか。性能改善では、正しい場所を見つける必要があります。遅い関数を外すと、少しは速く見えても大きな改善には届きません。また、速くするための変更が、別の入力で正しさを壊すこともあります。

[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) のように、agent が長く動ける実行環境は増えています。しかし、実行環境があることと、良い性能 patch を安全に作れることは別です。

## 日本の開発チームが見るべきこと

まず、AI が出した性能改善 patch をそのまま信じないことです。速くなったという説明だけでは足りません。どの環境で、どのデータで、何回測り、どのテストを通したのかを見る必要があります。

次に、性能テストと正しさのテストを分けることです。テストが通っても本当に速いとは限らず、速くなっても正しいとは限りません。金融、製造、医療、広告のように間違いの影響が大きい領域では特に重要です。

さらに、AI の役割を小さく始めるとよいです。最初から自動で patch を採用するのではなく、まずは「どこが遅そうかを調べる」「関連する関数を挙げる」「benchmark の候補を出す」といった調査補助に使います。

[Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/) で扱ったように、agent の改善は一度の成功ではなく、失敗例を集めて評価を回す必要があります。SWE-fficiency は、その評価項目に性能改善を入れるきっかけになります。

## まとめ

SWE-fficiency は、AI コーディングエージェントの現実を見せるベンチマークです。AI はコードを書く力を伸ばしていますが、実リポジトリで性能を専門家級に改善するには、まだ大きな差があります。

日本の開発チームは、AI を性能改善の候補探しや調査には使いながら、採用時には人間レビュー、benchmark、unit test、再現性確認を必ず残すべきです。AI が速い patch を出したように見えたときほど、なぜ速くなったのかを確認する姿勢が重要です。

## 出典

- [Google at ICML 2026](https://research.google/conferences-and-events/google-at-icml-2026/) - Google Research, 2026-07-06
- [SWE-fficiency: Can Language Models Optimize Real-World Repositories on Real Workloads?](https://arxiv.org/abs/2511.06090) - arXiv, revised 2026-06-27
- [SWE-fficiency project and leaderboard](https://swefficiency.com/) - SWE-fficiency project
