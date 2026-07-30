---
title: 'GitHub Copilot既定モデル有効化、8月26日の管理点'
description: 'Copilot既定モデル有効化は、Business/Enterpriseの未設定GAモデルを8月26日から既定ポリシーへ従わせる。日本企業がAI Controls、例外モデル、費用統制をどう棚卸しするか整理する。'
pubDate: '2026-07-30'
category: 'news'
tags: ['GitHub Copilot', 'AI モデル', '管理者設定', 'AIガバナンス', 'SaaSコスト管理', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年7月29日**、Copilot BusinessとCopilot Enterpriseの**default model enablement**を更新すると発表した。2026年8月26日以降、管理者がまだ明示的に有効・無効を決めていない一般提供モデルは、企業または組織のdefault policyに従うようになる。

これは単なるモデル追加ではない。Copilotのモデル統制が、「新モデルを見つけたら個別に開ける」運用から、「既定ポリシーで許可し、例外だけ止める」運用へ寄る変更である。[Copilot model rules](/blog/github-copilot-targeted-model-rules-2026/)で扱った組織別の許可設計、[Grok 4.5のモデルポリシー](/blog/github-copilot-grok-45-model-policy-2026/)で扱った新モデルの費用・client差、[Copilot app統制](/blog/github-copilot-app-policy-managed-settings-2026/)で扱ったagent client管理を、同じAI Controls棚卸しに載せる必要がある。

日本企業にとっての焦点は、8月26日に何かが突然壊れるかではない。むしろ、未設定のGAモデルがどの部門で使えるようになるのか、Auto model selectionがどの候補から選ぶのか、AI Creditsとprovider条件を誰が説明するのか、データ保持や地域要件から除外すべきモデルをどう管理するのかである。

## 事実: 8月26日に未設定GAモデルが既定ポリシーへ従う

GitHubの発表では、Copilot BusinessとEnterpriseで、2026年8月26日からdefault model enablementが適用される。対象は、管理者がまだ明示的に設定していない一般提供モデルである。AI controlsやmodel settingsに表示される未設定モデルは、default policyによって有効・無効が決まる。

この変更で重要なのは、既存の明示設定が上書きされるわけではない点だ。すでに管理者が有効化または無効化したモデルは、その設定を維持する。GitHub Docsでも、各モデルには企業や組織での状態があり、管理者が個別に許可、拒否、または既定に従う状態を管理できると説明されている。

GitHubは、default policyを「GitHubが安定性、安全性、責任ある利用、製品体験に照らして既定候補を選ぶ仕組み」として位置づけている。つまり、モデル一覧が増えるたびに管理者が即日すべてを確認する前提ではなく、GitHub側のdefault availabilityに沿って使える候補を広げる方向だ。

ただし、企業利用では、この便利さがそのまま統制の簡素化を意味しない。未設定モデルが既定に従うということは、社内で「未設定は未承認」と読んでいた組織ほど、8月26日までに運用ルールを読み替える必要がある。未設定を放置してよいか、明示的にdenyへ寄せるか、組織ごとにmodel rulesで分けるかを決めたい。

## 事実: 明示設定、open-weight、データ保持対象外モデルは別枠

今回の発表では、すべてのモデルが一律にdefault policyへ入るわけではない。GitHubは、明示的に無効化されたモデル、まだ一般提供ではないモデル、open-weightモデル、GitHubのデータ保持条件に含まれないモデルなどは、この自動的な既定有効化の対象外だと説明している。

ここは日本企業のデータガバナンスで大きい。たとえば、open-weightモデルや一部providerモデルは、一般的なCopilotのデータ保持・利用条件と同じ前提で扱えない場合がある。Docsのsupported models一覧でも、モデルごとにavailability、対応client、input、billing倍率、data retentionや地域制限に関する注記が分かれている。

つまり、管理者は「Copilotに出ているモデルなら全部同じ契約条件」と考えてはいけない。モデルが使えるかどうか、どのclientで見えるか、AI Creditsをどの程度消費するか、データ保持やdata residencyの制約を満たすかは、モデル単位で分かれる。

既存記事の[GitHub Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)で整理した通り、Copilotは席数だけの費用管理から、モデル、surface、agentic workflow、budget controlsを組み合わせる費用管理へ移っている。default model enablementは、その費用面にも影響する。高コストモデルが利用候補に入るほど、利用者は品質優先で選びやすくなるためだ。

## 分析: モデル承認は「既定と例外」の設計になる

ここからは分析である。

今回の変更は、Copilotのモデル選択が増え続ける前提で管理方式を変えるものだ。OpenAI、Anthropic、Google、xAI、MicrosoftなどのモデルがCopilot内に並ぶと、管理者が毎回ゼロから審査する運用は重くなる。GitHub側は、GAモデルのうち標準的に扱えるものをdefault policyで広げ、管理者は必要に応じて明示的に止める方向へ誘導している。

これは、開発者にとっては自然だ。新しいGAモデルが出たときに、VS Code、CLI、Copilot app、cloud agentで使える候補が増えれば、作業に合うモデルを選びやすい。Auto model selectionを使う場合も、利用可能な候補が広がるほどルーティングの意味が増す。

一方、管理者にとっては、承認線が変わる。これまでは「開けたモデルだけ使える」と説明しやすかった。今後は「default policyで開くモデル、明示的に止めるモデル、特定organizationだけで許すモデル、data retentionやFedRAMPなどの理由で対象外にするモデル」を分けて説明する必要がある。

日本企業では、委託先、規制業務、海外子会社、研究開発、生成AI検証チームが同じenterpriseの中に混在しやすい。全社一律のdefault policyだけでは粗い。モデルを強い順に並べるのではなく、業務リスク、費用上限、データ条件、client別の利用範囲を組み合わせて、organization単位のルールへ落とすのが現実的だ。

## 実務: 28日で棚卸しするAI Controls

最初に確認すべきは、enterpriseとorganizationのAI Controlsである。未設定モデルがどれだけ残っているか、default policyが有効になったときにどのモデルが使える候補へ入るか、明示的にdenyしているモデルがあるかを一覧化する。8月26日までに、未設定の意味を「保留」から「既定に従う」へ読み替えてよいかを決める。

次に、モデルの例外表を作る。open-weightモデル、データ保持条件が通常と違うモデル、地域要件に合わないモデル、高コストモデル、特定clientでだけ使わせたいモデルを分ける。ここで大切なのは、例外理由を短く書くことだ。「セキュリティ上不安」では運用できない。データ保持、地域、費用、規制、性能検証未了、委託先利用不可のように、判断理由を分類する。

3つ目は、organization別のmodel rulesである。研究開発部門には新モデル評価を許し、金融・医療・公共系の顧客データを扱う部門では保守的にする。外部委託先が参加するorganizationでは、モデル選択とagent clientの権限を絞る。Copilot Business/Enterpriseの管理画面だけでなく、社内のGitHub利用台帳と突き合わせる必要がある。

4つ目は、利用者向けの説明である。8月26日以降、「モデル一覧が変わった」「Autoが別モデルを選ぶ」「前は見えなかったモデルが見える」という問い合わせが出る可能性がある。ヘルプデスクには、管理者ポリシー、rollout、client対応、extension version、AI Credits、model availabilityを切り分ける表を渡したい。

最後に、月次レビューを置く。新しいdefault policyを有効にしたら終わりではない。利用実績、AI Credits、モデル別の問い合わせ、品質評価、禁止モデルの例外申請を月次で見直す。Copilotのモデル面は今後も動くため、8月26日の一回限りの対応にしないほうがよい。

## 注意点: Auto model selectionと同一視しない

default model enablementは、Auto model selectionそのものではない。default policyは、どのモデルが使える候補になるかを決める管理面である。Auto model selectionは、利用できる候補の中からタスクに応じてモデルを選ぶ利用面である。この2つを混同すると、管理者と利用者の会話がずれる。

たとえば、あるモデルがdefault policyで利用可能になっても、すべてのclientで同じように表示されるとは限らない。supported modelsのDocsでは、モデルごとに対応client、availability、課金倍率が分かれている。VS Codeでは見えるがJetBrainsでは時期が違う、Copilot appでは選べるがcloud agentでは制約がある、という状況は起こり得る。

また、defaultで開くことは、標準モデルとして推奨することとも違う。社内標準は、品質、費用、データ条件、監査説明、利用者教育を踏まえて別に決めるべきだ。高度なreasoning modelを全員に開けることと、全員が日常的に使うことは同じではない。

日本企業では、まず低リスクな開発組織でdefault policyを観測し、必要な例外だけ明示設定するのが現実的だ。規制業務や顧客機密を扱うorganizationでは、model rulesで保守的に始め、評価済みモデルだけ段階的に増やすほうが説明しやすい。

## まとめ

GitHub Copilotのdefault model enablementは、2026年8月26日から、未設定のGAモデルをdefault policyへ従わせる運用変更である。既存の明示設定は維持され、open-weightモデルやデータ保持条件が通常と違うモデルなどは別枠になる。

日本企業にとっての実務価値は、モデル追加ニュースを追うことではない。Copilotのモデル統制を、全社既定、organization別ルール、例外モデル、AI Credits、data retention、client対応に分け直すことだ。8月26日までにAI Controlsを棚卸しし、未設定の扱いを決め、利用者向けFAQと月次レビューに落とし込むべきである。

この更新は、`github-copilot-2026` seriesの中ではモデルガバナンスの節目に近い。既存のseriesTitle記事が総まとめの役割を持つためpillar指定は自動では付けないが、今後のCopilotモデル運用記事を束ねる重要な参照点になる。

## 出典

- [Default model enablement for Copilot Business and Enterprise](https://github.blog/changelog/2026-07-29-default-model-enablement-for-copilot-business-and-enterprise/) - GitHub Changelog, 2026-07-29
- [About default availability of Copilot models](https://docs.github.com/en/copilot/concepts/models/default-availability) - GitHub Docs
- [Managing availability of models in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) - GitHub Docs
- [Supported AI models in GitHub Copilot](https://docs.github.com/copilot/reference/ai-models/supported-models) - GitHub Docs
