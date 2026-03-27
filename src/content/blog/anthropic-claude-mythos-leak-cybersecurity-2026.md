---
title: "Anthropic「Claude Mythos」がデータリークで発覚——Opus超えの新モデルが示すサイバーセキュリティの転換点"
description: "AnthropicのCMS設定ミスにより未発表モデル「Claude Mythos」の存在が明るみに。Opusを超える新ティアの性能と、サイバーセキュリティ業界への衝撃を読み解く。"
pubDate: "2026-03-28"
category: "news"
tags: ["Anthropic", "Claude", "サイバーセキュリティ", "AI モデル"]
draft: false
---

## 何が起きたか

2026年3月26日、[Fortune](https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/)がAnthropicの未発表AIモデル「Claude Mythos」の存在をスクープした。発端はセキュリティ研究者のRoy Paz氏（LayerX Security）とAlexandre Pauwels氏（ケンブリッジ大学）による発見で、AnthropicのCMS（コンテンツ管理システム）に約3,000件の未公開アセットが公開状態で放置されていた。その中に、Claude Mythosについて詳述したドラフトブログ記事が含まれていたというわけだ。

原因はCMSの設定ミス。アップロードされたアセットがデフォルトで「公開」になっており、明示的に非公開設定しない限り誰でもアクセスできる状態だった。[Fortuneの続報](https://fortune.com/2026/03/27/anthropic-leaked-ai-mythos-cybersecurity-risk/)によると、Anthropicは「ヒューマンエラー」と説明し、Fortuneから連絡を受けた後にデータストアの公開検索を無効化している。

Anthropicの広報は公式に次のように認めた。「推論、コーディング、サイバーセキュリティにおいて意味のある進歩を遂げた汎用モデルを開発中です。これはステップチェンジであり、我々がこれまでに構築した中で最も高性能なモデルです」。現在、選ばれた早期アクセス顧客がテスト中だという。

## 背景・文脈

Anthropicは最近、Claude Opus 4.6でTerminal-Bench 2.0のスコア65.4%を記録し、GPT-5.2-Codexを上回ったばかりだった（[Techzine](https://www.techzine.eu/news/applications/140017/details-leak-on-anthropics-step-change-mythos-model/)が報じている）。そのOpusの上に位置する新ティアとして登場するのがMythos、内部コードネーム「Capybara」だ。

リークされたドラフトには、MythosがHaiku（最小）、Sonnet（高速・低コスト）、Opus（最高性能）に続く「第4のティア」であり、「Opusモデルよりも大きく、よりインテリジェント」と記述されていた。つまりこれは単なるバージョンアップではなく、モデルラインナップの構造自体を変える話だ。

タイミングも興味深い。3月26日にはサンフランシスコの連邦判事が、国防総省によるAnthropicの「サプライチェーンリスク」指定を差し止める仮処分を出したばかり。政府との緊張関係が続く中でのリークは、Anthropicにとってコントロールしきれない情報公開だったはずだ。

## 技術的なポイント

リークされたドラフトで最も注目すべきは、Mythosのサイバーセキュリティ能力に関する記述だ。「現在、サイバー能力において他のどのAIモデルよりもはるかに先行している」とされ、さらに「防御者の努力をはるかに上回る方法で脆弱性を悪用できるモデルの波の到来を予兆している」と警告している。

この記述をそのまま受け取ると、Mythosはソフトウェアの脆弱性を人間のペンテスター並み、あるいはそれ以上の速度で発見・悪用できる可能性があることになる。具体的なベンチマークスコアはリークされたドラフトから数値レベルでは明かされていないが、「ソフトウェアコーディング、学術的推論、サイバーセキュリティのテストにおいて、Claude Opus 4.6と比較して劇的に高いスコア」を記録しているという表現が使われていた。

Anthropicのリリース戦略も技術的な深刻さを裏付けている。通常のモデルリリースとは異なり、まずサイバーセキュリティ防御に特化した組織に早期アクセスを提供し、防御側が態勢を整える時間を確保してから一般公開するという方針だ。APIを通じた段階的な展開を予定しており、計算コストもAnthropicとユーザー双方にとって高額になると記載されていた。

ここで押さえておきたいのは、「AIがサイバー攻撃に使える」という話自体は新しくない。しかしモデル開発元自身がドラフト段階でこのレベルの警告を出しているのは異例だ。通常、能力の高さをアピールするブログ記事でリスクをここまで前面に出すことはない。Anthropicが自社モデルの危険性を本気で懸念していることの証拠だと僕は見ている。

## 実務への影響・使いどころ

ここからは僕の見方だけど、この件は開発者にとって2つの意味がある。

まず、サイバーセキュリティの前提が変わる。Mythosクラスのモデルが一般公開されれば、従来のペネトレーションテストや脆弱性スキャンの概念が根本的に変わる可能性がある。攻撃側のコストが劇的に下がるということは、防御側もAIを使ったリアルタイム防御を標準装備にしなければ追いつけなくなるかもしれない。

実際、3月27日の市場は敏感に反応した。[CNBC](https://www.cnbc.com/2026/03/27/anthropic-cybersecurity-stocks-ai-mythos.html)や[Investing.com](https://ca.investing.com/news/stock-market-news/cybersecurity-stocks-plunge-as-anthropics-claude-mythos-leak-sparks-ai-fear-4537128)の報道によると、iShares Cybersecurity ETFが4.5%下落し、Palo Alto Networksが約6%安、Oktaが約7%安、Tenableに至っては9%の急落を記録した。市場は「AIがセキュリティベンダーの存在意義を脅かす」と読んだわけだ。

もう一つは、Capybara/Mythosティアの登場による料金体系の変化だ。リークによれば計算コストは高額とされている。Opus 4.6でさえ実用的なコスト感とは言いづらい場面があるのに、その上のティアとなると、個人開発者が気軽に触れる価格帯にはならないだろう。「最強のモデルが使える人と使えない人」の格差が広がる方向に向かうのではないかと思う。

ただし皮肉なのは、サイバーセキュリティの「前例のないリスク」を警告するドラフトが、CMS設定ミスという初歩的なセキュリティ事故で流出したという事実だ。AIの能力がどれだけ高まっても、人間のオペレーションがボトルネックであり続けることを象徴的に示している。

## まとめ

Anthropicが意図せず見せたClaude Mythosの全貌は、AI能力の急速な進歩とそれに伴うリスクの両面を浮き彫りにした。Mythosの正式発表がいつになるかは未定だが、防御側への先行提供という異例のリリース戦略がどう機能するかは注目に値する。

## 出典

- [Anthropic 'Mythos' AI model representing 'step change' in power revealed in data leak](https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/) — Fortune, 2026-03-26
- [Anthropic accidentally leaked details of a new AI model that poses unprecedented cybersecurity risks](https://fortune.com/2026/03/27/anthropic-leaked-ai-mythos-cybersecurity-risk/) — Fortune, 2026-03-27
- [Details leak on Anthropic's "step-change" Mythos model](https://www.techzine.eu/news/applications/140017/details-leak-on-anthropics-step-change-mythos-model/) — Techzine, 2026-03-27
- [Anthropic leak reveals new model "Claude Mythos" with "dramatically higher scores on tests" than any previous model](https://the-decoder.com/anthropic-leak-reveals-new-model-claude-mythos-with-dramatically-higher-scores-on-tests-than-any-previous-model/) — The Decoder, 2026-03-27
- [Cybersecurity stocks plunge as Anthropic's 'Claude Mythos' leak sparks AI fear](https://ca.investing.com/news/stock-market-news/cybersecurity-stocks-plunge-as-anthropics-claude-mythos-leak-sparks-ai-fear-4537128) — Investing.com, 2026-03-27
- [Anthropic Just Leaked Upcoming Model With "Unprecedented Cybersecurity Risks" in the Most Ironic Way Possible](https://futurism.com/artificial-intelligence/anthropic-step-change-new-model-claude-mythos) — Futurism, 2026-03-27
