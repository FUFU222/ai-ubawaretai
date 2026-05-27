---
title: 'Copilot model rules、組織別AI統制の要点'
description: 'GitHub Copilot model rulesの公開プレビューを整理。日本企業が部門別のモデル許可、AI Credits、委託先や規制業務の統制をどう設計すべきか具体的に解説する。'
pubDate: '2026-05-27'
category: 'news'
tags: ['GitHub Copilot', '管理者設定', 'AI モデル', 'SaaSコスト管理', '開発者ツール', 'エンタープライズAI']
draft: false
series: 'github-copilot-2026'
---

GitHubが2026年5月26日、GitHub Copilotの **model rules** を公開プレビューとして発表した。対象はCopilot BusinessとCopilot Enterpriseで、enterprise ownerが「どのorganizationにどのAIモデルを使わせるか」を指定できるようになる。これまでのenterprise-wide default model設定だけでは粗かったモデル統制を、組織単位まで下ろせる更新だ。

日本の開発組織にとって、この変更は管理画面の細かい改善ではない。[Copilot Webモデル削減](/blog/github-copilot-web-models-limited-2026/)で見たように、Copilot内のモデル一覧は増減し続けている。一方で[Copilot Auto選択](/blog/github-copilot-auto-model-selection-vscode-2026/)のように、現場はモデルを自動選択に寄せ始めている。さらに[AI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/)で整理した通り、モデル利用は予算説明と結びつく。model rulesは、この3つを管理者が組織別に扱うための部品になる。

## 何が公開されたのか

事実から整理する。

GitHub Changelogによると、model rulesはenterprise ownerが特定のorganizationに対してCopilotモデルの利用可否を設定する機能だ。既存のenterprise-wide default model設定に加えて、組織ごとのルールを作れる。GitHubは、全社標準モデルを維持しながら、一部組織だけに別のモデル構成を割り当てる用途を想定している。

Docs側では、Copilot BusinessまたはCopilot Enterpriseのenterprise ownerが、enterprise settingsのCopilotから「Models」へ進み、default model availabilityを管理できると説明されている。モデルはEnabled、Disabled、Unconfiguredのような状態で扱われ、さらにorganization ownerが選べるoptional modelとして渡す設計もある。今回のmodel rulesは、このモデル可用性管理をorganization単位で狙い撃ちするものだ。

もうひとつ重要なのは、組織管理者との責任分界だ。Enterprise側がモデルを使える状態にしても、organization側の設定やポリシーで最終的な見え方が変わる。つまり、model rulesは「本社が全部を固定する機能」というより、enterprise ownerとorganization ownerの間に置く統制レイヤーだと見るべきだ。

## なぜ日本企業で効くのか

日本企業では、GitHub Enterpriseの中に複数のorganizationがある構成が珍しくない。事業部、子会社、海外拠点、委託先、研究開発チーム、社内基盤チームを分けている会社もある。このとき、すべてのorganizationに同じAIモデルを開ける運用は説明しにくくなる。

たとえば、社内ツールを扱うチームと、金融・医療・公共に近い顧客データを扱うチームでは、許可したいモデルが違う。PoC部門では新モデルを早く試したいが、本番サービスの保守部門では安定したモデルだけにしたい場合もある。委託先が参加するorganizationでは、上位モデルの費用や情報取り扱いを絞りたいこともある。

これまでは、全社設定を厳しくすると先進チームが動きにくくなり、緩くすると高リスク部門の説明責任が重くなる、という二択になりがちだった。model rulesは、その中間を作る。組織別にモデルを開け、標準モデルと例外モデルを分けることで、管理者は「全員に同じ自由を与える」以外の選択肢を持てる。

ここは[CopilotデータレジデンシーとFedRAMP](/blog/github-copilot-data-residency-fedramp-2026/)の論点ともつながる。地域、規制、監査、顧客契約の条件が違うなら、モデル許可も同じ粒度で分けたほうがよい。model rulesは、データ統制そのものを置き換える機能ではないが、AI利用面の境界をorganization単位で表現できる。

## 料金とAI Creditsの見方

料金面では、model rulesは「高いモデルを禁止する」ためだけの機能ではない。むしろ、どの組織にどのモデルを開けると、どの予算単位で説明しやすいかを設計するための機能だ。

Copilotではモデルごとにpremium requestやAI Creditsの消費が変わる。高性能モデルを一部の専門チームに開けることは合理的だが、全社に広げると予算の説明が急に難しくなる。逆に、全社で低倍率モデルだけにすると、障害調査や設計レビューのような高難度タスクで品質が足りない可能性がある。

