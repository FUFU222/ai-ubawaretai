---
article: 'openai-ai-scorecard-successful-task-roi-2026'
level: 'expert'
---

OpenAIの2026年7月17日付「AI age scorecard」は、企業AIの評価軸をモデル性能から業務成果へ移す文書として読むべきだ。目立つのはGPT-5.6の効率やChatGPT Workの文脈だが、実務上の核は、useful work、cost per successful task、dependability、value at scaleを同じ管理フレームに置いた点にある。

この文脈は、直前の [OpenAI AI投資管理](/blog/openai-ai-investment-agentic-era-spend-governance-2026/) と連続している。投資管理記事は、usage、spend、ROI、governance、capacityの手順を扱った。今回のscorecardは、その運用を評価するためのKPI体系に近い。日本企業がAI予算を継続するには、seat数やtoken単価ではなく、成功した業務単位で費用と品質を説明する必要がある。

さらに、[ChatGPT Work移行](/blog/openai-chatgpt-agent-work-migration-2026/) によって、旧agent的な作業はWork、Codex、Chatへ整理され始めている。AIが資料作成、表計算、検索、コード、接続アプリをまたぐほど、評価単位も「会話」ではなく「workflow」へ移す必要がある。

## 事実: scorecardは4つの問いで構成される

OpenAIは、AIの価値を4つの問いで測る構成を示している。第一に、AIがどれだけuseful workを生み出すか。第二に、successful taskあたりのコストがどう変わるか。第三に、AIの出力がどれだけdependableか。第四に、利用が増えるほどAI dollarあたりの成果が増えるかである。

第一のuseful workは、出力量や利用回数とは違う。業務で使える成果物ができたかを見る。営業準備、経営資料、法務下書き、コード変更、データ分析、問い合わせ分類のように、仕事の種類ごとに成果基準を置く必要がある。

第二のcost per successful taskは、モデル単価だけではなく、完了までの総費用を見ろという意味である。入力、出力、cache、tool call、再試行、実行時間、人間レビュー、修正、エスカレーションを合わせて、成功した仕事1件あたりの費用を計算する。安いモデルでも、失敗や修正が多ければ安くない。高いモデルでも、最初の1回で使える成果になるなら、総費用は下がり得る。

第三のdependabilityについて、OpenAIは出力をReady to use、Needs correction、Needs escalationのように分ける考え方を示している。これはAI品質を業務運用へ落とすうえで重要である。単なる正答率ではなく、人間の作業をどれだけ残すかを見るからだ。

第四のvalue at scaleは、利用が広がったときに効率が改善するかを見る。AI導入は、初期PoCでは成功しても、部門展開で崩れることがある。プロンプト、ナレッジ、評価、接続アプリ、権限、監査、費用配賦が標準化されなければ、利用回数の増加はそのままレビュー負荷と支出増になる。

## 事実: GPT-5.6とWorkは測定対象を広げた

GPT-5.6の発表では、OpenAIは性能だけでなく、token効率、agentic coding、長時間タスク、ChatGPT Work、Codex、APIでの利用をまとめて訴求している。つまり、AIは短い応答の品質だけではなく、複数ステップの仕事をどれだけ完了できるかで評価される段階に入った。

ChatGPT Workの発表も同じである。Workは接続済みアプリ、ファイル、文書、表計算、プレゼン、レポート、Sitesを扱う作業面として説明されている。これは、チャットの応答を評価するだけでは足りないことを意味する。AIがDrive、Sheets、PowerPoint、Web、ローカルファイル、Codex、外部アプリをまたぐなら、測定対象はworkflow全体になる。

[ChatGPT業務AI課金開始](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) で扱ったように、Excel/Sheets、PowerPoint、Workspace Agentsはtoken-based pricingやcredit poolと結びつく。費用の発生単位がworkflowに近づくなら、成果の測定単位もworkflowに寄せるべきである。

