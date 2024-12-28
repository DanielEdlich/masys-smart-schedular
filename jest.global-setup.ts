/**
 * @jest-environment node
 */
import Database from 'better-sqlite3';
// import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';


module.exports = async () => {
  console.log('Setting up global SQLite DB');

  // Erstelle eine Datenbank-Datei (kann auch in-memory ':memory:' sein)
  // const sqlite = new Database('test.db'); // oder ':memory:' für in-memory
const client = createClient({
  url: 'file:test.db',
});
  // Drizzle-Datenbank-Instanz erstellen
  const db = drizzle(client);

  // Repository bereitstellen (global zugänglich)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).db = db;
};