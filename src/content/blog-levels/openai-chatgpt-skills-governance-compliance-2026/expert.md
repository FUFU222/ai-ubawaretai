---
article: 'openai-chatgpt-skills-governance-compliance-2026'
level: 'expert'
---

OpenAI の 2026年5月27日付 ChatGPT Enterprise / Edu release notes にある **Skills governance, upload safety, and compliance updates** は、ChatGPT の enterprise control surface が一段具体化した更新だ。Skills は reusable workflow であり、instructions、examples、supporting resources、code を含められる。つまり、単なるプロンプトではなく、業務手順と実行補助物を束ねた配布単位である。

今回の更新は、能力追加というより統制追加である。admin Skills page、Permissions & roles の追加トグル、uploaded skills の事前スキャン、Compliance Logs Platform の Skills 対応、conversation event streams の `skill_id` は、すべて Skills が組織内で増えた後に起きる問題を先回りしている。誰が作ったのか。誰が使えるのか。誰が公開したのか。外部から来た Skill は安全なのか。会話でどの Skill が使われたのか。これらを管理できないと、Skills は productivity feature ではなく unmanaged workflow になる。

この更新は、[OpenAI新セキュリティ設定でChatGPTとCodex運用はどう変わるか](/blog/openai-advanced-account-security-codex-2026/)で扱ったアカウント保護、[OpenAI安全要約、ChatGPT高リスク会話の新設計](/blog/openai-chatgpt-safety-summaries-2026/)で扱った会話安全、[OpenAIのOffline検索でChatGPT企業利用はどう変わるか](/blog/openai-offline-web-search-chatgpt-workspaces-2026/)で扱った検索境界と同じ流れにある。ChatGPT は、個人が自然文で使うツールから、企業が権限、データ接続、監査、配布物を管理する業務基盤へ寄っている。Skills はその中でも、会社の「仕事の型」を AI に渡す場所になる。

## 事実: Skills の企業統制面が増えた

OpenAI の release notes によると、今回の更新は ChatGPT Enterprise と Edu の Skills に対する governance、safety、compliance の更新である。Skills は early access のままで、Enterprise / Edu workspace では引き続き既定オフと説明されている。ここは重要だ。OpenAI は Skills を便利機能として全社自動開放するのではなく、workspace owner / admin が明示的に有効化する対象として扱っている。

追加された統制は大きく4つある。第一に dedicated admin Skills page だ。管理者は workspace skills を確認し、access を更新し、ownership を transfer し、不要な Skill を delete できる。Skills in ChatGPT の説明では、このページで Owner、Access、Users、Invocations 30d、Created、Updated などを見られ、All、Invite only、Workspace で filter し、Skill、Created、Updated で sort できるとされている。

第二に Permissions & roles の追加権限である。OpenAI は、workspace owners が誰に skills usage、skill file upload、sharing、workspace publish、install for other members を許すか制御できると説明している。追加トグルは、Skills を有効化した後は既定オンになる。つまり、有効化直後に最小権限になっているわけではない。企業側は、オンにした後すぐに role 設計を確認する必要がある。

第三に uploaded skills のスキャンである。ユーザーが skill file をアップロードすると、利用可能になる前に ChatGPT がスキャンする。多くはスキャン後すぐ使えるが、一部は Needs Review となり、潜在的に危険なものは Blocked になる。OpenAI は、スキャンは利用者自身の review、policies、judgment の代替ではないとも説明している。これは、外部 Skill を組織に持ち込む時の責任が OpenAI に丸ごと移るわけではない、という意味である。

第四に Compliance Logs Platform 対応だ。release notes は、Compliance Logs Platform が Skills の list、export、delete をサポートし、conversation event streams に `skill_id` を含めると説明している。Skills in ChatGPT でも、skills support the Compliance Logs Platform とし、skill events と conversation event streams 内の skill references を review できると説明されている。これは、Skill の存在管理と会話内使用の突合を可能にする方向の更新である。

## Skills は「業務標準の実装物」になる

企業導入で最初に整理すべき概念は、Skill は prompt template ではない、という点だ。OpenAI の説明では、Skill は ChatGPT に特定タスクをより一貫して実行させる reusable, shareable workflow であり、instructions、examples、code を含められる。より structured な作業では、毎回同じように実行される steps も含められる。

この定義をそのまま日本企業の業務に当てると、Skills は業務標準の実装物になる。営業提案の構成、契約レビューの観点、障害報告テンプレート、稟議資料の論点、カスタマーサポートの初動分類、コードレビューの観点、セキュリティチェック項目などが Skill 化される可能性がある。つまり、会社の暗黙知や標準手順が、文書ではなく AI が読む配布物になる。

