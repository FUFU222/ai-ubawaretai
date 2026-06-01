---
title: 'OpenAI Codex Windows対応、端末運用の再設計'
description: 'OpenAI CodexのWindows Computer Use対応、remote control、Profilesとusage statisticsを整理。日本企業のWindows混在開発端末、権限承認、費用監視をどう設計するか解説する。'
pubDate: '2026-06-01'
category: 'news'
tags: ['OpenAI', 'Codex', '開発者ツール', '企業導入', 'ガバナンス', 'セキュリティ', 'Windows']
draft: false
series: 'openai-codex-enterprise-2026'
---

OpenAI は **2026年5月29日** の ChatGPT Release Notes で、Codex の Windows 向け Computer Use、Windows ホストの remote control、Profiles と usage statistics を発表した。派手なモデル更新ではない。しかし日本の開発組織にとっては、Codex を「Macを持つ一部の開発者の道具」から、Windows が多い企業端末環境へ広げる更新として重要である。

この話は、すでに扱った [OpenAI Codex Goalモード](/blog/openai-codex-goal-appshots-browser-2026/) と同じシリーズで読むべきだ。Goal mode や Appshots は、Codex が長い作業と画面文脈を扱う方向を示した。さらに [Codexのモバイル遠隔操作](/blog/openai-codex-mobile-remote-access-2026/) は、席を外した開発者がスマートフォンから判断を返す導線を扱った。今回の Windows 対応は、その実行ホストが Windows PC まで広がる話である。

もう一つの接点は費用と利用状況だ。[Codex利用枠更新](/blog/openai-codex-plan-credits-limits-2026/) と [Codex座席設計](/blog/openai-chatgpt-business-codex-seats-2026/) で見たように、企業導入では座席、credits、rate limits、使用量の見える化が重要になる。Profiles と usage statistics は、この管理面を現場利用者にも近づける更新として読める。

## 事実: 2026年5月29日に何が更新されたか

OpenAI のリリースノートによると、Codex app で Windows の Computer Use が使えるようになった。対象ユーザーは、Codex に Windows アプリを見せ、クリックや入力をさせ、テスト、デバッグ、修正の作業に使える。作業を Windows マシンで始め、iOS や Android の ChatGPT、または Mac 上の Codex から進捗確認、スレッド継続、質問への回答、作業方針の修正ができる。

重要なのは、Windows マシンがホストのまま残る点だ。リリースノートは、プロジェクトファイル、shell、app server、local context は Windows 側に残ると説明している。つまりスマートフォンや Mac は「別の実行環境」ではなく、Windows ホスト上で進む Codex 作業への操作面になる。

同じ発表には、応答性、in-app browser の速度、安定性、Web互換性の改善も含まれる。さらに Codex Profiles が追加され、対象ユーザーは Codex の identity、一定期間の活動、profile details、usage stats、token activity を確認できる。Computer Use on Windows は、ローンチ時点で欧州経済領域、英国、スイスでは利用できない。

OpenAI Developers の Computer Use ドキュメントも、Computer Use が macOS と Windows で利用できると説明している。用途は、コマンドラインや構造化された連携だけでは確認しにくいデスクトップアプリ、ブラウザ操作、GUIでしか再現しない不具合、複数アプリをまたぐ作業などである。

## 事実: Windows Computer Useは前景操作として設計されている

Windows 版の読み方で重要なのは、Mac と完全に同じ運用ではないことだ。OpenAI Developers は、Windows の Computer Use は active desktop 上で動き、同じ Windows セッションを人間が使い続けながら背後で動かすものではないと説明している。Codex が pointer を動かし、入力し、前景を使うことを前提にする。

そのため、Windows で長い作業を続けたい場合は、Windows 端末を unlock し、インターネットへ接続した状態にする必要がある。スマートフォンから remote control で進捗を見たり追加指示を送ったりできるが、Windows デスクトップ自体は Codex の作業に渡すことになる。OpenAI は、主作業端末を占有されたくない場合に Windows 仮想マシン上で Codex app を動かす選択肢にも触れている。

これは日本企業ではかなり現実的な論点だ。社給端末が Windows 中心の会社では、開発者、QA、情シス、業務アプリ担当が Windows 上でローカルアプリやブラウザを確認することが多い。一方で、その端末はメール、チャット、VPN、社内システムにも使われる。Codex に前景操作を渡すなら、専用端末、仮想環境、検証用ユーザー、業務アプリの権限分離を先に決める必要がある。

Computer Use は便利だが、画面上の情報を Codex が処理する。OpenAI Developers は、スクリーン内容、スクリーンショット、ウィンドウ、メニュー、キーボード入力、クリップボード状態を文脈として扱い得ると説明している。したがって、顧客情報、社内チャット、秘密情報、認証画面、支払い設定、ネットワーク設定を開いたまま使うのは危険である。

## 分析: 日本企業ではWindows混在運用が本題になる

ここからは分析だ。

