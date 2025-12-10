'use client';

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useEnsureSeedData } from "@/hooks/use-ensure-seed-data";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRequireAuth();
  useEnsureSeedData();
  const pathname = usePathname();
  const isDashboardPage = pathname === '/dashboard';

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f7f6f8]">
      <Header />
      <div className="flex flex-1">
        {!isDashboardPage && <Sidebar />}
        <main className={`flex-1 p-10 min-w-0 overflow-x-hidden ${isDashboardPage ? 'w-full' : ''}`}>{children}</main>
      </div>
    </div>
  );
}
