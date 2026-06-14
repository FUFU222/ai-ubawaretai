---
article: 'openai-ona-codex-persistent-cloud-2026'
level: 'expert'
---

OpenAI は 2026年6月11日、Ona を買収する合意を発表した。OpenAI は、Ona の secure cloud execution と orchestration technology を Codex ecosystem に取り込み、長時間動く agent を software work と knowledge work に広げると説明している。買収は通常の完了条件と必要な規制承認を前提としており、完了までは OpenAI と Ona は独立した会社として運営される。

この発表の実務上の意味は、Codex の中心が「AIがコードを書く」から「AIが企業の管理された環境で、時間をまたいで作業する」へ広がっていることにある。OpenAI は Codex の週次利用者が 500万人を超え、今年前半から 400%増えたと説明している。さらに、Codex の価値ある作業は数分ではなく数時間から数日に伸びているという。これは、開発者が端末の前で待つ短い補助ではなく、作業キュー、進捗確認、方向修正、レビュー、停止条件を持つ運用へ近づくことを意味する。

日本企業が見るべき論点は、買収額やブランドではない。Codex のような agent が、どの cloud environment で動き、どの認証情報を使い、どのデータへアクセスし、どのログを残し、どの human review を通るのかである。この点は、[OpenAI Codex支出管理](/blog/openai-codex-business-spend-controls-2026/) の FinOps 論点、[OpenAI CodexのOracle Cloud調達](/blog/openai-codex-oracle-cloud-commitment-2026/) の調達・基盤論点、[Codex rate limits障害の耐障害設計](/blog/openai-codex-rate-limit-incident-resilience-2026/) の継続性論点をまとめ直す契機になる。

## 事実: Onaは永続的なクラウド実行環境をCodexへ持ち込む

OpenAI の発表では、Ona は developers の作業を local machine から cloud へ移すことに取り組んできた会社として説明されている。OpenAI は、Ona が 200万人の developers に secure, reproducible cloud environments を提供してきたと述べ、その経験が Codex の次段階に直接関係すると位置付けた。

Ona 側の記事も、同じ方向を具体的に語っている。Ona は年初から weekly agent sessions が production で 13倍に伸びたと説明し、銀行、製薬、アジアの sovereign wealth fund など、高い統制を求める組織で利用が広がっているとした。Ona の整理では、企業の agent work には context、control、collaboration の三つが必要である。context は企業作業が実際に行われる systems の中で動くこと、control は data、deployment、credentials、permissions、runtime の境界を明確にすること、collaboration は teams、tools、sessions をまたいで状態と進捗を共有することである。

OpenAI が発表で示した customer-controlled execution model は、この三つを Codex 側に取り込む方向と読める。agent は組織自身の cloud environment 内で動き、OpenAI は intelligence と orchestration を提供する。これにより、企業は infrastructure、data、security boundaries への control を保ちつつ、Codex の能力を使うという構図になる。

ただし、発表時点で詳細な提供形態、価格、リージョン、データ処理条件、既存 Codex 契約への反映時期がすべて明らかになったわけではない。事実として言えるのは、OpenAI が Codex の enterprise execution capabilities を secure and persistent な方向へ進めるために Ona を取り込む、という点までである。導入判断では、この方向性と未確定点を分けて扱う必要がある。

## 事実: 長時間実行は認証情報、監査、レビューを要求する

OpenAI は、production workflows に agent を入れるには capable models だけでは不十分だと明示している。必要なのは、どこで実行されるか、何へアクセスできるか、credentials がどう scoped されるか、activity がどう logged されるか、work がどう review へ移るかである。

Ona の説明もさらに踏み込んでいる。Ona は、cloud agents には reproducible environments、repeatable automations、deployment inside the customer's cloud、scoped credentials、audit trails、agent orchestration、runtime AI security が必要だと述べた。これは、従来の developer environment と、AI agent の実行環境が重なり始めていることを示す。

