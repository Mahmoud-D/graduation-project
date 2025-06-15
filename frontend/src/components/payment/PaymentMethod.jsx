import { CreditCard, Shield } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Image from "next/image";
import { 
  FormField, 
  FormItem, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  RadioGroupItem, 
  Badge, 
  Alert, 
  AlertDescription,
  Button,
  Loader2
} from "@/components/ui";

export const PaymentMethod = ({
  control,
  watch,
  paypalReady,
  onPayPalApprove,
  createPayPalOrder,
  isSubmitting,
  onSubmit
}) => {
  const paymentMethod = watch("paymentMethod");

  return (
    <>
      <FormField
        control={control}
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

              <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse rounded-xl border-2 border-blue-200 bg-blue-50 p-6 hover:bg-blue-100 transition-colors mt-4">
                <FormControl>
                  <RadioGroupItem
                    value="paypal"
                    className="text-blue-600"
                  />
                </FormControl>
                <div className="flex-1">
                  <FormLabel className="font-semibold text-lg cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Image 
                        src="/paypal-logo.png" 
                        alt="PayPal" 
                        width={60} 
                        height={20} 
                        className="h-5 object-contain"
                      />
                    </div>
                  </FormLabel>
                  <p className="text-sm text-gray-600 mt-1">
                    الدفع عبر حساب PayPal الخاص بك
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-600 text-white"
                >
                  متاح
                </Badge>
              </FormItem>
            </RadioGroup>
            <FormMessage className="pt-2 text-red-500" />
          </FormItem>
        )}
      />

      {paymentMethod === "paypal" && paypalReady && (
        <div className="mt-6">
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createPayPalOrder}
            onApprove={onPayPalApprove}
            onError={(err) => {
              console.error("PayPal error:", err);
            }}
          />
        </div>
      )}

      <Alert className="mt-6 bg-yellow-50 border-yellow-200">
        <Shield className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>ملاحظة:</strong> تأكد من فحص المنتجات قبل الدفع
        </AlertDescription>
      </Alert>

      {paymentMethod === "cash" && (
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
      )}
    </>
  );
};