また、[ChatGPT横断検索](/blog/openai-chatgpt-unified-search-project-files-2026/) のように、過去チャット、Projects、画像、文書を探せるようになるほど、過去成果の再利用も測定対象になる。同じ調査を何度もやり直しているのか、過去Projectを参照して時間を減らしているのかは、AI ROIに直接効く。

## 分析: 成果単価はAI FinOpsの中心指標になる

ここからは分析である。

日本企業でAI導入が広がると、最初に問題になるのは費用配賦である。誰が使ったか、どの部署が負担するか、上限をどこに置くか。しかし、これだけでは不十分だ。支出が増えた理由が、無駄な試行なのか、価値ある業務が増えたのかを判別できないからである。

成果単価を中心に置くと、この問題を分解できる。たとえば、営業準備workflowで、AI実行1回あたり15 credits、人間確認10分、Ready比率70%なら、商談準備1件あたりの費用と時間削減を計算できる。法務下書きworkflowで、AI実行1回あたり10 creditsでも、Needs correctionが90%でレビュー時間が増えるなら、モデル、プロンプト、対象業務、承認線を見直す判断になる。

開発組織でも同じである。CodexでPR下書きを作る場合、成功の単位は「コードが生成された」ではない。テストが通り、レビュー可能な差分になり、不要な変更や危険な依存追加がなく、開発者の修正時間が減った状態を成功にするべきだ。単に実行回数やtoken消費を見るだけでは、AIが開発速度を上げたのか、レビュー負荷を増やしたのか分からない。

この意味で、AI FinOpsは従来のSaaS FinOpsより業務設計に近い。seat、契約、使用量、予算だけでなく、workflow owner、入力データ、出力先、承認、品質基準、停止条件を持つ必要がある。OpenAIのscorecardは、FinOps、業務改革、セキュリティ、データ管理を同じテーブルに載せるための言葉を提供している。

## 実装: Ready / Correction / Escalationを標準分類にする

最小実装は、AI業務台帳に3分類を入れることだ。各workflowの実行結果を、Ready to use、Needs correction、Needs escalationに分ける。最初は手入力でもよい。重要なのは、AI出力を「良い/悪い」の感想で終わらせず、人間作業の残り方で記録することである。

Ready to useは、出力が業務の品質基準を満たした状態である。営業資料なら顧客名、数値、提案方針、出典が確認済みで、担当者が使える。コードならテストが通り、lintや型チェックを満たし、レビューに出せる。社内FAQなら、根拠リンクがあり、回答として公開できる。

Needs correctionは、AI出力が下書きとして有用だが、人間の修正が必要な状態である。誤字や文体だけなら軽い修正だが、数字、出典、前提、コード設計、顧客分類の修正が多いなら、コストとして計上する。修正時間を5分、15分、30分以上のように粗く分けるだけでも、成果単価の見え方が変わる。

Needs escalationは、AIだけでは進められない状態である。権限不足、データ不足、法務判断、セキュリティ判断、顧客影響、本番操作、モデルの不確実性が理由になる。ここを失敗として隠すと、AIがどの境界で止まるべきか分からなくなる。むしろ、エスカレーション理由は統制設計の材料にする。

月次レビューでは、workflowごとにReady比率、Correction平均時間、Escalation理由、credits、実行回数を見る。Ready比率が上がり、Correctionが下がり、Escalation理由が定型化されるなら、workflowは成熟している。逆に、利用量だけ増えてCorrectionとEscalationが増えるなら、AI利用は現場負荷を増やしている可能性がある。

## 設計: successful taskの定義を部門ごとに変える

successful taskは全社共通にしすぎないほうがよい。部門によって成功条件が違うからだ。

営業では、商談準備、議事録要約、提案書下書き、CRM更新を分ける。成功条件は、担当者が顧客に使える、情報の出典が明確、次アクションが整理されている、CRM更新が承認済み、などになる。

経営企画や財務では、Excel分析、月次報告、予算差異説明、投資メモを分ける。成功条件は、計算根拠が追える、前提変更が明示されている、元データが確認できる、意思決定者向けの論点が整理されている、などである。

