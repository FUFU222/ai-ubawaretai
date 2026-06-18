---
article: 'google-antigravity-code-assist-migration-2026'
level: 'expert'
---

Google の Gemini Code Assist / Gemini CLI 移行告知は、開発者体験の小さな変更ではなく、Google の agent platform 戦略が個人・Pro・Ultra 利用経路にまで及んだサインとして読むべきだ。Google Cloud と Google for Developers の release notes は、Antigravity への統合と Antigravity CLI の提供を示し、Gemini Code Assist IDE Extensions と Gemini CLI が Gemini Code Assist for individuals、Google AI Pro、Google AI Ultra 向けにリクエスト提供を止める日を 2026年6月18日としている。

この変更を理解するには、既存の Google 系 agent 基盤記事とつないで見る必要がある。[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) は、Antigravity agent、隔離 Linux 環境、Interactions API、ファイル状態の保持を通じて、Gemini API を agent 実行基盤へ広げる発表だった。[Google AI Studio 連携拡張](/blog/google-ai-studio-android-workspace-2026/) は、試作、Android 出力、Workspace 連携、Cloud Run / Firebase 配備、Antigravity への導線を扱っていた。今回の焦点は、その周辺にあった個人向け IDE / CLI 経路が、Antigravity へ明示的に寄せられることだ。

日本企業にとっての実務論点は、停止対象そのものよりも、契約と利用実態のずれにある。Standard / Enterprise 契約で Gemini Code Assist を管理している組織でも、開発者が個人の Google アカウントや Google AI Pro / Ultra で IDE 拡張、Gemini CLI、Gemini Code Assist for individuals を使っている可能性がある。公式導入と BYO 利用が混ざっていると、移行日は単なるユーザー通知ではなく、開発基盤の棚卸しイベントになる。

## 事実: Standard / Enterpriseと個人向けを分ける

Google Cloud の Gemini Code Assist Standard / Enterprise overview は、Standard / Enterprise を Gemini for Google Cloud ポートフォリオの製品とし、個人向けの Gemini Code Assist とは別だと説明している。これは、移行影響を判断するときの最初の分岐になる。

同じページと release notes に掲載された注意書きでは、Google がツールを Antigravity という single, multi-agent platform へ統合し、Antigravity CLI が利用可能になったことを示している。対象として挙げられているのは、Gemini Code Assist IDE Extensions と Gemini CLI が、Gemini Code Assist for individuals、Google AI Pro、Google AI Ultra ティア向けに提供していた Gemini Code Assist へのリクエストだ。停止日は 2026年6月18日で、Google は Antigravity と Antigravity CLI への移行を求めている。

一方、2026年6月8日の release notes では、Gemini 3.5 Flash が VS Code と IntelliJ の Gemini Code Assist ユーザー向けに一般提供され、agent mode、chat、code generation で使えると説明されている。つまり、Google は IDE 側のモデル機能を縮小しているわけではない。むしろモデルと agent mode を強化しながら、個人・Pro・Ultra の利用入口を Antigravity へ移している。

この点は誤解されやすい。「Gemini Code Assist が終了する」と広く伝えると、Standard / Enterprise 利用者まで不要に混乱する。正しくは、個人・Google AI Pro・Ultra の IDE/CLI リクエスト経路の停止と、Antigravity / Antigravity CLI への移行である。日本企業の社内告知も、この粒度で書くべきだ。

## 分析: IDE補助からagent運用面への再編

ここからは分析だ。今回の発表は、Google が Gemini Code Assist、Gemini CLI、Antigravity を同じ「開発者向け AI」棚で整理し直していることを示す。

従来の IDE 補助は、補完、チャット、コード生成、ファイル説明、簡単な修正が中心だった。Gemini CLI は端末から Gemini を呼び出す経路として使われ、IDE に入れない場面やスクリプト的な作業で便利だった。一方 Antigravity は、複数 agent の並列実行、subagents、artifacts、skills、MCP、hooks、CLI、SDK を前提にした platform として位置づけられている。

