---
article: 'github-copilot-cli-security-review-2026'
level: 'child'
---

GitHub が Copilot CLI に `/security-review` を追加しました。これは、開発者が自分の端末で作業中のコード変更を、セキュリティ観点で見直すための実験的な公開プレビュー機能です。

ポイントは、pull request を出した後ではなく、commit や PR の前に使えることです。たとえば、ログイン処理、権限チェック、ファイルアップロード、SQL、外部 API、暗号化、token 保存などを触ったとき、PR を作る前に `/security-review` を実行すると、明らかに危ない差分に早く気づけます。

## 何を見てくれるのか

GitHub の発表では、`/security-review` はローカルのコード変更を分析し、severity と confidence つきの finding、修正に使える提案、既存の terminal 作業内で完結する review を返すとされています。

対象として挙げられているのは、injection、cross-site scripting、insecure data handling、path traversal、weak cryptography などです。つまり、仕様全体を保証するというより、コード差分に出やすい代表的なセキュリティ問題を見つけるための機能です。

すでに [GitHub第三者agent検証、AIコード安全運用の焦点](/blog/github-third-party-agent-security-validation-2026/) では、AI agent が作った PR を GitHub 上で検査する話を扱いました。今回の機能はその手前です。PR 後の検査ではなく、開発者が作業中に一度立ち止まるための確認です。

## CodeQLの代わりではない

`/security-review` は便利ですが、CodeQL、secret scanning、Dependabot、人間レビューの代わりではありません。

CodeQL はコードのデータフロー解析に強く、secret scanning は秘密情報の混入検知に強く、Dependabot は既知脆弱性のある依存関係に強いです。これらは PR や CI の required check として運用しやすい仕組みです。

`/security-review` は、開発者がその前に使う軽い検査として考えると分かりやすいです。まずローカルで明らかな問題を直し、その後で PR の標準チェックを通す。この順番にすると、レビュー担当者は単純な危険差分ではなく、仕様や権限設計の確認に集中できます。

## 日本のチームで決めること

最初に決めるべきなのは、どんな変更で `/security-review` を使うかです。すべての変更で必須にすると重くなります。認証、認可、入力検証、個人情報、ファイル操作、暗号、CI/CD、依存関係の変更など、事故が大きくなりやすい範囲から始めるのが現実的です。

次に、結果の扱いを決めます。高い severity と confidence の finding は PR 前に直す。判断に迷うものはセキュリティ担当者に確認する。修正しない場合は理由を PR に残す。こうしたルールがあると、AI の指摘をその場限りにしにくくなります。

権限も重要です。[GitHub Copilot CLI刷新、定期実行と音声入力の運用点](/blog/github-copilot-cli-scheduling-voice-rubber-duck-2026/) でも触れたように、Copilot CLI は terminal で動く agent です。便利だからといって `/allow-all` や `/yolo` を常用すると、検査のための session に広い権限を渡してしまいます。

## 費用にも注意する

Copilot CLI を使う回数が増えると、AI Credits の管理にも関係します。[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で整理した通り、CLI や agentic workflow は従量的に見られる領域です。

安全のために毎回実行したくなりますが、文言修正や小さな表示変更まで全部対象にすると費用と時間が増えます。まずは危険度の高い変更に絞り、発見率、誤検知、レビュー時間、消費量を見ながら広げるのがよいです。

## まとめ

`/security-review` は、AI が安全を保証する機能ではありません。開発者が PR を出す前に危ない差分へ気づくための前段チェックです。

日本の開発チームでは、CodeQL や secret scanning と競合させるのではなく、役割を分けて使うべきです。ローカルでは `/security-review`、PR では標準のセキュリティチェック、最後は人間が仕様と権限を確認する。この形にすると、AI agent 時代のレビュー負荷を少し前倒しできます。

## 出典

- [Dedicated security review command now available in Copilot CLI](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/) - GitHub Changelog, 2026-06-10
- [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) - GitHub Docs
- [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) - GitHub Docs
