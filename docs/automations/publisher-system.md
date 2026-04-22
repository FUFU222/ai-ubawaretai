# AI Publisher Automation System

## Goal

このサイトの自動更新は、`1 本の publisher automation` が end-to-end で担当する。

- 通常開発とは別の専用 clone で動く
- 候補探索、下書き、品質監査、公開を 1 run の中で完結させる
- queue / state は automation 自身の clone の中だけで持つ
- 途中失敗時は、次回 run が前回の失敗を分析して先に復旧する

## Why This Design

過去の `Scout / Publish / Janitor` 分離は、Codex automation の権限制約と合わなかった。

- automation 間 shared dir への書き込みが不安定
- worktree と local clone の権限差で挙動がぶれる
- queue handoff が増えるほど `動いているのに進まない` 状態を作りやすい

このため、現在の正解は `single automation + local runtime files` である。

## Local Runtime Paths

automation の専用 clone 内で、次の local path だけを使う。

- `PUBLISHER_STATE_PATH="$PWD/.publisher-runtime/publisher-state.jsonl"`
- `PUBLISHER_STAGING_DIR="$PWD/.publisher-staging"`
- `PUBLISHER_FALLBACK_FETCH_TARGET="/Users/fufu/code/ai-ubawaretai"`

`.publisher-runtime/` と `.publisher-staging/` は gitignore 対象にする。

## Run Sections

1. 同期
2. 復旧
3. 候補選定
4. 下書き
5. 監査
6. 公開
7. 失敗分析

## Section Rules

### 1. 同期

- `preflight` を実行する
- GitHub fetch に失敗したら `PUBLISHER_FALLBACK_FETCH_TARGET` で継続する
- remote は HTTPS を優先し、SSH 依存を避ける

### 2. 復旧

- まず前回の未完了作業を優先する
- `.publisher-staging/<slug>/` が残っていれば、その候補を再開する
- `HEAD` が `origin/main` より先に進んでいれば、先に push retry を試す
- push retry が失敗した場合は、新規候補を増やさず失敗原因を日本語で記録して終了する

### 3. 候補選定

- pending candidate がない場合だけ新規候補を 1 件選ぶ
- 一次ソース優先、二次ソースは補助
- 完璧な独自性待ちではなく、一次ソースの確かさと実務価値を優先する

### 4. 下書き

- `candidate.json` と `plan.md` があれば `main.md` / `child.md` / `expert.md` を作る
- 途中で失敗した場合は staging を保持して、次回 run で続行する

### 5. 監査

- `scripts/publisher-quality.mjs audit-stage` を実行する
- 失敗したら理由を分析し、1 回だけ修正を試みる
- 再監査でも落ちるなら `quality_rejected` として記録し、staging を掃除する

### 6. 公開

- `scripts/publisher-content.mjs promote` を実行する
- `npm test`
- `npm run build`
- `git add` / `git commit`
- `git push origin main`

### 7. 失敗分析

- 各 section で失敗したら、その section 名、原因、次回の自動復旧方針を日本語で残す
- `止めるだけ` ではなく、次回 run で何を先に試すかを明示する

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

## Safe Publish Rules

- publish 対象は `src/content/blog/*.md` と `src/content/blog-levels/*/*.md` のみ
- それ以外の差分が出たら publish 中止
- push 失敗時は local clone に commit を残し、次回 run で最優先 retry する
- 新規候補は常に 1 run あたり 1 件まで

## Reporting

最終サマリは毎回日本語で書く。

- `実行結果`
- `失敗分析`
- `復旧処理`
- `公開結果`
- `次回の引き継ぎ`
