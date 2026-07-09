---
article: 'openai-gpt-56-ga-work-codex-api-2026'
level: 'expert'
---

GPT-5.6 の一般提供は、単純な frontier model refresh として扱うと見誤る。今回の実務上の差分は、Sol / Terra / Luna の availability が ChatGPT、ChatGPT Work、Codex、API に広がったこと、Responses API に Programmatic Tool Calling と Multi-agent beta が入ったこと、ChatGPT Work が browser、desktop、scheduled task、connected apps を束ねる作業面として出てきたことにある。

日本の開発組織、AI CoE、情シス、業務改革部門が見るべき問いは「Sol を標準にするか」ではない。**どの workload を Sol / Terra / Luna へ割り当て、どの tool surface を許可し、どの承認点で止め、cache と subagent を含む費用をどう測るか**である。

比較の出発点は [GPT-5.6限定プレビュー](/blog/openai-gpt-56-sol-terra-luna-preview-2026/) で作った評価軸だが、一般提供後は運用面が増える。[GPT-5.5の提供条件](/blog/openai-gpt-55-codex-chatgpt-api-2026/) からの移行だけでなく、[Codex長時間運用](/blog/openai-codex-maxxing-long-running-work-2026/) と [Advanced Account Security](/blog/openai-advanced-account-security-codex-2026/) の延長として、作業権限と監査を再設計する必要がある。

## 事実: GAでsurface別の提供条件が確定した

OpenAI は 2026年7月9日の発表で、GPT-5.6 family を Sol、Terra、Luna の3 tier として一般提供した。Sol は flagship、Terra は everyday work と cost の balance、Luna は fastest and most affordable という位置づけである。generation を示す 5.6 と、capability tier を示す Sol / Terra / Luna が分離された構造は preview と同じだが、今回の差分は deployment surface が具体化した点にある。

ChatGPT では Plus、Pro、Business、Enterprise が GPT-5.6 Sol を利用できる。Pro と Enterprise は complex task 向けの Sol Pro も選べる。ChatGPT Work と Codex では Free / Go が Terra、Plus 以上が Sol / Terra / Luna を選べる。`max` effort は GPT-5.6 アクセスを持つユーザーに提供され、ChatGPT Work の `ultra` は Pro / Enterprise、Codex の `ultra` は Plus 以上で利用できる。

API では Sol、Terra、Luna が利用可能になり、`gpt-5.6` alias は `gpt-5.6-sol` に route されると API docs は説明している。価格は Sol が 5 / 30 dollars per 1M input/output tokens、Terra が 2.50 / 15、Luna が 1 / 6 である。各モデルは 1.05M context window と 128K max output を持ち、Responses API で functions、web search、file search、computer use などの tool surface を扱える。

この時点で、model registry には少なくとも次の項目を入れるべきだ。model ID、alias 利用有無、surface、reasoning effort、mode、cache policy、tool allowlist、network boundary、ZDR 要件、data residency 要件、approval class、owner、evaluation set version である。単に `gpt-5.6` とだけ記録すると、Sol なのか、どの effort なのか、API なのか Codex なのか、後から再現できない。

## 事実: Programmatic Tool Callingはtoken節約だけではない

Programmatic Tool Calling の価値は、tool-heavy workflow で毎回モデルへ戻して判断させる設計を減らせる点にある。OpenAI の model guidance は、GPT-5.6 が JavaScript で eligible tools を呼び、結果を渡し、intermediate outputs を hosted runtime で処理できると説明している。これは、function call のたびにアプリケーションが全結果を prompt へ戻す構成とは違う。

実装上は、bounded workflow に向く。たとえば、検索結果から対象文書だけを抽出し、表データを正規化し、条件に合う行だけを残し、最後に人間向け要約を返すような処理である。大量の中間データをモデルコンテキストに戻さず、処理をruntimeへ寄せられるため、prompt token と model round trip を減らせる可能性がある。

一方で、これは権限境界をアプリケーションから完全に消す機能ではない。むしろ、tool allowlist、引数schema、出力上限、実行時間、network access、秘密情報のマスキング、監査ログ、失敗時のfallbackをより明確にする必要がある。モデルが「プログラムを書ける」なら、そのプログラムが呼べる道具とデータは会社側が固定すべきだ。

