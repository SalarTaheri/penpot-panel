import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import * as schema from "./schema";

// Ensure data directory exists
const dbPath = "./data/penpot.db";
if (!existsSync(dirname(dbPath))) {
  mkdirSync(dirname(dbPath), { recursive: true });
}

const sqliteDb = new Database(dbPath);
export const db = drizzle(sqliteDb, { schema });
