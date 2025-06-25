"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2, ArrowUpDown, Eye } from "lucide-react";
import { API } from "@/constant";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Types for orders
interface OrderDish {
  dish_name: string;
  quantity: number;
}

interface Order {
  order_id: number;
  user_id: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
  dishes: OrderDish[];
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800", 
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  // State for orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Table management states  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Order>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Dialog states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}orders`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${API}orders/${orderId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === orderId 
            ? { ...order, status: newStatus as Order["status"], updated_at: new Date().toISOString() }
            : order
        )
      );

      // Update selected order if it's the one being updated
      if (selectedOrder?.order_id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as Order["status"] } : null);
      }

    } catch (err) {
      console.error("Error updating order status:", err);
      alert(err instanceof Error ? err.message : "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Authentication required. Please log in.");
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [fetchOrders, router]);

  // Memoized filtered and sorted orders
  const displayedOrders = useMemo(() => {
    let result = [...orders];

    // Apply search
    if (searchTerm) {
      result = result.filter(order =>
        order.order_id.toString().includes(searchTerm) ||
        order.user_id.toString().includes(searchTerm) ||
        order.dishes.some(dish => 
          dish.dish_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
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
        return sortDirection === "asc"
          ? (fieldA as number) - (fieldB as number)
          : (fieldB as number) - (fieldA as number);
      }
    });

    return result;
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

  // Toggle sort direction
  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Open order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  return (
    <div className="container py-10 mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" dir="rtl">إدارة الطلبات</h1>
        <Button onClick={fetchOrders} variant="outline">
          <Loader2 className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن الطلبات أو المستخدمين أو الأطباق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
              aria-label="مسح البحث"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="w-full md:w-52">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
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
          <p>حدث خطأ أثناء جلب الطلبات: {error}</p>
          <Button onClick={fetchOrders} variant="outline" className="mt-2">
            حاول مرة أخرى
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>قائمة بجميع الطلبات</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("order_id")}
              >
                رقم الطلب <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("user_id")}
              >
                رقم المستخدم <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الأطباق</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                تاريخ الإنشاء <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("updated_at")}
              >
                آخر تحديث <ArrowUpDown size={14} className="inline ml-1" />
              </TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  لا توجد طلبات{searchTerm ? " مطابقة لبحثك" : ""}
                </TableCell>
              </TableRow>
            ) : (
              displayedOrders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">#{order.order_id}</TableCell>
                  <TableCell>{order.user_id}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {(() => {
                        switch (order.status) {
                          case "pending": return "قيد الانتظار";
                          case "confirmed": return "تم التأكيد";
                          case "preparing": return "قيد التحضير";
                          case "ready": return "جاهز";
                          case "delivered": return "تم التوصيل";
                          case "cancelled": return "ملغي";
                          default: return order.status;
                        }
                      })()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {order.dishes.slice(0, 2).map((dish, index) => (
                        <div key={index} className="text-sm">
                          {dish.dish_name} (×{dish.quantity})
                        </div>
                      ))}
                      {order.dishes.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{order.dishes.length - 2} أطباق أخرى...
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.updated_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        عرض
                      </Button>
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) => updateOrderStatus(order.order_id, newStatus)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {(() => {
                                switch (status.value) {
                                  case "pending": return "قيد الانتظار";
                                  case "confirmed": return "تم التأكيد";
                                  case "preparing": return "قيد التحضير";
                                  case "ready": return "جاهز";
                                  case "delivered": return "تم التوصيل";
                                  case "cancelled": return "ملغي";
                                  default: return status.label;
                                }
                              })()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب - #{selectedOrder?.order_id}</DialogTitle>
            <DialogDescription>
              جميع المعلومات حول هذا الطلب
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">رقم الطلب</label>
                  <p className="font-medium">#{selectedOrder.order_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">رقم المستخدم</label>
                  <p className="font-medium">{selectedOrder.user_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الحالة</label>
                  <Badge className={statusColors[selectedOrder.status]}>
                    {(() => {
                      switch (selectedOrder.status) {
                        case "pending": return "قيد الانتظار";
                        case "confirmed": return "تم التأكيد";
                        case "preparing": return "قيد التحضير";
                        case "ready": return "جاهز";
                        case "delivered": return "تم التوصيل";
                        case "cancelled": return "ملغي";
                        default: return selectedOrder.status;
                      }
                    })()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">إجمالي العناصر</label>
                  <p className="font-medium">{selectedOrder.dishes.reduce((sum, dish) => sum + dish.quantity, 0)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">تاريخ الإنشاء</label>
                  <p className="text-sm">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">آخر تحديث</label>
                  <p className="text-sm">{formatDate(selectedOrder.updated_at)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">الأطباق المطلوبة</label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.dishes.map((dish, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">{dish.dish_name}</span>
                      <span className="text-sm text-muted-foreground">الكمية: {dish.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">تحديث الحالة</label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(newStatus) => updateOrderStatus(selectedOrder.order_id, newStatus)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-40 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {(() => {
                            switch (status.value) {
                              case "pending": return "قيد الانتظار";
                              case "confirmed": return "تم التأكيد";
                              case "preparing": return "قيد التحضير";
                              case "ready": return "جاهز";
                              case "delivered": return "تم التوصيل";
                              case "cancelled": return "ملغي";
                              default: return status.label;
                            }
                          })()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setOrderDetailOpen(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
