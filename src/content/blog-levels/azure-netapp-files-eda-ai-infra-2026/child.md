---
article: 'azure-netapp-files-eda-ai-infra-2026'
level: 'child'
---

Microsoft Azure は 2026年5月22日、Azure NetApp Files を EDA workloads 向けに紹介しました。EDA は Electronic Design Automation のことで、半導体やチップを設計・検証するための作業です。AI半導体を作る会社や、車載・ロボット・産業機器向けのチップを扱う会社では、この EDA が開発の土台になります。

## 何が発表されたのか

Azure NetApp Files は、Azure 上で使える高性能なファイルストレージです。今回 Microsoft は、EDA のように大量の小さなファイルを同時に扱う仕事でも、クラウド上で性能を出せることを強調しました。

EDA では、たくさんの設計ジョブが同時に走ります。各ジョブは、設計ファイル、ログ、シミュレーション結果、ライブラリ、メタデータを読み書きします。つまり、単に「大容量のストレージがあればよい」という話ではありません。低い遅延、大量の並列アクセス、小さなファイルの操作に強いことが大切です。

## なぜAIと関係するのか

AIを動かすには GPU やデータセンターが必要です。しかし、その GPU やAI専用チップを作るには、半導体設計の環境が必要です。AI半導体の設計が遅ければ、新しいAIインフラの供給も遅くなります。

だから、EDA のクラウド移行は AIインフラの話でもあります。クラウドで設計ジョブを増やせても、共有ストレージが遅いと、ジョブは待ち状態になります。結果として、検証が遅れ、製品投入も遅れます。

Microsoft Learn でも、EDA では高い file count、大容量、多数の client workstation からの並列操作が必要だと説明されています。普通の業務ファイル共有とは違い、設計現場ではストレージ性能が開発速度に直結します。

## 日本企業にとっての意味

日本では、半導体、製造業、車載AI、ロボティクス、エッジAIの重要性が高まっています。こうした分野では、AIモデルを使うだけでなく、AIを動かすハードウェアや周辺システムを作る力も大切になります。

Azure NetApp Files の話は、派手なChatGPT機能ではありません。でも、AI半導体や高性能チップを開発する会社には現実的な意味があります。設計データをどこに置くか、クラウドでどこまで検証できるか、海外拠点や委託先とどう共有するか、という判断に関わるからです。

## 確認すべきこと

まず、自社の EDA ワークロードがどのような I/O をしているかを確認します。ジョブ数、ファイル数、平均ファイルサイズ、ピーク時の IOPS、遅延、ライセンス待ち時間などを測る必要があります。

次に、設計データの安全性を確認します。半導体設計データは重要な知的財産です。クラウドへ移す場合は、暗号化、アクセス権、監査ログ、ネットワーク分離、バックアップ、削除ポリシーを決めなければなりません。

最後に、compute と storage を一緒に考えます。計算サーバーを増やしても、ストレージが遅ければ速くなりません。逆にストレージが速くても、ライセンスやジョブキューが詰まれば効果は限られます。

## まとめ

Azure NetApp Files の EDA 向け更新は、AIインフラを支える裏側のニュースです。AI半導体や高性能チップの開発では、GPUだけでなく、設計データを扱うストレージも重要になります。

日本企業は、この発表を「Azureのストレージ機能」としてだけでなく、半導体設計や製造業のAI基盤をクラウドへ移せるかという論点として見るべきです。

## 出典

- [Azure NetApp Files for EDA workloads: From revolution to breakthrough at scale](https://azure.microsoft.com/en-us/blog/azure-netapp-files-for-eda-workloads-from-revolution-to-breakthrough-at-scale/) - Microsoft Azure Blog, 2026-05-22
- [Benefits of using Azure NetApp Files for Electronic Design Automation (EDA)](https://learn.microsoft.com/en-us/azure/azure-netapp-files/solutions-benefits-azure-netapp-files-electronic-design-automation) - Microsoft Learn
- [SPECstorage Solution 2020_eda_blended Result: Microsoft and NetApp Inc.](https://www.spec.org/storage2020/results/res2026q2/storage2020-20260227-00148.html) - SPEC, 2026
