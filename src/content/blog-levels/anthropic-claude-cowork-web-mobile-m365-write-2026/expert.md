---
article: 'anthropic-claude-cowork-web-mobile-m365-write-2026'
level: 'expert'
---

Anthropic の 2026年7月7日 Claude Apps release notes は、Claude Cowork と Microsoft 365 connector の境界を同時に動かした。前者は Cowork を desktop 中心の作業面から web/mobile と remote session へ広げ、後者は Microsoft 365 connector を read/search 中心から write tools へ進めた。これは、Claude を「会話するAI」から「業務環境をまたいで作業するAI」へ近づける更新である。

日本企業が注目すべき理由は明確だ。Microsoft 365 は多くの企業でメール、予定、ファイル、会議、部門知識の中心にある。そこへ Claude Cowork が remote session と mobile から入ると、AIエージェントは開発者向けツールではなく、営業、経理、人事、法務、企画、役員スタッフの作業主体になる。[PwCのClaude Code/Cowork展開](/blog/pwc-anthropic-claude-code-cowork-2026/) や [AnthropicとNECの戦略協業](/blog/anthropic-nec-ai-engineering-workforce-japan-2026/) で見た大規模導入の前提が、より日常業務の操作面へ降りてきたと見るべきだ。

この記事では、事実と分析を分ける。事実として、Cowork remote session と Microsoft 365 write tools の仕様を整理する。分析として、日本企業が read/search connector と write connector をどう分け、Entra consent、custom roles、監査ログ、承認フローをどう設計すべきかを見る。

## 事実: Cowork remote sessionは作業の所在を変える

Anthropic の Cowork documentation は、Claude Cowork が web、desktop、mobile で使えるようになったと説明している。web と mobile の remote sessions は beta で、数週間かけて Max plan から展開され、より多くのプランへ広がる予定だ。

remote session の本質は、Claude の作業が利用者のコンピューターではなく Anthropic のサーバー側で実行される点にある。セッションとファイルは Claude アカウントに保存され、同じセッションを desktop、web、mobile から確認できる。ラップトップを閉じても作業が続き、scheduled tasks は端末がオンラインでなくても動く。これは、AIエージェントの運用が端末の稼働状態に依存しにくくなることを意味する。

一方、local file access、local connectors、browser use、computer use は別扱いだ。documentation は、web/mobile からでも一部の機能が使えるが、利用者の端末に届く能力は Claude Desktop app を経由する場合があると説明している。remote session が動き続けても、Desktop app が閉じていると接続済みローカルファイルには届かない場合がある。

企業導入では、この違いを明文化しなければならない。remote session 上のファイル、Claude account に保存されるセッション、端末上の connected folders、Desktop app 経由の local connectors は、同じ「Cowork」でもリスクと管理点が違う。特に日本企業では、端末管理、クラウド保存、個人アカウント、業務アカウント、外部委託先端末を混同すると、事故時の説明が難しくなる。

## 事実: Microsoft 365 write toolsはGraph権限を広げる

Microsoft 365 connector の setup guide は、今回の write tools を明確に管理者向けの変更として扱っている。connector 自体は Free、Pro、Max、Team、Enterprise の各 Claude plan で利用可能だが、組織で使うには Microsoft Entra tenant と Business plan が必要で、個人 Microsoft account は使えない。

read/search の基本形では、Claude は SharePoint、OneDrive、Outlook、Teams の情報を検索・分析する。write tools を有効にすると、Claude は利用者の代理でメール送信、下書き管理、カレンダーイベント作成・更新、メールボックス設定更新、OneDrive/SharePoint ファイル作成・更新ができる。Anthropic は、read/search tools は従来通り動き、Teams は read-only のままだと説明している。

write tools を使うには2段階が必要になる。まず Microsoft Entra administrator が更新された permission set に同意する。次に Claude 組織側で write tools を有効化する。既存の connector 利用組織では write tools は default block で、Enterprise plan では custom roles によって subset of users に限定できる。

