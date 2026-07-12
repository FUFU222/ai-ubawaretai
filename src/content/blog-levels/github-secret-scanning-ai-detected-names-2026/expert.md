---
article: 'github-secret-scanning-ai-detected-names-2026'
level: 'expert'
---

GitHub の 2026年7月10日更新は、secret scanning detector type の命名整理であり、検出エンジンの刷新ではない。しかし、GitHub Secret Protection を組織標準にしている企業、GitHub Advanced Security の利用状況を監査へ出している企業、Copilot や third-party coding agents の受け入れ基準を整えている企業では、かなり実務的な意味を持つ。

今回の変更で、旧 **Non-provider patterns** は **Generic patterns** になり、旧 **Copilot secret scanning** は **AI-detected secrets** になった。GitHub は detection behavior は変わらず、documentation links は redirect され、webhook events、audit log events、REST API に変更はないと説明している。したがって、技術的な初動は「連携コードを書き換える」ではなく、「運用語彙を揃える」である。

この点は [GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) の続きとして見るとよい。MCP Server 経由で secret scanning を agent 作業面に近づけるほど、検出結果の分類、例外、bypass、教育文言を一貫させる必要が出る。[GitHub第三者agent検証、AIコード安全運用の焦点](/blog/github-third-party-agent-security-validation-2026/) で整理した PR 受け入れ基準にも同じ話が入る。

## 事実: API互換性より用語互換性が論点になる

GitHub Changelog の最も重要な一文は、名称変更のみで検出挙動は同じという説明である。さらに webhook events、audit log events、REST API が変わらないなら、既存の security dashboard、alert export、ticket 作成、SIEM ingest は大きく壊れない可能性が高い。

ただし、API 互換性が保たれることと、運用上の混乱がないことは別である。多くの企業では、GitHub の alert をそのまま見るだけでなく、社内の危険度分類、Jira や ServiceNow の ticket type、Slack 通知、月次レポート、監査証跡、委託先 SLA に変換している。そこに旧称と新称が混ざると、同じ分類が別カテゴリに見える。

たとえば、2026年上期の資料では「Copilot secret scanning alert」と記録し、2026年下期の資料では「AI-detected secrets alert」と記録すると、監査担当は機能追加か検出範囲変更かを質問するかもしれない。実際には名称整理だが、説明を用意していないと、導入率、検出件数、対応 SLA の比較に余計な注釈が必要になる。

ここでの実務対応は、社内の canonical terminology を決めることだ。英語の現行名、旧称、日本語表示、短い定義、GitHub Docs へのリンク、既存 dashboard 名、alert query 名を1行にする。大げさな governance 文書ではなく、セキュリティ運用チームと開発基盤チームが同じ表を参照できればよい。

## 事実: provider、generic、AI-detectedは責任分界が違う

GitHub Docs の supported patterns は、secret scanning patterns を provider、generic、AI-detected のカテゴリで整理している。Provider は AWS、Azure、Stripe、Anthropic など、特定 provider が発行する credential に対応する。Generic は private key や database connection string のように、provider 固有ではないが構造がある secret である。AI-detected は password のように unstructured な secret を AI models で検出する分類である。

この分類は、単なる表示名ではなく remediation の違いに効く。Provider secret は、provider integration、partner notification、validity check、metadata check と接続することがある。Generic pattern は秘密鍵や接続文字列の rotate、影響範囲調査、履歴確認が中心になる。AI-detected secrets は unstructured password の疑いとして、誤検知、test data、dummy credential、実 password の判定を人間が確認する場面が増える。

Docs では、AI-detected patterns の対象として password が示され、password には push protection と validity checks が対応しないと説明されている。この一点は、運用ルールに反映したほうがよい。AI-detected secrets の alert が出たときに、provider token と同じ revoke API を期待しても進まない。逆に、validity check がないから低リスクという判断も危ない。password は再利用されている可能性があり、文脈確認と owner 確認が必要になる。

[CodeQL AI検査、プロンプト注入をSAST標準へ入れる](/blog/github-codeql-ai-prompt-injection-2026/) と同じく、AI 時代のセキュリティ機能は「AI が検出するかどうか」だけで評価できない。検出対象、false positive、false negative、alert routing、required check、例外承認、人間レビューをセットで見る必要がある。

## 分析: AI-detected secrets への改名は誤解を減らす

旧称の Copilot secret scanning は、GitHub Copilot の機能に強く見える名前だった。Copilot を使っていない組織や、secret scanning だけを GitHub Secret Protection として導入している組織では、機能の位置づけが分かりにくい。新称の AI-detected secrets は、secret scanning の検出カテゴリのひとつとして理解しやすい。

これは、GitHub が AI を branding から operation へ寄せているサインとも読める。AI 検出は Copilot という利用体験の名前ではなく、security detection の方式として説明される。開発者向けには「AI が secrets を見てくれる」ではなく、「pattern では拾いにくい unstructured secret を補完的に見る」と説明したほうがよい。

日本企業では、ここが導入説明の分かれ目になる。Copilot という名前が入っていると、開発者支援ツールの予算や利用規約の話に流れやすい。一方、AI-detected secrets という名前なら、GitHub Secret Protection、security monitoring、credential hygiene、incident response の文脈で説明できる。調達や監査の担当者にも、機能の所属を説明しやすくなる。

