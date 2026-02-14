"use client";

import Link from "next/link";
import { Activity, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="bg-[#1a237e]/90 backdrop-blur-md text-white py-4 px-6 md:px-12 sticky top-0 z-50 shadow-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-white/10 p-1.5 rounded text-white">
                        <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold tracking-wide">
                        Rural<span className="text-blue-300">Clinics</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-100">
                    <Link
                        href="/"
                        className={cn(
                            "hover:text-white transition-colors",
                            pathname === "/" && "text-white font-bold"
                        )}
                    >
                        Home
                    </Link>
                    <Link
                        href="/browse"
                        className={cn(
                            "hover:text-white transition-colors",
                            pathname === "/browse" && "text-white font-bold"
                        )}
                    >
                        Browse
                    </Link>
                </nav>

                <div className="md:hidden text-white">
                    <Menu className="w-6 h-6" />
                </div>
            </div>
        </header>
    );
}
