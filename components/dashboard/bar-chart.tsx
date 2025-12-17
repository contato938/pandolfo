"use client";

import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useId, useState } from "react";

interface BarChartProps {
  title: string;
  data: Record<string, any>[];
  dataKey: string;
  categoryKey: string;
  color?: string;
}

export function BarChart({ title, data, dataKey, categoryKey, color = "#1E5A9C" }: BarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // IDs de SVG precisam ser “seguros”; não usar `title` (pode conter espaços/%/acentos e quebrar url(#...))
  const chartId = useId().replace(/:/g, "");
  const dotsPatternId = `dots-pattern-${chartId}`;
  const barGradientId = `bar-gradient-${chartId}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <div className="text-xs text-muted-foreground mt-1">
            Dados: {data.length} itens
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <div style={{ width: '100%', height: 300 }}>
            <RechartsBarChart 
              width={500}
              height={300}
              data={data}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Pattern de fundo com pontos */}
              <defs>
                <pattern 
                  id={dotsPatternId}
                  x="0" 
                  y="0" 
                  width="10" 
                  height="10" 
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" fill="currentColor" className="text-muted/20" />
                </pattern>
                {/* Gradient para as barras */}
                <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              
              <rect 
                x="0" 
                y="0" 
                width="100%" 
                height="85%" 
                fill={`url(#${dotsPatternId})`} 
              />
              
              <XAxis 
                dataKey={categoryKey} 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value.length > 8 ? `${value.slice(0, 8)}...` : value}
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
                dataKey={dataKey} 
                fill={`url(#${barGradientId})`}
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    className="transition-all duration-200"
                    fillOpacity={
                      activeIndex === null ? 1 : activeIndex === index ? 1 : 0.4
                    }
                    stroke={activeIndex === index ? color : "transparent"}
                    strokeWidth={2}
                    onMouseEnter={() => setActiveIndex(index)}
                  />
                ))}
              </Bar>
            </RechartsBarChart>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
