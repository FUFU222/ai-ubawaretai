---
article: 'openai-chatgpt-active-sessions-codex-2026'
level: 'expert'
---

OpenAI が 2026年6月2日に追加した Active sessions は、見た目には小さなアカウント設定の更新である。だが、ChatGPT、Codex、API Platform を業務に組み込む組織では、認証後の残存セッションをどう扱うかという実務課題に直接効く。特に日本企業では、正式な Enterprise ワークスペース、個人契約、PoC用アカウント、外部委託先の検証利用、開発端末上のCodex利用が混在しやすい。そこでは「ログインできるか」だけでなく、「どこにログインが残っているか」が管理対象になる。

この更新は、[OpenAI新セキュリティ設定でChatGPTとCodex運用はどう変わるか](/blog/openai-advanced-account-security-codex-2026/) で扱った Advanced Account Security と合わせて見ると分かりやすい。AAS は passkeys、physical security keys、recovery keys によって入口の強度を上げる。一方、Active sessions は入口を通過した後の状態を見えるようにし、不要なセッションを切る。入口強化と残存セッション管理は、片方だけでは足りない。

また、企業管理の観点では [OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) と [Offline検索](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) の延長にもある。Skills、検索、Codex、API は機能カテゴリとしては別だが、実務では同じ問いに戻る。誰のアカウントで、どの端末から、どの機能へ、どのデータを渡しているのか。Active sessions は、そのうち「どの端末から」の棚卸しを利用者本人に返す更新である。

## 事実: Active sessionsの対象と操作

OpenAI の ChatGPT Release Notes は、2026年6月2日の更新として Active account session controls を追加したと説明している。ユーザーは ChatGPT の設定から Active sessions を開き、自分のアカウントで認識されているセッションを確認できる。OpenAI は、ChatGPT、Codex、API Platform のセッションがこの確認対象に含まれると説明している。

Help Center の説明では、利用者は各セッションについて端末やブラウザ、場所の手がかり、最後に使われた時刻などを見て、見覚えがあるかを判断する。不要または不審なセッションは個別にログアウトできる。これは、すべての端末からログアウトする手順よりも日常運用に向く。たとえば、検証用ブラウザだけを切り、業務用端末とスマートフォンは残す、といった対応ができるからだ。

一方で、OpenAI は全端末ログアウトの手順も引き続き案内している。全端末ログアウトは、アカウント侵害の疑い、端末紛失、共有端末利用、退職・異動、本人がセッションを把握できない状態で使うべき強い操作である。Active sessions の個別ログアウトは、通常時の棚卸しと軽微な整理に向く。事故対応では、個別ログアウトだけに頼るべきではない。

## 事実: 企業管理者が読み違えやすい境界

Active sessions は便利だが、企業管理者が過信してはいけない。第一に、これは利用者本人のアカウント画面であり、すべての企業アカウントを中央で監査する管理台帳ではない。Enterprise ワークスペースの管理者機能、SSOログ、IdPのセッション管理、MDM、CASB、EDRログとは役割が違う。

第二に、OpenAIアカウント側のセッションと、端末側の認証情報は別物である。ChatGPT のWebセッションを切っても、開発端末に残るローカル設定、CLI認証、API key、Git credential、ブラウザプロファイル、MCPサーバーの設定、連携アプリのトークンが同時に整理されるとは限らない。

第三に、表示されるセッションはOpenAIが認識している範囲であり、接続済み外部サービスや組織側のSSOセッションとは切り分ける必要がある。したがって、退職者対応や端末紛失対応では、OpenAI側のActive sessions確認と、IdP、MDM、開発端末、GitHub、クラウド、API key棚卸しを別タスクにするべきだ。

## 分析: 日本企業では「利用者本人に戻す統制」として使う

ここからは分析だ。

日本企業のAI導入では、情シスがすべての利用実態を中央で把握できるとは限らない。ChatGPT Enterprise で統制できる範囲があっても、その外側に個人Plus、個人Pro、部署単位のPoC、外部委託先の検証利用が残る。こうした領域では、管理者が直接ログを見られない場合でも、利用者本人に具体的な確認作業を求める運用が必要になる。

Active sessions は、その運用に使いやすい。抽象的に「アカウントを安全にしてください」と言うより、「Active sessions を開き、見覚えのないセッションをログアウトしてください」「業務利用端末だけを残してください」「端末紛失時は全端末ログアウトをしてください」と指示できる。確認対象が画面として存在するため、社内手順書、オンボーディング、退職チェックリストに入れやすい。

ただし、これを個人任せにしすぎると形だけになる。日本企業では、四半期のAI利用棚卸し、退職前チェック、委託先アカウント返却、PC交換、スマートフォン紛失、セキュリティ教育のタイミングに組み込むのが現実的だ。確認済みの自己申告、スクリーンショットの扱い、個人情報を写さない報告方法も決める必要がある。

## 分析: Codex運用ではセッションと作業環境を分ける

Codex は、ChatGPT の会話よりも管理境界が広い。コード、ローカルファイル、シェル、ブラウザ、開発サーバー、MCP、プラグイン、GitHub連携が関係する。最近の [OpenAI Codex Windows対応](/blog/openai-codex-windows-profiles-usage-2026/) では、Windows Computer Use、remote control、Profiles、usage statistics が加わり、Codex がデスクトップや遠隔承認にも広がる方向を見た。すると、OpenAIアカウントのセッションは、単なるチャット履歴への入口ではなく、開発作業環境への入口に近づく。

