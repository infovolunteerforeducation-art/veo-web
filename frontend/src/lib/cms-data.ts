export type CMSRole = "admin" | "editor" | "writer";

export type CMSUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: CMSRole;
};

export type CMSTab =
  | "homepage"
  | "camp-listing"
  | "tour-listing"
  | "b2b-csr"
  | "b2b-school"
  | "blog"
  | "contact"
  | "footer"
  | "roles";

export const ROLE_ALLOWED_TABS: Record<CMSRole, CMSTab[]> = {
  admin:  ["homepage", "camp-listing", "tour-listing", "b2b-csr", "b2b-school", "blog", "contact", "footer", "roles"],
  editor: ["homepage", "camp-listing", "tour-listing", "b2b-csr", "b2b-school", "blog", "contact", "footer"],
  writer: ["blog"],
};

export const ROLE_LABELS: Record<CMSRole, string> = {
  admin:  "Quản trị viên",
  editor: "Biên tập viên",
  writer: "Cộng tác viên",
};

// Mock CMS users (separate from CRM users)
export const DEMO_CMS_USERS: (CMSUser & { password: string })[] = [
  { id: "1", username: "admin",  password: "cms123",   displayName: "Admin CMS",        email: "admin@veo.vn",   role: "admin" },
  { id: "2", username: "editor", password: "edit123",  displayName: "Biên tập viên",    email: "editor@veo.vn",  role: "editor" },
  { id: "3", username: "writer", password: "write123", displayName: "Cộng tác viên",    email: "writer@veo.vn",  role: "writer" },
];

export type ArticleStatus = "draft" | "published";

export type Article = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: ArticleStatus;
  authorName: string;
  publishedAt: string | null;
  updatedAt: string;
};

export type SLPLink = {
  id: string;
  label: string;
  url: string;
  description: string;
  active: boolean;
};

export type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  mapEmbed: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
};
