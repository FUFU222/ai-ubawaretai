---
title: 'Copilot CLI 1.0.78、権限切替とcache統制'
description: 'Copilot CLI 1.0.78の権限切替、sandbox cache、session復元改善を整理。日本企業が端末、CI、委託先開発で承認境界と監査をどう設計すべきか解説する。'
pubDate: '2026-08-01'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', '管理者設定', '開発者ツール', 'セキュリティ', '企業導入', '運用自動化']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月31日**、GitHub Copilot CLI の `v1.0.78-0` prerelease を公開した。目立つ変更は、実行中に approval mode を切り替える `/permissions`、sandbox 内の build cache を既定で使いやすくする `allowDevToolCaches`、長大な session transcript の再開改善、Agent Client Protocol の `closeSession` 対応である。

これは単なる CLI の使い勝手改善ではない。Copilot CLI は、開発者端末、CI worker、VDI、委託先端末、社内 MCP gateway の境界で動く agent 実行面になりつつある。今回の更新は、agent がどこまで自律的に動けるか、build cache をどこまで許すか、長時間 session をどう復元するか、外部 client から session をどう閉じるかという運用論点をまとめて触っている。

このサイトでは、[Copilot CLI 1.0.71のAutopilotとMCP構成](/blog/github-copilot-cli-1071-autopilot-plan-2026/) で高自律モードと tool list の鮮度を扱い、[Copilot遠隔操作の管理端末制限](/blog/github-copilot-remote-control-managed-devices-2026/) では端末側の承認線を整理した。さらに [Copilot MDM管理設定](/blog/github-copilot-mdm-managed-settings-2026/) は企業配布の標準設定を扱った。今回の 1.0.78 は、その運用を CLI の日常操作と sandbox 設定へ引き寄せる更新として読むべきだ。

## 事実: 1.0.78-0で何が増えたか

GitHub の release note は、まず `/permissions` command の追加を挙げている。これは、session 中に approval mode を切り替えるための操作である。CLI agent を使う現場では、最初は read-heavy な調査から始め、途中で file edit や command 実行へ移ることが多い。そこで session を作り直さず、権限モードを切り替えられることは実務上の摩擦を下げる。

同じ release では、Agent Client Protocol mode で `closeSession` request を処理できるようになった。ACP は、外部 client や editor が agent session を扱うための protocol 面である。`closeSession` が通ると、client 側の UI、session 管理、後片付けを明示的に設計しやすくなる。これは小さな protocol 対応に見えるが、社内 launcher や agent hub から Copilot CLI を扱う組織では重要だ。

改善項目では、`allowDevToolCaches` が既定で有効になったことが大きい。release note は、sandboxed build が toolchain cache、package registry、installation directory へアクセスしやすくなると説明している。opt out したい場合は、設定で false にできる。つまり GitHub は、sandbox を保ちながら build と test の現実的な速度を上げる方向へ寄せている。

もう一つの実務的な改善は、長大な transcript の扱いだ。release note は、長い transcript を progressive に描画し、session resume の速度と memory usage を改善したと説明している。長時間 agent 作業では、会話、tool call、diff、error、retry が積み上がる。ここが重くなると、途中再開や監査確認が実用に耐えにくくなる。

## 事実: MCPと設定のずれも直している

今回の release は、MCP 周辺の細かい修正も含む。明示的に設定した GitHub MCP toolset と tool config を尊重する修正、OAuth 後に deferred MCP server を refresh する修正、session 切り替え時に MCP server や hook を再起動しない修正が並んでいる。

この一連の修正は、MCP を「便利な拡張」ではなく、agent の実行権限面として見ると重要になる。社内で許可した toolset と CLI が実際に使う toolset がずれると、監査や事故調査で説明できない。OAuth 後の refresh が弱ければ、許可済みのはずの tool が使えない、または古い状態のまま動く。session 切り替えで server が再起動すれば、長時間作業の状態やログの整合性にも影響する。

GitHub Copilot CLI の README は、CLI を terminal 上で動く agent として説明し、GitHub context や MCP による拡張、実行前確認を含む control を強調している。docs 側も CLI reference と ACP reference を分けて案内しており、単体コマンドではなく、外部 client から扱われる agent runtime としての色が濃い。

## 分析: cache許可は速度と境界の交換条件である

ここからは分析である。

`allowDevToolCaches` の既定有効化は、開発者体験としては自然だ。sandboxed build でも npm、pnpm、uv、cargo、maven、gradle、go、docker まわりの cache に触れないと、毎回の test が遅くなる。遅すぎる agent は使われない。使われない統制は、結局 bypass される。

