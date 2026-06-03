---
article: 'github-copilot-cli-scheduling-voice-rubber-duck-2026'
level: 'expert'
---

GitHub Copilot CLIの**2026年6月2日**更新は、terminal-native agentの運用面を一段進める内容だ。Changelog上の見出しは、改善されたUI、rubber duck、prompt scheduling、voice inputである。しかし実務上の意味は、Copilot CLIを「手元のterminalで人間が都度promptを打つagent」から、「開いているsessionの中で、時間、批評、音声、GitHub作業面を組み合わせるagent」へ寄せる点にある。

このサイトではすでに、[Copilot CLI遠隔操作GA](/blog/github-copilot-cli-remote-control-ga-2026/)でhuman control planeがMobile/Webへ広がったことを扱った。また、[GitHub Copilot自動実行、cloud agent運用設計](/blog/github-copilot-cloud-agent-automations-2026/)では、GitHub側に保存したautomationがscheduleやIssue/PR eventでcloud agentを起動する流れを見た。今回のCLI更新は、そのどちらとも重なるが、同じではない。localまたはcloudのCLI sessionを開いている開発者の作業を、短い時間幅で継続しやすくする更新である。

日本企業の導入判断では、この違いが重要になる。正式な運用jobとして扱うのか、開発者本人のsession補助として扱うのかで、監査、費用、端末管理、レビュー責任が変わる。

## 事実: Changelogが示した4つの変更

GitHub Changelogは、Copilot CLIのmajor refreshとして、rubber duck、prompt scheduling、voice inputが一般提供になり、新しいexperimental terminal interfaceが `/experimental` で試せると説明している。新UIでは、Session viewに加えてIssues、Pull requests、Gistsのtabを切り替えられる。GitHub repository内で作業しているとき、terminalを離れずにGitHub作業対象を見られる方向だ。

UI面では、theme-aware semantic colors、狭いterminalでも読みやすいresponsive components、high-contrastやcolorblind mode、screen reader検出時のsupportなども示されている。これは見た目の変更だけではない。Copilot CLIが長時間sessionを扱うほど、terminal上でplan、diff、permission request、issue、PRを読み続ける負担が増える。視認性とアクセシビリティは、agent運用の継続性に関係する。

rubber duckは、GitHub Docsでは組み込みcritic agentとして説明されている。main agentが作業中のplan、design、implementation、testsをrubber duckに渡し、rubber duckはblind spot、design flaw、substantive issueを探して具体的なfeedbackを返す。rubber duck自体はread-onlyで、file変更はしない。変更を続けるか、方針を直すかはmain agentが決める。

prompt schedulingは、`/every` と `/after` で構成される。`/every` は固定間隔でpromptを繰り返し送る。`/after` は指定delay後に1回だけpromptを送る。Docsは、どちらもinteractive Copilot CLI session内でのみ有効であり、scheduleはそのsessionがrunningの間だけfireすると説明している。

voice inputは、microphoneからのspeechをlocal machineで文字起こしし、prompt inputへ挿入する機能だ。audioはnetworkへ送られない。短いpromptはspace bar長押し、長いpromptは `Ctrl`+`X` のあと `V` で録音をtoggleする。Docsは、現時点でEnglishとSpanish dictationに対応し、Englishがdefaultだと説明している。

## scheduleの責任境界を間違えない

`/every` と `/after` は、agent workflowの小さな待ち時間を埋めるには強い。たとえば、10分後にregistration pageが見えるか確認する、30分ごとにtest suiteを回してnew failureを要約する、1時間後にopen PR commentを見直す、といった用途だ。人間がterminal sessionを開いており、その作業文脈を保ったまま少し先の確認を自動化できる。

ただし、これは組織の定期job基盤ではない。Docsは、scheduleがcreatedされたsessionにscopeされ、sessionがrunningの間だけtriggerされると明示している。sessionをreopenした場合、intervalはreopen時点から再開される。`/after` の未実行scheduleは残り、reopened sessionでdelay後にtriggerされる。この挙動は開発者の作業補助としては自然だが、監査対象の夜間運用としては扱いにくい。

正式な運用にするなら、選択肢は別にある。Docsは、active sessionなしでscheduleしたい場合、macOS/LinuxのcronやWindows Task Schedulerのようなexternal schedulerから `copilot -p "YOUR PROMPT"` を使う方法を示している。さらにGitHub repository eventに結びつけるなら、[Copilot cloud agent automations](/blog/github-copilot-cloud-agent-automations-2026/)のほうが定義、scope、trigger、review queueをGitHub側に寄せやすい。

