---
article: 'google-sheets-fill-gemini-languages-governance-2026'
level: 'expert'
---

Google SheetsのFill with Gemini多言語拡大は、単なる対応言語追加ではない。Google Workspace上のAI functionが、現場の表計算プロセスへより深く入り込む更新である。2026年7月8日のGoogle Workspace Updatesは、Fill with GeminiとAI function in Sheetsが新たに11言語へ広がると発表した。日本語はすでに対応済みで、今回加わるのはMandarin、Dutch、Malay、Hebrew、Polish、Turkish、Czech、Indonesian、Swedish、Danish、Norwegianである。

日本企業の文脈では、これは「日本語で使えるようになった」という話ではない。日本本社、海外子会社、BPO、グローバル営業、CS、経理、人事が同じGoogle Sheetsを使い、複数言語の自由記述、商品情報、問い合わせ分類を扱う時の運用設計の話である。以前の[Gemini数式修正、Google Sheets運用の管理線](/blog/google-sheets-gemini-formula-fix-2026/)は、数式エラー対応の現場展開を扱った。今回のFill with Geminiは、セルに値を生成し、分類し、要約し、業務判断の前処理を担うところまで踏み込む。

この更新は、[Workspace Intelligenceの管理者制御](/blog/google-workspace-intelligence-admin-controls-2026/)や[Workspace Studioの管理者制御](/blog/google-workspace-studio-admin-controls-2026/)と同じ流れにある。Google WorkspaceのAIは、個別アプリの文章支援から、社内文脈、表計算、ワークフロー、自動化へ広がっている。Sheetsはその中でも、現場担当者が最も抵抗なくAIを使い始める入口になりやすい。

## 事実整理: 7月更新で変わった範囲

Google Workspace Updatesによると、Fill with Geminiは、Google SheetsのAI functionを使ってデータ準備や手入力を簡単にする機能である。生成テキスト、要約、分類、感情分析などを、選択したセルへ直接表示できる。7月更新では、これらの機能が11言語へ追加で展開される。

ロールアウトはRapid ReleaseとScheduled Releaseの両方を対象に、2026年7月7日から最大15日かけて進む。これは、通常のWorkspace更新と同様、管理者やユーザーが同じ日に同じ見え方になるとは限らないことを意味する。特に日本企業で複数ドメインや海外拠点を持つ場合、問い合わせ対応では「展開中なのか、設定で止まっているのか、ライセンス対象外なのか」を分けて確認する必要がある。

対象はBusiness Standard / Plus、Enterprise Standard / Plus、Google AI Pro / Ultra、Google AI Pro for Education、AI Expanded Accessである。さらに、2026年7月15日から、AI Expanded AccessライセンスのユーザーはFill with GeminiとAI function in Sheetsの利用上限が高くなると説明されている。

この上限の話は重要である。AI機能の業務利用では、「誰が使えるか」だけでなく「誰が多く使えるか」が運用を左右する。上限の高い少数ユーザーに表処理が集中すれば、短期的には便利でも、権限と作業負荷が偏る。部署の標準業務として使うなら、利用上限と担当分担を同時に設計したい。

## 4月発表との差分

2026年4月22日の初回発表では、Fill with Geminiは、Google Sheetsで手入力を減らすAI-powered featureとして説明されていた。ドラッグ操作で既存列の文脈を読み取り、空欄を埋める。複数セルを選択して、プロンプトにもとづき範囲を埋める。顧客フィードバックへの返信案や商品情報の補完など、現場業務に近い例が示されていた。

4月時点の焦点は、機能そのものとロールアウトだった。Rapid Releaseは4月22日から、Scheduled Releaseは5月6日から段階展開とされ、プロモーション期間中はAI function in Sheetsの高い利用枠も案内されていた。

7月更新の焦点は、利用面の拡張である。英語、日本語、韓国語、欧州主要言語などに加えて、アジア、欧州、中東、北欧の言語が追加された。日本企業にとっては、国内利用の有無よりも、海外拠点や現地語データを扱う部門で、同じSheets運用にAI補助を入れやすくなる点が大きい。

たとえば、インドネシア語の問い合わせを分類する拠点、マレー語の商品説明を整えるECチーム、ポーランド語やオランダ語のパートナーメモを整理する欧州営業、ヘブライ語やトルコ語の調査データを要約するチームがある。これまでは英語へ翻訳してから作業していたものを、初期処理だけでも現地語で進められる可能性がある。

