"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { BlogArticle, BlogContent } from "@/lib/cms-content";
import { DEMO_CMS_USERS, ROLE_LABELS } from "@/lib/cms-data";
import ImageUploadSlot from "@/components/crm/ImageUploadSlot";

const CMS_GREEN = "#0a5c45";

const CATEGORIES = [
  { slug: "hoat-dong", name: "Hoạt động" },
  { slug: "cau-chuyen", name: "Câu chuyện" },
  { slug: "su-kien", name: "Sự kiện" },
  { slug: "doi-tac", name: "Đối tác" },
  { slug: "ve-veo", name: "Về VEO" },
];

const STATUS_LABEL: Record<string, string> = { published: "Đã đăng", draft: "Bản nháp" };
const STATUS_CLASS: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-surface-container text-on-surface-variant",
};

const CMS_AUTHORS = DEMO_CMS_USERS.map(({ password: _password, ...user }) => user);

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDateVN(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string): number {
  return text.match(/[0-9A-Za-zÀ-ỹ]+/g)?.length ?? 0;
}

function countMatches(text: string, regex: RegExp): number {
  return text.match(regex)?.length ?? 0;
}

type SeoStatus = "good" | "warn" | "bad";

type SeoCheck = {
  label: string;
  detail: string;
  suggestion: string;
  status: SeoStatus;
};

type SeoAudit = {
  score: number;
  wordCount: number;
  checks: SeoCheck[];
};

function makeCheck(
  passed: boolean,
  warning: boolean,
  label: string,
  detail: string,
  suggestion: string,
): SeoCheck {
  return {
    label,
    detail,
    suggestion,
    status: passed ? "good" : warning ? "warn" : "bad",
  };
}

