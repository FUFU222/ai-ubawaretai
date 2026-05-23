---
article: 'github-copilot-eclipse-open-source-2026'
level: 'child'
---

GitHub Copilot for Eclipse がオープンソースになりました。これは、Eclipse で Copilot が使えるようになった、というだけの話ではありません。Eclipse の中で AI がどのように補完し、チャットし、プロジェクトを読んで、外部ツールとつながるのかを、公開されたコードから確認しやすくなったという話です。

日本では、Java の業務システムや長く使われている社内開発環境で、まだ Eclipse が使われていることがあります。新しい AI 開発ツールは VS Code や JetBrains の話題が多いですが、すぐに IDE を変えられない現場もあります。そのようなチームにとって、Eclipse 版 Copilot の中身が見えるようになったことは、導入判断の材料になります。

## 何が見えるようになったのか

GitHub の発表によると、公開された GitHub Copilot for Eclipse では、コード補完、Next Edit Suggestions、Chat、Agent Mode、Skills、prompt files、BYOK、MCP 連携などの実装を確認できます。リポジトリは `microsoft/copilot-for-eclipse` で、MIT ライセンスです。

つまり、Eclipse の中で Copilot がどんな機能を持っているかを、単なる説明文だけでなくコードから追えるようになりました。AI ツールを会社で使うとき、「何を読んでいるのか」「どこにつながるのか」「どう設定するのか」はとても大事です。

特に Agent Mode や MCP は注意が必要です。Agent Mode は、AI がプロジェクトの文脈を見ながら作業を助ける機能です。MCP は、外部ツールやサービスとつなぐしくみです。便利ですが、会社のリポジトリや社内ツールに触れる可能性があるので、どこまで許すかを決めなければなりません。

## JavaやEclipseの現場に関係する理由

Eclipse は、最新の AI 開発ツールの中心ではないように見えるかもしれません。しかし、日本の業務開発では今も重要です。金融、製造、公共、SI の現場では、Eclipse に社内 plugin や独自のビルド手順が組み込まれていることがあります。

そのような現場では、IDE を変えるだけでも大きな作業になります。だから、既存の Eclipse を使いながら AI 支援を入れられるなら、現実的な選択肢になります。ただし、会社で使うなら「便利そうだから入れる」だけでは不十分です。公開されたコードを使って、セキュリティ、設定、更新方法を確認する必要があります。

たとえば、どの version から usage-based billing に合わせた表示が入るのか、どの設定で MCP を有効にするのか、問題が起きたときにどこへ報告するのかを確認できます。これは、閉じた拡張機能よりも説明しやすい点です。

## 会社で試すときの見方

まず、Eclipse を使っているチームが本当に残っているかを確認します。もしすでに VS Code や JetBrains へ移行しているなら、Eclipse 版を急いで入れる必要はありません。逆に、Eclipse が今後もしばらく残るなら、正式な AI 開発環境として評価する価値があります。

次に、管理ルールを他の Copilot とそろえます。たとえば、[VS Code の Copilot Auto model selection](/blog/github-copilot-auto-model-selection-vscode-2026/) ではモデル選択と課金の話が重要でした。[Copilot CLI の企業向け plugin 管理](/blog/github-copilot-cli-enterprise-plugins-2026/) では、会社が認めた拡張を配る考え方が出てきました。Eclipse 版も、別物としてではなく同じ Copilot 運用の中で考えるべきです。

最後に、更新運用を決めます。AI ツールは機能や料金表示が変わりやすいです。Eclipse plugin の version が古いままだと、使えてはいても、model picker や usage 表示が最新の説明と合わないことがあります。社内配布するなら、誰が更新を確認するのかも決めておく必要があります。

## まとめ

GitHub Copilot for Eclipse のオープンソース化は、Eclipse を使う Java 現場にとって、AI 開発支援を導入しやすくする更新です。ただし、見るべき点は「便利かどうか」だけではありません。

会社で使うなら、公開コードを使って、文脈の扱い、MCP、Agent Mode、課金表示、更新方法を確認することが大事です。Eclipse を使い続けるチームでは、AI を禁止するか自由に入れるかではなく、透明性のある形で安全に試すことが現実的な進め方になります。

## 出典

- [GitHub Copilot for Eclipse is open source](https://github.blog/changelog/2026-05-21-github-copilot-for-eclipse-is-open-source/) - GitHub Changelog, 2026-05-21
- [microsoft/copilot-for-eclipse](https://github.com/microsoft/copilot-for-eclipse) - GitHub repository
- [Copilot feature matrix](https://docs.github.com/en/copilot/reference/copilot-feature-matrix) - GitHub Docs