この整理は、AI コーディングツールの導入をアカウント管理だけで済ませてきた組織には重い。agent が長く動くほど、単なる IDE プラグインではなく、CI/CD、secret manager、cloud IAM、network policy、ticket system、code review、security scanner、usage budget に接続する。つまり Codex の長時間実行は、開発者ツール導入ではなく、開発基盤設計の一部になる。

## 分析: Codexは「作業者」として管理され始める

ここからは分析である。

Ona 買収の意味を過小評価しやすいのは、AI コーディングの話をまだ editor や CLI の延長で見てしまうからだ。短い補完や数分の修正なら、失敗しても人間がすぐ気づける。だが数時間から数日かかる作業を任せるなら、Codex は一時的な assistant ではなく、制限付きの作業者として扱う必要がある。

作業者として扱うなら、ID と権限が要る。誰の代理で動くのか、agent 専用 identity を持つのか、repository read と write を分けるのか、ticket 更新や CI 実行まで許すのかを決める必要がある。人間の強い個人権限をそのまま agent に渡す設計は、便利だが危険である。最小権限、短命 credential、用途別 service account、操作ごとの approval を組み合わせるほうが現実的だ。

また、作業者として扱うなら、労務管理ではなく作業管理が要る。どの queue から仕事を受けるか、優先度をどう決めるか、いつ人間へ戻すか、どの変更は draft PR までに止めるか、どのテスト失敗で停止するか、どの費用上限で打ち切るか。これらを決めずに「長時間実行できるから便利」とだけ導入すると、agent が増えるほど現場は追跡不能になる。

ここで [OpenAI Codex Security](/blog/openai-codex-security-workflow-2026/) の文脈が効く。脆弱性対応では、agent がコードを読み、脅威モデルを作り、再現を試み、修正案を作り、人間レビューへ渡す。これは長時間実行と相性が良い一方で、誤った修正、過剰な権限、機密情報へのアクセス、監査証跡の不足がそのままリスクになる。Ona のような execution layer は、こうした作業を企業の統制内に置くための部品として見るべきだ。

## 分析: 日本企業ではクラウド開発環境とAI統制が一体化する

日本企業の多くは、すでに開発環境のクラウド化を部分的に進めている。GitHub Codespaces、VDI、社内クラウド、SaaS IDE、CI runner、検証環境、委託先向け環境などが混在している。一方で、AI agent の導入は ChatGPT、Codex、Copilot、Claude Code、Cursor のようなツール単位で検討されがちだ。

Ona 買収が示す方向は、この二つが分離できなくなることだ。agent が長時間動くには、再現可能な環境、依存関係、テスト、ログ、認証情報、ネットワーク、成果物の置き場が必要になる。これは cloud development environment の問題であり、同時に AI governance の問題でもある。

たとえば、委託先を含む開発では、端末にコードを落とさずクラウド環境で作業させたいという要件がある。そこへ agent を入れるなら、人間と AI の両方が同じ管理境界の中で動くことになる。金融や製造では、ソースコードだけでなく、設計書、試験結果、障害ログ、脆弱性情報も機密である。agent がそれらを参照するなら、従来の開発環境統制と AI 利用統制を別々に設計するのは難しい。

この観点では、Ona の customer-controlled cloud という表現は重要だ。ただし、これを「すべて自社内で完結する」と短絡してはいけない。OpenAI は intelligence と orchestration を提供する。企業側は、どのデータがどこへ送られるか、どの処理がどの境界で行われるか、ログと成果物がどこに残るか、契約上のデータ利用条件がどうなるかを確認する必要がある。

## 導入前の設計論点

第一に、agent identity を分ける。人間ユーザーの token を流用せず、用途別の agent identity を設計する。repository read、branch 作成、PR 作成、CI 実行、ticket コメント、deploy 操作を分け、必要な操作だけ許可する。

第二に、credential scope を短くする。長時間実行だからこそ、長寿命の広い secret を渡さない。作業単位の短命 credential、環境単位の secret injection、権限昇格時の approval、secret 使用ログを組み合わせる。Ona が scoped credentials を強調しているのは、この点が enterprise agent の前提になるからだ。

