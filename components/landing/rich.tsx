import { Fragment } from "react";

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

/** Hiển thị chuỗi nội dung có cú pháp tối giản: **đậm**, `mã`, [chữ](link). */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (!part) return null;
        if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-navy">
              {part.slice(1, -1)}
            </code>
          );
        }
        const link = LINK.exec(part);
        if (link) {
          const external = /^https?:\/\//.test(link[2]);
          return (
            <a
              key={i}
              href={link[2]}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-semibold text-iris underline underline-offset-4 hover:text-violet"
            >
              {link[1]}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
