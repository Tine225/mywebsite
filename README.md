# 我的个人网站

一个简洁的个人网站，展示个人信息、技能和项目。支持管理员登录后在网页后台直接修改内容，数据保存到数据库，改完即生效。

## 技术栈

- **Next.js 16**（App Router + TypeScript + Tailwind CSS）
- **Neon**（Postgres 云数据库，免费额度）
- 部署平台：**Vercel**（免费）

## 功能

- 首页：头像、姓名、职位、简介、联系方式、社交链接
- 技能页：按分类展示技能与熟练度
- 项目页：项目卡片（封面、描述、标签、链接、精选标记）
- 管理员后台：`/admin/login` 登录后可增删改全部内容

## 本地运行

```bash
npm install
# 先修改 .env.local 里的 ADMIN_PASSWORD（管理员密码）
npm run dev
```

打开 http://localhost:3000 查看网站，打开 http://localhost:3000/admin/login 登录后台。

> 本地开发时数据保存在项目根目录的 `.data/content.json`（已加入 `.gitignore`，不会提交）。

## 部署到 Vercel

### 方式一：通过 GitHub（推荐）

1. 把本项目推送到你的 GitHub 仓库。
2. 打开 [vercel.com](https://vercel.com) 注册/登录，点击 **Add New → Project**。
3. 导入你的 GitHub 仓库，框架会自动识别为 Next.js，直接点 **Deploy**。
4. 部署完成后你会得到一个 `https://xxx.vercel.app` 的免费地址，别人就能访问了。

### 方式二：通过 Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

### 配置环境变量

在 Vercel 项目 **Settings → Environment Variables** 中添加：

| 变量名 | 必填 | 说明 |
| --- | --- | --- |
| `ADMIN_PASSWORD` | 是 | 管理员登录密码 |
| `SESSION_SECRET` | 否 | 会话签名密钥（建议填一段随机字符串） |
| `DATABASE_URL` | 是 | 数据库连接串（见下方 Neon 说明） |

## 接入 Neon 数据库

Vercel 的 serverless 环境没有持久化的本地文件，所以线上必须用数据库保存内容。推荐用 Neon：

1. 在 Vercel 项目的 **Storage** 标签页点 **Create Database**，选择 **Neon (Postgres)**，按提示创建。
2. 创建完成后 Vercel 会自动把 `DATABASE_URL` 注入到环境变量（也可以手动复制到 Environment Variables）。
3. 重新部署一次（或在 Vercel 里 Redeploy）。数据表会在首次访问时自动创建，无需手动建表。

> 也可以直接到 [neon.tech](https://neon.tech) 注册创建数据库，把连接串粘贴为 `DATABASE_URL`。

## 绑定自己的域名（可选）

1. 在 Vercel 项目 **Settings → Domains** 点 **Add**，输入你的域名。
2. 按 Vercel 提示，到你的域名服务商（阿里云/腾讯云/Cloudflare 等）添加对应的 DNS 记录（通常是 CNAME 指向 `cname.vercel-dns.com`，或 A 记录指向 Vercel 的 IP）。
3. DNS 生效后即可通过你自己的域名访问。

## 使用后台

1. 访问 `https://你的域名/admin/login`（本地是 `/admin/login`）。
2. 输入 `ADMIN_PASSWORD` 登录。
3. 修改个人信息、技能、项目，点右上角 **保存**，前台立即更新。

## 目录结构

```
src/
  app/
    page.tsx               # 首页
    skills/page.tsx        # 技能页
    projects/page.tsx      # 项目页
    admin/login/page.tsx   # 后台登录
    admin/page.tsx         # 后台入口（校验会话）
    api/
      auth/login/route.ts  # 登录接口
      auth/logout/route.ts # 登出接口
      content/route.ts     # 内容读写接口
  components/              # 页面组件
  lib/
    types.ts               # 数据类型
    default-content.ts     # 默认内容
    content.ts             # 内容清洗校验
    storage.ts             # 存储层（本地文件 / Neon）
    auth.ts                # 会话与密码校验
```
