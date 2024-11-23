/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATABASE_URL: string
  readonly VITE_DIRECT_URL: string
  readonly VITE_BUNNYCDN_API_KEY: string
  readonly VITE_BUNNYCDN_STORAGE_ZONE: string
  readonly VITE_BUNNYCDN_STORAGE_API_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}