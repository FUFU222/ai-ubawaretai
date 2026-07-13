---
title: 'OpenAI Atlas終了、AIブラウザ移行の実務期限'
description: 'OpenAI Atlasは2026年8月9日に停止予定。日本企業がChatGPT desktopやCodexへ移る前に、端末、ブックマーク、Cookie、社内手順を棚卸しする要点を整理する。'
pubDate: '2026-07-13'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'Codex', 'Atlas', 'セキュリティ', '企業導入', '管理者設定']
draft: false
series: 'openai-codex-enterprise-2026'
---

OpenAI は 2026年7月9日の ChatGPT release notes で、**Atlas を 2026年8月9日に停止予定**と案内した。理由は、ブラウザ型の agentic capabilities を単独ブラウザではなく ChatGPT と Codex 側へ移すためだ。これは単なるアプリ名の整理ではない。AI ブラウザを試験導入していた企業にとっては、端末上のブラウザデータ、ログイン状態、社内手順、サポート文書を 1 か月弱で閉じる移行案件になる。

OpenAI は同じ release notes で、新しい ChatGPT desktop app が Chat、Work、Codex を統合し、Work が接続済みアプリやファイルをまたいだ長めの作業を扱うと説明している。[GPT-5.6一般提供とChatGPT Work](/blog/openai-gpt-56-ga-work-codex-api-2026/) で見た流れの続きとして、Atlas の役割は「専用ブラウザ」から「ChatGPT desktop と Codex 内のブラウザ作業面」へ移る。さらに [Codex役割別プラグインとSites](/blog/openai-codex-role-plugins-sites-workflows-2026/) や [ChatGPT SitesのBusiness既定オン](/blog/openai-chatgpt-sites-business-rbac-2026/) と合わせると、OpenAI は生成物、ブラウザ操作、業務アプリ接続を単一の作業面へ寄せていると読める。

## 事実: Atlasは8月9日に停止予定

OpenAI の移行 FAQ は、Atlas を非推奨にし、ブラウザベースの agentic work を ChatGPT と Codex へ移すと説明している。Atlas は 2026年8月9日に動作停止予定で、その後は開く、閲覧する、ブラウザ型 agent workflow を支える、といった機能が使えなくなる可能性がある。

この日付は日本企業の管理者にとって重要だ。7月9日の告知から約30日の wind down であり、情報システム部門が月次パッチ、端末管理、利用者通知、社内 FAQ 更新を通常サイクルで回すには短い。特に Atlas を個人試用として許していた場合、MDM や資産管理台帳に載っていない端末で使われている可能性がある。

もう一つ重要なのは、OpenAI が「Atlas を止めるが、ブラウザ型 agentic work をやめる」とは言っていない点だ。移行先は新しい ChatGPT desktop app、ChatGPT Chrome extension または sidebar、そして Codex 側のブラウザ作業になる。つまり企業の判断は「AI ブラウザを禁止するか」ではなく、「どの作業面に寄せ、どの権限で許すか」へ変わる。

[OpenAI TanStack対応とmacOS証明書更新](/blog/openai-tanstack-npm-supply-chain-2026/) で扱ったように、Atlas は過去にも macOS アプリ更新や証明書管理の棚卸し対象になっていた。今回の停止では、アプリの更新だけでなく、ブラウザとして保持していた利用者データと業務手順をどう処理するかが主題になる。

## 事実: ブラウザデータは自動移行されない

OpenAI の FAQ は、Atlas の bookmarks、open tabs、browser history が自動的には移らないと説明している。利用者は 8月9日までに bookmarks を HTML として export し、必要な open tabs の URL を保存し、後で必要になる履歴ページを bookmark または別文書へ残す必要がある。

Cookie と session file はさらに注意が必要だ。FAQ は、Atlas が可能な範囲で export options を提供するとしつつ、Cookie や session file はアクセス権を含む可能性があるため機密データとして扱うよう求めている。これは日本企業では軽く見られがちなポイントだ。ブラウザ移行の文脈で Cookie を ZIP にして共有したり、ヘルプデスクへ送らせたりすると、SaaS のログイン状態や社内システムへのアクセスを渡すことになり得る。

ChatGPT conversation history は Atlas browser data とは別で、ChatGPT 側の plan、workspace settings、account access に従って残る。したがって利用者に説明するときは、「ChatGPT の会話が消える」話と「Atlas のブラウザデータが移らない」話を分ける必要がある。混同すると、不要な会話エクスポートや、逆に必要な bookmarks 保存漏れが起きる。

