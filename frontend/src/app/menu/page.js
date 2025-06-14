"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/productCard";

export default function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState(dishes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDishes();
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === "الكل") {
      setSelectedDishes(dishes);
      return;
    }
    const filteredDishes = dishes.filter((dish) =>
      dish.categories.includes(category)
    );
    setSelectedDishes(filteredDishes);
  };

  const fetchDishes = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dishes`
      );
=======
      const response = await fetch(`http://localhost:5000/api/dishes`);
>>>>>>> c1fd98203e8ce0c2f9a72b0c34404060a2f6496b
      if (!response.ok) {
        throw new Error("Failed to fetch dishes");
      }
      const data = await response.json();
      setDishes(data);
      setSelectedDishes(data);
      setLoading(false);
    } catch (err) {
      setError("فشل في تحميل قائمة الطعام. الرجاء المحاولة مرة أخرى.");
      setLoading(false);
      console.error("Error fetching dishes:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories([{ category_id: 0, category_name: "الكل" }, ...data]);
    } catch (err) {
      setError("فشل في تحميل التصنيفات. الرجاء المحاولة مرة أخرى.");
      console.error("Error fetching categories:", err);
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

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">قائمة الطعام</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category.category_id}
              variant={
                category.category_name === selectedCategory
                  ? "default"
                  : "outline"
              }
              className="rounded-full cursor-pointer"
              onClick={() => handleCategoryClick(category.category_name)}
            >
              {category.category_name}
            </Button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedDishes.map((dish) => (
            <ProductCard key={dish.id} dish={dish} />
          ))}
        </div>

        {selectedDishes.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            لا توجد أطباق في هذا التصنيف حالياً
          </div>
        )}
      </div>
    </div>
  );
}
