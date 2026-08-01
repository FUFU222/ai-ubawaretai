---
title: 'OpenAI Codex GPT-5.4退役、期限前の移行実務'
description: 'OpenAI CodexのGPT-5.4退役を整理。日本の開発チームが8月31日までにCLI/IDE、管理設定、APIキー経由との差分を棚卸しし、移行を進める実務と費用統制を解説する。'
pubDate: '2026-08-01'
category: 'news'
tags: ['OpenAI', 'Codex', 'AI モデル', 'API 料金', '管理者設定', '企業導入']
series: 'openai-codex-enterprise-2026'
draft: false
---

OpenAI は **2026年7月31日**、Codex のモデル提供について、**GPT-5.4 と GPT-5.4 mini を 2026年8月31日に退役**させると告知した。対象は、ChatGPT アカウントでサインインして Codex を使うユーザーである。推奨移行先は、GPT-5.4 から **GPT-5.6 Terra**、GPT-5.4 mini から **GPT-5.6 Luna** だ。

これは新モデル発表ではなく、Codex を日常の開発基盤として使う組織にとっての期限付き運用変更である。特に日本の開発チームでは、CLI、IDE 拡張、Codex Cloud、社内手順書、設定テンプレート、研修資料、委託先向けガイドにモデル名が散りやすい。[GPT-5.6価格改定](/blog/openai-gpt56-price-fast-mode-2026/) で整理した費用線と合わせて、モデルの棚卸しを 8月中に終える必要がある。

## 事実: 退役対象はChatGPT認証のCodex

OpenAI の ChatGPT & Codex changelog は、2026年8月31日に GPT-5.4 と GPT-5.4 mini が Codex で利用できなくなると説明している。ただし、範囲は限定されている。対象は **ChatGPT でサインインした Codex ユーザー**であり、OpenAI API の利用や、自分の API key で認証した Codex session は影響を受けない。

この切り分けは重要だ。社内で「OpenAI の GPT-5.4 が全部止まる」と伝えると、API チームが不要な緊急改修を始める可能性がある。逆に「API は影響外だから関係ない」と見ると、Codex CLI や IDE 拡張を ChatGPT 認証で使っている開発者の作業が 8月31日以降に止まる。今回の対象は、利用画面では Codex だが、認証・課金・モデル選択は ChatGPT 側の workspace に寄っている領域である。

OpenAI Help Center の Codex rate card も同じ退役告知を載せている。そこでは、Codex の token-based pricing が入力 token、cached input token、出力 token ごとの credits で整理され、GPT-5.6 Sol、Terra、Luna、GPT-5.5、GPT-5.4 などの rate が並ぶ。退役告知は、この rate card の中で「今後のモデルライフサイクル」として読むべきだ。

## 事実: 移行先はTerraとLuna

OpenAI が示した対応は明確で、GPT-5.4 を使っていた用途は GPT-5.6 Terra へ、GPT-5.4 mini を使っていた用途は GPT-5.6 Luna へ置き換える。これは単なる名前変更ではない。rate card 上では、Terra と Luna は GPT-5.6 世代のモデルであり、価格改定後の費用設計にも組み込まれている。

以前の [GPT-5.6一般提供](/blog/openai-gpt-56-ga-work-codex-api-2026/) では、Sol、Terra、Luna の 3階層を、性能、費用、業務用途の違いとして整理した。今回の退役は、その 3階層を Codex の日常運用へさらに寄せる動きである。軽い探索や補助作業は Luna、日常的な実装やレビューは Terra、より重い長時間タスクは Sol や別の高能力モデル、といった使い分けを明文化する機会になる。

ただし、モデル名を置き換えるだけでは不十分だ。GPT-5.4 mini は、軽量で長く使えるモデルとして社内資料に残っている可能性が高い。Luna へ置き換える場合も、同じ成功率、同じ応答形式、同じ cache 効率になるとは限らない。移行前に、代表的なタスクで差分を見る必要がある。

## 分析: 日本企業は設定棚卸しとして扱う

