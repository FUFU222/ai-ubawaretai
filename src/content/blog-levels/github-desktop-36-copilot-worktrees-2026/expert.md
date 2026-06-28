---
article: 'github-desktop-36-copilot-worktrees-2026'
level: 'expert'
---

GitHub Desktop 3.6は、Copilotによるcommit authoringとmerge conflict resolution、repository instructions、model pickerとBYOK、Git worktreeを一つのローカルGitクライアントへ統合した。個々の機能は既存技術の延長だが、組み合わせると開発標準の境界が変わる。

これまで[Copilot appのcanvases](/blog/github-copilot-app-canvases-agent-work-2026/)はagent sessionの作業面、[Copilot appのBYOK](/blog/github-copilot-app-byok-model-providers-2026/)は推論providerの選択、[Copilot code reviewのAGENTS.md対応](/blog/github-copilot-code-review-agents-md-2026/)はPR上のreview指示を広げた。Desktop 3.6は、それらをcommit前後のlocal workflowへ接続する。

日本企業にとっての論点は、Git GUIを更新することではない。local clientで生成された提案をどのtrust levelで扱い、repository rulesとどう分担し、parallel workの分離をどこまで保証し、BYOKのデータ経路をどう説明するかである。

## 事実: Copilot SDKを軸にGit操作が再構成された

GitHubの2026年6月26日の発表では、GitHub Desktop 3.6のCopilot機能がCopilot SDKを共通基盤として使う。enhanced commit message experienceとmerge conflict workflowが同じ基盤上に置かれ、各Copilot機能にはmodel pickerが用意される。GitHub経由で利用できるモデルに加え、BYOKによる第三者providerまたはlocal modelへの接続も示された。

commit authoringでは、`.github/copilot-instructions.md`と`AGENTS.md`を読み、repositoryのcommit metadata rulesを考慮する。merge conflictでは、衝突する変更を説明し、利用者がreview、accept、editできる解消案を提示する。

Git worktree対応は、同じrepositoryに複数のworking directoryを作る機能である。release notesはworktree supportとCopilot conflict resolutionを3.6.0のNew項目として明記している。また、進行中のcommit message生成を停止できる改善、競合状態が無効になった際にdialogが固まる問題の修正、WindowsでのWarp terminal検出なども含まれる。

GitHubのworktree解説では、worktreeによって現在のbranchとeditor contextを維持したまま別branchの作業を始められると説明される。AIによってparallel sessionが増え、code writingよりcode reviewの比重が上がる状況が、worktree再評価の背景として挙げられている。

## merge conflict支援のtrust boundary

merge conflict resolutionをLLMへ任せる際、最初に分けるべきはsyntactic conflictとsemantic conflictである。syntactic conflictは、同じ行付近に異なる変更が入り、Gitが自動mergeできない状態だ。semantic conflictは、テキスト上はmergeできても、二つの変更の前提が衝突して動作が壊れる状態である。

Desktop 3.6が直接扱う入口は、Gitが検出したconflictである。しかし、AIが提示する解消案はsemanticな判断を含み得る。たとえば片方のbranchがAPI parameterを追加し、もう片方がvalidationを変更した場合、両方の行を残すだけではcontractが成立しない。DB migrationの順序、feature flagのdefault、permission check、retry policy、timezone処理も同様だ。

したがって、組織のquality gateは「conflict markerが消えた」では終われない。解消後diffで両branchのintentを追跡し、関連testを再実行し、contractを所有するreviewerへ回す必要がある。高リスク領域では、Copilot suggestionの利用有無に関係なくCODEOWNERSとrequired reviewを維持する。

監査の観点では、誰が提案をacceptし、どのcommitで解消し、どのCI結果を根拠にmergeしたかが重要になる。Desktop内の操作だけで完結させず、Pull Requestへpushし、通常のreview recordを残す運用が妥当だ。AIが案を出したこと自体より、人間が何を確認したかを記録する。

競合解消の評価には、acceptance rateだけを使わない。解消後に追加修正された割合、revert、regression、test failure、reviewerが意図欠落を指摘した件数を見る。短期的な操作時間が減っても、後段で不具合が増えるなら品質改善とは言えない。

## repository instructionsの設計

`AGENTS.md`と`.github/copilot-instructions.md`がcommit authoringへ使われることで、repository instructionsは複数surfaceに効く設定資産になる。coding agent、code review、local commit messageで同じ語彙を使える一方、用途が異なる指示を一つのfileへ詰め込むと、矛盾とtoken overheadが増える。

設計では、descriptive ruleとenforcement ruleを分けたい。descriptive ruleは、domain用語、変更種別、test command、commit messageの期待、説明で触れるべきriskなど、AIが生成時に参照する内容である。enforcement ruleは、署名、branch protection、status check、metadata pattern、required reviewer、push restrictionなど、GitHub側が拒否できる内容である。

