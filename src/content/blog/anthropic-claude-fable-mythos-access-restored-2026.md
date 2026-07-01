---
title: 'Claude Fable 5再開、クラウド別復旧を確認する実務'
description: 'Claude Fable 5と限定的なMythos 5のアクセス再開を解説。日本企業がClaude Platform、Claude Code、AWSなど経路別の復旧差、7月7日までの利用枠、拒否応答を確認し、安全に本番評価へ戻す手順を整理する。'
pubDate: '2026-07-02'
category: 'news'
tags: ['Anthropic', 'Claude', 'AI モデル', 'サイバーセキュリティ', '企業導入', '日本企業']
series: 'anthropic-japan-2026'
draft: false
---

Anthropicは2026年7月1日、停止していた**Claude Fable 5とClaude Mythos 5のアクセスを再開した**と発表した。ただし、2モデルが世界中の全経路で同時に元通りになったわけではない。Fable 5はClaude Platform、Claude.ai、Claude Code、Claude Coworkで世界向けに再開した一方、AWS、Google Cloud、Microsoft Foundryは順次再有効化する案内だ。Mythos 5も、まず米国政府が承認した一部の米国組織から復旧している。

日本企業が見るべき点は「モデルが戻った」という見出しだけではない。6月12日の停止後に代替モデルへ切り替えたAPI、Claude Codeの標準モデル、クラウド上のmodel ID、監視ルールを、どの順番で戻すかが実務になる。以前の設定へ一斉に戻すと、経路ごとの復旧差、新しい安全分類器による拒否、プラン別の利用条件を見落とす。

停止時の影響と代替運用は[Claude Fable停止と企業AI調達の再点検](/blog/anthropic-claude-fable-mythos-access-suspension-2026/)で整理した。モデル自体の位置付けは[Claude Fable 5、1M文脈時代の導入設計](/blog/anthropic-claude-fable-mythos5-governance-2026/)を参照できる。今回の焦点は、その後の「復旧を確認してから戻す」工程である。

## 事実: Fable 5は7月1日に主要な一次提供で再開

Anthropicの発表によると、Fable 5は7月1日から、Claude Platform、Claude.ai、Claude Code、Claude Coworkで世界の利用者へ再び提供された。6月12日に米国政府の輸出規制が適用され、外国籍かどうかをリアルタイムに確認できなかったため、Anthropicは全利用者へのアクセスを停止していた。6月30日に規制が解除され、翌7月1日に再開したという時系列だ。

Fable 5とMythos 5は同じ基盤モデルを共有するが、提供条件は同じではない。Fable 5は一般利用向けの強い安全策を持つモデルである。Mythos 5は安全分類器を減らし、防御的サイバーセキュリティ用途に限ってProject Glasswingの一部パートナーへ提供されてきた。今回Mythos 5で復旧したのは、6月26日に承認された一部の米国組織であり、国内外のより広いパートナーには調整を続けるとされている。

したがって、「Mythos 5も日本から一般利用できる」と読むのは誤りだ。日本の一般的な開発・事業チームに直接関係するのはFable 5の復旧であり、Mythos 5は限定提供の状況が動いたという理解が正確である。

## 事実: 7月7日までの利用枠とEnterpriseの条件

Anthropicは、Pro、Max、Team、一部Enterpriseプランについて、7月7日までFable 5を週次利用上限の最大50%に含める。7月7日後はusage creditsで利用する形になる。これは無料開放という意味ではなく、各プランの週次枠とcredits設定を確認する必要がある。

Enterpriseでは座席種別による差がある。標準Enterprise seatにはFable 5の利用枠が含まれず、usage creditsを有効にしなければ利用できない。premium Enterprise seatは7月7日まで追加料金なしで各メンバーのseat usageから利用できるが、それ以後はusage creditsが必要になる。管理者がcreditsを有効にしていない場合、利用者はFable 5へアクセスできなくなる。

この条件は、短期評価の期限を明確にする。7月7日までに全社展開を決める必要はないが、代表的なジョブで疎通、品質、拒否率、所要時間を測り、creditsを有効にする根拠を作るべきだ。価格・利用量の比較では、直近の[Claude Sonnet 5のAPI移行設計](/blog/anthropic-claude-sonnet-5-pricing-migration-2026/)も併せて見ると、Fable 5を常用する仕事とSonnet 5へ残す仕事を分けやすい。

## 事実: クラウド経由は「順次再開」

AnthropicはAWS、Google Cloud、Microsoft Foundryについて、できるだけ早くアクセスを再有効化すると説明した。これは、7月1日時点で全リージョン、全アカウント、全APIが同時に復旧したという宣言ではない。クラウドを本番経路にしている企業は、Anthropicの発表だけで利用可能と判定せず、実際に使うリージョンとアカウントで確認する必要がある。

