"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface KPIStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  loading?: boolean;
  className?: string;
}

export function KPIStatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading,
  className
}: KPIStatCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-[100px]" />
          </CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px]" />
          <Skeleton className="h-4 w-[120px] mt-1" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className={cn(
        className, 
        "relative overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/10",
        "border-border/50 bg-linear-to-br from-card to-card/95"
      )}>
        {/* Gradient overlay sutil */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground tracking-tight">
            {title}
          </CardTitle>
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <motion.div 
              className="text-3xl font-bold tracking-tight"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              {value}
            </motion.div>
            {trend && (
              <Badge 
                variant="outline"
                className={cn(
                  "gap-1 px-2 py-0.5 text-xs font-semibold border-none",
                  trend.positive 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                )}
              >
                {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend.positive ? "+" : ""}{trend.value}%
              </Badge>
            )}
          </div>
          {(description || trend?.label) && (
            <p className="text-sm text-muted-foreground">
              {description || trend?.label}
            </p>
          )}
        </CardContent>
        
        {/* Barra decorativa no bottom */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1",
          "bg-linear-to-r from-primary/20 via-primary to-primary/20"
        )} />
      </Card>
    </motion.div>
  );
}
