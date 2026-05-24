---
title: 'npm Staged Publishing、公開前検証を標準化'
description: 'npm Staged Publishingとinstall-time controlsを整理。日本の開発チームがnpm公開、CI/CD、AIエージェントの依存追加をどう制御すべきか解説する。'
pubDate: '2026-05-23'
category: 'news'
tags: ['GitHub', 'npm', 'サプライチェーンセキュリティ', 'セキュリティ', '開発者ツール', 'GitHub Actions']
series: 'github-npm-supply-chain-2026'
seriesTitle: 'GitHub npm供給網セキュリティ 2026'
draft: false
---

GitHub は **2026年5月22日**、npm 向けに **staged publishing** と新しい **install-time controls** を発表した。npm パッケージを公開する前に一度 staging 状態へ置き、検証してから公開へ進める導線と、利用者側が install 時に危険な挙動を抑えるための制御を強める更新だ。

これは地味に見えるが、日本の JavaScript / TypeScript 開発チームにはかなり重要なニュースである。近年の npm 供給網攻撃は、パッケージ公開、CI/CD、GitHub Actions、cache、短命 token、開発者端末のどこかを突いてくる。以前の [OpenAI TanStack対応、CI/CD防御を再点検](/blog/openai-tanstack-npm-supply-chain-2026/) で見たように、provenance や trusted publishing を使っていても、公開経路の前段が汚染されれば被害は起きる。

今回の npm 更新は、その弱点へ別角度から手を入れる。公開側には「即時に世界へ配る前に止める時間」を作り、利用側には「install した瞬間に何が実行されるか」を制御しやすくする。AI エージェントが依存追加や修正 PR を作る時代には、この二つの意味がさらに大きくなる。

## 事実: npm公開前にstagingを挟む

GitHub Changelog によると、staged publishing は npm package を公開前の staging 状態へ置く仕組みだ。開発者や maintainer は、公開前の成果物を検証し、必要な確認を終えてから一般公開へ進められる。npm CLI 側にも `npm stage` が用意され、通常の publish と同じように CLI から staging 操作を扱える。

ここで大事なのは、staged publishing が「セキュリティスキャンを全部自動で解決する機能」ではないことだ。むしろ、公開前に確認できる状態を作るための基盤である。成果物の内容、package metadata、provenance、署名、依存関係、CI 生成物、公開先 dist-tag を人間や自動検査が確認する余地を作る。

npm は JavaScript エコシステムの配布基盤であり、一度公開された package は世界中の CI、開発者端末、本番 build pipeline にすぐ届く。特に人気 package では、悪性 version が短時間公開されただけでも影響範囲が広がる。staging を挟めば、公開操作と世界配布の間に検証点を置ける。

もちろん、staging があるだけで安全になるわけではない。staging 中に何を確認するかを決めなければ、単なる待機場所になる。日本の開発チームが見るべきなのは、staged publishing をリリース承認、CI 検査、SCA、secret scanning、provenance 確認とどう接続するかだ。

## 事実: install-time controlsは利用者側の最後の防波堤

同じ発表では、新しい install-time controls も示された。npm install は package を取得するだけでなく、依存関係を展開し、場合によっては lifecycle scripts を実行する。供給網攻撃では、この install 時の処理が攻撃経路になることが多い。

install-time controls の実務上の価値は、利用者側が「どの挙動を許すか」をより明示的に扱える点にある。新しい package を追加する、AI エージェントが依存を入れる、CI が fresh install を走らせる、開発者がサンプル project を試す。こうした場面では、package の中身を完全に読む前に install が走りがちだ。

npm CLI の install documentation は、install 時に多くの設定が関係することを示している。scripts の扱い、dependency の種類、lockfile、workspace、cache、audit、package manager の挙動は、単なる速度調整ではなくセキュリティ境界にもなる。今回の install-time controls は、この境界をより明確に管理する流れとして読むべきだ。

ここは [GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) とつながる。GitHub 側では、AI エージェントが branch 上で依存関係を追加したとき、Dependabot toolset で既知脆弱性を確認できる方向へ進んでいる。npm 側で install 時の制御が強くなれば、エージェントが package を入れる入口と、GitHub が脆弱性を検査する入口を組み合わせやすくなる。

## 分析: 日本チームに効くのは「即時公開しない」運用

ここからは分析だ。

日本の開発組織で npm 供給網対策を考えるとき、最初に変えるべきは「publish したら終わり」という感覚である。OSS maintainer だけでなく、社内 package registry、design system、frontend platform、CLI tool、社内 SDK を持つ企業も同じだ。package は一度配られると、多数の repository と CI に波及する。

