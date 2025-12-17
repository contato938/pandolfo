"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BadgeDollarSign, 
  Building2, 
  Briefcase, 
  Settings
} from "lucide-react";

const routes = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Prospectos", icon: Users },
  { href: "/clientes", label: "Clientes", icon: UserCheck },
  { href: "/oportunidades", label: "Oportunidades", icon: BadgeDollarSign },
  { href: "/filiais", label: "Sucursales", icon: Building2 },
  { href: "/vendedores", label: "Vendedores", icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar text-sidebar-foreground hidden md:flex flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Building2 className="h-6 w-6" />
            <span>PANDOLFO</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => {
             const Icon = route.icon;
             const isActive = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
             
             return (
               <Link
                 key={route.href}
                 href={route.href}
                 className={cn(
                   "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary",
                   isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-sidebar-accent/50"
                 )}
               >
                 <Icon className="h-4 w-4" />
                 {route.label}
               </Link>
             );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-primary">
          <Settings className="h-4 w-4" />
          Configuración
        </button>
      </div>
    </aside>
  );
}
