
"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  Wallet,
  Calculator,
  Package,
  ArrowUpRight,
  Plus,
  HardHat,
} from "lucide-react";
import Link from "next/link";

interface Project {
  _id: string;
  name: string;
  code: string;
  location?: string;
  buildingArea: number;
  budget: number;
  status: "planning" | "ongoing" | "completed";
}

interface ApiResponse {
  success: boolean;
  data: {
    projects: Project[];
    pagination: {
      total: number;
    };
  };
}

const currency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch(
          "/api/projects?limit=50",
          { cache: "no-store" }
        );

        const result: ApiResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Gagal mengambil data proyek");
        }

        setProjects(result.data.projects);
      } catch {
        setError("Tidak dapat memuat proyek. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const totalBudget = projects.reduce(
    (sum, project) => sum + project.budget,
    0
  );

  const activeProjects = projects.filter(
    (project) => project.status === "ongoing"
  ).length;

  const stats = [
    {
      title: "Total Proyek",
      value: projects.length.toString(),
      description: "Seluruh proyek",
      icon: FolderKanban,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Anggaran Proyek",
      value: currency(totalBudget),
      description: "Total anggaran terdaftar",
      icon: Wallet,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Proyek Berjalan",
      value: activeProjects.toString(),
      description: "Sedang dikerjakan",
      icon: HardHat,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Master Material",
      value: "—",
      description: "Modul berikutnya",
      icon: Package,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">
            Construction Management
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan proyek dan anggaran konstruksi Anda.
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Buat Proyek
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={21} />
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-slate-300"
                />
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {stat.title}
              </p>

              <p className="mt-1 break-words text-xl font-bold tracking-tight">
                {loading ? "..." : stat.value}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Proyek Terbaru</h2>
              <p className="mt-1 text-xs text-slate-500">
                Daftar proyek yang Anda kelola
              </p>
            </div>

            <Link
              href="/projects"
              className="text-xs font-semibold text-blue-600"
            >
              Lihat semua
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
              <FolderKanban
                size={32}
                className="mx-auto text-slate-300"
              />
              <p className="mt-3 font-semibold">
                Belum ada proyek
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Buat proyek pertama untuk mulai menyusun RAB.
              </p>
              <Link
                href="/projects"
                className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Tambah proyek
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project._id}
                  className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {project.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {project.code} · {project.location || "Lokasi belum diisi"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm font-bold">
                      {currency(project.budget)}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                      {project.status === "ongoing"
                        ? "Berjalan"
                        : project.status === "completed"
                          ? "Selesai"
                          : "Perencanaan"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">Akses Cepat</h2>
          <p className="mt-1 text-xs text-slate-500">
            Modul yang sering digunakan
          </p>

          <div className="mt-5 space-y-3">
            {[
              {
                label: "Buat RAB Baru",
                description: "Hitung anggaran pekerjaan",
                href: "/rab",
                icon: Calculator,
              },
              {
                label: "Database Material",
                description: "Kelola harga material",
                href: "/materials",
                icon: Package,
              },
              {
                label: "Analisa AHSP",
                description: "Kelola koefisien pekerjaan",
                href: "/ahsp",
                icon: HardHat,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                >
                  <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                    <Icon size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
