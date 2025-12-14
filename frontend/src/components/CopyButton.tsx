import { useState } from "react";

type Props = {
  value: string;
  ariaLabel?: string;
  className?: string;
};

export default function CopyButton({
  value,
  ariaLabel = "Copy",
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    } finally {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 900);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={ariaLabel}
      className={[
        "shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2",
        "text-[11px] font-medium text-slate-700 shadow-sm",
        "hover:bg-slate-50 active:bg-slate-100 transition",
        "cursor-pointer",
        className,
      ].join(" ")}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}