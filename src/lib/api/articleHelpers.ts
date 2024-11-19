import { getConnection } from '../db/connections';

export const getNextDisplayOrder = async (connectionString: string, articleType: string) => {
  const db = getConnection(connectionString);
  
  const result = await db`
    SELECT COALESCE(MAX(display_order), 0) as max_order
    FROM articles
    WHERE article_type = ${articleType}
  `;

  const currentMax = result[0].max_order;
  const increment = currentMax % 1000 === 0 ? 1000 : 1;
  
  return currentMax + increment;
};