# Article Level Switcher Design

**Date:** 2026-04-04

## Goal

1つの記事を `幼児向け / 標準 / 玄人向け` の3レベルで読めるようにし、読者が理解度に合わせてその場で解説深度を切り替えられるようにする。

今回の設計では、`初期表示の軽さ` を優先しつつ、切替時の体験を滑らかに見せることを重視する。

## Why This Matters

- 同じテーマでも、読者の前提知識は大きく異なる
- 記事ごとに対象読者を固定すると、刺さる層が狭くなる
- 解説レベルを切り替えられると、1本の記事の価値を広い読者層に届けやすい
- ただしブログとしての読みやすさを壊すと本末転倒なので、UIは静かで最小限に保つ

## Current Context

- 記事は `/Users/fufu/code/ai-ubawaretai/src/content/blog/*.md(x)` に `1ファイル = 1記事` で保存されている
- 記事ページは `content collections` と `render(post)` を使って静的生成している
- インタラクションは React 等を入れず、Astro コンポーネント内の軽量な script で完結している
- 既存記事にも順次対応したいが、全記事を一気に移行する前提にはしない

## Chosen Direction

- URL は現状の `1記事1slug` を維持する
- `標準` は既存の本文を canonical な本体として扱う
- `幼児向け` と `玄人向け` は sidecar の追加本文として管理する
- 初期表示では `標準` だけを描画する
- 追加本文は事前生成し、ページ表示後に先読みする
- 記事タイトル直下に `解説レベル` スイッチャーを置く
- 追加レベルが揃っている記事だけ切替UIを表示する

## Labeling

### Trigger Label

- `解説レベル`

理由:

- `深さ切替` より意味が明確
- 読者に自己ラベリングを要求しない
- ブログ記事のトーンを壊さず自然

### Level Labels

- `幼児向け`
- `標準`
- `玄人向け`

理由:

- 3段階の差が一目で分かる
- 初期表示を `標準` にしても角が立たない
- `IT初心者向け` より読者へのラベリング感が弱い

## UX Structure

### Entry Point

- 記事タイトル直下に単一のピルボタンを表示する
- 初期表示のボタン文言は `標準`
- ボタンの補助ラベルとして `解説レベル` を見せる構成でもよい

### Expanded State

- ボタン押下で、当該ボタンの直下に3レベルの選択パネルを展開する
- パネルはドロップダウンというより、小さな選択面として見せる
- モバイルでも押しやすい高さと余白を優先する

### After Selection

- 選択後は自動で閉じる
- 親ボタンは `幼児向け / 標準 / 玄人向け` の現在値を保持する
- ボタンは記事の邪魔にならないサイズで待機する

### Sticky Behavior

- 初期位置はタイトル直下
- 一定量スクロール後は `compact sticky` 状態に変わる
- sticky 時は大きく主張させず、読みの流れを邪魔しないサイズに抑える
- モバイルでは本文行を塞がない上部寄りの位置を優先する
- デスクトップではタイトル右寄せまたは本文カラム上部の自然な位置に寄せる

## Motion

- パネル開閉は `fade + slight scale + short slide`
- 切替時は旧本文をわずかに薄くし、新本文を下から軽く馴染ませる
- ローディングの存在を強く見せるのではなく、`読み替わった感` だけを与える
- アニメーション時間は短く保ち、待たされている印象を避ける
- `prefers-reduced-motion` では最小化または無効化する

## Content Structure

### Standard Article

- 既存の `/Users/fufu/code/ai-ubawaretai/src/content/blog/*.md(x)` をそのまま使う
- frontmatter も既存記事を基準にする

### Additional Levels

- 追加本文は別ディレクトリで管理する
- 例: `/Users/fufu/code/ai-ubawaretai/src/content/blog-levels/<slug>/child.mdx`
- 例: `/Users/fufu/code/ai-ubawaretai/src/content/blog-levels/<slug>/expert.mdx`

理由:

- 既存記事を一気に移設しなくて済む
- slug ごとに段階対応しやすい
- `標準` の canonical 構造を崩さない
- 一覧やカテゴリなど既存の導線に影響を出しにくい

## Rendering Strategy

### Recommended Approach

- 初回は `標準` 本文だけを通常どおり SSR/静的生成で描画する
- `幼児向け / 玄人向け` は build 時に静的 payload として生成する
- 記事ページでは軽量 script が必要時にそれらを取得して差し替える

### Why Not Inline All Three Bodies

- 初期 HTML が重くなる
- モバイルで不利
- 初回表示速度を優先する今回の方針に合わない

### Why Not Real-Time AI Rewriting

- API・課金・キャッシュ・失敗時処理が必要になり、今の静的ブログに対して重すぎる
- 記事品質の管理が難しくなる
- 今回は公開前に3本文を用意する前提なので不要

## Runtime Responsibilities

### Content Discovery

- 記事 slug に対して `child/expert` の有無を判定する
- 3レベル揃っている記事だけ UI を有効化する

### Switcher Controller

- パネル開閉
- 外側クリック/再タップ/Escape で閉じる
- 選択状態の保持
- sticky 化の制御
- localStorage による読者の前回選択の保存

### Variant Loading

- 初期表示後の idle 時、またはスイッチャーが viewport に入った時点で先読みする
- 先読みに間に合わなかった場合も、短い切替演出で違和感を和らげる
- 一度読み込んだ本文はメモリ上で保持し、2回目以降の切替を速くする

## Failure Handling

- 追加本文が存在しない記事では UI を出さない
- 読込失敗時は現在表示中の本文を維持する
- 強いエラーUIは出さず、必要なら控えめな補助文だけ出す
- 切替中の連打は最後の選択だけ反映する
- localStorage が使えない環境でも通常読書は阻害しない

## SEO Direction

- canonical は常に `標準` 記事の URL に寄せる
- title / description / JSON-LD / 一覧カードは `標準` を基準にする
- `幼児向け / 玄人向け` を別URLの SEO ページにはしない
- レベル切替は UX 機能として扱う

## Rollout Strategy

- 新規記事は3レベル対応を前提にできるようにする
- 既存記事は対応できた slug から順次有効化する
- `標準` しかない記事は今までどおり見せる
- UI は段階的に出せるため、全記事対応を待たずにリリース可能

## Testing Strategy

### Build-Level Tests

- 3レベル対応記事ではスイッチャーが出る
- 未対応記事ではスイッチャーが出ない
- 追加本文 payload が正しく生成される

### Interaction Tests

- 初期表示が `標準`
- 選択後にラベル保持
- localStorage 保存と復元
- 先読み済み/未先読み時の両方で正しく切り替わる
- 読込失敗時に本文が壊れない

### Regression Tests

- 既存の記事ページレンダリング
- ブログ一覧とカテゴリ一覧
- sitemap や既存のメタ出力

## Success Criteria

- 初期表示の体感速度を落とさずにレベル切替を導入できる
- モバイルでも押しやすく、本文の邪魔にならない
- 3レベル対応済みの記事だけ自然に機能が有効になる
- 既存記事を段階的に移行できる
- SEO の基準は `標準` に集約され、既存の導線を崩さない
