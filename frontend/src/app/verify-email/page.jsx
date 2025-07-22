import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient.jsx";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>جاري التحقق...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
