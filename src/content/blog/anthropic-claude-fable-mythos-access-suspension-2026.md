---
title: 'Claude Fable停止、企業AI調達リスクを見直す実務'
description: 'Claude Fable停止を受け、AnthropicとGitHub Copilotの影響を整理。日本企業がモデル可用性、データ保持、代替運用、調達リスクをどう見直すか実務解説する。'
pubDate: '2026-06-13'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIガバナンス', '企業導入', 'サイバーセキュリティ', 'データレジデンシー']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は **2026年6月12日**、Claude Fable 5 と Claude Mythos 5 のアクセスを停止した。理由として、米国政府の指令に対応するため、外国籍の利用者や従業員を含むアクセスを止める必要があると説明している。Claude の Help Center でも同日、Fable 5 と Mythos 5 のアクセス停止が release notes に追記された。

これは単なる一時障害ではない。日本企業にとっては、最先端モデルを業務システム、開発基盤、GitHub Copilot、クラウドAI基盤へ組み込む時の「モデル可用性リスク」が表に出た事例である。前回の [Claude Fable 5 / Mythos 5導入設計](/blog/anthropic-claude-fable-mythos5-governance-2026/) では、1M context、128k output、30日保持、Project Glasswing 限定提供を扱った。今回の焦点は、その直後にモデルアクセスそのものが変わった時、企業がどう止血するかである。

同じ流れは [Project Glasswing拡大](/blog/anthropic-project-glasswing-expansion-critical-infra-2026/) ともつながる。高いサイバー能力を持つモデルは、防御側には価値がある一方、提供対象やアクセス条件が政策・安全保障・契約条件で変わる可能性がある。さらに [Claude containmentと安全境界](/blog/anthropic-claude-containment-agent-security-2026/) で見たように、強いモデルほど利用範囲、ログ、認証情報、実行権限を先に決めておく必要がある。

## 事実: AnthropicはFable 5とMythos 5を停止した

Anthropic の声明は、米国政府の export control directive により、Fable 5 と Mythos 5 へのアクセスを停止する必要があると説明している。影響対象は、米国外の利用者だけに限られない。声明では、米国内外を問わず外国籍者へのアクセスも対象になるため、コンプライアンス確保のため顧客向け提供を急きょ止めるとされている。

Claude Help Center の release notes も、2026年6月12日の項目で Fable 5 と Mythos 5 のアクセス停止を案内している。あわせて、6月9日の launch 項目も残っている。つまり、発表から数日で「一般提供・限定提供」から「アクセス停止」へ状態が変わったことになる。

6月9日の発表では、Fable 5 は Anthropic の widely released model として、Claude API、Claude Platform on AWS、Amazon Bedrock、Vertex AI、Microsoft Foundry で利用できるとされていた。Mythos 5 は Project Glasswing の承認済み参加者向けに限定提供されるモデルだった。どちらも 1M token context window、128k max output tokens、always-on adaptive thinking を前提にした高能力モデルとして位置づけられていた。

この時系列が重要だ。企業が「公開された最新モデルを評価して、来月から業務に入れる」と判断しても、モデルの提供条件が数日で変わることがある。特に frontier model、サイバー能力が高いモデル、政府・重要インフラ・安全保障に近いモデルでは、可用性は単なるクラウドSLAだけでは測れない。

## 事実: GitHub Copilotにも波及した

GitHub は6月9日、Claude Fable 5 を GitHub Copilot で一般提供すると発表していた。対象には、Visual Studio Code、Visual Studio、Copilot CLI、Copilot cloud agent、GitHub Copilot app、github.com、GitHub Mobile、JetBrains、Xcode、Eclipse が含まれていた。Copilot Business と Enterprise では、管理者が Fable 5 policy を有効にする必要があり、Fable 5 では Anthropic 側の安全分類器運用のため30日保持が必要だとも説明されていた。

その後、GitHub の同記事には 2026年6月12日の editor's note が追記され、Anthropic の発表を受けて GitHub Copilot 全体で Claude Fable 5 へのアクセスを停止したと説明された。ほかの Claude モデル、たとえば Claude Opus 4.8、Sonnet 4.6、Haiku 4.5 は影響を受けないとされている。

ここで日本の開発組織が見るべきなのは、Copilot の画面に出るモデル名だけではない。組織が承認したモデルが、外部ベンダーの発表、政策、契約条件、データ保持条件によって使えなくなる可能性である。以前扱った [Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) でも、モデル選択や実行経路が動的になるほど、説明責任と代替運用が重要になることを見た。

開発現場では、IDE、CLI、Web、cloud agent のどこでどのモデルが使われるかを一枚の台帳で見る必要がある。Copilot で Fable 5 を使う予定だったチームは、単に「別のモデルを選ぶ」だけでなく、同じ作業が Opus 4.8 や Sonnet 系で再現できるか、PRレビューや長時間エージェント作業の評価をやり直すべきである。

## 分析: モデルは固定部品ではなく外部依存である

ここからは分析だ。

