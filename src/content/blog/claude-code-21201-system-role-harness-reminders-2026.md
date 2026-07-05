---
title: 'Claude Code 2.1.201、system role変更の検証手順'
description: 'Claude Code 2.1.201でSonnet 5セッションの途中にharness reminderをsystem roleで挿入しなくなった変更を整理。日本企業がAPI本文、プロバイダー差、監査ログをどう回帰検証するか解説する。'
pubDate: '2026-07-05'
category: 'news'
tags: ['Anthropic', 'Claude Code', 'Claude', 'AI モデル', 'API', '開発者ツール', '企業導入', '監査ログ']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は2026年7月3日、**Claude Code 2.1.201** を公開した。公式リリースノートに記載された変更は1点だけで、Claude Sonnet 5のセッションでは、会話途中の `system` roleをharness reminderに使わなくなったというものだ。

一文だけの更新だが、Claude Codeを長時間動かし、APIゲートウェイや監査基盤を間に置く企業には確認価値がある。`system` roleは通常の利用者発言より強い優先度を持ち、対応モデルと提供経路にも制約があるからだ。ただし、Anthropicは今回の変更理由、harness reminderの具体的な文面、変更後に使うmessage roleを公開していない。この記事では、公開資料で確認できる事実と、そこから導く運用上の分析を分けて扱う。

Sonnet 5そのものの料金、effort、tokenizerを確認したい場合は、先に[Claude Sonnet 5のAPI移行設計](/blog/anthropic-claude-sonnet-5-pricing-migration-2026/)を参照してほしい。直前の[Claude Code 2.1.200における手動確認と常駐復旧](/blog/claude-code-21200-manual-background-recovery-2026/)とは更新対象が異なる。2.1.200は入力待ちとbackground sessionの復旧、2.1.201はモデルへ渡す会話構造の変更である。

## 事実: 2.1.201はSonnet 5のharness reminderだけを変更した

公式のClaude Code v2.1.201 releaseには、「Claude Sonnet 5 sessions no longer use the mid-conversation system role for harness reminders」とある。公開changelog上、2.1.200から2.1.201への差分はこの記述と配信用feedの更新だけだ。

ここから確実に言えることは、次の3点に限られる。

1. 対象として明記されたモデルはClaude Sonnet 5である
2. 変更対象は会話途中に置かれる `system` roleである
3. そのroleはClaude Code内部のharness reminderに使われていた

一方、公式情報だけでは、harness reminderが何を通知していたか、どの条件で挿入されたか、変更後に `user` roleやtop-level `system` fieldへ移ったかは分からない。したがって、「プロンプトインジェクション脆弱性の修正」「出力品質の改善」「キャッシュ費用の削減」などと断定することはできない。

ここでいうharnessは、モデルそのものではなく、モデルの周囲でtool call、権限、会話履歴、セッション状態を管理するClaude Code側の実行環境を指すと読むのが自然だ。ただし、これもリリース文からの用語解釈であり、Anthropicが今回のreminder内容を仕様として公開したわけではない。

## 事実: mid-conversation system messageには提供条件がある

Anthropicの公式ドキュメントによると、通常のsystem instructionはMessages APIのtop-level `system` fieldに置かれる。これに対し、mid-conversation system messageは `messages` 配列の途中へ `{"role": "system"}` を追加し、その時点以降の指示として扱う仕組みだ。

この仕組みには、普通の `user` messageと異なる性質がある。

- end userの発言ではなく、application operatorの指示として扱われる
- 利用者の指示と競合する場合、system instructionが優先される
- top-level `system` fieldを書き換えずに追加できるため、既存のprompt cache prefixを維持しやすい
- tool useとtool resultの間には置けず、配置条件に違反すると400 errorになる
- 未信頼のtool outputや検索文書を入れる用途には使うべきではない

2026年7月5日時点の公式ドキュメントは、mid-conversation system messageをClaude Opus 4.8だけで利用できる機能として説明している。また、提供経路はClaude API、Claude Platform on AWS、Microsoft Foundryで、Amazon BedrockとGoogle Cloudでは利用できないとしている。

この公開仕様と2.1.201の短いreleaseを並べると、Sonnet 5のセッションで同roleを使わない変更は、少なくとも**model/providerごとのmessage互換性を確認する必要がある更新**と評価できる。ただし、Anthropicは「非対応機能を誤って使っていた」とは説明していない。ここは合理的な分析であって、公式の原因説明ではない。

## 分析: 更新の焦点は出力内容よりrequest構造にある

企業がこの更新を評価するとき、同じpromptを入れて回答文だけ比較する方法では不十分だ。今回変わったと明記されたのは、モデルへ渡す会話中のroleだからである。

長時間のagent sessionでは、利用者のprompt、assistant response、tool use、tool resultに加えて、実行環境が状態変化をモデルへ知らせる場合がある。たとえば、権限モード、残り予算、利用できるtool、利用者が作業中に追加入力した内容などだ。mid-conversation system messageの公式ドキュメントにも、こうしたoperator-levelの状態変化を伝える用途が示されている。

roleが変われば、次の観測結果が変わる可能性がある。

- API gatewayが許可するmessage schema
- providerごとのrequest validation
- prompt cacheのhit/miss位置
- conversation replayで再現する優先順位
- raw API bodyを保存する監査ルール
- system messageだけを抽出する独自ログ解析

