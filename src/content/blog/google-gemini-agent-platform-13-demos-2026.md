---
title: 'Gemini Agent Platform 13 demos、本番導入設計'
description: 'Gemini Agent Platformの13 demosを整理。日本企業がPoC後のagent開発をADK、Agents CLI、Agent Gateway、評価flywheel、監査ログで本番化する手順を解説する。'
pubDate: '2026-07-19'
category: 'news'
tags: ['Google', 'Gemini API', 'AIエージェント', '開発者ツール', '開発基盤', 'ガバナンス']
series: 'google-gemini-api-agent-platform-2026'
draft: false
---

Google Cloud は **2026年7月18日**、Gemini Enterprise Agent Platform で agent を作るための **13本の hands-on demos** を公開した。今回の意味は、サンプルが増えたことだけではない。ADK で作る、Agent Runtime へ載せる、Agent Gateway で守る、評価 flywheel で改善する、という一連の本番導入ルートが見えるようになった点にある。

この流れは、以前の [Gemini API Managed Agentsで変わる開発基盤](/blog/google-gemini-api-managed-agents-2026/) とつながる。Managed Agents は agent の実行基盤を扱った。今回の 13 demos は、その上で開発チームがどの順番で agent を作り、どこで評価し、どこに統制を入れるかを具体化する。さらに [Conductor Plugin、Antigravityで仕様駆動AI開発へ](/blog/google-conductor-plugin-antigravity-sdd-2026/) で見たように、agent 開発はチャットの中だけで完結せず、仕様、計画、評価、deploy 設定を repository artifact として扱う方向へ進んでいる。

同じシリーズの [Google ADKとA2A、混在エージェント連携の実務](/blog/google-adk-a2a-cross-language-agents-2026/) は agent 間通信を扱った。今回の demos には A2A、MCP、Agent Gateway、Agent Runtime、評価が並ぶため、日本の開発チームは「便利な AI agent を作る」ではなく、「本番業務に入れてよい agent の条件」を洗い直す必要がある。

## 事実: 13 demosはBuild、Scale、Govern、Optimizeで構成される

Google Cloud の記事では、13本の demos が大きく **Build AI agents**、**Scale AI agents**、**Govern AI agents**、**Optimize AI agents** に分けられている。Build では ADK の基礎、human-in-the-loop の承認 agent、MCP、Agent-to-UI を扱う。Scale では Agent Runtime、長時間動く agent、Cloud Run 上の管理画面、Cloud Trace や BigQuery Agent Analytics まで含む deploy を扱う。

Govern では、secure agentic coding と Agent Gateway が中心になる。前者は TDD、STRIDE threat model、Semgrep hook、危険な tool use を止める gate を含む。後者は、Agent Runtime 上の agent が MCP servers や内部 API へ出ていく通信を、Agent Identity、IAP、IAM、mTLS、Model Armor で統制する構成である。

Optimize では、agent の品質改善を場当たり的な prompt 調整にしないための evaluation flywheel が示されている。評価データを準備し、agent を走らせ、AutoRaters や custom metrics で採点し、失敗を分析し、改善を反復する流れだ。これは [Google Jules評価、プロアクティブAI開発の現実解](/blog/google-jules-proactive-coding-agent-eval-2026/) で扱った「agent の成果をどう測るか」という論点を、企業 agent 開発全体へ広げるものと読める。

## 事実: Agents CLIはcoding agentにADKの作法を持ち込む

Google の Agents CLI docs によると、Agents CLI は Google Cloud 上で AI agents を build、evaluate、deploy するための CLI と skills package である。ADK で agent を作る部分だけでなく、scaffolding、evaluation、deployment、observability を扱う。特徴的なのは、Antigravity CLI、Claude Code、Codex などの coding agent に skills を入れて使う前提が明記されている点だ。

これは日本の開発現場にとってかなり重要である。これまで agent platform の導入は、platform engineer が IaC と SDK を読み、アプリ開発者が別のサンプルを試し、AI 活用推進チームが別の PoC を作る形で分裂しがちだった。Agents CLI は、その分裂を「coding agent が platform の作法を知っている状態」へ寄せる。もちろん、それだけで本番品質になるわけではないが、開発者が最初から deploy、eval、observability を見ながら agent を作る入口になる。

Google Cloud の記事では、Agents CLI を好みの coding agent に入れると、ADK と Agent Platform に詳しい skills が使えるようになり、scaffold、evaluate、deploy、monitor を editor から進められると説明されている。つまり今回の demos は、ブラウザで読む教材というより、coding agent に作業手順を渡すための運用パッケージに近い。

