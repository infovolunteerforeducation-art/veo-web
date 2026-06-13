import ScrollReveal from "@/components/layout/ScrollReveal";

const testimonials = [
  {
    quote:
      "Thật sự là một chuyến đi tuyệt vời. Từ cách gần gũi, quan tâm của chị Dương - chủ homestay và gia đình giúp đỡ tổ chức tất cả mọi thứ. Lên kế hoạch hoạt động cùng với team cũng như là 1 buổi tối gala thật sự rất vui và hay là được chèo thuyền kayak rồi cùng mọi người leo lên thác. Đây là những điều không thể quên được. Được gọi là một trong những chuyến đi vui nhất của em. Thật sự rất là vui ạ. Cảm ơn các anh, chị V.E.O rất nhiều.",
    name: "Minh Anh",
    role: "Tình nguyện viên tham gia chuyến Na Hang",
    avatar:
      "https://images.unsplash.com/photo-1541585383275-5dc2beab62f1?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
  },
  {
    quote:
      "Lần đầu đi Mù Căng Chải với VEO nhìn chung là nhiều kỷ niệm tuyệt vời, thực sự trong VEO luôn. Được đi với 1 đoàn cả già cả trẻ cả trai cả gái, mỗi người một tính được mỗi điểm chung là đầy nhiệt huyết rồi cũng tưởng sẽ chẳng nhớ nhau mấy đâu mà khi về thì nhớ không tưởng. Chuyến đi này mình còn được trải nghiệm hằng tá thứ hay mà chưa thử bao giờ nữa… Cảm ơn VEO vì chuyến đi 10d này!",
    name: "Minh Ngọc",
    role: "Tình nguyện viên tham gia chuyến Mù Cang Chải",
    avatar:
      "https://images.unsplash.com/photo-1611403119860-57c4937ef987?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
  },
  {
    quote:
      "Trước hết thì mình gửi lời cảm ơn tới VEO vì đã tạo nên những chuyến du lịch tình nguyện rất ý nghĩa không chỉ đối với người dân tại đó mà cả với những người tham gia chương trình. Mình cũng gửi lời cảm ơn đặc biệt tới anh Lâm và chị Diệp, những người đã cố gắng hết sức để đảm bảo chuyến đi diễn ra an toàn và đúng lịch trình nhất. Hi vọng sẽ được đồng hành cùng VEO ở tất cả các địa điểm du lịch tình nguyện hiện có. Học theo câu nói của anh Lâm “YÊU VEO, Yêu thương tất cả mọi người” 💗",
    name: "Mỹ Anh",
    role: "Tình nguyện viên tham gia chuyến Ma Bó",
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
  return (
    <section className="py-20 max-w-[1200px] mx-auto px-4 sm:px-6">
      <ScrollReveal className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          Cảm nhận tình nguyện viên
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, index) => (
          <ScrollReveal
            key={t.name}
            className="glass-card p-6 lg:p-8 rounded-2xl shadow-sm border-l-4 border-solar-orange flex flex-col"
            delay={index * 90}
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
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
