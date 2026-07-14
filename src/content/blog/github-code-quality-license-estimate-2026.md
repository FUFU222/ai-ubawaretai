---
title: 'GitHub Code Quality見積もりで読む費用統制'
description: 'GitHub Code Qualityの見積もり公開を整理。日本企業が7月20日のGA課金前に、active committer、Actions minutes、AI Creditsをどう棚卸しするか解説する。'
pubDate: '2026-07-14'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'CodeQL', 'SaaSコスト管理', '従量課金', '管理者設定']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月13日**、**GitHub Code Quality のライセンス見積もり**を Billing and licensing 画面で見られるようにしたと発表した。Code Quality は 2026年7月20日に一般提供へ移り、そこから課金対象になる。今回の更新は、その前に enterprise 全体で有効化済みリポジトリの active committer 数と、標準価格ベースの月額見積もりを確認できるようにするものだ。

これは単なる請求画面の小さな改善ではない。日本企業で GitHub Enterprise Cloud や GitHub Team を広く使っている場合、Code Quality の有効化範囲、CodeQL の Actions minutes、AI Credits を使う機能、Copilot Autofix の扱いが、7月20日を境に予算と運用の話へ変わる。以前扱った [Copilot予算API](/blog/github-copilot-budget-user-states-api-2026/) や [Copilot部門予算UI](/blog/github-copilot-cost-center-budgets-ui-2026/) は Copilot 側の使用量統制だった。今回の Code Quality 見積もりは、コード品質・静的解析側にも同じように FinOps の見方が必要になる、という知らせである。

同時に、この話はセキュリティ運用ともつながる。[CodeQL AI検査](/blog/github-codeql-ai-prompt-injection-2026/) で整理したように、GitHub は AI アプリ向けの prompt injection 検査まで CodeQL 側へ広げている。[GitHub secret scanning名称変更](/blog/github-secret-scanning-ai-detected-names-2026/) と同じく、AI agent 時代の安全運用は、機能を有効にするだけでは終わらない。どのリポジトリで、誰の変更を、どの費用モデルで検査するかまで決める必要がある。

## 事実: Code Qualityの見積もりカードが出た

GitHub Changelog によると、今回の見積もりは billing entity の Billing and licensing ページから Licensing を開き、Code Quality card で確認する。表示されるのは consumed licenses と estimated monthly payment である。GitHub は、Code Quality が public preview の間は無料だが、一般提供後に課金対象になるため、組織が継続利用するか判断できるようにするための見積もりだと説明している。

重要なのは、見積もりの範囲である。GitHub は、この estimate が **per-committer license cost** だけを反映すると明記している。CodeQL analysis が消費する GitHub Actions minutes や、GitHub Copilot Autofix のような AI-powered capabilities の usage-based charges は含まれない。また、標準の list pricing に基づくため、個別契約の discount も反映しない。

つまり、表示された月額は「最終的な総額」ではない。むしろ、最低限のライセンス影響を見るための入口として読むべきである。Code Quality を広く有効化している企業では、この数字だけで安心せず、Actions minutes と AI Credits の履歴を別に見なければならない。

## 事実: GA後は三つの費用が別々に効く

GitHub Docs の Code Quality billing は、2026年7月20日の一般提供後に、組織へ三種類の費用が発生すると説明している。第一は GitHub Actions minutes である。Code Quality scan は GitHub Actions workflow として走るため、self-hosted runners を使わない限り Actions minutes を消費する。

第二は GitHub AI Credits である。Code Quality のうち AI model を使う機能は AI Credits を消費し、1 AI credit は 0.01 USD とされている。GitHub は Code Quality が一定品質の分析を出すために調整された model、prompt、system behavior の組み合わせを使うと説明し、model switching はサポートしないとしている。ここは Copilot Chat のモデル選択とは違う。管理者が安いモデルへ切り替えて費用調整する設計ではない。

第三は active committer に基づく license usage である。Code Quality が有効な repository に対して、少なくとも1つの commit を持つ unique active committer がライセンス消費に入る。GitHub Docs は、過去90日以内に push された commit を基準に active committer を扱い、GitHub App bot は無視されると説明している。複数リポジトリに貢献していても、組織または enterprise 全体で重複を避けて測る設計である。

GitHub Changelog は、Code Quality が GitHub Enterprise Cloud と GitHub Team で利用可能で、GitHub Enterprise Server では利用できないとも整理している。一般提供後の価格は active committer あたり月額10ドルである。日本企業では、開発者だけでなく外部委託先、兼務者、短期参加者、bot ではない machine account が active committer に入るかどうかを確認する必要がある。

