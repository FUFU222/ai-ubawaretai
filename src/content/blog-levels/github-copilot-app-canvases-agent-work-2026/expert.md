---
article: 'github-copilot-app-canvases-agent-work-2026'
level: 'expert'
---

GitHub Copilot appの2026年6月2日更新は、GitHub Copilotのagentic workflowを「起動する機能」から「運用する作業面」へ進める発表だ。GitHubはtechnical preview対象を既存のCopilot Pro、Pro+、Business、Enterprise利用者へ広げ、同時にcanvases、cloud sessions、cloud automations、Copilot CLI session連携、agentic browsing、voice conversations、rubber duck、`/chronicle` を示した。

すでに[GitHub Copilot appのtechnical preview](/blog/github-copilot-app-technical-preview-2026/)では、Issue、Pull Request、prompt、過去sessionからagent作業を始め、session単位でbranch、files、conversation、task stateを分ける方向が出ていた。[Copilot cloud agent automations](/blog/github-copilot-cloud-agent-automations-2026/)では、agent sessionをscheduleやIssue/PR eventから起動する運用が加わった。今回のcanvasesは、その上に「agentが進める作業をどの面で検査し、直し、引き継ぐか」という層を足す。

日本企業にとって重要なのは、Copilot appを単なるdeveloper desktop appとして扱わないことだ。appの中でlocal session、cloud sandbox、browser、terminal、PR、automation、session history、canvas extensionが接続されるほど、管理対象はIDE補完からagent実行基盤へ変わる。導入判断も、UIの使いやすさではなく、権限、監査、費用、レビュー責任、データ境界の設計で見る必要がある。

## 事実: paid plan preview拡大とBusiness/Enterprise条件

GitHub Changelogは、Copilot app technical previewが既存のCopilot Pro、Pro+、Business、Enterprise利用者に開かれたと説明している。Copilot Free利用者と未契約ユーザーはwaitlist対象だ。GitHub Docsも同じく、BusinessとEnterpriseでは組織またはenterprise側がpreview featuresとCopilot CLIを有効化する必要があると説明している。

ここは実務上かなり重要だ。Copilot appの多くの機能はCopilot CLIと近い実行基盤を共有する。Docsでは、agent sessionでsession mode、model、reasoning effortを選び、repository、local folder、cloud sandboxを選んで開始できる。つまり、Business/EnterpriseでCopilot appを開くことは、単にアプリ配布を許可するのではなく、CLI policy、agent policy、model availability、cloud sandbox、MCP、skills、session dataの運用へ踏み込むことになる。

また、6月2日のGitHub Blogでは、Copilot appをagent-native developmentのcontrol centerとして位置づけている。My Work viewからactive sessions、issues、pull requests、background automationsを見られ、sessionは独立したgit worktreeで動く。Agent Mergeはreview、check、merge条件を見ながら進めるとされる。これは開発者体験の話であると同時に、branch protection、required checks、CODEOWNERS、review assignment、merge policyの話でもある。

日本の組織では、previewという言葉を軽く扱わない方がよい。preview機能は仕様変更の可能性があり、GitHub Docsにもtechnical previewで変更され得るとある。PoCでは問題ないが、監査対象の本番repositoryや顧客データを含むrepositoryで標準作業面にするには、変更時の影響確認、無効化手順、利用者告知、ログ保存方針が必要になる。

## canvasesはagent experienceの作業物レイヤー

canvasesは、agent作業をchat transcriptから取り出すための仕組みと見るべきだ。GitHub Changelogは、canvasesを人間とagentの双方向作業面として説明している。agentはcanvasを更新し、人間は同じ面で編集、並べ替え、承認、方向転換を行う。GitHub Docsでは、canvas extensionはplan、triage board、browser session、release checklist、dashboard、incident、spreadsheetなどのwork artifactを扱う共有interactive surfaceだと説明されている。

これは、通常のchat UIとは責任の持ち方が違う。chatでは、agentが長い説明を出し、人間が次のpromptを返す。canvasesでは、作業対象そのものが状態を持つ。たとえば、PR review canvasなら、差分、review comment、CI status、未解決issue、agentが提案した修正、承認済みの項目が同じ面で見える。incident canvasなら、timeline、hypothesis、metric、rollback condition、owner、次のactionが並ぶ。agentはその状態を読み、人間はそこで直接修正する。

この設計は、agent導入の現実的な弱点に刺さる。AI agentは作業を進められるが、作業の進み具合を人間が検査しにくいと導入は止まる。特に日本企業では、上長承認、委託先レビュー、品質保証、リリース判定、監査証跡が絡む。chatに「やりました」と書かれても、レビュー担当は差分、テスト、画面、未解決項目、承認条件を見たい。canvasは、その検査対象を構造化する方向で意味がある。

