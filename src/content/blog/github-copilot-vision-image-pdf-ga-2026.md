---
title: 'GitHub Copilot vision一般提供、画像・PDF統制の実務'
description: 'GitHub Copilot visionが全プランで一般提供となり、VS Code、Web、CLIで画像・PDF添付が既定有効に。日本の開発組織が24時間保持、機密情報、モデル差、レビュー手順をどう管理するか整理します。'
pubDate: '2026-07-02'
category: 'news'
tags: ['GitHub Copilot', 'VS Code', 'マルチモーダル', '開発者ツール', '情報セキュリティ', '管理者設定', '日本企業']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年7月1日**、画像やPDFをコードの文脈と一緒に扱う**GitHub Copilot vision**を一般提供した。VS CodeのCopilot Chat、github.com上のCopilot Chat、GitHub Copilot CLIで利用でき、FreeからEnterpriseまで全Copilotプランが対象となる。

今回の重要点は、単に「スクリーンショットを読める」ことではない。BusinessとEnterpriseで従来必要だったEditor Preview Featuresポリシーが不要になり、visionが**既定で利用可能**になったことだ。GitHubは同プランの画像・PDF添付をサービス提供のため約24時間保持すると説明している。管理者が機能を有効にしてから試す段階ではなく、現場が何を添付してよいかを先に決める段階へ移った。

日本の開発組織では、[Copilotのplugin配布を制御する設定](/blog/github-copilot-strict-marketplaces-plugin-controls-2026/)や[code reviewの組織ポリシー](/blog/github-copilot-code-review-org-controls-2026/)と同じく、利用可能であることと業務データを入力してよいことを分けて考える必要がある。本稿では公式情報で確認できる事実と、導入時の分析・提案を分けて整理する。

## 事実: 画像とPDFを3つの利用面で扱える

GitHub Changelogによると、Copilot visionで添付できる画像形式はJPEG、PNG、GIF、WebPで、文書はPDFに対応する。利用面は次の三つである。

- **VS Code**: Copilot Chatへ貼り付け、ドラッグ&ドロップ、または右クリックで添付できる。ask、plan、agentの各モードで使える
- **github.com**: Web上のCopilot Chatへ画像とPDFを直接添付できる
- **Copilot CLI**: terminalから画像fileのpathを指定して扱える

同じvisionでも、適した仕事は少し異なる。VS Codeは、実装中のUIモック、error画面、flowchartを開いてコード変更へつなげやすい。github.comは、IssueやPull Requestを確認しながら設計PDFや画面を説明させる入口になる。CLIは、保存済みのtest screenshotや監視dashboardの画像を、scriptやrepository調査と組み合わせる場面に向く。

ただし、Copilot Chatへ画像を渡せば、画像内の情報が必ず正しく読み取られるわけではない。GitHub Docsは、Copilot Chatの出力を利用者が確認・検証する責任を明記している。小さな文字、低解像度、複雑な表、似た色、画面外の状態、PDF内の注記などは見落としや誤解が起き得る。visionは入力経路の拡張であり、仕様書の正解判定機能ではない。

## 事実: 全プランで既定有効になり、約24時間保持される

一般提供の対象はCopilot Free、Pro、Pro+、Business、Enterpriseである。GitHubは、機能を有効にするためのポリシー変更や管理者操作は不要と説明している。BusinessとEnterpriseでは、preview時に必要だったEditor Preview Features設定が不要になり、visionは全員に対して既定で利用可能になった。

この変更には運用上の非対称性がある。現場はすぐ使えるが、管理者がvisionだけを個別に承認して段階展開する手順は、今回の案内では示されていない。少なくとも公開時点では、「管理画面で有効にするまで誰も使えない」と期待してはいけない。

またGitHubは、Copilot BusinessとEnterpriseの利用者が添付した画像・PDFを、サービス提供のため**約24時間保持**するとChangelogに記載している。これは「24時間なら何を入れても安全」という意味ではない。保持期間はデータ分類、契約、保存場所、処理目的、アクセス制御、社内規程のうち一要素にすぎない。

