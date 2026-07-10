---
article: 'github-copilot-gpt-56-model-policy-2026'
level: 'expert'
---

GitHub Copilot に **GPT-5.6 Sol、Terra、Luna** が入る更新は、単なる model picker の拡張ではない。OpenAI 側の一般提供は [GPT-5.6一般提供、WorkとAPI移行の実務チェック](/blog/openai-gpt-56-ga-work-codex-api-2026/) で扱った通り、ChatGPT Work、Codex、API、Programmatic Tool Calling、Multi-agent、価格、安全評価まで含む大きなリリースだった。

Copilot 側で見るべき問いは別である。**このモデル群を、GitHub の開発ワークフロー上で誰に、どの surface に、どの policy と budget で出すか**だ。Business/Enterprise では GPT-5.6 models policy が既定オフであるため、管理者の判断が運用開始点になる。

## 事実: Copilot内のGPT-5.6は3階層で展開される

GitHub Changelog は、GPT-5.6 family が Copilot に rolling out すると説明している。モデルは Sol、Terra、Luna の3種類だ。Sol は最も高い reasoning ceiling を持ち、大規模コードベースや demanding long-running agentic work 向けとされる。Terra は balanced default で、日常的な interactive / agentic coding に向く。Luna は lightweight and cost-efficient な variant で、小さく速いタスク向けだ。

この分類は、Copilot 管理者にとってそのまま初期ルーティング仮説になる。重い設計判断、複数リポジトリ調査、セキュリティ影響の大きい修正案、長時間の cloud agent work は Sol の候補になる。一方、通常の実装相談や PR 周辺の説明は Terra で十分かもしれない。短い変換、分類、低リスクな説明、ログの一次要約は Luna から始める価値がある。

ただし、これは公式の位置づけであって、自社評価ではない。日本企業が本番導入するなら、代表タスクを固定し、Sol、Terra、Luna、既存標準モデル、Auto model selection を同じ条件で比較する必要がある。評価軸は、成功率、レビュー修正量、CI通過率、再試行回数、生成差分の採用率、AI Credits 消費、p95 latency まで入れるべきだ。

## SKUとsurfaceを分けて読む

対象SKUはモデルごとに違う。GitHub の発表では、Sol は Copilot Pro+、Max、Business、Enterprise に提供される。Terra と Luna は Pro、Pro+、Max、Business、Enterprise に提供される。Pro 利用者が Terra/Luna を見られても Sol は見えない、という差が起こり得る。

surface も広い。GitHub は Visual Studio Code、Visual Studio、Copilot CLI、GitHub Copilot cloud agent、GitHub Copilot app、github.com、GitHub Mobile iOS/Android、JetBrains、Xcode、Eclipse を列挙している。これは「VS Code の chat model が増えた」より大きい。開発者のIDE、CLIでの調査、cloud agent のPR作成、GitHub.com上のレビュー、mobileでの確認まで、同じモデル群が複数の入口に現れる可能性がある。

ここで事故になりやすいのは、発表と現場の見え方の差だ。GitHub は gradual rollout と明記している。したがって、管理者は「GPT-5.6を許可したのに表示されない」問い合わせに備え、契約SKU、管理者ポリシー、client version、surface、ロールアウト状態を分けた切り分け表を持つべきである。

これは [GitHub Copilot Webモデル削減で管理者が見る点](/blog/github-copilot-web-models-limited-2026/) と同じ構造だ。Copilot のモデル可用性は、単一の全社仕様ではなく、利用面ごとに変わる。モデル追加のときも、モデル削減のときも、管理者が説明すべき構造は同じである。

## Business/Enterprise policyは導入ゲートになる

今回の最重要点は、Business/Enterprise の管理者が GPT-5.6 models policy を Copilot settings で有効化する必要があり、その policy が既定オフであることだ。

これは単なる設定項目ではない。企業の AI ガバナンスにおける change gate である。新しい frontier model が出たとき、全社で自動的に使える設計では、費用、品質、監査、利用教育、問い合わせ対応が後追いになる。既定オフなら、PoC、限定解禁、対象チーム、対象surface、測定項目を先に決められる。

実務では、組織ポリシーを有効化する前に3つの準備が必要だ。

第一に、対象者を限定する。AI CoE、platform engineering、SRE、主要プロダクトの tech lead、開発生産性チームなど、利用結果を測定し、社内ルールに戻せる人へ先に配る。全員解禁は、費用対効果が見えてからでよい。

第二に、対象surfaceを限定する。たとえば最初は VS Code と Copilot CLI、cloud agent だけにする。GitHub Mobile や Copilot app まで同時に見ると、問い合わせ、端末管理、利用ログ、レビュー線が広がりすぎる。

第三に、対象タスクを限定する。大規模リファクタの影響調査、CI失敗の原因分析、複数ファイルの修正案、設計レビュー補助、テスト追加計画など、強いモデルの価値が出やすく、人間レビューで確認できるタスクを選ぶ。短い補完や雑な質問まで Sol に流すと、費用対効果を説明しにくい。

## 料金は「席」ではなく「仕事単位」で見る

GitHub は、今回のモデルが Usage Based Billing のもとで provider list pricing に基づくと説明している。つまり、Copilot の費用は座席数だけでは閉じない。

