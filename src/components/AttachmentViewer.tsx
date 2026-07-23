"use client";

import { useState } from "react";

const OFFICE_EXTENSIONS = ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "xlsm"];

function getExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() || "";
}

export default function AttachmentViewer({
  attachment,
}: {
  attachment: { name: string; url: string };
}) {
  const [open, setOpen] = useState(false);
  const ext = getExtension(attachment.name);
  const isPdf = ext === "pdf";
  const isOffice = OFFICE_EXTENSIONS.includes(ext);
  const canPreview = isPdf || isOffice;

  const handleToggle = () => setOpen((v) => !v);

  const embedSrc = isPdf
    ? attachment.url
    : isOffice && typeof window !== "undefined"
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          `${window.location.origin}${attachment.url}`
        )}`
      : "";

  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="flex items-center gap-3 p-4">
        <span className="text-xl">📄</span>
        <span className="truncate text-sm">{attachment.name}</span>
        <div className="ml-auto flex shrink-0 items-center gap-4">
          {canPreview && (
            <button
              type="button"
              onClick={handleToggle}
              className="cursor-pointer text-xs text-[var(--accent-2)] hover:underline"
            >
              {open ? "Masquer l'aperçu" : "Voir l'aperçu"}
            </button>
          )}
          <a
            href={attachment.url}
            download
            className="text-xs text-[var(--accent-2)] hover:underline"
          >
            Télécharger
          </a>
        </div>
      </div>
      {open && canPreview && embedSrc && (
        <iframe
          src={embedSrc}
          className="h-[500px] w-full border-t border-[var(--glass-border)]"
          title={attachment.name}
        />
      )}
    </div>
  );
}
