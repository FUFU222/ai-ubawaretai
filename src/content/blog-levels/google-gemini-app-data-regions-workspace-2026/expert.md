---
article: 'google-gemini-app-data-regions-workspace-2026'
level: 'expert'
---

Gemini app の data regions 対応は、Google Workspace の生成AI統制における欠けていた管理線を一つ埋める更新である。Google Workspace Updates は 2026年6月29日、Gemini app が組織の data regionalization requirements に従うようになり、管理者が EU storage and processing、US storage and processing、またはその両方を設定できると発表した。設定は OU レベルまで granular に扱える。エンドユーザー設定はない。

この更新を単体で読むと、コンプライアンス機能の小さな拡張に見える。しかし、[Workspace Intelligence の管理者制御](/blog/google-workspace-intelligence-admin-controls-2026/) 以降、Google Workspace の Gemini は社内文脈を理解し、Gmail、Drive、Docs、Sheets、Chat の近くで働く方向へ進んでいる。[Workspace Studio の管理者制御](/blog/google-workspace-studio-admin-controls-2026/) では、AIを含む業務自動化のステップを管理者がどう開くかが論点だった。Gemini app の data regions 対応は、それらの機能を広げる前に、処理・保存地域を説明可能にするための基盤である。

## 公式情報で確定できる境界

Google の発表で確定できるのは、Gemini app が組織の data regionalization requirements に従うこと、EU と US の保存・処理を管理できること、OU レベルまで設定できること、エンドユーザー設定はないこと、Rapid Release / Scheduled Release の両方で available now であることだ。

利用可能エディションにも明確な差がある。Enterprise Plus と Frontline Plus は in-region processing and storage capabilities を持つ。一方、Education Plus と Education Standard は in-region storage capabilities only とされている。この差は実務上かなり大きい。保存場所だけで足りる要件と、処理場所まで縛る要件は別物だからだ。

Google Workspace Admin Help の data regions 説明では、covered Google Workspace data を United States または Europe に保存できると説明している。処理まで含めるかはエディションに依存する。また、Data covered by data regions では Google Workspace with Gemini の prompts and responses が covered data として示されている一方、従来の注記では Gemini Workspace integrations と Gemini app を分けていた。今回の Workspace Updates は、その Gemini app 側が data regions 対応へ進んだことを告知するものとして扱うのが自然だ。

## data regionsはアクセス制御ではない

最初に切り分けるべきなのは、data regions とアクセス制御の違いである。data regions は、対象データがどこに保存され、どこで処理されるかを管理する機能であり、ユーザーがどのファイルを見られるかを直接決める機能ではない。

ユーザーの閲覧権限は、Drive の共有、Google Groups、OU、アプリ別の Gemini 設定、Workspace Intelligence のデータソース設定、サービス単位の on / off で決まる。data regions は、その権限で利用される対象データの所在地や処理地域に関する管理である。

この違いを混同すると、誤った説明になる。たとえば、EU data region を選んでも、ユーザーが本来見られる広い Drive ファイルが自動的に狭まるわけではない。逆に、Gemini app を一部 OU で無効にしても、既存 Workspace データの保存地域ポリシーが不要になるわけではない。

日本企業では、管理台帳を少なくとも次の列に分けるべきだ。

- OU / group
- Gemini app の利用可否
- Gemini in Workspace services の利用可否
- Workspace Intelligence のデータソース
- Workspace Studio のステップ・スターター
- data at rest region
- data processing region
- 対象エディションと処理対応可否
- 監査・法務上の説明責任者

この粒度がないと、法務は地域制御を見たいのに、現場は機能利用だけを見ている、というズレが起きる。

## 日本企業で効くシナリオ

第一のシナリオは、欧州拠点や欧州顧客を持つ企業である。GDPR そのものの法的評価は個別に必要だが、少なくとも管理者が Gemini app の保存・処理を Europe に寄せられることは、導入説明の材料になる。EU 拠点だけ Europe、米国拠点だけ United States、日本本社は別方針という OU 設計がしやすくなる。

第二のシナリオは、教育機関である。Education Plus と Education Standard では storage only とされているため、処理まで地域内に固定したい要件がある場合は、契約条件と期待値を分ける必要がある。教育データは生徒・学生情報を含むことがあるため、「data regions対応」とだけ説明せず、保存と処理の差を明記するべきだ。

第三のシナリオは、委託先や子会社を同じ Workspace tenant で管理している企業である。委託先 OU に Gemini app を許可するか、許可するなら地域をどこへ寄せるか、委託契約上の国外処理説明をどうするかを整理しやすくなる。一方で、委託先の閲覧権限が広ければ、data regions だけでは情報アクセスの問題は解決しない。

第四のシナリオは、生成AI推進部門と情シス・法務の合意形成である。[Gemini数式修正のSheets運用](/blog/google-sheets-gemini-formula-fix-2026/) のように、現場機能は静かに広がる。Gemini app は会話UIとして入り口になりやすい。data regions は、推進部門が「全社で使いたい」と言う前に、情シスが最低限の境界を置くための材料になる。

