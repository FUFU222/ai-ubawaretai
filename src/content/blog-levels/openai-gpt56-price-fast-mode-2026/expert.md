---
article: 'openai-gpt56-price-fast-mode-2026'
level: 'expert'
---

OpenAI が 2026年7月30日に発表した **GPT-5.6 price-performance update** は、API の単価表を更新するだけの話ではありません。Luna の 80%値下げ、Terra の 20%値下げ、Sol Fast mode、Codex と ChatGPT Work の credit 消費への反映が同時に動くため、企業の AI 利用設計を作業単位で見直す必要があります。

日本企業の実務では、モデル選定が「最上位モデルを使えるか」「月額プランで足りるか」に寄りがちです。しかし、Codex、ChatGPT Work、API を併用する段階では、その見方では粗すぎます。必要なのは、モデル階層、処理経路、権限、待ち時間、再試行、レビュー負荷、部門別予算を同じ表で見ることです。

[GPT-5.6一般提供とAPI移行](/blog/openai-gpt-56-ga-work-codex-api-2026/) では、Sol、Terra、Luna、Programmatic Tool Calling、ChatGPT Work、Codex の提供条件を整理しました。今回の更新は、その実装計画に対して費用曲線を変えるものです。[OpenAI Codex企業導入](/blog/openai-codex-role-plugins-sites-workflows-2026/) の観点では、安くなった Luna をどこまで自動化の下層に入れるか、Fast mode をどの承認線で使うかが新しい論点になります。

## 事実: 価格とモードの変更点

OpenAI は、GPT-5.6 Luna を 80%値下げし、GPT-5.6 Terra を 20%値下げすると発表しました。2026年7月30日から、API 価格は Terra が 100万入力tokenあたり 2ドル、100万出力tokenあたり 12ドル、Luna が 100万入力tokenあたり 0.20ドル、100万出力tokenあたり 1.20ドルです。Sol の標準価格は据え置きです。

同時に、API の Priority Processing は Fast mode に置き換わります。GPT-5.6 Sol の Fast mode は、Standard processing より最大 2.5倍高速で、価格は Standard の2倍です。OpenAI は intelligence は変わらないと説明しており、既存の priority tag は継続して動くため、移行は破壊的変更というより名称と料金体系の整理に近いものです。

Codex と ChatGPT Work への影響も明示されています。OpenAI は、Terra と Luna の低価格化が有料サブスクリプションでの usage accounting にも反映されると説明しています。subscription price と quota budget は変えず、Terra と Luna の利用が消費する credit を軽くする設計です。

Business pricing ページでは、Business と Enterprise のモデル欄に GPT-5.6 Sol、Sol Pro、Terra、Luna が flexible として並び、ChatGPT Work と Codex も企業向け機能として位置づけられています。これは、価格改定が API 開発者だけでなく、業務部門、情シス、FinOps、開発組織にまたがる話であることを示しています。

## 事実: Lunaは大量処理、Fast modeは時間価値の購入

OpenAI は、モデル選択を outcome から考えるべきだと説明しています。作業の重要度、誤りのコスト、緊急度、処理規模によって、知能、速度、信頼性、費用のバランスは変わります。この考え方は、企業内のモデルルーティングにそのまま使えます。

Luna の値下げで最も影響を受けるのは、高頻度で比較的リスクの低い処理です。チケット分類、問い合わせ intent 判定、ログ要約、コードレビュー前の差分整理、テスト失敗ログの要約、ナレッジ検索の候補抽出、メールや議事録の構造化などが該当します。これらは1件あたりの単価が重要で、品質基準を満たすなら低価格モデルの恩恵を受けやすい。

Terra は、日常的な本番業務の既定モデル候補になります。通常の開発補助、社内ドキュメント生成、CRMメモの整形、軽めの調査、SQLやスクリプトの作成、仕様差分の説明などです。Luna より失敗コストが高いが、Sol を毎回使うほどではない作業に向きます。

Sol Fast mode は別の発想です。これは安くするための機能ではなく、待ち時間を短くするための premium です。障害対応中の原因分析、リリース直前の重大差分レビュー、セキュリティ修正の方針検討、顧客影響の大きい調査など、時間の価値が価格差を上回る場面で使うべきです。常時オンにすると、ただのコスト増になります。

