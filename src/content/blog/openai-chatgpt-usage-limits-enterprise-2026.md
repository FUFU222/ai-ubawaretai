---
title: 'ChatGPT Usage limits、月次credit統制の実務'
description: 'ChatGPT Usage limitsがEnterprise/Eduに追加。日本企業が7月15日の週次limit移行前に、部門別credit上限、Codex高利用者、承認導線をどう設計すべきか整理する。'
pubDate: '2026-06-19'
category: 'news'
tags: ['OpenAI', 'ChatGPT', '管理者設定', 'SaaSコスト管理', '企業導入', 'ガバナンス']
draft: false
series: 'openai-security-controls'
---

OpenAI は **2026年6月18日**、ChatGPT Enterprise / Edu 向けに **Usage limits** を追加した。Workspace settings から workspace、group、user 単位で月次 credit 上限を設定し、想定外の高額利用を抑えるための管理機能である。

この更新は、単なる請求画面の整理ではない。ChatGPT と Codex が同じ企業 workspace の中で広がるほど、利用量の多い部門、開発者、業務 agent、分析担当者を同じ固定席数だけでは管理しにくくなる。すでに [ChatGPTアプリ権限の管理](/blog/openai-chatgpt-app-permissions-enterprise-2026/) や [ChatGPT Libraryの管理者統制](/blog/openai-chatgpt-library-admin-controls-2026/) で見たように、OpenAI の企業向け更新は、便利な機能を出すだけでなく、誰に何をどこまで許すかを管理者へ戻す方向に進んでいる。

日本企業にとって重要なのは、**2026年7月15日** の移行期限だ。OpenAI の Help Center は、既存の Permissions & roles にある週次 limit が、7月15日に月次 workspace / group default へ自動移行されると説明している。稟議、部門配賦、月次締めで SaaS 費用を見ている会社では、このタイミングまでに「誰に何 credit を割り当てるか」を決めないと、現場の使い勝手と予算管理の両方で混乱しやすい。

## 何が追加されたのか

今回の Usage limits は、ChatGPT Enterprise / Edu の管理者と owner が、workspace 内ユーザーの月次 credit 利用に上限を置くための機能だ。OpenAI の説明では、上限は calendar month 単位で、UTC の月次 window でリセットされる。設定できるのは管理者と owner で、member や analytics viewer は設定できない。

設定レイヤーは大きく3つある。第一に workspace limit で、workspace 全体のユーザーに月次上限を置く。第二に group limit で、特定 group の各ユーザーへ別の月次上限を置く。第三に user limit、つまり個別ユーザーの override である。たとえば全社標準は低めに置き、開発基盤チームやデータ分析チームだけ高めにし、さらに一部の power user へ個別上限を与える、といった設計ができる。

ここで重要なのは、上限が「部署全体の合計」ではなく、基本的には各ユーザーへ適用される点だ。group limit も、その group の各ユーザーに適用される月次 cap として読む必要がある。日本企業でよくある「部門予算は月30万円まで」のような管理をそのまま移植するのではなく、部門内の人数、利用職種、想定 workflow、Codex 利用の有無を合わせてユーザー単位へ落とす必要がある。

また、利用者が上限に達したときの request flow も用意されている。管理者は増枠申請を受け付けるか、無効化するか、社内の申請ページなど custom destination に誘導するかを選べる。承認された増枠は一時的な例外ではなく、user override として残る。したがって、申請をその場しのぎで承認すると、翌月以降の予算にも影響する。

## 週次limitから月次limitへ移る意味

OpenAI は、既存の Workspace settings -> Permissions & roles -> weekly limits は当面残るが、新しい Usage limits が設定されている場合はそちらが優先されると説明している。さらに、7月15日には残っている weekly limits が monthly workspace / group default へ自動移行され、その後は weekly limits が効かなくなる。

これは、日本企業の管理者にとって見逃しにくい変更だ。週次 limit は「短期的な使いすぎを止める」感覚で運用しやすい。一方、月次 limit は請求、部門配賦、月次の利用レビューと相性がよい。経理や情報システムは月次で見やすくなるが、現場から見ると、月初に大きく使った人が月後半に止まりやすくなる。

たとえば、月初にリリース前の仕様整理、Codex の大きな修正依頼、データ分析、資料作成が重なったユーザーは、月後半の通常業務で上限に近づく可能性がある。逆に週次 limit では毎週小さく回復していた使い方が、月次では「今月の残り枠」を意識する形になる。ユーザー教育では、単に上限額を伝えるだけでは足りない。どの作業が credit を大きく使うのか、上限に近いときは何を控えるのか、増枠をどの条件で申請するのかまで説明する必要がある。

この話は [OpenAI Codex座席設計](/blog/openai-chatgpt-business-codex-seats-2026/) ともつながる。Codex-only seat や workspace credits が広がるほど、ChatGPT の通常会話、Codex の長時間作業、Deep Research、画像生成、音声、分析系の高負荷利用が同じ予算線上に乗る。Usage limits は、その共有 pool をユーザーや group に割り当てる現実的な管理面になる。

## 優先順位はどう決まるか

