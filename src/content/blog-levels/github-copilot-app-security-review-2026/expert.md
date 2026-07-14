---
article: 'github-copilot-app-security-review-2026'
level: 'expert'
---

GitHubは2026年7月14日、GitHub Copilot appで`/security-review`を公開プレビューとして提供開始した。Copilot app上で現在の作業変更を対象にセキュリティレビューを実行し、重大度と確信度を含む指摘、修正提案、再確認を開発者の作業面から扱えるようにする更新である。

この位置づけは重要だ。[GitHub Copilot appのtechnical preview](/blog/github-copilot-app-technical-preview-2026/)は、issue、branch、PR、CI、agent sessionを一体で扱う作業面として出てきた。今回の`/security-review`は、[Copilot CLI security reviewのPR前検査](/blog/github-copilot-cli-security-review-2026/)を、より日常的なデスクトップ作業面に近づけるものだ。

ただし、これはセキュリティゲートの代替ではない。[CodeQL 2.26.0のAI prompt injection検出](/blog/github-codeql-ai-prompt-injection-2026/)のような静的解析、Dependabot、[secret scanningの検出運用](/blog/github-secret-scanning-ai-detected-names-2026/)は引き続き必要になる。実務上の論点は、AIレビューをどこで使い、何を人間とCIに残すかである。

## 事実: /security-reviewの機能範囲

GitHub Changelogは、`/security-review`をCopilot app内で作業中の変更に対して実行できるslash commandとして説明している。公開プレビューであり、Copilot Free、Pro、Business、Enterpriseのユーザーが対象になる。

返される内容は、高い確信度のセキュリティ指摘、重大度と確信度による整理、適用可能な修正提案、開発者が再確認しやすい優先順位づけである。GitHubが例示する脆弱性クラスは、injection、cross-site scripting、insecure data handling、path traversal、weak cryptographyなど、アプリケーション開発で頻出する高影響カテゴリだ。

GitHubは、この機能をCopilot CLIで提供されているAI駆動の脆弱性スキャンと同じ流れに置いている。つまり、AIによるセキュリティ観点のレビューを、CLIだけでなくCopilot appの作業面から呼び出せるようにしたと理解できる。

Copilot appの公式ドキュメントでは、同アプリはagent-driven development向けのデスクトップアプリで、複数agent session、GitHub issue、pull request、branch、CIを扱えると説明されている。`/security-review`は、このagent作業面へセキュリティ自己点検の入口を追加する機能である。

## 役割分担: AIレビュー、静的解析、人間レビュー

実務では、`/security-review`を「AIが脆弱性を見つける機能」とだけ説明すると誤る。正確には、開発者が作業中の差分に対して、一般的な脆弱性観点を早く当てるためのオンデマンドレビューである。

CodeQLは、言語別の解析、クエリ、CIでの再現性、組織ポリシー化に強い。Dependabotは、依存関係の既知脆弱性と更新PRに強い。secret scanningは、漏えいしたtokenや秘密情報の検出に強い。branch protectionやrequired checksは、merge gateとして組織全体に強制できる。

`/security-review`の強みは、開発者がPR前に呼び出せる軽さと、AIが文脈を読んだ説明や修正提案を返せる点にある。弱みは、出力の再現性、検出網羅性、監査証跡、組織全体の強制力である。したがって、merge可否を決める最終線に置くべきではない。

推奨される分担は、PR前の自己点検に`/security-review`、CI上の再現可能な静的解析にCodeQL、依存関係にDependabot、secret漏えいにsecret scanning、業務固有リスクに人間レビューである。AIレビューは、低コストで早く違和感を拾うレイヤーとして扱う。

## 導入設計: まず対象を絞る

日本企業で全社導入する場合、最初から全リポジトリ必須にするのは避けたほうがよい。AIレビューの精度、誤検知率、開発者の受け止め方、既存CIとの重複を見ないまま義務化すると、チェックボックスだけが増える。

最初の対象は、リスクの高い小さな範囲にする。認証、認可、管理画面、顧客データ、決済、外部API、ファイルアップロード、社内権限管理を扱うリポジトリが候補になる。期間は1か月から3か月程度をbaseline作成に使う。

PR templateには、`/security-review`の実行有無、high confidence指摘の有無、修正しない指摘の理由を記録する欄を置く。初期段階では必須ではなく、推奨チェックにする。指摘を受けた開発者が、内容を読まずに通過儀礼として実行する状態を避けるためだ。

セキュリティ担当者は、AIレビューの指摘を週次でサンプリングする。見るべきなのは、指摘カテゴリ、修正率、誤検知、見逃し、開発者が理解できていない説明である。AI指摘の品質が低いカテゴリは、custom instructionsやレビューガイドで補うか、AIレビュー対象から外す。

## 運用ルール: PR前とPR後を分ける

`/security-review`の運用は、PR前とPR後で役割を分けると安定する。

PR前は、開発者の自己点検である。作業中の差分に対して実行し、high severityまたはhigh confidenceの指摘を修正する。修正しない場合は、なぜ該当しないかをPR本文に短く残す。この時点の目的は、低コストな手戻り削減であり、承認ではない。

PR後は、既存のレビュー制度を維持する。CodeQL、secret scanning、Dependabot、unit test、integration test、required review、CODEOWNERS、セキュリティ担当レビューを使う。AIレビュー結果はPR本文やコメントの参考情報として扱い、merge gateは組織が管理できるチェックに寄せる。

