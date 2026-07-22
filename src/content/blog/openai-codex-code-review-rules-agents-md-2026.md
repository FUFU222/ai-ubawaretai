---
title: 'Codex Code Review、AGENTS.md規約の実装点'
description: 'Codex Code ReviewのAGENTS.md規約を整理。日本の開発チームがAIレビューの対象、例外、CI分担、承認責任をどう設計し、GitHub PR運用へ安全に入れるか解説する。'
pubDate: '2026-07-22'
category: 'news'
tags: ['OpenAI', 'Codex', 'コードレビュー', 'AIエージェント', '開発者ツール', 'ガバナンス']
draft: false
series: 'openai-codex-enterprise-2026'
---

OpenAI は 2026年7月20日、**Codex Code Review が `AGENTS.md` に書いた custom repository rules を使える**と発表した。これは単なるプロンプト置き場の追加ではない。Pull Request のレビューで、互換性、データ境界、過去障害から生まれた注意点のような「人間 reviewer が毎回説明している規約」を、リポジトリ内の version-controlled file として Codex に読ませる更新である。

日本の開発チームにとって重要なのは、AIレビューの精度がモデルだけで決まらなくなる点だ。[OpenAI Codex Security](/blog/openai-codex-security-workflow-2026/) では、AIが脅威モデルや修正案を出すときのレビュー責任を扱った。今回の Code Review rules は、通常のPRレビューでも同じ問題を起こす。AIに「何を重大と見るか」を渡せる一方で、その規約を誰が書き、誰が承認し、どの変更に適用するかを決めないと、レビューAIの振る舞いそのものが統制対象になる。

## 事実: AGENTS.mdにCode Review Rulesを書く

OpenAI Developers の発表では、Codex Code Review が `AGENTS.md` の repository rules を使い、変更に関係するルールをレビュー指摘に反映できると説明している。例として挙げられているのは、既存API互換、顧客データをログに出さない境界、別サービスが依存しているwire nameの維持のような、テストやlintだけでは表現しにくい判断である。

OpenAI Learn の Codex GitHub連携ドキュメントでも、GitHub PRで Codex code review を使い、`@codex review` でレビューを依頼できること、automatic reviews を有効にできること、そして `AGENTS.md` に `## Code Review Rules` を置けることが整理されている。repository-wide rules はルートに置き、サービス固有の規約は対象コードに近い nested `AGENTS.md` に置く、という設計が示されている。

ここでのポイントは、AIレビュー規約を「全部入りの社内規程」にしないことだ。OpenAI の説明は、短く、scope が明確で、safe path まで書かれたルールを勧めている。つまり「セキュリティに注意」では弱い。「この種の識別子は外部連携面なので変更するなら後方互換イベントを追加する」のように、検出条件と安全な代替案をセットにするほうが、AIレビューの指摘として使いやすい。

## 事実: CIではなく、人間の暗黙知を補う場所

OpenAI は、formatting や lint のような機械的な検査は CI に残し、repository rules は reviewer が繰り返し説明している非自明な観点に使うべきだと位置付けている。これは現実的な線引きだ。AIレビューに Prettier の代わりをさせると、コメントが増えるだけで価値が薄い。逆に、互換性、ログ出力、課金計算、認可境界、データ保持のような領域では、過去の経緯を知らない contributor や coding agent が見落としやすい。

日本企業では、この「暗黙知の外部化」が特に効く。委託先、グループ会社、海外拠点、短期プロジェクトのメンバーが同じリポジトリへPRを出す場合、レビュー観点は人に属しがちだ。経験者が覚えている「このフィールド名は変えてはいけない」「このログには法人番号を出さない」「この処理は月末締めに影響する」を、AIが参照できる粒度で書けば、レビュー待ちの前段で指摘できる可能性がある。

一方で、rules は強制力そのものではない。OpenAI の docs も、Codex Code Review は tests、branch protections、required approvals の代替ではないと説明している。したがって導入時は、AIレビューを「追加の高信号レビュー」として扱い、人間 reviewer と CI の責任を消さない設計にするべきだ。

## 分析: GitHub CopilotのAGENTS.md対応とは重なるが同じではない

この話は、以前整理した [Copilot code reviewのAGENTS.md対応](/blog/github-copilot-code-review-agents-md-2026/) と重なる。どちらも、リポジトリ内の指示ファイルをAIレビューへ接続する動きである。ただし運用上は、GitHub Copilot側の設定、OpenAI Codex側の設定、既存の `.github/copilot-instructions.md`、path-specific instructions、社内レビュー規約が同時に存在し得る。

