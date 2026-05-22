---
article: 'github-copilot-web-models-limited-2026'
level: 'expert'
---

GitHub Copilot on webのモデル削減は、短いChangelogに見えるが、企業運用では軽く扱わないほうがよい。2026年5月20日のGitHub発表では、Copilot Chat on webからGemini 2.5 Pro、Gemini 2.5 Flash、GPT-5.2 Codex、GPT-5.4 nanoが外れる。一方で、GitHubはVS CodeやJetBrainsなど他のクライアントでは引き続き利用できる場合があると説明している。

この差分は、Copilotが単一のチャットUIではなく、複数のクライアント、複数の実行面、複数の課金単位を持つ開発AI基盤になったことを示している。最近の[Auto model selectionのVS Code対応](/blog/github-copilot-auto-model-selection-vscode-2026/)は、モデルを自動選択する方向の更新だった。[Gemini 3.5 FlashのGA](/blog/github-copilot-gemini-35-flash-ga-2026/)は、高倍率の外部モデルをCopilotに追加する更新だった。今回のWeb版モデル削減は、その反対側、つまりモデル可用性が面ごとに狭まるケースをどう運用するかという話だ。

## Fact: Copilot Chat on webのモデル棚が変わる

まず、事実を切り分ける。

GitHub Changelogの主語は、Copilot on webだ。削除対象はGemini 2.5 Pro、Gemini 2.5 Flash、GPT-5.2 Codex、GPT-5.4 nanoであり、発表はWeb版のCopilot Chatでの可用性変更として読める。GitHubは、これらのモデルが他のCopilotクライアントで利用できる場合があるとも示している。

この書き方は重要だ。Copilotのモデル可用性は、製品全体で一枚岩ではない。GitHub DocsのSupported AI modelsでは、モデルごとに利用可能なプラン、対応機能、管理者設定、クライアント差が関係する。さらに、企業プランでは管理者のmodel policy、データレジデンシー、FedRAMPのような制約も効く。

つまり、モデル可用性を判断するときの単位は「GitHub Copilotで使えるか」では粗すぎる。正しくは、どのサブスクリプションで、どの管理者ポリシーの下で、どのクライアントから、どの機能面で使うかを見る必要がある。Web版で外れたモデルを、IDE側の運用手順までまとめて削ると、逆に現場を混乱させる可能性がある。

## Analysis: モデル棚は外部依存の運用面になった

ここからは分析だ。

Copilotのモデル棚は、昔のIDE設定のような固定項目ではなくなっている。OpenAI系、Anthropic系、Google Gemini系、xAI系などが入り、モデルの追加、価格変更、退役、クライアント別可用性変更が起きる。以前の[Grok Code Fast 1廃止](/blog/github-copilot-grok-code-fast-retired-2026/)でも、モデル退役が社内ガイド、代替モデル、管理者設定に影響することを扱った。

今回の違いは、廃止というより面ごとの整理である点だ。Web版からは外れるが、他クライアントでは残る可能性がある。この状態は、企業の問い合わせ対応で最も誤解が起きやすい。「同じCopilotなのに、AさんのVS Codeには見える。BさんのGitHub.comには見えない。管理者設定なのか、契約なのか、障害なのか」という問い合わせになるからだ。

このとき、管理者がモデル名だけを覚えていても足りない。必要なのは、可用性の判定軸を運用手順にすることだ。順番としては、クライアント、機能面、プラン、管理者ポリシー、地域制約、GitHub側の最新Changelogを見る。これを社内FAQにしておけば、モデル棚変更のたびに個別調査を繰り返さずに済む。

## Web版削減はAuto model selectionと矛盾しない

一見すると、Auto model selectionが広がる一方でWeb版のモデルが減るのは矛盾して見える。しかし、むしろ同じ方向の整理と考えたほうがよい。

Auto model selectionは、全モデルを無制限に混ぜる仕組みではない。GitHubの説明では、Autoが選ぶモデルは利用可能モデル、管理者ポリシー、プラン、地域制約、multiplierなどに制約される。つまりAutoは、制約されたモデル集合の中で、タスクや可用性に応じて選ぶ。

Web版のモデル棚を絞ることは、Web版の標準利用面を安定させる意図と相性がある。GitHub.com上のCopilot Chatは、Issue、Pull Request、リポジトリ閲覧など、開発ワークフローの入口に近い。ここで高コストまたは用途特化のモデルが広く露出すると、利用者教育、費用説明、品質期待値の管理が難しくなる。

一方、VS CodeやJetBrainsのようなIDEでは、文脈の取り方、作業の重さ、コード編集の深さが異なる。高度なコード生成や複数ファイルの理解が必要な場面では、IDE側にモデル選択肢を残すほうが自然な場合がある。だから、Webで絞り、IDEで残すという設計は、クライアントごとの役割分担として読める。

## Cost: AI Credits時代にはクライアント差も見る

費用面では、今回の変更をAI Credits移行前の棚卸しに入れるべきだ。

GitHub DocsのRequests in GitHub Copilotは、Copilot Chat、Copilot CLI、cloud agentなどの利用がpremium requestやAI Creditsの管理対象になることを示している。モデルごとのmultiplierや、利用面ごとの消費を見なければ、6月以降の請求を説明しにくい。

