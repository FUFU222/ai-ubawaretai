---
article: 'walkme-q2-contextual-ai-governance-2026'
level: 'expert'
---

WalkMe の Q2 '26 Product Release は、生成 AI の企業導入を考えるうえで、かなり実務寄りのシグナルを出している。派手な新モデル発表ではないが、**AI を社員の業務画面、研修、利用量管理、管理コンソールにどう埋め込むか** という論点がまとまっているからだ。

この更新は、2026年5月17日に公式ヘルプが更新され、US/EU では5月18日から提供開始と説明されている。Canada、FedRAMP、SAP はその後に段階提供される。WalkMe Digital Adoption と WalkMe Learning Arc の両方にまたがり、Contextual AI Assistance、AI Usage Dashboard、Learning Arc、Console 統合、SAP Enable Now 移行支援まで含む。

日本企業の観点では、これは単なる WalkMe ユーザー向け release note ではない。生成 AI を導入しても現場定着しない、利用量が読めない、権限が複雑、研修と実運用が分断される、という課題に対して、WalkMe が「業務画面内の支援」と「管理できる AI 消費」をセットで出してきた更新として読むべきだ。

## 事実: WalkMe は AI 支援を業務画面の中に寄せた

Q2 '26 の Contextual AI Assistance でまず目立つのは Smart Highlights だ。公式説明では、ServiceNow、SAP S/4HANA、SuccessFactors、Salesforce などの情報を、ユーザーが今使っているアプリ内に表示するとされている。ポイントは、ユーザーが別画面に移動して検索するのではなく、画面上の人物、企業、チケット、アカウントのような entity をきっかけに、関連データをその場に出すことだ。

WalkMe は、Smart Highlights が追加 API setup を不要とし、既存の user permissions を尊重すると説明している。つまり、表示される情報はユーザーがすでにアクセスできる範囲に限定されるという設計だ。もちろん実運用では検証が必要だが、少なくとも製品思想としては、AI が勝手に権限を越えるのではなく、既存権限の上に支援を重ねる方向を打ち出している。

この点は日本企業にとって大きい。基幹システム、CRM、HR、ITSM、社内ポータルは、それぞれ権限体系が違う。AI を導入するたびに別の権限モデルを作ると、現場も管理者も追いつかない。WalkMe の価値は、すでに業務画面の上に存在する digital adoption layer を使い、既存アプリの文脈に AI を差し込むところにある。

以前取り上げた[SalesforceのSlack標準化で営業AI運用はどう変わるか](/blog/salesforce-slack-ai-work-platform-2026/)では、Slack が営業・CS の実行面へ寄っていく流れを整理した。WalkMe の今回の更新も同じ方向だが、Slack が会話と顧客業務の面を狙うのに対して、WalkMe は業務アプリそのものの操作面と定着支援を狙っている。

## 事実: AI Chat は画面文脈を読む方向へ進んだ

Q2 release には、AI Chat が現在表示されているページ文脈を理解する更新も含まれる。公式説明では、ユーザーが検索語を手でコピーして貼り付ける代わりに、AI Chat が画面上の文脈を解析し、作業に関連する回答を返すとされている。

これは小さな UX 改善に見えるが、企業 AI の現場ではかなり重要だ。AI チャットの失敗の多くは、モデルの性能不足ではなく、ユーザーが十分な文脈を渡せないことにある。業務アプリの画面、項目名、エラー、顧客情報、申請状態、チケット履歴を毎回説明するのは現実的ではない。AI が画面文脈を読めるなら、現場ユーザーの入力負担を減らせる。

ただし、ここには統制論点もある。画面文脈を読むということは、AI が画面上の情報に触れるということだ。個人情報、顧客情報、給与、人事評価、契約条件、医療・金融に関わる情報が画面に出る業務では、どの画面で AI Chat を有効化するかを慎重に設計する必要がある。便利さとリスクは同じ場所にある。

これは[Google「Workspace Intelligence」発表。日本企業は“文脈共有AI”をどこまで許可すべきか](/blog/google-workspace-intelligence-admin-controls-2026/)で見た論点とも同じだ。AI の価値は文脈に依存するが、文脈を渡すほどガバナンスが必要になる。

## 事実: AI Usage Dashboard は AI unit を管理対象にした

WalkMe の AI Usage Dashboard は、今回の release の中でも特に管理者向けの意味が大きい。公式ページでは、組織全体の AI unit consumption を、期間、システム、capability ごとに見られると説明されている。headline metric、time series、system breakdown、capability breakdown という見方が用意される。

