import "server-only";

/**
 * Tự động mời khách vào repo GitHub (quyền đọc) sau khi thanh toán.
 *
 *  GITHUB_REPO   = "ten-org/ten-repo"   (repo của tổ chức — repo cá nhân không có quyền chỉ-đọc)
 *  GITHUB_TOKEN  = fine-grained token (hoặc token của GitHub App) với quyền
 *                  Repository permissions → Administration: Read and write, trên đúng repo trên.
 *                  Nên tạo bằng tài khoản bot riêng.
 */

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO;
const API = process.env.GITHUB_API_URL ?? "https://api.github.com"; // chỉ đổi khi test với GitHub giả lập

export const githubConfigured = Boolean(TOKEN && REPO && /^[\w.-]+\/[\w.-]+$/.test(REPO));

export const GITHUB_USERNAME_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

export type InviteStatus = "invited" | "already" | "error" | "skipped";
export type InviteResult = { status: InviteStatus; message?: string; at: string };

function headers(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "nextgency-landing",
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
}

export type GithubUser =
  | { status: "ok"; login: string; name: string | null; avatar: string }
  | { status: "not_found" }
  | { status: "unavailable" };

/** Kiểm tra tài khoản GitHub có tồn tại (để khách xác nhận đúng người trước khi trả tiền). */
export async function lookupGithubUser(username: string): Promise<GithubUser> {
  if (!GITHUB_USERNAME_RE.test(username)) return { status: "not_found" };
  try {
    const res = await fetch(`${API}/users/${encodeURIComponent(username)}`, {
      headers: headers(),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 404) return { status: "not_found" };
    if (!res.ok) return { status: "unavailable" };
    const u = (await res.json()) as { login: string; name?: string | null; avatar_url: string; type?: string };
    if (u.type && u.type !== "User") return { status: "not_found" }; // tổ chức / bot
    return { status: "ok", login: u.login, name: u.name ?? null, avatar: u.avatar_url };
  } catch {
    return { status: "unavailable" };
  }
}

/** Mời `username` vào repo với quyền đọc (pull). Không bao giờ throw — luôn trả kết quả để ghi vào Lark. */
export async function inviteToRepo(username: string): Promise<InviteResult> {
  const at = new Date().toISOString();
  if (!githubConfigured) {
    return { status: "skipped", message: "Chưa cấu hình GITHUB_TOKEN / GITHUB_REPO", at };
  }
  if (!GITHUB_USERNAME_RE.test(username)) {
    return { status: "error", message: `Tên GitHub không hợp lệ: ${username}`, at };
  }
  try {
    const res = await fetch(
      `${API}/repos/${REPO}/collaborators/${encodeURIComponent(username)}`,
      {
        method: "PUT",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({ permission: "pull" }),
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      },
    );
    if (res.status === 201) return { status: "invited", at };
    if (res.status === 204) return { status: "already", at };

    let detail = "";
    try {
      const body = (await res.json()) as { message?: string; errors?: { message?: string }[] };
      detail = [body.message, ...(body.errors?.map((e) => e.message) ?? [])].filter(Boolean).join(" — ");
    } catch {
      /* không có body */
    }
    const hint =
      res.status === 404
        ? "Không thấy tài khoản hoặc repo (kiểm tra tên GitHub, GITHUB_REPO và quyền của token)"
        : res.status === 403 || res.status === 401
          ? "Token thiếu quyền Administration trên repo"
          : "";
    return { status: "error", message: `GitHub ${res.status}: ${hint || detail || "lỗi không rõ"}`.slice(0, 300), at };
  } catch (e) {
    return { status: "error", message: `Không gọi được GitHub: ${e instanceof Error ? e.message : String(e)}`, at };
  }
}
