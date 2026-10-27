import { neon } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";
import { defaultContent } from "./default-content";
import type { SiteContent } from "./types";

const FILE_PATH = path.join(process.cwd(), ".data", "content.json");

let sql: ReturnType<typeof neon> | null = null;
function getSql() {
  if (!sql) sql = neon(process.env.DATABASE_URL as string);
  return sql;
}

async function ensureTable() {
  await getSql()`CREATE TABLE IF NOT EXISTS site_content (
    id integer PRIMARY KEY,
    data jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
}

function parseRowData(data: unknown): SiteContent | null {
  if (data == null) return null;
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as SiteContent;
    } catch {
      return null;
    }
  }
  return data as SiteContent;
}

export async function getContent(): Promise<SiteContent> {
  // 生产环境（或设置了 DATABASE_URL）使用 Neon Postgres
  if (process.env.DATABASE_URL) {
    await ensureTable();
    const rows = (await getSql()`SELECT data FROM site_content WHERE id = 1`) as Array<{
      data: unknown;
    }>;
    const parsed = rows.length > 0 ? parseRowData(rows[0].data) : null;
    if (parsed) return parsed;
    // 首次使用，写入默认内容
    await saveContent(defaultContent);
    return defaultContent;
  }

  // 本地开发默认使用文件存储
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  if (process.env.DATABASE_URL) {
    await ensureTable();
    await getSql()`INSERT INTO site_content (id, data, updated_at)
      VALUES (1, ${JSON.stringify(content)}::jsonb, now())
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
    return;
  }

  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(content, null, 2), "utf-8");
}
