import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getContent, saveContent } from "@/lib/storage";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";
import { sanitizeContent } from "@/lib/content";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "未登录或会话已过期" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("profile" in body)) {
    return NextResponse.json({ error: "数据格式不正确" }, { status: 400 });
  }

  const content = sanitizeContent(body);
  await saveContent(content);
  return NextResponse.json({ ok: true });
}
