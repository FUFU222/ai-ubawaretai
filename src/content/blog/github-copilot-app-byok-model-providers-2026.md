---
title: 'Copilot app BYOK、モデル調達と統制の実務'
description: 'Copilot app BYOK対応を整理。日本の開発組織が外部・ローカルモデル、データ境界、AI Credits、承認ルールをどう設計し、規制業務や委託開発でagent作業を統制すべきかを見る。'
pubDate: '2026-06-24'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', 'AIエージェント', '開発者ツール', 'エンタープライズAI', '管理者設定', 'SaaSコスト管理']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年6月23日**、**GitHub Copilot app**で**BYOK**、つまり自分のAPIキーやエンドポイントを使うモデルプロバイダー接続をサポートしたと発表した。Copilot appのagent sessionで、OpenAI、Azure OpenAI、Microsoft Foundry、Anthropic、Ollama、LM Studio、OpenAI互換エンドポイントなどを選べるようにする更新だ。

これは「モデル選択肢が増えた」というだけの話ではない。[GitHub Copilot appのtechnical preview](/blog/github-copilot-app-technical-preview-2026/)と[Copilot appキャンバス](/blog/github-copilot-app-canvases-agent-work-2026/)で見えていたagent作業面に、企業側のモデル調達、データ境界、ローカル実行、課金管理が入り込む。さらに[Copilot CLI企業管理プラグイン](/blog/github-copilot-cli-enterprise-plugins-2026/)や[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)と並べると、Copilotは「GitHubが用意したモデルを使う開発支援」から、「企業がモデル・実行面・予算を選ぶ開発AI基盤」へ寄っている。

日本の開発組織が見るべき焦点は、どのモデルが強いかではない。どのデータをどのテナントへ送るのか、既存のAzure契約やAnthropic契約をどう使うのか、ローカルモデルをどの作業に限定するのか、APIキーを誰の責任で保管するのかである。

## 事実: Copilot appでBYOKモデルを選べる

GitHub Changelogによると、Copilot appはBYOKに対応し、agent sessionを自分のモデルプロバイダーに対して実行できるようになった。発表で挙げられたプロバイダーは、OpenAI、Azure OpenAI、Microsoft Foundry、Anthropic、LM Studio、Ollama、OpenAI互換エンドポイントだ。設定画面のModel ProvidersからエンドポイントとAPIキーを登録し、追加後はCopilot-hosted modelと並んでmodel pickerに表示される。

GitHub Docsでも、Copilot appで外部プロバイダーのAPIキーを登録し、そのモデルをagent sessionで使えると説明している。Docs上の対応プロバイダーには、OpenAI、Azure OpenAI、Microsoft Foundry、Anthropic、Ollama、Foundry Local、LM Studio、OpenAI互換HTTP endpointが並ぶ。APIキーはOSのcredential storeに保存され、UIから読み戻されないと説明されている。

同時に、これはpublic previewであり、変更される可能性がある。BusinessやEnterpriseでCopilot appを使う場合は、組織またはenterpriseの管理者がCopilot CLIをpolicy settingsで有効化する必要がある。この条件は、Copilot appが単なるデスクトップUIではなく、CLIやagent実行面と近い管理対象であることを示している。

## 既存Copilot app更新と何が違うのか

5月のCopilot app technical previewは、Issue、Pull Request、prompt、過去sessionからagent作業を始める入口だった。6月2日のcanvases更新は、agentが進める作業をplan、browser、terminal、release checklist、incident boardのような作業物で見えるようにする方向だった。

今回のBYOKは、その作業面で使う「頭脳」と「推論経路」を企業側が選ぶ更新だ。GitHub-hosted modelだけでなく、自社がすでに契約しているAzure OpenAI、Anthropic、Microsoft Foundry、あるいは社内gateway、ローカルのOllamaやLM Studioを選べる。これは、agent sessionの設計表にモデル調達とデータ経路を入れるべきだという意味になる。

たとえば、社内ツールのREADME修正ならGitHub-hosted modelで十分かもしれない。一方、顧客名を含む検証環境のUI調査や、金融・医療・公共系の開発支援では、推論トラフィックを自社クラウド契約、特定リージョン、内部gatewayに寄せたい場合がある。BYOKはその選択肢をCopilot appのmodel pickerへ持ち込む。

## 日本企業での実務論点

最初に見るべきなのは、データ境界だ。GitHubの発表は、BYOKにより自分のcloud account、tenant、internal gateway経由で推論を流せると説明している。これは、日本企業でよく問題になる「コードや業務文脈をどこへ送ってよいか」という議論に直結する。

