"use client";

import { useStore } from "@/lib/store";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MOCK_BRANCHES } from "@/lib/data";
import { Menu, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Topbar() {
  const { selectedBranchId, setSelectedBranchId, toggleSidebar, user } = useStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 shadow-sm">
      {/* Menu Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar} 
        className="mr-2 hover:bg-primary/10 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-4 flex-1">
        {/* Branch Selector */}
        <motion.div 
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-border/50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Building2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-muted-foreground">Sucursal:</span>
          <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
            <SelectTrigger className="w-[200px] border-none bg-transparent font-semibold">
              <SelectValue placeholder="Seleccionar sucursal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="font-semibold">Todas las Sucursales</span>
              </SelectItem>
              {MOCK_BRANCHES.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* User Info */}
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-border/50">
            <div className="text-right">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold shadow-lg">
              {user.name.charAt(0)}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