## 成功単価で設計する

企業の AI 費用管理では、1リクエストあたりの token 単価より、1成功あたりの単価を見るべきです。

成功単価には、入力token、出力token、tool call、cache、再試行、失敗時の上位モデル昇格、人間レビュー、待ち時間、差し戻しを入れます。Codex のような agentic workflow では、1つの依頼が複数のリクエストに分解されます。ChatGPT Work では、ユーザーの作業文脈、接続アプリ、定期タスク、ファイル処理が絡みます。API では、アプリケーション側の retry と timeout が費用に影響します。

たとえば、Luna が1回あたり非常に安くても、同じ分類を3回再試行し、人間が毎回確認し、最終的に Terra へ上げるなら、最初から Terra を使うほうが安い場合があります。逆に、成功率が十分でレビューも軽い処理なら、Luna の値下げは大きい。ここは推測ではなく、固定評価セットで測る必要があります。

OpenAI は、Sol が計画を作り、Luna が明確に定義された変更、テスト、評価を担当するような workflow 例を示しています。この構成は日本企業でも現実的です。人間または Sol が方針を決め、Terra や Luna が下流の反復作業をこなし、最後に人間または上位モデルが確認する。重要なのは、モデルの使い分けを workflow に組み込むことです。

## Codex運用での具体設計

Codex では、Luna の低価格化が routine work の広がりに効きます。依存更新の差分整理、テスト失敗の分類、lint 修正、ドキュメント同期、単純な型修正、PR説明の下書き、既知パターンのリファクタリング候補抽出などです。

ただし、Codex におけるモデル単価の低下は、権限拡大の理由にはなりません。Luna でもリポジトリを変更するなら、branch、review、CI、secret access、外部通信、package install、破壊的コマンドの制限は必要です。安いモデルに広い権限を持たせるより、狭い権限で大量の補助作業を任せるほうが安全です。

Terra は、実装タスクの既定候補になります。仕様が明確で、既存テストがあり、差分の範囲が限定され、人間レビューが入る作業なら、Sol ではなく Terra で十分な場合があります。逆に、要件が曖昧、複数サービスにまたがる、データ移行を伴う、セキュリティ境界を変える、障害復旧に関係する作業は Sol から始めるべきです。

Fast mode は、Codex の `/fast` と API 側の Fast mode を同じ費用ポリシーに載せる必要があります。たとえば、通常開発では無効、incident label が付いたタスクだけ有効、リリース freeze 中の blocker だけ有効、月次予算を超えたら管理者承認、という運用が考えられます。速度に対して2倍の標準価格を払う理由を、事後に説明できる形にするべきです。

[GPT-5.6 Bedrock記事](/blog/openai-gpt-56-bedrock-ga-aws-governance-2026/) で整理したように、経路が変わるとログ、請求、リージョン、機能差も変わります。Codex で使うモデル、API で使うモデル、AWS 経由で使うモデルを別々に承認すると、費用と権限が分断されます。モデル階層と経路を1枚の matrix にまとめるのが現実的です。

## ChatGPT Workと事業部門での具体設計

ChatGPT Work では、Luna と Terra の credit 消費が軽くなることで、日常業務の AI 利用が増えやすくなります。これは良い面もありますが、部門別の利用量が見えないままだと、予算説明が難しくなります。

事業部門では、まず作業を3層に分けるとよい。第一層は Luna 向けの大量処理です。問い合わせ分類、営業メモの整形、議事録の要点抽出、FAQ候補の整理、簡単な翻訳、社内文書のタグ付けなどです。第二層は Terra 向けの日常判断です。顧客別提案の下書き、社内資料の構成、KPI差分の説明、契約レビュー前の論点整理などです。第三層は Sol 向けの高重要度作業です。経営会議資料、価格戦略、重大クレーム対応、規制対応、複雑な財務分析などです。

この分類は固定ではありません。重要顧客、個人情報、法務判断、外部送信、本番データ更新が絡む場合は、モデル階層だけでなく承認線を上げるべきです。低価格化は「自動送信してよい」という意味ではありません。むしろ利用量が増えるほど、人間承認、ログ、DLP、社内テンプレート、保存先の管理が重要になります。

