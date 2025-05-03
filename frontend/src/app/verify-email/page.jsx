'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import authEndpoints from "@/app/api/endPonts/auth";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return setVerificationStatus('error');

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    authEndpoints.verifyEmail(token)
      .then((res) => {
        console.log(res);
        if (!res.success) {
          setProgress(100);
          return setVerificationStatus('error');
        }
        setProgress(100);
        setVerificationStatus('success');
        setTimeout(() => router.push('/login'), 3000);
      })
      .catch(() => {
        setProgress(100);
        setVerificationStatus('error');
      });

    return () => clearInterval(progressInterval);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center font-arabic">تأكيد البريد الإلكتروني</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="w-full" />
          
          {verificationStatus === 'verifying' && (
            <div className="text-center space-y-4">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
              <p className="text-muted-foreground font-arabic">جاري التحقق من بريدك الإلكتروني...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <div className="space-y-2">
                <p className="text-green-600 font-medium font-arabic">تم تأكيد البريد الإلكتروني بنجاح!</p>
                <p className="text-sm text-muted-foreground font-arabic">جاري التحويل إلى صفحة تسجيل الدخول...</p>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-red-500" />
              <div className="space-y-2">
                <p className="text-red-600 font-medium font-arabic">
                  فشل تأكيد البريد الإلكتروني. قد يكون الرابط غير صالح أو منتهي الصلاحية.
                </p>
                <Button 
                  onClick={() => router.push('/login')}
                  className="mt-4 font-arabic"
                >
                  الذهاب إلى تسجيل الدخول
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;