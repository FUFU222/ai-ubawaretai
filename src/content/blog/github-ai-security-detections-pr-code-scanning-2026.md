---
title: 'GitHub AI検出、PRセキュリティをどう運用するか'
description: 'GitHub AI検出がPRのcode scanningに入った。日本企業がCodeQL default setup、GitHub Code Security、Copilotライセンス、AI Creditsと人間レビューをどう分担するか整理する。'
pubDate: '2026-07-15'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'CodeQL', 'セキュリティ', 'AIエージェント', 'SaaSコスト管理']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年7月14日**、pull request上のcode scanningに**AI-powered security detections**を表示する公開プレビューを発表した。CodeQLが標準でカバーしていない言語やフレームワークにもAIベースの検出を広げ、PRがmergeされる前に潜在的な脆弱性を見つけやすくする更新である。

これは、[CodeQL AI検査でprompt injectionをSASTに入れた流れ](/blog/github-codeql-ai-prompt-injection-2026/)とは別の層にある。CodeQLの新queryは決定的な静的解析の拡張だが、今回のAI検出はPR差分上の追加シグナルであり、GitHubはAIラベル付きのinformational findingとして扱う。つまり「CodeQLを置き換える」ではなく、「CodeQLの届きにくい領域へ助言を増やす」と読むべきだ。

同じ7月14日には[Copilot appのsecurity review](/blog/github-copilot-app-security-review-2026/)も出ている。こちらは開発者が作業中に`/security-review`を呼ぶオンデマンドの自己点検で、今回のAI-powered security detectionsはPRのcode scanning面に出る。さらに[Code Quality見積もり](/blog/github-code-quality-license-estimate-2026/)で扱ったように、GitHubのAIセキュリティ機能はAI Creditsやライセンス管理とも結びつき始めている。

## 事実: PR上にAIラベル付きの検出が出る

GitHub Changelogによると、AI-powered security detectionsはpull requestが作成または更新されたときに動き、結果が返り次第PR上へ表示される。開発者はConversationやFiles changedの流れで、CodeQLのalertと並んでAIによるfindingを確認できる。

GitHubは、AIで生成されたalertには`AI`ラベルが付くと説明している。これは実務上かなり重要だ。CodeQL queryの結果とAIベースの助言を同じ重さで扱うと、誤検知や責任範囲の説明が難しくなる。ラベルがあることで、レビュー担当者は「再現性の高い静的解析結果」と「AIによる追加シグナル」を分けて triage できる。

対象は、CodeQLのbuilt-in analysisがまだ十分に届かない言語やフレームワークである。GitHub Docsは例として、PHP、Shell/Bash、TerraformのHCL、Dockerfile、JavaのJSP、C#のBlazorなどを挙げている。検出カテゴリは、文字列結合によるinjection、弱い暗号、access controlの不備、sensitive data exposureなどである。

ただし、AI-powered findingsはadvisoryであり、mergeをblockしない。GitHub Docsは、AI-powered findingsはPR上でのみ利用でき、repositoryのSecurity viewにbacklog alertとして残るものではないとも説明している。つまり、組織の脆弱性台帳やSLA管理へそのまま載る通常alertとは扱いが違う。

## 事実: CodeQL default setupとライセンスが前提になる

今回の機能は、単にCopilotを契約すればどこでも動くものではない。GitHub ChangelogとDocsは、利用条件としてGitHub Code Security、CodeQL default setup、enterprise policyでの許可、organization levelでの有効化を挙げている。公開プレビュー中はGitHub Copilotライセンスも必要で、AI Creditsを消費する。

ここで混同しやすいのは、AI検出の実行主体とCodeQLの関係である。GitHub Docsは、AI analysisそのものはCodeQLが行うわけではないが、AI detection engineは機能するためにCodeQL default setupへ依存すると説明している。したがって、CodeQLをまだdefault setupで展開していない組織では、まず前提設定から確認する必要がある。

また、AI scanはCodeQL statusとは独立して走る。CodeQL default setupが待機中または失敗状態でも、AI-powered detectionsは実行され得る。結果はsourceごとに戻り次第表示されるため、PR上ではAI findingが先に出たり、CodeQL結果が先に出たりする可能性がある。

日本企業の管理者が見るべきポイントは、技術的な有効化だけではない。GitHub Code Securityの対象リポジトリ、Copilotライセンスの割当、AI Creditsの予算、enterprise policy、organizationごとの有効化権限を同じ表で管理する必要がある。[secret scanningのAI検出名整理](/blog/github-secret-scanning-ai-detected-names-2026/)でも見たように、AIが関わる検出は機能名、課金、監査説明がずれやすい。

## 分析: 「止める検査」と「助言する検査」を分ける

ここからは分析である。

日本企業が今回の更新で最初に決めるべきことは、AI-powered security detectionsをmerge gateにしない、という線引きである。GitHub自身がadvisoryでmergeをblockしないと説明している以上、組織側がこれをrequired checkのように扱うには無理がある。

