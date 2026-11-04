import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import MobileNavigation from "@/components/layout/MobileNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <div className="md:pl-64">
        <AppHeader />

        <main className="mx-auto max-w-[1600px] p-4 pb-24 md:p-8 md:pb-8">
          {children}
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}