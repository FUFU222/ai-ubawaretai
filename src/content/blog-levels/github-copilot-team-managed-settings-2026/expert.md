---
article: 'github-copilot-team-managed-settings-2026'
level: 'expert'
---

GitHub が2026年8月3日に発表した enterprise team specialization for managed settings は、Copilot 管理者にとってかなり実務的な更新である。GitHub Copilot の enterprise managed settings を、全社一律の設定配布から、enterprise team 単位の例外運用へ広げるものだからだ。

この変更は、[Copilot teamsモデル統制](/blog/github-copilot-enterprise-teams-model-access-2026/) の続編として読むと分かりやすい。7月31日の model policy targeting は、enterprise team を対象に追加モデルを割り当てる話だった。今回の更新は、モデルだけではなく、bypass permission、plugin、marketplace などを含む managed settings 全体の専門化である。

さらに、[Copilot遠隔操作の管理端末限定](/blog/github-copilot-remote-control-managed-devices-2026/) と [Copilot OTel管理](/blog/github-copilot-opentelemetry-managed-export-2026/) で見たように、Copilot の管理面は client、device、agent、telemetry へ広がっている。team managed settings は、それらを組織構造に合わせて配るための governance layer になる。

## 事実: server-managed settingsにteam差分を載せる

GitHub Docs の enterprise managed settings は、Copilot client behavior を中央で制御する仕組みとして説明されている。deployment method は server-managed、MDM-managed、file-based の3種類がある。今回の team specialization は、server-managed deployment で `.github-private` repository を使う文脈が中心である。

基本構成は3つのファイル群で考える。全社標準は `copilot/managed-settings.json` に置く。どの team にどの team settings file を使わせるかは `copilot/team-mappings.json` に置く。team ごとの差分は `copilot/teams/` の下に置く。GitHub は、team settings file を1つまたは複数の enterprise team slug に mapping できると説明している。

この設計で重要なのは、team file が enterprise default を自由に破壊するわけではない点である。team file には、enterprise 側で overridable と指定した key だけを含める。その他の項目は enterprise default に残る。したがって、中央管理者は「どの policy decision は全社固定で、どの decision は部門裁量にできるか」を明示的に分けられる。

Docs では precedence rules も示されている。MDM-managed settings、server-managed settings、file-based settings、user-level settings の順に強い。つまり、server-managed の team settings を使う場合でも、端末側に MDM-managed policy があるなら、そちらが勝つ領域がある。日本企業の情シス運用では、この優先順位を runbook に入れておかないと、利用者問い合わせの切り分けが難しくなる。

## 事実: overridableとadditiveは別物として扱う

team specialization には2つの設計思想が混ざっている。1つ目は overridable key である。`permissions.model` や `permissions.disableBypassPermissionsMode` のように、enterprise default に `{ "overridable": ... }` を置き、team 側が値を持つ場合だけ上書きする。team 側が値を持たない場合は default に戻る。overridable ではない key は team が変えられない。

2つ目は additive configuration である。GitHub は、`enabledPlugins` と `extraKnownMarketplaces` を team-by-team に増やせると説明している。enterprise baseline は全員に残り、team file が追加分を重ねる。これは security baseline を弱めず、職種別の拡張だけを渡すための設計である。

この違いは監査で効く。overridable key は「標準値から逸脱している team はどこか」を見る。additive key は「標準に加えて何が入っているか」を見る。両者を同じ例外台帳で扱うと、何を戻せばよいのか分かりにくくなる。モデルや bypass permission は例外値として、plugin や marketplace は追加 supply chain として別々に棚卸ししたい。

また、least restrictive value の扱いも見逃せない。複数 team に所属する利用者には、team-level settings が key ごとに組み合わされる。中央の enterprise settings は最終的な上限を持つが、team 側の差分は兼務によって想定より広がり得る。横断 team に強い設定を渡すと、その team の全メンバーに広がる。日本企業では、生成AI推進 team、security champion、platform guild のような横断組織で特に注意が必要である。

