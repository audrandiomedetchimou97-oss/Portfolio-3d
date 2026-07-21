import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD n'est pas configuré côté serveur (.env.local)." },
      { status: 500 }
    );
  }

  const { password } = await request.json();
  if (typeof password !== "string" || password !== secret) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
