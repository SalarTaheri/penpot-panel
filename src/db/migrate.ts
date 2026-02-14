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
const db = drizzle(sqliteDb, { schema });

// Run migrations - create tables based on schema
async function runMigrations() {
  console.log("Running migrations...");
  
  // Create users table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "email" text NOT NULL UNIQUE,
      "password" text NOT NULL,
      "name" text NOT NULL,
      "role" text NOT NULL DEFAULT 'user' CHECK("role" IN ('admin', 'user')),
      "is_active" integer NOT NULL DEFAULT 1,
      "created_at" integer NOT NULL,
      "updated_at" integer NOT NULL
    )
  `);
  
  // Create plans table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS "plans" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "name" text NOT NULL,
      "name_fa" text NOT NULL,
      "description" text,
      "description_fa" text,
      "price" real NOT NULL,
      "credits" integer NOT NULL,
      "is_active" integer NOT NULL DEFAULT 1,
      "is_featured" integer NOT NULL DEFAULT 0,
      "created_at" integer NOT NULL
    )
  `);
  
  // Create subscriptions table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS "subscriptions" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "user_id" integer NOT NULL REFERENCES "users"("id"),
      "plan_id" integer NOT NULL REFERENCES "plans"("id"),
      "status" text NOT NULL DEFAULT 'pending' CHECK("status" IN ('active', 'expired', 'cancelled', 'pending')),
      "start_date" integer NOT NULL,
      "end_date" integer NOT NULL,
      "auto_renew" integer NOT NULL DEFAULT 1,
      "created_at" integer NOT NULL,
      "updated_at" integer NOT NULL
    )
  `);
  
  // Create payments table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS "payments" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "user_id" integer NOT NULL REFERENCES "users"("id"),
      "subscription_id" integer REFERENCES "subscriptions"("id"),
      "amount" real NOT NULL,
      "currency" text NOT NULL DEFAULT 'IRR',
      "status" text NOT NULL DEFAULT 'pending' CHECK("status" IN ('pending', 'completed', 'failed', 'refunded')),
      "payment_method" text,
      "transaction_id" text,
      "description" text,
      "created_at" integer NOT NULL
    )
  `);
  
  // Create credits table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS "credits" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "user_id" integer NOT NULL REFERENCES "users"("id"),
      "amount" integer NOT NULL,
      "balance" integer NOT NULL,
      "type" text NOT NULL CHECK("type" IN ('purchase', 'usage', 'bonus', 'refund', 'subscription')),
      "description" text,
      "created_at" integer NOT NULL
    )
  `);
  
  // Create services table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS "services" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "name" text NOT NULL,
      "name_fa" text NOT NULL,
      "description" text,
      "description_fa" text,
      "price" real NOT NULL,
      "credits" integer NOT NULL,
      "is_active" integer NOT NULL DEFAULT 1,
      "created_at" integer NOT NULL
    )
  `);
  
  // Create user_services table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS "user_services" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "user_id" integer NOT NULL REFERENCES "users"("id"),
      "service_id" integer NOT NULL REFERENCES "services"("id"),
      "status" text NOT NULL DEFAULT 'active' CHECK("status" IN ('active', 'expired', 'cancelled')),
      "start_date" integer NOT NULL,
      "end_date" integer NOT NULL,
      "created_at" integer NOT NULL
    )
  `);
  
  console.log("Migrations completed!");
}

runMigrations()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
