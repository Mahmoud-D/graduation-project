"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Search, X, Loader2 } from "lucide-react";
import { API } from "@/constant";
import { Category, CategoryResponse, CategoryUpdate } from "@/types";

// Define validation schema with Zod
const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "اسم التصنيف يجب أن يكون حرفين على الأقل")
    .max(50, "اسم التصنيف يجب أن يكون أقل من 50 حرف"),
  description: z
    .string()
    .min(5, "الوصف يجب أن يكون 5 أحرف على الأقل")
    .max(200, "الوصف يجب أن يكون أقل من 200 حرف")
    .optional(),
});

// Infer the type from the schema
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function TablesPage() {
  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Table management states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Category>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [itemCountFilter, setItemCountFilter] = useState<string>("all");

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Filtered and sorted data
  const [displayedCategories, setDisplayedCategories] =
    useState<Category[]>(categories);

  // Authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}categories`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Map API data to our format
      const mappedData: Category[] = data.map((item: CategoryResponse) => ({
        id: item.category_id,
        name: item.category_name,
        description: item.description,
        itemCount: item.dish_count,
        createdAt: item.created_at || new Date().toISOString().split("T")[0],
      }));

      setCategories(mappedData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter, sort and search categories
  useEffect(() => {
    let result = [...categories];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply item count filter
    if (itemCountFilter !== "all") {
      const filterNum = parseInt(itemCountFilter);
      if (itemCountFilter === "0") {
        result = result.filter((cat) => cat.itemCount === 0);
      } else if (itemCountFilter === "10+") {
        result = result.filter((cat) => cat.itemCount >= 10);
      } else {
        result = result.filter(
          (cat) => cat.itemCount < filterNum && cat.itemCount > 0
        );
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        // For numeric fields
        return sortDirection === "asc"
          ? (fieldA as number) - (fieldB as number)
          : (fieldB as number) - (fieldA as number);
      }
    });

    setDisplayedCategories(result);
  }, [categories, searchTerm, sortField, sortDirection, itemCountFilter]);

  // Toggle sort direction
  const handleSort = (field: keyof Category) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle form submission for new category
  const handleSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}categories`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh categories after successful creation
      await fetchCategories();

      // Reset form and close dialog
      createForm.reset();
      setDialogOpen(false);
    } catch (err) {
      console.error("Error creating category:", err);
      // You could set an error state here for the form
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit submission
  const handleEditSubmit = async (data: CategoryFormValues) => {
    if (!editingCategory) return;

    setIsSubmitting(true);

    try {
      // Prepare data for the API
      const updateData: CategoryUpdate = {
        category_id: editingCategory.id,
        name: data.name,
        description: data.description || "",
      };

      const response = await fetch(`${API}categories/${editingCategory.id}`, {
        method: "PUT", // Or PATCH depending on your API
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh categories to get updated data
      await fetchCategories();
      setEditingCategory(null);
      setEditDialogOpen(false);
      editForm.reset();
    } catch (err) {
      console.error("Error updating category:", err);
      // You could set an error state here for the form
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API}categories/${categoryToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh categories after deletion
      await fetchCategories();

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      // You could show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog
  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
    editForm.reset({
      name: category.name,
      description: category.description || "",
    });
    setEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container py-10 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"> التصنيفات </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button> إضافة تصنيف </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle> إضافة تصنيف جديد </DialogTitle>
              <DialogDescription>إضافة تصنيف جديد للأطباق</DialogDescription>
            </DialogHeader>

            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-2 items-center w-full">
                  <Label htmlFor="name"> الاسم </Label>
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="name"
                            {...field}
                            placeholder="اسم التصنيف"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2 items-center w-full">
                  <Label htmlFor="description"> الوصف </Label>
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="description"
                            {...field}
                            placeholder="Category description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    )}
                    إضافة تصنيف
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل التصنيف</DialogTitle>
              <DialogDescription>تعديل التصنيف الحالي</DialogDescription>
            </DialogHeader>

            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleEditSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-2 items-center w-full">
                  <Label htmlFor="edit-name"> الاسم </Label>
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="edit-name"
                            {...field}
                            placeholder="Category name"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2 items-center w-full">
                  <Label htmlFor="edit-description"> الوصف </Label>
                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="edit-description"
                            {...field}
                            placeholder="Category description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setEditDialogOpen(false)}
                    className="mr-2"
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    )}
                    حفظ التعديلات
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="w-full md:w-52">
          <Select value={itemCountFilter} onValueChange={setItemCountFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التصنيفات</SelectItem>
              <SelectItem value="0">فارغ (0 عناصر)</SelectItem>
              <SelectItem value="10">أقل من 10</SelectItem>
              <SelectItem value="10+">10 أو أكثر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading and error states */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-4 text-center rounded-md bg-destructive/10 text-destructive">
          <p>{error}</p>
          <Button onClick={fetchCategories} variant="outline" className="mt-2">
            Try Again
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>قائمة التصنيفات</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[150px] cursor-pointer"
                onClick={() => handleSort("name")}
              >
                الاسم <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead className="w-[300px]">الوصف</TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("itemCount")}
              >
                الأطباق <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                التاريخ <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  لا يوجد تصنيفات{searchTerm ? " مطابقة لبحثك" : ""}
                </TableCell>
              </TableRow>
            ) : (
              displayedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell className="text-right">
                    {category.itemCount}
                  </TableCell>
                  <TableCell className="text-right">
                    {category.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEdit(category)}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(category)}
                    >
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد حذف التصنيف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد حذف التصنيف{" "}
              <span className="font-semibold">{categoryToDelete?.name}</span>؟
              هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "حذف التصنيف"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
