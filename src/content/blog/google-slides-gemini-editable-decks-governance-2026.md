---
title: 'Google Slides Gemini資料生成、提案書統制の実務'
description: 'Google Slides Geminiの複数スライド生成を整理。日本企業が提案書、稟議、研修資料でDrive参照、ブランドテンプレート、承認線、利用上限をどう管理すべきか解説する。'
pubDate: '2026-08-03'
category: 'news'
tags: ['Google Workspace', 'Gemini', 'Google', 'Google Slides', '管理者設定', '業務AI', '日本企業']
series: 'google-workspace-ai-governance-2026'
draft: false
---

Google Workspace Updates は、Gemini in Google Slides で **完全に編集可能な複数スライド資料** を生成できるようになったと発表した。ユーザーは Slides のサイドパネルにプロンプトを入れ、Google Drive の資料を参照元として追加し、既存のプレゼンテーションをスタイル参照に使える。生成物は画像として固まった資料ではなく、通常の Google Slides として編集できる。

この更新は、単なる「AIがスライドを作る」話ではない。日本企業では、提案書、稟議資料、経営会議資料、研修資料、採用説明資料が、意思決定や対外説明の中心にある。Slides の Gemini が Drive の内容を使い、既存デッキの見た目を踏襲し、複数スライドを一度に作るなら、資料作成の初稿工程はかなり変わる。

ただし、同じ series の [Workspace Intelligence の管理者制御](/blog/google-workspace-intelligence-admin-controls-2026/) や [Google Docs Gemini多言語化](/blog/google-docs-gemini-11-languages-governance-2026/) と同じく、便利さだけで全社展開すると危ない。Slides は、文書よりも見た目の説得力が強く、社外にそのまま出やすい。何を参照させ、どのテンプレートへ寄せ、誰が最終確認するかを決める必要がある。

## 事実: 複数スライドを編集可能な資料として作る

Google の発表で確定できる事実は、Gemini in Google Slides がフルの複数スライド資料を生成できるようになったことだ。プロンプトだけで始められるが、既存の Drive ファイルを参照元として追加し、別のプレゼンテーションをスタイル参照にできる。生成前には、トーン、スタイル、内容、対象読者を調整するための質問に答え、アウトラインを編集または承認する流れも示されている。

重要なのは、出力が「編集可能なGoogle Slides」である点だ。AI画像のように文字や図形が固定されるのではなく、テキストボックス、構成、レイアウトを人間が修正できる。これは実務では大きい。AIが作った初稿を、営業、企画、法務、デザイン、経営企画が共同編集の流れに乗せやすくなるからだ。

また、Gemini は関連するファイル、メール、チャットを提案し、ユーザーが選んで追加できると説明されている。これは [Google MeetのAI議事録](/blog/google-meet-take-notes-admin-default-2026/) ともつながる。会議メモ、議事録、過去提案、顧客要望、営業メールが Drive や Workspace 内に残るほど、Slides 生成の材料は増える。

一方で、発表時点ではこの機能は英語のみとされている。日本語の資料作成で即座に完全対応する前提を置くべきではない。日本企業では、英語の海外向け提案、グローバル社内説明、英語版の投資家向け資料、海外拠点の営業資料から試すほうが自然だ。

## 事実: 8月1日までは高い試用上限があった

もう一つの実務上の論点は、利用上限である。Google は、少なくとも 2026年8月1日までは Workspace 顧客に対し、Gemini in Google Slides の複数スライド生成に高いプロモーション上限を提供すると説明した。期間中は試しやすいが、その後はユーザーごとの利用上限が適用され、更新後の上限情報は Help Center で案内される構成だ。

これは、導入判断の締切として読める。7月中に多く試せたからといって、9月以降も同じ回数・同じ使い方で回せるとは限らない。営業部門が毎週の提案書を丸ごと Gemini で作る、研修部門が講座ごとにスライドを量産する、事業企画が会議ごとに複数案を出す、という使い方は、上限やプラン差を見ずに広げると問い合わせや不満につながる。

対象エディションも確認が必要だ。発表では Business Standard / Plus、Enterprise Standard / Plus、Google AI Pro / Ultra、Google AI Pro for Education、AI Expanded Access などが示されている。全社員が Google Workspace を使っていても、全員が同じ Gemini in Slides 体験を使えるわけではない。

管理者向けには「この機能に専用の管理者制御はない」と案内されている。つまり、Slides 生成だけを細かくオフにするのではなく、Gemini for Workspace、Workspace Intelligence、Drive 共有、テンプレート、研修、レビュー手順の組み合わせで管理する必要がある。

## 分析: 日本企業では資料初稿の責任線が変わる

ここからは分析である。

日本企業の資料作成では、見た目と内容が分離しにくい。PowerPoint や Google Slides の資料は、単なる補助資料ではなく、稟議、営業提案、社内承認、役員説明の「議論の型」そのものになりやすい。AIが複数スライドを一度に作ると、構成案、表現、強調点、順番、図解の粒度まで最初から提示される。

