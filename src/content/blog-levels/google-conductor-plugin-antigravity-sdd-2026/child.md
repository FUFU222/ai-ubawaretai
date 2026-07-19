---
article: 'google-conductor-plugin-antigravity-sdd-2026'
level: 'child'
---

Google は **Conductor Plugin** を発表しました。これは、AI コーディングエージェントに「まず仕様を作り、計画を立ててから実装する」という流れを持たせるための仕組みです。

ポイントは、Conductor が Gemini CLI だけの拡張ではなく、Antigravity CLI などでも使える plugin になったことです。Google の説明では、spec や plan を Markdown ファイルとして残しながら、AI と自然に会話して作業を進められるようになります。

## 何が変わったのか

これまで AI にコードを書かせると、作業の前提がチャットの中だけに残りがちでした。何を作るつもりだったのか、どの方針で実装したのか、途中で何を変更したのかが、あとから分かりにくくなります。

Conductor は、その前提をリポジトリの中に置こうとします。たとえば feature や bug fix ごとに track を作り、`spec.md` や `plan.md` を生成します。AI はその plan に沿って実装し、進捗も更新します。

これは [Gemini Code Assist の Antigravity 移行](/blog/google-antigravity-code-assist-migration-2026/) と関係があります。Google は開発者向けの AI 作業面を Antigravity に寄せています。Conductor Plugin は、その上で「作業の中身をどう残すか」を助けるものです。

## なぜ日本の開発チームに関係するのか

日本企業では、開発の判断理由をあとから説明する場面が多くあります。レビュー、監査、委託先との引き継ぎ、障害対応、仕様変更の確認などです。AI が作ったコードでも、人間のチームが責任を持って説明できなければなりません。

Conductor のように spec と plan が残ると、レビューしやすくなります。実装前に「この仕様でよいか」「この順序で進めてよいか」を確認できます。実装後も、差分が plan のどの task に対応するかを見やすくなります。

[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) は、AI エージェントを動かす実行環境の話でした。Conductor は、エージェントが動く前後に必要な仕様と計画の話です。どちらも、AI を単なるチャットではなく、継続する作業として扱うために重要です。

## 使う前に決めること

まず、誰が spec と plan を承認するかを決めます。小さな修正なら開発者だけでよいかもしれません。しかし、認証、課金、個人情報、顧客データ、インフラの変更では、実装前に人間が plan を確認するべきです。

次に、plugin を誰が管理するかを決めます。Conductor Plugin は便利ですが、AI エージェントの動き方を変える入口でもあります。勝手に plugin や hooks を追加できる状態にすると、社内ルールやセキュリティ確認から外れる可能性があります。

さらに、レビューと戻し方も決めます。Conductor には review や revert の考え方があります。AI が plan 通りに進めても、結果が正しいとは限りません。[Google Jules の評価記事](/blog/google-jules-proactive-coding-agent-eval-2026/) でも、AI エージェントは結果だけでなく判断理由を見る必要がありました。

## まとめ

Conductor Plugin は、AI にコードを書かせる前に、仕様と計画を残すための仕組みです。Antigravity CLI など複数のツールで使えるようになることで、AI 開発の作業状態を持ち運びやすくなります。

日本の開発チームは、まず小さな機能やバグ修正で試すのがよいです。spec、plan、review、revert が実際のレビューや引き継ぎに役立つかを確認します。大事なのは、AI が速く書くことだけではありません。チームが後から説明できる形で作業を残せるかです。

## 出典

- [Evolving Spec-Driven Development: Conductor Now Supports Antigravity](https://developers.googleblog.com/evolving-spec-driven-development-conductor-now-supports-antigravity/) - Google Developers Blog, 2026-07-16
- [gemini-cli-extensions/conductor](https://github.com/gemini-cli-extensions/conductor) - GitHub
- [Getting started with Spec Driven Development in Antigravity](https://codelabs.developers.google.com/codelabs/getting-started-with-spec-driven-development-in-antigravity) - Google Codelabs
