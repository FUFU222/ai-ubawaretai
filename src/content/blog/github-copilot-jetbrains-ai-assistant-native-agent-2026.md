---
title: 'Copilot×JetBrains AI、ネイティブ統合の導入判断'
description: 'GitHub CopilotがJetBrains AI Assistantのネイティブ統合エージェントになった更新を解説。日本のJava・Kotlin開発組織が、OAuth、別契約、モデル選択、推論深度、ACP構成からの標準化をどう判断するか整理する。'
pubDate: '2026-07-01'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'JetBrains', 'AIコーディング', '開発者ツール', '企業導入', '管理者設定']
series: 'github-copilot-2026'
draft: false
---

GitHub と JetBrains は2026年6月30日、**GitHub Copilot AgentをJetBrains AI Assistantのagent pickerから直接選べるネイティブ統合**を発表した。従来もAgent Client Protocol（ACP）経由でCopilotをAI Assistantへ接続できたが、今回の更新では手動のACP設定をせず、IDE内の標準的な選択肢としてCopilotを起動できる。

日本のJava・Kotlin開発チームにとって、これは単なるメニュー追加ではない。GitHubアカウントによるOAuth、JetBrains AIとは別のCopilot契約、モデルと推論深度の選択、既存ACP構成の整理を同時に判断する更新だ。

これまで本サイトでは、[JetBrains版CopilotのClaude providerとagent配布](/blog/github-copilot-jetbrains-claude-provider-2026/)、[inline agent modeと自動承認の権限設計](/blog/github-copilot-jetbrains-inline-agent-mode-2026/)、[Copilot CLIの遠隔操作](/blog/github-copilot-cli-remote-control-ga-2026/)を個別に扱ってきた。今回のネイティブ統合は、それらの機能をJetBrains AI Assistantという共通の入口からどう運用するかという次の段階に当たる。

## 事実: CopilotがAI Assistantの標準agent pickerに入った

GitHub Changelogによると、利用者はJetBrains IDEのAI Chatを開き、agent pickerからGitHub Copilotを選べる。Copilotはプロジェクトを調べ、複数段階の作業を考え、変更を提案し、コマンドを実行しながら反復できる。対応モデルを選び、AI Chat内で推論深度も調整できる。

JetBrains側の発表は、従来のACP Registry経由との違いをさらに明確にしている。Copilotは以前からACPで接続できたが、ネイティブ統合ではACPの追加設定が不要になり、既定で利用可能な選択肢として提供される。JetBrainsは、共同でテストした、より安定した体験として説明している。

ただし、ACPそのものが廃止されたわけではない。JetBrains AI Assistantは引き続き外部のACP対応agentを接続できる。今回変わったのは、Copilotを使うためにACPを個別導入する必要がなくなったことである。社内で他のACP agentも使っている場合、Copilotだけをネイティブへ移し、その他はACPのまま残す構成も成立する。

またGitHubは、今後の予定としてNext Edit Suggestions、skills、ツール横断のオーケストレーション強化を挙げている。これらは将来計画であり、今回すべてが利用可能になったという意味ではない。現時点の確定事項とロードマップを分けて読む必要がある。

## 事実: 認証と契約はJetBrains AIに統合されない

導入時に最も誤解しやすいのが契約である。JetBrainsの公式ブログは、Copilotが**GitHubアカウントのOAuthだけで認証される**と説明している。さらに、JetBrains AIの利用者であっても、有効なGitHub Copilot契約が別途必要であり、JetBrains AI契約には含まれない。

つまり「AI Assistantの画面にCopilotが出る」ことと、「既存のJetBrains AI契約だけで使える」ことは別だ。企業では、JetBrainsライセンスの割り当てとGitHub Copilot seatの割り当てを照合しなければならない。退職・異動・委託終了時も、JetBrains側だけでなくGitHub側のseatとOAuth認可を確認する必要がある。

モデル選択も同様だ。GitHubの発表では、AI Chat内で対応するCopilotモデルを選び、推論深度を調整できる。これは速度、回答の深さ、利用コストのバランスを利用者が変えられることを意味する。一方、どのモデルが契約や管理者ポリシーで許可されるか、利用量がどう計上されるかはGitHub Copilot側の条件に従う。JetBrainsの画面から選べるからといって、費用管理までJetBrainsへ移るわけではない。

## 分析: 本当の価値はagent入口の標準化にある

ここからは分析である。

ネイティブ統合の価値は、Copilotの能力が突然変わったことより、導入経路が標準化されたことにある。従来のACP構成では、利用者または開発基盤チームがagentを追加し、ランタイムや設定を管理し、接続状態を確認する必要があった。ネイティブ統合では、その設定負担が小さくなる。

