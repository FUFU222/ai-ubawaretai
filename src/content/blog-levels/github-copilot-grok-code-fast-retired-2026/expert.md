---
article: 'github-copilot-grok-code-fast-retired-2026'
level: 'expert'
---

GitHub Copilotの **Grok Code Fast 1廃止** は、表面上は短いChangelogだ。しかし実務では、Copilotを多モデル運用する組織にとって、モデル固定、Auto model selection、管理者ポリシー、AI Credits移行をまとめて点検するシグナルになる。

GitHubは **2026年5月15日**、Grok Code Fast 1をCopilot Chat、inline edits、ask mode、agent mode、code completionsを含むすべてのCopilot体験から廃止した。代替は **GPT-5 mini** と **Claude Haiku 4.5**。ここだけ見ると軽量モデルの置換だが、[GitHub CopilotでGPT-5.2廃止へ。日本チームの6月移行点検](/blog/github-copilot-gpt-52-codex-retirement-2026/) や [Copilot使用量レポート、6月のAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/) と並べると、GitHub Copilotのモデルライフサイクルがかなり短くなっていることが分かる。

この変化は、日本企業の開発基盤チームには重い。なぜなら、現場は「速いモデルが使えない」ことに困り、管理者は「どの代替モデルを許可するか」に困り、購買や情シスは「6月以降のAI Creditsをどう読めばよいか」に困るからだ。今回の廃止は、ひとつのモデル名ではなく、**モデルを前提にした運用設計がどれだけ壊れやすいか** を示している。

## 事実整理: Copilot全体からGrok Code Fast 1が外れた

GitHub Changelogの主張は明確だ。**2026年5月15日** に、Grok Code Fast 1はGitHub Copilotの全体験から廃止された。対象はCopilot Chatだけではない。inline edits、ask mode、agent mode、code completionsも含まれる。

この範囲が重要だ。もし対象がChatだけなら、影響は「モデル選択UIから1つ消えた」で済む。しかしagent modeやcode completionsまで含むなら、影響は日常作業、補完品質、テンプレート、社内ガイド、検証済みワークフローに広がる。とくにGrok Code Fast 1を「軽量・高速なコーディング用モデル」として使っていたチームは、同じ作業を別モデルで再評価する必要がある。

GitHubが示した代替は **GPT-5 mini / Claude Haiku 4.5** だ。GitHub Docsのsupported modelsでは、Grok Code Fast 1はretirement historyに移され、退役日は **2026-05-15** とされている。さらに同Docsでは、Copilotで使えるモデルがプラン、クライアント、モード、組織ポリシーによって変わることが説明されている。つまり、今回の廃止を「全員が同じ代替へ自動移行する」と読むのは危ない。

## xAIの退役仕様をCopilotに持ち込まない

背景にはxAI側のモデル退役がある。xAI docsは、2026年5月15日 12:00 PM PT以降、`grok-code-fast-1` を含む複数の旧モデルを退役させると説明している。xAI APIでは、退役したモデルslugへのリクエストが `grok-4.3` へリダイレクトされ、価格もGrok 4.3の体系になると案内されている。

ここで混乱しやすいのは、xAI APIの移行とGitHub Copilotの移行を同じものとして扱うことだ。xAI APIを直接呼ぶアプリでは、`model` フィールドの変更、リダイレクト後の価格、reasoning effortの指定が論点になる。一方、GitHub Copilotでは、GitHubが提供するモデル集合、Copilotのクライアント、組織のmodel policy、ユーザーのmodel pickerが論点になる。

この差は、実務でかなり効く。たとえば社内に、xAI APIを使う検証チームと、GitHub Copilot Enterpriseを使う開発チームが並存している場合、前者は `grok-4.3` への移行設計を考える必要があるが、後者はGPT-5 miniとClaude Haiku 4.5をCopilot上で許可・評価する必要がある。どちらもGrok Code Fast 1の退役に由来するが、チェックリストは別物だ。

## 固定モデル運用のリスクが表に出た

今回の廃止で一番危ないのは、モデル名を直接固定している運用だ。

固定は必ずしも悪いわけではない。開発組織では、レビュー品質を安定させたい、コストを読みたい、研修資料を簡単にしたい、サポート問い合わせを減らしたい、といった理由で推奨モデルを決めることがある。Grok Code Fast 1のように速さが売りのモデルは、軽いagent作業や補完寄りの運用で標準候補になりやすい。

