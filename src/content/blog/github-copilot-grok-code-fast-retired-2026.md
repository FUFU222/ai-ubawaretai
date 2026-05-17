---
title: 'GitHub CopilotでGrok廃止、代替モデル運用点検'
description: 'GitHub CopilotでGrok Code Fast 1が2026年5月15日に廃止。日本の開発組織が代替モデル、model policy、AI Credits、agent実行の固定設定をどう棚卸しするか整理する。'
pubDate: '2026-05-17'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'AIコーディング', '開発者ツール', 'エンタープライズAI', '管理者設定']
draft: false
series: 'github-copilot-2026'
---

GitHub Copilotで **Grok Code Fast 1** が使えなくなった。GitHubは **2026年5月15日** のChangelogで、Copilot Chat、inline edits、ask / agent mode、code completions を含むすべてのCopilot体験から Grok Code Fast 1 を廃止したと発表した。代替として案内されているのは **GPT-5 mini** と **Claude Haiku 4.5** だ。

これは小さなモデル一覧の更新に見えるが、日本の開発組織ではかなり実務的な意味を持つ。すでに [GitHub CopilotでGPT-5.2廃止へ。日本チームの6月移行点検](/blog/github-copilot-gpt-52-codex-retirement-2026/) で見たように、Copilotのモデルは継続的に入れ替わっている。さらに [Copilot使用量レポート、6月のAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/) の文脈では、モデル選択は品質だけでなく予算管理にも直結する。今回のGrok廃止は、**速く安いコーディングモデルを固定していたチームが、標準モデルと管理者ポリシーを棚卸しするきっかけ** として見るべきだ。

## 事実: Copilot上のGrok Code Fast 1は廃止済み

GitHubの公式Changelogが明記した事実はシンプルだ。**2026年5月15日** に、Grok Code Fast 1 は GitHub Copilot の全体験から廃止された。対象には、Copilot Chat、inline edits、ask mode、agent mode、code completions が含まれる。つまり、IDEのチャットだけではなく、補完、編集、エージェント実行まで横断的に外れたということだ。

代替としてGitHubが示しているのは **GPT-5 mini** と **Claude Haiku 4.5** である。どちらも軽量寄りの候補として扱いやすいが、Grok Code Fast 1 と同じ挙動を保証するものではない。ここを「自動で似たモデルに置き換わる」と雑に理解すると、agent modeやCLI連携で失敗しやすい。

GitHub Docsの supported models ページでも、Grok Code Fast 1 は model retirement history に移っており、退役日は **2026-05-15** とされている。同じページでは、Copilotが複数モデルを用途やプラン、クライアントごとに提供し、モデルの可用性は変わりうると説明されている。これは、モデル名を社内手順書やスクリプトに固定する運用ほど、定期的な見直しが必要になるという意味でもある。

## xAI APIの退役とCopilotの廃止は分けて読む

今回の背景には、xAI側のモデル退役もある。xAIのmigration docsは、**2026年5月15日 12:00 PM PT** 以降、`grok-code-fast-1` を含む複数の旧モデルを退役させると案内している。xAI APIでは、退役後のリクエストが `grok-4.3` へリダイレクトされる扱いも説明されている。

ただし、ここをGitHub Copilotにそのまま当てはめてはいけない。GitHub Changelogが言っているのは、Copilot体験からGrok Code Fast 1を廃止し、代替としてGPT-5 miniまたはClaude Haiku 4.5を使うよう案内している、ということだ。xAI APIのリダイレクト仕様は、xAIへ直接APIを投げる開発者には重要だが、Copilotのmodel pickerや組織ポリシーが `grok-4.3` へ自動的に置き換わるという話ではない。

日本企業ではこの区別が大事になる。個人がxAI APIで検証しているプロジェクトと、会社がGitHub Copilot Business / Enterpriseで管理している開発環境では、契約、管理者設定、ログ、費用負担が異なる。今回のニュースを読むときは、**xAI API利用者の移行** と **GitHub Copilot利用者の代替モデル確認** を別タスクとして扱うほうが安全だ。

## 日本の開発組織で問題になるのは固定設定

ここからは分析だ。

Grok Code Fast 1は、速さとコーディング用途の扱いやすさから、試験的にagent作業へ使っていたチームが少なくないはずだ。Copilot上で明示的に選んでいた人もいれば、Auto model selectionや拡張機能の既定動作を通じて使っていた人もいる。問題は、モデルが消えたことそのものより、**どこでモデル名や期待品質を固定していたか** である。

まず見るべきは、個人のVS Code設定や社内ドキュメントだ。`Grok Code Fast 1を選ぶ` と書いた手順が残っていれば、利用者は5月15日以降に同じ選択ができない。次に、Copilot CLI、agent mode、cloud agent運用の説明資料を見る必要がある。[Copilot cloud agent API化、内製自動化の実装論点](/blog/github-copilot-cloud-agent-rest-api-2026/) で整理したように、Copilotは手元のチャットから、外部システムや内製ポータルに組み込まれる方向へ広がっている。そこでモデル名やモデル特性を前提にしていると、廃止の影響は画面上の選択肢以上に大きくなる。

