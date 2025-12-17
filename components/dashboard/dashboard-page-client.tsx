"use client";

import { useEffect, useMemo, useState } from "react";
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

export function DashboardPageClient() {
  const { user, selectedBranchId } = useStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("owner");

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date().toLocaleTimeString());
  }, []);

  // Fetch data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const l = await leadsService.list({
          branchId: selectedBranchId !== "all" ? selectedBranchId : undefined,
        });
        const o = await oportunidadesService.list({
          branchId: selectedBranchId !== "all" ? selectedBranchId : undefined,
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
    const openOpps = opportunities.filter(
      (o) => !["Ganado", "Perdido"].includes(o.funnelStatus),
    ).length;

    const won = opportunities.filter((o) => o.funnelStatus === "Ganado");
    const lost = opportunities.filter((o) => o.funnelStatus === "Perdido");
    const closed = won.length + lost.length;

    const conversionRate = closed > 0 ? (won.length / closed) * 100 : 0;

    // Guarani usually has no decimals
    const totalWonValue = won.reduce(
      (acc, curr) => acc + (curr.finalValue || curr.estimatedValue || 0),
      0,
    );
    const avgTicket = won.length > 0 ? totalWonValue / won.length : 0;

    // Cycle time
    let totalDays = 0;
    let countCycle = 0;
    won.forEach((o) => {
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
      avgCycle,
    };
  }, [leads, opportunities]);

  // Chart Data Preparation
  const charts = useMemo(() => {
    const stablePercentFromString = (input: string, min = 10, max = 40) => {
      // hash simples e determinístico (server/client) para evitar hydration mismatch
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
        hash = (hash * 31 + input.charCodeAt(i)) | 0;
      }
      const range = Math.max(1, max - min + 1);
      const normalized = Math.abs(hash) % range;
      return min + normalized;
    };

    // Funnel
    const counts: Record<string, number> = {};
    opportunities.forEach((o) => {
      counts[o.funnelStatus] = (counts[o.funnelStatus] || 0) + 1;
    });
    const funnelOrder = [
      "Nuevo",
      "Calificado",
      "Presupuesto solicitado",
      "En negociación",
      "Ganado",
      "Perdido",
    ];
    const funnel = funnelOrder
      .map((status) => ({ name: status, value: counts[status] || 0 }))
      .filter((d) => d.value > 0);

    // Loss Reasons
    const lossCounts: Record<string, number> = {};
    opportunities
      .filter((o) => o.funnelStatus === "Perdido")
      .forEach((o) => {
        const reason = o.lossReason || "Desconocido";
        lossCounts[reason] = (lossCounts[reason] || 0) + 1;
      });
    const lossReasons = Object.entries(lossCounts).map(([k, v]) => ({
      name: k,
      value: v,
    }));

    // Category Share
    const catCounts: Record<string, number> = {};
    opportunities.forEach((o) => {
      catCounts[o.category] = (catCounts[o.category] || 0) + 1;
    });
    const categories = Object.entries(catCounts).map(([k, v]) => ({ name: k, value: v }));

    // Branch Conversion (Simulated based on mocked data)
    // In a real scenario we would group by branchId and calc conversion
    // Para demo visual usamos um valor determinístico (hash do id) para evitar mismatch na hidratação
    const branchConv = MOCK_BRANCHES.slice(0, 5).map((b) => ({
      name: b.name.replace("Matriz ", "").replace("Sucursal ", ""),
      value: stablePercentFromString(b.id, 10, 40), // Mock conversion % (determinístico)
    }));

    return { funnel, lossReasons, categories, branchConv };
  }, [opportunities]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      maximumFractionDigits: 0,
    }).format(val);

  // Evita hydration mismatch com componentes que geram IDs (Radix) ao renderizar no servidor.
  // Importante: não pode "pular hooks", então decidimos o fallback só no final do render.
  if (!mounted) {
    return (
      <div className="space-y-6 p-2">
        <div className="h-16 rounded-xl bg-muted/60 animate-pulse" />
        <div className="h-10 w-80 rounded-xl bg-muted/60 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-muted/60 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[360px] rounded-xl bg-muted/60 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    // Em dev, ferramentas/extensões podem injetar atributos no DOM (ex.: data-cursor-ref) e gerar warnings de hidratação.
    // Como isso não afeta produção, suprimimos o warning neste subtree.
    <div className="space-y-8 p-2" suppressHydrationWarning>
      {/* Header com gradiente */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard Ejecutivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão completa dos seus indicadores de desempenho
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Última actualización: {currentDate}
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="owner"
            disabled={user.role !== "owner"}
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Visión Ejecutiva
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Reportes y Analítica
          </TabsTrigger>
          <TabsTrigger
            value="branch"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Operación por Sucursal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="owner" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <FunnelChart key={`funnel-${activeTab}`} data={charts.funnel} />

            <div className="col-span-3 grid gap-6">
              <KPIStatCard
                title="Ciclo de Venta Promedio"
                value={`${kpis.avgCycle} días`}
                icon={Timer}
                loading={loading}
                className="h-fit"
              />
              {/* Ranking placeholder */}
              <div className="rounded-xl border border-border/50 bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <h3 className="font-bold text-lg leading-none tracking-tight mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                  Top Sucursales (Ingresos)
                </h3>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-12 bg-muted/50 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all
                              ${
                                i === 1
                                  ? "bg-accent/20 text-accent"
                                  : i === 2
                                    ? "bg-muted-foreground/20 text-muted-foreground"
                                    : i === 3
                                      ? "bg-accent/10 text-accent"
                                      : "bg-primary/10 text-primary"
                              }`}
                          >
                            {i}
                          </div>
                          <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                            Sucursal {i}
                          </span>
                        </div>
                        <span className="text-sm font-mono font-semibold text-foreground">
                          {formatCurrency(100000000 - i * 5000000)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BarChart
              key={`branch-conv-${activeTab}`}
              title="Conversión por Sucursal (%)"
              data={charts.branchConv}
              dataKey="value"
              categoryKey="name"
              color="#2563EB"
            />
            <BarChart
              key={`loss-reasons-${activeTab}`}
              title="Motivos de Pérdida"
              data={charts.lossReasons}
              dataKey="value"
              categoryKey="name"
              color="#DC2626"
            />
            <PieChart key={`categories-${activeTab}`} title="Ventas por Categoría" data={charts.categories} />
          </div>
          <div className="rounded-xl border border-border/50 bg-card shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <h3 className="font-bold text-lg mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
              Detalle de Conversión por Vendedor
            </h3>
            <div className="space-y-1 overflow-hidden">
              {/* Mock table for seller conversion */}
              <div className="grid grid-cols-4 font-semibold text-sm text-muted-foreground pb-3 border-b-2">
                <div>Vendedor</div>
                <div className="text-center">Oportunidades</div>
                <div className="text-center">Ganadas</div>
                <div className="text-right">Tasa</div>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 text-sm py-3 border-b last:border-0 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="font-semibold">Vendedor {i}</div>
                  <div className="text-center text-muted-foreground">{20 + i}</div>
                  <div className="text-center text-muted-foreground">{5 + i}</div>
                  <div className="text-right font-mono font-semibold text-primary">
                    {(((5 + i) / (20 + i)) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="branch" className="space-y-4">
          <div className="flex items-center justify-center h-64 border border-dashed border-border/50 rounded-xl bg-muted/20">
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground font-medium">
                Seleccione una sucursal en el menú superior para ver detalles.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


