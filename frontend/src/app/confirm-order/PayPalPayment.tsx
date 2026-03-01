'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PayPalPayment({
  amount,
  currency = "USD",
  onSuccess,
  onError,
  disabled = false,
}) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      setError("PayPal غير متاح حالياً");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`;
    script.async = true;
    script.onload = () => setIsReady(true);
    script.onerror = () => setError("فشل تحميل PayPal");
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [currency]);

  const handleApprove = async (data, actions) => {
    try {
      await onSuccess(data);
    } catch (err) {
      setError("فشل عملية الدفع");
      if (onError) onError(err);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>جاري تحميل خيارات الدفع...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
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
          disabled={disabled}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: currency,
                  },
                },
              ],
            });
          }}
          onApprove={handleApprove}
          onError={(err) => {
            setError("حدث خطأ في عملية الدفع");
            if (onError) onError(err);
          }}
        />
      </PayPalScriptProvider>

      <Alert className="bg-blue-50 border-blue-200 mt-2">
        <AlertDescription className="text-blue-800">
          سيتم تحويل المبلغ من الجنيه المصري إلى الدولار الأمريكي
        </AlertDescription>
      </Alert>
    </div>
  );
}