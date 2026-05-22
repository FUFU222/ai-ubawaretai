---
title: 'GitHub Copilot Webモデル削減で管理者が見る点'
description: 'GitHub Copilot Web版のモデル選択肢削減を整理。Geminiや一部GPT系が外れた背景と、日本企業が管理者設定、AI Credits、社内ガイドで確認すべき点を解説する。'
pubDate: '2026-05-22'
category: 'news'
tags: ['GitHub Copilot', '管理者設定', 'AI モデル', 'SaaSコスト管理', '開発者ツール']
draft: false
series: 'github-copilot-2026'
---

GitHubが2026年5月20日、**Copilot on webで利用できるモデル一覧を整理した**。発表によると、Copilot Chat on webではGemini 2.5 Pro、Gemini 2.5 Flash、GPT-5.2 Codex、GPT-5.4 nanoが利用可能モデルから外れる。一方で、これらのモデルがCopilot全体から消えるという意味ではない。GitHubは、VS CodeやJetBrainsなど他のクライアントでは引き続き利用できる場合があると説明している。

これは大きな新機能発表ではない。しかし、日本企業のGitHub Copilot管理者には地味に重要だ。直近では[Copilot Auto model selectionのVS Code対応](/blog/github-copilot-auto-model-selection-vscode-2026/)や[Gemini 3.5 FlashのCopilot一般提供](/blog/github-copilot-gemini-35-flash-ga-2026/)のように、Copilot内のモデル選択肢が増えるニュースが続いていた。今回はその逆で、Web版のモデル棚を絞る話だ。モデルが増える局面だけでなく、減る局面にも運用が必要になる。

## 何が変わったのか

事実から整理する。

GitHub Changelogは、Copilot Chat on webで利用可能なモデルを更新すると説明している。削除対象として挙げられているのは、Gemini 2.5 Pro、Gemini 2.5 Flash、GPT-5.2 Codex、GPT-5.4 nanoだ。GitHubの書き方では、これはWeb版での選択肢変更であり、全クライアント共通のモデル廃止とは切り分けられている。

ここで重要なのは、Copilotの「モデルが使える」と言うとき、その意味がクライアントごとに違うことだ。GitHub DocsのSupported AI modelsでは、モデルの可用性は、プラン、機能面、クライアント、管理者ポリシー、地域制約などによって変わる。あるモデルがIDEで使えるからといって、GitHub.com上のWebチャットでも同じように使えるとは限らない。

また、Copilotの料金や消費単位はモデルごとに同じではない。Requests in GitHub Copilotの説明では、Copilot Chat、Copilot CLI、cloud agentなどの利用ではpremium requestやAI Creditsの考え方が関係する。つまり、モデル棚の変更はUI上の好みだけでなく、費用見積もり、社内説明、利用者教育にも波及する。

## Web版だけの変更として読む

今回の発表を読むとき、まず避けたいのは「GeminiがCopilotから消えた」と短絡することだ。

同じCopilotでも、Web、VS Code、JetBrains、Visual Studio、CLI、cloud agent、code reviewでは利用面が違う。GitHubはここ数か月、Copilotを単一のチャット製品ではなく、開発ワークフロー全体のAI基盤として広げている。だからモデルの追加や削除も、全体に一律でかかるとは限らない。

たとえば、[Gemini 3.5 FlashのCopilot一般提供](/blog/github-copilot-gemini-35-flash-ga-2026/)では、対応クライアント、対象プラン、Business/Enterpriseでの管理者ポリシー、premium request multiplierが論点だった。今回のWeb版モデル削減も、同じく「どの画面で、どのモデルを、誰が使えるか」を分けて見る必要がある。

日本企業では、開発者がVS CodeのCopilot Chatを使い、マネージャーや非開発職がGitHub.com上のIssueやPull Request画面からCopilot Chatを使う、という混在が起きやすい。Web版だけ選択肢が変わると、同じ社内ドキュメントを読んでいても、利用者ごとに見えるモデルが違う。問い合わせとしては「自分の画面にモデルがない」「社内ガイドと違う」という形で出る。

したがって、今回の更新は機能縮小として騒ぐより、社内ガイドをクライアント別に書き直すきっかけとして扱うのが現実的だ。モデル一覧を1枚の表で固定するのではなく、Web、IDE、CLI、agentのように利用面ごとに分ける。そのうえで、全員に共通する標準モデルと、特定用途だけで使う上位モデルを分けて説明する。

## モデル追加の流れと逆向きに見える理由

Copilot関連のニュースは、最近モデル追加に寄っていた。

GPT-5.5の一般提供、Gemini 3.5 Flashの追加、cloud agentやAuto model selectionの拡張など、表向きには「選べるモデルが増える」方向だ。一方で、[Grok Code Fast 1の廃止](/blog/github-copilot-grok-code-fast-retired-2026/)でも見たように、モデルの棚は増えるだけではない。外部モデルの提供条件、品質、価格、可用性、クライアント実装、地域制約が変われば、GitHub側の提供面も変わる。

