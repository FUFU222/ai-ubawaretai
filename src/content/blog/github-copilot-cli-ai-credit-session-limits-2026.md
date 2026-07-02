---
title: 'GitHub Copilot CLIセッション上限、無人実行費を制御'
description: 'GitHub Copilot CLIとSDKにAI credit session limitが追加された。日本の開発チームが無人自動化のsoft cap、停止時の再開、組織予算との役割分担をどう設計するか整理する。'
pubDate: '2026-07-02'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', 'AIエージェント', 'SaaSコスト管理', '従量課金', '開発者ツール', '企業導入']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年7月1日**、GitHub Copilot CLIとCopilot SDKで、1回のagent sessionが使えるAI Creditsに上限を付ける**AI credit session limit**を公開した。対話中は `/limits`、非対話実行では `--max-ai-credits` を使い、model call、subagent、context compactionなどを含むsession全体の消費を追跡する。

これは[GitHub CopilotのAI Credits課金と予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)を置き換える機能ではない。組織や利用者の月次上限とは別に、「この1回の無人処理へ、いくらまで使わせるか」という実行時の境界を追加するものだ。[Copilot cloud agent automations](/blog/github-copilot-cloud-agent-automations-2026/)のように、人が画面を見続けないagent運用が増えるほど、この違いは重要になる。

日本の開発チームが注目すべきなのは、安い上限値を設定できること自体ではない。上限到達を正常系として扱い、途中成果を残し、再開するか打ち切るかを機械的に判断できる運用へ変えられる点である。

## 事実: 1回のsessionへAI Creditsのsoft capを付ける

GitHub Changelogによると、session limitはCopilot CLI 1.0.66以降とCopilot SDK 1.0.5以降で使える。Copilot for Individuals、Business、Enterpriseが対象で、2026年7月1日時点ではpublic previewである。利用前にCLIは `copilot update` で更新する必要がある。

GitHub Docsでは、AI Creditはmodel interactionの費用を表す単位で、1 creditは0.01米ドルと説明されている。session limitへ100 creditsを設定した場合、金額換算では1米ドル相当が目安になる。ただし、請求総額のhard capと同じ意味ではない。

理由は、session limitが**soft limit**だからだ。消費量はmodel responseが返った後に確定する。上限直前に開始したresponseは途中で切断されず、完了してからagentが止まるため、実際の消費は設定値を少し超える可能性がある。100 creditsと設定しても、必ず100.00 credits以内に収まる保証ではない。

追跡対象も単純なprompt回数ではない。GitHubは、session内のmodel callsに加え、subagentsとcompactionのようなbackground workも含めると説明している。複数agentへ仕事を分ける処理では、人間が送ったmessage数が少なくても消費は増え得る。上限は「何回話したか」ではなく、session全体が実際に使ったAI Creditsに掛かる。

Docsには、上限値を30 creditsより大きくするのが実用的だという注意もある。多くのmodel callが20 creditsを超えるため、極端に小さい値では最初の意味ある処理を終える前に停止しやすい。これは最低額の保証ではなく、初期値を決める際の運用上の目安である。

## 事実: 対話実行と無人実行では停止後の扱いが違う

interactive sessionでは、次の形式で上限を設定する。

```text
/limits set max-ai-credits 100
```

上限を外すときは `/limits unset` を使う。上限へ達するとCopilot CLIは停止を知らせ、利用者へlimitの再設定を求める。値を上げれば、sessionを最初からやり直さず、止まった位置から続けられる。

一方、scriptやschedulerから呼ぶnoninteractive runでは、次のように起動する。

```bash
copilot -p "失敗したテストを調査し、修正案をまとめる" --max-ai-credits 120
```

こちらは上限到達時にrunが終了する。画面の前に人がいない前提なので、追加creditを質問して待つのではなく、呼び出し側へ制御を返す。定期処理、夜間調査、Issueの分類、CI失敗の一次分析などでは、この終了を例外ではなく想定済みの結果として処理する必要がある。

Changelogは、上限へ達したagentが作業をまとめて知らせると説明している。ただし、任意のtaskが必ず安全な中間点まで完了するという保証ではない。長いmigration、複数repositoryの変更、大量testの修正を1 sessionへ詰め込めば、creditを使い切った時点で成果物が不完全な可能性は残る。

## 分析: 月次予算とsession上限は役割が異なる

ここからは分析である。

AI費用の統制は、少なくとも三つの層に分けて考えると理解しやすい。第一はenterpriseやorganizationの総予算、第二はuser-level budgetやcost center別の利用者上限、第三が今回のsession limitだ。

[Copilotのcost center別ユーザー予算](/blog/github-copilot-cost-center-user-budget-2026/)は、部門やteamに属する1人が月内で使える総量を管理する。人事異動やteam membershipと予算責任を結びつける制御である。これに対してsession limitは、その人やserviceが起動した一つのtaskの消費を制御する。同じ利用者が10回実行すれば、各sessionが上限内でも月次総量は積み上がる。

