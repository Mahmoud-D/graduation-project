"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import ReviewSection from "@/components/ReviewSection";

export default function MenuItemPage() {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    addItem,
  } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDish();
  }, [id]);

  const fetchDish = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dishes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dish details");
      }
      const data = await response.json();
      setDish(data);
      setLoading(false);
    } catch (err) {
      setError("فشل في تحميل تفاصيل الطبق. الرجاء المحاولة مرة أخرى.");
      setLoading(false);
      console.error("Error fetching dish:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500">لم يتم العثور على الطبق</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96 w-full">
            <Image
              src={
                `${process.env.NEXT_PUBLIC_API_URL}/${dish.image_path}` ||
                "/placeholder-dish.png"
              }
              alt={dish.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{dish.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-semibold text-primary">
                {dish.price} جنيه
              </span>
              {dish.discount_price && (
                <span className="text-xl text-gray-500 line-through">
                  {dish.discount_price} جنيه
                </span>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">الوصف</h2>
              <p className="text-gray-600">{dish.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">التصنيفات</h2>
              <div className="flex flex-wrap gap-2">
                {dish.categories && dish.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <Button className="flex-1" size="lg" onClick={() => addItem({ ...dish, quantity: 1 })}>
                إضافة إلى السلة
              </Button>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">التقييمات</h2>
              <ReviewSection dishId={dish.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 