---
article: 'openai-chatgpt-usage-limits-enterprise-2026'
level: 'expert'
---

OpenAI が 2026年6月18日に追加した ChatGPT Enterprise / Edu 向け **Usage limits** は、管理画面の細かな更新に見えるが、実務上はかなり大きい。workspace、group、user 単位で月次 credit 上限を設定でき、既存の週次 limit は 2026年7月15日に月次 default へ自動移行される予定だからだ。

この更新は、ChatGPT の企業導入が「席を配る」段階から、「credit をどの単位で配り、誰が増枠を承認し、どの業務を高利用として扱うか」を決める段階へ移っていることを示している。特に Codex、Deep Research、ファイル分析、connected apps、workspace agents が同じ workspace 内で使われる組織では、利用量の偏りが費用と運用停止の両方に効く。

すでに OpenAI は、[ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) で connected apps の操作承認を、[ChatGPT Library管理](/blog/openai-chatgpt-library-admin-controls-2026/) で社内知識の扱いを、[Codex支出管理](/blog/openai-codex-business-spend-controls-2026/) で開発 agent の費用統制を前面に出してきた。Usage limits は、その管理面に「月次 credit 配分」という財務・情シス向けの軸を足す更新である。

## 事実: Usage limitsの設定単位

OpenAI Help Center によると、Usage limits は ChatGPT Enterprise / Edu の管理者と owner が Workspace settings で設定する。member や analytics viewer は設定できない。上限は calendar month 単位で管理され、月次 window は UTC でリセットされる。

設定レイヤーは3つある。workspace limit は workspace users 全体に適用する標準の月次 cap である。group limit は特定 group に属する各ユーザーへ適用する月次 cap である。user limit は特定ユーザーへの override で、例外的に高い上限または低い上限を置くために使う。

この設計では、「部署全体で何 credits まで」という aggregate budget を直接置くわけではない。基本はユーザー単位の月次 cap である。したがって、部門予算をそのまま group limit に入れるのではなく、部門内の対象人数、利用職種、想定 workflow を踏まえて、1ユーザーあたりの cap へ変換する必要がある。

増枠申請も重要だ。Usage limits では、ユーザーが上限に達したときに増枠申請できる導線を管理者が有効化できる。申請は Pending Requests で処理でき、custom destination による社内申請ページへの誘導も可能とされている。承認された増枠は temporary increase ではなく、user override として残る。ここを理解しないと、緊急対応のつもりで承認した例外が翌月以降も残り、予算配分を歪める。

## 事実: 7月15日の移行で何が変わるか

OpenAI は、既存の Workspace settings -> Permissions & roles -> Set weekly limits は当面利用できるが、新しい Usage limits が設定されている場合はそちらが優先されると説明している。さらに、2026年7月15日には残っている weekly limits を monthly workspace / group default に自動移行し、その後は weekly limits setting が効かなくなる。

週次 limit と月次 limit は、単位が違うだけではない。週次では利用枠が短い周期で回復するため、ピークが週をまたげば自然に緩和される。一方で月次では、月初に大きく使うと月末まで残枠が減る。予算管理には向くが、業務ピークとぶつかると「今月はもう使えない」状態が起きやすい。

日本企業では、月次締め、部門配賦、稟議、年度予算の都合から月次管理は理解されやすい。一方で、現場の作業は月次に均等ではない。開発チームはリリース前、営業企画は提案時期、経理は月末月初、教育機関は授業・試験期間に利用が偏る。Usage limits を導入するなら、月次 cap を単なるコスト上限ではなく、業務カレンダーと合わせた運用設定として扱うべきだ。

## 優先順位の設計リスク

複数の limit が設定されている場合、OpenAI の FAQ では user override、該当 group default の最大値、workspace default の順で適用されると説明されている。複数 group に所属しているユーザーには、最も高い group limit が適用される。Usage limits が未設定なら、既存の Permissions & roles 側の limit が fallback として残る場合がある。

この優先順位は合理的だが、SSO group をそのまま使う企業では注意が必要だ。多くの企業では、部署、職種、プロジェクト、拠点、委託先、セキュリティ例外、PoC 参加者の group が重なっている。高い limit を持つ group に一時的に入ったユーザーが、そのまま高い cap を得続ける可能性がある。

対策は、Usage limits 用の group 設計を分けることだ。認証やアプリ権限の group と、予算上限の group を同一視しない。最初の設計では、標準利用、高利用開発者、データ分析・企画高利用、期間限定 PoC、外部協力者のように、予算意味が明確な分類に絞る。細かな部署単位は、利用実績を見てからでよい。

user override も台帳化する必要がある。誰に、いくら、なぜ、いつまで、誰が承認したかを残す。OpenAI の機能上は override が残るため、社内運用では「承認時に見直し日を設定する」「月次レビューで期限切れ override を戻す」「部門長が継続理由を出す」といったルールが必要になる。

## Codexと高利用者をどう扱うか

