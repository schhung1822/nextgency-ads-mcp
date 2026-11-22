import { LEGAL, SITE, formatVnd } from "@/lib/site";
import type { ChatScenario, GuideTab, Locale } from "./types";

const price = formatVnd(SITE.price, "vi");

/**
 * Nội dung landing page tiếng Việt (trang mặc định "/").
 * Bản tiếng Anh nằm ở ./en.ts và phải có cùng cấu trúc (TypeScript sẽ báo nếu thiếu).
 * Tiêu đề mục gồm `title` (chữ thường) + `accent` (dòng nhấn màu gradient).
 * Chuỗi có thể dùng **đậm**, `mã`, [chữ](link) ở những chỗ hiển thị bằng <Rich>.
 */
export const vi = {
  locale: "vi" as Locale,
  meta: {
    title: `${SITE.productName}: ${SITE.tagline} | Nextgency`,
    description: `Hỏi AI bằng tiếng Việt: video nào ra khách, tiền quảng cáo đang phí ở đâu, đối thủ đang làm gì. Ads MCP Simple kết nối AI với quảng cáo Facebook, TikTok, Google; có Nextgency hỗ trợ cài đặt. Trọn bộ ${price}.`,
    ogLocale: "vi_VN",
  },
  price,

  nav: {
    label: "Điều hướng chính",
    home: "Nextgency — về đầu trang",
    buy: "Mua ngay",
    menu: "Menu",
    openMenu: "Mở menu",
    switchTo: { label: "EN", aria: "Xem bản tiếng Anh (English)" },
    items: [
      { href: "#hieu-qua", label: "Kết quả" },
      { href: "#doi-ai", label: "Đội quảng cáo AI" },
      { href: "#mcp-la-gi", label: "MCP là gì" },
      { href: "#cach-dung", label: "Cách dùng" },
      { href: "#tinh-nang", label: "Tính năng" },
      { href: "#mua", label: "Giá" },
      { href: "#faq", label: "Hỏi đáp" },
    ],
  },

  hero: {
    badge: "MCP không còn là chuyện của dân công nghệ",
    title: "Năm 2027, ai kinh doanh",
    titleAccent: "cũng cần biết MCP.",
    lead: "**MCP biến AI thành một đội chạy quảng cáo** cho bạn trên Facebook, TikTok, Google. Bạn hỏi bằng tiếng Việt — đội AI xem số liệu, chỉ ra video nào ra khách, chỗ nào đang phí tiền, rồi góp ý lại cho bạn và thao tác giúp khi bạn đồng ý.",
    sub: `**${SITE.productName}** là bộ cài sẵn để bạn có đội AI này, kèm Nextgency hỗ trợ cài đặt — bạn không cần biết kỹ thuật.`,
    buy: "Mua ngay",
    ctaLearn: "Hiểu MCP trong 30 giây",
    trust: ["Thanh toán QR, xác nhận tự động", "Kèm Nextgency hỗ trợ cài đặt", "Trả một lần · cập nhật miễn phí"],
    chat: {
      team: "Đội quảng cáo AI",
      status: "Đang trực · Facebook, TikTok, Google",
      badge: "Minh họa",
      greeting: "Xin chào! Hôm nay bạn muốn mình xem giúp gì?",
      placeholder: "Nhắn cho đội quảng cáo…",
      unit: "khách",
      top: "Số 1",
      stop: "Nên dừng",
      yes: "Đồng ý",
      later: "Để sau",
      note: "Mô phỏng, số liệu minh họa. Mọi thay đổi quảng cáo đều chờ bạn đồng ý.",
      asksLabel: "Chủ doanh nghiệp hay hỏi — bấm để xem",
      srSummary:
        "Ví dụ cuộc trò chuyện: bạn hỏi “Video nào tuần này ra khách nhiều nhất?”, “Tiền quảng cáo tuần này có bị phí không?” hoặc “Đối thủ quanh mình đang quảng cáo gì, khách chê gì?”; đội AI đọc số liệu quảng cáo và dữ liệu thị trường rồi trả lời bằng tiếng Việt, kèm gợi ý hành động.",
      scenarios: [
        {
          chip: "Video nào ra khách?",
          question: "Video nào tuần này ra khách nhiều nhất?",
          tools: [
            ["Facebook Ads", "Đọc số liệu 12 video"],
            ["TikTok Ads", "Đọc số liệu video tuần này"],
          ],
          intro: "Video chị chủ cầm sản phẩm tư vấn ra khách tốt nhất:",
          body: {
            kind: "rank",
            rows: [
              { label: "Chủ tư vấn", value: 42, tag: "top" },
              { label: "Vlog đi Hàn", value: 27 },
              { label: "Giới thiệu spa", value: 3, tag: "stop" },
            ],
            hint: "Gợi ý: quay dọc, dưới 20 giây, chủ tự nói trước máy — làm thêm video giống video số 1.",
          },
        },
        {
          chip: "Tiền có bị phí không?",
          question: "Tiền quảng cáo tuần này có bị phí không?",
          tools: [
            ["Facebook Ads", "Cộng chi tiêu 2 tài khoản"],
            ["Google Ads", "Cộng chi tiêu 1 tài khoản"],
          ],
          intro: "Tuần này chị bỏ ra 4,8 triệu:",
          body: {
            kind: "split",
            good: { label: "mang về khách", value: "3,9 tr", pct: 81 },
            bad: { label: "chưa ra khách", value: "0,9 tr" },
            note: "Mỗi khách tốn khoảng 25.000₫",
            ask: "Tắt 2 quảng cáo chưa ra khách nào?",
            done: "Đã tắt 2 quảng cáo. Sáng mai em báo lại kết quả qua Telegram cho chị.",
          },
        },
        {
          chip: "Đối thủ đang làm gì?",
          question: "Đối thủ quanh mình đang quảng cáo gì, khách chê gì?",
          tools: [
            ["Thư viện quảng cáo Facebook", "Quảng cáo của đối thủ"],
            ["Google Maps", "Đánh giá của khách"],
          ],
          intro: "Em tóm tắt nhanh:",
          body: {
            kind: "bullets",
            items: [
              "Đối thủ đang đẩy ưu đãi “mua 1 tặng 1” và miễn phí giao hàng.",
              "Khách hay chê: giao chậm, nhân viên trả lời muộn.",
              "Gợi ý: ghi rõ “trả lời trong 5 phút” ngay trong quảng cáo của chị.",
            ],
          },
        },
      ] as ChatScenario[],
    },
  },

  stats: {
    label: "Con số nổi bật",
    items: [
      { to: 4, suffix: "", text: "", title: "Nền tảng quảng cáo", sub: "Facebook, TikTok, Google, OpenAI" },
      { to: 5, suffix: "+", text: "", title: "Ứng dụng AI dùng được", sub: "Claude, ChatGPT, Gemini…" },
      { to: 1, suffix: "", text: "", title: "Nơi xem tất cả", sub: "Số liệu mọi tài khoản ở một chỗ" },
      { to: 0, suffix: "", text: "Của bạn", title: "Dữ liệu riêng tư", sub: "Nằm trên máy chủ do bạn sở hữu" },
    ],
    marqueeLabel: "Nền tảng và nguồn dữ liệu được hỗ trợ",
    marquee: ["Facebook Ads", "TikTok Ads", "Google Ads", "OpenAI Ads", "Telegram", "Claude", "ChatGPT", "Gemini", "Shopee", "TikTok Shop", "Lazada", "Thư viện quảng cáo Facebook", "Google Maps", "YouTube"],
  },

  compare: {
    eyebrow: "Kết quả",
    title: "Có Ads MCP, việc bán hàng",
    accent: "thay đổi thế nào?",
    lead: "Bấm để so sánh. Cùng số tiền quảng cáo, nhưng có đội AI theo sát mỗi ngày.",
    group: "So sánh trước và sau",
    before: "Trước khi có MCP",
    after: "Sau khi có MCP",
    customersLabel: "Khách nhắn tin mỗi tuần",
    customers: { before: "18 khách", after: "31 khách" },
    moneyLabel: "Tiền quảng cáo đi đâu",
    good: "Mang về khách",
    waste: "Bị phí",
    hoursLabel: "Chủ bỏ ra mỗi tuần để xem quảng cáo",
    hours: { before: "Khoảng 5 tiếng", after: "15 phút" },
    changes: [
      { title: "Biết tiền đi đâu", before: "Cuối tháng mới biết, mà chưa chắc đúng", after: "Sáng nào cũng có báo cáo trên điện thoại" },
      { title: "Quảng cáo đang lỗ", before: "Chạy cả tuần mới phát hiện", after: "Phát hiện trong ngày, nhắn một câu là tắt" },
      { title: "Làm video gì", before: "Quay theo cảm tính, đoán mò", after: "Biết dạng video nào ra khách để quay theo" },
      { title: "Đối thủ làm gì", before: "Lướt Facebook hàng giờ", after: "AI tóm tắt cho bạn trong vài phút" },
      { title: "Người chạy quảng cáo", before: "Chỉ biết tin theo báo cáo", after: "Tự xem số thật, hỏi lại có căn cứ" },
      { title: "Facebook, TikTok, Google", before: "Mỗi nơi một ứng dụng, mở từng cái", after: "Hỏi một chỗ, đọc hết các nền tảng" },
    ],
    note: "Số liệu minh hoạ. Kết quả thực tế tuỳ sản phẩm, nội dung và mức chi của từng doanh nghiệp.",
  },

  team: {
    eyebrow: "Đội AI làm gì cho bạn",
    title: "Có MCP là có một đội chạy quảng cáo",
    accent: "làm việc cho bạn",
    lead: "Bạn chỉ việc hỏi và quyết. Đội AI chạy quảng cáo, theo dõi từng đồng, rồi quay lại góp ý cho bạn — như một phòng marketing thu nhỏ.",
    you: "Bạn",
    youSub: "Chủ spa, nhà hàng, cửa hàng",
    ask: "Bạn hỏi, giao việc",
    report: "Báo cáo, góp ý lại",
    center: "Đội quảng cáo AI của bạn",
    spokes: [
      { title: "Chạy quảng cáo", desc: "Lên, bật, tắt khi bạn đồng ý", tags: ["Facebook", "TikTok", "Google"] },
      { title: "Giữ tiền", desc: "Mỗi khách tốn bao nhiêu, chỗ nào đang phí", tags: [] },
      { title: "Đọc bình luận", desc: "Khách hỏi gì, chê gì dưới bài", tags: ["Fanpage"] },
      { title: "Góp ý video", desc: "Video nào ra khách, quay dọc hay ngang", tags: ["Reels", "Bài viết"] },
      { title: "Soi đối thủ", desc: "Họ quảng cáo gì, bán giá nào", tags: ["Shopee", "TikTok Shop", "Google Maps"] },
      { title: "Báo cáo mỗi sáng", desc: "Gửi về điện thoại theo lịch bạn cài", tags: ["Telegram"] },
    ],
  },

  weekly: {
    eyebrow: "Mỗi tuần",
    title: "Mỗi tuần, bạn nhìn thấy",
    accent: "những điều này",
    lead: "Không cần biết thuật ngữ quảng cáo. Đội AI nói bằng ngôn ngữ của người bán hàng: khách, tiền, video.",
    formats: {
      title: "Quay kiểu nào, đăng dạng nào trên Facebook thì ra khách",
      sub: "Số khách nhắn tin trong 7 ngày",
      brand: "KAT Skin",
      sponsored: "Được tài trợ",
      send: "Gửi tin nhắn",
      actions: ["Thích", "Bình luận", "Chia sẻ"],
      reels: { n: "42 khách", badge: "Hiệu quả nhất", tag: "Reels", caption: "KAT mang về từ Hàn cho các bác đây…", label: "Reels dọc, chị chủ tự nói" },
      carousel: { n: "13 khách", badge: "Giữ lại", caption: "KAT ký hợp tác cùng đối tác Hàn Quốc", cards: ["Đối tác Hàn Quốc", "Phòng VIP"], label: "Ảnh nhiều tấm, mỗi tấm một ý" },
      landscape: { n: "6 khách", badge: "Nên dừng", caption: "Chuyến công tác Hàn Quốc của đội KAT", likes: "24 lượt thích", comments: "2 bình luận", label: "Video ngang dài hơn 2 phút" },
      suggestLabel: "Đội AI gợi ý cách quay tiếp theo:",
      suggestions: ["Quay dọc bằng điện thoại", "Người thật nói trước máy", "Dưới 20 giây", "3 giây đầu là kết quả"],
    },
    videos: {
      title: "Video nào mang khách về",
      unit: "khách",
      items: [
        { n: 42, name: "Chủ tư vấn" },
        { n: 27, name: "Vlog đi Hàn" },
        { n: 15, name: "Ký hợp tác" },
        { n: 3, name: "Giới thiệu spa" },
      ],
      top: "Hiệu quả nhất",
      stop: "Nên dừng",
      note: "Số khách nhắn tin từ mỗi video. Đội gợi ý dừng video cuối, làm thêm video giống video đầu.",
    },
    money: {
      title: "Tiền quảng cáo đi đâu",
      spentLabel: "Tuần này bỏ ra",
      spent: "4,8 triệu",
      good: "3,9 tr",
      waste: "0,9 tr",
      goodLegend: "mang về 156 khách",
      wasteLegend: "chưa ra khách",
      tip: "Đội gợi ý: tắt 2 quảng cáo chưa ra khách, dồn tiền sang video đang thắng.",
    },
    report: {
      title: "Sáng nào cũng có báo cáo trên điện thoại",
      sub: "Qua Telegram, đọc trong một phút trước giờ mở cửa.",
      header: "Đội quảng cáo AI · 7:30",
      messages: [
        { text: "Hôm qua: **18 khách** nhắn tin", hint: false },
        { text: "Video “Chủ tư vấn” vẫn số 1", hint: false },
        { text: "**Gợi ý hôm nay:** quay thêm 1 video trước – sau", hint: true },
      ],
      footnote: "Báo cáo gửi theo yêu cầu hoặc theo lịch bạn cài.",
    },
    note: "Hình và số liệu minh hoạ.",
  },

  personas: {
    eyebrow: "Dành cho ai",
    title: "Dù bạn đang chạy",
    accent: "quảng cáo kiểu nào",
    items: [
      { title: "Bạn tự chạy", body: "Có người chỉ bài nào ra khách, bài nào nên tắt. Không cần học công cụ quảng cáo của Facebook hay TikTok." },
      { title: "Bạn có nhân viên chạy", body: "Nhân viên làm nhanh hơn. Bạn tự xem số mà không phải đợi ai báo, và biết ai đã bật, tắt cái gì." },
      { title: "Bạn thuê agency", body: "Tự kiểm tra agency có làm hiệu quả không. Có số thật trong tay khi bàn chuyện tiền hay đổi đối tác." },
    ],
  },

  mcp: {
    eyebrow: "Hiểu trong 30 giây",
    title: "MCP là gì?",
    accent: "Hiểu trong 30 giây.",
    lead: "Không có MCP, AI chỉ biết những gì bạn dán vào khung chat. Có MCP, AI được cấp quyền đọc và thao tác trên **đúng những tài khoản bạn cho phép** — như giao chìa khoá một phòng, không phải cả căn nhà.",
    aside: "MCP (Model Context Protocol) là chuẩn kết nối mở mà Claude, ChatGPT và Gemini đều đã hỗ trợ. Ads MCP Simple là một kết nối như thế, làm riêng cho quảng cáo và nghiên cứu thị trường.",
    aiLabel: "AI bạn đang dùng",
    ais: ["Claude", "ChatGPT", "Gemini", "Claude Code", "Gemini CLI"],
    link: "Một link MCP",
    linkSub: "Chạy trên VPS của bạn · token mã hoá AES-256 · phân quyền từng người",
    groups: [
      { label: "Quảng cáo", items: ["Meta Ads", "TikTok Ads", "Google Ads", "OpenAI Ads"] },
      { label: "Thị trường qua Apify", items: ["Shopee", "TikTok Shop", "Lazada", "FB Ads Library", "Google Maps", "YouTube"] },
      { label: "Thông báo", items: ["Telegram"] },
    ],
    cmpHead: ["AI thường", "AI có Ads MCP"],
    rows: [
      { label: "Xem báo cáo", plain: "Tự xuất Excel từ Ads Manager rồi dán vào chat", mcp: "AI tự lấy số mới nhất, theo đúng câu bạn hỏi" },
      { label: "Nhiều tài khoản", plain: "Mở từng tab, cộng tay từng con số", mcp: "Một câu hỏi, AI đọc hết các tài khoản và Fanpage được cấp" },
      { label: "Soi đối thủ", plain: "Tự lướt Ads Library, Shopee, đọc từng đánh giá", mcp: "AI quét giá, đánh giá, quảng cáo đối thủ và tóm lại điểm khách chưa hài lòng" },
      { label: "Bật, tắt, chỉnh", plain: "Tự vào Ads Manager bấm", mcp: "AI đề xuất và làm, bạn chỉ bấm xác nhận" },
    ],
  },

  usage: {
    eyebrow: "Cách dùng",
    title: "Dùng thế nào?",
    accent: "Hỏi như hỏi nhân viên.",
    lead: "Không cần biết code, không cần nhớ lệnh. Đây là những câu khách hàng của Nextgency đang hỏi mỗi ngày.",
    items: [
      { who: "Chủ spa", q: "Bài nào tuần này ra khách đặt lịch nhiều nhất? Bài nào nên tắt?", a: "AI xếp hạng bài theo chi phí mỗi tin nhắn, chỉ ra bài đang đốt tiền và lý do." },
      { who: "Chủ nhà hàng", q: "Mấy quán lẩu quanh quận 3 đang chạy quảng cáo gì, khách chê gì?", a: "AI quét Facebook Ads Library và Google Maps, tóm tắt ưu đãi đối thủ và đánh giá xấu để bạn làm khác." },
      { who: "Shop bán hàng online", q: "Đánh giá 1 sao của áo polo cùng giá trên Shopee nói gì?", a: "AI đọc hàng trăm đánh giá, gom thành nỗi đau khách hàng và gợi ý góc nội dung mới." },
      { who: "Agency, đội marketing", q: "Tài khoản khách nào có CPM tăng bất thường từ đầu tuần?", a: "AI kiểm tra nhiều tài khoản cùng lúc. Nhân viên được giao việc mà không cần cầm token gốc." },
    ],
  },

  paths: {
    eyebrow: "Hai cách bắt đầu",
    title: "Tự làm,",
    accent: "hoặc để Nextgency làm cùng.",
    lead: "Chủ doanh nghiệp thường hỏi hai câu: tôi có tự chạy được không, và có ra đơn không. Vì vậy có hai cách bắt đầu.",
    mcp: {
      name: "Ads MCP",
      tag: "Bạn tự hỏi, tự quyết",
      body: "Phần mềm kết nối AI với tài khoản quảng cáo, cài trên VPS của bạn. Hợp với người đã chạy quảng cáo hoặc có nhân viên marketing.",
      priceSuffix: "trả một lần",
      cta: "Mua Ads MCP",
    },
    ai: {
      name: "Ads AI",
      tag: "Nextgency vận hành giúp",
      body: "Không có thời gian? Đội Nextgency dùng chính MCP này để chạy quảng cáo, làm hình, viết content và gửi báo cáo cho bạn mỗi tuần. Bạn vẫn xem được mọi con số.",
      priceSuffix: "/ tháng",
      priceOnRequest: "Báo giá theo nhu cầu",
      ctaZalo: "Nhắn Zalo tư vấn",
      ctaFanpage: "Nhắn tin tư vấn",
    },
  },

  features: {
    eyebrow: "Tính năng",
    title: "Trong Ads MCP Simple",
    accent: "có gì",
    lead: "AI chỉ làm việc trong phạm vi tài khoản và quyền bạn cho phép. Bạn luôn nắm quyền quyết định.",
    items: [
      { title: "Một link cho mọi nền tảng", body: "Meta, TikTok, Google, OpenAI Ads và Apify trong cùng một kết nối. Nhiều tài khoản quảng cáo, nhiều Fanpage, thao tác bằng tiếng Việt." },
      { title: "Giao việc mà không lộ token", body: "Phân quyền Admin và Nhân viên, xác thực 2 lớp, token mã hoá AES-256-GCM, nhật ký ghi lại từng lệnh AI đã chạy." },
      { title: "Hàng rào an toàn cho ngân sách", body: "Xác nhận 2 bước, trần ngân sách, trần giá thầu và giới hạn thao tác (ở chế độ Tùy chỉnh nâng cao)." },
      { title: "Nghiên cứu thị trường qua Apify", body: "Tìm sản phẩm, so giá, đọc đánh giá trên Shopee, TikTok Shop, Lazada. Có thể tạo MCP chỉ dùng Apify. Trần mặc định 1 USD mỗi lần chạy." },
      { title: "Báo qua Telegram", body: "Nhận tin khi quảng cáo thay đổi, nhận báo cáo khi cần hoặc theo lịch bạn cài." },
      { title: "Tự host, tự lo an toàn", body: "Dữ liệu nằm trên VPS của bạn. Cập nhật ngay trong web, sao lưu tự động hằng ngày, tự quay về bản cũ khi lỗi." },
    ],
    worksWith: "Hoạt động với **Claude, ChatGPT, Claude Code, Gemini CLI, Gemini Enterprise** · Gemini web cá nhân chưa được hỗ trợ trong hướng dẫn hiện tại",
  },

  skill: {
    eyebrow: "Chỉ có khi mua Ads MCP Simple",
    title: "Skill phân tích Meta Ads",
    accent: "cho thị trường Việt Nam",
    body: "Do noti.vn phát triển, làm cho tài khoản chốt đơn qua inbox, Zalo, điện thoại — kiểu bán hàng mà công cụ nước ngoài hay đọc sai vì ROAS trên tài khoản thường không đáng tin.",
    note: "Chạy với dữ liệu từ MCP hoặc file Excel, CSV xuất từ Ads Manager. Có thể kết hợp với Skill riêng của doanh nghiệp để đưa tiêu chí sản phẩm, biên lợi nhuận vào quy trình phân tích.",
    cardTitle: "Skill giúp AI làm gì?",
    cardSub: "Chẩn đoán kỹ trước khi đề xuất hành động",
    steps: [
      "Kiểm tra dữ liệu chuyển đổi có đáng tin không",
      "Tìm nguyên nhân gốc ở cấp chiến dịch, nhóm quảng cáo, quảng cáo",
      "Xử lý Breakdown Effect và chi phí biên",
      "Đề xuất scale, dừng hay thử nghiệm — dưới dạng giả thuyết kiểm chứng được",
    ],
  },

  setup: {
    eyebrow: "Cài đặt & hỗ trợ",
    title: "Cài xong trong một buổi,",
    accent: "có Nextgency đồng hành",
    lead: `Có script cài nhanh và video hướng dẫn (mở sau khi kích hoạt). Nextgency hỗ trợ trong giờ làm việc: ${LEGAL.workHours}.`,
    steps: [
      { title: "Chuẩn bị", body: "VPS Ubuntu 24.04 hoặc Debian 12, một tên miền con, tài khoản GitHub. Chưa có thì Nextgency hướng dẫn." },
      { title: "Chạy script", body: "Làm theo video: dán lệnh, điền thông tin. Nextgency làm cùng bạn." },
      { title: "Kết nối", body: "Tài khoản quảng cáo, AI bạn dùng, Telegram và token Apify nếu cần." },
      { title: "Bắt đầu hỏi", body: "Nextgency hướng dẫn cách hỏi và giao việc cho AI." },
    ],
    support: {
      badge: "Gói của Nextgency",
      title: "Không rành kỹ thuật? Nextgency làm phần kỹ thuật cùng bạn",
      body: "Bạn không phải tự mày mò từng bước. Đội ngũ Nextgency đồng hành để đội quảng cáo AI chạy được trên hạ tầng của chính bạn.",
      items: [
        "Hỗ trợ cài đặt lên máy chủ (VPS) và cấu hình tên miền",
        "Hỗ trợ kết nối tài khoản Facebook, TikTok, Google, OpenAI Ads",
        "Hỗ trợ kết nối Claude / ChatGPT / Gemini và Telegram",
        "Hướng dẫn cách hỏi và giao việc cho AI hiệu quả",
      ],
    },
  },

  fit: {
    eyebrow: "Dành cho ai",
    title: "Hợp với bạn nếu…",
    yes: [
      "Bạn chạy quảng cáo trên nhiều tài khoản, nhiều nền tảng",
      "Bạn chốt đơn qua inbox, Zalo, điện thoại và muốn AI đọc đúng hiệu quả",
      "Đội marketing 2–20 người cần phân quyền, trần ngân sách, nhật ký",
      "Bạn cần nghiên cứu sản phẩm, đối thủ, giá trước khi ra nội dung",
    ],
    noTitle: "Chưa hợp nếu",
    no: [
      "Bạn muốn AI tự chạy theo lịch mà không cấu hình gì",
      "Bạn cần đăng hoặc sửa bài Fanpage (phần Fanpage chỉ đọc)",
      "Bạn không muốn tự đọc tài liệu — khi đó hãy xem gói Ads AI",
    ],
    limitsTitle: "Phạm vi và giới hạn cần biết trước khi mua",
    limits: [
      "Lịch chạy do ứng dụng AI hoặc công cụ tự động hóa thực hiện; cần cấu hình lịch, quyền và nội dung công việc phù hợp.",
      "TikTok GMV Max: hỗ trợ xem và phân tích; mặc định chỉ xem. Thay đổi cần quản trị viên cấp quyền riêng và luôn xác nhận 2 bước. Chiến dịch GMV Max tạo mới hoặc sao chép chạy ngay, không tạo ở trạng thái tạm dừng.",
      "Với các loại quảng cáo hỗ trợ tạo mới thông thường, bản tạo mới được đặt ở trạng thái tạm dừng. Khả năng xem, sửa, tạo và sao chép phụ thuộc nền tảng; chẳng hạn chiến dịch Google Ads Video chỉ hỗ trợ xem qua API trong phạm vi tài liệu hiện tại.",
      "Không đăng hay sửa bài Fanpage qua kết nối Meta, không quản lý thanh toán quảng cáo.",
      "Apify không lấy được dữ liệu cần đăng nhập như nhóm kín, tài khoản riêng tư hay tin nhắn. Dữ liệu thị trường là dữ liệu bên thứ ba, cần kiểm tra trước khi ra quyết định. Chi phí Apify tính riêng trên tài khoản Apify của bạn.",
      "Gemini web cá nhân chưa được hỗ trợ trong hướng dẫn hiện tại.",
    ],
  },

  pricing: {
    eyebrow: "Bắt đầu ngay",
    title: "Gói Trọn bộ",
    accent: "kèm hỗ trợ cài đặt",
    lead: "Một lần thanh toán, không phí hằng tháng cho phần mềm. Cập nhật miễn phí trọn đời.",
    label: "Trọn bộ",
    included: "Đã gồm hỗ trợ cài đặt",
    buy: "Mua ngay",
    secure: "Thanh toán QR · xác nhận tự động",
    includes: [
      "Quyền vào repo GitHub riêng: bộ cài Docker Compose, script cài nhanh, hướng dẫn tiếng Việt",
      "Video hướng dẫn cài đặt",
      "Skill độc quyền phân tích Meta Ads Việt Nam",
      "Sao lưu tự động, tự quay về bản cũ khi lỗi",
      "Nextgency hỗ trợ cài VPS, tên miền, kết nối quảng cáo, AI và Telegram",
    ],
    notes: [
      "**Chú ý quan trọng.** VPS, tên miền, tài khoản AI và Apify bạn tự chuẩn bị, chi phí riêng. Hãy đọc kỹ phần “Phạm vi và giới hạn” để biết sản phẩm có phù hợp với bạn không.",
      "**Lưu ý khi mua dự án GitHub.** Dự án GitHub không hoàn tiền sau khi đã vào repo vì bạn đã xem và tải được mã nguồn. Tài khoản GitHub không bắt buộc khi đặt mua. Xem [Chính sách thanh toán & hoàn tiền](/policies/chinh-sach-thanh-toan) và [Điều khoản sử dụng](/terms).",
    ],
  },

  faq: {
    eyebrow: "Hỏi đáp",
    title: "Câu hỏi thường gặp",
    items: [
      { q: "Tôi không rành công nghệ, có dùng được không?", a: "Dùng hằng ngày thì chỉ cần gõ câu hỏi tiếng Việt trong Claude, ChatGPT hoặc Gemini. Phần cài đặt cần VPS và vài bước kỹ thuật — Nextgency hỗ trợ làm cùng. Nếu muốn giao hẳn việc chạy quảng cáo, chọn gói Ads AI." },
      { q: "AI có tự ý tiêu tiền quảng cáo của tôi không?", a: "Ở chế độ Tùy chỉnh nâng cao, bạn đặt xác nhận 2 bước, trần ngân sách, trần giá thầu và giới hạn thao tác. Mọi lệnh AI chạy đều được ghi vào nhật ký. Chế độ Cơ bản không áp dụng các mức trần này; bạn cũng có thể dặn AI chỉ phân tích, chưa thay đổi gì." },
      { q: "Apify dùng để làm gì? Dùng riêng được không?", a: "Apify giúp AI lấy dữ liệu sản phẩm, giá, đánh giá, quảng cáo đối thủ trên Shopee, TikTok Shop, Lazada, Facebook Ads Library, Google Maps, YouTube. Từ bản 1.1.1 có thể tạo MCP chỉ dùng Apify. Chi phí chạy tính trên tài khoản Apify của bạn; một số nguồn như Shopee có thể trả thiếu dữ liệu." },
      { q: "Hỗ trợ những nền tảng nào?", a: "Quảng cáo: Meta, TikTok, Google, OpenAI Ads. AI: Claude, ChatGPT, Gemini (CLI, Enterprise), Claude Code. Thông báo: Telegram. Gemini web cá nhân chưa được hỗ trợ trong hướng dẫn hiện tại." },
      { q: "Tôi cần chuẩn bị gì?", a: "Khi mua chỉ cần họ tên, số điện thoại/Zalo và email. Để chạy được, bạn cần một VPS Ubuntu 24.04 hoặc Debian 12, một tên miền con, tài khoản ứng dụng AI, tài khoản GitHub (chưa có thì Nextgency hướng dẫn tạo) và tài khoản Apify nếu cần nghiên cứu thị trường. Các chi phí này phát sinh riêng." },
      { q: "Thanh toán thế nào, bao lâu được kích hoạt?", a: `Bấm Mua ngay, điền thông tin (username GitHub không bắt buộc), quét QR và giữ nguyên nội dung chuyển khoản. Hệ thống tự xác nhận; nếu bạn đã điền GitHub, lời mời vào repo được gửi ngay, sau đó Nextgency liên hệ qua Zalo để hẹn lịch cài đặt. Mã đơn có hiệu lực ${LEGAL.orderValidDays} ngày.` },
      { q: "Có được hoàn tiền không?", a: "Không. Sau khi được thêm vào repo, bạn đã xem và tải được mã nguồn. Chi tiết trong [Chính sách thanh toán và hoàn tiền](/policies/chinh-sach-thanh-toan)." },
    ],
  },

  guide: {
    eyebrow: "Hướng dẫn",
    title: "Đặt hàng và chuẩn bị",
    accent: "trước khi cài đặt",
    lead: "Chuẩn bị sẵn những thứ dưới đây, buổi cài đặt sẽ nhanh và suôn sẻ hơn. Bạn có thể vừa mua vừa chuẩn bị song song.",
    affiliateBadge: "Liên kết giới thiệu",
    newTab: "(mở trong tab mới)",
    affiliateNote: "Các liên kết có nhãn “Liên kết giới thiệu” là liên kết affiliate: Nextgency có thể nhận hoa hồng khi bạn đăng ký qua đó. Bạn hoàn toàn có thể dùng nhà cung cấp khác đáp ứng yêu cầu kỹ thuật.",
    tabs: [
      {
        id: "order",
        label: "Cách đặt hàng",
        blocks: [
          {
            type: "steps",
            items: [
              "Bấm **Mua ngay**, điền họ tên, số điện thoại/Zalo và email. Ô **tài khoản GitHub** là **không bắt buộc**: nếu đã có, điền username (không phải email) để được mời vào repo ngay; chưa có thì cứ để trống, Nextgency sẽ hỗ trợ.",
              "Tích xác nhận đã đọc Điều khoản sử dụng và Chính sách thanh toán & hoàn tiền, rồi bấm **Tiếp tục thanh toán**.",
              "Quét mã QR bằng app ngân hàng. Số tiền và nội dung chuyển khoản (mã đơn) đã được điền sẵn — **đừng sửa nội dung**.",
              "Hệ thống tự xác nhận khi nhận được tiền và báo **Thanh toán thành công**. Hãy giữ lại mã đơn.",
              `Nhân viên Nextgency sẽ liên hệ bạn qua Zalo (số đã đăng ký) trong giờ làm việc (${LEGAL.workHours}). Nếu bạn đã điền GitHub, lời mời vào repo được gửi tự động — hãy chấp nhận trong email/thông báo GitHub. Cần hỗ trợ thêm? Nhắn [fanpage Nextgency](${SITE.contact.fanpage}).`,
            ],
          },
          { type: "tip", text: `Lỡ đóng cửa sổ thanh toán? Bấm **Mua ngay** lần nữa để mở lại mã QR đang chờ (trong cùng phiên trình duyệt). Mã đơn giữ hiệu lực ${LEGAL.orderValidDays} ngày. Chuyển thiếu, thừa hoặc sai nội dung? Xem [Chính sách thanh toán](/policies/chinh-sach-thanh-toan).` },
        ],
      },
      {
        id: "github",
        label: "Chuẩn bị GitHub",
        blocks: [
          { type: "tip", text: "Bạn **không cần** có sẵn tài khoản GitHub khi đặt hàng. Nếu chưa có hoặc không rành, nhân viên Nextgency sẽ hướng dẫn tạo tài khoản khi liên hệ qua Zalo." },
          {
            type: "steps",
            items: [
              "Tạo tài khoản GitHub (miễn phí) và xác minh email.",
              "Khuyến nghị **tạo tài khoản riêng cho máy chủ** (ví dụ `congty-ads-server`). Token loại classic cần quyền `repo` — quyền này đọc/ghi mọi repo của chính tài khoản đó, nên đừng dùng tài khoản đang chứa dự án quan trọng.",
              "Khai báo đúng tên tài khoản này khi đặt hàng (hoặc báo cho nhân viên khi được liên hệ), rồi chấp nhận lời mời vào repo khi nhận được.",
              "Tạo 1 token (Tokens classic): tích `repo` và `read:packages`, chọn hạn 1 năm, bấm Generate rồi **sao chép ngay** (GitHub chỉ hiện một lần).",
            ],
          },
          { type: "tip", tone: "warn", text: "Cất token trong trình quản lý mật khẩu. Không gửi token cho bất kỳ ai, kể cả khi nhờ hỗ trợ, và không dán vào chat/email." },
          { type: "links", groups: [{ title: "Liên kết hữu ích", list: "github" }] },
        ],
      },
      {
        id: "vps",
        label: "Chuẩn bị VPS",
        blocks: [
          {
            type: "checks",
            items: [
              "Hệ điều hành **Ubuntu 24.04** (khuyến nghị) hoặc Debian 12.",
              "Cấu hình tối thiểu **1 vCPU, 2 GB RAM, 20 GB ổ cứng**. Nên chọn vùng máy chủ gần Việt Nam để truy cập nhanh hơn.",
              "Nhà cung cấp sẽ gửi cho bạn **địa chỉ IP, tên đăng nhập và mật khẩu** (hoặc khóa SSH) của VPS.",
              "Máy của bạn là Windows 10/11 hoặc macOS để kết nối bằng lệnh `ssh root@IP_VPS` (PowerShell / Terminal).",
              "Nếu trỏ tên miền thẳng về IP, cần mở cổng 80 và 443; nếu dùng Cloudflare Tunnel thì không cần mở cổng nào.",
            ],
          },
          { type: "tip", text: "Không gửi mật khẩu root cho người khác qua chat. Khi cần hỗ trợ từ xa, hãy làm theo mục “Hỗ trợ từ xa và an toàn truy cập” trong [Chính sách hỗ trợ](/policies/chinh-sach-ho-tro)." },
          { type: "links", groups: [{ title: "VPS nước ngoài", list: "vpsIntl" }, { title: "VPS trong nước", list: "vpsVn" }] },
        ],
      },
      {
        id: "domain",
        label: "Tên miền",
        blocks: [
          {
            type: "checks",
            items: [
              "Cần **1 tên miền** (ví dụ `congty.vn`). Phần mềm chạy ở tên miền con, ví dụ `mcp.congty.vn`.",
              "Nên đặt tên miền con bắt đầu bằng `mcp.`; tránh bắt đầu bằng `ads.` vì một số trình chặn quảng cáo/diệt virus có thể chặn mất giao diện.",
              "Cách 1: tạo bản ghi **A** trỏ tên miền con về IP VPS (nếu dùng Cloudflare, để đám mây **xám — DNS only**).",
              "Cách 2: dùng **Cloudflare Tunnel** — tên miền phải đang được quản lý trên Cloudflare, không cần mở cổng trên VPS.",
            ],
          },
          { type: "links", groups: [{ title: "Nơi đăng ký tên miền", list: "domain" }] },
        ],
      },
      {
        id: "ai",
        label: "AI & công cụ",
        blocks: [
          {
            type: "checks",
            items: [
              "Chọn ít nhất **1 ứng dụng AI** bạn sẽ dùng: Claude, ChatGPT hoặc Gemini (Gemini CLI/Enterprise; Gemini web cá nhân chưa được hỗ trợ). Kiểm tra gói của bạn có cho phép kết nối MCP/connector tùy chỉnh.",
              "Có quyền quản trị/phân tích phù hợp trên các **tài khoản quảng cáo** cần kết nối (Meta, TikTok, Google, OpenAI Ads).",
              "**Tùy chọn:** tài khoản Apify để nghiên cứu thị trường (chi phí phát sinh riêng trên Apify) và một bot Telegram để nhận thông báo.",
            ],
          },
          { type: "links", groups: [{ title: "Ứng dụng AI", list: "ai" }, { title: "Công cụ bổ sung", list: "tools" }] },
        ],
      },
    ] as GuideTab[],
  },

  final: {
    title: "Đối thủ của bạn sẽ hỏi AI",
    accent: "trước khi chi tiền quảng cáo. Bạn thì sao?",
    sub: `Một lần thanh toán ${price} — có Nextgency đồng hành cài đặt.`,
    buy: "Mua ngay",
    zalo: "Hỏi qua Zalo",
    fanpage: "Nhắn tin fanpage",
  },

  footer: {
    tagline: "Nextgency — giải pháp Digital Marketing, AI và tự động hóa cho doanh nghiệp.",
    contact: "Liên hệ",
    hotline: "Hotline",
    policiesLabel: "Chính sách",
    policies: [
      { href: "/terms", label: "Điều khoản sử dụng" },
      { href: "/privacy", label: "Chính sách quyền riêng tư" },
      { href: "/policies/chinh-sach-thanh-toan", label: "Chính sách thanh toán & hoàn tiền" },
      { href: "/policies/chinh-sach-ho-tro", label: "Chính sách hỗ trợ" },
    ],
    policiesNote: "",
    copyright: "© 2026 Nextgency. Ads MCP Simple là phần mềm do Noti (noti.vn) phát triển.",
    trademark: "Meta, TikTok, Google, OpenAI, Claude, ChatGPT, Gemini, Apify, Telegram là thương hiệu của các chủ sở hữu tương ứng; trang này không phải trang chính thức của các bên đó.",
  },
};

export type LandingDict = typeof vi;
