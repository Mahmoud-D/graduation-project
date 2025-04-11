"use client";
import LoginForm from "@/components/shared/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken"); // Or however you store auth state

    if (!token) {
      // Redirect to login if no authentication token found
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Show loading state or nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className="text-center h-screen  bg-gray-100">
      <h2 className="text-2xl font-bold pt-20"> Login</h2>
      <LoginForm />
    </main>
  );
}
