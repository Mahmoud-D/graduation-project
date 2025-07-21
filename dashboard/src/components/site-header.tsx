"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Redirect to login page
    router.push("/login");
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex gap-1 items-center px-4 w-full lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">نظرة عامة</h1>
        <div className="flex gap-2 items-center ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex gap-2 items-center text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
