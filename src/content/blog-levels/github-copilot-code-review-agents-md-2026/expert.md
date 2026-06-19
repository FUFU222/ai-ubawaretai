---
article: 'github-copilot-code-review-agents-md-2026'
level: 'expert'
---

GitHub の **2026年6月18日**の Copilot code review 更新は、AI レビューの instruction architecture を一段変えるものだ。Changelog で示された中心は、Copilot code review が repository root の `AGENTS.md` を読み、関連する instructions を review feedback に使うようになった点である。加えて、draft pull request で Copilot に review request しやすくなり、PR timeline 上の Copilot review event が折りたたまれる。

この更新は、単なる Markdown ファイル対応ではない。GitHub Copilot の agentic 機能では、cloud agent、CLI、code review、MCP、agent skills、custom instructions が同じ repository context を共有し始めている。`AGENTS.md` が Copilot code review に入ることで、レビューAIへの期待値を、リポジトリで version control される作業規約として扱いやすくなる。

この流れは既存記事ともつながる。[Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/) では runner、content exclusion、custom instructions の管理を扱った。[Copilot code review一括修正、PR運用の設計論点](/blog/github-copilot-code-review-batch-fix-agent-2026/) では、review comment から cloud agent に修正を渡す流れを整理した。[Copilot cloud agent自動実行](/blog/github-copilot-cloud-agent-automations-2026/) では agent が repository event や schedule で動く運用を見た。今回の更新は、それらの機能を支える「AIに何を前提として読ませるか」の問題である。

## Fact: Copilot code review now reads root AGENTS.md

GitHub Changelog は、Copilot code review が repository-level `AGENTS.md` files を support し、root に置いた `AGENTS.md` から relevant instructions を使うと説明している。すでに repository に `AGENTS.md` がある場合、Copilot code review は workflow の一部としてその context を自動的に使う。発表では、これにより repository conventions and expectations を反映した review feedback を得やすくなると位置付けられている。

この説明から読み取れる事実は3つある。

第一に、対象は root の `AGENTS.md` である。GitHub Docs の repository custom instructions では、agent instructions として repository 内の `AGENTS.md` を使う考え方が示され、nearest `AGENTS.md` が優先されるという agent 文脈の説明もある。ただし、今回の Changelog が Copilot code review について明示しているのは root file の利用であり、すべての nested `AGENTS.md` が review で同じように扱われるとまでは読まないほうがよい。

第二に、これは既存の `.github/copilot-instructions.md` を置き換える話ではない。GitHub Docs は、Copilot on GitHub の repository custom instructions として、repository-wide instructions を `.github/copilot-instructions.md` に、path-specific instructions を `.github/instructions/**/*.instructions.md` に置く方法を説明している。Copilot code review の customizing section も、custom instructions を使って review を調整できると説明している。

第三に、複数の instructions が同時に適用され得る。Docs は、repository-wide と path-specific instructions が一緒に使われる場合があること、複数種類の instructions が request に適用され得ること、矛盾は避けるべきことを示している。したがって、`AGENTS.md` 対応は「ここに全部書けば終わり」ではなく、instruction set 全体の設計問題である。

## Fact: draft PR review and timeline noise also changed

同じ Changelog では、draft PR での review request UI も更新された。GitHub は、draft pull request で Copilot code review を依頼する workflow は既に可能だったが、今回から reviewer picker で Copilot の横に Request button が表示され、検索せずに依頼しやすくなると説明している。

この変更は、PR lifecycle の早い段階で AI review を挟む流れを強める。Draft PR は、人間 reviewer に正式に依頼する前の作業場として使われることが多い。そこで Copilot code review を呼び、明らかなテスト不足、命名の乱れ、仕様漏れ、セキュリティ観点の初期指摘を得られれば、人間 reviewer の負荷を下げられる。

ただし、GitHub Docs は Copilot review が comment review であり、approve や request changes ではないことも説明している。つまり、required approval を置き換えるものではない。Draft PR での AI review は、人間 review の代替ではなく、レビュー前処理として設計するのが妥当である。

Timeline 折りたたみも地味だが重要だ。AI review を常用すると、PR の Conversation tab に Copilot event が増える。人間 reviewer は、重要な設計コメント、CI failure、security discussion、product decision を見落としたくない。GitHub が Copilot review events をまとめる方向へ動いているのは、AI review が PR 上の情報量を増やす問題を認識しているからだと読める。

