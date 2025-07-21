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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Search, X, Plus, Edit, Trash2 } from "lucide-react";
import { API } from "@/constant";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Coupon interface
interface Coupon {
  id: string;
  code: string;
  discount_value: string;
  min_order: string;
  start_date: string;
  end_date: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  user_max_uses: number;
}

// Form validation schema
const couponFormSchema = z.object({
  code: z.string().min(3, "الكود يجب أن يكون 3 أحرف على الأقل"),
  discount_value: z.string().min(1, "قيمة الخصم مطلوبة"),
  min_order: z.string().min(1, "الحد الأدنى للطلب مطلوب"),
  start_date: z.string().min(1, "تاريخ البداية مطلوب"),
  end_date: z.string().min(1, "تاريخ الانتهاء مطلوب"),
  max_uses: z.string().min(1, "الحد الأقصى للاستخدام مطلوب"),
  user_max_uses: z.string().min(1, "الحد الأقصى للاستخدام لكل مستخدم مطلوب"),
  is_active: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

export default function CouponsPage() {
  // State variables
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [displayedCoupons, setDisplayedCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const createForm = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      discount_value: "",
      min_order: "",
      start_date: "",
      end_date: "",
      max_uses: "",
      user_max_uses: "",
      is_active: true,
    },
  });

  const editForm = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      discount_value: "",
      min_order: "",
      start_date: "",
      end_date: "",
      max_uses: "",
      user_max_uses: "",
      is_active: true,
    },
  });

  // Authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch coupons from API
  const fetchCoupons = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API}coupons`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCoupons(data);
      setDisplayedCoupons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch coupons");
      console.error("Error fetching coupons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle coupon status
  const toggleCouponStatus = async (
    couponId: string,
    currentStatus: boolean
  ) => {
    setProcessingId(couponId);

    try {
      const coupon = coupons.find((c) => c.id === couponId);
      if (!coupon) return;

      const response = await fetch(`${API}coupons/${couponId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...coupon,
          is_active: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Update coupon in local state
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === couponId
            ? { ...coupon, is_active: !currentStatus }
            : coupon
        )
      );

      // Apply filters again
      applyFilters();
    } catch (err) {
      console.error(`Error toggling coupon status:`, err);
    } finally {
      setProcessingId(null);
    }
  };

  // Create new coupon
  const createCoupon = async (data: CouponFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API}coupons`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...data,
          max_uses: parseInt(data.max_uses),
          user_max_uses: parseInt(data.user_max_uses),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh coupons after creation
      await fetchCoupons();
      setCreateDialogOpen(false);
      createForm.reset();
    } catch (err) {
      console.error("Error creating coupon:", err);
      alert("فشل في إنشاء الكوبون. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update coupon
  const updateCoupon = async (data: CouponFormValues) => {
    if (!editingCoupon) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API}coupons/${editingCoupon.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...data,
          max_uses: parseInt(data.max_uses),
          user_max_uses: parseInt(data.user_max_uses),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh coupons after update
      await fetchCoupons();
      setEditDialogOpen(false);
      setEditingCoupon(null);
      editForm.reset();
    } catch (err) {
      console.error("Error updating coupon:", err);
      alert("فشل في تحديث الكوبون. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete coupon
  const deleteCoupon = async () => {
    if (!couponToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API}coupons/${couponToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Remove coupon from local state
      setCoupons(coupons.filter((coupon) => coupon.id !== couponToDelete.id));
      applyFilters();

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    } catch (err) {
      console.error("Error deleting coupon:", err);
      alert("فشل في حذف الكوبون. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    editForm.reset({
      code: coupon.code,
      discount_value: coupon.discount_value,
      min_order: coupon.min_order,
      start_date: coupon.start_date.split("T")[0],
      end_date: coupon.end_date.split("T")[0],
      max_uses: coupon.max_uses.toString(),
      user_max_uses: coupon.user_max_uses.toString(),
      is_active: coupon.is_active,
    });
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (coupon: Coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  // Apply filters for search and dropdown selections
  const applyFilters = () => {
    let filtered = [...coupons];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((coupon) => coupon.is_active === isActive);
    }

    setDisplayedCoupons(filtered);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if coupon is expired
  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  // Check if coupon is active and not expired
  const isActiveAndValid = (coupon: Coupon) => {
    return coupon.is_active && !isExpired(coupon.end_date);
  };

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, coupons]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <div className="container py-10 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">إدارة الكوبونات</h1>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة كوبون
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md ">
                <DialogHeader>
                  <DialogTitle>إضافة كوبون جديد</DialogTitle>
                  <DialogDescription>إنشاء كوبون خصم جديد</DialogDescription>
                </DialogHeader>

                <Form {...createForm}>
                  <form
                    onSubmit={createForm.handleSubmit(createCoupon)}
                    className="space-y-4"
                  >
                    <FormField
                      control={createForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كود الكوبون</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: SAVE20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="discount_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>قيمة الخصم</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="20.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="min_order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الحد الأدنى للطلب</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="100.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تاريخ البداية</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تاريخ الانتهاء</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="max_uses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الحد الأقصى للاستخدام</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="user_max_uses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الحد الأقصى لكل مستخدم</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={createForm.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">نشط</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              تفعيل الكوبون للاستخدام
                            </div>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        إنشاء الكوبون
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
                placeholder="البحث في الكوبونات..."
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

            <div className="w-full md:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="فلترة حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
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
              <Button onClick={fetchCoupons} variant="outline" className="mt-2">
                Try Again
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption>قائمة بجميع الكوبونات</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>الكود</TableHead>
                  <TableHead>قيمة الخصم</TableHead>
                  <TableHead>الحد الأدنى</TableHead>
                  <TableHead>تاريخ البداية</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>الاستخدامات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-muted-foreground"
                    >
                      لا توجد كوبونات{searchTerm ? " مطابقة لبحثك" : ""}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">
                        {coupon.code}
                      </TableCell>
                      <TableCell>{coupon.discount_value} ج.م</TableCell>
                      <TableCell>{coupon.min_order} ج.م</TableCell>
                      <TableCell>{formatDate(coupon.start_date)}</TableCell>
                      <TableCell>{formatDate(coupon.end_date)}</TableCell>
                      <TableCell>
                        {coupon.current_uses} / {coupon.max_uses}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            isActiveAndValid(coupon)
                              ? "default"
                              : isExpired(coupon.end_date)
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {isActiveAndValid(coupon)
                            ? "نشط"
                            : isExpired(coupon.end_date)
                            ? "منتهي الصلاحية"
                            : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(coupon)}
                            disabled={processingId === coupon.id}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={
                              coupon.is_active ? "destructive" : "default"
                            }
                            size="sm"
                            onClick={() =>
                              toggleCouponStatus(coupon.id, coupon.is_active)
                            }
                            disabled={processingId === coupon.id}
                          >
                            {processingId === coupon.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : coupon.is_active ? (
                              "إلغاء التفعيل"
                            ) : (
                              "تفعيل"
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(coupon)}
                            disabled={processingId === coupon.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>تعديل الكوبون</DialogTitle>
                <DialogDescription>تعديل بيانات الكوبون</DialogDescription>
              </DialogHeader>

              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(updateCoupon)}
                  className="space-y-4"
                >
                  <FormField
                    control={editForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كود الكوبون</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: SAVE20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="discount_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>قيمة الخصم</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="20.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="min_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الحد الأدنى للطلب</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="100.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاريخ البداية</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاريخ الانتهاء</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="max_uses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الحد الأقصى للاستخدام</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="user_max_uses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الحد الأقصى لكل مستخدم</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">نشط</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            تفعيل الكوبون للاستخدام
                          </div>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      إلغاء
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      حفظ التعديلات
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تأكيد حذف الكوبون</DialogTitle>
                <DialogDescription>
                  هل أنت متأكد من أنك تريد حذف الكوبون{" "}
                  <span className="font-semibold">{couponToDelete?.code}</span>؟
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
                  onClick={deleteCoupon}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري الحذف...
                    </>
                  ) : (
                    "حذف الكوبون"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
