"use client";

import { useEffect, useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { KPIStatCard } from "@/components/shared/kpi-stat-card";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { BarChart } from "@/components/dashboard/bar-chart";
import { PieChart } from "@/components/dashboard/pie-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leadsService } from "@/lib/services/leads.service";
import { oportunidadesService } from "@/lib/services/oportunidades.service";
import { Lead, Opportunity } from "@/types";
import { DollarSign, Users, Target, Timer, TrendingUp } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { MOCK_BRANCHES } from "@/lib/data";

export default function DashboardPage() {
  const { user, selectedBranchId } = useStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleTimeString());
  }, []);

  // Fetch data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const l = await leadsService.list({ 
            branchId: selectedBranchId !== 'all' ? selectedBranchId : undefined 
        });
        const o = await oportunidadesService.list({
            branchId: selectedBranchId !== 'all' ? selectedBranchId : undefined
        });
        setLeads(l);
        setOpportunities(o);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedBranchId, user.role]);

  // KPIs
  const kpis = useMemo(() => {
    const totalLeads = leads.length;
    const openOpps = opportunities.filter(o => !['Ganado', 'Perdido'].includes(o.funnelStatus)).length;
    
    const won = opportunities.filter(o => o.funnelStatus === 'Ganado');
    const lost = opportunities.filter(o => o.funnelStatus === 'Perdido');
    const closed = won.length + lost.length;
    
    const conversionRate = closed > 0 ? (won.length / closed) * 100 : 0;
    
    // Guarani usually has no decimals
    const totalWonValue = won.reduce((acc, curr) => acc + (curr.finalValue || curr.estimatedValue || 0), 0);
    const avgTicket = won.length > 0 ? totalWonValue / won.length : 0;
    
    // Cycle time
    let totalDays = 0;
    let countCycle = 0;
    won.forEach(o => {
      if (o.closedAt) {
        totalDays += differenceInDays(parseISO(o.closedAt), parseISO(o.createdAt));
        countCycle++;
      }
    });
    const avgCycle = countCycle > 0 ? Math.round(totalDays / countCycle) : 0;

    return {
      totalLeads,
      openOpps,
      conversionRate,
      avgTicket,
      avgCycle
    };
  }, [leads, opportunities]);

  // Chart Data Preparation
  const charts = useMemo(() => {
    // Funnel
    const counts: Record<string, number> = {};
    opportunities.forEach(o => {
      counts[o.funnelStatus] = (counts[o.funnelStatus] || 0) + 1;
    });
    const funnelOrder = ['Nuevo', 'Calificado', 'Presupuesto solicitado', 'En negociación', 'Ganado', 'Perdido'];
    const funnel = funnelOrder.map(status => ({ name: status, value: counts[status] || 0 })).filter(d => d.value > 0);

    // Loss Reasons
    const lossCounts: Record<string, number> = {};
    opportunities.filter(o => o.funnelStatus === 'Perdido').forEach(o => {
        const reason = o.lossReason || 'Desconocido';
        lossCounts[reason] = (lossCounts[reason] || 0) + 1;
    });
    const lossReasons = Object.entries(lossCounts).map(([k, v]) => ({ name: k, value: v }));

    // Category Share
    const catCounts: Record<string, number> = {};
    opportunities.forEach(o => {
        catCounts[o.category] = (catCounts[o.category] || 0) + 1;
    });
    const categories = Object.entries(catCounts).map(([k, v]) => ({ name: k, value: v }));

    // Branch Conversion (Simulated based on mocked data)
    // In a real scenario we would group by branchId and calc conversion
    // For visual demo, we map existing branches to random conversion rates if not enough data
    const branchConv = MOCK_BRANCHES.slice(0, 5).map(b => ({
        name: b.name.replace('Matriz ', '').replace('Sucursal ', ''),
        value: Math.floor(Math.random() * 30) + 10 // Mock conversion %
    }));

    return { funnel, lossReasons, categories, branchConv };
  }, [opportunities]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Ejecutivo</h1>
        <div className="text-sm text-muted-foreground">
            Última actualización: {currentDate}
        </div>
      </div>

      <Tabs defaultValue="owner" className="space-y-4">
        <TabsList>
          <TabsTrigger value="owner" disabled={user.role !== 'owner'}>Visión Ejecutiva</TabsTrigger>
          <TabsTrigger value="analytics">Reportes y Analítica</TabsTrigger>
          <TabsTrigger value="branch">Operación por Sucursal</TabsTrigger>
        </TabsList>

        <TabsContent value="owner" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <KPIStatCard 
               title="Total Prospectos" 
               value={kpis.totalLeads} 
               icon={Users} 
               loading={loading}
               trend={{ value: 12, label: "vs mes anterior", positive: true }}
             />
             <KPIStatCard 
               title="Oportunidades Abiertas" 
               value={kpis.openOpps} 
               icon={Target} 
               loading={loading}
             />
             <KPIStatCard 
               title="Ticket Promedio" 
               value={formatCurrency(kpis.avgTicket)} 
               icon={DollarSign} 
               loading={loading}
             />
             <KPIStatCard 
               title="Tasa de Conversión" 
               value={`${kpis.conversionRate.toFixed(1)}%`} 
               icon={TrendingUp} 
               loading={loading}
               trend={{ value: 2.1, label: "vs mes anterior", positive: true }}
             />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <FunnelChart data={charts.funnel} />
            
            <div className="col-span-3 grid gap-4">
                <KPIStatCard 
                    title="Ciclo de Venta Promedio" 
                    value={`${kpis.avgCycle} días`} 
                    icon={Timer} 
                    loading={loading}
                    className="h-fit"
                />
                 {/* Ranking placeholder */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <h3 className="font-semibold leading-none tracking-tight mb-4">Top Sucursales (Ingresos)</h3>
                    {loading ? "Cargando..." : (
                        <div className="space-y-4">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {i}
                                        </div>
                                        <span className="text-sm font-medium">Sucursal {i}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{formatCurrency(100000000 - i * 5000000)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <BarChart title="Conversión por Sucursal (%)" data={charts.branchConv} dataKey="value" categoryKey="name" color="#16A34A" />
                <BarChart title="Motivos de Pérdida" data={charts.lossReasons} dataKey="value" categoryKey="name" color="#DC2626" />
                <PieChart title="Ventas por Categoría" data={charts.categories} />
            </div>
            <div className="rounded-xl border bg-card p-6">
                <h3 className="font-bold mb-4">Detalle de Conversión por Vendedor</h3>
                <div className="space-y-2">
                    {/* Mock table for seller conversion */}
                    <div className="grid grid-cols-4 font-medium text-sm text-muted-foreground pb-2 border-b">
                        <div>Vendedor</div>
                        <div>Oportunidades</div>
                        <div>Ganadas</div>
                        <div>Tasa</div>
                    </div>
                    {[1,2,3,4,5].map(i => (
                         <div key={i} className="grid grid-cols-4 text-sm py-2 border-b last:border-0">
                            <div>Vendedor {i}</div>
                            <div>{20 + i}</div>
                            <div>{5 + i}</div>
                            <div>{((5+i)/(20+i)*100).toFixed(1)}%</div>
                         </div>
                    ))}
                </div>
            </div>
        </TabsContent>

        <TabsContent value="branch">
            <div className="flex items-center justify-center h-48 border rounded-lg bg-slate-50">
                <p className="text-muted-foreground">Seleccione una sucursal en el menú superior para ver detalles.</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
