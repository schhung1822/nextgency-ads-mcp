import type { Metadata } from "next";
import { ContactList, LegalPage, Note, Sec, Ul, legalMeta } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/site";

export const metadata: Metadata = legalMeta(
  "Chính sách hỗ trợ",
  "Thời hạn, phạm vi và cách yêu cầu hỗ trợ setup Ads MCP Simple từ Nextgency.",
);

export default function SupportPolicyPage() {
  const months = String(LEGAL.supportMonths).padStart(2, "0");
  return (
    <LegalPage title="Chính sách hỗ trợ" current="/policies/chinh-sach-ho-tro">
      <Sec n={1} title="Thời hạn hỗ trợ">
        <p>
          Hỗ trợ setup và hỗ trợ kỹ thuật liên quan đến Sản phẩm được cung cấp trong <b>{months} tháng</b> kể từ thời điểm đơn hàng được xác nhận thanh toán thành công lần đầu.
        </p>
        <p>
          Việc mua để đó, chưa cài đặt, tạm ngừng, bận công việc hoặc bị tạm khóa do lỗi của bạn không làm dừng, gia hạn hoặc tính lại thời hạn hỗ trợ. Sau {months} tháng, bạn vẫn tiếp tục dùng Sản phẩm và nhận các bản cập nhật theo giấy phép, nhưng chúng tôi không còn nghĩa vụ hỗ trợ setup, cấu hình, kết nối hoặc giải đáp phát sinh, trừ khi hai bên thỏa thuận gói hỗ trợ riêng.
        </p>
      </Sec>

      <Sec n={2} title="Kênh hỗ trợ và thời gian phản hồi">
        <ContactList />
        <p>
          Chúng tôi chỉ tiếp nhận yêu cầu từ số điện thoại/email của chủ đơn hoặc người được ủy quyền hợp lệ. Thời gian phản hồi ban đầu dự kiến không quá <b>{LEGAL.firstResponse}</b>; thời gian xử lý hoàn tất phụ thuộc mức độ phức tạp và sự phối hợp của bạn.
        </p>
      </Sec>

      <Sec n={3} title="Phạm vi hỗ trợ trong thời hạn">
        <Ul>
          <li>Cấp quyền repo GitHub và đối soát trạng thái đơn hàng đã thanh toán.</li>
          <li>Hướng dẫn và hỗ trợ cài đặt Ads MCP Simple lên VPS của bạn bằng script cài nhanh, cấu hình tên miền con.</li>
          <li>Hướng dẫn kết nối tài khoản quảng cáo (Meta, TikTok, Google, OpenAI Ads), kết nối Claude/ChatGPT/Gemini, Telegram và Apify theo tài liệu của Sản phẩm.</li>
          <li>Xác định và xử lý lỗi thuộc phần mềm Ads MCP Simple hoặc tài liệu/Skill đi kèm.</li>
          <li>Giải đáp, làm rõ nội dung hướng dẫn trong phạm vi Sản phẩm.</li>
        </Ul>
        <Note>Hỗ trợ là hướng dẫn và xử lý lỗi thuộc phạm vi cam kết; không bao gồm việc vận hành thay, chạy quảng cáo thay, tư vấn chiến lược hay đảm bảo kết quả kinh doanh.</Note>
      </Sec>

      <Sec n={4} title="Thông tin cần cung cấp khi yêu cầu hỗ trợ">
        <Ul>
          <li>Họ tên, email/số điện thoại đã dùng khi đặt hàng, mã đơn.</li>
          <li>Mô tả mục tiêu, các bước bạn đã làm, kết quả mong đợi và kết quả thực tế.</li>
          <li>Ảnh/video lỗi rõ ràng, thông báo lỗi, thời điểm phát sinh; hệ điều hành VPS và cách bạn trỏ tên miền (trỏ IP hay Cloudflare Tunnel).</li>
        </Ul>
        <p><b>Không gửi mật khẩu, mã OTP, khóa riêng tư (private key) hoặc token đầy đủ</b> qua chat/email. Chúng tôi có thể từ chối hoặc tạm dừng xử lý nếu thông tin thiếu, không trung thực, không thể tái hiện lỗi hoặc bạn không phối hợp.</p>
      </Sec>

      <Sec n={5} title="Hỗ trợ từ xa và an toàn truy cập">
        <Ul>
          <li>Chúng tôi chỉ truy cập từ xa (chia sẻ màn hình, truy cập VPS…) khi bạn đồng ý và theo đúng phạm vi bạn cho phép.</li>
          <li>Nên cấp quyền tạm thời hoặc tài khoản riêng cho buổi hỗ trợ; sau khi xong, bạn nên đổi mật khẩu, thu hồi khóa SSH/token đã cấp.</li>
          <li>Chúng tôi không lưu giữ thông tin đăng nhập của bạn cho mục đích khác ngoài buổi hỗ trợ.</li>
          <li>Bạn nên tạo bản sao lưu/snapshot VPS trước khi hỗ trợ; chúng tôi không chịu trách nhiệm khôi phục dữ liệu mà bạn không sao lưu.</li>
        </Ul>
      </Sec>

      <Sec n={6} title="Ngoài phạm vi hỗ trợ">
        <p>Trừ khi có thỏa thuận riêng, chúng tôi không hỗ trợ miễn phí:</p>
        <Ul>
          <li>Vận hành, chạy quảng cáo, xây dựng chiến lược, viết nội dung hoặc quản trị tài khoản quảng cáo thay bạn.</li>
          <li>Sửa lỗi hạ tầng riêng của bạn: VPS, nhà cung cấp hosting, tên miền, mạng, thiết bị, tường lửa hoặc tài khoản bên thứ ba.</li>
          <li>Lỗi do tự ý chỉnh sửa mã nguồn/cấu hình, dùng phiên bản không tương thích, dùng công cụ crack hoặc vi phạm chính sách của nền tảng bên thứ ba.</li>
          <li>Tài khoản quảng cáo/AI/Apify bị nền tảng khóa, hạn chế, hết hạn mức hoặc thay đổi điều kiện.</li>
          <li>Khôi phục dữ liệu mà bạn không sao lưu; tư vấn kinh doanh, pháp lý, thuế hoặc cam kết kết quả.</li>
          <li>Yêu cầu phát sinh sau thời hạn hỗ trợ, hoặc dự án chưa được thanh toán/xác nhận.</li>
        </Ul>
        <p>Yêu cầu ngoài phạm vi có thể được nhận theo dịch vụ trả phí và báo giá riêng; chúng tôi có quyền nhận hoặc từ chối tùy năng lực.</p>
      </Sec>

      <Sec n={7} title="Phụ thuộc bên thứ ba">
        <p>Chúng tôi hỗ trợ xác định nguyên nhân trong phạm vi hướng dẫn của Sản phẩm nhưng không chịu trách nhiệm sửa lỗi hoặc duy trì dịch vụ thuộc Meta, TikTok, Google, OpenAI, Anthropic, Apify, Telegram, GitHub, Cloudflare, nhà cung cấp VPS/tên miền, ngân hàng hay nhà cung cấp khác. Việc nhà cung cấp thay đổi API, giá, giao diện, chính sách hoặc ngừng dịch vụ không làm phát sinh quyền hoàn tiền.</p>
      </Sec>

      <Sec n={8} title="Tạm dừng/chấm dứt hỗ trợ">
        <p>Chúng tôi có quyền từ chối, tạm dừng hoặc chấm dứt hỗ trợ nếu bạn:</p>
        <Ul>
          <li>Gian lận, cung cấp thông tin sai, xúc phạm hoặc quấy rối nhân sự hỗ trợ;</li>
          <li>Chia sẻ trái phép repo, Skill, tài liệu hoặc can thiệp hệ thống;</li>
          <li>Yêu cầu thực hiện hành vi trái pháp luật, trái chính sách nền tảng hoặc xâm phạm quyền bên thứ ba;</li>
          <li>Liên tục gửi yêu cầu trùng lặp qua nhiều kênh, không làm theo các bước chẩn đoán hợp lý hoặc che giấu thông tin quan trọng.</li>
        </Ul>
        <p>Việc chấm dứt hỗ trợ do vi phạm không làm phát sinh quyền hoàn tiền.</p>
      </Sec>

      <Sec n={9} title="Khiếu nại">
        <p>Khiếu nại gửi bằng văn bản (email) tới chúng tôi, nêu rõ họ tên, mã đơn, sự việc, chứng cứ và phương án mong muốn. Chúng tôi sẽ xác nhận tiếp nhận và phản hồi hướng xử lý trong thời hạn hợp lý theo tính chất vụ việc.</p>
        <ContactList />
      </Sec>
    </LegalPage>
  );
}
