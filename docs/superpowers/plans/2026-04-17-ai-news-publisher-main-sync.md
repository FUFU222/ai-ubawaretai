# AI News Publisher Main Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI News JP Publisher を毎回 clean な `main` 起点で実行し、staging を経由して安全に publish できるようにする

**Architecture:** Git / npm / clean-state 判定は `publisher-workspace` にまとめ、duplicate と staging promote は `publisher-content` に分離する。自動化 prompt はその 2 つの入口に合わせて更新し、失敗時は repo を汚さない。

**Tech Stack:** Node.js, npm, Astro, node:test, git CLI

---

### Task 1: Workspace Guard Tests

**Files:**
- Create: `tests/publisher-workspace.test.mjs`

- [ ] **Step 1: Write the failing test**

テスト内容:
- detached `HEAD` 状態の repo でも `preflight` が `main` へ戻そうとする
- dirty worktree では失敗する
- `status` が JSON を返す

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/publisher-workspace.test.mjs`
Expected: FAIL because module does not exist yet

- [ ] **Step 3: Write minimal implementation**

`scripts/publisher-workspace.mjs` に `status`, `preflight`, `clean` を追加する

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/publisher-workspace.test.mjs`
Expected: PASS

### Task 2: Content Guard Tests

**Files:**
- Create: `tests/publisher-content.test.mjs`

- [ ] **Step 1: Write the failing test**

テスト内容:
- memory と既存記事から duplicate 候補を拾う
- staging の `main`, `child`, `expert` を本番配置へ promote できる

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/publisher-content.test.mjs`
Expected: FAIL because module does not exist yet

- [ ] **Step 3: Write minimal implementation**

`scripts/publisher-content.mjs` に duplicate 判定と promote を実装する

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/publisher-content.test.mjs`
Expected: PASS

### Task 3: Automation Alignment

**Files:**
- Modify: `/Users/fufu/.codex/automations/ai-news-jp-publisher/automation.toml`
- Modify: `/Users/fufu/.codex/automations/ai-news-jp-publisher/memory.md`

- [ ] **Step 1: Update automation prompt**

最初に `node scripts/publisher-workspace.mjs preflight` を実行し、下書きは staging に置き、公開直前に `node scripts/publisher-content.mjs promote ...` を使うよう prompt を更新する

- [ ] **Step 2: Record policy in memory**

今後の run が detached `HEAD` を前提にしないこと、clean state 必須であることを memory に追記する

### Task 4: Full Verification

**Files:**
- Verify only

- [ ] **Step 1: Run focused tests**

Run: `node --test tests/publisher-workspace.test.mjs tests/publisher-content.test.mjs`
Expected: PASS

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Inspect git diff**

Run: `git status --short`
Expected: only intended files changed
