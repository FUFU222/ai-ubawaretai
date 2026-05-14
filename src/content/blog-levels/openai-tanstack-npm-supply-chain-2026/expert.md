---
article: 'openai-tanstack-npm-supply-chain-2026'
level: 'expert'
---

OpenAIのTanStack npm供給網攻撃への対応は、2026年のAIセキュリティ運用でかなり重要なケーススタディです。表向きには「macOS版ChatGPT Desktop、Codex App、Codex CLI、Atlasを6月12日までに更新する」という利用者向け案内ですが、実務で読むべき本題はもっと深い。**AI企業の製品信頼が、npm、GitHub Actions、cache、OIDC trusted publishing、code signing certificateの連鎖に依存している**ことが、かなり具体的に表に出たからです。

同じOpenAIのセキュリティ系更新でも、[OpenAI新セキュリティ設定でChatGPTとCodex運用はどう変わるか](/blog/openai-advanced-account-security-codex-2026/)はアカウント防御の話でした。今回のTanStack対応は、開発者端末と供給網の話です。[OpenAIのOffline検索でChatGPT企業利用はどう変わるか](/blog/openai-offline-web-search-chatgpt-workspaces-2026/)が外部検索経路の統制を扱ったのに対し、今回はビルドと配布の信頼経路を扱っている。同じ `openai-security-controls` の中でも、統制対象がユーザー、データ、パイプラインへ広がっていると見たほうがよいです。

## 事実: OpenAIの影響範囲は限定的だが軽くない

OpenAIは2026年5月13日、TanStack npm supply chain attackへの対応を公開しました。発表では、TanStack npmがMini Shai-Huludと呼ばれる広範な供給網攻撃の一部として侵害され、OpenAIの企業環境では従業員端末2台が影響を受けたと説明しています。

OpenAIの説明で重要なのは、否定していることと認めていることを分けている点です。OpenAIは、ユーザーデータへのアクセス、本番システムや知的財産の侵害、OpenAIソフトウェアの改ざんについて証拠はないとしています。顧客パスワードやAPIキーも影響を受けていないと説明しています。

一方で、影響を受けた従業員がアクセスできた一部の内部ソースコードリポジトリでは、認証情報を狙った活動があり、限定的なcredential materialが外部へ出たことを認めています。さらに、そのリポジトリには製品のcode signing certificatesが含まれていたため、OpenAIは予防的に証明書をローテーションします。

この結果、macOS利用者には具体的な作業が発生します。OpenAIはChatGPT Desktop、Codex App、Codex CLI、Atlasを公式経路から更新するよう求め、2026年6月12日に旧証明書を完全失効させると説明しています。失効後、旧証明書で署名された古いmacOSアプリは、新規ダウンロードや初回起動がmacOS側の保護で止まる可能性があります。

ここでOpenAIは、旧証明書による新しいnotarizationを止め、過去のnotarizationを確認し、不審な署名利用は見つかっていないとも述べています。つまり、今すぐ偽OpenAIアプリが流通していると断定する話ではありません。正確には、**将来のなりすまし配布リスクを閉じるために、配布信頼の材料を入れ替える対応**です。

## 事実: TanStackの攻撃経路は「正当なCIが悪用された」形

TanStack側のポストモーテムは、今回の本質を理解するための一次情報です。TanStackは、複数のnpmパッケージがマルウェア入り成果物として公開され、外部研究者の報告で発覚したと説明しています。攻撃は単発のアカウント侵害ではなく、CI workflowの信頼境界をまたぐ形で成立しました。

流れはこうです。攻撃者はTanStack/routerのforkを使い、pull requestを開いたうえで、すぐに閉じました。通常なら、mergeされていないPRのコードがリリースへ入ることはありません。しかし、問題のworkflowでは `pull_request_target` が関係し、fork由来のコードがbase repository文脈のjobで動き、共有cacheへ書ける状態がありました。