AWSのFable 5 model cardは、モデルライフサイクルをActiveとし、`anthropic.claude-fable-5` のmodel ID、`bedrock-runtime` と `bedrock-mantle` のエンドポイントを掲載している。リージョン内、地理範囲内、グローバルの各推論経路も区別される。日本企業にとって重要なのは、ドキュメント上でActiveかだけでなく、自社の利用リージョン、model access、Service Control Policy、VPCやegress制御、社内AI gatewayが実際に通るかである。

Google CloudやMicrosoft Foundryでも考え方は同じだ。モデル一覧に名前が戻ること、API呼び出しが成功すること、本番データを送ってよい契約・リージョン条件を満たすことは別の確認項目である。復旧の判定を「管理画面で見えた」の1点に寄せてはいけない。

## 事実: 新しい安全分類器で拒否が増える可能性

Anthropicは停止期間中、問題とされた回避手法を対象に新しい安全分類器を訓練した。公式説明では、その手法を99%以上のケースで遮断する。遮断された要求は利用者へ通知され、Opus 4.8へ送られる。安全性を強める一方、通常のコーディングやデバッグでも無害な要求を誤って止めるケースが増えるというトレードオフも明記されている。

AWSのmodel cardも、Fable 5はサイバーセキュリティと生物学のdual-use内容に対するblocking classifierを備え、過去のClaudeモデルより拒否率が大きく高いと説明する。APIでは通常のHTTP 200でも、`stop_reason: "refusal"` と制限カテゴリを含む `stop_details` が返る。HTTP statusだけを成功判定に使う実装では、拒否を正常回答として後段へ渡す恐れがある。

復旧時の回帰テストには、HTTP成功率だけでなく、`stop_reason`、代替モデルへの切替、部分出力、課金の有無、利用者に表示する文言を含める必要がある。特に脆弱性診断、ログ解析、インシデント対応、依存関係更新のような正当な防御業務は、誤検知が業務停止へ直結しやすい。

## 分析: 停止前の設定へ一斉に戻さない

ここからは公式発表を踏まえた運用上の分析である。

第一に、復旧単位をモデルではなく**利用経路**で持つべきだ。Claude.aiで使えたからBedrockでも使える、Claude Codeで選べたから社内gatewayでも通る、とは限らない。`direct-platform`、`claude-code`、`aws-bedrock`、`google-cloud`、`microsoft-foundry`のように経路を分け、環境ごとに復旧状態を記録する。

第二に、ロールバック可能な割合で戻す。まず社内評価用の少数ユーザーと非本番ジョブに限定し、成功率、拒否率、p95応答時間、1ジョブ当たりの消費、レビュー差し戻しを測る。停止中にOpus 4.8やSonnet 5へ切り替えた本番ジョブは、品質とコストを比較してから一部だけFable 5へ戻す。新しいモデルが使えることと、そのモデルへ戻すことが得であることは別だ。

第三に、障害とポリシー拒否を区別する。ネットワークエラー、model unavailable、rate limit、credits不足、`refusal`を同じ失敗コードへまとめると、運用担当は原因を判別できない。監視画面とアラートには少なくとも「到達不能」「契約・予算」「安全分類器」「アプリケーションエラー」の分類が必要である。

## 日本企業向けの復旧チェックリスト

1. **棚卸し**: 6月12日にFable 5から何へ切り替えたか、Claude Code、API、クラウド、IDE、社内gatewayごとに一覧化する。
2. **権利確認**: プラン、seat種別、usage credits、クラウドのmodel access、利用リージョンを確認する。
3. **疎通確認**: 空の短いプロンプトではなく、実際に近い非機密ジョブでmodel ID、応答モデル、`stop_reason`を保存する。
4. **安全回帰**: コーディング、デバッグ、防御的セキュリティの代表ケースで、新分類器の拒否とOpus 4.8への切替を検証する。
5. **比較評価**: 停止中に採用した代替モデルと、完了率、レビュー修正量、所要時間、creditsを同じ条件で比べる。
6. **段階復旧**: 非本番、限定チーム、一部トラフィック、本番標準の順に戻し、各段階に停止条件を置く。
7. **7月7日後の確認**: usage creditsを使う組織、Fable 5を外す組織、Sonnet 5などへ残すジョブを管理者が決定する。

今回の再開は、停止前の状態へ時計を戻すイベントではない。提供経路、座席、credits、安全分類器が変わった状態での再導入である。日本企業は短期利用枠を「急いで使い切る期間」ではなく、復旧手順とモデル可用性を検証する期限として使うべきだ。

## 出典

- [Redeploying Claude Fable 5](https://www.anthropic.com/news/redeploying-fable-5) - Anthropic, 2026-06-30 / 2026-07-01 update
- [Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access) - Anthropic, 2026-06-12
- [Claude Fable 5 - Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-fable-5.html) - AWS Documentation
