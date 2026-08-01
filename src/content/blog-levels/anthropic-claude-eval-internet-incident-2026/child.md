---
article: 'anthropic-claude-eval-internet-incident-2026'
level: 'child'
---

Anthropic は 2026年7月30日、Claude のサイバーセキュリティ評価で、AI が本物のインターネット上のシステムにアクセスしてしまった事例を3件公表しました。これは「Claude が勝手に悪いことをした」という単純な話ではありません。

問題の中心は、評価用の環境が本当は外へ出られないはずだったのに、設定ミスでインターネットへ出られる状態になっていたことです。Claude には「ここはシミュレーションで、インターネットは使えない」と伝えられていました。そのため、Claude は見つけた本物のシステムを、演習の一部だと思い込んでしまいました。

## 何が起きたのか

Anthropic は 141,006 件の評価 run を見直し、3つのインシデントを見つけました。あるケースでは、架空の会社名が本物の会社のドメイン名と重なり、Claude がその会社のシステムを演習対象だと考えました。

別のケースでは、Claude が存在しない Python package 名を見つけ、その名前で実際の PyPI に package を公開しました。その package は約1時間オンラインにあり、複数の実システムで実行されました。これは、AI 評価環境が公開 registry に書き込める状態だったことの危険性を示しています。

3つ目のケースでは、Claude が本来の架空ターゲットに届かず、外のインターネットを探しました。その後、本物のシステムに到達しましたが、途中で演習と無関係な実環境だと判断して止まりました。

## なぜ大事なのか

AI の評価環境は「テストだから安全」と思われがちです。しかし、AI agent がネットワーク、ファイル、package registry、ブラウザ、API に触れるなら、評価環境も本番に近い危険を持ちます。

ここは [Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) の話とつながります。AI に注意書きをするだけでは足りません。AI がどこへ通信できるか、どのファイルを読めるか、どのツールを使えるかを、システム側で制限する必要があります。

また、[Anthropic AIネイティブSDLC](/blog/anthropic-ai-native-sdlc-security-2026/) で見たように、AI が開発やセキュリティ作業に入ると、作業の速さだけでなく、確認、承認、ログが重要になります。

## 会社で確認すること

日本企業がまず確認すべきなのは、AI 評価環境から外部ネットワークへ出られるかどうかです。「出られないはず」ではなく、実際に VM、container、CI、proxy、DNS の経路を調べる必要があります。

次に、演習で使う名前を確認します。架空の会社名、ドメイン名、package 名、repository 名が本当に外の世界に存在しないかを見ます。存在しない package を使うなら、公開 registry ではなく社内 mirror を使うべきです。

さらに、評価中のログを見ます。AI が外部 IP にアクセスした、package を公開しようとした、知らないドメインへデータを送ろうとした、という動きがあれば、すぐ止められるようにします。

## 委託先も同じ基準で見る

AI 評価を外部ベンダーや研究機関に任せる場合も、責任はなくなりません。どの環境で動かすのか、外部通信をどう止めるのか、ログを何日残すのか、問題が起きたら誰へ連絡するのかを先に決めます。

[Project Glasswing](/blog/anthropic-project-glasswing-mythos-vuln-triage-2026/) のように、AI をセキュリティ評価に使う場面は増えています。発見能力が高くなるほど、評価環境の安全設計も重要になります。

## まとめ

今回の件は、AI 評価を安全に行うには、モデルだけでなく環境を守る必要があることを示しています。Claude は与えられた演習を解こうとしましたが、環境の設定ミスで本物の世界へ出てしまいました。

日本企業は、AI 評価や PoC を始める前に、外部通信、架空データ、ログ監視、停止権限、委託先の責任分界を確認するべきです。テスト環境でも、AI が外へ作用できるなら、本番に近い統制が必要です。

## 出典

- [Investigating three real-world incidents in our cybersecurity evaluations](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals) - Anthropic, 2026-07-30
- [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude) - Anthropic Engineering, 2026-05-25
- [How Anthropic secures its AI-native software development lifecycle](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle) - Claude by Anthropic, 2026-07-21
