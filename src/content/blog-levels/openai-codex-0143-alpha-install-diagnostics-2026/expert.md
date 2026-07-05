---
article: 'openai-codex-0143-alpha-install-diagnostics-2026'
level: 'expert'
---

OpenAI Codex `0.143.0-alpha.36`を企業向けに評価するとき、release番号だけを追っても判断材料は少ない。GitHub Releasesの本文は簡潔で、stableへの搭載保証やrollout計画を説明していない。見るべきなのは、一つ前のalpha tagから入ったmerged changeと、それが既存のcontrol planeへ何を要求するかである。

今回の中心は、standalone installer、plugin inventory、streaming stateの三つだ。[CodexのWindows端末運用](/blog/openai-codex-windows-profiles-usage-2026/)で整理した端末管理へinstallerの再現性を足し、[ChatGPT Businessのplugin管理](/blog/openai-chatgpt-business-plugin-admin-controls-2026/)で整理した配布policyへremote/local version差を足す必要がある。また、[Codex Securityの開発フロー](/blog/openai-codex-security-workflow-2026/)と同じく、状態表示が改善されても最終的な更新・再実行判断は人間と組織のpolicyに残る。

以下では、公開PRで確認できる事実を先に示し、その後にenterprise acceptance test、observability、rollout設計を分析する。alpha固有の挙動をstable contractとして扱わないことを前提にする。

## 事実: alpha tagに含まれる変更範囲

`rust-v0.143.0-alpha.36`は2026年7月5日1時2分UTCに公開された。前の`alpha.35`からのcompareでは六commitがaheadとして示される。release commit以外には、feedback attachmentのMIME type修正、installerのrelease metadata再利用、remote plugin versionの露出、unused configurationの削除、response eventからbuffering metadataを読む変更が含まれる。

このうちfeedback修正では、path-backed attachmentを常に`text/plain`としていた処理を変え、gzipは`application/gzip`、既知のtext formatは対応するtype、未知binaryは`application/octet-stream`として扱う。PRの説明では、Codex Desktopのlog bundle自体は正しいarchiveでも、後段のfeedback upload pathで誤ったmetadataが付き、Sentry consumerがUTF-8 textとしてdecodeしてbytesを壊す可能性があった。診断archiveをsupportへ渡す企業では、障害証跡のintegrityに関係する。

ただし、この記事の主眼はfeedback uploadではない。install、plugin、bufferingは、日常的な配布・統制・長時間実行の三つのcontrolへ直接接続できるためである。

## 事実: install時のAPI requestを集約

PR #31056が示す従来flowは、version resolve、platform package selection、checksum manifest selection、asset digest lookupで、最大四回のunauthenticated GitHub REST API requestを行うものだった。ここで問題になるのは、request countそのものだけではない。shared egress下では、異なる利用者、CI、package scanner、developer portalが同じsource IPのlimitを共有する可能性がある。

修正では、選択versionとrelease metadataを同時にresolveする。`latest`は`/releases/latest` responseに含まれるversionとasset listを使う。明示versionはrelease tag endpointのresponseを使う。shell installerとPowerShell installerの両方で、そのmetadataをpackage、checksum、legacy package selectionへ再利用する。

error semanticsも重要だ。従来のshell installerはmetadata probe失敗を抑制する場面があり、GitHub APIの`403`がrelease asset不存在のように見える場合があった。修正後はmetadata fetch failureを、GitHub availabilityまたはrate limitの可能性として報告する。これはfailureをなくす変更ではなく、failure domainを正しく残す変更である。

PRは明確に、artifactをGitHub CDN以外へ移す変更ではないとscopeを限定している。そのため、control pointは次のように分かれる。

- release metadata取得: GitHub API、source IP、unauthenticated limit、API availability
- asset取得: GitHub release/CDN、redirect、proxy allowlist、download timeout
- integrity確認: checksum manifest、asset digest、filename、platform mapping
- execution: endpoint protection、code signing、binary quarantine、local install permission

一つ目が改善しても、二つ目以降は独立して失敗する。監視とrunbookは「Codex install failed」という一つのeventへ潰してはいけない。

## 事実: plugin protocolに二つのversionを持つ

PR #30981は`PluginSummary.version`へremote marketplaceがadvertiseするversionを追加する。`plugin/installed` responseにはbackend release versionを保持し、`localVersion`はlocally materialized packageのversionとして維持する。app-server schema、TypeScript protocol typeも更新されている。

ここで`version`を「正」、`localVersion`を「誤」と解釈してはいけない。remoteは提供側のcurrent release、localは実行環境へ展開されたartifactを示す。canary rollout、ring deployment、compatibility hold、emergency rollbackでは、意図的に差を作る。異常なのは差そのものではなく、owner、理由、期限がない差である。

