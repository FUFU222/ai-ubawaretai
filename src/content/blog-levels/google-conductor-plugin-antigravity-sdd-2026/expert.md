---
article: 'google-conductor-plugin-antigravity-sdd-2026'
level: 'expert'
---

Google の **2026年7月16日**の Conductor Plugin 更新は、AI coding agent の実装力そのものより、作業状態をどこに置くかを問うものだ。Conductor は Gemini CLI extension から plugin へ移行し、Antigravity CLI でも利用できるようになった。Google は、Conductor が ephemeral chat logs から persistent, version-controlled Markdown files へ project awareness を移すことで、開発者が実装前に architecture を計画しやすくしてきたと説明している。

この文脈は、Google の developer agent platform 系の更新と連続している。[Google Antigravity移行、Code Assist開発の再設計](/blog/google-antigravity-code-assist-migration-2026/)では、開発者の AI 作業面が Antigravity へ移る意味を扱った。[Gemini API Managed Agents、運用設計の実務](/blog/google-gemini-api-managed-agents-2026/)では、agent 実行と運用責任を整理した。[Google ADK/A2A多言語化、エージェント連携の設計点](/blog/google-adk-a2a-cross-language-agents-2026/)では、エージェント間連携の設計を見た。

Conductor Plugin は、その上に「仕様と計画をどの tool でも読める repository artifact にする」という layer を置く。これは、日本企業が AI コーディングを本番開発へ入れるときに避けられない、再現性、レビュー責任、監査、委託先管理の問題に近い。

## Fact: plugin化でskills、rules、MCP、hooksを束ねる

Google Developers Blog は、Conductor が Gemini CLI extension から Conductor Plugin へ進化すると説明している。plugin は skills、rules、MCP servers、hooks を single package に含められる。つまり、Conductor は単なる command collection ではなく、agent の振る舞い、外部連携、実行前後の処理をまとめて配布できる単位になる。

この変更により、Conductor は strict command sequences から、より conversational な操作へ寄る。Google は、feature requirements を話し合う中で context、spec、plan を動的に生成し、更新できると説明している。一方で、`spec.md` と `plan.md` は残る。会話体験が柔らかくなっても、spec-driven development の procedural rigor は artifact として維持されるという設計である。

Conductor Plugin は Antigravity CLI に対応する。Google は Antigravity CLI へ導入するコマンドとして `agy plugins install https://github.com/gemini-cli-extensions/conductor` を示している。GitHub repository の README では、Conductor は Antigravity や Claude Code を含む AI coding agents 向け plugin とされ、Context、Spec & Plan、Implement の lifecycle を管理すると説明されている。

この portability は重要だ。これまで Conductor は Gemini CLI extension としての色が強かった。plugin 化により、特定の CLI だけでなく、複数の coding agent environment から同じ spec と plan を参照しやすくなる。ツールが変わっても repository に残る artifact が作業の基準になる、という方向である。

## Fact: repository artifactがAI作業の状態を持つ

Conductor の README は、context を managed artifact として code と並べることで、repository を single source of truth に変えると説明している。これは、AI agent の state management を chat transcript から repository へ移す発想だ。

具体的には、setup 時に product、product guidelines、tech stack、workflow などの project context を定義し、feature や bug fix の track では spec と plan を生成する。README は、track が high-level unit of work であり、spec は何をなぜ作るか、plan は phases、tasks、sub-tasks を含む actionable list として位置づけている。

この構造は、AI agent の作業を human reviewable にする。レビュー担当者は、最終 diff だけでなく、agent が前提にした product context、workflow、spec、plan を確認できる。plan の task がどの PR に対応するかを決めておけば、AI がどこまで完了したか、人間がどこを承認したかを追いやすい。

ただし、artifact があるだけで正確性が保証されるわけではない。spec が古い、plan が大きすぎる、workflow が現実に合っていない、MCP や hooks の権限が過剰、といった状態なら、Conductor はむしろ誤った前提を強く固定する可能性がある。artifact を作ることと、artifact を運用することは別である。

## Analysis: SDDはAI codingの承認境界を前倒しする

ここからは分析だ。

AI coding agent の典型的な失敗は、実装が先に進みすぎることだ。人間が「調べて」と言ったつもりでも、agent は変更案を作り、ファイルを編集し、テストを走らせ、PR まで進める場合がある。スピードは出るが、要求定義、設計判断、影響範囲、セキュリティ、運用責任が後追いになる。

Spec-driven development は、この承認境界を前倒しする。実装前に spec を作り、plan を作り、どの task をどの順に進めるかを可視化する。Conductor Plugin は、この流れを会話の中で自然に進めつつ、成果物を repository に残す。日本企業では、これは開発スピードよりもレビュー責任に効く。

たとえば、業務システムの権限変更を agent に任せる場合、いきなり code diff を見るより、先に spec で対象ユーザー、権限境界、監査ログ、移行手順、ロールバック条件を確認するほうが安全だ。plan では、テスト追加、実装、migration、ドキュメント更新、レビュー観点を分ける。AI はその plan に沿って作業し、人間は plan の単位で承認できる。

