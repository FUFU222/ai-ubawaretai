---
title: 'ChatGPT Library管理、外部アプリ承認の実務'
description: 'ChatGPT Libraryと外部アプリ承認を整理。日本企業がファイル保持、自動参照、Compliance API、Sign in with ChatGPTの承認をどう管理すべきか解説する。'
pubDate: '2026-06-15'
category: 'news'
tags: ['OpenAI', 'ChatGPT', '管理者設定', '監査ログ', '企業導入', 'セキュリティ']
series: 'openai-security-controls'
draft: false
---

OpenAI は ChatGPT Enterprise / Edu の 2026年6月11日 release notes で、Enterprise、Edu、Healthcare ワークスペース向けに **Library** を展開すると案内した。メンバーが ChatGPT にアップロードしたファイルや ChatGPT で作成したファイルを、後から探して再利用しやすくする機能である。同じ更新では、Global Admin Console に Sign in with ChatGPT の外部アプリ利用を管理する設定も追加されている。

これは、単なるファイル置き場の追加ではない。ChatGPT が会話、ファイル、接続アプリ、社内認証をまたいで使われるほど、管理者は「何を保存するか」「いつ自動参照するか」「誰が外部アプリへサインインできるか」「監査や削除をどう扱うか」をまとめて設計する必要がある。

以前の [ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) は、接続SaaSを使う前に人間へ確認する線を扱った。[ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) は、OpenAI アカウントに残る端末やセッションの棚卸しだった。今回の Library と外部アプリ承認は、その中間にある。ChatGPT の中に残るファイルと、ChatGPT ID で外部サービスへ入る入口を、企業管理の対象として明確にする更新だ。

## 事実: Libraryで何が変わるか

OpenAI の説明では、Library は Enterprise、Edu、Healthcare ワークスペースのメンバーが、ChatGPT にアップロードしたファイルや ChatGPT で作成したファイルを見つけ、再利用するための場所である。ファイルはワークスペースの保持ポリシーに従う。つまり、個人のローカル整理ではなく、組織のデータ保持や削除ルールと結びつく。

重要なのは、自動参照の扱いだ。ワークスペース owner は、ChatGPT が応答時に Library ファイルを自動で参照するかどうかを制御できる。自動参照をオフにしても、Library そのものが消えるわけではない。メンバーは、必要に応じて Library を閲覧、検索、開く、添付することができる。Healthcare ワークスペースでは、自動参照は既定でオフとされている。

もう一つの実務ポイントは、Compliance API である。OpenAI は、Library ファイルを export または delete するための Library 専用 Compliance API endpoint も利用できると説明している。これは、監査や開示対応、退職者対応、保存期間満了時の削除に関わる。

Library は外部共有や共同編集を新しく導入するものではない。ここは誤解しないほうがよい。今回の主眼は、ChatGPT 内のファイル再利用を便利にしつつ、保持、自動参照、監査、削除の管理面を整えることにある。

## 事実: 外部アプリ承認も同じ日に更新された

同じ 2026年6月11日の release notes では、Global admin console updates として、Sign in with ChatGPT の external app access controls も示された。Cloud Console から、管理者は組織メンバーが Sign in with ChatGPT を使って外部アプリへアクセスできるかどうかを管理できる。

Global Admin Console の説明では、管理者は組織で Sign in with ChatGPT を有効または無効にできる。さらに、承認済みアプリだけを許可する設定にし、個別アプリを approve または disable できる。対象例には OpenAI Academy も含まれる。

これは [OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) で扱った「ChatGPT の中で何を使わせるか」と近いが、少し違う。Skills や接続アプリは ChatGPT 内の作業能力を広げる。一方、Sign in with ChatGPT は、OpenAI アカウントを外部アプリの入口として使う話である。日本企業では、SAML / OIDC、社内IdP、Google Workspace、Microsoft Entra とどう重ねるかを確認する必要がある。

## 分析: ファイル保存とID連携を分けて考えない

ここからは分析だ。

