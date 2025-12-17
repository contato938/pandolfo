"use client";

import { useEffect, useState } from "react";
import { clientesService } from "@/lib/services/clientes.service";
import { Client } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useStore } from "@/lib/store";

export default function ClientsPage() {
  const [data, setData] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { selectedBranchId } = useStore();

  useEffect(() => {
    clientesService.list({ 
        search, 
        branchId: selectedBranchId !== 'all' ? selectedBranchId : undefined 
    }).then(setData);
  }, [search, selectedBranchId]);

  const columns: ColumnDef<Client>[] = [
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
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "opportunitiesCount",
      header: "Oportunidades",
      cell: ({ row }) => <div className="text-center">{row.getValue("opportunitiesCount")}</div>
    },
    {
      accessorKey: "totalWonValue",
      header: "Valor Ganado",
      cell: ({ row }) => new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(row.getValue("totalWonValue"))
    },
    {
      accessorKey: "createdAt",
      header: "Desde",
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd/MM/yyyy")
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">Base de clientes e histórico.</p>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input 
            placeholder="Buscar por nombre..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
        />
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        onRowClick={(row) => router.push(`/clientes/${row.id}`)}
      />
    </div>
  );
}
