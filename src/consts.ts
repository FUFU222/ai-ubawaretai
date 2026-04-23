export const SITE_TITLE = 'AIに仕事を奪われたい';
export const SITE_DOMAIN = 'ai-ubawaretai.com';
export const SITE_TAGLINE = 'AI・ソフトウェア・プロダクトの更新を、日本の事業と開発の文脈で読み解くブログ';
export const SITE_DESCRIPTION =
	'「AIに仕事を奪われたい」は、OpenAIやGoogleなどAI・ソフトウェア・プロダクトの更新を、日本の事業と開発の文脈で読み解くブログです。';
export const HOME_PAGE_TITLE = `${SITE_TITLE} | AIニュースを開発者目線で読み解く`;
export const HOME_PAGE_DESCRIPTION =
	'OpenAIやGoogleなどAI・ソフトウェア・プロダクトの更新を、日本の事業と開発の文脈で読み解くブログです。現役エンジニア視点で変化の意味を整理します。';
export const ABOUT_PAGE_TITLE = `このサイトについて | ${SITE_TITLE}`;
export const ABOUT_PAGE_DESCRIPTION =
	'「AIに仕事を奪われたい」の運営方針と執筆者プロフィール。AI・ソフトウェア・プロダクトの更新を、日本の事業・開発の現場でどう受け止めるかを整理しています。';
export const SITE_AUTHOR = 'Akira';
export const SITE_AUTHOR_DESCRIPTION = 'AI・ソフトウェア・プロダクト動向を追いながら、調査と実装を行っています。';
export const SITE_URL = 'https://ai-ubawaretai.com';
export const SITE_LANGUAGE = 'ja';
export const SITE_LOCALE = 'ja_JP';
export const GITHUB_URL = 'https://github.com/FUFU222';
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
