---
title: 'OpenAI Codex利用枠更新、日本開発費用の見直し点'
description: 'OpenAI CodexのChatGPTプラン別利用枠とクレジット更新を整理。Free/Goの期間限定提供、2x rate limits、token-based rate cardを日本の開発チームの予算管理に落とし込む。'
pubDate: '2026-05-26'
category: 'news'
tags: ['OpenAI', 'Codex', 'ChatGPT', '従量課金', '推論コスト', '開発者ツール', '企業導入']
draft: false
series: 'openai-codex-enterprise-2026'
---

OpenAI Help CenterのCodex関連ページが更新され、CodexをChatGPTのどのプランで使えるのか、どのようにクレジットを消費するのか、BusinessやEnterpriseで誰が追加購入やoverageを管理するのかが、かなり実務寄りに整理された。

今回の更新は、新モデル発表のように派手ではない。しかし日本の開発チームには重要だ。Codexが「個人が試すAIコーディング」から「チームで予算を持ち、利用枠を管理し、開発基盤として使う道具」へ移っているからである。

この論点は、以前扱った[Codexのチーム向け従量課金](/blog/openai-codex-pay-as-you-go-teams-2026/)とつながる。4月の発表はCodex-only seatと柔軟な価格体系が中心だった。今回は、実際にChatGPT各プランで何が含まれ、どこからcredit消費やrate limitsを見ればよいかという運用面が焦点になる。[Codex rate limits障害](/blog/openai-codex-rate-limit-incident-resilience-2026/)で見たように、使えるかどうかは費用だけでなく制限設計にも左右される。

## 事実: CodexはChatGPTプランの利用枠と結びつく

OpenAI Help Centerの「Using Codex with your ChatGPT plan」は、CodexをChatGPTアカウントで使う入口を説明している。対象にはChatGPT Plus、Pro、Business、Enterprise/Eduが含まれる。さらに、期間限定でChatGPT FreeとGoにもCodexが含まれ、その他のプランでは2倍のrate limitsが適用されると説明されている。

ここで重要なのは、Codexが独立した開発者向けSaaSだけではなく、ChatGPTのプラン体系と密接に結びついている点だ。Codex app、Codex CLI、IDE extension、Codex webといった利用面は分かれていても、サインインと利用条件はChatGPTアカウントやワークスペースに寄る。

OpenAIは同じページで、Codex利用時にもChatGPTの利用規約やプライバシーポリシー、またはBusiness/Enterprise/Education/API向けの契約条件が適用されると説明している。つまり、開発チームがCodexを使うときの契約・データ管理・ワークスペース設定は、ChatGPT導入と切り離せない。

BusinessやEnterprise/Eduでは、pluginsの扱いもワークスペースのapp controlsに従う。管理者やownerは、Workspace settingsのAppsからpluginを無効化したり、Manage actionsで許可される操作を制御できる。これは[Codex GoalモードとAppshots](/blog/openai-codex-goal-appshots-browser-2026/)で見た長時間作業やツール接続の広がりを考えると、かなり重要な統制点である。

## 事実: rate cardはtoken-based creditへ寄っている

Codex rate cardでは、Codexの消費がtoken-based pricingとして整理されている。対象はPlus、Pro、Business、Enterprise、Edu、Health、Gov、ChatGPT for Teachersなど広い。入力トークン、キャッシュ済み入力トークン、出力トークンごとにcredits per million tokensが定義され、モデルごとに消費量が異なる。

OpenAIは、2026年4月2日にCodex pricingをAPI token usageに合わせたと説明している。その後、4月23日に既存Enterprise系プランにも同更新を広げた。ただし、一部Enterprise顧客はlegacy rate cardを使い続ける場合がある。つまり、企業では「うちは新rate cardなのか、legacyなのか」を確認しないと、予算見積もりがずれる。

この変更は、平均的なmessage単価でざっくり見る段階から、入力・キャッシュ・出力・モデル選択を分けて見る段階への移行である。大きなコードベースを読ませる作業、長い説明を出させる作業、高価なモデルを使う作業、fast modeやautomationsを多用する作業では、体感以上にcredit消費が増える。

OpenAIは、Codexの平均的な費用を開発者1人あたり月100〜200ドル程度と説明しつつ、モデル、同時実行、automations、fast modeで大きく変わるとも書いている。日本企業がここを読むなら、月額席の価格だけでなく、作業種類ごとの消費を見積もる必要がある。

## 事実: Business/Enterpriseではseatとcredit poolを分けて見る

Flexible pricingの説明では、creditsはDeep Research、Thinking models、Image Gen、Advanced Voice、Codexのような高度機能への柔軟なアクセスを支えるものとして扱われている。BusinessやEnterpriseでは、標準ChatGPT seatとCodex-only seatのように、seat種別とcredit消費を分けて見る必要がある。

