---
title: 'Claude Science公開、研究AIの再現性とHPC導入設計'
description: 'Claude Scienceがベータ公開。日本の製薬・大学・研究開発組織が、60超の科学データベース、HPC接続、監査可能な成果物、reviewer agentをどう検証し、安全な研究AI導入へつなげるか整理する。'
pubDate: '2026-07-01'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIエージェント', 'ライフサイエンス', '監査ログ', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropicは2026年6月30日、科学研究向けアプリ **Claude Science** をベータ公開した。論文やデータベースの検索、Python・Rによる解析、図表や原稿の作成、ローカルマシンやHPCへのジョブ投入を、1つの研究環境で扱う。対象はmacOSとLinuxで、Claude Pro、Max、Team、Enterpriseの利用者に提供される。TeamとEnterpriseでは管理者による有効化が必要だ。

今回の価値は、汎用チャットに科学用の画面を足したことではない。成果物にコード、実行環境、会話履歴を結び付け、計算と出典を別のreviewer agentが確認し、研究室がすでに使う計算基盤へ接続する設計にある。一方、「履歴が残る」ことと「科学的に正しい」ことは同じではない。日本の製薬、素材、大学、公的研究機関が導入するなら、再現性、データ境界、計算資源の権限、人間による独立検証を分けて評価する必要がある。

本サイトで扱った[Anthropicの生物学エージェント研究](/blog/anthropic-agentic-biology-data-infra-2026/)は、決定的なデータ取得層と長い作業列の検証が必要だと示していた。Claude Scienceは、その考えを60超の科学データベース、skills、connectors、計算環境へ広げた実製品と読める。さらに、研究利用を企業統制へ載せる際は[Claude Compliance APIと監査基盤](/blog/anthropic-claude-compliance-api-integrations-2026/)の論点、モデルと実行費用を見る際は[Claude Sonnet 5の評価設計](/blog/anthropic-claude-sonnet-5-pricing-migration-2026/)の論点も重なる。

## 事実: Claude Scienceは研究工程を1つの環境へまとめる

Anthropicの発表によると、Claude Scienceは研究者が使うPubMed、Jupyter、R、クラスタ端末など、分断されがちな道具を1つの環境で扱うためのアプリだ。利用者は一般的な調整役のagentと対話し、agentはゲノミクス、シングルセル、プロテオミクス、構造生物学、ケモインフォマティクスなどに用意された60超のskillsとconnectorsを使う。必要に応じて別のagentや利用者が作った専門agentも呼び出せる。

製品ページでは、論文調査、データ解析、タンパク質構造、ゲノムブラウザのtrack、化学構造、図表、MarkdownやLaTeXの原稿を同じ場所で扱えると説明されている。解析から図表を作り、軸を対数表示へ変える、gridを外すといった修正を自然言語で依頼すると、agentが元のコードを編集する。見た目だけを書き換えるのではなく、表示の根拠となる処理を更新する考え方だ。

ただし、ベータ時点の主な焦点はライフサイエンスである。科学全般のあらゆる分野に同じ完成度で対応すると発表されたわけではない。日本の研究組織は、自分たちの分野で必要なデータベース、ファイル形式、解析package、装置連携が実際に使えるかを個別に確認すべきだ。

## 事実: 成果物にコード、環境、履歴を付ける

Claude Scienceが強調するのは、図表、table、notebookに、生成した正確なコード、実行環境、会話履歴を添えることだ。数カ月後でも入力と処理をたどり、編集、再実行、説明しやすくする。sessionを途中でforkし、元の流れを保ったまま2つの解析方針を比べる機能も示されている。

背景ではreviewer agentが、誤った引用、追跡できない数値、元コードと一致しない図を検出し、修正を試みる。これは研究支援AIで起きやすい「文章は自然だが、引用や計算がつながらない」問題への対策だ。ただし、reviewer agentも同じ製品内のAIである。独立した実験、統計レビュー、分野の専門家による査読、品質保証の承認を置き換える仕組みではない。

再現性についても境界がある。コードと会話が残っていても、参照データベースのversion、container image、package lock、乱数seed、hardware、環境変数、外部APIの応答が固定されていなければ、同じ結果が出るとは限らない。「履歴が見える」を出発点にして、研究室の既存ルールで必要なmetadataを補う設計が必要になる。

## 事実: ローカル、HPC、オンデマンドGPUを使い分ける

Claude ScienceはmacOS、Linux、SSH先、HPCのlogin nodeで利用できる。大規模な解析では、計画を作り、新しい計算資源へアクセスする前に利用者へ確認し、batch scriptを書いて既存クラスタへ投入する。Modal accountを接続すれば、オンデマンドのGPUも使える。PythonとRのkernelはsession内で状態を保つため、大規模データを工程ごとに読み直さずに反復できると説明されている。

データの扱いについてAnthropicは、アプリが研究室のlaptop、Linux box、HPC login nodeで動くため、大規模または機微なdatasetを既存システムに置いたままにし、各工程に必要な文脈だけをClaudeへ送る構成を示している。ここは「すべてのデータが外部へ出ない」という意味ではない。何がモデルへ送信されるか、connectorが何を読めるか、sessionや成果物がどこに保存されるかは、契約、製品設定、ネットワークログを含めて確認する必要がある。

