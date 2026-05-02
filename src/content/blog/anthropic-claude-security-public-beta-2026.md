---
title: 'Claude Security公開ベータ。日本企業の脆弱性運用は変わるか'
description: 'Claude Securityの公開ベータ資料をもとに、GitHub前提の脆弱性スキャン、Claude Code連携、直接トークン課金、ZDRなしの制約を日本企業の導入判断向けに整理する。'
pubDate: '2026-05-02'
category: 'news'
tags: ['Anthropic', 'Claude', 'Claude Code', 'サイバーセキュリティ', '脆弱性修正', 'AIエージェント']
draft: false
series: 'anthropic-japan-2026'
---

Anthropic の **Claude Security** が、Claude.ai に組み込まれたコードベース脆弱性スキャン機能として公式ヘルプと導入チュートリアルに掲載された。公式ヘルプでは、Claude Security はコードベースをスキャンし、セキュリティ脆弱性を検出し、人間のレビューに回すための修正案を提示する機能だと説明されている。

この更新は、単に「Claude Code がセキュリティレビューもできる」という話ではない。リポジトリ単位、プロジェクト単位でスキャンし、検出結果を重大度や再現手順や推奨修正つきで管理し、CSV や Markdown で export し、必要なら webhook で既存の運用システムへ流す。つまり、個人開発者のコマンドではなく、**組織の AppSec 運用に AI エージェントを差し込む製品**として見るべきだ。

日本企業にとって重要なのは、Claude Security が「検知精度の勝負」だけではなく、脆弱性対応の初動、監査証跡、GitHub 権限、利用コスト、データ保持の制約まで含む運用設計を要求する点にある。Anthropic の日本市場向け展開は、すでに [Claude Platform on AWS](/blog/anthropic-claude-platform-aws-2026-04-22/) や [NEC との AI 人材育成](/blog/anthropic-nec-ai-engineering-workforce-japan-2026/) でも見えていたが、今回の Claude Security はより直接的に、開発組織とセキュリティ部門の接点を取りに来ている。

## 事実: Claude Security はリポジトリ全体の脆弱性スキャン機能

公式ヘルプによると、Claude Security は Claude.ai 内の機能として提供され、コードベースをスキャンして脆弱性を探し、人間がレビューできる修正案を出す。対象カテゴリとしては、SQL injection、command injection、XSS、XXE、ReDoS、path traversal、SSRF、open redirect、認証バイパス、権限昇格、IDOR、CSRF、race condition、memory safety、cryptography、deserialization、protocol や encoding の問題などが例示されている。

検出結果は、単に「危ないかもしれない」と出るだけではない。公式ヘルプでは、title、details、location、impact、reproduction steps、recommended fix、severity、status、category、repository、branch、date created といった項目が挙げられている。ここで特に実務的なのは、再現手順と推奨修正が同じ findings の中に入ることだ。SAST ツールのアラートは、検出だけで終わり、開発者が再現と修正方針を調べ直すことが多い。Claude Security はそこを AI エージェントで短くしようとしている。

また、重大度はカテゴリではなく、対象コードベースでの悪用可能性に基づいて割り当てるとされている。これは重要だ。たとえば同じ SQL injection 系でも、未認証の公開 API にあるのか、社内管理画面の特定ロールの奥にあるのかで優先度は変わる。Claude Security は、固定ルールの一致だけではなく、コード文脈に応じた評価を狙っていると読める。

## 事実: GitHub、Claude Code on the Web、Extra Usage が前提になる

導入チュートリアルを見ると、利用条件は軽くない。Claude Security はベータ機能で、導入には Claude Enterprise account、Claude Code on the Web、Extra Usage、Anthropic GitHub App、利用者ごとの premium seat が必要とされている。さらに現時点では GitHub.com 上のリポジトリが前提だ。

この制約は、日本企業ではかなり大きい。GitHub Enterprise Cloud を使っている SaaS 企業なら試しやすいが、GitHub Enterprise Server、GitLab、Bitbucket、Azure DevOps、社内 Git を中心にしている組織では、すぐ横展開できない可能性がある。既存のソースコード管理とセキュリティ運用の場所が合っていなければ、モデル性能以前に導入できない。

もう一つの論点は課金だ。公式ヘルプでは、Claude Security のスキャンは直接トークンコストのみで課金され、追加の platform fee はないと説明されている。一方、導入チュートリアルでは Extra Usage が必要で、スキャンのサイズや回数に応じてコストが変わるため、spend limit を設定するよう案内している。つまり、固定料金で無制限に回せるセキュリティスキャナーではなく、**スキャン対象の大きさと頻度を設計する従量課金型の運用**になる。

ここは [Claude for Creative Work](/blog/anthropic-claude-creative-work-design-2026/) とも似ている。Anthropic は個別機能を出すだけでなく、Claude Code や Claude.ai の周辺に組織向けの作業面を増やしている。Claude Security も、その作業面の一つだ。

## 事実: Claude Code の既存セキュリティレビューとは役割が違う

Anthropic には、すでに Claude Code の automated security review と Code Review がある。Automated Security Reviews in Claude Code は、`/security-review` コマンドや GitHub Actions を使い、開発者がコミット前や PR 上でセキュリティ上の問題を見つけるための機能だ。Code Review for Claude Code は、GitHub pull request を複数の専門エージェントで分析し、inline comment として findings を出す research preview と説明されている。

