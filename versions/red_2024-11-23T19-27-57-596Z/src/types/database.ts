export interface Article {
  id: number;
  article_type_id: number;
  type_name: string; // pentru afișare
  category_id: number;
  author_id: number;
  title: string;
  slug: string;
  subtitle: string;
  intro_paragraph: string;
  additional_content: string;
  faq: string;
  conclusion: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  status: 'draft' | 'published' | 'archived';
  show_reviews: boolean;
  affiliate_button_text: string;
  best_of_prefix: string;
  product_type: string;
  disclosure: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleType {
  id: number;
  article_type: string;
  description: string;
  display_order: number;
  status: string;
}