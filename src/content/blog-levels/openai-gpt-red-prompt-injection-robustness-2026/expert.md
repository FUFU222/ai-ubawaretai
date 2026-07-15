---
article: 'openai-gpt-red-prompt-injection-robustness-2026'
level: 'expert'
---

OpenAI の GPT-Red 発表は、prompt injection 対策を「拒否ルールの追加」ではなく、攻撃生成、評価、adversarial training、deployment safety の継続ループとして扱い始めたことを示している。GPT-Red 自体は internal-only の automated red-teaming model であり、API や ChatGPT の利用者が直接呼べる機能ではない。しかし、GPT-Red が見つけた攻撃は GPT-5.6 の訓練に使われ、tool use と connected apps を前提にした生産モデルの robustness を上げるために使われている。

日本企業にとっての論点は、OpenAI の内部評価モデルの詳細そのものではない。重要なのは、AI agent が untrusted content を読む前提で、モデル提供者側の robustness と利用企業側の application control をどう分担するかである。[GPT-5.6一般提供](/blog/openai-gpt-56-ga-work-codex-api-2026/) で見た Responses API、Codex、tool surface、Multi-agent の広がりは、同時に indirect prompt injection の攻撃面を広げる。[OpenAI安全要約](/blog/openai-chatgpt-safety-summaries-2026/) が会話安全の短期文脈を扱ったのに対し、GPT-Red は外部文脈と実行権限の安全を扱う更新として読むべきである。

## 事実: GPT-Redはself-play型の攻撃データ生成基盤である

OpenAI の説明では、GPT-Red は automated safety red-teaming model であり、self-play reinforcement learning によって訓練されている。攻撃側の GPT-Red は defender LLM に失敗を起こさせることで報酬を得る。防御側モデルは、本来のタスクを遂行しながら攻撃に抵抗することで評価される。この構造により、防御側が強くなるほど、攻撃側はより多様で強い攻撃を探す必要がある。

この設計は、static benchmark だけでは追いつきにくい agent security の性質に合っている。AI agent は単純な chat completion ではない。browser、connector、local file、code repository、email、tool response、workflow state を読み、その結果として tool call や file edit や external action を実行する。攻撃者が直接 user prompt を送れなくても、agent が読む第三者データの中に adversarial instruction を置ける場合がある。

OpenAI は、GPT-Red を production model から分離し、攻撃能力を外部に出さないと説明している。この分離は重要である。red-teaming model は防御に役立つ一方、攻撃手順の探索能力そのものを持つ。企業側が期待すべきなのは GPT-Red の利用権ではなく、GPT-Red によって鍛えられた生産モデルが、connector や tool output に混ざる攻撃へより強くなることである。

## 評価結果をどう読むべきか

OpenAI の発表では、GPT-Red が novel red-teaming scenarios で人間の red teamer より高い attack success を示したこと、GPT-5.6 Sol が GPT-Red の direct prompt injection に対して強くなったこと、Fake Chain-of-Thought と呼ばれる攻撃クラスへの耐性が改善したことが説明されている。これらは重要な進歩だが、企業の採用判断ではそのまま安全証明として扱うべきではない。

理由は3つある。第一に、評価環境はモデル提供者が定義した threat model と task environment に依存する。第二に、企業の実運用では、独自の業務アプリ、権限モデル、データ分類、承認フロー、ログ、RAG pipeline、SaaS connector が組み合わさる。第三に、prompt injection はモデルへの入力だけでなく、tool 実行の前後処理、出力の downstream handling、権限分離の失敗と結びつく。

OpenAI の GPT-5.6 System Card でも、connector に対する既知 prompt injection 攻撃や、search / function calling 向けに強化された攻撃を評価していることが説明されている。これはモデル側が現実的な攻撃面を見始めているという意味で前向きだ。一方で、System Card は利用企業の SaaS 権限設計や業務フローを保証するものではない。日本企業は、model card / system card を vendor assurance の一部として読み、自社固有の misuse case と approval boundary を別途評価すべきである。

## indirect prompt injectionは「入力検査」だけでは止まらない

OWASP LLM Top 10 が prompt injection を主要リスクとして扱う理由は、自然文の instruction と data の分離が難しいからである。従来の SQL injection なら、構造化された query と parameter binding の境界を設計できる。LLM agent では、ユーザー指示、developer instruction、system instruction、retrieved document、tool result、過去会話、ファイル内容が同じ自然言語の context に入る。

特に indirect prompt injection は、ユーザーが直接攻撃文を入力するとは限らない。攻撃者は、agent が後で読む場所へ指示を置く。GitHub Issue、README、package metadata、customer email、web page、support ticket、log line、calendar invite、document comment、spreadsheet cell などである。ユーザーは普通の作業を依頼しただけでも、agent はその外部データを読み、悪意ある命令を「文脈」として処理してしまう可能性がある。

この問題は、[OpenAI Codex Security](/blog/openai-codex-security-workflow-2026/) のように security workflow 自体へ AI を入れる場合にさらに難しくなる。セキュリティエージェントは、脆弱なコード、攻撃ログ、不審な payload、外部の advisory、PoC、issue comment を読む必要がある。つまり、危険な入力を避けるのではなく、危険な入力を危険な入力として扱いながら作業する設計が必要になる。

## 日本企業のアーキテクチャ設計で見る点

第一の設計点は、content trust boundary である。AI が読む情報を、trusted internal authored content、internal user generated content、partner/customer generated content、public internet content、attacker-controlled technical artifacts に分ける。メール、サポートチケット、ログ、OSS README、Issue、Slack 投稿、PDF 注釈は、社内に保存されていても信頼済みとは限らない。保存場所ではなく、誰が書けるかで分類する。

