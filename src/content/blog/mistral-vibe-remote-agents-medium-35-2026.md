---
title: 'MistralがVibe remote agentsとMedium 3.5を公開。日本の開発チームは「クラウド常駐コーディングAI」をどう使うべきか'
description: 'Mistral Vibe remote agents、Medium 3.5、Le Chat Work modeの要点を整理。GitHub権限、cloud sandbox、料金、日本企業の導入順まで読む。'
pubDate: '2026-04-30'
category: 'news'
tags: ['Mistral AI', 'Vibe', 'Coding Agent', 'Le Chat', 'AI開発']
draft: false
---

Mistralが2026年4月末にまとめて出してきた更新は、単なる「新モデル追加」ではない。**Mistral Vibe remote agents**、**Mistral Medium 3.5**、**Le ChatのWork mode** が一体で動くことで、AIコーディングの前提が「手元のIDEで少し補助する」から「クラウド上で長い作業を走らせ、あとでPRを受け取る」へ寄り始めている。

日本の開発チームにとって重要なのは、性能指標そのもの以上に、**どこまで自動で進み、どこで人が承認し、どんな権限が必要か** がかなり具体的に出てきたことだ。公式情報を読む限り、Vibe Code WorkflowはGitHubリポジトリをクラウドsandboxへ複製し、ブランチ作成、コード編集、push、draft PR作成まで進められる。一方で、ローカル端末には触れず、セッション時間やタイムアウトも明示されている。つまり「何でもできる魔法のエージェント」ではなく、**権限境界が見える実務ツール**として整理しやすい。

## 事実: 今回Mistralがまとめて出したもの

まず事実関係を分けると、今回の更新は3層ある。

1つ目が、ニュース記事で発表された**remote agents in Vibe** だ。Mistralは、これまでローカル中心だったコーディングエージェントをクラウドへ移し、並列で走らせられるようにしたと説明している。CLIから `&` を付けてクラウドに送ることも、進行中のローカルセッションを `/teleport` で移すこともできる。

2つ目が、その基盤モデルである**Mistral Medium 3.5** である。公式モデルカードでは、256k context、入力100万トークンあたり1.5ドル、出力100万トークンあたり7.5ドル、AgentsやConversations、Built-In Tools、Structured Outputs、OCR、Batchingまで対応したモデルとして整理されている。ニュース記事では、128B dense modelで、instruction-following、reasoning、codingを一体で扱う「first flagship merged model」と表現され、open weightsをModified MIT licenseで公開するとしている。

3つ目が、Le Chatの**Work mode** だ。これはコーディング専用ではなく、Web検索、Connectors、bash sandbox、Canvasなどを使いながら、複数ステップの業務を1つの会話で最後まで進めるモードである。Mistral Docsでは、メール整理、会議準備、レポート作成、Slack共有のようなクロスツール業務を想定例として挙げている。

要するに、Mistralはモデル1個を出したのではない。**モデル、実行ハーネス、クラウド実行面、業務モード** を同時に出し、「AIエージェントを実運用するならこういう形になる」という製品の塊を提示した。

## 事実: remote agentsとWork modeは似ているようで役割が違う

ここは誤解しやすいが、Vibe remote agentsとLe Chat Work modeは同じではない。

Vibe Code Workflowは、GitHubリポジトリを対象にした**コーディング用の遠隔実行**だ。Docsでは「remote coding agent」「cloud sandbox」「draft pull request」という言い方がはっきり使われている。エージェントはリポジトリをcloneし、ファイルを読み、ブランチを切り、コードを書き換え、必要に応じてcommitしてPRまで作る。

一方Work modeは、Le Chatの中で複数ツールをまたぐ**実行モード**である。こちらはGitHubに限らず、Web検索、コネクタ、Canvas、bash sandboxを組み合わせて、調査、要約、連絡、レポート作成などを進める。Docsでは、敏感な操作の前に明示的な承認を取ること、並列ツール呼び出しを行うこと、モード開始後はFastやThinkへ切り替えられないことが説明されている。

この違いは、日本の開発組織ではかなり大きい。Vibe remote agentsは**開発生産性改善**に向き、Work modeは**周辺業務の自動化**に向く。たとえば、実装とテスト修正はVibe、仕様比較や会議前の情報収集はWork mode、という切り分けが現実的だ。

## 事実: 権限、sandbox、制約がかなり具体的に書かれている

今回の発表が実務向きだと感じる理由は、権限と制約が抽象論で終わっていないからだ。

Vibe Code WorkflowのDocsでは、必要なGitHub権限として `repo`、`read:org`、`write:org`、`workflow`、`read:user`、`user:email` が並んでいる。用途も明確で、clone、commit、push、PR作成、組織内リポジトリ列挙、GitHub Actions workflowの更新などに使うと説明されている。

