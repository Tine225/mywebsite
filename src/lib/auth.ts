import crypto from "crypto";

export const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 天

function secret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "local-dev-secret-change-me"
  );
}

function sign(data: string): string {
  return crypto.createHmac("sha256", secret()).update(data).digest("hex");
}

export function createSessionToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE * 1000 });
  const signature = sign(payload);
  return Buffer.from(JSON.stringify({ p: payload, s: signature })).toString(
    "base64url"
  );
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    const { p, s } = JSON.parse(Buffer.from(token, "base64url").toString());
    if (typeof p !== "string" || typeof s !== "string") return false;
    if (sign(p) !== s) return false;
    const { exp } = JSON.parse(p);
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = crypto.createHash("sha256").update(password).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
