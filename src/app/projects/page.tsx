import { connection } from "next/server";
import { getContent } from "@/lib/storage";
import ProjectCard from "@/components/ProjectCard";

export const instant = false;

export default async function ProjectsPage() {
  await connection();
  const { projects } = await getContent();

  const sorted = [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return 0;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">项目</h1>
        <p className="mt-2 text-slate-500">我做过的项目与作品</p>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          还没有添加项目，登录后台即可添加。
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