## 設計: 例外申請をGitのreview workflowに寄せる

実務での価値は、設定ファイルを `.github-private` repository に置けることにある。AI governance の変更を、口頭依頼や管理画面の個別変更ではなく、pull request、review、CODEOWNERS、issue link、commit history に載せられる。これは地味だが重要である。

たとえば、`ai-pioneers.json` に model を unmanaged にする設定を置く場合、その PR には「対象 team」「目的」「期間」「対象 repository」「費用見込み」「data handling」「rollback 条件」を書ける。security team は bypass permission を見る。platform team は client 対応と schema を見る。FinOps は AI Credits を見る。承認後に default branch へ merge すれば、設定反映は自動的に進む。

この方式は [Copilot app統制](/blog/github-copilot-app-policy-managed-settings-2026/) のような client app 管理とも相性がよい。Copilot app、CLI、cloud agent、VS Code の設定が増えるほど、管理画面で個別に変更するより、policy-as-code として review したほうが説明しやすい。特に日本企業では、内部監査や委託先説明で「誰がいつ承認したか」が必要になる。

ただし、repository を internal visibility にするだけでは十分ではない。設定 repository の write 権限、CODEOWNERS、branch protection、secret scanning、private plugin repository の access、reviewer の責任範囲を決める必要がある。AI standards source repository 自体が広すぎると、設定変更の権限が実質的に広がりすぎる。

## 導入: 最初のpilotで確認するチェックリスト

最初に確認するのは、team 台帳である。enterprise team slug、team owner、用途、所属 organization、外部メンバー、休眠アカウント、委託先、兼務者を一覧化する。team managed settings は team membership を信用するため、台帳が古い場合は機能導入より台帳更新が先である。

次に、全社固定にする key と部門裁量にする key を分ける。最初の pilot では、overridable key を最小限にする。`permissions.model` を評価 team に開く、`permissions.disableBypassPermissionsMode` は原則 disable のままにする、plugin は security review 済みのものだけ追加する、といった方針が現実的だ。

3つ目は、team file の naming である。`devs.json`、`ai-users.json`、`frontier.json` のような抽象名だけでは、後から意味が弱くなる。`security-reviewers.json`、`platform-pilot.json`、`ai-training-completed.json` のように、用途と条件が分かる名前にしたい。mapping も、1 file を複数 team に当てる場合は、なぜ同じ設定でよいのかを PR に残す。

4つ目は、client 対応である。GitHub は VS Code、Copilot CLI、Copilot app、Copilot cloud agent で enforcement されると説明しているが、key ごとの対応は同一ではない。pilot では、対象者の VS Code、CLI、app、cloud agent で、model、permission mode、plugin、marketplace が期待通り見えるかを確認する。反映までの時間、再起動、再ログインも切り分ける。

5つ目は、rollback path である。team mapping を外す、team file を削除する、overridable 指定を取り下げる、plugin を baseline から外す、MDM 側で上書きする、といった戻し方を事前に決める。公開直後の機能は、便利さより戻しやすさを重視したほうがよい。

## 監査: 設定差分、利用差分、供給網差分を見る

監査は3層に分けるべきである。第一層は設定差分である。`managed-settings.json` の default、`team-mappings.json` の mapping、`copilot/teams/*.json` の差分を月次で見る。例外 team が増え続けていないか、期間切れの pilot が残っていないか、owner 不在の team がないかを確認する。

第二層は利用差分である。team 別に AI Credits、usage metrics、問い合わせ、失敗率、review 差し戻し、incident を見る。設定を緩めた team が、目的に沿って Copilot を使っているかを確認する。上位モデルや plugin を渡しても成果が見えないなら、例外を閉じる判断ができる。

第三層は供給網差分である。`enabledPlugins` と `extraKnownMarketplaces` は additive なので、team ごとに plugin の入手元が増える。private repository、社内 marketplace、外部 marketplace、plugin version、maintainer、license、security review、rollback を追う必要がある。Copilot の plugin は便利な拡張だが、agent が使える tool surface を増やすという意味では supply chain でもある。

