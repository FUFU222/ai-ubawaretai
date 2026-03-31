---
title: 'Shopify「Agentic Storefronts」が560万店舗をAIチャットに接続——ECの主戦場はブラウザからAIエージェントに移るのか？'
description: 'ShopifyがAgentic Storefrontsを全対象マーチャントに展開。ChatGPT・Copilot・Gemini内で商品が発見・購入可能に。OpenAIのInstant Checkout撤退と、新たに登場したUniversal Commerce Protocolの技術的背景を読み解く。'
pubDate: '2026-03-31'
category: 'news'
tags: ['Shopify', 'AI コマース', 'ChatGPT', 'UCP', 'エージェント']
draft: false
---

ShopifyがAgentic Storefrontsを全対象マーチャントに対して有効化した。[Shopify公式ニュースルーム](https://www.shopify.com/news/agentic-commerce-momentum)によると、3月24日のロールアウト以降、560万店舗の商品がChatGPT、Microsoft Copilot、Google AI Mode、Geminiアプリ内で発見・購入可能になっている。

これ、めちゃくちゃ大きい話だと思う。「AIで買い物が便利になる」みたいなふわっとした話じゃなくて、ECの流通構造そのものが変わる入口かもしれない。

## 何が起きたか

3月24日、Shopifyは全対象マーチャントのAgentic Storefrontsを一斉に有効化した。[Shopify公式の発表](https://www.shopify.com/news/winter-26-edition-agentic-storefronts)では、CEO Tobi Lütkeが「すべてのShopifyストアをデフォルトでエージェント対応にする」と述べている。対応するAIチャネルはChatGPT、Microsoft Copilot、Google検索のAI Mode、Geminiアプリの4つで、Shopify Admin上で一括管理できる。

ポイントは「オプトアウト方式」で展開されたこと。マーチャント側で特別な設定をしなくても、Shopify Catalogを通じて商品データが自動的にAIプラットフォームに配信される。在庫・価格はリアルタイム同期で、注文はChatGPT経由のリファラル情報付きでAdminに流れ込む仕組みだ。

同時に注目すべきなのが、OpenAI側の方針転換だ。[Modern Retail](https://www.modernretail.co/technology/shopify-says-purchases-are-coming-inside-chatgpt-through-agentic-storefronts-as-openai-retreats-on-instant-checkout/)が報じたところによると、OpenAIは2026年1月から運用していた「Instant Checkout」を廃止した。Instant Checkoutはチャット内で決済を完結させる仕組みで、マーチャントに対して売上の4%を手数料として徴収していた。しかしオンボーディングが煩雑で、稼働していたマーチャントはわずか約30店舗にとどまっていたという。新方式では、購入者がチャット内で商品を閲覧した後、モバイルではアプリ内ブラウザ、デスクトップでは別タブでマーチャントのチェックアウトに遷移する。

さらにShopifyは、自社のEC基盤を使っていないブランド向けに「Agentic Plan」も公開した。Shopify Catalogに商品を登録するだけで、同じAIチャネルを通じた販売が可能になる。

## 背景・文脈

この動きの背景には、2026年1月のNRFカンファレンスで発表されたUniversal Commerce Protocol（UCP）がある。[TechCrunch](https://techcrunch.com/2026/01/11/google-announces-a-new-protocol-to-facilitate-commerce-using-ai-agents/)によると、UCPはGoogleとShopifyが共同開発したオープンスタンダードで、AIエージェントがマーチャントと接続して取引を行うための共通規格だ。ローンチ時点でWalmart、Target、Etsy、Best Buy、Macy's、The Home Depot、Mastercard、Visa、Stripeなど20社以上がエンドースしている。

OpenAIのInstant Checkout撤退は、この文脈で読むとよく分かる。OpenAIは独自のクローズドな決済レイヤーを作ろうとしたが、マーチャントとプラットフォーム双方から支持を得られなかった。一方でUCPというオープンスタンダードが業界の大手を巻き込んで形成されつつあり、チャット内決済に4%の手数料を課すモデルは成立しなくなったのだろう。

OpenAIは公式に「マーチャントとユーザーが今いる場所に、よりよく寄り添う形にコマースのアプローチを進化させる」と[述べている](https://www.modernretail.co/technology/shopify-says-purchases-are-coming-inside-chatgpt-through-agentic-storefronts-as-openai-retreats-on-instant-checkout/)。言い方は穏やかだが、要はInstant Checkoutの失敗を認めた形だ。

2026年3月のGoogle UCP関連アップデートでは、Cart（AIエージェントが単一ストアから複数商品をバスケットに追加）、Catalog（リアルタイム在庫・価格取得）、Identity Linking（ロイヤルティプログラムのクロスプラットフォーム共有）の3つの新機能が追加されている。エージェントコマースのインフラが急速に整備されている証拠だ。

## 技術的なポイント

UCPのアーキテクチャが面白い。[Shopify Engineering](https://shopify.engineering/UCP)の技術ブログによると、UCPはTCP/IPにインスパイアされたレイヤード設計を採用している。

最下層のShopping Serviceがチェックアウトセッション、ラインアイテム、合計額、メッセージ、ステータスといった取引プリミティブを定義する。その上にCheckout・Orders・Catalogといった機能単位のCapabilitiesレイヤーが乗り、さらにドメイン固有のExtensionsがコンポジションで機能を拡張する。

ディスカバリの仕組みも洗練されている。マーチャントはドメインの `/.well-known/ucp` にプロファイルを公開し、AIエージェントは自身がサポートするCapabilitiesをURL経由で宣言する。リクエスト時にエージェントがプロファイルURLを渡すと、マーチャント側が双方のCapabilitiesの共通部分を計算してレスポンスを返す。HTTPのContent Negotiationと同じ発想だ。

チェックアウトの状態遷移も明確に定義されている。`incomplete`（情報不足、エージェントがAPI経由で解決を試みる）、`requires_escalation`（購入者の入力が必要、`continue_url`でブラウザに引き渡す）、`ready_for_complete`（エージェントがプログラム的に決済完了）の3状態で管理される。つまりAIエージェントが自律的に処理できる範囲と、人間に委譲すべき範囲が設計レベルで切り分けられている。

拡張の仕組みもよくできていて、逆引きドメイン名（`com.vendorname.*`）でExtensionの名前空間を管理する。中央のコミッティに承認を取る必要がなく、各ベンダーが独立してスキーマを定義できる。ここにMCP、A2A（Agent-to-Agent）、AP2（Agent Payments Protocol）といった複数のプロトコルも統合される設計だ。

開発者的に「これは効いてくるな」と思ったのは、MCPとの統合だ。MCPはAIエージェントの外部ツール接続の事実上の標準として9,700万インストールを超えている。UCPがMCPをトランスポートの一つとしてサポートしているということは、既存のMCPベースのAIエージェント（Claude Code、Codex、Copilot等）がそのままコマース機能にアクセスできるようになる道筋が見えている。

## 実務への影響・使いどころ

ここからは僕の見方だけど、この変化のインパクトは「AIで買い物が便利になる」というレベルに留まらないと思っている。

まず、検索トラフィックの構造が変わる。これまでECの集客は「Google検索 → 商品ページ」が主軸だった。でも560万店舗がAIチャットから直接発見可能になると、「ChatGPTに『予算3万円でノイキャン付きワイヤレスイヤホン探して』と聞く → その場で比較・購入」というフローが一般化する可能性がある。SEOの重要性が下がるとは言わないが、AIエージェント経由の商品発見を最適化する「AEO（Agent Experience Optimization）」みたいな概念が出てくるんじゃないだろうか。

開発者にとって直接関係があるのはUCPだろう。`/.well-known/ucp` にプロファイルを置くだけでAIエージェントから発見可能になるというのは、robots.txtやsitemap.xmlと同じ手軽さだ。自社のECシステムがShopifyでなくても、UCPに準拠すればエージェントコマースに参加できる。特にヘッドレスコマースや独自ECを運用している開発者にとっては、今後UCPの仕様を追う価値は大きいと感じる。

オプトアウト方式での展開は賛否ありそうだ。マーチャントの参入障壁を下げた一方で、「知らないうちにChatGPTで商品が売られていた」という事態も起こりうる。価格戦略や地域制限をかけている事業者にとっては、意図しないチャネルへの露出がリスクになるかもしれない。

## まとめ

ECの主戦場がブラウザからAIエージェントに移行する最初の大きな転換点になるかもしれない。UCPという業界横断のオープンスタンダードが実装段階に入ったことで、この流れは特定プラットフォームの戦略を超えた構造的なものになりつつある。

## 出典

- [Millions of merchants can sell in AI chats](https://www.shopify.com/news/agentic-commerce-momentum) — Shopify Newsroom, 2026-03-24
- [Introducing Shopify Agentic Storefronts](https://www.shopify.com/news/winter-26-edition-agentic-storefronts) — Shopify Newsroom, 2025-12-10（2026年3月更新）
- [Shopify says purchases are coming 'inside ChatGPT' through agentic storefronts](https://www.modernretail.co/technology/shopify-says-purchases-are-coming-inside-chatgpt-through-agentic-storefronts-as-openai-retreats-on-instant-checkout/) — Modern Retail, 2026-03-12
- [Google announces a new protocol to facilitate commerce using AI agents](https://techcrunch.com/2026/01/11/google-announces-a-new-protocol-to-facilitate-commerce-using-ai-agents/) — TechCrunch, 2026-01-11
- [The agentic commerce platform](https://www.shopify.com/news/ai-commerce-at-scale) — Shopify Newsroom, 2026-03
- [Building the Universal Commerce Protocol](https://shopify.engineering/UCP) — Shopify Engineering, 2026