今回の停止は、AIモデルをソフトウェアの固定部品として扱う危うさを示している。企業はライブラリ、SaaS、クラウドリージョン、決済API、認証基盤については、停止や仕様変更を前提にした運用を考える。一方、LLMについては「このモデルを採用する」と決めた瞬間に、安定した部品のように扱いがちである。

しかし、frontier model は外部依存である。モデル名、提供地域、提供経路、保持条件、利用規約、安全分類器、拒否挙動、価格、rate limit、利用対象国、対象ユーザーは変わりうる。しかも、単純な version upgrade ではなく、突然の提供停止や一部利用者の制限として現れることがある。

日本企業が本番業務にAIを入れるなら、モデル選定表には性能だけでなく可用性リスクを入れるべきだ。たとえば、代替モデル、代替プロバイダー、ZDR可否、データ保持期間、利用可能リージョン、社内承認済み用途、禁止データ、fallback時の品質差、監査ログの取り方を並べる。これはSREやBCPの話であり、AI活用推進だけの話ではない。

特に重要なのは、業務の依存度を分けることだ。AIが止まっても人手で処理できる業務、数時間なら待てる業務、開発リリースや障害対応に直結する業務、セキュリティ運用に関わる業務では、許容停止時間が違う。Fable 5 のような高能力モデルを使うほど、そのモデルにしかできない作業を増やしすぎない設計が必要になる。

## 分析: 30日保持とZDRは代替モデル表に入れる

Fable 5 は、Claude API では30日 data retention を必要とし、zero data retention では使えないと Anthropic Docs が説明している。GitHub Copilot の Fable 5 発表でも、管理者が policy を有効にする必要があり、Anthropic が安全分類器を運用するため prompts と outputs を最大30日保持する条件が説明されていた。

この条件は、モデル停止とは別に重要である。代替モデルを選ぶ時、単に「Fable 5 が止まったから Opus 4.8 に戻す」と考えるだけでは足りない。Fable 5 で許容していた30日保持が、別モデルではどうなるのか。逆に、ZDRが必要な業務では最初から Fable 5 を選べないのか。Copilot 経由、Claude API直、Bedrock、Vertex AI、Microsoft Foundry で保持条件が違うのか。こうした点を同じ表に置く必要がある。

日本企業では、顧客コード、個人情報、医療・金融・公共データ、未公開契約、M&A情報、研究開発情報を扱うことがある。これらをAIに投入する場合、モデルの性能より先に、入力してよいデータ種別を分けるべきである。30日保持が許容できるデータ、匿名化すれば許容できるデータ、ZDRや閉域処理が必要なデータを分けないと、緊急時に代替モデルへ切り替えられない。

## 導入チームが今すぐ確認すること

第一に、Fable 5 または Mythos 5 を評価・PoC・本番に入れていたかを確認する。Claude API、Bedrock、Vertex AI、Foundry、GitHub Copilot、IDE、CLI、cloud agent、社内AI gateway のどこで使っていたかを洗い出す。

第二に、モデル承認台帳を更新する。Fable 5 は停止中、Mythos 5 は限定提供かつ停止中、影響を受けない Claude モデルは何か、代替候補はどれかを明記する。台帳には model ID、provider、endpoint、region、保持条件、ZDR可否、承認用途、禁止用途を入れる。

第三に、評価セットを再実行する。Fable 5 前提でコーディング、レビュー、セキュリティ調査、長文分析、RAG、エージェント作業を評価していた場合、Opus 4.8、Sonnet 4.6、既存標準モデルで同じ評価を走らせる。精度だけでなく、token消費、拒否、実行時間、レビュー修正量を見る。

第四に、利用者への説明を分ける。開発者には、どのツールでどのモデルが使えないのか、代わりに何を選ぶのかを伝える。情シス・法務・調達には、データ保持、契約条件、規制リスク、代替モデルの承認状態を伝える。経営層には、AI活用が止まったのではなく、特定モデル依存を下げる運用へ切り替える必要があると説明する。

第五に、AI依存の障害訓練を入れる。月1回でもよいので、主要モデルが使えない前提で、開発、問い合わせ対応、セキュリティレビュー、文書作成がどこまで回るか確認する。生成AIを本番の業務基盤にするなら、モデル停止はクラウド障害やSaaS障害と同じく訓練対象である。

## まとめ

Claude Fable 5 / Mythos 5 のアクセス停止は、Anthropic だけの出来事ではない。GitHub Copilot へも波及したことで、企業が承認したAIモデルが、別の製品や開発基盤の中で突然使えなくなる可能性が見えた。

日本企業が取るべき対応は、最新モデル採用を止めることではない。モデルを外部依存として扱い、代替モデル、保持条件、ZDR、クラウド経路、拒否挙動、利用者説明、評価セットを準備することである。Fable 5 が再開するかどうかにかかわらず、この事例はAI調達の管理表を一段細かくする理由になる。

## 出典

- [Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access) - Anthropic, 2026-06-12
- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) - Claude Help Center, 2026-06-12
- [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) - Anthropic, 2026-06-09
- [Claude Fable 5 is generally available for GitHub Copilot](https://github.blog/changelog/2026-06-09-claude-fable-5-is-generally-available-for-github-copilot/) - GitHub Changelog, 2026-06-09
- [Claude Platform release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs
