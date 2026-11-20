import { NextResponse } from "next/server";
import { githubConfigured, lookupGithubUser } from "@/lib/github";
import { rateLimit } from "@/lib/store";

const noStore = { "Cache-Control": "no-store" };

/** Kiểm tra tên tài khoản GitHub để hiển thị avatar cho khách xác nhận trước khi đặt hàng. */
export async function GET(request: Request) {
  // Không cấu hình GitHub → bỏ qua bước xác nhận (không chặn bán hàng).
  if (!githubConfigured) return NextResponse.json({ status: "skipped" }, { headers: noStore });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!(await rateLimit(`ghcheck:${ip}`, 30, 600))) {
    return NextResponse.json({ status: "unavailable" }, { status: 429, headers: noStore });
  }

  const u = new URL(request.url).searchParams.get("u")?.trim() ?? "";
  const result = await lookupGithubUser(u);
  return NextResponse.json(result, { headers: noStore });
}
