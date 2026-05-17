---
article: 'github-copilot-memory-user-preferences-2026'
level: 'expert'
---

GitHub Copilot Memoryのuser-level preferences対応は、Copilotを「毎回プロンプトで細かく指示するツール」から、「ユーザー本人の作業傾向を前提に振る舞うagent基盤」へ寄せる更新だ。2026年5月15日のGitHub Changelogでは、Copilot ProとCopilot Pro+ユーザー向けに、Copilot Memoryが個人の好みを早期アクセスとして保存・利用できるようになったと発表された。

この変更は、個人開発者にはプロンプト短縮として見える。しかし、企業の開発基盤として見ると、identity、policy、repository knowledge、agent task template、review responsibilityの境界を再設計する話になる。特に日本企業では、開発者が複数organization、委託先、子会社、共同開発先をまたいで作業することが珍しくない。個人のpreferenceがどのscopeで使われ、どの管理者が止められ、誰が削除できるのかを把握しないまま展開すると、期待した統制と実際のagent挙動がずれる。

すでにGitHub Copilotは、[Copilot cloud agent tasks REST API](/blog/github-copilot-cloud-agent-rest-api-2026/)で外部自動化からagent taskを起動できる方向に進み、[GitHub Copilot app](/blog/github-copilot-app-technical-preview-2026/)でIssue、PR、session、workflowを扱う作業面を提供し始めている。さらに[チーム別Copilot usage metrics API](/blog/github-copilot-team-metrics-api-2026/)により、利用状況を部門やチーム単位で見る材料も増えている。Memoryはこの流れの中で、agentに渡るcontextの持続性を担う部品と見るべきだ。

## 事実: Copilot Memoryの記憶は2系統に分かれる

GitHub Docs上のCopilot Memoryは、大きく2種類に分けて説明されている。

1つ目は**repository-level facts**だ。これはリポジトリに関するfactであり、coding conventions、architectural decisions、build commands、project-specific rulesのような知識を含む。Docsでは、これらは根拠となるコードへのcitationを持ち、現在のbranchに照らして正確性を確認したうえで使われると説明されている。保存されたfactは、そのリポジトリでCopilot Memoryを利用できるユーザーに共有される。

2つ目は**user-level preferences**だ。これはユーザー本人の好みであり、GitHubの5月15日の発表では、commit style、pull requestの構成、communication and tone preferencesが例示されている。Docsでは、user-level preferencesはそのユーザー本人にだけ利用され、後続のCopilot interactionに使われると説明されている。

この分離は、権限設計上かなり重要だ。repository-level factsは、チームの共有知識として扱える。たとえば、リポジトリ所有者やCODEOWNERSが「このfactは正しい」「このfactはもう古い」と判断できる。一方でuser-level preferencesは、本人のinteractionに紐づくため、組織の標準と混同してはいけない。会社標準や監査上の禁止事項をuser preferenceに頼るのは設計として弱い。

## 事実: 利用surfaceには差がある

GitHub Docsでは、Copilot Memoryが現在使われる場所としてCopilot cloud agent、Copilot code review、Copilot CLIが挙げられている。ただし、Copilot code reviewはrepository-level factsのみを使い、user-level preferencesは適用されないと説明されている。

この制約は、レビュー運用ではむしろ健全だ。PRレビューはチーム品質の判定に近いため、個人の文体や好みが強く入りすぎると、レビュー基準がばらつく。repository-level factsだけに寄せることで、「このリポジトリではこう作るべき」という共有基準に近い使い方になる。

一方、Copilot CLIやcloud agentでは、ユーザー本人の作業スタイルが反映される余地がある。たとえばCLIで修正を依頼したときに、commit message、説明文、PR本文の構成が本人の好みに寄る。これは生産性には効くが、企業が標準化したい出力と衝突する可能性もある。

ここで重要になるのが、プロンプトテンプレートとMemoryの関係だ。内製ポータルからCopilot cloud agent taskを起動する場合、企業側はbase_ref、model、PR作成方針、禁止事項、期待するテストなどをテンプレート化したい。一方、起動者のuser preferenceが「説明は短く」「テストは最小限から」などを持っている場合、テンプレートの明示指示とpreferenceが並存する。企業は、重要な制約をpreference任せにせず、明示的なプロンプト、リポジトリ手順、branch protection、required checksで固定すべきだ。

