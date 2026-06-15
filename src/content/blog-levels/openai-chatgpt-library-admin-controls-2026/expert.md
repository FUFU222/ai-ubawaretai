---
article: 'openai-chatgpt-library-admin-controls-2026'
level: 'expert'
---

ChatGPT Library の Enterprise / Edu / Healthcare 展開は、表面的にはファイル再利用機能の追加に見える。しかし、企業導入の観点では、ChatGPT 内部の情報資産管理が一段進んだ更新として扱うべきだ。OpenAI は同じ 2026年6月11日の release notes で、Library、Global Admin Console の外部アプリアクセス制御、Codex の Windows / Developer mode 更新を並べている。つまり、ChatGPT は会話UIではなく、ファイル、ID、アプリ、端末、監査を束ねる業務面へ寄っている。

この更新は、既存の [ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) とセットで読む必要がある。App permissions は、接続アプリの操作前にユーザー承認を挟む条件を扱った。Library は、ChatGPT の中で再利用可能になったファイルの保存と参照を扱う。さらに [ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) は、OpenAI アカウントの入口がどの端末に残るかを扱った。これらは別々の小機能ではなく、企業が ChatGPT を業務基盤化するときの管理面である。

## 事実: Libraryは会話添付の延長ではない

OpenAI の File storage and Library の説明では、Library は ChatGPT にアップロードしたファイルや ChatGPT で作成したファイルを、ユーザーが見つけて再利用するための場所として説明されている。ファイルはワークスペースの保持ポリシーに従う。ここで重要なのは、Library が「会話に一時的に付いているファイル」から「後で探せるファイル」へ認識を変える点である。

企業では、この差が大きい。会話添付のつもりなら、利用者は作業が終われば忘れやすい。Library として再利用可能になるなら、ファイル名、内容、保持期間、検索可能性、削除依頼、権限境界を管理対象として扱う必要がある。

OpenAI は、Library が新しい外部共有や共同編集を導入するものではないとも説明している。これは安心材料ではあるが、リスクが消えるわけではない。外部共有がなくても、社内ワークスペース内で再利用される情報が増えれば、古い資料、未承認ドラフト、個人情報、顧客別の秘密情報が回答文脈へ入りやすくなる。

## 事実: 自動参照は情報検索の便利さと隣り合わせ

ワークスペース owner は、ChatGPT が Library ファイルを自動参照するかどうかを制御できる。自動参照をオフにしても、メンバーは Library を閲覧、検索、開く、添付することができる。Healthcare ワークスペースでは、自動参照が既定オフである。

これは設計上かなり重要だ。自動参照は、利用者が毎回ファイルを探して添付する負担を下げる。一方で、プロンプトに明示していないファイルが回答の文脈に入る可能性を作る。RAG や社内検索ではよくある論点だが、ChatGPT の一般利用画面に入ると、利用者は「なぜその情報を知っているのか」を意識しにくい。

[OpenAIのOffline検索](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) でも、内部インデックスや社内文脈の利用境界が論点だった。Library の自動参照も同じ構図にある。検索・参照が便利になるほど、参照してよいファイル、古くなったファイル、機密区分、利用者の役割、削除対象を管理する必要が出る。

## 事実: Compliance APIは削除と開示の運用線になる

OpenAI は、Library ファイル向けの Compliance API endpoint で export と delete が可能だと説明している。これは、単に管理者が後からファイル一覧を見られるという話ではない。監査、法務対応、個人情報開示、退職者対応、保存期間満了、インシデント時の証跡確保に関係する。

Chat and File Retention Policies の説明では、チャットとファイルは分けて扱われる。会話を消したからといって、関連ファイルの扱いまで自動的に同じになると考えるのは危険だ。Project、GPT、Library、会話添付、接続アプリ側の原本は、それぞれライフサイクルが違う可能性がある。

実務では、退職者チェックリストに「ChatGPT セッションを切る」だけでなく、「Library ファイルの扱いを確認する」を入れる必要がある。さらに、部門異動や委託終了でも同じだ。業務ファイルが個人の作業履歴として残っているのか、チーム資産として残すべきなのか、削除すべきなのかを判断しなければならない。

## 事実: 外部アプリアクセス制御はID連携の別経路

同じ release notes で示された Global admin console updates も見落とせない。Cloud Console は、Sign in with ChatGPT の external app access controls を含む。管理者は、組織メンバーが Sign in with ChatGPT を使えるかどうか、承認済みアプリだけに絞るか、個別アプリを承認または無効化するかを管理できる。

これは RBAC や App permissions と似ているが、対象が違う。App permissions は、ChatGPT が接続アプリを使うときにいつ確認するかを決める。External Access は、OpenAI アカウントを使って外部アプリへ入ること自体を管理する。日本企業の ID 管理では、SAML / OIDC、Microsoft Entra、Google Workspace、社内IdP、SaaSごとの OAuth 承認がすでに複雑である。そこに Sign in with ChatGPT が入るなら、例外的なログイン経路にしないことが重要だ。

