---
article: 'anthropic-claude-status-errors-reliability-2026'
level: 'expert'
---

2026年6月22日から24日にかけて Claude の公式 status に複数の elevated errors が並んだことは、単なる一過性の service health issue ではない。Claude API、Claude Code、Claude Cowork、claude.ai、Claude Console を含む incident が短期間に複数回発生したことで、AI provider を本番業務へ組み込む側の resilience engineering が問われている。

このサイトでは、[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) で AI エージェントの実行境界を扱い、[Claude Code権限ルールとsubagent管理](/blog/claude-code-2178-subagent-permissions-2026/) で permission policy と MCP 最小権限を扱った。また [Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) では、Anthropic 直結ではなく Bedrock、Vertex、Foundry、LLM gateway を経由する運用の論点を整理した。今回の status incident は、これらを可用性と復旧設計の観点からつなぎ直す材料になる。

特に日本企業では、AI 導入が PoC から本番業務へ移るほど、利用部門は「AIが便利か」ではなく「AIが止まった時に業務をどう続けるか」を問われる。契約、個人情報、委託先、顧客説明、内部監査、システム運用が絡むため、multi-provider fallback だけを抽象論として置いても足りない。どの業務で、どのデータを、どのモデルへ、どの法的・監査条件で流せるかまで決める必要がある。

## 事実: 連続したincidentは入口横断で起きた

Anthropic の status incident history では、2026年6月22日 00:37 UTC に Opus 4.8、Opus 4.7、Opus 4.6、Sonnet 4.6、Haiku 4.5 の elevated error rates が記録された。impact は major で、affected components には claude.ai、Claude API、Claude Code、Claude Cowork が含まれていた。updates には各モデルの recovery、fix implementation、monitoring、resolved が記録されている。

同日 08:11 UTC には Claude Opus 4.8 の elevated errors、19:14 UTC には many models across Claude の elevated errors が記録された。どちらも resolved だが、Claude API、Claude Code、Claude Cowork が影響範囲に含まれる。これは、単一の UI outage ではなく、モデル面または provider 面の不安定さが複数の product surface へ波及した状態として扱うべきだ。

6月23日 06:28 UTC には Claude Opus 4.8 の elevated errors があり、14:19 UTC には multiple models across Claude の elevated error rate が critical impact として作成された。この incident では claude.ai、Claude Console、Claude API、Claude Code、Claude Cowork が major outage へ遷移し、その後 partial outage、operational へ戻った。status update は、14:08 UTC から15:33 UTC まで multiple models への request で elevated error rates があったと説明している。

その後も6月23日 18:24 UTC に claude.ai の elevated error rates、6月24日 13:16 UTC に Claude Opus 4.8 の elevated error rate、6月24日 18:22 UTC に Opus 4.8 Fast の elevated errors が記録された。短時間で resolve したものもあるが、利用者側にとっては「いつ戻ったか」だけでなく「どの依存業務が同時に影響を受けたか」が重要になる。

## 事実: API error taxonomyは復旧分岐に使える

Anthropic の API errors ドキュメントは、HTTP status と error type を対応づけている。401 authentication_error、403 permission_error、413 request_too_large、429 rate_limit_error、500 api_error、504 timeout_error、529 overloaded_error などである。さらに streaming response では、200 response が返った後に error が起きる場合があり、通常の HTTP status だけでは完結しないことも示している。

この taxonomy は、利用側の control plane に取り込むべきである。401/403 は credential、workspace、API key、provider account、AWS SigV4 などの構成問題なので、blind retry は無駄である。413 は prompt compression、file chunking、retrieval window、batching の設計問題である。429 は rate limit と traffic shaping の問題であり、queue、backoff、priority class、per-workspace limit が関係する。500/504/529 は provider 側の一時不調や処理負荷の可能性があり、短期 retry、circuit breaker、fallback、user-visible degradation policy の対象になる。

Rate limits ドキュメントでは、organization level の service-configured limits と workspace level の user-configurable limits が説明されている。短い時間幅で enforcement されることがあり、60 RPM が 1 request per second のように効く例も挙げられている。limits は maximum allowed usage であり guaranteed minimum ではない。この一文はSLO設計上かなり重い。rate limit の数字をそのまま availability guarantee と誤読してはいけない。

