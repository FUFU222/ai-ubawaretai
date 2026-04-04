# Article Level Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 記事を `幼児向け / 標準 / 玄人向け` で読み替えられる `解説レベル` スイッチャーを追加し、初期表示の軽さを保ったまま段階導入できるようにする

**Architecture:** 既存の `blog` collection を canonical な `標準` 本文として維持し、追加レベルは `blog-levels` collection に sidecar として置く。記事ページは `標準` 本文だけを初回描画し、`article-levels` の静的 partial route から `幼児向け / 玄人向け` の fragment を先読み・切替する。UI は `ArticleLevelSwitcher.astro` に閉じ込め、`BlogPost.astro` はターゲット領域と切替コンポーネントを受け持つ。

**Tech Stack:** Astro, Astro content collections, MDX, CSS, inline script, node:test

---

## File Structure

- Modify: `src/content.config.ts`
  Add `blogLevels` collection for sidecar variants.
- Create: `src/utils/articleLevels.ts`
  Centralize labels, level parsing, availability lookup, and path helpers.
- Create: `src/components/ArticleLevelSwitcher.astro`
  Render the `解説レベル` UI and own open/close, fetch, cache, animation, and persistence logic.
- Modify: `src/layouts/BlogPost.astro`
  Insert the switcher near the article title and mark the prose container as a runtime swap target.
- Modify: `src/pages/blog/[...slug].astro`
  Load sidecar availability for the current article and pass it into the layout.
- Create: `src/pages/article-levels/[...slug].astro`
  Build static HTML fragments for `child` and `expert` variants.
- Create: `src/content/blog-levels/chatgpt-workflow-guide/child.mdx`
  Provide the first `幼児向け` variant for an existing article.
- Create: `src/content/blog-levels/chatgpt-workflow-guide/expert.mdx`
  Provide the first `玄人向け` variant for an existing article.
- Create: `tests/article-level-switcher.test.mjs`
  Cover build output for supported/unsupported articles and generated fragment routes.

### Task 1: Add a failing regression test for level-aware article builds

**Files:**
- Create: `tests/article-level-switcher.test.mjs`
- Test: `tests/article-level-switcher.test.mjs`

- [x] **Step 1: Write the failing test**

```js
test('build exposes article level switcher only for supported articles', () => {
  // build the site
  // assert the supported article has the switcher trigger and runtime hooks
  // assert an unsupported article does not include the switcher
  // assert child/expert fragment routes are emitted in dist
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/article-level-switcher.test.mjs`
Expected: FAIL because there is no `blog-levels` collection, no switcher markup, and no fragment routes yet

- [x] **Step 3: Commit the red test**

```bash
git add tests/article-level-switcher.test.mjs
git commit -m "test: add article level switcher regression"
```

### Task 2: Add sidecar article level content and discovery helpers

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/utils/articleLevels.ts`
- Create: `src/content/blog-levels/chatgpt-workflow-guide/child.mdx`
- Create: `src/content/blog-levels/chatgpt-workflow-guide/expert.mdx`
- Test: `tests/article-level-switcher.test.mjs`

- [x] **Step 1: Register the sidecar collection**

Add a `blogLevels` collection that loads `src/content/blog-levels/**/*.mdx` and validates a minimal frontmatter shape.

- [x] **Step 2: Add level helpers**

Implement:

```ts
export const ARTICLE_LEVEL_LABELS = {
  child: '幼児向け',
  standard: '標準',
  expert: '玄人向け',
};

export function parseArticleLevelId(id: string) {
  // split "chatgpt-workflow-guide/child" into articleId + level
}
```

- [x] **Step 3: Add the first supported article variants**

Create `child.mdx` and `expert.mdx` for `chatgpt-workflow-guide` with plain Markdown/MDX content and no custom component imports.

- [x] **Step 4: Run the regression test**

Run: `node --test tests/article-level-switcher.test.mjs`
Expected: still FAIL because routes and UI are not wired yet, but content discovery should now be loadable

- [x] **Step 5: Commit**

```bash
git add src/content.config.ts src/utils/articleLevels.ts src/content/blog-levels/chatgpt-workflow-guide/child.mdx src/content/blog-levels/chatgpt-workflow-guide/expert.mdx
git commit -m "feat: add article level content sidecars"
```

### Task 3: Generate static article level fragments

**Files:**
- Create: `src/pages/article-levels/[...slug].astro`
- Modify: `src/pages/blog/[...slug].astro`
- Modify: `src/utils/articleLevels.ts`
- Test: `tests/article-level-switcher.test.mjs`

- [x] **Step 1: Add the fragment route**

Create a partial Astro page that:
- enumerates `blogLevels` entries with `getStaticPaths()`
- renders each sidecar entry with `render(entry)`
- emits only the HTML fragment needed for `.prose`

- [x] **Step 2: Load availability in the main article route**

Update `src/pages/blog/[...slug].astro` to:
- fetch `blogLevels`
- derive `child/expert` availability for `post.id`
- pass `articleLevels` metadata into `BlogPost`

- [x] **Step 3: Re-run the regression test**

Run: `node --test tests/article-level-switcher.test.mjs`
Expected: still FAIL because supported article markup does not yet include the switcher

- [x] **Step 4: Commit**

```bash
git add src/pages/article-levels/[...slug].astro src/pages/blog/[...slug].astro src/utils/articleLevels.ts
git commit -m "feat: add static article level fragments"
```

### Task 4: Add the switcher UI and runtime behavior

**Files:**
- Create: `src/components/ArticleLevelSwitcher.astro`
- Modify: `src/layouts/BlogPost.astro`
- Modify: `src/utils/articleLevels.ts`
- Test: `tests/article-level-switcher.test.mjs`

- [x] **Step 1: Add the switcher component**

Render:
- eyebrow/label text for `解説レベル`
- a single pill trigger that shows the active level
- a hidden panel with `幼児向け / 標準 / 玄人向け`

Runtime responsibilities:
- open/close interactions
- outside click and Escape handling
- level caching
- optional idle/visibility prefetch
- localStorage persistence
- swap animation and reduced-motion fallback

- [x] **Step 2: Wire the article layout**

Update `BlogPost.astro` to:
- receive `articleLevels`
- render the switcher only when both `child` and `expert` exist
- annotate the prose container as the runtime swap target

- [x] **Step 3: Make the regression test pass**

Run: `node --test tests/article-level-switcher.test.mjs`
Expected: PASS

- [x] **Step 4: Verify the full build**

Run: `npm run build`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add src/components/ArticleLevelSwitcher.astro src/layouts/BlogPost.astro src/utils/articleLevels.ts
git commit -m "feat: add article level switcher"
```

### Task 5: Run full regression coverage and push

**Files:**
- Modify: `docs/superpowers/plans/2026-04-04-article-level-switcher.md`

- [x] **Step 1: Run focused tests**

Run:

```bash
node --test tests/article-level-switcher.test.mjs
node --test tests/home-hero-subtitle-break.test.mjs
node --test tests/footer-about-polish.test.mjs
node --test tests/header-mobile-nav.test.mjs
node --test tests/adsense-auto-ads.test.mjs
node --test tests/sitemap.test.mjs
```

Expected: all PASS

- [x] **Step 2: Run final build**

Run: `npm run build`
Expected: PASS

- [x] **Step 3: Mark completed work in the plan**

Update this plan so completed steps are checked off before handoff.

- [x] **Step 4: Push**

```bash
git push origin main
```
