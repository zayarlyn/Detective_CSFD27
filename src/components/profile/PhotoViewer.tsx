"use client";

import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function CornerBrackets({ inset, thickness }: { inset: number; thickness: number }) {
  const base = "absolute border-accent";
  const size = thickness * 6;
  return (
    <>
      <div
        className={cn(base, "border-t border-l")}
        style={{ top: inset, left: inset, width: size, height: size, borderWidth: thickness }}
      />
      <div
        className={cn(base, "border-t border-r")}
        style={{ top: inset, right: inset, width: size, height: size, borderWidth: thickness }}
      />
      <div
        className={cn(base, "border-b border-l")}
        style={{ bottom: inset, left: inset, width: size, height: size, borderWidth: thickness }}
      />
      <div
        className={cn(base, "border-b border-r")}
        style={{ bottom: inset, right: inset, width: size, height: size, borderWidth: thickness }}
      />
    </>
  );
}

export function PhotoViewer({
  open,
  onClose,
  profileUrl,
  alias,
  hasPhoto,
  studentId,
}: {
  open: boolean;
  onClose: () => void;
  profileUrl: string;
  alias: string;
  hasPhoto: boolean;
  studentId: string;
}) {
  const labelId = `photo-viewer-alias-${studentId}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy={labelId}
      className="relative w-[min(90vw,440px)] bg-background border-[3px] border-accent p-5 pt-7 shadow-2xl"
    >
      <div className="absolute -top-2.5 left-5 -rotate-6 bg-accent text-background px-2 py-0.5 text-[8px] tracking-[2px] font-mono">
        EXHIBIT A
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute -top-2.5 -right-2.5 w-6.5 h-6.5 flex items-center justify-center border border-dark/25 bg-background text-muted cursor-pointer transition-colors hover:bg-dark/5"
      >
        <CloseIcon />
      </button>

      <div className="relative aspect-square w-full">
        <div
          className="absolute inset-0 bg-background border-2 border-accent"
          style={{
            backgroundImage: `url("${profileUrl}")`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <CornerBrackets inset={6} thickness={2} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span id={labelId} className="font-display text-[13px] text-foreground truncate">
          {alias}
        </span>
        <span
          className={cn(
            "text-[9px] tracking-[2px] font-mono whitespace-nowrap",
            hasPhoto ? "text-success" : "text-danger",
          )}
        >
          {hasPhoto ? "VERIFIED" : "UNVERIFIED"}
        </span>
      </div>
    </Dialog>
  );
}
