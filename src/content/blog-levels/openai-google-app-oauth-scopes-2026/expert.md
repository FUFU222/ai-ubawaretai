---
article: 'openai-google-app-oauth-scopes-2026'
level: 'expert'
---

OpenAI の Google App for ChatGPT - Data Controls FAQ にある 2026年6月15日の更新は、ChatGPT apps の企業展開における「最後の認可境界」を見直す話である。OpenAI は、ChatGPT に Google Drive files、BigQuery、Google Meet actions surfaced under Google Calendar を追加し、これらが追加の Google OAuth scopes を必要とすると説明している。既存接続が消えるわけではないが、未承認 scope を必要とする action では、接続、再接続、利用時に authorization error や admin approval error が出る可能性がある。

これは単なる Google 連携の拡張ではない。ChatGPT workspace admin、Google Workspace admin、情シス、法務、データ基盤チームが、同じ action / scope / data category を見て判断する必要がある更新だ。以前の [ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) では、App permissions、Action control、RBAC、Compliance Logs を分けて整理した。今回の Google scope 更新は、その設計を Google Workspace 側の OAuth app access control まで伸ばす。

## 事実関係: ChatGPT action と Google OAuth scope の対応を合わせる

OpenAI FAQ の中心は明確だ。ChatGPT で Google app actions を有効にするなら、Google Workspace 側で ChatGPT/OpenAI OAuth app を Trusted として扱うか、有効化する action に必要な scope を個別に承認する。もし scope を承認したくないなら、その scope を必要とする ChatGPT app action を無効にする。action が有効で scope がブロックされている状態を残すと、ユーザーは接続や利用の途中で失敗する。

FAQ は、Google app data の扱いも整理している。Google app を接続すると、ChatGPT はより関連性の高い情報を出すために indexed copy を作成し sync する場合がある。Google app を切断すると、この indexed copy は30日以内に削除される。OpenAI は、接続 Google app から直接同期されたデータやその派生データを、原則として generalized model training には使わないと説明している。ただし、フィードバック送信、手動コピーやアップロード、ChatGPT response に含まれたデータなどの例外がある。

Memory との関係も重要だ。FAQ は、Memory が有効な場合、Google app からアクセスした関連情報が personalized context や memory として使われうると説明している。ここは [ChatGPTメモリ刷新](/blog/openai-chatgpt-dreaming-memory-controls-2026/) の論点と直結する。OAuth scope は「アクセスできるか」、Memory は「アクセスした文脈を将来の応答に使うか」、App permissions は「実行前に確認するか」であり、互いに代替しない。

## 管理面: Google Workspace の app access control を読む

Google Workspace Help は、管理者が OAuth 2.0 settings を使って、Google-owned、internal、third-party apps の Workspace data access を管理できると説明している。app access control では、Configured apps、Accessed apps、Apps pending review を確認でき、app ごとに Trusted、Limited、Specific Google data、Blocked のような access setting を扱う。Accessed apps では、ユーザー数や requested services、つまり OAuth scopes も確認できる。

この仕組みは、ChatGPT 管理画面だけでは見えない。ChatGPT 側で Google Drive action を有効にしても、Google Workspace 側で Drive write scope を認めていなければ、ユーザーは action を実行できない。逆に、Google 側で ChatGPT/OpenAI app を広く Trusted にしておきながら、ChatGPT 側の actions を細かく見ていなければ、想定より広い action surface が開く可能性がある。

したがって、日本企業の実務では、Google Workspace 管理者が OAuth app の Trusted / Limited / Blocked を決め、ChatGPT 管理者が app availability、Action control、App permissions を決める、という分担だけでは足りない。両者が同じ scope/action mapping を持つ必要がある。特に Google Drive、BigQuery、Meet は、同じ Google app family でもデータ分類と操作リスクが異なる。

## Drive: 読み取り、編集、共有変更を分ける

Drive は最も導入しやすく、最も事故りやすい領域である。社内文書を ChatGPT に検索させ、会議資料や提案書の下書きを作る用途は分かりやすい。一方で、Drive には顧客提案、契約、採用資料、経営資料、障害報告、個人ドライブ、共有ドライブが混在する。OAuth scope では `drive.readonly`、`drive.metadata.readonly`、`drive.activity.readonly`、`drive` のような粒度があり、Docs、Sheets、Slides にはそれぞれ read / write 系 scope がある。

