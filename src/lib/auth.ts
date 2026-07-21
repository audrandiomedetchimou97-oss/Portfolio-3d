const encoder = new TextEncoder();
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function bufToHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return bufToHex(sig);
}

export async function createSessionToken(secret: string) {
  const timestamp = Date.now().toString();
  const sig = await hmac(secret, timestamp);
  return `${timestamp}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const [timestamp, sig] = token.split(".");
  if (!timestamp || !sig) return false;
  if (Date.now() - Number(timestamp) > SESSION_MAX_AGE_MS) return false;
  const expected = await hmac(secret, timestamp);
  return expected === sig;
}

export const SESSION_COOKIE = "admin_session";