さらに、管理者ポリシーも確認が必要だ。GitHubのChangelogは、Copilot Enterprise管理者が代替モデルへのアクセスをmodel policyで有効化する必要がある場合がある、と案内している。つまり、ユーザーが「代替はGPT-5 miniかClaude Haiku 4.5」と知っていても、組織側で許可されていなければmodel pickerに出ない。日本企業では、技術評価を開発部門が行い、モデル許可を情シスやプラットフォーム管理者が持つことが多い。ここが同期していないと、廃止済みモデルを起点にした問い合わせだけが増える。

## 代替モデルは用途で分けて評価する

GitHubが示した代替は、GPT-5 mini と Claude Haiku 4.5 だ。どちらか一方を全社標準にする前に、用途を分けて評価したほうがよい。

日常的な補完、短い質問、軽い修正案の生成では、GPT-5 miniを標準候補にしやすい。GitHub Docsのmultiplier表でも、GPT-5 miniは軽量な選択肢として扱われている。AI Credits移行が近い組織では、まずここを既定の逃げ道にするのが現実的だ。

一方で、仕様を読みながらの説明、テスト方針の整理、複数ファイルをまたぐ軽めのagent実行では、Claude Haiku 4.5を比較対象に入れる価値がある。特に日本語での説明やレビューコメント生成を多く使うチームでは、モデル差が体感されやすい。ただし、評価は「返答が好みか」だけでは足りない。速度、途中停止、長い文脈への耐性、社内ルールに沿った出力、コスト感を同じタスクで比べる必要がある。

ここで、前回の [GitHub Copilot Memory、個人設定をどう管理するか](/blog/github-copilot-memory-user-preferences-2026/) ともつながる。個人のpreferencesやmemoryが増えるほど、モデル切替時に「前のモデルではうまくいった指示」が別モデルで効かなくなる可能性がある。代替モデル評価では、単発プロンプトではなく、普段のpreferencesや社内テンプレートを含めて試したほうが実態に近い。

## 5月中にやるべき棚卸し

今回の廃止を受けて、日本の開発組織がやるべきことは大きく4つだ。

1つ目は、**Grok Code Fast 1を前提にした記述を探すこと**。社内Wiki、導入ガイド、VS Code推奨設定、研修資料、AIコーディングのベストプラクティスを検索する。モデル名が見つかったら、GPT-5 miniとClaude Haiku 4.5のどちらを案内するか、またはAuto model selectionへ戻すかを決める。

2つ目は、**Copilot Business / Enterpriseのmodel policyを確認すること**。代替モデルが許可されているか、特定のチームだけ制限されていないか、Auto model selectionに委ねる範囲はどこまでかを確認する。特に金融、製造、公共系のようにモデル制限を強くかける業種では、廃止されたモデルの除去より、代替モデルの許可フローが先に詰まりやすい。

3つ目は、**AI Credits前提で軽量モデルの標準を決めること**。6月以降、Copilotは利用面とモデルで費用の見え方が変わる。Grok Code Fast 1を「速く安い標準」として扱っていたなら、その穴をGPT-5 mini、Claude Haiku 4.5、Autoのどれで埋めるかを決めないと、現場は高性能モデルへ流れやすい。

4つ目は、**agent実行の失敗時ルールを更新すること**。モデル廃止直後は、以前の挙動を期待したプロンプトやテンプレートが壊れやすい。agentが思ったより長く考える、短く終わる、ファイル変更の粒度が変わるといった差は、代替モデルの品質というより運用設計の問題として扱うべきだ。

## まとめ

GitHub CopilotのGrok Code Fast 1廃止は、単に1つのモデルが消えたという話ではない。Copilotが多モデル運用を前提にするほど、モデルの追加、廃止、代替、管理者ポリシー、AI Creditsが同時に効くようになる。特に日本企業では、現場の使いやすさと、情シス・購買・プラットフォーム部門の統制がずれやすい。

事実としては、Grok Code Fast 1は2026年5月15日にCopilot全体から廃止済みで、GitHubはGPT-5 miniとClaude Haiku 4.5を代替として案内している。分析としては、今回やるべきことは新モデル探しではなく、**固定設定、社内ガイド、model policy、AI Credits前提の軽量モデル標準を点検すること** だ。6月のAI Credits移行を前に、モデル棚卸しの優先度はさらに上がっている。

## 出典

- [Grok Code Fast 1 deprecated](https://github.blog/changelog/2026-05-15-grok-code-fast-1-deprecated/) - GitHub Changelog, 2026-05-15
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Grok Model Retirement on May 15, 2026](https://docs.x.ai/developers/migration/may-15-retirement) - xAI Docs