このため、Codex利用者の退職・異動・端末紛失では、Active sessions だけで閉じない手順が必要になる。最低限、OpenAIアカウントの全端末ログアウト、Codex CLIやローカルアプリの認証解除、API keyの無効化、GitHub OAuthやPersonal Access Tokenの確認、リポジトリ権限の剥奪、MCPサーバー設定の削除、ブラウザプロファイルのリセットを分けて扱う。

逆に、Active sessions はこの広い棚卸しの入口として役立つ。利用者に「まずOpenAI側でどの端末が見えるかを確認する」と求めることで、本人が忘れていた自宅PC、古いスマートフォン、検証VM、共有端末を思い出しやすくなる。その後に、端末側のローカル認証情報へ進む。順番を作ることが重要である。

## 分析: データ保護は入力前処理だけでは完結しない

AI利用の安全対策は、入力データのマスキングやDLPに寄りがちだ。[OpenAI Privacy Filter](/blog/openai-privacy-filter-pii-redaction-2026/) で扱ったように、個人情報や秘密情報をクラウドへ送る前に伏せる仕組みは重要である。しかし、データ保護は入力前処理だけでは完結しない。アカウントが古い端末に残っていれば、過去の会話、接続済みツール、保存されたファイル、ワークスペース内の文脈に後からアクセスされる可能性がある。

つまり、入力前の防御、認証、セッション管理、接続アプリ管理、ログ監査は同じ運用線上に置く必要がある。Privacy Filter は「何を送るか」を制御する。Advanced Account Security は「誰が入れるか」を強くする。Active sessions は「入った状態がどこに残っているか」を整理する。Skills governance や Offline web search は「ChatGPTが何を実行し、何を取りに行くか」を管理する。これらを別々の施策として導入すると、抜けが残りやすい。

日本企業で実務に落とすなら、AI利用の標準チェックリストを機能別ではなくリスク別に作るほうがよい。アカウント侵害、端末紛失、退職、外部委託終了、データ持ち出し、API key漏えい、接続アプリ誤設定ごとに、どのOpenAI設定と社内設定を見るかを並べる。Active sessions は、その中の「セッション残存」項目として扱う。

## 実務チェックリスト

第一に、通常時の棚卸しを決める。四半期または月次で、ChatGPT の Active sessions を確認し、見覚えのないセッション、古い端末、不要なブラウザ、検証後に残ったVMをログアウトする。業務利用端末だけを残す方針なら、その基準を明文化する。

第二に、退職・異動時の強い手順を決める。本人にActive sessionsを確認させるだけでなく、全端末ログアウト、SSO無効化、ワークスペース削除、API key無効化、Codex CLI認証解除、GitHub連携解除、MCP設定削除、端末返却時のブラウザプロファイル削除を分けて確認する。

第三に、端末紛失時の初動を決める。スマートフォンやノートPCを失った場合、MDMのロックやワイプだけでなく、OpenAIアカウントの全端末ログアウト、パスワード変更、MFA確認、接続済みアプリの確認を実施する。紛失端末がCodexホストだった場合は、リポジトリ権限やローカルシークレットも確認する。

第四に、SSO外アカウントを棚卸しする。個人Plusや個人Proを完全に禁止できない組織では、少なくとも業務利用者にActive sessions確認を義務づける。正式導入へ移行した後も、旧個人アカウントに業務データが残っていないかを確認する。

第五に、インシデント時のログアウト粒度を決める。単なる整理なら個別ログアウトでよい。侵害疑い、端末紛失、共有端末利用、退職者対応では全端末ログアウトを優先する。運用手順書では、どちらを選ぶかを担当者判断に丸投げしない。

第六に、管理者ログと本人画面を混同しない。Active sessions は本人が見る画面であり、IdP、MDM、CASB、EDR、SIEMの代替ではない。企業管理者は、本人確認手順として使い、中央監査は既存の管理基盤と組み合わせる。

## まとめ

Active sessions は、ChatGPT、Codex、API Platform の既知セッションを利用者が確認し、不要または不審なものをログアウトできるようにする更新である。日本企業にとっては、AI利用の棚卸し、退職・異動、端末紛失、SSO外利用の整理に使える。

ただし、これは万能な企業管理台帳ではない。Codex CLI、API key、GitHub連携、MCP、接続アプリ、端末側の認証情報、IdP側セッションは別に管理する必要がある。重要なのは、Active sessions を単体の便利機能としてではなく、強化認証、入力前処理、接続アプリ管理、端末管理、インシデント対応の中に組み込むことだ。

OpenAIのセキュリティ更新は、モデル性能のニュースより地味に見える。しかし、AIを業務基盤にするほど、こうした運用機能の価値は上がる。日本企業は、Active sessions を「見たら安心」ではなく、「いつ失効させるかを決めるための画面」として扱うべきである。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-06-02
- [Managing active sessions in ChatGPT](https://help.openai.com/de-de/articles/20001257-managing-active-sessions-in-chatgpt) - OpenAI Help Center
- [How do I log out of all of my devices?](https://help.openai.com/en/articles/9243857) - OpenAI Help Center
- [Introducing Advanced Account Security](https://openai.com/index/advanced-account-security/) - OpenAI
