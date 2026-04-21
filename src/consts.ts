export const SITE_TITLE = 'AIに仕事を奪われたい';
export const SITE_DESCRIPTION = 'AI業界の最新ニュースを現役エンジニアの視点で読み解く';
export const SITE_AUTHOR = 'Akira';
export const SITE_AUTHOR_DESCRIPTION = 'AI・ソフトウェア・プロダクト動向を追いながら、調査と実装を行っています。';
export const SITE_URL = 'https://ai-ubawaretai.com';
export const GITHUB_URL = 'https://github.com/FUFU222';
export const NEWS_LABEL = 'ニュース';
export const BLOG_PAGE_SIZE = 12;

export const CATEGORIES = {
  'ai-tools': 'AIツール',
  'how-to': '使い方ガイド',
  comparison: '比較',
  workflow: 'ワークフロー',
  news: NEWS_LABEL,
} as const;

export type Category = keyof typeof CATEGORIES;
