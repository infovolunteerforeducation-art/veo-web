"use client";

import { useRef } from "react";

const testimonials = [
  {
    quote:
      "Chuyến đi Sapa cùng VEO không chỉ là du lịch. Đó là lần đầu tiên mình cảm thấy sự hiện diện của mình có giá trị đến vậy khi nhìn thấy nụ cười của các em nhỏ.",
    name: "Minh Anh",
    role: "Sinh viên Đại học Ngoại Thương",
    avatar:
      "https://images.unsplash.com/photo-1541585383275-5dc2beab62f1?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
  },
  {
    quote:
      "Lần đầu tiên tham gia CSR cùng công ty qua VEO, tôi thực sự ấn tượng với cách tổ chức chuyên nghiệp và sự gắn kết tuyệt vời giữa các đồng nghiệp.",
    name: "Hoàng Nam",
    role: "Quản lý cấp cao tại TechComBank",
    avatar:
      "https://images.unsplash.com/photo-1487309078313-fad80c3ec1e5?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
  },
  {
    quote:
      "Mọi thứ đều hoàn hảo từ lịch trình đến sự hỗ trợ của các bạn dẫn đoàn. Một trải nghiệm đáng giá mà ai cũng nên thử ít nhất một lần.",
    name: "Thu Trang",
    role: "Freelance Photographer",
    avatar:
      "https://images.unsplash.com/photo-1611403119860-57c4937ef987?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
  },
  {
    quote:
      "Tham gia workcamp tại Điện Biên là quyết định đúng đắn nhất của tôi năm nay. Được sống cùng bà con, hiểu thêm về văn hóa địa phương — điều không sách giáo khoa nào dạy được.",
    name: "Bảo Trân",
    role: "Kỹ sư phần mềm tại FPT",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
  },
  {
    quote:
      "Đội ngũ VEO rất nhiệt tình và chu đáo. Mọi lo lắng trước chuyến đi đều tan biến ngay khi tôi gặp các bạn. Tôi đã đăng ký thêm 2 chuyến nữa rồi!",
    name: "Quốc Huy",
    role: "Giáo viên tiểu học",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
  },
  {
    quote:
      "Chuyến đi không chỉ giúp tôi đóng góp cho cộng đồng mà còn cho tôi thêm động lực sống. Những khoảnh khắc với các em nhỏ vùng cao sẽ theo tôi mãi mãi.",
    name: "Lan Phương",
    role: "Bác sĩ tại Bệnh viện Bạch Mai",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
  },
];

const StarIcon = () => (
  <span
    className="material-symbols-outlined text-solar-orange"
    style={{ fontVariationSettings: "'FILL' 1" }}
  >
    star
  </span>
);

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : 300;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 max-w-[1200px] mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          Cảm nhận tình nguyện viên
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="hidden lg:flex w-10 h-10 rounded-full border border-outline-variant items-center justify-center transition-colors hover:border-primary/50 hover:bg-primary/5"
            aria-label="Trước"
          >
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="hidden lg:flex w-10 h-10 rounded-full border border-outline-variant items-center justify-center transition-colors hover:border-primary/50 hover:bg-primary/5"
            aria-label="Tiếp theo"
          >
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>chevron_right</span>
          </button>
        </div>
      </div>

      {/* Scroll track */}
      <div className="relative">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-transparent to-[#f9f9f9] lg:hidden" />
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="shrink-0 snap-start w-[85%] sm:w-[44%] lg:w-[calc(33.333%-16px)] glass-card p-6 lg:p-8 rounded-2xl shadow-sm border-l-4 border-solar-orange flex flex-col"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <p className="text-sm italic text-on-surface mb-6 leading-relaxed flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-surface-variant overflow-hidden shrink-0">
                <img className="w-full h-full object-cover" src={t.avatar} alt={t.name} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">{t.name}</h4>
                <p className="text-xs text-on-surface-variant">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>{/* end relative wrapper */}
    </section>
  );
}
