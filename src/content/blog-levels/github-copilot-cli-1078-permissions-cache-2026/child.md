---
article: 'github-copilot-cli-1078-permissions-cache-2026'
level: 'child'
---

GitHub Copilot CLI `v1.0.78-0` は、開発者がターミナルで使う AI agent の細かい運用を変える prerelease です。大きなモデル追加ではなく、作業中の権限切り替え、sandbox 内の build cache、長い session の再開、外部 client からの session 終了が主な更新です。

特に見ておきたいのは `/permissions` です。これは、Copilot CLI の session 中に approval mode を切り替えるための command です。AI に調査だけを頼む段階と、file を変更させたり test を実行させたりする段階では、必要な権限が違います。途中で mode を切り替えられると便利ですが、会社で使う場合は、いつ強い権限へ切り替えてよいかを決めておく必要があります。

もう一つは `allowDevToolCaches` です。GitHub の release note では、この設定が既定で有効になり、sandboxed build が toolchain cache や package registry、installation directory を使いやすくなると説明されています。つまり、sandbox の中で build や test をするとき、毎回すべてを取り直す遅さを減らす方向です。

この更新は実用的です。AI agent に修正を頼んでも、test が毎回遅ければ現場では使いにくくなります。ただし、cache には過去の build artifact や package 情報が残ることがあります。共有 CI worker、委託先端末、複数プロジェクトを扱う VDI では、cache をどこまで共有してよいかを確認したほうが安全です。

この話は、以前の [Copilot CLI 1.0.71のAutopilot記事](/blog/github-copilot-cli-1071-autopilot-plan-2026/) とつながります。Autopilot では AI がより自律的に作業を進めます。今回の `/permissions` と cache 設定は、その自律作業をどの権限と実行環境で動かすかという実務の話です。

## 何を確認すればよいか

最初に、開発端末の種類を分けます。社員の専用端末、共有 VDI、委託先端末、CI worker では、cache や権限の考え方が違います。社員端末なら許せる設定でも、委託先端末や共有 worker では project ごとの分離が必要になるかもしれません。

次に、approval mode の使い分けを決めます。調査だけなら弱い mode、file edit や command 実行なら強い mode、外部 network や deployment に近い操作なら人間承認を強める、といった段階を作ります。`/permissions` は便利ですが、利用者が毎回その場で判断するだけでは、チーム運用としては弱くなります。

3つ目は、MCP toolset の確認です。今回の release には、明示的に設定した GitHub MCP toolset や tool config を尊重する修正も含まれています。MCP は AI agent が外部 tool を使う入口です。会社で許可した tool と実際に CLI が使う tool がずれると、監査や事故調査が難しくなります。

## 長いsessionも管理対象になる

今回の更新では、長い transcript の描画と session resume も改善されています。これは、長時間の AI 作業を再開しやすくする変更です。便利ですが、transcript には指示、file path、error、tool の出力、社内 URL などが含まれる可能性があります。

そのため、session 履歴を誰が見られるのか、どれくらい保存するのか、監査で取り出すときにどう扱うのかを決める必要があります。[Copilot遠隔操作の管理端末制限](/blog/github-copilot-remote-control-managed-devices-2026/) で扱ったように、AI agent は端末の外からも確認・操作される場面が増えています。履歴と操作権限はセットで考えるべきです。

## まとめ

Copilot CLI 1.0.78 は、AI agent をより速く、使いやすくする更新です。ただし、企業で見るべき点は機能名ではありません。`/permissions` で権限をどう切り替えるか、sandbox cache をどの端末で許すか、MCP toolset が意図通りか、長い session 履歴をどう管理するかです。

日本の開発チームは、いきなり全員へ prerelease を配るより、代表的な repository と端末で検証するのがよいでしょう。小さく試し、cache、権限、MCP、履歴の4点を確認してから標準設定へ入れるのが現実的です。

## 出典

- [Release 1.0.78-0](https://github.com/github/copilot-cli/releases/tag/v1.0.78-0) - GitHub Copilot CLI, 2026年7月31日
- [GitHub Copilot CLI README](https://github.com/github/copilot-cli) - GitHub
- [Copilot CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference) - GitHub Docs
