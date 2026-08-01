---
article: 'openai-codex-gpt54-retirement-terra-luna-2026'
level: 'expert'
---

OpenAI の 2026年7月31日更新は、Codex の model lifecycle event として扱うべきである。GPT-5.4 と GPT-5.4 mini が 2026年8月31日に Codex から退役する。対象は ChatGPT でサインインした Codex user であり、OpenAI API access と API key authenticated Codex sessions は今回の告知では影響外とされている。

一見すると小さな changelog だが、企業運用では影響範囲の切り分けが難しい。Codex CLI、IDE extension、Codex Cloud、desktop app、custom agents、scheduled tasks、managed configuration、社内テンプレートに model id が残るからだ。すでに [GPT-5.6価格改定](/blog/openai-gpt56-price-fast-mode-2026/) で見たように、Sol、Terra、Luna は費用と能力を分ける運用単位になっている。今回の退役は、そのモデル階層を Codex の実運用へ強制的に反映する期限である。

## 事実整理: 影響範囲は認証方式で分かれる

OpenAI の changelog は、GPT-5.4 と GPT-5.4 mini が 8月31日に Codex で使えなくなると説明し、代替として GPT-5.6 Terra と GPT-5.6 Luna を指定している。さらに、期限前に workspace defaults、saved model settings、managed configurations、custom agents、scheduled tasks を更新するよう促している。

この記述から、影響範囲は product name ではなく authentication boundary で読む必要がある。ChatGPT sign-in の Codex は対象である。API key authenticated sessions は対象外である。OpenAI API も対象外である。したがって、同じ `gpt-5.4` という文字列が repository、gateway、CLI config、workspace admin setting にあっても、同じ緊急度ではない。

誤対応の典型は2つある。第一に、API 本番実装を今回の期限で急いで変えることだ。これは不要な regression risk を増やす。第二に、API は影響外だから Codex も放置することだ。これは 8月31日以降に、開発者の local agent workflow、IDE からの作業、定期 Codex task、社内 agent が失敗するリスクを残す。

## モデル置換はコスト置換でもある

OpenAI Help Center の Codex rate card は、token-based pricing を input tokens、cached input tokens、output tokens ごとの credits per million tokens として示している。GPT-5.6 Terra と Luna は、GPT-5.4 と GPT-5.4-Mini の単純な別名ではない。モデル世代、rate、性能特性、cache の効き方、output-heavy task での費用感が変わる。

ここで必要なのは、旧モデルから新モデルへの mechanical replacement ではなく、workload class ごとの標準化である。軽い repository exploration、ログ読み、差分要約、仕様確認は Luna に寄せる。実装、レビュー修正、複数 file の変更、テスト失敗調査は Terra を標準にする。長時間の multi-agent work、広範囲 refactor、high-stakes security review は Sol、GPT-5.5、あるいは承認付きの高能力モデルへ分ける。

[Codex座席設計](/blog/openai-chatgpt-business-codex-seats-2026/) で整理したように、Business / Enterprise では seat type、workspace credits、token-based rate card、標準席と Codex-only seat の違いが費用管理に関わる。モデル退役のたびに現場が自由に高いモデルへ移ると、AI agent の費用は説明しにくくなる。移行先モデルを admins が推奨するだけでなく、部門別に何を標準とするかを決めるべきだ。

## 棚卸し対象はコードだけではない

モデル退役対応で、まず repository を `rg "gpt-5.4|gpt-5.4-mini"` するのは妥当だ。しかしそれだけでは足りない。Codex は user tool でもあり、workspace tool でもあり、automation surface でもある。

確認すべき層は少なくとも6つある。

第一に、developer local configuration である。`~/.codex/config.toml`、workspace-level config、dotfiles、Bootstrap scripts、MDM で配る managed settings に古い model id がないかを見る。

第二に、IDE と app の saved settings である。VS Code、JetBrains、Codex desktop app、web / cloud の model picker に user-level saved model が残る場合、管理者側の標準設定だけでは消えない。

第三に、custom agents と scheduled tasks である。OpenAI の changelog がこの2つを名指ししているのは重要だ。人間が毎日起動する作業ならエラーに気づけるが、定期実行や agent template は silent failure になりやすい。

第四に、社内 docs である。Notion、Google Docs、Confluence、GitHub README、研修資料、オンボーディング動画、社内 Slack の pinned message に古い model recommendation が残る。これらは検索しにくく、問い合わせ増加の原因になる。

第五に、評価データである。過去の benchmark や model comparison に GPT-5.4 / mini を baseline として残す場合、退役後の比較軸をどう読むかを明記する。過去比較は残してよいが、新規 rollout の推奨モデルとして残してはいけない。

第六に、委託先と子会社である。日本企業では、Codex の実利用が外部開発会社や海外拠点に広がることがある。自社 workspace の設定だけを直しても、委託先が個人 ChatGPT sign-in で古いモデル前提の手順を使っていれば、作業品質と問い合わせ先がぶれる。

