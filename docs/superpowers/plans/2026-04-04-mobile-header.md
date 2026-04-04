# Mobile Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** モバイルで崩れないミニマルなヘッダーへ置き換える

**Architecture:** `Header.astro` にデスクトップ用ナビとモバイル用ドロワーを共存させ、CSS のメディアクエリで役割を切り替える。テーマ切替スクリプトは `data-theme-toggle` ベースにして、デスクトップとモバイルの両ボタンを同じロジックで扱う。

**Tech Stack:** Astro, CSS, node:test

---

### Task 1: Add a regression test for mobile header structure

**Files:**
- Create: `tests/header-mobile-nav.test.mjs`
- Test: `tests/header-mobile-nav.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
test('build includes mobile drawer navigation and theme toggle hooks', () => {
  // Assert mobile drawer markup exists in built HTML
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/header-mobile-nav.test.mjs`
Expected: FAIL because current header does not include the mobile drawer structure

- [ ] **Step 3: Write minimal implementation**

Update `src/components/Header.astro` to add mobile drawer markup and shared toggle hooks.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/header-mobile-nav.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/header-mobile-nav.test.mjs src/components/Header.astro
git commit -m "feat: add mobile header drawer"
```

### Task 2: Implement responsive header behavior

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Update header markup**

Add:
- logo container that keeps the full text readable
- desktop nav wrapper
- mobile hamburger trigger
- top drawer with `ホーム / ブログ / カテゴリ / About / テーマ切替`

- [ ] **Step 2: Update theme toggle wiring**

Switch the script from a single `id` query to `[data-theme-toggle]` so both desktop and mobile controls work.

- [ ] **Step 3: Add mobile-first CSS**

Implement:
- desktop/mobile visibility split
- compact icon button styling
- small dropdown card under the header
- accessible tap targets

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Verify tests**

Run:
```bash
node --test tests/header-mobile-nav.test.mjs
node --test tests/adsense-auto-ads.test.mjs
node --test tests/sitemap.test.mjs
```

Expected: all PASS
