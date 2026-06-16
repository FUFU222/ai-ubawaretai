---
article: 'openai-chatgpt-sites-business-rbac-2026'
level: 'expert'
---

ChatGPT Sites は、Codex の出力を hosted internal app に変える機能として見るべきです。2026年6月16日時点の OpenAI 公式資料では、Business workspace では既定オン、Enterprise/Edu workspace では RBAC による有効化、Workspace settings > Sites からの停止、保存版と production deploy の分離、workspace/internal audience、hosted environment values が運用上の論点として見えてきました。

この話は、以前の [OpenAI Codex役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/) と切り分ける必要があります。前回は、Codex が role-specific plugins と Sites preview で業務AIへ拡張されるプロダクト戦略を扱いました。今回は、実際に Sites を enable した後に、誰が作り、誰が deploy し、どの data boundary で公開し、どの費用枠で止めるかという governance 設計が主題です。[Codex Business spend controls](/blog/openai-codex-business-spend-controls-2026/) と [ChatGPT BusinessのCodex seats](/blog/openai-chatgpt-business-codex-seats-2026/) を読んだチームほど、Sites は費用と権限を同時に見るべき更新だと分かるはずです。

## 事実整理: SitesはCodexからhostingまでをつなぐ

OpenAI の Codex Sites developer guide は、Sites を「Codex から hosted sites を build and deploy する plugin」と説明している。対象は website、web app、game で、OpenAI が hosting を管理する。ユーザーは Codex thread で新しい site を作ることも、既存 project を Sites に対応させることもできる。

Business release notes では、Sites は ChatGPT Business workspace with Codex access 向け preview として説明されている。Business では enabled by default であり、admins と owners は Workspace settings > Permissions & Roles から enablement と access を管理し、Workspace settings > Sites から created sites を disable できる。

Enterprise/Edu release notes では、eligible Enterprise/Edu workspaces 向け preview として説明され、default off である。admins と owners が workspace settings と RBAC で有効化し、published sites も Workspace settings > Sites で disable できる。

この違いから、Business は現場試作が先に始まりやすく、Enterprise/Edu は管理者設計が先に入る。日本企業で Business を部門導入している場合、Sites は「契約規模が小さいからリスクも小さい」とは言い切れない。むしろ管理者が少なく、情シスレビューが薄い workspace ほど、内部アプリが unmanaged asset になりやすい。

## 保存版とdeployの境界を運用に落とす

Sites publishing には、保存版と deploy の二段階がある。保存版は deployable site を build して source Git commit と紐付ける review candidate であり、deploy はその version を production URL として audience に見せる操作である。この二段階は、AI生成物の governance においてかなり重要だ。

一般的なCI/CDでは、pull request、preview environment、approval、production deploy という境界がある。Sites でも同じ発想が必要になる。Codex が作ったからといって、保存版を飛ばして deploy してよいわけではない。特に database migration、file storage、environment secrets、workspace identity を含む site は、小さく見えても production application である。

レビューでは、少なくとも次を確認する。第一に、build が成功しているか。第二に、source changes と database migrations が想定通りか。第三に、production URL に見せてよい audience か。第四に、runtime secret values が source file に混ざっていないか。第五に、削除や停止が必要になった時に Workspace settings > Sites から誰が操作するか。

この考え方は [ChatGPT Google連携のOAuth承認](/blog/openai-google-app-oauth-scopes-2026/) と同じです。ユーザーが便利に感じる連携ほど、管理者は「実行前承認」「scope」「外部影響」「取り消し可能性」を見る必要がある。Sites は外部SaaSへの action ではなく hosted app deployment だが、権限を開いた後に影響範囲が広がる点は同じである。

## データ設計: D1/R2相当を軽く扱わない

developer guide は、Sites の site shape を選ぶ際、保存レコードや user progress、game scores には D1、画像や文書、音声、動画などの upload には R2、metadata 検索を伴う upload には D1 と R2 の組み合わせ、workspace user identity が必要な内部 site には workspace-authenticated identity を指定する考え方を示している。

これは、Sites が静的HTMLの置き場ではないことを意味する。D1 や R2 のような永続データがあるなら、データ分類、保存期間、削除依頼、退職者の所有物、事業部移管、監査時の説明、バックアップ、リージョン要件を考えなければならない。

日本企業では、最初の use case をかなり絞ったほうがよい。安全な初期ユースケースは、個人情報を含まない社内FAQ、公開済み資料から作る研修ページ、チーム内の非機微なタスク一覧、サンプルデータだけを使う業務プロトタイプである。逆に、顧客データ、契約データ、人事評価、医療・金融・教育上の機微情報、未公開価格、認証情報を扱う site は、通常の業務システムと同じ審査に上げるべきだ。

## アクセス制御: owner/adminから始める

