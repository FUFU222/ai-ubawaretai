---
article: 'openai-codex-code-review-rules-agents-md-2026'
level: 'expert'
---

OpenAI の 2026年7月20日の発表は、Codex Code Review に `AGENTS.md` ベースの custom repository rules を持ち込むものだ。表面的には「レビューAIに追加指示を書ける」更新に見える。しかし、企業の開発基盤ではもう少し重い意味を持つ。AIレビューの品質を、モデル選択やPR本文だけではなく、リポジトリに置いた運用規約で制御する段階に入ったからだ。

これは [OpenAI Codex Security](/blog/openai-codex-security-workflow-2026/) の脆弱性調査支援や、[Codex Record & Replay](/blog/openai-codex-record-replay-skills-2026/) の定型作業化と同じ方向を向いている。Codexは単発のコード生成から、継続する作業、レビュー、修正、統制の面へ広がっている。Code Review rules は、そのうち「人間 reviewer の判断基準」をAIが参照できる形へ落とすための部品である。

## Fact: Codex Code ReviewはAGENTS.mdのレビュー規約を読む

OpenAI Developers の記事は、Codex Code Review が `AGENTS.md` に置いた repository rules を使えると説明している。想定されているのは、既存API契約、顧客データのログ出力、外部連携面のwire name、過去に問題になった非自明な互換性などである。どれも通常の静的解析やformat checkでは拾いにくい。

OpenAI Learn の Codex GitHub連携ドキュメントでは、Codex code review はGitHub PRに対して追加のレビューを投稿し、重大な問題に集中するものとして説明されている。利用者はPRコメントで `@codex review` と依頼でき、設定によって automatic reviews も使える。さらに、`AGENTS.md` の `## Code Review Rules` セクションで、Codex がPR差分を読むときのカスタム規約を与えられる。

AGENTS.md の設定ドキュメントでは、Codex が project root から作業ディレクトリまでの指示ファイルを探索し、`AGENTS.override.md`、`AGENTS.md`、fallback名を順に扱うことも説明されている。Code Review rules については、対象コードに最も近い `AGENTS.md` に置く、全体ルールはrootに置く、という設計が示されている。

つまり、OpenAIが勧める構造は、単一の巨大なレビュー指示ファイルではない。repository-wideの原則、service-specificな規約、例外条件、safe pathを、コードの構造に合わせて分けるものだ。この点を取り違えると、導入直後からAIレビューがノイズを出す。

## Fact: ルールは短く、scopeとsafe pathを持つ

発表記事で強調されているのは、ルールの粒度である。OpenAIは、reviewer が繰り返し説明している consequential で non-obvious な invariant を選ぶこと、scope を対象コードに合わせること、違反条件だけでなく safe path を書くことを勧めている。

この考え方は重要だ。AIレビューに「良いコードにする」「セキュリティを高める」「保守性を意識する」と書いても、PR差分上の具体的な指摘にはなりにくい。一方で、「外部利用者が購読しているイベント名は変更しない。変更するなら既存名を残し、新名を追加する」のようなルールなら、Codexは差分と照合しやすい。

また、OpenAIは mechanical checks をCIに残すべきだと示している。これはAIレビューの運用コストを下げるうえで正しい。format、lint、type check、unit test、dependency policy のような決定的に判定できるものをAIに見せると、コメントが増える割に信頼性が上がらない。AIレビュー rules は、CIで表現しにくい判断、過去事故、互換性、データ境界に絞るべきである。

## Analysis: レビュー規約はコードと同じく変更管理対象になる

ここからは分析である。

`AGENTS.md` の Code Review Rules は、単なるドキュメントではない。レビューAIの振る舞いを変える設定である。したがって、日本企業で本番運用するなら、READMEやメモよりも、CI設定、CODEOWNERS、branch protectionに近い扱いをしたほうがよい。

理由は三つある。

第一に、rules はPR authorへのフィードバックを変える。あるルールがあるかないかで、CodexがP1相当の指摘を出すか、何も言わないかが変わる。これは開発者体験だけでなく、レビュー待ち時間、修正回数、重大変更の検知に影響する。

第二に、rules は権限境界に関わる。認可、ログ、個人情報、課金、外部API、セキュリティ修正のルールを誰でも変更できるなら、AIレビューの検査面を誰でも弱められる。コード変更より目立たないため、むしろレビュー漏れしやすい。