すでに[Copilot使用量レポートによるAI Credits確認](/blog/github-copilot-ai-credits-usage-report-2026/)で整理したように、管理者は「誰が使ったか」だけでなく、「どのsurfaceで、どのモデルを、どの作業に使ったか」を見る必要がある。今回のWeb版モデル削減は、このsurface別分析をさらに重要にする。

たとえば、Web版でGemini 2.5 Flashを日常的に使っていたユーザーが、Web版の標準モデルへ移るなら、品質や消費の傾向が変わるかもしれない。逆に、Web版で使えないためにVS Codeへ移るなら、IDE側の利用量が増えるかもしれない。これは単純なモデル廃止ではなく、利用面の移動として観測すべきだ。

ただし、Changelogだけからコスト影響を断定するのは危険だ。GitHubは削除理由、利用量、代替モデルごとの消費差を細かく公開していない。企業側ができるのは、発表前後のusage report、問い合わせ、利用者アンケート、重要チームのモデル選択ログを合わせて見ることだ。

## Governance: 管理者が持つべきモデル台帳

今回のような変更に備えるなら、Copilot管理者は軽量なモデル台帳を持つべきだ。

台帳と言っても、大げさなデータベースである必要はない。最低限、モデル名、利用可能なクライアント、対象プラン、社内許可状態、想定用途、費用倍率、データ制約、最終確認日を持てばよい。GitHub Docsへのリンクと、社内での推奨ステータスを合わせる。

重要なのは、モデル一覧を「GitHubが提供しているもの」と「自社が推奨するもの」に分けることだ。GitHub側で利用可能でも、自社では高コスト、低評価、地域制約、監査上の理由で推奨しないモデルがある。逆に、Web版では利用できなくても、特定のIDE作業では推奨するモデルもありうる。

この台帳は、社内ドキュメント、管理者ポリシー、usage report、問い合わせ対応をつなぐ。モデルが消えたときは、台帳の最終確認日とChangelogを更新し、利用者向けの短い差分だけ出す。モデル追加時も同じ手順にすれば、毎回ゼロから説明を書き直さなくてよい。

## 日本企業での実装パターン

日本企業では、Copilot運用の責任が複数部門に分かれやすい。開発基盤チームはIDEやGitHub設定を見る。情シスは契約とアカウントを見る。セキュリティ部門はデータ取り扱いを見る。各事業部は費用配賦を見る。モデル棚の変更は、その全てに少しずつ影響する。

実装としては、次の4段階が現実的だ。

第一段階では、社内ガイドをクライアント別に分ける。Web版、VS Code、JetBrains、CLI、cloud agentを同じ表に押し込まず、主要な利用面ごとに「標準」「高難度」「利用非推奨」を書く。

第二段階では、管理者ポリシーを棚卸しする。Business/Enterpriseで許可しているモデルが、社内の推奨と一致しているかを見る。使わない高倍率モデルが許可されたままなら、6月以降の費用リスクになる。

第三段階では、usage reportでsurface別の変化を見る。Web版モデル削減のあと、Web版の利用が減ったのか、IDE利用が増えたのか、問い合わせが増えたのかを確認する。AI Creditsの合計だけでは、なぜ変わったかが分からない。

第四段階では、問い合わせテンプレートを作る。「どの画面で使っていますか」「会社の管理者設定で許可されていますか」「GitHubの最新Docsでは対象クライアントに入っていますか」「代替として標準モデルまたはAutoを使えますか」という順番で確認する。

## Internal policy: モデル名ではなく作業分類で書く

社内ポリシーは、モデル名の羅列より作業分類で書くほうが壊れにくい。

たとえば、日常のコード説明、軽微な修正、テスト追加、Issue整理はWeb版またはIDEの標準モデルでよい。複数リポジトリにまたがる設計変更、障害原因調査、セキュリティ影響が大きい修正は、IDE側のCopilot Chatやcloud agentを使い、必要に応じて管理者が許可した上位モデルを選ぶ。高倍率モデルを使うときは、チケットやPRに理由を残す。

この書き方なら、Web版で特定モデルが外れても、ポリシー全体は壊れない。モデル名が変わっても、作業分類と承認ルールが残るからだ。

一方で、特定モデル名を完全に消す必要はない。評価済みモデルや禁止モデルは明記したほうがよい。ただし、それは本文の中心ではなく、別表として管理する。本文は、どの作業をどの利用面で扱うかに集中させる。

## まとめ

GitHub Copilot on webのモデル削減は、単なるWeb UIの小変更ではない。Copilotのモデル運用が、クライアント別、機能別、ポリシー別、費用別に分かれてきたことを示している。

日本企業が今回やるべきことは、削除されたモデル名に反応することではなく、モデル可用性の確認手順を整えることだ。Web版とIDE版を分ける。管理者ポリシーを棚卸しする。AI Creditsのusage reportと照合する。社内ガイドをモデル名中心から作業分類中心へ寄せる。

Copilotは、補完ツールから開発組織のAI実行基盤へ変わっている。基盤になった以上、モデルの追加だけでなく、削減やクライアント差も運用対象になる。今回のChangelogは、その運用を作るための小さくても実務的な合図として扱うべきだ。

## 出典

- [Updates to available models in Copilot on web](https://github.blog/changelog/2026-05-20-updates-to-available-models-in-copilot-on-web/) - GitHub Changelog, 2026-05-20
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Requests in GitHub Copilot](https://docs.github.com/en/copilot/concepts/billing/copilot-requests) - GitHub Docs