たとえば、顧客の氏名や住所が映った管理画面、未公開製品の設計図、脆弱性の再現画面、契約書、医療・金融情報を含むPDFは、短時間の保持でも入力可否を別途判断すべきである。GitHubが明記した保持期間と、自社がその情報を外部SaaSへ送信できるかは別の問いだ。

## 分析: 日本企業は「画像もprompt」として分類する

ここからは分析である。

vision導入で最初に変えるべきものは、Copilotの操作マニュアルではなく、入力データの定義だ。多くの社内ルールは「source codeや個人情報を生成AIへ貼り付けない」と書く一方、screenshot、diagram、PDF、scan文書を明示していない。利用者は、画像なら文字列promptとは違うと考えやすい。

しかし、画像内には文字、URL、access token、顧客情報、repository名、社内host名、未公開UI、売上数値、構成図が含まれる。PDFには本文だけでなく、author名、comment、変更履歴、埋め込み画像が残る場合もある。運用上は、**添付file全体をpromptの一部**として扱うべきだ。

最小限の分類は、次の四段階にすると現場へ説明しやすい。

| 分類 | 例 | Copilot visionへの入力 |
|---|---|---|
| 公開 | 公開済みWeb画面、公開document、OSSのdiagram | 原則可 |
| 社内 | 社内向けmock、一般的なarchitecture図 | 契約・社内規程の範囲で可 |
| 機密 | 未公開機能、顧客環境、security finding | 承認済み用途だけに限定 |
| 禁止 | secret、認証情報、規制対象の個人情報 | 入力不可 |

分類だけでは足りない。画像を添付する前に、通知、user名、token、URL parameter、browser tab、background windowを切り取る手順も必要だ。PDFは必要なpageだけを別fileへ出し、commentやmetadataも確認する。redaction用の黒塗りが画像として固定されているか、単に上へ図形を重ねただけではないかも確認する。

## 分析: 3つの利用面ごとに許可用途を変える

visionがVS Code、Web、CLIへ同時に広がったからといって、すべて同じ規則にする必要はない。

VS Codeでは、UI mockからcomponentの骨格を作る、error screenshotと該当codeを並べて原因候補を出す、flowchartからtest caseを列挙するといった使い方が現実的だ。ただしagent modeへ渡す場合、画像の解釈がそのままfile変更へつながる。最初はaskまたはplanで読み取り結果を文章化し、人が確認してからagent modeへ進める二段階が安全である。

github.comでは、IssueやPRの文脈と添付資料を横断しやすい。その反面、別repositoryや別顧客の画面を誤って添付しないよう、作業対象を確認する必要がある。[Copilot code reviewの組織統制](/blog/github-copilot-code-review-org-controls-2026/)でレビュー対象と責任者を決めるのと同様に、visionの分析結果をPRの承認根拠そのものにしない。元のacceptance criteria、実機確認、automated testを残す。

CLIでは、file pathを明示できるため、test runnerが生成したscreenshotを解析させるworkflowを作りやすい。一方で、directoryを誤ると別環境の画像を渡す危険がある。無人化するなら、許可directory、file extension、最大size、生成元job、保存期間をwrapper側で制限する。[Copilot CLIのsession上限](/blog/github-copilot-cli-ai-credit-session-limits-2026/)と組み合わせても、費用上限はデータ漏えい防止にはならない。creditと入力データのguardrailは別々に実装する。

## 実務で価値が出やすい3つのシナリオ

第一は、**UI mockから実装候補を作る作業**である。design画像を渡し、「画面を再現して」だけではなく、既存component、design token、responsive breakpoint、accessibility要件もpromptへ含める。Copilotには、最初に画面領域、interaction、状態、未確定点を列挙させる。その結果をdesignerとengineerが確認してからcomponentを作る。

