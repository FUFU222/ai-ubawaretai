---
title: 'GitHub Copilot Memory、CLI管理と削除設計'
description: 'GitHub Copilot Memoryの新しい管理機能を整理。リポジトリ単位の無効化、削除導線、CLI設定を、日本企業が開発者体験と統制を両立しながら運用へ落とす要点として解説する。'
pubDate: '2026-05-27'
category: 'news'
tags: ['GitHub Copilot', 'AIエージェント', '開発者ツール', 'エンタープライズAI', 'プライバシー', '管理者設定']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年5月26日**、**GitHub Copilot Memory**に削除、スコープ表示、リポジトリ単位の停止、Copilot CLI操作を強化したと発表した。Copilot Memoryは、Copilotがリポジトリの慣習やユーザーの好みを後続の作業に使うための仕組みだ。今回の更新は新モデルや派手なUIではないが、企業導入ではかなり重要な管理面の追加になる。

このサイトではすでに[GitHub Copilot Memoryの個人設定](/blog/github-copilot-memory-user-preferences-2026/)を取り上げた。前回の焦点は、user-level preferencesが個人の作業スタイルをどう持ち運ぶかだった。今回の焦点は少し違う。リポジトリ管理者がMemoryを止められること、保存された情報の削除導線が明確になったこと、Copilot CLIからMemoryの状態を切り替えられることが主題だ。

日本の開発組織では、CopilotをIDE補完としてだけでなく、CLI、cloud agent、code review、Spaces、モデル統制まで含む開発基盤として扱う場面が増えている。[Copilot Spaces API](/blog/github-copilot-spaces-api-ga-context-2026/)が共有文脈の管理をAPI化し、[Copilot model rules](/blog/github-copilot-targeted-model-rules-2026/)が組織別のモデル許可を扱い始めた流れの中で、Memoryの管理強化は「AIが何を覚えてよいか」を運用対象にする更新だ。

## 事実: 5月26日に追加された管理強化

GitHub Changelogによると、今回のCopilot Memory更新は大きく4つある。

1つ目は、削除に関する案内の改善だ。ユーザーがCopilotに何かを忘れるよう頼んだ場合、Copilotは削除すべき場所へ誘導し、投票機能がある場所では該当Memoryを低評価する。つまり、会話で「忘れて」と言えば完全に削除される、という単純な仕組みではなく、保存場所ごとの管理導線へつなぐ設計になっている。

2つ目は、リポジトリ単位のoff switchだ。リポジトリ管理者は、既存のCopilot feature controlsから、そのリポジトリでCopilot Memoryを無効化できる。無効化すると、repository-level factsは保存も参照もされなくなる。ただし、既存のfactsが自動削除されるわけではなく、user-level preferencesにも影響しないと説明されている。

3つ目は、Copilot CLIの`/memory`コマンドだ。GitHubは、Copilot CLIで`/memory on`、`/memory off`、`/memory show`を使い、Memoryの有効化、無効化、状態確認ができるようになったと案内している。この選択はsessionをまたいで保持される。

4つ目は、保存時のスコープ表示の明確化だ。`store_memory`のpermission promptで、そのMemoryがuser-level preferenceなのか、repository-level factなのかを明示する。これは実務上大きい。保存される情報が「自分だけの好み」なのか「リポジトリの全員に効く知識」なのかを、許可時点で見分けやすくなるからだ。

## 事実: repository factsとuser preferencesは別物

GitHub Docsでは、Copilot Memoryが保存する情報をrepository-level factsとuser-level preferencesに分けている。repository-level factsは、リポジトリのcoding conventions、architectural decisions、build commands、project-specific rulesのような情報だ。同じリポジトリでCopilot Memoryにアクセスできるユーザーに利用される。

user-level preferencesは、ユーザー本人の作業スタイルやCopilotとのやり取りの好みだ。こちらはユーザー本人にだけ使われ、別の利用者に共有されない。現時点ではCopilot ProとPro+の個人利用者で扱われる領域もあり、企業や組織管理の契約では管理者設定が関係する。

この違いは、日本企業の運用で最初に説明すべき点だ。repository-level factsは、チームの共通知識に近い。間違ったfactが保存されると、同じリポジトリの複数メンバーに影響する。一方、user-level preferencesは個人の作業の癖に近い。便利だが、会社標準やセキュリティルールを置く場所ではない。

たとえば「このリポジトリではテストは`npm run test:unit`から始める」はrepository-level factとして意味がある。一方、「PR説明は日本語で短めに書いてほしい」はuser-level preferenceに近い。反対に「認証周りの変更では必ずセキュリティレビューを通す」は、Memoryに任せるより、リポジトリのREADME、CODEOWNERS、workflow、custom instructions、レビュー規程に置くべきだ。

## 分析: 便利な記憶より責任分界が論点になる

ここからは分析だ。

Copilot Memoryの価値は、毎回同じ背景説明をしなくてよくなることだ。リポジトリ固有の構成、テスト方法、PRの書き方、個人の説明好みを覚えれば、Copilot CLIやcloud agentの出力は安定しやすい。特に長いagent作業では、毎回プロンプトで前提を渡すより、Memoryが補助するほうが効率的だ。

