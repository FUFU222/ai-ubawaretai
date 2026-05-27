---
article: 'github-copilot-memory-repo-cli-controls-2026'
level: 'expert'
---

GitHub Copilot Memoryの2026年5月26日更新は、Copilotの文脈保持を企業運用へ近づける変更だ。Changelog上は、削除案内、repository-level off switch、Copilot CLIの`/memory`コマンド、保存時のスコープ表示という比較的小さな改善に見える。しかし、CopilotをCLI、cloud agent、code review、Spaces、モデルルールまで含む開発基盤として運用している組織では、これは「AIが何を記憶するか」を管理対象にするための部品になる。

前提として、[Copilot Memoryのuser-level preferences](/blog/github-copilot-memory-user-preferences-2026/)はすでに個人の作業スタイルをCopilotに持ち込む流れを作っていた。今回の更新は、その便利さを管理しやすくする方向だ。特に日本企業では、親会社、子会社、委託先、共同開発先、規制業務のリポジトリが同じGitHub Enterprise Cloudの中で混ざりやすい。Memoryのscope、削除権限、CLI状態、repository off switchを明確にしないまま広げると、開発者体験は良くなっても説明責任が弱くなる。

## 事実: 今回追加された制御点

GitHub Changelogが示した変更は4つある。

第一に、Memory削除に関する案内が改善された。ユーザーがCopilotに忘れるよう依頼した場合、Copilotは削除すべき場所へ誘導し、投票が使える場所では該当Memoryを低評価する。これは、自然言語の「忘れて」がそのまま全保存領域の削除命令になるわけではないことを示している。保存場所とスコープに応じて、ユーザーや管理者が適切な場所で処理する設計だ。

第二に、repository-level off switchが追加された。リポジトリ管理者は、既存のCopilot feature controlsから、そのリポジトリでCopilot Memoryを無効化できる。無効化されたリポジトリではrepository-level factsが保存も参照もされない。ただし、既存factsは自動削除されず、user-level preferencesにも影響しない。

第三に、Copilot CLIへ`/memory`コマンドが入った。`/memory on`、`/memory off`、`/memory show`で、Memoryの有効化、無効化、状態確認ができる。設定はsessionをまたいで保持されるため、単発sessionの一時状態ではなく、利用者のCLI運用に残る選択として扱うべきだ。

第四に、`store_memory` permission promptが、保存対象のscopeを明示するようになった。user-level preferenceとして保存されるのか、repository-level factとして保存されるのかを許可時点で見られる。これはレビュー不能な裏側の記憶ではなく、保存の瞬間に人間が判断する余地を増やす変更だ。

## repository-level factsのリスクは共有性にある

GitHub Docsでは、repository-level factsはcoding conventions、architectural decisions、build commands、project-specific rulesのような情報だと説明されている。保存されたfactは、同じリポジトリでCopilot Memoryを使えるユーザーに利用される。さらに、factsは根拠となるコードへのcitationを持ち、利用時には現在のbranchに照らして確認されるとされている。

この設計は合理的だ。リポジトリのテスト方法、設定ファイルの関係、推奨される実装パターンは、個人の記憶ではなくチームの共通知識だからだ。Copilot cloud agentが過去に把握した「このリポジトリではDB接続を特定の層で扱う」というfactを、後続のcode reviewやCLI作業で活かせるなら、出力の一貫性は上がる。

ただし、共有されるからこそリスクもある。間違ったfactが保存されると、1人の誤解が複数ユーザーのCopilot出力へ波及する。古い設計判断が残れば、新しい実装方針と衝突する。短命のbranchや閉じたPRで発生した知識が、現在のcodebaseでは妥当でない可能性もある。

Docsは、保存情報が使われなければ28日後に自動削除されると説明しているが、それだけで運用責任が消えるわけではない。重要リポジトリでは、CODEOWNERSやリポジトリ管理者がrepository factsを定期的に確認し、間違ったものを削除する手順が必要になる。今回のoff switchは、その前段として「このリポジトリではそもそもrepository factsを使わない」という選択を提供する。

## user-level preferencesは会社標準ではない

user-level preferencesは、個人の作業スタイルやCopilotとのやり取りの好みに近い。PR本文の粒度、説明文のトーン、commit messageの好み、普段の進め方などが該当する。これは便利だが、企業標準と混ぜるべきではない。

たとえば、ある開発者が「説明は短く」「テストはまず最小限で」といったpreferenceを持っているとする。これは個人作業では効率的かもしれない。しかし、規制業務のリポジトリや高リスク変更では、詳細な説明、テスト証跡、レビュー観点の明示が必要になる。個人preferenceが会社の品質基準を上書きするように見えてはいけない。

そのため、企業では情報の置き場所を分けるべきだ。会社標準はorganization-level custom instructions、policy、研修資料、レビュー規程へ置く。プロジェクト共通の文脈は[Copilot Spaces API](/blog/github-copilot-spaces-api-ga-context-2026/)で管理する。リポジトリ固有の反復知識はrepository-level factsで補助する。個人の文体や作業好みはuser-level preferencesに任せる。この分離を明文化しないと、Copilotの文脈機能が増えるほど運用が混乱する。

## CLIの`/memory show`は障害切り分けにも使える

Copilot CLIに`/memory on/off/show`が入ったことは、開発者体験だけでなくサポート運用にも効く。

