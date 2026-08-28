import { neon } from '@neondatabase/serverless';

let sqlClient = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function sql() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  if (!sqlClient) sqlClient = neon(process.env.DATABASE_URL);
  return sqlClient;
}
