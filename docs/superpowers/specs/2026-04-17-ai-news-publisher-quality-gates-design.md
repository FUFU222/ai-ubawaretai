# AI News Publisher Quality Gates Design

**Goal**

AI News JP Publisher が候補選定と本文品質を publish 前に自動検査し、関心が弱い話題や SEO / editorial 要件を満たさない記事を落とせるようにする。

## Scope

- 候補 metadata の最低品質をスコアリングする
- staging に生成された `plan.md`, `candidate.json`, `main.md`, `child.md`, `expert.md` を検査する
- publish 前に機械的な gate として使える CLI を提供する

## Candidate Gate

`candidate.json` に以下を要求する。

- `slug`
- `title`
- `company`
- `date`
- `intent`
- `searchIntent`
- `whyUnique`
- `japaneseRelevance`
- `interestScore`
- `sources[]` with `type`

条件:

- source は 2 件以上
- primary source を 1 件以上
- `japaneseRelevance >= 3`
- `interestScore >= 3`
- 合計 score が 8 以上

## Article Gate

`main.md`:

- title 20-80 chars
- description 40-160 chars
- tags 3 個以上
- `draft: false`
- 本文 3500 chars 以上
- H2 3 個以上
- source links 2 件以上
- placeholder 文字列なし
- search intent keyword を title / description / 冒頭へ反映

`child.md`:

- `article` frontmatter が slug と一致
- `level: child`
- 本文 1600 chars 以上
- H2 3 個以上
- source links 2 件以上

`expert.md`:

- `article` frontmatter が slug と一致
- `level: expert`
- 本文 4500 chars 以上
- H2 3 個以上
- source links 2 件以上

`plan.md`:

- `slug`
- `日本語タイトル`
- `想定検索意図`
- `見出し`
- `ソース`

を最低限含む。

## CLI

- `node scripts/publisher-quality.mjs score-candidate --file .publisher-staging/<slug>/candidate.json`
- `node scripts/publisher-quality.mjs audit-stage --slug <slug>`

どちらも JSON を返し、fail 時は exit 1 とする。