また、できることとできないことも分かれている。できるのは、認可したGitHubリポジトリのclone、全ファイル読取、ブランチ作成、コード編集、push、draft PR作成まで。できないのは、ローカルマシンやローカルfilesystemへのアクセス、新規リポジトリ作成、未許可リポジトリへのアクセスである。クラウドsandboxはセッション終了時に自動削除される一方、コミットやPRはGitHub側に残る。

セッション制限も具体的だ。最大セッション時間は24時間、ユーザー返信待ちのinactivity timeoutは3時間、個別コマンドのtimeoutは30秒。`/teleport` は一方向で、一度クラウドへ移したらローカルCLIへ戻せない。こうした制約は一見細かいが、日本企業がPoCを回すときにはむしろ重要だ。なぜなら、**情シスやセキュリティ部門は性能より権限境界を先に見る**からである。

## 事実: 価格と開放プランも見えている

価格面も比較的分かりやすい。Medium 3.5のAPI単価は、モデルカードとニュース記事で**入力1.5ドル / 出力7.5ドル**と示されている。Le Chat側のPricingページでは、Proが**14.99ドル/月**、Teamが**24.99ドル/月**と表示され、Proの説明には「Mistral Vibe for all-day coding」が入っている。

ただし、使える範囲は一枚岩ではない。ニュース記事では、remote coding agentsとWork modeはPro、Team、Enterprise plans上で動くと説明される一方、DocsではVibe Code WorkflowはProとTeamsへ段階ロールアウト中のPreview、Work modeはFree、Pro、Teamへ段階ロールアウト中のPreviewとなっている。つまり、「使えるらしい」ではなく、**プランごと・機能ごとにPreviewの開放状況を確認する**必要がある。

## 考察: 日本の開発チームがまず試すべきは何か

ここからは考察だが、日本の開発組織で最初に試すべきなのは、巨大な新規開発ではなく、**既存GitHubリポジトリ上の小さく明確な作業**だと思う。

Docs自身も、Vibe Code Workflowは「well-scoped」なタスクに向くと書いている。バグ修正、既存モジュールへの機能追加、単一ファイルのリファクタ、失敗テストの修復のような仕事である。この前提は妥当で、日本企業の現場でも、いきなり基幹システム全体を任せるより、まずは社内ツール、検証用サービス、テスト補助、ドキュメント生成まわりでROIを測るほうが安全だ。

特にSIerや事業会社の内製チームでは、「人がレビューする前提で、PRの叩き台を量産する」使い方がハマりやすい。remote agentsは、開発者の判断そのものを置き換えるより、**待ち時間の多い下流作業をクラウドへ逃がす** ほうが価値が出やすい。夜間にテスト修正候補を並列で走らせ、朝に差分をレビューする、といった使い方は現実的だ。

## 考察: 逆に、まだ慎重に見るべき点

一方で、すぐ本番運用へ広げるには注意点もある。

1つ目は、Preview前提であることだ。UIや制限、対応プランは今後変わる可能性が高い。2つ目は、sandboxが標準Linux環境なので、GPU依存、ローカルハードウェア依存、社内閉域サービス依存のプロジェクトはそのままでは乗らない。3つ目は、GitHub権限が比較的広いことだ。`workflow` まで含むので、CI変更を許容するのか、どの組織・どのrepoまで開けるのかを先に決めないと運用事故になりやすい。

さらにWork modeとStudio Workflowsを混同しないほうがいい。Work modeはLe Chat内の実行モードで、Docs上でもPreviewではStudio WorkflowsやStudio Agents自体は未対応と書かれている。Mistralが別記事で出したWorkflowsは、Temporalベースの耐障害な業務オーケストレーションであり、よりエンタープライズ寄りの実行基盤だ。**個人や小チームの実験と、全社ワークフローの運用基盤は別レイヤー** と見たほうがよい。

## まとめ

Mistralの今回の更新は、「オープンモデル企業がまた新モデルを出した」という話では終わらない。Vibe remote agentsで**クラウド常駐のコーディング実行面**を作り、Medium 3.5でその中心モデルを用意し、Le Chat Work modeで**コーディング外の実行業務**までつなげてきた。

日本の開発チームとしては、今すぐやることは比較的明確だ。**GitHub連携できる既存repoで、小さな修正タスクからPoCする。権限、タイムアウト、PRレビュー責任を先に決める。Work modeは調査や周辺業務に分けて評価する。** この順番なら、過大期待で失敗しにくい。

## 出典

- [Remote agents in Vibe. Powered by Mistral Medium 3.5.](https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5) - Mistral AI
- [Mistral Medium 3.5](https://docs.mistral.ai/models/model-cards/mistral-medium-3-5-26-04) - Mistral Docs
- [Vibe Code Workflow](https://docs.mistral.ai/le-chat/content-creation/vibe-code-workflow) - Mistral Docs
- [Work mode](https://docs.mistral.ai/le-chat/conversation/work-mode) - Mistral Docs
- [Workflows](https://mistral.ai/news/workflows) - Mistral AI
- [Pricing](https://mistral.ai/pricing) - Mistral AI
