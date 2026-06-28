---
title: 'Copilot MAI-Code-1-Flash企業解禁、価格とモデル設計'
description: 'GitHub CopilotのMAI-Code-1-FlashがBusinessとEnterpriseで一般提供。AI Credits単価、管理者ポリシー、継続更新モデルの注意点を整理し、日本企業が低遅延モデルを全社展開する評価手順と予算管理を解説する。'
pubDate: '2026-06-28'
category: 'news'
tags: ['GitHub Copilot', 'AI モデル', 'SaaSコスト管理', '管理者設定', 'AIコーディング', '企業導入']
series: 'github-copilot-2026'
draft: false
---

GitHubは2026年6月26日、Microsoftの軽量コーディングモデル **MAI-Code-1-Flash** をGitHub Copilot BusinessとCopilot Enterpriseで一般提供した。管理者がCopilot settingsでモデルのpolicyを有効にすると、組織の利用者が選べるようになる。GitHubは、高頻度で反復的なagentic codingに向く、速度と効率を重視した低遅延モデルとして位置づけている。

今回の焦点は、モデルそのものの初登場ではない。6月18日の[MAI-Code-1-Flash対応surface拡大](/blog/github-copilot-mai-code-flash-surfaces-2026/)では、個人向けプランからCLI、cloud agent、Copilot app、各種IDEへ広がる段階と、Business／Enterprise提供前の準備を扱った。今回、その企業プランへの提供が一般提供へ進み、管理者が価格、許可、標準用途を実運用として決める段階に入った。

日本企業にとって重要なのは、「新モデルを全員に見せるか」だけではない。[Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/)の下では、モデルごとのtoken単価が利用費に直結する。さらに、MAI-Code-1-Flashは継続的に改善され、checkpoint更新で性能や挙動が変わり得るとDocsに明記されている。全社の軽量標準モデルにするなら、policy有効化、タスク分離、予算監視、定期再評価を一つの変更管理として扱う必要がある。

## 事実: BusinessとEnterpriseで一般提供

GitHub Changelogによると、MAI-Code-1-FlashはCopilot BusinessとCopilot EnterpriseでGA、つまり一般提供になった。モデルはMicrosoft AIが開発したin-house coding modelで、GitHub Copilot向けに最適化されている。

GitHubが想定する用途は、**high-volume, iterative agentic coding workflows** だ。日本語にすると、短い実装、説明、修正、検証を何度も繰り返すような、高頻度のエージェント型コーディングである。難しい設計課題を一回で解かせる最上位モデルというより、待ち時間を小さくしながら日常の反復を回す軽量レーンとして読むのが妥当だ。

Microsoft AIのモデルページも、MAI-Code-1-FlashをGitHub CopilotとVS Codeに組み込まれたlightweight, agentic modelと説明している。ただし、公式ページが示す用途適合性は、各社のコードベースで同じ品質を保証するものではない。言語、リポジトリ規模、テストの整備度、指示ファイルの質によって、使えるタスクは変わる。

Supported AI modelsのDocsでは、MAI-Code-1-FlashはMicrosoft提供のGAモデルとして掲載され、Auto model selectionの候補にも含まれる。個人向けだけでなくBusinessとEnterpriseの対応モデル表にも入った。今回の一般提供で、個人アカウントでの試用結果を企業アカウントの管理対象へ移す条件がそろったことになる。

## 事実: 利用前に管理者のpolicy有効化が必要

企業プランでは、GAになっただけで全利用者へ自動解禁されるわけではない。Copilot BusinessとEnterpriseの管理者は、利用者がアクセスする前に、Copilot settingsでMAI-Code-1-Flashのpolicyを有効にする必要がある。

これは小さな設定差に見えるが、企業運用では重要だ。利用者が自由に使い始めた後でルールを作るのではなく、管理者が利用対象と評価条件を決めてから開く順序にできる。すでに[Copilotの対象別モデルルール](/blog/github-copilot-targeted-model-rules-2026/)で見たように、モデル管理は単純な全社オン／オフから、組織や利用者層、用途に応じて許可を分ける方向へ進んでいる。

最初から全社有効化する必要はない。たとえば、プラットフォームチーム、社内ツールチーム、テスト自動化担当など、短い反復作業が多く、評価結果を集めやすい組織から始める。対象者、開始日、許可したmodel、比較対象、停止条件をチケットに残せば、GAモデルでも統制されたpilotとして扱える。

ここでpolicy有効化と「標準モデル指定」を混同してはいけない。有効化は選択可能にする操作であり、全タスクに推奨する判断とは別である。利用できる状態にしたうえで、軽い修正、テスト生成、コード説明、上位モデルへ切り替える条件を社内ガイドに定義する必要がある。

## 事実: token単価はinput 0.75ドル、output 4.50ドル

GitHub Docsの2026年6月28日時点の価格表では、MAI-Code-1-FlashはMicrosoftカテゴリのLightweightモデルで、100万token当たりの価格は次の通りだ。

- input: **0.75米ドル**
- cached input: **0.075米ドル**
- output: **4.50米ドル**

Copilotではinput、output、cached tokenの消費額をAI Creditsへ変換し、**1 AI Creditを0.01米ドル**として扱う。BusinessとEnterpriseには利用者ごとのAI Credits枠があり、billing entity単位でpoolされる。含まれる枠を超えた利用は、モデルのtoken単価に基づく追加AI Creditsとして課金される。

