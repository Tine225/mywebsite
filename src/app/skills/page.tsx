import { connection } from "next/server";
import { getContent } from "@/lib/storage";
import type { Skill } from "@/lib/types";

export const instant = false;

export default async function SkillsPage() {
  await connection();
  const { skills } = await getContent();

  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const category = skill.category || "其他";
    const list = groups.get(category) ?? [];
    list.push(skill);
    groups.set(category, list);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">技能</h1>
        <p className="mt-2 text-slate-500">我的技术栈与能力</p>
      </div>

      {groups.size === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          还没有添加技能，登录后台即可添加。
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {[...groups.entries()].map(([category, list]) => (
            <section key={category}>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                {category}
              </h2>
              <div className="flex flex-col gap-4">
                {list.map((skill) => (
                  <div
                    key={skill.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-slate-800">
                        {skill.name}
                      </span>
                      <span className="text-sm text-slate-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