Claude Security はそれらと重なるが、位置づけは少し違う。Code Review は PR の差分や変更周辺を中心に、merge 前の品質確認を担う。`/security-review` は開発者が手元や CI 上で使う on-demand review に近い。Claude Security は、プロジェクトやリポジトリを選び、スキャン履歴を持ち、findings を export し、webhook で外部システムへ流せる。つまり、**開発者体験よりも、セキュリティ運用の backlog と監査証跡に寄った製品**だ。

この違いは、日本企業での導入順にも関係する。小さく試すなら `/security-review` や PR review から始めやすい。一方、セキュリティ部門が複数リポジトリを横断して見たい、重大度別に backlog を作りたい、週次で scan cadence を決めたい、Jira や Slack や SIEM 的な運用へつなぎたいなら Claude Security の方が話が合う。

## 考察: 日本企業では AppSec の初動を短くする用途が本命

ここからは考察だ。

日本の開発組織で脆弱性対応が詰まりやすいのは、検知そのものよりも、検知後の初動だ。アラートが出ても、どのサービスに影響するのか、再現できるのか、既存仕様なのか、誰が owner なのか、どの程度急ぐべきなのかを判断するのに時間がかかる。少人数の AppSec チームでは、全リポジトリの初期調査を丁寧に見る余裕がない。

Claude Security が効くとすれば、ここだ。高リスクな findings から再現手順と修正案を出し、必要なら Claude Code の remediation session へ渡せるなら、セキュリティ担当は「全部読む人」ではなく、「AI が作った初期分析をレビューし、優先度と責任者を決める人」に寄せられる。これは、以前書いた [GitHub Dependabot の AI エージェント修復](/blog/github-dependabot-ai-agent-remediation-2026/) と同じ方向にある。検知から修復 PR までの間に残る人力の谷を、AI が埋めに来ている。

ただし、SAST や dependency scanner を置き換えるものとして扱うのは危ない。公式ヘルプ自身も、スキャンは確率的で、従来の静的解析と違って固定パターンだけを適用するものではないと説明している。これは強みでもあり、弱みでもある。ロジックレベルの脆弱性を見つけやすくなる可能性がある一方で、毎回同じ結果が出る前提では運用できない。

## 考察: 導入前に見るべき制約は4つある

日本企業が先に確認すべき制約は、少なくとも4つある。

1つ目は、GitHub 限定であることだ。GitHub.com 上のリポジトリだけを対象にするなら、全社標準の SCM と合うかを確認する必要がある。モノレポが大きい会社では、チュートリアルが推奨するように、directory や module 単位で scope を切る設計も必要になる。

2つ目は、Zero Data Retention との関係だ。公式 FAQ では No ZDR と明記され、法令や利用ポリシー対応のためにデータを保持する場合があると説明されている。金融、医療、公共、受託開発では、この一点だけで導入範囲がかなり変わる。機密性の高い repository を最初の対象にしない判断もあり得る。

3つ目は、課金と cadence だ。週次スキャンが推奨例として挙がっているが、全リポジトリに無差別で走らせると、費用もレビュー backlog も膨らむ。初期は、インターネット公開サービス、決済、認証、管理者権限、個人情報処理のある repository に絞るのが現実的だ。

4つ目は、レビュー責任だ。Claude Security が recommended fix を出しても、そのまま merge してよいわけではない。コード owner、セキュリティ担当、QA、必要なら法務や委託先管理まで、既存の責任分界にどう接続するかを決める必要がある。OpenAI 側でも [Codex 向けの高度なアカウント保護](/blog/openai-advanced-account-security-codex-2026/) が出ているように、AI コーディング時代の焦点は「作れるか」から「誰の権限で、どこまで直してよいか」へ移っている。

## まとめ

Claude Security の公開ベータは、Anthropic がセキュリティ領域を Claude Code の補助機能から、組織運用の製品へ押し出しているサインだ。リポジトリをスキャンし、findings を管理し、重大度や再現手順や修正案を出し、export や webhook で既存運用へつなぐ。これは日本企業の AppSec 初動を短くする可能性がある。

一方で、導入は軽くない。GitHub 前提、Enterprise 前提、Extra Usage 前提、No ZDR、確率的スキャン、直接トークン課金という制約がある。日本企業が試すなら、全社展開ではなく、まずは対象 repository を絞り、週次 cadence と owner と支出上限を決め、既存の SAST や手動レビューと並べて評価するのがよい。

今回のポイントは、AI が脆弱性を「自動で直す」ことではない。脆弱性対応の中で一番止まりやすい、再現、優先度付け、修正案作成、監査証跡化の初動をどこまで短くできるかだ。Claude Security は、その実務にかなり近いところへ踏み込んできた。

## 出典

- [Use Claude Security](https://support.claude.com/en/articles/14661296-use-claude-security) - Claude Help Center, accessed 2026-05-02
- [Getting started with Claude Security](https://claude.com/resources/tutorials/getting-started-with-claude-security) - Claude, accessed 2026-05-02
- [Automated Security Reviews in Claude Code](https://support.claude.com/en/articles/11932705-automated-security-reviews-in-claude-code) - Claude Help Center, 2026-03-16
- [Set up Code Review for Claude Code](https://support.claude.com/en/articles/14233555-set-up-code-review-for-claude-code) - Claude Help Center, accessed 2026-05-02
