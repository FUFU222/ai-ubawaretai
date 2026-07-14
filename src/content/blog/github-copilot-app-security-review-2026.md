---
title: 'Copilot security review、AI脆弱性検査の実務'
description: 'GitHub Copilot appの/security-review公開プレビューを解説。日本企業がPR前のAI脆弱性検査、CodeQL、Dependabot、secret scanningをどう分担するか整理する。'
pubDate: '2026-07-14'
category: 'news'
tags: ['GitHub Copilot', 'セキュリティ', '開発者ツール', 'AIエージェント', 'コードレビュー', '日本企業']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年7月14日**、GitHub Copilot appで`/security-review` slash commandを公開プレビューとして提供開始した。作業中のコード変更に対し、Copilot appの中からAI駆動のセキュリティレビューを実行し、重大度と確信度を伴う指摘、修正提案、再確認までを同じ作業面で扱えるようにする更新である。

これは、[GitHub Copilot appがagent開発の作業面になった](/blog/github-copilot-app-technical-preview-2026/)流れの延長にある。Copilot appはissue、branch、PR、CIをひとつの作業面へ寄せる方向に進んできた。今回の`/security-review`は、[Copilot CLI security reviewでPR前検査を使う実務](/blog/github-copilot-cli-security-review-2026/)をデスクトップアプリの開発フローへ持ち込む意味がある。

同時に、これは既存の静的解析やGitHub Advanced Securityを置き換える話ではない。[CodeQLのAI prompt injection検出](/blog/github-codeql-ai-prompt-injection-2026/)や[secret scanningのAI検出名変更](/blog/github-secret-scanning-ai-detected-names-2026/)と組み合わせ、どの段階で何を見るかを分担する設計が重要になる。

## 事実: Copilot appで/security-reviewを実行できる

GitHub Changelogによると、`/security-review`はCopilot app上で作業中の変更に対して実行するslash commandで、公開プレビューとして提供される。対象はCopilot Free、Pro、Business、Enterpriseのユーザーで、ローカルの作業変更を見ながら、脆弱性の可能性を早い段階で確認する用途に置かれている。

GitHubは、この機能がCopilot CLIで既に提供されているAI駆動の脆弱性スキャンと同じ系統のものだと説明している。つまり、PRを作ってからCIやコードレビューで初めて見つけるのではなく、開発者が差分を作っている途中でセキュリティ観点を挟める。

検出対象としてGitHubが挙げているのは、injection、cross-site scripting、insecure data handling、path traversal、weak cryptographyのような一般的で影響の大きい脆弱性クラスである。結果は重大度と確信度を伴う指摘として返り、開発者は提案を適用し、再確認する流れを同じCopilot app内で進められる。

Copilot app側の公式ドキュメントでは、同アプリはagent-driven development向けのデスクトップアプリで、複数のagent session、issueやPR、branch、CIを扱える作業面として説明されている。今回の更新は、この作業面にセキュリティレビューの入口を追加するものと読める。

## 事実: 既存の検査と役割が違う

ここで混同してはいけないのは、`/security-review`がCodeQL、Dependabot、secret scanning、branch protection、必須レビューを置き換えるものではない点だ。GitHub自身も、今回の機能はCode scanning、Dependabot、secret scanningを補完する軽量なオンデマンドチェックだと位置づけている。

CodeQLはルール、クエリ、言語サポート、CI上の再現性に強い。Dependabotは依存関係と脆弱性情報に強い。secret scanningは漏えいした資格情報やtokenの検出に強い。これらは組織全体で統制しやすく、監査ログやルール化にも向く。

一方、`/security-review`は、開発者がまだPRを出す前、またはPR前後の小さな修正中に、差分に対して「この実装は危なくないか」を聞く用途に合う。AIレビューなので、文脈を読んだ説明や修正提案を返せる可能性がある。反面、再現性、網羅性、組織ポリシーとしての強制力は、静的解析や必須チェックほど単純ではない。

したがって、日本企業が導入するなら、`/security-review`を「最後の門番」ではなく「開発者の手元で早めに指摘を得る補助線」と定義するべきだ。PR merge可否は、CodeQL、secret scanning、Dependabot、必須人間レビュー、必要に応じたセキュリティ担当レビューで判断する。

## 分析: PR前の安全確認が軽くなる

ここからは分析だ。

日本の開発組織では、セキュリティレビューがPR後半やリリース直前に寄りやすい。レビュー担当者が限られ、業務委託先や複数部門の承認が絡み、脆弱性指摘が遅れるほど手戻りが大きくなる。特に認証、権限、課金、個人情報、外部API連携では、設計に近い段階で違和感を拾いたい。