止める検査は、再現性があり、組織ポリシーへ載せやすく、監査時に説明できるものに寄せるべきだ。CodeQL、secret scanning、Dependabot、unit test、required review、CODEOWNERS、branch protectionがこの層に入る。AI-powered security detectionsは、PRレビュー中に追加で見る助言として扱うほうが現実的である。

一方で、助言だから軽視してよいわけではない。CodeQLがカバーしていない言語やフレームワーク、または標準queryが届きにくいパターンでは、AI検出が最初の違和感になる可能性がある。特に日本企業では、Terraform、Shell、Dockerfile、社内管理画面、古いJava/JSP、.NET系の画面などが混在しやすい。そこにAIの追加シグナルが出る価値はある。

重要なのは、findingの扱いをPR上で明文化することだ。たとえば、AIラベル付きfindingは「確認必須、merge blockではない」と定義する。重大度が高く、開発者も妥当と判断したものは修正する。誤検知または業務上問題ないと判断するなら、PRコメントか本文に理由を残す。これならAIの助言が監査可能な人間判断へ変わる。

## 実務: 小さく有効化し、費用も同時に見る

導入順序は小さく始めるのがよい。最初から全organizationで有効化するのではなく、CodeQL default setupが安定しているリポジトリ、かつPRレビュー文化があるチームから始める。認証、認可、顧客データ、ファイルアップロード、インフラ設定を扱うサービスが候補になる。

次に、PRテンプレートへAI検出の確認欄を入れる。ただし「AI findingゼロでなければmerge禁止」とは書かない。代わりに、「AIラベル付きfindingを確認したか」「修正しないfindingの理由を書いたか」「CodeQLとsecret scanningの結果も確認したか」を短く入れる。

三つ目に、セキュリティ担当者が週次でサンプルを見る。AI検出のうち、どのカテゴリが妥当だったか、誤検知が多いカテゴリは何か、開発者がどう判断したかを確認する。ここで得た知見を、レビューガイドや開発者教育へ戻す。

四つ目に、AI Creditsを追う。公開プレビュー中でも、GitHubはAI security detectionsがAI Creditsを消費すると説明している。Copilot ChatやCopilot appだけでなく、code scanning面のAI検出も予算管理に入るなら、月次のAI Credits増加を「誰が何を使ったか」へ分解しないと説明しづらくなる。

五つ目に、[GitHub MCP Serverのsecret scanning](/blog/github-mcp-server-security-scanning-2026/)のような作業中検査と、PR上のAI検出を分けて説明する。MCP経由の検査は開発者のagent session内でのpre-commit安全網、今回のAI detectionsはPR上のcode scanning安全網である。どちらも便利だが、記録の残り方と承認責任は違う。

## 注意点: AI検出を承認者にしない

最も避けるべき説明は、「AI検出を通ったから安全」という言い方である。AI-powered detectionsは、false positiveもfalse negativeもあり得る。GitHub Docsも、AI-based toolとして誤検知が含まれる可能性を示し、feedback mechanismで品質改善につなげる設計だと説明している。

また、AI検出はPR上のみで、backlog alertとしてSecurity viewへ残らない。つまり、長期的な脆弱性管理、SLA、例外承認、監査レポートの中心にするには向かない。発見した問題を本当に台帳へ載せるなら、issue化、security review記録、または別の脆弱性管理プロセスへ移す必要がある。

日本企業では、委託先開発や多段レビューが多い。AI findingを誰が確認し、誰が修正し、誰が例外を承認するのかを曖昧にすると、後で「AIが問題ないと言った」といった責任のない説明になりやすい。PR上のAI findingは、あくまで判断材料であり、承認者は人間と組織である。

## まとめ

GitHubのAI-powered security detectionsは、PR上のcode scanningへAIの追加シグナルを持ち込む更新である。CodeQLが届きにくい言語やフレームワークに対し、AIラベル付きのadvisory findingを出すことで、merge前のレビューを厚くできる。

ただし、これはCodeQL、secret scanning、Dependabot、人間レビューの代替ではない。日本企業は、AI検出を「止める検査」ではなく「助言する検査」として導入し、CodeQL default setup、GitHub Code Security、Copilotライセンス、AI Credits、PRテンプレート、例外判断をセットで設計するべきである。

## 出典

- [Code scanning shows AI security detections on pull requests](https://github.blog/changelog/2026-07-14-code-scanning-shows-ai-security-detections-on-pull-requests/) - GitHub Changelog, 2026-07-14
- [AI-powered security detections in pull requests](https://docs.github.com/en/code-security/concepts/code-scanning/ai-powered-security-detections) - GitHub Docs
- [Code scanning](https://docs.github.com/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning) - GitHub Docs
- [Application card: GitHub security and quality AI features](https://docs.github.com/en/code-security/responsible-use/security-and-quality-ai-features) - GitHub Docs
