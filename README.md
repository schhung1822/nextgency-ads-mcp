# Landing page bán Ads MCP Simple — Nextgency

Next.js 16 (App Router) + shadcn/ui (base-nova) + Tailwind 4. Thanh toán chuyển khoản qua **SePay**, thông báo đơn về **Lark**, deploy trên **Vercel**.

## Luồng

1. Khách bấm **Mua ngay** → điền họ tên, SĐT/Zalo, email (tài khoản GitHub **không bắt buộc** — khách không rành kỹ thuật có thể bỏ trống) → `POST /api/orders`.
2. Server tạo mã đơn (`NGX` + 8 số), lưu đơn vào **MySQL** và trả về mã QR SePay (số tiền + nội dung đã điền sẵn).
3. Khách chuyển khoản → SePay gọi `POST /api/sepay/webhook` → server đối chiếu mã đơn + số tiền.
4. Đủ tiền → server **tự mời tài khoản GitHub của khách vào repo (quyền Read)**, đơn chuyển `paid`, gửi thẻ **Lark** (có trạng thái mời; lỗi thì thẻ đổi màu cam "CẦN MỜI GITHUB TAY"). Trang của khách tự chuyển sang màn hình "Thanh toán thành công": thông báo **nhân viên sẽ liên hệ hỗ trợ qua Zalo** (số khách đã đăng ký), trạng thái lời mời GitHub (nếu khách có điền), và nút nhắn tin **fanpage Nextgency** khi cần hỗ trợ thêm (`NEXT_PUBLIC_CONTACT_FANPAGE`, mặc định https://web.facebook.com/nextgency).
   Khách không điền GitHub → bỏ qua bước mời, thẻ Lark màu cam "LIÊN HỆ KHÁCH QUA ZALO (chưa có GitHub)"; cột `orders.github` lưu chuỗi rỗng, webhook `customer.github` là `""` và `githubInvite` là `skipped`.
5. Thiếu tiền → Lark cảnh báo, khách chuyển bù với cùng nội dung; dư/trùng → Lark cảnh báo để xử lý tay.

Giá lấy từ server ([lib/site.ts](lib/site.ts) → `SITE.price` = 1.999.000₫), client không gửi giá.

## Cấu hình

Sao chép `.env.example` → `.env.local` (local) hoặc nhập vào Vercel → Settings → Environment Variables.

| Biến | Ghi chú |
|---|---|
| `SEPAY_BANK`, `SEPAY_ACCOUNT_NUMBER`, `SEPAY_ACCOUNT_NAME` | Tài khoản nhận tiền (đã liên kết SePay) |
| `SEPAY_WEBHOOK_API_KEY` | Khoá tự đặt, dán cùng giá trị bên SePay |
| `SEPAY_CODE_PREFIX` | Tiền tố mã đơn, mặc định `NGX` |
| `LARK_WEBHOOK_URL` / `LARK_WEBHOOK_SECRET` | Custom Bot của nhóm Lark (secret nếu bật ký) |
| `DATABASE_URL`, `DATABASE_SSL` | MySQL lưu đơn hàng (xem mục **MySQL** bên dưới) |
| `ADMIN_TOKEN`, `CRON_SECRET` | Khoá cho API admin (đổi trạng thái đơn tay) và cron nhặt đơn |
| `GITHUB_REPO`, `GITHUB_TOKEN` | Tự mời khách vào repo `org/repo` (token fine-grained, quyền Administration: Read and write). Trống = mời tay |
| `NEXT_PUBLIC_BOOKING_URL` | Link đặt lịch setup (Cal.com / Lark Calendar…). Trống = ẩn nút |
| `NEXT_PUBLIC_*` | URL site, Zalo/hotline/email hiển thị |

### SePay
- Tích hợp WebHooks → Thêm webhook: URL `https://<domain>/api/sepay/webhook`, sự kiện **Có tiền vào**, kiểu chứng thực **API Key** = `SEPAY_WEBHOOK_API_KEY`.
- (Khuyến nghị) Cấu hình công ty → Cấu trúc mã thanh toán: tiền tố trùng `SEPAY_CODE_PREFIX`.
- Webhook trả `{"success": true}` (HTTP 200); lỗi tạm thời trả 5xx để SePay gọi lại. Mỗi giao dịch chỉ xử lý một lần.

## MySQL (lưu đơn hàng)

Thiếu `DATABASE_URL` thì `POST /api/orders` trả 503 (từ chối tạo đơn) để không nhận tiền mà mất thông tin khách.

### Cài MySQL trên VPS (Ubuntu)
```bash
sudo apt update && sudo apt install -y mysql-server
sudo mysql -e "CREATE DATABASE nextgency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
# Tạo user RIÊNG chỉ có quyền trên DB này, bắt buộc kết nối TLS
sudo mysql -e "CREATE USER 'nextgency_app'@'%' IDENTIFIED BY 'MAT_KHAU_DAI_NGAU_NHIEN' REQUIRE SSL;
               GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,ALTER,INDEX ON nextgency.* TO 'nextgency_app'@'%'; FLUSH PRIVILEGES;"
```
Vercel không có IP cố định, nên VPS phải cho phép kết nối từ Internet tới cổng 3306. Hãy làm đủ các điều sau:
- `bind-address = 0.0.0.0` trong cấu hình MySQL, mở cổng 3306 ở firewall (`ufw allow 3306/tcp`).
- **Bắt buộc TLS** (`REQUIRE SSL` như trên; MySQL 8 tự tạo chứng chỉ, dùng `DATABASE_SSL=true` + `DATABASE_SSL_REJECT_UNAUTHORIZED=false` nếu chứng chỉ tự ký).
- Mật khẩu dài ngẫu nhiên, user chỉ có quyền trên đúng DB `nextgency`, cân nhắc đổi cổng khác 3306 và cài `fail2ban`.
- Nếu dùng Vercel Pro + Static IPs thì chỉ cho phép đúng các IP đó trong firewall.

### Tạo bảng
Điền `DATABASE_URL` vào `.env` rồi chạy: `npm run db:migrate` (đọc [db/schema.sql](db/schema.sql); an toàn khi chạy lại). Hoặc dán file đó vào phpMyAdmin/Adminer.

Ba bảng: `orders` (đơn + trạng thái), `sepay_transactions` (sổ giao dịch ngân hàng, mỗi giao dịch xử lý đúng một lần), `rate_limits`.

### Trạng thái đơn (`orders.status`)
| Giá trị | Ý nghĩa |
|---|---|
| `pending` | Chờ thanh toán |
| `underpaid` | Khách chuyển thiếu (số tiền cộng dồn trong `paid_amount`) |
| `paid` | Thanh toán thành công (`paid_via` = `sepay` tự động / `manual` admin xác nhận) |
| `cancelled` | Đã hủy (tiền vào đơn này sẽ báo Lark để đối soát tay) |

### Xác nhận thanh toán thủ công
Đổi đơn sang `paid` bằng **một trong ba cách** — hệ thống sẽ chạy đủ các bước còn lại như thanh toán thật
(mời GitHub → thẻ Lark → webhook `order.paid`):

1. **Sửa trực tiếp trong DB** (phpMyAdmin/Adminer/TablePlus): `UPDATE orders SET status='paid' WHERE code='NGX12345678';`
   Hệ thống nhặt đơn trong vòng ~1 phút (cron) hoặc ngay khi khách mở lại trang thanh toán.
2. **API admin** (chạy ngay, có ghi chú):
   ```bash
   curl -X POST https://<domain>/api/admin/orders/NGX12345678/status \
     -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
     -d '{"status":"paid","note":"Đã đối soát sao kê"}'
   ```
3. Xem danh sách: `GET /api/admin/orders?status=pending&q=email-hoac-sdt` (cùng header).

Các bước hậu thanh toán an toàn khi chạy lại: mỗi bước có cột đánh dấu (`invite_status`, `lark_notified_at`, `hook_paid_*`, `fulfill_state`) nên không mời/gửi trùng.
`paid_at`, `paid_amount`, `paid_via` được tự điền nếu bạn chỉ đổi mỗi cột `status`.

### Cron nhặt đơn
Gọi `GET /api/cron/fulfill` mỗi phút (cần header `Authorization: Bearer <ADMIN_TOKEN hoặc CRON_SECRET>`). Chọn một:
- **Crontab trên VPS** (miễn phí, khuyến nghị): `* * * * * curl -s -H "Authorization: Bearer ADMIN_TOKEN" https://<domain>/api/cron/fulfill >/dev/null`
- **Vercel Cron** (gói Pro): tạo `vercel.json` `{ "crons": [{ "path": "/api/cron/fulfill", "schedule": "* * * * *" }] }` và đặt `CRON_SECRET`.

## Webhook gửi đi (gửi email cho khách)
Đặt URL trong `.env` để hệ thống bắn dữ liệu sang n8n/Make/Zapier/server riêng của bạn:

| Biến | Khi nào gửi | Event |
|---|---|---|
| `WEBHOOK_ORDER_CREATED_URL` | Khách đăng ký (đã tạo đơn, chưa thanh toán) | `order.created` |
| `WEBHOOK_ORDER_PAID_URL` | Thanh toán thành công (sau khi đã mời GitHub) | `order.paid` |

POST JSON, header: `X-Webhook-Event`, `X-Webhook-Id` (`<mã đơn>:<event>` — dùng chống xử lý trùng), `X-Webhook-Timestamp`, và `X-Webhook-Signature: sha256=<hex>` nếu có `WEBHOOK_SECRET`
(`HMAC_SHA256(secret, timestamp + "." + rawBody)`). Trả 2xx = nhận xong; lỗi thì thử lại 3 lần (0s, 2s, 5s). `order.paid` gửi thất bại hoàn toàn → Lark báo cam để bạn gửi tay.

Ví dụ `order.paid`:
```json
{
  "event": "order.paid",
  "id": "NGX12345678:order.paid",
  "occurredAt": "2026-11-20T03:21:09.000Z",
  "product": { "name": "Ads MCP Simple", "price": 1999000, "currency": "VND" },
  "order": { "code": "NGX12345678", "amount": 1999000, "status": "paid", "createdAt": "…", "paidAt": "…", "paidAmount": 1999000 },
  "customer": { "name": "…", "phone": "…", "email": "…", "github": "…", "note": "…" },
  "links": { "site": "https://…", "guide": "https://…/#huong-dan", "booking": "https://…" },
  "githubInvite": "invited",
  "transaction": { "id": "…", "reference": "…", "gateway": "…", "time": "…", "content": "…" }
}
```
`order.created` có cùng cấu trúc nhưng `status: "pending"`, không có `githubInvite` và `transaction`.

Xác minh chữ ký (Node):
```js
const expected = "sha256=" + crypto.createHmac("sha256", SECRET).update(`${ts}.${rawBody}`).digest("hex");
const ok = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
```

## Đo lường: Google Tag Manager + Meta Pixel / Conversions API

| Biến | Ghi chú |
|---|---|
| `NEXT_PUBLIC_GTM_ID` | Container GTM, mặc định `GTM-55BSJ6HH`. Đặt rỗng = tắt |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID Dataset/Pixel của Meta. Trống = tắt Pixel + Conversions API |
| `META_CAPI_ACCESS_TOKEN` | Token Conversions API (bí mật, chỉ phía server). Trống = chỉ chạy Pixel trình duyệt |
| `META_CAPI_TEST_EVENT_CODE` | (tuỳ chọn) mã tab *Test events* của Events Manager; chạy thật thì để trống |

`NEXT_PUBLIC_*` được nhúng lúc build — thêm/đổi xong phải **deploy lại** trên Vercel.
Bảng `order_tracking` (trong `db/schema.sql`) lưu `_fbp`, `_fbc`, IP, user-agent lúc tạo đơn; chạy `npm run db:migrate` để tạo (chưa chạy thì vẫn gửi được sự kiện, chỉ thiếu các trường này).

**Hai sự kiện** (gửi cả từ trình duyệt lẫn máy chủ với cùng `event_id` nên Meta tự gộp, không đếm đôi; máy chủ đảm bảo vẫn có sự kiện khi khách đóng trang sau khi chuyển khoản):

| Thời điểm | dataLayer (GTM / GA4) | Meta | `event_id` |
|---|---|---|---|
| Hoàn tất đăng ký — đơn vừa được tạo, chờ thanh toán | `complete_registration` | `CompleteRegistration` | `reg_<mã đơn>` |
| Hoàn tất thanh toán — nhận đủ tiền | `purchase` (chuẩn GA4 ecommerce: `transaction_id`, `value`, `currency`, `items`) | `Purchase` (`value`, `currency` VND) | `purchase_<mã đơn>` |

Trong GTM: tạo trigger kiểu *Custom Event* với tên `complete_registration` và `purchase`, gắn vào tag *GA4 Event* (hoặc tag Google Ads…). Nếu đã đặt `NEXT_PUBLIC_META_PIXEL_ID` thì **đừng** thêm tag Meta Pixel trong GTM (đã được cài trực tiếp trong code).
Email, SĐT, họ tên gửi cho Meta qua Conversions API đều được băm SHA-256. Nội dung chi tiết đã được ghi trong trang Quyền riêng tư.

## Chạy local
```bash
npm install
npm run db:migrate   # lần đầu: tạo bảng MySQL (cần DATABASE_URL trong .env)
npm run dev          # http://localhost:3000
```
Thử webhook:
```bash
curl -X POST http://localhost:3000/api/sepay/webhook \
  -H "Authorization: Apikey $SEPAY_WEBHOOK_API_KEY" -H "Content-Type: application/json" \
  -d '{"id":1,"gateway":"MBBank","content":"NGX12345678","transferType":"in","transferAmount":1999000}'
```

## Sau khi khách thanh toán
- Màn hình của khách báo "sẽ có người liên hệ qua Zalo" → **hãy chủ động nhắn/gọi Zalo cho khách** theo SĐT trong thẻ Lark để hẹn buổi setup.
- Nếu đã cấu hình `GITHUB_*` và khách có điền GitHub: khách được mời tự động.
- Khách không điền GitHub: thẻ Lark nhắc hướng dẫn khách tạo tài khoản rồi mời tay vào repo (quyền Read).
- Thẻ Lark màu **cam** ("CẦN MỜI GITHUB TAY") nghĩa là tự mời lỗi/chưa bật → mời tay tên GitHub trong thẻ (quyền Read).
- Lúc đặt hàng, tên GitHub được kiểm tra và khách xác nhận bằng avatar để tránh mời nhầm người.
- Lời mời GitHub hết hạn sau 7 ngày; nếu khách quên Accept, mời lại bằng cách gọi lại webhook hoặc mời tay.
