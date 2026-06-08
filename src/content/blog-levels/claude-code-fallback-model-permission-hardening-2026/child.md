---
article: 'claude-code-fallback-model-permission-hardening-2026'
level: 'child'
---

Claude Code `2.1.166` では、**fallbackModel** という設定が追加された。これは、いつものモデルが混雑したり使えなくなったりした時に、代わりのモデルを順番に試すための仕組みだ。AIエージェントに長い作業を任せるチームでは、途中で止まりにくくなる可能性がある。

ただし、これは「何でも自動で続けてよい」という意味ではない。日本企業で使うなら、代わりのモデルで続けてよい作業と、止めるべき作業を分ける必要がある。

## 何が変わったのか

Anthropic の Claude Code changelog では、2026年6月6日の `2.1.166` として、fallbackModel、deny rule の glob pattern、cross-session messaging の権限硬化が説明されている。

fallbackModel は、主に使うモデルが overloaded または unavailable の時に、最大3つの代替モデルを順番に試す設定だ。これにより、調査やドキュメント修正のような作業は続けやすくなる。

同じ更新では、deny rule も強くなった。deny rule は、Claude Code が使ってはいけない tool や触ってはいけない場所を止めるためのルールだ。glob pattern により、より広い禁止ルールをまとめて書きやすくなる。

さらに、別の Claude session から送られたメッセージは、人間本人の承認と同じ扱いにならないように硬化された。別セッション経由の permission request は拒否され、auto mode でも block される。

## なぜ企業で大事なのか

AIエージェントは、短い質問に答えるだけなら多少止まっても大きな問題になりにくい。しかし、コード調査、テスト修正、PR作成、長い workflows を任せると、途中で止まることが増える。fallbackModel は、この停止を減らすための仕組みだ。

一方で、モデルが変われば出力の癖も変わる可能性がある。たとえば、主モデルでは慎重だった修正が、代替モデルでは少し大きな変更になるかもしれない。だから、fallback が起きた後の差分は、いつもより丁寧に見るべきだ。

特に、認証、決済、個人情報、本番設定、DB migration、秘密鍵に関係する作業では、代替モデルで続けるより、人間に止めて確認させたほうが安全な場合がある。

## 最初に決めるルール

まず、どのモデルを fallback に入れるかを決める。使えるから入れるのではなく、品質、費用、提供経路、ログ、リージョンを見て選ぶ。

次に、fallback を許す作業を決める。ログ要約、テスト失敗の調査、ドキュメント修正、影響範囲の確認は許しやすい。セキュリティや本番変更は止める、という分け方が現実的だ。

deny rule では、触ってはいけない場所を先に決める。`.env`、秘密鍵、production config、顧客データ、契約書、本番DB、支払い設定などは、最初から禁止側に置く。

cross-session messaging も、便利だからといって承認を渡してよいわけではない。別のセッションから来た指示は作業メモとして扱い、実行許可は人間が出す、という考え方にしておくと分かりやすい。

## まとめ

Claude Code `2.1.166` の fallbackModel は、AIエージェントを止まりにくくする更新だ。同時に、deny rule と cross-session messaging の硬化は、勝手に危険な操作へ進ませないための更新でもある。

日本企業では、可用性だけを見ずに、権限、ログ、レビュー、費用を一緒に設計することが重要だ。止まらないことより、止まらずに後から説明できることを目標にしたい。

## 出典

- [Claude Code changelog](https://code.claude.com/docs/en/changelog) - Anthropic, 2026-06-06
- [Model configuration](https://code.claude.com/docs/en/model-config) - Claude Code Docs
- [Configure permissions](https://code.claude.com/docs/en/permissions) - Claude Code Docs