第三に、rules は委託開発で説明責任を持つ。日本企業では、複数ベンダーやグループ会社が同じリポジトリにPRを出すことがある。AIレビューに見せる規約は、社内外の contributor が同じ基準を見るための入口になる。だからこそ、内容は秘密情報ではなく、行動として守るべき条件に落とす必要がある。

## Analysis: Copilot側のAGENTS.md対応と衝突させない

既存の [Copilot code reviewのAGENTS.md対応](/blog/github-copilot-code-review-agents-md-2026/) を導入している組織では、今回のOpenAI Codex側のrulesをそのまま足すと、指示ファイルが増えすぎる可能性がある。

現実のリポジトリには、少なくとも次の層が存在し得る。root `AGENTS.md`、nested `AGENTS.md`、`AGENTS.override.md`、`.github/copilot-instructions.md`、`.github/instructions/**/*.instructions.md`、`.github/skills`、README、社内開発標準、セキュリティチェックリストである。さらにOpenAI CodexとGitHub Copilotを併用する場合、どのAIがどのファイルを、どの優先順位で読むかを把握しなければならない。

ここで避けるべきなのは、同じレビュー観点を複数ファイルに微妙に違う言い方で書くことだ。たとえば root `AGENTS.md` に「PIIをログに出さない」と書き、Copilot instructions に「個人情報はdebug logなら一時的に許容」と書くと、AIレビューの出力がぶれる。人間 reviewer も、どちらを正とするか判断できない。

実務では、役割を分けるべきだ。root `AGENTS.md` はAI agent全体に効く基本原則とrepository-wideなCode Review Rules。nested `AGENTS.md` はサービス固有のreview invariant。Copilot-specificなUIやGitHub機能の挙動は `.github/copilot-instructions.md`。機械的に拒否できるものはCI、ruleset、branch protection。こう分けると、自然言語ルールと強制ルールを混同しにくい。

## Analysis: AIレビューのKPIは指摘数ではない

Code Review rules を入れると、短期的には「AIが指摘した数」を見たくなる。しかし、それは悪いKPIになりやすい。指摘数が増えても、重要でないコメントが増えればレビュー体験は悪化する。逆に、指摘数が少なくても、重大な互換性破壊を1件拾えるなら価値は高い。

日本の開発組織では、次の観点で測るほうがよい。重大な見落としの減少、人間 reviewer の再指摘の減少、AI指摘の採用率、false positive率、PR滞留時間、修正往復回数、セキュリティ/課金/個人情報関連PRでのレビュー漏れである。AIレビューを費用対効果で説明するなら、レビューコメント量ではなく、手戻りと事故予防の指標に寄せるべきだ。

この点は [Codex役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/) の話ともつながる。Codexの利用面が広がるほど、便利さの指標だけでは足りない。誰がどの権限で使い、どの成果物を誰がレビューし、どのログを残すかを一緒に見る必要がある。

## ルール設計の実務パターン

日本企業で最初に使いやすいルールは、次のような種類だ。

1つ目は、互換性ルールである。外部API、webhook payload、CSV export、モバイルアプリが依存するJSON field、既存顧客向けの設定名などは、単純なrenameでも壊れる。ルールには「削除・renameを検知する」「後方互換のaliasやmigration windowを残す」と書く。

2つ目は、データ境界ルールである。個人情報、法人情報、取引情報、診療情報、位置情報、credential、support ticketの本文をログやanalytics eventへ出さない。例外があるなら、匿名化、hash化、purpose、retention、access controlまで書く。

3つ目は、認可境界ルールである。管理者API、tenant境界、feature flag、support impersonation、break-glass操作は、普通のCRUDと同じレビューで扱わない。Codexには、特定パスや特定関数に触れたら人間 reviewer を必須にする観点を持たせる。

4つ目は、課金・締め処理ルールである。日本企業では月末締め、請求書、消費税、インボイス、契約更新、日割り計算が絡む。テストが通っても、業務ルールを知らないAI agentは簡単に壊す。ルールには、既存顧客への請求影響、過去期間の再計算、監査証跡を確認する条件を書く。