PRのtest範囲には、installed responseのremote-version regression、remote plugin list、installed marketplace、core plugin share、TUI plugin mentionがある。一方、policy enforcement、automatic quarantine、mandatory update、security advisoryとの照合は変更内容に含まれない。protocolがversion fieldを運ぶようになっても、governance workflowは利用組織が設計する必要がある。

## 事実: response eventをbufferingのsource of truthに近づける

PR #31064は、streamed buffering payloadからoptionalなfaster-model metadataを読む。object-valued buffering signalがあればbuffering UIを表示し、eventのfaster-model fieldが存在すればheaderより優先する。field omissionは従来headerへのfallback、explicit `null`はretry target未設定として扱う。

この三値の違いは実装上重要だ。

- fieldあり: eventが現在のretry targetを指定する
- field省略: compatibilityのため既存headerを参照する
- explicit null: targetなしというserver intentを維持する

単純なtruthy/falsy変換をすると、省略とnullを区別できず、古いheader値を誤って復活させる可能性がある。今回の変更はevent precedenceとfallback条件を明示している。

buffering UIはavailability guaranteeではない。object-valued signalを受けたことを示すだけで、task completion、repository consistency、billing状態、tool side effectの有無を保証しない。UI stateとjob stateを分ける必要がある。

## 分析: installer acceptance testをfailure matrixにする

enterprise acceptance testでは、成功経路を一回通すだけでは足りない。最低でも次のmatrixを作る。

| Case | Metadata | Asset | Checksum | 期待する分類 |
|---|---|---|---|---|
| A | 200 | 200 | match | install成功 |
| B | 403 | 未実行 | 未実行 | API availability/rate limit候補 |
| C | 200 | 403/timeout | 未取得 | asset/CDN/proxy失敗 |
| D | 200 | 200 | mismatch | integrity failure、実行禁止 |
| E | 404 | 未実行 | 未実行 | version/tag不存在 |
| F | proxy改変 | 不定 | 不定 | TLS/proxy policy確認 |

Case BとEの区別が今回のerror改善の中心である。help deskが両方を「versionがない」と処理すると、利用者はversionを変え続ける。逆に、すべてをrate limitと決めつけるとtypoやretired tagを見逃す。

shellとPowerShellは別々に試す。企業内ではMac/Linux developerとWindows developerでinstall pathが異なり、proxy environment variable、certificate store、execution policy、temporary directory、endpoint protectionの挙動も異なる。PRが両installerを修正していても、社内環境で同じ結果になるとは限らない。

`latest`と明示versionも分ける。`latest`は運用が簡単だが、同じscriptを翌日に実行すると別binaryになる可能性がある。明示versionは再現性を上げるが、update ownerと期限が必要になる。本番配布は明示version、検証ringはlatest監視、という分離が現実的だ。

## 分析: network observationを四層へ分ける

共有IP問題を診断するにはclient logだけでは足りない。最低限、次の四層を関連付ける。

1. installer log: 選択version、platform、失敗phase、HTTP status、retry
2. proxy/VPN log: destination、TLS result、block reason、bytes、latency
3. GitHub response metadata: status、rate-limit関連header、request time
4. endpoint state: binary path、checksum、installed version、execution result

secretやtokenをlogへ残さない前提で、correlation IDまたは実行時刻・端末IDを使って突合する。unauthenticated requestであっても、full response bodyを無制限に保存する必要はない。診断に必要なstatus、host、path class、rate-limit header、durationへ絞る。

今回の修正はrequest回数を減らすが、企業側でauthenticated GitHub APIをinstallerへ勝手に注入すべきだという意味ではない。認証tokenを入れればlimit scopeや秘密管理が変わり、標準installerのsupport boundaryから外れる可能性がある。まず公式flowを固定し、必要ならinternal artifact mirrorなど別の配布設計を正式に評価する。

## 分析: plugin inventoryのdata model

remote/local version差を管理するなら、台帳を単一の`version` columnで済ませない。最低限、次のfieldが必要になる。

- plugin identifierとdisplay name
- marketplace/provider
- remote versionと確認時刻
- local versionと端末またはworkspace
- package digestまたはrelease reference
- rollout ring
- ownerとapprover
- permission scope
- app、skill、MCP server、external API dependency
- approved date、expiry、exception reason

同じpluginでもworkspaceごとにlocal versionが違う場合があるため、plugin masterとdeployment recordを分ける。masterにはprovider、risk classification、基本permissionを置き、deployment recordにはworkspace、端末群、local version、rollout statusを置く。

alert条件も段階化する。remote/local mismatchが発生しただけで全alertを出すと、canary rolloutのたびにnoiseになる。security advisory対象、minimum supported version未満、期限超過、owner不明、digest不一致をhigh priorityにし、通常の一version差はchange queueへ送る。

version文字列の比較にも注意する。semantic versionでないscheme、pre-release suffix、build metadata、vendor-specific channelがあり得る。文字列の大小だけで新旧を決めず、provider metadataとrelease policyを使う。