[OpenAI AIスコアカード](/blog/openai-ai-scorecard-successful-task-roi-2026/) のように、AI 活用は successful task や成果単価で測る流れに移っています。今回の価格改定は、その測定を細かくする機会です。部門ごとに token ではなく、完了件数、差し戻し率、レビュー時間、顧客影響、再利用率を記録するほうが、経営説明に耐えます。

## FinOpsと監査のチェックリスト

第一に、モデル別の利用台帳を作ります。Luna、Terra、Sol Standard、Sol Fast mode、API、Codex、ChatGPT Work、クラウド経路を分けます。月次合計だけでは、どの価格改定が効いたのかわかりません。

第二に、作業カテゴリを付けます。分類、要約、検索、コード修正、テスト、資料作成、調査、顧客対応、監査、障害対応などです。モデル別費用だけでなく、作業カテゴリ別の成功単価を見ます。

第三に、昇格ルールを記録します。Luna から Terra、Terra から Sol、Standard から Fast mode へ上げる条件を明文化し、ログに残します。再試行のたびに別モデルへ上げるのか、同じモデルで再実行するのかは費用にも品質にも影響します。

第四に、Fast mode の利用理由を必須にします。Fast mode は速度を買う選択肢なので、incident、release blocker、顧客影響、期限などの理由を残すべきです。理由がない Fast mode は、月末に削る対象になります。

第五に、subscription と API を同じ成果指標で見ます。ChatGPT Work の credit 消費が軽くなっても、API 側の利用が増えて総額が膨らむ場合があります。逆もあります。部署別に、どの経路で何を完了したかを見る必要があります。

第六に、prompt caching と再利用設計を同時に扱います。今回の OpenAI 発表は価格改定が主題ですが、GPT-5.6 世代では効率化、tool use、context management が費用に直結します。固定 system prompt、tool definitions、reference files、evaluation harness を安定させることは、単価表を見るのと同じくらい重要です。

## 日本企業への提案

短期的には、既存の GPT-5.6 利用を3週間分ほど棚卸しします。誰が、どの経路で、どのモデルを、何の作業に使い、どれだけ成果物が採用されたかを見る。ここで API token だけを見ると、ChatGPT Work や Codex の効果が抜けます。

次に、代表タスクを作って A/B 評価します。Luna、Terra、Sol Standard、Sol Fast mode を同じ入力で試し、成功率、レビュー時間、再試行、待ち時間、総費用を比べます。価格改定後の Luna は非常に安いため、分類や下処理では強い候補になります。ただし、判断品質が要る作業では Terra や Sol のほうが成功単価で勝つ可能性があります。

最後に、ポリシー化します。Luna は大量・低リスク・高頻度、Terra は日常業務と標準実装、Sol は高重要度・曖昧・高リスク、Fast mode は時間価値が明確な緊急作業。このように初期ルールを置き、月次で実測に基づいて更新します。

## まとめ

GPT-5.6 の価格改定は、AI を広く安く使うための追い風です。ただし、企業にとっての本質は値下げそのものではありません。Luna、Terra、Sol、Fast mode を作業単位で使い分け、Codex、ChatGPT Work、API の成果を同じ指標で見ることです。

日本企業は、今回の変更を「Luna が安くなった」で終わらせず、モデルルーティング、Fast mode 承認、部門別 FinOps、レビュー時間、成功単価の見直しに使うべきです。価格性能の改善は、運用設計が追いついたときに初めて事業上の余力になります。

## 出典

- [Advancing the price-performance frontier with GPT-5.6](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/) - OpenAI, 2026年7月30日
- [GPT-5.6: Frontier intelligence that scales with your ambition](https://openai.com/index/gpt-5-6/) - OpenAI, 2026年7月9日
- [Business Pricing](https://openai.com/api/pricing/) - OpenAI
- [OpenAI cuts GPT-5.6 prices](https://www.axios.com/2026/07/30/openai-cuts-prices-gpt-terra-luna5) - Axios, 2026年7月30日
