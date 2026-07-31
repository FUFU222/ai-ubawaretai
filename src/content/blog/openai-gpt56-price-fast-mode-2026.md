---
title: 'GPT-5.6価格改定、Luna運用とFast mode実務軸'
description: 'GPT-5.6価格改定でLunaとTerraが安くなり、Sol Fast modeも加わった。日本企業がCodex、ChatGPT Work、APIの費用統制をどう見直すか整理する。'
pubDate: '2026-07-31'
category: 'news'
tags: ['OpenAI', 'AI モデル', 'API 料金', 'Codex', 'ChatGPT', 'SaaSコスト管理', '企業導入']
series: 'openai-codex-enterprise-2026'
draft: false
---

OpenAI は米国時間 **2026年7月30日**、**GPT-5.6 Luna と GPT-5.6 Terra の価格改定**、および **GPT-5.6 Sol の Fast mode** を発表した。Luna は 80%値下げ、Terra は 20%値下げとなり、API だけでなく Codex と ChatGPT Work の有料サブスクリプションにおける利用量換算にも反映される。

これは単なるモデル単価のニュースではない。[GPT-5.6一般提供](/blog/openai-gpt-56-ga-work-codex-api-2026/) で確認した通り、GPT-5.6 は ChatGPT Work、Codex、API、企業向けワークフローにまたがっている。今回の改定で、日本の開発チームと事業部門は「どのモデルが賢いか」ではなく、**どの作業を、どのモデルで、どの成功単価に収めるか** を見直す必要が出てきた。

特に Codex や業務エージェントでは、1つの依頼から複数の tool call、検証、再試行、レビューが発生する。低単価モデルを大量に使えるようになるほど、モデル選択、上位モデルへの昇格条件、月次予算、ユーザー別 quota の設計が重要になる。[OpenAI Codex企業導入シリーズ](/blog/openai-codex-role-plugins-sites-workflows-2026/) の文脈で見れば、価格改定は機能追加と同じくらい運用設計に効く。

## 事実: LunaとTerraが下がり、SolはFast modeへ

OpenAI の発表によると、GPT-5.6 Luna は同社の最速・低価格モデル、GPT-5.6 Terra は日常業務向けのバランス型モデルという位置づけである。今回、Luna は 80%値下げ、Terra は 20%値下げされた。

OpenAI は、2026年7月30日から API 価格を、Terra は 100万入力tokenあたり 2ドル、100万出力tokenあたり 12ドル、Luna は 100万入力tokenあたり 0.20ドル、100万出力tokenあたり 1.20ドルにすると説明している。Sol の標準価格は変わらない。

同時に、API の Priority Processing は Fast mode に置き換わる。GPT-5.6 Sol の Fast mode は、Standard processing に比べて最大 2.5倍高速で、価格は Standard の2倍とされる。OpenAI は intelligence は変わらないと説明しており、既存の priority 指定リクエストは引き続き動作する。

重要なのは、この変更が API だけに閉じない点だ。OpenAI は、Luna と Terra の低価格化が Codex と ChatGPT Work の有料サブスクリプションでの利用量換算にも反映されると書いている。サブスクリプション料金や quota budget は変えず、Terra と Luna の利用が消費する credit が減るという整理である。

## 事実: ChatGPT WorkとCodexの使い分けが変わる

OpenAI は、Terra と Luna が ChatGPT Work、Codex、OpenAI API で引き続き利用できると説明している。ChatGPT Work と Codex では、Free と Go ユーザーが Terra を利用でき、Plus、Pro、Business、Enterprise ユーザーは Terra と Luna を選べる。

ここで日本企業が見るべきなのは、単価表より利用行動の変化である。Luna が安くなると、分類、要約、レビュー前の下処理、テストログ整理、問い合わせ分類、ドキュメント差分の抽出のような高頻度処理を AI に寄せやすくなる。一方で、安くなったからといって全作業を Luna に寄せると、失敗時の再試行や人間レビューで総コストが上がる可能性がある。

Terra は、日常的な実装、業務文書、社内検索、軽めの分析に使いやすい中間層になる。Sol は、設計判断、重大障害、複雑なコードベース調査、複数ステップの業務判断のように、失敗コストが高い作業に残す。Fast mode は、Sol を使うべきだが待ち時間が業務上のボトルネックになる場面で検討する。

