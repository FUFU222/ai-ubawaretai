---
article: 'openai-chatgpt-skills-default-enterprise-2026'
level: 'expert'
---

OpenAI Help Center の Skills in ChatGPT は、ChatGPT Enterprise の Skills について重要な運用変更を示している。現時点で Enterprise / Edu の Skills は既定オフだが、OpenAI は **2026年7月23日から、opt out していない Enterprise workspaces で Skills を既定オンにする予定**だと説明している。これは、単なる UI 追加ではなく、ChatGPT の業務部品管理が pilot から標準機能へ移るサインである。

Skills は reusable, shareable workflows であり、instructions、examples、supporting resources、code を含められる。したがって、Skill はプロンプトテンプレートではなく、業務手順と実行補助物のパッケージである。日本企業がこの変更を軽く見ると、利用者が作った個人手順が、承認されないまま部署標準のように広がる。

この点は、既存の [OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) の続編として読むべきだ。5月時点の論点は、admin Skills page、Permissions & roles、uploaded skills scanning、Compliance Logs Platform、conversation event streams の `skill_id` だった。今回の論点は、それらを確認する猶予が短くなったことだ。既定オン化の前に、opt out、role、upload、publish、install、監査ログの取り込み先を決めなければならない。

## Fact: 既定オン化と権限の単位

OpenAI は、ChatGPT Enterprise / Edu の workspace admins が Skills を対象 role に対して有効化できると説明している。2026年7月23日からは、opt out していない Enterprise workspace で既定オン化する予定である。Edu については同じ文脈で admin controls が説明されるが、既定オン化の記述は Enterprise workspace に向けたものとして読むべきである。

権限は複数に分かれている。`Enable skills` は作成と利用の入口である。`Enable skill uploading` はローカルの skill file を workspace へ持ち込む権限である。`Share skills` は workspace 内の人や group と共有する権限である。`Publish skills to workspace` は workspace library へ公開する権限である。`Enable skills installing` は他メンバーへ install して、その Skill が自動的に使われる状態を作る権限である。

この5つは同じリスクではない。利用は個人の作業に近い。upload は外部由来ファイルやコードを持ち込む入口になる。share は限られた人への配布である。publish は workspace 全体の reusable workflow に近い。install for other members は、利用者本人が選ばない状態で Skill を環境へ入れる操作であり、管理者的な影響を持つ。

したがって、既定オン後の初期設定をそのまま信頼するのではなく、role ごとに最小権限へ戻す確認が必要になる。特に regulated team、委託先、採用・人事、法務、金融、医療、公共、セキュリティ対応では、upload と publish を分けるべきである。

## Fact: admin Skills page は台帳の入口になる

OpenAI は admin Skills page で、workspace skills の owner、access、users、invocations 30d、created、updated などを見られると説明している。管理者は skill details を開き、download、access 変更、owner 変更、delete を実行できる。これは、Skill を個人の持ち物ではなく workspace asset として扱うための最低限の control plane である。

退職や異動を考えると、owner transfer は重要である。業務で使われている Skill の owner が個人のまま退職すると、更新責任、問い合わせ先、廃止判断が曖昧になる。Access 変更も同じだ。最初は invite only で試した Skill が、いつの間にか workspace 共有されていないかを見なければならない。

Invocations 30d は利用価値の目安になるが、監査では過信できない。利用回数が多い Skill は、正しいから多いのではなく、便利だから多いだけかもしれない。逆に、利用回数が少ない高リスク Skill も存在する。たとえば法務、セキュリティ、採用、障害対応の Skill は、低頻度でも影響が大きい。

## Fact: uploaded skills scanning は組織レビューの代替ではない

OpenAI は、uploaded skills が利用可能になる前に ChatGPT によって scan されると説明している。多くは scan 後すぐに使えるが、一部は Needs Review となり、リスクがあると判断されたものは Blocked になる。ただし、OpenAI はこの scan が利用者自身の review、policies、judgment を置き換えるものではないとも説明している。

ここは日本企業で誤解しやすい。Blocked にならなかった Skill は、自社業務で使ってよい Skill ではない。scan は安全性の入口であり、業務適合性、規程準拠、データ分類、外部送信、著作権、委託先利用、個人情報の扱いまで確認するものではない。

外部 Skill の持ち込みには、少なくとも出所、license、含まれる supporting resources、code の有無、想定利用業務、扱うデータ分類、owner、更新元を記録する必要がある。GitHub repository や vendor package から入れた Skill は、通常の npm package ほど実行面が明確ではない一方、AI の判断手順に影響する。レビュー対象としては軽くない。

## Analysis: shadow workflow を防ぐ設計

ここからは分析だ。

Skills 既定オン化の本質的なリスクは、shadow workflow である。企業の AI 利用では shadow IT がよく問題になるが、Skills ではシステム導入より前に、仕事の型そのものが管理外で広がる。たとえば、営業提案の根拠、法務レビューの観点、採用評価の言い回し、障害報告の分類、コードレビューの優先順位が、個人 Skill によって事実上の標準になる。

これは明示的な悪用より起きやすい。現場は便利なものを共有する。共有されたものは使われる。使われたものは「前からそうしていた」という説明になりやすい。ところが Skill の中身に古い文言、未承認の判断基準、地域に合わない法務観点、社外秘の例が含まれていると、成果物の責任を後から説明しにくくなる。

[ChatGPTロックダウンモード](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) は外部送信リスクへの設定だが、Skills は入力前の業務手順リスクである。Lockdown Mode を有効にしても、Skill 自体が古い規程を前提にしていれば、出力は古い。外部送信を止める設定と、業務手順をレビューする仕組みは別に必要である。

