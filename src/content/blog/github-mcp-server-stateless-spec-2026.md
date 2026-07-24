---
title: 'GitHub MCP Server対応、次期MCP仕様の運用点'
description: 'GitHub MCP Serverの次期MCP仕様対応を整理。日本企業がCopilotと社内MCPサーバーのgateway、認証、監査、conformance testsをどう見直すべきか解説する。'
pubDate: '2026-07-24'
category: 'news'
tags: ['GitHub Copilot', 'MCP', 'AIエージェント', '開発者ツール', 'AIガバナンス', 'セキュリティ']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年7月23日**、GitHub MCP Server が次期 **Model Context Protocol、MCP** 仕様に先行対応したと発表した。MCP の `2026-07-28` 仕様は protocol core を stateless にし、`initialize` や protocol-level session を外し、HTTP gateway で扱いやすい header、extensions、conformance tests を前面に出す。

これは GitHub Copilot の小さな接続改善ではない。[GitHub Agent FinderとARD](/blog/github-copilot-agent-finder-ard-2026/) で扱ったように、Copilot は MCP server、skills、agents を registry から見つける方向へ進んでいる。さらに [GitHub MCP Serverの事前検査](/blog/github-mcp-server-security-scanning-2026/) のように、secret scanning や dependency scanning も MCP 経由で agent の作業面に入ってきた。今回の仕様対応は、その接続基盤を「動けばよい拡張」から「水平スケール、認証、監査、検証を前提にした標準」へ寄せる更新として読むべきだ。

日本企業が見るべき焦点は、MCP の新仕様をすぐ自社実装するかどうかだけではない。Copilot、社内 MCP server、gateway、proxy、SIEM、ID基盤、開発者端末のどこで session、認証、ログ、tool 権限を管理しているかを棚卸しするタイミングである。

## 事実: GitHub MCP Serverは次期仕様に先行対応した

GitHub Changelog によると、MCP protocol は **2026年7月28日** に stateless 仕様へ進む予定で、GitHub MCP Server はその正式リリース前に最新仕様をサポートした。GitHub は、GitHub MCP Server で Redis session を外し、`initialize` 時の database write と各 call の database read をなくしたと説明している。

もう一つの変更は deep packet inspection の回避である。GitHub は logging や secret scanning のために一部の MCP request 情報を読む必要があるが、新仕様では HTTP header に必要な値が載るため、SDK が処理する前に payload 全体を深く検査する必要が減る。これは gateway、WAF、監査基盤を持つ企業にとって実務的な差になる。

3つ目は elicitation 実装の更新だ。GitHub MCP Server の stdio 版は user login などで URL elicitation を使う。新しい protocol version では、やり取りの各 step が別 HTTP request になるため、GitHub は公式 Go SDK の wrapper を使い、新旧 client の両方で動くようにしたと説明している。

GitHub はさらに、MCP に official conformance tests が入ったことを強調している。Copilot に codebase、conformance suite、draft spec、tier 1 SDK 実装を渡して検証させると、AI assisted development の検証がしやすくなるという位置づけだ。

## 事実: MCPはprotocol-level sessionを外す

MCP Blog の release candidate 記事では、`2026-07-28` 仕様の中心は stateless protocol core だと説明されている。従来の Streamable HTTP では、client が `initialize` を呼び、server が `Mcp-Session-Id` を返し、その後の request が同じ session id を持つ設計だった。これにより sticky routing や shared session store が必要になりやすかった。

新仕様では、protocol version、client info、client capabilities が request ごとの `_meta` に入り、`server/discover` で必要な capability を取得できる。`Mcp-Session-Id` と protocol-level session は削除される。つまり、MCP request はどの server instance に届いても処理できる形へ近づく。

ただし、application state まで消えるわけではない。MCP Blog は、買い物かご ID や browser ID のような明示的な handle を tool が返し、後続 call で model がそれを引数として渡す設計を示している。protocol が隠れた session を持つのではなく、必要な state を tool の通常の入力として扱う考え方である。

draft specification も、MCP を LLM application と external data sources、tools をつなぐ open protocol と定義し、JSON-RPC 2.0、stateless self-contained requests、per-request capability negotiation を key details に置いている。ここから見ても、MCP は単なる IDE 拡張ではなく、agent と外部 system を接続するための標準化層である。

## 分析: 日本企業の焦点はgatewayと監査に移る

ここからは分析だ。

