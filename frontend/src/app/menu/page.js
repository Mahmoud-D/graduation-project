'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
      const response = await fetch('http://localhost:3001/api/dishes');
      if (!response.ok) {
        throw new Error('Failed to fetch dishes');
      }
      const data = await response.json();
      setDishes(data);
      setLoading(false);
    } catch (err) {
      setError('فشل في تحميل قائمة الطعام. الرجاء المحاولة مرة أخرى.');
      setLoading(false);
      console.error('Error fetching dishes:', err);
    }
  };

  
  const filteredDishes = selectedCategory === "الكل"
    ? dishes
    : dishes.filter(dish => dish.category === selectedCategory);

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
              className="rounded-full"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={"/placeholder-dish.png"}
                  alt={dish.name}
                  fill
                  className="object-cover"
                />
                {dish.isSpicy && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                    حار 🌶️
                  </span>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-dark-shade">
                    {dish.name}
                  </h3>
                  <div className="text-primary font-bold">
                    {dish.price} جنيه
                  </div>
                </div>
                <p className="text-dark-shade/70 mb-4">{dish.description}</p>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  أضف إلى السلة
                </Button>
              </CardContent>
            </Card>
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