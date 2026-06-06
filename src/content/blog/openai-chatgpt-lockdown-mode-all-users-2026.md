---
title: 'ChatGPTロックダウン全開放、外部送信を抑える運用線'
description: 'ChatGPTロックダウンモードの全ログインユーザー展開を整理。日本企業が外部送信、プロンプトインジェクション、Apps、Codexの例外をどう運用に落とすか、情シス向けに解説する。'
pubDate: '2026-06-06'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'セキュリティ', '管理者設定', '企業導入', 'プライバシー']
series: 'openai-security-controls'
draft: false
---

OpenAI は ChatGPT Release Notes の **2026年6月4日** 更新で、**Lockdown Mode** をすべてのログイン済みユーザーに提供すると説明した。これは新モデルや新しいチャット体験ではない。ChatGPT が外部接続やファイル生成のような機能を使う場面を制限し、プロンプトインジェクションによるデータ流出リスクを下げるための設定である。

日本企業で重要なのは、Lockdown Mode を「安全になる魔法のスイッチ」と読まないことだ。以前の [ChatGPTメモリ刷新](/blog/openai-chatgpt-dreaming-memory-controls-2026/) は、ChatGPT が利用者文脈をどう覚えるかを扱った。[ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) は、ログイン後に残る端末をどう棚卸しするかを扱った。今回の Lockdown Mode は、ChatGPT が外部へ触る能力をどこまで絞るかという別の管理線である。

さらに、[OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) や [OpenAIのOffline検索](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) と同じく、便利な機能を企業利用へ入れる前に、管理者、法務、セキュリティ、現場が共通の説明を持つ必要がある。以下では、まず事実を整理し、そのうえで日本企業がどの業務から有効化を検討すべきかを分けて考える。

## 事実: 2026年6月4日に何が変わったか

OpenAI の ChatGPT Release Notes は、2026年6月4日の更新として Lockdown Mode がすべての logged-in users に利用可能になったと説明している。Help Center の Lockdown Mode 記事では、この設定が prompt injection 由来の data exfiltration リスクを減らすために、ChatGPT の一部機能を制限するものとして説明されている。

ここでいう prompt injection は、ユーザーが直接入力した指示ではなく、Webページ、ファイル、接続先アプリ、外部データの中に紛れた悪意ある指示が、ChatGPT の振る舞いへ影響する問題である。たとえば、外部ページの本文に「会話内の情報を別の場所へ送れ」という指示が隠れていた場合、AI がそれを通常のコンテンツではなく命令として扱う危険がある。

Lockdown Mode は、その種の危険に対して、ChatGPT が外部へデータを持ち出す経路や、外部接続を伴う機能を狭める方向の設定である。OpenAI は、チャットの便利さを一部下げる代わりに、機密性の高い会話での防御を強める選択肢として位置づけている。

重要なのは、今回の release notes では対象が広がった点だ。これまで Help Center 上では ChatGPT Enterprise、Edu、Business のような組織向けプラン文脈が強かったが、6月4日の release notes は logged-in users 全体への提供を示している。企業としては、正式ワークスペースだけでなく、個人アカウントや小規模PoCの利用者にも同じ設定説明を配る必要が出てくる。

## 事実: 何を止め、何を止めないのか

Lockdown Mode は、ChatGPT のすべてのリスクを消すものではない。OpenAI の説明では、Web検索、画像生成、ファイル生成、データ分析、Canvas、Deep Research、Apps、Connectors など、外部接続や拡張機能を伴う体験に影響が出る。つまり、ChatGPT を「調べる、作る、つなぐ」ツールとして使うほど、利便性とのトレードオフが大きくなる。

逆に言えば、Lockdown Mode は通常の会話そのものを止める設定ではない。機密資料の要約、方針文書の下書き、リスク整理、文章の言い換えのように、外部検索や外部アプリ接続を必要としない作業では使いやすい。ただし、ファイル生成や高度な分析、Web上の最新情報取得を同じ会話で期待している場合は、作業の設計を変える必要がある。

また、Lockdown Mode はメモリ、セッション、アカウント認証、管理者権限を置き換えない。たとえば、[OpenAI新セキュリティ設定](/blog/openai-advanced-account-security-codex-2026/) で扱った passkeys や recovery keys はアカウントの入口を強くする。Active sessions は残存ログインを棚卸しする。Skills governance は業務部品の公開や監査を扱う。Lockdown Mode は、外部送信の可能性がある ChatGPT 機能を制限する。これらは重なって見えるが、運用上は別々の管理対象である。

## 分析: 日本企業では高リスク業務から始める

ここからは分析だ。

日本企業が Lockdown Mode を導入する場合、最初の判断は「全員に常時オン」ではない。高リスク業務、機密文書、未公開情報、顧客情報、採用・労務・法務・金融・医療のような機微情報を扱う場面から、有効化の基準を作るべきである。