これは強い。強いからこそ管理がいる。業務標準の文書なら、文書管理番号、owner、承認者、版、発効日、改定履歴を持つ。しかし Skill が個人作成のまま共有されると、同じような管理が抜ける。ある部署では旧版の手順、別部署では新版の手順、外部委託先ではさらに別の Skill が使われる、という状態が起きる。AI が生成する成果物は似た見た目になるため、どの基準で作られたかが見えにくい。

今回の admin Skills page と owner transfer は、この問題への直接的な対策だと読める。退職や異動で owner が不在になった Skill を移管できる。利用されなくなった Skill を delete できる。Invocations 30d を見て、実際に使われている Skill と棚卸し対象を切り分けられる。日本企業では、ここを情報システム部門だけに任せず、業務 owner と監査部門も入れた運用にする必要がある。

## Role 設計は5権限を分ける

OpenAI が示した Permissions & roles の粒度は、そのまま導入設計の粒度になる。Enable skills、Enable skill uploading、Share skills、Publish skills to workspace、Enable skills installing は同じ権限ではない。

Enable skills は利用と作成の入口である。全社員へいきなり開けると、個人用 Skill が増える。これは普及には効くが、管理対象の母数も増える。最初は AI 推進チーム、情シス、法務、開発リードなど、業務標準化の責任を持つ role に限定するのが現実的だ。

Enable skill uploading はより慎重に扱うべきだ。アップロード Skill は外部ファイルを取り込む入口であり、Skill には code や supporting resources が含まれうる。OpenAI の scan はリスク低減になるが、会社固有の機密分類、利用禁止データ、業務規程、法令対応までは判断できない。外部 Skill の持ち込みは、少なくとも高リスク部署では承認制にすべきである。

Share skills は、個別の workspace members や groups への共有を可能にする。これはチーム内の再利用に効く。一方で、Share と Publish は分けたい。Publish skills to workspace は workspace library へ置く行為であり、事実上の社内標準化に近い。Publish には業務 owner の承認を必要にするべきだ。

Enable skills installing はさらに強い。他の member に Skill を install できると、本人が明示的に選ばなくても Skill が利用環境へ入る可能性がある。標準業務 Skill を展開するには便利だが、権限を広げると「便利だから入れておいた」という形で影響範囲が広がる。install 権限は、workspace admin か明確な delegated admin に絞るのがよい。

## Uploaded skills scanning を過信しない

OpenAI の upload scanning は必要な機能だが、日本企業のセキュリティ設計では過信してはいけない。OpenAI は、Most uploaded skills are available immediately、Needs Review、Blocked という処理を説明しているが、同時に scan should not replace your own review, policies, or judgment と明記している。

これは実務上かなり重要だ。スキャンが見つけるのは、一般的な危険性やポリシー上の問題が中心になるはずだ。一方、会社ごとの禁止事項は別である。たとえば、ある Skill が「顧客名簿を読み込み、営業優先度を出す」手順を含む場合、一般には危険ではなくても、自社の個人情報管理規程では禁止かもしれない。ある Skill が外部 API への貼り付けを前提にしていれば、OpenAI 上では問題なくても、社内のデータ持ち出し規程に抵触するかもしれない。

また、Skill は supply chain として扱うべきだ。OSS の package と同じく、誰が作ったか、どの version か、どのファイルを含むか、更新履歴は何か、依存先はあるかを確認したい。社外 vendor が納品する Skill は、ソースコード、instructions、含まれるファイル、想定データ、禁止データ、テスト結果を納品物としてレビューする。将来的には、Skill の SBOM 的な考え方も必要になる。

## Compliance Logs は30日保持前提で設計する

OpenAI Compliance Platform の説明では、Compliance Platform は ChatGPT workspace の logs と metadata を eDiscovery、DLP、SIEM tools へ接続する仕組みである。Compliance Logs Platform は immutable, append-only compliance log events、Stateful Compliance API は request 時点の state query に使う。Skills がここに入ることで、Skill の管理イベントと会話内参照を監査線に載せやすくなる。

ただし、保持期間は設計上の制約になる。OpenAI は Compliance Logs Platform retains data for 30 days と説明し、より長い保持が必要なら継続的に download して自社 policy に従って保持するよう求めている。日本企業の内部監査、金融、医療、公共、教育、訴訟対応では、30日だけでは足りないケースが多い。したがって、Skills を有効化する前に、Compliance Logs を SIEM や data lake へ取り込む job を用意するべきだ。

監査で見るべきイベントも決めておく。Skill created、uploaded、shared、published、installed、owner transferred、access changed、deleted、conversation referenced などを分類し、高リスクイベントを alert にする。たとえば、外部由来 Skill が workspace publish された、機密部署で初めて使われた、退職予定者 owner の Skill が大量利用されている、削除直前に export された、といった条件は監査対象になりうる。

