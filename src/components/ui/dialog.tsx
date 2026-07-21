"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  children: React.ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onClose,
  labelledBy,
  children,
  className,
}: DialogProps) {
  const [closing, setClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  if (open !== prevOpen) {
    setPrevOpen(open);
    setClosing(!open);
  }

  const mounted = open || closing;

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        aria-hidden
        className="absolute inset-0 bg-dark/80"
        style={{
          animation: closing
            ? "overlayOut 0.2s ease-in both"
            : "overlayIn 0.2s ease-out both",
        }}
      />
      <div
        role="presentation"
        onClick={onClose}
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
          onAnimationEnd={() => {
            if (closing) setClosing(false);
          }}
          className={cn("outline-none", className)}
          style={{
            animation: closing
              ? "slideDown 0.2s ease-in both"
              : "slideUp 0.2s ease-out both",
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
