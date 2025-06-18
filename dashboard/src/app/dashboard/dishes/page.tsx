"use client";

import { useState, useEffect } from "react";
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
  Dish,
  DishCategory,
  DishCreate,
  DishResponse,
  DishUpdate,
} from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DishesPage() {
  // State for dishes
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<DishCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Table management states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Dish>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New dish form state
  const [newDish, setNewDish] = useState<DishCreate>({
    name: "",
    description: "",
    price: 0,
    category: "",
  });

  // Filtered and sorted data
  const [displayedDishes, setDisplayedDishes] = useState<Dish[]>(dishes);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const router = useRouter();

  const getAuthHeaders = (isFormData = false) => {
    const token = localStorage.getItem("authToken");
    return {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API}categories`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch dishes from API
  const fetchDishes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}dishes`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Map API data to our format
      const mappedData: Dish[] = data.map((item: DishResponse) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        oldPrice: item.old_price,
        imagePath: item.image_path,
        createdAt: item.created_at || new Date().toISOString().split("T")[0],
        averageRating: item.average_rating,
        categories: item.categories,
      }));

      setDishes(mappedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dishes");
      console.error("Error fetching dishes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(
    "image_path",
    dishes.map((d) => d.imagePath)
  );

  // Fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Authentication required. Please log in.");
      router.push("/login");
      return;
    }

    fetchCategories();
    fetchDishes();
  }, []);

  // Filter, sort and search dishes
  useEffect(() => {
    let result = [...dishes];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((dish) =>
        dish.categories.includes(categoryFilter)
      );
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

    setDisplayedDishes(result);
  }, [dishes, searchTerm, sortField, sortDirection, categoryFilter]);

  // Toggle sort direction
  const handleSort = (field: keyof Dish) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle numeric values
    if (name === "price") {
      const numericValue = parseFloat(value) || 0;

      if (editingDish) {
        setEditingDish({
          ...editingDish,
          [name]: numericValue,
        });
      } else {
        setNewDish((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      // Handle text values
      if (editingDish) {
        setEditingDish({
          ...editingDish,
          [name]: value,
        });
      } else {
        setNewDish((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Handle form submission for new dish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", newDish.name);
      formData.append("description", newDish.description);
      formData.append("price", newDish.price.toString());
      formData.append("category", newDish.category);

      // Append image if selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Don't set Content-Type header - browser will set it with boundary

      const response = await fetch(`${API}dishes`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh dishes after successful creation
      await fetchDishes();

      // Reset form and close dialog
      setNewDish({ name: "", description: "", price: 0, category: "" });
      setSelectedImage(null);
      setDialogOpen(false);
    } catch (err) {
      console.error("Error creating dish:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingDish) return;

    setIsSubmitting(true);

    try {
      // Prepare data for the API
      const updateData: DishUpdate = {
        id: editingDish.id,
        name: editingDish.name,
        description: editingDish.description,
        price: editingDish.price,
        category: editingDish.categories[0], // Assuming we're editing the first category
      };

      const response = await fetch(`${API}dishes/${editingDish.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh dishes to get updated data
      await fetchDishes();
      setEditingDish(null);
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating dish:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (dishId: string) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;

    try {
      const response = await fetch(`${API}dishes/${dishId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh dishes after deletion
      await fetchDishes();
    } catch (err) {
      console.error("Error deleting dish:", err);
    }
  };

  // Open edit dialog
  const handleEdit = (dish: Dish) => {
    setEditingDish({ ...dish });
    setEditDialogOpen(true);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    const category = categories.find((c) => c.category_id === categoryId);
    return category ? category.category_name : "Unknown";
  };

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dishes</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Dish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Dish</DialogTitle>
              <DialogDescription>
                Create a new dish for your menu.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid items-center w-full gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newDish.name}
                  onChange={handleInputChange}
                  placeholder="Dish name"
                  required
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newDish.description}
                  onChange={handleInputChange}
                  placeholder="Dish description"
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newDish.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  value={newDish.category}
                  onValueChange={(value) => {
                    setNewDish((prev) => ({ ...prev, category: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="image">Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {selectedImage && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {selectedImage.name}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Dish
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Dish</DialogTitle>
              <DialogDescription>Update dish information.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingDish?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Dish name"
                  required
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={editingDish?.description || ""}
                  onChange={handleInputChange}
                  placeholder="Dish description"
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingDish?.price || 0}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  name="category"
                  value={editingDish?.categories[0] || ""}
                  onValueChange={(value) => {
                    if (editingDish) {
                      setEditingDish({
                        ...editingDish,
                        categories: [value],
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            placeholder="Search dishes..."
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
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.category_name}
                </SelectItem>
              ))}
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
          <Button onClick={fetchDishes} variant="outline" className="mt-2">
            Try Again
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your menu dishes</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead
                className="w-[150px] cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("averageRating")}
              >
                Rating <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedDishes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No dishes found{searchTerm ? " matching your search" : ""}
                </TableCell>
              </TableRow>
            ) : (
              displayedDishes.map((dish) => (
                <TableRow key={dish.id}>                  <TableCell>
                    {dish.imagePath ? (
                      <div className="relative w-10 h-10 overflow-hidden rounded">
                        <Image
                          src={`http://localhost:5000/api/uploads/${dish.imagePath}`}
                          alt={dish.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 text-xs rounded bg-muted text-muted-foreground">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{dish.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {dish.description}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(dish.price)}
                    {dish.oldPrice && (
                      <span className="ml-2 text-xs line-through text-muted-foreground">
                        {formatPrice(dish.oldPrice)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {dish.categories
                      .map((catId) => getCategoryNameById(catId))
                      .join(", ")}
                  </TableCell>
                  <TableCell className="text-right">
                    {dish.average_rating ? (
                      <div className="flex items-center justify-end">
                        <span>⭐ {dish.average_rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No ratings
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEdit(dish)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(dish.id)}
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
