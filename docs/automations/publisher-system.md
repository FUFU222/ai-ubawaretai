# AI Publisher Automation System

## Goal

このサイトの追加開発と切り離して、AIニュース記事の調査・執筆・公開を継続する。

- automation ごとの worktree を使い、通常開発の dirty worktree に巻き込まれない
- automation 間で共有する状態は repo の外に置く
- 記事本文だけを継続的に更新し、サイト実装には触れない
- 一次ソースと品質ゲートを必須にする

## Shared Data Root

全 automation は次の shared path を使う。

- `PUBLISHER_DATA_ROOT="$HOME/.codex/publish/ai-ubawaretai-shared"`
- `PUBLISHER_STATE_PATH="$PUBLISHER_DATA_ROOT/publisher-state.jsonl"`
- `PUBLISHER_STAGING_DIR="$PUBLISHER_DATA_ROOT/staging"`

各 automation の `cwds` には、専用 clone に加えてこの shared dir も含める。
これで queue / state の読み書きを automation の許可範囲内に置く。

`state` は公開済み・却下済み・保留中の候補履歴。
`staging` は候補ごとの作業ディレクトリ。

## Queue Contract

候補ごとに `"$PUBLISHER_STAGING_DIR/<slug>/"` を作る。

### Scout 完了条件

- `candidate.json`
- `plan.md`

### Draft 完了条件

- `candidate.json`
- `plan.md`
- `main.md`
- `child.md`
- `expert.md`

### Publish 完了条件

- `scripts/publisher-quality.mjs audit-stage` が success
- `npm test`
- `npm run build`
- `scripts/publisher-content.mjs promote`
- `git add` / `git commit`
- `scripts/publisher-workspace.mjs push-main`

公開後は対象 staging dir を削除し、state に `published` を記録する。

## Automation Roles

### 1. Scout

役割:

- 最新の一次ソースと独立二次ソースを調査
- 重複判定
- 実務価値のある候補を 1 件 staging に追加

制約:

- `main` に commit しない
- 既に未処理 staging があれば新規候補を作らない
- 情報不足や重複の候補は state に rejection として記録する

### 2. Draft & Publish

役割:

- 最古の staging candidate を 1 件だけ処理
- `main.md` / `child.md` / `expert.md` を作成
- quality audit と build/test を通したら publish

制約:

- 記事本文と記事レベル本文以外の repo ファイルは編集しない
- 品質基準を満たさない場合は publish せず、state に rejection を記録して staging を掃除する

### 3. Janitor

役割:

- stale staging を掃除
- state / staging directory の存在を確認
- 失敗が続いている候補や古い保留キューを可視化

制約:

- 記事の新規生成や publish はしない

## Article Quality Rules

- 一次ソース 1 つ以上、総ソース 2 つ以上
- 可能なら 3 つ以上のソースで裏取りする
- `main.md` は 3500 文字以上
- `child.md` は 1600 文字以上
- `expert.md` は 4500 文字以上
- 各記事に `## 出典` と 2 つ以上の source link
- 日本市場・日本の開発/事業判断にどう効くかを書く
- 事実と考察を混ぜない
- 記事末尾の source link と本文の整合を確認する

## Throughput Rules

- scout は 4 時間ごとに候補を 1 件まで追加する
- publish は 2 時間ごとに最古の候補を処理する
- 完璧な独自性より、一次ソースの確かさと実務価値を優先する
- 速報性が高い日は、十分に裏取りできた有用な候補を先に出す

## Safe Publish Rules

- publish 対象は `src/content/blog/*.md` と `src/content/blog-levels/*/*.md` のみ
- それ以外の差分が出たら publish 中止
- `git push origin main` で fast-forward できない場合は最新を取り直して再判定
- 連続失敗時は無理に retry loop しないで inbox item を残す
- `preflight` の fetch が外部ネットワークで失敗した場合は、ローカル fallback fetch target で `origin/main` を更新して継続する
