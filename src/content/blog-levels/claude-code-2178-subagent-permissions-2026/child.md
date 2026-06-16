---
article: 'claude-code-2178-subagent-permissions-2026'
level: 'child'
---

Claude Code 2.1.178 は、AI に「何をしてよいか」を細かく決めるための更新です。大きなポイントは、ツールをただ許可するだけでなく、ツールに渡す内容まで見てルールを書けるようになったことです。

たとえば、AI に別の subagent を呼ばせること自体は便利です。しかし、高いモデルを使う subagent、ファイルを書き換える subagent、MCP で社内データを読む subagent を全部同じ扱いにすると危険です。今回の更新では、`Tool(param:value)` のような書き方で、ツールの入力条件に合わせて許可や禁止を決めやすくなりました。

## subagentを使う前に確認が入る

もう一つ大事なのは、subagent を起動する前の確認が強くなったことです。これまでは、メインの AI が直接できないことを subagent に頼むと、確認の抜け道になる可能性がありました。2.1.178 では、subagent を起動する前に auto mode の classifier が評価するようになりました。

これは、会社で使うときに重要です。AI を何人もの小さな担当者に分けると、調査、テスト、修正、レビューを並行して進められます。ただし、担当者が増えるほど権限も増えます。調査だけの subagent、テストだけの subagent、コードを直してよい subagent を分けておく必要があります。

## MCPは便利だが注意が必要

MCP は、AI が外部ツールや社内データへつながるための仕組みです。GitHub、チケット管理、社内 wiki、ファイル共有、データベースなどにつながると、AI はかなり便利になります。

しかし、MCP は読むだけでも注意が必要です。AI の文脈に社内情報が入るからです。さらに、書き込みできる MCP なら、チケットを更新したり、ファイルを変えたり、外部サービスを呼んだりする可能性があります。

今回の更新では、subagent の禁止ツール設定で MCP server-level specs が無視されていた問題も修正されました。つまり、subagent にどの MCP を見せないかを決める設定が、より期待どおりに働く方向へ直されています。

## nested .claudeはチーム別ルールに使える

2.1.178 では、作業している場所に近い `.claude` 設定が優先されるようになりました。大きなリポジトリの中に、フロントエンド、バックエンド、データ基盤、モバイルアプリが入っている場合、それぞれに合った skills や workflows を置きやすくなります。

これは便利です。フロントエンドでは画面レビュー用の skill、バックエンドではAPI設計用の workflow、データ基盤ではSQLレビュー用の設定、という分け方ができます。

ただし、誰でも自由に `.claude` を変えられると危険です。AI の作業ルールそのものが変わるからです。会社で使うなら、`.claude` の変更もコードと同じようにレビューするほうが安全です。

## 会社で最初に決めること

まず、Claude Code のバージョンを確認します。subagent や MCP を使うチームは、2.1.178 以降にそろえるのがよいです。

次に、作業の種類を分けます。調査、テスト、軽い修正、重要な修正、セキュリティ作業、顧客データを扱う作業を同じ権限にしないことが大切です。

そして、subagent ごとに役割を決めます。調査用は読むだけ、テスト用は決まったコマンドだけ、実装修正用は決まったフォルダだけ、というように分けます。MCP も全員に同じものを見せず、必要なものだけにします。

最後に、`.claude` 設定の持ち主を決めます。誰が作り、誰がレビューし、どのチームに適用するのかをはっきりさせます。

## まとめ

Claude Code 2.1.178 は、AI の能力を増やすというより、会社で安全に使うための権限管理を細かくした更新です。

日本の開発チームでは、AI に何でも許可するのではなく、作業ごと、subagent ごと、MCP ごとに「ここまでならよい」を決めることが重要になります。便利な AI エージェントほど、先にルールを作っておく必要があります。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic, accessed 2026-06-16
- [@anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code) - npm package metadata
- [Claude Code settings](https://docs.anthropic.com/en/docs/claude-code/settings) - Anthropic Docs