Copilot CLIは、単なるローカルチャットではなくなっている。[Copilot CLI遠隔操作GA](/blog/github-copilot-cli-remote-control-ga-2026/)で整理した通り、session activityをGitHub MobileやWebから見て、途中で指示し、permission requestへ応答できる。長時間sessionや遠隔承認が増えると、sessionがどの文脈で動いているのかを説明できることが重要になる。

たとえば、あるチームから「Copilot CLIが昨日まで覚えていたテスト手順を使わなくなった」という問い合わせが来たとする。原因はモデル変更かもしれないが、Memoryがoffになっている可能性もある。リポジトリ側でoff switchが入った可能性もある。organization policyが変わった可能性もある。user-level preferenceが削除された可能性もある。`/memory show`は、この切り分けの最初の確認点になる。

また、セキュリティ作業や顧客環境の一時作業では、意図的に`/memory off`を使う選択もある。Memoryを無効化すれば、少なくともそのCLI利用者の設定としてMemoryを使わない作業にできる。ただし、リポジトリやorganization側の設定と合わせて確認する必要があるため、runbookには「CLIの状態」「repository setting」「organization policy」の3点を並べて書くべきだ。

## model rulesとMemoryは別の統制レイヤー

同じ5月26日には、[Copilot model rules](/blog/github-copilot-targeted-model-rules-2026/)も公開プレビューとして発表された。model rulesは、enterprise ownerがorganizationごとに使えるAIモデルを指定する機能だ。Memory管理とは別物だが、企業運用では同じ設計表に載せるべきだ。

モデルルールは「どのモデルに処理させるか」を制御する。Memoryは「そのモデルやagentにどの文脈が入るか」を制御する。Spacesは「共有文脈をどう用意するか」を制御する。CLI remote controlは「人間がどこから途中介入するか」を制御する。これらは独立しているが、実際のCopilot作業では同時に効く。

たとえば、委託先が参加するorganizationでは、高倍率モデルを制限し、repository Memoryをoffにし、Spacesには公開可能な設計情報だけを置き、CLI remote controlを管理端末に限定する、という組み合わせが考えられる。逆に社内基盤チームでは、標準モデルを広く許可し、repository factsを有効化し、Spacesで標準文脈を配り、CLI remote controlをpilot運用する、という組み合わせもあり得る。

このように、Memoryは単独で安全か危険かを判断するものではない。モデル、文脈、権限、端末、承認、削除の組み合わせで評価する必要がある。

## 日本企業向けの運用設計

実務では、次の順番で設計するのが現実的だ。

最初に、リポジトリを分類する。社内基盤、業務アプリ、顧客専用実装、規制業務、研究開発、短期PoC、OSS連携のように、Memoryを使う価値と説明責任が違う単位へ分ける。分類できないリポジトリは、Copilot以前にオーナーシップが曖昧な可能性がある。

次に、repository-level factsを許可する基準を作る。社内基盤や共通ライブラリのように反復知識が多い場所では有効化する。顧客秘密、個人情報、規制上の説明責任が重い場所ではoffを標準にする。重要なのは、例外を個人判断にしないことだ。

3つ目に、削除責任を明示する。repository-level factsはリポジトリ所有者が確認・削除する。user-level preferencesは本人が確認・削除する。問い合わせ先を分けないと、開発者は「Copilotが変なことを覚えた」と感じたときに誰へ言えばよいか分からない。

4つ目に、CLI runbookを更新する。`/memory show`で状態を確認する手順、`/memory off`を使う作業種別、`/memory on`へ戻す条件を書く。セキュリティ調査、障害対応、顧客環境、リリース作業では、Memoryの利用可否を作業開始チェックに入れてもよい。

5つ目に、他の文脈管理と役割を分ける。チーム標準はSpaces、リポジトリ慣習はrepository facts、個人好みはuser preferences、強制ルールはpolicyやCI、モデル許可はmodel rulesとする。この分担を短い図や表で示すと、現場は迷いにくい。

最後に、効果測定をする。Memoryを有効化したチームで、プロンプト反復が減ったか、Copilot CLI sessionの手戻りが減ったか、code reviewで同じ指摘が減ったか、逆に誤ったfact由来のミスが増えていないかを見る。Memoryは導入して終わりではなく、品質と統制の両方を測るべき機能だ。

## まとめ

GitHub Copilot Memoryの管理強化は、Copilotを企業の開発基盤として扱ううえで必要な制御点を増やした。repository-level off switch、CLIの`/memory`コマンド、削除導線、保存時scope表示は、それぞれ小さいが、組み合わせると「何を覚え、どこで使い、誰が止め、誰が消すか」を説明しやすくする。

日本企業が見るべき焦点は、Memoryをオンにするかオフにするかだけではない。リポジトリごとの機密性、委託先の参加、CLI利用、Spacesによる共有文脈、model rulesによるモデル制御を同じ表で管理することだ。Copilotの記憶は便利なパーソナライズではなく、AIエージェントの入力文脈そのものになる。だからこそ、削除と停止の設計を先に決めてから広げるべきだ。

## 出典

- [Copilot Memory has more controls for deletion, scope, and the Copilot CLI](https://github.blog/changelog/2026-05-26-copilot-memory-has-more-controls-for-deletion-scope-and-the-copilot-cli/) - GitHub Changelog, 2026-05-26
- [Managing and curating Copilot Memory](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory) - GitHub Docs
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory) - GitHub Docs
