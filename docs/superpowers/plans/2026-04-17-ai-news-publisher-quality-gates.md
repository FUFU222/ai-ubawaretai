# AI News Publisher Quality Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 候補スコアリングと staged article QA を追加して、publish 前に弱い記事を自動で落とす

**Architecture:** `publisher-quality` に candidate gate と article gate を集約し、automation prompt は plan/candidate/staged article をこのゲートへ通してから publish する。

**Tech Stack:** Node.js, node:test, Markdown/frontmatter parsing, local automation prompt

---

### Task 1: Quality Gate Tests

**Files:**
- Create: `tests/publisher-quality.test.mjs`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run `node --test tests/publisher-quality.test.mjs` and confirm failure**
- [ ] **Step 3: Implement `scripts/publisher-quality.mjs`**
- [ ] **Step 4: Re-run the test and confirm pass**

### Task 2: Automation Wiring

**Files:**
- Modify: `/Users/fufu/.codex/automations/ai-news-jp-publisher/automation.toml`
- Modify: `/Users/fufu/.codex/automations/ai-news-jp-publisher/memory.md`

- [ ] **Step 1: Require structured `candidate.json` metadata**
- [ ] **Step 2: Run candidate gate before drafting**
- [ ] **Step 3: Run article QA before promote**

### Task 3: Verification

**Files:**
- Verify only

- [ ] **Step 1: Run `node --test tests/publisher-quality.test.mjs`**
- [ ] **Step 2: Run `npm test`**
- [ ] **Step 3: Run `npm run build`**