読み取りは比較的安全に見えるが、出力先によってリスクが変わる。ChatGPT が Drive 内の資料を要約して同じ会話に返すだけなら、権限のある利用者が見られる情報を使っていると整理しやすい。しかし、その要約をメール、Slack、外部文書、共有ファイルへ送る action と組み合わさると、情報の流れは変わる。ここでは [ChatGPTロックダウン全開放](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) で扱った外部送信制限と同じ発想が必要になる。

編集や共有変更はさらに別格だ。ファイルの作成、更新、移動、コピー、削除、共有権限変更は、単なる検索補助ではない。Apps in ChatGPT は、file upload、move、rename、sharing permissions の変更を important actions の例に挙げている。日本企業では、Drive write 系 action は初期導入では read-only に寄せ、Docs/Sheets/Slides の作成や更新を必要部署だけに限定し、共有変更は Action control で無効化するか Any changes 以上に寄せるのが現実的だ。

## BigQuery: 読めること自体が高リスクになる

BigQuery は Drive よりも「便利な社内検索」として扱いにくい。DWH には、売上、顧客行動、広告、ログ、決済、在庫、プロダクト利用、サポート履歴、場合によっては個人情報や仮名加工前のデータが含まれる。読み取り専用であっても、ChatGPT が分析結果を自然文で要約し、別の app action と組み合わせると、データ持ち出しや過剰共有のリスクが出る。

OpenAI FAQ は BigQuery scope として `bigquery`、`bigquery.readonly`、`bigquery.insertdata` を挙げている。企業が最初に見るべきなのは、ChatGPT に BigQuery への broad access を与える必要が本当にあるかだ。たとえば、全社 DWH へ直接つなぐのではなく、公開可能な sandbox dataset、集計済み view、低感度の BI 用 dataset から始めるほうが説明しやすい。

`bigquery.insertdata` は特に注意がいる。ChatGPT の役割が「分析相談」なのか、「データ処理の一部」なのかで責任が変わる。分析結果の SQL を提案するだけならレビューを挟めるが、データ投入や更新に近い action を許すなら、データ基盤の change management、監査ログ、失敗時の rollback、権限分離を設計する必要がある。生成AI推進チームだけで承認せず、データ基盤チームと個人情報保護担当を入れるべき領域である。

## Meet: 会議録は検索対象ではなく記録資産として扱う

Google Meet actions surfaced under Google Calendar には、Meet space lookup、conference records、recordings、transcripts、transcript entries、artifacts のような対象が含まれる。会議録は便利なナレッジ源だが、企業では高感度情報の塊でもある。採用面談、人事評価、法務相談、営業交渉、経営会議、障害対応、セキュリティインシデントの会議は、単なる「会話履歴」ではなく記録資産として扱う必要がある。

ChatGPT が Meet transcript を読めるようになると、会議後の要約、決定事項抽出、アクションアイテム整理は大きく楽になる。しかし、会議参加者が「後で ChatGPT に読まれる」ことを前提にしていない場合、透明性と同意の問題が出る。特に日本企業では、録画や議事録の扱いが部門ごとに違うことが多い。Meet action を有効化する前に、会議種別ごとの対象外ルールを作るべきだ。

実装上は、Calendar / Meet scope を許可する前に、会議録の保存場所、録画の保持期間、transcript 生成の有無、社外参加者を含む会議の扱いを確認する。ChatGPT action が利用できるからといって、すべての会議を AI searchable にする必要はない。ここは [OpenAIのOffline検索](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) と同じく、情報取得経路を使い分ける設計になる。

## App permissions だけでは不足する理由

App permissions は重要だが、今回の scope 更新に対する万能解ではない。Apps in ChatGPT では、Important actions が既定で、読み取りは自動、意味のある外部影響、機密情報露出、取り消しにくい操作では確認を求めると説明されている。これは実行時承認として有効だが、scope を広く許可した事実は消えない。

たとえば、Google Workspace 側で Drive broad scope を Trusted にし、ChatGPT 側で Important actions のままにした場合、読み取りは自動で進むことがある。読み取り結果がその場の回答に留まるなら問題は限定的だが、Memory が有効な場合は personalization へ影響しうる。さらに、別 app への action と組み合わされると、読み取った情報が外部コミュニケーションに混ざる可能性がある。

