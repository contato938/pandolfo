"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MOCK_BRANCHES } from "@/lib/data";

export function Topbar() {
  const { user, selectedBranchId, setUser, setSelectedBranchId } = useStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-6 shadow-sm">
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <form className="hidden sm:block w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en todo el CRM..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </form>
      </div>
      
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

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email || 'roberto@pandolfo.com.py'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUser({ ...user, role: 'owner' })}>
              Cambiar a Dueño
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUser({ ...user, role: 'manager', branchId: '1' })}>
              Cambiar a Gerente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUser({ ...user, role: 'seller', branchId: '1' })}>
              Cambiar a Vendedor
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