ただし、AI-detected secrets という名前も万能ではない。AI という言葉が入ることで、「より賢いから通常の pattern より信頼できる」と誤解される可能性がある。実際には、provider patterns、generic patterns、custom patterns、validity checks、push protection、public monitoring のどれも役割が違う。AI-detected は、既存分類の代替ではなく補完である。

## 日本企業で必要な運用変更

第一に、alert taxonomy を棚卸しする。GitHub の用語をそのまま使うなら、現行名に合わせる。社内日本語名を使うなら、英語原文との対応を固定する。たとえば「AI検出secret」「generic pattern」「provider pattern」のように短い日本語を決め、ticket template と dashboard に入れる。

第二に、社内 runbook で provider / generic / AI-detected の対応差を明記する。Provider secret なら provider 側 revoke、owner 特定、影響確認を優先する。Generic private key なら鍵の利用場所と配置範囲を確認する。AI-detected password なら、文脈、再利用、実 credential か dummy か、誰が確認するかを決める。

第三に、開発者教育を修正する。secret scanning は、secret を commit してよい理由にはならない。GitHub Docs が説明するように、検出後は credential を rotate する必要がある。履歴から文字列を消すだけでは、すでに漏れた credential の悪用可能性は消えない。教育資料には、「検出されたら削除」ではなく「失効・再発行・影響調査」を書くべきだ。

第四に、AI agent の出力経路を見直す。Copilot、Claude Code、Cursor、OpenAI Codex、GitHub MCP Server、third-party coding agents などを使うと、secret は code diff だけでなく、issue コメント、PR 本文、ログ、サンプル設定、agent の説明文にも混ざる可能性がある。[Copilot CLI security review、PR前検査の実務](/blog/github-copilot-cli-security-review-2026/) で扱ったように、PR 前検査と PR 後検査の両方を設計する必要がある。

第五に、例外承認の粒度を変える。AI-detected secrets の false positive が増えたとき、現場が一括で無視する運用に流れると危険である。例外は repository、path、secret category、理由、期限、承認者で残す。dummy credential なら、dummy であることを明示する命名規則や test fixture の作り方を整える。

## SIEMと監査レポートでは何を変えるか

SIEM 連携では、GitHub が API や audit log events を変更しないとしているため、ingest 側の破壊的な変更は避けるべきだ。まずは display label、dashboard description、runbook link、alert annotation を更新する。

既存の query 名に旧称が入っている場合は、すぐに削除せず alias を作る。過去レポートとの比較が必要なら、旧称と新称を同じ normalized category へ map する。特に四半期ごとの監査では、2026年7月10日を境に名称が変わっただけで、検出挙動が変わったわけではないと注記する。

また、metrics は alert 件数だけで見ない。provider patterns、generic patterns、AI-detected secrets で、対応時間、reopen 率、false positive 率、credential rotation 完了率を分ける。AI-detected secrets で false positive が高いなら教育や fixture 設計を見直す。Provider secrets で rotation が遅いなら owner mapping や provider 側手順を見直す。

## AIエージェント受け入れ基準への接続

AI コーディングエージェントの受け入れでは、secret scanning を「最後の網」としてだけ置くと弱い。agent が作業する前に、repository の secret scanning と push protection が有効かを確認する。作業中は MCP Server や CLI の検査導線を使えるようにする。PR では required checks、CodeQL、dependency review、secret scanning、人間レビューを通す。

このとき、AI-detected secrets は特定の agent の機能ではなく、GitHub Secret Protection の検出カテゴリとして扱うべきだ。Copilot が書いたコードでも、外部 agent が書いたコードでも、人間が書いたコードでも、最終的に repository に入るなら同じ分類で扱う。これにより、特定ツールごとの例外が増えすぎるのを避けられる。

GitHub の最近の動きは、Copilot だけを強化するというより、GitHub 上で AI agent の成果物を安全に受け入れる基盤を整える方向に見える。CodeQL の AI prompt injection query、MCP Server の secret scanning、third-party coding agents の security validation、今回の detector type 名称整理は、同じ運用面へつながっている。

## まとめ

今回の secret scanning detector type 名称変更は、技術的には小さい。しかし、GitHub Secret Protection を企業の標準統制にしているなら、運用上は見逃さないほうがよい。

日本企業がやるべきことは、検出挙動が変わったと誤解して連携コードを急いで直すことではない。旧称と新称の対応を整理し、provider / generic / AI-detected の remediation 差を runbook に書き、AI agent の PR 受け入れ基準へ secret scanning を組み込むことだ。

AI-detected secrets という名前は、Copilot の機能名ではなく、secret scanning の検出カテゴリとして読めるようになった。その整理を活かせば、開発者、セキュリティ担当、監査担当、委託先が同じ言葉で credential leak 対応を話しやすくなる。

## 出典

- [Clearer names for secret scanning detector types](https://github.blog/changelog/2026-07-10-clearer-names-for-secret-scanning-detector-types/) - GitHub Changelog, 2026年7月10日
- [Secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning) - GitHub Docs
- [Supported secret scanning patterns](https://docs.github.com/en/code-security/reference/secret-security/supported-secret-scanning-patterns) - GitHub Docs
