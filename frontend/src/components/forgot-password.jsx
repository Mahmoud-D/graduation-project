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
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import authEndpoints from "@/app/api/endPonts/auth";

export function ForgotPasswordForm({ className, ...props }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("البريد الإلكتروني مطلوب");
      return;
    }

    if (!validateEmail(email)) {
      setError("البريد الإلكتروني غير صالح");
      return;
    }

    setLoading(true);

    try {
      const response = await authEndpoints.sendResetPasswordEmail({ email });
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || "حدث خطأ أثناء إرسال رابط إعادة التعيين");
      }
    } catch (err) {
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
              <CardTitle className="text-3xl font-bold mb-2">استعادة كلمة المرور</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                أدخل بريدك الإلكتروني لإستعادة كلمة المرور
              </CardDescription>
            </div>
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-right">
              <Label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`text-right placeholder:text-right h-11 text-base ${error ? "border-red-500" : ""}`}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-right bg-red-50 p-4 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm font-medium text-right bg-green-50 p-4 rounded-md">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium cursor-pointer" 
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
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