価格を見るときは、input単価だけで比較してはいけない。agentic codingでは、リポジトリ文脈や会話履歴をinputとして送り、モデルが修正案や説明をoutputする。出力が長くなるタスク、同じ文脈を繰り返し送るタスク、エージェントが何度も試行するタスクでは、合計消費が変わる。評価時には「1回いくら」ではなく、タスクを完了するまでのinput、cached input、outputと手戻りを測るべきだ。

なお、Docsではcode completionsとnext edit suggestionsはAI Creditsで課金せず、有料Copilotプランでは引き続きunlimitedと説明されている。モデル選択によるtoken課金の評価は、Chatやagentなどの利用と、従来型の補完を分けて観測する必要がある。

## 分析: 軽量モデルを標準レーンに置く

ここからは公式発表を踏まえた分析だ。

MAI-Code-1-Flashを企業で活用する最も現実的な方法は、すべての作業を置き換えることではなく、**高頻度・低リスク・短時間で検証できる仕事の標準レーン**に置くことだ。

候補になるのは、既存関数の説明、局所的なリファクタリング、単体テストのたたき台、型エラーの読み解き、短いドキュメント修正、定型的なAPI client追加などである。これらは結果の正誤を差分、compiler、linter、testで確認しやすい。低遅延の価値も、反復回数が多いほど積み上がる。

一方、認証境界の変更、データ移行、広い設計判断、複数serviceにまたがる障害調査、重大な脆弱性修正は、軽量モデル固定に向かない。上位モデルへ切り替える条件と、人間の承認を必須にする条件を別に定義するべきだ。

[Copilot Auto model selection](/blog/github-copilot-auto-model-selection-vscode-2026/)に任せる運用も選択肢になる。ただし、Autoを使う場合も、評価不能にしてよいわけではない。利用面ごとに選ばれたモデル、AI Credits、完了率、レビュー差し戻しを追い、明示的にMAI-Code-1-Flashを使った場合との違いを見る。利用者にモデル一覧を暗記させるのではなく、標準はAuto、短い反復はFlashを明示、高難度は上位モデルという少数の経路に絞ると運用しやすい。

## 分析: 継続更新モデルは定期再評価する

Supported AI modelsの脚注には、MAI-Code-1-Flashが**continuously improving model**であり、新しいcheckpointの公開に伴ってperformanceとbehaviorが変化し得ると記載されている。この性質は、改善を早く受けられる利点である一方、企業の再現性管理には課題になる。

モデル名が同じでも、前月と今月で出力傾向が同一とは限らない。固定snapshotの指定がDocsで示されていない以上、社内標準にするなら、変化を前提に評価する必要がある。たとえば月次で代表タスクを再実行し、成功率、test pass率、レビュー指摘、危険な変更、token消費を記録する。急な劣化が見えたら、policyを閉じるか、標準レーンをAutoや別モデルへ戻す。

評価セットはベンチマークの順位だけで作らない。日本語の仕様書から実装するタスク、社内固有framework、古いJavaや.NET、複数repository、文字コードや時刻処理など、自社で事故になりやすい例を含める。モデル提供者が示す一般性能と、自社の実務適合性を分けて判断することが重要だ。

## 日本企業向け30日導入手順

最初の1週間は、policyを限定組織だけで有効にし、10〜20件の代表タスクを用意する。MAI-Code-1-Flash、現在の標準モデル、Autoで同じ種類の作業を行い、完了時間、AI Credits、test結果、レビュー差し戻しを比べる。

2週目は、利用者の感想ではなく、タスク分類を固める。「軽い」「重い」という曖昧な表現を、変更file数、repository横断の有無、security影響、database変更、予想作業時間などで定義する。上位モデルへ切り替える条件を明文化する。

3週目は、budgetとusage reportを確認する。個人ごとの消費だけでなく、team、repository、用途で偏りを見る。低単価モデルでも無制限の反復や大きなcontextを許せば、総額は増える。予算超過時に停止するのか、通知だけにするのかも決める。

4週目に、標準レーンへ広げるかを判断する。採用する場合も全社一斉ではなく、変更履歴、評価日、利用可能surface、想定用途、fallbackを社内ページに残す。checkpoint更新を想定した月次再評価日を設定すれば、「GAだから固定」という誤解を避けられる。

## まとめ

MAI-Code-1-FlashのBusiness／Enterprise一般提供は、6月18日に残っていた企業プランの空白を埋めた。管理者によるpolicy有効化が必要で、価格は100万token当たりinput 0.75ドル、cached input 0.075ドル、output 4.50ドルである。GitHubは、高頻度で反復的なagentic codingに向く低遅延モデルとしている。

日本企業が取るべき行動は、最強モデルとの単純な順位付けではない。検証しやすい日常タスクの標準レーンを作り、上位モデルへ切り替える条件を定め、AI Creditsとレビュー品質を一緒に測る。さらに、同じモデル名のまま挙動が変わり得るため、policyと評価セットを月次の変更管理に組み込むことが、全社展開の前提になる。

## 出典

- [MAI-Code-1-Flash for Copilot Business and Copilot Enterprise](https://github.blog/changelog/2026-06-26-mai-code-1-flash-for-copilot-business-and-copilot-enterprise/) - GitHub Changelog, 2026-06-26
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) - GitHub Docs
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [MAI-Code-1-Flash](https://microsoft.ai/models/mai-code-1-flash/) - Microsoft AI
