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
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

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
  const { isSidebarOpen } = useStore();

  return (
    <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-linear-to-b from-sidebar to-sidebar/95 text-sidebar-foreground transition-all duration-300 md:flex flex-col backdrop-blur-xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Header com logo */}
      <div className="flex h-16 items-center border-b border-border/50 px-6 bg-sidebar/50 backdrop-blur-sm">
        <motion.div 
          className="flex items-center gap-2 font-bold text-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <Building2 className="h-7 w-7 text-primary" />
            <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            PANDOLFO
          </span>
        </motion.div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="grid gap-2">
          {routes.map((route, index) => {
             const Icon = route.icon;
             const isActive = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
             
             return (
               <motion.div
                 key={route.href}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.3, delay: index * 0.05 }}
               >
                 <Link
                   href={route.href}
                   className={cn(
                     "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                     isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]" 
                      : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground hover:scale-[1.01]"
                   )}
                 >
                   {/* Barra lateral indicadora */}
                   {isActive && (
                     <motion.div
                       layoutId="activeTab"
                       className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full"
                       initial={false}
                       transition={{ type: "spring", stiffness: 500, damping: 30 }}
                     />
                   )}
                   
                   <div className={cn(
                     "p-1.5 rounded-lg transition-all",
                     isActive 
                       ? "bg-primary-foreground/20" 
                       : "bg-muted/50 group-hover:bg-muted"
                   )}>
                     <Icon className="h-4 w-4" />
                   </div>
                   <span className="flex-1">{route.label}</span>
                   
                   {/* Badge de notificação (exemplo) */}
                   {route.href === "/leads" && (
                     <div className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold">
                       3
                     </div>
                   )}
                 </Link>
               </motion.div>
             );
          })}
        </nav>
      </div>

      {/* Footer com gradiente */}
      <div className="p-4 border-t border-border/50 bg-sidebar/50">
        <div className="p-3 rounded-xl bg-linear-to-br from-primary/10 to-transparent border border-primary/20">
          <p className="text-xs font-medium text-muted-foreground">
            Sistema CRM v2.0
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            © 2025 Pandolfo
          </p>
        </div>
      </div>
    </aside>
  );
}
