import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { House } from "@/lib/constants/houses";

interface ProfileCardProps {
  name: string;
  email: string;
  house?: House | null;
  score?: number;
  className?: string;
}

export function ProfileCard({ name, email, house, score, className }: ProfileCardProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-lg font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900">
        {initials}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{name}</h2>
        <p className="text-sm text-zinc-500">{email}</p>
      </div>
      <div className="flex items-center gap-2">
        {house && <Badge variant={house} className="capitalize">{house}</Badge>}
        {score !== undefined && (
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {score} pts
          </span>
        )}
      </div>
    </div>
  );
}
