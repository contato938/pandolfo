"use client";

import { useStore } from "@/lib/store";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useStore();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div 
        className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            isSidebarOpen ? "md:pl-64" : "pl-0"
        )}
      >
        <Topbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
