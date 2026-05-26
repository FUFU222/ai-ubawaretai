---
title: 'OpenAI Codex座席設計、Business導入の費用管理'
description: 'OpenAI Codex座席設計をChatGPT Business/Enterpriseの標準席、Codex-only seat、credits、管理者統制から整理し、日本企業の費用管理と導入判断に落とし込む。'
pubDate: '2026-05-26'
category: 'news'
tags: ['OpenAI', 'Codex', 'ChatGPT Business', '従量課金', 'SaaSコスト管理', '管理者設定', '企業導入']
draft: false
series: 'openai-codex-enterprise-2026'
---

OpenAI Help Centerで、ChatGPT BusinessとChatGPT EnterpriseにおけるCodexの座席設計と課金の説明が更新されている。大きなポイントは、ChatGPTを含む標準席と、Codexだけを使うCodex-only seatを分け、Codexの利用をworkspace creditsとtoken-based rate cardで管理する構成が明確になったことだ。

これは新モデル発表ほど派手ではない。しかし日本企業の開発組織、情シス、調達担当にはかなり重要である。Codexを「開発者が個人で試すAIコーディングツール」としてではなく、「会社のワークスペースで誰に使わせ、どの費用枠で動かし、誰が追加購入や利用制限を管理するか」というSaaS運用の問題として扱う必要が出てきたからだ。

この話は、前回の[OpenAI Codex利用枠更新](/blog/openai-codex-plan-credits-limits-2026/)とつながる。そこではChatGPTプラン別の利用枠とtoken-based rate cardを扱った。今回はさらに一段実務に寄せて、Business/Enterpriseで標準ChatGPT seatとCodex seatをどう分けるかを読む。[OpenAI Codex Gartner評価](/blog/openai-codex-gartner-enterprise-coding-agents-2026/)で見たように、AI coding agentは企業調達カテゴリになりつつある。調達カテゴリになるなら、座席、予算、権限の設計も同時に必要になる。

## 事実: 標準席とCodex-only seatが分かれた

OpenAIのEnterprise向けHelp Centerは、ChatGPT Enterpriseを標準ChatGPT seatとCodex seatの2種類で構成すると説明している。標準ChatGPT seatはChatGPTに加えてCodexも含む。一方、Codex seatはCodexだけを使う座席で、ChatGPTへのアクセスは含まれない。

Business向けの請求ページでも同じ考え方が示されている。標準ChatGPT seatは固定の月額席で、ChatGPTとCodexの両方を使える。Codex seatは固定の月額席ではなく、Codexのみを使うusage-based seatとして扱われる。Codex seatを使うにはworkspace creditsが必要になる。

ここで重要なのは、Codex seatが「安いChatGPT seat」ではないことだ。ChatGPTの通常機能、GPTs、Projects、Apps、Company Knowledge、Deep Researchなどを使う人は標準ChatGPT seatが必要になる。一方で、開発者や自動化担当がCodexだけを使うなら、Codex-only seatという選択肢がある。

つまり、企業はユーザーを一律に同じ席へ入れるのではなく、役割で分けられる。プロダクトマネージャー、営業企画、カスタマーサポートのようにChatGPT本体を広く使う人と、リポジトリ作業やコードレビュー補助に集中する開発者を同じ単価設計で扱わなくてよい。

## 事実: Codex seatはcreditsがなければ動かない

OpenAIは、Codex seatには固定の月額席料金がない一方で、実際の利用にはworkspace creditsが必要だと説明している。ChatGPT Businessでは、標準ChatGPT seatだけのワークスペースに初めてCodex seatを追加すると、creditsの追加を促される。逆にCodex-only workspaceへ標準ChatGPT seatを初めて追加すると、標準席の最低数を購入する流れになる。

Flexible pricingの説明では、creditsはCodexだけでなく、Deep Research、Thinking models、Image Gen、Advanced Voiceなどのadvanced featuresにも関係する。Businessではユーザーごとの含有利用枠があり、超過時にworkspace creditsがあれば共有poolから継続利用できる。Enterprise/Eduでは契約レベルのshared credit poolを購入し、全ユーザーとseat typeがそこから消費する。

この違いは日本企業の予算管理に効く。Businessの小規模チームでは、クレジット追加やauto rechargeを比較的軽く管理できるかもしれない。一方、Enterpriseでは契約、overage、部門配賦、グループ別spend controlsが絡む。共有poolが枯渇するとadvanced featuresが止まるため、単なる請求処理ではなく業務継続の論点になる。

[Codex rate limit障害の整理](/blog/openai-codex-rate-limit-incident-resilience-2026/)でも触れたように、AI開発ツールでは「契約している」だけでは足りない。利用枠、瞬間的な制限、credit残高、障害時の代替手順まで含めて運用を作る必要がある。

## 事実: rate cardはtoken-basedに寄った

Codex rate cardでは、Codexの消費が入力トークン、キャッシュ済み入力トークン、出力トークンごとのcredits per million tokensで整理されている。GPT-5.5、GPT-5.4、GPT-5.4-Mini、GPT-5.3-Codexなど、モデルによって消費は異なる。Code reviewはGPT-5.3-Codexを使うとされ、Fast modeは対応モデルで高いrateになる。

