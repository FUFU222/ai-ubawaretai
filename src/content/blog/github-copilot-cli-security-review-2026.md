---
title: 'Copilot CLI security review、PR前検査の実務'
description: 'GitHub Copilot CLI security review公開プレビューを整理。日本の開発チームがcommit前検査、CodeQL連携、権限、費用をどう設計すべきか解説する。'
pubDate: '2026-06-11'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', 'セキュリティ', '開発者ツール', '管理者設定', 'AIエージェント']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年6月10日**、GitHub Copilot CLI に **`/security-review`** slash command を追加したと発表した。公開プレビューの実験機能として、ローカルのコード変更に対して AI driven なセキュリティレビューを実行し、本番投入前に脆弱性候補を見つけるための機能だ。

これは「Copilot がもう一つレビューできるようになった」というだけではない。日本の開発チームでは、AI agent が書いた変更を pull request に出す前に、開発者本人がどこまで確認するかが曖昧になりやすい。すでに [GitHub第三者agent検証、AIコード安全運用の焦点](/blog/github-third-party-agent-security-validation-2026/) では、第三者 coding agent の成果物を GitHub 上でどう受け入れるかを扱った。今回の `/security-review` は、そのさらに手前、**commit前のローカル作業段階** に置ける検査線である。

同じ Copilot CLI でも、[GitHub Copilot CLI刷新、定期実行と音声入力の運用点](/blog/github-copilot-cli-scheduling-voice-rubber-duck-2026/) で見た rubber duck や prompt scheduling とは役割が違う。rubber duck は設計や実装方針への second opinion に近い。一方、`/security-review` は、injection、XSS、path traversal、弱い暗号、危険なデータ取扱いのような、セキュリティ観点を明示して差分を見る入口になる。

## 事実: /security-reviewは実験的な公開プレビュー

GitHub Changelog によると、`/security-review` は Copilot CLI から直接コード変更をセキュリティレビューするための slash command だ。結果には、severity と confidence を伴う高確度の finding、開発者がその場で適用しやすい提案、既存ワークフロー内で完結する focused review が含まれると説明されている。

対象として挙げられている脆弱性クラスは、injection flaws、cross-site scripting、insecure data handling、path traversal、weak cryptography などだ。つまり、仕様の妥当性を総合評価するというより、コード差分に現れやすい高影響のセキュリティ問題を見つけるための前段チェックと読むべきだ。

また、GitHub はこの scan が CodeQL、Dependabot、secret scanning、GitHub code scanning に依存しない Copilot-driven scan だと説明している。ここが重要である。`/security-review` は GitHub Advanced Security の代替ではない。むしろ、PR に到達する前の開発者端末で一度確認し、その後に CodeQL、secret scanning、dependency scanning、required checks、人間レビューへつなぐための軽い前処理と見るほうが実務に合う。

利用には experimental mode が必要だ。GitHub Docs の CLI command reference では、`/experimental` slash command や `--experimental` option により実験機能を有効化できることが示されている。したがって、日本企業が全社標準にするには早く、まず pilot repository や security champion のいるチームで試す段階だ。

## commit前に置けることが一番の違い

ここからは分析だ。

従来のセキュリティ確認は、PR 作成後に CI、CodeQL、secret scanning、Dependabot、レビュー担当者が見る流れになりやすい。この設計は標準化しやすい一方で、開発者から見ると「出した後に怒られる」体験になりがちだ。小さな修正でも、PR を作ってから初めて path traversal や認可抜けの指摘が返ると、手戻りが発生する。

`/security-review` の価値は、commit あるいは PR の前に同じ端末で確認できる点にある。たとえば、認証 middleware を触った、file upload の保存先を変えた、SQL query を組み立てた、Webhook payload を受ける、暗号化や token 保存を変更した、という作業では、PR を作る前に一度 `/security-review` を挟むだけで、明らかな高リスク差分を早く戻せる。

これは [GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) の論点ともつながる。MCP Server 側の secret scanning や dependency scanning は、AI agent が作業する前後の資材確認に効く。`/security-review` は、Copilot CLI の作業差分そのものをセキュリティ観点で見る。両者を重ねると、「秘密情報や依存関係の混入」と「実装差分に潜む脆弱性」を分けて扱える。

ただし、commit前検査に置けるからといって、開発者の任意実行だけに任せると効果は限定的だ。重要リポジトリでは、PR template に「`/security-review` 実行対象か」「実行した場合の主要 finding と対応」「実行しなかった理由」を書く欄を置くほうがよい。義務化しすぎると形骸化するため、対象変更を絞るのが現実的だ。

## CodeQLやsecret scanningとの責任分担

最も避けたい誤解は、`/security-review` が CodeQL や secret scanning を置き換えるというものだ。

CodeQL は、言語ごとの query とデータフロー解析に強い。secret scanning は、典型的な secret pattern や provider token の検出に強い。Dependabot や Advisory Database は、既知脆弱性を持つ依存関係に強い。これらは CI や GitHub 上の required check として、開発者個人の気分に左右されにくい形で運用できる。

