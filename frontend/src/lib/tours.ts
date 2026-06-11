export type Tour = {
  slug: string;
  title: string;
  destinationName: string;
  category: string;
  categoryClass: string;
  image: string;
  gallery: string[];
  dateRange: string;
  date: string;
  duration: string;
  location: string;
  region: "north" | "south";
  departureCity: string;
  ageRange: string;
  groupSize: string;
  spotsLeft: number;
  totalSpots: number;
  registrationPercent: number;
  shortDescription: string;
  heroDescription: string;
  price: string;
  priceNumber: number;
  originalPrice?: string;
  deadline: string;
  goalsDescription?: string;
  goals: string[];
  itinerary: {
    day: number;
    title: string;
    activities: {
      timeFrom: string;
      timeTo: string;
      name: string;
      description: string;
      images?: string[];
    }[];
  }[];
  requirements: { icon: string; label: string; description: string }[];
  included: string[];
  notIncluded: string[];
  policies?: { icon: string; title: string; items: string[] }[];
  impactMetrics: { label: string; percent: number }[];
  miniTestimonial: { quote: string; name: string; role: string };
};

export const tours: Tour[] = [
  {
    slug: "sapa-xay-truong-hau-thao",
    title: "Xây trường cho em tại Mèo Vạc",
    destinationName: "Mèo Vạc – Hà Giang",
    category: "Giáo dục",
    categoryClass: "bg-solar-orange text-pure-white",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFHyoeAAzXiUFmGWEI5n1Xuiqq3a1oBAMi-3AIu0NwmwcPkzmyWfWQafW9TO6WbkIynPrSInBkNUEE2vSvd0n-3icwEN7RTB_Ir5akNvhMKq9Kb308UDU_E7Fv4P3Dxi8ttrCajoDP_gNEuF4Yf97FftlsN-KkfNPrRk58jWr0I2gLhNJ5hQK9isdPMMOzSyPQ4ceONkco4mWeJcv6pDzppAX275d0-OygG2-WluT7MwlpbFtnLUMhp_IixDSC3kO0euNfI6Th9_w",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDD6CxYZAUaASxNFTY3S6WA060YTMg4Czut9HCzM_oRbPwjyf0-g1KlxeX-oZr9mHXzQRc0emb4DmHDWMGdcfaoBHlwCafDLyryvdLZvSd1LuWEj5BOGsk_p1o7p3D6ruhdG03tFHSyhwfs96HOsFkNLDvL1X4zvh_NOwwbLAt1Dth-2izUHQxd5-w3IvyClYrwkT18s9WXxyX_Lfa88a-U4ETugmC3CdtM4N2Kg7hkoGS09znfU88uj1hq-h8FUubAX_TAVUSRXrY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARoxIiN14kvJCedbsGF_65xL0ubO1q72LK9pSPA_ejQITn-wf7s4UCvRv5aqJOtbH6BdgpNbWErN-7vOcTBLnlbtt5rt4vgaeerbWgBx4wGR_DxgyDHs2-EFQKpFu25Rrg2W0AmkqowuhMuNnBZynxntxzSfOXhc-ZnAKkb2F_IeQfZ7i8rKpaAVZNcjCNIrYKFEAHalo-rVN1_Jwnaq_y1tVlaZHOsYE_4Xbrh4FdgO6L-GRaVEiJCGuO6RMIyQGf0o_CuXJsSeU",
    ],
    dateRange: "15/10 - 17/10",
    date: "Oct 15",
    duration: "3 Ngày 2 Đêm",
    location: "Hà Giang",
    region: "north",
    departureCity: "Hà Nội",
    ageRange: "18 - 35",
    groupSize: "15-20 người",
    spotsLeft: 8,
    totalSpots: 20,
    registrationPercent: 60,
    shortDescription: "Hành trình ý nghĩa mang tri thức đến với trẻ em vùng cao, xây dựng tương lai bền vững.",
    heroDescription:
      "Hành trình ý nghĩa mang tri thức đến với trẻ em vùng cao, xây dựng tương lai bền vững qua từng viên gạch và những tiết học yêu thương.",
    price: "2.500.000 VNĐ",
    priceNumber: 2500000,
    originalPrice: "3.200.000 VNĐ",
    deadline: "10/10/2025",
    goals: [
      "Hoàn thiện 2 phòng học mới với đầy đủ trang thiết bị bàn ghế.",
      "Tổ chức các lớp kỹ năng sống và tiếng Anh cơ bản cho 50+ học sinh.",
      "Trao tặng 100 suất quà bao gồm sách vở và đồ dùng học tập.",
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: Hà Nội – Mèo Vạc",
        activities: [
          { timeFrom: "05:30", timeTo: "07:00", name: "Tập kết & Khởi hành", description: "Tập kết tại điểm hẹn, phân chia xe và xuất phát lên Hà Giang.", images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDD6CxYZAUaASxNFTY3S6WA060YTMg4Czut9HCzM_oRbPwjyf0-g1KlxeX-oZr9mHXzQRc0emb4DmHDWMGdcfaoBHlwCafDLyryvdLZvSd1LuWEj5BOGsk_p1o7p3D6ruhdG03tFHSyhwfs96HOsFkNLDvL1X4zvh_NOwwbLAt1Dth-2izUHQxd5-w3IvyClYrwkT18s9WXxyX_Lfa88a-U4ETugmC3CdtM4N2Kg7hkoGS09znfU88uj1hq-h8FUubAX_TAVUSRXrY"] },
          { timeFrom: "12:00", timeTo: "14:00", name: "Đến Mèo Vạc – Nhận phòng homestay", description: "Nhận phòng homestay tại bản, ăn trưa cùng gia đình chủ nhà." },
          { timeFrom: "15:00", timeTo: "18:00", name: "Làm quen cộng đồng & Phổ biến kế hoạch", description: "Gặp gỡ đội ngũ địa phương và các em nhỏ. Họp nhóm, phân chia nhiệm vụ cho ngày tình nguyện hôm sau." },
        ],
      },
      {
        day: 2,
        title: "Ngày 2: Hoạt động tình nguyện",
        activities: [
          { timeFrom: "07:00", timeTo: "12:00", name: "Xây dựng & Sơn sửa lớp học", description: "Sơn sửa lớp học, vẽ tranh tường cổ động, lắp đặt bàn ghế và trang thiết bị học tập.", images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuARoxIiN14kvJCedbsGF_65xL0ubO1q72LK9pSPA_ejQITn-wf7s4UCvRv5aqJOtbH6BdgpNbWErN-7vOcTBLnlbtt5rt4vgaeerbWgBx4wGR_DxgyDHs2-EFQKpFu25Rrg2W0AmkqowuhMuNnBZynxntxzSfOXhc-ZnAKkb2F_IeQfZ7i8rKpaAVZNcjCNIrYKFEAHalo-rVN1_Jwnaq_y1tVlaZHOsYE_4Xbrh4FdgO6L-GRaVEiJCGuO6RMIyQGf0o_CuXJsSeU", "https://lh3.googleusercontent.com/aida-public/AB6AXuDD6CxYZAUaASxNFTY3S6WA060YTMg4Czut9HCzM_oRbPwjyf0-g1KlxeX-oZr9mHXzQRc0emb4DmHDWMGdcfaoBHlwCafDLyryvdLZvSd1LuWEj5BOGsk_p1o7p3D6ruhdG03tFHSyhwfs96HOsFkNLDvL1X4zvh_NOwwbLAt1Dth-2izUHQxd5-w3IvyClYrwkT18s9WXxyX_Lfa88a-U4ETugmC3CdtM4N2Kg7hkoGS09znfU88uj1hq-h8FUubAX_TAVUSRXrY"] },
          { timeFrom: "13:30", timeTo: "17:00", name: "Lớp học tình nguyện cho trẻ em", description: "Tổ chức các lớp học sáng tạo: vẽ, kỹ năng sống, tiếng Anh cơ bản. Phát học bổng và quà tặng cho học sinh." },
          { timeFrom: "18:00", timeTo: "20:30", name: "Giao lưu văn hóa & Ăn tối cộng đồng", description: "Giao lưu văn nghệ cùng người dân bản địa, thưởng thức ẩm thực địa phương." },
        ],
      },
      {
        day: 3,
        title: "Ngày 3: Khám phá & Trở về",
        activities: [
          { timeFrom: "07:00", timeTo: "10:00", name: "Đèo Mã Pì Lèng & Sông Nho Quế", description: "Chinh phục cung đèo hùng vĩ nhất Hà Giang, ngắm dòng sông Nho Quế xanh biếc uốn lượn giữa vách đá." },
          { timeFrom: "10:30", timeTo: "12:30", name: "Tổng kết & Nhận chứng nhận", description: "Chụp ảnh lưu niệm, nhận chứng nhận tình nguyện viên VEO và chia sẻ cảm nhận sau hành trình." },
          { timeFrom: "13:00", timeTo: "20:00", name: "Di chuyển về Hà Nội", description: "Lên xe về Hà Nội. Dự kiến về đến điểm tập kết lúc 20:00." },
        ],
      },
    ],
    requirements: [
      {
        icon: "psychology",
        label: "Kỹ năng",
        description:
          "Ưu tiên các bạn có khả năng giảng dạy, nghệ thuật (vẽ, hát) hoặc kinh nghiệm tổ chức sự kiện cộng đồng.",
      },
      {
        icon: "health_and_safety",
        label: "Sức khỏe",
        description:
          "Đảm bảo sức khỏe tốt để thích nghi với điều kiện di chuyển vùng cao và tham gia các hoạt động chân tay.",
      },
    ],
    included: [
      "Xe đưa đón khứ hồi Hà Nội – Hà Giang",
      "Homestay 2 đêm tại bản",
      "Toàn bộ bữa ăn trong chương trình (6 bữa)",
      "Dụng cụ tình nguyện và bảo hộ lao động",
      "Bảo hiểm tai nạn",
      "Chứng nhận tình nguyện viên VEO",
    ],
    notIncluded: ["Chi phí cá nhân", "Đồ uống ngoài bữa chính", "Thuốc cá nhân"],
    policies: [
      {
        icon: "event_busy",
        title: "Hủy đặt chỗ",
        items: [
          "Hủy trước 14 ngày khởi hành: hoàn 80% phí chương trình.",
          "Hủy từ 7–13 ngày trước khởi hành: hoàn 50% phí chương trình.",
          "Hủy dưới 7 ngày hoặc không tham gia: không hoàn phí.",
        ],
      },
      {
        icon: "bookmark_add",
        title: "Bảo lưu",
        items: [
          "Có thể bảo lưu phí sang chuyến khác trong vòng 6 tháng kể từ ngày hủy.",
          "Chỉ áp dụng khi thông báo hủy trước ít nhất 5 ngày khởi hành.",
          "Phí bảo lưu áp dụng tối đa 1 lần.",
        ],
      },
      {
        icon: "rule",
        title: "Quy định tham gia",
        items: [
          "Tôn trọng văn hóa, phong tục địa phương trong suốt hành trình.",
          "Tuân thủ lịch trình và hướng dẫn của ban tổ chức.",
          "Không sử dụng chất kích thích, đồ uống có cồn trong giờ hoạt động tình nguyện.",
        ],
      },
    ],
    impactMetrics: [
      { label: "Gây quỹ xây trường", percent: 75 },
      { label: "Tình nguyện viên đăng ký", percent: 60 },
    ],
    miniTestimonial: {
      quote:
        "Một chuyến đi thay đổi hoàn toàn suy nghĩ của mình về cuộc sống. Trẻ em Mèo Vạc rất ngoan và hiếu học!",
      name: "Nguyễn Lan Anh",
      role: "Volunteer 2023",
    },
  },
  {
    slug: "ly-son-lam-sach-dai-duong",
    title: "Lý Sơn: Chiến dịch làm sạch đại dương",
    destinationName: "Đảo Lý Sơn",
    category: "Môi trường",
    categoryClass: "bg-tertiary-container text-pure-white",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjUk4TId8QkTzVLLcaukZHEuWFnUV2Q6TcGu4lHrke9aIbx9KCv4oZsaNseqvxVU19V86TWlSdxbJ_DbXvV0-5GrxLaDAVEQXiaG5OuVy0wsBnnxmYiz8TxKzRp6Zjtu9T8UDXlR7HqM-lUTR7EvyDs8aP00bGvcz9rUfulW53Zttu01i_qlfXzEx1XzqajQBScVtgli_pRq0z7qE-1JM-7qjs1BNB384HRk_9iLZSo3cLKKDNUZULeQudro0UiJqTQVUXmi6iQbU",
    gallery: [],
    dateRange: "22/10 - 24/10",
    date: "Nov 02",
    duration: "3 Ngày 2 Đêm",
    location: "Quảng Ngãi",
    region: "south",
    departureCity: "Đà Nẵng",
    ageRange: "18 - 40",
    groupSize: "20-25 người",
    spotsLeft: 12,
    totalSpots: 25,
    registrationPercent: 40,
    shortDescription: "Kết hợp nghỉ dưỡng tại đảo Lý Sơn và hành động vì môi trường biển xanh, sạch, đẹp.",
    heroDescription:
      "Hòn đảo Lý Sơn đang đối mặt với ô nhiễm rác thải ngày càng nghiêm trọng. Cùng VEO dọn sạch bờ biển và lặn biển thu gom rác.",
    price: "3.200.000 VNĐ",
    priceNumber: 3200000,
    deadline: "18/10/2025",
    goals: [
      "Thu gom ít nhất 500kg rác thải nhựa trên bờ biển và dưới nước.",
      "Workshop nâng cao ý thức bảo vệ môi trường cho 100 ngư dân địa phương.",
      "Ghi nhận và báo cáo hiện trạng rạn san hô khu vực đảo.",
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: TP.HCM – Lý Sơn",
        activities: [
          { timeFrom: "06:00", timeTo: "11:00", name: "Di chuyển TP.HCM – Quảng Ngãi", description: "Khởi hành từ TP.HCM, di chuyển bằng xe đến cảng Sa Kỳ, Quảng Ngãi." },
          { timeFrom: "11:30", timeTo: "13:00", name: "Tàu cao tốc ra đảo Lý Sơn", description: "Bắt tàu cao tốc từ cảng Sa Kỳ ra đảo Lý Sơn (khoảng 30 phút).", images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBjUk4TId8QkTzVLLcaukZHEuWFnUV2Q6TcGu4lHrke9aIbx9KCv4oZsaNseqvxVU19V86TWlSdxbJ_DbXvV0-5GrxLaDAVEQXiaG5OuVy0wsBnnxmYiz8TxKzRp6Zjtu9T8UDXlR7HqM-lUTR7EvyDs8aP00bGvcz9rUfulW53Zttu01i_qlfXzEx1XzqajQBScVtgli_pRq0z7qE-1JM-7qjs1BNB384HRk_9iLZSo3cLKKDNUZULeQudro0UiJqTQVUXmi6iQbU"] },
          { timeFrom: "14:00", timeTo: "18:00", name: "Nhận phòng & Phổ biến an toàn biển", description: "Check-in nhà nghỉ, họp nhóm phổ biến kế hoạch và quy tắc an toàn khi hoạt động trên biển." },
        ],
      },
      {
        day: 2,
        title: "Ngày 2: Dọn sạch biển & Hội thảo",
        activities: [
          { timeFrom: "06:30", timeTo: "11:00", name: "Dọn rác bãi biển An Hải & Đông", description: "Chia nhóm dọn rác tại 2 bãi biển trọng điểm, phân loại rác nhựa và ghi chép số liệu." },
          { timeFrom: "13:00", timeTo: "17:00", name: "Hội thảo môi trường & Trồng san hô", description: "Hội thảo nâng cao nhận thức môi trường biển. Hướng dẫn kỹ thuật trồng san hô nhân tạo." },
        ],
      },
      {
        day: 3,
        title: "Ngày 3: Khám phá đảo & Trở về",
        activities: [
          { timeFrom: "07:00", timeTo: "10:00", name: "Chùa Hang & Giếng Tiền", description: "Khám phá chùa Hang và cột đá Giếng Tiền hàng triệu năm tuổi, di sản địa chất độc đáo của Lý Sơn." },
          { timeFrom: "10:30", timeTo: "12:00", name: "Cánh đồng tỏi & Mua quà", description: "Tham quan cánh đồng tỏi đặc sản và mua quà lưu niệm." },
          { timeFrom: "14:00", timeTo: "20:00", name: "Tàu về đất liền & Di chuyển TP.HCM", description: "Bắt phà về cảng Sa Kỳ, xe về TP.HCM. Kết thúc hành trình bảo vệ đại dương." },
        ],
      },
    ],
    requirements: [
      { icon: "pool", label: "Bơi lội", description: "Biết bơi cơ bản, bắt buộc cho hoạt động lặn biển snorkel." },
      { icon: "health_and_safety", label: "Sức khỏe", description: "Không say sóng nặng, sức khỏe tốt." },
    ],
    included: [
      "Xe Đà Nẵng – Sa Kỳ – Đà Nẵng",
      "Vé tàu cao tốc khứ hồi",
      "Nhà nghỉ + cắm trại",
      "Toàn bộ bữa ăn",
      "Dụng cụ snorkel",
      "Bảo hiểm tai nạn",
    ],
    notIncluded: ["Vé máy bay đến Đà Nẵng", "Chi phí cá nhân"],
    policies: [
      {
        icon: "event_busy",
        title: "Hủy đặt chỗ",
        items: [
          "Hủy trước 14 ngày khởi hành: hoàn 80% phí chương trình.",
          "Hủy từ 7–13 ngày trước khởi hành: hoàn 50% phí chương trình.",
          "Hủy dưới 7 ngày hoặc không tham gia: không hoàn phí.",
        ],
      },
      {
        icon: "bookmark_add",
        title: "Bảo lưu",
        items: [
          "Có thể bảo lưu phí sang chuyến khác trong vòng 6 tháng kể từ ngày hủy.",
          "Chỉ áp dụng khi thông báo hủy trước ít nhất 5 ngày khởi hành.",
          "Phí bảo lưu áp dụng tối đa 1 lần.",
        ],
      },
      {
        icon: "rule",
        title: "Quy định tham gia",
        items: [
          "Tôn trọng văn hóa, phong tục địa phương trong suốt hành trình.",
          "Tuân thủ lịch trình và hướng dẫn của ban tổ chức.",
          "Không sử dụng chất kích thích, đồ uống có cồn trong giờ hoạt động tình nguyện.",
        ],
      },
    ],
    impactMetrics: [
      { label: "Mục tiêu thu gom rác", percent: 40 },
      { label: "Tình nguyện viên đăng ký", percent: 40 },
    ],
    miniTestimonial: {
      quote: "Lần đầu tiên tôi thấy mình thực sự có thể tạo ra sự khác biệt cho đại dương.",
      name: "Trần Minh Khoa",
      role: "Volunteer 2023",
    },
  },
  {
    slug: "da-lat-ky-nang-song-vung-cao",
    title: "Đà Lạt: Lớp học kỹ năng sống vùng cao",
    destinationName: "Đà Lạt – Lâm Đồng",
    category: "Kỹ năng",
    categoryClass: "bg-solar-orange text-pure-white",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLCy6JXBhPzAmy4s11n4jZ308SYPogdRu_FJS3MdGz-EjQlof-6WtB7MIBLWuS6PYmsebBL6IgYa1_aEBtpo9y3s9FXIPDe6cjwiyx2XcSKeKdqTAxNVh1aT5EEeGhpYvekeRTtXibvjopH4MpjJJ3U3b5WM_cmZqmAyJo40Hy-t9bsCWB2OhzH1IsybPiLO48pXPCvB1Wee0hl_S-MkMqyLUgZY5L_yaPCWSlKanC8xtliGyYTDG3nCzpwc-bZLiEMWBb-sgWvh0",
    gallery: [],
    dateRange: "05/11 - 07/11",
    date: "Dec 12",
    duration: "3 Ngày 2 Đêm",
    location: "Lâm Đồng",
    region: "south",
    departureCity: "TP.HCM",
    ageRange: "18 - 35",
    groupSize: "10-15 người",
    spotsLeft: 5,
    totalSpots: 15,
    registrationPercent: 67,
    shortDescription: "Trực tiếp đứng lớp chia sẻ kỹ năng mềm và tin học cơ bản cho trẻ em nghèo vùng cao.",
    heroDescription:
      "Trực tiếp đứng lớp chia sẻ các kiến thức về kỹ năng mềm, tin học cơ bản cho trẻ em nghèo.",
    price: "2.800.000 VNĐ",
    priceNumber: 2800000,
    deadline: "01/11/2025",
    goals: [
      "Tổ chức 6 buổi học kỹ năng mềm cho 40+ học sinh.",
      "Workshop tin học: dạy sử dụng máy tính và Internet an toàn.",
      "Trao tặng 50 suất học bổng dụng cụ học tập.",
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: TP.HCM – Đà Lạt",
        activities: [
          { timeFrom: "07:00", timeTo: "11:30", name: "Di chuyển TP.HCM – Đà Lạt", description: "Xe limousine xuất phát từ TP.HCM, lên Đà Lạt qua đèo Prenn." },
          { timeFrom: "13:00", timeTo: "15:00", name: "Check-in nhà nghỉ sinh thái", description: "Nhận phòng tại nhà nghỉ sinh thái gần khu trường học, ăn trưa và nghỉ ngơi." },
          { timeFrom: "15:30", timeTo: "18:30", name: "Tham quan trường & Làm quen học sinh", description: "Thăm điểm trường tại xã Lát, gặp gỡ thầy cô và các em học sinh, tìm hiểu hoàn cảnh địa phương.", images: ["https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800&q=80"] },
        ],
      },
      {
        day: 2,
        title: "Ngày 2: Đứng lớp kỹ năng sống",
        activities: [
          { timeFrom: "07:30", timeTo: "11:30", name: "3 Workshop kỹ năng song song", description: "Triển khai 3 workshop: sơ cứu, tài chính cá nhân và kỹ năng giao tiếp cho 80+ học sinh." },
          { timeFrom: "13:30", timeTo: "17:00", name: "Làm vườn rau sạch tại trường", description: "Cùng các em trồng rau, xây dựng vườn rau tự cung tự cấp. Trao đổi nông nghiệp bền vững với giáo viên." },
          { timeFrom: "18:00", timeTo: "20:00", name: "Giao lưu văn nghệ buổi tối", description: "Ăn tối cùng thầy cô và học sinh, giao lưu văn nghệ và chia sẻ ước mơ tương lai." },
        ],
      },
      {
        day: 3,
        title: "Ngày 3: Lễ tổng kết & Trở về",
        activities: [
          { timeFrom: "08:00", timeTo: "10:00", name: "Lễ trao học bổng & Chứng nhận", description: "Trao 150 bộ dụng cụ học tập và đồng phục. Chụp ảnh lưu niệm, nhận chứng nhận giảng viên tình nguyện." },
          { timeFrom: "10:30", timeTo: "13:00", name: "Tham quan vườn hoa & Hồ Tuyền Lâm", description: "Thư giãn tại vườn hoa Đà Lạt và hồ Tuyền Lâm, mua đặc sản địa phương." },
          { timeFrom: "14:00", timeTo: "20:00", name: "Di chuyển về TP.HCM", description: "Lên xe về TP.HCM. Kết thúc hành trình trao tặng kỹ năng sống." },
        ],
      },
    ],
    requirements: [
      { icon: "school", label: "Kiến thức", description: "Có kiến thức cơ bản trong một lĩnh vực: STEM, ngoại ngữ, nghệ thuật, kỹ năng mềm." },
      { icon: "child_care", label: "Tính cách", description: "Kiên nhẫn, nhiệt tình, yêu thích làm việc cùng trẻ em." },
    ],
    included: [
      "Xe TP.HCM – Đà Lạt khứ hồi",
      "Nhà nghỉ 1 đêm + cắm trại 1 đêm",
      "Toàn bộ bữa ăn",
      "Tài liệu giảng dạy",
      "Bảo hiểm tai nạn",
      "Chứng nhận giảng viên tình nguyện",
    ],
    notIncluded: ["Chi phí cá nhân", "Quà tặng cho học sinh"],
    policies: [
      {
        icon: "event_busy",
        title: "Hủy đặt chỗ",
        items: [
          "Hủy trước 14 ngày khởi hành: hoàn 80% phí chương trình.",
          "Hủy từ 7–13 ngày trước khởi hành: hoàn 50% phí chương trình.",
          "Hủy dưới 7 ngày hoặc không tham gia: không hoàn phí.",
        ],
      },
      {
        icon: "bookmark_add",
        title: "Bảo lưu",
        items: [
          "Có thể bảo lưu phí sang chuyến khác trong vòng 6 tháng kể từ ngày hủy.",
          "Chỉ áp dụng khi thông báo hủy trước ít nhất 5 ngày khởi hành.",
          "Phí bảo lưu áp dụng tối đa 1 lần.",
        ],
      },
      {
        icon: "rule",
        title: "Quy định tham gia",
        items: [
          "Tôn trọng văn hóa, phong tục địa phương trong suốt hành trình.",
          "Tuân thủ lịch trình và hướng dẫn của ban tổ chức.",
          "Không sử dụng chất kích thích, đồ uống có cồn trong giờ hoạt động tình nguyện.",
        ],
      },
    ],
    impactMetrics: [
      { label: "Mục tiêu học sinh", percent: 67 },
      { label: "Tình nguyện viên đăng ký", percent: 67 },
    ],
    miniTestimonial: {
      quote: "Ánh mắt của các em khi hiểu ra vấn đề — đó là điều tôi sẽ nhớ mãi.",
      name: "Lê Thu Hà",
      role: "Volunteer 2024",
    },
  },
  {
    slug: "can-gio-trong-rung-ngap-man",
    title: "Cần Giờ: Trồng rừng ngập mặn",
    destinationName: "Cần Giờ – TP.HCM",
    category: "Môi trường",
    categoryClass: "bg-tertiary-container text-pure-white",
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&q=80",
    gallery: [],
    dateRange: "29/07 - 31/07",
    date: "2026-07-29",
    duration: "3 Ngày 2 Đêm",
    location: "TP.HCM",
    region: "south",
    departureCity: "TP.HCM",
    ageRange: "16 - 35",
    groupSize: "15-25 người",
    spotsLeft: 9,
    totalSpots: 25,
    registrationPercent: 45,
    shortDescription: "Cùng phục hồi rừng ngập mặn, tìm hiểu hệ sinh thái ven biển và lan tỏa thói quen sống xanh.",
    heroDescription:
      "Hành trình phục hồi rừng ngập mặn Cần Giờ, kết hợp hoạt động trồng cây, dọn rác ven biển và giáo dục môi trường cho cộng đồng địa phương.",
    price: "2.200.000 VNĐ",
    priceNumber: 2200000,
    deadline: "25/07/2026",
    goals: [
      "Trồng mới 300 cây đước tại khu vực rừng ngập mặn cần phục hồi.",
      "Thu gom và phân loại rác tại tuyến bờ kênh, bãi bồi ven biển.",
      "Tổ chức buổi chia sẻ về bảo tồn hệ sinh thái ngập mặn cho học sinh địa phương.",
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: TP.HCM – Cần Giờ",
        activities: [
          { timeFrom: "07:00", timeTo: "10:00", name: "Di chuyển đến Cần Giờ", description: "Tập trung tại TP.HCM, di chuyển đến Cần Giờ và phổ biến kế hoạch hoạt động." },
          { timeFrom: "14:00", timeTo: "17:00", name: "Khảo sát khu vực trồng cây", description: "Làm quen địa hình bãi bồi, nhận dụng cụ và chia nhóm tình nguyện viên." },
        ],
      },
      {
        day: 2,
        title: "Ngày 2: Trồng rừng & Dọn rác",
        activities: [
          { timeFrom: "06:30", timeTo: "11:30", name: "Trồng cây ngập mặn", description: "Cùng đội ngũ địa phương trồng cây đước và ghi nhận số lượng cây hoàn thành." },
          { timeFrom: "14:00", timeTo: "17:00", name: "Dọn rác ven bờ", description: "Thu gom, phân loại rác nhựa và tổng kết số liệu rác thu được." },
        ],
      },
      {
        day: 3,
        title: "Ngày 3: Giáo dục môi trường & Trở về",
        activities: [
          { timeFrom: "08:00", timeTo: "10:30", name: "Workshop sống xanh", description: "Tổ chức hoạt động giáo dục môi trường cùng học sinh địa phương." },
          { timeFrom: "13:00", timeTo: "16:00", name: "Di chuyển về TP.HCM", description: "Tổng kết chương trình và trở về điểm tập trung ban đầu." },
        ],
      },
    ],
    requirements: [
      { icon: "eco", label: "Tinh thần", description: "Sẵn sàng tham gia hoạt động ngoài trời và làm việc nhóm." },
      { icon: "health_and_safety", label: "Sức khỏe", description: "Có sức khỏe phù hợp cho việc di chuyển, lội bùn và trồng cây." },
    ],
    included: [
      "Xe TP.HCM – Cần Giờ khứ hồi",
      "Chỗ ở 2 đêm",
      "Toàn bộ bữa ăn",
      "Dụng cụ trồng cây",
      "Bảo hiểm tai nạn",
      "Chứng nhận tình nguyện viên",
    ],
    notIncluded: ["Chi phí cá nhân", "Đồ dùng chống nắng cá nhân"],
    policies: [
      {
        icon: "event_busy",
        title: "Hủy đặt chỗ",
        items: [
          "Hủy trước 14 ngày khởi hành: hoàn 80% phí chương trình.",
          "Hủy từ 7–13 ngày trước khởi hành: hoàn 50% phí chương trình.",
          "Hủy dưới 7 ngày hoặc không tham gia: không hoàn phí.",
        ],
      },
      {
        icon: "bookmark_add",
        title: "Bảo lưu",
        items: [
          "Có thể bảo lưu phí sang chuyến khác trong vòng 6 tháng kể từ ngày hủy.",
          "Chỉ áp dụng khi thông báo hủy trước ít nhất 5 ngày khởi hành.",
          "Phí bảo lưu áp dụng tối đa 1 lần.",
        ],
      },
      {
        icon: "rule",
        title: "Quy định tham gia",
        items: [
          "Tôn trọng văn hóa, phong tục địa phương trong suốt hành trình.",
          "Tuân thủ lịch trình và hướng dẫn của ban tổ chức.",
          "Không sử dụng chất kích thích, đồ uống có cồn trong giờ hoạt động tình nguyện.",
        ],
      },
    ],
    impactMetrics: [
      { label: "Mục tiêu trồng cây", percent: 55 },
      { label: "Tình nguyện viên đăng ký", percent: 45 },
    ],
    miniTestimonial: {
      quote: "Một ngày lấm bùn nhưng rất đáng nhớ, vì mình thấy từng cây nhỏ có thể mở ra một thay đổi lớn.",
      name: "Nguyễn Minh Anh",
      role: "Volunteer 2025",
    },
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
