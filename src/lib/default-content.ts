import type { SiteContent } from "./types";

export const defaultContent: SiteContent = {
  profile: {
    name: "你的名字",
    title: "你的职位 / 头衔",
    bio: "这里是你的个人简介。介绍一下你是谁、擅长什么、正在做什么。登录后台后可以随时修改这段文字。",
    avatar: "",
    email: "hello@example.com",
    location: "中国 · 北京",
    socials: [
      { id: "s1", label: "GitHub", url: "https://github.com/" },
      { id: "s2", label: "掘金", url: "https://juejin.cn/" },
    ],
  },
  skills: [
    { id: "sk1", name: "JavaScript / TypeScript", level: 85, category: "前端" },
    { id: "sk2", name: "React / Next.js", level: 80, category: "前端" },
    { id: "sk3", name: "Node.js", level: 70, category: "后端" },
    { id: "sk4", name: "Git 与协作", level: 75, category: "工具" },
  ],
  projects: [
    {
      id: "p1",
      title: "示例项目一",
      description: "这是一个示例项目，用来展示项目卡片的样子。你可以登录后台把它替换成你自己的真实项目。",
      image: "",
      link: "",
      github: "",
      tags: ["Next.js", "TypeScript"],
      featured: true,
    },
    {
      id: "p2",
      title: "示例项目二",
      description: "第二个示例项目。支持封面图、在线地址、源码地址、标签，以及「精选」标记。",
      image: "",
      link: "",
      github: "",
      tags: ["React", "Tailwind CSS"],
      featured: false,
    },
  ],
};
