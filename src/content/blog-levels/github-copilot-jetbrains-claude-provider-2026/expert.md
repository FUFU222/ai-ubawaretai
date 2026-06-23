---
article: 'github-copilot-jetbrains-claude-provider-2026'
level: 'expert'
---

GitHub Copilot for JetBrains IDEs の 2026年6月22日更新は、JetBrains を標準 IDE にしている組織にとってかなり重要である。発表の見出しは Claude as agent provider preview だが、実際には、Claude agent、GitHub cloud agent、組織/Enterprise custom agents、Copilot CLI の操作改善、debug logs summary、Cloud agent GA が同時に進んだ更新だ。これは、Copilot が単一の補完ツールから、複数 agent を選択・配布・監査する開発面へ変わっていることを示している。

この流れは、以前扱った [GitHub Copilot JetBrains inline agent mode](/blog/github-copilot-jetbrains-inline-agent-mode-2026/) の延長にある。4月時点の主題は、JetBrains IDE 上で agent mode を呼び出し、global auto-approve や granular controls をどう扱うかだった。今回の更新では、同じ IDE 体験の中に Claude agent provider と組織配布 agents が入ってくる。つまり、権限設計の問題が、agent selection と agent governance の問題へ広がった。

## 事実: Claude providerはローカルCLIとpreview policyに依存する

GitHub の changelog によると、Claude as agent provider は public preview として JetBrains IDEs で利用できる。手順は、Claude Code CLI をローカルにインストールし、JetBrains の Settings から Tools、GitHub Copilot、Chat へ進み、Claude Code CLI path を設定する。その後、Copilot Chat panel の agent picker で Claude を選んでセッションを開始する。

ここで企業が見落としてはいけない制約がある。GitHub は、Claude agent が現時点では bypass permissions mode で動き、file edits と tool calls が automatically approved されると明記している。さらに、configurable permissions は future release とされている。Copilot Business / Enterprise では、管理者が Editor preview features policy を有効にする必要もある。

この構成は、個人開発者にはすぐ試しやすい一方、企業ではかなり重い。ローカル CLI の導入、IDE plugin の設定、Copilot 側の preview policy、agent の permission model が同時に関わるからだ。特に bypass permissions mode は、単に「便利な自動承認」ではなく、監査・レビュー・最小権限の設計対象である。

## 事実: custom agentsとCloud agent GAが管理面を変える

同じ changelog では、organization と enterprise レベルで定義された agents を JetBrains IDE から使えるようになったことも示されている。管理者は curated な agents を公開でき、それらが組織・Enterprise の開発者に利用可能になる。GitHub Docs の custom agents 説明では、agent profile を `.agent.md` として作り、description、tools、prompts を設定する流れが説明されている。public preview の対象には JetBrains IDEs、Eclipse、Xcode も含まれる。

Cloud agent の一般提供も同時に重要だ。GitHub Docs は、Copilot cloud agent を、リポジトリを調査し、実装計画を作り、ブランチ上でコード変更を行い、利用者が diff を確認して PR に進められる agent と説明している。これが GA になり、IDE 側で organization / enterprise agents と Claude provider が並ぶと、開発者は「どの agent をどの場面で使うか」を日常的に選ぶことになる。

この点は、[Copilot Agent Finder と ARD](/blog/github-copilot-agent-finder-ard-2026/) の論点と接続する。agent が増えるほど、発見、配布、説明、廃止、権限、監査が問題になる。さらに [Copilot code review の AGENTS.md 対応](/blog/github-copilot-code-review-agents-md-2026/) で見たように、リポジトリ内の指示ファイルも agent 動作に影響する。今回の JetBrains 更新は、そうした agent governance を IDE の日常利用面へ持ち込む。

## 分析: JetBrains標準組織ほど影響が大きい

ここからは分析だ。

日本の開発組織では、JetBrains IDEs は Java、Kotlin、Spring、Android、業務システム、金融・製造系の開発で根強く使われている。VS Code 中心のフロントエンドや軽量ツール導入と違い、JetBrains はチーム標準、端末標準、プラグイン配布、社内ネットワーク、プロキシ、ライセンス管理と結びつくことが多い。

そのため、Claude agent provider preview は「個人が便利に試す」だけでは終わらない。Claude Code CLI をどう配布するか、どのバージョンを許すか、管理端末で実行できるか、社内プロキシや認証と衝突しないか、ログはどこに残るか、Copilot 側の preview policy とどう整合するかを見なければならない。

さらに、組織/Enterprise agents の配布は、開発部門の標準化にも関わる。たとえば、テスト追加 agent、セキュリティ初動 agent、Spring 移行 agent、レガシーコード調査 agent、レビュー準備 agent のように、組織が用途別 agent を配ることはできる。しかし、標準 agent が増えすぎると、開発者は何を選べばよいか分からなくなる。agent catalog を作るなら、owner、対象リポジトリ、許可 tools、使用例、廃止日、問い合わせ先が必要になる。