OpenAIは、2026年4月2日にCodex pricingを平均メッセージ単位からAPI token usageに近い形へ合わせたと説明している。さらに既存Enterprise系にも段階的に広げた。一部Enterprise顧客はlegacy rate cardを使う場合があるため、自社契約がどちらにいるかは確認が必要だ。

これは「1人あたり月いくら」のSaaS管理から、「どの作業がどれだけtokensとcreditsを使うか」のFinOpsへ近づく動きである。大きなコードベースを読ませる、複数ファイルを修正する、長い説明を出させる、同時に複数タスクを走らせる、Fast modeを多用する。これらは同じCodex利用でも消費が違う。

OpenAIは平均的なCodex費用について、開発者1人あたり月100から200ドル程度としながら、モデル、同時実行数、automations、Fast modeで大きく変わるとも説明している。日本企業が導入前に見るべきなのは、この平均値そのものではなく、自社の代表的な作業でどれだけ振れるかである。

## 分析: 日本企業は役割別に座席を切るべき

ここからは分析だ。

今回の更新は、Codexを全員に同じ形で配る運用が雑になりやすいことを示している。標準ChatGPT seatは、ChatGPT本体を業務に広く使う人に向く。Codex-only seatは、開発作業やコードレビュー、リポジトリ調査を中心にする人に向く。両者を混ぜるなら、費用構造と利用可能機能を利用者へ説明しないと混乱する。

たとえば、開発者全員に標準ChatGPT seatを配ると、ChatGPT本体の業務利用も広がる。これは便利だが、情報管理と教育が必要になる。逆にCodex-only seatだけを配ると、コード作業には集中できるが、仕様整理、調査、社内文書作成などのChatGPT活用は別に考えなければならない。

日本企業では、最初に3つのグループへ分けるのが現実的だ。第一に、ChatGPTとCodexの両方を使う開発リードやPdM。第二に、Codex中心の実装者。第三に、閲覧・レビュー・調達判断に関わる管理者である。この分け方なら、必要なseat、credit予算、管理者権限を別々に設計しやすい。

[OpenAI Codex Goalモード](/blog/openai-codex-goal-appshots-browser-2026/)のようにCodexの作業時間が長くなるほど、利用者の役割差は大きくなる。長時間タスクを回す人と、結果をレビューする人を同じ利用枠で見ると、どこで費用が発生しているか分からなくなる。

## 導入前に決める五つのこと

第一に、Codex-only seatを誰に割り当てるかを決める。全開発者ではなく、まずはリポジトリ作業が多いチーム、テスト作成やレビュー補助を繰り返すチーム、保守タスクを多く抱えるチームから始めるのがよい。

第二に、workspace creditsの責任者を決める。Businessではownerがcreditsやbillingを見やすいが、現場の開発責任者が使用実態を知らないと予算判断が遅れる。EnterpriseではAccount team経由の追加やoverage設定も絡むため、情シスと開発基盤チームの分担を明確にする。

第三に、usage reportsとUsage panelを定例で見る。月末に請求だけを見るのでは遅い。大きなPRレビュー、リリース前修正、migration作業、agentic automationが重なった週に消費が跳ねていないかを確認する。

第四に、標準ChatGPT seatとの境界を明文化する。ChatGPT本体で社内資料、仕様、顧客情報を扱う人と、Codexだけでコード作業をする人では、教育すべきリスクが違う。個人workspaceと会社workspaceの扱いも分けるべきだ。

第五に、API Platform accessとChatGPT workspace accessを混同しない。OpenAIのEnterprise説明では、ChatGPT workspaceのメンバーであることは、API Platform organizationのメンバーであることを意味しない。Codexの座席設計とAPI利用権限を同じものとして扱うと、権限申請や監査で詰まる。

## まとめ

今回のHelp Center更新は、Codexの企業導入が「使えるかどうか」から「どう割り当て、どう支払い、どう止めるか」へ進んでいることを示している。標準ChatGPT seat、Codex-only seat、workspace credits、token-based rate card、shared credit pool、overageの関係を整理しないまま広げると、便利さより先に費用と権限が曖昧になる。

日本企業が今見るべきなのは、Codex seatを単なる追加機能として扱わないことだ。開発者の役割、部署別予算、ワークロード別消費、管理者権限、ChatGPT本体との境界を先に決める。そうすれば、Codexを個人の便利ツールではなく、管理された開発基盤として使いやすくなる。

## 出典

- [What is ChatGPT Enterprise?](https://help.openai.com/en/articles/8265053-what-is-chatgpt-team) - OpenAI Help Center, 2026年5月26日確認
- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center, 2026年5月26日確認
- [Managing billing and seats in ChatGPT Business](https://help.openai.com/en/articles/8792536-manage-billing-on-the-chatgpt-team-subscription-plan) - OpenAI Help Center, 2026年5月26日確認
- [Flexible pricing for the Enterprise, Edu, and Business plans](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans) - OpenAI Help Center, 2026年5月26日確認