ただし、cache は中立ではない。build cache には package artifact、compiled object、downloaded tool、場合によっては private registry 由来の metadata が入る。sandbox の外側にある cache を agent に読ませるなら、どの cache が共有され、どの project 間で再利用され、どの user 権限で作られたものかを理解する必要がある。

日本企業で特に注意したいのは、委託先端末や共有 CI worker である。社内社員の個人端末なら、cache の owner と作業 repo がある程度一致する。一方、委託先の標準端末や CI worker では、複数顧客、複数部署、複数 repository の cache が同居しやすい。sandboxed build が速くなる一方で、cache を通じた情報の混線を避ける設計が必要になる。

この論点は [Copilot OpenTelemetry管理export](/blog/github-copilot-opentelemetry-managed-export-2026/) ともつながる。agent の command、tool call、latency を見るだけでは足りない。実行環境がどの cache を読めるか、cache hit がどの project 由来か、失敗時にどの artifact を消すかまで運用に入れたい。

## 日本企業の確認リスト

第一に、approval mode を作業段階で分ける。調査、設計、編集、test 実行、外部 network、PR 作成を同じ承認水準にしない。`/permissions` で切り替えられるからこそ、社内手順では「どの段階でどの mode にするか」を明文化するべきだ。

第二に、sandbox cache の許可範囲を端末種別ごとに決める。社員の専用端末、VDI、委託先端末、CI worker、検証用 container では前提が違う。cache を許すなら、project ごとに分離するか、定期削除するか、private registry credential が残らないかを確認する。

第三に、MCP toolset を設定ファイルと実行時ログで照合する。GitHub MCP toolset を明示設定している組織では、CLI 更新後に expected tool list と実際の tool list を確認する。社内 MCP gateway を使う場合は、OAuth 後の refresh、token 期限、tool permission の変更が session 中にどう反映されるかを見る。

第四に、長大 transcript の保存と閲覧権限を決める。resume が速くなるほど、長時間 session を残して使う運用が増える。だが transcript には、指示、コード断片、error、file path、社内 URL、tool 出力が含まれる。保存期間、閲覧者、監査時の持ち出し手順を決めておかないと、便利な履歴が別のリスクになる。

## 見落としやすい運用リスク

一つ目は、prerelease を標準配布へ入れるタイミングである。`v1.0.78-0` は prerelease であり、安定版として全社配布する前に検証が必要だ。特に sandbox、MCP、session resume は端末環境と設定に依存する。代表的な monorepo、小規模 repo、private registry、社内 MCP、Windows / macOS / Linux を分けて試すほうがよい。

二つ目は、`/permissions` を利用者任せにすることだ。便利な command が増えると、現場は作業を止めずに強い権限へ切り替えやすくなる。企業利用では、切り替え自体を禁止する必要はないが、強い mode にした理由、対象 repo、実行 command、戻し忘れを確認できるようにしたい。

三つ目は、cache を性能問題としてだけ扱うことだ。sandboxed build が遅いから cache を許す、という判断は現実的である。ただし、cache を許した瞬間に、agent が触れる filesystem 境界は広がる。CI では job ごとの ephemeral cache、repository ごとの key、secret を含まない cache policy を分けるべきだ。

## まとめ

GitHub Copilot CLI `v1.0.78-0` は、派手なモデル追加ではなく、agent CLI を日常の開発運用へ近づける更新である。`/permissions` は実行中の承認境界を動かし、`allowDevToolCaches` は sandbox と build 速度の折り合いを変え、ACP `closeSession` は外部 client からの session 管理を明確にし、長大 transcript 改善は長時間作業の再開を現実的にする。

日本企業は、この release を「最新版に上げるか」だけで判断しないほうがよい。端末種別、cache 分離、approval mode、MCP toolset、transcript 保管、prerelease 配布の6点を一つの運用表に入れるべきだ。Copilot CLI が強くなるほど、必要なのは止める運用ではなく、どの権限で、どの環境で、どの証跡を残して動かすかを説明できる設計である。

## 出典

- [Release 1.0.78-0](https://github.com/github/copilot-cli/releases/tag/v1.0.78-0) - GitHub Copilot CLI, 2026年7月31日
- [GitHub Copilot CLI README](https://github.com/github/copilot-cli) - GitHub
- [Copilot CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference) - GitHub Docs
