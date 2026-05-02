---
title: 'GitHub CopilotでGPT-5.2廃止へ。日本チームの6月移行点検'
description: 'GitHubが2026年5月1日、Copilot内のGPT-5.2とGPT-5.2-Codexを6月1日に廃止すると告知した。代替モデル、管理者ポリシー、7.5倍課金、日本の開発組織が5月中に見直す点を整理する。'
pubDate: '2026-05-02'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'Codex', 'AIコーディング', '開発者ツール', 'エンタープライズAI']
draft: false
series: 'github-copilot-2026'
---

GitHub Copilotの **GPT-5.2 廃止** が、2026年6月1日に迫っている。GitHubは **2026年5月1日** の公式Changelogで、Copilot Chat、inline edits、ask / agent mode、code completions で使われている **GPT-5.2** と **GPT-5.2-Codex** を、**Copilot Code Reviewを除いて6月1日に廃止** すると告知した。代替は、GPT-5.2が **GPT-5.5**、GPT-5.2-Codexが **GPT-5.3-Codex** だ。

このニュースの重さは、単にモデル名が入れ替わることではない。すでにこのサイトでは [GitHub CopilotでGPT-5.5一般提供開始。日本チームは何を見極めるべきか](/blog/github-copilot-gpt-55-general-availability-2026/) や [GitHub Copilot code reviewが6月からActions minutes課金対象に。日本チームは何を見直すべきか](/blog/github-copilot-code-review-actions-minutes-2026/) を追ってきたが、今回はその延長で **標準モデルの棚卸し、管理者ポリシー、利用コストの説明責任** が同時に発生する。とくに日本企業では、Auto任せで回していたチームと、明示的にモデルを固定していたチームで影響の出方が違う。

## 2026年5月1日にGitHubが何を告知したのか

まず事実を整理する。GitHubのChangelogは、**2026年6月1日** をもって次の2モデルをCopilot全体から外すと案内している。

- GPT-5.2: 代替は GPT-5.5
- GPT-5.2-Codex: 代替は GPT-5.3-Codex

例外は **Copilot Code ReviewにおけるGPT-5.2-Codex** だけで、そこは廃止対象から外れている。ここは地味だが重要だ。つまり、同じ `GPT-5.2-Codex` でも、IDEやCLIやchatでは消える一方、code review では当面残る。最近の [GitHub CopilotのVisual Studio更新でcloud agent直起動へ。日本の.NET開発は何が変わるか](/blog/github-copilot-visual-studio-cloud-agent-2026/) でも触れたように、CopilotはIDE補助とagent実行、review自動化が別々のコスト構造と運用ポリシーを持ち始めている。今回の廃止告知も、その分化がさらに進んだと見るべきだろう。

GitHub Docsの supported models ページでも、GPT-5.2 と GPT-5.2-Codex は現時点ではGAとして並んでいる。一方で同じページの retirement history では、両者とも **2026-06-01** で退役予定となっている。つまり、**「今は使えるが、来月からは前提にできない」** 状態だ。

## 代替モデルは何が違うのか

ここも事実と実務を分けて見る必要がある。GitHub Docsの model comparison では、**GPT-5.2 は deep reasoning and debugging**、**GPT-5.2-Codex は agentic software development** と整理されている。代替として示された **GPT-5.5** は深い推論寄り、**GPT-5.3-Codex** はエージェント実行寄りだ。

つまり移行は、単に「新しい版に差し替える」ではない。

- GPT-5.2 を使っていた人: 深い推論やデバッグ用途なら GPT-5.5 を試す
- GPT-5.2-Codex を使っていた人: CLI や agent mode の実行寄り用途なら GPT-5.3-Codex を試す

ここで見落としやすいのが **Auto model selection** だ。supported models の表では、Auto の候補に **GPT-5.3-Codex、GPT-5.4、GPT-5.4 mini** などは含まれているが、**GPT-5.5 は入っていない**。したがって、GPT-5.2 廃止後に「Autoなら自然に上位モデルへ行くだろう」と考えるのは危ない。**GPT-5.5 を使わせたい組織は、Auto任せではなく明示的な有効化とガイドが必要** になる。

## 日本企業で一番重いのはコストと管理者設定

