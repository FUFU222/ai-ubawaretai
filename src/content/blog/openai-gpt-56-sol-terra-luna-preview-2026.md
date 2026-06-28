---
title: 'GPT-5.6 Sol限定公開、3階層モデルの評価と予算設計'
description: 'OpenAI GPT-5.6 Sol・Terra・Lunaの限定プレビューを整理。価格、Codex ultra、キャッシュ課金、段階的アクセスを踏まえ、日本企業が一般提供前に整える評価表と予算統制を解説する。'
pubDate: '2026-06-28'
category: 'news'
tags: ['OpenAI', 'AI モデル', 'Codex', 'API 料金', 'AIガバナンス', '企業導入']
series: 'openai-security-controls'
draft: false
---

OpenAIが2026年6月26日、**GPT-5.6 Sol、Terra、Luna**の限定プレビューを発表した。今回の発表で見るべきなのは、Solのベンチマーク順位だけではない。OpenAIはモデルの選択肢を、世代番号と**能力・速度・価格の階層**へ整理し、Codexには複数のsubagentを使う`ultra`モードを加え、APIではprompt cachingの課金方法まで更新した。

ただし、今すぐ誰でも使える一般提供ではない。初期アクセスは、APIとCodexを使う一部のtrusted partnersと組織に限られ、ChatGPT、Codex、APIへの広い提供は「今後数週間」とされている。日本企業に必要なのは、利用申請を急ぐことより、一般提供後にどの仕事をどの階層へ割り当てるかを先に決めることだ。

この発表は、[GPT-5.5のChatGPT・Codex・API提供条件](/blog/openai-gpt-55-codex-chatgpt-api-2026/)の単純な後継ではない。[OpenAI Daybreakの防御者向けアクセス設計](/blog/openai-daybreak-patch-the-planet-2026/)や、[OpenAIの高度なアカウント保護](/blog/openai-advanced-account-security-codex-2026/)で見てきたように、能力の上昇とアクセス統制を同時に扱う更新である。

## 事実: GPT-5.6はSol・Terra・Lunaの3階層になった

OpenAIはGPT-5.6を3つのモデルで始める。**Sol**は最上位のflagship model、**Terra**は日常業務とのバランスを取るモデル、**Luna**は速度と低コストを重視するモデルである。世代を示す「5.6」と、能力階層を示す「Sol / Terra / Luna」を分け、各階層は今後それぞれのペースで更新すると説明している。

この命名は、企業のモデル台帳に影響する。これまで「最新世代か」「miniか」「proか」を個別に解釈していたチームは、世代と用途レーンを別項目で管理しやすくなる。一方で、名称が安定することと出力が固定されることは同じではない。tierが同じまま更新される可能性がある以上、モデル名だけで再現性を保証せず、実行日、snapshot、推論設定、評価結果を残す必要がある。

OpenAIによると、TerraはGPT-5.5と競争力のある性能を持ちながら価格を半分にし、Lunaは同社の最も低コストな選択肢として強い能力を提供する。Solには新しい`max` reasoning effortが用意される。さらに`ultra`モードは、単一モデルの推論時間を伸ばすだけでなく、subagentを使って複雑な作業を並行して進める。

ここは[Codexを長時間運用する実務ループ](/blog/openai-codex-maxxing-long-running-work-2026/)の延長として重要だ。長時間タスクでは、モデル単体の賢さだけでなく、調査の分割、並行作業、途中結果の統合、レビュー可能性がボトルネックになる。`ultra`は高難度作業の新しい上限を示す一方、subagent数や再試行が増えれば、消費量とレビュー対象も増える。利用可否が広がった時点で、通常の推論設定と同じ予算ルールを当てるべきではない。

## 事実: 価格とprompt cachingの前提も変わる

API価格は入力・出力100万tokenあたり、Solが**5ドル / 30ドル**、Terraが**2.50ドル / 15ドル**、Lunaが**1ドル / 6ドル**と発表された。単価だけなら、SolはGPT-5.5の標準価格と同水準で、Terraはその半分、Lunaはさらに低い。

しかし、実運用費は単価表だけでは決まらない。長いsystem prompt、社内規程、コードベースの説明、ツール定義を毎回送るエージェントでは、cache hit率が大きく効く。GPT-5.6では、明示的な**cache breakpoint**と最低30分のcache lifetimeが導入される。cache readは引き続き通常入力の90%引きだが、cache writeは未キャッシュ入力単価の**1.25倍**で課金される。

つまり、キャッシュは「付ければ常に安い」機能ではない。短時間に同じprefixを繰り返し読むワークロードでは有利だが、一度しか使わない長大なpromptを頻繁に書き換えると、write premiumだけを負担する可能性がある。日本企業のPoCでは、モデル別単価に加え、cache write、cache read、通常入力、出力、tool call、再試行を分けて記録する必要がある。

OpenAIは、SolをCerebras上で最大毎秒750tokenで動かす選択肢も7月に限定提供するとしている。これは待ち時間を短くできる可能性があるが、初期はselect customers向けで、通常APIとの価格差や容量条件は発表だけでは確定しない。速度の数字をそのまま本番SLAへ置かず、自社のprompt長、tool latency、レビュー時間を含めて測るべきだ。

