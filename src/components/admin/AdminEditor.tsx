"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent, Skill } from "@/lib/types";

type ProjectDraft = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  github: string;
  tags: string;
  featured: boolean;
};

type Draft = {
  profile: SiteContent["profile"];
  skills: Skill[];
  projects: ProjectDraft[];
};

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const labelCls = "mb-1 block text-sm font-medium text-slate-700";

function toDraft(content: SiteContent): Draft {
  return {
    profile: content.profile,
    skills: content.skills,
    projects: content.projects.map((p) => ({
      ...p,
      tags: p.tags.join(", "),
    })),
  };
}

function toPayload(draft: Draft): SiteContent {
  return {
    profile: draft.profile,
    skills: draft.skills,
    projects: draft.projects.map((p) => ({
      ...p,
      tags: p.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    })),
  };
}

export default function AdminEditor() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error("加载失败");
        return res.json();
      })
      .then((data: SiteContent) => setDraft(toDraft(data)))
      .catch(() => setMessage("内容加载失败，请刷新重试"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(draft)),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "保存失败");
      } else {
        setMessage("已保存 ✓");
        setTimeout(() => setMessage(""), 2500);
      }
    } catch {
      setMessage("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (loading || !draft) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center text-slate-500">
        加载中…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* 顶栏 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">管理后台</h1>
          <p className="mt-1 text-sm text-slate-500">
            在这里修改个人信息、技能与项目，修改后点击「保存」
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            查看网站
          </a>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            登出
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg px-4 py-2.5 text-sm font-medium ${
            message.includes("失败") || message.includes("错误")
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-col gap-8">
        {/* 个人信息 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            个人信息
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>姓名</label>
              <input
                className={inputCls}
                value={draft.profile.name}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d!,
                    profile: { ...d!.profile, name: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelCls}>职位 / 头衔</label>
              <input
                className={inputCls}
                value={draft.profile.title}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d!,
                    profile: { ...d!.profile, title: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelCls}>邮箱</label>
              <input
                className={inputCls}
                value={draft.profile.email}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d!,
                    profile: { ...d!.profile, email: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelCls}>所在地</label>
              <input
                className={inputCls}
                value={draft.profile.location}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d!,
                    profile: { ...d!.profile, location: e.target.value },
                  }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>头像图片 URL（留空则显示姓名首字）</label>
              <input
                className={inputCls}
                placeholder="https://example.com/avatar.png"
                value={draft.profile.avatar}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d!,
                    profile: { ...d!.profile, avatar: e.target.value },
                  }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>个人简介</label>
              <textarea
                rows={4}
                className={inputCls}
                value={draft.profile.bio}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d!,
                    profile: { ...d!.profile, bio: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          {/* 社交链接 */}
          <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-800">
            社交链接
          </h3>
          <div className="flex flex-col gap-3">
            {draft.profile.socials.map((social, idx) => (
              <div key={social.id} className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="名称，如 GitHub"
                  value={social.label}
                  onChange={(e) =>
                    setDraft((d) => {
                      const socials = [...d!.profile.socials];
                      socials[idx] = { ...socials[idx], label: e.target.value };
                      return { ...d!, profile: { ...d!.profile, socials } };
                    })
                  }
                />
                <input
                  className={inputCls}
                  placeholder="链接，如 https://github.com/xxx"
                  value={social.url}
                  onChange={(e) =>
                    setDraft((d) => {
                      const socials = [...d!.profile.socials];
                      socials[idx] = { ...socials[idx], url: e.target.value };
                      return { ...d!, profile: { ...d!.profile, socials } };
                    })
                  }
                />
                <button
                  onClick={() =>
                    setDraft((d) => ({
                      ...d!,
                      profile: {
                        ...d!.profile,
                        socials: d!.profile.socials.filter(
                          (s) => s.id !== social.id
                        ),
                      },
                    }))
                  }
                  className="shrink-0 rounded-lg border border-slate-300 px-3 text-sm text-red-500 hover:bg-red-50"
                >
                  删除
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setDraft((d) => ({
                  ...d!,
                  profile: {
                    ...d!.profile,
                    socials: [
                      ...d!.profile.socials,
                      { id: crypto.randomUUID(), label: "", url: "" },
                    ],
                  },
                }))
              }
              className="self-start rounded-lg border border-dashed border-indigo-300 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + 添加社交链接
            </button>
          </div>
        </section>

        {/* 技能 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">技能</h2>
          <div className="flex flex-col gap-4">
            {draft.skills.map((skill, idx) => (
              <div
                key={skill.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center"
              >
                <input
                  className={inputCls}
                  placeholder="技能名称"
                  value={skill.name}
                  onChange={(e) =>
                    setDraft((d) => {
                      const skills = [...d!.skills];
                      skills[idx] = { ...skills[idx], name: e.target.value };
                      return { ...d!, skills };
                    })
                  }
                />
                <input
                  className={`${inputCls} sm:w-36`}
                  placeholder="分类"
                  value={skill.category}
                  onChange={(e) =>
                    setDraft((d) => {
                      const skills = [...d!.skills];
                      skills[idx] = { ...skills[idx], category: e.target.value };
                      return { ...d!, skills };
                    })
                  }
                />
                <div className="flex items-center gap-2 sm:w-48">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={(e) =>
                      setDraft((d) => {
                        const skills = [...d!.skills];
                        skills[idx] = {
                          ...skills[idx],
                          level: Number(e.target.value),
                        };
                        return { ...d!, skills };
                      })
                    }
                    className="flex-1"
                  />
                  <span className="w-10 text-sm text-slate-500">
                    {skill.level}%
                  </span>
                </div>
                <button
                  onClick={() =>
                    setDraft((d) => ({
                      ...d!,
                      skills: d!.skills.filter((s) => s.id !== skill.id),
                    }))
                  }
                  className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  删除
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setDraft((d) => ({
                  ...d!,
                  skills: [
                    ...d!.skills,
                    {
                      id: crypto.randomUUID(),
                      name: "",
                      category: "",
                      level: 50,
                    },
                  ],
                }))
              }
              className="self-start rounded-lg border border-dashed border-indigo-300 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + 添加技能
            </button>
          </div>
        </section>

        {/* 项目 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">项目</h2>
          <div className="flex flex-col gap-5">
            {draft.projects.map((project, idx) => (
              <div
                key={project.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    项目 {idx + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(e) =>
                          setDraft((d) => {
                            const projects = [...d!.projects];
                            projects[idx] = {
                              ...projects[idx],
                              featured: e.target.checked,
                            };
                            return { ...d!, projects };
                          })
                        }
                      />
                      精选
                    </label>
                    <button
                      onClick={() =>
                        setDraft((d) => ({
                          ...d!,
                          projects: d!.projects.filter(
                            (p) => p.id !== project.id
                          ),
                        }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
                    >
                      删除
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>项目名称</label>
                    <input
                      className={inputCls}
                      value={project.title}
                      onChange={(e) =>
                        setDraft((d) => {
                          const projects = [...d!.projects];
                          projects[idx] = { ...projects[idx], title: e.target.value };
                          return { ...d!, projects };
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>封面图 URL（可选）</label>
                    <input
                      className={inputCls}
                      placeholder="https://example.com/cover.png"
                      value={project.image}
                      onChange={(e) =>
                        setDraft((d) => {
                          const projects = [...d!.projects];
                          projects[idx] = { ...projects[idx], image: e.target.value };
                          return { ...d!, projects };
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>项目描述</label>
                    <textarea
                      rows={3}
                      className={inputCls}
                      value={project.description}
                      onChange={(e) =>
                        setDraft((d) => {
                          const projects = [...d!.projects];
                          projects[idx] = {
                            ...projects[idx],
                            description: e.target.value,
                          };
                          return { ...d!, projects };
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>在线地址（可选）</label>
                    <input
                      className={inputCls}
                      placeholder="https://..."
                      value={project.link}
                      onChange={(e) =>
                        setDraft((d) => {
                          const projects = [...d!.projects];
                          projects[idx] = { ...projects[idx], link: e.target.value };
                          return { ...d!, projects };
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>源码地址（可选）</label>
                    <input
                      className={inputCls}
                      placeholder="https://github.com/..."
                      value={project.github}
                      onChange={(e) =>
                        setDraft((d) => {
                          const projects = [...d!.projects];
                          projects[idx] = { ...projects[idx], github: e.target.value };
                          return { ...d!, projects };
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>标签（用逗号分隔）</label>
                    <input
                      className={inputCls}
                      placeholder="React, TypeScript, Tailwind CSS"
                      value={project.tags}
                      onChange={(e) =>
                        setDraft((d) => {
                          const projects = [...d!.projects];
                          projects[idx] = { ...projects[idx], tags: e.target.value };
                          return { ...d!, projects };
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                setDraft((d) => ({
                  ...d!,
                  projects: [
                    ...d!.projects,
                    {
                      id: crypto.randomUUID(),
                      title: "",
                      description: "",
                      image: "",
                      link: "",
                      github: "",
                      tags: "",
                      featured: false,
                    },
                  ],
                }))
              }
              className="self-start rounded-lg border border-dashed border-indigo-300 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + 添加项目
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
