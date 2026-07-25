---
article: 'openai-chatgpt-voice-work-codex-desktop-2026'
level: 'child'
---

OpenAI は 2026年7月23日、ChatGPT Business 向けの release notes で、**ChatGPT Voice が Work と Codex でも使えるようになった**と案内しました。

ここで大事なのは、ただ「声で入力できる」だけではないことです。Voice in Chat は、ChatGPT と自然に会話するための機能です。一方で Voice in Work and Codex は、Work や Codex の agent に仕事を始めさせたり、途中で止めたり、進み具合を聞いたり、複数の agent をまとめて動かしたりするための機能です。

たとえば、調査をしている Work に「先に費用の表を作って」と言う。Codex に「その修正は一度止めて、テスト結果を説明して」と聞く。別の作業中の agent に「この資料の結論をさっきのレポートへ反映して」と伝える。こういう使い方が想定されています。

## どこで使えるのか

Voice in Chat は、Desktop Chat のほか、対応している web、iOS、Android でも使えます。質問したり、考えを整理したり、会話したりする用途です。

Voice in Work and Codex は、macOS と Windows の ChatGPT desktop app が中心です。iOS からは paired remote access としてつなげますが、単独で web や mobile から使うものではありません。

つまり、日本企業で案内するときは、「スマホの Voice」と「デスクトップで Work/Codex を動かす Voice」を分けて説明する必要があります。[ChatGPTデスクトップ統合](/blog/openai-chatgpt-desktop-work-codex-classic-2026/)で整理したように、新しい desktop app では Chat、Work、Codex の入口が並びます。今回の Voice は、その中でも agent 作業を動かす入口として見ると分かりやすいです。

## 料金はどう見るべきか

Business workspace では、Voice in Chat に一定時間の利用枠があり、追加利用は 1 分あたり 5 credits と説明されています。Rate Card でも Voice は 5 credits/分です。

Voice in Work and Codex は、おおむね 6 credits/分と説明されています。ただし、ここで終わりではありません。Voice で Work や Codex に仕事を頼むと、その agent が実際に行う作業は別に shared usage pool から消費されます。

たとえば 5 分話して、そのあと Work が長い調査を走らせた場合、5 分ぶんの Voice credits と、調査作業ぶんの credits の両方を見る必要があります。この点は、[ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/)と同じです。便利になるほど、どの機能がどれだけ credits を使ったかを分けて見ることが大切です。

## 音声データの扱い

ChatGPT Voice の説明では、Live と Advanced Voice の audio clips は、チャット履歴の transcript と一緒に保存され、30 日保持されるとされています。Standard の場合は、文字起こしのあと音声は削除されるという説明です。

また、Business、Enterprise、Edu の workspace では、利用者が Voice 会話の audio/video clips をモデル改善のために共有することはできないとされています。

このため、「会社の Voice なら音声は全部すぐ消える」と説明するのは正確ではありません。逆に「全部学習に使われる」と言うのも違います。どの Voice 体験か、どの plan か、チャット履歴をどう扱うかを確認する必要があります。

## 日本企業で気をつけること

一つ目は、話してよい内容を決めることです。会議室、客先、共有スペースで顧客名、個人情報、未公開情報、障害対応の詳細、コードの秘密情報を声に出すと、周囲に聞かれるリスクがあります。音声データの保持以前に、発話環境そのものを考える必要があります。

二つ目は、承認が必要な操作を残すことです。Voice で agent に頼めるようになっても、外部送信、ファイル公開、Slack 投稿、Git 操作、PR 作成、Sites 公開などは、人間が確認する線を残したほうが安全です。

三つ目は、問い合わせ対応です。Voice が見えないときは、workspace 設定、app version、OS、マイク権限、Early Model Access、region などを確認します。単に「アプリを更新してください」だけでは切り分けられない場合があります。

## まとめ

ChatGPT Voice の Work/Codex 対応は、音声入力の便利機能というより、agent の仕事を音声で動かすための更新です。

日本企業が見るべきポイントは、どの端末で使えるか、何 credits かかるか、音声データがどう扱われるか、どの作業は人間承認を残すかです。まずは小さな部署で試し、Voice minutes、agent 作業の credits、作業完了率、レビュー差し戻しを分けて見るのが現実的です。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center, 2026-07-23
- [ChatGPT Voice](https://help.openai.com/en/articles/20001274) - OpenAI Help Center, updated 2026-07-24
- [ChatGPT Rate Card (Business, Enterprise/Edu)](https://help.openai.com/en/articles/11481834-chatgpt-rate-card-business-enterpriseedu) - OpenAI Help Center
