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
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import authEndpoints from "@/app/api/endPonts/auth";

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Initial state values
  const initialFormData = {
    email: "",
    password: "",
  };
  
  const initialErrors = {
    email: "",
    password: "",
    general: "",
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Function to reset the form
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors(initialErrors);
    setLoading(false);
    setShowPassword(false);
  };
  
  // Reset form when route changes and comes back
  useEffect(() => {
    resetForm();
  }, []);
  
  const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
      return false;
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      email: value,
    }));
    
    if (!value) {
      setErrors(prev => ({...prev, email: "البريد الإلكتروني مطلوب"}));
    } else if (!validateEmail(value)) {
      setErrors(prev => ({...prev, email: "البريد الإلكتروني غير صالح"}));
    } else {
      setErrors(prev => ({...prev, email: ""}));
    }
  };
  
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      password: value,
    }));
    
    if (!value) {
      setErrors(prev => ({...prev, password: "كلمة المرور مطلوبة"}));
    } else {
      setErrors(prev => ({...prev, password: ""}));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(initialErrors);
    
    // Validate all fields before submission
    let hasErrors = false;
    const newErrors = { ...errors };
    
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
      hasErrors = true;
    }
    
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authEndpoints.login(formData.email, formData.password);
      if (response.success) {
        const savedFormData = localStorage.getItem('orderFormData');
        if (savedFormData) {
          router.push('/confirm-order');
        } else {
          router.push("/");
        }
      } else {
        if (response.data?.errors?.[0]?.message) {
          setErrors(prev => ({
            ...prev,
            general: response.data?.errors[0].message
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            general: response.message || "فشل تسجيل الدخول، يرجى التحقق من بيانات الاعتماد الخاصة بك"
          }));
        }
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev, 
        general: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا."
      }));
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
              <CardTitle className="text-3xl font-bold mb-2">تسجيل الدخول</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                أدخل بيانات اعتمادك للوصول إلى حسابك
              </CardDescription>
            </div>
            <LogIn className="h-7 w-7 text-primary" />
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
                value={formData.email}
                onChange={handleEmailChange}
                className={`text-right placeholder:text-right h-11 text-base ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2 text-right">
              <Label htmlFor="password" className="text-sm font-medium">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className={`text-right placeholder:text-right pr-3 h-11 text-base ${errors.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            
            {errors.general && (
              <div className="text-red-500 text-sm font-medium text-right bg-red-50 p-4 rounded-md">
                {errors.general}
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <Button
                type="button"
                variant="link"
                className="text-primary p-0 h-auto font-medium hover:underline cursor-pointer"
                onClick={() => router.push('/forgot-password')}
              >
                نسيت كلمة المرور؟
              </Button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium mt-2 cursor-pointer" 
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
            
          </form>
        </CardContent>
        <CardFooter className="border-t pt-5 pb-6">
          <div className="w-full text-center text-base">
            ليس لديك حساب؟{" "}
            <a href="/register" className="text-primary font-medium hover:underline">
              سجل الآن
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}