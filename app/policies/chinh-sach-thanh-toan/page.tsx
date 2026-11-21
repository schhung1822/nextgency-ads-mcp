import type { Metadata } from "next";
import { ContactList, LegalPage, Note, Sec, Ul, legalMeta } from "@/components/legal/legal-page";
import { LEGAL, SITE, formatVnd } from "@/lib/site";

export const metadata: Metadata = legalMeta(
  "Chính sách thanh toán & hoàn tiền",
  "Quy định về thanh toán chuyển khoản/VietQR, xác nhận đơn, xử lý sai sót và chính sách không hoàn tiền với dự án GitHub của Nextgency.",
);

export default function PaymentPolicyPage() {
  return (
    <LegalPage title="Chính sách thanh toán & hoàn tiền" current="/policies/chinh-sach-thanh-toan">
      <Sec n={1} title="Nguyên tắc chung">
        <p>
          Ads MCP Simple là sản phẩm số (dự án GitHub kèm tài liệu, Skill và dịch vụ hỗ trợ), được cấp quyền truy cập sau khi thanh toán. Giá niêm yết hiện tại là <b>{formatVnd(SITE.price)}</b> cho trọn bộ gồm hỗ trợ setup; giá có thể thay đổi theo từng thời điểm và được hệ thống tính lại khi bạn tạo đơn.
        </p>
        <p>
          Bạn phải đọc kỹ mô tả, đối tượng phù hợp, yêu cầu kỹ thuật, phạm vi hỗ trợ và phần “Phạm vi và giới hạn cần biết” trước khi đặt mua. Việc thanh toán đồng nghĩa với việc bạn xác nhận đã đọc kỹ nội dung, tự đánh giá Sản phẩm phù hợp với nhu cầu và chấp nhận chính sách không hoàn tiền dưới đây.
        </p>
      </Sec>

      <Sec n={2} title="Kênh thanh toán tự động">
        <p>Thanh toán trên website là quy trình tự động qua chuyển khoản ngân hàng/VietQR tới đúng tài khoản hiển thị trên cửa sổ thanh toán của đơn hàng. Giao dịch được đối soát qua dịch vụ SePay.</p>
        <p>Bạn phải:</p>
        <Ul>
          <li>Thanh toán đủ 100% tổng tiền của đơn;</li>
          <li>Chuyển đúng số tiền và đúng nội dung chuyển khoản (mã đơn) hiển thị trên cửa sổ thanh toán;</li>
          <li>Kiểm tra đúng tên chủ tài khoản, số tài khoản và ngân hàng trước khi xác nhận chuyển;</li>
          <li>Không sửa nội dung, không gộp nhiều đơn vào một giao dịch và không chuyển tiền tới tài khoản được gửi qua nguồn không chính thức.</li>
        </Ul>
        <p>Chúng tôi không chịu trách nhiệm đối với khoản tiền chuyển tới tài khoản không được chỉ định trên trang thanh toán chính thức, trừ khi lỗi hiển thị do chính hệ thống của chúng tôi.</p>
      </Sec>

      <Sec n={3} title="Tạo đơn, hiệu lực và xác nhận">
        <Ul>
          <li>Mỗi đơn có một mã tham chiếu riêng. Đơn chưa thanh toán được giữ trong tối đa <b>{LEGAL.orderValidDays} ngày</b>; sau thời gian này mã đơn hết hiệu lực và bạn cần tạo đơn mới.</li>
          <li>Khi hệ thống nhận đủ số tiền và nhận diện đúng mã đơn, đơn được xác nhận “Đã thanh toán”, cửa sổ thanh toán báo thành công và chúng tôi nhận thông báo để xử lý.</li>
          <li>Sau khi đơn được xác nhận, nhân viên Nextgency sẽ liên hệ bạn qua Zalo (số điện thoại bạn đã đăng ký) để hỗ trợ setup. Nếu bạn đã khai báo tài khoản GitHub, hệ thống sẽ gửi lời mời vào repo tới tài khoản đó (tự động hoặc do chúng tôi mời thủ công trong giờ làm việc — {LEGAL.workHours}) và bạn cần chấp nhận lời mời trên GitHub (hết hạn sau 7 ngày). Nếu bạn chưa có hoặc chưa khai báo tài khoản GitHub, chúng tôi sẽ hướng dẫn bạn tạo tài khoản và cấp quyền khi liên hệ. Cần hỗ trợ thêm, bạn có thể nhắn tin fanpage Nextgency.</li>
          <li>Thời gian hiển thị chỉ là ước tính; ngân hàng, đơn vị đối soát, mạng hoặc bảo trì có thể gây chậm.</li>
          <li>Quyền truy cập chỉ phát sinh khi đơn đã được xác nhận thanh toán và chúng tôi đã cấp quyền trên GitHub.</li>
        </Ul>
      </Sec>

      <Sec n={4} title="Sai số tiền, sai nội dung và thanh toán muộn">
        <Ul>
          <li><b>Chuyển thiếu:</b> đơn chưa được xác nhận. Bạn có thể chuyển bù phần còn thiếu với cùng nội dung chuyển khoản; hệ thống cộng dồn các khoản cho cùng một mã đơn.</li>
          <li><b>Chuyển thừa, chuyển trùng, sai nội dung hoặc không tìm thấy mã đơn:</b> có thể không được kích hoạt tự động. Hãy liên hệ chúng tôi kèm mã đơn, ảnh/biên lai, số tiền, thời gian và mã giao dịch ngân hàng để được đối soát thủ công.</li>
          <li><b>Đơn hết hạn:</b> không chuyển tiền cho đơn đã hết hiệu lực, đặc biệt khi giá hoặc ưu đãi đã thay đổi. Nếu tiền về sau khi đơn hết hạn, chúng tôi sẽ đối soát thủ công; việc này không đồng nghĩa phải kích hoạt theo giá cũ.</li>
          <li>Với tiền chuyển nhầm, chuyển trùng hoặc thừa, chúng tôi sẽ xác minh và xử lý theo thực tế; người yêu cầu phải chứng minh quyền sở hữu tài khoản chuyển tiền. Đây là xử lý sai sót thanh toán, không phải quyền đổi ý/hoàn trả sản phẩm số.</li>
        </Ul>
      </Sec>

      <Sec n={5} title="Chính sách không hoàn tiền">
        <p>
          Dự án GitHub <b>không hoàn tiền</b> vì sau khi bạn được thêm vào repo, bạn đã xem và có thể sao chép toàn bộ mã nguồn. Theo phạm vi tối đa pháp luật cho phép, khoản thanh toán là cuối cùng và không được hoàn, đổi, trả, quy đổi thành tiền, chuyển sang sản phẩm khác hoặc chuyển sang tài khoản/tài khoản GitHub khác sau khi đơn đã được xác nhận.
        </p>
        <p>Không hoàn tiền trong các trường hợp, bao gồm nhưng không giới hạn:</p>
        <Ul>
          <li>Đổi ý, mua nhầm, không còn nhu cầu, không có thời gian cài đặt hoặc không đạt kết quả kinh doanh mong muốn;</li>
          <li>Không đọc kỹ mô tả, yêu cầu kỹ thuật, phạm vi hỗ trợ và giới hạn của Sản phẩm;</li>
          <li>Cung cấp sai thông tin liên hệ hoặc tên tài khoản GitHub; mất quyền kiểm soát email, thiết bị hoặc tài khoản GitHub;</li>
          <li>VPS, tên miền, mạng, tài khoản quảng cáo, tài khoản AI/API bên thứ ba của bạn không đáp ứng yêu cầu hoặc bị nền tảng hạn chế;</li>
          <li>Không cài đặt, không sử dụng, hoặc để quá thời hạn hỗ trợ;</li>
          <li>Nền tảng bên thứ ba thay đổi API, giá, chính sách hoặc ngừng dịch vụ;</li>
          <li>Quyền truy cập bị thu hồi hoặc hỗ trợ bị chấm dứt do bạn vi phạm Điều khoản sử dụng.</li>
        </Ul>
        <Note>
          Quy định này không nhằm loại trừ các quyền bắt buộc không thể từ bỏ theo pháp luật. Nếu chúng tôi vĩnh viễn không thể cung cấp Sản phẩm đã thu tiền, chủ động hủy trước khi giao, hoặc pháp luật/cơ quan có thẩm quyền yêu cầu hoàn trả, việc xử lý sẽ theo nghĩa vụ áp dụng sau khi đối soát.
        </Note>
      </Sec>

      <Sec n={6} title="Hủy đơn chưa thanh toán">
        <p>Bạn có thể đơn giản không thanh toán và bỏ đơn; đơn chưa thanh toán sẽ tự hết hạn. Hủy/bỏ đơn chưa thanh toán không phát sinh hoàn tiền vì hệ thống chưa ghi nhận khoản thanh toán hợp lệ. Đơn đã thanh toán không thể hủy theo cách này.</p>
      </Sec>

      <Sec n={7} title="Hóa đơn và khách hàng doanh nghiệp">
        <p>Nếu cần hóa đơn theo thông tin pháp nhân, hợp đồng hoặc điều khoản riêng, bạn phải liên hệ và thống nhất với chúng tôi <b>trước khi thanh toán</b>. Yêu cầu bổ sung hóa đơn/hợp đồng sau khi đã thanh toán có thể không được đáp ứng.</p>
      </Sec>

      <Sec n={8} title="Gian lận và đối soát">
        <p>Chúng tôi có quyền tạm giữ việc cấp quyền để kiểm tra giao dịch có dấu hiệu giả mạo, trùng lặp, sai số tiền, nguồn tiền bất hợp pháp hoặc vi phạm. Cung cấp chứng từ giả, yêu cầu hoàn tiền gian dối hoặc tranh chấp thanh toán sau khi đã nhận quyền truy cập có thể dẫn đến thu hồi quyền và xử lý theo pháp luật.</p>
      </Sec>

      <Sec n={9} title="Liên hệ thanh toán">
        <p>Yêu cầu đối soát gửi tới các kênh dưới đây, kèm mã đơn và chứng từ giao dịch. Chúng tôi chỉ làm việc với chủ đơn hoặc người được ủy quyền hợp lệ.</p>
        <ContactList />
      </Sec>
    </LegalPage>
  );
}
