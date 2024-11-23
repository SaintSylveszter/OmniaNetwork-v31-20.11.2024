// Environment variables configuration
const env = {
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
  DIRECT_URL: import.meta.env.VITE_DIRECT_URL,
};

// Validate required environment variables
if (!env.DATABASE_URL) {
  throw new Error('VITE_DATABASE_URL environment variable is not set');
}

if (!env.DIRECT_URL) {
  throw new Error('VITE_DIRECT_URL environment variable is not set');
}

export { env };