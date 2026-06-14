import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "cms-content");

function filePath(name: string) {
  return path.join(CONTENT_DIR, `${name}.json`);
}

export function readContent<T>(name: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath(name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeContent(name: string, data: unknown): void {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf8");
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type HomeBanner = {
  id: string;
  image: string;
  href: string;
};

export type HomeProgram = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  external: boolean;
};

export type HomeBenefit = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type HomeTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export type HomeLogo = {
  id: string;
  alt: string;
  src: string;
  href: string;
};

export type HomepageContent = {
  banners: HomeBanner[];
  programs: HomeProgram[];
  benefits: HomeBenefit[];
  testimonials: HomeTestimonial[];
  pressLogos: HomeLogo[];
  awardLogos: HomeLogo[];
};

const DEFAULT_HOMEPAGE: HomepageContent = {
  banners: [], programs: [], benefits: [], testimonials: [], pressLogos: [], awardLogos: [],
};

export function getHomepageContent(): HomepageContent {
  return readContent<HomepageContent>("homepage", DEFAULT_HOMEPAGE);
}

export function saveHomepageContent(data: HomepageContent): void {
  writeContent("homepage", data);
}

// ── Trại hè ────────────────────────────────────────────────────────────────────

export type CampHighlight = { id: string; icon: string; value: string; label: string };
export type CampPillar = { id: string; icon: string; title: string; desc: string };
export type CampFeatureCard = { id: string; image: string; title: string; desc: string };
export type CampProgram = { id: string; title: string; age: string; image: string; desc: string };
export type CampScheduleDay = { id: string; day: string; text: string };
export type CampTestimonial = { id: string; name: string; role: string; quote: string };

export type CampContent = {
  heroImage: string;
  youtubeVideoId: string;
  highlights: CampHighlight[];
  pillars: CampPillar[];
  featureCards: CampFeatureCard[];
  programs: CampProgram[];
  schedule: CampScheduleDay[];
  outcomes: string[];
  testimonials: CampTestimonial[];
};

const DEFAULT_CAMP: CampContent = {
  heroImage: "/trai-he/volunteer-summer-camp-hero.png",
  youtubeVideoId: "LCJqDRXphLk",
  highlights: [],
  pillars: [],
  featureCards: [],
  programs: [],
  schedule: [],
  outcomes: [],
  testimonials: [],
};

export function getCampContent(): CampContent {
  return readContent<CampContent>("trai-he", DEFAULT_CAMP);
}

export function saveCampContent(data: CampContent): void {
  writeContent("trai-he", data);
}

// ── Du lịch tình nguyện (listing page) ────────────────────────────────────────

export type TourFAQ = { id: string; q: string; a: string };

export type TourListingContent = {
  pageTitle: string;
  pageSubtitle: string;
  faqs: TourFAQ[];
};

const DEFAULT_TOUR_LISTING: TourListingContent = {
  pageTitle: "Tour du lịch tình nguyện",
  pageSubtitle: "Chọn hành trình phù hợp và bắt đầu tạo ra sự thay đổi.",
  faqs: [],
};

export function getTourListingContent(): TourListingContent {
  return readContent<TourListingContent>("du-lich", DEFAULT_TOUR_LISTING);
}

export function saveTourListingContent(data: TourListingContent): void {
  writeContent("du-lich", data);
}

// ── CSR ────────────────────────────────────────────────────────────────────────

export type CsrLogo = { id: string; name: string; image: string };
export type CsrTextItem = { id: string; title: string; description: string };
export type CsrProject = {
  id: string;
  title: string;
  partner: string;
  image: string;
  description: string;
  items: string[];
};
export type CsrProcess = { id: string; step: string; title: string; description: string };
export type CsrFAQ = { id: string; q: string; a: string };

export type CsrContent = {
  heroImage: string;
  partnerLogos: CsrLogo[];
  partnerGallery: CsrLogo[];
  challenges: CsrTextItem[];
  solutions: CsrTextItem[];
  values: CsrTextItem[];
  projects: CsrProject[];
  reasons: CsrTextItem[];
  process: CsrProcess[];
  faqs: CsrFAQ[];
};

const DEFAULT_CSR: CsrContent = {
  heroImage: "/csr/hero-csr.jpg",
  partnerLogos: [],
  partnerGallery: [],
  challenges: [],
  solutions: [],
  values: [],
  projects: [],
  reasons: [],
  process: [],
  faqs: [],
};

export function getCsrContent(): CsrContent {
  return readContent<CsrContent>("csr", DEFAULT_CSR);
}

export function saveCsrContent(data: CsrContent): void {
  writeContent("csr", data);
}

// ── School ─────────────────────────────────────────────────────────────────────

export type SchoolGallery = { id: string; name: string; image: string };
export type SchoolChallenge = { id: string; icon: string; tone: string; title: string; description: string };
export type SchoolValue = { id: string; icon?: string; tone?: string; title: string; description: string };
export type SchoolSolution = { id: string; title: string; description: string };
export type SchoolProcessStep = { id: string; step: string; title: string; description: string };
export type SchoolSafety = { id: string; title: string; description: string };
export type SchoolStat = { id: string; value: string; label: string };
export type SchoolFAQ = { id: string; q: string; a: string };

export type SchoolContent = {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPoints: string[];
  partnerGallery: SchoolGallery[];
  challenges: SchoolChallenge[];
  schoolValues: SchoolValue[];
  studentValues: SchoolValue[];
  parentValues: SchoolValue[];
  solutions: SchoolSolution[];
  process: SchoolProcessStep[];
  safety: SchoolSafety[];
  veoStats: SchoolStat[];
  faqs: SchoolFAQ[];
};

const DEFAULT_SCHOOL: SchoolContent = {
  heroImage: "/about-veo/timeline-2019-kttv.webp",
  heroTitle: "Hoạt động ngoại khóa trường học",
  heroSubtitle: "Trải nghiệm thực tế - Kỹ năng bền vững",
  heroPoints: [],
  partnerGallery: [],
  challenges: [],
  schoolValues: [],
  studentValues: [],
  parentValues: [],
  solutions: [],
  process: [],
  safety: [],
  veoStats: [],
  faqs: [],
};

export function getSchoolContent(): SchoolContent {
  return readContent<SchoolContent>("school", DEFAULT_SCHOOL);
}

export function saveSchoolContent(data: SchoolContent): void {
  writeContent("school", data);
}

// ── Header ─────────────────────────────────────────────────────────────────────

export type HeaderNavChild = { label: string; href: string; external: boolean };
export type HeaderNavLink = {
  label: string;
  href: string;
  external: boolean;
  children: HeaderNavChild[];
};

export type HeaderContent = {
  navLinks: HeaderNavLink[];
};

const DEFAULT_HEADER: HeaderContent = {
  navLinks: [
    { label: "Du lịch tình nguyện", href: "/du-lich-tinh-nguyen", external: false, children: [] },
    { label: "Trại hè tình nguyện", href: "/trai-he-tinh-nguyen", external: false, children: [] },
    {
      label: "B2B",
      href: "",
      external: false,
      children: [
        { label: "CSR", href: "/chien-luoc-csr-cho-doanh-nghiep", external: false },
        { label: "Hoạt động ngoại khóa trường học", href: "/hoat-dong-ngoai-khoa-truong-hoc", external: false },
      ],
    },
    { label: "SLP", href: "https://www.slp.edu.vn/", external: true, children: [] },
    { label: "Tin tức", href: "/tin-tuc", external: false, children: [] },
    { label: "Liên hệ", href: "/lien-he", external: false, children: [] },
  ],
};

export function getHeaderContent(): HeaderContent {
  return readContent<HeaderContent>("header", DEFAULT_HEADER);
}

export function saveHeaderContent(data: HeaderContent): void {
  writeContent("header", data);
}

// ── Footer ─────────────────────────────────────────────────────────────────────

export type FooterLink = { label: string; href: string; external: boolean };
export type FooterSocial = { label: string; href: string };

export type FooterContent = {
  description: string;
  phone: string;
  address: string;
  email: string;
  socials: FooterSocial[];
  programLinks: FooterLink[];
  aboutLinks: FooterLink[];
  supportLinks: FooterLink[];
};

const DEFAULT_FOOTER: FooterContent = {
  description:
    "Volunteer For Education (VEO) kết nối tình nguyện viên với những hành trình giáo dục, trải nghiệm và phát triển cộng đồng tại Việt Nam.",
  phone: "070.508.1088",
  address: "Tầng 3, Tòa nhà D12 Giảng Võ, Ba Đình, Hà Nội",
  email: "info@volunteerforeducation.org",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/volunteerforeducation.veo" },
    { label: "TikTok", href: "https://www.tiktok.com/@veo.volunteerforeducation" },
    { label: "Instagram", href: "https://www.instagram.com/veo.volunteerforeducation" },
    { label: "YouTube", href: "https://www.youtube.com/@volunteerforeducation" },
  ],
  programLinks: [
    { label: "Du lịch tình nguyện", href: "/du-lich-tinh-nguyen", external: false },
    { label: "Trại hè tình nguyện", href: "/trai-he-tinh-nguyen", external: false },
    { label: "Hoạt động ngoại khóa trường học", href: "/hoat-dong-ngoai-khoa-truong-hoc", external: false },
    { label: "CSR", href: "/chien-luoc-csr-cho-doanh-nghiep", external: false },
    { label: "Social Leader Program", href: "https://www.slp.edu.vn/", external: true },
  ],
  aboutLinks: [
    { label: "Về VEO", href: "/ve-veo", external: false },
    { label: "Tin tức", href: "/tin-tuc", external: false },
    { label: "Liên hệ", href: "/lien-he", external: false },
  ],
  supportLinks: [
    { label: "Hướng dẫn tham gia", href: "/huong-dan-tham-gia", external: false },
    { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat", external: false },
    { label: "Chính sách hoàn hủy", href: "/chinh-sach-hoan-huy", external: false },
    { label: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung", external: false },
  ],
};

export function getFooterContent(): FooterContent {
  return readContent<FooterContent>("footer", DEFAULT_FOOTER);
}

export function saveFooterContent(data: FooterContent): void {
  writeContent("footer", data);
}

// ── Contact ────────────────────────────────────────────────────────────────────

export type ContactContent = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  mapEmbed: string;
  facebook: string;
  tiktok: string;
  instagram: string;
  youtube: string;
};

const DEFAULT_CONTACT: ContactContent = {
  phone: "070.508.1088",
  email: "info@volunteerforeducation.org",
  address: "Tầng 3, Tòa nhà D12 Giảng Võ, Ba Đình, Hà Nội",
  hours: "Thứ 2 – Thứ 6: 9:00 – 17:30",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0971578954877!2d105.8192!3d21.0278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5b1a7b4c4f%3A0x1!2zR2nhuqNuZyBWw7MsIEJhIMSQw61uaCwgSMOgIE7hu5Np!5e0!3m2!1svi!2svn!4v1686000000000!5m2!1svi!2svn",
  facebook: "https://www.facebook.com/volunteerforeducation.veo",
  tiktok: "https://www.tiktok.com/@veo.volunteerforeducation",
  instagram: "https://www.instagram.com/veo.volunteerforeducation",
  youtube: "https://www.youtube.com/@volunteerforeducation",
};

export function getContactContent(): ContactContent {
  return readContent<ContactContent>("contact", DEFAULT_CONTACT);
}

export function saveContactContent(data: ContactContent): void {
  writeContent("contact", data);
}

// ── Blog ───────────────────────────────────────────────────────────────────────

export type BlogArticle = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  tags: string[];
  status: "draft" | "published";
  authorName: string;
  publishedAt: string | null;
  updatedAt: string;
  readTime: number;
  featured: boolean;
};

export type BlogContent = { articles: BlogArticle[] };

const DEFAULT_BLOG: BlogContent = { articles: [] };

export function getBlogContent(): BlogContent {
  return readContent<BlogContent>("blog", DEFAULT_BLOG);
}

export function saveBlogContent(data: BlogContent): void {
  writeContent("blog", data);
}