その後、まったく別の正当なPRがmainへmergeされ、通常のrelease workflowが走りました。このworkflowが汚染されたcacheを復元し、攻撃コードがrunner上で動きました。さらに、OIDC trusted publisherによってrelease時に発行される短命のpublish tokenがrunnerメモリから取り出され、npmへ悪性バージョンを公開するのに使われた、という説明です。

この攻撃が厄介なのは、近年推奨されてきた防御の一部をすり抜ける点です。TanStackは長寿命のnpm publish tokenをmaintainer端末に置いていませんでした。OIDC trusted publisherを使い、publishはworkflowに紐づいていました。npm provenanceも監査証跡として残ります。にもかかわらず、workflow自体が攻撃者のcacheを読み、正当なタイミングでpublish credentialを作ってしまえば、攻撃者はその正当経路を利用できます。

この点は、[GoogleとNICT・デジタル庁がAIサイバー防御を始動](/blog/google-nict-digital-agency-ai-cybersecurity-japan-2026/)で扱ったSLSAの議論と表裏です。SLSAやprovenanceは供給網の透明性を上げます。しかし、証跡が「正しいworkflowから出た」と示しても、そのworkflowの入力やcache境界が汚染されていれば、透明なだけでは守れません。証明すべき対象は、成果物だけでなく、workflowの信頼境界まで広がります。

## 分析: provenanceは免罪符ではなく監査材料

ここからは分析です。

今回のTanStack事例は、provenanceやOIDCの価値を否定するものではありません。むしろ、どのworkflow runがpublishしたか、どのbranchから出たか、どの時刻に何が起きたかを早く辿るうえでは、強い監査材料になります。問題は、その材料を「安全の証明」と読みすぎることです。

日本企業でSLSAやnpm provenanceを導入する場合、「provenanceが付いていれば依存物を通す」という単純なゲートにすると危ない。必要なのは、provenanceの発行元workflowがどのtrust boundaryを持っているかを見ることです。外部forkのPRでcacheを書けるのか。release workflowがそのcacheを読むのか。workflow file変更にCODEOWNERSが必要か。Actionsはcommit SHAでpinされているか。publish jobの前に人間の承認や別経路の検証があるか。

TanStackが事件後に挙げた対策は、そこをよく示しています。pnpm cacheの無効化、影響workflowからのcache削除、全GitHub Actionsのcommit SHA pinning、SMS以外の2FA強制、`pull_request_target` の撤去、pnpm 11への更新、zizmorの導入検討、`.github` フォルダのCODEOWNERS強化。どれも「署名やprovenanceを付ける」だけではなく、workflow形状と権限境界を直す対策です。

OpenAI側も、Axios関連対応後にminimumReleaseAge、provenance検証、CI/CD credential hardeningを進めていたが、今回の影響端末にはまだ適用されていなかったと説明しています。これはかなり現実的な失敗です。セキュリティ施策はロードマップに載せただけでは効きません。展開率、例外端末、ロールアウト順、未適用端末の検出が運用の本体です。

## 日本企業のCI/CD棚卸し観点

日本の開発組織が今すぐ見るべき観点は、少なくとも6つあります。

1つ目は、`pull_request_target` の利用です。OSSや外部委託先からのPRを受けるリポジトリでは、base repository権限でfork由来コードを動かす構成が残りやすい。GitHub Security Labが以前から警告してきたpwn request patternは、今回のTanStackで改めて現実の被害につながりました。外部PRの検査はsandboxed `pull_request` で行い、権限が必要な処理は成果物を介した `workflow_run` に分ける設計が基本になります。

2つ目はcache境界です。Actions cache、pnpm store、npm cache、コンパイラcache、Docker layer cacheは、速度改善のために広く使われます。しかし、信頼できないPRが書いたcacheをrelease workflowが読むなら、それは依存物そのものと同じ攻撃面になります。release jobではcacheを使わない、restore-onlyにする、keyをtrust levelで分ける、fork PRではwrite不可にする、といった明示設計が必要です。

