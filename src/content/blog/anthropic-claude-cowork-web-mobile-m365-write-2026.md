---
title: 'Claude Cowork拡張、M365書き込み権限の実務'
description: 'Claude CoworkのWeb/Mobile対応とMicrosoft 365書き込み権限を解説。日本企業が導入前に確認すべきEntra同意、権限分離、監査ログ、承認フローを整理する。'
pubDate: '2026-07-08'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIエージェント', 'Microsoft', '管理者設定', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は **2026年7月7日** の Claude Apps release notes で、Claude Cowork の web/mobile 対応と、Microsoft 365 connector の write tools を更新した。これは小さなアプリ更新に見えるが、日本企業にとっては「AIに情報を探させる」段階から「AIに業務データを操作させる」段階への移行である。

今回の焦点は2つある。1つ目は、Claude Cowork が desktop だけでなく web と mobile からも使えるようになり、remote session が beta として動くことだ。作業は Anthropic 側のサーバーで実行され、セッションやファイルは Claude アカウントに保存される。2つ目は、Microsoft 365 connector が検索だけでなく、メール下書き・送信、予定管理、OneDrive/SharePoint ファイル作成・更新まで広がることだ。

これは [PwCとAnthropicのClaude Code/Cowork展開](/blog/pwc-anthropic-claude-code-cowork-2026/) で見た大規模導入の実装面に近い。さらに [AnthropicとNECの戦略協業](/blog/anthropic-nec-ai-engineering-workforce-japan-2026/) のように、Claude Cowork を全社展開や業種別AIに組み込む場合、今回の更新は情シス、法務、セキュリティ、業務部門が見るべき前提を変える。

以下では、まず事実を整理し、その後で日本企業がどう権限設計を見直すべきかを分けて考える。

## 事実: Coworkはweb/mobileへ広がった

Anthropic の release notes によると、Claude Cowork は desktop に加えて web と mobile でも利用可能になった。ロールアウトは数週間かけて行われ、まず Max plan から始まり、ほかのプランにも広がる予定とされている。

重要なのは、単に入口が増えたことではない。Anthropic の Cowork 説明では、remote session は Anthropic のサーバー側で動き、セッションとファイルが Claude アカウントに紐づく。これにより、ラップトップを閉じても作業が続き、scheduled tasks も端末がオンラインでなくても動く。desktop、web、mobile の間で同じセッションとファイルを見られるため、AIエージェントの作業は個人端末に閉じにくくなる。

一方で、すべてがクラウドだけで完結するわけではない。ローカルファイル、ローカル connector、browser use、computer use のように利用者の端末に届く能力は、Claude Desktop app が開いていることや、利用者が接続したフォルダ・権限に依存する。web/mobile から見えるからといって、端末上の全情報へ無制限に触れるわけではない。

この設計は、企業導入では重要だ。AIエージェントが継続実行できるようになるほど、途中で誰が止めるのか、どの成果物を残すのか、どの端末やフォルダに接続できるのかを決める必要がある。[Claude containmentの記事](/blog/anthropic-claude-containment-agent-security-2026/) で扱った実行境界の問題が、非エンジニア業務にもそのまま入ってくる。

## 事実: Microsoft 365 connectorは書き込みへ進んだ

Microsoft 365 connector の更新はさらに実務的だ。これまでも Claude は SharePoint、OneDrive、Outlook、Teams などを検索・分析できた。今回の write tools では、管理者が有効化した場合に、Claude が利用者の代わりにメールを送る、下書きを作る、予定を作成・更新する、メールボックス設定を更新する、OneDrive と SharePoint にファイルを作成・更新する、といった操作が可能になる。

Anthropic の setup guide は、導入前に Microsoft Entra Global Administrator による consent が必要だと説明している。write tools を使うには、更新された permission set への再同意と、Claude 側の connector 設定での有効化が必要になる。既存の connector 利用企業では、write tools は既定でブロックされ、組織側が有効化する流れになる。

権限範囲も具体的だ。write tools を支える Microsoft Graph 権限には、`Mail.Send`、`Mail.ReadWrite`、`Calendars.ReadWrite`、`Files.ReadWrite.All`、`MailboxSettings.ReadWrite` が含まれる。つまり、これは「少し便利な検索」ではなく、Microsoft 365 テナント内の業務データを変更できる connector である。

制約もある。Teams は read-only のままで、Claude は Teams メッセージ投稿や Teams 設定変更はできない。メールには agent-initiated と分かる attribution header が付くが、ファイルやカレンダーの write には現時点で同じタグが付かないと説明されている。添付ファイル付きメールの送信・転送・下書きも対応外で、write tools にはユーザー別の上限がある。

## 分析: 日本企業は「検索AI」と「操作AI」を分けるべきだ

ここからは分析だ。

