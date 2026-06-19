---
article: 'openai-chatgpt-usage-limits-enterprise-2026'
level: 'child'
---

OpenAI は 2026年6月18日、ChatGPT Enterprise と Edu の管理者向けに **Usage limits** という設定を追加した。これは、ChatGPT を使う人ごとに「1か月で使える credit の上限」を決めるための機能だ。

会社や学校で ChatGPT を使う人が増えると、よく使う人とあまり使わない人の差が大きくなる。開発者が Codex に大きなコード修正を頼んだり、企画担当が何度も資料を作ったり、研究者が長い調査をしたりすると、使う量が増えやすい。Usage limits は、そうした使いすぎをいきなり禁止するのではなく、あらかじめ予算の線を引くための仕組みだ。

## 何を設定できるのか

Usage limits では、主に3つの単位で上限を決められる。

1つ目は workspace limit だ。これは会社や学校の workspace 全体にいる人へ、基本の月次上限を置く設定である。たとえば「通常の利用者は毎月ここまで」と決めるイメージだ。

2つ目は group limit だ。開発チーム、データ分析チーム、授業用グループのように、特定の group にいる人へ別の上限を置ける。たくさん使う必要があるチームには高めの上限を設定し、あまり使わないチームには低めにすることができる。

3つ目は user limit だ。これは特定の人だけに個別の上限を置く設定である。たとえば、AI 活用を推進する担当者や、重要なプロジェクトで一時的にたくさん使う人に、特別な上限を付けられる。

## 7月15日が大事な理由

OpenAI の説明では、これまで Permissions & roles にあった週ごとの limit は、2026年7月15日に月ごとの limit へ自動で移される予定だ。それ以降、古い週次 limit は効かなくなる。

週ごとの上限と月ごとの上限は、使い方の感覚が違う。週ごとの上限なら、使いすぎても翌週にまた少し回復する。一方で月ごとの上限では、月初にたくさん使うと月末に残りが少なくなる。

だから管理者は、7月15日までに今の設定を確認しておいたほうがよい。単純に週の上限を4倍して月の上限にするだけでは、うまくいかないことがある。月末に忙しい部署、リリース前に Codex を多く使う開発チーム、試験前に使う教育機関などでは、使うタイミングが偏るからだ。

## どの上限が優先されるのか

複数の上限がある場合、OpenAI は優先順位を決めている。まず個別の user limit が見られる。次に、その人が入っている group の中で一番高い group limit が使われる。最後に workspace limit が使われる。

たとえば、会社全体の上限が 5,000 credits、開発 group が 7,000 credits、データ分析 group が 8,000 credits だとする。ある人が開発 group とデータ分析 group の両方に入っているなら、8,000 credits が使われる。もしその人に個別で 6,000 credits の user limit が設定されていれば、そちらが優先される。

このルールは便利だが、group が多すぎると分かりにくくなる。会社の部署 group、プロジェクト group、職種 group を全部そのまま使うと、管理者が思っていない上限が当たるかもしれない。最初は、標準利用、高利用、PoC、外部協力者のように、分かりやすい group から始めるほうが安全だ。

## 日本の会社ではどう使うべきか

日本企業では、AI の費用を月ごとに確認することが多い。Usage limits は、その管理と相性がよい。部門ごとに予算を決め、必要な人だけに高い上限を付け、使いすぎた人には申請してもらう、という運用にしやすい。

ただし、上限を低くしすぎると、便利な場面で止まってしまう。たとえば [OpenAI Codex座席設計](/blog/openai-chatgpt-business-codex-seats-2026/) のように、Codex を本格的に使うチームでは、普通の ChatGPT 利用より credit を多く使うことがある。管理者は、開発チームやデータ分析チームの利用量を、他の部署と同じにしないほうがよい。

また、ChatGPT の管理は費用だけではない。[ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) や [ChatGPT Library管理](/blog/openai-chatgpt-library-admin-controls-2026/) と同じように、誰に何を許すか、どのデータを使わせるか、どの操作に承認を求めるかも大事だ。Usage limits は、その中の「どれくらい使わせるか」を担当する機能だと考えると分かりやすい。

## まとめ

ChatGPT Usage limits は、Enterprise / Edu の管理者が、ユーザーごとの月次 credit 上限を決めるための機能だ。workspace、group、user の3段階で設定でき、2026年7月15日には古い週次 limit が月次 limit へ移る予定である。

管理者が今やるべきことは、今の週次 limit を確認し、月次の上限を決め、増枠申請のルールを作ることだ。上限は利用を止めるためだけのものではない。会社や学校の予算を守りながら、必要な人が必要なだけ AI を使えるようにするためのガードレールである。

## 出典

- [Setting usage limits in ChatGPT Enterprise and Edu](https://help.openai.com/en/articles/20001001-setting-usage-limits-in-chatgpt-enterprise-and-edu) - OpenAI Help Center
- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [ChatGPT Business Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center