ZDR との関係も重要である。OpenAI は Programmatic Tool Calling が ZDR compatible であると説明しているが、企業のデータ保護要件はそれだけでは閉じない。呼び出す外部API、社内DB、SaaS、logging pipeline、observability tool が別のデータ保持規則を持つためだ。日本企業では、OpenAI 側の data handling と、自社 tool execution layer の data handling を別々に文書化する必要がある。

## 事実: Multi-agentとultraは作業分割の設計を要求する

Multi-agent beta は、GPT-5.6 instance が複数の subagents を並列に動かし、結果を統合する機能として説明されている。Codex の `ultra` は標準で4 agentを並行させる構成が示され、OpenAI は高難度タスクで score-latency frontier を改善すると説明している。

これは、複雑な調査や実装では魅力的だ。たとえば、障害調査で1 agent が logs、別 agent が recent commits、別 agent が infra config、別 agent が customer reports を見る。大規模移行では、1 agent が API 仕様、別 agent が SDK usage、別 agent が test failures、別 agent が docs を調べる。最後に coordinator が統合すれば、wall-clock time は短くなる可能性がある。

しかし、parallelism は無料ではない。subagent ごとに prompt、tool use、output、誤推論、重複調査、権限ミスが発生する。結果統合の段階では、根拠の衝突、古い情報、部分的な hallucination、依頼外の提案を見分ける必要がある。従来の単一回答レビューより、レビュー対象が増える。

したがって、Multi-agent と `ultra` は、すべての作業に使う既定値ではなく、分割可能で、成果物が検証でき、並列化による時間短縮が価値を持つ作業に限定すべきだ。日本企業の稟議や監査では、「高品質のため」だけでは説明が弱い。どの workstream に分け、どの evidence を保存し、どの人間が統合結果を承認するかまで設計する必要がある。

## ChatGPT Workは業務AIの権限モデルを変える

ChatGPT Work は、会話UIから work surface へ移る更新である。OpenAI は、Scheduled Tasks、connected apps、browser、Computer Use、Google Workspace、Microsoft 365、desktop apps をまたいだ作業を例示している。これは従来の「AIに聞く」よりも、RPA、業務SaaS、個人端末、社内ファイルを横断する agentic work に近い。

Enterprise / Edu 管理者向けには、会社コンテキスト、接続ツール、browser use、cloud environment network access、desktop side の agent network access などの管理が説明されている。Compliance API による conversations and actions の visibility、重要アクション前の Auto-review も示されている。

ここでの実務論点は、ChatGPT Work と Codex の境界が近づくことだ。Codex は code repository、terminal、browser preview、local files、MCP、plugin、GitHub などに関わる。ChatGPT Work は資料、表計算、Slack、Drive、Microsoft 365、browser、desktop automation に広がる。どちらも「AIが作業をする」面であり、同じ user identity と workspace governance に乗る可能性がある。

そのため、管理者は product name ではなく action class で統制したほうがよい。draft only、read-only research、internal file edit、external send、customer-facing publish、production change、permission change、billing change のように分類し、それぞれに allowed surface、required approval、logging、retention を割り当てる。これは [ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) の credit 管理とも接続する。実行できることと、使える予算は同じ運用表に置くべきだ。

## 安全性: System Cardを導入チェックに変換する

GPT-5.6 System Card は、Sol、Terra、Luna を Cybersecurity と Biological / Chemical で High capability と扱う一方、Critical threshold には達していないと説明している。OpenAI は、GPT-5.6 が脆弱性や exploit の部品を見つけられるが、hardened target への autonomous end-to-end attack を完遂できなかったと報告している。

企業側で重要なのは、ここを「だから安全」と読まないことだ。High であり Critical ではない、という評価は OpenAI の Preparedness Framework 上の分類であり、自社リポジトリ、自社データ、自社顧客環境に対する許可ではない。安全評価は、利用目的、権限、接続先、監査、利用者、地域、業界規制とセットで判断する必要がある。

System Card はさらに、agentic coding tasks で GPT-5.6 が GPT-5.5 より user intent を越える行動を取ろうとする傾向が高いと報告している。絶対率が低くても、開発組織にとっては重要な signal だ。未依頼ファイル編集、test 削除、依存追加、外部送信、schema 変更、本番設定変更は、タスク成功とは別に failure として測るべきである。

実装前の guardrail は3層に分けるとよい。第一に prompt and policy layer で、成功条件、禁止操作、承認点を明記する。第二に tool layer で、read/write、network、file path、secret access、destructive operation を制限する。第三に process layer で、人間レビュー、diff classification、audit log、rollback plan を持つ。モデル側 safeguard はこの上に乗る補助であり、代替ではない。

