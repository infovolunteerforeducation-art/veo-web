const stats = [
  { icon: "groups", value: "50,000+", label: "Tình nguyện viên" },
  { icon: "school", value: "120+", label: "Dự án giáo dục" },
  { icon: "public", value: "15+", label: "Tỉnh thành tham gia" },
  { icon: "favorite", value: "1M+", label: "Giờ tình nguyện" },
];

export default function StatsSection() {
  return (
    <section className="py-10 -mt-20 relative z-20 max-w-[1200px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
          >
            <span className="material-symbols-outlined text-primary text-4xl mb-3">
              {stat.icon}
            </span>
            <span className="text-3xl font-bold text-primary mb-1">
              {stat.value}
            </span>
            <span className="text-sm font-semibold text-on-surface-variant">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