capability は細かく分かれる。Pinned AI、AI Knowledge Referencing、On-Demand AI、AI Knowledge Indexing、Joule Action Bar On Demand、Joule Action Bar Proactive などだ。さらに、それぞれの block size、capacity unit value、requests per AI unit も示されている。たとえば Pinned AI は 100 interactions を単位に見る一方、On-Demand AI は 1 interaction 単位で扱われる。AI Knowledge Indexing は 1,000 interactions の block だ。

この設計が示しているのは、AI の利用量を「だいたい増えた」ではなく、**どの機能が、どのシステムで、どのくらい消費したか** として管理する必要があるということだ。生成 AI 導入では、PoC の段階ではコストが見えにくい。無料枠、promotion、個別契約、部門負担が混ざるからだ。しかし本番運用になると、利用量と予算、価値、部門別負担が必ず問題になる。

WalkMe は AI unit の transaction rates が最終確定前で変わる可能性も明記している。これは、利用量監視を早い段階から入れておくべき理由でもある。価格が変わる可能性があるなら、なおさら「どの業務がどれだけ使っているか」を知らないと契約判断ができない。

## 事実: Proactive AI は知識ソース、Action Bar、Memory、Dashboard を束ねる

Proactive AI の getting started ページを見ると、WalkMe が想定している運用の全体像が分かる。AI Center では、ファイルや Web ページなどの knowledge sources を取り込み、text extraction と vector embeddings による semantic search の準備をする。Action Bar には、summarize、translate、tone adjustment、clarify などの AI skills や、Custom AI Actions、Joule Skills が並ぶ。

AI Launchers は、ユーザーの現在の作業やページ内容に応じて、関連する action を表示する。AI-selected Launchers では、あらかじめ決めた一つの action ではなく、複数候補の中から AI が runtime で適切なものを選ぶ。AI Conditions は、自然言語の条件で WalkMe content の表示判断を行う。Memory は、過去の利用や個人設定をもとに、より関連性の高い提案を出す。

さらに、Action Bar Overview Dashboard と AI Dashboards で、どこで AI actions が表示され、どこで使われているかを見る。ここまで含めて考えると、WalkMe は AI を単体機能として売っているのではなく、**知識、画面、提案、記憶、計測をつないだ現場定着システム** として組み立てている。

## 事実: Learning Arc は AI authoring と SAP Enable Now 移行を含む

Q2 release のもう一つの柱が WalkMe Learning Arc だ。公式説明では、AI-powered content generation をコース全体、lesson、paragraph という3段階で使い分けられるようにしたとされている。つまり、研修コンテンツを全部作り直すだけでなく、特定 lesson や一部 paragraph だけを AI で調整できる。

これは日本企業の研修運用に合っている。大企業では、全社共通の言い回し、コンプライアンス表現、部門別の手順、法令・社内規程の更新が混ざる。AI で全体を一括生成すると速いが、品質とトーンがぶれやすい。一部だけ AI に任せられるなら、速度と統制のバランスを取りやすい。

また、SAP Enable Now から WalkMe Learning Arc への移行支援も含まれる。複数 workspace の import、既存 URL の redirect、オンプレミスから cloud への migration path が示されている。SAP を使う日本企業にとって、これは単なる研修ツールの移行ではなく、業務システム刷新やクラウド移行に伴う学習資産の再整理になる。

## 分析: 評価軸は「AIチャットの性能」ではなく「定着と統制」

ここからは分析だ。

WalkMe Q2 '26 を評価するとき、AI チャットの回答品質だけを見ても不十分だ。むしろ重要なのは、WalkMe が次の5つを一つの運用面に寄せていることだ。

1つ目は、業務画面内の文脈取得。AI Chat や Smart Highlights は、ユーザーが今見ている画面を前提にする。2つ目は、既存権限との整合。Smart Highlights は既存 user permissions を尊重するという設計を打ち出している。3つ目は、利用量の可視化。AI Usage Dashboard は AI unit を capability と system ごとに追う。4つ目は、研修と定着支援。Learning Arc は AI authoring と Learning Journeys を持つ。5つ目は、管理コンソールの統合。Admin Center が Console へ寄り、Survey や Desktop Guidance、Mobile Guidance も同じ release で整理されている。

この組み合わせは、AI 導入を現場に残すためのものだ。日本企業では、AI の導入発表は早いが、日々の業務に入り込むまでに時間がかかる。理由は、現場が使う画面が複雑で、権限が部門ごとに違い、研修が古くなり、利用量の説明ができないからだ。WalkMe の更新は、そのボトルネックにかなり近い場所を触っている。

