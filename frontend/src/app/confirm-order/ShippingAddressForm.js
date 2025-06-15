"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Ship, User } from "lucide-react";

export default function ShippingAddressForm({ form }) {
  return (
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
  );
}
