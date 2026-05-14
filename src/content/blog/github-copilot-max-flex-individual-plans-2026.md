---
title: 'Copilot Max新設、個人AI Creditsの予算設計'
description: 'GitHub Copilot Maxとflex allotmentで個人向けAI Creditsが再設計される。日本の開発者と小規模チームが6月前に見るべき予算、モデル、追加利用の論点を整理する。'
pubDate: '2026-05-14'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'SaaSコスト管理', '従量課金', '開発者ツール', '日本企業', 'AIエージェント']
draft: false
series: 'github-copilot-2026'
---

GitHub が **2026年5月12日** に、個人向け GitHub Copilot の料金ラインアップをもう一段組み替えると発表した。焦点は **Copilot Max** の新設と、Copilot Pro / Pro+ に入る **flex allotment** だ。6月1日に usage-based billing へ移る前に、GitHub は「含まれる利用量が足りるのか」という利用者の不安に対して、Pro と Pro+ の同価格維持、追加の可変利用枠、そして高頻度ユーザー向けの Max plan で応えた形になる。

これは単なる値上げ・値下げの話ではない。すでにこのサイトでは [Copilot使用量レポート、6月のAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/) で Business / Enterprise と個人利用者が April usage report をどう読むべきかを扱った。今回はその続きとして、**個人開発者、フリーランス、小規模チームのリードが6月1日以降にどの予算感で Copilot を使うか**が中心になる。

特に日本では、個人契約の Copilot を仕事にも学習にも使っている開発者が多い。会社の Enterprise 管理下に入っていない副業、OSS、個人プロダクト、スタートアップ初期の開発では、個人向けプランの設計変更がそのまま毎月の作業量に効く。今回の発表は、Copilot を「月額で気にせず使う補助ツール」と見る段階から、**AI Credits と追加予算を管理する開発インフラ**として見る段階へ移ったことを示している。

## 事実: 6月1日から個人向けにMaxとflex allotmentが入る

GitHub の発表によると、2026年6月1日から個人向け Copilot は Free、Pro、Pro+、Max のラインアップになる。Paid plan では、月額料金と1対1で対応する **base credits** に加えて、追加の **flex allotment** が付く。GitHub は base credits は固定、flex allotment はモデル価格や効率改善など AI の経済性に応じて変わり得る部分だと説明している。

今回示された数字は明確だ。Copilot Pro は月額10ドルで base 10ドル分、flex 5ドル分、合計15ドル分。Copilot Pro+ は月額39ドルで base 39ドル分、flex 31ドル分、合計70ドル分。新設される Copilot Max は月額100ドルで base 100ドル分、flex 100ドル分、合計200ドル分の included usage になる。

GitHub Docs 側では、同じ内容を AI Credits の単位でも説明している。1 AI Credit は 0.01米ドルとして扱われ、Pro は 1,500 credits、Pro+ は 7,000 credits、Max は 20,000 credits が月次の含有量になる。使い切った場合は追加予算を設定して継続するか、次の月次サイクルまで待つことになる。

重要なのは、code completions と next edit suggestions は paid plan では引き続き AI Credits を消費しないと明記されている点だ。つまり、課金管理の中心は補完ではなく、Copilot Chat、Copilot CLI、cloud agent、Spaces、Spark、third-party coding agents のようなモデル利用面になる。

## 事実: flexは固定値ではなく、可変の含有枠として設計されている

今回の発表で一番見落としやすいのは、flex allotment が「恒久的に同じ追加枠」ではないことだ。GitHub は、base credits は月額料金と対応して固定される一方、flex allotment はモデル価格、新モデル、効率改善などに応じて変わると説明している。

これは利用者から見ると少し扱いにくい。今の Pro+ は月70ドル分の利用量に見えるが、その内訳は base 39ドル分と flex 31ドル分であり、将来も常に31ドル分が続くと断定できない。Max も同じで、月200ドル分のうち100ドル分は flex だ。

ただし、GitHub 側の事情としては筋が通っている。4月20日の個人向けプラン変更では、agentic workflow の長時間・並列セッションが既存のプラン構造を超える計算需要を生んでいると説明されていた。さらに [GitHub Copilotが無料トライアル停止、Pro+に新レート制限](/blog/github-copilot-pro-trial-pause-rate-limits-2026/) でも見たように、GitHub はすでに新規サインアップや利用上限、モデル提供を調整していた。今回の flex は、その締め付けだけで終わらせず、一定の追加利用余地を自動で乗せるための調整と読める。

日本の開発者にとっては、ここを「お得になった」とだけ見るのは危ない。正確には、**固定の月額契約に、GitHub が調整可能な追加利用枠を重ねた**という理解が必要だ。社内で個人契約を費用精算している場合も、説明するときは「月額料金」と「含まれる可変AI利用量」を分けたほうがよい。

## 分析: Maxはヘビーユーザー向けの逃げ道だが、万能ではない

ここからは分析だ。

Copilot Max の新設は、Pro+ の上位版というより、**長い agent run や高性能モデルを日常的に使う個人向けの逃げ道**だと見るのがよい。GitHub は今回、longer agent runs、multi-step work、more capable models が含有利用量に圧力をかけると書いている。つまり Max は、単に「もっとチャットできるプラン」ではなく、agentic coding を頻繁に回す人を想定している。

