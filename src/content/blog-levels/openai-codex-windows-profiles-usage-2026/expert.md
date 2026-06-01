---
article: 'openai-codex-windows-profiles-usage-2026'
level: 'expert'
---

OpenAI が 2026年5月29日に示した Codex の更新は、Windows Computer Use、Windows ホストの remote control、Profiles、usage statistics という四つの要素で構成されている。個々には「Windowsでも画面操作できる」「利用統計が見える」という機能追加だが、企業導入ではもう少し重い意味を持つ。Codex を Mac 中心の先行ユーザー向けツールから、Windows が多い標準企業端末へ広げるための布石だからだ。

この更新は、[OpenAI Codex Goalモード](/blog/openai-codex-goal-appshots-browser-2026/) で扱った長時間作業、視覚QA、Computer Use の延長にある。Goal mode は作業の完了条件を持たせ、Appshots や browser annotations は画面文脈を渡す方向だった。今回の Windows 対応は、その画面操作対象が Windows デスクトップにも広がる。

また、[Codexのモバイル遠隔操作](/blog/openai-codex-mobile-remote-access-2026/) で扱った remote control の対象も変わる。従来の読み方は、Mac ホストで動く Codex をスマートフォンから見守るというものだった。今回からは Windows ホストも入り、iOS/Android の ChatGPT や Mac 上の Codex から Windows 側の進行を確認し、質問に答え、作業を方向転換できる。

最後に、[Codex利用枠更新](/blog/openai-codex-plan-credits-limits-2026/) と [Codex座席設計](/blog/openai-chatgpt-business-codex-seats-2026/) の文脈も外せない。Profiles と usage statistics は、利用者が token activity や longest task を見る入口になる。座席と credits の設計だけでなく、個々の開発者がどう Codex を使っているかを観測する段階へ進んでいる。

## 事実: Windows Computer Useの利用範囲

OpenAI の ChatGPT Release Notes は、Codex app が Windows の Computer Use に対応したと説明している。対象ユーザーは、Codex に Windows アプリを見せ、クリックや入力をさせ、テスト、デバッグ、改善作業に使える。作業は Windows マシン上で始まり、スマートフォンや Mac から進捗確認、スレッド継続、質問への回答、作業方針の調整ができる。

ここで見落としてはいけないのは、Windows ホストに残るものの範囲である。リリースノートは、project files、shell、app server、local context が Windows マシン側に残ると説明している。Remote control は実行環境を移す仕組みではなく、実行ホストを遠隔から操作する仕組みである。

OpenAI Developers の Remote connections ドキュメントも同じ構造を示している。スマートフォンは prompts、approvals、follow-up messages を送る。Connected host は repository files、local documents、shell commands、plugins、MCP servers、skills、browser access、Computer Use、sandboxing settings、security controls、action approvals を提供する。

これは企業セキュリティでは重要だ。スマートフォンの ChatGPT で見えているからといって、データがスマートフォン側へ移ったと単純化すべきではない。実際には、ホスト側の権限、ファイル、サインイン済みWebサイト、デスクトップアプリ、プラグイン構成が作業境界になる。したがって、ホスト端末をどう管理するかが最初の設計論点になる。

## 事実: Windowsではforeground controlが制約になる

Windows Computer Use の設計で最も重要なのは、foreground control である。OpenAI Developers は、Windows の Computer Use は active desktop 上で動き、同じ Windows セッションを人間が使い続けながら background で動くものではないと説明している。Codex が pointer を動かし、入力し、前景を使う。

この制約は、実務上の導入設計を大きく変える。Mac の locked computer use は、限定された条件で Mac ロック後も Computer Use を継続できる。一方、Windows の locked use は提供されず、Windows では foreground operation が前提になる。Windows ホストで作業を継続したい場合、端末を unlock してネットワークへ接続し、Codex がデスクトップを占有することを受け入れる必要がある。

OpenAI は、主デスクトップを奪われたくない場合に Windows 仮想マシン上で Codex app を動かす選択肢を示している。これは単なる便利技ではなく、企業導入では標準案になり得る。VDI、開発用VM、専用検証PC、always-on Windows PC を用意し、そこに検証用リポジトリ、テストデータ、必要なブラウザ、アプリ、MCP、プラグインを入れる。普段使い端末ではなく、Codex に渡してよい Windows 環境を作る発想である。