ここから分かるのは、Copilotのモデル選択を固定的な製品仕様として見ないほうがよいということだ。モデルは、SaaSの機能というより外部依存を含む運用資産に近い。増えることもあるし、消えることもある。Webでは外れ、IDEでは残ることもある。

企業の管理者にとって重要なのは、個別モデル名を覚えることではない。モデル追加、制限、廃止、価格変更が起きても、社内の利用ルールが破綻しないようにすることだ。たとえば「軽い相談はAutoか標準モデル」「高倍率モデルは理由を残す」「モデルが見えない場合はクライアント別の可用性を確認する」というルールなら、モデル棚が変わっても運用を保ちやすい。

## AI Creditsの準備とつながる

今回の変更は、AI Creditsやpremium requestの運用ともつながる。

6月1日のusage-based billing移行を前に、[Copilot使用量レポートでAI Creditsを確認する話](/blog/github-copilot-ai-credits-usage-report-2026/)を扱った。そこでは、どの利用面で、どのモデルを、誰が、どれだけ使っているかを見る必要があった。今回のWeb版モデル削減は、その棚卸しに「クライアントごとの差」を足す話になる。

たとえば、Web版で軽量モデルや特定のCodex系モデルを使っていたユーザーが、別のモデルへ流れるかもしれない。あるいは、IDEでは引き続き使えるため、Web版からVS Codeへ利用が移るかもしれない。これはユーザー体験だけでなく、利用量や問い合わせ件数にも影響する。

ただし、今回の発表だけから「費用が上がる」「品質が下がる」と断定するのは早い。GitHubがWeb版のモデル棚を絞った理由や、各モデルの利用量までは明示されていない。ここから先は各社の観測が必要だ。管理者は、モデル変更前後でWeb版の利用回数、問い合わせ、IDE側への移行、AI Credits消費を見比べるべきだ。

特に日本企業では、GitHub Copilotの費用を部署別、プロジェクト別、子会社別に説明する必要が出やすい。モデル棚の変更を知らないまま月次レポートだけを見ると、なぜ特定チームの消費や問い合わせが変わったのかを説明しにくい。今回のような小さなChangelogも、運用メモとして残しておく価値がある。

## 日本企業が確認すべきこと

まず、社内のCopilotガイドに「Web版とIDE版でモデル一覧が違う場合がある」と明記する。これは利用者向けFAQに近い。モデルが見えないときに、契約不備、権限不備、障害、廃止のどれなのかを切り分けられるようにする。

次に、管理者設定で許可しているモデルと、実際に各クライアントで見えるモデルを照合する。BusinessやEnterpriseでは管理者ポリシーが効くため、GitHub側で利用可能でも組織として無効化していれば表示されない。逆に、意図せず高倍率モデルを許可している場合は、6月以降のコスト説明が難しくなる。

3つ目は、モデル名を前提にした社内手順を減らすことだ。「GPT-5.2 Codexを選ぶ」といった固定手順は、クライアント差や廃止に弱い。代わりに「Web版で選べる標準モデルを使う」「大きな修正はIDEのCopilot Chatかcloud agentに回す」「高難度調査は管理者が許可した上位モデルを使う」という作業別の表現に寄せる。

4つ目は、問い合わせ対応の準備だ。モデルが消えたとき、現場の利用者は発表を読んでいないことが多い。情シスや開発基盤チームは、短い社内告知を用意しておくとよい。内容は、対象はCopilot Chat on webであること、他クライアントでは可用性が異なること、利用できない場合の代替手順、費用影響を確認中であること、の4点で十分だ。

5つ目は、モデル変更を月次運用に入れることだ。Copilotはすでに、補完ツールではなく開発組織のAI実行基盤になっている。モデル棚の変更を見落とすと、品質、費用、教育、監査のズレが少しずつ溜まる。Changelogを見て社内ガイドに反映し、使用量レポートで結果を確認する流れを作るべきだ。

## まとめ

GitHub Copilot on webのモデル削減は、派手な新機能ではない。しかし、Copilotを企業導入している組織には、モデル運用が固定仕様ではなく継続的な管理対象になったことを示す更新だ。

日本企業が見るべきポイントは、削除されたモデル名そのものより、Web版、IDE版、CLI、agentでモデル可用性が違うという前提だ。社内ガイド、管理者ポリシー、AI Credits確認、問い合わせ対応をクライアント別に整える。Copilotのモデル棚は今後も増減する。だからこそ、モデル名を暗記する運用ではなく、変更に耐える運用を作ることが重要になる。

## 出典

- [Updates to available models in Copilot on web](https://github.blog/changelog/2026-05-20-updates-to-available-models-in-copilot-on-web/) - GitHub Changelog, 2026-05-20
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Requests in GitHub Copilot](https://docs.github.com/en/copilot/concepts/billing/copilot-requests) - GitHub Docs
