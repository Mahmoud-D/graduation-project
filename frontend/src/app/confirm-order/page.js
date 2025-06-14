// app/payment/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CreditCard,
  Package,
  Ship,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Clock,
  Shield,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "الاسم يجب أن يكون على الأقل حرفين." })
    .max(50, { message: "الاسم طويل جداً." })
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, "الاسم يجب أن يحتوي فقط على حروف عربية أو إنجليزية ومسافات"),
  address: z
    .string()
    .min(10, {
      message: "العنوان يجب أن يكون مفصلاً أكثر (10 أحرف على الأقل).",
    })
    .max(200, { message: "العنوان طويل جداً." }),
  city: z
    .string()
    .min(2, { message: "اسم المدينة مطلوب." })
    .max(30, { message: "اسم المدينة طويل جداً." }),
  phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, {
    message: "رقم الهاتف يجب أن يكون مصري صحيح (01xxxxxxxxx).",
  }),
  paymentMethod: z.enum(["cash"], {
    required_error: "يجب اختيار طريقة الدفع.",
  }),
});

export default function EnhancedPaymentPage() {
  const { items, clearCart } = useCart();
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingFee = 35;
  const total = subtotal + shippingFee;
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
      paymentMethod: "cash",
    },
    mode: "onChange",
  });

  function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  const createOrder = async (payload) => {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // pull out the error message from your controller
      const err = await res.json();
      throw new Error(err.message || "Failed to create order");
    }
    return res.json();
  };

  const onSubmit = async (data) => {
    const dishes = items.map((item) => ({dishId: item.id, quantity: item.quantity}));
    const orderPayload = {
      dishes,
      payment_method: data.paymentMethod,
      delivery_address: data.address,
      city: data.city,
      phone_number: data.phone,
      coupon_id: null,
      status: "pending",
    };

    setIsSubmitting(true);
    const res = await createOrder(orderPayload);
    if (res?.ok) {
      setIsSubmitting(false);
      setOrderNumber(res.orderId);
      clearCart();
      setIsOrderConfirmed(true);
    }
  };

  if (isOrderConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center shadow-2xl border-0">
          <CardHeader className="pb-8 pt-16">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full w-32 h-32 mx-auto animate-pulse"></div>
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto relative animate-bounce" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-800 mt-8">
              تم تأكيد طلبك بنجاح! 🎉
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 mt-4">
              شكراً لك على ثقتك بنا
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-16">
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                <Package className="w-5 h-5" />
                رقم الطلب: #ORD-
                {orderNumber}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                المدة المتوقعة للتسليم: 1 ساعة
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200 mb-8">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                سنتواصل معك عند خروج الطلب من المطعم
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <span className="mr-3 font-medium">معلومات الشحن</span>
            </div>
            <div className="w-16 h-1 bg-blue-200"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="mr-3 text-gray-600">تأكيد الطلب</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            إتمام الطلب
          </h1>
          <p className="text-gray-600 text-lg">
            املأ البيانات المطلوبة لإتمام عملية الشراء
          </p>
        </div>
                        <button onClick={onSubmit}>fetch</button>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12"
          >
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-0 overflow-hidden">
                <div className="p-1">
                  <div className="bg-white rounded-t-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                          <Ship className="w-5 h-5 text-blue-600" />
                        </div>
                        <span>عنوان الشحن</span>
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        يرجى إدخال عنوان التسليم بدقة
                      </CardDescription>
                    </CardHeader>
                  </div>
                </div>
                <CardContent className="space-y-6 p-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-700">
                          <User className="w-4 h-4" />
                          اسم المستخدم
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: أحمد محمد علي"
                            className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-700">
                          <MapPin className="w-4 h-4" />
                          العنوان بالتفصيل
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: ١٢٣ شارع النصر، مبنى ٥، الدور الثالث، شقة ٧"
                            className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700">
                            المدينة
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: القاهرة"
                              className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-700">
                            <Phone className="w-4 h-4" />
                            رقم الهاتف
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="01xxxxxxxxx"
                              className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 overflow-hidden">
                <div>
                  <div className="bg-white rounded-t-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <span>طريقة الدفع</span>
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        اختر طريقة الدفع المناسبة لك
                      </CardDescription>
                    </CardHeader>
                  </div>
                </div>
                <CardContent className="p-8">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse rounded-xl border-2 border-green-200 bg-green-50 p-6 hover:bg-green-100 transition-colors">
                            <FormControl>
                              <RadioGroupItem
                                value="cash"
                                className="text-green-600"
                              />
                            </FormControl>
                            <div className="flex-1">
                              <FormLabel className="font-semibold text-lg cursor-pointer">
                                💵 الدفع عند الاستلام
                              </FormLabel>
                              <p className="text-sm text-gray-600 mt-1">
                                ادفع نقداً عند استلام طلبك
                              </p>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-green-600 text-white"
                            >
                              متاح
                            </Badge>
                          </FormItem>
                        </RadioGroup>
                        <FormMessage className="pt-2 text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Alert className="mt-6 bg-yellow-50 border-yellow-200">
                    <Shield className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>ملاحظة:</strong> تأكد من فحص المنتجات قبل الدفع
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-xl py-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    جاري تأكيد الطلب...
                  </>
                ) : (
                  <>✨ تأكيد الطلب الآن</>
                )}
              </Button>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="shadow-2xl border-0 overflow-hidden">
                  <div>
                    <div className="bg-white rounded-t-lg">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                            <Package className="w-5 h-5 text-purple-600" />
                          </div>
                          <span>ملخص الطلب</span>
                        </CardTitle>
                      </CardHeader>
                    </div>
                  </div>
                  <CardContent className="space-y-6 p-8">
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative w-8 h-8">
                              <Image
                                src="/placeholder-dish.png"
                                alt={item.name}
                                fill
                                className="object-cover rounded-sm"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                الكمية: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-purple-600">
                            {item.price * item.quantity} جنيه
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-3">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">المجموع الفرعي</span>
                        <span className="font-semibold">{subtotal} جنيه</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">رسوم الشحن</span>
                        <span className="font-semibold">
                          {subtotal >= 500 ? 0 : shippingFee} جنيه
                        </span>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                      <div className="flex justify-between font-bold text-2xl text-gray-800">
                        <span>الإجمالي</span>
                        <span className="text-purple-600">
                          {subtotal >= 500 ? subtotal : total} جنيه
                        </span>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        🚚 شحن مجاني للطلبات أكثر من 500 جنيه
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