AI instructionはsoft controlであり、常に完全適用される保証はない。対してrulesetとCIはhard controlとして失敗させられる。たとえば`feat(scope): summary`形式の文案を`AGENTS.md`で促してもよいが、必須であればmetadata restrictionかCIで検証する。機密情報をcommit messageへ含めない規則も、指示に加えてsecret scanningやreviewで補強する。

ownershipも必要だ。root `AGENTS.md`はrepository全体のownerが管理し、Copilot固有の生成方針は`.github/copilot-instructions.md`、path-specificな開発指示は対象directoryに近い設定へ分ける。変更はPull Requestとし、security、platform、product ownerのどこが承認するかを明確にする。

さらに、commit messageとPR descriptionの役割を混ぜない。commitには変更単位とintentを短く残し、PRには背景、検証、rollout、risk、rollbackを書く。LLMに情報量を増やさせるだけでは、historyの可読性が下がる。squash mergeを使うrepositoryでは最終messageの生成・編集責任も決める必要がある。

## BYOKとmodel routingの統制

Desktop 3.6のmodel pickerは、taskごとにモデルを変える柔軟性を与える。BYOKを使えば、企業の既存cloud契約、internal gateway、local inferenceを選べる可能性がある。ただし、local Git clientであることは、推論がlocalで完結することを意味しない。

data flowを明示すると、少なくともDesktop client、Copilot SDK、選択provider、credential store、repository data、telemetryやprovider logが関係する。commit message生成ではstaged diffやrepository instructions、conflict resolutionでは衝突したcodeと周辺contextが送信対象になり得る。データ分類とprovider契約を対応させる必要がある。

日本企業では、provider allowlistをrepository riskごとに作るとよい。公開OSS、一般的な社内tool、顧客データを扱うsystem、規制対象systemを分け、GitHub-hosted model、承認済みcloud tenant、internal gateway、local modelの可否を決める。個人API keyをproduction repositoryで使わせないことも明文化する。

credential lifecycleは導入時より撤去時が難しい。API keyの発行者、owner、rotation、退職・異動時の失効、紛失端末のremote wipe、利用ログの照合を決める。OS credential storeに保存されることと、企業のsecret management要件を満たすことは同義ではない。

cost attributionも分かれる。CopilotのseatまたはAI利用量、外部providerのtoken charge、local modelの端末費用、reviewerの追加工数を合算しなければならない。安いモデルが誤った解消案を増やせば、review costで逆転する。model benchmarkだけでなく、実repositoryでのtotal cost per accepted changeを見るべきだ。

## worktree isolationの実像

Git worktreeは、同一repositoryの複数branchを別working directoryへ展開する。Git object databaseやrefsなどを共有するため、full cloneより軽く、branch切り替えやstashを減らせる。一方、security isolation primitiveではない。

最初の注意点はshared Git stateである。worktreeごとにworking filesは分かれるが、repositoryの履歴と管理情報を共有する。同じbranchを二つのworktreeで同時checkoutできない制限もある。hook、config、credential helper、submodule、Git LFSの挙動を理解せずにagent sandboxと呼ぶべきではない。

第二はfilesystemとprocessだ。worktreeがsibling directoryにあっても、process権限が許せば他directoryを読める。agentにshell accessを与える場合、worktree boundaryだけではmain checkout、home directory、credential、socket、container daemonへのアクセスを防げない。必要ならOS sandbox、container、VM、cloud sandboxを別に使う。

第三はdependencyとartifactである。GitHubの解説が挙げる通り、各worktreeで`npm install`や`pip install`を行えばdisk使用量が増える。build cache、test database、port、temporary file、generated client、local serviceが共有名を使うと、parallel task同士が干渉する。directoryだけでなくruntime resourceをnamespacingする必要がある。

第四はsecret distributionである。`.env`をworktreeごとにcopyすると、削除漏れと古いcredentialが増える。secret manager、短命token、task-specific credentialを使い、worktree削除時に失効させるほうがよい。production credentialはparallel agent taskへ渡さない。

第五はlifecycleである。作成者、issue、branch、期限、merge statusを追い、不要になったworktreeを正規のGit操作で削除する。folderだけを手動削除すると管理情報が残る場合がある。自動cleanupはuncommitted changesを検知して止まり、強制削除には人間判断を要求すべきだ。

## parallelismを増やす前のcapacity設計

worktreeで作業開始の摩擦が下がると、同時作業数は増えやすい。しかし、system throughputはreview、CI、test environment、deploy windowの最小capacityで決まる。coding agentが5本のbranchを作っても、reviewerが1本ずつしか確認できなければWIPが積み上がる。

