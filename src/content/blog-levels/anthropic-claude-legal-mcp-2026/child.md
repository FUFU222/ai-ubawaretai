---
article: 'anthropic-claude-legal-mcp-2026'
level: 'child'
---

Anthropicは、Claudeを法務の仕事で使いやすくするために、たくさんのMCPコネクタとLegal pluginsを公開しました。MCPコネクタは、Claudeを外部サービスにつなぐための入り口です。Legal pluginsは、契約確認、法務調査、プライバシー確認、AI利用ルールの確認など、法務でよく出る仕事をClaudeに頼みやすくする部品だと考えると分かりやすいです。

大事なのは、Claudeが急に弁護士になったという話ではないことです。Claudeが、契約管理システム、法律データベース、文書管理、裁判資料、社内プレイブックのような「法務チームが普段使う情報」に接続しやすくなった、という話です。

## 何が発表されたのか

Anthropicの発表では、20を超えるMCPコネクタと12個の法務向けプラグインが紹介されています。たとえば、契約管理のDocusignやIronclad、文書管理のiManageやNetDocuments、法律調査のThomson ReutersやFree Law Projectなどです。

プラグインには、Commercial Legal、Corporate Legal、Employment Legal、Privacy Legal、Product Legal、AI Governance Legalなどがあります。つまり、契約を見る人、会社法務を見る人、労務を見る人、個人情報を見る人、AI利用ルールを見る人など、役割ごとに使い方を分けようとしているわけです。

日本企業で考えるなら、まずNDAや契約書の一次確認、AI利用申請のチェック、社内ルールとの照合、規制ニュースの整理のような作業が近いでしょう。最終判断をAIに任せるのではなく、人が判断する前の下調べを速くする使い方です。

## なぜ法務AIは慎重に使う必要があるのか

法務の仕事には、秘密情報が多く含まれます。契約書には価格、取引条件、顧客名、まだ公開していない事業計画が入っていることがあります。法務相談には、紛争、労務、知財、個人情報、規制対応のような重要な話が含まれることもあります。

そのため、便利だからといって何でもAIに入れてよいわけではありません。誰がその文書を見られるのか、AIがどの情報を検索してよいのか、出力をどこに保存するのか、間違った回答が出たときに誰が確認するのかを決める必要があります。

Thomson Reutersの発表も、法律実務では「ほぼ正しい」では足りないという考え方を示しています。法務AIには、根拠、引用、確認のしやすさが必要です。Free Law Projectも、CourtListenerのMCPは便利なインフラだが、Claudeは弁護士ではなく、人間の判断が必要だと説明しています。

## 日本企業が見るべきポイント

日本企業がこのニュースを見るとき、最初に確認すべきなのは「日本法にそのまま使えるか」だけではありません。もっと前に、社内データをAIへつなぐルールがあるかを確認すべきです。

たとえば、契約AIを使うなら、AIが見てよい契約と見てはいけない契約を分ける必要があります。AI利用申請をチェックするなら、社内のAIポリシーや個人情報ルールを根拠として使える形にしておく必要があります。法務調査に使うなら、根拠になった資料を後から確認できるようにする必要があります。

子ども向けに言えば、AIに宿題を全部やらせるのではなく、調べものを手伝ってもらい、答えが正しいかは先生や保護者が確認する、という関係に近いです。法務では、この確認がとても重要になります。

## 開発チームにも関係がある

MCPコネクタを使うと、AIは社内システムや外部サービスに接続します。すると、開発チームや情報システム部門にも仕事が出てきます。ログイン、権限、ログ、監査、データ保存、接続停止の仕組みを作らなければなりません。

AIが便利でも、全社員の契約書を勝手に検索できるようにしてはいけません。もともとの文書管理システムで見られる範囲だけをAIにも見せることが大事です。誰が何を見たか、どの回答を使ったかも記録できる方が安全です。

## まとめ

Claude法務MCPの発表は、法務AIがチャットだけの道具から、業務システムにつながる道具へ変わっていることを示しています。ただし、法務の仕事は重要で秘密も多いため、導入にはルールが必要です。

日本企業がまず考えるべきことは、AIにどの仕事を任せるか、どの情報へつなぐか、誰が最後に確認するかです。契約AIや法務AIは、自由に使わせるより、根拠と権限を決めて使う方が実務に向いています。

## 出典

- [Claude for the legal industry](https://claude.com/blog/claude-for-the-legal-industry) - Anthropic, 2026-05-12
- [Thomson Reuters and Anthropic Expand Partnership to Connect Claude with CoCounsel Legal](https://www.thomsonreuters.com/en/press-releases/2026/may/thomson-reuters-and-anthropic-expand-partnership-to-connect-claude-with-cocounsel-legal) - Thomson Reuters, 2026-05-12
- [AI Tools and Assistants such as Claude Can Now Connect to CourtListener's Full Functionality](https://free.law/2026/05/12/courtlistener-is-now-available-inside-claude/) - Free Law Project, 2026-05-12