## 分析: 日本企業では端末棚卸しが最初の仕事になる

ここからは分析だ。

Atlas 終了で最初にやるべきことは、代替ブラウザの選定ではなく、利用実態の棚卸しである。Atlas が正式導入されていた企業は多くないかもしれないが、開発者、デザイナー、事業企画、海外拠点の一部が試験的に使っていた可能性はある。AI ブラウザは業務ブラウザと個人効率化ツールの中間に見えやすく、正規のソフトウェア申請を通らずに広がることがある。

棚卸しでは、端末、利用者、用途、保存データ、ログイン先を分けて見る。端末は管理済み Mac なのか、個人端末なのか。用途は調査、資料作成、社内 SaaS 操作、開発検証、顧客情報閲覧のどれか。保存データは bookmarks、history、open tabs、cookies、downloads、browser memories のどれか。ログイン先に CRM、チケット管理、経費精算、採用、契約、クラウド管理画面が含まれるなら、単なるアプリ削除では足りない。

移行先も用途ごとに分けるべきだ。通常の閲覧は会社標準の Chrome や Edge に戻す。ChatGPT と一緒にブラウザ支援を使うなら、ChatGPT Chrome extension や sidebar を管理者が許可した範囲で使う。深い agentic browser work や Codex の検証は、新しい ChatGPT desktop app または Codex の管理済み環境へ寄せる。すべてを一つの代替にまとめようとすると、権限が過大になりやすい。

## 移行チェックリスト

第一に、Atlas 利用者を特定する。MDM、端末インベントリ、ネットワークログ、利用者アンケートを組み合わせ、少なくとも業務利用が疑われる端末を出す。個人試用まで完全に洗うのは難しいが、顧客データや社内 SaaS にログインしていた可能性がある端末は優先する。

第二に、8月9日より前に bookmarks と重要 URL を保存させる。Open tabs と browser history は自動移行されない前提で、必要なページは bookmark、社内ナレッジ、個人メモのいずれかへ移す。作業途中の調査、競合分析、採用候補者ページ、契約レビュー資料などは失われると業務影響が出る。

第三に、Cookie と session file をヘルプデスクへ送らせない。Cookie はログイン状態そのものを含み得る。必要な場合でも、共有ストレージやチケット添付で扱うのではなく、利用者自身が移行先で再ログインする運用を原則にする。例外が必要なら、セキュリティ担当が手順と保管期間を決める。

第四に、社内文書を更新する。オンボーディング、生成AI利用ガイド、ブラウザ標準、ChatGPT desktop app の利用手順、Codex の作業環境説明に Atlas が残っていないかを確認する。FAQ は「Atlas は 8月9日に停止」「ブラウザデータは自動移行されない」「ChatGPT 会話履歴とは別」「Cookie は機密扱い」の4点に絞ると伝わりやすい。

第五に、移行後の browser-based agentic work の許可範囲を決める。ChatGPT desktop app はローカルファイルや desktop apps と関係する可能性があり、Codex は開発環境、ブラウザ検証、plugins、Sites とつながる。[ChatGPT Sites運用](/blog/openai-chatgpt-sites-business-rbac-2026/) と同じく、便利さより先に、どの workspace、どの role、どの端末条件で使わせるかを決める。

## まとめ

Atlas 終了は、OpenAI が単独 AI ブラウザを諦めたという話だけではない。ChatGPT、Work、Codex、desktop app、Chrome extension へブラウザ型 agentic work を再配置する移行である。日本企業では、8月9日までに Atlas 利用者、bookmarks、open tabs、browser history、Cookie、社内手順を棚卸しし、移行先の権限を決める必要がある。

特に Cookie と session file は、ブラウザ移行の副産物ではなくアクセス権を含む機密データとして扱うべきだ。Atlas を消すだけなら簡単だが、AI がブラウザを操作する作業面は ChatGPT と Codex に残る。ここを管理者設定、端末管理、利用者教育、監査の線へ落とし込めるかが、今回の実務上の分かれ目になる。

## 出典

- [ChatGPT - Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Evolving Atlas into ChatGPT for browser-based agentic work](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work) - OpenAI Help Center
- [ChatGPT MacOS app release notes](https://help.openai.com/en/articles/9703738-chatgpt-macos-app-release-notes) - OpenAI Help Center
