---
article: 'openai-work-codex-rbac-controls-2026'
level: 'child'
---

OpenAIが、会社や学校向けのChatGPT Enterprise / Eduで、**Work** と **Codex** の管理設定を細かく分けられるようにしました。Workは長い調査や資料作成のためのAI作業、Codexはソフトウェア開発のためのAI作業です。

今回のポイントは、新しいAIが増えたことではありません。管理者が「誰に、どの作業を、どの速さで、どこまで使わせるか」を分けやすくなったことです。

## Work LocalとWork Cloud

まず、Work LocalとWork Cloudを分けて管理できます。

Work Cloudは、web、mobile、desktopなどをまたいでcloud taskを始めたり見たりできる作業です。たとえば、会社のパソコンで始めたWorkを、あとで別の画面から確認するような使い方に関係します。

Work Localは、desktop appでローカルの作業をするための設定です。OpenAIの説明では、Work Localだけが有効でWork Cloudが無効な場合、local workはできますがcloud tasksは始められません。

これは日本企業では大事です。社内端末の中だけで作業させたい部署もあれば、クラウドで続けて作業したい部署もあります。人事、法務、顧客資料、開発コードでは、同じ設定にしないほうがよい場合があります。

## Fast Modeの既定値

次に、管理者はWorkとCodexのstarting model、reasoning level、speed、Fast ModeなどをModelsページから設定できます。

ただし、これは「使えないモデルを使えるようにする」設定ではありません。利用できるモデルや機能は、role-based accessなどの設定に従います。Fast Modeの既定値は、最初にどの体験で始まるかを決めるものです。

Fast Modeは便利ですが、費用にも関係します。Codex rate cardでは、Fast Modeは対応モデルで高いrateのcreditsを使うと説明されています。また、Work、Codex、Excel、Workspace Agentsは同じagentic usage and credit poolを使う場合があります。つまり、速さの設定は、会社の予算管理にも関係します。

## RBACの画面がわかりやすくなった

OpenAIは、Roles and Permissionsページも再設計したと説明しています。ただし、既存のWorkやFast Modeの権限は引き継がれ、既存roleの動きは変わらないとされています。

これは、管理画面が変わっただけで突然権限が変わるわけではない、という意味です。一方で、画面が整理されたので、会社は古い権限のままでよいかを見直すチャンスでもあります。

たとえば、[ChatGPTデスクトップ統合](/blog/openai-chatgpt-desktop-work-codex-classic-2026/)で説明したように、Chat、Work、Codexは同じdesktop appに並び始めています。さらに[ChatGPT VoiceのWork/Codex拡大](/blog/openai-chatgpt-voice-work-codex-desktop-2026/)のように、音声で作業を始める入口も増えています。入口が増えるほど、管理者設定もきちんと分ける必要があります。

## 日本企業でやること

まず、誰がWorkを使ってよいかを決めます。全員にWork Cloudを開くのか、特定の部署だけにするのか、localだけ許すのかを分けます。

次に、Codexを使う開発者と、Workを使う業務部門を分けます。Codexはlocal folders、repositories、terminalsなどに関係します。Workは資料作成、調査、レポート、Sitesなどに関係します。同じChatGPTの中にあっても、触るデータや危険は違います。

最後に、Fast Modeとcreditsを見ます。速い設定は便利ですが、たくさん使うと費用が増えることがあります。[ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/)と同じように、使う人数だけでなく、どの作業がどれだけcreditsを使うかを見る必要があります。

## まとめ

今回の更新は、ChatGPT WorkとCodexを会社で安全に広げるための管理機能です。Work Local、Work Cloud、Fast Mode、roleを分けて考えられるようになりました。

子ども向けに言えば、同じ道具箱の中でも、家で使う道具、学校の外でも使える道具、早く動くけれど使いすぎに注意する道具を、先生が班ごとに分けられるようになったということです。会社では、この分け方を先に決めてからWorkとCodexを広げるべきです。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-07-30
- [Managing workspace settings in ChatGPT Enterprise](https://help.openai.com/en/articles/8411955-managing-workspace-settings-in-chatgpt-enterprise) - OpenAI Help Center
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
