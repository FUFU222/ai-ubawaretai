---
title: 'GitHub Copilot Memory、個人設定をどう管理するか'
description: 'GitHub Copilot MemoryがPro/Pro+向けuser-level preferencesに対応。日本の開発組織が個人設定、管理ポリシー、削除手順、agent運用をどう見直すべきか整理する。'
pubDate: '2026-05-17'
category: 'news'
tags: ['GitHub Copilot', 'AIエージェント', '開発者ツール', 'エンタープライズAI', 'プライバシー', '管理者設定']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年5月15日**、**GitHub Copilot Memory**がCopilot ProとCopilot Pro+ユーザー向けに、user-level preferencesを早期アクセスとして扱えるようになったと発表した。これまでのCopilot Memoryは、リポジトリ単位の事実を記憶する性格が強かった。今回の更新では、ユーザー本人の作業スタイル、PRの好み、コミュニケーションの傾向といった個人設定が、リポジトリをまたいだCopilot体験に使われる。

これは小さな便利機能に見えるが、日本の開発組織では運用上の意味が大きい。すでに[GitHub Copilot appの技術プレビュー](/blog/github-copilot-app-technical-preview-2026/)で、CopilotはIssue、PR、session、workflowを扱う作業面へ広がり始めた。[Copilot cloud agentのREST API化](/blog/github-copilot-cloud-agent-rest-api-2026/)も進み、agent作業は個人のIDE内だけで完結しない。そこに「ユーザー個人の好みがagentに持ち込まれる」機能が加わると、便利さと統制の両方を設計する必要が出てくる。

## 事実: user-level preferencesが追加された

今回の発表で追加されたのは、Copilot Memoryが**user-level preferences**を扱うことだ。GitHub Changelogは、Copilotがユーザーの明示または推定された好みを保存し、将来のCopilot interactionで利用できるようになると説明している。例として挙げられているのは、commit style、pull requestの構成、コミュニケーションや文体の好みだ。

従来のrepository-level factsは、特定のリポジトリの慣習や構成を覚えるものだった。たとえば「このリポジトリではテストをこのコマンドで走らせる」「DB接続はこの層を通す」「設定ファイルは2つを同期する」といった知識だ。これに対してuser-level preferencesは、ユーザー本人に紐づく。つまり、あるリポジトリで学んだ個人の好みが、別のリポジトリや別のCopilot surfaceでも使われる可能性がある。

GitHub Docsでは、Copilot Memoryが現在使われる場所としてCopilot cloud agent、Copilot code review、Copilot CLIが挙げられている。ただし、Copilot code reviewではrepository-level factsだけを使い、user-level preferencesは適用されないと説明されている。ここは誤解しやすい。すべてのCopilot機能が同じ記憶を同じように使うわけではない。

対象プランも重要だ。user-level preferencesは、現時点ではCopilot ProとCopilot Pro+向けとされる。個人契約のPro/Pro+ではCopilot Memoryが既定で有効になり、個人のCopilot settingsから無効化や再有効化ができる。一方、企業や組織管理の契約では、Copilot Memoryは既定でオフであり、enterpriseまたはorganization側の設定で有効化する必要がある。

## 事実: repository factsと個人設定はスコープが違う

Copilot Memoryを導入判断するうえで、最初に分けるべきなのは「リポジトリの記憶」と「個人の記憶」だ。

repository-level factsは、リポジトリに紐づく。GitHub Docsは、これらのfactには根拠となるコードへのcitationがあり、利用時には現在のbranchに照らして正確性を確認すると説明している。保存されたfactは、そのリポジトリでCopilot Memoryにアクセスできるユーザーに利用される。つまり、チーム全体で共有されるコードベース知識に近い。

user-level preferencesは、ユーザー本人に紐づく。Docsでは、ユーザーの発言を含むcitationを持つ場合があり、後続のinteractionで関連すると判断されたときに使われると説明されている。こちらは同じリポジトリの他メンバーへ共有されるものではない。個人の作業スタイルを持ち運ぶための記憶だ。

この違いは、日本企業の運用ではかなり実務的だ。repository-level factsは、チームの開発標準や設計判断を反映するため、コードオーナーやリポジトリ管理者が確認しやすい。一方、user-level preferencesは個人の作業スタイルに近く、会社として標準化したいものと、個人に任せてよいものが混ざる。

たとえば「PR本文は日本語で要約してほしい」は個人の好みとして自然だ。しかし「テストは軽いものだけでよい」「レビュー指摘は低優先度なら無視してよい」のような好みが記憶されると、チーム標準と衝突する可能性がある。Copilotがそれをどの程度強く使うかはケースによるが、企業導入では、個人設定がチームルールを上書きするように見えない設計が必要になる。

## 事実: 管理、削除、保持期間のルールがある

GitHub Docsは、Copilot Memoryの管理面も明示している。リポジトリ所有者はrepository-level factsを確認し、不適切、誤解を招く、または間違っていると判断したものを削除できる。user-level preferencesについては、利用できるユーザー本人が確認と削除を行える。

保持期間にもルールがある。Docsでは、使われなかったfactやpreferenceは**28日後に自動削除**されると説明されている。利用・検証された場合は、このタイマーがリセットされる可能性がある。これは「永続的な個人プロファイルが無期限に蓄積される」とは違うが、少なくとも一定期間は作業に影響する設定として扱うべきだ。

