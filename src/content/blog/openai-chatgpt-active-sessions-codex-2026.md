---
title: 'ChatGPTセッション管理、Codex端末利用の棚卸し策'
description: 'ChatGPTセッション管理が2026年6月2日に追加。CodexやAPI Platformを含むOpenAIアカウントの端末棚卸し、SSO例外、日本企業の退職・紛失時対応を整理する。'
pubDate: '2026-06-03'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'Codex', 'API', 'セキュリティ', '企業導入', '管理者設定']
series: 'openai-security-controls'
draft: false
---

OpenAI は **2026年6月2日** の ChatGPT Release Notes で、ChatGPT に `Active sessions` を追加した。利用者は自分のアカウントで認識されているセッションを確認し、見覚えのない端末やブラウザを個別にログアウトできる。派手な新モデルではないが、日本企業の ChatGPT、Codex、API Platform 利用ではかなり実務的な更新である。

この話は、以前扱った [OpenAI新セキュリティ設定でChatGPTとCodex運用はどう変わるか](/blog/openai-advanced-account-security-codex-2026/) の続きとして読むべきだ。Advanced Account Security は強い認証と復旧鍵を中心にした入口の防御だった。今回の Active sessions は、ログイン後に残った端末、ブラウザ、アプリの状態を利用者自身が見て、不要なものを切れるようにする運用面の更新である。

さらに、[OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) や [Offline検索](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) と同じ系列にもある。企業利用では、ChatGPT に何をさせるかだけでなく、誰のアカウントで、どの端末から、どの機能へアクセスしているかを管理する必要がある。今回の更新は、その地味だが重要な棚卸し作業を少しやりやすくする。

## 事実: 6月2日に何が追加されたか

OpenAI のリリースノートによると、Active account session controls は **2026年6月2日** に追加された。ユーザーは ChatGPT の設定から `Active sessions` を開き、自分のアカウントに紐づく既知のセッションを確認できる。OpenAI は、ChatGPT、Codex、API Platform のセッションが対象になると説明している。

確認できる情報は、利用者が異常を判断するための手がかりだ。具体的には、どの端末やブラウザで使われているか、どの地域から見えているか、最後に利用された時刻などを確認できる。見覚えのないセッションがあれば、そのセッションだけをログアウトできる。すべての端末からログアウトする従来の考え方より、実務では使いやすい。

ただし、これは完全な企業向けセッション台帳ではない。OpenAI の Help Center は、表示されるのは「既知のセッション」であり、連携アプリや一部の利用形態には別の扱いがあることを示している。企業の情シスが見るべきなのは、Active sessions だけで全アカウント管理が終わるわけではないという点だ。

## 事実: 個別ログアウトと全端末ログアウトは役割が違う

Active sessions の価値は、ログアウトを粒度細かくできる点にある。たとえば、自宅PC、会社PC、検証用ブラウザ、スマートフォンのうち、どれか一つだけ見覚えがない場合、利用者はそのセッションだけを切れる。これにより、普段使いの業務端末をすべて巻き込まずに、怪しい入口だけを先に閉じられる。

一方で、OpenAI は「すべての端末からログアウトする」手順も引き続き案内している。アカウント侵害の疑いが強い場合、端末紛失時、退職者の私物利用が疑われる場合、共有PCにログインした可能性がある場合は、個別ログアウトよりも全端末ログアウトを先に選ぶほうがよい。Active sessions は便利な確認画面だが、事故対応では強い手順を残す必要がある。

ここは日本企業の運用に落とし込みやすい。通常時は月次または四半期で Active sessions を確認し、見覚えのないものを消す。事故時はパスワード変更、MFA再確認、全端末ログアウト、接続アプリの棚卸し、ワークスペース管理者への報告を一連の手順にする。単発の画面確認で終わらせず、インシデント対応のチェックリストに入れるべきだ。

## 分析: 日本企業ではSSO外の利用棚卸しに効く

ここからは分析だ。

日本企業で ChatGPT や Codex の管理が難しくなるのは、正式な Enterprise ワークスペースだけではない。むしろ、PoC、個人契約、部署単位の先行利用、退職前の私物端末、外部委託先の検証アカウントのような **SSO外の利用** が残りやすい。Active sessions は、そうした利用を完全に管理者が見られる機能ではないが、利用者本人に棚卸しを求める材料にはなる。

