import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const dbUrl = process.env.DATABASE_URL?.trim();

if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(dbUrl);
const db = drizzle({ client: sql, schema } as any);

export default db;
