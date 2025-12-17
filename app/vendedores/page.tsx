"use client";

import { useEffect, useState } from "react";
import { vendedoresService } from "@/lib/services/vendedores.service";
import { Seller } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SellersPage() {
  const [data, setData] = useState<Seller[]>([]);

  useEffect(() => {
    vendedoresService.list().then(setData);
  }, []);

  const columns: ColumnDef<Seller>[] = [
    { 
        accessorKey: "name", 
        header: "Nombre",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.avatarUrl} />
                    <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{row.original.name}</span>
            </div>
        )
    },
    { accessorKey: "branchId", header: "Sucursal" }, 
    { 
        accessorKey: "monthlyGoal", 
        header: "Meta",
        cell: ({ row }) => row.original.monthlyGoal?.toLocaleString('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 })
    },
    { 
        accessorKey: "active", 
        header: "Estado", 
        cell: ({row}) => (
            <Badge variant={row.original.active ? "outline" : "secondary"}>
                {row.original.active ? "Activo" : "Inactivo"}
            </Badge>
        )
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Vendedores</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