staged publishing を使うなら、公開前の確認項目を小さくてもよいので定義したほうがよい。たとえば、生成物に不要な credential や内部 file が入っていないか、package size が急増していないか、公開予定 version と changelog が一致しているか、provenance statement が期待どおりか、install script が増えていないかを見る。これだけでも事故の一部は止めやすくなる。

大企業や SIer では、社内 npm package が複数部門にまたがることがある。担当チームが深夜に publish し、翌朝に別チームの CI が自動で取り込む構成では、問題が起きたときの切り戻しが遅れる。staging を承認フローへ入れれば、公開タイミングと検証タイミングを分けられる。

スタートアップや小規模チームでも価値はある。人数が少ないほど、リリース作業は属人化しやすい。publish 前の staging check を GitHub Actions に寄せれば、「誰が publish しても同じ確認を通る」状態に近づく。これは過剰なエンタープライズ統制ではなく、少人数チームの事故防止として実用的だ。

## 分析: AIエージェントが依存を増やす時代の制御点

AI コーディングエージェントの普及で、npm install の意味は変わりつつある。人間が package を選ぶだけでなく、エージェントが issue を読み、実装に必要だと判断して依存関係を追加することがある。便利だが、依存追加はコード変更より見落とされやすい。

[GitHub DependabotのAIエージェント修復](/blog/github-dependabot-ai-agent-remediation-2026/) では、Dependabot alerts を AI エージェントへ割り当て、修復 PR を作らせる流れを扱った。これは脆弱な依存を直す方向の自動化だ。一方で、エージェントが新しい依存を追加する方向では、危険な package を入れない、install 時に危険な script を実行しない、lockfile 差分を人間が見られる形にする、という逆向きの統制が必要になる。

install-time controls は、その最後の手前に置く防波堤になる。AI が生成した PR の中に `package.json` や lockfile の変更が含まれるなら、CI では通常 install だけでなく、scripts 実行の可否、registry、provenance、audit 結果を分けて確認したい。特に外部 contributor や委託先、複数 agent が触る repository では、install を無条件に信用しない設計が必要だ。

この観点では、[GoogleとNICT・デジタル庁がAIサイバー防御を始動](/blog/google-nict-digital-agency-ai-cybersecurity-japan-2026/) で扱ったような SLSA や供給網防御の文脈ともつながる。AI を使った開発速度が上がるほど、成果物の来歴、依存追加の経路、CI で実行された script の説明責任が重くなる。

## 導入時に見るべき具体点

まず、npm publish の権限を棚卸しする。誰が package を公開できるのか、trusted publishing を使っているのか、GitHub Actions のどの workflow が publish 可能なのか、manual approval はあるのかを確認する。staged publishing を入れるなら、この棚卸しが前提になる。

次に、staging 中の検査を決める。package tarball の内容確認、provenance statement、license、secret scanning、dependency audit、build reproducibility、package size、dist-tag の確認を、どこまで自動化するかを決める。全部を一度に入れる必要はないが、「staging しただけ」で公開してしまう運用は避けたい。

3つ目は、install 時の既定値を決めることだ。CI で lifecycle scripts を許すのか、外部 PR では scripts を抑えるのか、lockfile 更新を必須にするのか、registry を固定するのか、社内 package allowlist を使うのか。npm install は開発体験の中心なので、厳しくしすぎると反発が出る。だからこそ、外部 PR、社内 branch、release workflow、本番 build で段階を分けるのが現実的だ。

4つ目は、AI エージェント向けのルールを文章で残すことだ。エージェントに依存追加を許す条件、追加した場合の説明、代替案、security check の実行、lockfile 差分の扱いを決める。これは単なるプロンプトの話ではなく、repository policy の一部である。

## まとめ

npm staged publishing と install-time controls は、派手な AI モデル更新ではない。しかし、日本の開発チームにとっては、AI 時代の JavaScript 供給網を現実的に守るための更新だ。

公開側では、package を即時に世界へ流さず、検証する時間を作る。利用側では、install 時にどの挙動を許すかを制御する。GitHub の Dependabot、MCP Server、npm provenance、GitHub Actions の publish workflow と組み合わせれば、依存関係を「便利だから入れる」から「説明可能に入れる」へ寄せられる。

今回の更新を、単に npm CLI の新機能として見るのはもったいない。日本企業は、社内 package、OSS 利用、AI エージェントによる依存追加、CI/CD の publish 権限を一つの供給網として見直すべきタイミングに来ている。

## 出典

- [Staged publishing and new install-time controls for npm](https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/) - GitHub Changelog, 2026-05-22
- [npm CLI documentation: npm stage](https://docs.npmjs.com/cli/v11/commands/npm-stage/) - npm Docs
- [npm CLI documentation: npm install](https://docs.npmjs.com/cli/v11/commands/npm-install/) - npm Docs
- [Generating provenance statements](https://docs.npmjs.com/generating-provenance-statements) - npm Docs