たとえば、新しいAI利用規程を出すときに「ChatGPT の Active sessions を開き、見覚えのないセッションをログアウトする」「業務で使う端末だけ残す」「私物端末で使う場合は会社ルールに従う」といった確認を入れられる。これは地味だが、アカウント共有や置き忘れセッションの削減には効く。

以前の [OpenAI Privacy Filter](/blog/openai-privacy-filter-pii-redaction-2026/) では、個人情報や秘密情報をクラウドへ送る前に伏せる前処理を扱った。しかし、入力を安全にしても、アカウント自体が古い端末に残っていればリスクは残る。入力前処理、強い認証、セッション失効は別々の対策ではなく、一続きの管理として見るべきである。

## 分析: Codex利用では端末とCLIを分けて考える

Codex を使う開発チームでは、Active sessions の意味がさらに重くなる。Codex は単なるチャットではなく、コード、リポジトリ、端末操作、ブラウザ確認、開発サーバーの文脈に触れる。最近の [OpenAI Codex Windows対応](/blog/openai-codex-windows-profiles-usage-2026/) で見たように、Codex の利用範囲はデスクトップや遠隔操作へ広がっている。したがって、どの端末にセッションが残っているかは、コード資産への入口管理と近い。

ただし、Active sessions だけで Codex のすべてを管理できると考えるのは危険だ。Codex CLI、ローカル認証情報、GitHub 連携、MCP、プラグイン、端末側のキーチェーンや環境変数は、別の棚卸し対象になる。ChatGPT 画面上のセッションを消しても、開発端末に残るトークンや連携設定まで自動で消えるとは限らない。

そのため、退職・異動・端末紛失時の手順は二段構えにするのが現実的だ。第一に、OpenAI アカウント側で Active sessions と全端末ログアウトを確認する。第二に、開発端末側で Codex CLI、API key、Git credential、接続済みリポジトリ、MCP サーバー、ブラウザプロファイルを確認する。情シスと開発チームの境界で落ちやすいのは、この第二段階である。

## 分析: 高権限AIほどセッション失効が重要になる

OpenAI は Trusted Access for Cyber や Codex Security のように、高能力なAIを防御用途や開発用途へ広げている。[GPT-5.4-Cyber の限定提供](/blog/openai-gpt-54-cyber-trusted-access-2026/) で見たように、強いサイバー能力を持つモデルは、誰に、どの条件で、どこまで開くかが重要になる。入口の本人確認だけでなく、入口が残り続けないようにすることも同じくらい重要だ。

日本企業では、セッション管理を「個人のセキュリティ意識」に任せすぎないほうがよい。少なくとも、AI利用規程、退職チェックリスト、端末返却チェックリスト、外部委託終了時の作業、インシデント初動に Active sessions の確認を入れる。ログアウト画面があるだけでは統制にならない。いつ、誰が、どの場面で確認するかまで決めて初めて運用になる。

## まとめ

ChatGPT の Active sessions は、2026年6月2日に追加されたセッション確認・ログアウト機能である。ChatGPT、Codex、API Platform の既知セッションを確認し、見覚えのないものを個別に切れる。これは新モデル発表のように目立たないが、日本企業のAI利用では重要な実務更新だ。

ただし、これだけで企業のアカウント統制が完結するわけではない。Active sessions は利用者本人の棚卸しを助ける機能であり、SSO、MFA、接続アプリ、Codex CLI、API key、端末側の認証情報とは分けて管理する必要がある。日本の開発チームと情シスは、強化認証だけでなく、セッションをいつ失効させるかを定例手順に入れるべきだ。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-06-02
- [Managing active sessions in ChatGPT](https://help.openai.com/de-de/articles/20001257-managing-active-sessions-in-chatgpt) - OpenAI Help Center
- [How do I log out of all of my devices?](https://help.openai.com/en/articles/9243857) - OpenAI Help Center
- [Introducing Advanced Account Security](https://openai.com/index/advanced-account-security/) - OpenAI
