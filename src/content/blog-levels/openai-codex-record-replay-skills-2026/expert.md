---
article: 'openai-codex-record-replay-skills-2026'
level: 'expert'
---

OpenAI Codexの**Record & Replay**は、GUI操作を記録して再生するだけのRPA機能ではない。利用者の実演を観察し、再利用可能なskillの初稿へ変換するauthoring surfaceである。企業導入では、「画面操作を自動化できるか」より、観察された操作をどのように明示的な入力、手順、検証条件、権限境界へ変換するかが重要になる。

この更新は、[Codex長時間運用](/blog/openai-codex-maxxing-long-running-work-2026/)で扱った持続thread、memory、tools、reviewの流れと連続している。長く続く仕事をCodexへ任せるには、一般的な指示だけでなく、組織固有の反復手順が必要になる。Record & Replayは、その手順を現場の実演から取得する入口だ。

また、[Codex役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/)と同じシリーズで見ると、skillとpluginの境界がより重要になる。Record & Replayが個人や小チームのworkflow authoringを速め、pluginが安定した配布、依存関係、管理メタデータを担う構造である。

## 事実: Record & Replayの実行モデル

公式ドキュメントでは、Record & ReplayはmacOSで利用でき、Computer Useが利用可能かつ有効であることが前提とされる。初期提供では欧州経済領域、英国、スイスが除外される。組織が`requirements.toml`でCodexを管理している場合、`[features].computer_use`要件がRecord & Replayにも適用され、`computer_use = false`なら両方を利用できない。

利用者はCodex appの`Plugins`から`Record a skill`を選び、目的や前提を渡して録画を承認する。録画中、Codexはワークフローを学ぶために必要な操作とウィンドウ内容を観察する。利用者が停止するまで録画は続く。

停止後、Codexは取得したワークフローを調べ、skillを下書きする。公式資料が明示する構成要素は、利用条件、必要入力、実行手順、結果の検証方法である。利用者は生成後のskillを追加指示で修正できる。

再実行は新しいthreadから行う。その回で変化する値、たとえばアップロード対象、issue、日付範囲を渡すと、Codexはskillを再利用コンテキストとして使い、現在の環境で利用可能なComputer Use、ブラウザ操作、pluginを組み合わせる。

ここで重要なのは、録画結果が固定座標のイベント列として説明されていない点だ。出力はskillであり、実行時の環境とtoolsに合わせてCodexが手順を遂行する。つまり、Record & Replayはdeterministic macro recorderではなく、demonstration-to-instructionsの変換器として理解すべきである。

## 事実: skillはworkflow、pluginは配布単位

OpenAIのAgent Skills資料では、skillはCodexにタスク固有の能力を追加するためのinstructions、resources、optional scriptsのまとまりである。skillは再利用workflowのauthoring formatであり、pluginはskillやappをインストール可能にするdistribution unitと整理されている。

skillには`SKILL.md`があり、少なくともnameとdescriptionを持つ。Codexは利用可能なskillの概要から対象を選び、必要になったときだけ完全な指示を読み込む。descriptionが暗黙呼び出しのtriggerとして働くため、生成後のレビューでは手順だけでなく適用範囲も確認する必要がある。

Record & Replayの資料は、独立した安定パッケージとしてチームへ配布する場合、複数skillを束ねる場合、app integrationやMCP server、install metadataを含める場合にplugin化するよう案内している。したがって、録画から生成したskillをそのまま組織標準とみなすのは適切ではない。

[ChatGPT Businessのプラグイン管理](/blog/openai-chatgpt-business-plugin-admin-controls-2026/)で見たように、組織配布では誰が利用可能か、既定導入するか、どのapp権限を継承するかが別の管理面になる。authoringとdistributionを分離すると、現場の改善速度を止めずに全社統制を維持しやすい。

## 分析: demonstrationからpolicyを抽出する必要がある

ここからは分析である。

実演は具体的だが、不完全な仕様である。ある利用者が画面で選んだ値には、会社規程による必須値、本人の好み、たまたまその回だけ必要だった値が混在する。録画だけでは、この三つを区別できない。

生成skillのレビューでは、観察された各選択を次のように分類すべきである。

- invariant: 会社規程やシステム契約で常に固定する値
- variable input: 実行ごとに利用者が与える値
- derived value: 入力や外部データから計算する値
- preference: 利用者またはチームの既定値
- decision point: 条件によって分岐する判断
- approval gate: 人間の承認なしに越えてはいけない境界

たとえば経費申請なら、部門コードは利用者属性から導出し、利用日は入力、税区分は領収書と規程で分岐し、申請確定は人間承認にする。録画で一度選択された部門コードを固定値として残すと、別利用者の再実行で誤申請につながる。

したがって、Record & Replay後の作業は「録画の誤りを直す」だけではない。実演に埋め込まれたpolicyを抽出し、どの値が誰の責任で決まるかを明文化する仕様化工程である。

## 分析: セキュリティ境界は録画時と再実行時で二重に持つ

Record & Replayには二つの異なるリスク面がある。

第一は録画時の観察範囲である。Codexは操作とウィンドウ内容を見るため、対象外タブ、通知、メール、認証情報、顧客情報が映り得る。公式資料は秘密情報と機微情報を避けるよう勧めるが、企業運用では個人の注意だけに依存すべきではない。

録画用のテスト環境、ダミーデータ、専用ブラウザプロファイル、通知停止、対象外アプリの終了を標準手順にする。可能なら録画前チェックリストを用意し、データ分類上の禁止項目を具体化する。「秘密を映さない」ではなく、「password manager、customer production、HR system、private chatを開かない」と対象を列挙する。