OpenAI の FAQ では、複数の limit がある場合の優先順位も説明されている。まず user override が見られ、次に該当する group default のうち最も高いもの、最後に workspace default が適用される。どれもなければ、既存の Permissions & roles 側の limit が fallback として残る場合がある。

この優先順位は、運用設計にかなり効く。たとえば workspace default を 5,000 credits、開発 group を 7,000 credits、データ分析 group を 8,000 credits にしたとする。あるユーザーが開発 group とデータ分析 group の両方に入っていれば、より高い 8,000 credits が適用される。さらに、そのユーザーに 6,000 credits の user override がある場合、user override が優先される。

つまり、group を増やしすぎると、管理者が意図しない高い上限が適用されることがある。日本企業では、組織 group、職種 group、プロジェクト group、委託先 group が重なりやすい。ChatGPT の usage limit 用 group を既存の SSO group そのままにすると、権限管理と予算管理が混ざりすぎる可能性がある。

現実的には、最初から細かくしすぎないほうがよい。全社標準、開発・データ分析など高利用 group、期間限定 PoC group、委託先・外部協力者 group のように、予算意味が明確な単位から始める。必要に応じて user override を使うが、override には理由、期限、承認者、見直し月を残すべきだ。

## 日本企業で効く場面

一番効くのは、ChatGPT と Codex の正式導入が広がり始めた企業だ。PoC の段階では、少人数の利用なら上限を細かく決めなくても運用できる。しかし Business / Enterprise / Edu の workspace が大きくなり、開発、営業、法務、総務、経理、データ分析、CS で使い方が分かれると、同じ上限では不公平になりやすい。

開発チームでは、Codex の利用量が突出しやすい。大きな repository を読ませる、複数の agent 作業を並列に走らせる、長いレビューやテスト修正を任せると、通常の ChatGPT 会話より credit 消費が重くなることがある。[Codex支出管理の設定](/blog/openai-codex-business-spend-controls-2026/) で扱ったように、開発 agent は便利さと消費量が同時に伸びる。Usage limits は、この伸びを「禁止」ではなく「予算枠と承認」に変える道具として使える。

バックオフィスや企画部門では、Deep Research、資料作成、表計算、ファイル分析の利用が増える。月末や四半期末に集中する会社では、月次上限が業務ピークと衝突する可能性がある。ここでは、通常月と繁忙月で上限を変えるのか、個別申請で対応するのか、最初に決めておく必要がある。

教育機関では、学生、教職員、研究室、事務局で使い方が違う。Edu workspace でも同じ Usage limits が対象になるため、授業期間、試験期間、研究プロジェクト、事務処理で上限の意味が変わる。特定研究室や授業だけ高い limit を置く場合、年度途中での見直しと申請導線が重要になる。

## 移行前に決めること

まず、7月15日までに現在の weekly limits を棚卸しする。誰に、どの group に、どの週次上限が設定されているかを確認し、それが月次 default に移ってよいのかを判断する。週次の4倍を単純に月次にすればよいとは限らない。月初集中、月末集中、長時間 task、休暇期間を考える必要がある。

次に、group の意味を決める。SSO group をそのまま使うのか、Usage limits 用に別 group を作るのかを分ける。予算統制では、組織図よりも利用目的で group を切ったほうが分かりやすいことがある。たとえば「開発高利用」「業務自動化PoC」「標準利用」「外部委託」のような group だ。

第三に、増枠申請の行き先を決める。OpenAI の機能上は Pending Requests で承認できるが、日本企業では稟議、部門長承認、情シス ticket、予算責任者の確認が必要なことも多い。社内の申請フォームに誘導するなら、なぜ増枠が必要か、期間、対象業務、想定 credit、代替手段を聞く設計にする。

最後に、ユーザー向け説明を用意する。上限は罰則ではなく、共有予算を守るための guardrail だと説明したほうがよい。利用者には、上限に近づいたときの対応、増枠申請、重い作業の分解、Codex や Deep Research を使うときの注意を短く伝える。管理者だけが理解していても、現場が月末に止まれば導入体験は悪くなる。

## まとめ

ChatGPT Enterprise / Edu の Usage limits は、workspace、group、user 単位で月次 credit 上限を置くための管理機能だ。2026年6月18日に追加され、7月15日には既存 weekly limits の自動移行が予定されている。

日本企業が見るべき焦点は、単に「上限を設定できるようになった」ことではない。ChatGPT、Codex、connected apps、workspace agents、分析機能が同じ企業 workspace に集まるほど、AI 利用は席数管理から credit 配分と承認運用へ移る。Usage limits は、その移行を管理するための実務的な部品である。

今すぐやるべきことは、現在の limit 棚卸し、月次 cap の設計、group の整理、増枠申請の運用、ユーザー説明の5つだ。7月15日の自動移行を待つのではなく、先に月次 credit 統制へ寄せておくほうが、現場の利用停止と予算超過の両方を避けやすい。

## 出典

- [Setting usage limits in ChatGPT Enterprise and Edu](https://help.openai.com/en/articles/20001001-setting-usage-limits-in-chatgpt-enterprise-and-edu) - OpenAI Help Center
- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [ChatGPT Business Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center
