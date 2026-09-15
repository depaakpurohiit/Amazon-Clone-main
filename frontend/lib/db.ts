import { neon } from "@neondatabase/serverless";

// Read connection string strictly from environment variables to ensure secrets are never exposed in source control
const rawConnectionString =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  "";

export const NEON_CONNECTION_STRING =
  rawConnectionString ||
  "postgresql://placeholder:placeholder@ep-placeholder.neon.tech/neondb?sslmode=require";

if (!rawConnectionString && typeof window === "undefined" && process.env.NODE_ENV === "production") {
  console.warn("WARNING: Neither DATABASE_URL nor NEON_DATABASE_URL environment variable is set.");
}

export const sql = neon(NEON_CONNECTION_STRING);
