---
title: 'Gemini appデータ地域対応、Workspace統制の要点'
description: 'Gemini appのdata regions対応を整理。日本企業がGoogle Workspaceで生成AIを広げる前に、EU/US保管・処理、OU別設定、対象エディション、監査とデータ主権の確認点を見る。'
pubDate: '2026-06-30'
category: 'news'
tags: ['Google Workspace', 'Gemini', 'Google', '管理者設定', 'データレジデンシー', 'データ主権', 'AIガバナンス']
series: 'google-workspace-ai-governance-2026'
draft: false
---

Google Workspace Updates は 2026年6月29日、**Gemini app が Google Workspace の data regions 設定に対応した**と発表した。管理者は EU storage and processing、US storage and processing、またはその両方を、組織部門、つまり OU レベルまで細かく設定できる。エンドユーザー側に個別設定はなく、管理者の data regionalization 要件に Gemini app が従う形だ。

これは派手な新モデル発表ではない。しかし日本企業の Google Workspace 管理では重要な更新である。[Workspace Intelligence の管理者制御](/blog/google-workspace-intelligence-admin-controls-2026/) で見たように、Google は Gemini を Gmail、Drive、Chat、Docs などの社内文脈へ近づけている。[Workspace Studio の管理者制御](/blog/google-workspace-studio-admin-controls-2026/) では、自動化フローを OU / group や部品単位で制御する話を扱った。今回の data regions 対応は、その上にある「どの地域で保存・処理するか」という基盤の管理線である。

日本企業にとっての読みどころは、Gemini app を全面解禁できるかではない。**本社、海外拠点、教育機関、委託先を含む Workspace tenant で、生成AIの処理地域をどの単位で分けるか**である。

## 事実: Gemini appがdata regionsに従う

Google の発表によると、Gemini app は組織の data regionalization requirements に従うようになった。従来の Workspace data regions と同じ考え方で、管理者は保存と処理の地域を EU、US、または両方として構成できる。さらに、設定は OU レベルまで granular に扱える。

Google は、data regions が顧客の内部要件、法務、規制、データ主権の要求を満たすために重要だと説明している。生成AIの導入では、モデル性能やUIだけでなく、プロンプト、応答、関連データがどこで保存・処理されるかが導入可否を左右する。Gemini app がこの管理対象へ入ったことで、Workspace 管理者は「Gemini だけ別扱い」ではなく、既存の data regions 方針と合わせて考えやすくなる。

ロールアウトは Rapid Release と Scheduled Release の両方で available now とされている。つまり、順次数週間かけて待つタイプの更新ではなく、対象エディションの管理者はすぐ設定確認に進むべき更新である。

## 事実: 対象エディションで保存と処理の差がある

今回の発表で重要なのは、対象エディションによって機能差がある点だ。Google は Enterprise Plus と Frontline Plus では in-region processing and storage capabilities、Education Plus と Education Standard では in-region storage capabilities only と説明している。

つまり、全プランで同じ水準の地域制御が使えるわけではない。日本企業の実務では、ここを読み違えると「欧州拠点にはEU処理まで必要なのに、契約上は保存だけだった」「教育機関の設定は保存に限定される」といった誤解が起きる。

Google Workspace Admin Help の data regions 説明でも、covered data を特定地域、米国または欧州に保存でき、エディションによって processing の扱いが変わるとされている。別の Help ページでは、Google Workspace with Gemini の prompts and responses が data regions の covered data に含まれる一方、過去の記述では Gemini Workspace integrations と Gemini app の扱いを分けている。今回の Workspace Updates は、その Gemini app 側を data regionalization の対象へ拡張した更新として読むべきだ。

## 分析: 日本企業ではOU設計が主戦場になる

ここからは分析だ。

日本企業でこの更新が効くのは、単純に「日本リージョンができた」からではない。今回の選択肢は公式発表上 EU と US であり、日本国内処理を約束するものではない。それでも重要なのは、グローバル企業や学校法人、外資系日本法人、欧州顧客を持つ SaaS 企業が、Gemini app の利用を地域要件に合わせて分けやすくなる点である。