企業契約では、有効化ポリシーも見る必要がある。enterprise ownerは全体ポリシーを設定でき、organization ownerに判断を委ねることも、全体で有効化・無効化することもできる。organization ownerは組織単位で有効化できる。さらに、ユーザーが複数のorganizationからCopilot subscriptionを受けている場合、最も制限の強い設定が適用され、すべての組織で有効化されていない限りCopilot Memoryは使われない。

この「最も制限の強い設定」は、日本企業では見落としやすい。親会社、子会社、委託先、共同開発先のorganizationをまたいで作業する開発者がいる場合、ある場所ではMemoryが効き、別の場所では効かない可能性がある。導入テストでは、単一organizationだけでなく、複数所属ユーザーの挙動も確認したほうがよい。

## 分析: 個人設定はagent運用の責任分界を変える

ここからは分析だ。

user-level preferencesの価値は、プロンプトの繰り返しを減らせることだ。毎回「commit messageはConventional Commitsにして」「PRは背景、変更点、テスト結果で書いて」「日本語で簡潔に説明して」と言う必要が減る。個人開発者にとっては明らかに便利だ。

ただし、企業のagent運用では、それだけでは済まない。Copilotの作業面が広がるほど、個人の好みが成果物に出る場所も増える。[GitHub Copilot app](/blog/github-copilot-app-technical-preview-2026/)ではIssueやPRを起点にsessionを動かせる。[Copilot cloud agent REST API](/blog/github-copilot-cloud-agent-rest-api-2026/)では、社内ポータルや自動化からagent taskを開始できる。このとき、起動者のuser-level preferencesがどの範囲で効くのかは、レビュー責任や標準化に関わる。

たとえば社内ポータルからリファクタ作業を起動する場合、会社としては標準テンプレート、禁止事項、レビュー条件を守らせたい。一方、起動したユーザーには「短い説明を好む」「テスト追加は最小限から始める」といった個人設定があるかもしれない。ここで企業標準、repository facts、user preferences、プロンプトテンプレートの優先関係を理解せずに使うと、期待した出力がぶれる。

そのため、日本の開発組織では、Copilot Memoryを「個人が便利にする機能」とだけ扱わないほうがよい。agent作業の標準をどこに置くかを整理する必要がある。会社共通のルールはorganization-level custom instructionsやリポジトリの手順書へ置く。リポジトリ固有の慣習はrepository-level factsで補助する。個人の文体や操作好みはuser-level preferencesに任せる。この分担を明文化したほうが、後からレビューしやすい。

## 実務: まず管理ポリシーと確認手順を決める

日本企業が最初にやるべきことは、全社でいきなり有効化することではない。まず、Copilot Memoryの有効化単位、削除手順、レビュー責任を決めるべきだ。

小さく始めるなら、Platform Engineeringや開発基盤チームのpilot organizationで有効化し、Copilot cloud agent、Copilot CLI、Copilot appのどこで効果が出るかを見る。特に、[チーム別Copilot usage metrics API](/blog/github-copilot-team-metrics-api-2026/)で利用状況を見ている組織なら、Memory有効化後にagent sessionのやり直しやPR修正回数が減るかを観測できる。

次に、削除と訂正の導線を開発者に説明する。user-level preferencesは本人が確認・削除できるため、間違った好みが保存されたと感じたときにどこを見るかをオンボーディングに入れる。repository-level factsはリポジトリ所有者が確認・削除するため、コードオーナーやリポジトリ管理者の運用に含める。

最後に、コストと品質の観測を合わせる。Memoryはプロンプトの反復を減らす可能性があるが、同時にagent利用を増やす可能性もある。[AI Credits移行を見積もる流れ](/blog/github-copilot-ai-credits-usage-report-2026/)と切り離さず、Memoryを入れたチームでsession数、premium request、PR作成数、レビュー差し戻し数を見て、便利さが実際の運用品質に効いているかを判断したい。

## まとめ

GitHub Copilot Memoryのuser-level preferences対応は、個人の作業スタイルをCopilot体験へ持ち込む更新だ。Pro/Pro+ユーザーには早期アクセスとして提供され、企業や組織管理の契約では管理者設定が必要になる。

日本の開発組織にとっての焦点は、「Copilotが好みを覚えると便利か」ではなく、個人設定、リポジトリ知識、会社標準、agent実行テンプレートをどう分けるかだ。CopilotがIDE補完からagent作業面へ広がるほど、この分担は重要になる。まずはpilot organizationで有効化し、削除手順、複数組織所属、repository factsの管理、usage metricsとの接続を確認してから広げるのが現実的だ。

## 出典

- [Copilot Memory supports user preferences for Pro, Pro+ users](https://github.blog/changelog/2026-05-15-copilot-memory-supports-user-preferences-for-pro-pro-users/) - GitHub Changelog, 2026-05-15
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory) - GitHub Docs
- [Managing and curating Copilot Memory](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory) - GitHub Docs
- [Copilot Memory now on by default for Pro and Pro+ users in public preview](https://github.blog/changelog/2026-03-04-copilot-memory-now-on-by-default-for-pro-and-pro-users-in-public-preview/) - GitHub Changelog, 2026-03-04
