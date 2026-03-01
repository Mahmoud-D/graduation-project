import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductDetailModal({ isOpen, onClose, dish }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setImageError(false);
    }
  }, [isOpen]);
  const handleAddToCart = () => {
    addItem({
      id: dish.dish_id || dish.id || dish.id,
      name: dish.name,
      price: parseFloat(dish.price),
      image: dish.image_path || "/placeholder-dish.png",
      quantity: quantity,
    });
    onClose();
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, newQuantity));
  };

  if (!dish) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent
        className="max-w-5xl w-[90vw]"
        role="dialog"
        aria-modal="true"
      >
        <DialogHeader className="relative">
          <DialogTitle
            id="dish-modal-title"
            className="text-2xl font-bold text-right"
          >
            {dish.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="relative h-[300px]"
            role="img"
            aria-label={`صورة ${dish.name}`}
          >
            <Image
              src={
                `http://localhost:5000/${dish.image_path}` ||
                "/placeholder-dish.png"
              }
              alt={dish.name}
              fill
              className="object-cover rounded-lg"
              onError={() => setImageError(true)}
              aria-hidden={imageError}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">الصورة غير متوفرة</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p
                className="text-lg mb-4"
                role="contentinfo"
                aria-label="وصف الطبق"
              >
                {dish.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-2xl font-bold text-primary"
                  aria-label="السعر"
                >
                  {dish.price} جنيه
                </span>
                {dish.isSpicy && (
                  <span
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                    role="status"
                    aria-label="هذا الطبق حار"
                  >
                    حار 🌶️
                  </span>
                )}
              </div>

              {dish.categories && (
                <div
                  className="flex flex-wrap gap-2 mb-4"
                  role="group"
                  aria-label="فئات الطبق"
                >
                  {dish.categories.map((category) => (
                    <span
                      key={category}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      role="listitem"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="flex items-center justify-center space-x-4 border rounded-lg p-2 mb-4"
                role="group"
                aria-label="اختيار الكمية"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  aria-label="تقليل الكمية"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span
                  className="text-xl font-semibold w-12 text-center"
                  role="spinbutton"
                  aria-valuemin="1"
                  aria-valuenow={quantity}
                  aria-valuetext={`الكمية ${quantity}`}
                >
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  aria-label="زيادة الكمية"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                onClick={handleAddToCart}
                aria-label={`إضافة ${quantity} ${dish.name} إلى السلة بسعر ${
                  dish.price * quantity
                } جنيه`}
              >
                أضف إلى السلة - {(dish.price * quantity).toFixed(2)} جنيه
              </Button>

              <Link href={`/menu/${dish.dish_id || dish.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                 التفاصيل
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
