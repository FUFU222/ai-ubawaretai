---
article: 'github-copilot-cloud-agent-reasoning-level-2026'
level: 'child'
---

GitHub Copilot cloud agent に、**reasoning level** を選ぶ機能が加わった。簡単に言うと、Copilot にタスクを頼むとき、「どれくらい深く考えてから作業してほしいか」を選べるようになった、ということだ。

この機能は便利だが、何でも高くすればよいわけではない。GitHub は、高い reasoning level は複雑な問題でよい答えにつながる可能性がある一方、時間が長くなり、より多くの AI Credits を使うと説明している。AI Credits は、Copilot の重い AI 利用で使われる費用の単位だと考えると分かりやすい。

## cloud agentとは何か

Copilot cloud agent は、開発者のパソコンの中で動く普通のチャットとは少し違う。GitHub 上で issue や pull request comment から仕事を頼むと、Copilot が GitHub Actions の環境で repository を調べ、計画を作り、branch に変更を作る。必要なら pull request まで進められる。

たとえば「このテストが落ちる原因を調べて修正して」「この機能にログを追加して」「古い API 呼び出しを新しい形に直して」といった仕事を頼める。人間はあとで差分を見て、レビューし、merge するかどうか決める。

だから reasoning level は、短い質問への返答だけの話ではない。高く設定した結果、Copilot が作る計画、commit、test 実行、pull request の中身が変わる可能性がある。

## 何が変わったのか

今回の更新で、対応するモデルでは cloud agent のタスク開始時に reasoning level を選べるようになった。モデルを選ぶ画面がある入口では、モデルに加えて reasoning level の選択肢が出る。

ただし、どこからでも選べるわけではない。GitHub Docs では、GitHub.com で issue を Copilot に割り当てる場合、pull request comment で `@copilot` に頼む場合、Agents tab や agents panel、GitHub Mobile など、一部の入口が説明されている。選ぶ画面がない入口では Auto が使われる。

対応モデルも変わる可能性がある。GitHub は supported models の一覧を公開しており、モデルごとに利用できる client や拡張機能が違う。使う前に、会社で許可されているモデルと、実際に reasoning level を選べるモデルを確認したほうがよい。

## いつ高くすればよいか

高い reasoning level が向きやすいのは、問題が複雑なときだ。たとえば、複数のファイルにまたがる不具合、設計判断が必要な変更、原因が分からないテスト失敗、古いコードの整理などである。

反対に、README の誤字修正、軽いコメント追加、決まった形式の documentation 更新のような作業では、高い reasoning は大げさかもしれない。答えがほぼ決まっている作業に毎回深く考えさせると、時間と AI Credits の消費だけが増えやすい。

小学生向けに言えば、簡単な計算に毎回長い証明を書かせる必要はない。でも、難しい文章問題では、途中式をしっかり考えたほうがよい。reasoning level は、その「途中でどれくらい考えるか」を選ぶ設定に近い。

## 会社で決めること

会社で使うなら、誰でも好きに高い reasoning を選ぶ形にはしないほうがよい。まず、仕事の種類を分ける。簡単な修正、普通の実装、難しい設計判断、AI に任せてはいけない作業、という4つくらいで十分だ。

次に、それぞれで推奨する設定を決める。簡単な修正は低め、普通の実装は標準、難しい設計判断は高め、認証や決済や個人情報に関わる作業は人間承認必須、というようにする。

この考え方は、[CopilotのAI credit session limit](/blog/github-copilot-cli-ai-credit-session-limits-2026/) と似ている。1回の仕事で使いすぎないようにするだけでなく、仕事の大きさを小さく分けることが大事だ。[Copilot cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/) のように、どの repository で agent が何を使えるかを見る仕組みも合わせて考えたい。

## まとめ

Copilot cloud agent の reasoning level は、Copilot に深く考えさせるための新しい設定である。複雑な仕事では役に立つ可能性があるが、時間と AI Credits も増える。

日本の開発チームは、すべてを高くするのではなく、仕事の難しさで使い分けるべきだ。簡単な仕事は軽く、難しい仕事は深く考えさせる。そして、最後に人間が review する責任は残る。便利な設定ほど、使う場面を決めておくことが大切である。

## 出典

- [Customize the reasoning level for Copilot cloud agent](https://github.blog/changelog/2026-08-03-customize-the-reasoning-level-for-copilot-cloud-agent/) - GitHub Changelog, 2026-08-03
- [Changing the AI model for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/changing-the-ai-model) - GitHub Docs
- [About GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) - GitHub Docs