## Analysis: AGENTS.md makes review policy version-controlled

ここからは分析だ。

`AGENTS.md` の価値は、レビューAIの前提を repository 内の version-controlled file にできることだ。GitHub settings に隠れた設定ではなく、PR で変更され、CODEOWNERS で review され、履歴に残る。日本企業の開発基盤では、この性質が重要である。

多くの組織では、レビュー規約が複数の場所に散っている。社内 Wiki にはセキュリティチェックリスト、README にはテストコマンド、Confluence には設計原則、Slack pin にはレビュー時の暗黙ルール、委託先向け資料には禁止事項がある。AI review は、こうした暗黙知を自動では拾えない。`AGENTS.md` に最小限の review policy を集約することで、AI と人間の両方が同じ入口を見られる。

ただし、`AGENTS.md` に長い規約を丸ごと貼るのは避けるべきだ。GitHub Docs の code review customization tutorial は、effective custom instructions について、まず小さく始めて、実際の PR で効き方を観察し、反復することを勧めている。AI review への instruction は、人間が読む規程と同じ粒度ではなく、review comment に変換しやすい粒度で書く必要がある。

実務では、root `AGENTS.md` を次のように使うとよい。

- repository の目的、主要言語、主要 framework
- 必ず実行する test / build / lint
- 禁止する操作、触ってはいけない file、secret の扱い
- review comment の重大度方針
- auth、billing、privacy、data export、admin permission など重大領域の escalation
- human reviewer が必ず見る領域

一方、詳細な path 別観点は `.github/instructions/**/*.instructions.md` に分ける。たとえば `src/auth/**`、`src/billing/**`、`src/mobile/**`、`migrations/**`、`docs/**` は別の review rubric を持つ。Root `AGENTS.md` は全体方針、path-specific instructions は局所規約、skills は特定 task の手順、という分担が自然である。

## Analysis: instruction conflicts become operational debt

`AGENTS.md` 対応で一番怖いのは、instructions の矛盾が見えにくくなることだ。AI review のコメントがぶれると、人は「モデルが悪い」と考えがちだ。しかし実際には、`AGENTS.md`、`.github/copilot-instructions.md`、path-specific instructions、MCP context、PR description が矛盾した signal を出している場合がある。

たとえば root `AGENTS.md` に「UI copy 変更でも必ず snapshot test を更新する」と書き、path-specific instructions に「copy-only changes should not require tests」と書けば、Copilot code review は一貫しにくい。Security checklist に「外部API呼び出しは必ず retry」と書き、service guideline に「payment request は二重決済防止のため retry 禁止」と書けば、重大領域で誤った一般論を出す可能性がある。

このため、instructions はコードと同じく review 対象にする必要がある。特に、AI review に影響する file 変更は、開発基盤、セキュリティ、品質保証の owner が見るべきである。`AGENTS.md` 変更を誰でも merge できる状態にすると、レビューAIの振る舞いを誰でも変えられることになる。

日本企業では、委託先やグループ会社が同じ repository に PR を出すことも多い。この場合、`AGENTS.md` は社外協力者にも見える前提で書く必要がある。秘密情報、内部URL、顧客名、未公開仕様、監査上の弱点は書かない。書くべきなのは、秘密そのものではなく、「秘密情報に触れる差分では human reviewer を必須にする」「顧客別 config はAIに貼らない」「sample data は匿名化済みだけ使う」といった行動ルールである。

## Analysis: base branch behavior matters for rollout

Copilot code review の rollout では、base branch の扱いも重要になる。GitHub Docs は、Copilot code review が pull request を review するとき、base branch の custom instructions を使う例を示している。これは、instructions の導入順序に影響する。

たとえば、feature branch 上で `AGENTS.md` を追加し、その同じ PR で Copilot review の品質を評価しようとすると、期待した instructions がまだ効かない可能性がある。AI review 規約を変えるなら、まず `AGENTS.md` や custom instructions の導入 PR を main に入れ、その後の PR で効果を見るほうが筋がよい。

また、長期ブランチや release branch を持つ組織では、branch ごとに instructions がずれる。Main branch は新しい review policy、release branch は古い review policy という状態が起きる。これは必ずしも悪いことではないが、AI review のコメント差を説明できる必要がある。Release branch では保守性より安定性、main では設計改善を重視する、といった方針差があるなら、branch policy と instructions を対応させる。

## Analysis: MCP and skills make instructions more powerful and riskier