permissions reference では、write tools に `Mail.Send`、`Mail.ReadWrite`、`Calendars.ReadWrite`、`Files.ReadWrite.All`、`MailboxSettings.ReadWrite` が含まれる。これは、AI がメールと予定とファイルを更新できるという意味だ。もちろん delegated permissions なので、Claude は各ユーザーが Microsoft 365 上で既に持つ権限の範囲で動く。しかし、delegated であることは十分条件ではない。人間に与えた権限を AI にもそのまま渡すと、実行速度、誤操作の広がり、承認抜けの性質が変わる。

## 事実: 制約と識別の差が運用に効く

write tools にはいくつかの重要な制約がある。添付ファイル付きのメール送信・転送・下書きは拒否される。write tools にはユーザーごとの write、send、recipient limits がある。Teams は read-only で、Claude が Teams messages を投稿したり Teams settings を変更したりする tool はない。

監査面では、メール送信に agent-initiated attribution header が含まれる一方、file writes と calendar writes は現時点で同じタグが付かないと説明されている。この差は重要だ。AI が関与したメールはヘッダーで識別しやすいが、ファイル更新や予定変更は Microsoft 365 側の audit log、Claude 側の履歴、業務ワークフローの承認記録を組み合わせて追う必要がある。

また、Microsoft 365 connector は利用者の既存権限を反映するが、SharePoint tenant 全体にわたる検索に関して site-specific search restriction はサポートされないと説明されている。これは、検索段階でも data boundary の設計が必要であることを示す。部署別サイト、顧客別サイト、機微情報サイトを Microsoft 365 側の権限で正しく分けていなければ、AI connector だけで後から安全に絞るのは難しい。

## 分析: delegated permissionをAI運用の免罪符にしない

ここからは分析だ。

多くの企業は、Microsoft 365 の権限を「人間が画面を見て、意図を持って操作する」前提で設計してきた。AIエージェントが同じ delegated permission で動く場合、同じ権限でもリスクは変わる。AI は大量のメールを読み、予定候補を並べ、ファイルを作り、下書きを作成し、指示次第では送信まで進める。個々の操作はユーザー権限内でも、作業速度と範囲が人間とは違う。

したがって、Microsoft 365 write tools は connector permission ではなく、業務システム操作権限として審査すべきだ。メール送信は外部コミュニケーション権限、calendar write は人の時間と会議体を変更する権限、SharePoint/OneDrive write は記録・成果物・ナレッジを変更する権限である。これらを「AI利用許可」という1つのトグルで扱うと粗すぎる。

実務的には、権限を4段階に分けたい。第1段階は read/search のみ。第2段階は draft-only、つまり下書き作成やテストフォルダ内のファイル作成。第3段階は internal write、社内予定や社内限定ファイルの更新。第4段階は external write、顧客メール、外部共有ファイル、正式会議招待、契約関連フォルダの更新である。第4段階は、AI単独実行ではなく human approval gate を置くべきだ。

[Claude金融エージェントの記事](/blog/anthropic-claude-finance-agents-2026/) で扱ったように、金融・法務・医療・公共の業務では、AI が成果物を作る能力よりも、誰が承認し、どの根拠を残し、どのデータ分類を使ったかが重要になる。Microsoft 365 write tools は汎用機能だが、使われる場所は規制業務そのものになり得る。

## 分析: Cowork mobileは承認体験を変える

Cowork が web/mobile に広がる意味は、利用場所が増えるだけではない。AI の作業を途中で見て、質問に答え、方向修正し、完了物を受け取る場所が増える。移動中のスマートフォンで AI の質問に答えられることは便利だが、承認品質を下げる可能性もある。

たとえば、Claude が「このメールを送ってよいか」と聞いたとき、利用者が電車内で短く承認する。Claude が「この予定を来週に移動してよいか」と聞いたとき、利用者が会議中に通知だけ見て承認する。Claude が「このSharePointファイルを更新してよいか」と聞いたとき、利用者が差分を十分見ずに承認する。mobile で使えることは、軽い確認を増やす一方で、重い承認を軽く見せてしまう。

そのため、操作の種類ごとに mobile 承認可否を分ける必要がある。下書き作成、進捗確認、情報検索の方向修正は mobile でよい。外部送信、正式ファイル更新、顧客向け共有、契約・人事・財務に関わる変更は desktop で差分を確認し、社内承認フローを通す。これはUX上の面倒さではなく、AIエージェント運用に必要な摩擦である。

