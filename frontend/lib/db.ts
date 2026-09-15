import { neon } from "@neondatabase/serverless";

export const NEON_CONNECTION_STRING =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  "postgresql://neondb_owner:npg_LNe3xVF1DovC@ep-misty-rain-apff0rak-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require";

export const sql = neon(NEON_CONNECTION_STRING);
