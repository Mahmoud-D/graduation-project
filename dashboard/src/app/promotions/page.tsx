"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Percent,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Promotion {
  id: number;
  dish_id: number;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  averageRating?: number;
}

interface PromotionFormData {
  dish_id: string;
  discount_percentage: string;
  start_date: string;
  end_date: string;
}

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );

  // Form data
  const [formData, setFormData] = useState<PromotionFormData>({
    dish_id: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
  });

  const [errors, setErrors] = useState<Partial<PromotionFormData>>({});

  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/promotions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      } else {
        toast.error("Failed to fetch promotions");
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Error fetching promotions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch dishes for dropdown
  const fetchDishes = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/dishes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDishes(data);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchDishes();
  }, []);
  // Get dish name by ID
  const getDishName = useMemo(() => {
    return (dishId: number) => {
      const dish = dishes.find((d) => d.id === dishId);
      return dish ? dish.name : `Dish #${dishId}`;
    };
  }, [dishes]);

  // Get dish details by ID
  const getDishDetails = (dishId: number) => {
    return dishes.find((d) => d.id === dishId);
  };
  // Filter and sort promotions
  const filteredAndSortedPromotions = useMemo(() => {
    const filtered = promotions.filter((promotion) => {
      const dishName = getDishName(promotion.dish_id).toLowerCase();
      const matchesSearch =
        dishName.includes(searchTerm.toLowerCase()) ||
        promotion.discount_percentage.toString().includes(searchTerm);

      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus = promotion.is_active;
      } else if (statusFilter === "inactive") {
        matchesStatus = !promotion.is_active;
      } else if (statusFilter === "current") {
        const now = new Date();
        const startDate = new Date(promotion.start_date);
        const endDate = new Date(promotion.end_date);
        matchesStatus =
          promotion.is_active && now >= startDate && now <= endDate;
      } else if (statusFilter === "upcoming") {
        const now = new Date();
        const startDate = new Date(promotion.start_date);
        matchesStatus = promotion.is_active && now < startDate;
      } else if (statusFilter === "expired") {
        const now = new Date();
        const endDate = new Date(promotion.end_date);
        matchesStatus = now > endDate;
      }

      return matchesSearch && matchesStatus;
    });

    // Sort promotions
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof Promotion] as
        | string
        | number;
      let bValue: string | number = b[sortBy as keyof Promotion] as
        | string
        | number;

      if (sortBy === "dish_name") {
        aValue = getDishName(a.dish_id);
        bValue = getDishName(b.dish_id);
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [promotions, searchTerm, statusFilter, sortBy, sortOrder, getDishName]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<PromotionFormData> = {};

    if (!formData.dish_id) {
      newErrors.dish_id = "Dish is required";
    }

    if (!formData.discount_percentage) {
      newErrors.discount_percentage = "Discount percentage is required";
    } else {
      const discount = parseFloat(formData.discount_percentage);
      if (isNaN(discount) || discount <= 0 || discount > 100) {
        newErrors.discount_percentage = "Discount must be between 1 and 100";
      }
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    } else if (
      formData.start_date &&
      new Date(formData.end_date) <= new Date(formData.start_date)
    ) {
      newErrors.end_date = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      dish_id: "",
      discount_percentage: "",
      start_date: "",
      end_date: "",
    });
    setErrors({});
  };

  // Handle create promotion
  const handleCreatePromotion = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dish_id: parseInt(formData.dish_id),
          discount_percentage: parseFloat(formData.discount_percentage),
          start_date: formData.start_date,
          end_date: formData.end_date,
        }),
      });

      if (response.ok) {
        toast.success("Promotion created successfully");
        setIsAddDialogOpen(false);
        resetForm();
        fetchPromotions();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create promotion");
      }
    } catch (error) {
      console.error("Error creating promotion:", error);
      toast.error("Error creating promotion");
    }
  };

  // Handle edit promotion
  const handleEditPromotion = async () => {
    if (!validateForm() || !selectedPromotion) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/promotions/${selectedPromotion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dish_id: parseInt(formData.dish_id),
            discount_percentage: parseFloat(formData.discount_percentage),
            start_date: formData.start_date,
            end_date: formData.end_date,
            is_active: selectedPromotion.is_active,
          }),
        }
      );

      if (response.ok) {
        toast.success("Promotion updated successfully");
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedPromotion(null);
        fetchPromotions();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update promotion");
      }
    } catch (error) {
      console.error("Error updating promotion:", error);
      toast.error("Error updating promotion");
    }
  };

  // Handle toggle promotion status
  const handleToggleStatus = async (promotion: Promotion) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/promotions/${promotion.id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(
          `Promotion ${
            promotion.is_active ? "deactivated" : "activated"
          } successfully`
        );
        fetchPromotions();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to toggle promotion status");
      }
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      toast.error("Error toggling promotion status");
    }
  };
  // Handle delete promotion
  const handleDeletePromotion = async (promotionId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/promotions/${promotionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Promotion deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedPromotion(null);
        fetchPromotions();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete promotion");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Error deleting promotion");
    }
  };

  // Open edit dialog
  const openEditDialog = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      dish_id: promotion.dish_id.toString(),
      discount_percentage: promotion.discount_percentage.toString(),
      start_date: promotion.start_date.split("T")[0], // Format for date input
      end_date: promotion.end_date.split("T")[0],
    });
    setIsEditDialogOpen(true);
  };

  // Open view dialog
  const openViewDialog = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsViewDialogOpen(true);
  };

  // Get promotion status
  const getPromotionStatus = (promotion: Promotion) => {
    if (!promotion.is_active) {
      return { label: "Inactive", variant: "secondary" as const };
    }

    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);

    if (now < startDate) {
      return { label: "Upcoming", variant: "outline" as const };
    } else if (now > endDate) {
      return { label: "Expired", variant: "destructive" as const };
    } else {
      return { label: "Active", variant: "default" as const };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading promotions...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Promotions Management
          </h1>
          <p className="text-muted-foreground">
            Manage dish promotions and discount offers
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Promotion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dish_id">Dish</Label>
                <Select
                  value={formData.dish_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, dish_id: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.dish_id ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a dish" />
                  </SelectTrigger>
                  <SelectContent>
                    {dishes.map((dish) => (
                      <SelectItem key={dish.id} value={dish.id.toString()}>
                        {dish.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dish_id && (
                  <p className="mt-1 text-sm text-red-500">{errors.dish_id}</p>
                )}
              </div>

              <div>
                <Label htmlFor="discount_percentage">Discount Percentage</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discount_percentage: e.target.value,
                    }))
                  }
                  className={errors.discount_percentage ? "border-red-500" : ""}
                  placeholder="e.g., 20"
                />
                {errors.discount_percentage && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.discount_percentage}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                  className={errors.start_date ? "border-red-500" : ""}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.start_date}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }
                  className={errors.end_date ? "border-red-500" : ""}
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePromotion}>Create Promotion</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Promotions
            </CardTitle>
            <Percent className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Active Promotions
            </CardTitle>
            <ToggleRight className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {promotions.filter((p) => p.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Current Promotions
            </CardTitle>
            <Calendar className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {
                promotions.filter((p) => {
                  const now = new Date();
                  const startDate = new Date(p.start_date);
                  const endDate = new Date(p.end_date);
                  return p.is_active && now >= startDate && now <= endDate;
                }).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Expired Promotions
            </CardTitle>
            <Calendar className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {
                promotions.filter((p) => {
                  const now = new Date();
                  const endDate = new Date(p.end_date);
                  return now > endDate;
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by dish name or discount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Created Date</SelectItem>
                <SelectItem value="start_date">Start Date</SelectItem>
                <SelectItem value="end_date">End Date</SelectItem>
                <SelectItem value="discount_percentage">Discount %</SelectItem>
                <SelectItem value="dish_name">Dish Name</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Promotions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Promotions List ({filteredAndSortedPromotions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dish</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPromotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No promotions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedPromotions.map((promotion) => {
                    const status = getPromotionStatus(promotion);
                    return (
                      <TableRow key={promotion.id}>
                        <TableCell className="font-medium">
                          {getDishName(promotion.dish_id)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {promotion.discount_percentage}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(promotion.start_date)}
                        </TableCell>
                        <TableCell>{formatDate(promotion.end_date)}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(promotion)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(promotion)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(promotion)}
                            >
                              {promotion.is_active ? (
                                <ToggleRight className="w-4 h-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-4 h-4 text-gray-400" />
                              )}
                            </Button>{" "}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPromotion(promotion);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_dish_id">Dish</Label>
              <Select
                value={formData.dish_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, dish_id: value }))
                }
              >
                <SelectTrigger
                  className={errors.dish_id ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a dish" />
                </SelectTrigger>
                <SelectContent>
                  {dishes.map((dish) => (
                    <SelectItem key={dish.id} value={dish.id.toString()}>
                      {dish.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dish_id && (
                <p className="mt-1 text-sm text-red-500">{errors.dish_id}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit_discount_percentage">
                Discount Percentage
              </Label>
              <Input
                id="edit_discount_percentage"
                type="number"
                min="1"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discount_percentage: e.target.value,
                  }))
                }
                className={errors.discount_percentage ? "border-red-500" : ""}
                placeholder="e.g., 20"
              />
              {errors.discount_percentage && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.discount_percentage}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit_start_date">Start Date</Label>
              <Input
                id="edit_start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
                className={errors.start_date ? "border-red-500" : ""}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit_end_date">End Date</Label>
              <Input
                id="edit_end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, end_date: e.target.value }))
                }
                className={errors.end_date ? "border-red-500" : ""}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
                setSelectedPromotion(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditPromotion}>Update Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promotion Details</DialogTitle>
          </DialogHeader>
          {selectedPromotion && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Promotion ID
                  </Label>
                  <p>{selectedPromotion.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={getPromotionStatus(selectedPromotion).variant}
                    >
                      {getPromotionStatus(selectedPromotion).label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Dish
                </Label>
                <p className="font-medium">
                  {getDishName(selectedPromotion.dish_id)}
                </p>
                {(() => {
                  const dish = getDishDetails(selectedPromotion.dish_id);
                  return dish ? (
                    <p className="text-sm text-muted-foreground">
                      {dish.description}
                    </p>
                  ) : null;
                })()}
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Discount Percentage
                </Label>
                <p className="text-2xl font-bold text-green-600">
                  {selectedPromotion.discount_percentage}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </Label>
                  <p>{formatDate(selectedPromotion.start_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    End Date
                  </Label>
                  <p>{formatDate(selectedPromotion.end_date)}</p>
                </div>
              </div>

              {(() => {
                const dish = getDishDetails(selectedPromotion.dish_id);
                return dish ? (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Original Price
                    </Label>
                    <p className="font-medium">${dish.price.toFixed(2)}</p>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Discounted Price
                    </Label>
                    <p className="text-lg font-bold text-green-600">
                      $
                      {(
                        dish.price *
                        (1 - selectedPromotion.discount_percentage / 100)
                      ).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You save: $
                      {(
                        dish.price *
                        (selectedPromotion.discount_percentage / 100)
                      ).toFixed(2)}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewDialogOpen(false);
                setSelectedPromotion(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>{" "}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Promotion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this promotion? This action cannot
              be undone.
            </p>
            {selectedPromotion && (
              <div className="p-4 mt-4 rounded-lg bg-gray-50">
                <p className="font-medium">
                  {getDishName(selectedPromotion.dish_id)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedPromotion.discount_percentage}% discount
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedPromotion(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedPromotion) {
                  handleDeletePromotion(selectedPromotion.id);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionsPage;