MCP の stateless 化は、社内 MCP server を複数チームへ配る企業に効く。session store や sticky routing に依存しないなら、普通の HTTP load balancer、API gateway、service mesh、rate limiter に載せやすくなる。特に日本企業では、開発者向け agent 環境を個別端末の設定だけで管理するより、gateway 側で接続先、method、tenant、user、repository を見たい場面が多い。

新仕様では `Mcp-Method` や `Mcp-Name` のような header が重要になる。gateway は payload 全体を読む前に、どの method、どの tool 名の request かを見て routing、rate limit、logging、policy enforcement を設計しやすくなる。これは [Copilot Issue自動化の承認線](/blog/github-copilot-issue-agent-automation-controls-2026/) で扱った rationale や approvals とは別の層だ。Issue 上の承認 UI が業務判断を見せるなら、MCP gateway の header と log は tool 実行の技術的な証跡を残す。

一方で、stateless になれば安全になるわけではない。MCP server は tool を agent に渡す境界であり、tool は任意の外部 API、社内 DB、repository、ticket、CI、cloud console へ届き得る。session が消えても、認証 token、resource handle、tool arguments、tool result、trace context は残る。むしろ request ごとに必要な情報が明示される分、log 設計を雑にすると個人情報や secret を広げる可能性がある。

したがって、日本企業では MCP の採用判断を「Copilot で便利に使えるか」だけで終わらせない方がよい。どの MCP server を許可するか、どの user や repository から呼べるか、tool result をどこまで保存するか、MCP の request header と body をどこで分けて記録するかを先に決めるべきだ。

## 実務: Copilot利用企業の移行チェック

最初に確認するのは、GitHub MCP Server をどの経路で使っているかである。Copilot CLI、VS Code、JetBrains IDE、社内 agent runner、custom MCP client、GitHub Copilot app が混ざっている組織では、同じ MCP server でも client 実装や更新タイミングが違う。GitHub は tier 1 SDK が backward compatibility を保って beta support を出していると説明しているが、社内 wrapper や proxy が古い protocol 前提なら例外になる。

2つ目は、session 依存の有無だ。自社 MCP server が `initialize` や session id に user state、tenant、repository、browser state を暗黙に結びつけているなら、明示的な handle へ移す設計が必要になる。たとえば「現在の repository」「現在の Jira project」「現在の customer account」を server 側 session に隠すより、tool の入力や短命 handle として監査可能にした方がよい。

3つ目は、gateway policy である。`Mcp-Method`、`Mcp-Name`、protocol version、user identity、repository、client surface を log に残し、read-only tool と write tool を分ける。write tool は rate limit、approval、dry run、sandbox account を優先する。secret scanning や dependency scanning のような防御用 tool は広げやすいが、本番 issue、顧客 DB、billing、HR、cloud admin に触る tool は別扱いにする。

4つ目は、conformance tests の扱いだ。MCP の公式 conformance suite は、MCP server 実装を「なんとなく動く」から「仕様に沿っている」へ引き上げる材料になる。社内 MCP server を作るチームは、CI に conformance tests を入れ、SDK 更新時に通す。Copilot に修正を任せる場合でも、spec と conformance tests を同じ repository に置けば、agent が検証可能な作業にしやすい。

5つ目は、既存の Copilot 管理と結びつけることだ。[Copilot cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/) で扱ったように、agent が使う MCP、enabled tools、Actions 承認、firewall は repository ごとに違う。MCP 仕様移行の棚卸しは、個別 server の技術更新だけでなく、Copilot 管理台帳の更新として扱うべきである。

## まとめ

GitHub MCP Server の次期 MCP 仕様対応は、Copilot が外部 tool とつながる土台を、本番運用に近い形へ進める更新である。MCP `2026-07-28` は protocol-level session を外し、self-contained request、header による routing、extensions、authorization hardening、conformance tests を前面に出す。

日本企業にとって重要なのは、MCP server を増やすことではない。社内 gateway で method と tool を見られるか、session に隠していた state を明示できるか、認証と監査ログを request 単位で説明できるか、conformance tests を CI に入れられるかである。Copilot の agent 活用を広げるなら、MCP 仕様移行は便利機能の追随ではなく、社内 agent 基盤を点検する節目として扱いたい。

## 出典

- [GitHub MCP Server supports the next MCP specification](https://github.blog/changelog/2026-07-23-github-mcp-server-supports-the-next-mcp-specification/) - GitHub Changelog, 2026-07-23
- [The 2026-07-28 MCP Specification Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) - Model Context Protocol Blog, 2026-05-21
- [Model Context Protocol draft specification](https://modelcontextprotocol.io/specification/draft) - Model Context Protocol
- [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp) - GitHub Docs
