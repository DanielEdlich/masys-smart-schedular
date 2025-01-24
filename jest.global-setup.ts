import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import setup from "@oaklean/profiler-jest-environment/setup";

export default async function globalSetup() {
  console.log("Setting up global SQLite DB");

  // Erstelle eine Datenbank-Datei (kann auch in-memory ':memory:' sein)
  // const sqlite = new Database('test.db'); // oder ':memory:' für in-memory
  const client = createClient({
    url: process.env.DB_FILE_NAME || "file:test.db",
  });
  // Drizzle-Datenbank-Instanz erstellen
  const db = drizzle(client);

  // Repository bereitstellen (global zugänglich)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).db = db;

  await setup();
}
