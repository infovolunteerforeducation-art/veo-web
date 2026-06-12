export type Article = {
  slug: string;
  category: string;
  categorySlug: string;
  categoryClass: string;
  date: string;
  image: string;
  title: string;
  excerpt: string;
  readTime: number;
  featured?: boolean;
  body: ContentBlock[];
};

export const allCategories = [
  { name: "Tất cả", slug: null },
  { name: "Hoạt động", slug: "hoat-dong" },
  { name: "Câu chuyện", slug: "cau-chuyen" },
  { name: "Sự kiện", slug: "su-kien" },
  { name: "Đối tác", slug: "doi-tac" },
  { name: "Về VEO", slug: "ve-veo" },
] as const;

export const categoryMap: Record<string, { name: string; class: string }> = {
  "ve-veo": { name: "Về VEO", class: "bg-deep-amethyst text-pure-white" },
  "su-kien": { name: "Sự kiện", class: "bg-solar-orange text-pure-white" },
  "cau-chuyen": { name: "Câu chuyện", class: "bg-tertiary-container text-pure-white" },
  "doi-tac": { name: "Đối tác", class: "bg-secondary-container text-on-secondary-container" },
  "hoat-dong": { name: "Hoạt động", class: "bg-solar-orange text-pure-white" },
};

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "ul"; items: string[] };

