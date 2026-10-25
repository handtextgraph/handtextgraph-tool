import "server-only";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
export function token(bytes = 32) { return randomBytes(bytes).toString("base64url"); }
export function hashToken(value: string) { return createHash("sha256").update(value).digest("hex"); }
export async function hashPassword(password: string) { const salt = randomBytes(16); const derived = await scrypt(password.normalize("NFKC"), salt, 64) as Buffer; return `scrypt$16384$${salt.toString("base64url")}$${derived.toString("base64url")}`; }
export async function verifyPassword(password: string, stored: string) { const [, , saltValue, hashValue] = stored.split("$"); if (!saltValue || !hashValue) return false; const expected = Buffer.from(hashValue, "base64url"); const actual = await scrypt(password.normalize("NFKC"), Buffer.from(saltValue, "base64url"), expected.length) as Buffer; return expected.length === actual.length && timingSafeEqual(expected, actual); }
export function safeInternalPath(value: string) { return value.startsWith("/") && !value.startsWith("//") && !/^\s*javascript:/i.test(value); }
export function slugify(value: string) { return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,120); }
export const RESERVED_SLUGS = new Set(["admin","api","tools","blog","templates","about","contact","privacy-policy","terms","responsible-use","author","write-for-us","assignment-maker","cursive-text-generator","invitation-maker","sentence-scramble-generator","signature-generator","word-scramble-generator","word-search-maker"]);