NVIDIAはBioNeMo Agent Toolkitを、biology、chemistry、genomics、drug discovery向けのagent-callable toolsとして公開している。Claude Scienceはこのtoolkitのskillsを使い、Evo 2、Boltz-2、OpenFold3などのモデルやlibraryへ接続する。モデル本体、科学tool、計算基盤を分離し、agentが適切な道具を選ぶ構成だ。

## 事実: ベータ提供と管理者要件

Claude ScienceはClaude Pro、Max、Team、Enterprise向けのベータで、macOSとLinuxから利用できる。TeamとEnterpriseでは管理者が有効化する。したがって企業や大学の組織契約では、研究者個人がinstallできるかだけでなく、誰が利用を承認し、どのgroupへ開放し、どのconnectorや計算資源を許可するかを管理側で決める必要がある。

Anthropicは科学研究室向けのTeam planも案内しているが、契約条件や対象は組織ごとに確認が必要だ。また発表記事に掲載された「review作成が最大2年から短縮された」「解析時間が従来のおよそ10分の1になった」という内容は、特定の利用者による事例である。一般的な生産性改善率として予算計画へそのまま使うべきではない。

## 分析: 「監査可能」と「妥当」を別の評価項目にする

ここからは分析だ。

日本の研究組織が最初に避けたいのは、成果物に履歴が付くことを理由に、結果まで正しいとみなすことだ。監査可能性は、誰が、どの入力から、どのコードを使って、何を出したかを追える性質である。科学的妥当性は、研究設計、データ品質、統計手法、既知の知見との整合、再現実験を通じて判断する。前者は後者を支えるが、保証しない。

PoCの合格条件は「きれいな図が短時間でできた」だけでは弱い。同じ入力を再実行したとき主要な結論が再現するか、引用先が主張を支えているか、数値から図まで変換過程を追えるか、不適切なpackageや古いdatabaseを選んだとき警告できるかを測るべきだ。reviewer agentの指摘率だけでなく、人間が見つけた未検出エラーも記録する。

## 分析: データ境界と計算権限を分ける

研究AIの権限は、少なくとも「読む」「計算する」「書き戻す」「外部へ送る」に分けたい。公開論文や公開databaseを読む権限と、社内ELN、LIMS、臨床・患者関連情報、未公開の化合物情報を読む権限は同じではない。HPCへjobを出す権限と、共有領域のdatasetを変更する権限も分ける必要がある。

最初のPoCでは、承認済みの公開データと複製した検証用datasetだけを使い、connectorはread-only、HPC queueは上限付き、外部computeは明示承認にするのが現実的だ。jobごとにCPU/GPU時間、storage、network、失敗理由を残す。agentが作ったbatch scriptは投入前に差分を表示し、人間が承認する。ベータ製品では、利便性よりも停止と取り消しが確実に働くかを先に確かめたい。

## 日本の研究組織が試す4段階

第一段階は文献と公開databaseの読み取りである。既知のreviewテーマを選び、検索漏れ、引用の正確さ、矛盾の提示、処理時間を既存手順と比べる。新しい科学的結論を出す仕事ではなく、答えがある程度分かっている課題から始める。

第二段階は検証用datasetの再解析だ。すでに研究室内で確定した図表を、固定したpackageとseedで再作成する。Claude Scienceの成果物から、元データ、コード、environment、会話、図まで追えるかを見る。

第三段階で限定的なHPC接続を試す。専用account、専用queue、上限付きquota、read-onlyのdataset、提出前承認を用意する。失敗したjobのcleanup、credential失効、session終了後のprocess、ログ保存を確認する。

第四段階で、新しい研究課題の補助へ広げる。ここでも仮説採択、実験実施、臨床・品質判断は人間の責任に残す。再現性、正確性、費用、レビュー時間に加え、研究者がAIの提案を疑い、却下できたかも評価する。

## まとめ

Claude Scienceは、科学向けchatbotではなく、文献、database、code、figure、manuscript、HPCをつなぐ研究workbenchとして公開された。コード、環境、会話履歴を成果物へ結び付け、reviewer agentで引用や計算を確認する方向は、研究AIを検証可能にするうえで重要だ。

一方、ベータ製品の履歴機能だけで科学的妥当性、データ保護、再現性が自動的に保証されるわけではない。日本の研究組織は、公開データの読み取り、確定済み解析の再現、権限を絞ったHPC接続の順で試し、人間の独立検証と研究倫理・知財・情報管理の承認を残すべきだ。導入判断の中心は「何ができるか」より、「何を再現でき、どこで止められるか」に置くとよい。

## 出典

- [Claude Science, an AI workbench for scientists, is now available](https://www.anthropic.com/news/claude-science-ai-workbench) - Anthropic, 2026-06-30
- [Claude Science beta](https://claude.com/product/claude-science) - Anthropic
- [NVIDIA Announces BioNeMo Agent Toolkit](https://nvidianews.nvidia.com/news/nvidia-launches-bionemo-agent-toolkit-giving-ai-agents-the-tools-to-accelerate-scientific-discovery) - NVIDIA, 2026-06-23
- [Anthropic integration with Modal brings scalable compute to Claude Science](https://modal.com/blog/modal-integration-brings-scalable-compute-to-claude-science) - Modal, 2026-06-30
