---
article: 'npm-staged-publishing-install-controls-2026'
level: 'expert'
---

GitHub の npm staged publishing と install-time controls は、npm エコシステムにおける信頼境界を「publish 後の検知」から「publish 前と install 時の制御」へ寄せる更新として読むべきだ。JavaScript 供給網攻撃の多くは、悪性 package が公開されてから気づくまでの短い時間、あるいは install 時に実行される lifecycle scripts のような境界を突いてくる。今回の更新は、その両方に対して、完全な自動防御ではなく、運用を設計できる面を増やしている。

この文脈は、以前の [OpenAI TanStack対応、CI/CD防御を再点検](/blog/openai-tanstack-npm-supply-chain-2026/) と連続している。TanStack 事件では、trusted publishing や provenance があるだけでは十分ではなく、GitHub Actions の `pull_request_target`、cache、短命 token、release workflow の信頼境界が問題になった。今回の npm staged publishing は、そうした publish 経路に「公開前に止まる地点」を作る。install-time controls は、利用者側の CI と開発者端末で「install した瞬間に何を許すか」を制御する。

また、[GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) で扱った Dependabot toolset とも相性がよい。AI エージェントが package を追加したとき、GitHub 側では既知脆弱性や secret を作業前後に確認し、npm 側では install 時の挙動を制御する。供給網防御は単一機能ではなく、agent workflow、package manager、CI/CD、registry の分担で作る段階に入っている。

## 事実: staged publishingは公開前の検証余地を作る

GitHub Changelog は、npm の staged publishing を 2026年5月22日に発表した。npm package をすぐ public registry へ完全公開するのではなく、staging 状態へ置き、検証後に公開できるようにする。npm CLI documentation には `npm stage` が用意され、CLI から staged package を扱う導線が示されている。

この仕組みの重要性は、成果物の確認が publish 後では遅いという点にある。npm package は tarball として配られ、利用者の install は `package.json` だけではなく、pack された file、generated artifact、lifecycle scripts、metadata、provenance、dist-tag に影響される。source repository が安全に見えても、公開された tarball が期待どおりとは限らない。

staging を挟むことで、maintainer は少なくとも次の確認を公開前に置ける。tarball の file list、unexpected binary、secret や internal path の混入、package size の異常、release note と version の一致、provenance statement、CI build artifact の由来、dist-tag の付け方、license file、generated code の差分である。これらはすべて、publish 後に気づいても被害範囲が広がりやすい。

ただし、staged publishing は検証内容そのものを自動定義しない。運用としては、staging 状態への移行、検査 job、承認、公開、失敗時の破棄を明確に設計する必要がある。ここを曖昧にすると、staging は単なる追加手順になり、セキュリティ価値は薄くなる。

## 事実: install-time controlsは消費側の信頼境界を明示する

npm install は、registry から package を取得するだけの操作ではない。dependency graph を解決し、lockfile と照合し、workspace を処理し、cache を使い、場合によっては lifecycle scripts を実行する。供給網攻撃では、開発者が「install するだけ」と考える瞬間が狙われる。

GitHub が同時に示した install-time controls は、利用側がこの挙動を制御しやすくする方向の更新だ。npm CLI の install documentation を見ると、install は多くの設定に依存する。scripts、audit、omit/include、workspace、registry、lockfile、cache、strict peer dependencies などが絡む。これらは開発体験の設定であると同時に、攻撃面の設定でもある。

企業利用では、同じ npm install でも信頼レベルが違う。外部 contributor の pull request で走る install、社内 branch の install、release workflow の install、本番 image build の install、開発者端末の install は同じではない。外部 PR では lifecycle scripts を抑え、release workflow では trusted publishing と provenance を確認し、開発者端末では新規 package の追加時に warning を出す、という段階分けが現実的になる。

この考え方は、[GitHub DependabotのAIエージェント修復](/blog/github-dependabot-ai-agent-remediation-2026/) の逆側にある。Dependabot alerts を AI エージェントへ渡すと、既存の脆弱な依存を直しやすくなる。一方で、依存を追加する入口が緩ければ、修正以上の速度で新しいリスクが入る。install-time controls は、依存追加の入口を絞るための材料になる。

## 分析: npm供給網防御はpublish側とconsume側を分けて設計する

ここからは分析だ。

npm 供給網を守るとき、publish 側と consume 側を混同すると設計が弱くなる。publish 側の目的は、正しい maintainer、正しい CI、正しい source、正しい artifact が package として出ることだ。consume 側の目的は、利用者の CI や端末が、危険な package、危険な version、危険な scripts、予期しない registry から守られることだ。

staged publishing は publish 側の制御である。package が registry へ完全公開される前に、artifact を検査し、承認し、必要なら止める。install-time controls は consume 側の制御である。package が入ってくるときに、何を実行し、何を拒否し、どの情報を確認するかを決める。どちらか片方だけでは足りない。

日本企業でよくある弱点は、社内 package の publish 権限が曖昧なことだ。frontend platform team、design system team、mobile web team、DX team がそれぞれ package を公開し、利用側の repository が semver range で取り込む。publish 時点で検査が弱いと、問題は複数 product に広がる。consume 側で lockfile を固定していても、更新 PR のタイミングで一気に露出する。