評価指標は、見た目の近さだけではない。semantic HTML、keyboard操作、contrast、loading / error / empty state、mobile layout、既存design systemの再利用率を見る。visionはpixelから要件を推測できるが、画像に写っていない動作やaccessibilityは別途指定が必要だ。

第二は、**障害画面の一次切り分け**である。error dialog、log viewer、monitoring graphのscreenshotを、該当commitやrunbookと一緒に読ませる。ここでは「原因を断定して」ではなく、「画像から確認できる事実」「推測」「追加で必要なlog」を分けて出させる。時刻、timezone、environment、request IDを文章でも渡すと、画像だけに依存しにくい。

第三は、**設計PDFの実装分解**である。公開仕様や入力許可済みの設計書から、component、API、data model、test観点を抽出する。ただし長いPDFは、対象pageと質問を絞る。表や図の読み違いを防ぐため、重要な数値・条件は原文pageと照合し、抽出結果にpage番号を付けさせる。

いずれも、入力を増やすほど回答が正確になるとは限らない。画像、PDF、repository context、Web検索を一度に積み上げると、どの情報を根拠にしたか追いにくくなる。1 task 1目的とし、出力formatを固定し、重要判断は一次資料へ戻る。

## 導入前に決める6項目

日本の開発組織がpilot前に決めるべき項目は次の六つである。

1. **入力可能な情報分類**: screenshotとPDFをpromptに含め、具体例を示す
2. **redaction手順**: secret、個人情報、顧客名、内部URL、通知を除去する
3. **許可用途**: mock実装、障害調査、設計分解など、最初の用途を限定する
4. **検証方法**: 読み取り結果、生成code、test、実機差分を誰が確認するか決める
5. **記録**: task ID、対象repository、添付分類、reviewer、採否を残す
6. **incident対応**: 誤添付時の報告先、session停止、file削除、社内連絡を定める

特に重要なのは誤添付時のrunbookだ。約24時間保持という情報だけを頼りに放置せず、何を、いつ、どのplanで、どの画面から送ったかを確認し、security・privacy担当へ連絡できるようにする。GitHub Supportへの問い合わせや契約上の対応が必要かは、自社の契約と情報分類に基づいて判断する。

pilotは2〜4週間、公開情報か低機密の社内mockに限定するとよい。UI task、障害調査、PDF分解を各10件程度試し、完了時間、手戻り、誤読、review時間、採用率を記録する。利用回数だけでは、visionが価値を生んだのか、単に新機能を試したのか判別できない。

## まとめ

GitHub Copilot visionの一般提供により、画像とPDFをVS Code、github.com、Copilot CLIからコード文脈へ持ち込めるようになった。全Copilotプランが対象で、Business / Enterpriseでも追加ポリシーなしに既定で利用可能となる。GitHubは同プランの添付を約24時間保持すると説明している。

日本企業が今すぐ行うべきことは、全社禁止か全面解禁かを選ぶことではない。画像・PDFもpromptとして分類し、redaction、許可用途、検証、記録、誤添付対応を定めることだ。UI mock、障害画面、設計資料は有力な利用場面だが、visionの読み取りは事実確認やtestを代替しない。

既定有効化で問われるのは、機能を見つけられるかではなく、見えない情報を含む添付を予測可能に扱えるかである。小さなpilotから誤読率とreview負荷を測り、利用面ごとのguardrailを整えるのが現実的な導入順序になる。

## 出典

- [Copilot vision is generally available](https://github.blog/changelog/2026-07-01-copilot-vision-is-generally-available/) - GitHub Changelog, 2026-07-01
- [Asking GitHub Copilot questions in your IDE](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide) - GitHub Docs, accessed 2026-07-02
- [Responsible use of GitHub Copilot Chat in GitHub](https://docs.github.com/en/copilot/responsible-use/chat-in-github) - GitHub Docs, accessed 2026-07-02
