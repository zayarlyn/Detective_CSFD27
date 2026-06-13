"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HintCard } from "@/components/hints/hint-card";
import { HOUSES } from "@/lib/constants/houses";
import type { House } from "@/lib/constants/houses";

interface Hint {
  id: string;
  content: string;
  targetHouse: House;
  usedAt: string | null;
}

interface HintManagerProps {
  hints: Hint[];
  onAdd?: (content: string, targetHouse: House) => void;
  className?: string;
}

export function HintManager({ hints, onAdd, className }: HintManagerProps) {
  const [content, setContent] = useState("");
  const [targetHouse, setTargetHouse] = useState<House>("noir");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd?.(content.trim(), targetHouse);
    setContent("");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Add hint</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Hint content…"
          rows={2}
          className="resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
        />
        <div className="flex items-center gap-3">
          <select
            value={targetHouse}
            onChange={(e) => setTargetHouse(e.target.value as House)}
            className="rounded-md border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            {HOUSES.map((h) => (
              <option key={h} value={h} className="capitalize">{h}</option>
            ))}
          </select>
          <Button size="sm" type="submit">Add</Button>
        </div>
      </form>
      <div className="flex flex-col gap-2">
        {hints.map((hint) => (
          <HintCard key={hint.id} content={hint.content} targetHouse={hint.targetHouse} usedAt={hint.usedAt} />
        ))}
        {hints.length === 0 && (
          <p className="text-center text-sm text-zinc-400">No hints added yet.</p>
        )}
      </div>
    </div>
  );
}
