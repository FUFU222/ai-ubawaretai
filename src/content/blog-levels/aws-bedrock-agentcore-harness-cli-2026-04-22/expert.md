---
article: 'aws-bedrock-agentcore-harness-cli-2026-04-22'
level: 'expert'
---

AWSが2026年4月22日に出したAmazon Bedrock AgentCoreの更新は、一見すると managed harness と CLI の追加というだけの話に見える。しかし、実際には「AIエージェントをどの順番で試し、どの地点から本番設計へ移るか」という開発プロセス全体の分岐点を示している。特に日本のチームにとっては、東京リージョンでの利用可否、PoC 権限の扱い、従量課金の読み方を最初に整理できる点が大きい。

今回の発表で面白いのは、AWSがAgentCoreを単なる runtime 製品としてではなく、**発想検証から本番運用までを一つの連続した導線で扱う基盤**として見せ始めたことだ。managed harness は「最初の一歩」を短くし、CLI は「その後の構成管理」を標準化する。両方を合わせると、エージェント開発でよくある「試作はできたが、次の段階へ移れない」という詰まりを減らそうとしていることが分かる。

## 事実: managed harness は“まず動かす”ための新しい入口

4月22日付の[What's New](https://aws.amazon.com/about-aws/whats-new/2026/04/agentcore-new-features-to-build-agents-faster/)では、managed harness は preview として紹介されている。そこでは、モデル、system prompt、tools を指定するだけで agent を実行でき、reasoning、tool selection、action execution、response streaming を含む full agent loop を AWS 側が管理すると説明されている。各 session には microVM が割り当てられ、filesystem と shell access があり、さらに session state を外部化して suspend / resume できるとされる。

同日の[公式ブログ](https://aws.amazon.com/blogs/machine-learning/get-to-your-first-working-agent-in-minutes-announcing-new-features-in-amazon-bedrock-agentcore/)は、その位置づけをさらに明確にしている。従来、エージェントを試す前に必要だったのは、framework 選定、orchestration code、sandbox、tool 接続、永続化、認証、デプロイ基盤だった。ブログは、それらが「agent が本当に有用か」を知る前の重い先行コストになっていたと説明し、managed harness によって三つの API call で動作確認まで進められる方向へ寄せたとしている。

重要なのは、AWSがここで「完全にノーコード」を約束しているわけではない点だ。ブログは、managed harness は Strands Agents を土台にしており、必要になれば config から code-defined harness へ移れると書いている。つまり、**managed harness は簡易版ではなく、AgentCore の入口を短くする一段目**として設計されている。

## 事実: CLI は“試したものを育てる”ための導線

CLI も軽視できない。ブログでは、`prototype, deploy, operate` を同じ terminal workflow にまとめるのが目的だとされている。AgentCore の[クイックスタート](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html)を見ると、`agentcore create` による scaffold、ローカルテスト、`agentcore deploy`、ログと trace の確認、さらに `agentcore add` による memory や追加 agent の組み込みまでが一連の流れとして整理されている。

ここでのポイントは、CLI が単なる wrapper ではなく、**AWS の推奨構成を project 生成、deploy、operations に埋め込む“意見のある入口”**になっていることだ。AgentCore は primitives が多い。Runtime、Memory、Gateway、Identity、Observability、Policy、Evaluations といった要素を個別に触るだけでも成立するが、CLI はその組み合わせ方をある程度ガイドする役割を持つ。

さらに What's New では、AgentCore skills が coding assistants 向けに用意されるとされ、Kiro には当日から、Claude Code、Codex、Cursor には翌週対応予定と説明されている。これは、AgentCore のベストプラクティスを AI コーディング支援の文脈で直接流し込む構図であり、単なる SDK 提供より一歩踏み込んでいる。

## 事実: 東京リージョンで使える範囲と、使えない範囲

日本の実務では、ここが最も判断材料になる。

What's New と公式ブログは一致して、managed harness preview の提供リージョンを `US West (Oregon)`、`US East (N. Virginia)`、`Europe (Frankfurt)`、`Asia Pacific (Sydney)` の4つとしている。したがって、**2026年4月22日時点で managed harness preview は Tokyo では提供されていない。**

一方、AWS ドキュメントの[Supported AWS Regions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html)では、`AgentCore Runtime`、`Memory`、`Gateway`、`Identity`、`Built-in Tools`、`Observability`、`Policy` は `Asia Pacific (Tokyo)` にチェックが付いている。`AgentCore Evaluations` も Tokyo に対応している。What’s New は CLI が AgentCore 提供14リージョンで利用可能と書いており、リージョン表と合わせると、CLI と多くの主要 primitives は Tokyo 前提で進められる。

この差は単に「リージョンが少ない」では済まない。日本の開発チームはしばしば、PoC 段階であってもデータ所在、社内接続、将来の本番リージョン、レイテンシ、部門審査の観点を気にする。managed harness の価値は高いが、Tokyo 非対応の preview をどう扱うかは、社内ガイドライン次第で進め方が大きく変わる。

## 事実: CLI 権限は開発の加速を優先している

AgentCore CLI は便利だが、権限設計では注意喚起がかなり強い。[IAM Permissions for AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html)では、CLI を使うための user policy 例として、IAM role の作成・削除・policy 付与、CodeBuild project の生成や更新など、広めの権限が列挙されている。

同じページには、CLI が作る IAM policies は development and testing purposes 向けであり、production deployments には suitable ではないと明記されている。AWS は production では least privilege の custom policy を作るよう推奨している。これは重要なメッセージだ。つまり AWS 自身が、CLI はまずスピードを優先した入口であり、**統制を固めた本番権限は別設計にすべき**と線を引いている。

日本企業では、ここを後回しにすると失敗しやすい。PoC の成功体験が先に立つと、その権限構成のまま次の環境へ進めたくなる。しかし AgentCore のように runtime、gateway、memory、identity が絡む基盤では、後から role を絞り込むより、最初から「PoC 用」と「本番用」を分けて説明できる設計の方が圧倒的に安全だ。

## 事実: “追加料金なし”の正しい読み方

料金も誤読されやすい点だ。What’s New と公式ブログは、managed harness、CLI、skills には additional charge がないと説明している。これは事実だが、「新機能を使うための上乗せ料金がない」という意味に近い。

実際の[Pricing](https://aws.amazon.com/bedrock/agentcore/pricing//)を見ると、Runtime と Browser Tool は active CPU / memory consumption、Gateway は API invocations、Identity は token / API key request 単位など、各機能がそれぞれ従量で課金される。ブログでも、支払うのは resources you use と表現されている。従って、正確な理解は、**入口機能には追加料金がないが、AgentCore の下で動く実リソース消費は課金対象**ということになる。

この整理は日本の予算議論で大事だ。PoC 提案では「CLI は無料」「harness は追加料金なし」という言い方だけが独り歩きしやすい。しかし実際の費用は、Runtime セッションの動かし方、Browser Tool の使用有無、Memory や Gateway の呼び出し量で変わる。導入判断では「入り口無料」より「どの消費メーターが回るか」を先に押さえた方がよい。

## 分析: AWSは“AgentCoreを触る前の摩擦”を潰しに来た

ここからは分析だ。

今回の更新の本質は、AgentCore 自体の機能追加というより、「AgentCore を試す前の摩擦」を減らすことにあると思う。AI エージェントの開発では、実際に困るのはモデルより先に、実行環境、ツール接続、永続化、認証、監視、デプロイの整合だ。managed harness はそのうち、最初の価値検証を阻む部分を吸収する。CLI は、その後に必要な project 構造、deploy、operations の揺れを減らす。

つまり AWS は、AgentCore の primitives を増やすだけでなく、**試作段階の friction と本番移行段階の friction を別々に潰し始めた**。これはかなり正しい順序だ。多くの teams は AgentCore のような基盤を評価するとき、最初の数日で面倒に感じたら離脱する。その離脱を防ぐには、managed harness のような入り口が効く。

## 分析: 日本市場では“東京でどこまで完結するか”が価値判断になる

日本では、managed harness の UX 改善そのものより、「東京でどこまで閉じて進められるか」の方が導入判断で重くなる場面が多い。特に大企業、金融、公共寄りの案件では、preview 機能の海外リージョン利用は PoC の時点でも説明が必要になる。

その意味で、今回の発表は二面性がある。managed harness は魅力的だが、Tokyo 非対応のため、誰でもすぐ採用できるとは限らない。一方 CLI と主要 primitives は Tokyo で使えるので、より保守的な組織でも始める余地がある。AWS は意図的に、**“最速で試す道”と“国内リージョン中心で進める道”の両方**を用意したように見える。

これは日本向けにはむしろプラスだ。なぜなら、PoC を全員が同じ道で進める必要がないからだ。軽量な検証チームは managed harness を使い、統制を重視するチームは CLI / Runtime / Gateway 中心に組める。発表内容を正しく読むと、選択肢は一つではない。

## 分析: 導入の成功条件は“最初の選び方”にある

実務での失敗は、技術不足より、最初の選択ミスで起きることが多い。

managed harness を選ぶべきなのは、データ持ち込み制約が弱く、まず agent の形を高速に試したい場合だ。たとえば社内の公開情報だけを使う assistant、社外公開予定の workflow prototype、tool chaining の可能性確認などが向く。ここで重要なのは、価値検証の速さであって、本番設計の完成度ではない。

CLI / Runtime 寄りで始めるべきなのは、最初から社内リソース接続、role 分離、observability、gateway 設計を意識したい場合だ。こちらは初速で劣るように見えるが、後から本番化の説明がしやすい。特に日本企業では、PoC 成功後に統制審査で止まるケースが多いため、**多少遅くても最初から東京リージョンと権限設計を踏まえる方が全体は速い**ことがある。

## 日本の開発チーム向けチェックリスト

今回の発表を踏まえて、実務では次を確認するとよい。

1. まず、検証目的を「価値確認」か「本番前提の技術確認」かに分ける。
2. 次に、managed harness preview を Sydney で使って問題ないか、データ分類と社内ルールで確認する。
3. Tokyo で進める場合は、CLI と Runtime / Gateway / Memory / Observability のどこまで必要かを絞る。
4. CLI 利用者へ渡す IAM 権限は PoC 専用にし、本番環境の role とは分ける。
5. 追加料金なしという説明の内訳を確認し、実際に課金される Runtime / Browser / Gateway の消費単位を見積もる。

## まとめ

AWSの4月22日の発表は、Amazon Bedrock AgentCoreを単に強くしたというより、**始め方と育て方を整理した**アップデートだった。managed harness は試作の摩擦を減らし、CLI はその成果を継続的な構成へ寄せる役割を持つ。

日本向けの実務論点も明確だ。managed harness preview は 2026年4月22日時点で Tokyo 非対応、だが CLI と主要 AgentCore 機能は Tokyo で使える。CLI の権限は開発用に広く、本番利用には最小権限化が必要。追加料金なしという言い方は入口機能の話であり、実リソース課金は残る。ここまで見えれば、今回のニュースは「AgentCore がまた増えた」ではなく、**日本のチームがどの導線で AgentCore を採用するかを選ぶための発表**として読める。

## 出典

- [Amazon Bedrock AgentCore adds new features to help developers build agents faster](https://aws.amazon.com/about-aws/whats-new/2026/04/agentcore-new-features-to-build-agents-faster/) - AWS What's New
- [Get to your first working agent in minutes: Announcing new features in Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/machine-learning/get-to-your-first-working-agent-in-minutes-announcing-new-features-in-amazon-bedrock-agentcore/) - AWS Machine Learning Blog
- [Supported AWS Regions - Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html) - AWS Documentation
- [Get started with Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html) - AWS Documentation
- [IAM Permissions for AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html) - AWS Documentation
- [Amazon Bedrock AgentCore Pricing](https://aws.amazon.com/bedrock/agentcore/pricing//) - AWS Pricing