開発では、仕様調査、実装、テスト追加、障害調査、PRレビューを分ける。成功条件は、テストが通る、差分が最小、セキュリティ上の問題がない、レビュー指摘が減る、CIで再現できる、などになる。

人事や採用では、候補者整理、求人票下書き、面接質問案、社内研修資料を分ける。成功条件には、公平性、個人情報の扱い、候補者への説明可能性が入る。AIが文章をきれいにしただけでは成功ではない。

この定義を置くことで、AI推進部門は各部門の成果を同じ軸で比較できる。ただし、比較するのは「どの部門が優秀か」ではなく、「どのworkflowに追加投資すべきか」である。Ready比率が高く、業務量が多く、リスクが管理可能なworkflowから広げるほうがよい。

## 統制: 成果単価と承認線を分けて設計する

成果単価が良いworkflowほど、すぐに自動化したくなる。しかし、成果が出ていることと、AIに操作権限を広げてよいことは別である。

たとえば、問い合わせ分類のReady比率が高いとしても、顧客への返信送信をAIに任せるかは別判断になる。月次レポートの下書き精度が高くても、財務数値の確定更新をAIに許すかは別である。Codexがテスト追加に強くても、本番deployやsecret更新を許可する理由にはならない。

したがって、AI業務台帳には成果KPIとは別に操作権限を持たせる。read only、draft only、write with approval、autonomous write disabled、external send disabledのように段階を分ける。Scheduled TasksやWorkのように、ユーザーが見ていない時間に動く処理は、実行頻度、通知先、失敗時の停止、最大credits、参照データを明記する。

費用上限も同じである。monthly credit limitは費用爆発を抑えるが、データアクセスの許可ではない。低い上限でも、機密情報に触れればリスクは高い。高い上限でも、公開情報の調査だけならリスクは低い場合がある。費用、データ、操作、品質は別々の列で管理する必要がある。

## 監査: 数字の作り方を残す

AI ROIを社内で説明するなら、数字の作り方も残すべきだ。Ready比率、Correction時間、Escalation件数、credits、削減時間をどう測ったかが曖昧だと、都合のよい成果報告になる。

最低限、workflowごとに、対象期間、対象ユーザー、対象タスク数、除外条件、モデル、接続アプリ、評価者、レビュー基準を書く。AI推進部門が自分たちだけで評価すると甘くなりやすいので、業務ownerとレビュー担当を分けるほうがよい。

また、baselineを持つ。AI導入前に同じ仕事が何分かかっていたか、何件処理できたか、品質問題がどれくらいあったかを記録する。baselineがなければ、AI導入後の費用だけが見え、改善幅を説明できない。

さらに、再利用効果も見る。ChatGPT Projectsや横断検索で過去成果を再利用できるなら、同じ調査や資料作成の重複が減る。この効果は、単発のAI実行コストには現れにくい。Project再利用率、過去ファイル参照率、同種タスクの平均Correction時間の低下として見るとよい。

## まとめ

OpenAIのAI scorecardは、企業AIを「使った量」から「成功した仕事」へ移すための評価フレームである。GPT-5.6やChatGPT Workのように、AIが長時間作業、接続アプリ、表計算、コード、資料作成へ広がるほど、成果単価、修正率、エスカレーション率、承認線を同じ台帳で見る必要がある。

日本企業が今すぐ作るべきものは、完璧なAI ROIシステムではない。部門別のAI業務台帳、successful taskの定義、Ready / Correction / Escalation分類、creditsと人間時間の記録、操作権限の列である。これがなければ、AI支出が増えたときに、投資なのか浪費なのかを説明できない。

## 出典

- [A scorecard for the AI age](https://openai.com/index/a-scorecard-for-the-ai-age/) - OpenAI, 2026-07-17
- [GPT-5.6: Frontier intelligence that scales with your ambition](https://openai.com/index/gpt-5-6/) - OpenAI, 2026-07-09
- [ChatGPT is now a partner for your most ambitious work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/) - OpenAI, 2026-07-09
