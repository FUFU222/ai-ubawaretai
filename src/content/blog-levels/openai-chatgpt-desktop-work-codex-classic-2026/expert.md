---
article: 'openai-chatgpt-desktop-work-codex-classic-2026'
level: 'expert'
---

OpenAI の ChatGPT desktop app experience updates は、単なる UI 更新として処理すると見落としが出る。企業運用の観点では、Chat、Work、Codex、ChatGPT Classic、Project context、cloud Work sync、Codex history、workspace governance を、利用者の一つのデスクトップ体験へどう見せるかという変更である。

このサイトではすでに、[ChatGPT agentからWorkへの移行](/blog/openai-chatgpt-agent-work-migration-2026/)で旧 agent 利用の棚卸しを、[Atlas終了とブラウザ作業の再配置](/blog/openai-atlas-retirement-browser-agent-migration-2026/)で専用ブラウザから desktop / extension へ移る流れを扱った。今回の記事はその続きだが、主題は機能移行ではなく、現場が毎日起動する desktop app の標準化である。[ChatGPTの統合検索とProject files](/blog/openai-chatgpt-unified-search-project-files-2026/)のような情報導線の改善と同時に、履歴、端末、権限、問い合わせ対応の設計が必要になる。

日本企業の管理者が見るべきなのは、「Work が見えるか」「Codex が使えるか」という単発の権限ではない。対象端末に何が入っているか、利用者はどの app icon を押すか、Classic をいつまで残すか、Codex history はどこにあると説明するか、Work conversations はどの surface で継続できるか、既存の spend controls が変わらないことをどう周知するかである。

## 事実: Codex app更新とChatGPT Classic併存が同時に起きる

OpenAI の移行 FAQ は、利用者の出発点を三つに分けている。既存の Codex app 利用者、旧 ChatGPT desktop app 利用者、初回インストール利用者である。この分け方自体が、企業運用では重要だ。

既存 Codex app 利用者は、通常の更新により新しい ChatGPT desktop app へ移る。更新後の app は Chat、Work、Codex を含むが、既存 Codex users には Codex を開く導線が維持され、既存 Codex chats や projects も残ると説明されている。つまり開発者に対しては、「Codex が廃止される」のではなく、「Codex は新しい ChatGPT desktop app の中の独立 view として残る」と説明する必要がある。

旧 ChatGPT desktop app 利用者は、新しい desktop app を入れる案内に従う。ここで問題になるのが ChatGPT Classic である。新旧アプリが端末に並ぶ場合、利用者はどちらを起動すべきか迷う。OpenAI は Classic が既存 Enterprise capabilities、model updates、bug fixes、security patches を受け続けると説明している一方、新しい agent features は新 app 側へ寄る可能性がある。

初回インストールは比較的単純だが、managed device ではここにも注意がある。企業の配布ツールが旧 installer、Codex app、new ChatGPT app のどれを持っているかによって、利用者の初期状態が変わる。手順書に「ChatGPT を入れる」とだけ書くと、ヘルプデスクが画面差分を再現できない。

## 事実: 統合されたのは入口であり、履歴と権限は分けて見る

OpenAI の release notes は、desktop layout の中で global switcher により ChatGPT と Codex を選び、ChatGPT 側では Chat と Work を選べるようにしたと説明している。Chat と Work の会話は Recents に一緒に表示され、sort、filter、pin ができる。Projects も desktop app に表示され、Project context を使って Chat または Work を始められる。

しかし Codex は別 view として残る。Codex workflows と history は変わらないと説明されており、ChatGPT history と単純に統合されるわけではない。これは監査や問い合わせ対応ではかなり大きい。利用者の「最近の会話にない」は、消失ではなく view の違いかもしれない。管理者の「ChatGPT history を確認した」は、Codex history まで確認したことを意味しない可能性がある。