## Smart featuresは軽視できない管理点

Googleの7月発表は、Fill with GeminiがSmart features for Google Workspace設定に依存すると明記している。管理者がSmart featuresを無効にしていれば、Fill with Geminiは非表示になる。エンドユーザー側でもWorkspace smart featuresが有効である必要がある。

この依存関係は、導入問い合わせで混乱しやすい。Geminiライセンスがある。Google Sheetsは使える。AI functionの話も聞いた。だが、Fill with Geminiの入口が見えない。この場合、原因はライセンス、Smart features、Workspace内Gemini機能へのアクセス、ロールアウト段階、ユーザー側設定、ブラウザやアカウントの切り替えなど複数あり得る。

管理者は、Fill with Geminiを単独機能として案内するより、WorkspaceのAI設定表の一行として管理したほうがよい。OU、group、エディション、Smart features、Gemini in Workspace services、AI Expanded Access、データ分類、対象言語、利用上限を同じ表に置く。これにより、現場への説明がかなり楽になる。

[Connected Sheetsの異常検知](/blog/google-connected-sheets-anomaly-detection-2026/)でも同じ問題がある。SheetsのAI機能は、表の中に現れるため、現場には「普通のSheets機能」に見える。しかし実際には、WorkspaceのAI設定、データアクセス、分析結果の責任、利用量管理が絡む。表計算画面の中にあるからといって、管理不要ではない。

## 表計算AIのリスクは「生成」より「運用転用」にある

ここからは分析である。

Fill with Geminiのリスクは、AIが文章を生成することだけではない。生成結果がそのまま業務列になり、後続の判断、集計、通知、報告、KPI、顧客対応へ転用される点にある。たとえば、顧客コメントから「解約リスク高」を分類し、その列をもとに営業が優先対応する。サポート問い合わせを「障害」「要望」「契約」と分類し、担当キューに流す。アンケート自由記述を感情分析し、経営会議資料に使う。これは単なる入力補助ではなく、意思決定の前処理である。

したがって、重要な表では、元データ、AI提案、確定値を分けるべきだ。AI提案を既存列へ直接上書きすると、あとから元データとの差分や人間の判断を追えない。特に顧客対応、人事、評価、財務、契約、障害対応に関わる表では、AI生成列を独立させ、確定列には人間の確認者と確認日を残す運用が現実的である。

もう一つのリスクは、多言語対応による心理的なハードル低下である。現地語で使えると、現場はすぐに試せる。これは良いことだが、同時に管理者が気づかないまま高リスク表に広がる可能性がある。海外拠点ほど本社のAI利用規程が届きにくく、BPOや委託先ではGoogle Workspaceアカウントの権限境界も複雑になりやすい。

多言語の分類では、文化的な表現差にも注意がいる。皮肉、遠回しな不満、敬語、ローカルな商品名、略語、絵文字、混在言語のコメントは、単純なカテゴリ分類で誤りやすい。AIが便利だからといって、最初から顧客対応の自動振り分けへ直結させるべきではない。まずは人間レビュー付きの下書き列として使うのが妥当である。

## 日本企業が設計すべき管理線

第一に、データ分類ごとの利用可否を決める。公開情報、社内一般情報、顧客対応情報、個人情報、財務・人事・契約情報、秘密プロジェクト情報で扱いを分ける。Fill with GeminiはGoogle Workspace内の機能だが、AI処理に渡してよいデータかどうかは、企業のデータ分類で判断する必要がある。

第二に、AI生成列の標準を決める。`ai_suggested_category`、`ai_summary`、`human_confirmed_category`、`reviewer`、`reviewed_at`のような列を標準化するだけでも、後続の監査と品質確認がしやすい。AIの出力をそのまま正式列にしないというルールは、表計算AIの初期統制として効果が高い。

第三に、利用上限とライセンスを運用表に入れる。AI Expanded Accessの上限が上がるなら、どのユーザーが高上限を持つかを可視化する。高上限ユーザーが部署のAI処理を代行するなら、権限、レビュー、作業依頼、ログ、退職・異動時の引き継ぎまで考える必要がある。

第四に、海外拠点と同じルールを共有する。日本語の社内規程だけでは、多言語展開に追いつかない。英語版の短い利用ガイド、禁止データ例、レビュー列のテンプレート、問い合わせ先を用意する。各国の法務判断は別途必要だが、表計算AIの使い方そのものは共通化できる。

