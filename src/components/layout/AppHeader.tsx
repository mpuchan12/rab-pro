"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden">
          <Menu size={21} />
        </button>

        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 sm:flex">
          <Search size={17} className="text-slate-400" />
          <input
            placeholder="Cari proyek, material..."
            className="w-48 bg-transparent text-sm outline-none"
          />
        </div>

        <h2 className="text-sm font-semibold sm:hidden">
          RAB PRO
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifikasi"
          className="relative rounded-xl border p-2 text-slate-600 hover:bg-slate-50"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
        </button>

        <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          A
        </div>
      </div>
    </header>
  );
}