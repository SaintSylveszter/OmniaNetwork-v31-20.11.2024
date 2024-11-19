import sql from './neon';

export async function testConnection() {
  try {
    const result = await sql`SELECT version()`;
    console.log('Database connected successfully:', result[0].version);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export async function query(strings: TemplateStringsArray, ...values: any[]) {
  try {
    return await sql(strings, ...values);
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}