
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Calculator,
  Package,
  Users,
  ClipboardList,
  Settings,
  Building2,
} from "lucide-react";

const menus = [
  {
    title: "MENU UTAMA",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Proyek", href: "/projects", icon: FolderKanban },
      { label: "RAB", href: "/rab", icon: Calculator },
    ],
  },
  {
    title: "MASTER DATA",
    items: [
      { label: "Material", href: "/materials", icon: Package },
      { label: "Tenaga Kerja", href: "/workers", icon: Users },
      { label: "Analisa AHSP", href: "/ahsp", icon: ClipboardList },
    ],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white md:block">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Building2 size={21} />
        </div>
        <div>
          <h1 className="font-bold tracking-tight">RAB PRO</h1>
          <p className="text-[10px] text-slate-500">
            CONSTRUCTION SYSTEM
          </p>
        </div>
      </div>

      <nav className="space-y-7 px-4 py-7">
        {menus.map((group) => (
          <div key={group.title}>
            <p className="mb-3 px-3 text-[10px] font-bold tracking-widest text-slate-400">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={19} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Settings size={19} />
          Pengaturan
        </Link>
      </nav>

      <div className="absolute bottom-5 left-4 right-4 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold">RAB PRO</p>
        <p className="mt-1 text-[11px] text-slate-500">
          Sistem manajemen anggaran konstruksi
        </p>
      </div>
    </aside>
  );
}
