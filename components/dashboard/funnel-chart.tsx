"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useId, useState } from "react";

interface FunnelData {
  name: string;
  value: number;
}

interface FunnelChartProps {
  data: FunnelData[];
}

// Cores do funnel - degradê do azul vibrante (visível em modo claro)
const FUNNEL_COLORS = ["#1E5A9C", "#2563EB", "#0EA5E9", "#3B82F6", "#6366F1", "#DC2626"];

export function FunnelChart({ data }: FunnelChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartId = useId().replace(/:/g, "");
  const dotsPatternId = `funnel-dots-pattern-${chartId}`;
  const gradientId = (i: number) => `funnel-gradient-${chartId}-${i}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-4"
    >
      <Card className="border-border/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Funnel de Vendas
              </CardTitle>
              <div className="text-xs text-muted-foreground mt-1">
                Dados: {data.length} itens
              </div>
            </div>
            <Badge 
              variant="outline"
              className="gap-1 bg-primary/10 text-primary border-none"
            >
              <TrendingUp className="h-3 w-3" />
              <span className="font-semibold">+12.5%</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          {data.length === 0 ? (
            <div className="h-[350px] flex items-center justify-center text-sm text-muted-foreground">
              Sem dados para exibir
            </div>
          ) : (
            <div style={{ width: '100%', height: 350 }}>
              <BarChart width={700} height={350} data={data} onMouseLeave={() => setActiveIndex(null)}>
                {/* Pattern de fundo */}
                <defs>
                  <pattern
                    id={dotsPatternId}
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="2"
                      cy="2"
                      r="1"
                      fill="currentColor"
                      className="text-muted/20"
                    />
                  </pattern>
                  {/* Gradients para cada fase do funnel */}
                  {FUNNEL_COLORS.map((color, index) => (
                    <linearGradient
                      key={gradientId(index)}
                      id={gradientId(index)}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                    </linearGradient>
                  ))}
                </defs>

                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="85%"
                  fill={`url(#${dotsPatternId})`}
                />
              
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                angle={-15}
                textAnchor="end"
                height={80}
                tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`} 
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                labelStyle={{ 
                  fontWeight: 600,
                  marginBottom: '4px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${gradientId(index % FUNNEL_COLORS.length)})`}
                    className="transition-all duration-200"
                    fillOpacity={
                      activeIndex === null ? 1 : activeIndex === index ? 1 : 0.4
                    }
                    stroke={activeIndex === index ? FUNNEL_COLORS[index % FUNNEL_COLORS.length] : "transparent"}
                    strokeWidth={2}
                    onMouseEnter={() => setActiveIndex(index)}
                  />
                ))}
              </Bar>
              </BarChart>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