ただし、canvas extensionは新しい設定面でもある。Docsでは、team-shared canvasをproject scopeとして `.github/extensions` に置く選択肢と、personal canvasをuser scopeとして `~/.copilot/extensions` に置く選択肢が示されている。これは、共有canvasをrepository assetとして扱うべきだということだ。release checklistやincident boardのcapabilityをagentに作らせ、そのまま共有すると、agent-callable actionが何をできるかを人間が把握しないまま運用に入る危険がある。

実務では、team-shared canvasについてはcode reviewと同じ扱いに近づけたい。どのUI controlがあり、どのagent-callable capabilityがあり、どのrepositoryやexternal toolを読むか、書くかを確認する。個人用canvasは自由度を高くしてもよいが、team標準canvasは変更履歴、owner、reviewer、rollback手順を持つべきだ。

## cloud sandboxとlocal sessionの境界設計

Copilot appのagent sessions Docsでは、session開始時に実行場所として新しいworking tree、local repository、cloud sandboxを選べる。cloud sandboxはGitHubがホストする分離環境である。GitHub Blogも、local sandboxではfilesystem、network、system capabilitiesへのaccessを制限でき、cloudではephemeral Linux environmentがGitHub側で動くと説明している。

この使い分けは、日本企業ではかなり大きい。local sessionは、手元の開発環境、社内VPN、ローカルDB、特殊なbuild tool、private package registryに近い。一方、cloud sandboxは端末依存を減らし、長いagent workや別端末からの継続に向くが、何へアクセスできるかを明示的に設計しなければならない。

安全に始めるなら、cloud sandboxは影響範囲が小さいrepositoryからにする。docs更新、test追加、dependency update、静的解析、release note作成、軽いbug fixのように、secretやinternal networkに触れない作業が向いている。逆に、production credential、顧客DB、社内閉域API、支払い、認証、権限管理、個人情報を扱う差分は、cloudで動かす前にpolicy、secret injection、network allowlist、audit logを確認する必要がある。

この論点は[Copilot cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)と接続すべきだ。agentが使えるMCP server、firewall、verification tool、Actions承認設定を棚卸しできるなら、Copilot appのcloud session利用も同じ棚卸しに入れる。agent surfaceが増えるほど、「どこで何が許されているか」を表にしないと、後から説明できない。

local sandboxも安全とは限らない。localは開発者の権限に近い。社内repository、ssh key、env file、local service、browser session、clipboard、filesystemが近くにある。localで使う場合も、trusted directory、tool allow/deny、MCP scope、network rule、secret file除外を確認すべきだ。cloudかlocalかの二択ではなく、作業分類ごとの実行場所を決める必要がある。

## agentic browsingはQA導線だが、データ境界が難しい

6月2日の発表では、agentic browsingとして、agentが統合browserを操作し、click、type、screenshot取得でUI変更を確認できると説明されている。frontendや業務SaaSを持つチームにとって、これは価値が大きい。agentがコードを直した後、ブラウザを開き、画面を操作し、期待したUIが出るかを確認できるなら、PR前のセルフチェックが現実的になる。

しかし、browserはデータ境界を曖昧にしやすい。社内管理画面、CRM、顧客サポート画面、請求画面、医療・金融・人事系の画面では、test accountであっても個人情報や業務秘密が見えることがある。screenshotがsession dataに残る可能性、agentが入力した内容がどこへ送信されるか、外部URLへ遷移できるかを確認する必要がある。

日本企業で使うなら、まずagentic browsing専用のstaging環境を作るべきだ。匿名化されたseed data、書き込み可能範囲が限定されたtest account、外部送信できないnetwork policy、決済やメール送信をmock化した環境が望ましい。UI変更の確認だけなら、production-like dataは不要なことが多い。

また、agentic browsingの結果をどのようにレビューに残すかも決める。screenshotをPRに貼るのか、canvas上で確認済みにするのか、CI artifactとして保存するのか、重要画面では人間QAが再確認するのか。agentが「画面確認済み」と言っても、どの画面、どのviewport、どのuser role、どの入力値で確認したかが残らなければ、レビュー材料として弱い。

## voice、rubber duck、chronicleは摩擦と証跡を同時に変える

Copilot appにはvoice dictation、rubber duck、`/chronicle` も含まれる。Docsではvoice dictationはapp settingsでkeyboard shortcutを選び、OS側でmicrophone accessを許可し、local transcription modelをdownloadして使うと説明されている。transcribed textはprompt boxに入り、送信前に確認や編集ができる。

voiceは入力を速くするが、企業導入では端末管理と一緒に見る必要がある。会議室、客先常駐、共有端末、VDI、録音禁止エリア、委託先端末では、local transcriptionでもmicrophone利用そのものがルールに触れることがある。[Copilot CLIの音声入力](/blog/github-copilot-cli-scheduling-voice-rubber-duck-2026/)でも同じ論点が出たが、appに入ることで利用面はさらに広がる。

