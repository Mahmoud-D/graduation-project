"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { API } from "@/constant";
import { IconStar } from "@tabler/icons-react";

import data from "./data.json";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// User interface matching the API response
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
  is_verified: boolean;
}

// Rating interface
interface RatingResponse {
  average_rating: string;
}

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Your existing getAuthHeaders function
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Updated fetchUsers function to count both users and admins
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Count the number of admin users
      const admins = data.filter((user: User) => user.role === "admin");
      setAdminCount(admins.length);

      // Count regular users (assuming role is "user" for regular users)
      const regularUsers = data.filter((user: User) => user.role === "user");
      setUserCount(regularUsers.length);

      return {
        admins: admins.length,
        users: regularUsers.length,
        total: data.length,
      };
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsersError(
        err instanceof Error ? err.message : "Failed to fetch users"
      );
      return { admins: 0, users: 0, total: 0 };
    }
  };

  // New function to fetch average rating
  const fetchAverageRating = async () => {
    try {
      const response = await fetch(`${API}reports/OverallAverageRating`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.length > 0 && data[0].average_rating) {
        // Convert to number and round to 1 decimal place
        const rating = parseFloat(data[0].average_rating);
        setAverageRating(Math.round(rating * 10) / 10); // Round to 1 decimal
        return rating;
      }

      return null;
    } catch (err) {
      console.error("Error fetching average rating:", err);
      return null;
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");

    if (!token) {
      // Redirect to login if no authentication token found
      router.push("/login");
    } else {
      // Fetch all data after authentication check
      Promise.all([fetchUsers(), fetchAverageRating()]).then(() => {
        setIsLoading(false);
      });
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

  // Create custom cards array with the rating card
  const customCards = [
    {
      title: "متوسط التقييم",
      value: averageRating !== null ? `${averageRating} ★` : "لا توجد تقييمات",
      description: "التقييمات",
      icon: IconStar,
      footer: {
        title: "متوسط تقييم الأطباق",
        description: "متوسط جميع تقييمات المستخدمين",
      },
    },
    // You can add more custom cards here as needed
  ];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards
                adminCount={adminCount}
                userCount={userCount}
                customCards={customCards}
              />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
