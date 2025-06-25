"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
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
import { Dish, DishCategory, DishCreate, DishResponse } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Memoized DishImage component to prevent unnecessary re-renders
const DishImage = memo(
  ({
    imagePath,
    dishName,
    onImageError,
  }: {
    imagePath: string | null;
    dishName: string;
    onImageError: (imagePath: string | null) => void;
  }) => {
    const [hasError, setHasError] = useState(false);

    const imageUrl = useMemo(() => {
      if (!imagePath || hasError) return "/images/placeholder-dish.svg";
      const path = imagePath.startsWith("uploads/")
        ? imagePath
        : `uploads/${imagePath}`;
      return `http://localhost:5000/api/${path}`;
    }, [imagePath, hasError]);

    const handleError = useCallback(() => {
      setHasError(true);
      onImageError(imagePath);
    }, [imagePath, onImageError]);

    if (!imagePath || hasError) {
      return (
        <div className="flex items-center justify-center w-20 h-20 text-xs rounded bg-muted text-muted-foreground">
          No img
        </div>
      );
    }

    return (
      <div className="relative w-20 h-20 overflow-hidden rounded">
        <Image
          src={imageUrl}
          alt={dishName}
          fill
          sizes="80px"
          className="object-cover"
          loading="lazy"
          onError={handleError}
        />
      </div>
    );
  }
);