特に、AI研修、社内ツール、OpenAI Academy、外部のAI関連サービスで Sign in with ChatGPT が使われると、現場は便利さを優先しやすい。だが、企業アカウントで入る外部アプリは、利用規約、データ連携、退職時の失効、監査ログの所在を確認すべき対象である。

## 分析: 管理表は「機能別」ではなく「データ状態別」に作る

ここからは分析だ。

日本企業で ChatGPT 管理が難しくなる理由は、機能名が増えることではない。データの状態が増えることだ。プロンプトに入力されたテキスト、会話履歴、Library ファイル、Project のファイル、GPT の知識、接続アプリから読んだデータ、外部アプリへ渡る認証情報、Compliance API で取れるログが、それぞれ違う管理対象になる。

そのため、管理表は「Library」「Apps」「Sign in」「Sessions」のような機能別だけで作ると抜ける。むしろ、入力、保存、検索、自動参照、外部送信、外部ログイン、監査、削除、退職時失効という状態別に作るほうがよい。

たとえば、Library ファイルは「保存」「検索」「自動参照」「削除」の列に入る。Sign in with ChatGPT は「外部ログイン」「承認」「退職時失効」の列に入る。App permissions は「外部送信」「変更操作」「ユーザー承認」の列に入る。[OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) は「実行能力」「監査」「配布管理」の列に入る。このように整理すると、機能が増えても管理対象を見失いにくい。

## 分析: Healthcare既定オフは高機微領域のヒントになる

Healthcare ワークスペースで Library の自動参照が既定オフである点は、日本企業にも参考になる。医療だけが高機微ではない。人事、法務、労務、金融、公共、M&A、知財、セキュリティインシデント、顧客別契約も同じように慎重な扱いが必要だ。

自動参照を全面的にオンにすると、利用者は便利になる。しかし、機密区分の違うファイルが同じ Library にある場合、回答の根拠として混ざる可能性を説明しづらい。たとえ権限上は本人が見られるファイルだけであっても、「この用途で参照してよいか」は別問題である。

したがって、初期導入では部署や用途ごとに自動参照の方針を分けるべきだ。開発ナレッジ、公開済み社内規程、研修資料、テンプレートは自動参照に向く。顧客個別情報、未公表決算、人事評価、医療情報、契約交渉、脆弱性詳細は手動添付に寄せる。ここを一律にすると、便利さか安全性のどちらかに振れすぎる。

## 実務: 導入時のチェックリスト

一つ目は、Library の対象データを分類することだ。アップロード可、要注意、禁止、期限付き保存の分類を作る。既存の情報区分と合わせ、利用者が判断できる粒度にする。

二つ目は、自動参照の既定値を決めることだ。全社オンではなく、部署・ワークスペース・データ種別で分ける。Healthcare の既定オフと同じ考え方を、高機微部門にも適用する。

三つ目は、チャット削除とファイル削除の差を社内手順に書くことだ。利用者向けには短く、「会話を消してもファイル管理は別に確認する」と説明する。管理者向けには、Compliance API、保持ポリシー、バックアップ保持、削除依頼の処理フローを定義する。

四つ目は、Sign in with ChatGPT の承認プロセスを作ることだ。外部アプリの申請者、承認者、確認項目、利用規約、データ連携、監査ログ、退職時の無効化を決める。既存の SaaS 承認プロセスに載せるのが現実的である。

五つ目は、監査観点を統合することだ。Library export/delete、app calls、external app access、active sessions、skills usage を別々に見るのではなく、月次または四半期の AI 利用レビューにまとめる。ChatGPT が業務基盤になるほど、監査も機能単位ではなく利用シナリオ単位で見る必要がある。

## まとめ

ChatGPT Library は、ファイルを再利用しやすくする便利機能である。同時に、企業に対して、ChatGPT 内部に残るファイルをどう分類し、参照し、監査し、削除するかを問う更新でもある。Global Admin Console の外部アプリアクセス制御と合わせると、OpenAI は ChatGPT を単体アプリではなく、企業の情報管理とID管理の中へ入れようとしている。

日本企業が今やるべきことは、新機能を急いで全社展開することではない。Library、自動参照、Compliance API、Sign in with ChatGPT、App permissions、Sessions を一つの運用表にまとめ、どのデータがどの状態で残り、誰が承認し、どう消せるかを説明できるようにすることだ。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-06-11
- [File storage and Library in ChatGPT](https://help.openai.com/en/articles/20001052-file-storage-and-library-in-chatgpt) - OpenAI Help Center
- [Global Admin Console](https://help.openai.com/en/articles/12289294-global-admin-console) - OpenAI Help Center
- [Chat and File Retention Policies in ChatGPT](https://help.openai.com/en/articles/8983778-chat-and-file-retention-policies-in-chatgpt) - OpenAI Help Center