ここで「可能性」と書く理由は、2.1.201が変更後の構造を公開していないためだ。企業側の作業は、特定の代替roleを推測して固定することではなく、自社が実際に利用するproviderと設定でrequest/responseの差を測ることである。

[Claude Code 2.1.196の組織既定モデルとMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/)で整理したように、Claude Codeの企業導入ではclient version、model、managed settingsを別々に管理する必要がある。今回も「Sonnet 5を使っているか」と「Claude Code 2.1.201へ更新したか」を分離して記録した方がよい。

## 日本企業が行う4段階の回帰検証

### 1. 対象経路を固定する

まず、Claude Codeがどの経路でSonnet 5へ接続しているかを台帳化する。Anthropic直接、Claude Platform on AWS、Amazon Bedrock、Google Cloud、Microsoft Foundryを同じ結果として扱わない。mid-conversation system messageの提供条件が経路ごとに異なるためだ。

検証表には、Claude Code version、model identifier、provider、region、認証方式、managed settingsのrevisionを残す。2.1.200と2.1.201を比較するなら、version以外の条件をそろえる。

### 2. 長いtool loopでrequest構造を比較する

一往復の質問では、会話途中のreminderが発生しない可能性がある。検証用repositoryで、複数回のtool use、tool result、権限確認、compactionを含む長めのsessionを実行する。同じtaskを旧版と新版で動かし、400 error、retry、cache usage、stop reasonを比較する。

Claude Codeの公式monitoring docsでは、OpenTelemetryの `claude_code.llm_request` spanからmodel、token、cache、request ID、retry回数、status code、stop reasonを確認できる。まずは本文を保存せず、これらのmetadataで失敗率と費用傾向を比較するのが安全だ。

### 3. 必要な場合だけraw API bodyを短期取得する

Claude Code 2.1.193以降では、`OTEL_LOG_RAW_API_BODIES` を明示的に設定すると、Messages APIのrequest/response JSONを監査用に出力できる。これにより、会話途中のrole配置を直接比較できる。

ただし、raw bodyにはsystem prompt、過去のuser/assistant turn、tool resultを含む会話履歴全体が入る。公式docsも、この設定が他のcontent loggingへの同意を含む強い設定だと説明している。本番全体で常時有効にするのではなく、機密情報を含まない検証用repository、限定端末、短い保持期間、アクセス制御された保存先で使うべきだ。

### 4. 回答品質と操作結果を別々に採点する

role構造が変わっても、最終回答がほぼ同じ場合はある。逆に文章は似ていても、toolの選択順、権限待ち、retry回数、token消費が変わることがある。

評価項目を、回答品質、tool call成功率、禁止操作の回避、cache read tokens、input tokens、latency、retry回数へ分ける。特にsystem-levelのreminder変更では、禁止操作や状態変化を正しく守るかを確認したい。単一の「回答が良かった」という主観評価だけで更新可否を決めない。

## 監査ログで混同しやすい2つのsystem

OpenTelemetryのGenAI semantic conventionには `gen_ai.system` という属性がある。Claude Code docsでは、この値は常に `anthropic` と説明されている。これは利用中のAI system/providerを示すtelemetry属性であり、Messages APIの `{"role": "system"}` とは別物だ。

したがって、2.1.201へ更新しても `gen_ai.system=anthropic` が消えるわけではない。監査チームが「system role廃止」と誤解すると、必要なprovider属性まで除外する恐れがある。変更対象はSonnet 5セッション中のharness reminderに使うmessage roleであり、telemetry上のprovider名ではない。

また、通常のtop-level `system` fieldまで廃止されたという発表でもない。Claude Codeの `--system-prompt` や `--append-system-prompt` と、内部harness reminderの扱いを同一視しないことが重要だ。

## 更新判断

Sonnet 5をClaude Codeで使う組織は、2.1.201を小規模ringへ先行配布し、利用中providerごとに長時間sessionを確認する価値がある。特にAPI gatewayでschema validationを行う環境、Amazon BedrockやGoogle Cloudを利用する環境、raw API bodyから独自監査を作っている環境では、request構造の差を明示的に試験したい。

一方、今回の1行だけから、セキュリティ事故や品質劣化を推定して緊急更新を強制する根拠はない。公式に公開されていないreminder文面を再現しようとする必要もない。確認すべきなのは、自社経路でerrorが減るか、tool loopが完了するか、既存の監査parserが壊れないかである。

## まとめ

Claude Code 2.1.201は、Sonnet 5セッションのharness reminderにmid-conversation `system` roleを使わなくする限定的な更新だ。公式docs上、このroleにはmodelとproviderの提供条件があり、operator-level instructionとして強い優先度を持つ。

日本企業は、出力文だけではなく、provider別のrequest validation、cache、retry、監査parserを比較したい。raw API bodyは構造確認に役立つが、会話履歴全体を含むため、限定した検証環境でのみ使う。公開されていない変更理由を断定せず、実測した差だけを更新判断へ使うのが妥当である。

## 出典

- [Claude Code v2.1.201 release（Anthropic公式GitHub）](https://github.com/anthropics/claude-code/releases/tag/v2.1.201)
- [Mid-conversation system messages（Claude Platform Docs）](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages)
- [Messages API reference（Claude Platform Docs）](https://platform.claude.com/docs/en/api/messages)
- [Monitoring（Claude Code Docs）](https://code.claude.com/docs/en/monitoring-usage)
