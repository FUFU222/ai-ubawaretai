---
article: 'anthropic-claude-design-usage-pricing-governance-2026'
level: 'child'
---

Claude Design は、Claude と会話しながらデザイン、プロトタイプ、スライドなどを作る Anthropic Labs の機能です。便利そうに見えますが、会社で使うときは「どんな画面を作れるか」だけを見てはいけません。誰に使わせるか、どの素材を入れてよいか、どこへ出力してよいか、お金はどう数えるか、監査できるかを先に考える必要があります。

## 何ができるの？

Claude Help Center によると、Claude Design は Pro、Max、Team、Enterprise プラン向けの research preview です。Enterprise では最初からオンではなく、管理者が有効化する形です。

使い方は、左側のチャットで作りたいものを説明し、右側のキャンバスで Claude が作ったデザインを見ながら修正する流れです。スクリーンショット、画像、既存の資料、コードベース、デザインファイルなどを文脈として渡せます。会社のデザインシステムが設定されていれば、ブランドカラーやフォント、コンポーネントも反映できます。

出力先も多いです。zip、PDF、PPTX、Canva、HTML に出力でき、Claude Code へ handoff することもできます。つまり、ただの見本画像ではなく、資料作成や実装の入口にもなります。

## 会社で注意する点

一番大事なのは、Claude Design が何でも安全にしてくれるわけではないことです。たとえば、未公開サービスの画面、顧客資料、社内のコード、ブランドガイドラインを入れるなら、どこまで使ってよいか決める必要があります。

以前の [Claude for Creative Work記事](/blog/anthropic-claude-creative-work-design-2026/) では、Claude Design が制作と開発の間をつなぐ可能性を見ました。今回のポイントは、その便利さを実際に会社で使うための条件です。特に Claude Code へ渡せるなら、デザインの下書きがそのまま実装作業に近づきます。だからこそ、人間のレビューを飛ばしてはいけません。

## 課金は別枠で考える

Claude Design は、通常の Claude チャットや Claude Code とは別にメータリングされます。個人プラン、Team、Enterprise で利用枠や課金の考え方が違います。

Team では、使える枠がユーザーごとに付与されます。Enterprise でも、契約形態によって seat-based と usage-based の違いがあります。追加の usage credits を買える場合もあります。

これは、会社では意外と大事です。たくさん使う人とほとんど使わない人が出ます。誰に使わせるか、追加クレジットを誰が買えるか、どの部署の予算にするかを決めないと、あとで費用管理が難しくなります。

## 監査ログに注意する

Claude Design の課金ページでは、Claude Design はまだ audit logs や usage tracking をサポートしていないと説明されています。つまり、誰がどんなデザインを作り、どこへ出したかを、細かく監査できる状態ではありません。

一方で、[Claude Compliance API統合記事](/blog/anthropic-claude-compliance-api-integrations-2026/) で扱ったように、Claude の他の領域では DLP や SIEM などとつなぐ動きがあります。だからといって、Claude Design も同じように監査できると考えるのは危険です。

会社で使うなら、作ったものを通常のドキュメント管理、デザインレビュー、チケット、PR に移して、そこで記録を残すのが現実的です。

## どう始めるべき？

最初は小さく始めるのがよいです。たとえば、PM とデザイナーだけで新機能の画面案を作る、マーケティングだけでLPの初稿を作る、営業企画だけで提案資料のたたき台を作る、という使い方です。

出力したものは、そのまま公開しないほうが安全です。PDF や PPTX は人間が確認してから共有する。HTML は社外公開前にレビューする。Claude Code に渡した実装案は、PRで開発者が確認する。この流れを決めておけば、Claude Design は便利な下書きツールとして使いやすくなります。

Claude Design は、デザイナーを不要にする道具ではありません。むしろ、最初のたたき台を早く作り、デザイナーや開発者が重要な判断に時間を使えるようにする道具です。日本のチームでは、使う範囲、費用、レビュー、監査のルールを決めてから試すのが現実的です。

## 出典

- [Claude Design subscription usage and pricing](https://support.claude.com/en/articles/14667344-claude-design-subscription-usage-and-pricing) - Claude Help Center
- [Get started with Claude Design](https://support.claude.com/en/articles/14604416-get-started-with-claude-design) - Claude Help Center
- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) - Claude Help Center
