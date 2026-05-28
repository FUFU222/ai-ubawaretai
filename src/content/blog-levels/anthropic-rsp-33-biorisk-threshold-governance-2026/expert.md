---
article: 'anthropic-rsp-33-biorisk-threshold-governance-2026'
level: 'expert'
---

Anthropic の **RSP 3.3** 更新は、frontier AI governance を追う企業にとって、製品リリース以上に実務的な意味を持つ。Anthropic は 2026年5月26日、Responsible Scaling Policy の current version を 3.3 に更新し、主な差分として、novel chemical/biological weapons production に関する threshold の改定、individual models の risk に関する off-cycle updates の refine、minor terminology changes を挙げた。

これは「Claude の新機能」ではない。むしろ、企業が Claude や類似の frontier model を導入するとき、risk threshold、risk report、system card、model update、external review、procurement review をどう接続するかの話である。前回の [RSP 3.2改定](/blog/anthropic-rsp-32-governance-2026-04-29/) は LTBT による Risk Report 外部レビュー要求やレビュアー選定承認に焦点があった。今回の RSP 3.3 は、統治レイヤーそのものより、閾値定義とモデル別リスク更新の運用に重心がある。

この読み方は、Anthropic の直近記事群とも整合する。[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) は agent runtime の filesystem、network、credential、MCP 境界を扱い、[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) は監査ログと DLP/SIEM 接続を扱った。RSP 3.3 は、それらの product-level control より上位で、どの能力が重大リスクに近づいたときにどの安全文書と safeguard が必要になるかを決める policy layer である。

## 事実: RSP 3.3の公開差分は「閾値」と「モデル別更新」に集中している

Anthropic の RSP 更新ページは、RSP 3.3 を 2026年5月26日 effective として掲げている。公開説明で確認できる差分は 3 つだ。第一に、novel chemical/biological weapons production threshold を、concerned threat model によりよく追随するよう改定した。第二に、individual models の risk に関する off-cycle updates の approach を refined した。第三に、minor terminology changes を行った。

この説明は短いが、企業審査では十分に重要である。RSP は単なる倫理声明ではなく、Capability Threshold、Required Safeguards、Frontier Safety Roadmaps、Risk Reports を組み合わせて、Anthropic がどの段階で何を追加実施するかを整理する文書だからだ。特に RSP 3.0 以降は、公開モデル全体の risk report と roadmap を通じてリスクを説明する方向へ寄っている。

RSP 3.3 の差分は、RSP 3.0 の大改定、RSP 3.1 の小修正、RSP 3.2 の LTBT 監督強化に続くものだ。[RSP v3.1の文言修正](/blog/anthropic-rsp-v31-frontier-safety-roadmap-2026/) でも見たように、こうした小さな policy update は、Anthropic がどのリスクを固定的な表現で残し、どのリスクを運用中に再定義するかを見る材料になる。

## バイオリスク閾値は「危険知識」ではなく「実行可能な脅威モデル」で読む

chemical/biological weapons production threshold の改定は、一般企業には遠い論点に見える。しかし frontier model governance では、これは単に「危険な質問に答えるか」ではない。実務上見るべきなのは、モデルが moderately resourced actor や専門知識を持つ組織の能力をどれほど上げるか、end-to-end の作業列をどこまで支援するか、そして安全策を必要とする能力水準をどう定義するかである。

危険な知識を説明できること、実験計画を提案できること、失敗時に原因を切り分けられること、入手可能な資材や手順を組み合わせられること、検知回避や operational planning まで助けられることは、それぞれ違う。RSP 3.3 が threshold を threat model に合わせたと述べる以上、導入企業は「禁止カテゴリの有無」ではなく、「どの actor、どの capability uplift、どの chain of actions を閾値として見ているのか」を読むべきだ。

日本企業では、製薬、化学、素材、医療、大学共同研究、公共研究費を扱う組織ほどこの観点が重要になる。生成AIの業務利用を止めるべきだという話ではない。研究開発の productivity benefit と dual-use risk を切り分け、どの部門にはどのモデル、どの監査、どの利用制限、どの escalation route が必要かを分ける必要がある。

