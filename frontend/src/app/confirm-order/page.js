// app/payment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Package,
  Ship,
  MapPin,
  Phone,
  User,
  Shield,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import authService from "@/app/api/endPonts/auth";

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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { paymentFormSchema } from "./paymentFormSchema";
import OrderSummary from "./OrderSummary";
import CheckoutSteps from "./CheckoutSteps";
import OrderSuccess from "./OrderSuccess";
import CouponInput from "./CouponInput";


// أضف هذه الاستيرادات في أعلى الملف
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CheckCircle2 } from "lucide-react";



export default function EnhancedPaymentPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingFee = 35;
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const form = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
      paymentMethod: "cash",
      couponCode: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const savedFormData = localStorage.getItem("orderFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      form.reset(parsedData);
      localStorage.removeItem("orderFormData"); // Clear saved data after restoring
    }
  }, [form]);

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
      const err = await res.json();
      throw new Error(err.message || "Failed to create order");
    }
    return res.json();
  };

  const onSubmit = async (data) => {
    if (!authService.isAuthenticated()) {
      localStorage.setItem("orderFormData", JSON.stringify(data));
      router.push("/login");
      return;
    }

    const dishes = items.map((item) => ({
      dishId: item.id,
      quantity: item.quantity,
    }));
    const orderPayload = {
      dishes,
      payment_method: data.paymentMethod,
      delivery_address: data.address,
      city: data.city,
      phone_number: data.phone,
      coupon_code: couponData?.[0]?.code || null,
      status: "pending",
    };

    setIsSubmitting(true);
    try {
      const res = await createOrder(orderPayload);
      if (res?.ok) {
        setOrderNumber(res.order1?.order_id);
        clearCart();
        setIsOrderConfirmed(true);
      }
    } catch (error) {
      // Handle error appropriately
      console.error("Order creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCoupon = async (code) => {
    if (!code) {
      setCouponData(null);
      setCouponError(null);
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/coupons/${code}`);
      const data = await response.json();
      if (response.ok) {
        const coupon = data[0];
        const myOrders = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const ordersData = await myOrders.json();
        const isCouponUsed = ordersData.orders.find(
          (o) => o.coupon_id === coupon.id
        );

        if (isCouponUsed) {
          setCouponError("هذا الكوبون تم استخدامه بالفعل في طلب سابق");
          setCouponData(null);
          setIsValidatingCoupon(false);
          return;
        }
        if (coupon.is_expired) {
          setCouponError("هذا الكوبون منتهي الصلاحية");
          setCouponData(null);
        } else if (coupon.max_uses <= coupon.current_uses) {
          setCouponError("هذا الكوبون تم استخدامه الحد الأقصى من المرات");
          setCouponData(null);
        } else {
          setCouponData(data);
          setCouponError(null);
        }
      } else {
        setCouponError(data.message || "كوبون غير صالح");
        setCouponData(null);
      }
    } catch (error) {
      setCouponData(null);
      setCouponError(error.message);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Add this function to calculate discount
  const calculateDiscount = () => {
    if (couponData && couponData[0].discount_value) {
      return subtotal * (couponData[0].discount_value / 100);
    }
    return 0;
  };

  // Modify the calculateTotal function
  const calculateTotal = () => {
    let finalTotal = subtotal;
    const discountAmount = calculateDiscount();
    finalTotal = finalTotal - discountAmount;

    // Add shipping fee if order is less than 500
    if (finalTotal < 500) {
      finalTotal += shippingFee;
    }
    return finalTotal;
  };

  const total = calculateTotal();
  const discountAmount = calculateDiscount();

  if (isOrderConfirmed) {
    return <OrderSuccess orderNumber={orderNumber} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 md:p-8">
        <CheckoutSteps currentStep={currentStep} />

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
                <CouponInput
                  form={form}
                  validateCoupon={validateCoupon}
                  isValidatingCoupon={isValidatingCoupon}
                  couponData={couponData}
                  couponError={couponError}
                  discountAmount={discountAmount}
                />
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

            <OrderSummary
              items={items}
              subtotal={subtotal}
              discountAmount={discountAmount}
              couponData={couponData}
              shippingFee={shippingFee}
              total={total}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
