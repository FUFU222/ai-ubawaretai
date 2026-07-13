---
article: 'openai-atlas-retirement-browser-agent-migration-2026'
level: 'expert'
---

OpenAI の Atlas retirement は、単独ブラウザの sunset として処理すると見誤る。実務上は、browser-based agentic work の実行面を、専用ブラウザから ChatGPT desktop app、Codex、Chrome extension / sidebar へ再配置する変更である。日本企業の管理者が見るべき対象は、アプリ削除だけではない。端末インベントリ、ブラウザデータ、Cookie、ログイン済み SaaS、社内 FAQ、AI 作業の許可範囲、そして次の作業面に移った後の監査線である。

既存の OpenAI 関連更新とつなげると、この位置づけは明確になる。[GPT-5.6一般提供とChatGPT Work](/blog/openai-gpt-56-ga-work-codex-api-2026/) では、ChatGPT Work が接続済みアプリ、ファイル、長時間タスクを扱う方向へ進んだ。[Codex役割別プラグインとSites](/blog/openai-codex-role-plugins-sites-workflows-2026/) では、Codex が職種別プラグインや共有成果物へ広がった。[ChatGPT SitesのBusiness既定オン](/blog/openai-chatgpt-sites-business-rbac-2026/) では、AI が作った成果物を workspace 内外へ公開する統制が課題になった。Atlas 終了は、これらの流れからブラウザ専用アプリだけを切り離し、統合デスクトップと既存ブラウザ補助へ寄せる変更だ。

## 事実整理: 停止日と移行対象

OpenAI の ChatGPT release notes は、Atlas を deprecate し、browser-based agentic capabilities を ChatGPT と Codex へ持ち込むと説明している。停止予定日は 2026年8月9日である。同じ release notes では、新しい ChatGPT desktop app が macOS と Windows で利用可能になり、Chat、Work、Codex を一つの app にまとめると説明されている。

移行 FAQ も同じ構造を示す。Atlas は 8月9日以降、開く、閲覧する、ブラウザ型 agent workflow を支える、という動作ができなくなる可能性がある。OpenAI は移行先として、新しい ChatGPT desktop app、ChatGPT Chrome extension または sidebar を挙げている。深い agentic browser work は desktop app を試すよう促し、Chrome での補助は extension / sidebar を使う整理だ。

macOS app release notes では、従来の ChatGPT macOS app が ChatGPT Classic と呼ばれるようになり、launch 時点で移行は必須ではないと説明されている。つまり OpenAI の desktop 戦略は、Atlas、従来 ChatGPT macOS app、Codex app を同時に単純終了するものではない。旧 app を残しながら、新しい ChatGPT desktop app に新しい agent 機能を集める段階移行である。

このため、企業の棚卸しでは「Atlas を消す」だけでなく、「どの利用者が ChatGPT Classic に残るのか」「誰が新 desktop app を使えるのか」「Codex app から移る必要があるのか」「Chrome extension / sidebar を許可するのか」を分けて管理する必要がある。

## データ移行: 自動移行されないもの

OpenAI の FAQ で重要なのは、Atlas browser data が自動的には移らない点だ。Bookmarks は HTML として export し、Chrome などへ import する必要がある。Open tabs は bookmark または URL メモへ落とす必要がある。Browser history も自動移行されないため、必要なページは停止日前に保存する必要がある。

ここで管理者が避けたい失敗は、利用者へ「必要なものを保存してください」とだけ案内することだ。業務上の bookmarks は個人の便利リンクではなく、調査中の競合ページ、顧客別の SaaS 画面、社内ダッシュボード、開発中サービス、採用候補者、法務確認中の資料に紐づく場合がある。必要な URL をどこへ保存するかを指定しないと、個人メモ、私用ブラウザ、共有チケット、Slack DM に散る。

Cookie と session file はさらに厄介だ。OpenAI FAQ は、Cookie や session file を信頼できない相手へ共有しないよう注意している。これは技術的には当然だが、ブラウザ移行の現場では軽視されやすい。ヘルプデスクが「ログイン状態も移したいので Cookie を送ってください」と案内してしまえば、業務 SaaS の session を第三者へ渡す運用になる。日本企業では、Cookie export を原則禁止または例外承認制にし、移行先では利用者本人が再ログインする設計が現実的だ。

ChatGPT conversation history は Atlas browser data と別である。この点は問い合わせ削減に効く。利用者は「Atlas が止まる」と聞くと ChatGPT の会話履歴まで消えると誤解しやすい。実際には、会話履歴は ChatGPT の plan、workspace settings、account access に従う。管理者通知では、ブラウザデータと会話履歴を明確に分離して説明するべきだ。

## セキュリティ: Discontinued browserの扱い

FAQ は、Atlas が discontinued browser になるため、8月9日より前に supported browser experience へ移るべきだと説明している。ブラウザは継続的な security maintenance が必要だからだ。この一文は、移行を「使えなくなる前の利便性対応」ではなく、「停止後に古いブラウザを残さないセキュリティ対応」として扱う根拠になる。

企業端末では、停止日後にアプリが起動しないだけならまだよい。より問題なのは、起動はするが一部機能が壊れ、利用者が代替手段として未承認の拡張機能、私用ブラウザ、個人アカウントを使い始めることだ。したがって、停止日前にアンインストール方針、ブロック方針、許可する代替、問い合わせ先をセットで出す必要がある。

[OpenAI TanStack対応とmacOS証明書更新](/blog/openai-tanstack-npm-supply-chain-2026/) では、OpenAI 製 macOS アプリと CLI の更新が証明書管理に関わることを扱った。今回も同じく、AI ツールは会話 UI だけでなく、ローカルアプリ、ブラウザ、証明書、拡張機能、端末管理の対象である。AI 部門だけでなく、情シス、セキュリティ、ヘルプデスク、開発基盤が同じ移行表を見るべきだ。