日本企業が今回の更新で最初に見るべきなのは、Claude の便利さではなく、操作権限の分類である。Microsoft 365 connector が read-only の時代は、主なリスクは情報の検索範囲、出力への機密混入、アクセスログだった。write tools を有効化すると、リスクはメール誤送信、予定変更、ファイル作成、ファイル更新、下書き削除、ルール変更に広がる。

これは、AIエージェントを業務システムの操作主体として扱う必要があるという意味だ。人間が Outlook や SharePoint でできることを、Claude がその人の権限で実行する。Microsoft 365 側の既存権限を継承する点は安全設計の土台になるが、それだけでは十分ではない。既存権限は人間が画面を見ながら操作する前提で設計されていることが多い。AI が同じ権限で自律的に作業するなら、別の承認・監査・教育が必要になる。

たとえば営業部門では、顧客への返信下書きは便利だが、送信まで許可するかは別問題である。人事部門では、面接日程の調整は有用だが、候補者情報や評価メモの扱いを細かく分ける必要がある。法務部門では、契約書の検索と要約は有用でも、SharePoint 上の正式版ファイル更新は厳しく制限すべき場合がある。[Claude金融エージェントの記事](/blog/anthropic-claude-finance-agents-2026/) で整理したように、規制業務では「AIが作れるか」より「誰が承認し、どの証跡を残すか」が本番導入の条件になる。

## 導入前に確認する5つの設計

1つ目は、Microsoft Entra consent の責任者だ。write tools は追加 permission set への同意が必要になる。情シスだけで機械的に承認するのではなく、セキュリティ、法務、内部監査、業務部門が、どの Graph scope を許すかを確認すべきだ。

2つ目は、read と write のロール分離である。全ユーザーに write tools を開放する必要はない。Team/Enterprise では custom roles による subset 有効化も使えるため、まずは限定部門、限定業務、限定ユーザーで開始するのが現実的だ。特に送信、予定変更、ファイル更新は、検索・要約とは別ロールにするほうがよい。

3つ目は、低リスク write action からの検証だ。Anthropic は、確認方法として「自分宛にメール下書きを作るが送信しない」といった低リスク操作を挙げている。日本企業でも、最初の検証は下書き作成、社内予定の仮作成、テストフォルダ内のファイル作成に限定し、顧客メールや正式文書更新へすぐ広げないほうがよい。

4つ目は、監査ログと表示上の識別である。メール送信には agent-initiated header が付く一方、ファイルやカレンダーには同等のタグがない。ここは実務上の差が大きい。監査担当は、Microsoft 365 audit log、Claude 側の管理ログ、社内ワークフローの承認履歴を突き合わせ、AI が関与した操作をどこまで再現できるかを確認する必要がある。

5つ目は、mobile からの確認・承認ルールだ。Cowork が web/mobile に広がると、移動中に AI の作業を確認し、返答し、方向修正できる。これは便利だが、誤承認も起きやすい。社外からのモバイル操作、条件付きアクセス、端末管理、通知文面、承認が必要な操作の閾値を決めておくべきだ。

## 日本企業への実務的な読み方

今回の更新は、Claude Cowork が「業務AIの作業場所」として広がっていることを示している。desktop だけなら、導入論点は端末、ローカルファイル、個人作業に寄りやすい。web/mobile と remote session が加わると、業務はデバイスをまたぎ、タスクはバックグラウンドで続き、成果物はアカウントに紐づく。

同時に、Microsoft 365 connector の write tools は、Claude を検索アシスタントから業務操作アシスタントへ近づける。日本企業の多くは Microsoft 365 を日常業務の基盤にしている。メール、予定、SharePoint、OneDrive を触れる AI は、導入効果が大きい一方で、事故時の説明責任も大きい。

そのため、導入判断は「Claude を使うか」ではなく、「どの操作を、誰の権限で、どの承認条件で許可するか」に置くべきだ。まずは read-only connector と Cowork の作業依頼を分け、次に write tools を低リスク操作へ限定し、最後に業務テンプレートと監査ログを整えた部門から広げる。これが現実的な順番である。

Anthropic の日本市場展開や大企業提携を見ていると、Claude Cowork は開発者向けの Claude Code と並ぶ業務エージェントの入口になりつつある。今回の web/mobile 化と Microsoft 365 write tools は、その入口を広げる一方で、権限設計を後回しにできない段階へ進めた更新だ。日本企業は、便利な新機能として試す前に、AIエージェントを Microsoft 365 の操作主体として棚卸しする必要がある。

## 出典

- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) - Anthropic, 2026-07-07
- [Use Claude Cowork on web, desktop, and mobile](https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile) - Anthropic, 2026-07-07
- [Set up the Microsoft 365 connector](https://support.claude.com/en/articles/12542951-set-up-the-microsoft-365-connector) - Anthropic, 2026-07-07
- [Connect to Microsoft 365](https://support.claude.com/en/articles/15183774-connect-to-microsoft-365) - Anthropic, 2026-07-07