## 既存Google Workspace AI設定との関係

Workspace Intelligence は、Workspace 内の文脈を Gemini の出力に活用する基盤である。管理者はデータソース単位、OU / group 単位で制御できる。data regions は、そのように参照されるデータや Gemini のやり取りが、どの地域要件に従うかという別レイヤーにある。

Workspace Studio は、業務自動化フローのスターターやステップを管理する。ここでは、何を起動できるか、どの Workspace サービスへ書けるか、外部連携を許すかが論点になる。data regions は、Studio の自動化そのものの許可を決めるものではないが、Studio で Gemini や Workspace データを扱う場合の地域説明に関係する。

Gemini in Sheets のようなアプリ内機能は、現場の業務データに直接触れる。数式修正、要約、分類、文章生成は便利だが、データ分類と地域処理の説明が必要になることがある。Gemini app の data regions 対応は、アプリ内 Gemini と Gemini app の境界を棚卸しするきっかけにもなる。

Google Gemini Enterprise や Google Cloud 側の agent platform とは、さらに別の契約・設定が絡む。[Gemini Enterprise agent platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) で扱ったように、Cloud / Workspace / app の境界は製品として近づいているが、管理面では同じではない。Workspace data regions を設定したから、Cloud 側の agent や外部連携まで同じ条件になるとは限らない。

## 30日点検計画

Day 1 から 5 は、現在の Workspace 契約と OU / group 構造を確認する。Enterprise Plus、Frontline Plus、Education Plus、Education Standard のどれに該当するか、保存だけか処理まで含むかを表にする。対象外エディションのユーザーが同じ OU に混ざっていないかも確認する。

Day 6 から 10 は、data regions の現在値を棚卸しする。United States、Europe、No preference がどの OU / group に設定されているか、processing を含めているか、group 設定が OU 設定を上書きしていないかを確認する。

Day 11 から 15 は、Gemini 利用面を棚卸しする。Gemini app、Gemini in Gmail、Docs、Sheets、Drive、Chat、Workspace Studio、Workspace Intelligence の設定を同じ表に入れる。管理者が意図せず Gemini app だけ別扱いになっていないかを見る。

Day 16 から 20 は、データ分類と地域要件を合わせる。個人情報、顧客秘密、教育データ、契約書、営業資料、開発文書、監査資料について、EU/US処理の可否、No preference の可否、Gemini app 利用の可否を判断する。

Day 21 から 25 は、pilot OU を選ぶ。低リスクの部門で Gemini app を許可し、data region 設定を明示する。欧州拠点や教育部門のように地域要件が強いところは、先に法務とセキュリティの承認を取る。問い合わせ時に管理者が確認する項目を runbook 化する。

Day 26 から 30 は、運用レビューを行う。利用者が Gemini app を使えない理由が policy なのか、edition なのか、rollout なのか、data region なのかを切り分けられるか確認する。説明できない設定があれば、全社展開前に止める。

## 判断基準

Gemini app の data regions 対応を有効活用できる条件は、単に対象エディションを持っていることではない。OU / group が実際の組織・地域・データ分類に合っており、Gemini app と Workspace services の利用可否が台帳化され、保存と処理の差を説明できることが必要である。

逆に、OU が部署の実態とずれている、共有ドライブの権限が広すぎる、海外拠点と日本本社のデータ要件が整理されていない場合、data regions を設定しても説明責任は残る。この場合は Gemini app の全社解禁より、先に共有権限と組織構造の整理を優先するべきだ。

日本企業では、国内リージョンがないことも正直に扱う必要がある。今回の更新は EU / US の管理を強めるものであり、日本国内保管を直接実現するものではない。したがって、日本の顧客契約や個人情報保護に対しては、国外処理の説明、委託先管理、社内規程との整合を別に確認する。

## まとめ

Gemini app の data regions 対応は、Google Workspace の生成AIを本番利用へ近づける管理機能である。管理者は OU レベルで EU / US の保存・処理を設定できるが、エディションによって storage only と processing plus storage の差がある。

日本企業が取るべき対応は、Gemini app をすぐ全社解禁することではない。OU / group、対象エディション、Gemini app 利用可否、Workspace Intelligence、Workspace Studio、アプリ内 Gemini、data at rest、processing region を一つの台帳にまとめ、部門ごとの地域要件を説明できる状態を作ることだ。data regions は便利機能ではなく、生成AIを業務基盤に入れるための説明責任の部品として扱うべきである。

## 出典

- [Data regions support for the Gemini app now available](https://workspaceupdates.googleblog.com/2026/06/gemini-app-data-regions-support.html) - Google Workspace Updates, 2026-06-29
- [Choose a geographic location for your data](https://knowledge.workspace.google.com/admin/compliance/choose-a-geographic-location-for-your-data) - Google Workspace Admin Help
- [Data covered by data regions](https://knowledge.workspace.google.com/admin/compliance/data-covered-by-data-regions) - Google Workspace Admin Help
