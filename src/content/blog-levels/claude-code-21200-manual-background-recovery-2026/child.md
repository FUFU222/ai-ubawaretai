---
article: 'claude-code-21200-manual-background-recovery-2026'
level: 'child'
---

Claude Code 2.1.200 では、AI に長い作業を任せるときの「待ち方」と「戻り方」が改善されました。

大きなポイントは、AI が人に質問したとき、返事がないまま勝手に先へ進まなくなったことです。また、パソコンがスリープしたり、裏で動く process が止まったりした後に、作業を正しく再開するための修正も入りました。

## Manualモードとは何か

Claude Code には permission mode があります。これは、ファイルを書き換えたり command を実行したりする前に、どのくらい人へ確認するかを決める設定です。

これまで `default` と呼ばれていた標準のモードは、画面上で **Manual** と表示されるようになりました。名前は変わりましたが、基本的な考え方は同じです。読み取り以外の重要な操作では、人が確認しながら進めます。

設定では、従来の `default` に加えて `manual` という値も使えます。古い設定が突然すべて使えなくなる、という意味ではありません。会社の手順書に「defaultを選ぶ」と書いてあるのに、実際の画面では「Manual」と出るため、説明を合わせておく必要があります。

権限の細かな決め方については、[Claude Codeのsubagent権限管理](/blog/claude-code-2178-subagent-permissions-2026/) も参考になります。

## 質問を待つことと権限確認は別

AI が止まる理由は一つではありません。

たとえば Claude Code が「テストが失敗しました。修正を続けますか」と聞いているなら、人の判断を待っています。これは `AskUserQuestion` という質問です。一方で「この command を実行してよいですか」と聞いているなら、tool の permission を確認しています。

2.1.200 では、質問ダイアログが既定で自動継続しなくなりました。席を外している間に、AI が適当な選択をして進むのを避けられます。必要なら `/config` で idle timeout を設定できますが、重要な承認を timeout で済ませるのは危険です。

日本企業では、仕様変更、本番反映、顧客データの利用、追加費用が発生する操作などは、人が明示的に答える形を残すべきです。返事がないなら「承認された」ではなく「保留中」と扱う方が安全です。

## background sessionはどう動くのか

background session は、terminal を閉じても裏で作業を続ける Claude Code の session です。`claude agents` の agent view を使うと、どの作業が動いているか、どれが返事待ちか、どれが終わったかを一覧で見られます。

公式ドキュメントでは、background session は別の supervisor process によって動き、状態は disk に保存されると説明されています。パソコンが sleep しても session は残り、wake 後に再接続します。

2.1.200 では、この戻り方に関する不具合がいくつも修正されました。たとえば、sleep 後に作業途中で黙って止まる問題、取り消した turn がもう一度動く問題、古い lock が残って agent を起動できなくなる問題です。

[Claude Codeのbackground agentsと監査ラベル](/blog/claude-code-otel-agents-mcp-security-2026/) では、複数 agent の状態を見る方法を扱いました。今回の更新は、見えるようにするだけでなく、止まった後に正しく戻すための改善です。

## 会社で試すなら何を確認するか

まず、テスト用の repository で長めの作業を動かします。その途中で次のことを試します。

- AI が質問したら、答えるまで本当に待つか
- terminal を閉じても background session が続くか
- パソコンを sleep してから戻しても作業を再開できるか
- `Esc` で取り消した作業が勝手に再実行されないか
- 失敗した subagent が空の成功結果として扱われないか
- 同じ command、commit、外部 API 呼び出しが二重に走らないか

重要なのは、止まった session を何でも新しく起動し直さないことです。同じ作業を新規 session で再実行すると、ファイル変更や外部サービスへの登録が二重になる可能性があります。

監視画面でも、「作業中」「人の返事待ち」「失敗」「完了」を分けましょう。返事待ちは system failure ではありませんが、放置してよい状態でもありません。担当者へ通知し、誰がいつ答えるかを決めます。

## まとめ

Claude Code 2.1.200 の大事な点は、AI を無理に動かし続けることではありません。

人の判断が必要なら正しく待つ。パソコンの sleep や process の問題なら、同じ session を安全に戻す。失敗したなら成功したふりをしない。この3つを分けることで、AI エージェントを会社の仕事へ入れやすくなります。

「自動化だから止まってはいけない」ではなく、**止まる理由が分かり、必要なときだけ一度だけ再開できること**を目標にしてください。

## 出典

- [Claude Code v2.1.200 release（Anthropic公式GitHub）](https://github.com/anthropics/claude-code/releases/tag/v2.1.200)
- [Choose a permission mode（Claude Code Docs）](https://code.claude.com/docs/en/permission-modes)
- [Manage multiple agents with agent view（Claude Code Docs）](https://code.claude.com/docs/en/agent-view)
