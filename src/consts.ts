export const SITE_TITLE = 'AIに仕事を奪われたい';
export const SITE_DESCRIPTION = 'AIツールの実体験レビューと活用ガイド';
export const SITE_AUTHOR = 'Akira';
export const SITE_AUTHOR_DESCRIPTION = '元消防士（レスキュー隊）→ SNSマーケ会社のフルスタックエンジニア。Claude Code、Codex、各種AIツールを日常的に使い倒している実務者。';
export const GITHUB_URL = 'https://github.com/FUFU222';

export const CATEGORIES = {
  'ai-tools': 'AIツール',
  'how-to': '使い方ガイド',
  comparison: '比較',
  workflow: 'ワークフロー',
  news: 'ニュース',
} as const;

export type Category = keyof typeof CATEGORIES;