同様に、[ChatGPTメモリ刷新](/blog/openai-chatgpt-dreaming-memory-controls-2026/) は個人化の文脈であり、Skills は標準化の文脈である。個人メモリへ会社標準を埋め込むと属人化する。Skills へ個人の好みを入れすぎると標準化の質が落ちる。メモリ、Custom instructions、Projects、Skills、Plugins の役割分担を決めるべきだ。

## Analysis: Codex と Plugins を混同しない

OpenAI は Skills が Codex と API でもサポートされると説明している。一方で、ChatGPT の workspace-managed Skills と、Codex 側で使う Skills、Record & Replay で作られる Skills、Plugins に含まれる Skills は、同じ管理面に完全には収まらない可能性がある。ここを混同すると、ChatGPT Enterprise の設定を確認しただけで、開発現場の Skill 利用まで統制できたと誤解する。

Codex の Skill は、開発端末、repository、shell、browser、MCP、plugins と接続し得る。ChatGPT の文書作成 Skill より、変更影響が大きい場合がある。たとえば release 手順、database migration 確認、security review、incident triage の Skill は、自然文出力だけでなく実行手順に影響する。ChatGPT 管理者と開発基盤管理者は別の台帳を持ち、共通 ID で突合できるようにするべきである。

Plugins はさらに別の配布単位である。Plugins は Skills と apps と app templates を束ねられる。したがって、plugin を install すると Skill だけでなく、外部 SaaS への action や connector setup が絡む場合がある。Skills 既定オン化を確認する runbook と、Plugins 管理の runbook は接続しつつ分ける必要がある。

## Implementation: 72時間でやること

7月23日前にやる作業は、長い規程改定ではなく、まず停止条件と限定開放を決めることだ。

第一に、workspace ごとの opt out 判断をする。全社ルール、監査ログ、owner 管理、問い合わせ窓口が未整備なら opt out し、pilot workspace または限定 role だけで始める。すでに AI ガバナンスがある企業でも、最初から全 role に upload、publish、install を許す必要はない。

第二に、role matrix を作る。一般利用者、power user、業務 owner、AI 推進担当、workspace admin、security reviewer に分け、Create / Use、Upload、Share、Publish、Install for others を割り当てる。最初の推奨は、Create / Use は広め、Upload は承認済み利用者、Publish は業務 owner、Install for others は admin または運用担当に限定する形である。

第三に、admin Skills page で初期棚卸しをする。Skill name、owner、access、users、invocations 30d、created、updated を export または記録する。退職者 owner、外部由来、workspace 公開、利用者多数、更新日が古い、code を含む可能性がある Skill を high priority として見る。

第四に、外部 Skill 持ち込みルールを暫定で出す。外部 Skill は、出所、license、含まれる files、code、想定業務、利用データ分類、owner、レビュー日がない限り workspace へ publish しない。Blocked でないことは承認ではない、と明記する。

第五に、Compliance Logs の取り込み先を決める。`skill_id` や skill references を SIEM、DLP、eDiscovery、または社内ログ基盤のどこで見るかを決める。ログは単に保存するのではなく、外部 Skill が機密業務で使われた、退職者 owner の Skill が継続利用された、高リスク部署で未承認 Skill が使われた、という検知ルールへ落とす。

## Measurement: 何を月次で見るか

Skills 導入後の指標は、利用回数だけでは足りない。日本企業では、次のような月次レビューが現実的である。

まず、Skill inventory の増減を見る。新規作成、削除、owner transfer、access 変更、workspace publish の件数を追う。増加が急な部署は、業務標準化が進んでいるのか、個人 Skill が乱立しているのかを確認する。

次に、利用と成果物レビューを合わせる。Invocations 30d が多い Skill について、成果物の再修正率、問い合わせ、苦情、法務・セキュリティ指摘を合わせて見る。利用が多くても、レビュー負荷が増えているなら Skill の品質を直す必要がある。

さらに、AI 利用分析とつなぐ。[OpenAI Admin keysとCodex分析履歴](/blog/openai-global-admin-keys-codex-analytics-2026/) で扱ったように、Codex analytics や credits、tokens、plugin calls、skills used は FinOps と enablement の材料になる。Skills は費用だけでなく、業務標準の普及度を示す。だが個人評価に直結させると、利用者は不自然な使い方をする。部署単位、業務単位で改善を見るほうがよい。

## まとめ

ChatGPT Skills の Enterprise 既定オン予定は、管理者にとって小さな設定変更ではない。Skills は、ChatGPT に会社の仕事の型を渡す仕組みであり、instructions、examples、supporting resources、code を含められる。便利な一方で、shadow workflow を作る力もある。

日本企業は、7月23日前に opt out 判断、role matrix、upload 制限、publish / install 権限、owner 棚卸し、Compliance Logs の取り込みを決めるべきである。Skills を止める必要はない。だが、誰が作り、誰が配り、どの業務で使われ、どのログで説明するかを決めずに既定オン化へ進むべきではない。

うまく設計すれば、Skills は部署ごとの作業品質をそろえ、ChatGPT を個人利用から業務基盤へ引き上げる部品になる。放置すれば、便利な個人手順が管理外の標準になる。既定オン化は、その分岐点を管理者に知らせる更新である。

## 出典

- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) - OpenAI Help Center
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
- [Using skills](https://openai.com/academy/skills/) - OpenAI Academy