また、Claude Platform on AWS では billing や spend limit の扱い、tier advancement、workspace rate limit configuration が direct Anthropic と異なることも docs に示されている。企業が direct Claude API、Claude Platform on AWS、Bedrock、Vertex、Foundry、gateway を併用するなら、同じ Claude でも control plane と commercial boundary が違う。可用性設計は provider 名ではなく route 単位で行う必要がある。

## 分析: SLOはAI応答ではなく業務結果で定義する

AI基盤の SLO を「Claude API が何秒以内に応答する」と書くと、provider 依存の可用性を自社が約束する形になりやすい。より現実的には、業務結果で SLO を定義すべきである。たとえば、PRレビュー補助なら「AI不可時もレビュー待ちの p95 を何時間以内に保つ」、問い合わせ一次分類なら「AI unavailable 時は queue へ入り、優先度高の問い合わせを何分以内に人間へ escalte する」、障害対応メモなら「AI要約不可時はテンプレートで手動記録し、後から補完できる」といった形である。

この定義にすると、Claude が degraded でも業務SLOを守るための選択肢が増える。retry で戻るまで待つ、別モデルへ route する、人間へ渡す、処理を延期する、低リスク業務だけ止める、既存テンプレートへ fallback する、という分岐を業務ごとに決められる。逆に、AI応答そのものをSLOにすると、provider incident が起きた瞬間に自社SLOも破綻する。

日本企業では、顧客向けSLA、委託契約、金融・医療・公共の監査、個人情報保護、社内統制があるため、fallback 先を自由に選べないことも多い。Claude から別 provider へ切り替えると、データ処理地域、ログ保存、学習利用、監査ログ、権限管理、契約主体が変わる可能性がある。だからこそ、fallback はアーキテクチャだけでなく法務・セキュリティ・調達の decision record として残す必要がある。

## Control planeに入れるべき5つの仕組み

第1は error classification である。HTTP status、Anthropic error type、request_id、streaming 後半 error、timeout、client disconnect、gateway error を正規化する。アプリケーションは raw message ではなく分類済み error に基づいて分岐する。429、500、504、529 を同じ retry bucket に入れない。

第2は circuit breaker である。Claude 側の error rate が一定閾値を超えたら、重要度の低い job を止め、重要 job を queue へ逃がし、UI には degraded mode を出す。すべての request が retry storm を起こすと、provider にも自社にも悪い。日本の業務システムでは、月末や朝会後、CI の集中時間、営業締切前に burst が起きやすいので、rate smoothing と breaker を組み合わせるべきだ。

第3は priority queue である。社内FAQの改善、記事下書き、要約、開発補助、障害対応、顧客返信を同じ queue に入れない。重要度と期限、データ分類、fallback可否で分ける。Claude が不安定な時ほど、低リスク・低緊急の job を止め、高緊急の job を人間へ渡す判断が必要になる。

第4は provider route registry である。direct Anthropic、Claude Platform on AWS、Bedrock、Vertex、Foundry、gateway、local cache、手動テンプレートを route として登録し、どの業務・データ分類・地域・監査条件で使えるかを明示する。これは [Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) の論点ともつながる。経路が増えるほど、route policy がないと説明不能になる。

第5は runbook と replay である。Claude Code の途中作業なら、未完了 diff、実行済み command、失敗した request、未実行テスト、次の人間作業を残す。API なら request_id、payload class、user-visible impact、fallback action、再実行可否を残す。incident 後に、同じ job を安全に replay できるかを確認する。

## Claude CodeはAPI retryだけでは守れない

Claude Code はAPI clientではあるが、実務上は開発環境の operator でもある。ファイルを読み、編集し、shell を実行し、MCP を呼び、subagent を起動し、場合によっては長時間の work loop を持つ。provider error が起きたとき、単に再試行するだけでは、途中の作業状態や人間のレビュー責任が曖昧になる。

