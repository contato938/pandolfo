"use client";

import { useMemo } from "react";
import { Opportunity, OpportunityStatus } from "@/types";
import { 
  DndContext, 
  DragOverlay, 
  useDraggable, 
  useDroppable, 
  DragStartEvent, 
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUSES: OpportunityStatus[] = ['Nuevo', 'Calificado', 'Presupuesto solicitado', 'En negociación', 'Ganado', 'Perdido'];

interface KanbanBoardProps {
  data: Opportunity[];
  onStatusChange: (id: string, newStatus: OpportunityStatus) => void;
}

export function KanbanBoard({ data, onStatusChange }: KanbanBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const columns = useMemo(() => {
    const cols: Record<OpportunityStatus, Opportunity[]> = {
      'Nuevo': [], 
      'Calificado': [], 
      'Presupuesto solicitado': [],
      'En negociación': [], 
      'Ganado': [], 
      'Perdido': []
    };
    data.forEach(item => {
      if (cols[item.funnelStatus]) {
        cols[item.funnelStatus].push(item);
      }
    });
    return cols;
  }, [data]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string; 
    // overId can be a container (status) or an item logic (not implementing item sort yet for simplicity in this demo)
    
    // If overId is a known status, move to it.
    if (STATUSES.includes(overId as any)) {
      onStatusChange(activeId, overId as OpportunityStatus);
    } else {
      // Find the container of the over item (if dropped on another card)
        // For simplicity, we just assume dropping on container for this demo logic
        // or check active data.
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {STATUSES.map(status => (
            <KanbanColumn key={status} status={status} items={columns[status]} />
        ))}
      </div>
    </DndContext>
  );
}

function KanbanColumn({ status, items }: { status: OpportunityStatus, items: Opportunity[] }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="flex h-full w-[300px] min-w-[300px] flex-col rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between px-2 pt-2">
        <h3 className="font-semibold text-sm">{status}</h3>
        <Badge variant="secondary">{items.length}</Badge>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {items.map(item => (
            <KanbanCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function KanbanCard({ item }: { item: Opportunity }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes}
        className="cursor-move hover:shadow-md transition-shadow"
    >
      <CardHeader className="p-3 space-y-0 pb-2">
        <Badge variant="outline" className="w-fit mb-1 text-[10px]">{item.category}</Badge>
        <CardTitle className="text-sm font-medium leading-tight">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex justify-between items-end mt-2">
            <span className="text-xs text-muted-foreground">{item.budgetRange}</span>
            <span className="font-bold text-sm text-primary">
                {item.estimatedValue ? 
                   new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits:0 }).format(item.estimatedValue) 
                   : '-'}
            </span>
        </div>
      </CardContent>
    </Card>
  );
}