## 分析: 既存のClaude導入論点とつながる

今回の更新は単独ではなく、Anthropic の日本市場・企業導入の流れにある。NEC 協業では Claude Code と Claude Cowork を含む約3万人規模の導入と業種別AIが語られた。PwC の提携拡大では Claude Code/Cowork、CoE、3万人認定、規制業界での監査性が示された。今回の web/mobile と Microsoft 365 write tools は、その大規模導入が日常業務の操作面に入るための部品に見える。

同時に、[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) の論点も強くなる。AIエージェントを安全に使うには、モデル層だけでなく、filesystem、network、credential、tool、connector、browser、workspace の境界を設計する必要がある。Microsoft 365 write tools は、この中でも connector と credential と business record の境界に関わる。

日本企業は、Claude Cowork を「非エンジニア向けの便利なAI」とだけ見ないほうがよい。これは、企業データ、Office業務、予定、メール、ファイルをまたぐ操作面である。開発者向け Claude Code と違い、利用者が多く、業務範囲が広く、権限設計が部署ごとに異なる。だからこそ、導入前の設計を厚くする必要がある。

## 実装チェックリスト

第一に、Microsoft 365 側の情報分類を見直す。SharePoint site、OneDrive sharing、shared mailbox、calendar delegation、Teams channel、meeting transcript の権限が現状で適切かを確認する。AI connector 導入は、既存権限の粗さを増幅する。

第二に、Claude 側の connector 有効化と write tools 有効化を別プロセスにする。read/search の許可と write の許可は別の承認にし、write は部門単位または role 単位で段階的に開く。

第三に、Graph scopes を業務言語に翻訳する。`Mail.Send` は「外部メール送信」、`Calendars.ReadWrite` は「予定作成・変更」、`Files.ReadWrite.All` は「アクセス可能なOneDrive/SharePointファイル作成・更新」である。管理者だけで scope 名を見て判断せず、業務責任者に影響を説明する。

第四に、AI関与の識別方法を作る。メール header、Microsoft 365 audit log、Claude activity、社内申請やチケット番号をどう紐づけるかを決める。file/calendar write に明示タグがない前提で、AI が関与した操作を後から説明できるようにする。

第五に、失敗時の停止手順を作る。write tools を無効化する方法、Entra 側で permission を revoke する方法、特定ユーザーやグループの connector 利用を止める方法、Claude 側で organization connector を外す方法を runbook にする。

第六に、ユーザー教育を「プロンプト研修」で終わらせない。AI に送らせてよいメール、送らせてはいけないメール、更新してよいファイル、承認が必要な操作、mobile で承認してよい範囲を具体例で教える。AIエージェントの教育は文章生成のコツではなく、業務権限の扱いである。

## まとめ

Claude Cowork の web/mobile 対応と Microsoft 365 connector write tools は、Anthropic の業務AIが日常の作業面へ深く入る更新である。remote session によって作業は端末をまたぎ、Microsoft 365 write tools によってAIはメール、予定、ファイルを変更できる。

日本企業にとっての論点は、Claude が便利かどうかではない。AIエージェントを Microsoft 365 の delegated permission で動かすとき、どの操作を許可し、どの操作に人間承認を置き、どのログで説明するかである。read/search と write を分け、low-risk action から始め、監査ログと停止手順を整えることが、非エンジニア向けAIエージェント本番化の前提になる。

今回の更新は、Claude Cowork を日本企業の業務AI基盤として検討するなら避けて通れない。まずやるべきことは、全社展開の号令ではなく、Microsoft 365 操作権限の棚卸しである。

## 出典

- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) - Anthropic, 2026-07-07
- [Use Claude Cowork on web, desktop, and mobile](https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile) - Anthropic, 2026-07-07
- [Set up the Microsoft 365 connector](https://support.claude.com/en/articles/12542951-set-up-the-microsoft-365-connector) - Anthropic, 2026-07-07
- [Connect to Microsoft 365](https://support.claude.com/en/articles/15183774-connect-to-microsoft-365) - Anthropic, 2026-07-07
