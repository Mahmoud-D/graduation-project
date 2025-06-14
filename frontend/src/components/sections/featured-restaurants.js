"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "lucide-react";

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
          <p className="text-lg text-dark-shade/70">
            اكتشف تشكيلتنا المتنوعة من الأطباق الشهية
          </p>
        </div>

        {/* Category Filter */}
        {/* <div className="flex flex-wrap gap-3 justify-center mb-12">
          {filterTypes.map((type) => (
            <Button
              key={type}
              variant={type === "الكل" ? "default" : "outline"}
              className="rounded-full"
            >
              {type}
            </Button>
          ))}
        </div> */}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes?.length > 0 ? (
            dishes.map((offer) => (
              <Card
                key={offer.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* صورة الطبق */}
                <div className="relative h-48">
                  <Image
                    src={`http://localhost:5000/api/${offer.image_path}`}
                    alt={offer.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent className="p-4 space-y-2">
                  {/* عنوان الطبق والعرض */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-dark-shade">
                      {offer.name}
                    </h3>
                  </div>

                  {/* عنوان العرض */}
                  <div className="text-accent text-sm">
                    {offer.featured_title}
                  </div>

                  {/* وصف الطبق */}
                  {offer.description && (
                    <p className="text-sm text-dark-shade/80">
                      {offer.description}
                    </p>
                  )}

                  {/* السعر */}
                  <div className="text-dark-shade font-semibold">
                    السعر: {parseFloat(offer.price).toFixed(2)} ج.م
                  </div>

                  {/* التقييم بنجوم */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={
                          i < Math.round(offer.average_rating)
                            ? "#FFD700"
                            : "none"
                        }
                        viewBox="0 0 24 24"
                        stroke="#FFD700"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        />
                      </svg>
                    ))}
                    <span className="text-sm text-dark-shade/70">
                      ({parseFloat(offer.average_rating || 0).toFixed(1)})
                    </span>
                  </div>

                  {/* تاريخ الانتهاء */}
                  {offer.end_date && (
                    <div className="flex items-center gap-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z"
                        />
                      </svg>
                      <span className="text-sm text-dark-shade/80">
                        ينتهي في:{" "}
                        <span className="font-semibold text-dark-shade">
                          {formatArabicDate(offer.end_date)}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* التصنيفات */}
                  {offer.categories && offer.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {offer.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-dark-shade/70 py-10">
              لا توجد عروض متاحة حالياً
            </div>
          )}

          {/* {menuCategories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-dark-shade">
                    {category.name}
                  </h3>
                  <div className="flex items-center bg-primary/10 px-2 py-1 rounded-full">
                    <span className="text-primary font-semibold">
                      {category.itemsCount}
                    </span>
                    <span className="text-primary mr-1">وجبة</span>
                  </div>
                </div>
                <div className="text-dark-shade/70">
                  <span>{category.description}</span>
                </div>
              </CardContent>
            </Card>
          ))} */}
        </div>

        {/* View More Button */}
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