## 分析: bufferingをstate machineで扱う

長時間Codex taskの監視では、UI文言よりstate transitionを定義する方がよい。例として次の状態を分ける。

- `running`: tokenまたはtool activityが進行
- `buffering`: server eventにより待機を表示
- `needs_input`: 人間の判断待ち
- `cancel_requested`: cancellation送信済み、完了未確認
- `failed`: errorで終了
- `completed`: final responseと必要なartifactを確認
- `unknown`: connection断などでserver final state不明

bufferingからrunningへ戻る場合、completedへ進む場合、timeoutでunknownへ行く場合を記録する。buffering表示が出たからtimerをresetし続ける設計にすると、stuck sessionが無期限に残る。elapsed time、last progress、server event、tool side effectを別のmetricにする。

再実行前にはidempotencyを確認する。read-only analysisなら重複実行の害は小さいが、branch作成、commit、issue更新、deployment、外部SaaS書き込みが含まれるtaskは二重実行で競合する。cancel responseを受けただけでside effectがなかったと決めず、repository statusと外部systemのrecordを確認する。

faster-model metadataが示されても、自動切替を無条件に許可するとは限らない。model policy、データ処理条件、費用、品質、管理者設定が変わる可能性がある。今回のPRはmetadata処理を示すもので、企業のmodel approvalを置き換えるものではない。

## Rollout設計

alphaの扱いは三ring程度に分ける。

**Ring 0: isolated test**  
非本番repository、test account、検証proxyでinstaller failure matrixとprotocol responseを確認する。ここではalpha利用を許可しても、業務codeや顧客dataを入れない。

**Ring 1: stable candidate verification**  
同じ変更がstable release noteまたはtagに入ったことを確認してから、少数のdeveloper端末で試す。固定versionとchecksumを使い、remote/local plugin version、buffering event、feedback archiveを観測する。

**Ring 2: managed deployment**  
help desk runbook、rollback package、owner、更新期限、network allowlistを揃えた後に対象を広げる。`latest`を各端末が直接取得するのではなく、組織の標準配布方式に合わせる。

rollbackではbinary versionだけでなく、plugin local version、protocol consumer、schema互換性も確認する。app-serverとclientが異なるversionを使う構成では、新fieldの省略を許容できるかを見る。今回のbuffering変更がheader fallbackを残す点は互換性に寄与するが、社内wrapperが未知fieldを拒否しない保証にはならない。

## 監査で残す証跡

正式版の承認記録には、少なくとも次を残す。

1. 検証したrelease tagとcommit
2. download URL classとchecksum
3. shell/PowerShellそれぞれのtest結果
4. proxy、VPN、共有NAT条件
5. failure matrixの結果とscreen/log evidence
6. plugin remote/local versionのsample
7. version差へのalertと例外処理
8. buffering、cancel、timeout、retryのstate transition
9. stableでalpha結果を再確認した日付
10. rollout ownerとrollback条件

この証跡は「alphaを試した」という活動記録ではなく、stableを配ってよいという判断根拠にする。alphaとstableでcommitが変わった場合は差分を確認し、未検証の変更があれば承認範囲を狭める。

## まとめ

Codex `0.143.0-alpha.36`から読み取れるのは、企業導入の信頼性がモデル性能だけでは決まらないということだ。installerはrelease metadataのrequest回数とerror semanticsを改善する。plugin protocolはremote releaseとlocal artifactを分ける。buffering処理はevent precedence、header fallback、explicit nullを区別する。

日本企業では、これらを個別機能として眺めるより、配布、inventory、runtime stateの三つのcontrolへ変換するべきだ。共有IPとproxyを含むfailure matrix、remote/local versionを持つplugin台帳、bufferingとunknownを分けるstate machineを準備する。alphaはその設計を早く試す材料であり、本番導入の根拠ではない。stable版で同じ変更を確認し、固定version、checksum、段階配布、rollbackを揃えて初めて組織標準へ進める。

## 出典

- [OpenAI Codex 0.143.0-alpha.36 release](https://github.com/openai/codex/releases/tag/rust-v0.143.0-alpha.36) - OpenAI, 2026-07-05
- [Compare 0.143.0-alpha.35...0.143.0-alpha.36](https://github.com/openai/codex/compare/rust-v0.143.0-alpha.35...rust-v0.143.0-alpha.36) - OpenAI
- [PR #31056: reuse GitHub release metadata](https://github.com/openai/codex/pull/31056) - OpenAI
- [PR #30981: expose remote plugin versions](https://github.com/openai/codex/pull/30981) - OpenAI
- [PR #31064: read buffering metadata from response events](https://github.com/openai/codex/pull/31064) - OpenAI
- [PR #30796: fix MIME types for path-backed feedback attachments](https://github.com/openai/codex/pull/30796) - OpenAI
