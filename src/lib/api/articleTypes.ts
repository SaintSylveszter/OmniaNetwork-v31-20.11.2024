import sql from '../db/neon';
import { getConnection } from '../db/connections';

interface ArticleType {
  id: number;
  name: string;
  description: string;
}

export async function getArticleTypes(connectionString: string): Promise<ArticleType[]> {
  if (!connectionString) {
    throw new Error('Connection string is required');
  }

  try {
    const siteDb = getConnection(connectionString);
    const types = await siteDb`
      SELECT 
        id,
        article_type as name,  /* numele coloanei corecte din tabelă */
        description 
      FROM article_types 
      WHERE status = 'active' 
      ORDER BY display_order
    `;
    
    // Ne asigurăm că avem datele în formatul corect
    const processedTypes = types.map(type => ({
      id: Number(type.id),
      name: type.name,
      description: type.description || ''
    }));

    return processedTypes;
  } catch (error) {
    console.error('Error fetching article types:', error);
    throw error;
  }
}