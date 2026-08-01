---
title: 'Copilot teamsモデル統制、部門別AI解禁の設計'
description: 'GitHub Copilot teamsモデル統制の公開プレビューを整理。日本企業が部門別のモデル解禁、AI Credits、委託先や高リスク業務の権限をどう設計するか実務視点で解説する。'
pubDate: '2026-08-02'
category: 'news'
tags: ['GitHub Copilot', 'AI モデル', '管理者設定', 'AIガバナンス', 'SaaSコスト管理', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは2026年7月31日、GitHub Copilotの**enterprise teams model policy targeting**を公開プレビューとして発表した。enterprise管理者が、organization全体ではなくenterprise teamを対象に、追加モデルの利用を割り当てられるようになる更新である。GitHubはこの機能を2026年8月3日から段階的に有効化すると説明している。

日本企業にとって、この変更は「モデル一覧が増えた」という話ではない。[Copilot model rules](/blog/github-copilot-targeted-model-rules-2026/)ではorganization単位のモデル統制を扱ったが、今回の焦点はさらに細かい。研究開発、SRE、セキュリティ、委託先、規制業務担当のように、同じorganization内でもモデル利用権限を分けたい場面に向く。また、[Copilot既定モデル有効化](/blog/github-copilot-default-model-enablement-policy-2026/)で整理した8月26日の既定ポリシー変更と合わせて、管理者は「全社既定」「organization単位」「team単位」の3層でモデルを説明する必要が出てきた。

## 事実: enterprise teamにモデル権限を割り当てる公開プレビュー

今回の発表で確認できる事実は明確だ。GitHub Copilot Enterpriseの管理者は、enterprise teamsを対象にモデルポリシーを適用できるようになる。これにより、特定のteamに対して、organization全体では一般に利用できない追加モデルを開ける設計が可能になる。

ここで重要なのは、team policyが「最小制限」ではなく「追加のアクセス権」として説明されている点である。つまり、既存のorganizationやenterpriseの設定を全部上書きして別世界を作るというより、標準では閉じているモデルを、特定のenterprise teamへ限定的に許可する読み方が現実的だ。

GitHub Docs側では、Copilotのモデル可用性は、enterprise ownerやorganization ownerが管理し、モデルごとに有効化、無効化、既定に従う状態を扱うと説明されている。さらにモデルの利用可否は、プラン、クライアント、ポリシー、ロールアウト状態にも依存する。したがって、team targetingを設定しても、利用者のIDEやCopilot surfaceで直ちに同じ表示になるとは限らない。

既存の[Geminiモデル廃止対応](/blog/github-copilot-gemini-25-pro-3-flash-retirement-2026/)でも見たように、Copilotのモデル運用は期限、代替モデル、クライアント対応、管理者ポリシーが絡む。今回のteam targetingは、その運用を人の役割単位へ下ろす機能として見るべきだ。

## 分析: organization単位だけでは粗くなる

ここからは分析である。

大企業のGitHub Enterpriseでは、ひとつのorganization内に複数の役割が混在する。たとえば、同じプロダクトorganizationの中に、フロントエンド、バックエンド、SRE、セキュリティ、データ基盤、社外委託先がいる。organization単位で上位モデルを許可すると、必要な人だけではなく全員に開く可能性がある。逆に閉じると、高難度の調査や大規模リファクタリングに使いたいチームまで制限される。

team targetingは、この中間を作る。セキュリティレビューを担当する少数teamには高性能モデルを開く。日常補完中心の開発者には標準モデルかAutoを使わせる。委託先が入るteamには、データ保持や費用の説明がしやすいモデルだけを渡す。こうした設計が、organizationを増やさずにできる可能性がある。

ただし、粒度が細かくなるほど管理は難しくなる。teamは人事異動、兼務、プロジェクト開始、委託契約の変更で頻繁に変わる。モデル権限をteamに結びつけるなら、GitHub teamの管理台帳を信頼できる状態にしておく必要がある。古いteamに残ったメンバーへ高倍率モデルが開き続けると、費用と統制の説明が崩れる。

ここは[Copilot Claude Opus 5](/blog/github-copilot-claude-opus-5-model-policy-2026/)の導入線ともつながる。上位モデルは複雑なagentic codingに価値がある一方、全員の既定モデルにすると費用対効果を説明しにくい。team targetingは、上位モデルを「使うべき仕事を持つ人」に寄せるための管理面の部品になる。

## 実務: 日本企業が先に決めること

最初に決めるべきなのは、モデル名ではなく役割である。どのteamが、どの種類の作業で、なぜ追加モデルを必要とするのかを短く書く。例として、障害調査、セキュリティ修正、大規模移行、設計レビュー、技術調査、生成AI推進チームの検証などがある。逆に、通常の補完、短い説明生成、軽微なテスト追加だけなら、上位モデルのteam解禁は急がなくてよい。

次に、対象teamの管理責任者を置く。GitHub teamのメンバー追加と削除は、モデル費用や情報取り扱いに直結する。人事部門が管理する職制と、GitHub上のteamが一致していない企業では、少なくともCopilot上位モデル用のteamだけはowner、加入条件、棚卸し周期を明文化したい。

3つ目は、AI Creditsの説明である。追加モデルをteamへ開くなら、そのteamの利用量をどう見える化し、誰が月次で説明するかを決める。Copilotは席数だけでなく、モデルやagentic workflowの利用量が費用感に影響する。高性能モデルを開くteamには、利用目的、上限、レビュー方法、例外申請の流れをセットで渡すべきだ。

4つ目は、default model enablementとの関係だ。8月26日以降、未設定の一般提供モデルがdefault policyへ従う運用になるなら、team targetingは例外解禁のために使うのか、先行検証のために使うのかを分ける必要がある。未設定を放置したままteamだけ増やすと、どのモデルが全社既定で、どのモデルがteam例外なのか説明できなくなる。

5つ目は、ロールバック条件である。追加モデルを開いた結果、AI Creditsが急増した、想定外のclientに表示された、委託先teamに不要なモデルが見えた、品質評価が安定しない、といった場合に戻す基準を決める。公開プレビューである以上、最初から恒久運用として扱わないほうがよい。

## 注意点: 権限粒度が細かいほど監査は重くなる

team targetingには便利さがある一方で、監査の見方は難しくなる。organization単位なら「このorganizationではこのモデルを許可」と説明できる。team単位になると、利用者、team membership、organization policy、enterprise policy、client対応、モデルのGA状態を重ねて確認する必要がある。

日本企業では、社内開発者と委託先が同じrepositoryを扱うことがある。委託先をGitHub teamで分けている場合、team targetingは強力な制御になる。しかし、委託先メンバーが社内teamにも兼務で入っていると、意図しないモデル権限を得る可能性がある。teamの入れ子、兼務、休眠アカウント、外部コラボレーターの扱いを棚卸ししたい。

また、モデル権限だけではデータ統制は完結しない。許可モデルを絞っても、promptに顧客データを入れてよいか、repositoryの秘密情報をどう扱うか、生成コードを誰がレビューするかは別問題である。team targetingはAIガバナンスの入口であり、DLP、監査ログ、CODEOWNERS、branch protection、社内規程と組み合わせる必要がある。

## まとめ

GitHub Copilotのenterprise teams model policy targetingは、Copilotのモデル統制をorganization単位からenterprise team単位へ細かくする公開プレビューである。事実として、GitHubは2026年7月31日に発表し、2026年8月3日から段階的に有効化すると説明している。

分析として、日本企業はこの更新を、上位モデルを全社に開けるためではなく、必要な職務やプロジェクトへ限定的に開くための機能として扱うべきだ。Copilotのモデル運用は、モデルピッカーの話から、部門別権限、AI Credits、委託先統制、監査説明の話へ移っている。まずは少数teamで試し、権限、費用、品質、ロールバックを月次で見直す運用にしたい。

## 出典

- [Enterprise teams model policy targeting in public preview](https://github.blog/changelog/2026-07-31-enterprise-teams-model-policy-targeting-in-public-preview/) - GitHub Changelog, 2026-07-31
- [Managing availability of models in your enterprise](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) - GitHub Docs
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
