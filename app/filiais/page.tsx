"use client";

import { useEffect, useState } from "react";
import { filiaisService } from "@/lib/services/filiais.service";
import { territoriosService } from "@/lib/services/territorios.service";
import { Branch, Territory } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);

  useEffect(() => {
    filiaisService.list().then(setBranches);
    territoriosService.list().then(setTerritories);
  }, []);

  const branchCols: ColumnDef<Branch>[] = [
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "city", header: "Ciudad" },
    { accessorKey: "territoryId", header: "Territorio", cell: ({row}) => {
        const t = territories.find(x => x.id === row.getValue("territoryId"));
        return t ? t.name : row.getValue("territoryId");
    }},
    { accessorKey: "sellersCount", header: "Vendedores" },
    { accessorKey: "active", header: "Estado", cell: ({row}) => (
        <Badge variant={row.getValue("active") ? "default" : "secondary"}>
            {row.getValue("active") ? "Activa" : "Inactiva"}
        </Badge>
    )},
  ];

  const territoryCols: ColumnDef<Territory>[] = [
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "cities", header: "Ciudades", cell: ({row}) => (row.original.cities || []).join(", ") },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sucursales y Territorios</h1>
      
      <Tabs defaultValue="branches">
        <TabsList>
            <TabsTrigger value="branches">Sucursales</TabsTrigger>
            <TabsTrigger value="territories">Territorios</TabsTrigger>
        </TabsList>
        <TabsContent value="branches">
            <DataTable columns={branchCols} data={branches} />
        </TabsContent>
        <TabsContent value="territories">
            <DataTable columns={territoryCols} data={territories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