`/security-review`は、この遅れを少し前倒しにできる。開発者がCopilot appで差分を作り、PRにする前にAIレビューを挟めば、典型的な入力検証漏れ、パス操作、暗号設定、データ取り扱いの粗さを早く見つけられる可能性がある。

ただし、これは「AIがセキュリティを保証する」という話ではない。AIレビューは、見落としも誤検知も起こす。特に業務固有の権限境界、金融・医療・人事データの扱い、社内規約、法務判断は、一般的な脆弱性クラスだけでは判定しにくい。

価値が出るのは、開発者に対して「PRを出す前に一度AIセキュリティレビューを回す」という習慣を作ることだ。これにより、人間レビューは低レベルな指摘を繰り返す時間を減らし、設計、権限、監査、例外処理のような深い論点へ集中しやすくなる。

## 実務: 導入順序は小さく始める

最初に決めるべきなのは、対象リポジトリである。全社一斉ではなく、Webフロントエンド、API、管理画面、認証周辺、顧客データを扱う小さなチームから始める。セキュリティ担当者がレビューしやすい規模で、AI指摘の質と誤検知を観察する。

次に、pull request templateへ「Copilot appまたはCLIで`/security-review`を実行したか」を任意チェックとして入れる。初期段階では必須にしないほうがよい。AIレビューを義務化すると、開発者は結果を読まずにチェックだけ付ける運用へ流れやすい。

三つ目に、CodeQLやsecret scanningとの分担表を作る。たとえば、injectionやXSSの実装差分は`/security-review`でも見る。言語ごとの静的解析はCodeQLで見る。token漏えいはsecret scanningで見る。依存ライブラリはDependabotで見る。個人情報や社内規約は人間レビューで見る、という形だ。

四つ目に、AI指摘の扱いを決める。重大度highかつconfidenceが高い指摘はPR本文に残す。修正しない場合は理由を書く。low confidenceの指摘は、学習材料として扱い、merge gateにはしない。これにより、AIレビューの結果が監査可能な判断に変わる。

五つ目に、効果測定を行う。見るべき指標は、AIレビュー実行率、修正された指摘数、誤検知率、CodeQLや人間レビューで後から見つかった重大指摘、PR作成からfirst reviewまでの時間、review cycle数である。単に`/security-review`の実行回数だけを追っても、実務改善は分からない。

## 注意点: 承認の代替にしない

`/security-review`を導入するとき、最も危ない誤解は「AIレビューを通したから安全」と見なすことである。GitHubの説明でも、この機能はオンデマンドの軽量チェックであり、既存のcode scanning、Dependabot、secret scanningを補完する位置づけである。

日本企業では、監査や委託先管理のために、誰が何を承認したかを残す必要がある。AIレビュー結果は判断材料にはなるが、承認者そのものではない。特に個人情報、決済、医療、金融、公共系のシステムでは、人間の責任範囲を明確に残す必要がある。

また、Copilot appはagent-driven developmentの作業面であり、複数agent sessionやbranch、PR、CIを扱える。便利になるほど、開発者がアプリ内で完結した感覚を持ちやすい。だが、組織のmerge policy、code owners、branch protection、監査ログ、セキュリティ例外申請は別に残すべきである。

実務上は、`/security-review`を「PR前の自己点検」と呼ぶのがよい。「承認」「監査」「脆弱性診断」という言葉を使うと、期待値が上がりすぎる。開発者には、AI指摘を直すだけでなく、なぜ問題になり得るのかをPR本文に短く残すよう求める。

## まとめ

GitHub Copilot appの`/security-review`公開プレビューは、AIセキュリティレビューを開発者の作業面に近づける更新である。Copilot appで差分を作りながら、PR前に典型的な脆弱性クラスを確認し、修正提案を見て再確認できるようになる。

ただし、これはCodeQL、Dependabot、secret scanning、人間レビューの代替ではない。日本企業は、`/security-review`をPR前の軽量な自己点検として導入し、静的解析、依存関係管理、secret検出、承認レビューと分担させるべきだ。まずはリスクの高い小規模チームで試し、誤検知率、修正率、後工程での重大指摘の減少を見ながら、必須化するかどうかを判断するのが現実的である。

## 出典

- [Security reviews now available in the GitHub Copilot app](https://github.blog/changelog/2026-07-14-security-reviews-now-available-in-the-github-copilot-app/) - GitHub Changelog, 2026-07-14
- [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app) - GitHub Docs
- [Requesting a code review with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review) - GitHub Docs