Work の同期も、利用者体験と管理説明を分ける必要がある。OpenAI は cloud Work chats が web、mobile、desktop で継続できると説明している。これは移動中や端末変更時には便利だ。一方、Codex は web や mobile で直接 selectable ではなく、mobile app の Remote tab から対応する desktop Codex chats にアクセスする形になる。Work と Codex を同じ「agent 作業」として社内説明すると、この違いが抜ける。

企業の情報管理では、こうした違いを「保存場所」「端末依存」「監査対象」「退職時引き継ぎ」「問い合わせ切り分け」に落とす必要がある。特に日本企業では、利用部門、情シス、セキュリティ、監査、開発基盤が別々に問い合わせを受けることが多い。入口の統合に合わせて、内部の責任分界も同じ図にしておくべきだ。

## 事実: workspace controlsとspend modelは変わらない

今回の update で、既存の workspace access permissions、security settings、governance controls、spend model は変わらないと OpenAI は説明している。これは管理者にとって重要な前提である。

ただし、この文言は「何もしなくてよい」という意味ではない。UI が変わると、利用者は新しい capability が開いたと感じる。Chat、Work、Codex が近い場所に並ぶことで、これまで開発者だけが意識していた Codex や、業務部門だけが意識していた Work が、お互いの目に入りやすくなる。結果として、申請や問い合わせが増える。

既存統制が変わらないなら、管理者は「どこを見れば既存統制を確認できるか」を更新すべきである。Workspace settings、Permissions & Roles、Apps / Plugins、Usage limits、Global Admin Console、Codex settings、Sites settings、Computer Use / browser use のような管理面を、Chat / Work / Codex の利用面と対応づける。これをしておかないと、問い合わせのたびに「新アプリの仕様か、社内設定か、ロールアウト差か」を個別調査することになる。

spend model も同じだ。新しい desktop app が入ったこと自体で費用構造が変わるわけではない。しかし Work や Codex の利用が増えれば、credits、usage limits、analytics、department allocation の実績は変わり得る。[ChatGPT求人検索と履歴書支援](/blog/openai-chatgpt-job-search-resume-2026/)のような業務利用と、Codex の開発利用は成果も費用説明も異なる。月次レビューでは同じ「ChatGPT」費用に丸めず、surface と作業種別で分けるほうがよい。

## 分析: デスクトップ統合はヘルプデスク設計の問題になる

ここからは分析である。

日本企業でこの更新が効いてくるのは、生成AI推進チームより先にヘルプデスクかもしれない。理由は、利用者の画面差分が増えるからだ。

ある利用者は Codex app から更新され、新しい app を開くと Codex が既定表示になる。別の利用者は旧 ChatGPT desktop app を使っていて、新 app を入れると ChatGPT Classic も残る。さらに別の利用者は web では Work が見えるが desktop では app version が古く、また別の利用者は eligible account ではないため Work がまだ見えない。この状態で「新しい ChatGPT を使ってください」とだけ周知すると、初回問い合わせが増える。

ヘルプデスクの切り分け項目は、少なくとも次のようになる。OS、app name、app version、起動した icon、サインイン account、workspace、plan、role、Work rollout の有無、Codex view の有無、ChatGPT Classic の有無、Project が見えるか、Recents に表示される会話種別、mobile Remote tab の有無である。これは長く見えるが、最初にテンプレート化しておくと調査時間を大きく減らせる。

MDM / EDR / SaaS inventory との接続も重要である。端末に ChatGPT Classic と new ChatGPT app が両方ある場合、どちらを許可アプリとして扱うのか。Codex app の旧 binary をいつ除去するのか。新 app に更新した利用者だけ pilot group に入れるのか。アプリ配布と workspace policy がずれると、画面はあるのに機能が使えない、または機能は使えるが社内周知が追いつかない状態になる。

## 分析: WorkとCodexを同じ承認線に置かない

入口が一つになるほど、承認線は分けるべきである。

