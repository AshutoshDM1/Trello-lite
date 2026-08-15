import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'drizzle-kit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const formatPath = (p: string) => p.replace(/\\/g, '/');

export default defineConfig({
  out: formatPath(path.join(__dirname, 'drizzle')),
  schema: formatPath(path.join(__dirname, 'src/db/schema.ts')),
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
