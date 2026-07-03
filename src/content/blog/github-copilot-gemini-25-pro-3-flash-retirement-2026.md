---
title: 'Copilot Gemini 2モデル終了、7月31日の移行手順'
description: 'GitHub CopilotでGemini 2.5 ProとGemini 3 Flashが7月31日に終了する。日本企業が代替モデル、管理者ポリシー、固定設定、回帰評価を4週間で移行する実務手順を整理する。'
pubDate: '2026-07-03'
category: 'news'
tags: ['GitHub Copilot', 'Gemini', 'AIコーディング', '管理者設定', '開発者ツール', '企業導入']
draft: false
series: 'github-copilot-2026'
---

GitHubは2026年7月2日、GitHub Copilotで提供している **Gemini 2.5 Pro** と **Gemini 3 Flash** を、**2026年7月31日**に廃止すると発表した。対象はCopilot Chatだけではない。inline edits、ask mode、agent mode、code completionsを含む、すべてのGitHub Copilot体験から外れる。

公式に示された移行先は、Gemini 2.5 Proから **Gemini 3.1 Pro**、Gemini 3 Flashから **Gemini 3.5 Flash** である。古いモデルは廃止日に自動で削除されるため、削除作業そのものは不要だ。ただし、BusinessやEnterpriseの管理者は代替モデルへのアクセスをポリシーで有効化し、利用者がモデル選択画面で確認できる状態にする必要がある。

日本の開発組織にとって、これは単なるモデル名の置換ではない。[Gemini 3.5 FlashのCopilot一般提供](/blog/github-copilot-gemini-35-flash-ga-2026/)で見たように、新モデルは性能、応答特性、利用条件が旧モデルと同じとは限らない。また、[Copilot Auto選択の運用設計](/blog/github-copilot-auto-model-selection-vscode-2026/)を採用している組織でも、固定モデルを指定した会話、手順書、自動化、教育資料が残っていれば移行対象になる。

## 事実: 7月31日に2モデルが全Copilot画面から終了

GitHub Changelogが明示した廃止日は、両モデルとも2026年7月31日である。Gemini 2.5 Proは一般提供モデル、Gemini 3 Flashは公開プレビューとしてCopilotに載っていたが、廃止対象となる範囲は同じだ。Chat、inline edits、ask mode、agent mode、code completionsを含む全Copilot体験で利用できなくなる。

ここで区別すべきなのは、今回の発表が **GitHub Copilot内のモデル提供終了** である点だ。GoogleのGemini APIやVertex AIにおけるモデルライフサイクルを、そのまま意味するものではない。Copilot内でモデル名を選べなくなる話と、GoogleのAPI endpointが使えるかどうかは、別々の公式情報で管理する必要がある。

移行先は一対一で示されている。

- Gemini 2.5 Pro → Gemini 3.1 Pro
- Gemini 3 Flash → Gemini 3.5 Flash

GitHubは、廃止日までにworkflowとintegrationを対応モデルへ更新するよう求めている。ここでいうworkflowは、開発者がモデルピッカーから手動選択するケースだけではない。IDEの設定、Copilot CLIの実行手順、agentのモデル指定、社内テンプレート、検証スクリプトなど、モデル名を前提にした運用全体を含めて考えるべきだ。

これは以前の[Copilot Web版モデル削減](/blog/github-copilot-web-models-limited-2026/)より影響範囲が広い。Web版だけの選択肢変更ではなく、今回は全Copilot体験を対象に明確な終了日が置かれている。廃止後に現場から問い合わせが来てから直すのでは遅い。

## 事実: 代替モデルは管理者ポリシーとクライアント条件に従う

GitHub Docsでは、Copilotで利用できるモデルは、契約プラン、利用するクライアント、組織やenterpriseのモデル制限に依存すると説明している。Gemini 3.1 ProとGemini 3.5 Flashがモデル一覧に存在していても、すべての利用者が無条件で選べるわけではない。

Copilot BusinessまたはEnterpriseでは、organization ownerやenterprise ownerがモデルアクセスを有効化または無効化できる。今回のChangelogも、代替モデルをモデルポリシーで有効にする必要がある場合を明記している。管理者は管理画面だけで判断せず、自分のCopilot設定と、実際のVS Codeやgithub.comのモデルセレクターで代替モデルが見えるか確認したい。

クライアントの更新も必要になる。GitHub Docsの現行表では、Gemini 3.1 ProとGemini 3.5 Flashについて、VS Code、Visual Studio、JetBrains IDE、Xcode、Eclipseごとに最低バージョンが示されている。古いIDEやCopilot拡張を固定している端末では、ポリシーを有効にしてもモデルが正しく出ない可能性がある。VDI、閉域端末、開発委託先の標準イメージは特に確認が必要だ。

Auto model selectionも万能な移行装置ではない。GitHub Docsでは、Autoが選ぶモデルは組織やenterpriseのポリシーに従う。さらに、Autoの候補モデルは、手動選択できる全モデルと同一ではない。旧Geminiモデルを直接指定している利用者をAutoへ変えるのか、公式代替へ固定するのかは、タスクと再現性の要件で分けるべきだ。

## 分析: 最大のリスクはモデル名固定より「暗黙の品質基準」

ここからは分析である。