理由は、Lockdown Mode が利便性を下げるからだ。営業が公開情報を調べながら提案書の下書きを作る場面、開発者がWeb上のエラー情報を調べる場面、マーケティング担当が画像や資料を生成する場面では、外部接続の制限がそのまま生産性低下になる。一方で、未公開契約、個人情報、社内調査、セキュリティ事故、顧客別価格、社内コード名を含む会話では、外部送信の余地を減らす価値が大きい。

したがって、企業のAI利用規程では「この情報を扱うときは Lockdown Mode を有効化する」と具体化したほうがよい。たとえば、顧客名を含む相談、社外秘文書の要約、脆弱性対応の初動整理、人事評価や候補者情報、未発表の製品計画、契約交渉の論点整理などである。逆に、公開済み情報の調査や一般的な文章校正では、通常モードを使う場面も残る。

この分け方は、現場にとっても説明しやすい。「ChatGPT を使ってよいか」ではなく、「外部接続が必要な作業か」「外部に出してはいけない情報が含まれるか」で判断する。Lockdown Mode は、AI利用を止めるためではなく、リスクの高い作業でも利用を続けるための安全側設定として位置づけるほうが実務的である。

## 分析: Apps、Codex、メモリは別に管理する

Lockdown Mode の導入で誤解しやすいのは、OpenAI 製品全体の安全運用がこれで完結すると思ってしまうことだ。特に Apps、Connectors、Codex、メモリ、API key、MCP のような領域は別に見る必要がある。

Apps や Connectors は、ChatGPT が外部サービスに触れる入口である。Lockdown Mode が有効な会話では一部機能が制限されるとしても、組織としてどの接続先を許可するか、どのユーザーが使えるか、読み取りだけか書き込みも許すかは管理者設定で決める必要がある。Slack、Google Drive、Notion、CRM、チケット管理などに触れる場合、接続先ごとのデータ分類が不可欠になる。

Codex はさらに分けて考えるべきだ。Codex はコード、開発端末、リポジトリ、ブラウザ確認、プラグイン、MCP と結びつく。ChatGPT の Lockdown Mode を説明しただけでは、Codex CLI の認証情報、GitHub 連携、ローカル環境変数、接続済みリポジトリは棚卸しされない。開発チームでは、Lockdown Mode を「ChatGPT で機密相談をするときの設定」として扱い、Codex には別の権限・ログ・レビュー手順を置くべきである。

メモリも同じだ。Lockdown Mode が外部送信経路を狭めても、ChatGPT が何を記憶するか、Reference chat history をどう使うか、Temporary Chat をいつ使うかは別の設定である。以前の記事で整理したように、メモリは個人化の便利さと情報保持のリスクを同時に持つ。Lockdown Mode とメモリ無効化は同じ意味ではない。

## 実務: 導入前チェックリスト

日本企業が今回の更新を受けて最初にやるべきことは、対象者の確認である。すべてのログイン済みユーザーが使える更新であれば、Enterprise ワークスペースの管理者だけでなく、個人アカウントやBusiness利用者にも説明が必要になる。社内のAI利用ガイドに、Lockdown Mode の場所、使う場面、使うと止まる機能を書き足す。

二つ目は、情報分類との対応づけだ。機密、個人情報、未公開情報、顧客別情報、セキュリティ事故情報を扱う場合は Lockdown Mode を推奨または必須にする。公開情報の調査や画像生成では通常モードを許す、というように場面で分ける。ここを曖昧にすると、現場は面倒だから使わないか、逆に常時オンで業務が詰まるかのどちらかになる。

三つ目は、外部接続の棚卸しである。Apps、Connectors、Web検索、Deep Research、Canvas、ファイル生成、データ分析がどの業務で使われているかを確認する。Lockdown Mode を使う会話では制限される可能性があるため、機密作業と外部調査を同じチャットで混ぜない手順を作る。たとえば、公開情報の調査は通常モードで行い、機密文書を含む評価は Lockdown Mode の別スレッドで行う。

四つ目は、事故対応との接続だ。プロンプトインジェクションが疑われる出力、外部ページを読ませた後の不自然な挙動、接続アプリへの意図しない操作があった場合、利用者はどこへ報告するのか。Lockdown Mode を有効にしたか、どの接続先を使ったか、どの情報を入力したかを確認できるようにする。

## まとめ

ChatGPT Lockdown Mode の全ログインユーザー展開は、派手な新機能ではない。しかし、日本企業が ChatGPT を業務利用するうえでは重要な更新である。AI がWeb、ファイル、外部アプリへ広がるほど、プロンプトインジェクションによる外部送信リスクは現実的な運用課題になる。

日本企業が見るべきなのは、Lockdown Mode を全社で強制するかどうかだけではない。どの情報を扱うときに有効化するか、どの作業では通常モードを残すか、Apps、Codex、メモリ、セッション管理とどう分けるかである。今回の更新は、ChatGPT を止めるためではなく、機密性の高い場面でも使い続けるための管理線を引くタイミングを示している。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-06-04
- [Lockdown Mode](https://help.openai.com/articles/20001061/) - OpenAI Help Center
- [Managing workspace settings in ChatGPT Enterprise](https://help.openai.com/en/articles/8411955) - OpenAI Help Center