しかし、モデルの廃止が短い告知で起きると、固定は一気に負債になる。手順書に残ったモデル名、社内チャットの定型回答、VS Codeの推奨設定、オンボーディング資料、研修動画、運用FAQが同時に古くなる。さらに、[GitHub Copilot Memory、個人設定をどう管理するか](/blog/github-copilot-memory-user-preferences-2026/) で見たように、個人preferencesやmemoryが増えるほど、ユーザーは「自分用に調整したCopilot」を前提にしやすい。モデルが変わると、その前提も揺れる。

ここで必要なのは、モデル名をなくすことではなく、**モデル名の寿命を前提にした運用** だ。社内ガイドには、推奨モデルだけでなく、廃止時の代替基準を書くべきだ。たとえば、軽量な日常作業はGPT-5 mini、説明や日本語レビューはClaude Haiku 4.5、難しい設計や深い調査は別の上位モデル、というように役割で書く。モデル名だけを書くより、次の廃止時に更新しやすい。

## model policyは「廃止後に見る」では遅い

GitHub Changelogは、Copilot Enterprise管理者が代替モデルへのアクセスをmodel policyで有効化する必要がある場合がある、と案内している。この一文は、企業導入ではかなり重要だ。

個人利用なら、モデルが使えるかどうかは本人のプランとUIでほぼ判断できる。しかしBusiness / Enterpriseでは違う。管理者がモデルを許可していなければ、ユーザーは代替モデルを選べない。Auto model selectionも組織ポリシーの影響を受ける。つまり、現場が「代替はGPT-5 miniかClaude Haiku 4.5」と理解していても、管理者設定が追いつかないと実際には使えない。

日本企業では、この遅れが起きやすい。開発部門はChangelogを読み、すぐに代替を試したい。情シスやプラットフォームチームは、データ管理、コスト、契約、監査ログ、社内規程を確認したい。購買は6月以降のAI Creditsや追加利用を気にする。どれも正しいが、5月15日に廃止されたモデルをめぐってこれを後追いで始めると、利用者の困りごとが先に出る。

したがって、model policyの確認は廃止後の問い合わせ対応ではなく、定期点検に入れるべきだ。月1回でもよいので、supported models、retirement history、organization policy、社内推奨モデルの4点を合わせて見る。これは地味だが、Copilotが開発基盤になるほど重要になる。

## AI Credits移行前の軽量モデル戦略

Grok Code Fast 1の廃止は、6月のAI Credits移行とも重なる。これが今回の実務価値を大きくしている。

Copilotの利用がseat中心だった時代は、モデル選択の議論は主に品質の話だった。どれが賢いか、どれが速いか、どれが日本語をうまく扱うか。もちろん今も品質は重要だが、AI Credits前提では、モデル選択は予算設計の一部になる。軽量モデルを標準にするか、高性能モデルを許可するか、agent実行にどのモデルを使わせるかで、利用枠の消費が変わる。

Grok Code Fast 1を「速く安い標準」として扱っていたチームは、ここで代替を明確にする必要がある。GPT-5 miniは軽量な標準候補になりやすい。Claude Haiku 4.5は、説明や日本語のレビュー補助で評価する価値がある。ただし、どちらもGrok Code Fast 1の完全なコピーではない。比較すべきなのはベンチマークだけではなく、現場の定型作業だ。

評価タスクは、少なくとも次のように分けたい。

- 既存コードの短い説明
- 小さなバグ修正案
- テスト追加案
- PRレビューコメントの下書き
- 複数ファイル変更を伴うagent作業
- 日本語の設計メモ作成

これらを同じプロンプト、同じリポジトリ、同じ時間帯で比べる。速度、修正の粒度、不要な変更の少なさ、確認質問の出し方、社内ルールへの従いやすさを見る。AI Creditsの文脈では、1回の返答品質だけでなく、**何回やり直すと目的に届くか** が重要になる。

## agent/API連携ではモデル廃止が障害に近くなる

Grok Code Fast 1廃止は、UIで使うユーザーだけの話ではない。CopilotがagentやAPI連携へ広がるほど、モデル廃止は運用障害に近い扱いになる。

