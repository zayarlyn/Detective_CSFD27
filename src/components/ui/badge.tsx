import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "noir" | "foxlock" | "tracer" | "cipher";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  noir: "bg-zinc-900 text-zinc-100",
  foxlock: "bg-amber-100 text-amber-800",
  tracer: "bg-blue-100 text-blue-800",
  cipher: "bg-emerald-100 text-emerald-800",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
