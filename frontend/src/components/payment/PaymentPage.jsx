"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Package, 
  Ship, 
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import authService from "@/app/api/endPonts/auth";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { OrderConfirmation } from "./OrderConfirmation";
import { ShippingForm } from "./ShippingForm";
import { CouponForm } from "./CouponCodeCard";
import { PaymentMethod } from "./PaymentMethod";
import { OrderSummary } from "./OrderSummary";
import { CheckoutStepper } from "./CheckoutStepper";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "الاسم يجب أن يكون على الأقل حرفين." })
    .max(50, { message: "الاسم طويل جداً." })
    .regex(
      /^[a-zA-Z\u0600-\u06FF\s]+$/,
      "الاسم يجب أن يحتوي فقط على حروف عربية أو إنجليزية ومسافات"
    ),
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
  paymentMethod: z.enum(["cash", "paypal"], {
    required_error: "يجب اختيار طريقة الدفع.",
  }),
  couponCode: z.string().optional(),
});

export default function PaymentPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 35;
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [{ isPending }] = usePayPalScriptReducer();

  const form = useForm({
    resolver: zodResolver(formSchema),
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
      localStorage.removeItem("orderFormData");
    }
  }, [form]);

  useEffect(() => {
    if (!isPending) {
      setPaypalReady(true);
    }
  }, [isPending]);

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

    if (data.paymentMethod === "paypal") {
      return; // Let PayPal button handle the submission
    }

    await processOrder(data);
  };

  const processOrder = async (data) => {
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
      coupon_id: couponData?.[0]?.code || null,
      status: "pending",
      total_amount: calculateTotal(),
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
      console.error("Order creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createPayPalOrder = async (data) => {
    try {
      const orderPayload = {
        dishes: items.map((item) => ({
          dishId: item.id,
          quantity: item.quantity,
        })),
        payment_method: "paypal",
        delivery_address: data.address,
        city: data.city,
        phone_number: data.phone,
        coupon_id: couponData?.[0]?.code || null,
        status: "pending",
        total_amount: calculateTotal(),
      };

      const response = await createOrder(orderPayload);
      if (response?.ok) {
        return response.order1.order_id;
      }
      throw new Error("Failed to create order");
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };

  const onPayPalApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      setOrderNumber(details.id);
      clearCart();
      setIsOrderConfirmed(true);
      return details;
    } catch (error) {
      console.error("PayPal approval error:", error);
      throw error;
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

      if (!response.ok) {
        throw new Error(data.message || "Invalid coupon code");
      }

      setCouponData(data);
      setCouponError(null);
    } catch (error) {
      setCouponData(null);
      setCouponError(error.message);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const calculateDiscount = () => {
    if (couponData && couponData[0].discount_value) {
      return subtotal * (couponData[0].discount_value / 100);
    }
    return 0;
  };

  const calculateTotal = () => {
    let finalTotal = subtotal;
    const discountAmount = calculateDiscount();
    finalTotal = finalTotal - discountAmount;

    if (finalTotal < 500) {
      finalTotal += shippingFee;
    }
    return finalTotal;
  };

  const total = calculateTotal();
  const discountAmount = calculateDiscount();

  if (isOrderConfirmed) {
    return (
      <OrderConfirmation 
        orderNumber={orderNumber} 
        onReturnHome={() => router.push("/")} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 md:p-8">
        <CheckoutStepper currentStep={currentStep} />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            إتمام الطلب
          </h1>
          <p className="text-gray-600 text-lg">
            املأ البيانات المطلوبة لإتمام عملية الشراء
          </p>
        </div>

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
                  <ShippingForm control={form.control} />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 overflow-hidden">
                <div>
                  <div className="bg-white rounded-t-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                          <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <span>كود الخصم</span>
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        أدخل كود الخصم إذا كان لديك
                      </CardDescription>
                    </CardHeader>
                  </div>
                </div>
                <CardContent className="p-8">
                  <CouponForm
                    control={form.control}
                    onValidateCoupon={() => validateCoupon(form.getValues("couponCode"))}
                    isValidatingCoupon={isValidatingCoupon}
                    couponError={couponError}
                    couponData={couponData}
                  />
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
                  <PaymentMethod
                    control={form.control}
                    watch={form.watch}
                    paypalReady={paypalReady}
                    onPayPalApprove={onPayPalApprove}
                    createPayPalOrder={() => createPayPalOrder(form.getValues())}
                    isSubmitting={isSubmitting}
                    onSubmit={onSubmit}
                  />
                </CardContent>
              </Card>
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
                    <OrderSummary
                      items={items}
                      subtotal={subtotal}
                      discountAmount={discountAmount}
                      shippingFee={shippingFee}
                      total={total}
                    />
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