function analyzeSeo(form: FormData): SeoAudit {
  const contentText = htmlToText(form.content);
  const wordCount = countWords(contentText);
  const h2Count = countMatches(form.content, /<h2[\s>]/gi);
  const h3Count = countMatches(form.content, /<h3[\s>]/gi);
  const h1Count = countMatches(form.content, /<h1[\s>]/gi);
  const imageCount = countMatches(form.content, /<img[\s>]/gi);
  const imageAltCount = countMatches(form.content, /<img(?=[^>]*\salt=(["'])[^"']+\1)[^>]*>/gi);
  const linkCount = countMatches(form.content, /<a[\s>]/gi);
  const internalLinkCount = countMatches(form.content, /<a[^>]+href=(["'])\/(?!\/)[^"']*\1/gi);
  const externalLinkCount = countMatches(form.content, /<a[^>]+href=(["'])https?:\/\/[^"']+\1/gi);
  const tagCount = form.tags.split(",").map((item) => item.trim()).filter(Boolean).length;
  const titleLength = form.title.trim().length;
  const excerptLength = form.excerpt.trim().length;
  const slugLength = form.slug.trim().length;
  const estimatedReadTime = Math.max(1, Math.round(wordCount / 200));

  const checks: SeoCheck[] = [
    makeCheck(
      titleLength >= 45 && titleLength <= 70,
      titleLength >= 30 && titleLength <= 80,
      "Tiêu đề SEO",
      `${titleLength} ký tự`,
      "Nên giữ tiêu đề khoảng 45-70 ký tự, có từ khóa chính và lợi ích rõ ràng.",
    ),
    makeCheck(
      excerptLength >= 120 && excerptLength <= 160,
      excerptLength >= 80 && excerptLength <= 180,
      "Meta description / excerpt",
      `${excerptLength} ký tự`,
      "Nên viết 120-160 ký tự, tóm tắt đúng nội dung và có lời hứa giá trị cho người đọc.",
    ),
    makeCheck(
      slugLength > 0 && slugLength <= 75 && !/[A-Z_\s]/.test(form.slug),
      slugLength > 0 && slugLength <= 95,
      "Đường dẫn bài viết",
      slugLength > 0 ? `${slugLength} ký tự` : "Chưa có slug",
      "Slug nên ngắn, chữ thường, dùng dấu gạch ngang và chứa từ khóa chính.",
    ),
    makeCheck(
      wordCount >= 700,
      wordCount >= 450,
      "Độ sâu nội dung",
      `${wordCount} từ`,
      "Bài SEO nên có tối thiểu 700 từ; nếu chủ đề cạnh tranh, hãy bổ sung ví dụ, checklist, FAQ hoặc số liệu.",
    ),
    makeCheck(
      h2Count >= 2 && h1Count === 0,
      h2Count >= 1 && h1Count === 0,
      "Cấu trúc heading",
      `${h2Count} H2, ${h3Count} H3${h1Count > 0 ? `, ${h1Count} H1 trong bài` : ""}`,
      "Trong nội dung chỉ dùng H2/H3. H1 đã là tiêu đề bài viết ở ngoài trang.",
    ),
    makeCheck(
      !!form.coverImage,
      false,
      "Ảnh đại diện",
      form.coverImage ? "Đã có ảnh bìa" : "Chưa có ảnh bìa",
      "Cần ảnh bìa 1200x630 để tối ưu social sharing và tăng CTR ở trang listing.",
    ),
    makeCheck(
      linkCount >= 2 && internalLinkCount >= 1,
      linkCount >= 1,
      "Liên kết trong bài",
      `${internalLinkCount} link nội bộ, ${externalLinkCount} link ngoài`,
      "Nên có ít nhất 1 link nội bộ liên quan và 1 link nguồn/đọc thêm nếu phù hợp.",
    ),
    makeCheck(
      imageCount === 0 || imageAltCount === imageCount,
      imageAltCount > 0,
      "Ảnh trong nội dung",
      imageCount > 0 ? `${imageAltCount}/${imageCount} ảnh có alt` : "Chưa có ảnh trong bài",
      "Nếu thêm ảnh trong bài, mỗi ảnh nên có alt mô tả ngắn gọn và chứa ngữ cảnh chủ đề.",
    ),
    makeCheck(
      tagCount >= 2,
      tagCount === 1,
      "Tag phân loại",
      `${tagCount} tag`,
      "Nên có 2-5 tag cụ thể để gom nhóm nội dung và hỗ trợ điều hướng.",
    ),
    makeCheck(
      Math.abs(Number(form.readTime || 1) - estimatedReadTime) <= 2,
      Math.abs(Number(form.readTime || 1) - estimatedReadTime) <= 4,
      "Thời gian đọc",
      `Ước tính ${estimatedReadTime} phút, đang đặt ${form.readTime || 1} phút`,
      "Thời gian đọc nên gần với độ dài thật của bài, trung bình khoảng 200 từ/phút.",
    ),
  ];

  const score = Math.round(
    (checks.reduce((total, check) => total + (check.status === "good" ? 10 : check.status === "warn" ? 5 : 0), 0) /
      (checks.length * 10)) *
      100,
  );

  return { score, wordCount, checks };
}

function RichHtmlEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [sourceMode, setSourceMode] = useState(false);

  useEffect(() => {
    if (!sourceMode && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [sourceMode, value]);

  function syncEditor() {
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function runCommand(command: string, argument?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    syncEditor();
  }

  function addLink() {
    const url = window.prompt("Nhập URL liên kết");
    if (!url) return;
    runCommand("createLink", url);
  }

  function addImage() {
    const url = window.prompt("Nhập URL ảnh");
    if (!url) return;
    runCommand("insertImage", url);
  }

  const toolbar = [
    { label: "P", title: "Đoạn văn", command: "formatBlock", argument: "p" },
    { label: "H2", title: "Heading 2", command: "formatBlock", argument: "h2" },
    { label: "H3", title: "Heading 3", command: "formatBlock", argument: "h3" },
    { label: "B", title: "In đậm", command: "bold" },
    { label: "I", title: "In nghiêng", command: "italic" },
    { icon: "format_list_bulleted", title: "Danh sách", command: "insertUnorderedList" },
    { icon: "format_quote", title: "Trích dẫn", command: "formatBlock", argument: "blockquote" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white focus-within:border-primary">
      <div className="flex flex-wrap items-center gap-1 border-b border-outline-variant/60 bg-surface-container-low px-3 py-2">
        {toolbar.map((item) => (
          <button
            key={`${item.command}-${item.argument ?? item.label ?? item.icon}`}
            type="button"
            title={item.title}
            onClick={() => runCommand(item.command, item.argument)}
            className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-bold text-on-surface-variant hover:bg-white hover:text-primary"
          >
            {item.icon ? <span className="material-symbols-outlined text-[18px]">{item.icon}</span> : item.label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-outline-variant" />
        <button
          type="button"
          title="Chèn link"
          onClick={addLink}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-white hover:text-primary"
        >
          <span className="material-symbols-outlined text-[18px]">link</span>
        </button>
        <button
          type="button"
          title="Chèn ảnh bằng URL"
          onClick={addImage}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-white hover:text-primary"
        >
          <span className="material-symbols-outlined text-[18px]">image</span>
        </button>
        <button
          type="button"
          title="Xóa định dạng"
          onClick={() => runCommand("removeFormat")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-white hover:text-primary"
        >
          <span className="material-symbols-outlined text-[18px]">format_clear</span>
        </button>
        <span className="mx-1 h-5 w-px bg-outline-variant" />
        <button
          type="button"
          onClick={() => setSourceMode((open) => !open)}
          className={`ml-auto flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-bold ${
            sourceMode ? "bg-primary text-white" : "text-on-surface-variant hover:bg-white hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">code</span>
          HTML
        </button>
      </div>

      {sourceMode ? (
        <textarea
          rows={18}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="<h2>Tiêu đề mục</h2><p>Nội dung bài viết...</p>"
          className="min-h-[420px] w-full resize-y bg-white px-4 py-3 font-mono text-sm leading-relaxed outline-none"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncEditor}
          onBlur={syncEditor}
          className="min-h-[420px] px-5 py-4 text-sm leading-relaxed outline-none empty:before:text-on-surface-variant/50 empty:before:content-['Viết_nội_dung_bài_viết_ở_đây...'] [&_a]:font-semibold [&_a]:text-primary [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-solar-orange [&_blockquote]:bg-surface-container-low [&_blockquote]:px-4 [&_blockquote]:py-3 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-bold [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl [&_li]:ml-5 [&_p]:mb-3 [&_ul]:mb-4 [&_ul]:list-disc"
        />
      )}
    </div>
  );
}

function SeoAuditPanel({ audit }: { audit: SeoAudit }) {
  const scoreClass =
    audit.score >= 80
      ? "bg-green-100 text-green-700"
      : audit.score >= 55
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";
  const statusClass: Record<SeoStatus, string> = {
    good: "bg-green-100 text-green-700",
    warn: "bg-amber-100 text-amber-700",
    bad: "bg-red-100 text-red-700",
  };
  const icon: Record<SeoStatus, string> = {
    good: "check_circle",
    warn: "error",
    bad: "cancel",
  };

  return (
    <div className="rounded-2xl border border-outline-variant/50 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-on-surface">Kiểm tra SEO nhanh</h3>
          <p className="mt-1 text-xs text-on-surface-variant">
            Gợi ý nội bộ để tối ưu trước khi đăng, không thay thế kiểm duyệt biên tập.
          </p>
        </div>
        <div className={`rounded-2xl px-4 py-2 text-center ${scoreClass}`}>
          <p className="text-2xl font-black leading-none">{audit.score}</p>
          <p className="text-[10px] font-bold uppercase">SEO score</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {audit.checks.map((check) => (
          <div key={check.label} className="rounded-xl border border-outline-variant/40 p-3">
            <div className="mb-1 flex items-center gap-2">
              <span className={`material-symbols-outlined rounded-full text-[18px] ${statusClass[check.status]}`}>
                {icon[check.status]}
              </span>
              <p className="text-sm font-bold text-on-surface">{check.label}</p>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant">{check.detail}</p>
            {check.status !== "good" && (
              <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">{check.suggestion}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type FormData = Omit<BlogArticle, "tags"> & { tags: string };

const EMPTY_FORM: FormData = {
  id: "",
  title: "",
  slug: "",
  coverImage: "",
  excerpt: "",
  content: "",
  categorySlug: "hoat-dong",
  tags: "",
  status: "draft",
  authorName: "",
  publishedAt: null,
  updatedAt: "",
  readTime: 3,
  featured: false,
};

function formToArticle(f: FormData): BlogArticle {
  return {
    ...f,
    tags: f.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

export default function BlogTab() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/cms/blog")
      .then((r) => r.json())
      .then((d: BlogContent) => setArticles(d.articles ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setSlugManual(false);
    setFormOpen(true);
  }

  function openEdit(article: BlogArticle) {
    setForm({ ...article, tags: article.tags.join(", ") });
    setSlugManual(true);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setForm(EMPTY_FORM);
  }

  function patch<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugManual) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
  }

  async function save() {
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    const article = formToArticle(form);
    if (article.status === "published" && !article.publishedAt) {
      article.publishedAt = new Date().toISOString();
    }
    await fetch("/api/cms/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    });
    setSaving(false);
    closeForm();
    load();
  }

  async function toggleStatus(article: BlogArticle) {
    const newStatus = article.status === "published" ? "draft" : "published";
    await fetch(`/api/cms/blog/${article.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  async function confirmDelete() {
    if (!deletingId) return;
    await fetch(`/api/cms/blog/${deletingId}`, { method: "DELETE" });
    setDeletingId(null);
    load();
  }

  const filtered = filter === "all" ? articles : articles.filter((a) => a.status === filter);
  const publishedCount = articles.filter((a) => a.status === "published").length;
  const seoAudit = useMemo(() => analyzeSeo(form), [form]);

  // ── Form view ──
  if (formOpen) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeForm}
            className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Danh sách bài viết
          </button>
          <span className="text-on-surface-variant/40">·</span>
          <span className="text-sm font-semibold text-on-surface">
            {form.id ? "Chỉnh sửa bài viết" : "Viết bài mới"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-outline-variant/50 p-6 space-y-4">
              <h3 className="text-sm font-bold text-on-surface">Nội dung bài viết</h3>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => patch("title", e.target.value)}
                  placeholder="Tiêu đề bài viết..."
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Đường dẫn (slug) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-outline-variant overflow-hidden focus-within:border-primary">
                  <span className="px-3 py-2.5 text-xs text-on-surface-variant bg-surface-container border-r border-outline-variant shrink-0">
                    /tin-tuc/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => { setSlugManual(true); patch("slug", e.target.value); }}
                    placeholder="ten-bai-viet"
                    className="flex-1 px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Mô tả SEO ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => patch("excerpt", e.target.value)}
                  placeholder="Viết 1-2 câu tóm tắt bài viết để hiển thị trên Google và trang danh sách..."
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none"
                />
                <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant/70">
                  Đây chính là meta description SEO: Google có thể dùng đoạn này dưới tiêu đề tìm kiếm. Nên viết khoảng 120-160 ký tự.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Nội dung bài viết
                  <span className="ml-2 font-normal text-on-surface-variant/60">(HTML editor)</span>
                </label>
                <RichHtmlEditor value={form.content} onChange={(value) => patch("content", value)} />
              </div>
            </div>
            <SeoAuditPanel audit={seoAudit} />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish settings */}
            <div className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-4">
              <h3 className="text-sm font-bold text-on-surface">Xuất bản</h3>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Trạng thái</label>
                <div className="flex gap-2">
                  {(["draft", "published"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => patch("status", s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                        form.status === s
                          ? s === "published"
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-on-surface text-white border-on-surface"
                          : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface-variant">Bài viết nổi bật</label>
                <button
                  type="button"
                  onClick={() => patch("featured", !form.featured)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : ""}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || !form.title.trim() || !form.slug.trim()}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
                  style={{ background: CMS_GREEN }}
                >
                  {saving ? "Đang lưu..." : "Lưu bài viết"}
                </button>
              </div>
            </div>

            {/* Cover image */}
            <div className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-3">
              <h3 className="text-sm font-bold text-on-surface">Ảnh bìa</h3>
              <ImageUploadSlot
                value={form.coverImage}
                onChange={(v) => patch("coverImage", v)}
                hint="1200×630px · Tỉ lệ 1.91:1"
                maxWidth={1200}
                maxHeight={630}
                previewHeight="h-32"
              />
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-4">
              <h3 className="text-sm font-bold text-on-surface">Thông tin bài viết</h3>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Danh mục</label>
                <select
                  value={form.categorySlug}
                  onChange={(e) => patch("categorySlug", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Thẻ tag</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => patch("tags", e.target.value)}
                  placeholder="tình nguyện, hà giang, ..."
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary"
                />
                <p className="text-[11px] text-on-surface-variant/60 mt-1">Cách nhau bằng dấu phẩy</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Tác giả</label>
                <select
                  value={form.authorName}
                  onChange={(e) => patch("authorName", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary bg-white"
                >
                  <option value="">Chọn tác giả</option>
                  {CMS_AUTHORS.map((author) => (
                    <option key={author.id} value={author.displayName}>
                      {author.displayName} — {ROLE_LABELS[author.role]}
                    </option>
                  ))}
                  {form.authorName && !CMS_AUTHORS.some((author) => author.displayName === form.authorName) && (
                    <option value={form.authorName}>{form.authorName}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Thời gian đọc (phút)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={form.readTime}
                  onChange={(e) => patch("readTime", Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Blog & Tin tức</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {articles.length} bài viết · {publishedCount} đã đăng
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-on-surface text-surface"
                  : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {f === "all" ? "Tất cả" : STATUS_LABEL[f]}
            </button>
          ))}
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: CMS_GREEN }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Viết bài mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-on-surface-variant text-sm">Đang tải...</div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: 40 }}>article</span>
              <p className="mt-2 text-sm">
                {filter === "all" ? "Chưa có bài viết nào. Nhấn \"Viết bài mới\" để bắt đầu." : "Không có bài viết nào"}
              </p>
            </div>
          ) : (
            filtered.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-outline-variant/50 p-4 flex items-start gap-4"
              >
                {/* Cover thumbnail */}
                <div className="w-20 h-14 rounded-xl bg-surface-container shrink-0 overflow-hidden flex items-center justify-center">
                  {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant/40" style={{ fontSize: 24 }}>image</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CLASS[article.status]}`}>
                      {STATUS_LABEL[article.status]}
                    </span>
                    {(() => {
                      const cat = CATEGORIES.find((c) => c.slug === article.categorySlug);
                      return cat ? (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-deep-amethyst/10 text-deep-amethyst">
                          {cat.name}
                        </span>
                      ) : null;
                    })()}
                    {article.tags.map((t) => (
                      <span key={t} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/8 text-primary/70">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-sm text-on-surface leading-snug">{article.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{article.excerpt}</p>
                  <p className="text-[11px] text-on-surface-variant/60 mt-1">
                    {article.authorName || "—"} · Cập nhật {formatDateVN(article.updatedAt)}
                    {article.featured && (
                      <span className="ml-2 text-solar-orange font-semibold">★ Nổi bật</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleStatus(article)}
                    title={article.status === "published" ? "Chuyển sang nháp" : "Đăng bài"}
                    className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {article.status === "published" ? "unpublished" : "publish"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(article)}
                    className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(article.id)}
                    className="p-2 rounded-lg hover:bg-error-container transition-colors text-on-surface-variant hover:text-error"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error mt-0.5">warning</span>
              <div>
                <p className="font-semibold text-on-surface">Xóa bài viết?</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-error text-white hover:bg-error/90 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
