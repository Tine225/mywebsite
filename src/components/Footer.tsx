import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
        <p>© 2026 我的个人网站 · 用心打造</p>
        <Link
          href="/admin/login"
          className="text-slate-400 transition-colors hover:text-slate-600"
        >
          管理员登录
        </Link>
      </div>
    </footer>
  );
}
