import { getConnection } from '../db/connections';

interface CreateArticleData {
  article_type_id: number;
  category_id: number;
  author_id: number;
  title: string;
  alternative_title?: string;  // Opțional, va merge în alternative_title
  slug: string;
  subtitle?: string;
  status?: string;
  display_order?: number;
  meta_title?: string;
  meta_description?: string;
  schema_type?: string;
  meta_robots?: string;
  focus_keyword?: string;
  focus_keyword_secondary?: string;
  og_title?: string;
  og_description?: string;
}

export async function createNewArticle(connectionString: string, data: CreateArticleData) {
  if (!connectionString) {
    throw new Error('Connection string is required');
  }

  try {
    const siteDb = getConnection(connectionString);
    
    // Pregătim datele cu valorile implicite pentru câmpurile obligatorii
    const articleData = {
      article_type_id: data.article_type_id,
      category_id: data.category_id,
      author_id: data.author_id,
      title: data.title,
      alternative_title: data.alternative_title || '', // Noul câmp
      slug: data.slug,
      subtitle: data.subtitle || '', 
      status: data.status || 'Scheduled',
      display_order: data.display_order || 0,
      meta_title: data.meta_title || data.title,
      meta_description: data.meta_description || '',
      schema_type: data.schema_type || 'ART',
      meta_robots: data.meta_robots || 'IN',
      focus_keyword: data.focus_keyword || '',
      focus_keyword_secondary: data.focus_keyword_secondary || '',
      og_title: data.og_title || data.title,
      og_description: data.og_description || ''
    };

    // Validări
    if (!articleData.article_type_id || typeof articleData.article_type_id !== 'number') {
      throw new Error('Valid article type ID is required');
    }
    if (!articleData.category_id || typeof articleData.category_id !== 'number') {
      throw new Error('Valid category ID is required');
    }
    if (!articleData.author_id || typeof articleData.author_id !== 'number') {
      throw new Error('Valid author ID is required');
    }
    if (!articleData.title) {
      throw new Error('Title is required');
    }
    if (!articleData.slug) {
      throw new Error('Slug is required');
    }

    console.log('Article data before insert:', articleData);

    // Query explicit pentru debugging
    const [newArticle] = await siteDb`
      INSERT INTO articles (
        article_type_id,
        category_id,
        author_id,
        title,
        alternative_title,
        slug,
        subtitle,
        status,
        display_order,
        meta_title,
        meta_description,
        schema_type,
        meta_robots,
        focus_keyword,
        focus_keyword_secondary,
        og_title,
        og_description
      ) VALUES (
        ${articleData.article_type_id},
        ${articleData.category_id},
        ${articleData.author_id},
        ${articleData.title},
        ${articleData.alternative_title},
        ${articleData.slug},
        ${articleData.subtitle},
        ${articleData.status},
        ${articleData.display_order},
        ${articleData.meta_title},
        ${articleData.meta_description},
        ${articleData.schema_type},
        ${articleData.meta_robots},
        ${articleData.focus_keyword},
        ${articleData.focus_keyword_secondary},
        ${articleData.og_title},
        ${articleData.og_description}
      )
      RETURNING *
    `;

    console.log('Inserted article:', newArticle);
    return newArticle;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}