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

export function RegistrationForm({ className, ...props }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: "user",
        }),
      });

      const data = await response.json();
      
console.log("data ---- ",data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      
      router.push("/login");
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
          <CardTitle>إنشاء حساب جديد</CardTitle>
          <CardDescription>
            أدخل معلوماتك أدناه لإنشاء حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2 text-right">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    placeholder="محمد"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="text-right placeholder:text-right"
                  />
                </div>
                <div className="grid gap-2 text-right">
                  <Label htmlFor="lastName">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    placeholder="أحمد"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="text-right placeholder:text-right"
                  />
                </div>
              </div>
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
              <div className="grid gap-2 text-right">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
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
                  {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-right">
              لديك حساب بالفعل؟{" "}
              <a href="/login" className="underline underline-offset-4">
                تسجيل الدخول
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 