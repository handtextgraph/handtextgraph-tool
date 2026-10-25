import "server-only";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

let pool: Pool | undefined;
export function cmsConfigured() { return Boolean(process.env.DATABASE_URL); }
export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("CMS database is not configured. Set DATABASE_URL.");
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: Number(process.env.CMS_DB_POOL_SIZE || 10), idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000, ssl: process.env.CMS_DB_SSL === "true" ? { rejectUnauthorized: true } : undefined });
    pool.on("error", error => console.error("CMS database pool error", error.message));
  }
  return pool;
}
export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []) { return (await getPool().query<T>(text, values)).rows; }
export async function transaction<T>(work: (client: PoolClient) => Promise<T>) { const client = await getPool().connect(); try { await client.query("BEGIN"); const value = await work(client); await client.query("COMMIT"); return value; } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); } }
