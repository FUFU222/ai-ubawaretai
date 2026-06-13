---
article: 'anthropic-claude-fable-mythos-access-suspension-2026'
level: 'child'
---

Anthropic は 2026年6月12日、Claude Fable 5 と Claude Mythos 5 のアクセスを停止した。Fable 5 は6月9日に発表されたばかりの高性能モデルで、Mythos 5 は Project Glasswing のような防御的サイバーセキュリティ用途に限って提供されるモデルだった。

今回のニュースで大事なのは、「新しいAIモデルが止まった」という一点だけではない。企業がAIモデルを業務や開発ツールに組み込むとき、そのモデルはいつでも同じ条件で使えるとは限らない、ということだ。

## 何が起きたか

Anthropic の声明によると、米国政府の指令を受けて、Fable 5 と Mythos 5 へのアクセスを止める必要が出た。Claude Help Center の release notes にも、6月12日の項目としてアクセス停止が記録されている。

6月9日の発表では、Fable 5 は Claude API、Amazon Bedrock、Vertex AI、Microsoft Foundry などで使えるモデルとして説明されていた。Mythos 5 は、Project Glasswing に参加する承認済み顧客向けの限定モデルだった。どちらも強い能力を持つモデルとして発表されたが、数日後に利用できない状態になった。

GitHub Copilot にも影響が出た。GitHub は Fable 5 を Copilot で使えると発表していたが、その後、Anthropic の発表を受けて Copilot 全体で Fable 5 へのアクセスを停止したと追記した。ほかの Claude モデルは影響を受けないとされている。

## どこに影響するか

影響を受けるのは、Claude を直接使う人だけではない。GitHub Copilot、IDE、CLI、クラウドエージェント、社内AIツールの中で、どのモデルが使われているかによって影響が変わる。

たとえば、ある開発チームが Fable 5 を前提にコードレビューや長い設計調査を試していた場合、同じ品質や速度が別モデルで出るかを確認する必要がある。単にモデル名を切り替えれば終わり、とは限らない。

また、Fable 5 には30日間のデータ保持が必要という条件もある。顧客情報、ソースコード、契約書、医療や金融のデータを扱う会社では、どのモデルにどの情報を入れてよいかを事前に決めておく必要がある。

## 日本企業が確認すること

まず、自社が Fable 5 や Mythos 5 を使っていたかを確認する。Claude API だけでなく、GitHub Copilot、Bedrock、Vertex AI、Foundry、社内AI gateway、開発者のIDE設定も見る。

次に、代わりに使うモデルを決める。Claude Opus 4.8 や Sonnet 系など、影響を受けていないモデルで同じ作業ができるかを試す。コードレビュー、文書要約、セキュリティ調査、長い資料の分析など、業務ごとに確認したほうがよい。

さらに、AIモデルの台帳を作る。モデル名、提供会社、使っているツール、データ保持、使ってよいデータ、使ってはいけないデータ、代替モデルをまとめる。AIを業務で使うなら、モデルもクラウドサービスやSaaSと同じように管理対象になる。

## まとめ

今回の停止は、AIモデルが強くなるほど、技術だけでなく調達、契約、規制、データ管理も一緒に考える必要があることを示している。

日本企業は、最新モデルを使うこと自体を避ける必要はない。ただし、1つのモデルに業務を依存させすぎず、止まった時の代替手段、データ保持の条件、利用者への説明を準備しておくべきである。

## 出典

- [Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access) - Anthropic, 2026-06-12
- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) - Claude Help Center, 2026-06-12
- [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) - Anthropic, 2026-06-09
- [Claude Fable 5 is generally available for GitHub Copilot](https://github.blog/changelog/2026-06-09-claude-fable-5-is-generally-available-for-github-copilot/) - GitHub Changelog, 2026-06-09
