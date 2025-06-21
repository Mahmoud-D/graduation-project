"use client";

import { useState, useEffect } from "react";
import { z } from "zod"; // Make sure to import zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  Category,
  CategoryCreate,
  CategoryResponse,
  CategoryUpdate,
} from "@/types";

// Define validation schema with Zod
const categoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New category form state
  const [newCategory, setNewCategory] = useState<CategoryCreate>({
    name: "",
    description: "",
  });

  // Filtered and sorted data
  const [displayedCategories, setDisplayedCategories] =
    useState<Category[]>(categories);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}categories`);

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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        [name]: value,
      });
    } else {
      setNewCategory((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission for new category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh categories after successful creation
      await fetchCategories();

      // Reset form and close dialog
      setNewCategory({ name: "", description: "" });
      setDialogOpen(false);
    } catch (err) {
      console.error("Error creating category:", err);
      // You could set an error state here for the form
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCategory) return;

    setIsSubmitting(true);

    try {
      // Prepare data for the API
      const updateData: CategoryUpdate = {
        category_id: editingCategory.id,
        name: editingCategory.name,
        description: editingCategory.description,
      };

      const response = await fetch(`${API}categories/${editingCategory.id}`, {
        method: "PUT", // Or PATCH depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh categories to get updated data
      await fetchCategories();
      setEditingCategory(null);
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating category:", err);
      // You could set an error state here for the form
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`${API}categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh categories after deletion
      await fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      // You could show an error toast here
    }
  };

  // Open edit dialog
  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
    setEditDialogOpen(true);
  };

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for your menu items.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid items-center w-full gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  placeholder="Category name"
                  required
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  placeholder="Category description"
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update category information.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingCategory?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Category name"
                  required
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={editingCategory?.description || ""}
                  onChange={handleInputChange}
                  placeholder="Category description"
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditDialogOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
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
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="0">Empty (0 items)</SelectItem>
              <SelectItem value="10">Less than 10</SelectItem>
              <SelectItem value="10+">10 or more</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading and error states */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
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
          <TableCaption>A list of your menu categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[150px] cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("itemCount")}
              >
                Items <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Created <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No categories found{searchTerm ? " matching your search" : ""}
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
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