特に OU 設計が重要になる。日本本社、EU 拠点、米国拠点、研究開発、法務、人事、教育部門、委託先アカウントを同じ設定にすると、過不足が出やすい。EU 拠点には欧州処理、米国拠点には米国処理、本社の一般部門は No preference または標準設定、機密部門は Gemini app の利用範囲自体を絞る、といった設計が必要になる。

ここは [Gemini数式修正のSheets運用](/blog/google-sheets-gemini-formula-fix-2026/) ともつながる。現場の便利機能は、使い始めると自然に広がる。数式修正、文書生成、会話、検索、Canvas、Workspace Studio の自動化が同じ Workspace tenant に入ると、管理者が後から「どのデータがどこで処理されたか」を説明するのは難しくなる。data regions は、便利機能を止めるためではなく、広げる前に説明可能な境界を作るための設定である。

## Workspace AIガバナンスとの接続

第一に、data regions は Gemini の権限管理を置き換えない。ユーザーが見られる Drive ファイル、Gmail、Docs、Sheets、Chat の範囲は、共有設定、グループ、アプリ別管理、Workspace Intelligence の設定で決まる。data regions は、そのデータがどこで保存・処理されるかの管理であり、閲覧権限そのものではない。

第二に、Gemini app の地域制御は、AI機能の利用可否と分けて台帳化するべきだ。たとえば、OU ごとに「Gemini app 利用可否」「Workspace Intelligence のデータソース」「Workspace Studio のステップ」「Gemini in Sheets」「data region at rest」「data processing」を別列で持つ。これにより、法務やセキュリティが見たい地域制御と、現場が見たい機能解放を混同しにくくなる。

第三に、海外拠点と日本本社のルール差を明文化する。欧州の従業員や顧客データを扱う部門では、EU data regions の要件が強くなることがある。一方、日本国内の顧客契約では、国内保管や国外移転説明が論点になる。今回の更新は日本リージョンではないため、「EU/USに寄せれば日本のデータ主権が解決する」とは言えない。日本側の契約、個人情報保護、委託先条件を別に確認する必要がある。

## 30日点検リスト

最初の1週間は、現在の data regions 設定を棚卸しする。どの OU と group に United States、Europe、No preference が設定されているか、処理まで含めているか、対象エディションが条件を満たすかを確認する。

2週目は、Gemini app と Workspace 内 Gemini 機能を分けて確認する。Gemini app、Gemini in Gmail、Docs、Sheets、Drive、Chat、Workspace Studio は利用面が違う。data regions が効く対象と、アプリ別のアクセス制御を同じ表にまとめる。

3週目は、データ分類と地域要件を合わせる。個人情報、顧客秘密、契約書、教育データ、開発情報、営業資料で、EU/US処理の可否や説明要件が違う。部門ごとに許可する Gemini 利用と、必要な data region を整理する。

4週目は、利用者向けの説明を作る。エンドユーザーには個別設定がないため、「なぜ自分の Gemini app では一部機能が違うのか」「海外拠点と日本本社でなぜ設定が違うのか」を管理者が説明できる必要がある。問い合わせ対応のため、対象エディション、OU、group、data region、Gemini app の利用可否を確認する手順を runbook にする。

## まとめ

Gemini app の data regions 対応は、Google Workspace の生成AIを企業で広げるための管理基盤の更新である。Enterprise Plus と Frontline Plus では in-region processing and storage、Education Plus / Standard では storage only という差があり、OU レベルで設定できる。

日本企業は、これを「Geminiを安全にする単独機能」と見ないほうがよい。data regions は、権限管理、アプリ別Gemini設定、Workspace Intelligence、Workspace Studio、監査ログ、契約上のデータ所在地説明と組み合わせて初めて意味を持つ。生成AIを現場に広げる前に、OU と group の境界、地域要件、対象エディションを確認することが今回の実務ポイントである。

## 出典

- [Data regions support for the Gemini app now available](https://workspaceupdates.googleblog.com/2026/06/gemini-app-data-regions-support.html) - Google Workspace Updates, 2026-06-29
- [Choose a geographic location for your data](https://knowledge.workspace.google.com/admin/compliance/choose-a-geographic-location-for-your-data) - Google Workspace Admin Help
- [Data covered by data regions](https://knowledge.workspace.google.com/admin/compliance/data-covered-by-data-regions) - Google Workspace Admin Help
