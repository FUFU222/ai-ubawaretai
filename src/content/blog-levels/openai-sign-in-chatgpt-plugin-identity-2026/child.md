---
article: 'openai-sign-in-chatgpt-plugin-identity-2026'
level: 'child'
---

OpenAI は 2026年7月29日、**Sign in with ChatGPT beta** を発表しました。これは、対応するプラグインやパートナーサイトで、ChatGPT アカウントを使って外部サービスのアカウントを作成したり、既存アカウントをリンクしたりできるようにするものです。

最初の対象として、Airtable、GitLab、HubSpot、Notion、Supabase、Vercel などが挙げられています。便利な機能ですが、会社で使う場合は「ログインが簡単になった」で終わらせない方がよいです。

## 何が共有されるのか

OpenAI の説明では、Sign in with ChatGPT で共有されるのは、名前、メールアドレス、プロフィール画像がある場合の画像です。ただし、プラグインが何にアクセスできるかは、別途確認して承認します。

つまり、サインインと権限付与は同じではありません。ChatGPT アカウントで外部サービスへ入ることと、そのサービスのデータを ChatGPT や Codex が読んだり変更したりできることは、別の判断です。

この点は [ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) とつながります。アプリを使うとき、どの操作で確認を出すかを管理する話です。今回の更新は、その前段にある「どのアカウントで外部サービスに入るか」を扱います。

## 会社でなぜ注意が必要なのか

会社では、外部 SaaS のアカウント作成やログイン方法を管理していることが多いです。Google Workspace や Microsoft Entra ID で SSO を強制していたり、退職者のアカウントをまとめて止めたり、部署ごとに使える SaaS を分けたりします。

Sign in with ChatGPT が広がると、利用者は ChatGPT から簡単に外部サービスへ入れるようになります。これは便利ですが、会社の標準 SSO を迂回して個人アカウントを作ってしまう可能性もあります。

たとえば Vercel や Supabase は開発・本番環境に近いサービスです。GitLab はコードや CI に関わります。HubSpot は顧客情報、Notion や Airtable は社内文書や業務データを持つことがあります。どれも、個人判断だけでつなげてよいサービスではありません。

## プラグイン管理とは別に見る

OpenAI の plugin controls では、プラグインの可用性、コネクタのアクセス、action の許可、外部サービス側の認可、実行時の権限を分けて考えます。

これは少し難しく聞こえますが、要するに「使えるボタンがある」だけでは安全とは言えないということです。ChatGPT 側でプラグインが使えても、外部サービス側で広すぎる権限を持っていれば危険です。逆に、外部サービス側が厳しくても、ChatGPT 側で誰でもプラグインを入れられるなら運用が乱れます。

[ChatGPT Businessプラグイン管理](/blog/openai-chatgpt-business-plugin-admin-controls-2026/) で見たように、管理者はプラグインを誰に配るかを決められます。今回の Sign in with ChatGPT では、それに加えて、外部サービスのアカウントが会社管理なのか個人管理なのかを見ます。

## 最初に決めること

まず、対応する外部 SaaS を会社で使ってよいか確認します。すでに契約済みのサービスなのか、個人利用だけなのか、機密情報を入れてよいのかを分けます。

次に、会社の SSO と合っているかを見ます。ChatGPT アカウントでサインインした結果、会社管理のテナントに入るのか、個人アカウントが新しく作られるのかは重要です。退職時に止められないアカウントが増えると、後から回収が難しくなります。

三つ目に、プラグイン権限を見ます。読み取りだけでよいのか、作成や更新も許すのか、削除や共有のような操作は毎回確認させるのかを決めます。この考え方は [ChatGPT Google連携](/blog/openai-google-app-oauth-scopes-2026/) の OAuth scope 確認とも同じです。

## まとめ

Sign in with ChatGPT beta は、外部サービスを使い始める摩擦を下げる機能です。ただし会社では、便利さと同じくらい、アカウント管理、SSO、退職者対応、プラグイン権限、外部データアクセスを見る必要があります。

まずは少人数、少数の SaaS、低リスクな用途で試すのがよいでしょう。そのうえで、ChatGPT 側の workspace 権限、プラグイン設定、外部 SaaS 側のアカウントとロールを同じ台帳で確認できるようにすると、安全に広げやすくなります。

## 出典

- [ChatGPT Release Notes - July 29, 2026](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [Plugin controls](https://learn.chatgpt.com/docs/enterprise/apps-and-connectors)
