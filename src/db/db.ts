// db/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { DbClient } from './types';

const client = createClient({
  url: process.env.DB_FILE_NAME!,
});

export const db: DbClient = drizzle(client);