この差は、大規模なJava・Kotlin組織ほど効く。IntelliJ IDEA、PyCharm、WebStorm、GoLand、Riderなど複数のJetBrains IDEを使う会社では、ACP設定の手順書、端末差、プロキシ差、プラグイン版差を支えるだけでも運用コストが出る。標準agent pickerへ寄せられれば、利用開始手順と問い合わせ経路を簡素化しやすい。

一方で、入口が簡単になるほど、利用統制は意識的に設計する必要がある。開発者がモデルと推論深度を自由に選べると、同じタスクでも速度と消費量がばらつく。さらに、agentはコード提案だけでなく、複数ファイルの編集やコマンド実行を伴う。チャットUIが共通になっても、権限、料金、監査、データ送信先まで共通になるわけではない。

したがって、企業の標準化は「画面を一つにする」だけでは不十分だ。認証元、契約元、モデル許可、実行権限、ログ確認先を対応表にする必要がある。

## 日本企業が先に決めるべき4項目

1つ目は、**seatの正本**である。GitHub Copilotの利用者一覧を正本とし、JetBrains IDE利用者との照合頻度を決める。AI Assistant上に選択肢が見えてもseatがなければ使えないため、オンボーディング時の混乱を避けるには申請経路を一本化した方がよい。

2つ目は、**OAuthの扱い**である。会社管理のGitHubアカウントを使うのか、Enterprise Managed Usersのような管理方式を使うのか、個人アカウントでの業務利用を許すのかを明記する。端末交換や異動時の再認証、認可取り消しも手順に含める。

3つ目は、**モデルと推論深度の標準**である。軽い説明、局所的な修正、複数ファイル変更、難しい調査を同じ設定で処理する必要はない。たとえば通常作業は標準モデル・中程度の推論、高難度の設計や不具合調査だけ上位設定を許すといった用途表を作る。費用だけでなく、応答時間とレビュー負荷も測る。

4つ目は、**旧ACP構成の出口**である。すでにCopilotをACP Registryから導入しているなら、二重表示や二重認証を避けるため、対象IDE、設定ファイル、社内手順を棚卸しする。ただし、他のACP agentまで一括削除する必要はない。Copilot固有の構成と共通ACP基盤を切り分けて移すべきだ。

## 移行は小さな比較テストから始める

実務では、まず5〜10人程度のJetBrains利用者で比較する。既存ACP経由とネイティブ統合で、ログイン所要時間、接続失敗、モデル選択、コマンド実行、変更レビュー、問い合わせ件数を記録する。性能評価だけでなく、設定と運用の差を見るのが目的だ。

次に、同じ種類のタスクを3段階で試す。第1段階はコード説明やテスト案の作成、第2段階は限定されたファイル修正、第3段階はコマンド実行を伴う複数ファイル変更とする。各段階で、タスク完了率、レビュー差し戻し、意図しない変更、所要時間、Copilot利用量を確認する。

移行が妥当なら、社内標準手順をネイティブ統合へ更新する。ACP版の手順は即日削除せず、対象IDEやプラグイン版でネイティブ統合が使えない場合の復旧経路として期限付きで残す。終了日と担当者を決め、二つの標準が恒久化しないようにする。

最後に、JetBrains AIとCopilotの責任分界を利用者へ示す。「同じAI Chat内にある」ために契約やデータ処理まで一体だと誤解されやすい。認証はGitHub OAuth、Copilot seatは別契約、モデル・利用量はCopilot側、IDEとAI ChatはJetBrains側、という線をオンボーディング資料に明記するのが安全だ。

## まとめ

2026年6月30日の更新で、GitHub CopilotはJetBrains AI Assistantのagent pickerから直接選べるネイティブ統合エージェントになった。ACPの個別設定が不要になり、モデルと推論深度をAI Chat内で選び、複数段階のコーディング作業を任せられる。一方、認証はGitHub OAuthで、GitHub Copilot契約はJetBrains AIとは別に必要だ。

日本の開発組織が見るべきなのは、便利な入口だけではない。seat、OAuth、モデル、推論深度、実行権限、既存ACP構成を一つの移行表にまとめることが重要である。小規模な比較テストで運用差を測り、Copilotだけをネイティブへ移し、他のACP agentとは分けて管理する。この順なら、設定負担を減らしながら統制を失わずに導入できる。

## 出典

- [Copilot Agent is now available in JetBrains AI Assistant](https://github.blog/changelog/2026-06-30-copilot-agent-is-now-available-in-jetbrains-ai-assistant/) - GitHub Changelog, 2026-06-30
- [GitHub Copilot now an Integrated Agent in JetBrains IDEs](https://blog.jetbrains.com/ai/2026/06/github-copilot-now-an-integrated-agent/) - The JetBrains Blog, 2026-06
- [About AI Assistant](https://www.jetbrains.com/help/ai-assistant/about-ai-assistant.html) - JetBrains AI Assistant Documentation