`skill_id` の扱いも重要だ。名前は変わる可能性があるが、ID は突合キーになる。会話ログ側で `skill_id` を見て、当時の Skill metadata、owner、version 相当の情報、access scope と結びつけられなければ、後から「その出力はどの手順に基づいたのか」を説明しにくい。Compliance Logs を取るだけではなく、Skill inventory の snapshot を残す設計が必要である。

## 他の OpenAI 統制機能との接続

Skills governance は単独で完結しない。アカウント保護、検索制御、会話安全、remote access、data residency と組み合わせて初めて意味が出る。

[OpenAI新セキュリティ設定でChatGPTとCodex運用はどう変わるか](/blog/openai-advanced-account-security-codex-2026/)で扱ったように、強い認証や復旧鍵管理は「誰が使うか」の境界を作る。Skills governance は「その人がどの業務手順を AI に使わせるか」の境界を作る。アカウントが弱ければ、Skill の公開や install 権限も危険になる。

[OpenAIのOffline検索でChatGPT企業利用はどう変わるか](/blog/openai-offline-web-search-chatgpt-workspaces-2026/)で扱った検索制御は、外部情報へのアクセス境界を作る。Skills が web search や connected apps を使う業務手順を前提にしている場合、Skill 権限だけでは足りない。検索、apps、connectors、files、Skills を合わせて role ごとに設計する必要がある。

[OpenAI Codexモバイル化、開発チームの遠隔運用点](/blog/openai-codex-mobile-remote-access-2026/)で扱った remote access と access tokens も同じ文脈だ。AI が人間の席を離れて作業を続けるほど、どの instructions、plugins、Skills、tokens、connected hosts が使われたかを追う必要がある。ChatGPT 側の Skills と Codex 側の Skills はまだ製品間同期しないが、OpenAI は Agent Skills open standard に従うと説明している。標準が揃うほど、企業側の管理方針も横断で必要になる。

## 日本企業向けの導入モデル

現実的な導入は3段階に分けるのがよい。

第一段階は restricted pilot だ。対象を AI 推進チーム、情シス、法務、開発リードなどに絞る。Upload は禁止または承認制にする。Publish は管理者だけにする。Compliance Logs を取り込み、Skill inventory を週次で確認する。この段階では、便利な Skill を増やすより、管理手順を検証する。

第二段階は approved workspace library だ。業務 owner がいる Skills だけを workspace に公開する。各 Skill に目的、対象部署、禁止データ、想定 input、human review 必須条件、更新日、次回レビュー日を付ける。社内規程やテンプレートに紐づく Skill は、規程改定と同時に更新する。

第三段階は role-based deployment だ。部門ごとに必要な Skills を install し、利用ログを月次で確認する。営業、開発、法務、人事、サポートで使う Skills は違う。全社員に同じ library を見せるより、role ごとに絞るほうが誤用を減らせる。高リスク部署では upload を閉じ、承認済み Skill だけを使わせる。

## 評価指標は利用回数だけでは足りない

Skills の adoption を見るとき、Invocations 30d は便利な入口だ。しかし利用回数が多いことは、正しいことを意味しない。むしろ利用回数が急増した Skill ほどレビューが必要になる。評価指標は、利用部署、成果物の採用率、手戻り、エスカレーション、禁止データ入力の有無、外部 Skill 起源かどうか、最終レビュー者を含めるべきだ。

特に法務、セキュリティ、人事、金融関連では、Skill の出力がそのまま最終判断に使われていないかを見る必要がある。Skill は業務手順を補助するが、責任を移転しない。社内説明では、「Skill が作ったから正しい」ではなく、「承認済み Skill を使い、人間が確認したから採用した」という責任線にするべきである。

## まとめ

OpenAI の Skills governance 更新は、ChatGPT Enterprise / Edu の Skills を本格的な企業運用に近づける更新だ。admin Skills page、role permissions、uploaded-skill scanning、Compliance Logs support、`skill_id` in conversation streams は、Skills を広げるためではなく、広がった Skills を制御するためにある。

日本企業にとって、今回の論点は「Skills が便利になった」では足りない。Skills は業務標準、監査、権限、データ保護、外部 supply chain の交差点になる。ChatGPT を全社展開するなら、Skills を有効化する前に、role、upload、publish、install、owner transfer、log retention、SIEM integration、review cycle を決める必要がある。Skills の価値は、使えることではなく、管理された形で再利用できることにある。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-05-27
- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066) - OpenAI Help Center
- [OpenAI Compliance Platform for Enterprise and Edu Customers](https://help.openai.com/en/articles/9261474-openai-compliance-platform-for-enterprise-and-edu-customers) - OpenAI Help Center
