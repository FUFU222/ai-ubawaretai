---
article: 'github-copilot-ai-credit-pool-cost-center-2026'
level: 'child'
---

GitHubは、会社で使うGitHub CopilotのAI Creditsを、cost centerという部門のような単位で分けて守れる機能を追加しました。名前はAI credit pool、公式ドキュメントではincluded usage controlと呼ばれています。

Copilot BusinessやEnterpriseでは、ライセンスに含まれるAI Creditsを会社全体で共有します。共有すると、よく使うチームが余った枠を活用できる利点があります。しかし、一部のチームが使いすぎると、別のチームが自分たちのライセンス分を十分に使えないこともあります。新機能は、その偏りを抑えるための仕組みです。

## 何が変わったの？

これまでは、会社全体の大きな箱にAI Creditsが入っているイメージでした。どの部門がどれだけライセンス料を払っていても、先に使った部門が共有枠を多く消費できました。

新機能を有効にすると、cost centerごとに、その部門へ割り当てたCopilotライセンスが生み出す分までを使える枠にできます。上限の数字は管理者が自由に決めるのではなく、GitHubがライセンス数から自動で計算します。メンバーやライセンスが増減すれば、枠も調整されます。

たとえば開発部と営業支援部がそれぞれCopilotの費用を負担している場合、開発部の重いAI利用によって営業支援部の含有枠が先に消える問題を減らせます。部門別に費用を管理する会社では説明しやすくなります。

## 3つの予算を混同しない

Copilotには似た名前の予算機能がありますが、役割は別です。

AI credit poolは、会社全体の共有プールからcost centerが使える**含有分**を守ります。まだ追加料金が発生していない段階で働く部門単位の制御です。

user-level budgetは、1人が使えるAI Creditsの総量を止めます。共有枠を使っているときも、追加料金の段階でも有効です。上限へ達した人は必ず止まります。

cost center budgetは、共有枠を使い切った後の**追加料金**を部門単位で管理します。AI credit poolが残っている間の利用量は制限しません。

そのため、会社では3つを組み合わせます。部門の含有枠をAI credit poolで守り、1人の使いすぎをuser-level budgetで抑え、追加料金をcost center budgetで管理します。

## 上限へ達したらどうなる？

cost centerがAI credit poolを使い切った後は、利用を止めるか、追加料金を払って続けるかを選べます。止めれば予算を守れますが、リリース前や障害対応中でもCopilotの一部機能が使えなくなる可能性があります。

追加料金を許可すれば作業は続けやすくなりますが、別の予算管理が必要です。重要な仕事だけ例外で続けるのか、誰が承認するのか、月末に止まりそうなとき誰へ連絡するのかを決めておくべきです。

また、AI credit poolが残っていても、個人のuser-level budgetを使い切ればその人は止まります。反対に、個人枠が残っていても部門や会社の追加課金予算で止まることがあります。画面に「使えない」と出たとき、どの上限が原因かを管理者が調べられるようにします。

## 日本企業は何を確認すればいい？

最初に、cost centerへ誰を入れるかを決めます。GitHubではorganization、repository、user、enterprise teamなどをcost centerへ割り当てられます。enterprise teamを使うと、人が参加・離脱したときにメンバーを自動で更新できます。

ただし、会社の部門とGitHub上のチームが同じとは限りません。複数部署を兼務する人、子会社の開発者、外部委託先、全社共通の基盤チームをどこへ配賦するかは先に決める必要があります。

次に、少数の部門で試します。通常利用の部門と、Copilot CLIやcloud agentを多く使う部門を選び、上限前後の動作、追加料金、停止通知を確認します。公開時点ではREST APIから設定するため、誰が何を変更したかも記録します。

最後に、月ごとの利用量と成果を一緒に見ます。AI Creditsが多い人が悪いとは限りません。大きな移行や調査を任された人は利用が増えます。逆に利用量が少なくても、短い補完で十分な成果を出している場合があります。予算は人を順位付けするためではなく、必要な仕事へ枠を配るために使います。

## まとめ

GitHub CopilotのAI credit poolは、会社全体で共有する含有AI Creditsをcost centerごとに守る機能です。他部門に枠を先に使われる問題を減らし、部門別の費用責任を分かりやすくします。

ただし、個人上限や追加料金の予算とは役割が違います。AI credit pool、user-level budget、cost center budgetの3つを分けて設計し、上限へ達したときに止めるか続けるかを先に決めることが重要です。

## 出典

- [Cost centers now support AI credit pools](https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps/) - GitHub Changelog, 2026-07-02
- [Budgets for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Using cost centers to allocate costs to business units](https://docs.github.com/en/enterprise-cloud@latest/billing/how-tos/products/use-cost-centers) - GitHub Docs
