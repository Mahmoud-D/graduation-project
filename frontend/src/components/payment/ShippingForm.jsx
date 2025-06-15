import { User, MapPin, Phone } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Input } from "@/components/ui";

export const ShippingForm = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
          control={control}
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
          control={control}
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
    </>
  );
};