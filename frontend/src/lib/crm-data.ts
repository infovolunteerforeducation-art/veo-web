import { camps } from "./trai-he-data";

export type BookingStatus = "pending" | "cancelled" | "paid";
export type PaymentMethod = "office" | "transfer";
export type CoordinationStatus = "pending" | "attended" | "absent_reserved" | "absent_refunded";

export type ParticipantMatchStatus = "matched" | "pending" | "unmatched";

export type BookingParticipant = {
  name: string;
  phone?: string;
  email?: string;
  customerId?: string;          // set when matchStatus === "matched"
  matchStatus: ParticipantMatchStatus;
};

export type BookingActivityLog = {
  id: string;
  timestamp: string;
  actor: string;
  actorRole?: string;
  action: string;
  icon?: string;
};

export type Booking = {
  id: string;
  bookingCode: string;
  tourId: string;
  tourName: string;
  scheduleId: string;
  scheduleLabel: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  numPeople: number;
  originalAmount?: number;
  discountCode?: string;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  createdAt: string;
  tourType?: TourType;
  paidAt?: string;
  note?: string;
  attended?: boolean | null;
  coordinationStatus?: CoordinationStatus;
  reservationNote?: string;
  participants?: BookingParticipant[];
  activityLog?: BookingActivityLog[];
  assignedSaleId?: string;
  assignedAt?: string;
  assignedManually?: boolean;
  cancelledBy?: "customer" | "veo" | "force_majeure";
  cancelRequestDate?: string;
  cancellationFeePercent?: number;
  refundAmount?: number;
  refundStatus?: "pending_refund" | "refunded";
  refundCompletedAt?: string;
  cancellationNote?: string;
  offerTransfer?: boolean;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalTrips: number;
  totalSpent: number;
  lastTour: string;
  lastTourDate: string;
  joinedAt: string;
};

export type TourSchedule = {
  id: string;
  label: string;
  isoDate: string;
  spotsTotal: number;
  spotsLeft: number;
  status: "open" | "full" | "completed" | "cancelled";
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FlatSchedule = TourSchedule & { tourId: string; tourTitle: string; tourDuration: number };

export type ItineraryActivity = {
  timeFrom: string;
  timeTo: string;
  name: string;
  description: string;
  images: string[];
};

export type ItineraryDay = {
  day: number;
  title: string;
  activities: ItineraryActivity[];
};

export type TourType = "dltn" | "traihè";

export type ManagedTour = {
  id: string;
  slug: string;
  title: string;
  destinationId: string;
  destinationName: string;
  price: number;
  duration: number; // number of days; nights = duration - 1
  ageRange?: string;
  tourType?: TourType;
  schedules: TourSchedule[];
  status: "active" | "draft" | "archived";
  // Page content (shared)
  heroImage?: string;
  heroDescription?: string;
  // DLTN-specific content
  goalsDescription?: string;
  goals?: string[];
  itinerary?: ItineraryDay[];
  // Camp-specific content
  highlights?: Array<{ icon: string; value: string; label: string }>;
  pillars?: Array<{ icon: string; title: string; desc: string }>;
  agePrograms?: Array<{ image: string; age: string; title: string; desc: string }>;
  campSchedule?: Array<{ day: string; text: string }>;
  outcomes?: string[];
  requirements?: string[];
  notes?: string[];
  volunteer?: string[];
  experience?: string[];
  included?: string[];
  notIncluded?: string[];
  policies?: Array<{ icon?: string; title: string; items: string[] }>;
};

export type Destination = {
  id: string;
  name: string;
  province: string;
  region: "north" | "south";
  createdAt: string;
  updatedAt: string;
};

export type StaffRole = "admin" | "coordinator" | "sale" | "staff";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: "active" | "inactive";
  joinedAt: string;
  lastLogin: string;
};

export type WeeklyStats = {
  week: string;
  bookings: number;
  revenue: number;
};

export type DailyStat = { day: string; bookings: number; revenue: number };
export type MonthlyStat = { month: string; bookings: number; revenue: number };

// ── Mock data ────────────────────────────────────────────────────────────────

export const mockDestinations: Destination[] = [
  { id: "dest-1", name: "Mèo Vạc – Hà Giang", province: "Hà Giang", region: "north", createdAt: "2025-01-15", updatedAt: "2025-09-20" },
  { id: "dest-2", name: "Đảo Lý Sơn", province: "Quảng Ngãi", region: "south", createdAt: "2025-02-10", updatedAt: "2025-08-05" },
  { id: "dest-3", name: "Đà Lạt – Lâm Đồng", province: "Lâm Đồng", region: "south", createdAt: "2025-03-05", updatedAt: "2025-10-01" },
  { id: "dest-4", name: "Sa Pa – Lào Cai", province: "Lào Cai", region: "north", createdAt: "2026-01-10", updatedAt: "2026-03-10" },
  { id: "dest-5", name: "Phú Quốc – Kiên Giang", province: "Kiên Giang", region: "south", createdAt: "2026-02-01", updatedAt: "2026-04-01" },
  { id: "dest-6", name: "Bản Cối · Phú Thọ", province: "Phú Thọ", region: "north", createdAt: "2026-03-10", updatedAt: "2026-03-10" },
];

const banCoiCamp = camps.find((camp) => camp.slug === "ban-coi-phu-tho") ?? camps[0];
const banCoiHeroDescription = `Hành trình 6 ngày 5 đêm tại ${banCoiCamp.location} - kết hợp hoạt động tình nguyện thực tế và trải nghiệm văn hóa bản địa dành cho học sinh, sinh viên.`;

function toManagedItinerary(itinerary: typeof camps[number]["itinerary"]): ItineraryDay[] {
  return itinerary.map((day) => ({
    ...day,
    activities: day.activities.map((activity) => ({
      ...activity,
      images: activity.images ?? [],
    })),
  }));
}

