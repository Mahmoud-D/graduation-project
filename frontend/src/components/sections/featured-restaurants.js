"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "lucide-react";
import ProductCard from "../productCard";

// Sample data - replace with real data later
const menuCategories = [
  {
    id: 1,
    name: "الوجبات الشرقية",
    description: "أشهى الأطباق الشرقية من مطبخنا",
    image: "/category1.jpg",
    itemsCount: 15,
  },
  {
    id: 2,
    name: "البرجر",
    description: "أشهى أنواع البرجر من مطبخنا",
    image: "/category2.jpg",
    itemsCount: 10,
  },
  {
    id: 3,
    name: "البيتزا",
    description: "أشهى أنواع البيتزا من مطبخنا",
    image: "/category3.jpg",
    itemsCount: 12,
  },
  {
    id: 4,
    name: "المشروبات",
    description: "أشهى المشروبات من مطبخنا",
    image: "/category4.jpg",
    itemsCount: 8,
  },
];

const filterTypes = ["الكل", "وجبات رئيسية", "مقبلات", "حلويات", "مشروبات"];

export default function MenuCategories() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/distinctive-dishes`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dishes");
      }
      const data = await response.json();

      setDishes(data.data);
      setLoading(false);
    } catch (err) {
      setError("فشل في تحميل قائمة الطعام. الرجاء المحاولة مرة أخرى.");
      setLoading(false);
      console.error("Error fetching dishes:", err);
    }
  };

  function formatArabicDate(inputDate) {
    if (!inputDate) return null;

    const date = new Date(inputDate);
    if (isNaN(date)) return null;

    const day = date.getDate();
    const year = date.getFullYear();

    const monthName = date.getMonth();

    return `${day} ${monthName} ${year}`;
  }

  const renderStars = (rating) => {
    const stars = Math.round(rating || 0); // safe default
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < stars ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46 1.286 3.973c.3.921-.755 1.688-1.538 1.118L10 13.347l-3.388 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.973-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18l1.286-3.973z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-light-shade">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-dark-shade mb-4">
            الأعلى طلباََ
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center justify-items-center mx-auto max-w-6xl">
          {dishes.map((dish, index) => (
            <ProductCard key={index} dish={dish} />
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
