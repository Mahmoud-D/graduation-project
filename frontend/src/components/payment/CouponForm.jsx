import { Loader2 } from "lucide-react";
import { FormField, FormItem, FormControl, FormMessage, Input, Button, Alert, AlertDescription } from "@/components/ui";

export const CouponForm = ({ 
  control, 
  onValidateCoupon, 
  isValidatingCoupon, 
  couponError, 
  couponData 
}) => {
  return (
    <>
      <div className="flex gap-4">
        <FormField
          control={control}
          name="couponCode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="أدخل كود الخصم"
                  className="h-12 text-lg border-2 focus:border-purple-500 transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="button"
          onClick={() => onValidateCoupon()}
          className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isValidatingCoupon ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "تطبيق"
          )}
        </Button>
      </div>

      {isValidatingCoupon && (
        <div className="mt-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          <p className="text-gray-600 mt-2">جاري التحقق من الكوبون...</p>
        </div>
      )}

      {couponError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{couponError}</AlertDescription>
        </Alert>
      )}

      {couponData && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            تم تطبيق الخصم بنجاح! {couponData.discountValue} جنيه
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};