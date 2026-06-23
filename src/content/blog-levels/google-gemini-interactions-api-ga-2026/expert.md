---
article: 'google-gemini-interactions-api-ga-2026'
level: 'expert'
---

Google の **Gemini Interactions API GA** は、Gemini API を本番利用しているチームほど軽く見ないほうがよい更新だ。表面上は「新しい API が GA になった」ニュースだが、実際には Google が Gemini のモデル呼び出し、エージェント実行、長時間処理、tool orchestration、状態管理、開発者向けドキュメントをどの面に集約するかを示した出来事である。

既存の `generateContent` API は継続サポートされる。そのため、短期的な移行圧は低い。しかし Google は、Interactions API を Gemini モデルとエージェントの primary interface と呼び、新規プロジェクトではこちらを推奨している。これは将来の機能追加、サンプル、SDK、Agent 関連のノウハウが、Interactions API を前提に蓄積されるという意味を持つ。

この流れは、以前整理した [Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) と合わせると読みやすい。Managed Agents は、隔離された Linux 環境、Antigravity agent、ファイル状態、ツール実行、Web 参照を API 側へ寄せる話だった。今回の Interactions API GA は、その実行面を呼び出す標準インターフェースを固める話である。さらに [Google AI Studio の拡張](/blog/google-ai-studio-android-workspace-2026/) は試作から実装への入口を広げており、Google は人間の試作、エージェントの実行、API の統制面をつなげようとしている。

## 事実: Interaction は「レスポンス」ではなく実行記録に近い

従来の `generateContent` API は、アプリが入力を送り、モデル出力を受け取る構造だった。もちろん function calling や multimodal input は扱えるが、基本の発想は request と response である。

Interactions API の中心は `Interaction` リソースだ。ドキュメントでは、Interaction は会話またはタスクの完全なターンを表し、その中に時系列の execution steps が入ると説明されている。steps には、user input、model output、function call、function result、server-side tool call などが含まれ得る。単純なテキスト生成では SDK の convenience property で最終テキストを取り出せるが、複雑な処理では steps を読む設計になる。

この違いは、AI アプリの実装に効く。チャット UI だけなら最終テキストで足りる。しかし、業務アプリでは「どの検索をしたか」「どの関数を呼んだか」「どの資料を根拠にしたか」「途中で失敗したか」を見たい。Interactions API は、その途中経過を UI、デバッグ、監査、再実行判断に使える形へ寄せている。

日本企業で考えると、これは SIer や内製チームにとって大きい。顧客向け提案、社内規程回答、金融レポート、製造現場の手順確認、医療・法務周辺の支援では、最終回答だけでは説明責任を満たしにくい。AI がどのステップを踏んだかを見せる設計が必要になる。Interactions API の step timeline は、その要求に対する Google 側の答えだと見られる。

## 事実: server-side state は便利だが、保持要件を変える

Interactions API は既定で Interaction object を保存する。開発者は、完了した interaction の ID を `previous_interaction_id` として次の呼び出しに渡すことで、会話履歴をサーバー側から継続できる。アプリ側がすべての履歴を再構築して送り直す必要が減り、複数ターンの文脈維持や implicit caching によるコスト改善が期待できる。

ただし、これは設計上の責任を移す。これまでアプリ側 DB にだけ保存していた会話やタスク履歴が、API provider 側にも一定期間残る。Google のドキュメントでは、Paid Tier は 55 日、Free Tier は 1 日保持される。保存を避けたい場合は `store=false` を指定できるが、その場合は `previous_interaction_id` による会話継続や `background=true` を使えない。

ここは、実務で必ず確認すべき分岐だ。個人情報、顧客データ、契約書、未公開資料、ソースコード、セキュリティ調査結果を扱う場合、サーバー側保持を許容できるかを判断しなければならない。特に日本では、委託元との契約で外部 AI への入力条件が定められている場合がある。Interactions API の便利さを採るなら、データ分類、同意、削除手順、ログ保持、監査証跡をセットで決める必要がある。

`store=false` は逃げ道になるが万能ではない。状態継続と background execution を捨てることになるため、Interactions API を使う意味の一部が薄れる。したがって、全社一律で `store=false` とするより、用途ごとに「保存可」「保存不可」「要マスキング」「要別環境」を分けるほうが現実的だ。

## 事実: background execution は UI とジョブ設計を変える

Google は Interactions API の key updates として background execution を挙げている。`background=True` を設定すると、時間のかかる interaction をサーバー側で非同期に走らせられる。Deep Research、長い調査、コード解析、複数ツールを使うエージェント処理では、ユーザーに同期レスポンスを待たせる設計より自然だ。

しかし、background execution は API の機能だけでは完結しない。アプリ側には、ジョブ ID の管理、進捗表示、完了通知、キャンセル、再実行、期限切れ、部分結果の扱い、権限変更時の停止、課金上限の確認が必要になる。ユーザーが依頼した時点では権限があっても、完了時には組織や案件の権限が変わっている可能性もある。

これは [Gemini API の Flex/Priority](/blog/google-gemini-api-flex-priority-2026/) で扱った実行 tier 設計とも直結する。background job は、すべてを高信頼・低遅延で走らせる必要はない。夜間の調査、バッチ要約、社内検索の下処理は Flex でよいかもしれない。一方、ユーザーが画面上で待っている承認支援や障害対応支援は Priority を検討する価値がある。Interactions API の GA により、エージェント処理と推論 tier を同時に設計する必要が強まった。

