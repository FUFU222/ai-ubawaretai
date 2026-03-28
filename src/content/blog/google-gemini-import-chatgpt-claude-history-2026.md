---
title: "Google GeminiがChatGPTやClaudeの会話履歴インポートに対応——AIチャットの「乗り換え戦争」が始まった？"
description: "GoogleがGeminiアプリにChatGPTやClaudeからの会話履歴・メモリインポート機能を追加。データポータビリティがAIチャット市場の次の競争軸になるかもしれない。"
pubDate: "2026-03-28"
category: "news"
tags: ["Google Gemini", "ChatGPT", "Claude", "データポータビリティ"]
draft: false
---

## 何が起きたか

GoogleがGeminiアプリに、ChatGPTとClaudeからの会話履歴およびメモリ（ユーザーに関する記憶情報）をインポートできる機能を追加した。[Google公式ブログ](https://blog.google/innovation-and-ai/products/gemini-app/switch-to-gemini-app/)が2026年3月26日付で発表している。翌27日には月例の[Gemini Drop（3月版アップデート）](https://blog.google/innovation-and-ai/products/gemini-app/gemini-drop-updates-march-2026/)にもこの機能が含まれたことが確認できる。

インポートの方法は2つある。

1つ目は**メモリのインポート**。Geminiの設定画面からインポートオプションを選ぶと、Googleが用意したプロンプトが表示される。これをChatGPTやClaudeにコピペすると、そのAIがユーザーについて保存している情報を「人口統計」「興味・好み」「人間関係」「予定・イベント」「指示・設定」の5カテゴリに整理して出力してくれる。その出力をGeminiに貼り付けると、メモリとして取り込まれる仕組みだ。

2つ目は**チャット履歴の丸ごとインポート**。ChatGPTやClaudeからエクスポートしたZIPファイルを直接Geminiにアップロードできる。[The Decoder](https://the-decoder.com/googles-new-gemini-update-makes-it-easy-to-import-memories-from-chatgpt-and-claude/)の報道によると、ZIPファイルのサイズ上限は5GBで、1日あたり最大5ファイルまでアップロード可能。インポートされた会話はGeminiのサイドパネルに専用のインポートアイコン付きで表示される。同じファイルを再アップロードした場合、新しい会話が追加され、以前インポート済みの会話は上書きされる。

この機能はすべてのコンシューマー向けGeminiアカウントで利用可能だが、[PCWorld](https://www.pcworld.com/article/3100804/google-gemini-can-now-import-your-chatgpt-or-claude-chat-history.html)などの報道によると、EU経済領域（EEA）、英国、スイスでは現時点で利用できない。

あわせてGoogleは、従来の「過去のチャット（Past Chats）」機能を「メモリ（Memory）」にリブランドする変更も段階的に進めている。

## 背景・文脈

このタイミングでの発表は偶然ではないだろう。AIチャットアプリ市場は、2025年後半から2026年にかけて明確に「囲い込み vs. 乗り換え促進」の構図が見えてきた。

ChatGPTが先行してユーザーのメモリ機能を実装し、Claudeも同様の機能を展開。各サービスにユーザーが蓄積した「記憶」は、使えば使うほどそのサービスから離れにくくなるロックイン要素になっていた。

Googleはそこに「他社の記憶ごと持ってこられるよ」というカードを切った形だ。[The Decoder](https://the-decoder.com/googles-new-gemini-update-makes-it-easy-to-import-memories-from-chatgpt-and-claude/)は、この手法はもともとAnthropicが先行していたアプローチを「借りている」と指摘している。

興味深いのは、EEA・英国・スイスが除外されている点。GDPRをはじめとするデータ保護規制への対応が追いついていないことが透けて見える。AIチャットのデータポータビリティは、規制面でもまだ未整備な領域だということがわかる。

## 技術的なポイント

開発者として注目すべきは、メモリインポートの「プロンプト方式」の設計だ。

Googleは他社のAPIを叩いてデータを取得しているわけではない。ユーザー自身が競合AIにプロンプトを投げ、その出力をコピペしてGeminiに渡すという、極めてローテクだが巧妙な方法を採用している。これなら他社のAPI仕様やエクスポートフォーマットに依存しない。ChatGPTやClaudeがプロンプトに応答できる限り、機能が壊れることはない。

5カテゴリ（人口統計、興味・好み、人間関係、予定・イベント、指示・設定）への構造化も賢い。自由形式のテキストではなく、カテゴリ分けされた情報としてインポートすることで、Geminiのメモリシステムに直接マッピングしやすくなる。

一方で、ZIPファイルによるチャット履歴インポートは技術的にもっと重い処理だ。ChatGPTのエクスポートデータはJSON形式、Claudeも独自のフォーマットを持っている。5GBまで対応するということは、何年分もの会話を丸ごと取り込めることを意味する。Geminiがこれをどうインデックスして、どの程度過去の文脈を活用できるのかは、まだ実際に試した報告が少ない段階だ。

## 実務への影響・使いどころ

ここからは僕の見方だけど、この機能は「AIチャットの乗り換えコスト」を構造的に変える可能性がある。

これまでは「ChatGPTに半年分の仕事の文脈が溜まってるから離れられない」という状況が珍しくなかった。自分自身、複数のAIを使い分けているけど、それぞれに蓄積された文脈がバラバラで、統合したいと思うことがよくある。

今回のGeminiの機能を使えば、少なくとも「試しにGeminiに乗り換えてみる」ハードルは大きく下がる。特にGeminiはGoogleのエコシステム（Gmail、カレンダー、ドライブ）との統合が強みなので、Google Workspaceを業務で使っている人にとっては魅力的な選択肢になるかもしれない。

もう一つ気になるのは、OpenAIやAnthropicがこれにどう応じるかだ。データポータビリティは一方向なら「引き抜きツール」だが、双方向になれば業界全体のユーザー体験が改善される。EUのデータポータビリティ規制が今後AIチャットにも適用される可能性を考えると、各社が対応を迫られる流れになるんじゃないかと思う。

## まとめ

AIチャットの競争軸が「モデル性能」だけでなく「データの持ち運びやすさ」に広がり始めた。Geminiの今回の動きが他社の追随を呼ぶかどうか、ここ数ヶ月の動向に注目したい。

## 出典

- [How to switch to Gemini: Import your chats and data from other AI apps](https://blog.google/innovation-and-ai/products/gemini-app/switch-to-gemini-app/) — Google Blog, 2026-03-26
- [Google's new Gemini update makes it easy to import memories from ChatGPT and Claude](https://the-decoder.com/googles-new-gemini-update-makes-it-easy-to-import-memories-from-chatgpt-and-claude/) — The Decoder, 2026-03-27
- [Google Gemini can now import your ChatGPT or Claude chat history](https://www.pcworld.com/article/3100804/google-gemini-can-now-import-your-chatgpt-or-claude-chat-history.html) — PCWorld, 2026-03-27
- [Gemini Drops: New updates to the Gemini app, March 2026](https://blog.google/innovation-and-ai/products/gemini-app/gemini-drop-updates-march-2026/) — Google Blog, 2026-03-27