5つ目は、運用runbookとの接続である。障害対応、feature rollout、migration、backfill、削除処理は、コード差分だけでなく運用手順が必要になる。Code Review Rulesには「この種の変更ではrunbook更新を確認する」と書き、実際の強制はPR templateやCIのdocs checkと組み合わせる。

## 導入手順

最初の1週間では、既存レビューコメントを集める。過去3か月のPRから、同じ種類の指摘を抽出する。レビュー担当者に「何度も説明しているが、テストでは拾えないこと」を聞く。ここで候補が10個出ても、最初に入れるのは2、3個に絞る。

次に、各ルールを invariant、risk、safe path、scope に分けて書く。invariant は守る条件。risk は破ったときの影響。safe path は著者が取れる代替案。scope は対象ディレクトリやファイル種別である。文章は短くする。長い背景説明は別の内部文書に置き、`AGENTS.md` にはレビューAIが使う判断条件だけを残す。

3つ目に、代表PRで評価する。違反PR、安全な例外PR、無関係PRを用意し、Codex Code Reviewを走らせる。違反だけを拾えるか、safe pathを示せるか、無関係な変更にコメントしないかを見る。ここでノイズが出るなら、ルールを強くするのではなく、まずscopeを狭める。

4つ目に、ownerと変更手順を決める。`AGENTS.md` や nested rules の変更には、開発基盤または該当サービスownerのレビューを要求する。セキュリティ、個人情報、課金に関わるrulesは、専門ownerの承認を必要にする。ルール変更は、コード変更と同じPRで混ぜず、できれば独立PRにする。

5つ目に、AIレビューの扱いをPR運用へ明記する。Codexの指摘は追加reviewであり、required approvalの代替ではない。Codexが指摘しなかったから承認済み、という運用にしてはいけない。重大領域では人間 reviewer、CI、branch protection を残す。

## 失敗パターン

よくある失敗は、`AGENTS.md` に社内規程を丸ごと貼ることだ。これはAIにとっても人間にとっても読みにくい。規程は背景であり、Code Review Rules はレビュー時に使う判断条件である。用途を分ける必要がある。

次の失敗は、秘密情報を書くことだ。AIに分からせたいからといって、内部システム名、顧客名、未公開障害、脆弱性の再現手順をそのまま書くべきではない。レビュー規約に必要なのは、「どの種類のデータをどこへ出してはいけないか」「どの変更では誰の承認が必要か」である。

もう一つは、CIでできることをAIレビューに任せることだ。format、lint、type、unit test、license scan、secret scan は決定的に走らせるべきである。AIレビューは、そこから漏れる判断に絞る。そうしないと、AIのコメントが増えるほど人間が読まなくなる。

最後に、導入後に見直さないことも失敗になる。rules はコードや組織と一緒に古くなる。対象サービスが廃止された、APIが新versionへ移った、データ分類が変わった、AIレビューが何度も誤検知する、という状態になったら削る。ルールを増やすだけの運用は、いずれAIレビューを雑音にする。

## まとめ

Codex Code Review の `AGENTS.md` rules は、AIレビューをチーム固有の開発規約へ近づける更新である。OpenAIの一次情報から確認できる事実は、GitHub PRレビューでCodexを使い、`AGENTS.md` の `## Code Review Rules` に scoped rules を書き、repository-wideとservice-specificを分け、CIで拾えない非自明な観点に使う、という設計である。

日本企業にとっての論点は、機能をオンにするかではない。AIに何をレビューさせ、何をCIに残し、何を人間承認に残すかである。`AGENTS.md` は便利なメモではなく、AIレビューのポリシー面である。owner、scope、safe path、秘密情報の扱い、Copilot側instructionsとの重複、月次の品質評価まで決めて初めて、本番のPR運用に入れられる。

まずは少数の非自明なルールから始めるのがよい。過去のレビューコメントから候補を選び、違反PRと安全な例外PRで試し、ノイズが少ないことを確認する。そのうえで、開発基盤の標準として広げる。AIレビューの価値はコメントの多さではなく、人間が繰り返し説明していた重大な判断を、早い段階で安定して表面化できるかにある。

## 出典

- [Custom Code Review rules for Codex](https://developers.openai.com/blog/custom-code-review-rules-for-codex) - OpenAI Developers, 2026-07-20
- [Codex code review in GitHub](https://learn.chatgpt.com/docs/third-party/github) - OpenAI Learn
- [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) - OpenAI Learn