また、この考え方はバイオリスク以外にも拡張できる。サイバー、金融犯罪、重要インフラ、個人情報、選挙・世論操作などでも、単発の禁止質問ではなく、能力連鎖と threat model を見る必要がある。RSP 3.3 は、その考え方を明示的に更新した点で、AI ガバナンス担当者が読む価値がある。

## off-cycle updateは調達とchange managementの問題である

RSP 3.3 のもう一つの重要点は、individual models の risk に関する off-cycle updates だ。これは安全研究者向けの細部ではなく、企業の procurement と change management に直結する。

AI SaaS は、従来のソフトウェアよりモデル更新の影響が見えにくい。UI や API 名は同じでも、背後の model snapshot、routing、safety evaluation、tool-use ability、context window、coding ability、computer-use ability が変わることがある。企業側が最初の導入審査で読んだ system card や risk report が、3か月後も同じ前提を支えているとは限らない。

Anthropic は 2026年2月10日の RSP 更新で、Claude Opus 4.6 の sabotage risk report に触れている。そこでは、AI R&D-4 capability threshold を超えていないという判断を示しつつ、Opus 4.5 を明確に上回る frontier model では sabotage risk report を作成する方針を説明していた。重要なのは、モデル能力の向上に伴って、特定リスクの追加文書が必要になるという運用だ。

したがって、RSP 3.3 の off-cycle update refine は、導入企業にとって「どのイベントで再審査するか」の設計材料になる。新モデル公開、既存モデルの silent upgrade、risk report の追加、policy threshold の変更、重大インシデント、external review の更新、system card の改定を、契約と社内統制にどう載せるかを決める必要がある。

## Risk Report、System Card、RSPを分けて読む

AI ベンダーの安全文書は、同じように見えて役割が違う。RSP は、重大リスクに対する company-level governance framework である。System Card は、特定モデルやモデルファミリーの能力、安全評価、制限、使用上の注意を説明することが多い。Risk Report は、特定の risk domain や threshold に対する評価と mitigation を説明する。更新ページや changelog は、これらの変更履歴をつなぐ。

日本企業の審査でよく起きる失敗は、これらをまとめて「安全資料確認済み」としてしまうことだ。RSP が存在しても、自社ユースケースに関係する model risk report がないなら審査は不十分かもしれない。System Card が安全評価を示していても、agentic use case の runtime boundary は別に見なければならない。Risk Report が特定の threshold を扱っていても、契約上のデータ処理、監査ログ、リージョン、サブプロセッサ、インシデント通知は別文書で確認する必要がある。

RSP 3.3 は、この分離をより重要にした。バイオリスク閾値の変更は RSP 上の論点だが、個別モデルの off-cycle update は model-specific document と連動する。企業側は、ベンダー安全文書を document inventory として管理し、どの文書がどの利用リスクをカバーしているかを記録するべきである。

## 日本企業向けの審査観点

第一に、RSP 3.3 の redline を見て、threshold wording の変更を確認する。公開更新ページの説明だけでも方向性は分かるが、調達・監査で使うなら redline の差分を読むべきだ。特に、chemical/biological weapons production threshold の actor、capability、safeguard trigger、evaluation language がどう変わったかを確認する。

第二に、off-cycle update の通知経路を契約と運用に落とす。ベンダーが policy page を更新しただけで、管理者に通知されない可能性がある。Enterprise 契約、admin console、status page、trust center、RSS、メール通知、担当 CSM を含め、どの経路で重要な safety update を受け取るかを決める。

第三に、model update と利用範囲を結びつける。開発者向け Claude Code、社内知識検索、カスタマーサポート、研究開発、セキュリティ調査、業務エージェントでは、同じモデル更新でも影響が違う。agentic use case では、モデル能力の向上がそのまま tool-use blast radius の拡大につながることがある。RSP と containment の両方を見て判断する必要がある。

第四に、risk acceptance を versioned にする。社内の AI 利用承認書に「Claude を承認」とだけ書くと、モデルや RSP が変わったときに判断が追えない。少なくとも、モデル名、model version または routing policy、参照した RSP version、system card、risk report、利用範囲、禁止用途、再審査条件を残したい。