したがって、導入基準は次のように分けるべきだ。開発者本人が見ているsession内の短期確認ならCLI schedule。repository eventや夜間/週次運用ならcloud automationまたはCI。社内batchや周辺systemと連携するならprogrammatic CLIをexternal schedulerから起動する。この分類を曖昧にすると、個人のterminalで作ったscheduleがいつの間にかチーム運用の一部になり、止め方も責任者も分からなくなる。

## rubber duckをレビュー制度へどう入れるか

rubber duckの強みは、main agentと違うmodel familyのcriticを使う点にある。Docsでは、session modelがClaudeならGPT系のcritic、GPTならClaude系のcriticが選ばれる例が示され、modelを切り替えると次回のcriticも適切に選び直されると説明されている。これは、同じmodelが同じ前提を見落とすリスクを下げるための設計だ。

しかし、model familyを分けたからといって、保証にはならない。rubber duckは、blocking issue、non-blocking issue、suggestionのようにfeedbackを分類できるが、その分類はあくまでAIによる判断である。社内architecture principle、個人情報保護、金融規制、医療規制、取引先契約、脆弱性管理方針を網羅的に知っているわけではない。

実務では、rubber duckを「人間review前のpre-review」として使うのが妥当だ。特に、認証、認可、billing、data migration、large refactor、CI/CD、infrastructure、security-sensitive codeでは、実装前のplanに対してrubber duckを明示的に呼ぶ。そこで出たblocking issueを潰してから実装に入ると、失敗した実装を後から戻すより安い。

一方、rubber duckを必須化しすぎると、すべての小変更が遅くなる。軽微なcopy修正、formatter適用、単純なtest fixture更新では、必要に応じて使えばよい。企業標準としては、変更のrisk classごとに「rubber duck推奨」「rubber duck必須」「human specialist review必須」を分けるのが現実的だ。

この設計は[GitHub Copilot CLI企業管理、プラグイン標準配布の実務](/blog/github-copilot-cli-enterprise-plugins-2026/)とも接続できる。enterprise-managed plugins、hooks、skills、MCP configurationを配るなら、repository instructionに「高リスク変更ではplan段階でcritic reviewを挟む」と書くだけでなく、hookやskillでPR本文に確認項目を出すことも考えられる。

## voice inputの価値と日本語制約

voice inputは、入力の摩擦を下げる。長いdebug sessionでkeyboardから離れたいとき、複数windowを見ながら短い指示を追加したいとき、視認性や手指の負担に配慮したいときに有効だ。Changelogはon-device speech-to-textで音声がmachine外へ出ないことを強調しており、Docsもaudioがnetworkへ送られないと説明している。

ただし、日本企業での導入では、まず言語制約を見る必要がある。Docsでは、現在のvoice inputはEnglishとSpanish dictationのみ対応で、Englishがdefaultである。日本語の業務指示を自然に話して使う用途は、公式説明の範囲ではまだ前提にしにくい。英語promptで開発運用しているglobal teamには試す価値があるが、日本語中心のチームでは期待値を下げるべきだ。

次に、microphone権限だ。local transcriptionであっても、業務端末のmicrophone利用はMDM、VDI、会議室ルール、客先常駐契約、録音禁止エリア、情報管理規程に関係する。たとえば、shared officeで顧客名や内部system名を声に出すなら、それはnetwork送信とは別の漏えいリスクになる。

三つ目は、accessibilityと標準端末imageの関係だ。voice runtimeとvoice modelをdownloadする必要があるため、企業端末ではproxy、allowlist、software distribution、cache、license、endpoint inspectionを確認する必要がある。voice inputを本当に標準機能として扱うなら、個人が初回downloadで詰まらないよう、導入手順を端末管理側で整えるべきだ。

## AI Creditsと権限設定を同時に見る

Copilot CLIの利用はAI Credits消費と結びつく。Docsは、Copilot CLIのinteractive interfaceやprogrammatic利用で、処理されたtoken数とmodelに応じてAI creditsが消費されると説明している。今回の更新はどれも利用の摩擦を下げる。scheduleでpromptが自動投入され、rubber duckで追加reasoning passが走り、voice inputでprompt入力が簡単になる。

