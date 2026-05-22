---
article: 'github-copilot-web-models-limited-2026'
level: 'child'
---

GitHub Copilotには、いろいろなAIモデルがあります。2026年5月20日、GitHubはWeb版のCopilot Chatで使えるモデルを少し減らすと発表しました。

対象になったのは、Gemini 2.5 Pro、Gemini 2.5 Flash、GPT-5.2 Codex、GPT-5.4 nanoです。大事なのは、これらがCopilot全体から全部なくなる、という話ではないことです。GitHubは、VS CodeやJetBrainsなど、別の場所では引き続き使える場合があると説明しています。

## Web版とIDE版は同じではない

Copilotは、1つの画面だけで使うものではありません。

GitHub.comのWeb画面で使うCopilot Chatもあります。VS Codeで使うCopilot Chatもあります。JetBrainsやVisual Studio、CLI、cloud agentなどで使うものもあります。

だから、あるモデルが「Copilotで使える」と言っても、すべての場所で同じように見えるとは限りません。Web版では選べないけれど、IDEでは選べる、ということがあります。

## なぜ会社で気にするのか

個人で少し使うだけなら、「あれ、モデルが減った」で終わるかもしれません。でも会社で使う場合は、もう少し大事です。

会社では、どのモデルを使ってよいか、どれくらいお金を使ってよいか、どの画面で使うかを決める必要があります。モデルによって費用が違うこともあります。だから、モデル一覧が変わると、社内ルールや説明も変えなければいけない場合があります。

このサイトでも、[Copilot Auto model selection](/blog/github-copilot-auto-model-selection-vscode-2026/)や[GitHub CopilotのAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/)を扱いました。どちらも、モデルをどう選び、どう管理するかという話です。

## 消えたように見えても確認する

今回の発表で大事なのは、「GeminiがCopilotから消えた」とすぐ決めつけないことです。

正しくは、Copilot Chat on webで一部モデルが使えなくなる、という話です。別のクライアントでは使えるかもしれません。会社の管理者が許可していないために表示されない場合もあります。地域や契約の条件で違うこともあります。

モデルが見えないときは、まず次の順番で確認するとよいです。

1つ目は、どの画面で使っているかです。Web版なのか、VS Codeなのかを確認します。

2つ目は、会社の管理者設定です。管理者がそのモデルを許可していなければ、ユーザーには表示されません。

3つ目は、GitHubの最新情報です。モデルは追加されることも、外れることもあります。

## 社内ガイドは短くする

会社でCopilotを使うなら、社内ガイドはモデル名の長い一覧より、使い分けを短く書くほうがよいです。

たとえば、「Web版で見える標準モデルを使う」「難しい修正はVS CodeのCopilot Chatで相談する」「高いモデルを使うときは理由を書く」のようなルールです。

[Gemini 3.5 FlashのCopilot一般提供](/blog/github-copilot-gemini-35-flash-ga-2026/)のように新しいモデルが増えることもあれば、今回のようにWeb版で減ることもあります。だから、特定のモデル名だけに頼るルールは壊れやすいです。

## まとめ

今回のGitHub Copilot Web版モデル削減は、AIモデルが増えるニュースではありません。むしろ、使える場所によってモデル一覧が変わることを思い出させるニュースです。

子ども向けに言えば、同じ「道具箱」でも、教室にある道具箱と家にある道具箱の中身が少し違う、という話です。会社でCopilotを使うなら、どの道具箱に何が入っているかを、管理者がきちんと確認する必要があります。

## 出典

- [Updates to available models in Copilot on web](https://github.blog/changelog/2026-05-20-updates-to-available-models-in-copilot-on-web/) - GitHub Changelog, 2026-05-20
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Requests in GitHub Copilot](https://docs.github.com/en/copilot/concepts/billing/copilot-requests) - GitHub Docs