技術的な置換だけなら、Gemini 2.5 ProをGemini 3.1 Proへ、Gemini 3 FlashをGemini 3.5 Flashへ変えればよい。しかし実務で大きいのは、旧モデルを前提に積み上げた暗黙の品質基準が変わることだ。

たとえば、レビューコメントの詳しさ、コード生成の保守性、長いrepository文脈の読み方、tool callの回数、応答速度、日本語説明の自然さ、テスト生成の粒度は、モデル変更で変わり得る。公式が代替モデルを指定していても、既存promptに対する出力が同一になる保証ではない。特に、agent modeやCLIのように複数回の推論とtool利用を伴う処理では、小さな挙動差が最終差分やAI Credits消費へ広がる。

もう一つのリスクは、モデル名が見えない場所に埋まることだ。利用者のモデルピッカーだけを見ても、社内wikiの操作手順、画面キャプチャ、オンボーディング動画、prompt sample、custom agent、CLI wrapper、評価データ、問い合わせFAQには旧名が残る。過去の[GPT-5.2系廃止対応](/blog/github-copilot-gpt-52-codex-retirement-2026/)と同じく、管理画面の切替だけでは完了しない。

したがって、今回の移行は「旧モデルを消す作業」ではなく、「モデル依存を見える化し、新しい基準値を作る作業」と定義したほうがよい。

## 実務: 4週間で棚卸し、評価、切替、監視を進める

最初の週は棚卸しに使う。Copilotの利用面を、github.com、VS Code、Visual Studio、JetBrains IDE、Xcode、Eclipse、Copilot CLI、agent mode、code completionsに分ける。各面で、旧モデルを手動選択している利用者、固定モデルを持つ設定、自動化、社内文書を探す。対象repository、owner、利用頻度、業務重要度も記録する。

2週目は代替モデルを有効化し、代表タスクで比較する。Gemini 2.5 Proを使っていた高難度タスクはGemini 3.1 Proで、Gemini 3 Flashを使っていた速度重視タスクはGemini 3.5 Flashで試す。比較項目は、完了率、レビュー修正量、テスト成功率、応答時間、tool call回数、AI Credits消費、日本語説明品質とする。10から20件の小さな評価セットでも、無評価の一斉切替より判断しやすい。

3週目は標準設定と文書を更新する。モデルポリシーを確認し、必要なら代替モデルを有効化する。IDEと拡張の最低バージョンを満たすよう標準イメージを更新する。社内wiki、prompt template、custom agent説明、問い合わせFAQ、研修資料にある旧モデル名を置き換える。この時点で、直接指定を続ける用途とAutoへ寄せる用途を分ける。

4週目は切替後の監視期間にする。旧モデル名が新しいsessionや設定に残っていないか、代替モデルを選べない利用者がいないか、出力品質と消費量に急変がないかを見る。7月31日当日に初めて切り替えるのではなく、少なくとも数営業日は新モデルだけで運用する期間を作りたい。

確認表は次のように簡潔でよい。

| 確認対象 | 担当 | 完了条件 |
| --- | --- | --- |
| モデルポリシー | Copilot管理者 | 代替2モデルが対象組織で選択可能 |
| IDE・拡張 | 開発基盤 | 標準端末が必要バージョンを満たす |
| 固定設定 | 各チーム | 旧モデル名の参照がゼロ |
| 回帰評価 | テックリード | 代表タスクの品質と費用を記録 |
| 社内文書 | Enablement担当 | 手順書と研修資料を更新 |
| 廃止後監視 | Help desk | 問い合わせと失敗を追跡できる |

## 日本企業は変更記録と例外を残す

日本企業では、モデル変更が情報システム部門、開発部門、購買、セキュリティ、委託先管理をまたぐことがある。変更申請を重くしすぎる必要はないが、少なくとも変更日、対象組織、旧モデル、代替モデル、ポリシー変更者、評価結果、未対応例外は残したい。

例外として多いのは、古いIDEを更新できない端末、顧客指定の開発環境、長期案件の再現試験、固定promptで品質保証している処理である。こうした環境は「後で対応」ではなく、期限、owner、代替手段を明示する。代替モデルが使えない間は、別の対応モデルへ切り替えるか、人手に戻すか、対象機能を停止するかを決めておく。

モデル廃止は今後も起きる。個別の名前を手順書へ大量に埋め込むほど、毎回の移行費用は上がる。モデル名を設定へ集約し、評価セットと変更記録を共通化し、利用者向けガイドでは「速度重視」「高難度設計」「標準」といった用途も併記するほうが保守しやすい。

## まとめ

GitHub CopilotのGemini 2.5 ProとGemini 3 Flashは、2026年7月31日に全Copilot体験から終了する。公式代替は、それぞれGemini 3.1 ProとGemini 3.5 Flashである。

管理者が行うべきことは、旧モデルの削除ではない。代替モデルのポリシー有効化、クライアント更新、固定設定の棚卸し、代表タスクの回帰評価、社内文書の更新である。日本の開発組織は、7月31日を切替開始日ではなく完了期限として扱い、数営業日の新モデル単独運用を先に置くべきだ。

## 出典

- [Upcoming deprecation of Gemini 2.5 Pro and Gemini 3 Flash](https://github.blog/changelog/2026-07-02-upcoming-deprecation-of-gemini-2-5-pro-and-gemini-3-flash/) - GitHub Changelog, 2026-07-02
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Configuring access to AI models in GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models) - GitHub Docs
