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
- `PUBLISHER_SYNC_TARGET="/Users/fufu/.codex/publish/ai-ubawaretai-sync.git"`

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
- まず `PUBLISHER_SYNC_TARGET` から `origin/main` を更新する
- `PUBLISHER_SYNC_TARGET` は publisher 自身が更新する local mirror とする
- GitHub への fetch は常用しない。local mirror が使えないときだけ例外対応にする
- `git remote set-url` のような毎回の remote 上書きはしない

### 2. 復旧

- まず前回の未完了作業を優先する
- `.publisher-staging/<slug>/` が残っていれば、その候補を再開する
- `HEAD` が `origin/main` より先に進んでいれば、先に push retry を試す
- push retry が失敗した場合は、新規候補を増やさず失敗原因を日本語で記録して終了する

### 3. 候補選定

- pending candidate がない場合だけ新規候補を 1 件選ぶ
- 一次ソース優先、二次ソースは補助
- 完璧な独自性待ちではなく、一次ソースの確かさと実務価値を優先する
- 取り上げ対象の優先順位は次のとおり
  - 第1優先(常時拾う): Anthropic / Claude、OpenAI / Codex / ChatGPT、Google / Gemini
  - 第2優先(価値が高ければ拾う): GitHub Copilot、Cursor、Meta(Llama)、xAI、Microsoft(Claude/OpenAI 連携面のみ)、AWS Bedrock(Claude/モデル提供面のみ)
  - 第3優先(個別判断): その他のベンダー、規制・政策、研究論文
- 第1優先のベンダーは「平凡なアップデート」でも記事化候補とする
- 第2優先以下は、価格・プラン・GA・廃止・ガバナンス変更・日本市場直結のように実務影響が明確なときだけ拾う
- 同 run で第1優先と第2優先の候補が同程度の質なら、第1優先を選ぶ
- クラスタ判定: 直近 7 日間の `git log --pretty=format:'%s' src/content/blog/` を確認し、同じ第一タグ・ベンダーの記事が 3 本以上あるなら、新規候補は次のいずれかでなければならない
  - 既存 `series:` slug に紐付ける
  - 新規 `series:` slug を提案して同クラスタの将来記事も束ねる
- `candidate.json` には決定した `series` slug と、本文中で参照する予定の既存記事 slug 一覧を含める
- 候補が `score-candidate` または `check-duplicate` で却下された場合、同 run 内で最大 2 回まで再選定を試みる
- それでも有効候補が見つからなければ `no_viable_candidate` として終了し、staging を掃除する
- 「1 run 1 candidate」の上限は drafts のみに適用する。却下された探索は枠を消費しない

### 4. 下書き

- `candidate.json` と `plan.md` があれば `main.md` / `child.md` / `expert.md` を作る
- 途中で失敗した場合は staging を保持して、次回 run で続行する
- シリーズ判定: frontmatter を書く前に `src/content/blog/` を確認し、同じ製品ライン・ベンダー・取り組みを扱う既存記事が 2 本以上あれば、新規記事に同じ `series:` slug を設定する
  - 既存シリーズに `seriesTitle:` を持つ記事があれば、新記事には `seriesTitle:` を書かない
  - 新規シリーズを定義する場合、staging 内の最も代表的な記事に `seriesTitle:` を 1 度だけ設定する
- `pillar: true` は自動付与しない。pillar 候補と判断したら `次回の引き継ぎ` に slug と理由を残し、人間判断に委ねる
- 内部リンク: `main.md` と `expert.md` のそれぞれに、既存 `/blog/<slug>/` 記事への本文中内部リンクを最低 2 本含める
  - 新記事が `series` に属する場合、最低 3 本かつそのうち 1 本以上は同じ series の別記事を指す
  - `.mdx` ファイルでは、最も関連の強い既存記事 1 件を本文上部に `<RelatedInline slug="..." />` で差し込むことを推奨する
  - `.md` ファイルでは標準の Markdown リンクを本文中に使う
  - リンクした slug は `src/content/blog/` に実在することを監査前に確認する