ただ、Max にすれば何でも気にしなくてよいわけではない。GitHub Docs は、長い会話、複雑な作業、agentic features、高コストモデルの選択が利用量を増やすと説明している。20,000 AI Credits があっても、複数ファイルにまたがる長時間の cloud agent session や、高性能モデルを使った再試行を繰り返せば、消費は速くなる。

この点は [GitHub CopilotでGPT-5.5一般提供開始。日本チームは何を見極めるべきか](/blog/github-copilot-gpt-55-general-availability-2026/) とつながる。GPT-5.5 のような上位モデルは、高難度の調査や設計には価値がある。一方で、軽い質問や単純な修正まで毎回上位モデルに寄せると、AI Credits の消費は見えにくくなる。Max は「高いモデルを雑に使う許可証」ではなく、「高難度タスクを個人で多めに回すための上限緩和」と考えたほうが現実的だ。

## 日本の小規模チームでは、個人契約とチーム契約の境界が問題になる

今回の発表が日本で効くのは、個人プランの話でありながら、実際には小規模チームの開発にも影響するからだ。スタートアップ初期や受託開発、小さなプロダクトチームでは、全員分の Business / Enterprise を最初から整える前に、個人の Pro / Pro+ で始めることがある。そこに usage-based billing と Max が入ると、個人契約のままどこまで業務利用するかを考え直す必要が出る。

たとえば、1人のテックリードだけが Copilot CLI や cloud agent を重く使い、他のメンバーは補完と軽い chat 中心なら、Max を1人に寄せる判断はあり得る。逆に、チーム全体で agentic workflow を標準化し、MCP、hooks、CLI plugin まで配るなら、個人プランで粘るより Business / Enterprise 側の管理機能を検討したほうがよい。

この判断は、[GitHub Copilot CLI企業管理、プラグイン標準配布の実務](/blog/github-copilot-cli-enterprise-plugins-2026/) とも重なる。個人プランでは「本人がどう使うか」が中心だが、企業管理の Copilot CLI plugin では、どの marketplace や plugin を標準配布するかまで管理できる。つまり、AI Credits の量だけでなく、**誰が設定と統制を持つべきか**もプラン選定に入る。

日本企業やチームが見落としやすいのは、月額の安さだけで比較してしまうことだ。Pro+ から Max へ上げるか、Business / Enterprise へ寄せるかは、単純な価格差では決まらない。重要なのは、利用量、管理者設定、セキュリティ、費用精算、監査ログ、チーム標準化のどれが必要かだ。

## 6月1日前に決めるべきこと

今回の変更を受けて、個人開発者と小規模チームが6月1日前に決めるべきことは大きく4つある。

1つ目は、**自分の主な利用面を分けること**だ。補完中心なら、paid plan の unlimited completions が大きく、AI Credits の消費は比較的読みやすい。Chat、CLI、cloud agent、third-party coding agents を使っているなら、月の利用量を見積もる必要がある。特に CLI や cloud agent は複数のモデル呼び出しを含みやすく、短い補完とは別物として扱うべきだ。

2つ目は、**追加予算を許可するかどうか**だ。GitHub Docs では、含有 AI Credits を使い切った後も、追加利用予算を設定すれば継続できると説明している。個人なら自分の財布の問題で済むが、会社精算なら上限額を先に決めておかないと、月末に説明が難しくなる。

3つ目は、**モデルの使い分けを決めること**だ。高性能モデルは難しい設計、原因調査、横断的リファクタリングに寄せる。軽い質問や定型修正は auto model selection や軽量モデルを使う。この運用を決めないまま Max に上げると、単に消費速度が上がるだけになりやすい。

4つ目は、**個人プランで続けるか、チーム管理へ移るか**だ。1人で完結する個人開発なら Pro+ や Max の比較で十分だ。一方、複数人で同じ repository、同じ agent workflow、同じセキュリティ基準を扱うなら、個人プランの月額比較だけでなく、Business / Enterprise の管理機能も選択肢に入れるべきだ。

## まとめ

Copilot Max と flex allotment の発表は、GitHub Copilot の個人向けプランが usage-based billing に合わせて現実的に再設計されたニュースだ。Pro と Pro+ は同価格のまま含有利用量が増え、Max は月100ドルで高頻度の agentic coding を想定した上位枠として置かれた。

ただし、今回の本質は「Max が安いか高いか」ではない。base credits と flex allotment を分け、AI Credits を使い切った後の追加予算を決め、モデルと agentic workflow の使い方を管理する必要が出てきたことだ。日本の個人開発者や小規模チームにとっては、6月1日以降、Copilot を月額ツールではなく、**毎月のAI実行予算を持つ開発基盤**として扱うべきタイミングに入ったと言える。

## 出典

- [GitHub Copilot individual plans: Introducing flex allotments in Pro and Pro+, and a new Max plan](https://github.blog/news-insights/company-news/github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/) - GitHub Blog, 2026-05-12
- [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals) - GitHub Docs
- [Changes to GitHub Copilot Individual plans](https://github.blog/news-insights/company-news/changes-to-github-copilot-individual-plans/) - GitHub Blog, 2026-04-20, updated 2026-04-29
