---
article: 'openai-chatgpt-active-sessions-codex-2026'
level: 'child'
---

OpenAI は 2026年6月2日、ChatGPT に Active sessions を追加した。これは、自分のOpenAIアカウントで使われているセッションを確認し、見覚えのない端末やブラウザをログアウトできる機能である。ChatGPTだけでなく、CodexやAPI Platformの利用も関係するため、開発チームや情シスにとっても大事な更新だ。

難しく言えば「セッション管理」だが、要するに「自分のアカウントがどこでログインされたままかを見て、不要なものを切る」ための画面である。共有PC、古いスマートフォン、自宅ブラウザ、検証用端末にログインが残っていると、そこから会話履歴や業務情報へアクセスされる可能性がある。

## 何ができるのか

Active sessions では、OpenAIアカウントに紐づく既知のセッションを確認できる。端末やブラウザ、地域、最後に使われた時刻などを見て、自分が使ったものかどうかを判断する。見覚えがなければ、そのセッションだけをログアウトできる。

これまでも、すべての端末からログアウトする手段はあった。今回の違いは、個別に見て、個別に消せることだ。たとえば、会社のPCとスマートフォンは残し、自宅の古いブラウザだけを切るような運用がしやすくなる。

ただし、事故が疑われるときは個別ログアウトだけでは足りない。アカウント乗っ取りの可能性があるなら、全端末ログアウト、パスワード変更、MFAの確認、接続アプリの確認まで行うべきだ。

## 日本企業で役立つ場面

日本企業では、ChatGPTやCodexが正式導入される前に、個人アカウントや少人数のPoCで使われることが多い。こうした利用は便利だが、どの端末にログインが残っているか分かりにくい。Active sessions は、利用者本人に棚卸しを求める入口になる。

たとえば、社内のAI利用ルールに「月に一度、Active sessions を確認する」「退職・異動時に全端末ログアウトを確認する」「業務に使わない端末のセッションは消す」と書ける。管理者がすべてを見られるわけではないが、利用者に具体的な確認手順を渡せる。

Codexを使う場合はさらに注意が必要だ。Codexはコードや開発環境に触れることがある。ChatGPTのセッションを切るだけでなく、Codex CLI、API key、GitHub連携、MCP、ブラウザプロファイルなども別に確認する必要がある。

## 何に注意するべきか

第一に、Active sessions は万能な管理台帳ではない。表示されるのはOpenAIが認識しているセッションであり、接続済みアプリやローカル端末の認証情報は別の確認が必要になる。

第二に、ログアウトの手順を場面ごとに分ける。普段の棚卸しでは個別ログアウトでよい。端末紛失、退職、アカウント侵害の疑いがある場合は、全端末ログアウトと認証情報の見直しをセットにする。

第三に、利用者任せで終わらせない。情シスや開発責任者は、いつ確認するか、誰が確認済みとするか、どの画面のスクリーンショットや申告を残すかを決めておくとよい。

## まとめ

Active sessions は、ChatGPTやCodexを使う人が、自分のOpenAIアカウントのログイン状態を確認し、不要なセッションを切るための機能である。日本企業では、個人利用、PoC、退職・異動、端末紛失のチェックに使いやすい。

ただし、これだけで安全になるわけではない。SSO、MFA、全端末ログアウト、接続アプリ、Codex CLI、API keyの棚卸しと組み合わせて使うことが重要である。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-06-02
- [Managing active sessions in ChatGPT](https://help.openai.com/de-de/articles/20001257-managing-active-sessions-in-chatgpt) - OpenAI Help Center
- [How do I log out of all of my devices?](https://help.openai.com/en/articles/9243857) - OpenAI Help Center
- [Introducing Advanced Account Security](https://openai.com/index/advanced-account-security/) - OpenAI
