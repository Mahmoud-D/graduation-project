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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(2, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const API = process.env.NEXT_PUBLIC_API_URL || "https://restaurantbackground-production.up.railway.app/api/";
  const onSubmit = async (data: FormValues) => {
    try {
      // Add static role to request data
      const requestData = {
        ...data,
        role: "user", // Set your required static role value here
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
    }

    // For demonstration, just log the data to the console
    console.log("Form Submitted:", data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto mt-10 border p-8 rounded-md shadow-md bg-white "
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