ここから先は分析だ。

今回の移行で日本企業が詰まりやすいのは、性能より **コスト倍率** と **モデルポリシー** だと思う。supported models の multiplier 表では、**GPT-5.2 は 1x**、**GPT-5.2-Codex も 1x**、**GPT-5.3-Codex も 1x** だが、**GPT-5.5 は 7.5x の promotional multiplier** とされている。つまり、GPT-5.2 から GPT-5.5 への移行は、使い方を変えずに進めると **利用単価の感覚が一気に変わる**。

この差は、日本の開発組織ではかなり説明が必要だ。たとえば、個人の VS Code で断続的に使うだけなら吸収できても、Copilot CLI や agent mode を日常運用に入れているチームでは、試行回数や再指示回数が積み上がる。4月後半に出た [GitHub Copilot code reviewの課金変更](/blog/github-copilot-code-review-actions-minutes-2026/) と合わせると、Copilotは完全に「seat課金だけ見ればよいツール」ではなくなっている。

さらに、GitHub Docsの configure access ページでは、**個人プランはそのまま使えるが、Copilot Business / Enterprise では管理者がモデルアクセスを有効化・無効化できる** と説明している。ここが日本企業では運用差になる。

- 個人利用や小規模チーム: 使えるかどうかの問題は小さい
- Business / Enterprise: 管理者が GPT-5.5 と GPT-5.3-Codex を許可しているかが先に効く

しかも Docs は、**Auto model selection も組織ポリシーに従う** と明記している。つまり、管理者が代替モデルを開けていなければ、ユーザー側は廃止後に「なぜ選べないのか」で止まりうる。

## 5月中に何をやるべきか

日本の開発組織が5月中にやるべきことは、派手ではないが明確だ。

1つ目は、**どこで GPT-5.2 / GPT-5.2-Codex を使っているか洗い出すこと**。Copilot Chat、CLI、agent mode、inline edits を分けて見ないと、code review だけ例外で残る事実を見落としやすい。

2つ目は、**代替モデルを用途ごとに分けて決めること**。GPT-5.2 の代わりを一律で GPT-5.5 にするとコスト説明が先に立つ。設計相談や難しい原因調査だけ GPT-5.5 に寄せ、日常の agent 実行は GPT-5.3-Codex や Auto に寄せるほうが現実的だろう。

3つ目は、**Business / Enterprise の管理者がモデルポリシーを確認すること**。GitHubが5月1日に告知したからといって、ユーザー全員の model picker が自動で整うわけではない。組織側で代替モデルが開いているかを見ないと、6月1日に利用者が詰まる。

4つ目は、**社内ガイドを短くても更新すること**。`GPT-5.2 は6月1日で終了`、`推論用途はGPT-5.5`、`agent用途はGPT-5.3-Codex`、`コストが跳ねる用途ではAutoも候補` くらいまでを書いておくだけでも、混乱はかなり減る。

## まとめ

GitHub Copilotの GPT-5.2 廃止告知は、2026年5月1日に出た小さめの changelog だが、日本の開発組織にとっては **6月1日までの運用切替タスク** を意味する。事実として押さえるべきなのは、**GPT-5.2 は GPT-5.5 へ、GPT-5.2-Codex は GPT-5.3-Codex へ置き換わる** こと、ただし **Code Review の GPT-5.2-Codex は例外的に残る** こと、そして **GPT-5.5 は 7.5x で Auto 候補にも入っていない** ことだ。

分析としては、今回の本質はモデル更新ではなく、**どの用途にどのモデルを割り当て、誰がそれを有効化し、どの予算で説明するか** にある。5月中に棚卸しとガイド更新まで終えておけるかで、6月の混乱はかなり変わるはずだ。

## 出典

- [Upcoming deprecation of GPT-5.2 and GPT-5.2-Codex](https://github.blog/changelog/2026-05-01-upcoming-deprecation-of-gpt-5-2-and-gpt-5-2-codex/) - GitHub Changelog, 2026-05-01
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [AI model comparison](https://docs.github.com/en/copilot/reference/ai-models/model-comparison) - GitHub Docs
- [Configuring access to AI models in GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models) - GitHub Docs
