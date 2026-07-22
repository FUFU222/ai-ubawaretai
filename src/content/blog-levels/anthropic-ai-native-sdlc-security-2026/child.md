---
article: 'anthropic-ai-native-sdlc-security-2026'
level: 'child'
---

Anthropic は 2026年7月21日、AI がたくさんコードを書く時代の開発とセキュリティについて説明する記事を公開しました。いちばん目立つ数字は、同社で merge されるコードの約80%を Claude が書いているという点です。

ただし、大事なのは「AI がすごく速くコードを書く」という話だけではありません。AI が速くコードを書けるなら、そのコードをどう安全に確認するか、誰が承認するか、あとで問題が起きたときにどう追跡するかがもっと重要になります。

## SDLCとは何か

SDLC は Software Development Lifecycle の略です。ソフトウェアを作る流れ全体のことです。たとえば、計画する、コードを書く、テストする、リリースする、運用中の問題を見る、次の改善につなげる、という一連の流れです。

これまでの開発では、人間がコードを書き、人間がレビューし、CI でテストしてからリリースする形が中心でした。AI コーディングが増えると、この流れが変わります。AI が短時間でたくさん作れるため、人間のレビューだけでは追いつきにくくなるからです。

Anthropic は、計画、コード生成、CI、デプロイ、監視、ガバナンスの各段階に、AI と自動チェックと人間の承認を組み合わせています。つまり、AI に任せっぱなしにするのではなく、流れ全体にチェックポイントを置いています。

## なぜレビューだけでは足りないのか

AI が1日に大量の変更を出せるようになると、「全部を人間が丁寧に読む」だけでは遅くなります。一方で、人間が見ないまま本番に出すのも危険です。

そこで必要になるのは、変更の種類ごとに確認方法を変えることです。社内ツールの小さな文言変更と、認可や課金に関わる変更は、同じ重さで扱うべきではありません。危ない変更には人間の承認を残し、低リスクな変更には自動テストや AI レビューを組み合わせます。

ここは [Claude CISOガイド](/blog/anthropic-ciso-agentic-ai-governance-2026/) の考え方ともつながります。AI を完全に安全にしてから使うのではなく、何を読めるか、何を実行できるか、失敗したときの影響範囲を決めて使う、という発想です。

## 会社で決めること

日本企業がまず決めるべきことは、AI が触ってよい範囲です。どのリポジトリで使ってよいのか、どのファイルは読んではいけないのか、外部ネットワークへ出てよいのか、どのコマンドを実行してよいのかを決めます。

次に、レビューの流れを決めます。たとえば、秘密情報の漏えいは secret scanning、型やテストは CI、認可や外部送信は AI reviewer と人間のレビュー、というように役割を分けます。

さらに、ログも必要です。AI がどのファイルを読み、どのコマンドを使い、どの PR にコメントし、誰が承認したのかを追えるようにします。これは [Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) で扱ったような実行境界の話とも関係します。

## まとめ

AI コーディングの本当の課題は、コードを速く書くことだけではありません。速く書かれたコードを、どう確認し、どう承認し、どう追跡するかです。

Anthropic の AI-native SDLC の話は、日本企業にとって、AI 開発を安全に広げるための参考になります。AI を使う範囲、レビュー方法、CI、ログ、承認者を先に決めることで、開発速度と安全性を両立しやすくなります。

## 出典

- [How Anthropic secures its AI-native software development lifecycle](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle) - Claude by Anthropic, 2026-07-21
- [Zero Trust for AI agents](https://claude.com/blog/zero-trust-for-ai-agents) - Claude by Anthropic, 2026-05-27
- [How Datadog built a universal machine tool for Claude Code](https://claude.com/blog/how-datadog-built-a-universal-machine-tool-for-claude-code) - Claude by Anthropic, 2026-07-21