DishImage.displayName = "DishImage";

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
  }); // Filtered and sorted data
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
  const fetchCategories = useCallback(async () => {
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
  }, []);
  // Fetch dishes from API
  const fetchDishes = useCallback(async () => {
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
  }, []);

  // Debug log only when dishes change
  useEffect(() => {
    if (dishes.length > 0) {
      console.log("Dishes loaded:", dishes.length, "items");
    }
  }, [dishes.length]);
  // Get category name by ID - now handles both string and number IDs
  const getCategoryNameById = useCallback(
    (categoryId: string | number) => {
      const category = categories.find(
        (c) =>
          c.category_id === categoryId.toString() ||
          c.category_id === categoryId
      );
      return category ? category.category_name : "Unknown";
    },
    [categories]
  );
  // Handle image load errors - just a callback, actual error handling is in DishImage component
  const handleImageError = useCallback((imagePath: string | null) => {
    if (imagePath) {
      console.log(`Failed to load image: ${imagePath}`);
    }
  }, []);

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
  }, [fetchCategories, fetchDishes, router]);
  // Memoized filtered and sorted dishes to prevent unnecessary recalculations
  const displayedDishes = useMemo(() => {
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
        dish.categories.some(
          (catName) =>
            // Filter by category name directly since categories are returned as names
            catName === getCategoryNameById(categoryFilter)
        )
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
    return result;
  }, [
    dishes,
    searchTerm,
    sortField,
    sortDirection,
    categoryFilter,
    getCategoryNameById,
  ]);

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
  }; // Handle form submission for new dish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", newDish.name);
      formData.append("description", newDish.description);
      formData.append("price", newDish.price.toString());

      // Backend expects category as array of numbers, not strings
      const categoryArray = newDish.category
        ? [parseInt(newDish.category)]
        : [];
      formData.append("category", JSON.stringify(categoryArray));

      // Append image if selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      } else {
        // Image is required by the backend
        throw new Error("Please select an image for the dish");
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
      // Show error to user
      alert(err instanceof Error ? err.message : "Failed to create dish");
    } finally {
      setIsSubmitting(false);
    }
  }; // Handle edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingDish) return;

    setIsSubmitting(true);

    try {
      // If image is being updated, use FormData, otherwise use JSON
      if (selectedImage) {
        const formData = new FormData();
        formData.append("name", editingDish.name);
        formData.append("description", editingDish.description);
        formData.append("price", editingDish.price.toString());
        formData.append(
          "category",
          JSON.stringify(
            editingDish.categories.map((catId) => parseInt(catId.toString()))
          )
        );
        formData.append("image", selectedImage);

        const response = await fetch(`${API}dishes/${editingDish.id}`, {
          method: "PUT",
          headers: getAuthHeaders(true),
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Error ${response.status}: ${errorData}`);
        }
      } else {
        // Update without image
        const updateData = {
          name: editingDish.name,
          description: editingDish.description,
          price: parseFloat(editingDish.price.toString()),
          category: editingDish.categories.map((catId) =>
            parseInt(catId.toString())
          ),
        };

        const response = await fetch(`${API}dishes/${editingDish.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Error ${response.status}: ${errorData}`);
        }
      }

      // Refresh dishes to get updated data
      await fetchDishes();
      setEditingDish(null);
      setSelectedImage(null);
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating dish:", err);
      alert(err instanceof Error ? err.message : "Failed to update dish");
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
        const errorData = await response.text();
        throw new Error(`Error ${response.status}: ${errorData}`);
      }

      // Refresh dishes after deletion
      await fetchDishes();
    } catch (err) {
      console.error("Error deleting dish:", err);
      alert(err instanceof Error ? err.message : "Failed to delete dish");
    }
  };
  // Open edit dialog
  const handleEdit = (dish: Dish) => {
    setEditingDish({ ...dish });
    setSelectedImage(null); // Reset image selection
    setEditDialogOpen(true);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="container py-10 mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">الأطباق</h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              // Reset form when dialog closes
              setNewDish({ name: "", description: "", price: 0, category: "" });
              setSelectedImage(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>إضافة طبق</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>إضافة طبق جديد</DialogTitle>
              <DialogDescription>
                أنشئ طبقًا جديدًا لقائمة الطعام الخاصة بك.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid items-center w-full gap-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  name="name"
                  value={newDish.name}
                  onChange={handleInputChange}
                  placeholder="اسم الطبق"
                  required
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Input
                  id="description"
                  name="description"
                  value={newDish.description}
                  onChange={handleInputChange}
                  placeholder="وصف الطبق"
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="price">السعر</Label>
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
                <Label htmlFor="category">الفئة</Label>
                <Select
                  name="category"
                  value={newDish.category}
                  onValueChange={(value) => {
                    setNewDish((prev) => ({ ...prev, category: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فئة" />
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
                <Label htmlFor="image">الصورة</Label>
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
                      تم اختيار: {selectedImage.name}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  إنشاء طبق
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) {
              setEditingDish(null);
              setSelectedImage(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>تعديل الطبق</DialogTitle>
              <DialogDescription>تحديث معلومات الطبق.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-name">الاسم</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingDish?.name || ""}
                  onChange={handleInputChange}
                  placeholder="اسم الطبق"
                  required
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-description">الوصف</Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={editingDish?.description || ""}
                  onChange={handleInputChange}
                  placeholder="وصف الطبق"
                />
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-price">السعر</Label>
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
                <Label htmlFor="edit-category">الفئة</Label>
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
                    <SelectValue placeholder="اختر فئة" />
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
                  </SelectContent>{" "}
                </Select>
              </div>

              <div className="grid items-center w-full gap-2">
                <Label htmlFor="edit-image">تحديث الصورة (اختياري)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {selectedImage && (
                    <div className="text-sm text-muted-foreground">
                      تم اختيار: {selectedImage.name}
                    </div>
                  )}
                </div>
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
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  حفظ التغييرات
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
            placeholder="ابحث عن الأطباق..."
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
              <SelectValue placeholder="تصفية حسب الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفئات</SelectItem>
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
          <span className="ml-2">جار التحميل...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-center rounded-md bg-destructive/10 text-destructive">
          <p>{error}</p>
          <Button onClick={fetchDishes} variant="outline" className="mt-2">
            حاول مرة أخرى
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>قائمة الأطباق في قائمتك</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">صورة</TableHead>
              <TableHead
                className="w-[150px] cursor-pointer"
                onClick={() => handleSort("name")}
              >
                الاسم <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead className="w-[300px]">الوصف</TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("price")}
              >
                السعر <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("averageRating")}
              >
                التقييم <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedDishes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  لا توجد أطباق{searchTerm ? " مطابقة لبحثك" : ""}
                </TableCell>
              </TableRow>
            ) : (
              displayedDishes.map((dish) => (
                <TableRow key={dish.id}>
                  <TableCell>
                    <DishImage
                      imagePath={dish.imagePath}
                      dishName={dish.name}
                      onImageError={handleImageError}
                    />
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
                    )}{" "}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(dish.categories)
                      ? dish.categories.join(", ")
                      : dish.categories}
                  </TableCell>
                  <TableCell className="text-right">
                    {dish.averageRating ? (
                      <div className="flex items-center justify-end">
                        <span>
                          ⭐{" "}
                          {parseFloat(dish.averageRating.toString()).toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        لا يوجد تقييمات
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
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(dish.id)}
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
    </div>
  );
}