したがって、session limitだけでは「今月の請求を必ずこの金額以下にする」とは言えない。反対に、月次budgetだけでは、設定額へ達するまで1件の暴走taskがcreditsを使い続ける余地がある。二つを重ねることで、全体の支出と1回あたりの失敗半径を別々に制限できる。

日本企業では、費用を稟議単位だけで管理すると、月末の総額は見えても、どのautomationが高コストだったか分かりにくい。session limitをjob definitionへ含めれば、repository、task種別、risk levelごとに想定費用を明示できる。たとえば、Issue分類は40 credits、test失敗の調査は120 credits、migration plan作成は300 creditsというように、業務単位へ予算仮説を置ける。

ただし、最初から固定値を標準化するのは早い。repository規模、利用model、context量、MCP tool数、subagent数で消費は変わる。最初の2〜4週間は上限到達率、完了率、再実行率、1件あたりcreditsを集め、十分な成功率を保てる範囲へ調整するほうがよい。

## 分析: 上限値より先にtask境界を小さくする

session limitは、曖昧で巨大なtaskを安く完了させる魔法ではない。GitHubのAI usage最適化ガイドも、research、plan、implementationを分け、problemが変わるときは新しいsessionへ切り替える考え方を示している。長い会話は不要なcontextを持ち回り、token消費と判断のぶれを増やすからだ。

無人automationでは、1回のtaskに「調査、設計、実装、全test、PR作成、review対応」まで全部含めないほうがよい。まず調査結果をartifactへ保存するsession、承認後に実装するsession、差分を検証するsessionへ分ければ、各上限の意味が明確になる。失敗しても、前段の成果を再利用できる。

この設計は、上限到達後の再実行にも効く。同じ巨大promptをそのまま再実行すると、同じ探索を繰り返してcreditsを再消費する。調査メモ、plan、変更済みfile、test log、未完了項目を保存しておけば、次回は残りだけを処理できる。session limitは停止装置であり、checkpoint設計と組み合わせて初めて運用制御になる。

また、上限を増やす前にmodelとcontextを見直すべきだ。GitHub Docsは、routine workには軽量model、設計や複雑なdebugにはreasoning modelを使い分けること、必要なtoolだけを有効にすること、長いsessionでは `/compact` を使うことを推奨している。高価なmodelへ一律に広いcontextを渡し、上限だけ上げる運用は、費用予測を難しくする。

## 日本チーム向けの導入手順

最初の対象は、成果物を捨てても本番へ影響しない無人処理がよい。Issueの要約、失敗testの一次切り分け、dependency更新候補の調査、release noteの下書きなどである。認証、課金、個人情報、database migration、本番設定の自動変更は、停止時の整合性と承認経路を先に設計する必要がある。

導入時は、各jobへ次の情報を持たせる。

- task ownerと対象repository
- 使用model、許可tool、subagentの有無
- `--max-ai-credits` の初期値と設定根拠
- 上限到達時に保存するartifact
- 再実行、human escalation、打ち切りの条件
- 月次budgetとcost centerへの紐付け

非対話runでは、processの終了だけを「失敗」とまとめないことも重要だ。上限到達、tool error、認証失敗、test failure、正常完了を区別して記録する。公開時点のDocsだけでは、すべてのintegrationで利用できる統一的な終了理由やexit codeの扱いまでは断定できないため、自社のCLI / SDK wrapperで実際のeventとoutputを検証してから自動retryを実装すべきである。

上限到達時の自動retryは、無条件に行わない。2回目も同じ上限・同じcontextで起動すれば、費用だけが倍になる可能性がある。途中artifactがある、残作業を狭められる、別modelへ切り替える、または人間が続行価値を確認した場合だけ再開する。一定回数で必ず停止し、ownerへ通知する。

最後に、session limitの導入効果は「請求が減ったか」だけで測らない。上限到達率、task完了率、再実行率、人間へ戻した割合、生成PRの採用率、1件あたりcreditsを見る。安すぎる上限で未完了runを増やせば、総費用とreview負荷はむしろ上がる。費用、完了品質、運用負荷を同時に見る必要がある。

## まとめ

GitHub Copilot CLIとSDKのAI credit session limitは、agentic workの費用を1回のsession単位で区切る実行時ガードレールだ。interactiveでは `/limits` で止まった位置から続けられ、noninteractiveでは `--max-ai-credits` で無人runの消費をsoft capへ収める。

ただし、設定値を少し超える可能性があり、月次budgetの代わりにはならない。日本の開発チームは、組織予算、利用者上限、session limitを三層で組み合わせ、taskを小さく分け、停止時のartifactと再開条件を設計すべきだ。価値は安い数字を設定することではなく、無人agentを予測可能な運用単位へ変えることにある。

## 出典

- [Set AI credit session limits in Copilot CLI and SDK](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) - GitHub Changelog, 2026-07-01
- [Setting an AI credit session limit in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) - GitHub Docs, accessed 2026-07-02
- [Optimizing your AI usage to maximize efficiency and reduce cost](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage) - GitHub Docs, accessed 2026-07-02
