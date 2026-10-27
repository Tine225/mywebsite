import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  createSessionToken,
  verifyPassword,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "尚未设置管理员密码，请在环境变量 ADMIN_PASSWORD 中配置" },
      { status: 500 }
    );
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createSessionToken(), sessionCookieOptions());
  return res;
}
