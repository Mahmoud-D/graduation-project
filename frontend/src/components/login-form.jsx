"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import authEndpoints from "@/app/api/endPonts/auth";
 
export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };





  const handleLogin = async () => {
    const result = await loginUser(email, password);
    if (result.success) {
      setMessage('Login successful!');
      // يمكنك إعادة توجيه المستخدم إلى الصفحة الرئيسية أو إلى أي صفحة أخرى بعد تسجيل الدخول
    } else {
      setMessage(result.message);
    }
  };



  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authEndpoints.login({
        email: formData.email,
        password: formData.password,
      });

    

      const data = await response;

      if (!response.token) {
        throw new Error(data.message || "Login failed");
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      
      // Redirect to / or home page
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-right">
          <CardTitle>تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بيانات اعتمادك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2 text-right">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="text-right placeholder:text-right"
                />
              </div>
              <div className="grid gap-2 text-right">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="text-right placeholder:text-right"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-right">{error}</div>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-right">
              ليس لديك حساب؟{" "}
              <a href="/register" className="underline underline-offset-4">
                سجل الآن
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 