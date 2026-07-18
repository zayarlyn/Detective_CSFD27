"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function ExpandableDesc({
  first,
  rest,
  color,
}: {
  first: string;
  rest: string;
  color: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="whitespace-pre-wrap text-base text-foreground leading-[1.5] text-center">
        {first}
      </div>

      {rest.trim() && (
        <>
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="whitespace-pre-wrap text-[15px] text-foreground leading-[1.5] text-center pt-2.5">
                {rest}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mx-auto mt-1.5 flex items-center gap-1 bg-transparent border-none cursor-pointer font-mono text-[11px] tracking-[1px]"
            style={{ color }}
          >
            {open ? "Show less" : "Read more"}
            <span
              className={cn(
                "leading-2 block transition-transform duration-200 line-hei",
                !open ? "-mt-1" : null,
              )}
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ⌄
            </span>
          </button>
        </>
      )}
    </div>
  );
}