[GPT-5.6のBedrock一般提供](/blog/openai-gpt-56-bedrock-ga-aws-governance-2026/) でも見たように、OpenAI モデルは API 直結、AWS 経由、Codex、ChatGPT Work など複数経路で使われる。今回の価格改定は、そのすべてを一律に安くする話ではなく、どの経路でどのモデル階層を使うかという portfolio 設計を促すものだ。

## 分析: 日本企業は成功単価で見るべき

ここからは分析である。

モデル単価はわかりやすいが、生成AIの実務コストはそれだけでは決まらない。実際に必要なのは、1件の仕事が完了するまでの総コストである。入力token、出力token、tool call、cache、再試行、待ち時間、人間レビュー、失敗時の修正、承認の滞留を合計して見なければならない。

たとえば、問い合わせ分類のように正解基準が明確で大量処理する作業では、Luna の値下げはそのまま費用対効果に効きやすい。毎日数万件のログやチケットを分類するなら、1件あたりのモデル費用が下がることは予算設計に直結する。

一方で、要件定義、設計レビュー、障害原因調査、契約条項の比較、セキュリティ修正方針の決定のような作業では、安いモデルを複数回試すより、最初から Terra や Sol を使ったほうが安くなる場合がある。失敗のコストは token だけではなく、判断の遅れ、レビュー負荷、誤った実装、顧客対応のやり直しとして出る。

OpenAI も、作業の outcome、誤りのコスト、緊急度、規模によって intelligence、speed、reliability、cost のバランスを変えるべきだと説明している。これは日本企業の AI 利用規程にもそのまま使える。モデル選択を個人の好みに任せるのではなく、業務種類ごとに既定モデルと昇格条件を決めるべきである。

## 運用ルールに落とす5つの確認点

第一に、代表タスクを固定する。分類、要約、コード修正、テスト生成、調査、資料作成、問い合わせ返信案、監査ログ分析など、20件から50件の評価セットを作る。Luna、Terra、Sol、Fast mode を同じ条件で比較し、成功率、再試行、処理時間、人間レビュー時間を記録する。

第二に、モデル昇格条件を決める。Luna で失敗したらすぐ Terra に上げるのか、同じモデルで何回まで再試行するのか、顧客影響や本番影響がある作業は最初から Sol にするのかを明文化する。ここを決めないと、低単価化で利用量だけが増える。

第三に、Codex の `/fast` と API Fast mode を別枠で管理する。Fast mode は待ち時間を買う選択肢であり、常時オンにするものではない。リリース直前の重大バグ、障害中の原因切り分け、顧客影響が大きい差分レビューのように、時間価値が明確な場面に限定したほうがよい。

第四に、ChatGPT Work と API の費用を分けて観測する。サブスクリプション側では credit 消費、API 側では token 単価と cache、Codex 側では作業単位の成功率を見る。月次請求の合計だけでは、Luna の値下げが本当に生産性に効いたのか判断できない。

第五に、調達と統制を同じ表に載せる。OpenAI API 直結で使うのか、AWS 経由で使うのか、Codex で使うのか、ChatGPT Work で使うのかによって、請求、ログ、権限、データ分類、監査の扱いは変わる。[OpenAI Codexオンプレ連携](/blog/openai-dell-codex-hybrid-onprem-2026/) のような流れを考えると、モデル単価だけで経路を決めるのは危うい。

## まとめ

GPT-5.6 の価格改定は、Luna と Terra を安くするニュースであると同時に、企業の AI 運用を「高性能モデルを使う」から「仕事ごとに成功単価を最適化する」方向へ押すニュースでもある。

日本企業は、Luna の値下げを単純な利用拡大の合図として扱わないほうがよい。まず代表タスクを測り、Luna、Terra、Sol、Fast mode の使い分け、昇格条件、費用観測、承認線を決める。そのうえで Codex、ChatGPT Work、API、クラウド経路をつなげて、部門ごとの AI 予算と成果を説明できる形にするべきだ。

## 出典

- [Advancing the price-performance frontier with GPT-5.6](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/) - OpenAI, 2026年7月30日
- [GPT-5.6: Frontier intelligence that scales with your ambition](https://openai.com/index/gpt-5-6/) - OpenAI, 2026年7月9日
- [Business Pricing](https://openai.com/api/pricing/) - OpenAI
- [OpenAI cuts GPT-5.6 prices](https://www.axios.com/2026/07/30/openai-cuts-prices-gpt-terra-luna5) - Axios, 2026年7月30日
