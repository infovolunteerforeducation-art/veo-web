"use client";

import { useState } from "react";

export type FAQItem = {
  q: string;
  a: string;
};

const defaultFaqs: FAQItem[] = [
  {
    q: "Trại hè tình nguyện VEO dành cho độ tuổi nào?",
    a: "Chương trình phù hợp với học sinh, sinh viên từ 10 đến 22 tuổi. Các nhóm tuổi được chia theo cấp học để hoạt động, mức thử thách và mentor đồng hành phù hợp hơn.",
  },
  {
    q: "Lịch trình 6 ngày 5 đêm gồm những hoạt động gì?",
    a: "Mỗi ngày kết hợp hoạt động cộng đồng, trải nghiệm văn hóa địa phương, sinh hoạt nhóm và phiên phản tư kỹ năng. Các bạn có thể tham gia dạy học, trồng cây, chuẩn bị học liệu, giao lưu bản địa và thực hiện dự án nhỏ theo nhóm.",
  },
  {
    q: "Chi phí tham gia đã bao gồm những gì?",
    a: "Chi phí trọn gói thường bao gồm di chuyển theo đoàn từ điểm tập trung, ăn ở, điều phối viên, hoạt động tình nguyện, dụng cụ học tập, bảo hiểm cơ bản, áo chương trình và chứng nhận tham gia.",
  },
  {
    q: "Phụ huynh có được cập nhật tình hình của con không?",
    a: "Có. Đội ngũ điều phối cập nhật lịch trình, hình ảnh và các ghi chú quan trọng trong suốt hành trình. Trưởng đoàn luôn có kênh liên lạc khẩn cấp với phụ huynh.",
  },
  {
    q: "Chương trình có đảm bảo an toàn không?",
    a: "An toàn là ưu tiên hàng đầu. Mỗi đoàn có leader, quy trình điểm danh, quy tắc sinh hoạt, phương án y tế cơ bản và tiêu chuẩn lựa chọn điểm đến phù hợp với độ tuổi tham gia.",
  },
  {
    q: "Sau trại hè, học viên nhận được gì?",
    a: "Các bạn nhận chứng nhận tham gia, nhật ký trải nghiệm, kỹ năng làm việc nhóm, giao tiếp, tự lập, tư duy phản biện và một góc nhìn thực tế hơn về trách nhiệm với cộng đồng.",
  },
];

export default function FAQAccordion({ items = defaultFaqs }: { items?: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((faq, index) => {
        const isOpen = open === index;
        return (
          <div key={faq.q} className="overflow-hidden rounded-xl border border-outline-variant/40 bg-white">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-container-low"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-bold leading-snug text-primary sm:text-base">
                <span className="mr-2 text-solar-orange">{index + 1}.</span>{faq.q}
              </span>
              <span
                className="material-symbols-outlined shrink-0 text-primary transition-transform"
                style={{ fontSize: 22, transform: isOpen ? "rotate(45deg)" : "none" }}
              >
                add
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-outline-variant/30 px-5 py-4 text-sm leading-relaxed text-on-surface-variant">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