Usage limits の設計で最も難しいのは、ChatGPT の軽い会話と、Codex の高負荷作業を同じ cap で扱うかどうかだ。[OpenAI Codex座席設計](/blog/openai-chatgpt-business-codex-seats-2026/) で見たように、Codex は標準 ChatGPT seat と Codex-only seat、workspace credits、token-based rate card の組み合わせで管理される。ユーザーの役割によって、消費パターンは大きく異なる。

開発者が Codex に repository 全体を読ませ、複数ファイルを修正させ、テストやレビューを繰り返す場合、通常のテキスト相談より credit 消費は大きくなりやすい。さらに、リリース前や障害対応では短期間に利用が集中する。標準利用者と同じ cap にすると、必要なときに止まる可能性がある。

一方で、Codex 高利用者を無制限に近い状態にすると、コスト説明が難しくなる。特に日本企業では、開発部門の生産性向上と、情シス・経理の予算統制が別組織になりやすい。Usage limits は、この対立を避けるために、開発者 group の cap、個別 override、増枠申請、月次レビューを組み合わせる道具として使うのがよい。

最初の設計では、開発高利用 group を作り、Codex を本格利用するメンバーだけを入れる。group cap は標準より高めに置くが、user override は例外扱いにする。大きな migration、セキュリティ修正、短期 PoC などの期間限定作業では、override に期限を付ける。月次レビューでは、単に credit 消費を見るのではなく、完了した PR、削減できたレビュー時間、失敗した agent task、再実行回数も合わせて見るべきだ。

## 増枠申請を社内フローに接続する

OpenAI は、増枠申請を有効化し、必要に応じて custom destination に誘導できると説明している。日本企業では、この機能をそのまま管理者の手元だけで回すより、社内の申請・承認フローへ接続したほうがよい。

理由は2つある。第一に、増枠は費用だけでなく利用目的の承認でもあるからだ。高い credit 上限は、より多くの会話、より大きなファイル、より長い Codex 作業、より多くの connected app 操作と結びつきやすい。アプリ権限やデータ分類と無関係に承認すると、費用は許したがデータ利用は想定外という状態になり得る。

第二に、承認された増枠が user override として残るからだ。Slack やメールで「今月だけ増やしてください」と依頼され、管理画面で承認しただけでは、翌月以降に戻し忘れる可能性がある。社内フォームには、対象期間、業務理由、想定 workflow、対象データ、利用する機能、部門予算、見直し日を入れるべきだ。

実務では、増枠申請を3種類に分けると扱いやすい。恒常的な高利用、期間限定の業務ピーク、実験的な PoC である。恒常的な高利用は group cap の見直し候補にする。業務ピークは期限付き user override にする。PoC は専用 group と月次レビューを付け、成果が出なければ戻す。この分類がないと、すべてが個別例外になり、管理不能になる。

## 日本企業向けの移行チェックリスト

まず、現行の weekly limits を棚卸しする。workspace、group、user のどこに設定があるか、誰が対象か、現在の limit がどの業務目的で置かれたものかを確認する。設定理由が分からない limit は、月次移行前に owner を決める。

次に、月次 cap の標準値を決める。全員に高い cap を置くのではなく、標準利用者の業務に十分な値を置き、高利用者は group で分ける。標準値は、過去の利用実績、対象人数、月次予算、業務停止時の影響から決める。利用実績が不足しているなら、最初の1か月は保守的に置き、増枠申請とレビューで調整する。

第三に、group membership を整理する。利用目的と予算責任が曖昧な group は limit 設定に使わない。既存 SSO group を使う場合も、複数所属時に最大 group cap が当たることを前提に確認する。

第四に、ユーザー向けの説明を出す。月次 cap、残枠の考え方、上限到達時の挙動、増枠申請、重い作業の例を短くまとめる。特に「credit value は task 完了まで正確に確定しない場合があり、上限を少し超えることがある」という点は、ユーザーと経理の双方に説明しておいたほうがよい。

第五に、月次レビューを設計する。上限に達した人数、増枠申請数、承認理由、却下理由、部門別利用、Codex 高利用者、業務成果を確認する。Usage limits は設定して終わりではない。AI 利用が定着するほど、毎月の見直しが必要になる。

## まとめ

ChatGPT Enterprise / Edu の Usage limits は、OpenAI の企業向け管理が credit 配分と月次統制へ進んだことを示す更新だ。workspace、group、user 単位で月次 cap を置ける一方、2026年7月15日の weekly limits 自動移行により、既存設定をそのまま放置するリスクもある。

日本企業が今やるべきことは、週次 limit の棚卸し、月次 cap の標準設計、Usage limits 用 group の整理、増枠申請の社内フロー化、Codex 高利用者の扱いを決めることだ。ChatGPT と Codex を業務基盤として使うなら、費用統制は後追いでは遅い。Usage limits を、現場を止めるブレーキではなく、必要な人に必要な枠を配るための運用設計として使うべきである。

## 出典

- [Setting usage limits in ChatGPT Enterprise and Edu](https://help.openai.com/en/articles/20001001-setting-usage-limits-in-chatgpt-enterprise-and-edu) - OpenAI Help Center
- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [ChatGPT Business Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center