例外処理も明文化する。AIが高重大度の指摘を出したが修正しない場合、判断者、理由、補償統制、期限を残す。AIの誤検知なら誤検知として残す。業務仕様上許容するなら、セキュリティ担当者または責任者の承認を残す。

この線引きをしないと、AIレビューが「誰も責任を取らない承認」に見えてしまう。監査で説明できるのは、AIが何を言ったかではなく、人間と組織がそれをどう判断したかである。

## 効果測定: 実行率だけでは足りない

導入効果を測るなら、`/security-review`の実行回数だけでは不十分だ。実行率は利用状況を示すが、安全性や生産性の改善を直接示さない。

まず、AI指摘の修正率を見る。high severityまたはhigh confidenceの指摘が何件あり、そのうち何件がPR前に修正されたかを追う。次に、誤検知率を見る。開発者が無視した指摘のうち、セキュリティ担当者が妥当な無視と判断した割合を確認する。

三つ目に、後工程での重大指摘を見る。CodeQL、人間レビュー、セキュリティ担当レビュー、QA、incidentで後から見つかった問題が減っているかを確認する。AIレビューが本当に価値を出すなら、少なくとも一部の低レベルな問題はPR前に潰れるはずだ。

四つ目に、PR lifecycle指標を見る。first reviewまでの時間、review cycle数、merge lead time、PRサイズを合わせる。AIレビューの導入により、PR本文が整理され、人間レビューの往復が減る可能性がある。一方で、AI指摘をめぐる議論でcycleが増える可能性もある。

五つ目に、開発者体験を見る。AI指摘が説明として役に立ったか、修正案が実装に使えたか、誤検知が多すぎないかを短いアンケートで確認する。セキュリティ機能は、現場が面倒だと感じるだけでは定着しない。

## リスク: AIセキュリティレビューの過信

最大のリスクは過信である。`/security-review`が何も指摘しなかったとしても、脆弱性がないとは言えない。業務固有の権限境界、内部データ分類、契約上の制約、個人情報保護法や業界規制、社内監査基準は、一般的な脆弱性クラスだけでは判断できない。

また、AIレビューは文脈依存である。差分の外にある設定、インフラ、運用手順、データフロー、権限設計が見えなければ、判断は不完全になる。Copilot appがGitHubと統合され、branchやCIを扱えるとしても、すべての業務文脈を自動で理解するわけではない。

二つ目のリスクは、誤検知疲れである。低確信度の指摘が多いと、開発者はAIレビューを無視し始める。初期運用では、high confidenceに絞る、カテゴリ別に期待値を伝える、誤検知をフィードバックする、採用しない指摘の理由を簡単に書けるようにする、という調整が必要だ。

三つ目のリスクは、責任境界の曖昧化である。AIが指摘した、AIが大丈夫と言った、という表現は監査に向かない。PR本文やレビュー記録では、「AIレビューで指摘されたXを修正した」「Yは業務仕様上問題ないため、担当者Zが理由を確認した」と人間の判断に落とす必要がある。

## 日本企業向けの実装チェックリスト

最初に、対象リポジトリと対象カテゴリを決める。認証、認可、個人情報、外部公開API、ファイルアップロードのように、リスクと手戻りコストが高い領域から始める。

次に、PR templateを更新する。`/security-review`を実行したか、high confidence指摘を修正したか、修正しない指摘の理由を書いたか、CodeQLやsecret scanningの結果を確認したかを短く入れる。

三つ目に、セキュリティ担当者の週次レビューを設ける。AI指摘のサンプル、誤検知、見逃し、開発者の質問を見て、運用ガイドを更新する。

四つ目に、metricsを保存する。実行率、修正率、誤検知率、後工程指摘、first review time、review cycle、PRサイズ、AI CreditsをDWHや月次レポートに入れる。

五つ目に、必須化の条件を決める。誤検知率が許容範囲に入り、開発者が説明を理解でき、後工程の低レベル指摘が減り、レビュー時間が悪化しないことを確認してから、重要リポジトリで必須化を検討する。

最後に、承認代替にしないことを明文化する。`/security-review`は自己点検であり、merge可否は組織が管理するチェックと人間レビューで判断する。この一文を導入ガイドに入れるだけで、過信をかなり抑えられる。

## まとめ

GitHub Copilot appの`/security-review`は、AIセキュリティレビューを開発者の作業面へ近づける更新である。PR前に典型的な脆弱性クラスを確認できるため、手戻りの早期発見には価値がある。

一方で、これはCodeQL、Dependabot、secret scanning、人間レビュー、監査承認の代替ではない。日本企業は、`/security-review`を自己点検レイヤーに置き、CIと人間レビューをmerge gateに残すべきだ。導入は小さく始め、誤検知率、修正率、後工程指摘、review cycle、AI Creditsを見ながら、必須化や対象拡大を判断するのが実務的である。

## 出典

- [Security reviews now available in the GitHub Copilot app](https://github.blog/changelog/2026-07-14-security-reviews-now-available-in-the-github-copilot-app/) - GitHub Changelog, 2026-07-14
- [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app) - GitHub Docs
- [Requesting a code review with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review) - GitHub Docs
