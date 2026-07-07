---
article: 'openai-chatgpt-workspace-agent-excel-pricing-2026'
level: 'expert'
---

OpenAI の 2026年7月6日更新は、ChatGPT Business / Enterprise / Edu の業務AIを費用管理の対象として見直す節目である。Workspace Agent runs と ChatGPT for Excel/Sheets tasks が token-based pricing に入り、ChatGPT for PowerPoint も Business と Enterprise では 2026年8月6日までの無料期間後に同じモデルへ移る。Rate Card は、入力 tokens、cached input tokens、出力 tokens に分けて credits を計算する設計を明示した。

これは、ChatGPT を一般的な会話ツールとして配る段階から、業務ワークロードごとに変動費を管理する段階へ移ったということだ。席数、含有利用枠、credits pool、app 権限、agent schedule、spreadsheet の大きさ、資料生成の回数が同じ管理面に入ってくる。日本企業では特に、Excel と PowerPoint が業務成果物の中心に残っているため、影響は開発部門だけに閉じない。

今回の論点は、[ChatGPTタスク刷新](/blog/openai-chatgpt-scheduled-tasks-management-2026/) の proactive work、[ChatGPT for Excel](/blog/openai-chatgpt-for-excel-financial-data-2026/) の表計算面、[ChatGPT Enterprise利用上限](/blog/openai-chatgpt-usage-limits-enterprise-2026/) の credits 管理と連続している。さらに [OpenAI Codex座席設計](/blog/openai-chatgpt-business-codex-seats-2026/) で扱った workspace credits の考え方とも重なる。ただし今回は Codex だけではなく、業務部門が使う agent、spreadsheet、presentation の原価管理である。

## 事実: 固定単価ではなくtoken構成で変動する

OpenAI の Business Release Notes は、Workspace Agent runs と ChatGPT for Excel/Sheets tasks が token-based pricing を使うと説明している。Business plan では、Workspace Agents、Excel、PowerPoint の利用が general Codex agentic usage pool に含まれ、feature ごとに pricing が有効化されると included usage から消費される。Flexible pricing は、その included limits を延長する手段として位置づけられる。

Rate Card はさらに具体的だ。ChatGPT for Excel/Sheets、PowerPoint、Workspace Agents は、入力 tokens、cached input tokens、出力 tokens ごとの credits per 1M tokens で表に分けられている。GPT-5.5 の Excel/Sheets と PowerPoint は同じ rates が示され、Workspace Agents には GPT-5.5 と GPT-5.4 が載る。GPT-5.5 の Workspace Agent run の例では、入力、cached input、出力を足し合わせて credits を計算する。

ここで、管理者が理解すべき点は3つある。

第一に、実行回数だけでは費用が読めない。1日10回の短い agent run より、週1回の巨大 spreadsheet 解析のほうが高くなる可能性がある。第二に、cached input の効き方が費用に影響する。同じ文脈を再利用できる定型作業と、毎回異なる資料を読む非定型作業ではコスト構造が違う。第三に、出力の長さが費用に直結する。長い調査レポート、詳細なスライド案、複数パターンの提案書を出させる運用は、利用者が思うより credits を使う。

Rate Card の典型値は導入計画の初期仮説として使える。Excel/Sheets は 5 から 20 credits、PowerPoint は 10 から 50 credits、GPT-5.5 Workspace Agent run は 5 から 25 credits 程度の例が示されている。しかし、このレンジをそのまま予算に置くのは危険である。対象ファイル、業務手順、出力品質要求、再実行回数によって上振れするからだ。

## 事実: PowerPointの猶予期限は移行計画に使う

PowerPoint の扱いは、財務管理上の重要な移行期間である。OpenAI は、ChatGPT for PowerPoint usage が Business と Enterprise customers では 2026年8月6日まで無料で、その後は Excel/Sheets と同じ token-based pricing に入ると説明している。これは、資料作成の利用実態を測る猶予期間として使うべきだ。

日本企業では PowerPoint が意思決定の表面にある。稟議、役員会、顧客提案、プロジェクト報告、採用説明、研修資料、IR 準備、営業会議が PowerPoint に寄る。AIがスライド案、構成、要約、図表、話者メモを作るなら、利用は横展開しやすい。無料期間に定着した作業は、8月6日以降に credits 消費として現れる。

したがって、無料期間中に見るべき指標は「使われたか」だけではない。どの部門が、どの種類の資料を、何回作り直し、どの程度人間が修正し、最終成果物にどれだけ残ったかを見る必要がある。営業提案の初稿だけなら価値があるかもしれないが、何度も再生成して結局ほぼ使わないなら、credits 消費に見合わない。

PowerPoint は情報漏えいリスクも強い。提案書や役員会資料には、顧客名、価格、ロードマップ、未公開財務、採用計画、組織変更が入りやすい。課金開始の話は費用だけでなく、app 権限、ファイル分類、レビュー責任、外部提出前チェックと同時に扱う必要がある。

## 分析: 部門配賦の単位を作らないと混乱する

ここからは分析である。

日本企業がこの更新で最初に設計すべきなのは、credits の配賦単位だ。全社で1つの shared pool を持つだけでは、どの部署のどの業務が費用を作っているか分からない。営業、経営企画、財務、人事、開発、法務、カスタマーサポートのそれぞれが、異なる agent と Office 系 task を使う。請求上は1つでも、運用上は cost center を分けるべきだ。

