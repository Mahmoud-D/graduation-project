"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { API } from "@/constant";
import { useState } from "react";

const formSchema = z.object({
  // name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("البريد الالكتروني غير صالح"),
  password: z.string().min(2, "كلمة المرور يجب أن يكون أكثر من حرفين"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Add static role to request data
      const requestData = {
        ...data,
        role: "admin", // Set your required static role value here
      };

      // Handle form submission, e.g., send data to an API endpoint
      const response = await fetch(`${API}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // Send the enhanced data with role
      });

      const responseData = await response.json();
      if (response.ok) {
        // Save the auth token to localStorage
        localStorage.setItem("authToken", responseData.token);

        // Optionally save other user data
        if (responseData.user) {
          localStorage.setItem("userData", JSON.stringify(responseData.user));
        }

        console.log("Login successful");

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        // Handle error response
        console.error("Login failed:", responseData.message || "Unknown error");
        // You could set an error state here to display to the user
      }

      console.log("Success:", responseData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }

    // For demonstration, just log the data to the console
    console.log("Form Submitted:", data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-8 mx-auto mt-10 space-y-4 max-w-md bg-white rounded-md border shadow-md"
      >
        {/* <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الالكتروني</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="cursor-pointer">
          {" "}
          {isLoading ? "جاري التسجيل..." : "تسجيل الدخول"}{" "}
        </Button>
      </form>
    </Form>
  );
}
