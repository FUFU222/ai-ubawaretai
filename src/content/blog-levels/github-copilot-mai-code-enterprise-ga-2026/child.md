---
article: 'github-copilot-mai-code-enterprise-ga-2026'
level: 'child'
---

GitHub Copilot BusinessとEnterpriseで、**MAI-Code-1-Flash**というコーディング向けAIモデルが一般提供になった。Microsoftが作った軽量モデルで、短い作業を何度も繰り返すときの速さを重視している。

以前は個人向けプランから提供が広がっていたが、2026年6月26日の更新で会社向けプランでも正式に使える段階へ進んだ。ただし、会社の管理者が設定で許可するまでは利用者に開放されない。

## 軽量モデルとは何か

軽量モデルは、「品質が低く、使い物にならないモデル」という意味ではない。大きくて高価なモデルより、短い応答を速く返しやすく、日常の細かな作業へ使いやすいモデルだ。

たとえば、関数の意味を説明してもらう、短いtestを書く、型エラーの原因を探す、READMEの文章を直す、といった仕事が候補になる。答えをcompilerやtestで確認しやすい仕事なら、何度も試して改善しやすい。

反対に、会社全体の認証設計を変える、重要なdatabaseを移行する、大きなsecurity問題を直す、といった仕事では、軽量モデルだけに任せないほうがよい。より強いモデルへ切り替え、人間が慎重にreviewする必要がある。

## 会社では管理者が許可する

一般提供になっても、BusinessとEnterpriseで自動的に全員が使えるわけではない。管理者がCopilot settingsでMAI-Code-1-Flashのpolicyを有効にする必要がある。

この仕組みがあるため、会社は小さなteamだけで試してから全社へ広げられる。最初は、テストや社内ツールを担当するteamなど、結果を確認しやすい場所で試すとよい。

ここで大切なのは、モデルを「使えるようにすること」と「すべての仕事で使うこと」は別だという点だ。会社のルールには、Flashを使う仕事、Autoに任せる仕事、強いモデルへ切り替える仕事を書き分ける必要がある。

## 料金はtokenで決まる

CopilotのChatやagentでAIモデルを使うと、モデルへ送るinput token、再利用されるcached input token、モデルが返すoutput tokenが消費される。料金はAI Creditsという単位へ変換され、1 AI Creditは0.01米ドルとして計算される。

GitHub Docsでは、MAI-Code-1-Flashの100万token当たりの価格を次のように示している。

- inputは0.75米ドル
- cached inputは0.075米ドル
- outputは4.50米ドル

1回の質問だけを見るのではなく、仕事が終わるまで何回やり直したか、どれだけ長い答えを出したかを見る必要がある。安いモデルでも、長い会話を何度も繰り返せば費用は増える。

なお、普通のcode completionとnext edit suggestionはAI Creditsの対象外で、有料プランではunlimitedと説明されている。Chatやagentの費用と、入力中に出る補完は分けて考える。

## 同じ名前でも変化する

GitHub Docsには、MAI-Code-1-Flashが継続的に改善されるモデルだと書かれている。新しいcheckpointが出ると、同じモデル名でも性能や動きが変わる可能性がある。

これは改善をすぐ使える利点だが、会社では注意も必要だ。先月うまくいったtaskが、今月も同じ結果になるとは限らない。毎月、代表的なtaskをもう一度試し、testが通るか、reviewの修正が増えていないか、料金が変わっていないかを確認する。

## 日本の開発teamが試す順序

まず10件ほどの小さなtaskを選ぶ。日本語の仕様からtestを書く、既存codeを説明する、短いbugを直す、といった実際の仕事を使う。MAI-Code-1-Flashと現在使っているモデルで、速さ、正しさ、やり直し回数、AI Creditsを比べる。

次に、使ってよい仕事と、上位モデルへ切り替える仕事を一枚の表にする。最後に、管理者が限られたteamでpolicyを有効にし、結果を確認してから範囲を広げる。

先に扱った[MAI-Code-1-Flashの対応surface拡大](/blog/github-copilot-mai-code-flash-surfaces-2026/)と、[Copilot AI Creditsの予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)も合わせて読むと、モデルの場所と料金の関係を理解しやすい。

## まとめ

MAI-Code-1-Flashは、会社向けGitHub Copilotで使える、速さを重視した軽量コーディングモデルだ。管理者の許可が必要で、Chatやagentの利用はtoken単価からAI Creditsへ計算される。

日本の会社では、いきなり全員へ開放せず、小さく比較するのが安全だ。日常の短いtaskをFlash、難しいtaskを上位モデル、人間のreviewを最後の確認にする。さらに、モデルが継続更新されるため、毎月の再評価を忘れないことが重要になる。

## 出典

- [MAI-Code-1-Flash for Copilot Business and Copilot Enterprise](https://github.blog/changelog/2026-06-26-mai-code-1-flash-for-copilot-business-and-copilot-enterprise/) - GitHub Changelog, 2026-06-26
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) - GitHub Docs
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