この設計なら、Codex が誤ってメール、チャット、社内ファイル、個人ブラウザプロファイル、管理者設定に触れるリスクを下げられる。逆に、普段使いの Windows 端末で本番アカウントにサインインしたまま Computer Use を許可すると、画面上の文脈と権限が広すぎる。

## 事実: 権限と安全ガイダンスはアプリ単位だけでは足りない

Computer Use には app approvals がある。Codex は許可されたアプリ内で画面を見て操作し、必要に応じて permission prompts を出す。Always allow を使えば、将来同じアプリを許可なしに使える。これは実用上便利だが、企業環境ではアプリ単位の許可だけで十分とはいえない。

理由は、同じアプリ内でも文脈の差が大きいからだ。Chrome を許可する場合、ローカル開発環境、検証用管理画面、社内ポータル、本番顧客管理画面、銀行・決済・クラウド管理コンソールが同じブラウザ内に存在し得る。Excel を許可する場合、ダミーデータのテストファイルと、個人情報を含む業務ファイルが同じアプリで開かれる。

OpenAI Developers の safety guidance は、Computer Use が screen content、screenshots、windows、menus、keyboard input、clipboard state を扱い得ることを明示している。さらに、アカウント、セキュリティ、プライバシー、ネットワーク、支払い、credential 関連設定では人間が注意深く関与すべきだと説明している。

したがって、日本企業で必要なのは「どのアプリを許可するか」だけではない。どの Windows ユーザー、どのブラウザプロファイル、どのURL、どのテストデータ、どの権限、どのネットワークから利用するかをセットで決める必要がある。

## 分析: 開発端末の標準化がAI導入の前提になる

ここからは分析だ。

AIコーディングエージェントの導入議論は、モデル性能、コード品質、レビュー負荷に寄りがちだ。しかし Windows Computer Use のような機能が入ると、端末標準化が前提になる。Codex はソースコードだけでなく、画面、ブラウザ、デスクトップアプリ、ローカルツール、サインイン済みセッションに触れるからだ。

日本企業では、Windows 端末が情シス管理下にあり、開発者がローカル管理者権限を持たないケースも多い。プロキシ、EDR、DLP、MDM、VPN、証明書、社内ブラウザ設定、Office、業務アプリが入っている。Codex をその端末で動かすなら、AIエージェントの権限は「開発ツールの権限」ではなく「端末上で操作できる人間の権限」に近づく。

ここを軽く見ると、AI導入がシャドーIT化する。開発者が個人判断で Computer Use を許可し、いつの間にか社内アプリや本番管理画面を操作していた、という状態は避けるべきだ。逆に、すべてを禁止すると、Windows 上でしか再現できない不具合や業務フロー検証の自動化機会を失う。

現実的な落としどころは、環境を分けることだ。通常業務端末、開発端末、AI検証端末を分ける。AI検証端末には、対象リポジトリ、検証用データ、低権限アカウント、必要なブラウザ、必要なデスクトップアプリだけを置く。Codex の app approvals は、その環境内でさらに絞る。

## 分析: Remote controlは承認待ちを減らすが責任境界を広げる

Remote control は、Windows Computer Use と組み合わせると強力になる。Codex が Windows 上で UIテストやバグ再現を進め、開発者はスマートフォンから進捗確認、質問への回答、コマンド承認、差分確認を行える。会議中や移動中でも判断待ちを減らせる。

ただし、承認できる場所が増えると、承認端末の責任も増える。スマートフォンが個人所有か会社管理か、MDM配下か、通知に差分やエラー内容が出るか、紛失時に remote access を失効できるか、SSO/MFA/passkey が必須か。これらは開発効率ではなく情報セキュリティの論点である。

OpenAI Developers は、ChatGPT workspace 経由で使う場合、管理者が Remote Control access を有効化する必要がある場合があると説明している。この管理者ゲートは、日本企業では必ず活かしたい。最初から全員有効ではなく、検証チーム、管理済み端末、限定リポジトリ、検証用ホストに絞る。