GitHub Docs は、Copilot code review が repository に configured された MCP servers や agent skills を、関連する場合に使えると説明している。Support は public preview とされ、GitHub MCP server と Playwright MCP server が default enabled とされる説明もある。さらに、custom instructions が specific MCP context の利用を明示すると、Copilot code review がその context を使いやすくなる。

これは `AGENTS.md` の意味を強める。単に「この観点でレビューして」と書くだけでなく、「この issue key を参照」「この design doc を見る」「この Playwright context を使う」といった外部 context への橋渡しが可能になるからだ。

一方で、リスクも増える。Review AI が MCP 経由で何を読めるか、どの tool を呼べるか、session logs に何が残るかを確認しなければならない。Repository settings では、MCP tools を Copilot code review に使わせるかを調整できる。Cloud agent には許すが code review には使わせない、という分離が必要な組織もある。

日本企業では、Jira、Confluence、ServiceNow、Notion、社内 service catalog などを MCP 経由でつなぎたくなる。しかし PR review は多くの人が触る入口であり、外部 context の取り扱いも広がりやすい。`AGENTS.md` に「必要なら社内文書を見る」と書く前に、どの MCP server が repository に設定され、誰が管理し、session log で確認できるかを先に決めるべきだ。

## Operations checklist for Japanese teams

第一に、instruction inventory を作る。Root `AGENTS.md`、`.github/copilot-instructions.md`、path-specific instructions、`.github/skills`、README、社内レビュー規約を一覧化し、owner と用途を決める。

第二に、role split を決める。Root `AGENTS.md` は repository の全体方針、Copilot instructions は Copilot-specific behavior、path-specific instructions は領域別 review rubric、skills は特定 task の手順、MCP settings は外部 context の接続として分ける。

第三に、instructions の変更を CODEOWNERS で保護する。AI review の振る舞いを変えるファイルは、開発基盤や security owner の review を要求する。特に auth、billing、privacy、compliance の規約は、通常のアプリコードと同じかそれ以上に慎重に扱う。

第四に、draft PR review の位置付けを決める。Draft PR で Copilot review を使うなら、人間 review 前の一次点検と定義し、required approval を置き換えないことを明記する。AI comment を修正に使う場合は、[Copilot code review一括修正](/blog/github-copilot-code-review-batch-fix-agent-2026/) で扱ったように、cloud agent が作る追加 PR や branch の扱いも決める。

第五に、MCP と agent skills の利用を audit する。Copilot code review に MCP tools を許す repository、禁止する repository、session logs を確認する責任者を分ける。PR description に issue key や incident ID を書くと外部 context を引きやすくなるため、どの情報を載せてよいかも決める。

第六に、効果測定を行う。GitHub Docs の tutorial が勧めるように、小さな instruction set から始め、実際の PR で Copilot がどの指示を守ったか、どの指示を誤解したかを観察する。AI review の採用率、人間 reviewer の再指摘、false positive、コメント量、review time を見る。`AGENTS.md` は書いて終わりではなく、レビュー品質に合わせて改善する運用資産である。

## まとめ

Copilot code review の `AGENTS.md` 対応は、レビューAIを repository の作業規約へ接続する更新である。Root `AGENTS.md` を読むことで、チーム固有の期待値を PR review に反映しやすくなる。一方、既存 custom instructions、path-specific instructions、MCP、agent skills と重なるため、指示ファイルの設計と ownership が重要になる。

日本企業にとっての実務論点は、`AGENTS.md` を置くかどうかではない。どの規約をどのファイルに置き、誰が変更を承認し、base branch でどう rollout し、draft PR と human review をどう分担し、MCP context をどこまで許すかである。

AI review は、モデルだけで決まらない。Repository に置かれた instructions、runner、content exclusion、MCP、skills、人間 reviewer の設計で決まる。今回の更新は、その中でも instructions を version-controlled な開発基盤として扱う必要性をはっきりさせた。

## 出典

- [Copilot code review: AGENTS.md support and UI improvements](https://github.blog/changelog/2026-06-18-copilot-code-review-agents-md-support-and-ui-improvements/) - GitHub Changelog, 2026-06-18
- [Using GitHub Copilot code review](https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review) - GitHub Docs
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) - GitHub Docs
- [Using custom instructions to unlock the power of Copilot code review](https://docs.github.com/en/copilot/tutorials/customize-code-review) - GitHub Docs
