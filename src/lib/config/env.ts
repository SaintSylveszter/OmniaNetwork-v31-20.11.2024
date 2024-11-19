interface Env {
  DATABASE_URL: string;
  DIRECT_URL: string;
}

export const env: Env = {
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
  DIRECT_URL: import.meta.env.VITE_DIRECT_URL,
};