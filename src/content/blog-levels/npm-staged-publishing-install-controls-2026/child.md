---
article: 'npm-staged-publishing-install-controls-2026'
level: 'child'
---

GitHub が npm に、**staged publishing** と **install-time controls** という新しい仕組みを追加しました。簡単に言うと、npm パッケージを公開する前にいったん確認できる状態へ置き、使う側も install 時の危険な動きを抑えやすくする更新です。

npm は JavaScript や TypeScript の世界でよく使われる package 配布の仕組みです。便利な反面、悪意ある package や乗っ取られた publish 経路があると、多くの開発者や CI に一気に広がります。

## staged publishingとは

staged publishing は、package をすぐに一般公開せず、staging 状態に置く仕組みです。公開前の package を確認してから、本当に公開するかを決められます。

たとえば、公開する tarball に不要な file が入っていないか、version が正しいか、生成物が期待どおりか、provenance があるかを確認できます。今までも手作業で近い確認はできましたが、npm の仕組みとして staging を挟めることに意味があります。

これは「自動で全部安全にしてくれる機能」ではありません。公開前に止まれる場所を作る機能です。何を確認するかは、チームが決める必要があります。

## install-time controlsとは

install-time controls は、npm install のときに起きる挙動を制御しやすくする考え方です。npm install は package を取ってくるだけではなく、場合によっては scripts を実行します。攻撃者はこの install 時の処理を悪用することがあります。

開発者が新しい library を試すとき、CI が依存関係を入れるとき、AI エージェントが package を追加するとき、install はかなり早い段階で走ります。だから、install 時に何を許すかを決めることは重要です。

## なぜAIエージェントと関係があるのか

最近の AI コーディングエージェントは、コードを書くだけではありません。実装に必要だと判断して、依存 package を追加することがあります。人間が選んだ package ならまだ背景を説明しやすいですが、AI が選んだ package はレビューで見落とされることがあります。

そのため、AI が依存関係を追加したときには、package 名、version、lockfile、install script、既知の脆弱性を確認する必要があります。npm 側の install-time controls と、GitHub の Dependabot や security scanning を組み合わせると、この確認をしやすくなります。

## 日本のチームではどう使うべきか

まず、社内 package や公開 package を持っているチームは、publish 前に何を確認するかを決めるとよいです。package の中身、version、changelog、provenance、secret の混入、依存関係の問題を確認できるだけでも効果があります。

次に、CI で npm install をどう走らせるかを見直します。外部 PR、社内 branch、release workflow、本番 build で同じ設定にする必要はありません。外部 PR ではより慎重にし、信頼できる release workflow では必要な scripts を許す、という分け方ができます。

最後に、AI エージェントへ依存追加を任せるときのルールを決めます。なぜその package が必要なのか、代替案はあるのか、どの security check を通したのかを PR に残すだけでも、レビューはかなりしやすくなります。

## まとめ

npm staged publishing と install-time controls は、開発速度を落とすための仕組みではありません。package を公開する前、package を install する前に、危ない変更を見つけるための仕組みです。

日本の開発チームは、AI エージェントの導入と合わせて、npm publish と npm install のルールを見直すべきです。速く作るだけでなく、安全に配ることが、これからの JavaScript 開発ではますます重要になります。

## 出典

- [Staged publishing and new install-time controls for npm](https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/) - GitHub Changelog, 2026-05-22
- [npm CLI documentation: npm stage](https://docs.npmjs.com/cli/v11/commands/npm-stage/) - npm Docs
- [npm CLI documentation: npm install](https://docs.npmjs.com/cli/v11/commands/npm-install/) - npm Docs
