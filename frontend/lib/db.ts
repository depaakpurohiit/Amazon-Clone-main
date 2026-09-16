import { neon } from "@neondatabase/serverless";

// Read connection string from environment variables, with active Neon PostgreSQL instance as default
const rawConnectionString =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  "postgresql://neondb_owner:npg_LNe3xVF1DovC@ep-misty-rain-apff0rak-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require";

export const NEON_CONNECTION_STRING = rawConnectionString;

export const sql = neon(NEON_CONNECTION_STRING);