## bypass permissions modeはpreview隔離で扱う

今回の最大リスクは bypass permissions mode である。GitHub の説明では、Claude agent の file edits と tool calls は自動承認される。これは、4月の global auto-approve と同じ種類のリスクを、Claude provider preview の文脈で再び持ち込む。

企業での現実的な扱いは、preview 隔離である。まず、低機密リポジトリ、教育用コード、サンプルサービス、テスト専用ブランチ、社内 sandbox を対象にする。次に、CI が必ず走るようにし、PR 作成前に人間レビューを必須にする。さらに、Claude Code CLI の利用ログ、Copilot の agent session、変更ファイル、tool call の範囲を記録する。permissions が細かく設定できるまでは、本番系リポジトリや高機密コードでの利用は避ける方がよい。

この判断は、Claude の性能を低く見ているわけではない。むしろ、強い agent ほど慎重に入れるべきという話だ。ファイル編集や tool call を自動承認する agent は、正しければ速いが、間違えると広い範囲に影響する。特に、日本企業の既存コードベースでは、暗黙の業務仕様、委託先との責任分界、古いテスト不足、非公開の運用手順が絡む。agent がそれを完全に読めるとは限らない。

## 導入評価で見る指標

PoC の成功条件は、Claude agent が何件コードを書いたかでは足りない。見るべき指標は、少なくとも五つある。

第一に、意図しないファイル編集の有無。agent がタスク外のファイルを変更していないか、設定やロックファイルを不必要に触っていないかを見る。

第二に、tool call の範囲。ターミナルコマンド、外部ツール、ファイル読み取り、生成物の扱いが、チームの許容範囲に収まっているかを確認する。

第三に、レビュー差し戻し率。agent の出力が一見動いても、設計意図や既存規約に合わず差し戻されるなら、実運用では負荷が増える。

第四に、組織 agents との役割分担。GitHub cloud agent、Claude provider、社内 custom agent のどれを使うべきかが曖昧だと、評価結果が散る。

第五に、モデル・agent 増加による教育コストである。[MAI-Code-1-Flash の Copilot surface 拡大](/blog/github-copilot-mai-code-flash-surfaces-2026/) でも見たように、Copilot では利用面とモデル選択が増えている。選択肢が増えるほど、開発者教育と標準ガイドが必要になる。

## 日本企業向けの現実的な進め方

最初のステップは、Editor preview features policy を有効にする範囲を絞ることだ。全社ではなく、JetBrains に慣れていて、CI とレビュー文化が整い、機密度の低いリポジトリを持つチームから始める。

次に、Claude Code CLI の導入経路を決める。端末管理ツールで配布するのか、開発者が個別に入れるのか、バージョン固定するのか、プロキシや認証の手順をどう書くのかを明確にする。ローカル CLI が関わる以上、IDE plugin だけの問題ではない。

三つ目に、agent picker の標準ガイドを作る。軽い説明や調査は Copilot Chat、リポジトリ作業は Cloud agent、特定業務は organization agent、Claude provider は preview 検証というように、用途別の推奨を示す。選択肢を並べるだけでは、現場は迷う。

最後に、preview 期間の出口条件を決める。たとえば、4週間の pilot で、差し戻し率、予期しない編集、開発者満足度、レビュー時間、tool call の問題件数を見る。その結果、範囲拡大、継続検証、停止のどれかを決める。preview は「なんとなく使い続ける」状態にしない方がよい。

## まとめ

GitHub Copilot の 2026年6月22日 JetBrains 更新は、Claude agent provider preview だけでなく、組織/Enterprise agents、Cloud agent GA、Copilot CLI 操作改善を含む agent platform 更新として読むべきである。JetBrains IDE の中で、どの agent を選び、誰が配り、どの権限で動かすかが実務論点になった。

日本企業では、Claude provider の bypass permissions mode をそのまま本番コードへ広げるべきではない。低機密な検証リポジトリから始め、Editor preview features policy、Claude Code CLI 配布、agent catalog、レビュー基準をそろえてから範囲を広げるのが現実的だ。Copilot の価値は増えているが、agent が増えるほど、運用設計の質が成果を左右する。

## 出典

- [New features and Claude as agent provider preview in JetBrains IDEs](https://github.blog/changelog/2026-06-22-new-features-and-claude-as-agent-provider-preview-in-jetbrains-ides/) - GitHub Changelog, 2026-06-22
- [Creating custom agents for Copilot cloud agent in your IDE](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-custom-agents-in-your-ide) - GitHub Docs
- [About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents) - GitHub Docs
