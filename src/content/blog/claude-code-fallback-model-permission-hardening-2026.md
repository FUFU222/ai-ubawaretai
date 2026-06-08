---
title: 'Claude Code fallbackModel、権限境界の実務'
description: 'Claude Code fallbackModelと権限硬化を整理。日本企業がモデル障害時の継続性、deny rule、cross-session messaging、監査境界をどう設計すべきか解説する。'
pubDate: '2026-06-08'
category: 'news'
tags: ['Anthropic', 'Claude', 'Claude Code', 'AIエージェント', '企業導入', 'ガバナンス', 'セキュリティ']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の Claude Code changelog で、2026年6月6日の `2.1.166` に **fallbackModel** と権限境界の硬化が入った。派手な新モデル発表ではない。しかし、Claude Code を日本企業の開発基盤へ入れるなら、かなり実務的な更新である。

直近では [Claude Code監査ラベル追加](/blog/claude-code-otel-agents-mcp-security-2026/) で、OTELラベル、MCP secret redaction、background agents の安定化を扱った。さらに [Claude Code workflowsの権限管理](/blog/claude-code-workflows-custom-roles-2026/) では、dynamic workflows を誰に許可するかを整理した。今回の `fallbackModel` は、その間にある論点だ。AIエージェントが長く動くほど、モデル障害、過負荷、権限ルール、別セッションからの指示をどう扱うかが運用上の差になる。