ここを混ぜると、AIレビューの品質がぶれる。たとえば `AGENTS.md` に「認可変更は必ずP1として指摘」と書き、別の Copilot instructions に「小さな変更ではコメントを抑制」と書いた場合、どちらのAIレビューでも一貫しない結果になりやすい。人間は文脈で折り合いをつけられるが、AIには明確なscopeと例外条件が必要になる。

OpenAI Codex の今回の更新は、[Codex Record & Replay](/blog/openai-codex-record-replay-skills-2026/) や [Codex役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/) と同じ流れにある。Codexが単発のコード生成ではなく、作業手順、レビュー、共有物、接続先を扱うようになるほど、自然言語の運用ルールもソースコードと同じく保守対象になる。

## 日本企業が最初に決めるべきこと

最初にやるべきことは、`AGENTS.md` を大きくすることではない。既存のレビュー規約を棚卸しし、AIに渡すと効果があるものと、CIや人間承認に残すものを分けることだ。

第一に、対象を絞る。認可、個人情報、課金、外部API互換、監査ログ、schema migration のように、見落とすと被害が大きいが、静的検査だけでは拾いにくい領域を選ぶ。UI文言の細かい好みや import order は CI や formatter に寄せたほうがよい。

第二に、owner を置く。`AGENTS.md` の Code Review Rules は、レビューAIの振る舞いを変える設定である。アプリコードと同じ承認で足りる場合もあるが、セキュリティや課金に関わる rules は、開発基盤、セキュリティ、プロダクト owner が見るべきだ。CODEOWNERS で対象ファイルを保護する運用も検討したい。

第三に、safe path を書く。禁止だけでは、AIレビューは「危ない」と言うだけになりやすい。代替イベントを追加する、匿名化済みIDだけをログに出す、既存APIを残して新APIを追加する、migration windowを分ける、というように、著者が次に取れる行動まで書く。

第四に、秘密情報を書かない。顧客名、内部URL、脆弱性詳細、credential、未公開案件を rules に入れると、AIレビューのcontextとして扱われる。必要なのは秘密そのものではなく、「顧客識別子をログへ出さない」「特定領域の変更はsecurity reviewer必須」のような行動ルールである。

## 導入ステップ

導入は小さく始めるのがよい。まず、過去3か月のレビューコメントから、人間が何度も説明している非自明な指摘を3つ選ぶ。次に、それぞれを `## Code Review Rules` の下に短く書き、対象ディレクトリに近い `AGENTS.md` へ置く。ルートに全社規約を詰め込むより、対象コードに近い場所へ置くほうが、不要な指摘を減らしやすい。

次に、代表PRで試す。1つは本当に指摘してほしい変更、1つは安全な例外、1つは無関係な変更にする。Codexが前者だけを拾い、後者2つで余計なコメントを出さないかを見る。ここでノイズが出るなら、ルールを消すか、scopeを狭める。AIレビューの導入で重要なのは「指摘数」ではなく、重大な見落としを減らし、レビュー待ち時間を増やさないことだ。

最後に、月次で見直す。ルールは古くなる。関数名、API名、運用フロー、担当チームが変われば、以前は重要だったチェックがノイズになる。AIレビューに使う規約は、開発標準書より更新頻度が高い運用資産として扱うべきだ。

## まとめ

Codex Code Review の `AGENTS.md` rules 対応は、PRレビューにチーム固有の判断を持ち込むための更新である。テストやlintでは拾えない互換性、データ境界、過去障害の再発防止を、短いルールとしてCodexに渡せる。

ただし、これはレビュー責任の自動化ではない。日本の開発チームは、AIレビュー規約を version-controlled policy として扱い、owner、scope、safe path、CIとの役割分担、人間承認の境界を先に決める必要がある。小さなルールを少数から始め、実際のPRでノイズと見落としを測ることが、導入の現実的な第一歩になる。

## 出典

- [Custom Code Review rules for Codex](https://developers.openai.com/blog/custom-code-review-rules-for-codex) - OpenAI Developers, 2026-07-20
- [Codex code review in GitHub](https://learn.chatgpt.com/docs/third-party/github) - OpenAI Learn
- [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) - OpenAI Learn