第二の設計点は、capability separation である。read、summarize、draft、propose patch、create PR、send message、modify configuration、delete resource、access secrets、trigger CI/CD、deploy、approve payment を同じ agent 権限に入れない。agent が untrusted content を読んだ session では、外部送信や destructive action を抑制する。必要なら、read-only agent と action agent を分け、両者の間に人間承認または structured handoff を置く。

第三の設計点は、context scrubbing と provenance である。agent に渡す文書には、どの部分が user instruction で、どの部分が retrieved data で、どの部分が tool output かを明示する。モデルだけに区別を期待するのではなく、UI、ログ、prompt wrapper、tool schema 側でも source attribution を残す。回答に使った外部文書、実行した tool、参照した file path、拒否した instruction を後から追えるようにする。

第四の設計点は、approval class である。AI の実行を、低リスク、中リスク、高リスクに分ける。低リスクは要約や草案である。中リスクは PR 作成、社内チケット更新、テスト実行、監査ログ付きの SaaS 操作である。高リスクは外部送信、本番設定変更、秘密情報アクセス、決済、削除、顧客通知、法務・人事判断である。高リスク操作は、モデルの confidence に関係なく人間承認を必須にする。

## 自社版レッドチーミングの作り方

GPT-Red は OpenAI 内部の仕組みなので、企業は同じものをそのまま使えない。しかし、導入評価の考え方は取り込める。まず、自社の AI agent が読む input surface を列挙する。Git repository、ticket、email、docs、wiki、spreadsheet、CRM、SFA、chat、log、cloud inventory、security alert などである。次に、それぞれに攻撃文を埋めた fixture を作る。

fixture は単なる「ignore previous instructions」だけでは不十分である。現実的には、通常業務に見える文書の中に、外部送信、権限昇格、情報開示、不要な tool call、承認回避、ログ抑制、ユーザーへの虚偽説明を誘導する文を入れる。日本語、英語、コードコメント、Markdown、HTML、CSV、PDF 抽出テキスト、ログ形式など、実際のデータ形式に合わせる。

評価指標も attack success rate だけにしない。agent が危険な tool を呼ばないか、承認要求を出すか、出力に警告を含めるか、元のユーザー目的を達成できるか、過剰拒否で業務不能にならないかを見る。OpenAI の発表でも、堅牢化によって通常能力を落とさないことが重要な論点として扱われている。企業側も、単に全部拒否する agent を安全とみなすべきではない。

さらに、運用中のログを評価へ戻す。ユーザーが失敗例を報告した時、agent が不自然な tool call をした時、外部文書に怪しい instruction が見つかった時、その事例を fixture に追加する。これにより、PoC 時点の静的テストではなく、実運用から更新される regression suite になる。[OpenAI Daybreak](/blog/openai-daybreak-patch-the-planet-2026/) が脆弱性修正のループを重視していたのと同じく、prompt injection 対策も発見、再現、修正、再評価のループにする必要がある。

## 調達と監査で聞くべき質問

AI agent や LLM platform を調達する企業は、ベンダーに対して少なくとも次の観点を確認したほうがよい。prompt injection 評価をどの threat model で実施しているか。connector / tool use / browsing / file access を含めた評価か。system card や model card でどの範囲を公開しているか。管理者が tool allowlist、human approval、data retention、audit log を制御できるか。untrusted content を読んだ session の action 制限を設定できるか。

また、社内監査では「AI がこの判断をした」だけでは不十分である。どの user instruction、どの retrieved document、どの tool output、どの model version、どの policy、どの approval に基づいて実行されたかを追う必要がある。model provider の robustness は重要だが、監査証跡は利用企業側のシステムにも残さなければならない。

この観点では、GPT-Red の発表は調達チェックリストの更新材料になる。ベンダーが「プロンプトインジェクション対策済み」と言う場合、手動 red team だけなのか、自動 attack generation を含むのか、tool-use 環境で評価しているのか、過剰拒否をどう測っているのかを聞くべきである。安全性を抽象的な宣言ではなく、評価方法と運用制御に分解して確認することが重要だ。

## 結論

GPT-Red は、OpenAI が AI agent 時代の安全性を、攻撃と防御の継続的な学習問題として扱い始めたことを示している。これはモデル提供者側の重要な前進である。外部データ、connected apps、Codex、browser、local file を扱うモデルでは、prompt injection への堅牢性が基本性能の一部になる。

ただし、日本企業が取るべき姿勢は「OpenAI が対策したから安心」ではない。モデルの robustness は防御層の一つであり、content trust boundary、tool permission、approval class、audit log、red-team fixture、incident feedback loop が必要である。AI エージェントを業務に入れるほど、プロンプトインジェクションはセキュリティ担当だけでなく、プロダクト、情シス、法務、業務責任者が共同で設計すべき運用課題になる。

## 出典

- [GPT-Red: Unlocking Self-Improvement for Robustness](https://openai.com/index/unlocking-self-improvement-gpt-red/) - OpenAI, 2026年7月15日
- [GPT-5.6 System Card](https://deploymentsafety.openai.com/gpt-5-6/cybersecurity-trusted-access-for-cyber) - OpenAI Deployment Safety Hub, 2026年7月9日
- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) - OWASP Foundation
- [How Vulnerable Are AI Agents to Indirect Prompt Injections?](https://arxiv.org/abs/2603.15714) - arXiv, 2026年3月16日
