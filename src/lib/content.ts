import { randomUUID } from "crypto";
import type {
  SiteContent,
  Profile,
  Skill,
  Project,
  SocialLink,
} from "./types";

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function bool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

// 对管理员提交的内容做清洗与类型收敛，防止脏数据写入
export function sanitizeContent(input: unknown): SiteContent {
  const obj = (
    input && typeof input === "object" ? input : {}
  ) as Record<string, unknown>;
  const profileRaw = (
    obj.profile && typeof obj.profile === "object" ? obj.profile : {}
  ) as Record<string, unknown>;

  const socialsRaw = Array.isArray(profileRaw.socials) ? profileRaw.socials : [];
  const socials: SocialLink[] = socialsRaw.map((s) => {
    const r = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
    return {
      id: str(r.id) || randomUUID(),
      label: str(r.label),
      url: str(r.url),
    };
  });

  const profile: Profile = {
    name: str(profileRaw.name),
    title: str(profileRaw.title),
    bio: str(profileRaw.bio),
    avatar: str(profileRaw.avatar),
    email: str(profileRaw.email),
    location: str(profileRaw.location),
    socials,
  };

  const skillsRaw = Array.isArray(obj.skills) ? obj.skills : [];
  const skills: Skill[] = skillsRaw.map((s) => {
    const r = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
    return {
      id: str(r.id) || randomUUID(),
      name: str(r.name),
      level: Math.min(100, Math.max(0, num(r.level, 0))),
      category: str(r.category),
    };
  });

  const projectsRaw = Array.isArray(obj.projects) ? obj.projects : [];
  const projects: Project[] = projectsRaw.map((p) => {
    const r = (p && typeof p === "object" ? p : {}) as Record<string, unknown>;
    const tagsRaw = Array.isArray(r.tags) ? r.tags : [];
    return {
      id: str(r.id) || randomUUID(),
      title: str(r.title),
      description: str(r.description),
      image: str(r.image),
      link: str(r.link),
      github: str(r.github),
      tags: tagsRaw.map((t) => str(t)).filter(Boolean),
      featured: bool(r.featured),
    };
  });

  return { profile, skills, projects };
}