第五に、ベンダー比較で「安全文書の有無」ではなく「改定運用」を見る。RSP のような文書があることは加点だが、より重要なのは、能力が上がったときに閾値を見直すか、risk report を出すか、外部レビューや独立監督をどう使うか、顧客へどう通知するかである。

## RSP 3.3を過大評価しない

RSP 3.3 は有用だが、万能ではない。第一に、Anthropic の自主ポリシーであり、日本法上の認証や監査報告書ではない。第二に、公開文書には安全上の理由で詳細が省略される可能性がある。第三に、重大リスクの閾値が洗練されても、企業利用で重要なデータ保護、アクセス制御、ログ保持、契約責任、サブプロセッサ、リージョン、削除要求、個人情報保護の論点は別途残る。

さらに、RSP が扱う catastrophic risk と、企業の日常的な operational risk は一致しない。多くの日本企業で先に問題になるのは、顧客情報の誤投入、社外秘の漏えい、AI 生成物の権利処理、監査ログ不足、承認権限の曖昧さ、MCP 経由の過剰アクセス、モデル更新による品質変動である。RSP 3.3 はこれらを直接解決しない。

それでも RSP 3.3 を読む価値があるのは、ベンダーが frontier risk をどう operationalize しているかを示すからだ。企業側の AI ガバナンスも、抽象的な理念から、閾値、文書、再審査、通知、監査、利用範囲に分解していく必要がある。

## 実務チェックリスト

まず、文書管理を作る。RSP version、redline、system card、risk report、trust center document、contract addendum、admin setting document を一覧化し、参照日と適用ユースケースを記録する。

次に、model update trigger を定義する。新しい frontier model、既存モデルの routing 変更、context window 拡大、tool-use capability 強化、safety report 追加、RSP threshold 改定、重大な status incident が起きたら、どの利用範囲を再審査するかを決める。

三つ目に、high-risk use case を分ける。研究開発、化学・生物・医療、サイバーセキュリティ、金融審査、法務、公共、重要インフラ、顧客対応自動化、社内権限を持つ agent は、一般的な文章作成より高い審査を置く。

四つ目に、RSP と runtime control をつなぐ。RSP が重大リスクを扱っていても、現場の安全性は endpoint、browser、MCP、DLP、SIEM、MDM、proxy、workspace permission に依存する。policy layer と product control を別々に承認しない。

最後に、社内説明を正確にする。「Anthropic は RSP 3.3 を出しているので安全」ではなく、「当社は RSP 3.3、関連 risk report、system card、契約上の統制を確認し、この利用範囲ではこの残余リスクを受容する」と書くべきである。

## まとめ

RSP 3.3 は、Anthropic の安全ポリシーが静的な宣言ではなく、脅威モデルとモデル能力に応じて更新され続ける運用文書であることを示した。今回の中心は、chemical/biological weapons production threshold と individual model risk の off-cycle update である。

日本企業は、この更新を単なる海外 AI 安全ニュースとして流さないほうがよい。Claude や他の frontier model を本番利用するなら、ベンダー安全文書の version、risk report の範囲、モデル更新時の再審査、agent runtime の containment、監査ログを一つの governance workflow にする必要がある。RSP 3.3 は、その workflow を作るための具体的な質問票になる。

## 出典

- [Responsible Scaling Policy Updates](https://www.anthropic.com/responsible-scaling-policy) - Anthropic, 2026-05-26
- [Anthropic's Responsible Scaling Policy Version 3.3](https://cdn.sanity.io/files/4zrzovbb/website/c11e84981d0a7281a1b229f3fa6af0da66eaf43f.pdf) - Anthropic, 2026-05-26
- [Anthropic's Responsible Scaling Policy Version 3.3 redline](https://cdn.sanity.io/files/4zrzovbb/website/dd0ec579bee2cd144069c478ede3e35ea080ad02.pdf) - Anthropic, 2026-05-26
- [Risk Report: Claude Opus 4.6 Sabotage](https://www-cdn.anthropic.com/08eca2757081e850ed2ad490e5253e940240ca4f.pdf) - Anthropic, 2026-02-10
