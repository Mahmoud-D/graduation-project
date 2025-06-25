"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  AlertCircle, 
  Calendar,
  CreditCard,
  MapPin,
  Package,
  ArrowLeft,
  User,
  Phone,
  FileText,
  Receipt,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';

export default function OrderDetailsPage() {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      'pending': {
        label: 'في الانتظار',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        iconColor: 'text-yellow-600',
        description: 'تم استلام طلبك وهو في انتظار المراجعة'
      },
      'confirmed': {
        label: 'مؤكد',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
        iconColor: 'text-blue-600',
        description: 'تم تأكيد طلبك وسيتم البدء في التحضير قريباً'
      },
      'preparing': {
        label: 'قيد التحضير',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Package,
        iconColor: 'text-orange-600',
        description: 'جاري تحضير طلبك في المطبخ'
      },
      'delivering': {
        label: 'قيد التوصيل',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Truck,
        iconColor: 'text-purple-600',
        description: 'طلبك في الطريق إليك'
      },
      'delivered': {
        label: 'تم التوصيل',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        iconColor: 'text-green-600',
        description: 'تم توصيل طلبك بنجاح'
      },
      'cancelled': {
        label: 'ملغي',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        iconColor: 'text-red-600',
        description: 'تم إلغاء هذا الطلب'
      }
    };
    return configs[status] || configs['pending'];
  };

  const fetchOrderDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      if (!response.ok) {
          throw new Error("حدث خطأ أثناء جلب تفاصيل الطلب. الرجاء المحاولة مرة أخرى.");
        }
        
        const data = await response.json();
        console.log("data", data);
      setOrder(data.order);
      setOrderItems(data.order.dishes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل تفاصيل الطلب...</p>
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
            <AlertTitle className="text-lg">خطأ في تحميل تفاصيل الطلب</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
              <Button 
                onClick={fetchOrderDetails} 
                variant="outline" 
                size="sm" 
                className="mt-3 ml-2"
              >
                إعادة المحاولة
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="container mx-auto pt-24 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">الطلب غير موجود</h2>
          <p className="text-gray-500 mb-6">لم يتم العثور على الطلب المطلوب</p>
          <Button onClick={() => router.push('/orders')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة إلى الطلبات
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const deliveryFees = parseFloat(order.delivery_fees || 0);
  const total = subtotal + deliveryFees;
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                تفاصيل الطلب #{order.order_id}
              </h1>
              <p className="text-gray-600">
                تم الطلب في {new Date(order.created_at).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className="mt-4 md:mt-0">
              <Badge className={`${statusConfig.color} flex items-center gap-2 px-4 py-2 text-base font-medium border`}>
                <StatusIcon className={`h-5 w-5 ${statusConfig.iconColor}`} />
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  حالة الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className={`p-3 rounded-full ${statusConfig.color.replace('text-', 'bg-').replace('border-', 'bg-').replace('100', '200')}`}>
                    <StatusIcon className={`h-6 w-6 ${statusConfig.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{statusConfig.label}</h3>
                    <p className="text-gray-600">{statusConfig.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  المنتجات المطلوبة
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderItems.length > 0 ? (
                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                          <p className="text-sm text-gray-600">السعر: {parseFloat(item.price).toFixed(2)} جنيه</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            {(parseFloat(item.price) * item.quantity).toFixed(2)} جنيه
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>لا توجد تفاصيل للمنتجات متاحة</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  معلومات العميل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.user_name && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">اسم العميل</p>
                      <p className="font-medium">{order.user_name}</p>
                    </div>
                  </div>
                )}
                
                {order.phone_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">رقم الهاتف</p>
                      <p className="font-medium" dir="ltr">{order.phone_number}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  معلومات التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">عنوان التوصيل</p>
                    <p className="font-medium leading-relaxed">{order.delivery_address}, {order.city}</p>
                  </div>
                </div>

                {order.delivery_notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">ملاحظات التوصيل</p>
                      <p className="font-medium leading-relaxed">{order.delivery_notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">{subtotal.toFixed(2)} جنيه</span>
                </div>
                
                {deliveryFees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">رسوم التوصيل</span>
                    <span className="font-medium">{deliveryFees.toFixed(2)} جنيه</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>المجموع الكلي</span>
                  <span className="text-green-600">{parseFloat(order.total_amount).toFixed(2)} جنيه</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  معلومات الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">طريقة الدفع</p>
                    <p className="font-medium">
                      {order.payment_method === 'cash' ? 'نقداً عند الاستلام' : 'بطاقة ائتمان'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الطلب</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => window.print()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    طباعة الطلب
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/orders')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    عرض جميع الطلبات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}