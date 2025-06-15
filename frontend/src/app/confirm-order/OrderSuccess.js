"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Clock, Shield, ArrowLeft } from "lucide-react";

export default function OrderSuccess({ orderNumber }) {
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
              رقم الطلب: <span className="text-blue-600">#ORD-{orderNumber}</span>
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