- タグ正規化: `tags:` を決める前に `grep -h "^tags:" src/content/blog/*.md | tr ',' '\n' | sed 's/[][]//g' | sort -u` で既存タグを取得し、表記揺れは既存に合わせる
  - 大文字小文字・空白・句読点の違いだけで重複させない
  - 新規タグは既存タグでカバーできない概念のときだけ追加し、近接記事の表記スタイル(日本語ラベル / 製品の正式英語表記)に揃える

### 5. 監査

- `scripts/publisher-quality.mjs audit-stage` を実行する
- audit-stage と並行して次の手動チェックを通す
  - `main.md` と `expert.md` の内部リンク本数が下限を満たしていること
  - 内部リンクの slug がすべて `src/content/blog/` に存在すること
  - `series:` を設定したなら、既存記事に少なくとも 1 つ同じ slug の記事があるか、新規シリーズとして `seriesTitle:` を意図的に定義していること
  - `tags:` の表記が既存タグと一貫していること
  - `title` が 28〜38 日本語文字、`description` が 90〜130 日本語文字、それぞれ主要キーワードと日本市場文脈を含むこと
- 失敗したら理由を分析し、1 回だけ修正を試みる
- 再監査でも落ちるなら `quality_rejected` として記録し、staging を掃除する

### 6. 公開

- `scripts/publisher-content.mjs promote` を実行する
- `scripts/publisher-workspace.mjs classify-publish-diff` で差分を確認する
- 差分が publish 対象 3 ファイルだけなら `npm run build` だけを実行する
- 差分がそれ以外に広がった場合は publish 中止。publish-flow 自体を直す run だけが full test を許される
- `git add` / `git commit`
- まず `git push origin main`
- 成功したら `PUBLISHER_SYNC_TARGET` にも同じ `main` を push して local mirror を更新する

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
- `title` は 28〜38 日本語文字、主要キーワードを前半に置く
- `description` は 90〜130 日本語文字、主要キーワードと日本市場の角度を含める
- `main.md` と `expert.md` のそれぞれに、既存 `/blog/<slug>/` 記事への本文中内部リンクを最低 2 本含める
- 新記事が `series` に属する場合、内部リンクは最低 3 本、うち 1 本以上は同 series の別記事を指す
- 内部リンクで参照する slug は `src/content/blog/` に実在すること
- `.mdx` で書く場合、本文上部に最も関連の強い 1 件を `<RelatedInline slug="..." />` で差し込むことを推奨する

## Series and Pillar Rules

- `series:` slug は同テーマの記事を束ねるための識別子であり、`/series/<slug>/` ページを自動生成する
- 同テーマ記事が 2 本以上あれば `series:` を必ず設定する
- `seriesTitle:` はシリーズ全体に表示されるタイトル。同 series 内のいずれか 1 記事に 1 度だけ設定する
- `pillar: true` は人間判断専用。automation は付与しない
- pillar 候補と判断したら `次回の引き継ぎ` に slug と理由を残す

## Safe Publish Rules

- publish 対象は `src/content/blog/*.md` と `src/content/blog-levels/*/*.md` のみ
- それ以外の差分が出たら publish 中止
- push 失敗時は local clone に commit を残し、次回 run で最優先 retry する
- 新規候補は常に 1 run あたり 1 件まで

## Reporting

最終サマリは毎回日本語で短く書く。

- 必須は `実行結果`
- `失敗分析` は失敗時だけ出す
- `復旧処理` は recovery を実施した run だけ出す
- `公開結果` は publish を試した run だけ出す
- 公開記事が `series:` を持つ場合、`公開結果` に series slug と現在のシリーズ記事数を含める
- `次回の引き継ぎ` は未完了タスクや人間判断待ちが残るときだけ出す
- pillar 昇格候補があれば `次回の引き継ぎ` に series slug と理由を書く

## Memory Rules

- `memory.md` は durable note だけを残す
- routine success / failure の run log は memory に積み増さない
- inbox summary に出した内容をそのまま memory に複写しない
