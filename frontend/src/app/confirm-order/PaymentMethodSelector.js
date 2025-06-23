'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PaymentMethodSelector({
  form,
  totalAmount,
  onPayPalSuccess,
  onPayPalError,
  currency = "USD",
}) {
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalError, setPaypalError] = useState(null);

  useEffect(() => {
    if (form.watch("paymentMethod") !== "paypal") return;

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`;
    script.async = true;
    script.onload = () => setPaypalReady(true);
    script.onerror = () => setPaypalError("فشل تحميل PayPal");
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [form.watch("paymentMethod"), currency]);

  const handlePayPalApprove = async (data, actions) => {
    try {
      await onPayPalSuccess(data);
    } catch (err) {
      setPaypalError("فشل عملية الدفع");
      if (onPayPalError) onPayPalError(err);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-4"
              >
                {/* خيار الدفع عند الاستلام */}
                <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse rounded-xl border-2 border-green-200 bg-green-50 p-6 hover:bg-green-100 transition-colors">
                  <FormControl>
                    <RadioGroupItem value="cash" className="text-green-600" />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="font-semibold text-lg cursor-pointer">
                      💵 الدفع عند الاستلام
                    </FormLabel>
                    <p className="text-sm text-gray-600 mt-1">
                      ادفع نقداً عند استلام طلبك
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    متاح
                  </Badge>
                </FormItem>

                {/* خيار الدفع عبر PayPal */}
                <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse rounded-xl border-2 border-blue-200 bg-blue-50 p-6 hover:bg-blue-100 transition-colors">
                  <FormControl>
                    <RadioGroupItem value="paypal" className="text-blue-600" />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="font-semibold text-lg cursor-pointer">
                      <span className="text-blue-600">🔵</span> الدفع عبر PayPal
                    </FormLabel>
                    <p className="text-sm text-gray-600 mt-1">
                      الدفع الآمن عبر حساب PayPal الخاص بك
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    متاح
                  </Badge>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* عرض أزرار PayPal عند الاختيار */}
      {form.watch("paymentMethod") === "paypal" && (
        <div className="mt-4 space-y-2">
          {paypalError ? (
            <Alert variant="destructive">
              <AlertDescription>{paypalError}</AlertDescription>
            </Alert>
          ) : !paypalReady ? (
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p>جاري تحميل خيارات الدفع...</p>
            </div>
          ) : (
            <PayPalScriptProvider
              options={{
                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency,
                "disable-funding": "credit,card",
              }}
            >
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "pill",
                  label: "paypal",
                  height: 48,
                }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: totalAmount.toString(),
                          currency_code: currency,
                        },
                      },
                    ],
                  });
                }}
                onApprove={handlePayPalApprove}
                onError={(err) => {
                  setPaypalError("حدث خطأ في عملية الدفع");
                  if (onPayPalError) onPayPalError(err);
                }}
              />
            </PayPalScriptProvider>
          )}

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              سيتم تحويل المبلغ من الجنيه المصري إلى الدولار الأمريكي
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertDescription className="text-yellow-800">
          <strong>ملاحظة:</strong> تأكد من فحص المنتجات قبل الدفع
        </AlertDescription>
      </Alert>
    </div>
  );
}