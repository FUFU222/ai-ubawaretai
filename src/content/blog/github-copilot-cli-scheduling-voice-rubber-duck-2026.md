---
title: 'GitHub Copilot CLI刷新、定期実行と音声入力の運用点'
description: 'GitHub Copilot CLIの6月更新で/rubber-duck、/every、/after、音声入力が一般提供に。日本の開発チームが承認、費用、端末統制、英西語制約をどう扱うか整理する。'
pubDate: '2026-06-03'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', 'AIエージェント', '開発者ツール', 'エンタープライズAI', '管理者設定', 'SaaSコスト管理']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年6月2日**、GitHub Copilot CLIの更新として、実験的な新terminal UI、rubber duck、prompt scheduling、voice inputを発表した。Changelogでは、rubber duck、prompt scheduling、voice inputは一般提供、tabsを含む新UIは `/experimental` で試せる扱いになっている。

これは単なるCLIの使い勝手改善ではない。すでに[Copilot CLI遠隔操作GA](/blog/github-copilot-cli-remote-control-ga-2026/)では、terminalで動くagent sessionをMobileやWebから見て承認できるようになった。さらに[Copilot cloud agent automations](/blog/github-copilot-cloud-agent-automations-2026/)では、GitHub側に保存したautomationをスケジュールやIssue/PRイベントで起動できるようになった。今回のCLI更新は、その中間にある「開いているCLI sessionをどう継続的に使うか」を強くするものだ。

日本の開発チームで見るべき焦点は、便利なslash commandの数ではない。定期実行を誰の端末で走らせるのか、rubber duckの指摘をレビュー証跡としてどう扱うのか、voice inputを業務端末で許可するのか、AI Creditsをどう見積もるのかである。

## 事実: 6月2日のCopilot CLI更新で何が入ったか

GitHub Changelogによると、今回の更新でCopilot CLIには大きく4つの要素が入った。第一に、実験的な新terminal experienceだ。GitHub repository内でCLIを使うと、Session viewに加えてIssues、Pull requests、Gistsのtabを切り替えられる。色設定、high contrast、colorblind向けmode、screen reader検出時の対応など、アクセシビリティ面も改善されている。

第二に、rubber duckだ。GitHub Docsでは、rubber duckはCopilot CLIの組み込みcritic agentであり、main agentのplan、design、implementation、testsを読み、盲点、設計上の問題、実質的なissueを指摘すると説明されている。重要なのは、rubber duck自身はfile変更を行わず、main agentが指摘を踏まえて次の行動を決める点だ。

第三に、prompt schedulingである。Docsでは `/every` と `/after` の2つのslash commandが説明されている。`/every` は指定間隔でpromptを繰り返し送る。`/after` は指定時間後に1回だけpromptを送る。たとえばテスト失敗の再確認、PR commentの確認、一定時間後の画面確認のような用途が想定される。

第四に、voice inputだ。Docsでは、microphoneから話したpromptをlocal machine上で文字起こしし、入力欄へ挿入できると説明されている。音声データはnetworkへ送られない。短いpromptはspace bar長押し、長いpromptは `Ctrl`+`X` のあと `V` で録音を開始し、任意のkeyで停止する。

## CLI内の定期実行はcloud automationと別物

ここからは分析だ。

今回の `/every` と `/after` は、名前だけ見ると[Copilot cloud agent automations](/blog/github-copilot-cloud-agent-automations-2026/)と似ている。しかし運用上は別物として扱うべきだ。Docsは、これらのscheduleがinteractive Copilot CLI sessionの中だけで動き、そのsessionがrunningの間だけfireすると説明している。つまり、端末を閉じた、sessionを終えた、PCがsleepした、networkが切れた、という状態では期待通りに動かない可能性がある。

一方、cloud agent automationsはGitHub側にautomation定義を置き、repository eventやscheduleをtriggerにcloud agent sessionを起動する。GitHub appやAgents tabに寄った運用であり、個人のterminal sessionに依存しにくい。CLI内scheduleは、あくまで「作業中のsessionを少し先まで自動で進める」ための機能と見るべきだ。

日本企業で混同すると危ないのはここだ。たとえば「毎晩mainを見てテストを確認する」用途なら、個人PCのCLI内 `/every` より、cloud agent automationやCI、cron、Task Schedulerからのprogrammatic CLI実行のほうが管理しやすい。Docsも、sessionが開いていない状態でscheduleしたい場合は、external schedulerから `copilot -p "YOUR PROMPT"` のようにprogrammaticに実行する方法を示している。

逆に、CLI内scheduleが向いている用途もある。長いmigration作業中に30分ごとにtest結果を見直す、deployを待ちながら5分後にstatusを確認する、ペア作業中に1時間後に未解決項目をまとめる、といった「作業者が今開いているsessionの延長」である。正式な夜間運用ではなく、その日の作業を少し自動化するものとして位置づけると扱いやすい。

## rubber duckは品質保証ではなく早期レビューの入口

rubber duckは、AI agentが自分の案を別のcritic agentに見せる仕組みとして価値がある。Docsでは、rubber duckは現在のsession modelと異なるmodel familyのcriticを選び、同じblind spotを避けようとする設計が説明されている。Claude modelで動くsessionならGPT系のcritic、GPT modelならClaude系のcriticが選ばれる可能性がある。