第三に、実行環境を再現可能にする。agent が一度だけ成功する環境ではなく、人間 reviewer や CI が同じ結果を再現できる環境にする。base image、依存関係、テストデータ、外部 API mock、network access、環境変数を管理しなければ、agent の変更をレビューできない。

第四に、監査ログを成果物と同じくらい重視する。どの prompt で開始し、どの repository と document を読み、どの command を実行し、どの file を変更し、どの test を通し、どこで人間が判断したかを残す。監査ログがなければ、AI で短縮した作業は、規制・品質・委託管理の説明で詰まる。

第五に、費用と停止条件を設計する。長時間実行は、モデル費用、クラウド実行費用、CI、外部 API、ストレージ、ログを消費する。[OpenAI Codex支出管理](/blog/openai-codex-business-spend-controls-2026/) で見たように、Business workspace の credit や上限設定だけでなく、作業タイプごとの予算、時間上限、再試行上限、失敗時の人間確認を決める必要がある。

第六に、レビュー責任を明文化する。agent が作った PR を誰が見るのか、セキュリティ修正を誰が承認するのか、仕様変更を誰が判断するのか、失敗した場合に誰が巻き戻すのか。長時間実行の価値は、人間を完全に外すことではなく、人間がより高い判断へ集中できることにある。レビュー責任が曖昧なら、その価値はリスクへ反転する。

## 調達・基盤戦略への影響

Ona 買収は、OpenAI の Codex enterprise strategy の中で見るべきだ。Codex はすでに、Business workspace の seat と credit、Oracle Cloud 経由のモデル・Codex アクセス、Dell 連携、Codex Security、role plugin や Sites など、企業導入の部品を増やしている。今回の Ona は、その中でも execution layer を補う動きである。

日本企業の調達では、ここが重要になる。AI coding tool を単体で比較するだけなら、月額、モデル、IDE 対応、PR 生成品質を見る。しかし enterprise agent として比較するなら、実行環境、ID 連携、監査、データ境界、クラウド調達経路、既存契約との整合、SIer との役割分担まで見る必要がある。

[OpenAI CodexのOracle Cloud調達](/blog/openai-codex-oracle-cloud-commitment-2026/) は、既存クラウドコミットや marketplace 経由の購買を Codex 導入にどう使うかという論点だった。Ona 買収は、購買後に実際の仕事をどの環境で走らせるかという論点を強める。調達と実行基盤を別々に決めると、契約は通ったが現場では安全に動かせない、または現場では便利だが監査に耐えない、というずれが起きる。

## まとめ

OpenAI の Ona 買収は、Codex を短時間のコード補助から、企業の管理されたクラウド環境で長時間作業する agent へ進める発表である。事実としては、買収は完了条件と規制承認の対象であり、完了後に Ona チームが Codex チームへ加わる。OpenAI と Ona の説明から見える焦点は、persistent environment、customer-controlled execution、scoped credentials、audit trails、review workflow、runtime AI security である。

日本企業にとっての実務的な問いは、Codex がどれだけ賢くなるかだけではない。agent をどの cloud environment に置くか、どの ID で動かすか、何を読ませるか、何を書かせるか、どのログを残すか、どこで人間へ戻すか、どの予算で止めるかである。

長時間実行は、AI 開発の生産性を大きく上げる可能性がある。一方で、開発基盤、セキュリティ、FinOps、監査、レビュー責任をまとめて設計しないと、本番導入では詰まりやすい。Ona 買収は、Codex 導入を「ツール選定」から「AI 作業者の実行基盤設計」へ引き上げる合図として読むべきだ。

## 出典

- [OpenAI to acquire Ona](https://openai.com/index/openai-to-acquire-ona/) - OpenAI
- [Ona is joining OpenAI](https://ona.com/stories/ona-joins-openai) - Ona