## 移行設計: 代替先を用途別に分ける

代替先は一つに決めないほうがよい。Atlas が担っていた用途は、通常閲覧、調査補助、ログイン済みページの要約、フォーム入力、開発検証、長時間 agent work に分かれる。すべてを ChatGPT desktop app に寄せると、不要なローカルファイル連携や desktop app 権限まで広げる恐れがある。すべてを Chrome extension に寄せると、深い browser automation や Codex 連携の検証を個人ブラウザ上で行うことになる。

標準案は三層に分けることだ。通常閲覧は会社標準ブラウザへ戻す。ページ横断の補助や要約は、管理者が許可した ChatGPT Chrome extension / sidebar に限定する。長時間の調査、業務成果物作成、Codex と組み合わせた検証は、新しい ChatGPT desktop app または管理された Codex 環境に限定する。

この三層分けは、監査にも効く。標準ブラウザは既存のプロキシ、DLP、EDR、SSO 条件で管理する。Chrome extension / sidebar は拡張機能許可リスト、workspace policy、接続アプリ設定で管理する。ChatGPT desktop app / Codex は workspace 管理、plugins、Computer Use、browser use、Remote Control、Sites など、より広い権限面として管理する。

## 管理者向けの実務手順

第一段階は inventory である。MDM、EDR、ソフトウェア資産台帳、ネットワークログ、自己申告を使い、Atlas のインストール端末と利用者を洗う。正式導入がない企業でも、少なくとも開発者、データ分析担当、事業企画、海外拠点の power user には確認したほうがよい。

第二段階は data triage である。利用者に bookmarks、open tabs、history の保存要否を判断させるだけでなく、保存先を指定する。業務ナレッジは社内 wiki、個人作業リンクは標準ブラウザの managed profile、調査メモは承認された note tool、顧客データは system of record へ戻す。Cookie や session file の共有は禁止または例外承認にする。

第三段階は application control である。8月9日以降、Atlas を許可リストから外すか、起動ブロックするか、少なくとも新規インストールを止める。既存端末で残す場合は期限を切る。停止後も古いブラウザが端末に残ると、利用者は「まだ使えるかもしれない」と試し続ける。

第四段階は replacement policy である。ChatGPT desktop app、ChatGPT Classic、Codex app、Chrome extension / sidebar のどれをどの role に許すかを決める。特に desktop app はローカルファイルや desktop apps と関係する可能性があるため、一般閲覧用ブラウザの置き換えとして配るべきではない。

第五段階は documentation update である。生成AI利用規程、FAQ、オンボーディング、開発者向けセットアップ、営業・企画向け調査手順、ヘルプデスク応対文から Atlas を消す。OpenAI FAQ も workspace admin guidance として、利用者への周知、重要データの export、desktop app や Chrome extension の availability 確認、内部文書更新、Cookie の機密扱いを挙げている。

## 日本企業で起きやすいリスク

一つ目は、個人試用の見落としだ。Atlas は正式に会社導入されていなくても、Mac ユーザーが個人アカウントで使っていた可能性がある。個人試用でも、業務 SaaS にログインしていれば会社のリスクになる。棚卸し通知は「会社が配った人だけ」ではなく、「業務利用した人」を対象にする。

二つ目は、Cookie の雑な扱いだ。ブラウザ移行では、ブックマークとパスワードに注意が向き、Cookie は後回しになりやすい。しかし agentic browser では、ログイン済み状態こそ価値の源泉であり、同時にリスクでもある。Cookie を export できる場合でも、それを別端末や別利用者に渡すべきではない。

三つ目は、移行先の権限過大だ。Atlas を止めるために ChatGPT desktop app を全員へ配ると、結果としてより強い作業面を広げることになる。新 desktop app は Chat、Work、Codex を統合するため、普通のブラウザ補助よりも多くの業務文脈に触れる。最初は pilot group と managed device に限り、role と workspace を絞るのが妥当だ。

四つ目は、社内 FAQ の残存だ。古いオンボーディングに Atlas が残っていると、新入社員や委託先が停止済みツールを探し、非公式な代替を使い始める。Atlas の項目を消すだけでなく、代替手順と禁止事項を同じ場所に置く必要がある。

## まとめ

Atlas retirement は、OpenAI の agentic browser 戦略が消える話ではない。単独ブラウザから、ChatGPT desktop app、Codex、Chrome extension / sidebar へ実行面が移る話である。だからこそ、日本企業は「使えなくなるブラウザを消す」だけでなく、「AI がブラウザを使う権限をどこへ移すか」を設計し直す必要がある。

8月9日までの実務は明確だ。Atlas 利用者を探す。Bookmarks、open tabs、history を保存させる。Cookie と session file を機密扱いにする。ChatGPT conversation history との違いを説明する。移行先を標準ブラウザ、Chrome extension / sidebar、ChatGPT desktop app / Codex に分ける。社内文書から Atlas を消し、停止後の問い合わせ導線を置く。

この対応は小さなアプリ整理に見えるが、AI 作業面の統制としては大きい。ブラウザは企業データへの入口であり、agentic browser はその入口を AI が操作する仕組みである。Atlas 終了を機に、どの browser agent を、どの端末で、どの workspace と role に許すかを決められる企業ほど、次の ChatGPT / Codex 統合にも落ち着いて対応できる。

## 出典

- [ChatGPT - Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Evolving Atlas into ChatGPT for browser-based agentic work](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work) - OpenAI Help Center
- [ChatGPT MacOS app release notes](https://help.openai.com/en/articles/9703738-chatgpt-macos-app-release-notes) - OpenAI Help Center