## 分析: 移行対象は「単発生成」ではなく「状態を持つ仕事」から選ぶ

ここからは分析である。既存の `generateContent` 実装を機械的に全部置き換えるのは、あまり良い優先順位ではない。短文要約、分類、テンプレート文生成、少量の JSON 生成のような単発処理は、今のままでも事業価値が出ているなら急いで触る理由は弱い。API レスポンス構造、テスト、ログ、障害監視を変えるコストのほうが大きい可能性がある。

移行すべきなのは、状態を持つ仕事だ。たとえば、社内規程を見ながら人事問い合わせに答える、営業担当が顧客資料を調べながら提案を作る、開発者がリポジトリを横断して変更方針を調べる、カスタマーサポートが過去チケットと製品文書を参照して回答案を作る、といった用途である。これらは、複数ターン、複数ツール、根拠、途中状態、再開、監査が必要になる。

新規開発では、Interactions API を先に採用するほうが自然だ。理由は2つある。第一に、Google のドキュメントとサンプルがこちらを既定にしていくため、チーム内の知識更新が楽になる。第二に、将来 Managed Agents、Deep Research、Gemini Omni、tool improvements のような機能を使いたくなったとき、設計を戻す必要が少ない。

一方で、既存本番システムの移行では段階を分けたい。まず、SDK version、レスポンス抽出、ログ構造、エラー形式、リトライ方針を確認する。次に、低リスクの社内ユースケースを1つ選ぶ。最後に、データ保持とコストの監査を通してから顧客向け機能へ広げる。この順序を飛ばすと、「新APIにしたのに運用が難しくなった」という結果になりやすい。

## 実務: 日本チーム向けの移行チェックリスト

第一に、データ分類を決める。Interactions API は状態保持を前提にした機能が多い。送信データを、公開情報、社内一般情報、顧客秘密、個人情報、規制対象情報、ソースコード、セキュリティ情報に分け、どれを `store=true` で使えるかを明文化する。ここが曖昧なまま、便利だからという理由で server-side state を使うのは危ない。

第二に、削除と保持の手順を決める。Google のドキュメントでは、保存された interaction は API reference の delete method で削除でき、保持期間後には自動削除されるとされている。だが実務では、どの interaction ID がどのユーザー、案件、チケット、顧客に紐づくかを自社側で追えなければ削除できない。ID 管理をログに残す設計が必要だ。

第三に、監査ログを分ける。API provider 側の stored interaction と、自社の監査ログは別物である。監査に必要な steps、tool call、根拠 URL、最終出力、ユーザー操作、承認者、モデル ID、service tier、エラーを、自社側にどの粒度で残すかを決める。逆に、不要な本文や個人情報を保存しすぎないよう、マスキングや保存期間も設計する。

第四に、内部開発者体験を整える。[Gemini API Docs MCP と Agent Skills](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) のような仕組みを使うなら、社内のコーディングエージェントが古い `generateContent` パターンを出し続けないようにする必要がある。SDK の推奨 version、Interactions API の helper、step parsing の共通関数、テストフィクスチャ、禁止パターンを用意したほうがよい。

第五に、費用を scenario ごとに試算する。Gemini 3.5 Flash の料金表では、Standard、Batch、Flex、Priority で input/output 単価や context caching の扱いが異なる。Google Search grounding や Google Maps grounding には別の条件もある。エージェントが検索を何度も呼ぶ設計では、モデル token だけでなく tool 側の課金も効く。PoC の成功を本番にそのまま外挿しないことが重要だ。

第六に、既存 UI を見直す。Interactions API の steps を活かすなら、チャット欄に最終回答だけを出す UI では足りない。調査中、検索中、関数実行中、ファイル参照中、完了、要確認、失敗、といった状態をユーザーに示す必要がある。これは UX の話に見えるが、実際には信頼性と説明責任の話である。

## まとめ: API 移行ではなく、AI ワークロード設計の更新

Gemini Interactions API GA は、既存の Gemini API 利用者に即時の全面移行を迫る発表ではない。しかし、Google が Gemini の将来の開発面をどこへ寄せるかははっきりした。新しいモデル、エージェント、長時間処理、tool orchestration、observability は Interactions API を中心に広がっていく可能性が高い。

日本の開発チームは、短期的には既存 `generateContent` 実装を守りつつ、新規の状態付き AI アプリから Interactions API を使うのが現実的だ。特に、社内調査、開発支援、サポート支援、営業資料作成、文書レビューのような、複数ターンと根拠が重要な用途から試す価値がある。

最終的な論点は、API の置換ではない。状態をどこに持つか、どのデータを保存してよいか、どのステップを監査するか、どの service tier で走らせるか、失敗時にどう再開するかである。Interactions API は、その設計をサーバー側機能として支援する。一方で、採用する側にはデータ統制、コスト管理、UI、ログ、削除手順をきちんと持つ責任が残る。

## 出典

- [Interactions API: our primary interface for Gemini models and agents](https://blog.google/innovation-and-ai/technology/developers-tools/interactions-api-general-availability/) - Google, 2026-06-23
- [Interactions API | Gemini API](https://ai.google.dev/gemini-api/docs/interactions-overview) - Google AI for Developers, last updated 2026-06-23
- [Migrating to the Interactions API](https://ai.google.dev/gemini-api/docs/migrate-to-interactions) - Google AI for Developers
- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing) - Google AI for Developers
