import Link from "next/link";
import { getContent } from "@/lib/storage";
import Avatar from "@/components/Avatar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { profile } = await getContent();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12 md:flex-row md:items-center">
        <Avatar name={profile.name} avatar={profile.avatar} size={128} />

        <div className="flex flex-1 flex-col items-center gap-4 text-center md:items-start md:text-left">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {profile.name || "你的名字"}
            </h1>
            <p className="mt-2 text-lg font-medium text-indigo-600">
              {profile.title || "你的职位 / 头衔"}
            </p>
            {profile.location && (
              <p className="mt-1 text-sm text-slate-500">
                📍 {profile.location}
              </p>
            )}
          </div>

          <p className="max-w-xl text-base leading-relaxed text-slate-600">
            {profile.bio || "在这里填写你的个人简介。"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                ✉️ 联系我
              </a>
            )}
            {profile.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link
          href="/skills"
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">技能</h2>
          <p className="mt-1 text-sm text-slate-500">看看我掌握的技术与能力</p>
          <span className="mt-4 text-sm font-medium text-indigo-600 group-hover:translate-x-1">
            查看技能 →
          </span>
        </Link>
        <Link
          href="/projects"
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">项目</h2>
          <p className="mt-1 text-sm text-slate-500">浏览我做过的项目与作品</p>
          <span className="mt-4 text-sm font-medium text-indigo-600 group-hover:translate-x-1">
            查看项目 →
          </span>
        </Link>
      </section>
    </div>
  );
}