Enterprise/Eduでは、共有credit poolが枯渇すると、Workspace Ownersがoveragesを有効化するか、OpenAIのAccount team経由で追加creditsを購入しない限り、高度機能がpauseされると説明されている。これは予算管理上かなり大きい。個人が少し使いすぎるだけでなく、組織全体の共有枠に影響するからだ。

Codex rate card側では、Codex settingsのUsage panelでusage limitsや残creditを確認できるとされる。プランやワークスペースroleによっては、creditsの購入やauto-reload管理もできる。できない場合はworkspace ownerやadminに依頼する流れになる。

つまり、日本企業でCodexを展開するなら、開発者だけで完結させるのは難しい。owner、admin、情シス、購買、開発基盤チームが、誰にどの権限を持たせるか、どこまで自動補充を許すか、部署別の利用をどう見るかを決める必要がある。

## 分析: 日本企業ではPoC費用と標準運用費を分けるべき

ここからは分析だ。

今回の更新で最も実務的なのは、Codexの入口が広がる一方で、費用と制限がより細かく管理対象になっている点である。FreeやGoへの期間限定提供は、個人や小規模チームにとって試しやすい。一方で、BusinessやEnterpriseで本格導入する組織は、credits、rate limits、overage、workspace controlsを同時に設計しなければならない。

日本企業では、最初のPoCと本番運用を分けた方がよい。PoCでは、少人数のチームにCodexを使わせ、レビュー補助、テスト作成、既存コード調査、UI修正のような具体作業で効果を見る。ここでは多少のcredit消費より、どの作業に向くかを見極める方が大事だ。

一方、本番運用では、使い放題感を避ける必要がある。Codexが便利になるほど、開発者は大きなタスクをそのまま投げたくなる。だが、token-based rate cardでは、大きな入力、大きな出力、再試行、並列実行がそのまま費用と制限に跳ね返る。[Codex Gartner評価](/blog/openai-codex-gartner-enterprise-coding-agents-2026/)で見たように、AI coding agentsは企業調達カテゴリになりつつある。調達するなら、使い方の標準化も必要になる。

## 導入チームが見るべき五つの管理点

第一に、プラン別の対象者を決める。FreeやGoの期間限定利用で試した人を、そのまま業務標準に含めるのか、Business/Enterpriseワークスペースへ移すのかを曖昧にしない。業務コードを扱うなら、個人アカウントではなく管理されたワークスペースに寄せる方が説明しやすい。

第二に、Usage panelの見方を共有する。開発者が自分の残枠を知らないまま長時間タスクを走らせると、途中停止や再試行が増える。ownerやadminだけでなく、利用者にもcreditとrate limitsの違いを説明する。

第三に、追加購入とoverageの権限を絞る。共有credit poolが枯渇したときに、誰が購入判断をするのかを決める。リリース直前の障害対応では即時追加が必要かもしれないが、通常の改善作業では月次予算の範囲に収めるべき場面もある。

第四に、pluginとconnected servicesを棚卸しする。OpenAIの説明では、ChatGPT側で接続したGoogle Driveなどのconnected servicesがCodexでも使える場合がある。これは便利だが、開発作業に不要な社内文書や顧客情報へ接続しないよう、ワークスペース単位でルールを持つべきだ。

第五に、データcontrolsを確認する。OpenAIは、Business、Enterprise、Eduでは通常、入力や出力をモデル改善に使わないと説明している。一方、ProやPlusでは設定次第で会話が改善に使われる可能性がある。さらにComputer Useのscreenshotsもdata controlsの対象になる。個人利用と業務利用を混ぜる場合、この違いは無視できない。

## まとめ

今回のHelp Center更新は、Codexの新機能というより、Codexをどう契約し、どう使い、どう払うかを整理する材料である。CodexはChatGPTのプランに含まれ、期間限定でFree/Goにも広がり、Business/Enterpriseではseat、credits、overage、workspace controlsが絡む。

日本の開発チームが見るべきなのは、「Codexが安いか高いか」だけではない。どの作業に使うのか、どのプランで管理するのか、誰が追加購入できるのか、rate limitsに当たったらどう戻すのか、connected servicesとdata controlsをどう扱うのかである。

Codexを開発基盤として使うなら、費用管理は後回しにできない。今回の更新は、AIコーディングを個人の工夫からチームの運用へ移すための、現実的なチェックポイントとして読むのがよい。

## 出典

- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) - OpenAI Help Center, 2026年5月25日更新
- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center, 2026年5月25日更新
- [Flexible pricing for the Enterprise, Edu, and Business plans](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans) - OpenAI Help Center, 2026年5月25日更新
- [What is ChatGPT Enterprise?](https://help.openai.com/en/articles/8265053-what-is-chatgpt-team) - OpenAI Help Center, 2026年5月25日更新