第五に、Workspace管理者と業務部門の分担を決める。管理者はSmart features、Geminiアクセス、ライセンス、OU/group設定を管理する。業務部門は対象表、レビュー責任、カテゴリ定義、品質基準を持つ。どちらか一方だけでは、AI機能は「使えるが責任者がいない」状態になりやすい。

## 30日以内の検証手順

最初の1週間は、設定棚卸しである。Business Standard / Plus、Enterprise Standard / Plus、Google AI Pro for Education、AI Expanded Accessの割り当てを確認する。Smart featuresとGemini in Workspace servicesの状態をOU/group単位で見る。Rapid ReleaseとScheduled Releaseの差も記録する。

2週目は、低リスク表で検証する。架空または匿名化した問い合わせ、商品説明、社内FAQ、イベント参加者コメントなどを使い、Fill with Geminiで分類、要約、返信案、感情分析を試す。元データ、AI提案、人間確定の列を分け、どれくらい修正が必要かを測る。

3週目は、多言語検証を行う。対象になった言語を扱う拠点に、実データに近いサンプルを用意してもらう。単に「動くか」ではなく、カテゴリ定義が現地語で自然か、誤分類が業務上許容できるか、人間レビューにどれくらい時間がかかるかを見る。

4週目は、ルールを作る。使ってよい表、禁止する表、人間レビューが必要な用途、AI生成列の命名、確定列の運用、版履歴、利用上限に達した場合の代替手順、問い合わせ先をまとめる。ルールは長い規程ではなく、表を使う担当者がすぐ読める形式がよい。

## 既存のWorkspace AI管理と接続する

Fill with Geminiだけを別管理にすると、あとで破綻する。Workspace Intelligenceは社内文脈の扱い、Workspace Studioは自動化フロー、Connected Sheetsは分析、Sheetsの数式修正は品質支援、Fill with Geminiは入力補完である。利用者から見るとすべてGoogle Workspace上のGeminiだが、管理者から見るとリスクと責任が違う。

そのため、Google Workspace AIガバナンスの台帳には、少なくともサービス名、対象部門、データ分類、Smart features依存、Geminiアクセス、利用上限、監査ログ、レビュー責任、禁止用途を並べたい。機能ごとに別々のFAQを作るより、同じ軸で整理したほうが説明しやすい。

特にSheetsは、業務データが集まりやすい。DWHやCRMからエクスポートしたCSV、問い合わせフォームの回答、営業進捗、採用候補者リスト、予算管理表が置かれる。AI補助が入ると、手作業は減るが、誤った補完や分類がそのまま下流へ流れる可能性もある。表計算AIは「低リスクな便利機能」と決めつけないほうがよい。

## まとめ

Fill with Gemini in Sheetsの11言語追加は、日本語対応のニュースではなく、多国籍の表計算業務へAI functionを広げる更新である。日本企業にとっては、海外子会社、BPO、営業、CS、経理、人事が扱う多言語データの分類、要約、入力補完に関係する。

ただし、導入判断は機能の便利さだけで決めない。Smart features、対象エディション、AI Expanded Accessの利用上限、データ分類、レビュー列、海外拠点向けガイドを同時に設計する必要がある。

Google WorkspaceのAI機能は、もはや個人の文章支援だけではない。Sheetsのセル入力、Connected Sheetsの分析、Workspace Studioの自動化、Workspace Intelligenceの文脈共有がつながると、AIは日常業務の実行面になる。Fill with Geminiは小さなセル補完に見えるが、表計算が業務の中心に残る日本企業では、早めに管理線を引く価値がある。

## 出典

- [Fill with Gemini in Sheets now available in 11 additional languages](https://workspaceupdates.googleblog.com/2026/07/fill-with-gemini-in-sheets-now-available-in-11-additional-languages.html?m=1) - Google Workspace Updates, 2026-07-08
- [Effortlessly automate data entry in Google Sheets using Fill with Gemini](https://workspaceupdates.googleblog.com/2026/04/effortlessly-automate-data-entry-in-Google-Sheets-using-Fill-with-Gemini.html) - Google Workspace Updates, 2026-04-22
- [Google Workspace with Gemini](https://knowledge.workspace.google.com/admin/generative-ai/workspace-with-gemini) - Google Workspace Help, accessed 2026-07-09
- [What's new in Google Workspace](https://knowledge.workspace.google.com/admin/releases/whats-new) - Google Workspace Help, accessed 2026-07-09
