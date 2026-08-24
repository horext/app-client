import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/database/schema.ts',
  dialect: 'sqlite',
  // Runtime uses Drizzle; deployable migrations remain reviewed Wrangler SQL.
  // Optional generated snapshots stay in the ignored dependency cache.
  out: './node_modules/.cache/drizzle',
})