しかし、企業利用では「覚えられると便利」だけでは判断できない。AIが覚えた情報は、どの範囲で使われ、誰が消せて、いつ古くなり、どの操作で保存されたのかを説明できる必要がある。今回の更新は、その説明に必要な部品を追加している。

リポジトリ単位のoff switchは、特に重要だ。プロダクトによっては、Memoryを使う価値が大きいリポジトリと、使わないほうが説明しやすいリポジトリがある。顧客固有の実装、規制業務、委託先が頻繁に出入りするコード、短命のPoC、秘密保持が厳しいプロジェクトでは、repository-level factsを残すこと自体を避けたい場合がある。

一方で、社内基盤、ライブラリ、テスト基盤、開発者ポータルのように、共通知識が多く、チーム横断で同じ慣習を共有したいリポジトリでは、Memoryが有効に働く可能性が高い。全社で一律にon/offを決めるより、リポジトリの性質で判断するほうが現実的だ。

## CLI管理は開発者体験と統制の接点になる

Copilot CLIの`/memory`コマンドは、個人開発者には単純な状態切り替えに見える。しかし企業では、CLI sessionごとの作業文脈をどう扱うかに関わる。

たとえば[Copilot CLI遠隔操作GA](/blog/github-copilot-cli-remote-control-ga-2026/)で見たように、CLI sessionは手元のterminalだけでなく、GitHub MobileやWebからも進捗確認や承認ができる方向へ広がっている。長時間作業、遠隔承認、session継続が増えるほど、Memoryが有効なのか無効なのか、どのrepository factsやuser preferencesが効くのかを開発者が確認できることは重要になる。

特に、委託先や複数organizationに所属する開発者では、Memoryの効き方が一様ではない。GitHub Docsでは、企業や組織管理のCopilotではCopilot Memoryは既定でoffで、enterpriseまたはorganization側の設定が関係すると説明している。また、複数organizationからCopilot subscriptionを受ける場合は、最も制限の強い設定が適用される。つまり、あるリポジトリではMemoryが効き、別のリポジトリでは効かないことがあり得る。

このとき、CLIで`/memory show`を見られることは、トラブルシュートにも使える。「昨日はCopilotがテスト方法を覚えていたのに、今日は覚えていない」という問い合わせは、モデル品質の問題とは限らない。組織ポリシー、リポジトリoff switch、CLI側の設定、user-level preferenceの有無が原因かもしれない。

## 日本企業が最初に決めること

日本の開発組織が今回の更新でまずやるべきことは、Memoryの機能一覧を社内展開することではない。まず、Memoryをどの情報管理レイヤーとして扱うかを決めることだ。

1つ目は、repository-level factsを許可するリポジトリの基準だ。社内基盤、OSSに近い公開可能なコード、標準化された業務システムでは許可しやすい。一方、顧客固有コード、機密アルゴリズム、個人情報処理、監査制約が強い領域では、off switchを標準にする選択肢もある。

2つ目は、削除責任者だ。repository-level factsはリポジトリ所有者が確認・削除できる。つまり、CODEOWNERSやリポジトリ管理者の運用にMemory棚卸しを入れるべきだ。user-level preferencesは本人が確認・削除するため、オンボーディング資料やFAQに「好みが間違って保存されたときの消し方」を入れる必要がある。

3つ目は、CLI利用時の説明だ。Copilot CLIを社内標準にしているチームでは、`/memory show`で状態確認、`/memory off`で一時的に無効化、`/memory on`で戻す手順を短いrunbookに入れる。特にセキュリティ調査、顧客環境の一時作業、障害対応では、Memoryを使うべきかどうかを作業開始時に確認する運用が必要だ。

4つ目は、他のCopilot管理面との役割分担だ。チーム共通の設計文脈はSpacesへ、組織別のモデル許可はmodel rulesへ、個人の作業好みはuser preferencesへ、リポジトリの実行慣習はrepository factsへ分ける。これを分けないと、便利な機能が増えるほど「どこに何を書けばよいか」が分からなくなる。

## まとめ

GitHub Copilot Memoryの5月26日更新は、Memoryを企業運用へ近づける管理強化だ。削除導線、リポジトリ単位のoff switch、Copilot CLIの`/memory`コマンド、保存時のスコープ表示が追加され、Memoryを単なる個人化機能ではなく、開発基盤の統制対象として扱いやすくなった。

日本企業にとっての論点は、Copilotが何を覚えられるかではなく、何を覚えさせ、どこでは止め、誰が消し、どの作業面で確認できるようにするかだ。CopilotがCLI、cloud agent、Spaces、モデルルールへ広がるほど、Memoryは便利機能ではなく、AIエージェントの文脈管理レイヤーとして設計する必要がある。

## 出典

- [Copilot Memory has more controls for deletion, scope, and the Copilot CLI](https://github.blog/changelog/2026-05-26-copilot-memory-has-more-controls-for-deletion-scope-and-the-copilot-cli/) - GitHub Changelog, 2026-05-26
- [Managing and curating Copilot Memory](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory) - GitHub Docs
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory) - GitHub Docs
