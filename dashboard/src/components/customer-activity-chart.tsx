"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  is_verified: boolean;
}

export function CustomerActivityChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API}users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Process user data into activity chart data
  const chartData = React.useMemo(() => {
    if (!users.length) return [];

    const now = new Date();
    let daysToSubtract = 30;

    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "14d") {
      daysToSubtract = 14;
    }

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Create date buckets
    const dateMap = new Map<
      string,
      { newUsers: number; activeUsers: number }
    >();

    // Initialize all dates in range
    for (let i = 0; i <= daysToSubtract; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split("T")[0];
      dateMap.set(dateKey, { newUsers: 0, activeUsers: 0 });
    }

    // Process users
    users.forEach((user) => {
      const userDate = new Date(user.created_at);
      const dateKey = userDate.toISOString().split("T")[0];

      if (dateMap.has(dateKey)) {
        const current = dateMap.get(dateKey)!;
        current.newUsers += 1;

        // Consider verified users as active
        if (user.is_verified) {
          current.activeUsers += 1;
        }
      }
    });

    // Convert to array and format for chart
    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("AR-US", {
          month: "short",
          day: "numeric",
        }),
        newUsers: data.newUsers,
        activeUsers: data.activeUsers,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [users, timeRange]);

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

  const totalNewUsers = chartData.reduce((sum, item) => sum + item.newUsers, 0);
  const totalActiveUsers = chartData.reduce(
    (sum, item) => sum + item.activeUsers,
    0
  );
  const averageNewUsers =
    chartData.length > 0 ? Math.round(totalNewUsers / chartData.length) : 0;

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>نشاط العملاء</CardTitle>
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
        <CardTitle>نشاط العملاء</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            المستخدمون الجدد: {totalNewUsers} | المستخدمون النشطون:{" "}
            {totalActiveUsers} | متوسط المستخدمين الجدد يومياً:{" "}
            {averageNewUsers}
          </span>
          <span className="@[540px]/card:hidden">
            جدد: {totalNewUsers} | نشطون: {totalActiveUsers}
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
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              التاريخ
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {label}
                            </span>
                          </div>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {entry.name === "newUsers"
                                  ? "مستخدمون جدد"
                                  : "مستخدمون نشطون"}
                              </span>
                              <span
                                className="font-bold"
                                style={{ color: entry.color }}
                              >
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) =>
                  value === "newUsers" ? "مستخدمون جدد" : "مستخدمون نشطون"
                }
              />
              <Bar
                dataKey="newUsers"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                name="newUsers"
              />
              <Bar
                dataKey="activeUsers"
                fill="var(--secondary)"
                radius={[4, 4, 0, 0]}
                name="activeUsers"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
