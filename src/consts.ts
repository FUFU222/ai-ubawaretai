export const SITE_TITLE = 'AIに仕事を奪われたい';
export const SITE_DESCRIPTION = 'AI業界の最新ニュースを現役エンジニアの視点で読み解く';
export const SITE_AUTHOR = 'Akira';
export const SITE_AUTHOR_DESCRIPTION = '元消防士からエンジニアへ転身。海外のAIニュースを追いかけ、開発者目線でわかりやすく整理しています。';
export const SITE_URL = 'https://ai-ubawaretai.com';
export const GITHUB_URL = 'https://github.com/FUFU222';

export const CATEGORIES = {
  'ai-tools': 'AIツール',
  'how-to': '使い方ガイド',
  comparison: '比較',
  workflow: 'ワークフロー',
  news: 'ニュース',
} as const;

export type Category = keyof typeof CATEGORIES;
