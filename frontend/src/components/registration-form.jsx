"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast, Toaster } from 'sonner';

export function RegistrationForm({ className, ...props }) {
  const router = useRouter();
  const pathname = usePathname();

  // Initial state values
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const initialErrors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  // Function to reset the form
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors(initialErrors);
    setLoading(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Reset form when route changes and comes back
  useEffect(() => {
    resetForm();
  }, []);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      password: value,
    }));

    if (!value) {
      setErrors(prev => ({ ...prev, password: "كلمة المرور مطلوبة" }));
    } else if (!validatePassword(value)) {
      setErrors(prev => ({
        ...prev,
        password: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، بما في ذلك حرف واحد كبير ورقم واحد"
      }));
    } else {
      setErrors(prev => ({ ...prev, password: "" }));
    }

    // Also validate confirm password when password changes
    if (formData.confirmPassword && value !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "كلمات المرور غير متطابقة" }));
    } else if (formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      confirmPassword: value,
    }));

    if (!value) {
      setErrors(prev => ({ ...prev, confirmPassword: "تأكيد كلمة المرور مطلوب" }));
    } else if (value !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: "كلمات المرور غير متطابقة" }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

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
      setErrors(prev => ({ ...prev, email: "البريد الإلكتروني مطلوب" }));
    } else if (!validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: "البريد الإلكتروني غير صالح" }));
    } else {
      setErrors(prev => ({ ...prev, email: "" }));
    }
  }

  const handleNameChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (!value) {
      setErrors(prev => ({ ...prev, [id]: `${id === 'firstName' ? 'الاسم الأول' : 'الاسم الأخير'} مطلوب` }));
    } else {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some(Boolean)) {
      toast.error('👀 صحّح الأخطاء الظاهرة قبل المتابعة');
      return;
    }

    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    });

    // Validate all fields before submission
    let hasErrors = false;
    const newErrors = { ...errors };

    if (!formData.firstName) {
      newErrors.firstName = "الاسم الأول مطلوب";
      hasErrors = true;
    }

    if (!formData.lastName) {
      newErrors.lastName = "الاسم الأخير مطلوب";
      hasErrors = true;
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors[0].message || "فشل التسجيل. يرجى المحاولة مرة أخرى.");
      }
      // Show verification message instead of redirecting
      setShowVerificationMessage(true);

    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message }));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={cn("flex justify-center items-center min-h-[80vh]", className)} {...props}>
      <Toaster position="top-center" richColors />
      {showVerificationMessage ? (
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-center space-y-1 border-b pb-8 pt-8">
            <CardTitle className="text-3xl font-bold mb-4">تم التسجيل بنجاح!</CardTitle>
            <CardDescription className="text-lg">
              لقد أرسلنا رسالة تحقق إلى بريدك الإلكتروني
              <div className="font-medium text-primary mt-2">{formData.email}</div>
              يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-6 pb-8">
            <Button
              onClick={() => router.push('/login')}
              className="px-8 cursor-pointer"
            >
              العودة إلى صفحة تسجيل الدخول
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-right space-y-1 border-b pb-8 pt-8">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">إنشاء حساب جديد</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  أدخل معلوماتك أدناه لإنشاء حسابك
                </CardDescription>
              </div>
              <UserPlus className="h-7 w-7 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label htmlFor="firstName" className="text-sm font-medium">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    placeholder="محمد"
                    value={formData.firstName}
                    onChange={handleNameChange}
                    className={`text-right placeholder:text-right h-11 text-base ${errors.firstName ? "border-red-500" : ""}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2 text-right">
                  <Label htmlFor="lastName" className="text-sm font-medium">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    placeholder="أحمد"
                    value={formData.lastName}
                    onChange={handleNameChange}
                    className={`text-right placeholder:text-right h-11 text-base ${errors.lastName ? "border-red-500" : ""}`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-6">
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

                <div className="space-y-2 text-right">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`text-right placeholder:text-right pr-3 h-11 text-base ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {errors.general && (
                <div className="text-red-500 text-sm font-medium text-right bg-red-50 p-4 rounded-md">
                  {errors.general}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium mt-2 cursor-pointer"
                disabled={loading}
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t pt-5 pb-6">
            <div className="w-full text-center text-base">
              لديك حساب بالفعل؟{" "}
              <a href="/login" className="text-primary font-medium hover:underline">
                تسجيل الدخول
              </a>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}