Work は、調査、分析、文書、表計算、プレゼン、レポート、Sites のような完成物作成に寄る。ここで重要なのは、業務データ、接続アプリ、社外共有、文書の正確性、承認フローである。営業、企画、総務、法務、人事、教育などの部門が使いやすい一方、顧客情報や社内文書へのアクセス範囲が論点になる。

Codex は、ローカルファイル、repositories、terminals、developer tools を扱う。ここで重要なのは、ソースコード、secret、build / test 実行、PR、review、CI、ローカル環境の権限である。開発生産性に直結する一方、権限の失敗半径も大きい。Work の利用承認者と Codex の利用承認者を同じにすると、どちらかの専門性が足りなくなる。

Chat は、短い質問や検索、壁打ちが中心である。これは最も広く配りやすいが、情報入力ルールは必要になる。Chat、Work、Codex は同じ app の中で近くなっても、社内規程では三つの利用区分として扱うほうがよい。UI の統合に合わせてポリシーまで統合すると、過剰に厳しくなるか、過剰に緩くなる。

この整理は、Classic の扱いにも効く。ChatGPT Classic を残す利用者には「現行業務の継続」を許す。新 app の pilot 利用者には「Work / Codex の新機能検証」を許す。全社展開前には、Classic で許していた操作と新 app で増える操作の差分を確認する。この順序なら、移行期間中も統制の説明がしやすい。

## 実務: 30日以内にやること

第一に、アプリ inventory を作る。端末ごとに、旧 ChatGPT desktop app、ChatGPT Classic、新 ChatGPT desktop app、Codex app の有無と version を確認する。できれば MDM や EDR の software inventory から抽出し、利用者の申告に頼らない。

第二に、pilot group を分ける。業務部門の Work pilot、開発部門の Codex pilot、一般 Chat 利用者を同じ pilot として扱わない。それぞれで許可データ、接続アプリ、ログ確認、問い合わせ先、費用確認を分ける。Work pilot には文書・表計算・Sites の扱い、Codex pilot には repository / terminal / developer tools の扱いを重点的に確認させる。

第三に、FAQ を更新する。利用者向けには短く、「ChatGPT と ChatGPT Classic の違い」「Work と Chat の違い」「Codex の場所」「履歴が見つからないときの確認」「Work が見えない理由」を書く。管理者向けには、app version、workspace、role、plan、rollout、view、history、sync の切り分け表を置く。

第四に、Classic の期限を決める。すぐに削除する必要はないが、無期限併存は避ける。例外利用者、残す理由、廃止予定、問い合わせ先を明示する。Classic が更新や security patch を受けるからといって、社内運用まで二重化し続ける必要はない。

第五に、統制マップを作る。Chat、Work、Codex、Plugins、Sites、Computer Use、browser use、Remote tab、usage limits、analytics、Admin keys を、管理画面と owner に対応づける。今回の update は既存統制を変えないが、利用者が触る入口を変える。入口が変わるなら、社内の統制説明も更新するべきである。

## まとめ

ChatGPT desktop app の更新は、OpenAI の agentic work を日常のデスクトップ導線へ寄せる変更である。Chat、Work、Codex が近い場所に並ぶことで、利用者は業務相談、完成物作成、開発作業を同じ app から始めやすくなる。

しかし企業運用では、統合された部分と分離された部分を分けて扱う必要がある。Chat と Work は Recents に一緒に出るが、Codex view と history は分かれる。ChatGPT Classic は残る場合がある。Work は段階的にロールアウトされる。既存の workspace controls と spend model は変わらないが、問い合わせと利用拡大は起きる。

日本企業にとっての実務は明確だ。端末 inventory を取り、Classic と新 app の扱いを決め、Work と Codex の承認線を分け、利用者 FAQ とヘルプデスク切り分け表を更新する。新しい desktop app は便利な入口であると同時に、生成AIの業務面と開発面を同じ端末上で説明し直す契機である。

## 出典

- [Moving to the new ChatGPT desktop app](https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app) - OpenAI Help Center
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-07-16
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
