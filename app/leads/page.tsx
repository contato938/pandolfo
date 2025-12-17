"use client";

import { useEffect, useState } from "react";
import { leadsService } from "@/lib/services/leads.service";
import { Lead } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useStore } from "@/lib/store";

export default function LeadsPage() {
  const [data, setData] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { selectedBranchId } = useStore();

  useEffect(() => {
    leadsService.list({ 
        search, 
        branchId: selectedBranchId !== 'all' ? selectedBranchId : undefined 
    }).then(setData);
  }, [search, selectedBranchId]);

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
    },
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      accessorKey: "category",
      header: "Categoría",
    },
    {
      accessorKey: "budgetRange",
      header: "Presupuesto",
    },
    {
      accessorKey: "origin",
      header: "Origen",
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd/MM/yyyy")
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Prospectos</h1>
            <p className="text-muted-foreground">Gestione sus clientes potenciales.</p>
        </div>
        
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Prospecto
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo Prospecto</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground text-center">Formulario de creación aquí.</p>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Input 
            placeholder="Buscar por nombre o teléfono..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
        />
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        onRowClick={(row) => router.push(`/leads/${row.id}`)}
      />
    </div>
  );
}
