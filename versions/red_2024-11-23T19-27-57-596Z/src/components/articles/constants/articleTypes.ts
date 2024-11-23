export const ARTICLE_TYPES = {
  INFO_ARTICLE: {
    id: 'SP_A',
    name: 'Article',
    description: 'Create an informational or news article'
  },
  PRODUCTS_TOP_10: {
    id: 'MP_T10',  
    name: 'Products Top 10',
    description: 'Create a top 10 product comparison article'
  },
  PRODUCTS_TOP_3: {
    id: 'MP_T3',
    name: 'Products Top 3',
    description: 'Create a focused top 3 product comparison'
  },
  PRODUCT_REVIEW: {
    id: 'MP_R',
    name: 'Product Review',
    description: 'Create an in-depth single product review'
  },
  PRODUCT_COMPARISON: {
    id: 'MP_C',
    name: 'Product Comparison',
    description: 'Compare two products in detail'
  }
} as const;

export const SCHEMA_TYPES = {
  ARTICLE: {
    id: 'ART',
    name: 'Article'
  },
  PRODUCT: {
    id: 'PRO',
    name: 'Product'
  },
  REVIEW: {
    id: 'REV',
    name: 'Review'
  },
  HOWTO: {
    id: 'HOW',
    name: 'HowTo'
  }
} as const;

export const META_ROBOTS = {
  INDEX_FOLLOW: {
    id: 'IF',
    value: 'index,follow'
  },
  NOINDEX_FOLLOW: {
    id: 'NF',
    value: 'noindex,follow'
  },
  INDEX_NOFOLLOW: {
    id: 'IN',
    value: 'index,nofollow'
  },
  NOINDEX_NOFOLLOW: {
    id: 'NN',
    value: 'noindex,nofollow'
  }
} as const;

export const ARTICLE_STATUS = {
  SCHEDULED: {
    id: 'SCH',
    value: 'Scheduled'
  },
  PUBLISHED: {
    id: 'PUB',
    value: 'Published'
  },
  PAUSED: {
    id: 'PAU',
    value: 'Paused'
  }
} as const;

export type ArticleType = keyof typeof ARTICLE_TYPES;
export type SchemaType = keyof typeof SCHEMA_TYPES;
export type MetaRobots = keyof typeof META_ROBOTS;
export type ArticleStatus = keyof typeof ARTICLE_STATUS;