## 管理ポリシー: 個人契約と企業契約で初期状態が違う

Copilot Memoryの導入判断で見落としやすいのは、契約形態による初期状態の違いだ。

GitHub Docsでは、個人のCopilot ProまたはCopilot Pro+ではCopilot Memoryが既定で有効になり、ユーザー本人が個人設定から無効化・再有効化できると説明されている。これは、個人契約の開発者にとってはすぐ試せる設定だ。

企業やorganization-managed subscriptionsでは逆に、Copilot Memoryは既定でオフだ。enterprise ownerは全体ポリシーを設定でき、organization ownerへ判断を委ねる、全体で有効化する、全体で無効化する、という選択肢を持つ。organization ownerは組織単位で有効化できるが、enterprise側のpolicyに制御される場合がある。

さらに、ユーザーが複数organizationからCopilot subscriptionを割り当てられている場合、最も制限の強い設定が適用される。すべてのorganizationで有効化されていない限りCopilot Memoryは使われない。日本企業の共同開発では、この条件が効きやすい。親会社organizationでは有効、子会社organizationでは無効、委託先organizationでは未設定、という状態では、ユーザーが期待したようにMemoryが効かない可能性がある。

このため、pilotでは単に「管理者画面で有効化したか」を見るだけでは足りない。実際の開発者が所属するorganization構成、Copilot subscriptionの割り当て元、enterprise policy、個人設定の状態を棚卸しし、どの組み合わせでMemoryが有効になるかを確認する必要がある。

## 保持と削除: 誤った記憶を消す運用が必要

Docsでは、使われなかったfactやpreferenceは28日後に自動削除されると説明されている。利用・検証された場合、タイマーはリセットされる可能性がある。これは、古い情報が永遠に残り続ける設計ではないという意味では安心材料だが、企業運用では「28日で消えるから放置してよい」とはならない。

repository-level factsは、間違っているとリポジトリ全体のagent出力に影響する。リポジトリ所有者は保存されたfactを確認し、不適切、誤解を招く、または古くなったものを削除できる。たとえば、移行前のbuild commandがfactとして残っていると、agentが古い検証手順を使う可能性がある。

user-level preferencesは、本人が確認・削除できる。ここではオンボーディングが重要になる。開発者が「Copilotがなぜこの書き方をするのかわからない」と感じたときに、Memory設定を確認し、不要なpreferenceを消す導線を知っていなければ、原因調査が無駄に長くなる。

日本企業では、AI機能の問い合わせが情シス、開発基盤、セキュリティ、GitHub管理者に分散しやすい。Memoryについては、少なくとも次の切り分けをヘルプ手順に入れるべきだ。

- 特定リポジトリだけでおかしいならrepository-level factsを確認する
- 自分のCopilotだけ全体的におかしいならuser-level preferencesを確認する
- 組織内でMemory自体が効かないならenterprise/organization policyを確認する
- 複数organization所属者は最も制限の強い設定が適用されることを確認する

## custom instructionsとの棲み分け

Copilot Memoryが入ると、custom instructionsやリポジトリ内ドキュメントを不要にできると考えたくなる。しかし企業運用では、むしろ役割分担が必要だ。

custom instructionsは、明示的なルールを書く場所だ。会社共通のセキュリティ方針、PR本文の必須項目、テスト実行の最低条件、禁止ライブラリ、ログに個人情報を出さない方針などは、明文化してレビューできる場所に置くべきだ。Memoryに任せると、いつ保存されたか、誰のinteractionで生まれたか、どの程度の強さで使われるかが見えにくい。

repository-level factsは、実際のコードベースからCopilotが学ぶ補助知識だ。これはcustom instructionsと競合するものではなく、明示ルールを補完する。たとえば、custom instructionsで「テストを必ず実行する」と書き、repository-level factsで「このリポジトリでは`npm run test:unit`と`npm run lint`が通常の検証手順」と学ばせる。この組み合わせは自然だ。

user-level preferencesは、出力の個人最適化に寄せるべきだ。説明の長さ、commit messageの好み、PR本文で最初にリスクを書くかどうか、会話のトーンなどだ。チーム品質に関わる制約をuser preferenceへ逃がすと、メンバーごとにagent出力がずれ、レビューで吸収するコストが増える。

