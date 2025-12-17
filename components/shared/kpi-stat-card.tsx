import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

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
    <Card className={cn(className, "hover:shadow-md transition-shadow")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
              <span className={cn("font-medium mr-1", trend.positive ? "text-green-600" : "text-red-600")}>
                {trend.positive ? "+" : ""}{trend.value}%
              </span>
            )}
            {description || trend?.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