export const articles: Article[] = [
  {
    slug: "hanh-trinh-10-nam-veo",
    category: "Về VEO",
    categorySlug: "ve-veo",
    categoryClass: "bg-deep-amethyst text-pure-white",
    date: "05/06/2026",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&h=600&fit=crop",
    title:
      "10 năm VEO – Hành trình từ ước mơ nhỏ đến cộng đồng 50.000 tình nguyện viên",
    excerpt:
      "Nhìn lại chặng đường 10 năm kết nối những trái tim thiện nguyện, từ chuyến đi đầu tiên chỉ với 8 người đến hôm nay với hơn 50.000 tình nguyện viên khắp cả nước.",
    readTime: 7,
    featured: true,
    body: [
      {
        type: "p",
        text: "Mùa hè năm 2016, tám sinh viên đại học khoác ba lô lên vùng núi Hà Giang với một mục tiêu đơn giản: dạy tiếng Anh cho trẻ em vùng cao. Không có tên tổ chức, không có kinh phí ổn định, chỉ có nhiệt huyết và tờ giấy viết tay kế hoạch hoạt động. Đó là khởi đầu của VEO.",
      },
      {
        type: "h2",
        text: "Từ 8 người đến 50.000 cộng đồng",
      },
      {
        type: "p",
        text: "10 năm sau, VEO đã trở thành một trong những tổ chức du lịch tình nguyện lớn nhất Việt Nam với hơn 50.000 tình nguyện viên đã tham gia các chương trình. Mỗi năm, hơn 200 chuyến đi được tổ chức trải dài từ vùng núi phía Bắc đến các đảo xa xôi miền Trung và Tây Nguyên.",
      },
      {
        type: "quote",
        text: "Chúng tôi không chỉ tổ chức những chuyến đi – chúng tôi đang xây dựng một thế hệ công dân biết cho đi và biết kết nối với cộng đồng.",
        author: "Nguyễn Minh Khoa, Đồng sáng lập VEO",
      },
      {
        type: "h2",
        text: "Những con số biết nói",
      },
      {
        type: "ul",
        items: [
          "Hơn 50.000 tình nguyện viên từ khắp 63 tỉnh thành",
          "200+ chuyến du lịch tình nguyện mỗi năm",
          "15 tỉnh thành được phủ sóng hoạt động",
          "Hợp tác với 80+ doanh nghiệp trong chương trình CSR",
          "Hơn 5.000 học sinh vùng cao được hỗ trợ giáo dục",
        ],
      },
      {
        type: "h2",
        text: "Hành trình phía trước",
      },
      {
        type: "p",
        text: "Kỷ niệm 10 năm không chỉ là dịp nhìn lại, mà còn là thời điểm để VEO đặt ra những mục tiêu mới. Trong giai đoạn 2026–2030, VEO hướng đến mở rộng sang các nước Đông Nam Á, đồng thời xây dựng nền tảng công nghệ để kết nối tình nguyện viên trên toàn cầu.",
      },
      {
        type: "p",
        text: "Với mỗi chuyến đi, VEO tin rằng tình nguyện không chỉ thay đổi cộng đồng được phục vụ – mà còn thay đổi chính người tình nguyện. Và đó là hành trình chúng tôi muốn tiếp tục cùng bạn.",
      },
    ],
  },
  {
    slug: "workcamp-2026-mo-dang-ky",
    category: "Sự kiện",
    categorySlug: "su-kien",
    categoryClass: "bg-solar-orange text-pure-white",
    date: "01/06/2026",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop",
    title:
      "Workcamp Quốc tế 2026 chính thức mở đăng ký – Kết nối tình nguyện viên từ 15 quốc gia",
    excerpt:
      "Chương trình Workcamp Quốc tế lần thứ 5 sẽ diễn ra tại Hà Giang, quy tụ tình nguyện viên từ 15 quốc gia cùng xây dựng điểm trường và hỗ trợ cộng đồng vùng cao.",
    readTime: 5,
    body: [
      {
        type: "p",
        text: "VEO chính thức mở đăng ký Workcamp Quốc tế 2026, chương trình tình nguyện quốc tế thường niên lớn nhất do VEO tổ chức. Đây là lần thứ 5 chương trình được tổ chức, và cũng là lần đầu tiên có sự tham gia của tình nguyện viên từ 15 quốc gia.",
      },
      {
        type: "h2",
        text: "Thông tin chương trình",
      },
      {
        type: "ul",
        items: [
          "Thời gian: 15/07 – 01/08/2026 (18 ngày)",
          "Địa điểm: Đồng Văn, Hà Giang",
          "Số lượng: 80 tình nguyện viên (60% quốc tế, 40% Việt Nam)",
          "Ngôn ngữ giao tiếp: Tiếng Anh",
          "Phí tham gia: 4.500.000 VNĐ (bao gồm ăn ở, di chuyển nội địa)",
        ],
      },
      {
        type: "h2",
        text: "Hoạt động tình nguyện",
      },
      {
        type: "p",
        text: "Trong 18 ngày, các tình nguyện viên sẽ cùng nhau xây dựng và sửa chữa 2 phòng học tại trường Tiểu học Đồng Văn A, dạy tiếng Anh và kỹ năng sống cho học sinh THCS, và tham gia các buổi giao lưu văn hóa với người dân địa phương.",
      },
      {
        type: "quote",
        text: "Workcamp không chỉ là nơi làm tình nguyện – đây là nơi bạn kết bạn với người từ khắp thế giới, cùng nhau chia sẻ một mục tiêu chung.",
        author: "Priya Sharma, tình nguyện viên từ Ấn Độ (Workcamp 2024)",
      },
      {
        type: "h2",
        text: "Cách đăng ký",
      },
      {
        type: "p",
        text: "Hạn chót đăng ký là ngày 30/06/2026. Ứng viên cần điền form đăng ký trực tuyến, gửi bản giới thiệu bản thân bằng tiếng Anh và tham gia phỏng vấn online (nếu được chọn vào vòng tiếp theo). Số lượng có hạn – đăng ký sớm để không bỏ lỡ cơ hội.",
      },
    ],
  },
  {
    slug: "cau-chuyen-lan-phuong",
    category: "Câu chuyện",
    categorySlug: "cau-chuyen",
    categoryClass: "bg-tertiary-container text-pure-white",
    date: "28/05/2026",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=600&fit=crop",
    title:
      'Bác sĩ Lan Phương và 3 mùa hè tình nguyện tại vùng cao: "Đây là nơi tôi cảm thấy sống thật nhất"',
    excerpt:
      'Từ một chuyến đi "thử cho biết", bác sĩ Lan Phương đã gắn bó với VEO suốt 3 năm liên tiếp. Câu chuyện của chị về y tế cộng đồng và tình người vùng cao.',
    readTime: 6,
    body: [
      {
        type: "p",
        text: 'Năm 2023, bác sĩ Trần Lan Phương lần đầu tham gia chuyến đi tình nguyện cùng VEO tại Mù Cang Chải "chỉ để thử xem thế nào". Chị vừa hoàn thành chuyên khoa nội tổng quát, đang trong giai đoạn tìm kiếm ý nghĩa sau những năm học căng thẳng. Chị không ngờ rằng chuyến đi đó sẽ thay đổi cách chị nhìn nghề y.',
      },
      {
        type: "h2",
        text: "Y tế cộng đồng – những điều trường y không dạy",
      },
      {
        type: "p",
        text: "Tại trạm y tế xã, Lan Phương tiếp xúc với những bệnh nhân mà cả đời chưa được khám chữa bệnh đúng nghĩa. Nhiều người đi bộ hàng giờ từ bản xuống để gặp bác sĩ. Chị nhận ra rằng y học không chỉ là kỹ thuật – mà còn là sự kiên nhẫn, khả năng lắng nghe, và sự đồng cảm sâu sắc.",
      },
      {
        type: "quote",
        text: "Ở đây tôi học được điều mà 6 năm đại học y chưa dạy: cách ngồi xuống, nhìn thẳng vào mắt bệnh nhân, và thật sự lắng nghe họ.",
        author: "BS. Trần Lan Phương",
      },
      {
        type: "h2",
        text: "Ba mùa hè, ba câu chuyện",
      },
      {
        type: "p",
        text: "Mùa hè 2024, chị quay lại cùng thêm hai đồng nghiệp. Họ tổ chức 5 buổi khám sức khỏe miễn phí tại các bản xa trung tâm, khám cho hơn 300 người. Mùa hè 2025, chị dẫn đoàn 8 bác sĩ và 4 sinh viên y khoa. Họ xây dựng được một tủ thuốc cơ bản để lại cho trạm y tế xã, và hướng dẫn y tá địa phương những kỹ năng sơ cứu thiết yếu.",
      },
      {
        type: "p",
        text: "Năm 2026 này, Lan Phương đang lên kế hoạch cho chuyến đi thứ tư. Lần này, chị muốn đưa học sinh trường y theo để các em có trải nghiệm thực tế ngay từ những năm đầu học ngành.",
      },
      {
        type: "p",
        text: '"Đây là nơi tôi cảm thấy sống thật nhất," chị chia sẻ. "Không phải vì cuộc sống ở đây dễ dàng – mà vì ở đây, mỗi việc mình làm đều có ý nghĩa rõ ràng và tức thì."',
      },
    ],
  },
  {
    slug: "doi-tac-techcombank-2026",
    category: "Đối tác",
    categorySlug: "doi-tac",
    categoryClass: "bg-secondary-container text-on-secondary-container",
    date: "20/05/2026",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop",
    title:
      "VEO hợp tác cùng Techcombank triển khai chương trình CSR cho 500 nhân viên năm 2026",
    excerpt:
      "Chương trình CSR quy mô lớn nhất từ trước đến nay của VEO – đưa 500 nhân viên Techcombank đến với các bản làng vùng núi phía Bắc trong 6 tháng cuối năm.",
    readTime: 4,
    body: [
      {
        type: "p",
        text: "VEO và Techcombank vừa ký kết hợp tác triển khai chương trình CSR (Trách nhiệm xã hội doanh nghiệp) quy mô lớn nhất trong lịch sử VEO. Theo đó, VEO sẽ tổ chức các chuyến đi tình nguyện cho 500 nhân viên Techcombank trong giai đoạn tháng 7 đến tháng 12/2026.",
      },
      {
        type: "h2",
        text: "Quy mô chưa từng có",
      },
      {
        type: "p",
        text: "Chương trình được chia thành 10 chuyến đi, mỗi chuyến 50 người, diễn ra tại 5 tỉnh: Hà Giang, Lai Châu, Sơn La, Nghệ An và Quảng Ngãi. Mỗi đoàn sẽ tham gia các hoạt động xây dựng cơ sở hạ tầng, giáo dục và y tế cộng đồng trong 3–4 ngày.",
      },
      {
        type: "quote",
        text: "Chúng tôi muốn nhân viên của mình không chỉ làm tốt trong công việc – mà còn là những công dân tốt, biết đóng góp cho xã hội.",
        author: "Đại diện bộ phận CSR, Techcombank",
      },
      {
        type: "h2",
        text: "Mô hình CSR tích hợp",
      },
      {
        type: "p",
        text: "Điểm khác biệt của chương trình này là sự tích hợp giữa team-building doanh nghiệp và tình nguyện cộng đồng. Thay vì các hoạt động nội bộ thông thường, nhân viên Techcombank sẽ cùng nhau giải quyết những vấn đề thực tế tại địa phương, từ đó tăng cường tinh thần đội nhóm và cảm giác có đóng góp ý nghĩa.",
      },
      {
        type: "p",
        text: "VEO sẽ đảm nhận toàn bộ khâu logistics, an toàn, thiết kế hoạt động và đo lường tác động sau chuyến đi. Đây là mô hình dịch vụ CSR trọn gói mà VEO đã phát triển trong 3 năm qua, phục vụ hơn 30 doanh nghiệp.",
      },
    ],
  },
  {
    slug: "ly-son-ket-qua-chien-dich",
    category: "Hoạt động",
    categorySlug: "hoat-dong",
    categoryClass: "bg-solar-orange text-pure-white",
    date: "15/05/2026",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop",
    title:
      "Chiến dịch Lý Sơn: Thu gom được 1,2 tấn rác thải nhựa sau 3 ngày tình nguyện",
    excerpt:
      "Kết quả vượt kỳ vọng: 80 tình nguyện viên cùng ngư dân địa phương đã thu gom 1,2 tấn rác nhựa khỏi bãi biển và rạn san hô tại đảo Lý Sơn.",
    readTime: 5,
    body: [
      {
        type: "p",
        text: "Từ ngày 10 đến 12/05/2026, 80 tình nguyện viên VEO cùng hơn 40 ngư dân địa phương đã hoàn thành chiến dịch dọn rác quy mô lớn tại đảo Lý Sơn, Quảng Ngãi. Kết quả thu về: 1,2 tấn rác thải nhựa được gom và phân loại, vượt xa mục tiêu ban đầu đặt ra là 800kg.",
      },
      {
        type: "h2",
        text: "3 ngày – 3 mặt trận",
      },
      {
        type: "ul",
        items: [
          "Ngày 1: Dọn rác bãi biển phía Đông đảo – 420kg rác thu gom",
          "Ngày 2: Lặn biển dọn rác rạn san hô (phối hợp với câu lạc bộ lặn địa phương) – 180kg",
          "Ngày 3: Dọn làng chài và tổ chức tọa đàm với ngư dân về rác thải đại dương – 600kg",
        ],
      },
      {
        type: "h2",
        text: "Không chỉ là nhặt rác",
      },
      {
        type: "p",
        text: "Điểm đặc biệt của chiến dịch này là sự tham gia chủ động của ngư dân địa phương. VEO đã làm việc với Hội Ngư nghiệp xã An Vĩnh trong 2 tháng trước để cùng thiết kế chương trình, thay vì áp đặt một chiến dịch từ bên ngoài. Kết quả là sự hợp tác thực sự, không phải màn trình diễn.",
      },
      {
        type: "quote",
        text: "Trước đây tôi nghĩ rác biển là do khách du lịch. Đây là lần đầu tiên tôi hiểu rác đến từ đâu và chúng ta có thể làm gì. Mấy đứa tình nguyện cũng dạy tôi cách phân loại rác đúng cách.",
        author: "Anh Lê Văn Tám, ngư dân xã An Vĩnh",
      },
      {
        type: "p",
        text: "Toàn bộ rác thu gom đã được phân loại và chuyển giao cho đơn vị tái chế tại Quảng Ngãi. Phần không tái chế được xử lý tại cơ sở xử lý rác thải địa phương. VEO cam kết quay lại Lý Sơn định kỳ 6 tháng một lần.",
      },
    ],
  },
  {
    slug: "bai-giang-tinh-nguyen-truong-dai-hoc",
    category: "Câu chuyện",
    categorySlug: "cau-chuyen",
    categoryClass: "bg-tertiary-container text-pure-white",
    date: "08/05/2026",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&h=600&fit=crop",
    title:
      "Khi sinh viên Đại học Ngoại Thương mang tiếng Anh lên bản Mèo Vạc",
    excerpt:
      "Nhóm 12 sinh viên tình nguyện từ Đại học Ngoại Thương đã tổ chức 15 buổi dạy tiếng Anh miễn phí cho học sinh THCS tại Mèo Vạc, Hà Giang.",
    readTime: 5,
    body: [
      {
        type: "p",
        text: "Trong 10 ngày tháng 4/2026, nhóm 12 sinh viên từ Câu lạc bộ Tiếng Anh – Đại học Ngoại Thương Hà Nội đã lên Mèo Vạc (Hà Giang) để tổ chức lớp học tiếng Anh miễn phí. Đây là lần đầu tiên nhóm hợp tác cùng VEO sau 3 tháng chuẩn bị bài giảng và học liệu.",
      },
      {
        type: "h2",
        text: "Dạy học ở nơi chưa có wifi",
      },
      {
        type: "p",
        text: "Thách thức lớn nhất không phải là rào cản ngôn ngữ hay địa lý, mà là thiết kế bài học không phụ thuộc vào điện hay internet. Nhóm đã phải in tất cả tài liệu, tạo flashcard thủ công và chuẩn bị trò chơi học tiếng Anh không cần thiết bị. Kết quả: 15 buổi học với tổng 87 học sinh THCS tham gia.",
      },
      {
        type: "quote",
        text: "Em chưa bao giờ nói chuyện với người từ Hà Nội. Em không nghĩ tiếng Anh lại có thể học vui như thế.",
        author: "Sùng A Phử, học sinh lớp 8, trường THCS Mèo Vạc",
      },
      {
        type: "h2",
        text: "Bài học hai chiều",
      },
      {
        type: "p",
        text: "Phạm Thị Thu Hà, trưởng nhóm sinh viên, chia sẻ: 'Chúng tôi đi với tâm thế đến để dạy. Nhưng chúng tôi học được nhiều hơn – về sự kiên nhẫn, về việc không phụ thuộc vào công nghệ, và về việc thực sự kết nối với học sinh mà không cần màn hình nào cả.'",
      },
      {
        type: "p",
        text: "Sau chuyến đi, nhóm đã để lại toàn bộ bộ học liệu và flashcard cho giáo viên tiếng Anh tại trường. Họ cũng ghi hình 15 video bài giảng cơ bản để giáo viên có thể tiếp tục sử dụng sau khi đoàn rời đi.",
      },
    ],
  },
];
