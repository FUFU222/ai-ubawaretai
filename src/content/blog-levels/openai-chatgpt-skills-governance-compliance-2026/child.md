---
article: 'openai-chatgpt-skills-governance-compliance-2026'
level: 'child'
---

OpenAI は 2026年5月27日、ChatGPT Enterprise と Edu 向けに Skills の管理機能を更新しました。Skills は、ChatGPT に同じ作業をより安定してやらせるための再利用できるワークフローです。指示文だけでなく、例、補助ファイル、コードを含められます。

今回の更新で大事なのは、Skills を「便利なテンプレート」ではなく、会社で管理する対象として扱いやすくなったことです。Enterprise と Edu では Skills は早期アクセスで、引き続き既定ではオフです。管理者が有効化する前提になっています。

## 何が増えたのか

OpenAI の release notes では、主に4つの更新が説明されています。

1つ目は、管理者向けの Skills ページです。管理者は workspace 内の Skills を確認し、アクセスを変えたり、owner を変更したり、不要な Skill を削除したりできます。

2つ目は、Permissions & roles の細かい権限です。誰が Skills を使えるか、誰が Skill ファイルをアップロードできるか、誰が共有できるか、誰が workspace に公開できるか、誰が他のメンバーにインストールできるかを分けられます。

3つ目は、アップロードされた Skills のスキャンです。ユーザーが Skill をアップロードすると、ChatGPT は使えるようにする前にスキャンします。多くはすぐ使えますが、確認が必要なものはレビューを求められ、危険そうなものはブロックされます。

4つ目は、Compliance Logs Platform の対応です。Skills の list、export、delete が対象になり、会話イベントには `skill_id` が入ります。つまり、どの会話でどの Skill が使われたかを後から追いやすくなります。

## なぜ会社では注意が必要なのか

Skills は、ただのプロンプト集ではありません。会社の仕事の進め方を ChatGPT に渡す部品です。たとえば、営業資料を作る手順、法務レビューの観点、障害報告の書き方、コードレビューの基準などを Skill にできます。

これは便利ですが、同時に危険もあります。古い手順が残っていたり、外部から持ち込んだ Skill によくない指示が入っていたり、退職した人が owner のままになっていたりすると、会社全体に影響する可能性があります。

そのため、日本企業では、Skills を有効化する前にルールを決めたほうがよいです。誰が作ってよいのか。誰が公開してよいのか。外部 Skill を持ち込んでよいのか。使った記録をどこに残すのか。これらを先に決める必要があります。

## 管理者が見るポイント

最初に見るべきなのは upload 権限です。外部から受け取った Skill や、インターネット上で配られている Skill をそのまま使うのは危険です。OpenAI のスキャンは助けになりますが、会社のレビューを置き換えるものではありません。

次に、publish と install の権限を分けることが大切です。workspace に公開することと、他の人にインストールすることは影響が違います。全社員に使わせる Skill は、業務 owner とレビュー期限を決めておくべきです。

最後に、監査ログです。Compliance Logs の保持は30日と説明されています。もっと長く残したい会社は、自社の SIEM やデータレイクに継続的に取り込む設計が必要です。

## まとめ

今回の OpenAI 更新は、ChatGPT Skills を広げるためだけの機能ではありません。増えた Skills を会社が管理し、後から確認できるようにするための更新です。

日本企業が見るべきポイントは、Skills をオンにするかどうかだけではありません。誰が作り、誰が公開し、誰がレビューし、どのログで確認するかです。Skills は今後、会社の業務手順そのものに近づいていきます。だからこそ、便利さより先に管理設計が必要です。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-05-27
- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066) - OpenAI Help Center
- [OpenAI Compliance Platform for Enterprise and Edu Customers](https://help.openai.com/en/articles/9261474-openai-compliance-platform-for-enterprise-and-edu-customers) - OpenAI Help Center
