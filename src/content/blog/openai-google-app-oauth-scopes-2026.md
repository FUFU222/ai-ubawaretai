---
title: 'ChatGPT Google連携、OAuth承認を再点検'
description: 'ChatGPT Google連携のOAuthスコープ追加を整理。日本企業がDrive、BigQuery、Meet actionsを有効化する前に、Workspace管理者と情シスで承認範囲をどう合わせるか解説する。'
pubDate: '2026-06-15'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'Google Workspace', '管理者設定', '監査ログ', '企業導入', 'セキュリティ']
series: 'openai-security-controls'
draft: false
---

OpenAI は Google App for ChatGPT の Data Controls FAQ で、**2026年6月15日から ChatGPT に Google Drive files、BigQuery、Google Meet 関連の新しい app actions が加わる**と説明している。新しいモデル発表ではないが、日本企業の情シス、Google Workspace 管理者、生成AI推進チームには実務影響が大きい。ChatGPT 側で action を有効にしても、Google Workspace 側で必要な OAuth scope を承認していなければ、ユーザーは接続や再接続、利用時に authorization error を見る可能性がある。

この更新は、以前の [ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) の続きとして読むと分かりやすい。App permissions は「ChatGPT が接続アプリを使う前にいつ人間へ確認を出すか」を扱った。今回の焦点は、そのさらに手前にある **Google Workspace 側の scope 承認**である。[ChatGPTロックダウン全開放](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) が外部接続を絞る設定だったのに対し、Google app actions は接続を使う前提で、どの権限を Google 側で許すかを問う。

## 事実: 6月15日に何が始まるか

OpenAI の FAQ は、2026年6月15日から ChatGPT に Google Drive files、BigQuery、Google Meet actions surfaced under Google Calendar が追加され、これらに追加の Google OAuth scopes が必要になると説明している。対象は Google app for ChatGPT であり、ChatGPT が Google アカウントや Google Workspace のデータを使って、検索、参照、操作を行う文脈である。

重要なのは、既存の Google app connection が自動的に削除されるわけではない点だ。OpenAI は、scope が新しく導入されても既存接続は削除されないと説明している。ただし、ユーザーが新しい action を使おうとしたり、再接続したり、未承認 scope を必要とする接続を作ろうとしたりすると、管理者承認や permission error が出る可能性がある。

FAQ では、ChatGPT 管理者と Google Workspace 管理者が、6月15日前に設定を合わせるべきだとされている。ChatGPT 側では、どの Google app actions が workspace で有効なのかを見る。Google Workspace 側では、ChatGPT/OpenAI OAuth app を Trusted として扱うか、あるいは有効にする action に必要な scope を個別に承認する。ここを片方だけで進めると、「ChatGPT では有効なのに Google 側でブロックされる」という状態になりやすい。

## 事実: scope と app permission は別の設定

今回の更新で混同しやすいのは、OAuth scope、ChatGPT app action、App permissions、Memory がそれぞれ違う管理線であることだ。

OAuth scope は、Google Workspace 側で ChatGPT/OpenAI app が要求できる Google API 権限の範囲である。FAQ には、Gmail の `gmail.modify`、Calendar の `calendar.events` や Meet 関連 scope、BigQuery の `bigquery`、`bigquery.readonly`、`bigquery.insertdata`、Drive の read / metadata / activity / write 系 scope、Docs / Sheets / Slides の read / write 系 scope が並んでいる。これは Google 側のデータアクセス権限の話である。

一方、ChatGPT の App permissions は、[既存記事](/blog/openai-chatgpt-app-permissions-enterprise-2026/) で整理した通り、接続済みアプリを使うときに ChatGPT がいつ確認を出すかの設定である。OpenAI の Apps in ChatGPT では、Important actions が既定で、読み取りは自動、意味のある外部影響や取り消しにくい操作では確認を求めると説明されている。つまり、App permissions を厳しくしても、Google Workspace 側で scope を承認するかどうかは別途決める必要がある。

Memory も別である。Google app data は、接続と設定に応じて ChatGPT の応答文脈や personalization に使われうる。OpenAI は、Memory が有効なら、Google app からアクセスした関連情報が、より便利な応答のために使われる可能性があると説明している。この点は [ChatGPTメモリ刷新](/blog/openai-chatgpt-dreaming-memory-controls-2026/) で扱った、個人化AIの統制とつながる。scope を承認するだけでなく、Memory、会話削除、app disconnect、モデル改善設定を分けて説明する必要がある。

## 分析: 日本企業ではサービスごとにリスクが違う

ここからは分析だ。

Google app actions と一口に言っても、Drive、BigQuery、Meet ではリスクの性質が違う。日本企業では、同じ Google Workspace tenant の中に営業資料、契約書、会議録、開発ログ、分析データ、個人情報が混在しやすい。すべてを「Google連携」として一括承認すると、現場は便利になる一方、後から説明できない権限面が残る。

