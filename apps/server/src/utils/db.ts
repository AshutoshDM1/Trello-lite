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

const DEFAULT_URL =
  'postgresql://neondb_owner:npg_dwtvJCP3U7Ti@ep-late-sun-azh9fdkk.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const dbUrl =
  process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0
    ? process.env.DATABASE_URL.trim()
    : DEFAULT_URL;

const sql = neon(dbUrl);
const db = drizzle({ client: sql, schema } as any);

export default db;