ここで [Copilot OTel管理](/blog/github-copilot-opentelemetry-managed-export-2026/) の観測設計が効く。設定差分だけでは、実際にどの team がどの surface で何を使ったかは分からない。OpenTelemetry、usage metrics、GitHub audit log、AI Credits を合わせて、設定と実利用を突き合わせる。特に content capture は privacy 影響が大きいため、metadata-first で始め、必要な team だけ限定的に使うのがよい。

## 日本企業での落とし穴

1つ目の落とし穴は、部門名と GitHub team が一致していると思い込むことだ。日本企業では、GitHub team が repository access の便宜で作られており、人事上の部署や委託契約の境界と一致しないことが多い。team managed settings を使う前に、team が governance unit として使えるかを確認する必要がある。

2つ目は、例外を恒久化することだ。pilot team に渡した plugin、marketplace、model、permission 例外が、そのまま半年残ると、標準が空洞化する。例外には期限を置き、期限を過ぎたら再承認か削除を求める。PR template に expiry date を入れるだけでも、棚卸しはかなり楽になる。

3つ目は、委託先と兼務者である。委託先メンバーが社内横断 team に入っている場合、想定外の team setting を受ける可能性がある。least restrictive merge を考えると、複数 team 所属は必ず検査対象にするべきだ。委託先に plugin や bypass permission の例外を渡す場合は、契約、情報取り扱い、発注側承認者、ログ閲覧権限を確認する。

4つ目は、MDM と server-managed の衝突である。端末側に MDM-managed setting がある場合、server-managed team setting より強い。利用者から見ると team に入っているのに設定が変わらないように見えることがある。情シスと開発基盤が別組織の場合、どちらの設定が勝つかを明文化しないと、問い合わせが往復する。

5つ目は、plugin access である。Docs は、private repository で plugin を host する場合、利用者がその repository へ access できる必要があると説明している。team setting で plugin を有効にしても、repository access がなければ利用者体験は崩れる。plugin の配布先 team と repository 権限は同時に設計する。

## 判断: pillar候補になり得るが自動指定しない

この更新は、`github-copilot-2026` series の中でも、モデル、権限、端末、plugin、監査を束ねる管理設計の中心に近い。既存記事の多くが個別機能を扱っているのに対し、team managed settings はそれらを policy-as-code と team governance へまとめる位置にある。

ただし、`pillar: true` は自動で付けない。pillar にするなら、人間が series 全体の導線、既存記事との重複、タイトル、内部リンク、トップページでの見せ方を確認する必要がある。本稿では pillar 候補として引き継ぎに残し、記事自体は通常記事として公開する。

## まとめ

GitHub Copilot の enterprise team specialization for managed settings は、Copilot 管理を「全社一律」から「全社標準 plus team 例外」へ進める更新である。事実として、`managed-settings.json`、`team-mappings.json`、`copilot/teams/`、overridable key、additive plugin configuration を使い、VS Code、Copilot CLI、Copilot app、Copilot cloud agent へ設定を配る設計が示された。

専門的に見ると、この機能の成否は JSON schema より運用設計で決まる。team 台帳、owner、兼務者、PR review、AI Credits、OpenTelemetry、plugin supply chain、MDM precedence、rollback を先に決めるべきだ。日本企業は、少数 team で pilot し、enterprise default を床として保ち、例外の理由と期限を必ず記録する。そのほうが、Copilot を個人裁量のAIツールではなく、監査可能な開発基盤として育てられる。

## 出典

- [Enterprise team specialization for managed settings](https://github.blog/changelog/2026-08-03-enterprise-team-specialization-for-managed-settings/) - GitHub Changelog, 2026-08-03
- [Enterprise managed settings reference](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/enterprise-managed-settings-reference) - GitHub Docs
- [Configuring enterprise-managed settings](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings) - GitHub Docs
