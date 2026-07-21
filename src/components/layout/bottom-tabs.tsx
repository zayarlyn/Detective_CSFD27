"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DivisionsIcon } from "@/components/icons/DivisionsIcon";
import { ProfileIcon } from "@/components/icons/ProfileIcon";

const baseNavLinks = [
    { label: "DIVISIONS", href: "/houses" },
    { label: "STATS", href: "/admin/dashboard", adminOnly: true },
    { label: "ME", href: "/agent/me" },
];

export function BottomTabs({ isAdmin }: { isAdmin: boolean; }) {
    const pathname = usePathname();
    const navLinks = baseNavLinks.filter((nav) => !nav.adminOnly || isAdmin);

    return (
        <div className=" fixed w-11/12 max-w-[720px] rounded-full left-1/2 -translate-x-1/2 bottom-4 shadow-sm flex bg-surface border-t border-dark/10">
            {navLinks.map((nav) => (
                <Link
                    key={nav.href}
                    href={nav.href}
                    className="flex-1 py-2.5 text-center no-underline border-r border-dark/6 block transition-transform duration-150 active:scale-95"
                >
                    <div
                        className={cn(
                            "w-3.5 h-[1.5px] mx-auto mb-1 transition-colors duration-150",
                            pathname.startsWith(nav.href) ? "bg-accent" : "bg-transparent",
                        )}
                    />

                    <div
                        className={cn(
                            "flex items-center justify-center gap-1 text-[12px] tracking-[1.5px] font-mono transition-colors duration-150",
                            pathname.startsWith(nav.href) ? "text-accent" : "text-muted",
                        )}
                    >
                        {nav.href === "/houses" && (
                            <DivisionsIcon className="w-4 pb-1 h-4 shrink-0" />
                        )}
                        {nav.href === "/agent/me" && (
                            <ProfileIcon className="w-4 pb-1 h-4 shrink-0" />
                        )}
                        {nav.label}
                    </div>
                </Link>
            ))}
        </div>
    );
}
