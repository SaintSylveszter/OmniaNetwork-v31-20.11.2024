export const dbConfig = {
  get databaseUrl() {
    // Try both Node.js process.env and Vite's import.meta.env
    const url = process.env.VITE_DATABASE_URL || import.meta.env?.VITE_DATABASE_URL;
    if (!url) {
      throw new Error('Database URL not configured. Please check your environment variables.');
    }
    return url;
  },

  get directUrl() {
    const url = process.env.VITE_DIRECT_URL || import.meta.env?.VITE_DIRECT_URL;
    if (!url) {
      throw new Error('Direct URL not configured. Please check your environment variables.');
    }
    return url;
  }
};