[Microsoft 365 Copilot更新、AI業務設計の焦点](/blog/microsoft-365-copilot-cowork-agent-2026/)では、AI に何を委任するかを先に決める必要があると整理した。WalkMe の場合、その委任先は「AI エージェントに仕事を丸ごと頼む」というより、社員が操作している画面で、次に見るべき情報や行動を出す支援だ。委任というより、作業面の補助線に近い。

## 分析: 日本企業での導入順序

日本企業がこの更新を試すなら、いきなり全社展開を考えるべきではない。導入順序は次のようにするのが現実的だ。

まず、対象業務を一つに絞る。候補は営業の更新漏れ、CS のエスカレーション、SAP の購買申請、人事の入社手続き、ITSM のチケット対応などだ。重要なのは、画面遷移が多く、判断に必要な情報が複数システムに散っている業務を選ぶことだ。

次に、対象システムと権限を棚卸しする。Smart Highlights や AI Chat を出す画面、参照するシステム、IDP グループ、ロール、監査ログを整理する。WalkMe が既存権限を尊重するとしても、自社側の権限が壊れていれば意味がない。

3つ目に、AI unit の初期 KPI を決める。単に利用回数を増やすのではなく、どの capability が使われ、作業時間、問い合わせ数、入力ミス、研修完了率にどう影響したかを見る。AI Usage Dashboard は消費量を見せるが、業務価値との接続は企業側が設計する必要がある。

4つ目に、Learning Arc や既存研修との接続を決める。画面内ガイダンスで補える内容と、研修コースで教える内容を分ける。よくある失敗は、研修資料は研修部門、WalkMe は業務部門、AI 利用量は情シス、という形で管理が分断されることだ。今回の release は、その分断を減らす方向に使うべきだ。

5つ目に、rollout 地域とデータセンターを確認する。SAP データセンターは US/EU より遅い提供予定になっている。グローバル企業や日本本社から海外拠点へ展開する企業では、利用できるタイミングとデータ所在を契約・セキュリティ部門と確認する必要がある。

## リスク: 便利な画面内AIほど境界設計が要る

WalkMe の方向性は実務的だが、リスクもある。画面内 AI は便利なぶん、境界が曖昧になりやすい。

Smart Highlights が enterprise systems の情報をその場に出すなら、ユーザーが「どの情報源から出た情報か」を理解できる必要がある。AI Chat が画面文脈を読むなら、どの画面では有効化してよいか、どの画面では禁止するかを決める必要がある。Memory が個人設定や過去行動を使うなら、保存される内容と削除方法を説明できる必要がある。

また、AI Usage Dashboard は管理に役立つが、監視感を生む可能性もある。部署別、システム別、capability 別に利用量が見えるなら、利用促進にも使える一方で、現場には「AI 利用が見張られている」と受け取られることもある。日本企業では、AI 活用を評価や個人監視に直結させるのではなく、業務改善と予算管理のための集計として説明することが重要だ。

さらに、Learning Arc の AI authoring は研修作成を速くするが、法務、人事、コンプライアンス領域では生成内容の承認プロセスが必要だ。AI が作った paragraph をそのまま教材にするのではなく、責任部門のレビューを挟むべきだ。

## まとめ

WalkMe Q2 '26 Product Release は、生成 AI を業務現場に定着させるための更新として読む価値がある。Smart Highlights と AI Chat は業務画面内で支援を出し、AI Usage Dashboard は AI unit 消費を管理し、Proactive AI は knowledge sources、Action Bar、Memory、Dashboards をつなぎ、Learning Arc は研修と SAP Enable Now 移行まで含める。

日本企業が注目すべきなのは、AI の派手さではない。**AI をどの業務画面に出し、どの権限で動かし、どのくらい使われ、どの研修や改善に戻すか** だ。WalkMe の今回の release は、その問いにかなり近いところを製品化している。

まずは、営業、CS、SAP 業務、人事、ITSM のような具体業務を一つ選び、画面内支援、既存権限、AI unit、Learning Arc、管理コンソールをまとめて検証するのがよい。AI を別ツールとして足すのではなく、業務画面に安全に重ねる設計が、これからの現場導入では重要になる。

## 出典

- [Q2 '26 Product Release](https://support.walkme.com/knowledge-base/q2-26-product-release/) - WalkMe Help Center
- [AI Usage Dashboard](https://support.walkme.com/knowledge-base/ai-usage-dashboard/) - WalkMe Help Center
- [Proactive AI: Getting Started](https://support.walkme.com/knowledge-base/walkme-ai-guide/) - WalkMe Help Center