model rulesを使うなら、まずorganizationを予算責任の単位と合わせるべきだ。プロダクト部門、社内基盤、研究開発、委託開発、規制業務のように、モデル利用の目的と説明責任が異なる単位で分ける。その上で、日常作業は標準モデルまたはAuto、例外作業は上位モデルという形にする。

この考え方は、単なるコスト削減ではない。高いモデルを使うべき作業に使わせ、不要な場所では使わせないための配賦設計だ。日本企業では稟議、部門予算、委託契約の説明が残るため、モデル利用の粒度をorganizationに寄せられる意味は大きい。

## 導入時の手順

導入は、モデル名から決めるより、先に組織の用途を棚卸ししたほうがよい。

最初に、Enterprise配下のorganizationを用途別に分類する。顧客データを扱うか、委託先が参加するか、AI Creditsの予算責任者は誰か、高倍率モデルを使う正当な理由があるかを見る。ここで分類できないorganizationは、AIモデル設定以前にGitHub運用の責任境界が曖昧な可能性がある。

次に、現在のモデル可用性を確認する。GitHub Docsのdefault model管理では、enterprise ownerが各モデルの可用性を変更できる。全社でEnabledにしているモデル、organization ownerが選べるoptional model、未設定のモデルを分けて見直す。model rulesを入れる前に、現状の「誰が何を使えるか」を明確にする必要がある。

3つ目に、pilot対象のorganizationを選ぶ。いきなり全社へ適用するより、開発基盤チームや生成AI推進チームのように、モデル差を理解できる少数組織で試すほうがよい。ここで、Autoを標準にする組織、高性能モデルを明示許可する組織、保守的なモデルだけにする組織を分ける。

4つ目に、社内ガイドを短く更新する。たとえば「通常作業はAutoまたは標準モデル」「高倍率モデルは理由をチケットに残す」「委託先organizationでは承認済みモデルだけを使う」「規制業務は別ルールに従う」という粒度で十分だ。モデル名の一覧表より、判断基準を明確にするほうが現場に伝わる。

## 注意点

注意すべき点もある。

まず、今回の機能は公開プレビューだ。管理画面や対象範囲が変わる可能性があるため、本番統制の唯一の根拠にするのは早い。既存の利用規程、契約、監査ログ、リポジトリ権限と合わせて使うべきだ。

次に、organization単位の設定は便利だが、細かくしすぎると運用が破綻する。モデルルールをチームごとに作りすぎると、誰がどのモデルを使えるか説明できなくなる。最初は3分類程度に抑えるのが現実的だ。標準、制限、検証の3つに分け、必要になったら増やす。

また、model rulesは品質問題を自動で解決しない。許可モデルを絞りすぎれば、現場の回答品質が落ちる。広げすぎれば、予算やコンプライアンスの説明が重くなる。設定後は、利用量、レビュー品質、失敗例、現場からの問い合わせを見て調整する必要がある。

最後に、既存のAuto model selectionとの関係を誤解しないことだ。Autoは管理者が許可したモデルの範囲で動く。model rulesでorganizationごとに候補を変えれば、同じAutoでも組織ごとに選ばれるモデルが変わる可能性がある。現場には「Autoだから全員同じ」ではなく、「自分のorganizationで許可された範囲のAuto」だと説明すべきだ。

## まとめ

GitHub Copilot model rulesは、Copilotのモデル統制をenterprise全体の一括設定からorganization単位へ進める更新だ。派手な新モデルではないが、Copilotを大規模に使う会社ほど実務影響が大きい。

事実として、Copilot BusinessとCopilot Enterpriseのenterprise ownerは、organizationを対象にモデルルールを設定できるようになる。これは公開プレビューであり、既存のdefault model availabilityやorganization ownerの管理と組み合わせて使う機能だ。

分析として、日本企業はこの更新を、部門別のAI Credits管理、委託先統制、規制業務のモデル制限、PoC組織の例外運用を分ける機会として扱うべきだ。全社一律のオンオフではなく、organizationごとの責任と予算に合わせてモデル許可を設計する。Copilotのモデル運用は、もう個人のモデルピッカーの話ではなく、企業のAIガバナンスの一部になっている。

## 出典

- [Target Copilot models to organizations with model rules](https://github.blog/changelog/2026-05-26-target-copilot-models-to-organizations-with-model-rules/) - GitHub Changelog, 2026-05-26
- [Managing availability of default models](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) - GitHub Docs
- [Managing default models](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-default-models) - GitHub Docs