この違いは運用上大きい。補完ツールなら、主な管理対象はデータ利用、拡張機能の配布、モデル選択、コード提案の扱いだ。しかし agent platform では、ファイル編集、コマンド実行、外部ツール接続、バックグラウンド実行、成果物レビュー、長時間タスク、複数 agent の分担が入る。便利さが増すほど、許可境界と監査が重要になる。

[Gemini 3.5 Flash Stable 化](/blog/google-gemini-35-flash-api-stable-agents-2026/) で整理したように、Google は Gemini 3.5 Flash を agentic coding や tool use の重要モデルとして扱っている。モデルが高速・高性能になるほど、agent の実行面が前に出る。今回の移行は、モデルの提供面ではなく、実行と操作の標準面を Antigravity に集める動きと考えると理解しやすい。

## 日本企業のリスクはBYO利用と手順の残存

日本企業で最も起きやすいリスクは、公式導入と個人利用の混在だ。会社として Gemini Code Assist Standard / Enterprise を契約していない場合でも、エンジニアが個人アカウント、Google AI Pro、Google AI Ultra で IDE 拡張を入れていることがある。逆に、企業契約があっても、部署や委託先が個人経路で使っている場合もある。

この混在が残ると、停止日に一部の開発者だけが作業を止められる。さらに悪いのは、各自が急いで Antigravity、別の CLI、別のコーディング agent へ移ることだ。結果として、社内の AI 利用規程、MCP 接続先、secret の扱い、リポジトリアクセス、ログ保存、外部送信の説明がばらける。

もう一つのリスクは、社内手順の残存だ。README、開発環境構築手順、研修資料、ハンズオン、委託先向けオンボーディング、社内 wiki に Gemini CLI の記述が残っていると、停止後も新しいメンバーが古い経路を試そうとする。これは単に手順が失敗するだけでなく、個人アカウントで代替設定を探す誘因にもなる。

3つ目は、監査対象の拡大を見落とすことだ。Antigravity CLI は terminal-first の agent 操作面であり、slash commands、MCP、skills、hooks などを扱える。これらは、Claude Code、Codex、GitHub Copilot CLI など他の agent 型ツールでも論点になっている。組織としては、ツールごとの UI ではなく、agent が持てる権限の型で管理する必要がある。

## 移行計画の現実的な順番

最初のステップは、影響範囲の確認だ。ブラウザや管理コンソールだけではなく、端末側を見る。VS Code、JetBrains IDE、Android Studio などの拡張配布状況、Gemini CLI のインストール、shell history や dotfiles、社内テンプレート、CI からの呼び出しを調べる。監視や棚卸しが難しい場合は、少なくとも開発者向けアンケートと社内ドキュメント検索を組み合わせる。

次に、アカウント種別を分ける。Gemini Code Assist Standard / Enterprise の正規ライセンスなのか、Gemini Code Assist for individuals なのか、Google AI Pro / Ultra なのかを分ける。企業で管理できる範囲と、個人が契約している範囲では、データ利用、サポート、責任分界、退職時のアクセス遮断が違う。

3つ目に、代替方針を決める。選択肢は大きく三つある。Google Cloud 契約として Gemini Code Assist Standard / Enterprise を標準化する。Antigravity / Antigravity CLI を企業の agent 開発面として試験導入する。既存の GitHub Copilot、Codex、Claude Code、Cursor などに寄せる。どれを選ぶにしても、移行の判断軸はモデル性能だけでなく、SSO、ログ、管理設定、MCP、権限、コスト、委託先利用、社内標準 IDE との相性に置く。

4つ目に、比較タスクを作る。旧 Gemini CLI で実行していた代表作業、IDE agent mode で行う修正、Antigravity CLI で試す長めのタスクを同じリポジトリで比較する。見るべきなのは、成功率、差分品質、レビュー指摘、実行コマンド、承認回数、ログの粒度、失敗復帰、secret への接触、MCP 接続先、proxy 環境での挙動だ。

