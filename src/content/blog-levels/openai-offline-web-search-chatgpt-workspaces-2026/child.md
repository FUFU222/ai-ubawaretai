---
article: 'openai-offline-web-search-chatgpt-workspaces-2026'
level: 'child'
---

OpenAIのHelp Centerに、**Offline web search for ChatGPT workspaces** という説明があります。これは、ChatGPTがWebを検索するときに、毎回ライブのWeb検索へ行くのではなく、OpenAIがすでに集めているインデックス済み・キャッシュ済みのWebコンテンツを使う設定です。

対象は、すべてのChatGPTユーザーではありません。OpenAIは、一部のEnterprise、Edu、Healthcare、Teachers、規制対象や政府系のワークスペース向けの設定として説明しています。つまり、会社や学校などが管理するChatGPTで、Web検索の扱いをより慎重にしたいときの話です。

## ふつうの検索と何が違うのか

ふつうのChatGPT Searchでは、ChatGPTが必要だと判断したときにWeb検索を使います。EnterpriseやEduでは、ワークスペース設定やロール権限で検索をオン・オフできます。OpenAIの説明では、検索クエリがBingなどへ送られる場合がありますが、ユーザーIDやアカウントIDなどとは切り離されるとされています。

Offline web searchは、そのライブ検索を使わず、OpenAI側にすでにあるインデックスやキャッシュを使います。イメージとしては、「今その場で外へ探しに行く」のではなく、「すでに持っている公開Web情報の範囲から探す」に近いです。

これは、検索クエリをライブ外部検索へ出したくない組織には便利です。たとえば、法務、人事、医療、教育、公共系の部署では、何を調べているか自体が敏感な情報になることがあります。その場合、ライブ検索を完全に許すより、キャッシュ検索に寄せたいことがあります。

## 便利だけど万能ではない

大事なのは、Offline web searchは「より安全だから常に正しい」という機能ではないことです。

OpenAIは、Offline web searchがリアルタイム情報や特定URLの確認、監査証跡が必要な仕事には向かないと説明しています。たとえば、今日変わった価格、障害情報、最新の規制発表、特定ページがある時点で何を書いていたかの証明には弱いです。

また、あるURLを必ず読ませたい場合でも、そのページがOpenAIのインデックスやキャッシュに入っていなければ使えません。新しいページ、ログインが必要なページ、動的なページ、クロールを拒否しているページは読めないことがあります。

そのため、重要な資料を確認したいときは、ファイルをアップロードしたり、必要な文章を貼り付けたり、許可されたライブ検索を使ったりする必要があります。

## 日本企業ではどう使うべきか

日本企業では、全員に同じ検索設定を使わせるより、部署や業務で分けるのがよさそうです。

たとえば、役員室、法務、人事、医療・教育・公共系の高リスク部署では、Offline web searchやLockdown Modeを使う価値があります。一方、広報やマーケティング、開発者の公式ドキュメント確認では、最新情報が必要なのでライブ検索や公式ページ確認が必要になることもあります。

この話は、以前の[OpenAI新セキュリティ設定でChatGPTとCodex運用はどう変わるか](/blog/openai-advanced-account-security-codex-2026/)ともつながります。アカウントを守る設定だけでなく、Web検索の経路も管理する必要があるからです。また、[OpenAIがPrivacy Filterを公開。日本企業は生成AI前段のPIIマスキングをどう内製化するか](/blog/openai-privacy-filter-pii-redaction-2026/)のように、AIへ入れる前に個人情報を減らす考え方ともセットで見るべきです。

## 管理者が確認すること

管理者は、まず自分のワークスペースでOffline web searchが使えるのかを確認します。次に、ワークスペース全体に適用するのか、ロール単位で適用するのか、Lockdown Modeが必要なのか、他の機能が制限されるのかを確認します。

ユーザーへの説明も大切です。Offline web searchを使うと、検索できる情報が古かったり、特定URLを開けなかったりすることがあります。ユーザーがそれを知らないと、「ChatGPTが読めないのはおかしい」「検索結果が古い」と混乱します。

結論として、Offline web searchは、ChatGPTを企業で安全に使うための選択肢です。ただし、最新情報の確認や証拠が必要な調査には向きません。日本企業は、検索をオン・オフで考えるのではなく、「どの業務にどの検索経路を使わせるか」を決める必要があります。

## 出典

- [Offline web search for ChatGPT workspaces](https://help.openai.com/en/articles/20001203-offline-web-search-for-chatgpt-workspaces)
- [ChatGPT search for Enterprise and Edu](https://help.openai.com/en/articles/10093903-chatgpt-search-for-enterprise-and-edu)
- [Lockdown Mode](https://help.openai.com/en/articles/20001061-lockdown-mode)