export const mockTours: ManagedTour[] = [
  {
    id: "tour-1",
    slug: "sapa-xay-truong-hau-thao",
    title: "Xây trường cho em tại Mèo Vạc",
    tourType: "dltn",
    destinationId: "dest-1",
    destinationName: "Mèo Vạc – Hà Giang",
    price: 2500000,
    duration: 3,
    ageRange: "18 – 35 tuổi",
    status: "active",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFHyoeAAzXiUFmGWEI5n1Xuiqq3a1oBAMi-3AIu0NwmwcPkzmyWfWQafW9TO6WbkIynPrSInBkNUEE2vSvd0n-3icwEN7RTB_Ir5akNvhMKq9Kb308UDU_E7Fv4P3Dxi8ttrCajoDP_gNEuF4Yf97FftlsN-KkfNPrRk58jWr0I2gLhNJ5hQK9isdPMMOzSyPQ4ceONkco4mWeJcv6pDzppAX275d0-OygG2-WluT7MwlpbFtnLUMhp_IixDSC3kO0euNfI6Th9_w",
    heroDescription: "Hành trình ý nghĩa mang tri thức đến với trẻ em vùng cao, xây dựng tương lai bền vững qua từng viên gạch và những tiết học yêu thương.",
    goals: [
      "Hoàn thiện 2 phòng học mới với đầy đủ trang thiết bị bàn ghế.",
      "Tổ chức các lớp kỹ năng sống và tiếng Anh cơ bản cho 50+ học sinh.",
      "Trao tặng 100 suất quà bao gồm sách vở và đồ dùng học tập.",
    ],
    itinerary: [
      {
        day: 1, title: "Ngày 1: Hà Nội – Mèo Vạc",
        activities: [
          { timeFrom: "05:30", timeTo: "07:00", name: "Tập kết & Khởi hành", description: "Tập kết tại điểm hẹn, phân chia xe và xuất phát lên Hà Giang.", images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDD6CxYZAUaASxNFTY3S6WA060YTMg4Czut9HCzM_oRbPwjyf0-g1KlxeX-oZr9mHXzQRc0emb4DmHDWMGdcfaoBHlwCafDLyryvdLZvSd1LuWEj5BOGsk_p1o7p3D6ruhdG03tFHSyhwfs96HOsFkNLDvL1X4zvh_NOwwbLAt1Dth-2izUHQxd5-w3IvyClYrwkT18s9WXxyX_Lfa88a-U4ETugmC3CdtM4N2Kg7hkoGS09znfU88uj1hq-h8FUubAX_TAVUSRXrY"] },
          { timeFrom: "12:00", timeTo: "14:00", name: "Đến Mèo Vạc – Nhận phòng homestay", description: "Nhận phòng homestay tại bản, ăn trưa cùng gia đình chủ nhà.", images: [] },
          { timeFrom: "15:00", timeTo: "18:00", name: "Làm quen cộng đồng & Phổ biến kế hoạch", description: "Gặp gỡ đội ngũ địa phương và các em nhỏ. Họp nhóm, phân chia nhiệm vụ cho ngày tình nguyện hôm sau.", images: [] },
        ],
      },
      {
        day: 2, title: "Ngày 2: Hoạt động tình nguyện",
        activities: [
          { timeFrom: "07:00", timeTo: "12:00", name: "Xây dựng & Sơn sửa lớp học", description: "Sơn sửa lớp học, vẽ tranh tường cổ động, lắp đặt bàn ghế và trang thiết bị học tập.", images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuARoxIiN14kvJCedbsGF_65xL0ubO1q72LK9pSPA_ejQITn-wf7s4UCvRv5aqJOtbH6BdgpNbWErN-7vOcTBLnlbtt5rt4vgaeerbWgBx4wGR_DxgyDHs2-EFQKpFu25Rrg2W0AmkqowuhMuNnBZynxntxzSfOXhc-ZnAKkb2F_IeQfZ7i8rKpaAVZNcjCNIrYKFEAHalo-rVN1_Jwnaq_y1tVlaZHOsYE_4Xbrh4FdgO6L-GRaVEiJCGuO6RMIyQGf0o_CuXJsSeU"] },
          { timeFrom: "13:30", timeTo: "17:00", name: "Lớp học tình nguyện cho trẻ em", description: "Tổ chức các lớp học sáng tạo: vẽ, kỹ năng sống, tiếng Anh cơ bản. Phát học bổng và quà tặng cho học sinh.", images: [] },
          { timeFrom: "18:00", timeTo: "20:30", name: "Giao lưu văn hóa & Ăn tối cộng đồng", description: "Giao lưu văn nghệ cùng người dân bản địa, thưởng thức ẩm thực địa phương.", images: [] },
        ],
      },
      {
        day: 3, title: "Ngày 3: Khám phá & Trở về",
        activities: [
          { timeFrom: "07:00", timeTo: "10:00", name: "Đèo Mã Pì Lèng & Sông Nho Quế", description: "Chinh phục cung đèo hùng vĩ nhất Hà Giang, ngắm dòng sông Nho Quế xanh biếc uốn lượn giữa vách đá.", images: [] },
          { timeFrom: "10:30", timeTo: "12:30", name: "Tổng kết & Nhận chứng nhận", description: "Chụp ảnh lưu niệm, nhận chứng nhận tình nguyện viên VEO và chia sẻ cảm nhận sau hành trình.", images: [] },
          { timeFrom: "13:00", timeTo: "20:00", name: "Di chuyển về Hà Nội", description: "Lên xe về Hà Nội. Dự kiến về đến điểm tập kết lúc 20:00.", images: [] },
        ],
      },
    ],
    schedules: [
      { id: "sch-1a", label: "15/10 – 17/10/2025", isoDate: "2025-10-15", spotsTotal: 20, spotsLeft: 8, status: "open", isVisible: true, createdAt: "2025-09-10T08:30:00", updatedAt: "2025-09-10T08:30:00" },
      { id: "sch-1b", label: "22/10 – 24/10/2025", isoDate: "2025-10-22", spotsTotal: 20, spotsLeft: 3, status: "open", isVisible: true, createdAt: "2025-09-10T08:35:00", updatedAt: "2025-09-20T14:00:00" },
      { id: "sch-1c", label: "05/11 – 07/11/2025", isoDate: "2025-11-05", spotsTotal: 20, spotsLeft: 12, status: "open", isVisible: true, createdAt: "2025-09-10T08:40:00", updatedAt: "2025-09-10T08:40:00" },
    ],
  },
  {
    id: "tour-2",
    slug: "ly-son-lam-sach-dai-duong",
    title: "Làm sạch đại dương tại Lý Sơn",
    tourType: "dltn",
    destinationId: "dest-2",
    destinationName: "Đảo Lý Sơn",
    price: 3200000,
    duration: 3,
    ageRange: "16 – 40 tuổi",
    status: "active",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    heroDescription: "Cùng nhau bảo vệ đại dương xanh — hành trình dọn sạch bãi biển Lý Sơn, nâng cao ý thức cộng đồng và khám phá vẻ đẹp hoang sơ của hòn đảo thiêng liêng.",
    goals: [
      "Thu gom và phân loại rác thải nhựa tại 3 bãi biển trọng điểm trên đảo Lý Sơn.",
      "Tổ chức hội thảo nâng cao nhận thức môi trường biển cho 200+ ngư dân và học sinh địa phương.",
      "Trồng 500 cây san hô nhân tạo tại khu vực rạn san hô đang bị suy thoái.",
    ],
    itinerary: [
      {
        day: 1, title: "Ngày 1: TP.HCM – Lý Sơn",
        activities: [
          { timeFrom: "06:00", timeTo: "11:00", name: "Di chuyển TP.HCM – Quảng Ngãi", description: "Khởi hành từ TP.HCM, di chuyển bằng xe đến cảng Sa Kỳ, Quảng Ngãi.", images: [] },
          { timeFrom: "11:30", timeTo: "13:00", name: "Tàu cao tốc ra đảo Lý Sơn", description: "Bắt tàu cao tốc từ cảng Sa Kỳ ra đảo Lý Sơn (khoảng 30 phút).", images: [] },
          { timeFrom: "14:00", timeTo: "18:00", name: "Nhận phòng & Phổ biến an toàn biển", description: "Check-in nhà nghỉ, ăn trưa hải sản tươi, họp nhóm phổ biến kế hoạch và quy tắc an toàn khi hoạt động trên biển.", images: [] },
        ],
      },
      {
        day: 2, title: "Ngày 2: Dọn sạch biển & Hội thảo",
        activities: [
          { timeFrom: "06:30", timeTo: "11:00", name: "Dọn rác bãi biển An Hải & Đông", description: "Chia nhóm dọn rác tại 2 bãi biển trọng điểm, phân loại rác nhựa và ghi chép số liệu thu gom.", images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"] },
          { timeFrom: "13:00", timeTo: "17:00", name: "Hội thảo môi trường & Trồng san hô", description: "Hội thảo nâng cao nhận thức môi trường biển cho ngư dân và học sinh. Hướng dẫn kỹ thuật trồng san hô nhân tạo.", images: [] },
        ],
      },
      {
        day: 3, title: "Ngày 3: Khám phá đảo & Trở về",
        activities: [
          { timeFrom: "07:00", timeTo: "10:00", name: "Tham quan chùa Hang & Giếng Tiền", description: "Khám phá chùa Hang nằm sâu trong hang đá núi lửa và cột đá Giếng Tiền hàng triệu năm tuổi.", images: [] },
          { timeFrom: "10:30", timeTo: "12:00", name: "Cánh đồng tỏi & Chụp ảnh kỷ niệm", description: "Tham quan cánh đồng tỏi đặc sản nổi tiếng của Lý Sơn, chụp ảnh lưu niệm và mua quà.", images: [] },
          { timeFrom: "14:00", timeTo: "20:00", name: "Tàu về đất liền & Di chuyển TP.HCM", description: "Bắt phà về cảng Sa Kỳ, xe về TP.HCM. Kết thúc hành trình bảo vệ đại dương đầy ý nghĩa.", images: [] },
        ],
      },
    ],
    schedules: [
      { id: "sch-2a", label: "22/10 – 24/10/2025", isoDate: "2025-10-22", spotsTotal: 25, spotsLeft: 5, status: "open", isVisible: true, createdAt: "2025-09-15T09:00:00", updatedAt: "2025-09-15T09:00:00" },
      { id: "sch-2b", label: "12/11 – 14/11/2025", isoDate: "2025-11-12", spotsTotal: 25, spotsLeft: 10, status: "open", isVisible: false, createdAt: "2025-09-15T09:05:00", updatedAt: "2025-10-05T10:20:00" },
    ],
  },
  {
    id: "tour-3",
    slug: "da-lat-ky-nang-song-vung-cao",
    title: "Kỹ năng sống tại Đà Lạt",
    tourType: "traihè",
    destinationId: "dest-3",
    destinationName: "Đà Lạt – Lâm Đồng",
    price: 1800000,
    duration: 3,
    ageRange: "15 – 35 tuổi",
    status: "active",
    heroImage: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1200&q=80",
    heroDescription: "Hành trình trao tặng kỹ năng sống cho trẻ em vùng cao Lâm Đồng — nơi thiên nhiên thơ mộng giao hòa với những bài học cuộc đời thiết thực và ý nghĩa.",
    goals: [
      "Tổ chức 6 buổi workshop kỹ năng sống: sơ cứu, tài chính cơ bản, tư duy sáng tạo cho 80+ học sinh dân tộc thiểu số.",
      "Xây dựng vườn rau sạch tự cung tự cấp cho 2 điểm trường tại xã Lát, huyện Lạc Dương.",
      "Tặng 150 bộ dụng cụ học tập và đồng phục cho học sinh có hoàn cảnh khó khăn.",
    ],
    itinerary: [
      {
        day: 1, title: "Ngày 1: TP.HCM – Đà Lạt",
        activities: [
          { timeFrom: "07:00", timeTo: "11:30", name: "Di chuyển TP.HCM – Đà Lạt", description: "Xe limousine xuất phát từ TP.HCM, lên Đà Lạt qua đèo Prenn.", images: [] },
          { timeFrom: "13:00", timeTo: "15:00", name: "Check-in nhà nghỉ sinh thái", description: "Nhận phòng tại nhà nghỉ sinh thái gần khu trường học, ăn trưa và nghỉ ngơi.", images: [] },
          { timeFrom: "15:30", timeTo: "18:30", name: "Tham quan trường & Làm quen học sinh", description: "Thăm điểm trường tại xã Lát, gặp gỡ thầy cô và các em học sinh, tìm hiểu hoàn cảnh địa phương.", images: [] },
        ],
      },
      {
        day: 2, title: "Ngày 2: Workshop kỹ năng & Làm vườn",
        activities: [
          { timeFrom: "07:30", timeTo: "11:30", name: "3 Workshop song song", description: "Triển khai 3 workshop: sơ cứu cơ bản, tài chính cá nhân và kỹ năng giao tiếp tự tin cho 80+ học sinh.", images: ["https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800&q=80"] },
          { timeFrom: "13:30", timeTo: "17:00", name: "Làm vườn rau sạch tại trường", description: "Cùng các em trồng rau, xây dựng vườn rau tự cung tự cấp. Trao đổi kinh nghiệm nông nghiệp bền vững với giáo viên.", images: [] },
          { timeFrom: "18:00", timeTo: "20:00", name: "Ăn tối & Giao lưu văn nghệ", description: "Ăn tối cùng thầy cô và học sinh, giao lưu văn nghệ và chia sẻ về ước mơ tương lai.", images: [] },
        ],
      },
      {
        day: 3, title: "Ngày 3: Tổng kết & Khám phá Đà Lạt",
        activities: [
          { timeFrom: "08:00", timeTo: "10:00", name: "Lễ trao học bổng & Chụp ảnh kỷ niệm", description: "Lễ trao 150 bộ dụng cụ học tập và đồng phục. Chụp ảnh lưu niệm cùng học sinh và nhận chứng nhận VEO.", images: [] },
          { timeFrom: "10:30", timeTo: "13:00", name: "Tham quan vườn hoa & Hồ Tuyền Lâm", description: "Thư giãn tại vườn hoa Đà Lạt và hồ Tuyền Lâm, mua quà lưu niệm và đặc sản địa phương.", images: [] },
          { timeFrom: "14:00", timeTo: "20:00", name: "Di chuyển về TP.HCM", description: "Lên xe về TP.HCM. Kết thúc hành trình trao tặng kỹ năng sống đầy ý nghĩa.", images: [] },
        ],
      },
    ],
    schedules: [
      { id: "sch-3a", label: "05/11 – 07/11/2025", isoDate: "2025-11-05", spotsTotal: 30, spotsLeft: 6, status: "open", isVisible: true, createdAt: "2025-09-20T10:00:00", updatedAt: "2025-10-01T11:30:00" },
      { id: "sch-3b", label: "19/11 – 21/11/2025", isoDate: "2025-11-19", spotsTotal: 30, spotsLeft: 2, status: "open", isVisible: true, createdAt: "2025-09-20T10:05:00", updatedAt: "2025-09-20T10:05:00" },
    ],
  },
  {
    id: "tour-4",
    slug: "trai-he-stem-sapa",
    title: "Trại hè STEM tại Sa Pa",
    tourType: "traihè",
    destinationId: "dest-4",
    destinationName: "Sa Pa – Lào Cai",
    price: 3500000,
    duration: 5,
    ageRange: "8 – 15 tuổi",
    status: "active",
    heroImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
    heroDescription: "Trại hè STEM kết hợp khám phá thiên nhiên núi rừng Sa Pa — nơi các bạn nhỏ được thực hành khoa học, công nghệ và nghệ thuật sáng tạo giữa thiên nhiên hùng vĩ.",
    goals: [
      "Tổ chức 10 workshop STEM thực hành: lập trình Scratch, điện tử cơ bản, khoa học môi trường.",
      "Trải nghiệm canh tác ruộng bậc thang và tìm hiểu văn hóa dân tộc H'Mông.",
      "Xây dựng kỹ năng làm việc nhóm, lãnh đạo và giải quyết vấn đề trong môi trường thực tế.",
    ],
    schedules: [
      { id: "sch-4a", label: "15/06 – 19/06/2026", isoDate: "2026-06-15", spotsTotal: 25, spotsLeft: 18, status: "open", isVisible: true, createdAt: "2026-03-10T09:00:00", updatedAt: "2026-03-10T09:00:00" },
      { id: "sch-4b", label: "22/06 – 26/06/2026", isoDate: "2026-06-22", spotsTotal: 25, spotsLeft: 25, status: "open", isVisible: true, createdAt: "2026-03-10T09:05:00", updatedAt: "2026-03-10T09:05:00" },
      { id: "sch-4c", label: "06/07 – 10/07/2026", isoDate: "2026-07-06", spotsTotal: 25, spotsLeft: 25, status: "open", isVisible: false, createdAt: "2026-03-10T09:10:00", updatedAt: "2026-03-10T09:10:00" },
    ],
  },
  {
    id: "tour-5",
    slug: "trai-he-bien-dao-phu-quoc",
    title: "Trại hè khám phá biển đảo Phú Quốc",
    tourType: "traihè",
    destinationId: "dest-5",
    destinationName: "Phú Quốc – Kiên Giang",
    price: 4200000,
    duration: 4,
    ageRange: "10 – 17 tuổi",
    status: "active",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    heroDescription: "Hành trình khám phá hệ sinh thái biển đảo, học lặn snorkeling, và tham gia các hoạt động bảo vệ môi trường biển cùng các chuyên gia.",
    goals: [
      "Học lặn snorkeling và tìm hiểu hệ sinh thái rạn san hô nhiệt đới.",
      "Tham gia thu gom rác biển và trồng san hô cùng WWF Việt Nam.",
      "Rèn luyện kỹ năng sinh tồn biển, định hướng bằng sao và chèo thuyền kayak.",
    ],
    schedules: [
      { id: "sch-5a", label: "01/07 – 04/07/2026", isoDate: "2026-07-01", spotsTotal: 20, spotsLeft: 12, status: "open", isVisible: true, createdAt: "2026-04-01T08:00:00", updatedAt: "2026-04-01T08:00:00" },
      { id: "sch-5b", label: "15/07 – 18/07/2026", isoDate: "2026-07-15", spotsTotal: 20, spotsLeft: 20, status: "open", isVisible: true, createdAt: "2026-04-01T08:05:00", updatedAt: "2026-04-01T08:05:00" },
    ],
  },
];

const banCoiCmsTour = mockTours.find((tour) => tour.id === "tour-3");

if (banCoiCmsTour) {
  Object.assign(banCoiCmsTour, {
    slug: banCoiCamp.slug,
    title: banCoiCamp.title,
    destinationId: "dest-6",
    destinationName: banCoiCamp.location,
    price: banCoiCamp.priceNumber,
    duration: 6,
    ageRange: "10 - 22 tuổi",
    heroImage: banCoiCamp.image,
    heroDescription: banCoiHeroDescription,
    volunteer: banCoiCamp.volunteer,
    experience: banCoiCamp.experience,
    itinerary: toManagedItinerary(banCoiCamp.itinerary),
    included: banCoiCamp.included,
    notIncluded: banCoiCamp.notIncluded,
    policies: banCoiCamp.policies,
    schedules: [
      {
        id: "sch-3a",
        label: banCoiCamp.dates[0]?.label ?? "04/07 - 09/07/2026",
        isoDate: banCoiCamp.dates[0]?.isoDate ?? "2026-07-04",
        spotsTotal: 30,
        spotsLeft: banCoiCamp.dates[0]?.spotsLeft ?? 10,
        status: "open",
        isVisible: true,
        createdAt: "2026-03-10T09:00:00",
        updatedAt: "2026-03-10T09:00:00",
      },
    ],
  } satisfies Partial<ManagedTour>);
}

export const mockCustomers: Customer[] = [
  { id: "cust-1", name: "Nguyễn Văn An", phone: "0912345678", email: "an.nguyen@gmail.com", totalTrips: 3, totalSpent: 7500000, lastTour: "Xây trường cho em tại Mèo Vạc", lastTourDate: "2025-10-15", joinedAt: "2024-06-10" },
  { id: "cust-2", name: "Trần Thị Bình", phone: "0987654321", email: "binh.tran@gmail.com", totalTrips: 2, totalSpent: 6400000, lastTour: "Làm sạch đại dương tại Lý Sơn", lastTourDate: "2025-10-22", joinedAt: "2024-08-15" },
  { id: "cust-3", name: "Lê Hoàng Cường", phone: "0901234567", email: "cuong.le@gmail.com", totalTrips: 1, totalSpent: 2500000, lastTour: "Xây trường cho em tại Mèo Vạc", lastTourDate: "2025-10-22", joinedAt: "2025-02-20" },
  { id: "cust-4", name: "Phạm Minh Đức", phone: "0978123456", email: "duc.pham@gmail.com", totalTrips: 4, totalSpent: 10800000, lastTour: "Kỹ năng sống tại Đà Lạt", lastTourDate: "2025-11-05", joinedAt: "2023-11-01" },
  { id: "cust-5", name: "Hoàng Thị Lan", phone: "0934567890", email: "lan.hoang@gmail.com", totalTrips: 2, totalSpent: 5000000, lastTour: "Xây trường cho em tại Mèo Vạc", lastTourDate: "2025-11-05", joinedAt: "2024-12-05" },
  { id: "cust-6", name: "Võ Quang Minh", phone: "0945678901", email: "minh.vo@gmail.com", totalTrips: 1, totalSpent: 3200000, lastTour: "Làm sạch đại dương tại Lý Sơn", lastTourDate: "2025-11-12", joinedAt: "2025-04-18" },
  { id: "cust-7", name: "Đinh Thị Ngân", phone: "0956789012", email: "ngan.dinh@gmail.com", totalTrips: 2, totalSpent: 4300000, lastTour: "Kỹ năng sống tại Đà Lạt", lastTourDate: "2025-11-19", joinedAt: "2025-01-22" },
  { id: "cust-8", name: "Bùi Anh Tuấn", phone: "0967890123", email: "tuan.bui@gmail.com", totalTrips: 1, totalSpent: 1800000, lastTour: "Kỹ năng sống tại Đà Lạt", lastTourDate: "2025-11-05", joinedAt: "2025-05-30" },
];

export const mockBookings: Booking[] = [
  { id: "bk-01", bookingCode: "VEO-SAPA-A3X7K", tourId: "tour-1", tourType: "dltn", tourName: "Xây trường cho em tại Mèo Vạc", scheduleId: "sch-1a", scheduleLabel: "15/10 – 17/10/2025", customerId: "cust-1", customerName: "Nguyễn Văn An", phone: "0912345678", email: "an.nguyen@gmail.com", numPeople: 2, originalAmount: 5500000, discountCode: "VEO10", discountAmount: 500000, totalAmount: 5000000, paymentMethod: "transfer", status: "paid", createdAt: "2025-10-01T09:15:00", paidAt: "2025-10-01T10:30:00", attended: true, coordinationStatus: "attended", participants: [{ name: "Nguyễn Văn An", phone: "0912345678", email: "an.nguyen@gmail.com", customerId: "cust-1", matchStatus: "matched" }, { name: "Trần Thị Bình", phone: "0987654321", email: "binh.tran@gmail.com", customerId: "cust-2", matchStatus: "matched" }], activityLog: [{ id: "log-1", timestamp: "2025-10-01T09:15:00", actor: "Hệ thống", action: "Đơn đăng ký được tạo", icon: "add_circle" }, { id: "log-2", timestamp: "2025-10-01T10:30:00", actor: "Nguyễn Thị Mai", actorRole: "Sale", action: "Xác nhận thanh toán chuyển khoản", icon: "payments" }, { id: "log-3", timestamp: "2025-10-17T18:00:00", actor: "Hệ thống", action: "Cập nhật trạng thái tham gia: Đã tham gia", icon: "check_circle" }] },
  { id: "bk-02", bookingCode: "VEO-SAPA-B8Y2M", tourId: "tour-1", tourType: "dltn", tourName: "Xây trường cho em tại Mèo Vạc", scheduleId: "sch-1b", scheduleLabel: "22/10 – 24/10/2025", customerId: "cust-3", customerName: "Lê Hoàng Cường", phone: "0901234567", email: "cuong.le@gmail.com", numPeople: 1, totalAmount: 2500000, paymentMethod: "transfer", status: "pending", createdAt: "2025-10-05T14:30:00", attended: false },
  { id: "bk-03", bookingCode: "VEO-LYSO-C4Z9N", tourId: "tour-2", tourType: "dltn", tourName: "Làm sạch đại dương tại Lý Sơn", scheduleId: "sch-2a", scheduleLabel: "22/10 – 24/10/2025", customerId: "cust-2", customerName: "Trần Thị Bình", phone: "0987654321", email: "binh.tran@gmail.com", numPeople: 2, totalAmount: 6400000, paymentMethod: "office", status: "paid", createdAt: "2025-10-08T10:00:00", attended: true, coordinationStatus: "absent_reserved", reservationNote: "Bảo lưu cho chuyến 12/11 – 14/11", participants: [{ name: "Trần Thị Bình", phone: "0987654321", email: "binh.tran@gmail.com", customerId: "cust-2", matchStatus: "matched" }, { name: "Lưu Quang Hải", phone: "0987112233", email: "hai.lq@gmail.com", matchStatus: "pending" }] },
  { id: "bk-04", bookingCode: "VEO-DALA-D5W1P", tourId: "tour-3", tourType: "traihè", tourName: "Kỹ năng sống tại Đà Lạt", scheduleId: "sch-3a", scheduleLabel: "05/11 – 07/11/2025", customerId: "cust-4", customerName: "Phạm Minh Đức", phone: "0978123456", email: "duc.pham@gmail.com", numPeople: 3, totalAmount: 5400000, paymentMethod: "transfer", status: "paid", createdAt: "2025-10-10T16:45:00", attended: true, coordinationStatus: "attended", participants: [{ name: "Phạm Minh Đức", phone: "0978123456", email: "duc.pham@gmail.com", customerId: "cust-4", matchStatus: "matched" }, { name: "Phạm Thị Thu", phone: "0978112233", email: "thu.pham@gmail.com", matchStatus: "pending" }, { name: "Nguyễn Quốc Bảo", phone: "0912334455", email: "bao.nq@gmail.com", matchStatus: "pending" }] },
  { id: "bk-05", bookingCode: "VEO-SAPA-E6Q3R", tourId: "tour-1", tourType: "dltn", tourName: "Xây trường cho em tại Mèo Vạc", scheduleId: "sch-1c", scheduleLabel: "05/11 – 07/11/2025", customerId: "cust-5", customerName: "Hoàng Thị Lan", phone: "0934567890", email: "lan.hoang@gmail.com", numPeople: 2, totalAmount: 5000000, paymentMethod: "transfer", status: "pending", createdAt: "2025-10-12T08:20:00", participants: [{ name: "Hoàng Thị Lan", phone: "0934567890", email: "lan.hoang@gmail.com", customerId: "cust-5", matchStatus: "matched" }, { name: "Hoàng Minh Khoa", matchStatus: "unmatched" }] },
  { id: "bk-06", bookingCode: "VEO-LYSO-F7T4S", tourId: "tour-2", tourType: "dltn", tourName: "Làm sạch đại dương tại Lý Sơn", scheduleId: "sch-2b", scheduleLabel: "12/11 – 14/11/2025", customerId: "cust-6", customerName: "Võ Quang Minh", phone: "0945678901", email: "minh.vo@gmail.com", numPeople: 1, totalAmount: 3200000, paymentMethod: "transfer", status: "pending", createdAt: "2025-10-13T11:10:00" },
  { id: "bk-07", bookingCode: "VEO-DALA-G8U5T", tourId: "tour-3", tourType: "traihè", tourName: "Kỹ năng sống tại Đà Lạt", scheduleId: "sch-3b", scheduleLabel: "19/11 – 21/11/2025", customerId: "cust-7", customerName: "Đinh Thị Ngân", phone: "0956789012", email: "ngan.dinh@gmail.com", numPeople: 2, totalAmount: 3600000, paymentMethod: "office", status: "paid", createdAt: "2025-10-14T13:55:00", attended: true, coordinationStatus: "attended", participants: [{ name: "Đinh Thị Ngân", phone: "0956789012", email: "ngan.dinh@gmail.com", customerId: "cust-7", matchStatus: "matched" }, { name: "Nguyễn Đình Tuấn", phone: "0934567123", email: "tuan.nd@gmail.com", matchStatus: "pending" }] },
  { id: "bk-11", bookingCode: "VEO-DALA-K3Y7R", tourId: "tour-3", tourType: "traihè", tourName: "Kỹ năng sống tại Đà Lạt", scheduleId: "sch-3b", scheduleLabel: "19/11 – 21/11/2025", customerId: "cust-1", customerName: "Nguyễn Văn An", phone: "0912345678", email: "an.nguyen@gmail.com", numPeople: 1, totalAmount: 1800000, paymentMethod: "transfer", status: "paid", createdAt: "2025-10-15T08:30:00", attended: false, coordinationStatus: "absent_reserved", reservationNote: "Bảo lưu sang chuyến tháng 12", participants: [{ name: "Nguyễn Văn An", phone: "0912345678", email: "an.nguyen@gmail.com", customerId: "cust-1", matchStatus: "matched" }] },
  { id: "bk-12", bookingCode: "VEO-DALA-L4Z8S", tourId: "tour-3", tourType: "traihè", tourName: "Kỹ năng sống tại Đà Lạt", scheduleId: "sch-3b", scheduleLabel: "19/11 – 21/11/2025", customerId: "cust-3", customerName: "Lê Hoàng Cường", phone: "0901234567", email: "cuong.le@gmail.com", numPeople: 2, totalAmount: 3600000, paymentMethod: "transfer", status: "paid", createdAt: "2025-10-16T14:00:00", participants: [{ name: "Lê Hoàng Cường", phone: "0901234567", email: "cuong.le@gmail.com", customerId: "cust-3", matchStatus: "matched" }, { name: "Trần Thị Mai", phone: "0987651234", email: "mai.tran@gmail.com", matchStatus: "pending" }] },
  { id: "bk-13", bookingCode: "VEO-DALA-M5A9T", tourId: "tour-3", tourType: "traihè", tourName: "Kỹ năng sống tại Đà Lạt", scheduleId: "sch-3b", scheduleLabel: "19/11 – 21/11/2025", customerId: "cust-5", customerName: "Hoàng Thị Lan", phone: "0934567890", email: "lan.hoang@gmail.com", numPeople: 1, totalAmount: 1800000, paymentMethod: "transfer", status: "pending", createdAt: "2025-10-17T09:10:00" },
  { id: "bk-08", bookingCode: "VEO-DALA-H9V6U", tourId: "tour-3", tourType: "traihè", tourName: "Kỹ năng sống tại Đà Lạt", scheduleId: "sch-3a", scheduleLabel: "05/11 – 07/11/2025", customerId: "cust-8", customerName: "Bùi Anh Tuấn", phone: "0967890123", email: "tuan.bui@gmail.com", numPeople: 1, totalAmount: 1800000, paymentMethod: "transfer", status: "cancelled", createdAt: "2025-10-15T09:30:00", attended: false },
  { id: "bk-09", bookingCode: "VEO-SAPA-I1W7V", tourId: "tour-1", tourType: "dltn", tourName: "Xây trường cho em tại Mèo Vạc", scheduleId: "sch-1a", scheduleLabel: "15/10 – 17/10/2025", customerId: "cust-4", customerName: "Phạm Minh Đức", phone: "0978123456", email: "duc.pham@gmail.com", numPeople: 2, totalAmount: 5000000, paymentMethod: "transfer", status: "paid", createdAt: "2025-10-02T15:00:00", attended: true, participants: [{ name: "Phạm Minh Đức", phone: "0978123456", email: "duc.pham@gmail.com", customerId: "cust-4", matchStatus: "matched" }, { name: "Phạm Văn Hải", phone: "0978223344", email: "hai.pv@gmail.com", matchStatus: "pending" }] },
  { id: "bk-10", bookingCode: "VEO-LYSO-J2X8W", tourId: "tour-2", tourType: "dltn", tourName: "Làm sạch đại dương tại Lý Sơn", scheduleId: "sch-2a", scheduleLabel: "22/10 – 24/10/2025", customerId: "cust-1", customerName: "Nguyễn Văn An", phone: "0912345678", email: "an.nguyen@gmail.com", numPeople: 1, totalAmount: 3200000, paymentMethod: "office", status: "pending", createdAt: "2025-10-16T10:20:00", attended: null },
];

export const mockWeeklyStats: WeeklyStats[] = [
  { week: "T2 21/9", bookings: 4, revenue: 9200000 },
  { week: "T2 28/9", bookings: 7, revenue: 16500000 },
  { week: "T2 5/10", bookings: 5, revenue: 12000000 },
  { week: "T2 12/10", bookings: 9, revenue: 22800000 },
  { week: "T2 19/10", bookings: 6, revenue: 15400000 },
  { week: "T2 26/10", bookings: 11, revenue: 27600000 },
  { week: "T2 2/11", bookings: 8, revenue: 19200000 },
];

export const mockDailyStats: DailyStat[] = [
  { day: "10/10", bookings: 1, revenue: 5400000 },
  { day: "12/10", bookings: 1, revenue: 5000000 },
  { day: "13/10", bookings: 1, revenue: 3200000 },
  { day: "14/10", bookings: 1, revenue: 3600000 },
  { day: "15/10", bookings: 2, revenue: 6800000 },
  { day: "16/10", bookings: 2, revenue: 8200000 },
  { day: "17/10", bookings: 1, revenue: 3200000 },
];

export const mockMonthlyStats: MonthlyStat[] = [
  { month: "Th.1", bookings: 3, revenue: 7500000 },
  { month: "Th.2", bookings: 5, revenue: 12000000 },
  { month: "Th.3", bookings: 4, revenue: 9600000 },
  { month: "Th.4", bookings: 7, revenue: 17400000 },
  { month: "Th.5", bookings: 8, revenue: 19200000 },
  { month: "Th.6", bookings: 6, revenue: 14800000 },
  { month: "Th.7", bookings: 5, revenue: 12000000 },
  { month: "Th.8", bookings: 9, revenue: 22500000 },
  { month: "Th.9", bookings: 11, revenue: 28600000 },
  { month: "Th.10", bookings: 10, revenue: 32800000 },
  { month: "Th.11", bookings: 0, revenue: 0 },
  { month: "Th.12", bookings: 0, revenue: 0 },
];

export const mockStaff: StaffMember[] = [
  { id: "staff-1", name: "Nguyễn Thành Long", email: "long.nguyen@veo.vn", phone: "0901111222", role: "admin", status: "active", joinedAt: "2023-01-10", lastLogin: "2025-10-16T08:30:00" },
  { id: "staff-2", name: "Trần Khánh Linh", email: "linh.tran@veo.vn", phone: "0902222333", role: "coordinator", status: "active", joinedAt: "2023-06-15", lastLogin: "2025-10-16T09:15:00" },
  { id: "staff-3", name: "Lê Minh Tuấn", email: "tuan.le@veo.vn", phone: "0903333444", role: "coordinator", status: "active", joinedAt: "2024-02-20", lastLogin: "2025-10-15T17:00:00" },
  { id: "staff-4", name: "Phạm Thu Hà", email: "ha.pham@veo.vn", phone: "0904444555", role: "staff", status: "active", joinedAt: "2024-07-01", lastLogin: "2025-10-16T10:00:00" },
  { id: "staff-5", name: "Hoàng Văn Bình", email: "binh.hoang@veo.vn", phone: "0905555666", role: "staff", status: "inactive", joinedAt: "2024-09-15", lastLogin: "2025-09-30T14:00:00" },
  { id: "staff-6", name: "Ngô Thị Hương", email: "huong.ngo@veo.vn", phone: "0906666777", role: "sale", status: "active", joinedAt: "2025-03-10", lastLogin: "2025-10-16T11:00:00" },
  { id: "staff-7", name: "Đặng Quốc Việt", email: "viet.dang@veo.vn", phone: "0907777888", role: "sale", status: "active", joinedAt: "2025-05-01", lastLogin: "2025-10-16T10:30:00" },
  { id: "staff-8", name: "Lý Thị Kim Oanh", email: "oanh.ly@veo.vn", phone: "0908888999", role: "sale", status: "active", joinedAt: "2025-07-15", lastLogin: "2025-10-16T09:45:00" },
];

export const mockSaleStaff = mockStaff.filter((s) => s.role === "sale" && s.status === "active");

// Distribute sale assignments across bookings
const _saleAssignments: Record<string, Pick<Booking, "assignedSaleId" | "assignedAt" | "assignedManually">> = {
  "bk-01": { assignedSaleId: "staff-6", assignedAt: "2025-10-01T09:15:00" },
  "bk-02": { assignedSaleId: "staff-7", assignedAt: "2025-10-05T14:30:00" },
  "bk-03": { assignedSaleId: "staff-8", assignedAt: "2025-10-08T10:00:00" },
  "bk-04": { assignedSaleId: "staff-6", assignedAt: "2025-10-10T16:45:00" },
  "bk-05": { assignedSaleId: "staff-8", assignedAt: "2025-10-12T08:20:00", assignedManually: true },
  "bk-06": { assignedSaleId: "staff-7", assignedAt: "2025-10-13T11:10:00" },
  "bk-07": { assignedSaleId: "staff-6", assignedAt: "2025-10-14T13:55:00" },
  "bk-08": { assignedSaleId: "staff-7", assignedAt: "2025-10-15T09:30:00" },
  "bk-09": { assignedSaleId: "staff-8", assignedAt: "2025-10-02T15:00:00" },
  "bk-10": { assignedSaleId: "staff-6", assignedAt: "2025-10-16T10:20:00" },
  "bk-11": { assignedSaleId: "staff-7", assignedAt: "2025-10-15T08:30:00" },
  "bk-12": { assignedSaleId: "staff-8", assignedAt: "2025-10-16T14:00:00" },
  "bk-13": { assignedSaleId: "staff-6", assignedAt: "2025-10-17T09:10:00" },
};
mockBookings.forEach((b) => { if (_saleAssignments[b.id]) Object.assign(b, _saleAssignments[b.id]); });

export function fmt(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

export function fmtDate(iso: string) {
  try {
    return new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch { return iso; }
}

export function fmtDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

export function formatDuration(days: number): string {
  if (days <= 1) return `${days} Ngày`;
  return `${days} Ngày ${days - 1} Đêm`;
}

// ── Promo codes ──────────────────────────────────────────────────────────────

export type DiscountType = "percent" | "amount";
export type PromoCodeStatus = "active" | "inactive" | "expired";
export type PromoCodeVisibility = "public" | "private";
export type PromoApplicableScope = "all" | "dltn" | "traihè" | "specific";

export type PromoCode = {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;          // % (0-100) or VNĐ
  maxDiscount?: number;           // VNĐ cap, only for percent type
  minOrderValue?: number;         // minimum order to apply
  visibility: PromoCodeVisibility;
  status: PromoCodeStatus;
  applicableScope: PromoApplicableScope;
  applicableTourIds?: string[];   // only when scope = "specific"
  usageLimit?: number;            // undefined = unlimited
  usedCount: number;
  validFrom: string;              // YYYY-MM-DD
  validTo: string;                // YYYY-MM-DD
  createdAt: string;
  createdBy: string;
};

export const mockPromoCodes: PromoCode[] = [
  {
    id: "pc-001",
    code: "SUMMER2026",
    description: "Ưu đãi hè 2026 cho tất cả tour",
    discountType: "percent",
    discountValue: 20,
    maxDiscount: 500000,
    minOrderValue: 2000000,
    visibility: "public",
    status: "active",
    applicableScope: "all",
    usageLimit: 200,
    usedCount: 47,
    validFrom: "2026-06-01",
    validTo: "2026-08-31",
    createdAt: "2026-05-20T09:00:00Z",
    createdBy: "Admin",
  },
  {
    id: "pc-002",
    code: "VEO10",
    description: "Mã thường trực 10% cho khách mới",
    discountType: "percent",
    discountValue: 10,
    minOrderValue: 1000000,
    visibility: "public",
    status: "active",
    applicableScope: "dltn",
    usedCount: 128,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    createdAt: "2026-01-01T00:00:00Z",
    createdBy: "Admin",
  },
  {
    id: "pc-003",
    code: "VIPONLY",
    description: "Dành riêng cho khách VIP – giảm 500k",
    discountType: "amount",
    discountValue: 500000,
    minOrderValue: 3000000,
    visibility: "private",
    status: "active",
    applicableScope: "specific",
    applicableTourIds: ["tour-1", "tour-2"],
    usageLimit: 50,
    usedCount: 12,
    validFrom: "2026-04-01",
    validTo: "2026-12-31",
    createdAt: "2026-03-28T10:30:00Z",
    createdBy: "Admin",
  },
  {
    id: "pc-004",
    code: "WELCOME200",
    description: "Chào mừng thành viên mới – giảm 200k",
    discountType: "amount",
    discountValue: 200000,
    minOrderValue: 1000000,
    visibility: "public",
    status: "active",
    applicableScope: "all",
    usedCount: 89,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    createdAt: "2026-01-01T00:00:00Z",
    createdBy: "Admin",
  },
  {
    id: "pc-005",
    code: "CORP2026",
    description: "Dành riêng cho doanh nghiệp CSR – 15%",
    discountType: "percent",
    discountValue: 15,
    maxDiscount: 2000000,
    minOrderValue: 5000000,
    visibility: "private",
    status: "active",
    applicableScope: "traihè",
    usageLimit: 30,
    usedCount: 8,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    createdAt: "2026-01-15T08:00:00Z",
    createdBy: "Admin",
  },
  {
    id: "pc-006",
    code: "FLASH50",
    description: "Flash sale 50% – đã hết hạn",
    discountType: "percent",
    discountValue: 50,
    maxDiscount: 1000000,
    minOrderValue: 2000000,
    visibility: "public",
    status: "expired",
    applicableScope: "dltn",
    usageLimit: 100,
    usedCount: 100,
    validFrom: "2026-03-01",
    validTo: "2026-03-03",
    createdAt: "2026-02-28T00:00:00Z",
    createdBy: "Admin",
  },
  {
    id: "pc-007",
    code: "INACTIVE01",
    description: "Mã tạm ngưng – chưa kích hoạt",
    discountType: "amount",
    discountValue: 300000,
    visibility: "private",
    status: "inactive",
    applicableScope: "all",
    usedCount: 0,
    validFrom: "2026-07-01",
    validTo: "2026-09-30",
    createdAt: "2026-06-10T14:00:00Z",
    createdBy: "Admin",
  },
];

export const CANCEL_FEE_TIERS = [
  { minDays: 30, feePercent: 0,   label: "Trước 30 ngày trở lên",         refundLabel: "Hoàn 100%" },
  { minDays: 15, feePercent: 10,  label: "Trước 15 – 29 ngày",             refundLabel: "Hoàn 90%" },
  { minDays: 7,  feePercent: 20,  label: "Trước 7 – 14 ngày",              refundLabel: "Hoàn 80%" },
  { minDays: 3,  feePercent: 30,  label: "Trước 3 – 6 ngày",               refundLabel: "Hoàn 70%" },
  { minDays: 2,  feePercent: 50,  label: "Trước 48 giờ",                   refundLabel: "Hoàn 50%" },
  { minDays: 0,  feePercent: 100, label: "Trước 24 giờ hoặc không thông báo", refundLabel: "Không hoàn" },
] as const;

export function calcBusinessDays(from: Date, to: Date): number {
  let count = 0;
  const cur = new Date(from);
  cur.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  while (cur < end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function calcCancellationFeePercent(businessDays: number): number {
  for (const tier of CANCEL_FEE_TIERS) {
    if (businessDays >= tier.minDays) return tier.feePercent;
  }
  return 100;
}

export function getCancelTier(businessDays: number): typeof CANCEL_FEE_TIERS[number] {
  for (const tier of CANCEL_FEE_TIERS) {
    if (businessDays >= tier.minDays) return tier;
  }
  return CANCEL_FEE_TIERS[CANCEL_FEE_TIERS.length - 1];
}

export function getScheduleIsoDate(scheduleId: string): string | null {
  for (const tour of mockTours) {
    const sch = tour.schedules.find((s) => s.id === scheduleId);
    if (sch) return sch.isoDate;
  }
  return null;
}

export function computeScheduleLabel(isoStart: string, durationDays: number): string {
  const start = new Date(isoStart + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays - 1);
  const dd = (d: Date) => String(d.getDate()).padStart(2, "0");
  const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = (d: Date) => String(d.getFullYear());
  if (start.getFullYear() === end.getFullYear()) {
    return `${dd(start)}/${mm(start)} – ${dd(end)}/${mm(end)}/${yyyy(end)}`;
  }
  return `${dd(start)}/${mm(start)}/${yyyy(start)} – ${dd(end)}/${mm(end)}/${yyyy(end)}`;
}
