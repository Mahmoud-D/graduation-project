"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ShoppingBag, 
  AlertCircle, 
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Eye,
  RefreshCw,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, [router]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      'pending': {
        label: 'في الانتظار',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        iconColor: 'text-yellow-600'
      },
      'confirmed': {
        label: 'مؤكد',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
        iconColor: 'text-blue-600'
      },
      'preparing': {
        label: 'قيد التحضير',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Package,
        iconColor: 'text-orange-600'
      },
      'delivering': {
        label: 'قيد التوصيل',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Truck,
        iconColor: 'text-purple-600'
      },
      'delivered': {
        label: 'تم التوصيل',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        iconColor: 'text-green-600'
      },
      'cancelled': {
        label: 'ملغي',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        iconColor: 'text-red-600'
      }
    };
    return configs[status] || configs['pending'];
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setRefreshing(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("حدث خطأ أثناء جلب الطلبات. الرجاء المحاولة مرة أخرى.");
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_id.toString().includes(searchTerm) ||
        order.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      delivering: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      }
    });

    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل طلباتك...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="container mx-auto pt-24">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg">خطأ في تحميل الطلبات</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
              <Button 
                onClick={fetchOrders} 
                variant="outline" 
                size="sm" 
                className="mt-3 ml-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة المحاولة
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <ShoppingBag className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">طلباتي</h1>
          <p className="text-gray-600 text-lg">تتبع وإدارة جميع طلباتك في مكان واحد</p>
        </div>

        {orders?.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full mb-6">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">لا يوجد طلبات بعد</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              لم تقم بأي طلبات حتى الآن. ابدأ رحلة التسوق واكتشف منتجاتنا المميزة!
            </p>
            <Button 
              onClick={() => router.push('/')} 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
            >
              ابدأ التسوق الآن
            </Button>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="mb-8 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Package className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <p className="text-sm text-gray-600 mb-1">إجمالي الطلبات</p>
                    <p className="text-3xl font-bold text-gray-900">{statusCounts.all}</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <CreditCard className="h-8 w-8 mx-auto mb-3 text-green-600" />
                    <p className="text-sm text-gray-600 mb-1">إجمالي المبلغ</p>
                    <p className="text-3xl font-bold text-green-600">
                      {orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0).toFixed(2)} جنيه
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Calendar className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                    <p className="text-sm text-gray-600 mb-1">آخر طلب</p>
                    <p className="text-lg font-bold text-gray-900">
                      {orders.length > 0 ? new Date(Math.max(...orders.map(o => new Date(o.created_at)))).toLocaleDateString('ar-EG') : 'لا يوجد'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { key: 'all', label: 'الكل', count: statusCounts.all },
                  { key: 'pending', label: 'في الانتظار', count: statusCounts.pending },
                  { key: 'confirmed', label: 'مؤكد', count: statusCounts.confirmed },
                  { key: 'preparing', label: 'قيد التحضير', count: statusCounts.preparing },
                  { key: 'delivering', label: 'قيد التوصيل', count: statusCounts.delivering },
                  { key: 'delivered', label: 'تم التوصيل', count: statusCounts.delivered },
                  { key: 'cancelled', label: 'ملغي', count: statusCounts.cancelled }
                ].map(status => (
                  <Button
                    key={status.key}
                    variant={statusFilter === status.key ? "default" : "outline"}
                    onClick={() => setStatusFilter(status.key)}
                    className="flex items-center gap-2"
                  >
                    {status.label}
                    <Badge variant="secondary" className="text-xs">
                      {status.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="البحث برقم الطلب أو العنوان..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button
                  onClick={fetchOrders}
                  disabled={refreshing}
                  variant="outline"
                  className="flex items-center gap-2 px-6 py-3"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  تحديث
                </Button>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={order.order_id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-3">
                      <CardTitle className="flex justify-between items-start">
                        <div>
                          <span className="text-lg font-bold text-gray-900">#{order.order_id}</span>
                          <p className="text-sm text-gray-500 mt-1">طلب رقم</p>
                        </div>
                        <Badge className={`${statusConfig.color} flex items-center gap-1 px-3 py-1 text-sm font-medium border`}>
                          <StatusIcon className={`h-4 w-4 ${statusConfig.iconColor}`} />
                          {statusConfig.label}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">تاريخ الطلب</p>
                          <p className="font-medium">{new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">المبلغ الإجمالي</p>
                            <p className="font-bold text-lg text-green-600">{parseFloat(order.total_amount).toFixed(2)} جنيه</p>
                          </div>
                        </div>
                        
                        {order.delivery_fees && (
                          <div className="flex items-center gap-3 text-gray-700 mr-7">
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">رسوم التوصيل</p>
                              <p className="font-medium text-blue-600">{parseFloat(order.delivery_fees).toFixed(2)} جنيه</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">طريقة الدفع</p>
                          <p className="font-medium">{order.payment_method === 'cash' ? 'نقداً عند الاستلام' : 'بطاقة ائتمان'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">عنوان التوصيل</p>
                          <p className="font-medium leading-relaxed">{order.delivery_address}, {order.city}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          onClick={() => router.push(`/orders/${order.order_id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          عرض تفاصيل الطلب
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredOrders.length === 0 && (orders.length > 0) && (
              <div className="text-center py-16">
                <Filter className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد نتائج</h3>
                <p className="text-gray-500">لم يتم العثور على طلبات تطابق معايير البحث الحالية</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  إزالة الفلاتر
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}