---
article: 'openai-codex-0143-alpha-install-diagnostics-2026'
level: 'child'
---

OpenAIは2026年7月5日、Codex CLIの`0.143.0-alpha.36`を公開した。これは正式版ではなく、開発途中のalpha buildだ。そのため、会社の全端末をすぐに更新する対象ではない。一方で、正式版を安全に受け入れるために、今から確認できる運用上の変更が三つある。

一つ目はinstallerだ。二つ目はpluginのversion表示、三つ目はCodexが応答を待っている間のbuffering表示である。どれも派手な新機能ではないが、「インストールできない」「どのplugin版が動いているか分からない」「処理が止まったように見える」という現場の困り事に関係する。

## installerの403を正しく読む

Codexのstandalone installerは、GitHub Releasesから必要なpackageやchecksumの情報を取る。従来の処理では、一回のinstallでrelease metadataを最大四回参照する場合があった。会社のネットワークでは、多くの人が同じglobal IPを共有することがある。このため、本人の操作が少なくても、同じ出口を使う処理が重なるとunauthenticated GitHub APIのrate limitへ近づく可能性がある。

今回の変更では、最初に得たrelease metadataをpackageやchecksumの選択へ再利用する。さらに、APIが`403`を返したときに、存在しないassetだと誤解させるのではなく、GitHubの到達状況やrate limitの可能性を残す方向へerrorを改善する。

ただし、これですべてのnetwork問題が消えるわけではない。release fileは引き続きGitHub CDNからdownloadする。社内proxy、TLS inspection、VPN、allowlistの設定は別に確認する必要がある。

## pluginの「最新」と「実行中」を分ける

remote plugin marketplaceが示すversionと、自分の環境へ実際に置かれたlocal versionは同じとは限らない。管理者が段階的に配る場合、network errorで更新できなかった場合、検証のために旧版を固定した場合には差が出る。

今回のalphaでは、remote側のversionを`version`、local packageのversionを`localVersion`として分けて扱う変更が入った。これにより、「marketplaceではどの版が提供されているか」と「今どの版を実行しているか」を別々に記録しやすくなる。

ただし、versionが見えるだけで安全になるわけではない。会社では、pluginの提供元、権限、接続先、更新期限、承認者も台帳へ記録する必要がある。新versionが出たら自動で全員へ配るのか、permission差分を確認してから配るのかも決めておく。

## bufferingを停止と間違えない

Codexが長い処理をしていると、すぐに通常の応答が返らない場合がある。今回の変更では、streamed responseに含まれるbuffering情報をUIが読み、必要に応じてfaster modelに関する情報を扱う。新しいeventに情報がない場合は、従来のheaderへfallbackする互換処理も残る。

利用者にとって重要なのは、buffering、error、停止を同じ状態にしないことだ。buffering中に「壊れた」と思って何度も再実行すると、同じtaskを重ねる可能性がある。反対に、表示があるからといって無期限に待つのもよくない。

運用では、待ち始めた時刻、cancelできるか、最終status、再実行してよい条件を決める。たとえば、一定時間で人間へ通知し、repositoryに変更が入っていないことを確認してから再実行する。

## 日本企業が今試すこと

まず、alphaは検証用端末だけで扱う。shell版とPowerShell版のinstallerを試し、通常成功、GitHub APIの`403`、asset download失敗を別々に記録する。会社の共有networkと個別networkで結果が違うかも見る。

次に、pluginのremote versionとlocal versionが異なる状態を作り、両方を確認できるか試す。version差があった場合に、誰がいつ更新を判断するかも決める。

最後に、buffering中の表示、cancel、timeout、再実行を確認する。alphaで動いた結果をそのまま正式版の承認には使わず、stable releaseが出た時点でもう一度同じ試験を行う。

## まとめ

Codex `0.143.0-alpha.36`の変更は、企業導入の診断を少し正確にする。installerのAPI参照を減らし、remoteとlocalのplugin versionを分け、buffering状態をeventから読めるようにする。

今すぐ本番へ入れる更新ではない。日本の開発チームは、共有IP、社内proxy、固定version、plugin台帳、再実行条件を確認するための材料として使うのがよい。

## 出典

- [OpenAI Codex 0.143.0-alpha.36 release](https://github.com/openai/codex/releases/tag/rust-v0.143.0-alpha.36) - OpenAI, 2026-07-05
- [PR #31056: reuse GitHub release metadata](https://github.com/openai/codex/pull/31056) - OpenAI
- [PR #30981: expose remote plugin versions](https://github.com/openai/codex/pull/30981) - OpenAI
- [PR #31064: read buffering metadata from response events](https://github.com/openai/codex/pull/31064) - OpenAI
