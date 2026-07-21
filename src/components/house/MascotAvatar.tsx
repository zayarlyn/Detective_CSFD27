import { cn } from "@/lib/utils";
import Image from "next/image";

export const MascotAvatar = ({
  url,
  name,
  size = 80,
  color,
}: {
  url: string;
  name: string;
  size?: number;
  color?: string;
}) => {
  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center border-2 mt-1",
        color ? null : "border-background/35",
      )}
      style={{ width: size, height: size, borderColor: color }}
    >
      <div
        className={cn(
          "absolute inset-1 rounded-full border border-dashed",
          color ? null : "border-background/35",
        )}
      style={{ borderColor: color }}
      />
      <Image
        src={url}
        alt={`${name} mascot`}
        width={size}
        height={size}
        className="relative object-contain p-1.5"
      />
    </div>
  );
};
