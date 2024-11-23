import sql from '../db/neon';
import { getConnection } from '../db/connections';
import { safeUUID } from '../db/utils';

export async function createArticle(connectionString: string, data: {
  type_id: string;
  category_id: string;
  author_id: string;
  title: string;
  slug: string;
  subtitle: string;
  intro_text: string;
  additional_content: string;
  faq: string;
  conclusion: string;
  status: 'scheduled' | 'published' | 'paused';
  show_reviews: boolean;
  affiliate_button_text: string;
  best_of_prefix: string;
  product_type: string;
  disclosure: string;
  published_at?: Date | null;
}) {
  if (!connectionString) {
    throw new Error('Connection string is required');
  }

  try {
    const siteDb = getConnection(connectionString);

    // First get the article type ID
    const [articleType] = await siteDb`
      SELECT id FROM article_types 
      WHERE code = 'MP_T10' 
      LIMIT 1
    `;

    if (!articleType) {
      throw new Error('Article type MP_T10 not found');
    }

    // Validate required fields
    const requiredFields = [
      'category_id',
      'author_id',
      'title',
      'slug',
      'status',
      'affiliate_button_text',
      'best_of_prefix',
      'product_type',
      'disclosure'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Create the article with proper SQL parameter binding
    const [article] = await siteDb`
      INSERT INTO articles (
        type_id,
        category_id,
        author_id,
        title,
        slug,
        subtitle,
        intro_paragraph,
        additional_content,
        faq,
        conclusion,
        status,
        show_reviews,
        affiliate_button_text,
        best_of_prefix,
        product_type,
        disclosure,
        published_at
      ) VALUES (
        ${articleType.id},
        ${safeUUID(data.category_id)},
        ${safeUUID(data.author_id)},
        ${data.title},
        ${data.slug},
        ${data.subtitle},
        ${data.intro_text},
        ${data.additional_content},
        ${data.faq},
        ${data.conclusion},
        ${data.status},
        ${data.show_reviews},
        ${data.affiliate_button_text},
        ${data.best_of_prefix},
        ${data.product_type},
        ${data.disclosure},
        ${data.published_at || null}
      )
      RETURNING *
    `;

    return article;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}

export async function updateArticle(connectionString: string, articleId: string, data: Partial<{
  category_id: string;
  author_id: string;
  title: string;
  slug: string;
  subtitle: string;
  intro_text: string;
  additional_content: string;
  faq: string;
  conclusion: string;
  status: 'scheduled' | 'published' | 'paused';
  show_reviews: boolean;
  affiliate_button_text: string;
  best_of_prefix: string;
  product_type: string;
  disclosure: string;
  published_at: Date | null;
}>) {
  if (!connectionString) {
    throw new Error('Connection string is required');
  }

  try {
    const siteDb = getConnection(connectionString);
    const safeArticleId = safeUUID(articleId);

    if (!safeArticleId) {
      throw new Error('Invalid article ID');
    }

    const [updatedArticle] = await siteDb`
      UPDATE articles 
      SET ${siteDb(data, Object.keys(data))}
      WHERE id = ${safeArticleId}
      RETURNING *
    `;

    return updatedArticle;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

export async function deleteArticle(connectionString: string, articleId: string) {
  if (!connectionString) {
    throw new Error('Connection string is required');
  }

  try {
    const siteDb = getConnection(connectionString);
    const safeArticleId = safeUUID(articleId);

    if (!safeArticleId) {
      throw new Error('Invalid article ID');
    }

    await siteDb`
      DELETE FROM articles 
      WHERE id = ${safeArticleId}
    `;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}