Conductor の portability は、この構造を複数 tool に持ち込める可能性を持つ。Antigravity で spec を作り、別の agent で実装を続けても、repository artifact が基準になる。ただし、モデル、tool permission、sandbox、ログ、承認 UI は tool ごとに違う。したがって、portability は無条件の自由ではなく、artifact を中心にした統制設計と一緒に使うべきである。

## Governance: pluginをソフトウェア部品として管理する

Conductor Plugin は、開発者が便利に入れる補助 tool としてだけ扱うべきではない。plugin は skills、rules、MCP servers、hooks を含められるため、組織の AI coding policy に直接影響する。導入時には、通常の dependency や CI tool に近い管理が必要になる。

第一に、installation scope を決める。Antigravity の end-user install、developer の live-sync global link、workspace-level isolation は、それぞれリスクが違う。個人が global に入れると使い始めやすいが、version と設定がばらつく。workspace-level に閉じれば repository ごとに管理しやすいが、運用負荷は増える。

第二に、CODEOWNERS と review rule を決める。`conductor/` 配下の product、workflow、track spec、plan、rules、hooks は agent の行動を左右する。これらを一般の application code と同じ承認ルールに置くと、仕様や agent 権限を意図せず変更できる。重要 repository では、product owner、architect、security、platform owner の承認を分けたほうがよい。

第三に、MCP と hooks の allowlist を作る。Conductor が MCP servers や hooks を package できるなら、外部 API、filesystem、git、issue tracker、deployment system への接続をどこまで許すかが問題になる。spec-driven development は作業順序を制御するが、tool 権限を制限するものではない。権限は別に設計する必要がある。

第四に、artifact retention と audit を決める。spec と plan は repository に残るため、監査には有利だ。一方で、機密仕様、顧客名、個人情報、未公開戦略が Markdown artifact に残る可能性もある。private repository でも、閲覧権限、branch protection、archive policy、削除方針を確認する必要がある。

## Operations: PRとtrackを対応させる

Conductor を実務に入れるなら、track、plan task、PR の対応を決めるとよい。1 track 1 PR にこだわる必要はないが、1つの plan task が複数の大きな PR に散るとレビューが難しくなる。逆に、巨大な track を1 PRで完了させると、AI も reviewer も失敗しやすい。

現実的には、調査 track、設計 track、テスト追加 track、実装 track、migration track、documentation track を分ける。AI に任せる task と、人間が先に見る task も分ける。たとえば、既存仕様の棚卸しやテスト追加は AI に進めさせやすい。一方、認可境界、課金、個人情報、DB schema、公開 API は、人間の設計承認後に実装させる。

レビューでは、diff だけでなく spec と plan を見る。PR template に track id、spec file、plan task、未完了 task、AI tool、model、MCP / hook 使用有無を書く。これにより、AI がどの前提で作業したかを reviewer が追える。これは [Google Jules評価、proactive coding agentの見極め方](/blog/google-jules-proactive-coding-agent-eval-2026/) で扱った agent 評価ともつながる。

失敗時の運用も決める。agent が plan task を完了扱いにしたが CI が落ちた場合、task を戻すのか、新しい task を作るのか、人間が引き取るのかを決める。Conductor の artifact は状態を見せるが、状態遷移の責任は組織が持つ。

## Risk: SDDを導入しても仕様の質は自動では上がらない

Conductor Plugin は spec-driven development を扱いやすくするが、仕様の質を自動で保証しない。曖昧な spec、矛盾した plan、古い product context を AI に渡せば、AI はその前提をもっともらしく実装してしまう。

そのため、導入初期は spec review を厚くするべきだ。実装前に、背景、非目標、受け入れ条件、テスト観点、セキュリティ、運用、ロールバックを確認する。plan review では、task が PR サイズとして妥当か、依存関係が順序化されているか、人間承認が必要な task が明示されているかを見る。

また、Conductor が複数 tool で使えることは、tool drift のリスクも持つ。同じ spec を読んでも、Antigravity、Claude Code、その他 agent で tool permission、model behavior、hook handling が違えば結果は変わる。portable artifact を使うほど、tool ごとの差分を run report や PR template に残すべきである。

## まとめ

Conductor Plugin の Antigravity 対応は、AI coding agent を単発の chat から、repository に残る spec と plan を中心にした作業へ寄せる更新である。plugin 化により、skills、rules、MCP servers、hooks を束ね、Antigravity CLI など複数の tool で spec-driven development を扱いやすくなる。

日本企業にとっての価値は、AI 実装の速度だけではない。仕様承認、計画レビュー、権限管理、委託先との責任分界、監査証跡を前倒しできることだ。Conductor を導入するなら、plugin、artifact、MCP / hooks、CODEOWNERS、PR template、失敗時の状態遷移をまとめて設計する必要がある。AI コーディングの標準化は、どのモデルを使うかから、どの作業状態を正とするかへ移っている。

## 出典

- [Evolving Spec-Driven Development: Conductor Now Supports Antigravity](https://developers.googleblog.com/evolving-spec-driven-development-conductor-now-supports-antigravity/) - Google Developers Blog, 2026-07-16
- [gemini-cli-extensions/conductor](https://github.com/gemini-cli-extensions/conductor) - GitHub
- [Getting started with Spec Driven Development in Antigravity](https://codelabs.developers.google.com/codelabs/getting-started-with-spec-driven-development-in-antigravity) - Google Codelabs
