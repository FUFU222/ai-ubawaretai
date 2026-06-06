---
article: 'openai-chatgpt-lockdown-mode-all-users-2026'
level: 'child'
---

OpenAI は 2026年6月4日の ChatGPT Release Notes で、Lockdown Mode をすべてのログイン済みユーザーに提供すると説明した。Lockdown Mode は、ChatGPT を少し不便にする代わりに、外部へ情報が出てしまう危険を減らすための設定である。

これは「ChatGPT を使わない設定」ではない。むしろ、機密情報を扱うときでも ChatGPT を使いやすくするための安全側の使い方だ。特に日本企業では、顧客情報、社外秘資料、未発表の製品計画、人事情報、セキュリティ事故の相談などで役に立つ可能性がある。

## 何を防ごうとしているのか

Lockdown Mode が意識している大きなリスクは、プロンプトインジェクションである。これは、ユーザーが直接書いた命令ではなく、Webページ、ファイル、外部アプリの中に隠れた指示が、ChatGPT の動きに影響してしまう問題だ。

たとえば、あるWebページに悪意ある指示が混ざっていて、ChatGPT がそれを「ページ本文」ではなく「守るべき命令」と誤って扱うことがある。もしその会話に会社の秘密情報が入っていれば、外部へ送るような挙動につながるおそれがある。

Lockdown Mode は、こうした外部送信の道を狭くする。OpenAI の説明では、Web検索、画像生成、ファイル生成、データ分析、Apps、Connectors など、外部接続や高度な機能に影響が出る。つまり、便利な機能を一部止めることで、安全側に寄せる設定である。

## いつ使うべきか

日本企業では、すべての会話で Lockdown Mode を使う必要はない。公開情報を調べる、一般的な文章を整える、アイデアを出す、といった場面では通常モードのほうが便利なことも多い。

一方で、外に出してはいけない情報を扱うときは Lockdown Mode が候補になる。顧客名を含む相談、契約書の要約、社内調査、人事や採用の情報、未公開の価格、脆弱性対応、障害報告の下書きなどである。

大事なのは、作業を分けることだ。公開情報を調べる会話と、機密情報を整理する会話を同じスレッドに混ぜない。調査は通常モードで行い、機密情報を入れる整理は Lockdown Mode の別スレッドで行う、という使い方が分かりやすい。

## 何に注意するべきか

第一に、Lockdown Mode は万能ではない。アカウントのログインを守る機能ではないし、メモリの設定でもない。以前の [ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) のような端末の棚卸しや、[ChatGPTメモリ刷新](/blog/openai-chatgpt-dreaming-memory-controls-2026/) で扱った記憶の管理とは別に考える必要がある。

第二に、Apps や Connectors の管理は別に必要である。ChatGPT が Google Drive、Slack、Notion、CRM などに接続できる場合、どの接続を許すかは会社として決めなければならない。Lockdown Mode を説明しただけでは、接続先の権限管理は終わらない。

第三に、Codex を使う開発チームでは、さらに別の確認が必要だ。Codex はコード、端末、GitHub、MCP、API key などと関係する。ChatGPT の Lockdown Mode を有効にしても、開発端末に残る認証情報やリポジトリ権限まで自動で整理されるわけではない。

## 企業での決め方

情シスや生成AI推進チームは、まず「どんな情報を扱うときに Lockdown Mode を使うか」を決めるとよい。たとえば、個人情報、顧客情報、未公開情報、セキュリティ事故、契約交渉を含む場合は有効化する、といったルールである。

次に、利用者向けの短い説明を作る。Lockdown Mode を使う場面、使うと止まる機能、通常モードと分ける理由を、社内FAQやAI利用ガイドに入れる。長い規程だけでは現場に届きにくい。

最後に、事故時の報告先を決める。外部ページを読ませた後に不自然な出力が出た、接続アプリへの操作が意図と違った、機密情報を入れた会話で外部機能を使ってしまった。こうしたときに誰へ連絡するかを決めておく。

## まとめ

ChatGPT Lockdown Mode は、ChatGPT を安全側に寄せるための設定である。すべてのリスクを消すものではないが、プロンプトインジェクションや外部送信のリスクを意識する場面では重要になる。

日本企業では、全員に何となく使わせるより、機密情報を扱う場面から使い方を決めるほうがよい。通常モード、Lockdown Mode、メモリ、セッション管理、Apps、Codex を分けて説明できることが、実務での安全な使い方につながる。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-06-04
- [Lockdown Mode](https://help.openai.com/articles/20001061/) - OpenAI Help Center
- [Managing workspace settings in ChatGPT Enterprise](https://help.openai.com/en/articles/8411955) - OpenAI Help Center
