export const SITE_TITLE = 'AIに仕事を奪われたい';
export const SITE_DESCRIPTION = 'AI業界の最新ニュースを現役エンジニアの視点で読み解く';
export const SITE_AUTHOR = 'Akira';
export const SITE_AUTHOR_DESCRIPTION = 'AI・ソフトウェア・プロダクト動向を追いながら、調査と実装を行っています。';
export const SITE_URL = 'https://ai-ubawaretai.com';
export const SITE_LANGUAGE = 'ja';
export const SITE_LOCALE = 'ja_JP';
export const GITHUB_URL = 'https://github.com/FUFU222';
export const X_URL = 'https://x.com/fufu_phoenix';
export const ADSENSE_ACCOUNT = 'ca-pub-5853088582174174';
export const NEWS_LABEL = 'ニュース';
export const BLOG_PAGE_SIZE = 12;
export const INDEXABLE_TAG_MIN_POSTS = 2;
export const SITEMAP_PATH = '/sitemap.xml';
export const DEFAULT_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
export const NOINDEX_ROBOTS = 'noindex,follow,noarchive,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

export const CATEGORIES = {
  'ai-tools': 'AIツール',
  'how-to': '使い方ガイド',
  comparison: '比較',
  workflow: 'ワークフロー',
  news: NEWS_LABEL,
} as const;

export type Category = keyof typeof CATEGORIES;