Sites developer guide は、deployed URL を共有する前に audience を設定するよう求めている。access mode は owner/admin、workspace 全体、custom users/groups に分かれる。新規 site では、内容、データ取り扱い、想定 audience をレビューするまで owner/admin に限定する設計が実務的である。

ここで避けたいのは、workspace_all を初期値として考えることだ。日本企業の ChatGPT workspace は、部署横断、グループ会社混在、委託先アカウント、教育用アカウントを含むことがある。workspace 全体が必ず同じ情報境界とは限らない。custom access を使えるなら、部門、プロジェクト、職務、管理者グループ単位で公開するほうが安全である。

Enterprise/Edu では RBAC を使って Sites の利用自体を絞れる。Business では既定オンであるため、少なくとも管理者が最初に Workspace settings を確認し、必要なら role や site 停止の運用を決める。現場が試作を始める前に、approved template、forbidden data、review owner、deploy approver を決めておくと事故が減る。

## 秘密情報とsource boundary

Sites は `.openai/hosting.json` に project linkage と optional storage binding names を置く。developer guide は、hosted environment values と secrets を Sites panel で管理し、secret values を `.openai/hosting.json` に置かないよう案内している。ローカル `.env` と `.env.example` は keys を揃えるために使い、実値は source に含めない。

この点は、AIが生成したコードだからこそ重要である。人間の開発者なら secret を commit しない訓練を受けていても、Codex に「このAPIを使って」と雑に頼むと、サンプル token や社内URL、Webhook secret、OAuth client secret の扱いが曖昧になる可能性がある。Sites の deploy 前 review では、UI だけでなく repository diff と environment values を確認する。

また、Sites の site が外部 app や社内APIに接続する場合、workspace user identity と API credential の責任範囲を分ける必要がある。利用者本人の権限で読むのか、site 共通の service credential で読むのかでは、監査とリスクが変わる。初期段階では、read-only、サンプルデータ、手動upload、owner/admin限定から始めるのが現実的である。

## 費用と運用停止を同時に設計する

Sites を単体で見ると、軽量な内製アプリ公開機能に見える。しかし実際には、Codex に作らせ、何度も修正し、build を検証し、公開後も改修する。この過程は Codex usage と workspace credits の管理対象になる。Business で Sites が既定オンなら、開発部門以外の業務部門が Codex 消費を増やす可能性がある。

そのため、Sites enablement は spend controls と一緒に決める。部門別に monthly cap を置くのか、特定 role だけに追加利用を許すのか、試作用 workspace と本番 workspace を分けるのか、公開済み site の保守作業を誰の予算に載せるのか。これらを曖昧にすると、社内アプリは増えるが、所有者と費用負担が見えなくなる。

停止手順も同時に必要だ。作成者の退職、部門異動、データ分類変更、利用停止、誤公開、脆弱性発見、コスト超過が起きたとき、誰が Workspace settings > Sites で disable するのか。停止後のデータ削除や export が必要か。利用者への告知は誰が出すのか。軽量アプリでも業務に使われ始めると、止め方を決めていないことが一番のリスクになる。

## 日本企業向けの初期導入モデル

最初の30日は、Sites を「社内PoC公開面」として扱う。Business なら既定オンを確認し、必要に応じて対象 role を絞る。Enterprise/Edu なら最初から RBAC で限定 role を作る。ユースケースは、非機微データの internal dashboard、研修ページ、部門内FAQ、サンプルデータの workflow prototype に限る。

次の30日は、deploy 前 checklist を固定する。保存版確認、source diff、database/storage 使用有無、secret scan、audience、owner、削除条件、費用枠を1枚の運用表にする。Codex に作らせる速度より、公開前に何を確認するかを標準化する。

その後、業務部門に広げるなら、business owner と technical owner を分ける。business owner は内容、データ分類、利用者範囲に責任を持つ。technical owner は build、secrets、storage、deploy、disable に責任を持つ。情シスやセキュリティは、禁止データとレビュー観点を定義する。

## まとめ

ChatGPT Sites は、Codex の作業結果を hosted internal app にする機能であり、Business では既定オン、Enterprise/Edu では RBAC 有効化という差がある。保存版と production deploy の分離、D1/R2相当の永続データ、workspace/authenticated access、hosted secrets、site disable まで含めると、これは小さな社内PaaSに近い。

日本企業が見るべきポイントは、AIでアプリが早く作れることではない。早く作れるからこそ、公開前レビュー、アクセス範囲、保存データ、秘密情報、費用、停止手順を先に決めることだ。Sites は便利な試作環境として始めるべきだが、業務に使われ始めた瞬間から、通常の内製システムと同じ責任が発生する。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
- [Sites - Codex](https://developers.openai.com/codex/sites) - OpenAI Developers