## Antigravity CLI導入時の管理線

Antigravity CLI を導入するなら、まず権限モデルを定義する必要がある。読み取り専用で調査だけ許すのか、ファイル編集まで許すのか、テスト実行を許すのか、外部 API への接続を許すのかをユースケースごとに分ける。agent 型ツールでは、便利な初期設定がそのまま本番運用に持ち込まれがちだが、最初から広く許すと後で絞りにくい。

MCP と skills も管理対象に入れる。Antigravity の製品ページでは、MCP、skills、hooks のような拡張要素が前面に出ている。これは agent の能力を広げる一方で、外部サービス、社内 API、ドキュメント、Issue tracker、CI、クラウド権限へ接続する入口にもなる。社内で利用を許す MCP サーバー、禁止するデータ、レビュー済み skills、hooks の変更権限を決める必要がある。

ログと成果物の扱いも重要だ。agent が何を読み、何を実行し、どの差分を作り、どの出典を使ったかを後から確認できなければ、事故時に説明できない。特に顧客コード、委託先開発、規制業種、金融・医療・公共系の案件では、開発者本人の体験よりも、レビューと監査の再現性が重い。

最後に、撤退基準を置く。新しい agent platform を試すときは、うまくいったタスクだけが見えやすい。だが本番導入では、失敗時に人間がどれだけ早く差分を理解できるか、危険な操作を止められるか、古い context で誤った修正をしないかが重要だ。Antigravity CLI の評価でも、採用条件だけでなく、使わない条件を決めるべきである。

## 社内告知の書き方

社内向けには、まず対象を限定して伝える。Gemini Code Assist Standard / Enterprise の全機能停止ではなく、Gemini Code Assist for individuals、Google AI Pro、Google AI Ultra 向けの IDE Extensions と Gemini CLI のリクエスト経路が 2026年6月18日から止まる、という表現にする。対象外の契約や継続利用経路があるなら、管理者が確認した範囲を併記する。

次に、開発者へ求める行動を書く。個人アカウントでの業務利用を申告する、Gemini CLI を使う手順をチーム wiki から削除または更新する、Antigravity CLI を試す場合は指定リポジトリと指定アカウントに限定する、MCP や hooks を勝手に追加しない、といった具体策が必要だ。

また、移行を「AI 利用禁止」にしないほうがよい。突然禁止だけを出すと、開発者は別の個人向け AI ツールへ移る。目的は、AI コーディング支援を止めることではなく、企業として管理できる経路へ移すことだ。したがって、代替ツール、申請先、暫定ルール、例外承認の窓口を同時に出すべきだ。

## まとめ

Gemini Code Assist / Gemini CLI の Antigravity 移行は、Google の agent platform 再編が具体的な利用経路の変更として現れたものだ。個人・Google AI Pro・Ultra の IDE/CLI 経路は 2026年6月18日から影響を受けるため、BYO 利用がある日本企業では棚卸しが必要になる。

重要なのは、Antigravity へ移るかどうかだけではない。Gemini Code Assist Standard / Enterprise、AI Studio、Managed Agents、Antigravity CLI、Gemini 3.5 Flash の役割を分け、開発者端末、API 実行基盤、試作環境、企業契約を別々に管理することだ。Google の Gemini 系ツールは agent 基盤へ寄っている。日本の開発組織も、IDE 補助の管理から agent 実行権限の管理へ、ルールを更新する段階に入っている。

## 出典

- [Gemini for Google Cloud release notes](https://docs.cloud.google.com/gemini/docs/release-notes) - Google Cloud Documentation
- [Gemini Code Assist release notes](https://developers.google.com/gemini-code-assist/resources/release-notes) - Google for Developers
- [Gemini Code Assist Standard and Enterprise overview](https://docs.cloud.google.com/gemini/docs/codeassist/overview) - Google Cloud Documentation
- [Google Antigravity CLI](https://antigravity.google/product/antigravity-cli) - Google Antigravity
