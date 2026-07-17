---
article: 'openai-chatgpt-agent-work-migration-2026'
level: 'expert'
---

OpenAI Help Center の ChatGPT agent ページが更新され、冒頭で ChatGPT agent は現在利用できず、長い複数ステップ作業や finished deliverables には ChatGPT Work を使うよう案内された。これは、agentic work の終了ではなく、旧 agent の作業面を ChatGPT Work、Codex、desktop app、cloud surfaces へ再配置する変更である。

企業運用の観点では、影響はUIの名称に閉じない。旧 agent で許可していた app access、browser login、scheduled task、screenshots、Compliance API logs、workspace controls、role-based access controls を、Work/Codex の新しい役割分担に合わせて見直す必要がある。特に日本企業では、生成AIの利用規程が「ChatGPTの利用可否」レベルにとどまっていることが多く、Chat、Work、Codex、desktop Work、cloud Work の違いを明文化しないと、監査、退職時対応、費用配賦で詰まりやすい。

今回の変更は、[ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) の token-based credits、[ChatGPTタスク刷新](/blog/openai-chatgpt-scheduled-tasks-management-2026/) の scheduled work、[ChatGPT求人検索と履歴書支援](/blog/openai-chatgpt-job-search-resume-2026/) の業務入口拡張と同じ方向を向いている。さらに [OpenAI Atlas終了](/blog/openai-atlas-retirement-browser-agent-migration-2026/) と合わせると、OpenAI は単体 agent や単体ブラウザではなく、ChatGPT desktop app と Work/Codex のモード分離へ集約していると読める。

## 事実: 旧agentの概念はWorkへ吸収される

ChatGPT agent の Help Center ページは、更新日時を示したうえで、Overview の冒頭に agent が利用できないこと、長い複数ステップ作業や完成物には ChatGPT Work を使うこと、対応する browser workflows には別の cloud browser 案内を見ることを記している。ページ下部には agent mode の旧仕様説明が残っており、plan availability、apps、task scheduling、safety、privacy、workspace controls なども掲載されている。

この構成は、移行期のドキュメントとして読むべきだ。旧 agent のセキュリティ論点が消えたわけではない。メール、ファイル、account settings のような sensitive data にアクセスし、利用者の代わりに action を行うリスク、prompt injection、不要な apps の無効化、sensitive login の扱い、cookies、browser screenshots、conversation history の保持、Business/Enterprise/Edu での training defaults、Compliance API の記録範囲は、Work へ移っても設計論点として残る。

OpenAI の ChatGPT Release Notes は 2026年7月9日に Work を導入し、長い作業、接続済み apps と files、documents、spreadsheets、presentations、reports、Sites を扱う agent と説明している。同じ日付の desktop app 更新では、Chat、Work、Codex を macOS/Windows の新しい ChatGPT app にまとめ、Work は許可により local files と desktop apps を使えると説明している。

つまり、旧 agent の利用者体験は、Work というより大きな業務成果物の入口へ再定義された。企業管理者は、旧 agent を単に無効化済み機能として扱うのではなく、旧 agent で発生していたリスクと業務価値を Work/Codex の新制度へ写像する必要がある。

## 事実: Work、Codex、Chatは保存と端末条件が違う

ChatGPT Work and Codex の Help Center は、Chat を質問や会話、Work を調査・情報分析・完成物作成、Codex をソフトウェア開発と技術作業と整理している。さらに Work は web/mobile/desktop で利用でき、desktop Work は許可によりローカルファイルや desktop apps を使える。Codex は ChatGPT desktop app の mode であり、ローカル folders、repositories、terminals、developer tools と連携する。

企業運用で重要なのは、利用面だけでなく保存と同期の違いである。OpenAI は、web/mobile の Work conversations は cloud surfaces で継続できるが、launch 時点では desktop Work に表示されないと説明している。desktop Work threads と local files はその computer に残る。Codex desktop tasks も web には出ず、mobile の Remote tab から supported tasks にアクセスする形である。

この差は、監査とインシデント対応に直接効く。たとえば、経営企画の Work が web で作った調査資料なのか、desktop でローカルフォルダを読んだものなのかにより、確認すべき端末、ファイル、会話履歴、権限が変わる。Codex で repository と terminal を使った task なら、Git の履歴、local repo、terminal output、CI logs が関係する。Chat の短い相談なら、通常の chat history と data controls が中心になる。

一律の「ChatGPT利用ログを確認する」だけでは足りない。Work/Codex の mode、cloud/desktop、local files、connected apps、scheduled execution、remote access の組み合わせを台帳化する必要がある。

## 分析: 移行時の主リスクは権限の持ち越し

ここからは分析である。

旧 agent 利用から Work へ移るとき、最大のリスクは「以前動いていたから」という理由で権限を持ち越すことだ。旧 agent は、apps や browser を通じて情報を集め、場合によっては action も実行する。Work はより完成物作成に寄ったUIになるが、connected apps、files、desktop apps、browser workflows を使うなら、実際の権限面はむしろ広がる可能性がある。

