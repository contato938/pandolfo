"use client";

import { useEffect, useState } from "react";
import { oportunidadesService } from "@/lib/services/oportunidades.service";
import { Opportunity, OpportunityStatus } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { useStore } from "@/lib/store";
import { KanbanBoard } from "@/components/opportunities/kanban-board";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function OpportunitiesPage() {
  const [data, setData] = useState<Opportunity[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const { selectedBranchId } = useStore();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
        const res = await oportunidadesService.list({ 
            branchId: selectedBranchId !== 'all' ? selectedBranchId : undefined 
        });
        if (mounted) setData(res);
    };
    load();
    return () => { mounted = false; };
  }, [selectedBranchId]);

  const handleStatusChange = async (id: string, newStatus: OpportunityStatus) => {
    // Optimistic update
    setData(prev => prev.map(o => o.id === id ? { ...o, funnelStatus: newStatus } : o));
    await oportunidadesService.update(id, { funnelStatus: newStatus });
  };

  const columns: ColumnDef<Opportunity>[] = [
    { accessorKey: "title", header: "Título" },
    { accessorKey: "funnelStatus", header: "Estado" },
    { accessorKey: "category", header: "Categoría" },
    { accessorKey: "budgetRange", header: "Rango" },
    { 
        accessorKey: "estimatedValue", 
        header: "Valor Estimado",
        cell: ({ row }) => {
            const val = row.getValue("estimatedValue") as number;
            return val ? val.toLocaleString('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0}) : '-';
        }
    },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Oportunidades</h1>
        </div>
        
        <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'kanban' | 'list')}>
                <ToggleGroupItem value="kanban"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="list"><List className="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Nueva Oportunidad
            </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {viewMode === 'kanban' ? (
            <div className="h-[calc(100vh-200px)] overflow-x-auto">
                 <KanbanBoard data={data} onStatusChange={handleStatusChange} />
            </div>
        ) : (
            <DataTable columns={columns} data={data} />
        )}
      </div>
    </div>
  );
}