rubber duckは、sessionのplan、implementation、testsを別modelのcritic agentに見せる仕組みとして説明されている。これは品質保証ではなく、早期レビューの補助だ。特にautopilotやcloud sessionでagentの自律性が上がるほど、実装前やPR前にrubber duckの観点を入れる価値はある。ただし、rubber duckの指摘を採用したか、採用しなかったかを残さなければ、人間reviewの証跡にはならない。

`/chronicle` はsession historyから情報を引く機能だ。app sessionとCopilot CLI sessionの履歴をまたいで、standupや過去作業の要約に使える。これは引き継ぎや週次レビューでは便利だが、session historyに何が残るかを管理する必要がある。委託先が開始したsession、退職者のsession、顧客名を含むsession、security incidentを扱ったsessionをどう検索可能にするかは、監査と情報管理の問題になる。

## 費用管理: appが便利になるほど利用は増える

Copilot appのcanvasesは作業を見やすくする。cloud sessionsは端末依存を下げる。agentic browsingはUI検証を近づける。voiceは入力を速くする。rubber duckはレビュー補助を足す。これらはすべて、agent session数とmodel利用を増やす方向に働きやすい。

したがって、[GitHub Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)以降の運用では、Copilot app導入をseat配布だけで評価してはいけない。必要なのは、session数、cloud session比率、browser検証回数、rubber duck利用回数、model別利用、AI Credits消費、Actions minutes、PR作成数、レビュー手戻り、mergeまでの時間を合わせて見ることだ。

特にBusiness/Enterpriseでは、個人の便利さと組織費用がずれやすい。Platform Engineeringが大量のagent sessionで全社の基盤改善を進めるなら高い上限を許す価値がある。一方、低リスクな探索や個人学習でheavy modelやcloud sessionを使い続けるなら、budgetを分けるべきだ。user-level budget、enterprise spending limit、team別metricsを組み合わせる必要がある。

費用の見方は単純な節約ではない。agentic workflowでレビュー待ちが減り、CI失敗対応が速くなり、テスト追加が進むなら、AI Creditsの消費は投資として説明できる。逆に、sessionが増えてもPR品質が上がらず、reviewerの手戻りが増えるなら、導入範囲を絞るべきだ。canvasによる見える化は、この効果測定にも使える可能性がある。

## 推奨する導入手順

第一段階では、preview有効化をpilot organizationまたは少数teamに限る。Business/Enterpriseでは、preview features、Copilot CLI、cloud sandbox、MCP、skills、model availability、agent policyを同時に確認する。GitHub Copilot app単体の利用申請として処理しない。

第二段階では、標準canvas候補を3つに絞る。たとえば、release checklist、incident triage、dependency update boardだ。各canvasについて、入力データ、agent-callable capability、書き込み先、owner、reviewer、保存場所、削除手順を決める。team-shared canvasをrepositoryに置くなら、PR reviewを通す。

第三段階では、実行場所のpolicyを作る。local session、local sandbox、cloud sandboxのどれを使うかを作業分類で決める。documentation、test、dependency、minor bug fixはcloud可、auth、billing、PII、production data、security-sensitiveはcloud不可または追加承認、といった形が現実的だ。

第四段階では、agentic browsing専用のstaging環境を作る。test account、匿名化データ、mocked external integration、screenshot保存方針、viewport条件、human QA再確認条件をそろえる。browser操作ができるからといって、productionの管理画面を直接触らせない。

第五段階では、効果測定を最初から入れる。session数、AI Credits、Actions minutes、PR数、review指摘、CI成功率、手戻り、merge lead timeを見て、canvasやcloud sessionが実際に効いているかを確認する。効果が見えたタスクだけ標準化し、見えないタスクは止める。

## まとめ

GitHub Copilot appの6月2日更新は、paid plan向けtechnical preview拡大とcanvasesの追加により、agent作業をchatから作業物へ移す方向を明確にした。cloud sessions、agentic browsing、voice、rubber duck、`/chronicle` が同じapp面に集まることで、Copilotは補完やchatではなく、agent作業のoperating surfaceに近づいている。

日本企業が判断すべきなのは、Copilot appを入れるかどうかだけではない。どのcanvasを共有資産にするか、cloudとlocalをどう分けるか、browser検証のデータ境界をどう守るか、voiceとsession historyをどう管理するか、AI Creditsとreview負荷をどう測るかである。canvasesは承認を省くための機能ではなく、agent作業を検査可能にするための機能として扱うべきだ。

## 出典

- [Expanded technical preview availability for the GitHub Copilot app](https://github.blog/changelog/2026-06-02-expanded-technical-preview-availability-for-the-github-copilot-app/) - GitHub Changelog, 2026-06-02
- [Working with canvas extensions in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/working-with-canvas-extensions) - GitHub Docs
- [Working with agent sessions in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions) - GitHub Docs
- [GitHub Copilot app: The agent-native desktop experience](https://github.blog/news-insights/product-news/github-copilot-app-the-agent-native-desktop-experience/) - GitHub Blog
