"use client";

import { useState } from "react";
import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CategoryForm } from "@/components/shared/CategoryForm";
import { API } from "@/constant";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);

  const handleCategorySubmit = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      const response = await fetch(`${API}categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Close both dialogs and navigate to the categories page to see the new item
      setCategoryFormOpen(false);
      setDialogOpen(false);
      router.push("/dashboard/tables");
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => setDialogOpen(true)}
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Main Quick Create Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Create</DialogTitle>
              <DialogDescription>
                Create a new item quickly from here.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <p>Select what you want to create:</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategoryFormOpen(true);
                    setDialogOpen(false);
                  }}
                >
                  New Category
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  New Dish
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  New Coupon
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  New Promotion
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Category Form Dialog */}
        <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for your menu items.
              </DialogDescription>
            </DialogHeader>

            <CategoryForm
              onSubmit={handleCategorySubmit}
              onCancel={() => setCategoryFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <Link href={item.url}>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