## 分析: 日本企業はリポジトリ単位ではなく組織単位で見る

ここからは分析である。

日本の開発組織で最初に起きやすい誤解は、「Code Quality を有効にしたリポジトリの数」で費用を見てしまうことだ。実際には active committer が軸になる。たとえば、同じ50人が20リポジトリに commit している場合と、別々の200人が20リポジトリに commit している場合では、費用の見え方が違う。リポジトリ数だけでは判断できない。

次に、preview 中に広げた有効化範囲をそのまま残すリスクがある。無料 preview では、まず広く試す判断は合理的だったかもしれない。しかし GA 後は、ライセンス、Actions minutes、AI Credits の三つが別々に効く。重要リポジトリ、規制対象システム、顧客データを扱うサービス、AI agent が頻繁に PR を出すリポジトリなら有効化の価値は高い。一方で、凍結済み、サンプル、検証用、個人色の強い repository まで同じ設定で残すと、説明しづらい費用になりやすい。

さらに、Code Quality は品質と安全性の議論でもある。CodeQL analysis、Copilot Autofix、AI model を使う分析が、どの finding を出し、誰が triage し、どの修正を受け入れるかを決めなければ、費用を払っても運用は良くならない。AI が提案する autofix は便利だが、仕様、権限、データ移行、監査要件まで自動で保証するものではない。

日本企業では、情シス、セキュリティ、開発基盤、FinOps、各プロダクトチームの責任分界を先に置くべきだ。情シスが請求を見るだけ、セキュリティが finding を見るだけ、開発チームが勝手に有効化するだけ、という分断ではうまくいかない。Code Quality の有効化範囲、Actions minutes の上限、AI Credits の予算、例外承認、finding の SLA を一枚の運用表にする必要がある。

## GA前に確認する5項目

第一に、Billing and licensing の Code Quality card で consumed licenses と estimated monthly payment を確認する。これは最終額ではなく、active committer ライセンス部分だけの見積もりとして扱う。個別割引や Actions minutes、AI Credits が入らない前提を、社内説明に必ず添える。

第二に、Code Quality が有効な repository 一覧を出す。特に、preview 期間に一括有効化した organization、検証用 repository、休眠 repository、委託先が一時的に commit する repository を分ける。7月20日以降も有効にする理由を、重要度、言語対応、リスク、運用担当者の観点で整理する。

第三に、Actions minutes を別に見る。GitHub Docs は、preview 中でも Code Quality scan が Actions minutes を消費すると説明している。GA 後に active committer 課金だけを見ていると、scan frequency や monorepo の重さによる Actions 側の増分を見落とす。

第四に、AI Credits を Copilot 予算管理と合わせて見る。Code Quality の AI-powered capabilities は、Copilot の chat や agentic workflow とは別の経路で AI Credits を使う可能性がある。[Copilot部門予算UI](/blog/github-copilot-cost-center-budgets-ui-2026/) で扱ったような cost center 管理と、Code Quality の有効化範囲を別々に運用すると、部門別の費用説明が難しくなる。

第五に、Copilot Autofix の責任範囲を明文化する。GitHub Docs は、Copilot Autofix が code scanning alert の修正提案を生成し、LLM が codebase と code scanning analysis を使うと説明している。提案はレビューを助けるが、承認の責任は人間とチームに残る。AI 提案を受け入れる条件、拒否する条件、再発防止の記録を決めるべきだ。

## まとめ

GitHub Code Quality のライセンス見積もり公開は、7月20日の一般提供前に有効化範囲を見直すための実務的な合図である。見積もりカードが示すのは active committer ベースの license cost であり、Actions minutes、AI Credits、個別割引までは含まない。

日本企業が見るべき焦点は、単に「高いか安いか」ではない。どの repository に Code Quality を残すか、AI Credits と Actions minutes をどう予算化するか、Copilot Autofix の提案を誰が確認するか、finding をどの SLA で直すかである。AI agent 時代のコード品質管理は、セキュリティ機能と費用統制を同じ運用表で見る段階に入っている。

## 出典

- [GitHub Code Quality license estimate in public preview](https://github.blog/changelog/2026-07-13-github-code-quality-license-estimate-in-public-preview/) - GitHub Changelog, 2026-07-13
- [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality) - GitHub Docs
- [About GitHub Code Quality](https://docs.github.com/en/code-security/concepts/about-code-quality) - GitHub Docs
- [Enabling GitHub Code Quality](https://docs.github.com/en/code-security/how-tos/maintain-quality-code/enable-code-quality) - GitHub Docs