ただし、これは人間のcode reviewやsecurity reviewを置き換えるものではない。Docsでもrubber duckはread-onlyであり、問題を分類して提案する役割だ。fileを変更しないし、組織の設計原則、業界規制、顧客契約、データ分類まで自動的に保証するわけではない。

実務では、rubber duckを「PR前のセルフレビュー支援」として使うのがよい。非自明な設計変更、複数fileにまたがる修正、認証・課金・権限に触れる変更では、実装前のplan段階でrubber duckを挟む。指摘が出たら、修正したか、採用しなかったかをPR本文や作業メモへ残す。そうすれば、AIの指摘をただ信じるのではなく、review queueへ渡す材料として使える。

この論点は[GitHub Copilot CLI企業管理plugin](/blog/github-copilot-cli-enterprise-plugins-2026/)ともつながる。企業標準のhooks、skills、MCP設定をCLIへ配るなら、rubber duckをいつ使うか、どの作業では人間review必須にするかをrepository instructionやplugin側のガードレールに落とし込める。

## voice inputは日本語対応と端末管理を見る

voice inputは便利だが、日本の職場でそのまま標準機能として広げるには注意がいる。Docsでは、現在のvoice inputはEnglishとSpanish dictationのみ対応で、Englishがdefaultとされている。日本語promptを自然に話して使う用途は、少なくともこの説明の範囲では対象外だ。

それでも価値がないわけではない。英語で短い開発指示を出すチーム、海外拠点と共同で英語運用しているチーム、手が離せない検証中に短い確認promptを入れる用途では効く可能性がある。また、音声はlocal machineでtranscriptionされ、audioがnetworkへ送られないという説明は、企業導入時の確認材料になる。

一方で、microphone利用そのものは端末管理の対象だ。会議室、客先常駐、委託先、共有端末、VDI、録音禁止エリアでは、local transcriptionでも業務ルールに触れることがある。MDMでmicrophone権限をどう扱うか、社内の音声入力ポリシーと矛盾しないか、端末ログに何が残るかを確認すべきだ。

さらに、voice inputはprompt入力を速くするだけで、tool実行の安全性を上げるわけではない。Copilot CLIはfile変更やshell command実行を提案するため、承認prompt、trusted directory、sandbox、allow/deny tool設定は別に見る必要がある。この点は[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)の費用論点とも重なる。入力が楽になるほどsessionが増え、モデル利用量も増えやすいからだ。

## 日本チームでの導入順序

最初に決めるべきなのは、どの用途をCLI内scheduleで許すかだ。推奨は、開発者本人が見ている短期作業に限定することだ。5分後のdeploy確認、30分ごとのtest再実行、1時間後の未解決項目棚卸しのように、sessionを閉じれば止まってよい用途から始める。夜間や週次の正式運用は、cloud agent automation、CI、cron、Task Scheduler、GitHub Actionsなどと比較して決める。

次に、rubber duckの利用場面を明文化する。たとえば、plan modeで作った設計、migration、auth、billing、security、multi-repo変更では、実装前にrubber duckを挟む。軽微なcopy修正や小さなlint修正では必須にしない。これにより、便利だが遅くなる場面と、品質向上に効く場面を分けられる。

三つ目は、voice inputをpilot扱いにすることだ。日本語dictationが前提ではないため、全開発者へ標準導入するより、英語prompt運用に慣れた少人数で確認する。microphone権限、VDI、端末貸与、会議室利用、録音禁止ルールを確認し、利用可否を端末管理ポリシーに合わせる。

四つ目は、費用と利用ログを見ることだ。Copilot CLIはAI Creditsを消費する。schedule、rubber duck、voice inputはどれもCLI利用の摩擦を下げる。導入後は、個人やチーム単位でsession数、prompt数、model usage、PR作成数、手戻り削減を見ないと、便利になったのか、単に試行回数が増えたのかを判断できない。

## まとめ

GitHub Copilot CLIの2026年6月2日更新は、terminal agentをより継続的に、よりレビューしやすく、より入力しやすくするものだ。`/every` と `/after` は開いているCLI sessionの短期自動化に向く。rubber duckは別model familyのcriticを使った早期レビューの入口になる。voice inputはlocal transcriptionが特徴だが、現時点の言語制約とmicrophone権限を確認する必要がある。

日本企業が見るべきなのは、機能を全部有効にするかどうかではない。CLI内scheduleとcloud automationを分け、rubber duckをレビュー証跡の材料にし、voice inputを端末管理と照らし、AI Creditsの消費増を観測することだ。Copilot CLIはterminalの補助から、開発運用の小さな実行面へ進んでいる。だからこそ、個人の便利機能ではなく、チームの運用設計として扱う必要がある。

## 出典

- [Copilot CLI: Improved UI, rubber duck, prompt scheduling, and voice input](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) - GitHub Changelog, 2026-06-02
- [Scheduling prompts in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/schedule-prompts) - GitHub Docs
- [Use voice input with Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/voice-input) - GitHub Docs
- [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck) - GitHub Docs
