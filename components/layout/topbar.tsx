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

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { selectedBranchId, setSelectedBranchId, toggleSidebar } = useStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-6 shadow-sm">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-4">
        {/* Branch Selector */}
        <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Sucursal:</span>
            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar sucursal" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas las Sucursales</SelectItem>
                {MOCK_BRANCHES.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
      </div>
    </header>
  );
}