このため、導入後は[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/)で扱った予算管理と一緒に見るべきだ。たとえば、`/every 10m` のようなscheduleを多用すると、開発者本人が意識しないpromptが増える。rubber duckは品質を上げる可能性があるが、追加model利用を伴う。voice inputはprompt数を増やす可能性がある。

権限面も同じだ。Copilot CLIはfile変更やshell command実行を伴う。Docsは、automatic approval optionを使うと事前承認なしにcommandが実行されるriskを説明している。CLI scheduleで自動投入されるpromptと、広すぎる `--allow-all-tools` のような設定を組み合わせると、予想外のcommandが人間の目の前でないタイミングに動く可能性がある。

最小構成では、trusted directory、allowed tool、deny tool、local sandbox、cloud sandbox、MCP server、custom instruction、hooksを合わせて見る。特にscheduleを使うsessionでは、write操作、network access、secret file、migration、production commandをdeny側へ寄せる。個人のterminalであっても、agentができることは組織の開発統制に影響する。

## 日本企業向けの運用パターン

第一段階は、開発基盤またはPlatform Engineeringチームのpilotだ。対象は、docs更新、test再実行、PR comment確認、release note下書き、issue triageの補助のように、成果物を捨てやすい作業にする。ここで `/every` と `/after` の停止方法、session resume時の挙動、AI Credits消費、rubber duckの指摘品質を確認する。

第二段階は、運用分類表を作ることだ。CLI scheduleでよい作業、cloud automationへ寄せる作業、programmatic CLIをexternal schedulerから起動する作業、AIに任せない作業を分ける。たとえば、開発者の一時的なdeploy確認はCLI schedule、repository eventに反応するPR作成はcloud automation、月次棚卸しはexternal scheduler、production credential操作は対象外、といった形だ。

第三段階は、review証跡を整えることだ。rubber duckを使った場合、どの指摘を採用したか、どの指摘を採用しなかったかをPR本文へ短く残す。AIが指摘したこと自体ではなく、人間がどう判断したかを残すのが重要だ。これにより、後から「AIが大丈夫と言ったから」ではなく「この論点は確認済み」と説明できる。

第四段階は、voice inputの利用条件を決めることだ。English/Spanish dictationの制約を周知し、日本語prompt前提の研修にしない。microphone利用可否、客先利用、共有space、VDI、local model download、proxy、accessibility needを確認する。許可する場合も、機密名を声に出さない、公共空間で使わない、録音禁止区域で使わないといった最低限のルールを置く。

第五段階は、費用と成果の測定だ。session数、scheduled prompt数、rubber duck利用回数、追加AI Credits、PR作成数、修正手戻り、review comment減少、test failure解消時間を見る。AI agent機能は、使うほど良いとは限らない。少ないpromptで品質が上がったのか、試行回数を増やして押し切っているだけなのかを分ける必要がある。

## まとめ

GitHub Copilot CLIの2026年6月2日更新は、terminal agentの作業継続性を高める。`/every` と `/after` は開いているsessionの短期自動化を可能にし、rubber duckは別model familyのcriticによるpre-reviewを提供し、voice inputはlocal transcriptionでprompt入力の摩擦を下げる。新terminal UIは、長いagent sessionでGitHub作業対象を読みやすくする方向だ。

しかし、これらは組織運用を自動で安全にしてくれるものではない。CLI scheduleはcloud automationではない。rubber duckは人間reviewではない。voice inputは日本語dictation前提ではない。使いやすさが上がるほど、AI Credits、端末権限、tool approval、review証跡、microphone policyを同時に見る必要がある。

日本企業にとっての結論は明確だ。今回の更新は、Copilot CLIを個人のterminal補助としてだけでなく、チームの開発運用に接続しうる部品として扱うべき段階に入ったことを示している。小さく試し、責任境界を分け、費用と品質を測る。そこまで設計できるチームには、今回のCLI更新はかなり実務的な価値がある。

## 出典

- [Copilot CLI: Improved UI, rubber duck, prompt scheduling, and voice input](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) - GitHub Changelog, 2026-06-02
- [Scheduling prompts in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/schedule-prompts) - GitHub Docs
- [Use voice input with Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/voice-input) - GitHub Docs
- [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck) - GitHub Docs
- [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) - GitHub Docs