逆に consume 側だけを厳しくしすぎると、開発者は抜け道を探す。scripts を全面禁止すると一部 package は動かず、registry を過剰に固定すると検証環境が壊れる。したがって、信頼レベルごとの policy が必要だ。外部 PR、内部 PR、release branch、production build で install policy を分ける。publish 側では staged publishing と approval を入れる。これが現実的な落とし所になる。

## 分析: AIエージェント導入で依存追加の説明責任が重くなる

AI エージェントがコードを書くだけなら、レビュー対象は差分のロジックが中心だった。しかしエージェントが依存 package を追加するようになると、レビュー対象は package choice へ広がる。なぜその package が必要なのか。保守されているのか。ライセンスは合うのか。install scripts はあるのか。既知脆弱性はあるのか。transitive dependency は許容できるのか。これらはコード行数だけでは見えない。

エージェントが「便利そうだから」と package を入れる未来は、すでに現実に近い。issue を読む、既存コードを調べる、実装し、テストを直し、PR を作る。この流れの中で、依存追加は自然に起きる。人間が `npm install` を打ったときは多少の意識があるが、AI が lockfile を更新した PR では、reviewer が package 追加を見落とす可能性が高い。

だから、AI エージェント向けの repository policy では、依存追加時の説明を必須にしたほうがよい。追加 package、用途、代替案、license、security check、install scripts の有無、maintainer / popularity、lockfile diff の範囲を PR に書かせる。これはエージェントに過剰な自由を与えないためだけではなく、人間 reviewer が短時間で判断するための圧縮情報になる。

GitHub MCP Server の Dependabot toolset、secret scanning、npm install-time controls、CI の package audit を組み合わせると、AI が依存を追加した PR でも最初の検査は自動化できる。ただし、最終判断は人間が持つべきだ。package 選定には、脆弱性だけでなく、保守継続性、組織の標準、将来の migration cost が含まれる。

## 日本企業向けの実装モデル

実装モデルは、4層で考えると扱いやすい。

第1層は maintainer 権限だ。npm publish できる人と workflow を最小化し、trusted publishing を使える package では長寿命 token を減らす。GitHub Actions の release workflow では、外部 PR と release context の cache を混ぜない。これは [OpenAI TanStack対応](/blog/openai-tanstack-npm-supply-chain-2026/) の教訓そのものだ。

第2層は staged publishing だ。publish 操作後に staging 状態へ置き、tarball inspection、provenance check、secret scan、package size check、license check、generated artifact check を走らせる。大規模組織では CODEOWNERS に近い承認者を置き、小規模チームでは checklist を CI summary に出すだけでもよい。

第3層は install policy だ。外部 PR では scripts を制限し、registry を固定し、lockfile なしの install を拒否する。内部 branch では開発体験を保ちながら audit と provenance warning を出す。release workflow では再現性を優先し、fresh install と build artifact の由来を記録する。production build では network access と package source を絞る。

第4層は AI エージェント policy だ。エージェントに dependency install を許す場合、PR summary に package 追加理由、security check 結果、代替案、rollback 方法を書かせる。CI では、AI が作った PR だけを特別扱いするのではなく、依存追加がある PR すべてに同じ検査をかける。AI か人間かで分けるより、変更種別で分けるほうが運用しやすい。

## 見落としやすい落とし穴

1つ目は、staging を承認印だけにしてしまうことだ。承認者が tarball を見ず、CI summary も見ず、単に publish を押すなら意味は薄い。staged publishing の価値は、検証可能な artifact を置けることにある。

2つ目は、install-time controls を開発者端末だけに寄せることだ。攻撃の主戦場は CI でもある。特に release workflow、preview deployment、storybook build、documentation build のような周辺 CI は、production より管理が甘くなりやすい。

3つ目は、provenance を万能視することだ。provenance は「どこで作られたか」を説明するために重要だが、その workflow 自体が汚染されていれば安全とは言えない。provenance、SLSA、trusted publishing、staged publishing、install controls は重ねて使うべきで、互いの代替ではない。

4つ目は、AI エージェントの依存追加を通常レビューで吸収できると考えることだ。エージェントは短時間に複数ファイルを変え、テストも直し、もっともらしい説明を書く。reviewer はロジックに目を奪われ、package 追加を軽く見がちだ。依存追加は専用の review checklist を持つほうがよい。

## まとめ

npm staged publishing と install-time controls は、npm の公開と利用の両端に制御点を増やす更新である。publish 側では、package を即時に世界へ流す前に検証する。consume 側では、install 時にどの挙動を許すかを信頼レベルごとに決める。

日本企業にとって重要なのは、これを npm の単発機能としてではなく、AI エージェント時代の開発基盤統制として扱うことだ。Dependabot、GitHub MCP Server、GitHub Actions、npm provenance、staged publishing、install-time controls を一つの流れにすると、依存関係の追加、公開、修正、監査を説明しやすくなる。

AI で開発速度が上がるほど、供給網の小さな穴は広がりやすい。だからこそ、package を出す前に止めること、package を入れる前に制御することが、これからの JavaScript 開発では競争力の一部になる。

## 出典

- [Staged publishing and new install-time controls for npm](https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/) - GitHub Changelog, 2026-05-22
- [npm CLI documentation: npm stage](https://docs.npmjs.com/cli/v11/commands/npm-stage/) - npm Docs
- [npm CLI documentation: npm install](https://docs.npmjs.com/cli/v11/commands/npm-install/) - npm Docs
- [Generating provenance statements](https://docs.npmjs.com/generating-provenance-statements) - npm Docs
