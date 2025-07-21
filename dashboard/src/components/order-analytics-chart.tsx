"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { API } from "@/constant";
import { useIsMobile } from "@/hooks/use-mobile";

interface DailyOrder {
  order_date: string;
  total_orders: string;
}

export function OrderAnalyticsChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [orderData, setOrderData] = React.useState<DailyOrder[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch order data
  const fetchOrderData = async () => {
    try {
      const response = await fetch(`${API}reports/getTotalOrdersPerDay`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setOrderData(data);
    } catch (err) {
      console.error("Error fetching order data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrderData();
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    if (!orderData.length) return [];

    const now = new Date();
    let daysToSubtract = 30;

    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "14d") {
      daysToSubtract = 14;
    }

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return orderData
      .filter((item) => {
        const orderDate = new Date(item.order_date);
        return orderDate >= startDate;
      })
      .map((item) => ({
        date: new Date(item.order_date).toLocaleDateString("AR-US", {
          month: "short",
          day: "numeric",
        }),
        orders: parseInt(item.total_orders),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [orderData, timeRange]);

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "7d":
        return "آخر 7 أيام";
      case "14d":
        return "آخر 14 يوم";
      case "30d":
        return "آخر 30 يوم";
      default:
        return "آخر 30 يوم";
    }
  };

  const totalOrders = filteredData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrders =
    filteredData.length > 0 ? Math.round(totalOrders / filteredData.length) : 0;

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>تحليلات الطلبات</CardTitle>
          <CardDescription>جار التحميل...</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <div className="text-muted-foreground">جار تحميل البيانات...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>تحليلات الطلبات</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            إجمالي الطلبات: {totalOrders} | متوسط الطلبات اليومي:{" "}
            {averageOrders}
          </span>
          <span className="@[540px]/card:hidden">
            إجمالي: {totalOrders} | متوسط: {averageOrders}
          </span>
        </CardDescription>
        <div className="flex justify-between items-center">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">آخر 7 أيام</ToggleGroupItem>
            <ToggleGroupItem value="14d">آخر 14 يوم</ToggleGroupItem>
            <ToggleGroupItem value="30d">آخر 30 يوم</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="اختر الفترة الزمنية"
            >
              <SelectValue placeholder={getTimeRangeLabel()} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                آخر 7 أيام
              </SelectItem>
              <SelectItem value="14d" className="rounded-lg">
                آخر 14 يوم
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                آخر 30 يوم
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-2 rounded-lg border shadow-sm bg-background">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              التاريخ
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {label}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              الطلبات
                            </span>
                            <span className="font-bold">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                dataKey="orders"
                type="monotone"
                fill="url(#fillOrders)"
                stroke="var(--color-orders)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