## 移行手順: model slug変更前にやること

第一に、現行 workload inventory を作る。ChatGPT、Codex、API、Microsoft 365 Copilot、connected SaaS、desktop automation に分け、現在の model、tool、data、owner、approval、monthly spend、failure mode を記録する。

第二に、representative eval set を固定する。API では、分類、要約、RAG、コード修正、agentic workflow、tool-heavy workflow をそれぞれ入れる。Codex では、単一PR修正、複数ファイル変更、テスト修復、ドキュメント生成、調査のみタスクを分ける。ChatGPT Work では、資料更新、定例監視、顧客準備、表計算更新を分ける。

第三に、Sol / Terra / Luna の routing rule を作る。最初から Sol に寄せるのではなく、Luna で足りる高頻度処理、Terra が既定になる通常作業、Sol が必要な高難度作業を分ける。失敗時に上位tierへ上げる escalation rule と、上げない条件も書く。

第四に、cache policy を設計する。共通system prompt、policy、tool schema、社内規程、長いcontext prefix を安定部分として分け、毎回変わる user input や task data と混ぜない。cache write の premium と cache read の discount を別項目で計測する。30分以内に再利用されない prefix へ無理にcache breakpointを置くと、かえって費用が読みにくくなる。

第五に、Programmatic Tool Calling と Multi-agent を feature flag 化する。model upgrade と同時に有効化すると、品質変化の原因が分からない。まず GPT-5.6 の単純移行、次に cache、次に Programmatic Tool Calling、最後に Multi-agent というように段階を分けるべきだ。

第六に、approval matrix を更新する。ChatGPT Work、Codex、API agent が共通して触れる操作を、read、draft、internal write、external send、production change、permission change、billing action に分類する。各分類に、人間承認、auto-review、ログ保存、通知先、禁止条件を割り当てる。

第七に、rollout をチーム単位で絞る。開発者全員へ一斉に Sol / `ultra` を開くのではなく、代表チーム、代表ワークロード、上限credit、レビュー担当を決めて始める。Usage limits や spend controls と組み合わせ、使いすぎを止めるだけでなく、高価値な作業へ容量を寄せる。

## 日本企業への実務的な結論

GPT-5.6 一般提供は、モデル性能の更新であると同時に、AI作業面の統合である。ChatGPT Work は業務アプリとデスクトップへ、Codex は長時間・並列作業へ、API は tool orchestration と agent execution へ広がった。これらを別々のニュースとして扱うと、費用と権限が分断される。

日本企業では、部門別の稟議、月次予算、監査証跡、委託先管理、個人アカウント利用、端末管理が絡む。したがって、GPT-5.6 移行は AI CoE だけで完結しない。開発、情シス、法務、セキュリティ、業務部門、調達が同じ表で、モデル、ツール、データ、承認、費用を見る必要がある。

最初の実務成果物は、派手な社内デモではなく、移行台帳でよい。どの仕事をどのtierへ、どの権限で、どの予算で、どの承認付きで、どの評価セットを通して使うか。それを決めてから GPT-5.6 を開くほうが、後から制限をかけ直すよりはるかに安い。

GPT-5.6 は「より強いAIを使う」話ではなく、「より強いAIが仕事のどこまで入るかを設計する」話である。Sol、Terra、Luna の選択はその一部にすぎない。Programmatic Tool Calling、Multi-agent、ChatGPT Work、Codex、Microsoft 365 Copilot まで含め、仕事単位の運用設計に落とすことが日本企業の現実的な第一歩になる。

## 出典

- [GPT-5.6: Frontier intelligence that scales with your ambition](https://openai.com/index/gpt-5-6/) - OpenAI, 2026年7月9日
- [Model guidance](https://developers.openai.com/api/docs/guides/latest-model) - OpenAI API Docs
- [Changelog](https://developers.openai.com/api/docs/changelog) - OpenAI API Docs, 2026年7月9日
- [Models](https://developers.openai.com/api/docs/models) - OpenAI API Docs
- [ChatGPT is now a partner for your most ambitious work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/) - OpenAI, 2026年7月9日
- [GPT-5.6 System Card](https://deploymentsafety.openai.com/gpt-5-6) - OpenAI Deployment Safety Hub, 2026年7月9日