したがって、導入ガイドでは次のような優先順位を示すのがよい。

1. 法務、セキュリティ、品質上の必須事項は明示的な組織・リポジトリルールに置く。
2. リポジトリ固有の事実はrepository-level factsで補助し、所有者が定期確認する。
3. 個人の文体や作業習慣はuser-level preferencesに任せ、本人が削除できるようにする。

## コスト観測とセットで見る

Memory自体は課金モデルの変更ではない。しかし、agentを使いやすくする機能は、結果として利用量を増やす可能性がある。特にCopilot Pro/Pro+の個人ユーザーでは、好みが反映されて作業が速くなるほど、Copilot CLIやcloud agentをより多く使うようになるかもしれない。

企業では、[AI Credits移行を見積もる運用](/blog/github-copilot-ai-credits-usage-report-2026/)と合わせて見る必要がある。Memory有効化前後で、agent session数、PR作成数、レビュー差し戻し、premium request、失敗したagent taskの比率を観測する。便利になったかどうかを、主観だけで判断しないためだ。

また、[チーム別usage metrics](/blog/github-copilot-team-metrics-api-2026/)を使う組織なら、pilot対象チームと非対象チームを比べられる。Memoryによりプロンプトの反復が減り、同じ成果を少ないinteractionで出せるなら、利用量あたりの成果は改善する。一方、agent利用が増えてレビュー待ちが膨らむなら、導入範囲やテンプレートを見直すべきだ。

ここで見るべきなのは、単純な使用量削減だけではない。Memoryの価値は、開発者が毎回背景説明をしなくて済むこと、PR本文やcommit styleが安定すること、リポジトリ慣習の反映漏れが減ることにもある。したがって、定量指標とレビュー担当者の定性評価を組み合わせるのが現実的だ。

## 日本企業向けの導入チェックリスト

日本の開発組織がCopilot Memoryを試すなら、次の順で進めるのがよい。

まず、対象を限定する。全社ではなく、開発基盤、SRE、QA自動化、内製ツールのように、agent利用が多く、レビュー責任者が明確なチームでpilotする。

次に、policyを確認する。enterpriseとorganizationの設定、個人設定、複数organization所属時の挙動を確認する。特に委託先を含む環境では、どのorganizationが最も制限の強い設定になるかを見ておく。

次に、記憶の分類を決める。会社標準はcustom instructionsや文書、リポジトリ慣習はrepository-level facts、個人の文体はuser-level preferencesという分担を明示する。

次に、削除手順をオンボーディングに入れる。repository-level factsはリポジトリ所有者、user-level preferencesは本人が確認・削除する。問い合わせ時の切り分け表も用意する。

最後に、usage metricsとレビュー品質を見る。Copilot Memoryを有効化したチームで、session数、PR修正回数、レビュー差し戻し、agent task失敗率、premium requestの推移を追う。Memoryの導入は、気持ちよく使えるかだけでなく、開発運用として改善しているかで判断する。

## まとめ

GitHub Copilot Memoryのuser-level preferences対応は、個人の作業スタイルをCopilot agentに持ち運ぶ更新だ。Pro/Pro+ユーザーには便利な早期アクセスだが、企業導入ではidentityとpolicyの問題になる。

repository-level facts、user-level preferences、custom instructions、agent task templateは、それぞれ役割が違う。日本企業が見るべきなのは、どの記憶を誰が管理し、どのsurfaceで使われ、間違ったときに誰が消せるかだ。Copilotが開発作業面へ広がるほど、Memoryは単なるパーソナライズではなく、agent governanceの一部になる。

## 出典

- [Copilot Memory supports user preferences for Pro, Pro+ users](https://github.blog/changelog/2026-05-15-copilot-memory-supports-user-preferences-for-pro-pro-users/) - GitHub Changelog, 2026-05-15
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory) - GitHub Docs
- [Managing and curating Copilot Memory](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory) - GitHub Docs
- [Copilot Memory now on by default for Pro and Pro+ users in public preview](https://github.blog/changelog/2026-03-04-copilot-memory-now-on-by-default-for-pro-and-pro-users-in-public-preview/) - GitHub Changelog, 2026-03-04
