# Landing page bán Ads MCP Simple — Nextgency

Next.js 16 (App Router) + shadcn/ui (base-nova) + Tailwind 4. Thanh toán chuyển khoản qua **SePay**, thông báo đơn về **Lark**, deploy trên **Vercel**.

## Luồng

1. Khách bấm **Mua ngay** → điền họ tên, SĐT, email, tài khoản GitHub → `POST /api/orders`.
2. Server tạo mã đơn (`NGX` + 8 số), lưu đơn (Upstash Redis) và trả về mã QR SePay (số tiền + nội dung đã điền sẵn).
3. Khách chuyển khoản → SePay gọi `POST /api/sepay/webhook` → server đối chiếu mã đơn + số tiền.
4. Đủ tiền → server **tự mời tài khoản GitHub của khách vào repo (quyền Read)**, đơn chuyển `paid`, gửi thẻ **Lark** (có trạng thái mời; lỗi thì thẻ đổi màu cam "CẦN MỜI GITHUB TAY"). Trang của khách tự chuyển sang màn hình onboarding: 3 việc cần chuẩn bị (Accept lời mời, VPS + tên miền, tạo token) rồi mới mở nút đặt lịch setup.
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
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis (Vercel Marketplace tự thêm) |
| `GITHUB_REPO`, `GITHUB_TOKEN` | Tự mời khách vào repo `org/repo` (token fine-grained, quyền Administration: Read and write). Trống = mời tay |
| `NEXT_PUBLIC_BOOKING_URL` | Link đặt lịch setup (Cal.com / Lark Calendar…). Trống = ẩn nút |
| `NEXT_PUBLIC_*` | URL site, Zalo/hotline/email hiển thị |

### SePay
- Tích hợp WebHooks → Thêm webhook: URL `https://<domain>/api/sepay/webhook`, sự kiện **Có tiền vào**, kiểu chứng thực **API Key** = `SEPAY_WEBHOOK_API_KEY`.
- (Khuyến nghị) Cấu hình công ty → Cấu trúc mã thanh toán: tiền tố trùng `SEPAY_CODE_PREFIX`.
- Webhook trả `{"success": true}` (HTTP 200); lỗi tạm thời trả 5xx để SePay gọi lại. Mỗi giao dịch chỉ xử lý một lần.

### Redis là bắt buộc ở production
Thông tin khách (họ tên, SĐT, GitHub…) lưu ở Redis và chỉ gửi về Lark **khi đã thanh toán**. Nếu thiếu `KV_REST_API_*` ở production, `POST /api/orders` trả 503 (từ chối tạo đơn) để không nhận tiền mà mất thông tin khách. Ở `npm run dev` thì dùng bộ nhớ tạm.

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

## Chạy local
```bash
npm install
npm run dev     # http://localhost:3000 — dev dùng bộ nhớ tạm nếu chưa có Redis
```
Thử webhook:
```bash
curl -X POST http://localhost:3000/api/sepay/webhook \
  -H "Authorization: Apikey $SEPAY_WEBHOOK_API_KEY" -H "Content-Type: application/json" \
  -d '{"id":1,"gateway":"MBBank","content":"NGX12345678","transferType":"in","transferAmount":1999000}'
```

## Sau khi khách thanh toán
- Nếu đã cấu hình `GITHUB_*`: khách được mời tự động. Bạn chỉ cần có mặt đúng buổi setup khách đặt trên lịch.
- Thẻ Lark màu **cam** ("CẦN MỜI GITHUB TAY") nghĩa là tự mời lỗi/chưa bật → mời tay tên GitHub trong thẻ (quyền Read).
- Lúc đặt hàng, tên GitHub được kiểm tra và khách xác nhận bằng avatar để tránh mời nhầm người.
- Lời mời GitHub hết hạn sau 7 ngày; nếu khách quên Accept, mời lại bằng cách gọi lại webhook hoặc mời tay.