最近の [Copilot cloud agent API化、内製自動化の実装論点](/blog/github-copilot-cloud-agent-rest-api-2026/) でも整理したように、CopilotはGitHub上のタスク、内製ポータル、CLI、IDE、cloud agentをつなぐ方向へ進んでいる。そこでは、モデル選択がユーザーの気分ではなく、ワークフローの一部になる。特定モデルの速さや出力傾向を前提に、タスク分解、レビュー条件、再試行ルールを設計している場合、モデル廃止は成果物の質や処理時間に影響する。

もちろん、GitHub Copilotの公開APIや各クライアントがどこまでモデル固定を許すかは利用面によって異なる。しかし、内部ドキュメントや運用スクリプトがモデル名を前提にしているなら、廃止の影響は残る。たとえば、社内標準の「軽い修正はGrok、重い設計はGPT-5.5」という説明があれば、Grok廃止後に軽い修正の標準が空白になる。

ここは、SRE的に考えたほうがよい。モデルは外部依存であり、廃止、価格変更、可用性変更がある。したがって、社内のAI開発基盤には、推奨モデル、代替モデル、廃止時の確認項目、ユーザー向け告知テンプレートを持たせるべきだ。大げさに見えるが、Copilot利用者が数百人になると、この程度の運用設計がないほうが高くつく。

## 日本企業向けの実務チェックリスト

今回の廃止を受けて、実務では次の順で確認したい。

1つ目は、社内検索だ。`Grok Code Fast 1`、`Grok`、`grok-code-fast-1`、`Code Fast` を社内Wiki、README、研修資料、Slackのピン留め、GitHub issue templateで検索する。見つかった箇所は、モデル名だけでなく、なぜそのモデルを推奨したのかも確認する。

2つ目は、GitHub Copilotのmodel policy確認だ。GPT-5 miniとClaude Haiku 4.5が対象組織で許可されているか、Auto model selectionの制限により実際の候補から外れていないか、ユーザーに見えるmodel pickerで確認する。管理画面だけでなく、実際のVS Codeやgithub.comでも見るべきだ。

3つ目は、標準モデルの再定義だ。軽量な日常作業、agent作業、レビューコメント、設計相談、難しい調査を分ける。すべてを1モデルに寄せると、品質かコストのどちらかで無理が出る。AI Credits前提では、軽い作業を軽いモデルに逃がす設計が重要になる。

4つ目は、ユーザー向け告知だ。長い説明は不要だが、最低限、Grok Code Fast 1はCopilotで廃止済み、代替候補はGPT-5 miniとClaude Haiku 4.5、選べない場合は管理者設定を確認、という3点は出す。問い合わせ先も明記する。

5つ目は、1週間後の再評価だ。モデル切替直後は、ユーザーの不満が「前と違う」という感覚で出る。そこで即座に高性能モデルへ逃がすと、コストが読みにくくなる。まず軽量代替の設定、プロンプト、社内テンプレートを調整し、それでも難しいタスクだけ上位モデルへ寄せる。

## まとめ

GitHub CopilotのGrok Code Fast 1廃止は、短いChangelogに対して実務影響が大きい更新だ。事実としては、2026年5月15日にCopilot全体から廃止され、GitHubはGPT-5 miniとClaude Haiku 4.5を代替として案内した。xAI API側にも同日のモデル退役があるが、Copilot利用者はxAI APIのリダイレクト仕様ではなく、GitHub Copilotのmodel policyとsupported modelsを基準に見る必要がある。

分析としては、今回の本質はモデル廃止ではなく、**モデル固定運用の棚卸し** だ。社内ガイド、管理者設定、Auto model selection、AI Credits、agent/API連携がひとつの変更で同時に揺れる。日本の開発組織は、Grok Code Fast 1の代替を決めるだけでなく、次のモデル廃止にも耐える運用ルールを作るべきだ。

## 出典

- [Grok Code Fast 1 deprecated](https://github.blog/changelog/2026-05-15-grok-code-fast-1-deprecated/) - GitHub Changelog, 2026-05-15
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Grok Model Retirement on May 15, 2026](https://docs.x.ai/developers/migration/may-15-retirement) - xAI Docs