[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で整理した通り、Copilot はすでに seat management だけでなく AI Credits、premium requests、cost center、budget の運用へ移っている。GPT-5.6 のようなモデルを足すと、費用説明はさらにタスク単位になる。

日本企業では、部門別、プロジェクト別、子会社別、委託先別に費用を説明する場面が多い。Sol を使った高難度調査が1回で大きな効果を出すこともあれば、Luna の大量処理が小さなコストで日常作業を減らすこともある。逆に、Terra や Sol を軽い質問に使い続ければ、体感の便利さに対して予算説明が弱くなる。

したがって、初期導入ではモデル別の消費だけでなく、作業分類を一緒に記録するべきだ。たとえば、incident triage、test generation、PR review support、large refactor planning、repository explanation、documentation draft のように分類し、モデル、surface、所要時間、レビュー結果、採用可否を残す。AI Credits の数字だけを見ても、何に効いたのかは分からない。

## モデル強化と権限強化を混同しない

GPT-5.6 Sol は強い agentic coding model として説明されている。OpenAI の発表でも、複雑なコマンドライン作業、長期的な engineering task、tool-heavy task の効率が強調されている。だが、モデルが強くなることと、実行権限を広げることは別である。

Copilot cloud agent や CLI では、リポジトリ、Issue、PR、ローカル環境、外部ツール、MCP、custom agent、hooks などが絡む。強いモデルに広い権限を与えると、早く良い結果を出せる可能性がある一方で、未依頼変更、外部通信、秘密情報の露出、不要な依存追加、テスト削除、設計方針からの逸脱も起こり得る。

そのため、Sol を許可する前に、branch protection、required status checks、CODEOWNERS、content exclusion、secret scanning、agent settings、MCP allowlist、network settings を確認する必要がある。モデルポリシーだけをオンにしても、開発統制は完成しない。

これは [Gemini 3.5 FlashがCopilotにGA、14倍課金の論点](/blog/github-copilot-gemini-35-flash-ga-2026/) で扱った高倍率モデルの管理とも、[Copilot MAI-Code-1-Flash、IDE横断運用の実務](/blog/github-copilot-mai-code-flash-surfaces-2026/) で扱った軽量モデルの配置とも同じだ。モデル追加のたびに見るべきなのは、性能、費用、権限、レビューの組み合わせである。

## 導入チェックリスト

最初のチェックは、既存の Copilot モデル運用表を更新することだ。現在の標準モデル、Auto model selection の扱い、高難度タスクの明示モデル、禁止モデル、例外申請、対象surfaceを一覧にする。そこへ Sol、Terra、Luna を仮配置する。

次に、Business/Enterprise policy の変更手順を決める。誰が承認し、どの組織またはチームで有効化し、いつ見直し、どのメトリクスで継続判断するかを決める。モデルポリシーは一度オンにしたら終わりではない。モデルの品質、価格、可用性、社内利用状況で見直す運用資産である。

三つ目は、client readiness の確認だ。VS Code、JetBrains、Visual Studio、Xcode、Eclipse、Copilot CLI、Copilot app、GitHub Mobile で、標準バージョン、利用可否、社内配布状況を確認する。MDM や managed settings を使っている組織では、現場の設定変更でモデルを勝手に選べないようになっているかも見る。

四つ目は、費用観測だ。cost center、budget、AI Credits、usage metrics を確認し、検証対象チームの基準値を取る。解禁後に増えた消費だけを責めるのではなく、レビュー時間、調査時間、CI修正時間、PRサイクル短縮と並べて見る。高性能モデルの価値は、単価ではなく、仕事がどれだけ短く、正確に、レビュー可能に終わるかで判断する。

五つ目は、利用者向けFAQだ。最低限、どのモデルが何向きか、なぜ見えない場合があるか、いつ Sol を使うべきか、どの作業では人間承認が必要か、費用に関する注意点を短く書く。長いガバナンス文書より、モデル選択時に読める短い判断表のほうが効く。

## 日本企業への結論

GitHub Copilot への GPT-5.6 追加は、OpenAI の一般提供を GitHub の開発面へ接続する更新である。日本企業にとって重要なのは、Sol が最強かどうかではない。Copilot の複数surfaceに新しいモデル階層が入ることで、モデル選択、費用、権限、レビュー、問い合わせ対応が変わる点だ。

最初の方針は保守的でよい。GPT-5.6 policy を全社オンにせず、検証チーム、対象surface、対象タスクを決める。Sol、Terra、Luna を作業分類へ割り当てる。AI Credits とレビュー結果を測る。必要なら広げる。不要なら閉じる。

Copilot のモデル棚は今後も更新される。モデル名を追いかける運用ではなく、モデルが増減しても判断できる運用を作ることが、管理者にとっての本題である。

## 出典

- [OpenAI's GPT-5.6 Sol, Terra, and Luna are now available in GitHub Copilot](https://github.blog/changelog/2026-07-09-openais-gpt-5-6-sol-terra-and-luna-are-now-available-in-github-copilot/) - GitHub Changelog, 2026年7月9日
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) - GitHub Docs
- [GPT-5.6: Frontier intelligence that scales with your ambition](https://openai.com/index/gpt-5-6/) - OpenAI, 2026年7月9日
