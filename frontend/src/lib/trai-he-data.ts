type ItineraryActivity = {
  timeFrom: string;
  timeTo: string;
  name: string;
  description: string;
  images?: string[];
};

type ItineraryDay = {
  day: number;
  title: string;
  activities: ItineraryActivity[];
};

export type CampDate = {
  label: string;
  isoDate: string;
  spotsLeft: number;
};

export type Camp = {
  slug: string;
  location: string;
  title: string;
  dates: CampDate[];
  price: string;
  priceNumber: number;
  image: string;
  volunteer: string[];
  experience: string[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  policies: { icon: string; title: string; items: string[] }[];
};

const commonIncluded = [
  "Xe đưa đón khứ hồi từ Hà Nội",
  "Homestay 5 đêm tại địa phương",
  "Toàn bộ bữa ăn trong chương trình (6 ngày 5 đêm)",
  "Trang phục và dụng cụ tình nguyện VEO",
  "Bảo hiểm tai nạn trong suốt hành trình",
  "Chứng nhận tình nguyện viên VEO",
];

const commonNotIncluded = [
  "Chi phí cá nhân (mua sắm, quà lưu niệm...)",
  "Đồ dùng vệ sinh, chăm sóc cá nhân",
  "Thuốc và vật tư y tế cá nhân",
];

const commonPolicies = [
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
      "Có thể bảo lưu phí sang lịch khởi hành khác trong vòng 6 tháng kể từ ngày hủy.",
      "Chỉ áp dụng khi thông báo hủy trước ít nhất 5 ngày khởi hành.",
      "Phí bảo lưu áp dụng tối đa 1 lần.",
    ],
  },
  {
    icon: "rule",
    title: "Quy định tham gia",
    items: [
      "Tôn trọng văn hóa, phong tục địa phương trong suốt hành trình.",
      "Tuân thủ lịch trình và hướng dẫn của ban tổ chức VEO.",
      "Học viên dưới 18 tuổi cần có sự đồng ý bằng văn bản của phụ huynh.",
    ],
  },
];

