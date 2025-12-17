"use client";

import { Cell, Pie, PieChart as RechartsPieChart, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useId, useState } from "react";

interface PieChartProps {
  title: string;
  data: { name: string; value: number }[];
  colors?: string[];
}

const DEFAULT_COLORS = ["#1E5A9C", "#2563EB", "#0EA5E9", "#3B82F6", "#F59E0B", "#DC2626"];

export function PieChart({ title, data, colors = DEFAULT_COLORS }: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartId = useId().replace(/:/g, "");
  const gradientId = (i: number) => `pie-gradient-${chartId}-${i}`;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
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
        <CardContent>
          {data.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
              Sem dados para exibir
            </div>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <RechartsPieChart width={500} height={300}>
                <defs>
                  {colors.map((color, index) => (
                    <linearGradient
                      key={gradientId(index)}
                      id={gradientId(index)}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#${gradientId(index % colors.length)})`}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                      style={{
                        filter: activeIndex === index ? "brightness(1.2)" : "brightness(1)",
                        transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                        transformOrigin: "center",
                        transition: "all 0.3s ease",
                        opacity: activeIndex === null ? 1 : activeIndex === index ? 1 : 0.6,
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: 600,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={50}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "13px",
                  }}
                />
              </RechartsPieChart>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