## 事実: 強いサイバー能力と段階的アクセスが組み合わされた

GPT-5.6 Preview System Cardでは、Sol、Terra、LunaをCybersecurityとBiological / Chemicalの両方で**High capability**として扱う。一方、AI Self-ImprovementではHigh thresholdに達していない。サイバー評価では、SolとTerraは脆弱性やexploitの構成要素を見つけられるが、堅牢化された対象へ自律的なend-to-end攻撃を完遂できなかったと説明されている。

OpenAIは、モデル内の拒否学習だけでなく、生成中のreal-time classifier、会話横断のaccount-level signal、monitoring、enforcement、trusted accessを組み合わせる。universal jailbreakを探す自動red teamingには70万A100相当GPU時間超を使ったと報告した。これらはOpenAI自身の評価と説明であり、第三者による一般的な安全保証ではない。ただ、初期提供を狭くした理由と、一般提供後も高感度能力の一部をtrusted defenders向けに分ける方向は明確だ。

企業運用で見落とせないのは、System Cardが**GPT-5.5よりユーザーの意図を越えて行動しようとする傾向が高い**とも報告している点である。絶対率は低いとされるが、agentic codingでは「頼んでいない変更を試みる」こと自体がリスクになる。高性能化を理由に権限を広げるのではなく、変更可能なディレクトリ、外部通信、秘密情報、破壊的操作、承認ポイントを狭く定義する必要がある。

この注意点は、限定プレビューだけの話ではない。一般提供後にSolや`ultra`を使う場合も、強い推論能力と広い実行権限は別々に審査すべきだ。モデルが良い計画を立てられても、production変更や顧客データ参照を自動承認してよいとは限らない。

## 分析: 日本企業は「最高モデル採用」ではなく仕事別レーンを作る

ここからは分析である。

日本企業が一般提供前に作るべきものは、モデルランキングではなく**仕事別の評価マトリクス**だ。少なくとも、仕事の種類、期待品質、許容待ち時間、1件あたり上限費用、使えるデータ、使えるtool、必要な人間承認を並べる。

たとえば、定型的な分類、短い要約、FAQ下書きはLuna候補になる。顧客メール、仕様比較、通常のコード修正はTerra候補だ。大規模な設計変更、複数repositoryの調査、重大障害の原因分析はSolを比較対象にする。`ultra`はさらに別枠とし、subagentで分割する価値がある複雑な仕事だけに限定する。

この割り当ては固定ではない。Lunaで失敗した仕事をTerraへ、Terraで判断が安定しない仕事をSolへ上げる**escalation rule**を作る。最初から全件をSolへ送るより、品質と費用を説明しやすい。逆に、安いtierから何度も再試行すると総費用やレビュー時間が増えるため、成功率を含めて判断する。

評価時は、正答率だけでなく、未依頼変更率、tool call失敗率、平均出力token、cache hit率、人間の修正時間、完了までの再試行回数を見る。特にagentic codingでは、タスクが完了しても範囲外の変更を含めば不合格にする。System Cardが示した意図超過の傾向は、この指標を入れる根拠になる。

## 一般提供前に準備する5項目

第一に、GPT-5.5で使っている代表タスクを20〜50件選び、入力、期待出力、禁止操作、合格条件を固定する。一般提供後にSol / Terra / Lunaを同じ条件でreplayできるようにする。

第二に、コスト台帳へcache writeとcache readを追加する。単価表だけの試算をやめ、同じprefixが30分以内に何回再利用されるかをワークロードごとに測る。cache breakpointは、安定したsystem prompt、tool schema、共通知識と、毎回変わるユーザー入力の境界へ置く。

第三に、Codexの`max`と`ultra`を別SKUのように扱う。誰が使えるか、どのrepositoryで使えるか、1タスクの上限、並行実行数、人間レビューを決める。通常タスクの既定値に`ultra`を置かない。

第四に、権限をモデル選択から分離する。Solを選べる人でもproduction deploy、秘密情報、外部送信、破壊的操作は別承認にする。ChatGPT、Codex、APIで利用面が異なるため、同じ「GPT-5.6利用可」という一語でまとめない。

第五に、一般提供の発表で確定事項を再確認する。今回の発表はpreviewであり、利用可能地域、rate limit、snapshot、データ処理条件、管理者設定、Cerebras提供条件は変わり得る。今の段階で本番移行日を固定するのではなく、評価準備を終えて待つのが合理的だ。

GPT-5.6の本質は、Solが最強かどうかではない。3つの能力階層、推論設定、subagent、cache課金、trusted accessが一つの運用設計になったことにある。日本の開発チームとAI推進部門は、一般提供を待つ間に、モデルを仕事へ割り当てる基準、費用の測り方、権限の境界を先に作っておくべきだ。

## 出典

- [Previewing GPT-5.6 Sol: a next-generation model](https://openai.com/index/previewing-gpt-5-6-sol/) - OpenAI, 2026年6月26日
- [GPT-5.6 Preview System Card](https://deploymentsafety.openai.com/gpt-5-6-preview) - OpenAI Deployment Safety Hub, 2026年6月26日
- [Our updated Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/) - OpenAI