## 移行評価は代表タスクで十分だが、結果を残す

全タスクを精密に再評価する必要はない。ただし、代表タスクの smoke test は必要である。

まず、Luna 移行の代表として、repository exploration、既存コード説明、簡単な test failure 調査、ドキュメント更新、軽い review comment 対応を選ぶ。見る指標は、成功率、やり直し回数、output token、所要時間、reviewer の修正量である。

次に、Terra 移行の代表として、中規模 bug fix、複数 file refactor、dependency update、migration script、CI failure investigation を選ぶ。ここでは、変更の正確性だけでなく、approval request の粒度、差分説明、テスト実行の安定性も見る。

最後に、旧 GPT-5.4 / mini に戻せない前提で fallback を決める。モデル移行でよくある失敗は、問題があったら旧モデルに戻す設計である。retirement ではそれが成立しない。Luna で失敗したら Terra、Terra で失敗したら Sol または人間 review を厚くする、という forward-only な fallback を用意する。

この運用は、[Codex長時間運用](/blog/openai-codex-maxxing-long-running-work-2026/) の考え方ともつながる。長く続く agent work では、モデルを固定することより、変更時にどの state と decision log を残すかが重要になる。モデル退役は、agent workflow の reproducibility と observability を点検する機会でもある。

## 管理者向けの実装手順

第一段階は inventory である。対象は ChatGPT sign-in の Codex に限定する。API gateway、OpenAI API 本番、API key authenticated Codex sessions は別 inventory に分ける。全部を同じ spreadsheet に入れてもよいが、列として authentication mode、owner、workspace、model id、usage class、migration target、verification status を持たせる。

第二段階は policy update である。標準モデルを Luna / Terra / Sol のどれにするか決める。軽作業は Luna、通常実装は Terra、例外的な長時間・高重要度タスクは承認付きで Sol という分類が現実的だが、組織の credit budget と品質要件によって変わる。

第三段階は config rollout である。managed configuration、workspace defaults、IDE onboarding、CLI template、custom agent template、scheduled task の順に直す。ここで大事なのは、利用者が自分で直す場所と、管理者が配布する場所を混ぜないことだ。配布元を直さずに周知だけ出すと、次回 setup で古いモデル名が復活する。

第四段階は communication である。社内通知では、次の3点を短く書く。8月31日に ChatGPT sign-in の Codex で GPT-5.4 / GPT-5.4 mini が使えなくなること。推奨先は GPT-5.6 Terra / Luna であること。OpenAI API と API key authenticated Codex sessions は今回の対象外であること。これ以上の詳細は管理者向け runbook に逃がす。

第五段階は post-migration review である。9月第1週に、失敗した scheduled tasks、問い合わせ件数、credit 消費、model fallback、reviewer 修正量を確認する。退役対応は、8月31日に古い設定を消して終わりではない。新しい標準モデルで仕事が安定しているかを見るところまでが移行である。

## 調達・統制への含意

今回の退役は、OpenAI だけの話ではない。AI coding agent は、モデル棚が短い周期で変わることを前提に運用する段階へ入った。GitHub Copilot、Claude Code、Cursor、Gemini 系の agent tool でも、supported model、default model、retirement history、rate、data retention、workspace control は変わる。

日本企業の調達では、モデル性能表だけでなく、退役告知期間、代替モデルの提示、API と UI の影響範囲差、管理者設定で強制できる範囲、利用者の saved setting を棚卸しできるかを確認したほうがよい。高性能モデルの採用判断と同じくらい、古いモデルを安全に外せるかが運用品質になる。

また、社内の AI governance board がある場合、model retirement を通常の変更管理 event として扱うべきである。重大障害扱いにする必要はないが、owner、期限、影響範囲、代替、検証結果、周知文、問い合わせ先を残す。これを毎回行えば、次の GPT、Claude、Gemini、Copilot モデル退役でもゼロから慌てずに済む。

## まとめ

OpenAI Codex の GPT-5.4 / GPT-5.4 mini 退役は、モデル選択 UI の小さな変更ではない。ChatGPT sign-in の Codex を業務で使う開発組織にとって、8月31日は設定、手順、費用、agent workflow の期限である。

実務上の対応は明確だ。影響範囲を authentication mode で分ける。GPT-5.6 Terra と Luna を用途別に評価する。workspace defaults、managed configurations、custom agents、scheduled tasks、社内 docs に残る model id を消す。API key 経由と OpenAI API は今回の対象外だと説明する。最後に、9月第1週に問い合わせ、失敗 task、credit 消費を見直す。

Codex が開発基盤になればなるほど、モデル退役は例外処理ではなく日常の変更管理になる。今回の更新は、その運用を軽量に作るよいタイミングである。

## 出典

- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center
- [ChatGPT & Codex changelog](https://learn.chatgpt.com/docs/changelog) - ChatGPT Learn
- [ChatGPT Enterprise & Edu release notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
