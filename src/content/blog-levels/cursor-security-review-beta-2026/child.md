---
article: 'cursor-security-review-beta-2026'
level: 'child'
---

Cursor が **2026年4月30日** に出した `Cursor Security Review` は、開発チーム向けの AI コードレビューを、**セキュリティ監査寄り**に広げたベータ機能だ。対象は Teams と Enterprise。Security Reviewer と Vulnerability Scanner の 2 本が中心になる。

## 何ができるのか

Security Reviewer は、PR ごとにセキュリティ脆弱性、認証回りの後退、プライバシーやデータ処理のリスク、agent tool の自動承認、prompt injection attack を見て、**diff 上に重大度と修正案付きコメント**を残す。

Vulnerability Scanner は、リポジトリを **定期スキャン**して、既知の脆弱性、古い依存関係、設定不備を確認する。結果は **Slack 通知**にも流せる。

## 日本企業にとって重要な点

この機能の実務価値は、「AI が危険そうなコードを指摘する」こと自体より、**既存のセキュリティ運用に乗せやすい**ことだ。Cursor は MCP 経由で、既存の SAST、SCA、secrets scanner を review の一部に組み込めるとしている。つまり、今ある検査基盤を全部捨てなくてもよい。

また、Cursor の security page と pricing page では、**privacy mode** を team admin が制御でき、有効時はコードデータがモデルプロバイダーに保存されず、学習にも使われないとしている。日本企業で AI 導入が止まりやすい論点に、最初から説明があるのは大きい。

加えて、Teams には usage analytics と reporting、Enterprise には audit logs や granular admin controls が含まれる。これは、PoC がうまくいった後に「誰がどのレビューを動かしたか」「どこで使いすぎたか」を追いやすいという意味でもある。セキュリティ機能は精度だけでなく、後から説明できることが重要なので、この管理面は見逃しにくい。

## どこに注意すべきか

ただし、これはまだ **beta** だ。しかも security agents は **existing usage pool から消費**される。つまり、全 PR に自動で掛けるか、重要リポジトリだけにするかでコストも運用負荷も変わる。

実際の始め方としては、まず重要なリポジトリだけで Security Reviewer を有効化し、Vulnerability Scanner は週次や日次で限定運用するのが現実的だろう。特に、既存の secrets scanner や dependency scanner を MCP でつなぎ、一次トリアージだけ AI に任せる構成がやりやすい。

## まとめ

Cursor Security Review は、AI コーディングツールが **実装支援から保守と監査**へ広がる流れを示している。今すぐ全面導入というより、日本の開発組織が PoC で「PR セキュリティ監査をどこまで自動化できるか」を試す材料として見るのがよい。

## 出典

- [Cursor Security Review](https://cursor.com/changelog/04-30-26) — Cursor Changelog, 2026-04-30
- [Cursor セキュリティ](https://cursor.com/ja/security) — Cursor, updated 2026-04-24
- [Cursor Pricing](https://cursor.com/pricing) — Cursor
