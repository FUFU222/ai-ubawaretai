---
article: 'anthropic-claude-containment-agent-security-2026'
level: 'child'
---

Anthropic Engineering は、Claude をいろいろな製品で安全に動かすための **containment**、つまり「封じ込め」の考え方を公開しました。これは、AI に悪いことをしないよう言い聞かせるだけではなく、AI が実際に触れるファイル、ネットワーク、認証情報、ツールの範囲を狭くする話です。

たとえば、AI が最初から認証情報を見られなければ、その情報を外へ送ることはできません。AI が特定のフォルダしか読めなければ、別のプロジェクトや顧客資料へ勝手に広がることもありません。Claude containment は、このように「できないこと」を環境側で決める設計です。

これは日本企業にも関係します。Claude Code を開発で使う、Claude Cowork のような desktop agent を業務で使う、MCP で社内ツールへつなぐ、といった使い方が増えるほど、AI がどこまで触れるかを先に決める必要があるからです。

## 何が新しいのか

Anthropic の記事では、claude.ai、Claude Code、Claude Cowork で封じ込め方が違うと説明されています。

claude.ai の code execution は、サーバー側の一時的な container で動きます。ユーザーの端末上で直接コードが動くわけではなく、filesystem も session ごとに限られます。そのぶん、できることは限定されますが、被害範囲は小さくなります。

Claude Code は、ユーザーの端末上で動きます。これは開発には便利です。実際の repository を読み、test を動かし、shell command を実行できるからです。しかし、その近さがリスクにもなります。端末上のファイル、ネットワーク、credential に近いため、permission や sandbox の設計が重要になります。

Claude Cowork は、一般の業務ユーザー向けに、VM を使った強い隔離を採った例として紹介されています。ユーザーが選んだ workspace だけを見せ、host 側の keychain や他の folder を見せないようにする考え方です。

## なぜ承認クリックだけでは足りないのか

AI ツールでは、危ない操作の前に「実行してよいですか」と聞くことがあります。これは大事な仕組みです。ただし、すべてを人間の確認に頼るのは難しいです。

開発者なら bash や PowerShell の command を読めるかもしれません。しかし、営業、法務、経理、総務の人が同じように command の意味を判断できるとは限りません。また、承認画面が何度も出ると、人はだんだん深く読まなくなります。

だから、AI エージェントでは「人が毎回見ればよい」ではなく、「そもそも workspace 外を読めない」「特定の domain にしか出られない」「MCP は read-only にする」「credential は sandbox に入れない」といった環境側の境界が重要になります。

## MCPは読むだけでも注意が必要

MCP は、AI が外部ツールや社内データへ接続するための仕組みです。GitHub、Jira、Slack、Google Drive、社内 API などにつながると、AI はかなり便利になります。

しかし、MCP が返す情報は AI の context に入ります。もし README、issue、wiki、ticket comment の中に AI への悪意ある指示が混ざっていたら、AI はそれを読んでしまう可能性があります。これは prompt injection の一種です。

そのため、MCP は「信頼できる会社の connector だから安全」とは言い切れません。connector のコードが安全でも、connector が読むデータに攻撃文が混ざることがあります。社内 wiki や顧客から受け取ったファイルでも同じです。

## 日本企業が確認すること

まず、AI エージェントがどこで動いているかを確認します。browser 上なのか、開発者端末なのか、container なのか、VM なのか、社内 runner なのかを分けます。

次に、見えるファイルを決めます。home directory 全体、desktop、download folder、顧客資料、credential cache を雑に見せないようにします。必要な workspace だけを mount し、read-only と read-write も分けます。

さらに、MCP と connector を棚卸しします。会社が承認したもの、個人が追加したもの、local MCP、remote MCP を分けます。顧客情報や production data に触るものは、特に慎重に扱います。

最後に、ログをどこで見るかを決めます。強い sandbox や VM は安全性を上げますが、EDR などの監視ツールから見えにくくなることがあります。隔離と監査はセットで考える必要があります。

## まとめ

Claude containment は、AI エージェントを安全に使うための基本設計です。大事なのは、AI に「注意して」と言うだけではなく、AI が触れる範囲を環境側で決めることです。

日本企業が Claude Code や MCP を使うなら、まず権限境界を確認するべきです。どの folder を読めるのか、どの network へ出られるのか、どの credential が見えるのか、どの connector が write できるのかを整理します。

AI エージェントは便利になるほど、強い権限を持ちます。だからこそ、便利さを広げる前に、被害範囲を小さく固定する設計が必要です。

## 出典

- [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude) - Anthropic Engineering, 2026-05-25
- [Security](https://docs.anthropic.com/en/docs/claude-code/security) - Anthropic Docs
- [Development containers](https://docs.anthropic.com/en/docs/claude-code/devcontainer) - Anthropic Docs
- [Careful Adoption of Agentic AI Services](https://www.ncsc.govt.nz/protect-your-organisation/careful-adoption-of-agentic-ai-services/) - NCSC-NZ, 2026-05-01
