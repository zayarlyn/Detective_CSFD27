import Link from "next/link";
import { cn } from "@/lib/utils";
import type { House } from "@/lib/constants/houses";

interface HouseCardProps {
  house: House;
  memberCount?: number;
  className?: string;
}

const houseStyles: Record<House, { bg: string; text: string; border: string }> = {
  noir: { bg: "bg-zinc-900", text: "text-zinc-50", border: "border-zinc-700" },
  foxlock: { bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200" },
  tracer: { bg: "bg-blue-50", text: "text-blue-900", border: "border-blue-200" },
  cipher: { bg: "bg-emerald-50", text: "text-emerald-900", border: "border-emerald-200" },
};

export function HouseCard({ house, memberCount, className }: HouseCardProps) {
  const styles = houseStyles[house];

  return (
    <Link
      href={`/houses/${house}`}
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-6 transition-opacity hover:opacity-80",
        styles.bg,
        styles.border,
        className
      )}
    >
      <h2 className={cn("text-xl font-semibold capitalize", styles.text)}>{house}</h2>
      {memberCount !== undefined && (
        <p className={cn("text-sm opacity-70", styles.text)}>{memberCount} members</p>
      )}
    </Link>
  );
}