## 分析: 日本企業の課題はPoC後の本番化にある

日本企業で AI agent の PoC が進まない理由は、モデル性能だけではない。むしろ、PoC が動いた後に「誰の権限で tool を呼ぶのか」「顧客情報を外へ出さないか」「prompt injection をどう止めるか」「失敗した agent をどう検知するか」「監査ログをどこで見るか」が詰まりやすい。

今回の demos は、この詰まりを分解している。たとえば expense agent の例では、金額しきい値、PII redaction、prompt-injection defense、Gemini による compliance analysis、人間レビュー、Pub/Sub、FastAPI、LLM-as-judge eval が並ぶ。これは単なる経費精算デモではなく、業務 agent を承認フローへ入れるときの標準部品を見せている。

Agent Gateway codelab も同じだ。Agent Gateway は agent の ingress と egress を管理するネットワーク・ガバナンス層として説明され、Agent Registry、Agent Identity、IAP、IAM、Model Armor と連携する。日本の情シスが見るべきなのは、どの API を呼べるかをアプリコード内の if 文で守るのではなく、agent identity と centralized governance で制御する発想である。

[Gemini Enterprise Parallel Web Search grounding](/blog/google-gemini-parallel-web-search-grounding-2026/) では、外部 Web を agent の grounding provider として扱うときの統制を見た。今回の Agent Gateway と評価 flywheel は、その外部情報や内部 tool を使う agent を、本番ネットワークと監査の中へ入れるための次の層である。

## 導入手順: 1つの業務agentで全体を小さく試す

最初にやるべきことは、13 demos を全部消化することではない。1つの低リスクな業務 agent を選び、Build、Scale、Govern、Optimize のうち欠けている層を確認することだ。たとえば社内 FAQ、経費申請の一次チェック、営業資料の分類、障害調査のログ要約など、結果を人間が確認できる業務から始める。

第一段階では ADK と Agents CLI で agent の構造を作る。ここでは、prompt や tool を直接増やす前に、仕様、評価ケース、失敗時の fallback、禁止 tool、出力責任者を repository に置く。Conductor Plugin のように `spec.md` や `plan.md` を残す考え方と相性がよい。

第二段階では Agent Runtime や Cloud Run に載せ、ログ、trace、session、human-in-the-loop の状態を確認する。PoC でありがちな「手元では動くが、再開できない」「誰が承認待ちか分からない」「費用と実行回数が追えない」をここで潰す。

第三段階では Agent Gateway と Model Armor を検討する。すべての agent に最初から最大構成を入れる必要はないが、顧客情報、社内 API、財務、個人情報、契約書、ソースコードを読む agent では、identity-based access と content screening を後付けにしないほうがよい。

第四段階では評価 flywheel を入れる。Google Developers Blog の品質 flywheel 記事は、評価者と改善者を分けることを強調している。coding agent や optimizer が修正案を出しても、採点は独立した評価サービスで行う。これは日本企業のレビュー文化にも合う。AI が自己採点して合格にする運用では、監査にも改善にも弱い。

## まとめ: agent platform選定は運用ライフサイクル比較になる

今回の 13 demos は、Gemini Enterprise Agent Platform が単に agent を作る SDK ではなく、開発、deploy、governance、observability、evaluation を束ねる platform として見せたいことを示している。日本企業が読むべき論点は、Google Cloud を採用するかどうかだけではない。agent platform を選ぶときの比較軸が、モデル精度から運用ライフサイクルへ移っていることだ。

これからの agent 導入では、PoC の見栄えより、失敗を検知できるか、権限を絞れるか、ログを追えるか、人間確認を入れられるか、改善前後を比較できるかが重要になる。Gemini Agent Platform の 13 demos は、そのチェックリストとして使える。

## 出典

- [13 hands-on demos to build on Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/13-demos-on-gemini-enterprise-agent-platform) - Google Cloud Blog, 2026-07-18
- [Getting Started - agents-cli](https://google.github.io/agents-cli/guide/getting-started/) - Google
- [Governing agentic workloads with Agent Gateway on Gemini Enterprise Agent Platform](https://codelabs.developers.google.com/cloudnet-agent-gateway) - Google Codelabs
- [Driving the Agent Quality Flywheel from Your Coding Agent](https://developers.googleblog.com/driving-the-agent-quality-flywheel-from-your-coding-agent/) - Google Developers Blog, 2026-06-30