Google Drive は、社内文書と共有権限が主な論点になる。読み取りだけなら、会議資料や過去提案書の検索、要約、ドラフト作成に効く。しかし Drive write scope や Docs / Sheets / Slides の編集 action まで広げると、ファイル作成、更新、移動、共有変更が関係する。これは [ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) のようなアカウント棚卸しだけでは足りない。どの共有ドライブ、どの部署、どの action を許すかを、Google Workspace と ChatGPT の両方で見る必要がある。

BigQuery は、分析データと権限境界が主な論点になる。読み取り専用であっても、DWH には顧客行動、売上、契約、広告、ログ、場合によっては個人データが入る。`bigquery.insertdata` のような scope まで含めるなら、ChatGPT が分析の補助をするだけでなく、データ投入やパイプライン周辺の操作に関わる可能性を評価する必要がある。日本企業では、分析基盤チーム、セキュリティ、個人情報保護担当が同じテーブル定義を見て判断したほうがよい。

Google Meet actions は、会議記録、録画、transcript、artifact が主な論点になる。会議は社内では気軽に共有されがちだが、実際には人事、法務、営業、経営、開発障害、採用面談など高感度な情報を含む。ChatGPT が Calendar 経由で Meet space や transcript に触るなら、会議種別ごとの扱いを決めるべきだ。

## 実務: 管理者が合わせるべき設定

最初にやるべきことは、ChatGPT workspace の Google app actions 一覧と、Google Workspace の OAuth app access control を突き合わせることだ。OpenAI は、ChatGPT 側で有効にする action の scope が Google 側で承認されていない場合、action を無効化するか scope を承認するかのどちらかに揃えるべきだと説明している。ここで「一部だけブロックしたまま使う」状態を残すと、ユーザーから見ると原因不明の接続エラーになる。

次に、Business と Enterprise / Edu の初期値差を確認する。Apps in ChatGPT では、Business workspace では apps が既定で有効、Enterprise / Edu では既定で無効と説明されている。日本企業でよくあるのは、部門 PoC が Business 相当の軽い設定で始まり、後から Enterprise 管理へ移すケースだ。この移行時に、Google scope、App permissions、Action control、Memory、Compliance Logs をまとめて棚卸ししたほうがよい。

三つ目は、承認範囲を「全部 Trusted」か「全部 Blocked」だけで決めないことだ。Google Workspace Help は、OAuth 2.0 settings で app access を管理し、Configured apps、Accessed apps、Pending review apps を確認できると説明している。実務では、まず ChatGPT/OpenAI app を棚卸しし、Drive read、Drive write、BigQuery read、BigQuery write、Meet transcript など、リスクの高い scope を分ける。Google 側では scope を承認し、ChatGPT 側では不要 action を無効化する。この二段構えにする。

四つ目は、ログと問い合わせ導線である。OpenAI の Apps in ChatGPT は、app calls が Compliance Logs platform に記録されると説明している。日本企業が本番運用するなら、接続エラーだけでなく、どの app action が多く使われ、どの scope が足りずに失敗し、どの部署で重要操作が承認されているかを見るべきだ。承認が頻繁に失敗するなら scope が足りない可能性がある。逆に、重要操作が無確認で通りすぎているなら App permissions や Action control が緩すぎる可能性がある。

## まとめ

ChatGPT の Google app actions 追加は、便利な Google 連携の拡張であると同時に、企業管理の境界をはっきりさせる更新である。日本企業が見るべきなのは、「ChatGPT が Drive、BigQuery、Meet を使えるようになる」という表面的な話だけではない。ChatGPT 側で action を有効化し、Google Workspace 側で OAuth scope を承認し、App permissions と Memory と監査ログをどう組み合わせるかである。

今回の更新は、接続アプリを広げる前に、管理者同士の責任分担を決めるタイミングを示している。Google Workspace 管理者は scope と app access を見る。ChatGPT 管理者は app actions、Action control、App permissions を見る。情シスと法務は、Drive、BigQuery、Meet のデータ分類を決める。この三者が同じ一覧を見てから有効化することが、ChatGPT Google連携を業務利用へ進める現実的な出発点になる。

## 出典

- [Google App for ChatGPT - Data Controls FAQ](https://help.openai.com/en/articles/10408842-google-app-for-chatgpt-data-controls-faq) - OpenAI Help Center
- [Control which apps access Google Workspace data](https://knowledge.workspace.google.com/admin/apps/control-which-apps-access-google-workspace-data) - Google Workspace Help
- [Apps in ChatGPT](https://help.openai.com/en/articles/11487775) - OpenAI Help Center
