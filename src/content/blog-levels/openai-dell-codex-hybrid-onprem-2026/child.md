---
article: 'openai-dell-codex-hybrid-onprem-2026'
level: 'child'
---

OpenAIは2026年5月18日、Dell Technologiesと協力して、Codexをハイブリッドやオンプレミスの企業環境で使いやすくする取り組みを発表しました。ここでいうCodexは、コードを書くだけの道具ではなく、テスト、レビュー、障害対応、社内情報の整理などを手伝うAIエージェントとして説明されています。

ポイントは、AIが会社の大事なデータやシステムから遠い場所で動くのではなく、会社がすでに使っているデータ基盤やAI基盤に近づくことです。OpenAIは、CodexがDell AI Data Platformと接続し、Dell AI Factoryとの連携も探ると説明しています。

## 何が発表されたのか

OpenAIによると、Codexは週に400万人以上の開発者に使われています。使い道は、コードレビュー、テストカバレッジの改善、インシデント対応、大きなリポジトリの理解などです。さらに、開発以外でも、ツールをまたいで情報を集めたり、レポートを作ったり、業務の次の作業を整理したりする方向へ広がっています。

今回のDell連携では、CodexをDell AI Data Platformにつなぐことが示されました。Dell AI Data Platformは、企業のデータを保存、整理、管理するための基盤です。Codexがこのような基盤に近づくと、コードだけでなく、社内ドキュメント、運用知識、業務システムの文脈を使いやすくなります。

Dell側も、AIを企業インフラとして見ています。Dell Technologies World 2026では、Dell AI Factory、Dell AI Data Platform、AI向けサーバー、オンプレミスやエッジで動くagentic AI基盤が紹介されています。つまり、AIをブラウザ上のチャットではなく、会社のIT基盤の一部として扱う流れです。

## なぜ日本企業に関係するのか

日本企業では、社内データを外部クラウドへ簡単に出せない場面があります。金融、製造、公共、医療、通信などでは、規制、契約、顧客説明、情報管理の理由で、AIに渡せるデータが制限されます。

CodexのようなAIエージェントを使うには、社内のコードやドキュメント、過去の障害情報、運用ルールが必要になります。しかし、それらをどこに置き、どのAIにどこまで読ませるかを決めないと、便利さよりリスクが大きくなります。

今回の発表は、「オンプレミスなら全部安全」という意味ではありません。むしろ、クラウドAIと社内データ基盤をどう組み合わせるかを考えるきっかけです。[OpenAIのAWS連携](/blog/openai-aws-bedrock-codex-managed-agents-2026/)はクラウド側の選択肢でしたが、今回のDell連携は、企業の既存インフラ側にCodexを近づける話です。

## 何を確認すればよいか

最初に見るべきなのは、どの作業をAIに任せるかです。テスト修正、コードレビュー、障害調査、社内ドキュメント検索では、必要なデータもリスクも違います。最初は、影響が小さく、結果を人間が確認しやすい作業から始めるのが現実的です。

次に、データの境界を確認します。コード、ログ、チケット、設計書、顧客情報のうち、何をAIが読めるのか。読み取りだけなのか、書き込みやコマンド実行もできるのか。OpenAI、Dell、自社のどこにログが残るのかも重要です。

さらに、権限と監査も必要です。AIエージェントが社内システムにアクセスするなら、人間と同じように権限管理が必要です。誰の承認で動いたのか、どのデータを読んだのか、どんな変更を作ったのかを後から説明できなければ、企業利用は難しくなります。

## 開発チームへの意味

開発チームにとっては、Codexを単なるコード生成ツールとして見る段階から、開発基盤の一部として見る段階に移ります。[Codex Labs](/blog/openai-codex-labs-enterprise-2026-04-21/)は、企業がCodexを実際の業務へ入れるための支援でした。[Codexのモバイル遠隔操作](/blog/openai-codex-mobile-remote-access-2026/)は、長く動く作業を人間が途中で確認する運用を示しました。今回のDell連携は、それらを社内インフラやデータ基盤へつなげる流れです。

重要なのは、最初から大きく始めないことです。小さなリポジトリ、限定されたデータ、明確な承認者、記録できるログから始めるべきです。そのうえで、効果が見えた範囲だけを広げるほうが安全です。

## まとめ

OpenAIとDellの連携は、Codexが企業の開発基盤やデータ基盤に近づいていることを示しています。日本企業にとっては、AIエージェントを使うかどうかだけでなく、どのデータ境界で使うか、誰が承認するか、どのログを残すかを考える材料になります。

オンプレミスやハイブリッドという言葉だけで判断するのではなく、実際にどのデータがどこへ流れ、どの権限でAIが動くのかを確認することが大切です。

## 出典

- [OpenAI and Dell Technologies partner to bring Codex to hybrid and on-premises enterprise environments](https://openai.com/index/dell-codex-enterprise-partnership/) - OpenAI, 2026-05-18
- [Dell Technologies World: A Bright and Beautiful Road Ahead](https://www.dell.com/en-us/blog/dell-technologies-world-a-bright-and-beautiful-road-ahead/) - Dell Technologies, 2026-05-18
- [Scaling Codex to enterprises worldwide](https://openai.com/index/scaling-codex-to-enterprises-worldwide/) - OpenAI, 2026-04-21
