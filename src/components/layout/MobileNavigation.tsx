"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Calculator,
  Package,
  Users,
} from "lucide-react";

const items = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Proyek", href: "/projects", icon: FolderKanban },
  { label: "RAB", href: "/rab", icon: Calculator },
  { label: "Material", href: "/materials", icon: Package },
  { label: "Tim", href: "/workers", icon: Users },
];

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-col items-center gap-1 px-2 py-1 ${
                active ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <Icon size={21} />
              <span className="text-[10px] font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}