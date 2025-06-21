"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Make sure the path to your enhanced card component is correct
import EnhancedProductCard from "../productCard";

export default function MenuCategories() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function fetches only the "distinctive" dishes for this section
    const fetchDistinctiveDishes = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/distinctive-dishes`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch distinctive dishes");
        }
        const data = await response.json();
        setDishes(data.data);
      } catch (err) {
        setError("فشل في تحميل الأطباق المميزة. الرجاء المحاولة مرة أخرى.");
        console.error("Error fetching distinctive dishes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistinctiveDishes();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-light-shade">
        <div className="container mx-auto px-4 text-center">
            <p>جاري تحميل الأطباق...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-light-shade">
        <div className="container mx-auto px-4 text-center text-red-500">
            <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-light-shade" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-dark-shade mb-4">
            الأعلى طلبًا
          </h2>
          <p className="text-lg text-gray-500">
            نخبة من أطباقنا الأكثر شهرة بين عملائنا
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <EnhancedProductCard key={dish.id} dish={dish} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/menu">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              تصفح القائمة كاملة
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
