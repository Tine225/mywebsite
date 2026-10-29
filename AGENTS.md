<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

本文件为在本仓库中工作的 AI Agent 提供项目背景、约定与注意事项。

## 项目概述

个人网站：展示个人信息、技能与项目；管理员通过密码登录后台在线增删改内容；数据持久化到云数据库，通过自定义域名对外访问。

- 前台（服务端组件，动态渲染）：`/`（首页）、`/skills`（技能）、`/projects`（项目）
- 后台：`/admin/login`（登录）、`/admin`（编辑，校验会话）
- API：`/api/auth/login`、`/api/auth/logout`、`/api/content`

## 技术栈

- Next.js 16（App Router）+ TypeScript + Tailwind CSS 4
- 数据库：Neon（Postgres），驱动 `@neondatabase/serverless`
- 部署：Netlify（Next.js 运行时）

## 常用命令

```bash
npm run dev      # 本地开发 http://localhost:3000
npm run build    # 生产构建
npm run lint     # ESLint
```

## 目录结构

```
src/
  app/
    layout.tsx              # 根布局
    page.tsx                # 首页
    skills/page.tsx         # 技能页
    projects/page.tsx       # 项目页
    admin/login/page.tsx    # 登录页（客户端）
    admin/page.tsx          # 后台入口（服务端，校验会话）
    api/auth/login/route.ts
    api/auth/logout/route.ts
    api/content/route.ts
  components/               # 组件（含 admin/AdminEditor.tsx）
  lib/
    types.ts                # 数据类型
    default-content.ts      # 默认内容
    content.ts              # sanitizeContent 内容清洗
    storage.ts              # 存储层（文件 / Neon 自动切换）
    auth.ts                 # 密码校验与会话签名
docs/
  需求文档.md
  技术文档.md
```

## 关键约定与注意事项

1. **内容存储**：统一走 `lib/storage.ts` 的 `getContent()` / `saveContent()`。
   - 配置了 `DATABASE_URL` → 使用 Neon，表 `site_content`（`id=1` 单行 `jsonb`）；
   - 未配置 → 使用本地 `.data/content.json`（已 gitignore，勿提交）。
   - 不要在页面里直接读写文件或数据库，统一走存储层。

2. **动态渲染**：首页、技能页、项目页、`/admin` 均需 `export const dynamic = "force-dynamic"`，否则内容改动不会实时反映。

3. **Next.js 16 与 Netlify 兼容**：`next.config.ts` 中**不要**启用 `cacheComponents` / `partialPrefetching`，否则 Netlify 本地 CLI 部署会在「Uploading blobs」阶段报 `MissingBlobsEnvironmentError`。

4. **写接口必须鉴权**：`PUT /api/content` 依赖 `admin_session` Cookie + `verifySessionToken()`，改动认证逻辑时保持此约定。

5. **内容校验**：管理员提交的数据统一经 `sanitizeContent()` 清洗后再落库，避免脏数据。

6. **环境变量**：`ADMIN_PASSWORD`（必填）、`SESSION_SECRET`（可选）、`DATABASE_URL`（生产必填）。模板见 `.env.example`，本地 `.env.local` 勿提交。

7. **文档同步**：改动功能或架构后，同步更新 `docs/需求文档.md` 与 `docs/技术文档.md`。

8. 修改代码前先阅读 `node_modules/next/dist/docs/` 中对应指南（见顶部规则块），注意 Next.js 16 的破坏性变更与弃用提示。
