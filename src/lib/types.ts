export type SocialLink = {
  id: string;
  label: string;
  url: string;
};

export type Profile = {
  name: string;
  title: string;
  bio: string;
  avatar: string; // 头像图片 URL，可为空
  email: string;
  location: string;
  socials: SocialLink[];
};

export type Skill = {
  id: string;
  name: string;
  level: number; // 0 - 100
  category: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string; // 封面图 URL，可为空
  link: string; // 在线地址，可为空
  github: string; // 源码地址，可为空
  tags: string[];
  featured: boolean;
};

export type SiteContent = {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
};
