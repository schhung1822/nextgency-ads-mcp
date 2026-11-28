import type { Metadata } from "next";
import { ContactList, LegalPage, Sec, Ul, legalMeta } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/site";

export const metadata: Metadata = legalMeta(
  "Chính sách quyền riêng tư",
  "Cách Nextgency thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân khi bạn đặt mua Ads MCP Simple.",
);

export default function PrivacyPage() {
  return (
    <LegalPage title="Chính sách quyền riêng tư" current="/privacy">
      <Sec n={1} title="Phạm vi">
        <p>
          Chính sách này mô tả cách {LEGAL.operator} thu thập, sử dụng, lưu trữ, chia sẻ và bảo vệ dữ liệu cá nhân khi bạn truy cập website, đặt mua, thanh toán, nhận quyền truy cập Ads MCP Simple hoặc yêu cầu hỗ trợ setup.
        </p>
      </Sec>

      <Sec n={2} title="Dữ liệu chúng tôi xử lý">
        <Ul>
          <li><b>Thông tin đặt hàng:</b> họ tên, số điện thoại/Zalo, email, tên tài khoản GitHub (nếu bạn cung cấp) và ghi chú bạn nhập trong biểu mẫu.</li>
          <li><b>Giao dịch:</b> mã đơn, số tiền, trạng thái thanh toán, và dữ liệu giao dịch ngân hàng do SePay gửi về (ngân hàng, mã giao dịch, thời gian, nội dung chuyển khoản).</li>
          <li><b>Kỹ thuật:</b> địa chỉ IP và nhật ký truy cập ở mức máy chủ, dùng để bảo mật và giới hạn tần suất chống spam/lạm dụng.</li>
          <li><b>Hỗ trợ:</b> nội dung, ảnh chụp màn hình, thông báo lỗi và thông tin khác bạn chủ động gửi khi yêu cầu hỗ trợ.</li>
          <li><b>Lưu trên trình duyệt của bạn:</b> mã đơn đang chờ thanh toán được lưu tạm trong sessionStorage để khôi phục cửa sổ thanh toán nếu bạn lỡ đóng; dữ liệu này tự mất khi đóng thẻ trình duyệt.</li>
        </Ul>
        <p><b>Chúng tôi không yêu cầu</b> bạn cung cấp mật khẩu, mã OTP, token tài khoản quảng cáo hay API key khi đặt hàng. Khi hỗ trợ setup, hãy làm theo mục 5 của Chính sách hỗ trợ để chia sẻ quyền truy cập an toàn.</p>
      </Sec>

      <Sec n={3} title="Nguồn thu thập">
        <Ul>
          <li>Trực tiếp từ bạn khi điền biểu mẫu đặt hàng hoặc liên hệ hỗ trợ.</li>
          <li>Tự động từ trình duyệt và máy chủ khi bạn truy cập website.</li>
          <li>Từ ngân hàng/đơn vị đối soát thanh toán (SePay) khi giao dịch của bạn được ghi nhận.</li>
        </Ul>
      </Sec>

      <Sec n={4} title="Mục đích xử lý">
        <Ul>
          <li>Tạo đơn, đối soát thanh toán, xác nhận đơn và cấp quyền truy cập repo GitHub cho đúng tài khoản bạn khai báo.</li>
          <li>Liên hệ để hẹn lịch và thực hiện hỗ trợ setup; gửi thông tin vận hành liên quan tới đơn hàng.</li>
          <li>Phát hiện và ngăn chặn gian lận, spam, lạm dụng; bảo vệ quyền sở hữu trí tuệ của Sản phẩm.</li>
          <li>Thực hiện nghĩa vụ kế toán, thuế, pháp lý và giải quyết khiếu nại, tranh chấp.</li>
        </Ul>
      </Sec>

      <Sec n={5} title="Cookie và công nghệ đo lường">
        <p>Website sử dụng các công cụ đo lường dưới đây để hiểu lượt truy cập và đánh giá hiệu quả quảng cáo:</p>
        <Ul>
          <li><b>Google Tag Manager / Google Analytics:</b> ghi nhận lượt xem trang và các hành động như hoàn tất đăng ký, hoàn tất thanh toán. Các công cụ này có thể đặt cookie (ví dụ _ga) và nhận địa chỉ IP, thông tin trình duyệt/thiết bị của bạn.</li>
          <li><b>Meta Pixel và Meta Conversions API:</b> ghi nhận các hành động trên để đo lường và tối ưu quảng cáo; có thể đặt cookie (_fbp, _fbc). Khi bạn đăng ký hoặc thanh toán, máy chủ của chúng tôi gửi cho Meta email, số điện thoại, họ tên (đã băm một chiều bằng SHA-256), địa chỉ IP, thông tin trình duyệt, mã đơn và giá trị đơn hàng. Chúng tôi không gửi ghi chú, tên tài khoản GitHub hay thông tin ngân hàng của bạn.</li>
        </Ul>
        <p>Bạn có thể từ chối hoặc xóa cookie trong trình duyệt, dùng tiện ích chặn theo dõi, hoặc liên hệ chúng tôi để yêu cầu ngừng dùng dữ liệu của bạn cho mục đích này. Ngoài ra, khi hiển thị mã QR, trình duyệt của bạn tải hình ảnh từ dịch vụ qr.sepay.vn nên địa chỉ IP của bạn được gửi tới bên đó theo chính sách của họ.</p>
      </Sec>

      <Sec n={6} title="Chia sẻ dữ liệu và bên xử lý">
        <p>Chúng tôi không bán dữ liệu cá nhân. Dữ liệu được chia sẻ ở mức cần thiết với:</p>
        <Ul>
          <li><b>SePay và ngân hàng:</b> tạo mã QR, ghi nhận và đối soát thanh toán.</li>
          <li><b>Vercel:</b> hạ tầng lưu trữ và vận hành website.</li>
          <li><b>Upstash:</b> cơ sở dữ liệu lưu thông tin đơn hàng.</li>
          <li><b>Lark:</b> nhận thông báo nội bộ về đăng ký tư vấn và đơn đã thanh toán (gồm thông tin bạn điền trong biểu mẫu) để đội ngũ xử lý.</li>
          <li><b>GitHub:</b> tên tài khoản của bạn được dùng để mời vào repo.</li>
          <li><b>Google và Meta:</b> nhận dữ liệu đo lường nêu tại mục 5.</li>
          <li>Đối tác tư vấn, kiểm toán, pháp lý hoặc cơ quan nhà nước khi có căn cứ hợp pháp.</li>
        </Ul>
        <p>Một số nhà cung cấp có thể xử lý dữ liệu ngoài Việt Nam; khi đó dữ liệu có thể được truyền và xử lý xuyên biên giới theo cơ chế pháp lý áp dụng.</p>
      </Sec>

      <Sec n={7} title="Cơ sở và sự đồng ý xử lý">
        <p>Tùy trường hợp, việc xử lý dựa trên sự đồng ý của bạn (khi bạn tích xác nhận và gửi biểu mẫu đặt hàng), sự cần thiết để thực hiện giao dịch/hợp đồng, nghĩa vụ pháp lý, hoặc lợi ích hợp pháp trong việc bảo mật và chống gian lận. Việc rút lại sự đồng ý không ảnh hưởng tính hợp pháp của hoạt động đã thực hiện trước đó và không áp dụng với dữ liệu phải tiếp tục lưu theo nghĩa vụ pháp lý hoặc để giải quyết tranh chấp.</p>
      </Sec>

      <Sec n={8} title="Thời hạn lưu trữ">
        <Ul>
          <li>Đơn chưa thanh toán: tự động xóa khỏi hệ thống đặt hàng sau {LEGAL.orderValidDays} ngày.</li>
          <li>Đơn đã thanh toán: lưu trong hệ thống đặt hàng khoảng 180 ngày; bản ghi giao dịch/chứng từ phục vụ kế toán, thuế, pháp lý hoặc giải quyết tranh chấp được lưu theo thời hạn luật định hoặc nhu cầu hợp pháp tương ứng.</li>
          <li>Thông báo đơn hàng trong Lark và dữ liệu hỗ trợ: lưu theo nhu cầu vận hành, trong thời gian cần thiết cho mục đích nêu trên.</li>
          <li>Nhật ký máy chủ: theo thời hạn của nhà cung cấp hạ tầng.</li>
        </Ul>
        <p>Thời hạn có thể được điều chỉnh khi cần tuân thủ pháp luật, sao lưu, an ninh hoặc xử lý tranh chấp.</p>
      </Sec>

      <Sec n={9} title="Quyền của bạn">
        <p>Theo quy định áp dụng, bạn có thể yêu cầu:</p>
        <Ul>
          <li>Biết, xem và nhận bản sao dữ liệu cá nhân của mình;</li>
          <li>Sửa dữ liệu không chính xác;</li>
          <li>Rút lại sự đồng ý, hạn chế hoặc phản đối một số hoạt động xử lý;</li>
          <li>Xóa dữ liệu không còn cần thiết;</li>
          <li>Khiếu nại về việc xử lý dữ liệu.</li>
        </Ul>
        <p>Để thực hiện quyền, liên hệ chúng tôi qua các kênh dưới đây. Chúng tôi có thể yêu cầu xác minh danh tính để tránh tiết lộ hoặc xóa dữ liệu trái phép; một số dữ liệu giao dịch có thể phải giữ lại theo yêu cầu của pháp luật.</p>
        <ContactList />
      </Sec>

      <Sec n={10} title="Bảo mật">
        <p>Chúng tôi áp dụng các biện pháp hợp lý như truyền tải mã hóa (HTTPS), xác thực webhook thanh toán, kiểm soát quyền truy cập, giới hạn tần suất và chỉ gửi thông tin đơn hàng tới kênh nội bộ cần thiết. Tuy nhiên, không hệ thống truyền/lưu dữ liệu nào bảo đảm an toàn tuyệt đối. Bạn cần bảo vệ thiết bị, email, tài khoản GitHub và thông tin đăng nhập của mình.</p>
      </Sec>

      <Sec n={11} title="Trẻ em">
        <p>Dịch vụ không chủ đích thu thập dữ liệu của trẻ em chưa đủ tuổi tự mình giao dịch theo pháp luật. Cha, mẹ hoặc người giám hộ phát hiện trẻ cung cấp dữ liệu trái phép có thể liên hệ để được xử lý.</p>
      </Sec>

      <Sec n={12} title="Thay đổi và liên hệ">
        <p>Chính sách có thể được cập nhật và công bố kèm ngày hiệu lực. Mọi yêu cầu về quyền riêng tư gửi tới:</p>
        <ContactList />
      </Sec>
    </LegalPage>
  );
}