ただし、BYOKにすれば自動的に安全になるわけではない。Azure OpenAIを使うならAzure側の契約、リージョン、ログ、network設定を見る。Anthropicを使うなら契約上のデータ取り扱いと組織の許可範囲を見る。OpenAI互換gatewayを使うなら、そのgatewayがどの下流モデルへ転送し、何をログとして残すかを見る。ローカルモデルを使うなら、品質、更新、モデル配布、端末管理、プロンプトログの扱いを見る必要がある。

次に、費用の境界だ。GitHub-hosted modelを使う場合はCopilot側のAI Credits管理が中心になる。一方、BYOKでAzure、OpenAI、Anthropic、Foundry、社内gatewayを使うなら、Copilotの利用ログと外部プロバイダーの課金ログが分かれる可能性がある。開発部門はCopilot appを使っているつもりでも、費用は別のクラウド請求に出るかもしれない。

三つ目は、承認ルールだ。BYOK providerを誰が追加してよいのかを決める必要がある。個人の検証なら個人APIキーでよい場面もあるが、企業利用では、プロジェクトごとの承認済みprovider、禁止provider、ローカルモデル利用の範囲、APIキーの発行者、退職・異動時の失効手順を決めるべきだ。

## ローカルモデルは万能ではない

OllamaやLM Studioが対応対象に入る点は、開発者にとって魅力的だ。ローカルモデルなら、軽いコード読解、ログ整形、テストデータ生成、ドキュメント草案などを手元で試しやすい。顧客データを含まない範囲であれば、クラウド推論の費用を抑える選択肢にもなる。

しかし、ローカルモデルを「データが外へ出ないから常に安全」と見るのは危険だ。端末にモデルと入力が残る。端末管理が弱ければ、むしろ情報が散らばる。モデル品質が低いままagent sessionに使うと、誤ったコード変更、見落とし、不要な再試行が増える。企業で使うなら、どの作業をローカルモデルに任せ、どの作業はフロンティアモデルや承認済みクラウドモデルに回すかを分ける必要がある。

実務では、ローカルモデルは「低リスクな前処理」から始めるのがよい。ログ要約、issueの分類、README下書き、テストケース案、コードベース探索の補助などだ。設計判断、セキュリティ修正、複雑なリファクタ、顧客データを含む分析、本番障害対応のような作業は、人間レビューと高信頼モデルを前提にした方がよい。

## 導入前に決めること

導入前に、少なくとも4つの表を作るべきだ。

1つ目は、provider許可表である。GitHub-hosted model、Azure OpenAI、Anthropic、Microsoft Foundry、社内gateway、Ollama、LM Studioを並べ、どのチーム、どのrepository、どのデータ分類で使えるかを決める。

2つ目は、作業分類表である。ドキュメント、テスト、軽微なbug fix、UI検証、依存関係更新、セキュリティ修正、DB migration、顧客データ処理などを分け、どの作業をどのproviderへ渡せるかを書く。

3つ目は、費用表である。Copilot AI Creditsで見る利用、外部クラウド請求で見る利用、ローカル実行で見る端末負荷を分ける。BYOKを使うほど、Copilot管理画面だけでは費用の全体像を説明しにくくなる。

4つ目は、鍵管理表である。APIキーを誰が発行し、どこに保存し、誰が失効し、どのログで利用を追うかを決める。GitHub DocsはキーがOSのcredential storeに保存されると説明しているが、企業としての発行・失効・棚卸し責任までは自動で決まらない。

## まとめ

Copilot appのBYOK対応は、Copilot appのagent sessionにモデル調達とデータ境界の選択肢を持ち込む更新だ。GitHub-hosted modelだけでなく、OpenAI、Azure OpenAI、Microsoft Foundry、Anthropic、Ollama、LM Studio、OpenAI互換エンドポイントを選べることで、企業は既存契約、リージョン、内部gateway、ローカル実行を使い分けられる。

日本の開発組織にとって重要なのは、「好きなモデルを選べる」ことではない。どの作業をどのモデルへ渡し、どのデータをどのテナントへ流し、どの費用をどの予算で見て、どのAPIキーを誰が管理するかである。Copilot appを広げるなら、BYOKは便利機能ではなく、agent作業の統制設計として扱うべきだ。

## 出典

- [GitHub Copilot app support for BYOK](https://github.blog/changelog/2026-06-23-github-copilot-app-support-for-byok/) - GitHub Changelog, 2026-06-23
- [Using your own LLM models in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/use-byok-models) - GitHub Docs
- [Getting started with the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/getting-started) - GitHub Docs