最低限、agent 名、owner 部門、利用目的、接続 apps、実行頻度、参照データ分類、平均 credits、最大 credits、月次見込み、停止責任者を台帳にする。Excel/Sheets task は個人作業に見えやすいため、重要ファイルだけでも、対象 workbook、用途、データ分類、利用部署、レビュー責任、再実行回数を記録する。PowerPoint は無料期間中から、資料種別と利用部門を記録する。

この台帳はセキュリティ台帳と分けないほうがよい。agent が読むデータが広いほど、入力 tokens は増えやすく、情報リスクも上がる。つまり、権限最小化はコスト最小化にも効く。Google Drive 全体を読める agent より、特定 folder と承認済み docs だけを読む agent のほうが、説明責任と費用予測の両方で扱いやすい。

また、利用上限と予算承認を分ける必要がある。Usage limits は、暴走や想定外利用を止めるガードとして重要だが、上限を低くしすぎると有用な業務も止まる。予算管理では、上限超過時に自動停止するのか、部門 owner の承認で追加 credits を使うのか、月末まで待つのかを決める。特に月次決算、四半期報告、採用ピーク、リリース前の資料作成は利用が偏るため、平常月の平均だけでは足りない。

## 導入設計: 最初の30日で測ること

最初の30日は、機能展開ではなく測定設計に使うべきだ。対象を3つに分ける。第一に、Excel/Sheets の低リスク作業である。社内公開データ、ダミーデータ、部門内集計、既存表の説明などから始める。第二に、Workspace Agents の低頻度 run である。週次調査、会議準備、FAQ更新確認のように、人間が必ず読むものに限定する。第三に、PowerPoint の無料期間測定である。顧客提出前ではなく、社内ドラフトや構成案から始める。

測る項目は、credits だけではない。task の前後で人間の作業時間が減ったか、出力の再修正がどれくらい必要だったか、入力ファイルの選定に時間がかかったか、権限エラーや app approval がどれだけ出たか、生成物が最終成果物に残ったかを見る。credits が少なくても、修正が多いなら価値は低い。credits が高くても、月次作業を大きく短縮するなら継続価値がある。

費用の見方も平均だけでは足りない。p50、p90、最大値を分ける。通常の Excel task は 8 credits 程度でも、四半期に一度の巨大 workbook 解析が 80 credits になるなら、上限設計が変わる。agent run も、短い通知と長い調査では別のワークロードとして扱う。

この30日測定の最後に、3つの判断をする。継続する業務、権限や手順を絞って継続する業務、停止する業務である。無料期間や初期枠のうちにこの判断をしないと、便利だから残る、誰も owner ではない、しかし credits は消費する、という状態になりやすい。

## 管理者が作るべきチェックリスト

管理者は、まず ChatGPT の機能名ではなく業務名で登録する。たとえば「営業提案PowerPoint初稿」「月次売上Excel差異説明」「週次競合調査Agent」「採用候補者FAQ更新Agent」のように書く。機能名だけでは、費用もリスクも説明できない。

次に、接続 apps と action を見る。Workspace Agents が Slack、Drive、SharePoint、Calendar、CRM を使う場合、read だけか write もあるか、schedule されているか、人間承認があるかを確認する。Excel/Sheets では、使う workbook が個人管理か共有管理か、重要データを含むか、外部提出に使うかを見る。

第三に、PowerPoint の猶予期限をカレンダーに入れる。2026年8月6日までの利用実績を集め、8月前半に継続判断をする。無料期間後に突然禁止すると現場が困るため、継続対象と停止対象を先に分ける。

第四に、利用者向けガイドを短く作る。大きなファイルをむやみに読ませない。同じ資料の再生成を繰り返さない。不要な agent schedule を止める。顧客情報や未公開情報を扱う場合は承認済み workspace と approved apps だけを使う。こうした行動が費用とリスクの両方に効くことを説明する。

第五に、月次レビューを経理だけに任せない。情シス、業務 owner、セキュリティ、経理が同じ usage dashboard と台帳を見る。費用超過だけでなく、価値が出ていない agent、使われていない PowerPoint 作成、権限エラーの多い Excel task を整理する。

## まとめ

OpenAI の ChatGPT 業務AI課金更新は、Workspace Agents、Excel/Sheets、PowerPoint を「便利機能」から「管理すべき業務ワークロード」へ移すものだ。token-based pricing は、利用者の体感より細かく費用を変動させる。入力が大きい、出力が長い、再実行が多い、接続アプリが広い、定期実行される。これらはすべて credits 消費につながる。

日本企業が取るべき現実的な対応は、全社禁止でも全社解放でもない。業務別に owner を置き、credits を部門別に見る。PowerPoint の猶予期間を測定に使う。Excel/Sheets と Workspace Agents は、ファイル分類、app 権限、実行頻度、出力レビューをセットで設計する。そうすれば、ChatGPT の業務AIを費用不明のシャドーAIではなく、測定可能な業務基盤として扱いやすくなる。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center, 2026-07-06
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
- [ChatGPT Rate Card (Business, Enterprise/Edu)](https://help.openai.com/en/articles/11481834-chatgpt-rate-card-business-enterpriseedu) - OpenAI Help Center, 2026-07-07確認