今回の更新は、Windows でも Codex が GUI を扱えるようになったという機能追加に見える。しかし企業導入の本題は、Mac 中心の先行検証から、Windows を含む標準端末運用へ移れるかである。

日本企業では、開発者全員が Mac を使っているとは限らない。Webフロントエンドやモバイル開発では Mac が多くても、業務アプリ、社内ツール、Windows クライアント、Excel 連携、RPA、コールセンター向け画面、社内ブラウザ検証では Windows が標準という会社は多い。Codex が Windows の GUI を扱えるなら、AIコーディングエージェントの対象は「コードを書く人」だけでなく、「Windows 上で業務フローを確認する人」にも近づく。

ただし、これは利用範囲を広げるほどリスクも増える。たとえば、社内Webアプリの不具合を再現するために Codex にブラウザを操作させると、サインイン済みセッション、Cookie、権限、表示中の個人情報が関係する。Windows アプリの設定変更を任せると、レジストリ、ローカルファイル、ネットワーク設定、証明書、プロキシ設定に触れる可能性もある。Codex の file edits や shell commands だけを監査しても足りない。

したがって、導入初期は「Windows でも何でもできる」ではなく、対象フローを絞るべきだ。ローカル開発中のアプリ、検証用アカウント、ダミーデータ、権限の低いテスト環境、専用VMを使う。Codex が作業する Windows ホストは、普段使いの業務端末ではなく、AI作業に渡してよい環境として設計するのが安全である。

## Profilesとusage statisticsの意味

Profiles と usage statistics は、一見すると個人向けの可視化機能に見える。しかし Codex が企業導入へ進むほど、この手の見える化は重要になる。

Codex は短い質問応答ではなく、長時間の調査、複数ファイル修正、UI確認、テスト、再試行を行う。使い方によって token activity は大きく変わる。OpenAI の settings ドキュメントは、Profile で lifetime tokens、peak tokens、streaks、longest task、token activity などを確認できると説明している。これは、開発者自身が自分の使い方を把握する入口になる。

企業側では、usage statistics を個人評価に使うより、ワークロード設計に使うほうがよい。どの作業で token が伸びるのか、長いタスクはどの程度の頻度で起きるのか、Windows Computer Use を使った GUI 検証はレビュー工数を減らすのか。こうした観点で見れば、usage stats は単なる利用量ではなく、AI開発ワークフローの観測点になる。

一方で、利用状況の見える化はプライバシーと心理的安全性にも関係する。日本企業で導入するなら、個人別の数値をどこまで管理者が見るのか、チーム別の傾向だけを見るのか、費用配賦に使うのか、教育に使うのかを分けて説明したほうがよい。数値だけを競わせると、必要な検証を避けたり、逆に無駄に使ったりする。

## 導入前に決めるチェックリスト

第一に、Windows Computer Use を使う端末を決める。普段使いの業務端末、開発専用端末、検証用VM、always-on PC のどれをホストにするかでリスクが変わる。前景操作を前提にするなら、専用VMから始めるのが現実的だ。

第二に、対象アプリを絞る。Codex の Computer Use ではアプリ利用の許可が関係する。最初はブラウザのローカル開発URL、検証用デスクトップアプリ、ダミーデータの管理画面だけに限定する。メール、チャット、本番管理画面、決済、認証、ネットワーク設定は対象外にする。

第三に、remote control を管理者設定と端末管理に結びつける。スマートフォンから Windows ホストを操作できるなら、SSO、MFA、passkey、MDM、紛失時の失効、通知画面の情報露出を確認する。便利な承認導線ほど、端末紛失時の影響を先に考える必要がある。

第四に、usage stats を費用と教育の両方で見る。大量消費を責めるためではなく、長時間タスクの型、失敗しやすいプロンプト、GUI検証で人間レビューが必要な箇所を見つけるために使う。費用管理は、座席設計と credits 管理の話と分けてはいけない。

第五に、人間のレビュー責任を残す。Codex が Windows 上でアプリを動かし、差分を作り、テスト結果を示しても、最終的な採否、セキュリティ確認、業務フロー確認は人間が行う。Computer Use は検証を支える道具であり、業務上の責任を移す仕組みではない。

## まとめ

OpenAI Codex の Windows Computer Use 対応は、日本企業にとって実務的な更新である。Windows が多い開発・QA・情シス環境でも、Codex が GUI を見て操作し、スマートフォンや Mac から進捗確認や追加指示を受けられるようになる。

一方で、Windows では前景操作が前提になる。普段使い端末をそのまま渡すのではなく、専用端末、VM、検証用アカウント、対象アプリ、remote control の管理、usage stats の使い方を決める必要がある。今回の更新は「Windowsでも使えるようになった」だけではない。Codex を企業の標準開発端末運用へ入れる前に、端末、権限、費用、監査を設計し直すきっかけである。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-05-29
- [Computer Use](https://developers.openai.com/codex/app/computer-use) - OpenAI Developers
- [Remote connections](https://developers.openai.com/codex/remote-connections) - OpenAI Developers
- [Settings](https://developers.openai.com/codex/app/settings) - OpenAI Developers