これは大きな効率化になる。白紙から始めるのではなく、過去提案、会議メモ、社内資料、FAQを参照して、70点のたたき台を数分で作れる可能性がある。営業企画、CS、採用、人事、研修、PMO、事業開発では、ゼロから資料を組む時間をかなり減らせる。

しかし、資料は自然文よりも「それらしく」見える。見出し、図解、番号、アイコン、ブランド色が整っていると、内容の検証が甘くなりやすい。古い価格表、未承認の導入効果、別顧客向けの事例、社内限定の数値、採用候補者情報が混ざっても、スライドとして完成していれば流通してしまう。

[Google Vids Gemini Omni](/blog/google-vids-gemini-omni-avatar-governance-2026/) で扱った動画AIと同じく、視覚的な成果物は文章よりも印象が強い。Slides は動画ほど強くないが、社内外に配られる資料としては十分に強い。したがって、AI生成の可否だけでなく、公開前レビュー、ブランド確認、数値確認、顧客名の扱いを資料種別ごとに分けるべきだ。

## 実務: 参照ファイルとブランドテンプレートを管理する

最初に決めるべきは、Gemini に参照させてよいファイルである。Drive にあるファイルを参照できるなら、便利さは元データの整理度に依存する。最新の製品資料、承認済み価格表、公開可能な導入事例、公式テンプレートが明確なら、AI資料の品質は上がる。逆に、古い提案書、個人メモ、過去の顧客資料、未公開の戦略資料が混在すると、初稿は危険になる。

次に、スタイル参照に使う既存デッキを決める。営業提案、採用説明、社内研修、役員会、投資家向け説明では、求めるトーンとブランド表現が違う。非公式な過去資料を style reference にすると、古いブランド、古い免責文、古い表記ゆれまで再利用される可能性がある。公式テンプレートを Drive 上で明示し、参照してよいデッキを分けるべきだ。

第三に、アウトライン承認を軽く扱わない。Google の発表では、実際のスライド生成前にアウトラインを編集または承認できるとされている。この段階で、対象読者、目的、除外すべき情報、出典、結論の強さを直すほうが、完成後に全スライドを修正するより安い。

第四に、使用量を部門単位で見る。プロモーション上限中に試した回数、生成したデッキ数、採用されたデッキ数、修正にかかった時間、最終的に使われなかったデッキ数を記録する。AIが大量の資料案を作れても、人間が確認しきれなければ、ボトルネックは作成からレビューへ移るだけである。

## 30日以内の確認事項

1週目は、対象ユーザーとエディションを確認する。Business Standard / Plus、Enterprise Standard / Plus、AI Expanded Access、教育向けアドオンなど、誰が使えるかを一覧化する。英語限定開始のため、日本語資料での期待値も調整する。

2週目は、参照ファイルとテンプレートを棚卸しする。営業、採用、研修、経営企画、広報の代表フォルダを見て、Geminiに使わせてよい資料、使わせたくない資料、古いテンプレートを分ける。Drive共有が広すぎる場合は、資料生成の前に共有権限を直す。

3週目は、代表ユースケースで試験する。顧客提案、社内稟議、研修資料、採用説明、月次報告の5種類程度で、AI生成前の材料、アウトライン、生成後の修正点、誤り、レビュー時間を記録する。評価は見た目ではなく、事実の正確性、使われた資料、不要情報の混入、ブランド適合、最終採用率で見る。

4週目は、短い利用ルールを出す。AIで作ってよい資料、禁止データ、参照してよいテンプレート、顧客配布前の承認者、数値確認の責任者、英語資料のレビュー方法、利用上限後の問い合わせ先を1ページにする。長い生成AIポリシーだけでは、Slidesを使う現場には届きにくい。

## まとめ

Google Slides の Gemini 複数スライド生成は、資料作成の初稿工程を大きく短縮する更新である。Drive の資料を根拠にし、既存デッキの見た目を参照し、編集可能な Slides として出せる点は、営業、企画、研修、採用、経営企画にとって実務価値が高い。

一方で、資料は社内外の意思決定に残る。日本企業は、Gemini in Slides を「便利な資料作成機能」とだけ見ず、参照ファイル、公式テンプレート、アウトライン承認、公開前レビュー、利用上限をセットで管理するべきだ。Workspace AI が文書、会議、動画、スライドへ広がるほど、成果物ごとの責任線が導入品質を分ける。

## 出典

- [Create fully native and editable presentations with Gemini in Google Slides](https://workspaceupdates.googleblog.com/2026/06/create-fully-native-and-editable-presentations-with-Gemini-in-Google-Slides.html) - Google Workspace Updates, 2026年6月29日
- [Generate presentations with Gemini in Google Slides](https://support.google.com/docs/answer/17111393) - Google Slides Help
- [Learn how Gemini in Gmail, Calendar, Chat, Docs, Drive, Sheets, Slides, Meet & Vids protects your data](https://support.google.com/docs/answer/14615114?hl=en) - Google Docs Editors Help
- [What's new in Google Workspace](https://knowledge.workspace.google.com/admin/releases/whats-new) - Google Workspace