したがって、設計順序は scope 最小化、Action control、App permissions、Memory / data settings、Compliance Logs の順で見るべきだ。不要な scope は承認しない。不要な action は ChatGPT 側で無効化する。残す action に対して、Important actions か Any changes を選ぶ。Memory と connected app data の説明をユーザーへ出す。最後にログで実運用を検証する。

## 監査設計: エラーと利用状況の両方を見る

OpenAI は、scope が未承認の場合、ユーザーが connection、reconnection、action use のタイミングで error を見る可能性があると説明している。これは障害対応の観点でも重要だ。6月15日以降に Google app connection error が増えた場合、単なるユーザー操作ミスではなく、ChatGPT action と Google scope の不整合かもしれない。

監査では、まず設定差分を見る。ChatGPT で新しく有効になった Google actions は何か。Google Workspace で ChatGPT/OpenAI app に承認された scopes は何か。Business workspace のように new app actions が default enabled になりうる環境か。Enterprise / Edu のように apps が default disabled で、明示的に enable した環境か。これを時系列で残す。

次にログを見る。Apps in ChatGPT は、app calls が OpenAI Compliance Logs platform に記録されると説明している。Google Workspace 側にも app access control と API control の監査材料がある。日本企業では、ChatGPT 側の app call と Google Workspace 側の OAuth app access を突合し、「誰が、どの Google app action を、どの scope のもとで、どの部署から使ったか」を月次で見るとよい。

見るべきシグナルは、失敗だけではない。新しい Drive write action が急に増えた。BigQuery read action が特定部署以外から使われている。Meet transcript 参照が採用や人事会議に及んでいる。Drive sharing change に近い action が多い。こうした兆候は、便利に使えている一方で、scope や Action control の再調整が必要な可能性を示す。

## 導入手順: 小さく切って承認する

実務上は、最初から ChatGPT/OpenAI app を Google Workspace で broad Trusted にするより、小さく始めたほうがよい。第一段階では、Drive read-only と限定 shared drive から始める。社内公開資料、規程、FAQ、研修資料のような低感度文書に絞り、ChatGPT 側では write actions を無効化する。これで検索、要約、下書きの価値を測る。

第二段階では、Docs / Sheets / Slides の作成や更新を限定部署へ広げる。ここでは、App permissions を Any changes に寄せ、承認カードの見方を教育する。ファイル移動、共有変更、削除は引き続き無効化するか、少なくとも重要操作として扱う。承認カードで app、対象ファイル、変更内容、共有先を確認する訓練が必要だ。

第三段階で、BigQuery や Meet を検討する。BigQuery は sandbox dataset や集計済み view から始める。Meet は会議種別を限定し、社外参加者や人事・法務・経営会議を除外する。どちらも、生成AI推進チームだけでなく、データ基盤、セキュリティ、法務、対象部門の合意が必要である。

最後に、ユーザー向け FAQ を更新する。接続できない場合は、個人の操作ミスか、管理者が scope を許可していないかを切り分ける。ChatGPT が Google app data をどう使うか、Memory が有効な場合に何が起きるか、Google app を disconnect した場合に indexed copy がどう扱われるかを短く説明する。ここが曖昧だと、現場はエラーを避けるために未管理アカウントや個人ツールへ逃げやすい。

## まとめ

2026年6月15日の Google app actions 追加は、ChatGPT を Google Workspace の業務データへ近づける更新である。Drive、BigQuery、Meet に触れられることは、検索、分析、会議後処理を大きく楽にする。しかし企業利用では、便利さと同じ重さで、OAuth scope、ChatGPT action、App permissions、Memory、監査ログを設計する必要がある。

日本企業にとっての要点は、ChatGPT 側だけでも Google Workspace 側だけでも完結しないことだ。Google Workspace 管理者は OAuth app access control と scope を見る。ChatGPT 管理者は app action、Action control、App permissions を見る。情シスと法務は、Drive、BigQuery、Meet のデータ分類と利用場面を決める。この三者の一覧が揃って初めて、ChatGPT Google連携を本番運用へ進められる。

## 出典

- [Google App for ChatGPT - Data Controls FAQ](https://help.openai.com/en/articles/10408842-google-app-for-chatgpt-data-controls-faq) - OpenAI Help Center
- [Control which apps access Google Workspace data](https://knowledge.workspace.google.com/admin/apps/control-which-apps-access-google-workspace-data) - Google Workspace Help
- [Apps in ChatGPT](https://help.openai.com/en/articles/11487775) - OpenAI Help Center
