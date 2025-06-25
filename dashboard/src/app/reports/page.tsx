"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/constant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Interface for top selling dishes
interface TopSellingDish {
  dish_name: string;
  total_sold: string;
}

// Interface for top rated dishes
interface TopRatedDish {
  name: string;
  avg_rating: string;
  review_count: string;
}

// Interface for daily orders
interface DailyOrder {
  order_date: string;
  total_orders: string;
}

// Interface for category stats
interface CategoryStat {
  name: string;
  count: string;
}

// Chart configuration for shadcn charts
const chartConfig = {
  sales: {
    label: "Units Sold",
    color: "rgba(53, 162, 235, 0.5)",
  },
  rating: {
    label: "Average Rating",
    color: "rgba(255, 99, 132, 0.5)",
  },
  reviews: {
    label: "Review Count",
    color: "rgba(53, 162, 235, 0.5)",
  },
  orders: {
    label: "Total Orders",
    color: "rgba(75, 192, 192, 0.5)",
  },
  categories: {
    label: "Categories",
    color: "rgba(153, 102, 255, 0.5)",
  },
};

const Reports = () => {
  const [topSellingDishes, setTopSellingDishes] = useState<TopSellingDish[]>(
    []
  );
  const [topRatedDishes, setTopRatedDishes] = useState<TopRatedDish[]>([]);
  const [dailyOrders, setDailyOrders] = useState<DailyOrder[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }; // Fetch top selling dishes
  const fetchTopSellingDishes = async () => {
    try {
      const response = await fetch(`${API}reports/getTopSellingDishes`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTopSellingDishes(data);
      return data;
    } catch (err) {
      console.error("Error fetching top selling dishes:", err);
      return [];
    }
  };

  // Fetch top rated dishes
  const fetchTopRatedDishes = async () => {
    try {
      const response = await fetch(`${API}reports/getTopRatedDishes`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTopRatedDishes(data);
      return data;
    } catch (err) {
      console.error("Error fetching top rated dishes:", err);
      return [];
    }
  };

  // Fetch daily orders
  const fetchDailyOrders = async () => {
    try {
      const response = await fetch(`${API}reports/getTotalOrdersPerDay`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setDailyOrders(data);
      return data;
    } catch (err) {
      console.error("Error fetching daily orders:", err);
      return [];
    }
  };
  // Fetch category stats
  const fetchCategoryStats = async () => {
    try {
      const response = await fetch(`${API}reports/getstatsCategories`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCategoryStats(data);
      return data;
    } catch (err) {
      console.error("Error fetching category stats:", err);
      return [];
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");

    if (!token) {
      // Redirect to login if no authentication token found
      router.push("/login");
    } else {
      // Fetch all data
      Promise.all([
        fetchTopSellingDishes(),
        fetchTopRatedDishes(),
        fetchDailyOrders(),
        fetchCategoryStats(),
      ]).then(() => {
        setIsLoading(false);
      });
    }
  }, [
    router,
    fetchTopSellingDishes,
    fetchTopRatedDishes,
    fetchDailyOrders,
    fetchCategoryStats,
  ]);
  // Bar chart data for top selling dishes - format for recharts
  const topSellingChartData = topSellingDishes.map((dish) => ({
    name: dish.dish_name,
    sales: parseInt(dish.total_sold),
  }));
  // Pie chart data for top rated dishes - format for recharts
  const topRatedPieData = topRatedDishes.map((dish) => ({
    name: dish.name,
    rating: parseFloat(dish.avg_rating),
    reviews: parseInt(dish.review_count),
  }));

  // Combined data for rating vs review count - format for recharts
  const ratingLineData = topRatedDishes.map((dish) => ({
    name: dish.name,
    rating: parseFloat(dish.avg_rating),
    reviews: parseInt(dish.review_count),
  }));

  // Format daily orders data for recharts
  const dailyOrdersData = dailyOrders.map((order) => ({
    name: new Date(order.order_date).toLocaleDateString(),
    orders: parseInt(order.total_orders),
  }));

  // Format category stats data for recharts
  const categoryStatsData = categoryStats.map((category) => ({
    name: category.name,
    categories: parseInt(category.count),
  }));

  if (isLoading) {
    return (
      <div className="container py-10 mx-auto">
        <h1 className="mb-6 text-2xl font-bold"> تقارير المطعم</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-[250px]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-[200px]" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-[250px]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-[200px]" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-10 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">تقارير المطعم</h1>

      <Tabs defaultValue="sales" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="sales"> بيانات المبيعات</TabsTrigger>
          <TabsTrigger value="ratings">بيانات التقييمات</TabsTrigger>
          <TabsTrigger value="analytics">تحليلات إضافية</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>الأطباق الأكثر مبيعاً</CardTitle>
                <CardDescription>
                  الأطباق التي حصلت على أعلى عدد من الطلبات
                </CardDescription>
              </CardHeader>{" "}
              <CardContent>
                {" "}
                <div className="h-[350px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topSellingChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="sales" fill="var(--color-sales)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع المبيعات</CardTitle>
                <CardDescription>نسبة المبيعات حسب الطبق</CardDescription>
              </CardHeader>{" "}
              <CardContent>
                {" "}
                <div className="h-[350px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topSellingChartData}
                          dataKey="sales"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="var(--color-sales)"
                          label
                        />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ratings">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>الأطباق الأكثر تقييماً</CardTitle>
                <CardDescription>
                  الأطباق التي حصلت على أعلى متوسط التقييمات
                </CardDescription>
              </CardHeader>{" "}
              <CardContent>
                {" "}
                <div className="h-[350px] space-x-2">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topRatedPieData}
                          dataKey="rating"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="var(--color-rating)"
                          label
                        >
                          {topRatedPieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(${(index * 45) % 360}, 70%, 60%)`}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>التقييمات مقابل عدد المراجعات</CardTitle>
                <CardDescription>
                  مقارنة التقييمات وعدد المراجعات
                </CardDescription>
              </CardHeader>{" "}
              <CardContent>
                {" "}
                <div className="h-[350px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ratingLineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          domain={[0, 5]}
                        />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="rating"
                          stroke="var(--color-rating)"
                          yAxisId="left"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="reviews"
                          stroke="var(--color-reviews)"
                          yAxisId="right"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>حجم الطلبات اليومي</CardTitle>
                <CardDescription>عدد الطلبات الموضوعة يومياً</CardDescription>
              </CardHeader>
              <CardContent>
                {" "}
                <div className="h-[350px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyOrdersData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="orders" fill="var(--color-orders)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع الأطباق حسب الفئة</CardTitle>
                <CardDescription>عدد الأطباق في كل فئة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie
                        data={categoryStatsData}
                        dataKey="categories"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="var(--color-categories)"
                        label
                      >
                        {categoryStatsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${(index * 45) % 360}, 70%, 60%)`}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>تقارير مفصلة</CardTitle>
            <CardDescription>بيانات التقارير</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-medium">
                  الأطباق الأكثر مبيعاً
                </h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">اسم الطبق</th>
                      <th className="py-2 text-right">عدد الطلبات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingDishes.map((dish, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{dish.dish_name}</td>
                        <td className="py-2 text-right">{dish.total_sold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">
                  الأطباق الأكثر تقييماً
                </h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">اسم الطبق</th>
                      <th className="py-2 text-right">متوسط التقييم</th>
                      <th className="py-2 text-right">عدد المراجعات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRatedDishes.map((dish, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{dish.name}</td>
                        <td className="py-2 text-right">
                          {parseFloat(dish.avg_rating).toFixed(1)}⭐
                        </td>
                        <td className="py-2 text-right">{dish.review_count}</td>
                      </tr>
                    ))}{" "}
                  </tbody>
                </table>
              </div>
            </div>{" "}
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-medium">حجم الطلبات اليومي</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">التاريخ</th>
                      <th className="py-2 text-right">عدد الطلبات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyOrders.map((order, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">
                          {new Date(order.order_date).toLocaleDateString()}
                        </td>
                        <td className="py-2 text-right">
                          {order.total_orders}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">
                  توزيع الأطباق حسب الفئة
                </h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">اسم الفئة</th>
                      <th className="py-2 text-right">عدد الأطباق</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryStats.map((category, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{category.name}</td>
                        <td className="py-2 text-right">{category.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