3つ目はActionsのpinningです。`actions/checkout@v6` や `@main` のようなfloating refsは、正当なtagやbranchが後から変わるリスクを残します。TanStackは事件後に全Actionsをcommit SHAへ固定したと説明しています。日本企業でも、少なくともrelease、deploy、publish、secret accessを含むworkflowではSHA pinningを標準にしたほうがよいです。

4つ目はpublish credentialの扱いです。OIDC trusted publisherは長寿命tokenより望ましいが、万能ではありません。tokenが発行されるworkflow stepの前後で、どのコードが実行され、どのcacheが読み込まれ、どの成果物がpublish対象になるかを確認する必要があります。manual approvalやenvironment protectionを組み合わせ、release jobへ到達できる経路を絞るべきです。

5つ目は新規公開パッケージの取り込み遅延です。OpenAIが言及したminimumReleaseAgeの考え方は、日本の開発組織にも有効です。攻撃パッケージは公開直後に発覚することが多い。新規公開から一定時間はCIで採用しないだけでも、被害の入口を狭められます。pnpm 11のinstall cooldownや、社内proxyでの遅延承認も検討できます。

6つ目はAIエージェントとcredentialの距離です。[GitHub DependabotのAI修復記事](/blog/github-dependabot-ai-agent-remediation-2026/)で見たように、依存更新や脆弱性修正はAIエージェントへ流れ始めています。これは便利ですが、agentが触るbranch、workflow、cache、secret、publish権限の境界を曖昧にすると、正当な自動化経路が攻撃経路になります。AIがPRを作ることと、AIがrelease credentialへ近づくことは分けて設計すべきです。

## OpenAIアプリ更新を運用に落とす

利用者側の実務も軽視できません。OpenAIはmacOSアプリ更新を6月12日までに求めています。日本企業では、ChatGPT DesktopはMDMで把握できても、Codex CLIは個別に入っている可能性があります。AtlasやCodex Appも、正式展開前の検証端末に残っているかもしれません。

対応は3段階で考えるとよいです。まず、jamf、Intune、端末管理スクリプト、開発者アンケートで対象アプリを棚卸しする。次に、公式経路から更新させ、旧バージョンを検出する。最後に、6月12日以降に古いアプリが起動できない場合のヘルプデスク手順を用意する。特にCLIは、`which codex` やpackage manager経由のインストール場所が端末ごとに違う可能性があります。

この作業は単発のOpenAI対応に見えますが、実は企業AI運用の標準手順として再利用できます。AIツールはWebアプリだけではなく、デスクトップ、CLI、IDE拡張、ブラウザ拡張として広がります。署名証明書のローテーション、旧バージョン失効、偽配布サイトへの注意喚起、公式download経路の固定は、今後も繰り返し必要になります。

## 結論: AI導入の信頼はCI/CDから崩れる

OpenAIのTanStack npm供給網攻撃対応は、AI企業の信頼がモデルの中だけで決まらないことを示しました。従業員端末、npmパッケージ、CI cache、OIDC publish token、code signing certificates、macOS notarizationがつながり、そのどこかが揺れると利用者向けアプリ更新まで波及します。

日本企業が取るべき態度は明確です。OpenAI macOSアプリを更新する。同時に、自社のGitHub Actions、npm/pnpm運用、cache境界、release credential、Actions pinning、外部PR運用を棚卸しする。AIエージェントを開発に入れるなら、PR作成権限とrelease権限を明確に分離する。

モデル選定やプロンプト設計だけをAI導入と呼ぶ段階は終わりつつあります。これからは、AIツールを動かす開発基盤の統制まで含めて、企業AIの安全性を説明する必要があります。今回のOpenAIとTanStackの事例は、そのチェックリストをかなり具体的にしてくれたと言えます。

## 出典

- [Our response to the TanStack npm supply chain attack](https://openai.com/index/our-response-to-the-tanstack-npm-supply-chain-attack/) - OpenAI, 2026-05-13
- [Postmortem: TanStack npm supply-chain compromise](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem) - TanStack, 2026-05-11
- [Hardening TanStack After the npm Compromise](https://tanstack.com/blog/incident-followup) - TanStack, 2026-05-12
