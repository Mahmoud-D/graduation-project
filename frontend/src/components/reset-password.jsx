"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound } from "lucide-react";
import authEndpoints from "@/app/api/endPonts/auth";

export function ResetPasswordForm({ className, ...props }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!token) {
      setError("رابط إعادة تعيين كلمة المرور غير صالح");
      return;
    }

    if (!formData.password) {
      setError("كلمة المرور مطلوبة");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);

    try {
      const response = await authEndpoints.resetPassword({
        token,
        password: formData.password,
      });
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {

        console.log(response);
        
        setError(response.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
      }
    } catch (err) {
      console.log(err);
      
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center items-center min-h-[80vh]", className)} {...props}>
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-right space-y-1 border-b pb-8 pt-8">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">إعادة تعيين كلمة المرور</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                قم بإدخال كلمة المرور الجديدة
              </CardDescription>
            </div>
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-right">
              <Label htmlFor="password" className="text-sm font-medium">كلمة المرور الجديدة</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`text-right h-11 text-base ${error ? "border-red-500" : ""}`}
              />
            </div>

            <div className="space-y-2 text-right">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`text-right h-11 text-base ${error ? "border-red-500" : ""}`}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-right bg-red-50 p-4 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm font-medium text-right bg-green-50 p-4 rounded-md">
                تم إعادة تعيين كلمة المرور بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول...
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium cursor-pointer" 
              disabled={loading}
            >
              {loading ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="border-t pt-5 pb-6">
          <div className="w-full text-center text-base">
            <Button
              type="button"
              variant="link"
              className="text-primary font-medium hover:underline cursor-pointer"
              onClick={() => router.push('/login')}
            >
              العودة إلى تسجيل الدخول
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}