export const camps: Camp[] = [
  {
    slug: "mai-chau-hoa-binh",
    location: "Mai Châu · Hoà Bình",
    title: "Bảo tồn và phát huy văn hoá dân tộc Thái",
    dates: [
      { label: "20/06 – 25/06/2026", isoDate: "2026-06-20", spotsLeft: 12 },
      { label: "25/07 – 30/07/2026", isoDate: "2026-07-25", spotsLeft: 8 },
    ],
    price: "8,890,000đ",
    priceNumber: 8890000,
    image: "/trai-he/maichau-1.png",
    volunteer: [
      "Tổ chức lớp học tiếng Anh và kỹ năng sống, phiên chợ 0 đồng cho trẻ em",
      "Hỗ trợ cải tạo cơ sở vật chất tại địa phương",
      "Thử thách Vua đầu bếp: Nấu ăn cho các hộ gia đình khó khăn",
      "Thử thách Nông dân thực thụ: Hỗ trợ người dân việc đồng áng",
    ],
    experience: [
      "Tham gia Village Tour: Khám phá bản Mai Châu",
      "Tham gia Cooking Tour: Làm cơm lam hướng đồng",
      "Tìm hiểu văn hóa dân tộc Thái: múa xoè Thái, đan nơ tăm, làm vòng tay...",
      "Trải nghiệm nhuộm vải và tìm hiểu hoa văn dân tộc Thái",
      "Vui chơi tại thác Gò Lào, hồ Ba Khan (hồ thuỷ điện Hoà Bình)",
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: Hà Nội → Mai Châu",
        activities: [
          {
            timeFrom: "05:30",
            timeTo: "11:00",
            name: "Khởi hành từ Hà Nội",
            description: "Tập kết tại điểm hẹn, lên xe di chuyển đến Mai Châu, Hoà Bình.",
          },
          {
            timeFrom: "11:00",
            timeTo: "13:00",
            name: "Nhận phòng homestay & Ăn trưa",
            description: "Nhận phòng homestay tại bản, dùng bữa trưa cùng gia đình chủ nhà.",
          },
          {
            timeFrom: "14:00",
            timeTo: "17:00",
            name: "Village Tour – Khám phá bản Mai Châu",
            description: "Dạo quanh bản làng, gặp gỡ và làm quen với cộng đồng dân tộc Thái địa phương.",
          },
          {
            timeFrom: "18:30",
            timeTo: "20:30",
            name: "Phổ biến kế hoạch & Giao lưu buổi tối",
            description: "Họp nhóm, phân công nhiệm vụ tình nguyện; giao lưu, hỏi thăm gia đình chủ nhà.",
          },
        ],
      },
      {
        day: 2,
        title: "Ngày 2: Tình nguyện – Lớp học & Phiên chợ 0 đồng",
        activities: [
          {
            timeFrom: "07:30",
            timeTo: "11:30",
            name: "Lớp học tiếng Anh & Kỹ năng sống",
            description: "Tổ chức các lớp học tiếng Anh và kỹ năng sống cho trẻ em trong bản.",
          },
          {
            timeFrom: "13:30",
            timeTo: "17:00",
            name: "Phiên chợ 0 đồng",
            description: "Tổ chức phiên chợ 0 đồng, trao quà và nhu yếu phẩm cho các hộ gia đình có hoàn cảnh khó khăn.",
          },
          {
            timeFrom: "18:30",
            timeTo: "20:30",
            name: "Múa xoè Thái & Giao lưu văn nghệ",
            description: "Cùng người dân địa phương tham gia điệu múa xoè truyền thống và giao lưu văn nghệ tại sân bản.",
          },
        ],
      },
      {
        day: 3,
        title: "Ngày 3: Văn hoá – Cooking Tour & Nghề dệt truyền thống",
        activities: [
          {
            timeFrom: "07:00",
            timeTo: "10:00",
            name: "Thử thách Nông dân thực thụ",
            description: "Cùng người dân ra đồng làm việc: cấy lúa, gặt lúa hoặc chăm sóc hoa màu tuỳ theo mùa vụ.",
          },
          {
            timeFrom: "10:30",
            timeTo: "13:00",
            name: "Cooking Tour – Làm cơm lam hướng đồng",
            description: "Học cách chọn ống nứa, vo gạo nếp và nướng cơm lam theo đúng phong cách người Thái.",
          },
          {
            timeFrom: "14:00",
            timeTo: "17:30",
            name: "Nghề dệt & Hoa văn dân tộc Thái",
            description: "Tìm hiểu quy trình nhuộm vải, học cách đan nơ tăm và làm vòng tay thổ cẩm cùng các nghệ nhân trong bản.",
          },
        ],
      },
      {
        day: 4,
        title: "Ngày 4: Tình nguyện – Cải tạo & Thử thách Vua đầu bếp",
        activities: [
          {
            timeFrom: "07:30",
            timeTo: "11:30",
            name: "Hỗ trợ cải tạo cơ sở vật chất",
            description: "Sơn sửa nhà văn hoá, lắp đặt thiết bị hoặc dọn dẹp, cải tạo không gian công cộng tại địa phương.",
          },
          {
            timeFrom: "13:30",
            timeTo: "17:00",
            name: "Thử thách Vua đầu bếp",
            description: "Chia nhóm vào bếp, chuẩn bị và nấu bữa ăn đầy đủ dinh dưỡng để trao tặng cho các hộ gia đình khó khăn.",
          },
          {
            timeFrom: "18:30",
            timeTo: "20:30",
            name: "Chiều tối cùng cộng đồng",
            description: "Giao lưu, chia sẻ cảm nhận sau ngày tình nguyện; thưởng thức rượu cần và ẩm thực địa phương.",
          },
        ],
      },
      {
        day: 5,
        title: "Ngày 5: Khám phá thiên nhiên & Đêm tổng kết",
        activities: [
          {
            timeFrom: "07:00",
            timeTo: "10:30",
            name: "Thác Gò Lào",
            description: "Trekking đến thác Gò Lào, tắm suối và khám phá cảnh quan thiên nhiên hoang sơ.",
          },
          {
            timeFrom: "11:00",
            timeTo: "14:00",
            name: "Hồ Ba Khan – Hồ thuỷ điện Hoà Bình",
            description: "Đi thuyền trên mặt hồ Ba Khan, ngắm toàn cảnh hồ thuỷ điện và núi rừng bao quanh.",
          },
          {
            timeFrom: "15:00",
            timeTo: "17:30",
            name: "Mua quà lưu niệm & Thổ cẩm Mai Châu",
            description: "Ghé thăm các gian hàng thổ cẩm, lựa chọn quà lưu niệm đặc trưng của người Thái.",
          },
          {
            timeFrom: "19:00",
            timeTo: "21:30",
            name: "Đêm giao lưu văn nghệ & Tổng kết",
            description: "Biểu diễn văn nghệ, chia sẻ khoảnh khắc đáng nhớ và trao kỷ niệm chương cho cộng đồng địa phương.",
          },
        ],
      },
      {
        day: 6,
        title: "Ngày 6: Bế mạc & Trở về Hà Nội",
        activities: [
          {
            timeFrom: "08:00",
            timeTo: "09:30",
            name: "Lễ bế mạc & Nhận chứng nhận",
            description: "Lễ tổng kết chương trình, trao chứng nhận tình nguyện viên VEO và chụp ảnh lưu niệm cùng cộng đồng.",
          },
          {
            timeFrom: "10:00",
            timeTo: "16:00",
            name: "Di chuyển về Hà Nội",
            description: "Lên xe về Hà Nội. Dự kiến đến điểm tập kết lúc 16:00.",
          },
        ],
      },
    ],
    included: commonIncluded,
    notIncluded: commonNotIncluded,
    policies: commonPolicies,
  },
  {
    slug: "ban-coi-phu-tho",
    location: "Bản Cối · Phú Thọ",
    title: "Phát triển kỹ năng sinh tồn trong tự nhiên",
    dates: [
      { label: "04/07 – 09/07/2026", isoDate: "2026-07-04", spotsLeft: 10 },
    ],
    price: "8,890,000đ",
    priceNumber: 8890000,
    image: "/trai-he/phutho-1.png",
    volunteer: [
      "Tổ chức các lớp học tiếng Anh và kỹ năng sống",
      "Tổ chức phiên chợ 0 đồng với chủ đề môi trường",
      "Hỗ trợ cải tạo cơ sở vật chất tại địa phương",
    ],
    experience: [
      "Tham gia các buổi học và thực hành kỹ năng sinh tồn",
      "Tìm hiểu về môi trường rừng, trồng và chăm sóc cây rừng",
      "Trekking khám phá VQG Xuân Sơn, tìm hiểu hệ động thực vật phong phú",
      "Tìm hiểu trang phục truyền thống người dân tộc Dao",
      "Học tết vòng tay dân tộc Dao hoặc thêu thổ cẩm",
      "Tham gia Cooking Tour: làm cơm lam, nộm rau dớn",
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: Hà Nội → Bản Cối · Phú Thọ",
        activities: [
          {
            timeFrom: "06:00",
            timeTo: "11:30",
            name: "Khởi hành từ Hà Nội",
            description: "Tập kết, lên xe di chuyển đến Bản Cối, huyện Tân Sơn, Phú Thọ.",
          },
          {
            timeFrom: "12:00",
            timeTo: "14:00",
            name: "Nhận phòng homestay & Ăn trưa",
            description: "Nhận phòng, nghỉ ngơi và dùng bữa trưa cùng gia đình người Dao địa phương.",
          },
          {
            timeFrom: "15:00",
            timeTo: "17:30",
            name: "Tham quan bản & Làm quen cộng đồng",
            description: "Khám phá cuộc sống thường ngày tại bản Cối, gặp gỡ bà con dân tộc Dao.",
          },
          {
            timeFrom: "18:30",
            timeTo: "20:30",
            name: "Buổi học kỹ năng sinh tồn đầu tiên",
            description: "Giới thiệu chương trình, phổ biến kế hoạch và học lý thuyết các kỹ năng sinh tồn cơ bản trong tự nhiên.",
          },
        ],
      },
      {
        day: 2,
        title: "Ngày 2: Kỹ năng sinh tồn & Tình nguyện",
        activities: [
          {
            timeFrom: "07:00",
            timeTo: "11:00",
            name: "Thực hành kỹ năng sinh tồn",
            description: "Thực hành ngoài trời: tìm hướng bằng mặt trời, nhóm lửa, lọc nước, xây nơi trú ẩn tạm thời.",
          },
          {
            timeFrom: "13:00",
            timeTo: "17:00",
            name: "Lớp học tiếng Anh & Kỹ năng sống",
            description: "Tổ chức các lớp học tiếng Anh giao tiếp và kỹ năng sống cho trẻ em tại điểm trường địa phương.",
          },
          {
            timeFrom: "18:30",
            timeTo: "20:30",
            name: "Tìm hiểu hệ sinh thái rừng",
            description: "Nghe chia sẻ từ kiểm lâm địa phương về hệ động thực vật VQG Xuân Sơn và ý nghĩa bảo tồn rừng.",
          },
        ],
      },
      {
        day: 3,
        title: "Ngày 3: Trekking VQG Xuân Sơn & Trồng cây rừng",
        activities: [
          {
            timeFrom: "06:30",
            timeTo: "11:30",
            name: "Trekking VQG Xuân Sơn",
            description: "Khám phá hệ sinh thái rừng nhiệt đới nguyên sinh, quan sát động thực vật và học nhận biết các loài cây quý hiếm.",
          },
          {
            timeFrom: "13:00",
            timeTo: "16:00",
            name: "Phiên chợ 0 đồng – Chủ đề môi trường",
            description: "Tổ chức phiên chợ 0 đồng, phát học liệu và đồ dùng tái chế cho bà con; lan tỏa thông điệp bảo vệ môi trường.",
          },
          {
            timeFrom: "16:30",
            timeTo: "18:30",
            name: "Trồng & chăm sóc cây rừng",
            description: "Tham gia trồng cây tại khu vực phục hồi rừng cùng cán bộ VQG Xuân Sơn.",
          },
        ],
      },
      {
        day: 4,
        title: "Ngày 4: Cải tạo cơ sở vật chất & Văn hoá dân tộc Dao",
        activities: [
          {
            timeFrom: "07:30",
            timeTo: "11:30",
            name: "Hỗ trợ cải tạo cơ sở vật chất",
            description: "Sơn sửa điểm trường hoặc nhà văn hoá bản; lắp đặt trang thiết bị học tập.",
          },
          {
            timeFrom: "13:30",
            timeTo: "16:30",
            name: "Trang phục & Nghề thủ công dân tộc Dao",
            description: "Tìm hiểu hoa văn và ý nghĩa trang phục truyền thống; học tết vòng tay dân tộc Dao hoặc thêu thổ cẩm.",
          },
          {
            timeFrom: "17:00",
            timeTo: "19:00",
            name: "Giao lưu văn hoá buổi tối",
            description: "Nghe kể chuyện dân gian, tìm hiểu phong tục và tín ngưỡng của người Dao địa phương.",
          },
        ],
      },
      {
        day: 5,
        title: "Ngày 5: Cooking Tour & Đêm lửa trại",
        activities: [
          {
            timeFrom: "07:00",
            timeTo: "11:00",
            name: "Cooking Tour – Cơm lam & Nộm rau dớn",
            description: "Học nấu cơm lam và làm nộm rau dớn – hai đặc sản nổi tiếng của vùng Tân Sơn, Phú Thọ.",
          },
          {
            timeFrom: "13:00",
            timeTo: "16:00",
            name: "Hoạt động nhóm & Vui chơi ngoài trời",
            description: "Thử thách sinh tồn nhóm, trò chơi dân gian và các hoạt động rèn luyện kỹ năng làm việc đội nhóm.",
          },
          {
            timeFrom: "18:00",
            timeTo: "21:00",
            name: "Đêm lửa trại & Tổng kết",
            description: "Đốt lửa trại, biểu diễn tiết mục văn nghệ, chia sẻ cảm nhận và kỷ niệm sau 5 ngày cùng nhau.",
          },
        ],
      },
      {
        day: 6,
        title: "Ngày 6: Bế mạc & Trở về Hà Nội",
        activities: [
          {
            timeFrom: "08:00",
            timeTo: "09:30",
            name: "Lễ bế mạc & Nhận chứng nhận",
            description: "Lễ tổng kết, trao chứng nhận tình nguyện viên VEO, chụp ảnh lưu niệm cùng cộng đồng địa phương.",
          },
          {
            timeFrom: "10:00",
            timeTo: "15:00",
            name: "Di chuyển về Hà Nội",
            description: "Lên xe về Hà Nội. Dự kiến đến điểm tập kết lúc 15:00.",
          },
        ],
      },
    ],
    included: commonIncluded,
    notIncluded: commonNotIncluded,
    policies: commonPolicies,
  },
  {
    slug: "ta-van-sa-pa",
    location: "Tả Vạn · Sa Pa",
    title: "Trải nghiệm cuộc sống trường học vùng cao",
    dates: [
      { label: "12/07 – 17/07/2026", isoDate: "2026-07-12", spotsLeft: 9 },
    ],
    price: "9,990,000đ",
    priceNumber: 9990000,
    image: "/trai-he/sapa-1.png",
    volunteer: [
      "Tổ chức các lớp học tiếng Anh và kỹ năng sống",
      "Làm bánh, chuẩn bị bữa trưa dành tặng học sinh tại điểm trường",
      "Hỗ trợ cải tạo cơ sở vật chất tại địa phương",
      "Thăm hỏi, nấu ăn tặng hộ gia đình có hoàn cảnh khó khăn",
    ],
    experience: [
      "Khám phá Núi Hàm Rồng và trung tâm thị xã Sapa",
      "Trải nghiệm làm hương thảo mộc; tết vòng tay may mắn",
      "Trải nghiệm vẽ sáp ong nhuộm chàm của dân tộc Mông",
      "Học múa truyền thống của dân tộc Giáy",
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: Hà Nội → Sa Pa",
        activities: [
          {
            timeFrom: "05:00",
            timeTo: "12:00",
            name: "Khởi hành từ Hà Nội lên Sa Pa",
            description: "Xe khởi hành từ Hà Nội, di chuyển theo cao tốc Nội Bài – Lào Cai, đến Sa Pa.",
          },
          {
            timeFrom: "13:00",
            timeTo: "15:00",
            name: "Nhận phòng homestay & Ăn trưa",
            description: "Nhận phòng homestay tại thôn Tả Vạn, nghỉ ngơi và dùng bữa trưa.",
          },
          {
            timeFrom: "15:30",
            timeTo: "18:00",
            name: "Tham quan điểm trường Tả Vạn",
            description: "Gặp gỡ thầy cô và các em học sinh, tìm hiểu hoàn cảnh và nhu cầu của điểm trường vùng cao.",
          },
          {
            timeFrom: "19:00",
            timeTo: "21:00",
            name: "Phổ biến kế hoạch tình nguyện",
            description: "Họp nhóm, phân công nhiệm vụ và chuẩn bị tâm thế cho những ngày tình nguyện phía trước.",
          },
        ],
      },
      {
        day: 2,
        title: "Ngày 2: Tình nguyện – Bữa ăn yêu thương & Lớp học",
        activities: [
          {
            timeFrom: "07:00",
            timeTo: "11:00",
            name: "Làm bánh & Chuẩn bị bữa trưa yêu thương",
            description: "Tự tay làm bánh, nấu bữa trưa đầy đủ dinh dưỡng để trao tặng cho các em học sinh tại điểm trường.",
          },
          {
            timeFrom: "11:00",
            timeTo: "13:00",
            name: "Tổ chức bữa ăn cùng học sinh",
            description: "Cùng ăn trưa với các em, giao lưu, kể chuyện và trò chơi vui học.",
          },
          {
            timeFrom: "14:00",
            timeTo: "17:30",
            name: "Lớp học tiếng Anh & Kỹ năng sống",
            description: "Tổ chức các buổi học tiếng Anh giao tiếp, kỹ năng tư duy và kỹ năng sống cho học sinh tiểu học vùng cao.",
          },
        ],
      },
      {
        day: 3,
        title: "Ngày 3: Tình nguyện – Cải tạo cơ sở & Thăm hộ khó khăn",
        activities: [
          {
            timeFrom: "07:30",
            timeTo: "11:30",
            name: "Cải tạo cơ sở vật chất điểm trường",
            description: "Sơn sửa phòng học, vẽ tranh tường cổ động, lắp đặt góc đọc sách và trang thiết bị học tập.",
          },
          {
            timeFrom: "13:30",
            timeTo: "17:00",
            name: "Thăm hỏi & Nấu ăn tặng hộ khó khăn",
            description: "Chia nhóm thăm viếng và nấu bữa ăn đầy đủ trao tặng cho các hộ gia đình có hoàn cảnh khó khăn trong thôn.",
          },
          {
            timeFrom: "18:30",
            timeTo: "20:30",
            name: "Giao lưu văn hoá buổi tối",
            description: "Ngồi bên bếp lửa cùng gia đình chủ nhà, nghe kể chuyện cuộc sống vùng cao và chia sẻ cảm nhận.",
          },
        ],
      },
      {
        day: 4,
        title: "Ngày 4: Trải nghiệm – Núi Hàm Rồng & Nghề thủ công",
        activities: [
          {
            timeFrom: "07:00",
            timeTo: "11:00",
            name: "Khám phá Núi Hàm Rồng",
            description: "Leo bộ lên Núi Hàm Rồng, tham quan vườn hoa và ngắm toàn cảnh thị xã Sa Pa từ trên cao.",
          },
          {
            timeFrom: "13:00",
            timeTo: "16:00",
            name: "Làm hương thảo mộc & Tết vòng tay may mắn",
            description: "Học làm hương từ thảo mộc thiên nhiên và tết vòng tay may mắn theo phong tục địa phương.",
          },
          {
            timeFrom: "16:30",
            timeTo: "18:30",
            name: "Dạo phố Sa Pa & Ẩm thực vùng cao",
            description: "Khám phá chợ đêm Sa Pa, thưởng thức các món đặc sản như thắng cố, cơm lam và rau cải mèo xào tỏi.",
          },
        ],
      },
      {
        day: 5,
        title: "Ngày 5: Văn hoá – Nhuộm chàm & Múa dân tộc",
        activities: [
          {
            timeFrom: "08:00",
            timeTo: "11:30",
            name: "Vẽ sáp ong & Nhuộm chàm dân tộc Mông",
            description: "Trải nghiệm nghề truyền thống của người Mông: dùng sáp ong vẽ hoa văn lên vải rồi nhuộm chàm tạo nên những tấm vải đặc sắc.",
          },
          {
            timeFrom: "13:30",
            timeTo: "16:30",
            name: "Học múa truyền thống dân tộc Giáy",
            description: "Được nghệ nhân người Giáy hướng dẫn các điệu múa truyền thống trong trang phục dân tộc.",
          },
          {
            timeFrom: "18:00",
            timeTo: "21:00",
            name: "Đêm giao lưu văn nghệ & Tổng kết",
            description: "Biểu diễn các tiết mục đã luyện tập, chia sẻ kỷ niệm và cảm ơn cộng đồng địa phương.",
          },
        ],
      },
      {
        day: 6,
        title: "Ngày 6: Bế mạc & Trở về Hà Nội",
        activities: [
          {
            timeFrom: "08:00",
            timeTo: "09:30",
            name: "Lễ bế mạc & Nhận chứng nhận",
            description: "Lễ tổng kết, trao chứng nhận tình nguyện viên VEO và vé tham quan Núi Hàm Rồng; chụp ảnh lưu niệm.",
          },
          {
            timeFrom: "10:00",
            timeTo: "17:00",
            name: "Di chuyển về Hà Nội",
            description: "Lên xe về Hà Nội. Dự kiến đến điểm tập kết lúc 17:00.",
          },
        ],
      },
    ],
    included: [
      ...commonIncluded.slice(0, 5),
      "Vé tham quan Núi Hàm Rồng",
      "Chứng nhận tình nguyện viên VEO",
    ],
    notIncluded: commonNotIncluded,
    policies: commonPolicies,
  },
];

export function getCampBySlug(slug: string): Camp | undefined {
  return camps.find((c) => c.slug === slug);
}