ここからは分析である。

今回の更新を「古いモデルが消えるだけ」と見ると、実務対応が遅れる。Codex はすでに、単発のチャットではなく、長時間の開発、レビュー、調査、定期作業、遠隔操作に使われ始めている。[Codex長時間運用](/blog/openai-codex-maxxing-long-running-work-2026/) で扱ったように、スレッド、メモリ、承認、定期実行、作業履歴が絡むほど、モデル指定は利用者の好みではなく運用パラメータになる。

日本企業で特に起きやすいのは、モデル指定が複数の場所に分散することだ。開発者個人の `config.toml`、IDE 拡張の設定、チームの onboarding docs、社内 wiki、研修スライド、委託先向け手順、標準プロンプト、custom agent、scheduled task、検証ログに古いモデル名が残る。管理者が workspace の model availability だけを見ても、現場の参照は消えない。

もう一つの論点は費用だ。[Codex座席設計](/blog/openai-chatgpt-business-codex-seats-2026/) で見たように、Codex は seat、credits、workspace rate card、標準席と Codex-only seat の設計が絡む。モデル移行は費用の再見積もりとセットで扱うべきである。Terra と Luna のどちらを標準にするか、Sol や Fast mode を誰に許すか、個人 credits と workspace credits のどちらで吸収するかを決めなければ、退役後に現場が場当たり的に高いモデルへ流れる。

## 実務: 8月中に見る5つの場所

第一に、Codex CLI と IDE 拡張の既定モデルを確認する。個人設定、チームテンプレート、社内 dotfiles、開発環境 bootstrap script に `gpt-5.4` や `gpt-5.4-mini` が残っていないかを見る。CLI の `/model` で手動選択している利用者にも、8月31日以降の推奨先を周知する。

第二に、workspace defaults と managed configurations を確認する。OpenAI の changelog は、期限前に workspace defaults、saved model settings、managed configurations、custom agents、scheduled tasks を更新するよう示している。つまり、利用者の画面だけでなく、管理者が配布している設定も対象になる。

第三に、custom agent と scheduled task を棚卸しする。長時間動く Codex workflow では、モデルを固定しているほうが再現性を説明しやすい一方、退役時には障害点になる。8月31日前に代表的な agent run を Terra と Luna で試し、成功率、実行時間、token 消費、レビュー負荷を比較する。

第四に、API key 経由と ChatGPT 認証を分けて社内へ説明する。OpenAI API や API key 認証の Codex session は今回の対象外だが、これは「永続利用できる」という意味ではない。API 側の deprecation は別途追う必要がある。今回は、影響範囲を切り分けて、不要な API 改修と必要な Codex 設定変更を混同しないことが大事だ。

第五に、8月末ではなく8月中旬に移行確認日を置く。退役日当日にモデル選択が消えてから対応すると、進行中の sprint、リリース前レビュー、委託先作業、障害対応と重なりやすい。8月第2週に棚卸し、8月第3週に代替モデルでの検証、8月第4週に古いモデル名の削除、という短い移行計画を作るほうが現実的である。

## まとめ

OpenAI Codex の GPT-5.4 / GPT-5.4 mini 退役は、モデル性能のニュースではなく、Codex を開発基盤として使う組織の運用期限である。対象は ChatGPT 認証の Codex で、API や API key 認証の Codex session は直接影響を受けない。だからこそ、影響範囲を正確に切り分ける必要がある。

日本の開発チームが見るべきなのは、モデル名そのものより、モデル名がどこに埋まっているかだ。CLI、IDE、管理設定、custom agent、scheduled task、社内手順、費用配賦を棚卸しし、GPT-5.6 Terra と Luna への移行を 8月中に終える。Codex のモデル棚は今後も変わる前提で、退役イベントを通常の変更管理に入れるべき段階に入っている。

## 出典

- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center
- [ChatGPT & Codex changelog](https://learn.chatgpt.com/docs/changelog) - ChatGPT Learn
- [ChatGPT Enterprise & Edu release notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