日本の開発組織では、teamごとのWIP limitを決める価値がある。個人あたりのactive worktree数、agent session数、同一moduleの同時変更数、review待ちPR数を見えるようにする。特にmonorepoでは、別directoryでも同じshared libraryを触ればmerge conflictが集中する。

task decompositionも変える必要がある。並列化しやすいのは、独立したtest追加、docs、dependency調査、互いに触らないcomponent、事前にinterfaceを固定した実装である。schema migrationとconsumer変更、認可policyとUI、shared configのように順序依存が強い作業は、無理に並列化しない。

[Copilot cloud agentの自動実行](/blog/github-copilot-cloud-agent-automations-2026/)とlocal worktreeを併用する場合、どのtaskがどのexecution surfaceにあるかを追う必要がある。local Desktop、Copilot app、cloud agent、CI botが同じrepositoryへbranchを作ると、ownerとcleanup責任が曖昧になる。branch prefix、label、author metadata、expiration policyを統一するとよい。

## rolloutと評価指標

rolloutは、Desktop 3.6の配布、instruction整備、model policy、worktree policyを一度に全社展開しない。まず二、三のrepositoryでbaselineを取る。docsやtest中心の低リスクrepo、競合が適度に起きるapplication repo、GUI利用者が多いteamを選ぶと評価しやすい。

第一段階ではcommit authoringだけを有効にし、生成messageのedit rate、規約違反、所要時間を見る。第二段階で低リスクconflictへ広げ、test failure、review correction、regressionを測る。第三段階でworktree運用を導入し、stash回数、context switch時間、disk usage、orphan worktree、PR WIPを測る。

BYOKは別のchange managementとして扱う。providerごとにsecurity review、data handling、billing ownerを決め、approved repositoryだけで試す。model pickerを自由化する前に、default modelと禁止条件を設定する。

成功指標は、平均競合解消時間の短縮だけでは足りない。解消後failure rateが維持または低下し、commit historyの可読性が上がり、reviewer correctionが増えず、orphan worktreeとsecret copyが管理範囲に収まることを確認する。throughputとquality、cost、governanceを同時に見る。

incident時のrollbackも用意する。Desktopのauto updateを止める条件、Copilot機能を使わない手動手順、BYOK keyの一括失効、worktreeから通常branch workflowへ戻す方法を文書化する。AI機能が利用できなくてもGit operationを継続できることが重要だ。

## 日本企業向けの最小ポリシー

最小ポリシーには、次の内容を含めたい。Copilotのconflict proposalはuntrusted draftであり、人間がdiffとtestを確認する。security、permission、payment、PII、migrationではCODEOWNER reviewを必須にする。生成commit messageも通常のmetadata ruleを通す。

repository instructionsには秘密を書かず、ownerとreview cycleを設定する。hard requirementはGitHub rulesetかCIで強制する。BYOKは承認済みproviderと企業管理keyだけを使い、個人keyを禁止する。data classificationに応じて利用可能modelを分ける。

worktreeはrepository外の管理rootへ作り、issueまたはtask IDを含む名前を使う。`.env`をcopyせず、task-specific secretを供給する。active数と期限を設け、mergeまたはclose後にcleanupする。worktreeをcontainerまたはsecurity sandboxと表現しない。

最後に、AIが作った変更と人間が作った変更を別quality barにしない。AI利用を理由にreviewを厳しくしすぎて速度を失うことも、AIを理由にreviewを省いてriskを上げることも避ける。変更の影響度でbarを決める。

## まとめ

GitHub Desktop 3.6は、Copilot SDKを通じてcommit authoringとmerge conflict resolutionを統合し、repository instructions、model picker、BYOK、worktreeをlocal Git workflowへ持ち込んだ。これは、GUIの利便性向上であると同時に、trust boundary、policy ownership、data routing、parallelismの設計変更である。

日本企業が導入するなら、conflict proposalをreview可能なdraftとして扱い、hard ruleをrulesetとCIへ残す。BYOKはprovider・credential・costを管理し、worktreeはshared stateを持つworking directoryとして扱う。並列度はreviewとCIのcapacityに合わせる。

この設計があれば、Desktop 3.6は初心者向けのGit補助に留まらない。人間とagentが複数branchを扱う時代に、commit、conflict、model、workspaceを共通ポリシーへ接続する実務基盤として評価できる。

## 出典

- [GitHub Desktop 3.6: Worktrees and deeper Copilot integration](https://github.blog/changelog/2026-06-26-github-desktop-3-6-worktrees-and-deeper-copilot-integration/) - GitHub Changelog, 2026-06-26
- [GitHub Desktop 3.6.0 release](https://github.com/desktop/desktop/releases/tag/release-3.6.0) - GitHub, 2026-06-24
- [What are git worktrees, and why should I use them?](https://github.blog/ai-and-ml/github-copilot/what-are-git-worktrees-and-why-should-i-use-them/) - GitHub Blog, 2026-06-16
