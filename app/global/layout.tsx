import { ConsentBar } from "@/components/global/consent-bar";

/** Layout chung của trang quốc tế (/global) và các trang chính sách tiếng Anh: thêm thanh chọn cookie. */
export default function GlobalLayout({ children }: LayoutProps<"/global">) {
  return (
    <>
      {children}
      <ConsentBar />
    </>
  );
}