移行では、作業ごとに allowlist を作るべきだ。市場調査、競合調査、営業提案、採用支援、会議準備、月次報告、Excel 分析、PowerPoint 作成、社内FAQ更新、契約レビュー補助などを分ける。それぞれについて、利用 mode、許可 apps、参照可能 data class、出力先、review owner、実行頻度、credits owner、停止条件を決める。Work は万能作業面ではなく、許可された業務だけを実行する面として扱う。

特に日本企業では、Google Drive や Microsoft 365 の folder 権限が広く、古い共有フォルダに顧客情報、採用情報、契約書、未公開資料が混ざっていることがある。Work に「必要な資料を探して」と依頼すると、権限上読めるが業務上読むべきではない資料まで文脈に入るおそれがある。これはセキュリティだけでなく費用にも影響する。余計な資料を読むほど入力 tokens が増え、credits 消費も増える。

Work/Codex の分離も同じだ。開発作業を Work に寄せると、repository、terminal、test、diff review の責任が曖昧になる。逆に、調査資料やプレゼン作成を Codex に寄せると、開発者権限を持つ作業面で業務資料を扱うことになる。役割分離はUI上の好みではなく、アクセス権とレビュー責任を分けるための統制である。

## 監査設計: Compliance APIだけに依存しない

OpenAI の旧 agent ページは、Business/Enterprise/Edu では business data を training に使わない既定や、Compliance API logs に agent tasks が出ることを説明している。一方で、個別の agent actions、virtual computer usage、app requests、chain of thought のような細部は Compliance API に出ないとされる。これは、監査設計で重要な制約である。

企業側は、OpenAI 側の compliance logs、workspace admin settings、connected app audit logs、IdP logs、DLP、endpoint management、Git logs、SaaS activity logs を組み合わせる必要がある。Work が Google Drive の資料を読み、資料を生成し、Slack へ共有するなら、OpenAI だけではなく Google Workspace と Slack 側のログも見る。Codex が repository を編集するなら、GitHub、CI、package registry、secret scanning のログを見る。

また、desktop Work では端末管理が重要になる。ローカル files と desktop apps を扱う場合、MDM、EDR、file classification、local folder permissions、退職時の端末回収が関係する。cloud Work と desktop Work を同じ監査フローで扱うと、ローカルに残った thread、output、intermediate files を見落とす可能性がある。

監査設計は、日常運用とインシデント対応の両方で使える形にするべきだ。日常運用では、誰がどの Work を作り、どの apps を使い、どの outputs を共有したかを見る。インシデント対応では、特定の外部送信、誤共有、prompt injection 疑い、権限過大利用、顧客データ混入が起きたときに、どのログをどの順番で見るかを決める。

## 移行計画: 30日で止めるものと移すものを分ける

実務的には、30日程度の移行計画を置くのが現実的である。

最初の1週間で、旧 agent 利用を洗い出す。workspace 管理者、部門の power users、情シス、開発チーム、営業企画、経営企画、人事に確認し、agent mode、browser workflows、scheduled tasks、connected apps、desktop app 利用を一覧化する。個人の試用まで完全に捕捉できなくても、機密データ、外部 action、定期実行、ローカルファイルを含むものを優先する。

次の1週間で、Work、Codex、Chat、停止の4分類に分ける。Chat に戻すものは短い相談や検索で済むもの。Work に移すものは、調査、分析、文書、表計算、プレゼン、レポート、Sites のような成果物作成。Codex に移すものは、コード、テスト、リポジトリ、terminal、PR review。停止するものは、owner がいない定期実行、権限が広すぎる app 接続、費用対効果が不明な自動化、外部ログインを含む高リスク作業である。

3週目は、権限と費用の設定を行う。Work を許可する role、connected apps、folder scope、public sharing、scheduled tasks、credits owner、usage alerts を決める。Codex では repository scope、terminal access、approval policy、secret handling、branch policy、CI 実行、package publish の制限を確認する。Chat は、個人情報や機密情報の入力ルール、training/data controls、Projects の利用範囲を明確にする。

4週目は、利用者向けの案内を出す。案内は長い規程ではなく、作業別に短くする。「質問は Chat」「資料や調査は Work」「コードは Codex」「外部サイトログインや顧客データは承認が必要」「定期実行は owner と停止条件が必要」「desktop Work はローカルファイルを扱うため端末管理対象」という形がよい。

## まとめ

ChatGPT agent の廃止は、旧 agent 機能の単純な終了ではなく、OpenAI が agentic work を Work と Codex に分け、desktop app と cloud surfaces へ整理する節目である。日本企業は、この変更を機能名の変更として扱うと、権限、保存場所、監査、費用、退職時対応を見落とす。

実務上は、旧 agent 利用の棚卸し、Work/Codex/Chat/停止の分類、app 権限の再承認、desktop と cloud の保存範囲確認、Compliance API 以外のログ設計、credits owner の設定を行うべきだ。特に `openai-chatgpt-work-products-2026` 系列の記事で見てきたように、ChatGPT は業務成果物と定期実行の面へ広がっている。便利さの前に、どの作業を誰の責任で任せるかを決めることが、今回の移行の本質である。

## 出典

- [ChatGPT agent](https://help.openai.com/en/articles/11752874-chatgpt-agent) - OpenAI Help Center
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Moving to the new ChatGPT desktop app](https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app) - OpenAI Help Center