一方、`/security-review` は Copilot CLI の文脈で、ローカル変更へすぐに問いかけられる。開発者が「この差分は本当に危なくないか」を早く見るには向いている。反面、実験機能であり、finding がないことは安全証明ではない。業務ロジックの誤解、権限境界、監査ログ、個人情報の扱い、利用規約上の禁止事項、顧客契約との整合は、依然として人間が判断する必要がある。

日本企業での責任分担は、次のように分けると分かりやすい。

まず、個人の作業中には `/security-review` を使い、明らかな高リスク変更を早く潰す。次に、PR では CodeQL、secret scanning、dependency scanning、test、lint、必要な manual review を通す。最後に、重要な認可、課金、個人情報、ログ、データ移行、インフラ権限に触れる変更は、security reviewer や domain owner を必須にする。

この順番なら、`/security-review` は「承認印」ではなく「手戻り削減のための前段検査」になる。監査で説明しやすいのは、AI の finding を信用したという記録ではなく、どの変更種別でどの検査を必須にしたかという基準である。

## 権限と実験機能の扱いを決める

Copilot CLI は terminal agent であり、ファイル変更や shell command 実行に近い場所で動く。GitHub Docs は、CLI が実行を提案する command、特にファイル変更や削除を伴う command には注意し、許可した command には利用者自身が責任を持つべきだと説明している。

この点は `/security-review` でも無視できない。security review 自体は検査目的でも、同じ session の中で修正提案を適用したり、追加コマンドを許可したりする可能性がある。`/allow-all` や `/yolo` のような permissive option を常用すると、セキュリティ確認のために開いた session が、逆に広い権限を持つ作業面になってしまう。GitHub Docs も、これらの option は isolated environment に限定すべきで、毎回自動適用する alias は避けるべきだとしている。

企業導入では、少なくとも3つのルールが必要だ。

1つ目は、`/security-review` を使う session でも、通常の tool permission を緩めないことだ。検査だけなら広い write 権限や URL access は不要な場面が多い。

2つ目は、experimental mode の利用範囲を記録することだ。全社標準にする前に、対象チーム、対象 repository、期間、評価項目を決める。発見率だけでなく、誤検知、見逃し、レビュー時間、AI Credits 消費、開発者の作業負荷を見る。

3つ目は、finding の扱いを決めることだ。high severity/high confidence は PR 前に修正する、判断に迷うものは security reviewer に渡す、採用しない場合は理由を PR に残す、といった基準がないと、AI の出力が属人的に扱われる。

## 費用とログも運用対象になる

`/security-review` は便利な前段検査だが、Copilot CLI の利用が増えれば GitHub Copilot の消費管理にも影響する。すでに [GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で整理したように、Chat、CLI、cloud agent、Spaces、Spark、third-party coding agents など、モデルを使う Copilot 機能は AI Credits の管理対象になる。

特に、security review は「安全のためなら毎回走らせたい」という圧力が生まれやすい。しかし、すべての小さな typo 修正や文言変更に走らせると、費用と開発者時間が増える。対象は、認証、認可、入力検証、外部通信、file I/O、暗号、secret、依存関係、CI/CD、データ保存、監査ログに触れる変更へ絞るのが現実的だ。

ログの扱いも確認が必要だ。Copilot CLI の session data や利用履歴は、企業ポリシー、個人アカウント、組織設定、同期設定によって扱いが変わる。セキュリティレビューの finding や prompt に、顧客名、脆弱性詳細、未公開仕様、秘密情報の断片を不用意に含めないよう、prompt の書き方も教育対象にする必要がある。

日本企業では、開発者向けに「security review の実行対象」「prompt に書いてよい情報」「finding の転記先」「PR での記録粒度」「AI Credits 予算」を1枚の運用メモにまとめるだけでも効果がある。機能を入れることより、どの判断を誰がするかを明確にするほうが重要だ。

## まとめ

GitHub Copilot CLI の `/security-review` は、AI agent 時代のセキュリティ確認を PR 後だけに置かないための更新だ。実験的な公開プレビューではあるが、ローカル差分に対して、injection、XSS、path traversal、弱い暗号、危険なデータ取扱いといった高影響の問題を早く見る入口になる。

日本の開発チームが見るべき焦点は、これを万能の安全保証として扱わないことだ。`/security-review` は commit 前の早期検査、CodeQL や secret scanning は標準化された PR/CI 検査、人間レビューは仕様・権限・データ・監査の判断、と役割を分けるべきである。

まずは重要変更に限定して pilot 運用を始め、実験機能、権限、ログ、費用、finding の扱いを記録する。そこで手戻り削減とレビュー品質の改善が確認できたら、PR template、repository instructions、security champion の運用へ組み込む。`/security-review` の価値は、AI が安全を保証することではなく、人間が危ない差分に早く気づくタイミングを前倒しすることにある。

## 出典

- [Dedicated security review command now available in Copilot CLI](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/) - GitHub Changelog, 2026-06-10
- [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) - GitHub Docs
- [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) - GitHub Docs
- [Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents) - GitHub Docs
