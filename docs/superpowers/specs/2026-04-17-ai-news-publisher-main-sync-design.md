# AI News Publisher Main Sync Design

**Goal**

AI News JP Publisher の自動化実行を、毎回 `origin/main` と同期した clean な `main` から始め、失敗時に状態を汚さず、成功時だけ 1 記事を `main` に直接 push できる運用に置き換える。

**Problem**

現在の自動化は detached `HEAD` 上で記事コミットを積み上げており、次回実行時に「workspace base matches fetched `origin/main`」を満たせず停止しやすい。さらに、プリフライト・重複確認・一時下書き・公開判定がプロンプト任せで、失敗時の復旧保証が弱い。

## Approach

実行フローを 1 本のオーケストレーションスクリプトに集約する。自動化はそのスクリプトを通じて Git 状態の正規化、軽い重複確認、下書き領域の管理、最終公開前の検証だけを機械的に処理する。候補選定や本文執筆のような LLM が担うべき判断は残すが、リポジトリ状態の整合性と公開ゲートはコードで固定する。

## Architecture

### 1. Workspace Guard

新規に `scripts/publisher-workspace.mjs` を追加し、以下を担当する。

- `preflight`: memory file の存在確認、`git fetch origin main`、`main` への checkout、`origin/main` への fast-forward、未コミット変更の有無確認、`npm` の存在確認、`npm test` と `npm run build` の実行可否確認
- `status`: 自動化が参照しやすい JSON 形式で現在状態を出力
- `clean`: 失敗時に staging 領域を削除してワークツリーを clean に戻す

安全性のため、ローカル `main` が `origin/main` に fast-forward できない場合、または未コミット変更がある場合は即停止する。`reset --hard` は使わない。

### 2. Draft Staging

生成物はいきなり `src/content/blog` と `src/content/blog-levels` に書かず、まず `.publisher-staging/<slug>/` に置く。この段階では:

- planning brief
- main / child / expert のドラフト
- source manifest

のみを保持する。最終 duplicate check とテスト・ビルドが通ったら `promote` で本番コンテンツへ反映する。

### 3. Duplicate Guard

重複確認を `scripts/publisher-content.mjs` に分離し、以下を担当する。

- memory の直近記録読み取り
- `src/content/blog` の最新記事メタデータ読み取り
- slug / title / company / date / intent の軽い一致判定
- staging 内容の反映対象確認

厳密な意味理解は LLM が行うが、少なくとも「同じ会社・同日・同意図」の近接重複はコードで弾く。

### 4. Publish Gate

公開直前のゲートはスクリプトで固定する。

- `git fetch origin main`
- base 再確認
- duplicate 再確認
- `npm test`
- `npm run build`
- `git add`
- `git commit`
- `git push origin main`

どれか 1 つでも失敗したら promote せず、staging を削除して停止する。

## Automation Prompt Changes

automation prompt は「手順を全部モデルに委ねる」形から、「最初に workspace guard を実行し、下書きは staging に書き、最後に promote する」形に寄せる。これでモデルの自由度は候補選定・見出し設計・本文分析に限定される。

## File Boundaries

- `scripts/publisher-workspace.mjs`: Git / npm / clean state / staging cleanup
- `scripts/publisher-content.mjs`: memory・既存記事・重複判定・promote
- `tests/publisher-workspace.test.mjs`: preflight と base 同期の検証
- `tests/publisher-content.test.mjs`: duplicate 判定と staging promote の検証
- `/Users/fufu/.codex/automations/ai-news-jp-publisher/automation.toml`: 実行手順の更新
- `/Users/fufu/.codex/automations/ai-news-jp-publisher/memory.md`: 今回の方針と以後の実行ログ

## Failure Handling

- preflight failure: 何も生成せず停止
- draft quality failure: staging のみ削除して停止
- duplicate failure: staging を削除して停止
- test/build failure: promote せず停止
- push failure: commit 後なら状態を明示し、次回 run で再開ではなく停止

## Testing

- detached `HEAD` でも `preflight` が `main` に戻せること
- local `main` が behind のとき fast-forward できること
- dirty worktree では停止すること
- staging から blog / blog-levels へ promote できること
- duplicate 判定が memory と既存記事を拾えること

## Decision

`main` 直 push 前提で、専用 worktree 分離は採用しない。その代わり、実行開始時に必ず `main` と `origin/main` を同期し、生成物は staging に隔離してから公開する。
