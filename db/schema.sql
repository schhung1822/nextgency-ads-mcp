-- ============================================================================
-- Schema cho landing page Ads MCP Simple — MySQL 8 / MariaDB 10.6+ (đã test cả hai)
--
-- CÁCH NHẬP:
--  • phpMyAdmin / Adminer: chọn DB (vd "nextgency") -> tab Import -> chọn file này
--    (bộ ký tự: utf-8) -> Go.
--  • Dòng lệnh:  mysql -u USER -p nextgency < db/schema.sql
--  • Hoặc:       npm run db:migrate   (đọc DATABASE_URL trong .env)
-- File chạy lại nhiều lần vẫn an toàn (CREATE TABLE IF NOT EXISTS).
--
-- Chưa có DB thì tạo trước (chạy bằng tài khoản root):
--   CREATE DATABASE nextgency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Tất cả DATETIME lưu theo UTC.
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  code               VARCHAR(20)  NOT NULL,
  status             ENUM('pending','underpaid','paid','cancelled') NOT NULL DEFAULT 'pending'
                     COMMENT 'pending=chờ thanh toán, underpaid=chuyển thiếu, paid=thành công, cancelled=đã hủy',

  -- thông tin khách
  name               VARCHAR(120) NOT NULL,
  phone              VARCHAR(20)  NOT NULL,
  email              VARCHAR(160) NOT NULL,
  github             VARCHAR(60)  NOT NULL,
  note               TEXT         NULL,

  -- chỉ dùng cho đăng ký tư vấn ở trang /ads-mcp (plan "ads-mcp"); NULL ở đơn trang chủ
  business           VARCHAR(40)  NULL COMMENT 'Lĩnh vực kinh doanh (slug, xem lib/order-schema.ts)',
  ads_runner         VARCHAR(40)  NULL COMMENT 'Hiện quảng cáo đang do ai chạy (slug)',
  ad_budget          VARCHAR(40)  NULL COMMENT 'Mức chi quảng cáo mỗi tháng (slug)',

  -- tiền (theo đơn vị nhỏ nhất của `currency`: VND = đồng, USD = cent, vd 7900 = $79.00)
  currency           CHAR(3)      NOT NULL DEFAULT 'VND' COMMENT 'VND = trang tiếng Việt (SePay), USD = trang /global (PayPal)',
  amount             INT UNSIGNED NOT NULL COMMENT 'Số tiền cần thanh toán (đơn vị nhỏ nhất của currency)',
  paid_amount        INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số tiền đã nhận (cộng dồn)',
  paid_at            DATETIME     NULL,
  paid_via           ENUM('sepay','manual','paypal') NULL COMMENT 'sepay=tự động, paypal=PayPal, manual=admin xác nhận tay',
  transaction_id     VARCHAR(64)  NULL COMMENT 'Mã giao dịch SePay / mã capture PayPal gần nhất',
  consent_at         DATETIME     NULL,

  -- chỉ dùng cho đơn quốc tế (PayPal)
  country            CHAR(5)      NULL COMMENT 'Mã quốc gia khách chọn (ISO 2 ký tự hoặc OTHER)',
  marketing_opt_in   TINYINT(1)   NOT NULL DEFAULT 0 COMMENT 'Khách đồng ý nhận email giới thiệu',
  track_consent      TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '0 = khách chưa đồng ý cookie đo lường: không báo Meta Conversions API',
  paypal_order_id    VARCHAR(40)  NULL,
  paypal_capture_id  VARCHAR(40)  NULL,
  payer_email        VARCHAR(160) NULL COMMENT 'Email tài khoản PayPal của người trả tiền',

  -- các bước sau thanh toán (hệ thống tự cập nhật)
  fulfill_state      ENUM('pending','processing','done') NOT NULL DEFAULT 'pending'
                     COMMENT 'Đã chạy các bước hậu thanh toán chưa (mời GitHub, Lark, webhook)',
  fulfill_started_at DATETIME     NULL,
  invite_status      ENUM('invited','already','error','skipped') NULL,
  invite_message     VARCHAR(300) NULL,
  invite_at          DATETIME     NULL,
  lark_notified_at   DATETIME     NULL,
  hook_paid_ok       TINYINT(1)   NULL,
  hook_paid_at       DATETIME     NULL,
  hook_paid_attempts TINYINT UNSIGNED NULL,
  hook_paid_error    VARCHAR(200) NULL,

  admin_note         VARCHAR(255) NULL,
  created_at         DATETIME     NOT NULL,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (code),
  KEY idx_status_created (status, created_at),
  KEY idx_fulfill (status, fulfill_state),
  KEY idx_email (email),
  KEY idx_paypal_order (paypal_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sổ giao dịch ngân hàng nhận từ SePay (kể cả giao dịch không khớp đơn). Khoá chính = id giao dịch SePay
-- để mỗi giao dịch chỉ được xử lý một lần dù SePay gọi lại webhook.
CREATE TABLE IF NOT EXISTS sepay_transactions (
  id             VARCHAR(64)  NOT NULL,
  order_code     VARCHAR(20)  NULL,
  amount         BIGINT       NOT NULL,
  gateway        VARCHAR(60)  NULL,
  reference_code VARCHAR(100) NULL,
  content        VARCHAR(500) NULL,
  tx_time        VARCHAR(30)  NULL COMMENT 'Thời gian giao dịch do SePay gửi (giờ VN, dạng chuỗi)',
  raw            JSON         NULL,
  created_at     DATETIME     NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order (order_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sổ giao dịch PayPal (mỗi lần capture thành công = một dòng). Khoá chính = mã capture của PayPal để mỗi giao dịch
-- chỉ được xử lý một lần dù khách bấm lại hay PayPal gửi webhook nhiều lần.
CREATE TABLE IF NOT EXISTS paypal_transactions (
  capture_id       VARCHAR(40)  NOT NULL,
  order_code       VARCHAR(20)  NOT NULL,
  paypal_order_id  VARCHAR(40)  NULL,
  amount           BIGINT       NOT NULL COMMENT 'Đơn vị nhỏ nhất (cent)',
  currency         CHAR(3)      NOT NULL,
  status           VARCHAR(24)  NOT NULL,
  payer_email      VARCHAR(160) NULL,
  tx_time          VARCHAR(40)  NULL COMMENT 'Thời gian PayPal ghi nhận (ISO 8601)',
  raw              JSON         NULL,
  created_at       DATETIME     NOT NULL,
  PRIMARY KEY (capture_id),
  KEY idx_order (order_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ngữ cảnh trình duyệt lúc khách tạo đơn, dùng để báo sự kiện Purchase về Meta (Conversions API)
-- khi khách đã đóng trang. Chỉ được ghi khi đã cấu hình META_CAPI_ACCESS_TOKEN.
CREATE TABLE IF NOT EXISTS order_tracking (
  order_code VARCHAR(20)  NOT NULL,
  fbp        VARCHAR(120) NULL COMMENT 'Cookie _fbp của Meta Pixel',
  fbc        VARCHAR(320) NULL COMMENT 'Cookie _fbc / fbclid của Meta',
  client_ip  VARCHAR(64)  NULL,
  user_agent VARCHAR(400) NULL,
  created_at DATETIME     NOT NULL,
  PRIMARY KEY (order_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Giới hạn tần suất (chống spam tạo đơn)
CREATE TABLE IF NOT EXISTS rate_limits (
  k   VARCHAR(120) NOT NULL,
  w   BIGINT       NOT NULL,
  c   INT UNSIGNED NOT NULL DEFAULT 1,
  ts  INT UNSIGNED NOT NULL,
  PRIMARY KEY (k, w),
  KEY idx_ts (ts)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
