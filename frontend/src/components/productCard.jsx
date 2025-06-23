import React, { useState } from "react";
import Image from "next/image";
import { Star, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductDetailModal from "./ProductDetailModal";

export default function EnhancedProductCard({ dish }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOffer =
    dish.isOffer || (dish.discounted_price && dish.discount_percentage);
  const finalPrice = isOffer ? dish.discounted_price : dish.price;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem({
      id: dish.id,
      name: dish.name,
      price: parseFloat(finalPrice),
      image: dish.image_path,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <>
      <Card
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
      >
        {isOffer && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold">
              <Tag className="w-3 h-3 mr-1" />
              {dish.discount_percentage}% خصم
            </Badge>
          </div>
        )}

        <CardHeader className="p-0">
          <div className="relative h-52 w-full">
            <Image
              src={
                `${process.env.NEXT_PUBLIC_API_URL}/${dish.image_path}` ||
                "/placeholder-dish.png"
              }
              alt={dish.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </CardHeader>

        <div className="flex flex-col flex-grow p-4">
          <CardContent className="flex-grow p-0">
            <CardTitle className="text-xl font-bold mb-2">
              {dish.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-4">{dish.description}</p>

            {dish.average_rating && (
              <div className="flex items-center text-gray-500 mb-4">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 ml-1" />
                <span className="text-sm font-medium">
                  {parseFloat(dish.average_rating).toFixed(1)}
                </span>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-0 mt-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                {isOffer ? (
                  <>
                    <p className="text-lg font-bold text-green-600">
                      {finalPrice} جنيه
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      {dish.price} جنيه
                    </p>
                    <p className="text-xs text-red-600 font-medium">
                      توفر {dish.discount_amount} جنيه
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-semibold text-primary">
                    {dish.price} جنيه
                  </p>
                )}
              </div>

              <Button
                onClick={handleAddToCart}
                className={`transition-all duration-300 ${
                  isAdded
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-primary hover:bg-primary/90"
                }`}
                disabled={isAdded}
              >
                {isAdded ? "تمت الإضافة! ✓" : "أضف إلى السلة"}
              </Button>
            </div>
          </CardFooter>
        </div>
      </Card>

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dish={dish}
      />
    </>
  );
}
