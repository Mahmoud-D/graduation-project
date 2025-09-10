"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