日本企業では、ChatGPT 導入の議論が「どのモデルを使うか」「どの部署に配るか」に寄りやすい。しかし実際のリスクは、モデル選定よりもデータの残り方と接続面に出る。Library によって、会話中の一時ファイルだったものが、後から検索・再利用できる資産になる。Sign in with ChatGPT によって、ChatGPT アカウントが外部アプリ利用の入口にもなる。

この二つを別々の担当が見ると、運用の穴ができる。情シスが ID 連携だけを見て、現場が Library に保存されたファイルを見ない。逆に、AI推進担当が Library の便利さだけを見て、外部アプリの承認や退職時の失効を見ない。これでは、業務利用が広がるほど説明が難しくなる。

たとえば、営業部門が提案書、見積ドラフト、顧客ヒアリングメモを ChatGPT で扱うとする。Library が有効なら、ファイル再利用は楽になる。一方で、古い提案条件、個人情報、NDA対象資料が残り続ける可能性もある。さらに、関連する外部アプリへ Sign in with ChatGPT で入れるなら、誰がどのアプリを使えるかもセットで見るべきだ。

同じ流れは [OpenAIのOffline検索](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) ともつながる。ChatGPT が社内ファイルや過去文脈を参照できるほど、回答品質は上がる。しかし、参照対象が古い、不要、権限外、削除対象であれば、便利さはリスクに変わる。

## 実務: 日本企業が確認すべき5点

第一に、Library の自動参照をワークスペース単位でどう扱うかを決める。一般的な企画、開発、教育用途では自動参照が便利な場面も多い。一方で、医療、金融、法務、人事、M&A、顧客個別情報を扱う部署では、最初はオフまたは限定運用から始めるほうが説明しやすい。

第二に、チャット削除とファイル削除を混同しない。OpenAI の保持ポリシー説明では、チャットとファイルは別管理になる。会話を消しただけで Library ファイルまで消えると誤解すると、退職者対応や情報開示対応で漏れが出る。社内手順では、会話、Library ファイル、Project / GPT の添付ファイル、接続アプリ側の原本を分けて確認する。

第三に、Compliance API の対象を監査手順に入れる。Library 専用の export / delete endpoint があるなら、監査ログ、保持期間、削除依頼、eDiscovery、個人情報開示請求のどこで使うかを決める必要がある。導入時に法務・セキュリティ・情シスで確認しておきたい。

第四に、Sign in with ChatGPT の外部アプリ承認を IdP 管理と並べて棚卸しする。Google や Microsoft の SSO だけを管理していても、OpenAI アカウント経由の外部アプリ入口が別に広がるなら、承認済みアプリ一覧、無効化手順、退職時の扱いを揃える必要がある。

第五に、利用者へ「保存されるもの」を説明する。Library は便利な再利用機能だが、利用者が一時添付のつもりでファイルを入れると、後から残り方に驚く。アップロードしてよいファイル、消すべきファイル、自動参照される可能性、Healthcare など高機微領域での扱いを短い社内ガイドに落とすべきだ。

## まとめ

ChatGPT Library は、Enterprise / Edu / Healthcare でファイルを見つけ直し、再利用しやすくする更新である。同時に、保持ポリシー、自動参照、Compliance API、外部アプリ承認を管理者が見る必要を強める更新でもある。

日本企業が見るべき論点は、「Library が便利か」だけではない。ChatGPT の中に残るファイルと、ChatGPT アカウントで入れる外部アプリを、同じ情報管理の表に載せられるかである。接続アプリ、セッション、Skills、Offline検索と合わせて、ChatGPT を業務基盤として扱うための管理線を整える段階に入っている。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-06-11
- [File storage and Library in ChatGPT](https://help.openai.com/en/articles/20001052-file-storage-and-library-in-chatgpt) - OpenAI Help Center
- [Global Admin Console](https://help.openai.com/en/articles/12289294-global-admin-console) - OpenAI Help Center
- [Chat and File Retention Policies in ChatGPT](https://help.openai.com/en/articles/8983778-chat-and-file-retention-policies-in-chatgpt) - OpenAI Help Center
