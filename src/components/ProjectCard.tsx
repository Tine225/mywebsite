import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={project.title}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-5xl font-bold text-white/90">
          {project.title.trim().slice(0, 1) || "项"}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900">
            {project.title}
          </h3>
          {project.featured && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              精选
            </span>
          )}
        </div>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {(project.link || project.github) && (
          <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4 text-sm">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                在线查看 ↗
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-500 hover:text-slate-700"
              >
                源码 ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
