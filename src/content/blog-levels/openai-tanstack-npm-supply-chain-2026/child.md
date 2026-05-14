---
article: 'openai-tanstack-npm-supply-chain-2026'
level: 'child'
---

OpenAIが、TanStack npmパッケージへの供給網攻撃を受けて、macOSアプリの更新を呼びかけました。対象はChatGPT Desktop、Codex App、Codex CLI、Atlasです。OpenAIは、2026年6月12日までに最新バージョンへ更新する必要があると説明しています。

大事なのは、これは「ChatGPTの回答がおかしくなった」という話ではないことです。問題になっているのは、アプリや開発ツールを作って配るまでの道筋です。npmパッケージ、GitHub Actions、CIのcache、署名証明書のような、開発の裏側にある仕組みが攻撃されました。

## 何が起きたのか

TanStackは、JavaScriptの世界でよく使われるオープンソースプロジェクトです。今回、TanStackの一部npmパッケージに、悪意あるコードが混ざったバージョンが公開されました。

TanStackの説明によると、攻撃者は普通のリリース作業のように見える経路を悪用しました。外部forkからのpull requestでCI cacheを汚し、あとから正規のリリースworkflowが走ったときに、そのcacheを使わせました。その結果、短時間だけ作られるpublish tokenをrunnerから盗み、npmへ悪性パッケージを公開したと説明されています。

つまり、maintainerが単純にパスワードを盗まれた話ではありません。むしろ、OIDC trusted publisherやnpm provenanceのような比較的新しい仕組みを使っていても、CI workflowの作りが弱いと攻撃される、という話です。

## OpenAIにはどう影響したのか

OpenAIは、この攻撃で社内の従業員端末2台が影響を受けたと説明しています。ユーザーデータ、本番システム、OpenAIの知的財産、配布済みソフトウェアの改ざんについては、証拠を見つけていないとしています。

ただし、一部の内部ソースコードリポジトリでは、認証情報を狙った活動があり、限定的なcredential materialが外部へ出たと説明しています。そのリポジトリには製品の署名証明書も含まれていたため、OpenAIは予防的に証明書をローテーションします。

そのため、macOSのOpenAIアプリを使っている人は、最新バージョンへ更新する必要があります。古い証明書が完全に失効すると、古いアプリは更新できなかったり、起動しにくくなったりする可能性があります。

## 日本の開発チームは何を見るべきか

まず、OpenAIのmacOSアプリを使っている端末を確認します。特にCodex CLIは、開発者が個人で入れていることがあります。会社の管理端末だけでなく、検証用や個人利用に近い端末も見落とさないほうがよいです。

次に、GitHub Actionsの設定を確認します。`pull_request_target` を使っているworkflowがあり、外部forkのコードやcacheを強い権限で扱っていないかを見る必要があります。CIのcacheはビルドを速くしますが、信頼できないPRとリリースworkflowの間で共有されると危険です。

最後に、新しく公開されたnpmパッケージをすぐに取り込まない設定を検討します。数時間から数日の待ち時間を置くだけでも、攻撃が発覚して取り下げられる時間を稼げます。

## まとめ

今回のニュースは、AI企業だけの問題ではありません。AIツールを使う日本の開発チームも、同じようにnpm、GitHub Actions、CI cache、署名証明書に依存しています。モデルの安全性だけでなく、開発パイプラインの安全性も、AI利用の一部として考える必要があります。

## 出典

- [Our response to the TanStack npm supply chain attack](https://openai.com/index/our-response-to-the-tanstack-npm-supply-chain-attack/) - OpenAI, 2026-05-13
- [Postmortem: TanStack npm supply-chain compromise](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem) - TanStack, 2026-05-11
- [Hardening TanStack After the npm Compromise](https://tanstack.com/blog/incident-followup) - TanStack, 2026-05-12