第二は再実行時のaction scopeである。Computer Useは、許可されたアプリを視覚的に操作できる。システム権限、Codexでのapp approval、threadのsandboxやcommand approvalは別レイヤーである。録画時に安全だった操作でも、再実行時のログインユーザーが強い権限を持てば影響が変わる。

このため、skillには対象アプリだけでなく、許可するaction typeを記載する。read、draft、create、update、send、publish、delete、approveを分け、初期版ではread、draft、低リスクcreateまでに絞る。send、publish、delete、approveは明示的な人間確認を置く。

この考え方は、[Codex Developer mode](/blog/openai-codex-260609-reset-developer-mode-2026/)のCDP承認と同じである。操作能力を有効にする管理設定と、特定workflowで許可する操作は別に管理する必要がある。

## 分析: 検証可能性をskillの中心に置く

GUI自動化の品質は「最後まで動いたか」だけでは測れない。誤った値で最後まで進むほうが危険だからだ。Record & Replayが生成するskillに検証方法が含まれる点は、企業利用で重要である。

検証条件は、できるだけ観察可能な結果にする。issue作成ならrepository、title、labels、assignee、本文テンプレート、作成URLを確認する。レポート取得なら期間、filter、row count、download filename、更新日時を確認する。動画公開前の下書きなら公開状態がdraftであること、title、description、visibility、scheduled timeを確認する。

さらに、検証を三段階に分けるとよい。

1. precondition: 正しいアカウント、環境、対象データか
2. postcondition: 意図した成果物が作られたか
3. negative condition: 送信、公開、削除など禁止操作が起きていないか

UIが変わった場合の停止条件も必要である。期待するfieldや確認画面が見つからないとき、類似ボタンを推測して進めず停止する。ログイン切れ、権限不足、入力validation error、二重作成の疑いも停止条件にする。

## 分析: RPA、API連携、skillを使い分ける

Record & Replayが登場しても、すべての定型業務をComputer Useへ寄せるべきではない。構造化されたAPIやpluginがあるなら、データアクセスと反復操作はそちらのほうが安定しやすい。Computer Useは、APIがないGUI、複数アプリをまたぐ確認、視覚的な状態判断が必要な箇所に使う。

従来型RPAは、画面や入力が安定し、決定論的に同じ手順を大量実行する場合に強い。Record & Replayから作るskillは、自然言語の入力、環境に応じたtool選択、人間の好み、軽い分岐を含むworkflowに向く。ただし、柔軟性がある分、毎回同じイベント列を保証するものではない。

実務では次の分離が合理的である。

- API/plugin: 構造化データの読み書き、監査可能な業務操作
- script: deterministicな変換、検証、ファイル処理
- Computer Use: GUIでしか到達できない操作、視覚確認
- skill: それらをどう組み合わせるかというworkflowと判断条件

生成skillをレビューするとき、画面操作で行っている一部をAPIやscriptへ移せないかを見る。Record & Replayは最終実装を決めるものではなく、現行手順を観察し、より安定した構成へ分解する材料にもなる。

## 分析: チーム展開には昇格基準と変更管理が必要

個人skillからteam pluginへ昇格する条件を先に決める。少なくとも、複数利用者が必要としている、3回以上異なる入力で成功している、ownerがいる、禁止操作と停止条件がある、依存appが明示されている、テスト用データで再検証できることを求めたい。

plugin化した後は、version、changelog、reviewer、最終検証日を持つ。対象SaaSのUI変更、認証方式変更、社内規程変更、field追加、plugin権限変更を再検証triggerにする。特にGUI依存部分は、コードのunit testだけでは劣化を検出できない。

利用ログも必要だが、記録範囲には注意する。誰がいつどのskillを使い、成功・停止・手動修正のどれになったかは改善に役立つ。一方、入力データや画面内容を丸ごと保存すると、新たな情報管理リスクを作る。運用メタデータと業務データを分離する。

評価指標は、単純な実行回数ではなく、手動時間削減、手戻り率、停止率、誤操作件数、人間確認時間、UI変更後の復旧時間を見る。人間確認が適切に残っているなら、完全自動化率が低くても成功である。

## 日本企業向け導入設計

最初のpilotは、1業務、2利用者、2週間程度に絞る。候補選定では、反復頻度、手順安定性、取り消し可能性、データ機密度、結果検証性を5段階で評価する。高頻度でも高機密・不可逆な仕事は除外する。

録画前に、目的、input schema、禁止データ、許可action、approval gate、success criteriaを書く。テスト環境で録画し、生成skillをpolicy分類に沿って修正する。作成者以外が再実行し、暗黙の前提が残っていないかを見る。

pilot終了時は、個人skillの継続、team documentationへの転記、plugin昇格、廃棄の四択で判断する。利用価値があっても、GUI変更が激しく保守負荷が高いなら廃棄またはAPI連携への置換を選ぶ。

Record & Replayの価値は、自動化本数を増やすことではない。現場の実演からworkflowを取り出し、入力、policy、権限、検証へ変換する時間を短縮することにある。その変換工程を省かず、authoringとdistributionを分ければ、日本企業でもComputer Useを含む定型業務skillを小さく安全に育てられる。

## 出典

- [Record & Replay](https://developers.openai.com/codex/record-and-replay) - OpenAI Developers
- [Agent Skills](https://developers.openai.com/codex/skills) - OpenAI Developers
- [Computer Use](https://developers.openai.com/codex/app/computer-use) - OpenAI Developers
- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan) - OpenAI Help Center