もう一つの接点は、[Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で見たモデル選択の問題である。Auto mode はモデル選択を動的にする。一方、fallbackModel は主モデルが使えない時の継続経路を設計する。どちらも便利だが、企業では「誰が、どの作業で、どのモデルへ切り替わったか」を説明できなければならない。

## 事実: 2.1.166で何が入ったか

まず事実を分ける。

Claude Code `2.1.166` の changelog は、`fallbackModel` setting を追加したと説明している。主モデルが overloaded または unavailable になった場合に、最大3つの fallback model を順番に試せる設定である。加えて、`--fallback-model` が interactive sessions にも適用されるようになった。

これは、長時間の開発タスクでは大きい。Claude Code は単発の質問だけでなく、調査、ファイル編集、テスト、再試行、background agents、workflows を扱う。途中で主モデルが不安定になった時に、すぐ失敗させるのか、代替モデルで一度続けるのかは、開発者体験とレビュー負荷の両方に影響する。

同じ更新では、deny rule の tool-name 位置に glob pattern support が追加された。たとえば全ツールを deny するような表現が可能になり、allow rules では非MCPの glob を拒否し、unknown tool names in deny rules は startup warning で知らせる構成になった。

さらに cross-session messaging も硬化された。別の Claude session から `SendMessage` で relayed されたメッセージは user authority を持たず、受信側は relayed permission requests を拒否し、auto mode でも block する。これは、セッション間の便利な連携を、承認権限の横流しにしないための重要な境界である。

## 事実: fallbackはモデル固定の反対ではない

Claude Code の model configuration docs は、モデル設定の優先順位、model aliases、availableModels、provider-specific model IDs、Bedrock / Vertex / Foundry / Claude Platform on AWS での model pinning を説明している。ここで重要なのは、企業管理者がモデルを固定する理由が「古い運用」ではないことだ。

モデル固定には、品質、費用、リージョン、監査、評価再現性の意味がある。特に日本企業では、開発者が同じタスクを投げても、部署、契約経路、クラウドアカウント、利用プランによって使えるモデルが変わることがある。モデルを pin しておけば、評価結果や費用見積もりを説明しやすい。

一方で、固定しすぎると可用性が落ちる。主モデルが過負荷や一時障害で使えない時、開発者の作業が止まる。fallbackModel は、この問題に対する継続策である。ただし、fallback を入れるなら、代替モデルでも許される作業と、代替モデルに落としてはいけない作業を分けるべきだ。

たとえば、ログ要約、テスト失敗の初期分類、ドキュメント修正、影響範囲の調査なら fallback を許しやすい。逆に、認証、決済、個人情報、DB migration、セキュリティ境界に触る修正では、モデルが切り替わったこと自体をレビュー上のシグナルにした方がよい。

[Claude Opus 4.1廃止の記事](/blog/anthropic-claude-opus-41-retirement-2026/) でも扱ったように、モデルIDは期限、提供経路、移行計画と結びつく。fallbackModel はモデル廃止対応の代わりではない。古いモデルを残して延命する仕組みではなく、承認済みモデルの中で一時障害時の継続経路を明示する設定として読むべきだ。

## 事実: deny ruleは最後の防波堤になる

Claude Code permissions docs は、permission rules と sandboxing を別の層として説明している。permissions は Claude Code がどの tool、file、domain へ触れるかを制御し、sandboxing は Bash command とその child process を OS レベルで制限する。両方を使うのが defense-in-depth になる。

Agent SDK の permissions docs でも、評価順序は明確だ。hooks、deny rules、permission mode、allow rules、canUseTool callback の順に判断される。重要なのは、deny rules が `bypassPermissions` mode でもブロックとして効くことだ。つまり、deny は「便利な許可モードを使う時ほど最後に残る境界」として扱うべきである。

2.1.166 の deny rule glob support は、この境界を広げる更新だ。全ツールを一旦 deny し、必要な MCP tool や file operation だけを別の経路で許す、といった厳しめの設計がしやすくなる。ただし、glob は強い表現なので、誤設定すると必要な作業まで止める。startup warning が出る unknown tool names は、無視せずに標準設定のレビュー対象にしたい。

日本企業では、Claude Code を個人の裁量に任せる段階から、部門配布へ移るときにこの差が出る。個人利用では「その場で聞かれたら許可する」でよいかもしれない。しかし企業利用では、禁止領域を先に明文化し、認証情報、顧客データ、本番設定、秘密鍵、社内チャット、決済、契約、監査ログに触る操作を deny 側へ置く必要がある。

## 分析: 可用性と統制は同時に設計する

ここからは分析だ。

fallbackModel は、開発者にとっては「止まりにくくなる」機能である。しかし管理者にとっては、「主モデルではないモデルで作業が続いた時にどう扱うか」という新しい監査項目でもある。

AIエージェントが本番に近いコードを編集する場合、モデル変更は単なる内部実装ではない。出力の粒度、失敗時の粘り方、コードレビューの観点、tool call の傾向が変わる可能性がある。特に長時間タスクでは、前半は主モデル、途中から fallback model という混在が起きるかもしれない。その時、レビュー担当者は「どこから切り替わったか」「切り替え後の差分はどこか」を見たい。

したがって、fallback は可用性対策として入れつつ、ログとレビューに残すべきだ。Claude Code の UI や transcript、OTEL、チームの運用ログで、fallback 発生を追えるようにする。難しければ、まずは fallback を低リスク作業に限定し、セキュリティ関連や本番変更では主モデル障害時に止める設計でもよい。

cross-session messaging の硬化も同じ考え方で見るべきだ。AIエージェントが複数セッションで動くと、セッション間の連携は便利になる。だが、別セッションから送られたメッセージが permission request として扱われると、承認主体が曖昧になる。2.1.166 が relayed permission requests を拒否する方向へ寄せたのは、長時間・多セッション運用の当然の安全策である。

## 実務: 導入前に決めること

第一に、fallback model の許可リストを決める。主モデルと同じ用途に使ってよいモデル、調査だけ許すモデル、使わないモデルを分ける。Bedrock、Vertex、Foundry、Claude Platform on AWS、Anthropic API をまたぐ場合は、提供経路ごとにモデルID、リージョン、費用、ログを確認する。

第二に、fallback が発生した時のレビュー基準を決める。たとえば、fallback 発生後に作られた差分は必ず人間が再レビューする、セキュリティ関連ファイルは追加レビュー対象にする、CI が通っても設計判断は主担当が確認する、といったルールである。

第三に、deny rule を「禁止リスト」として管理する。便利な allow list から始めるより、触ってはいけない場所を先に決めるほうが事故を減らしやすい。`.env`、秘密鍵、production config、顧客データ、契約書、監査ログ、支払い設定、本番DB migration などは、最初から deny 側で考える。

第四に、cross-session messaging の扱いを決める。複数の background agents や workflows を使うチームでは、別セッションからの指示がどこまで作業文脈として扱われ、どこから人間承認が必要かを明確にする。Claude Code 側が relayed permission requests を拒否しても、運用ルールが曖昧ならレビュー時に混乱する。

第五に、設定の配布方法を決める。個人の `settings.json` だけに頼るのか、managed settings や MDM、社内テンプレートで配布するのかで統制の強さが変わる。日本企業で部門展開するなら、少なくとも標準の fallback、deny、availableModels、remote control、workflow 設定はチーム単位で揃えたい。

## まとめ

Claude Code `2.1.166` の fallbackModel と権限硬化は、地味だが企業導入では重要な更新である。主モデルの障害時に作業を止めない仕組みと、deny rule、cross-session messaging の境界強化が同時に入ったことで、Claude Code は長時間・多セッションの開発運用へさらに寄った。

日本企業が見るべきポイントは、fallback を便利機能として無条件に使うことではない。どの作業なら代替モデルで続けてよいか、どの操作は deny で止めるか、別セッションからの指示をどう扱うか、ログとレビューでどう追うかを決めることだ。

AIエージェントの運用は、止まらないことだけを目標にすると危ない。止まらず、かつ後から説明できることが重要である。fallbackModel は、その両方を設計するための新しい設定として扱うべきだ。

## 出典

- [Claude Code changelog](https://code.claude.com/docs/en/changelog) - Anthropic, 2026-06-06
- [Model configuration](https://code.claude.com/docs/en/model-config) - Claude Code Docs
- [Configure permissions](https://code.claude.com/docs/en/permissions) - Claude Code Docs
- [Configure permissions](https://code.claude.com/docs/en/agent-sdk/permissions) - Claude Agent SDK Docs