たとえば、Claude Code が修正を途中まで進め、test 実行前に API error で止まったとする。この状態で必要なのは、差分の保存、未検証であることの明示、実行した command と実行していない command の区別、次に人間が見るべき file の列挙である。auto retry が成功しても、同じ編集 intent を二重に適用しない保証も必要になる。

subagent を使う場合はさらに複雑だ。main agent が止まっても subagent の成果物が残っているか、MCP から取得した情報が古くないか、permission boundary が保たれているかを確認する必要がある。[Claude Code権限ルールとsubagent管理](/blog/claude-code-2178-subagent-permissions-2026/) で扱った role-based subagent policy は、可用性の観点でも有効だ。役割ごとに権限と成果物が決まっていれば、失敗時の引き継ぎも明確になる。

## MCPと外部SaaSは障害時のblast radiusを広げる

AIエージェントが MCP を通じて GitHub、Jira、Slack、Google Drive、Confluence、DWH、CRM、監査ログへ接続している場合、Claude の不安定さは単なる生成失敗ではなく workflow failure になる。issue 更新が途中で止まる、PR コメントが二重投稿される、ticket classification が遅れる、社内文書検索が incomplete になる、といった副作用が起こりうる。

ここで必要なのは idempotency である。MCP tool call が write を伴うなら、request key、dry-run、transaction log、human approval、retry safe design を持つべきだ。AIの応答が失敗したのか、tool call が失敗したのか、tool call は成功したが応答返却が失敗したのかを分けられないと、復旧時に二重実行が起きる。

また、外部SaaS側の rate limit と Claude 側の rate limit が重なることもある。Claude が遅いので retry し、そのたびに Jira や GitHub の検索をやり直すと、二重の rate limit に近づく。AI基盤の retry は、下流SaaSの呼び出しも含めて設計しなければならない。

## 日本企業向けの実装順序

最初の一週間でやるべきことは、Claude依存の棚卸しである。API key、workspace、Claude Code 利用者、MCP server、gateway、batch job、CI、社内bot、顧客向け機能、手動利用を一覧にする。部署、データ分類、利用時間帯、失敗時影響、代替手順を書き込む。

次に error handling matrix を作る。401/403 は credential owner へ、413 は入力分割へ、429 は queue/backoff へ、500/504/529 は short retry と breaker へ、streaming 後半 error は partial output policy へ、といった分岐を定義する。これはコードだけでなく運用手順にも落とす。

3つ目に、fallback policy を業務ごとに決める。顧客データを含む job は別 provider へ自動転送しない、社内公開情報だけなら別 route を許す、障害対応は人間テンプレートへ戻す、PRレビューはAI不可時に reviewer queue へ戻す、といった形である。データ分類と業務重要度を組み合わせる。

4つ目に、observability をつなぐ。provider status、request_id、error type、latency、retry count、fallback action、user impact、manual override を同じダッシュボードや incident record に残す。[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) で扱った監査の文脈と同じく、AI利用は便利さだけでなく証跡で運用する段階に入っている。

5つ目に、game day を行う。Claude API が529を返し続ける、Claude Code が長時間作業中に失敗する、MCP write が成功したか不明になる、rate limit が月末に発生する、というシナリオで演習する。SRE、情シス、開発、法務、事業部門が同じ incident record を見られるか確認する。

## まとめ

6月22日から24日の Claude status は、Anthropic の品質を断定する材料ではなく、利用側の設計成熟度を点検する材料である。AI provider は今後も強力になり、社内業務へ深く入る。だからこそ、provider incident が起きた時の自社側の戻し方が重要になる。

日本企業が取るべき姿勢は、Claude を避けることではない。Claude を本番で使うなら、error taxonomy、rate limit、circuit breaker、priority queue、route registry、runbook、observability を持つことだ。AIの成功時だけを見て導入すると、障害時に業務が止まる。AIの失敗時まで設計できれば、Claude はより現実的な業務基盤になる。

## 出典

- [Claude Status - Incident History](https://status.anthropic.com/) - Anthropic, accessed 2026-06-24
- [Anthropic Docs: Errors](https://docs.anthropic.com/en/api/errors) - Anthropic Docs
- [Anthropic Docs: Rate limits](https://docs.anthropic.com/en/api/rate-limits) - Anthropic Docs
