import type { Metadata } from "next";
import { ContactList, LegalPage, Note, Sec, Ul, legalMeta } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/site";

export const metadata: Metadata = legalMeta(
  "Điều khoản sử dụng",
  "Điều khoản sử dụng khi mua và sử dụng Ads MCP Simple kèm hỗ trợ setup do Nextgency cung cấp.",
);

export default function TermsPage() {
  return (
    <LegalPage title="Điều khoản sử dụng" current="/terms">
      <Sec n={1} title="Phạm vi và chấp thuận điều khoản">
        <p>
          Điều khoản này điều chỉnh việc truy cập website, đặt mua, thanh toán, nhận quyền truy cập và sử dụng phần mềm Ads MCP Simple, repo GitHub, script cài đặt, video hướng dẫn, AI Skill, tài liệu và dịch vụ hỗ trợ setup do {LEGAL.operator} cung cấp (gọi chung là “Sản phẩm” hoặc “Dịch vụ”).
        </p>
        <p>Khi đặt hàng, thanh toán hoặc tiếp tục sử dụng Dịch vụ, bạn xác nhận rằng:</p>
        <Ul>
          <li>Bạn đã đọc, hiểu và đồng ý với Điều khoản sử dụng, Chính sách quyền riêng tư, Chính sách thanh toán &amp; hoàn tiền, Chính sách hỗ trợ và thông tin trên trang giới thiệu Sản phẩm.</li>
          <li>Bạn từ đủ 18 tuổi và có đầy đủ năng lực hành vi dân sự; nếu chưa đủ 18 tuổi, việc sử dụng phải có sự đồng ý và giám sát của cha, mẹ hoặc người giám hộ hợp pháp.</li>
          <li>Thông tin bạn cung cấp là chính xác, đầy đủ, hợp pháp và bạn có quyền sử dụng thông tin đó.</li>
        </Ul>
        <p>Nếu không đồng ý, bạn không được đặt hàng, thanh toán hoặc sử dụng Sản phẩm.</p>
      </Sec>

      <Sec n={2} title="Chủ thể vận hành">
        <Ul>
          <li>Đơn vị vận hành: <b>{LEGAL.operator}</b></li>
          {LEGAL.address && <li>Địa chỉ: {LEGAL.address}</li>}
          {LEGAL.taxId && <li>Mã số thuế: {LEGAL.taxId}</li>}
        </Ul>
        <ContactList />
        <p>Trong bộ chính sách này, “chúng tôi” hoặc “{LEGAL.operator}” được hiểu là đơn vị vận hành nêu trên.</p>
      </Sec>

      <Sec n={3} title="Sản phẩm và dịch vụ">
        <p>Gói mua bao gồm, theo mô tả tại trang giới thiệu Sản phẩm vào thời điểm bạn đặt hàng:</p>
        <Ul>
          <li>Quyền truy cập (chỉ đọc) vào repo GitHub riêng chứa bộ cài Docker Compose, script cài nhanh và hướng dẫn self-host của Ads MCP Simple — phần mềm do Noti (noti.vn) phát triển;</li>
          <li>Video hướng dẫn cài đặt và AI Skill phân tích quảng cáo Meta cho thị trường Việt Nam;</li>
          <li>Hỗ trợ setup từ xa theo <a className="text-iris underline underline-offset-4" href="/policies/chinh-sach-ho-tro">Chính sách hỗ trợ</a>.</li>
        </Ul>
        <p>Ads MCP Simple là phần mềm <b>tự host</b>: bạn tự chuẩn bị VPS, tên miền, tài khoản AI, tài khoản Apify (nếu dùng) và chịu các chi phí dịch vụ bên ngoài phát sinh riêng.</p>
      </Sec>

      <Sec n={4} title="Đặt hàng, tài khoản GitHub và thông tin cung cấp">
        <Ul>
          <li>Bạn phải cung cấp đúng họ tên, số điện thoại (Zalo) và email của mình khi đặt hàng. Tên tài khoản GitHub là không bắt buộc khi đặt hàng; nếu bạn khai báo hoặc cung cấp cho chúng tôi khi được liên hệ hỗ trợ, quyền truy cập repo được cấp cho đúng tài khoản đó. Cung cấp sai thông tin có thể làm chậm hoặc không thể cấp quyền.</li>
          <li>Bạn phải chấp nhận lời mời vào repo trên GitHub để nhận quyền truy cập.</li>
          <li>Bạn tự chịu trách nhiệm bảo mật tài khoản GitHub, token truy cập (Personal Access Token), VPS, tài khoản quảng cáo và mọi thông tin đăng nhập của mình. Không gửi mật khẩu, mã OTP hoặc token đầy đủ qua chat/email.</li>
          <li>Khuyến nghị dùng một tài khoản GitHub riêng cho máy chủ để hạn chế rủi ro cho các kho khác của bạn.</li>
        </Ul>
      </Sec>

      <Sec n={5} title="Giấy phép sử dụng">
        <p>
          Khi thanh toán hợp lệ và được xác nhận, bạn nhận một giấy phép có giới hạn, không độc quyền, không chuyển nhượng và có thể bị thu hồi nếu vi phạm, để sử dụng Sản phẩm cho công việc của chính bạn hoặc doanh nghiệp của bạn, trong phạm vi mô tả tại trang Sản phẩm.
        </p>
        <p>
          Bạn không mua quyền sở hữu trí tuệ đối với Sản phẩm. Các cụm từ như “sở hữu”, “trọn đời”, “cập nhật miễn phí” trên giao diện được hiểu là quyền sử dụng theo phạm vi giấy phép này, áp dụng với các bản cập nhật được phát hành cho Sản phẩm trong vòng đời hợp lý của Sản phẩm và các nền tảng liên quan, và luôn phụ thuộc vào việc bạn tuân thủ các chính sách này.
        </p>
      </Sec>

      <Sec n={6} title="Quyền sở hữu trí tuệ và hành vi bị cấm">
        <p>Mã nguồn, script, tài liệu, video, AI Skill, prompt, hình ảnh, thiết kế, nhãn hiệu và nội dung của Sản phẩm được bảo vệ theo pháp luật sở hữu trí tuệ. Nghiêm cấm, nếu chưa có chấp thuận trước bằng văn bản:</p>
        <Ul>
          <li>Chia sẻ, phát tán, đăng lại, bán lại, cho thuê, cấp lại quyền hoặc cung cấp repo, script, Skill, video, tài liệu cho bất kỳ bên thứ ba nào; chia sẻ token hoặc tài khoản GitHub đã được cấp quyền.</li>
          <li>Sao chép, trích xuất, dịch, sửa đổi hoặc tạo sản phẩm phái sinh để bán hoặc cung cấp như một dịch vụ cho người khác ngoài phạm vi giấy phép.</li>
          <li>Dùng nội dung Sản phẩm làm dữ liệu huấn luyện, kho tri thức hoặc sản phẩm cạnh tranh.</li>
          <li>Gỡ hoặc làm sai lệch thông tin bản quyền, cơ chế kiểm soát truy cập hoặc dấu hiệu nhận diện.</li>
          <li>Dò quét, khai thác lỗ hổng, can thiệp trái phép vào hệ thống, giả mạo thanh toán hoặc truy cập trái phép dữ liệu.</li>
          <li>Dùng Sản phẩm để thực hiện hành vi trái pháp luật hoặc vi phạm chính sách của Meta, TikTok, Google, OpenAI hay nền tảng khác.</li>
        </Ul>
      </Sec>

      <Sec n={7} title="Xử lý vi phạm">
        <p>Khi có dấu hiệu hợp lý về chia sẻ trái phép, gian lận, can thiệp hệ thống hoặc vi phạm chính sách, chúng tôi có quyền áp dụng một hoặc nhiều biện pháp:</p>
        <Ul>
          <li>Tạm khóa để xác minh hoặc giới hạn quyền truy cập;</li>
          <li>Thu hồi quyền truy cập repo GitHub, quyền sử dụng Skill, quyền hỗ trợ và các quyền lợi liên quan;</li>
          <li>Lưu bằng chứng, yêu cầu chấm dứt vi phạm, bồi thường thiệt hại và chuyển thông tin cho cơ quan có thẩm quyền khi cần thiết.</li>
        </Ul>
        <p>Trong phạm vi pháp luật cho phép, quyền truy cập bị thu hồi do lỗi vi phạm của bạn sẽ không được khôi phục, chuyển cho người khác hoặc hoàn tiền.</p>
      </Sec>

      <Sec n={8} title="Nền tảng bên thứ ba, quảng cáo và dữ liệu">
        <Ul>
          <li>Ads MCP Simple kết nối với dịch vụ của bên thứ ba (Meta, TikTok, Google, OpenAI, Anthropic, Apify, Telegram, nhà cung cấp VPS, tên miền…). Các bên này có thể thay đổi API, giá, giao diện, chính sách hoặc ngừng dịch vụ; điều đó không mặc nhiên là lỗi của chúng tôi và không làm phát sinh quyền hoàn tiền.</li>
          <li>Chi phí của bên thứ ba (VPS, tên miền, AI, Apify, ngân sách quảng cáo…) do bạn tự chi trả và nằm ngoài giá mua Sản phẩm.</li>
          <li>Khi AI thao tác trên tài khoản quảng cáo, các thao tác diễn ra theo quyền và giới hạn bạn cấu hình. Bạn chịu trách nhiệm thiết lập quyền, trần ngân sách và kiểm tra các thay đổi; chúng tôi không chịu trách nhiệm về chi phí quảng cáo phát sinh hay thiệt hại do thao tác của AI hoặc của người dùng được bạn phân quyền.</li>
          <li>Dữ liệu thị trường thu thập qua Apify là dữ liệu công khai của bên thứ ba, có thể thiếu, sai lệch hoặc thay đổi; bạn cần kiểm tra trước khi ra quyết định và chỉ thu thập dữ liệu hợp pháp theo điều khoản của nền tảng nguồn.</li>
        </Ul>
      </Sec>

      <Sec n={9} title="Thông tin Sản phẩm và thay đổi Dịch vụ">
        <p>Bạn phải đọc kỹ mô tả, đối tượng phù hợp, yêu cầu kỹ thuật, giá, phạm vi hỗ trợ, phần “Phạm vi và giới hạn cần biết” và các lưu ý quan trọng trên trang Sản phẩm trước khi mua.</p>
        <p>Chúng tôi có thể cập nhật nội dung, tài liệu, giao diện, yêu cầu kỹ thuật hoặc cách cung cấp để duy trì chất lượng và an toàn. Thay đổi không làm mất bản chất cốt lõi của Sản phẩm đã mua, trừ trường hợp bất khả kháng, yêu cầu của pháp luật, an ninh hệ thống hoặc dịch vụ bên thứ ba ngừng hoạt động.</p>
      </Sec>

      <Sec n={10} title="Miễn trừ về kết quả">
        <p>Sản phẩm, AI Skill, prompt, tài liệu và câu trả lời của AI chỉ phục vụ mục đích hỗ trợ công việc và tham khảo. Kết quả phụ thuộc vào dữ liệu, tài khoản, ngân sách, sản phẩm, thị trường và điều kiện riêng của từng người.</p>
        <p>Chúng tôi không cam kết doanh thu, lợi nhuận, hiệu quả quảng cáo, thứ hạng hay kết quả kinh doanh cụ thể. Đề xuất của AI không thay thế quyết định của bạn.</p>
      </Sec>

      <Sec n={11} title="Giới hạn trách nhiệm">
        <p>Trong phạm vi tối đa pháp luật cho phép, chúng tôi không chịu trách nhiệm đối với thiệt hại gián tiếp, mất lợi nhuận, mất dữ liệu, gián đoạn do VPS/thiết bị/mạng của người dùng, thay đổi API hoặc chính sách của bên thứ ba, sử dụng sai hướng dẫn hoặc hành vi trái phép của người dùng. Bạn nên sao lưu VPS và dữ liệu của mình định kỳ.</p>
        <p>Không nội dung nào trong Điều khoản này loại trừ nghĩa vụ hoặc trách nhiệm mà pháp luật không cho phép loại trừ.</p>
      </Sec>

      <Sec n={12} title="Khách hàng doanh nghiệp">
        <p>Kênh đặt hàng trên website phục vụ việc mua và thanh toán nhanh qua chuyển khoản. Nếu bạn cần hợp đồng, hóa đơn theo thông tin pháp nhân, mua cho nhiều đơn vị hoặc điều khoản riêng, vui lòng liên hệ chúng tôi <b>trước khi thanh toán</b> để được tư vấn và ký kết theo quy trình riêng. Việc thay đổi chủ thể mua hàng hoặc xuất hóa đơn hồi tố sau khi đã thanh toán có thể bị từ chối.</p>
      </Sec>

      <Sec n={13} title="Luật áp dụng và giải quyết tranh chấp">
        <p>Điều khoản được điều chỉnh bởi pháp luật Việt Nam. Tranh chấp trước hết được giải quyết bằng thương lượng thiện chí. Nếu không đạt thỏa thuận, các bên có quyền yêu cầu cơ quan có thẩm quyền tại Việt Nam giải quyết theo quy định pháp luật.</p>
      </Sec>

      <Sec n={14} title="Thay đổi điều khoản">
        <p>Chúng tôi có thể cập nhật Điều khoản để phản ánh thay đổi pháp luật, công nghệ hoặc Dịch vụ. Phiên bản mới được công bố trên website kèm ngày hiệu lực. Thay đổi ảnh hưởng đáng kể đến quyền lợi hiện có sẽ được thông báo bằng phương thức phù hợp trước khi áp dụng, trừ trường hợp cần áp dụng ngay vì pháp luật hoặc an toàn hệ thống.</p>
        <Note>Mọi thắc mắc về Điều khoản, vui lòng liên hệ chúng tôi qua các kênh ở mục 2 trước khi đặt hàng.</Note>
      </Sec>
    </LegalPage>
  );
}
