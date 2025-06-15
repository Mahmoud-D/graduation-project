"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

export default function OrderSummary({
  items,
  subtotal,
  discountAmount,
  couponData,
  shippingFee,
  total,
}) {
  return (
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
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
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

              {couponData && (
                <>
                  <div className="flex justify-between text-lg text-green-600">
                    <span>الخصم</span>
                    <span className="font-semibold">{discountAmount} جنيه</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">المجموع بعد الخصم</span>
                    <span className="font-semibold">{subtotal - discountAmount} جنيه</span>
                  </div>
                </>
              )}

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
                <span className="text-purple-600">{total} جنيه</span>
              </div>
            </div>

            <div className="text-center pt-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                🚚 شحن مجاني للطلبات أكثر من 500 جنيه
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