承認待ち削減の効果を測るなら、数値も必要だ。どのタスクで人間の待ち時間が減ったか、Codex の質問が多すぎて逆に負担が増えていないか、remote control による承認ミスがないか、作業後レビューの手戻りが減ったかを見る。便利さだけでは、セキュリティ部門や情シスに説明できない。

## 分析: Profilesとusage statisticsはFinOpsと教育の接点になる

Profiles と usage statistics は、企業導入で軽視しないほうがよい。OpenAI Developers の Settings ドキュメントは、Profile で lifetime tokens、peak tokens、streaks、longest task、token activity などを確認できると説明している。リリースノートも、Codex identity、activity over time、profile details、usage stats、token activity を確認できるとする。

これは、FinOps と教育の接点になる。Codex の費用や credits は、座席だけでは説明できない。長い入力、大量ファイル、GUI検証、複数回の再試行、長い出力、並列タスクは token activity を増やす。利用者自身が token activity を見られるなら、プロンプト設計や作業粒度の改善につなげられる。

たとえば、Windows アプリの不具合を Codex に任せるとき、最初に対象画面、再現手順、期待結果、禁止範囲、検証コマンドを明確に書けば、無駄な探索が減る。逆に「このアプリ直して」だけでは、画面操作、コード探索、質問、再試行が増える。usage statistics は、その違いを振り返る材料になる。

ただし、個人別の token 数を単純に評価指標へ使うのは危険だ。少ないことが良いとは限らない。難しい移行作業や障害調査では消費が大きくなる。逆に多いことが良いとも限らない。無駄な再試行や曖昧な依頼で消費しているだけかもしれない。見るべきなのは、作業種類、成果、レビュー品質、手戻り、費用の関係である。

## 実装前チェックリスト

第一に、Windows ホストの種類を決める。個人の業務端末、開発専用端末、検証用VM、always-on Windows PC、VDI のどれを使うか。初期検証では、個人業務端末より検証用VMが扱いやすい。

第二に、Windows ユーザーと権限を分ける。管理者権限を持つ普段使いユーザーではなく、低権限の検証ユーザーを用意する。社内アプリも、検証用アカウントとダミーデータを使う。

第三に、対象アプリとURLを限定する。Codex に使わせるブラウザ、ローカルURL、デスクトップアプリをリスト化する。Always allow は慎重に使い、許可した理由と見直し日を残す。

第四に、remote control の許可範囲を管理者設定で絞る。対象ユーザー、対象ホスト、対象ワークスペース、承認端末、MFA/SSO/passkey条件を決める。スマートフォン紛失時の失効手順も必要だ。

第五に、ログとレビューを分ける。Codex の差分、terminal output、test results、screenshots、Computer Use で行った操作、最終PRレビューを別々に確認できるようにする。画面操作で変わったファイルが review pane に出るとは限らないため、保存後の git diff も必ず見る。

第六に、usage statistics の利用目的を明文化する。費用配賦、教育、PoC評価、タスク設計改善のどれに使うのかを決める。個人監視の印象を避けるため、チーム単位の傾向と代表的なタスク単位で見る設計がよい。

## まとめ

OpenAI Codex の Windows Computer Use 対応は、Windows 中心の日本企業にとって、AIコーディングエージェントの適用範囲を広げる更新である。GUIでしか再現しない不具合、業務アプリの検証、Windows ブラウザ環境での確認、複数アプリをまたぐ作業に使える可能性がある。

一方で、Windows では前景操作が前提で、普段使い端末をそのまま渡すとリスクが大きい。専用環境、検証用アカウント、対象アプリの限定、remote control の管理、usage statistics の使い方、人間レビューの責任境界を先に決めるべきだ。

今回の更新は、Codex をより多くの企業端末へ入れられる可能性を示した。同時に、AI導入が端末管理、権限管理、費用管理、レビュー設計と不可分であることも明確にした。日本企業が見るべきなのは「Windowsでも動くか」ではなく、「Windowsで安全に渡せる作業環境を作れているか」である。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-05-29
- [Computer Use](https://developers.openai.com/codex/app/computer-use) - OpenAI Developers
- [Remote connections](https://developers.openai.com/codex/remote-connections) - OpenAI Developers
- [Settings](https://developers.openai.com/codex/app/settings) - OpenAI Developers
