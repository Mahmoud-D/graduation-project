"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/productCard";

const categories = ["الكل", "وجبات رئيسية", "مقبلات", "حلويات", "مشروبات"];

export default function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/dishes");
      if (!response.ok) {
        throw new Error("Failed to fetch dishes");
      }
      const data = await response.json();
      setDishes(data);
      setLoading(false);
    } catch (err) {
      setError("فشل في تحميل قائمة الطعام. الرجاء المحاولة مرة أخرى.");
      setLoading(false);
      console.error("Error fetching dishes:", err);
    }
  };

  const filteredDishes =
    selectedCategory === "الكل"
      ? dishes
      : dishes.filter((dish) => dish.category === selectedCategory);

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

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">قائمة الطعام</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? "default" : "outline"}
              className="rounded-full cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fallbackDishes.map((dish) => (
            <ProductCard key={dish.id} dish={dish} />
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            لا توجد أطباق في هذا التصنيف حالياً
          </div>
        )}
      </div>
    </div>
  );
}
