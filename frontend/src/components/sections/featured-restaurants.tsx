"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EnhancedProductCard from "../productCard";

export default function MenuCategories() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDistinctiveDishesWithOffers = async () => {
      try {
        const [dishesResponse, offersResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/distinctive-dishes`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/dishes-with-promotions`)
        ]);

        if (!dishesResponse.ok) {
          throw new Error("Failed to fetch distinctive dishes");
        }

        const dishesData = await dishesResponse.json();
        
        let offersData = [];
        if (offersResponse.ok) {
          offersData = await offersResponse.json();
        }

        const offersMap = new Map();
        offersData.forEach(offer => {
          offersMap.set(offer.dish_id, {
            discounted_price: offer.discounted_price,
            discount_percentage: offer.discount_percentage,
            discount_amount: offer.discount_amount,
            isOffer: true
          });
        });

        const dishesWithOffers = dishesData.data.map(dish => {
          const offerData = offersMap.get(dish.dish_id || dish.id);
          if (offerData) {
            return {
              ...dish,
              ...offerData,
              original_price: dish.price, 
              id: dish.dish_id || dish.id
            };
          }
          return {
            ...dish,
            id: dish.dish_id || dish.id
          };
        });

        setDishes(dishesWithOffers);
      } catch (err) {
        setError("فشل في تحميل الأطباق المميزة. الرجاء المحاولة مرة أخرى.");
        console.error("Error fetching distinctive dishes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistinctiveDishesWithOffers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-light-shade">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الأطباق...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-light-shade">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            إعادة المحاولة
          </Button>
        </div>
      </section>
    );
  }

  const dishesWithOffers = dishes.filter(dish => dish.isOffer).length;
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
          {dishesWithOffers > 0 && (
            <p className="text-sm text-primary font-semibold mt-2">
              🎉 {dishesWithOffers} من الأطباق المميزة عليها عروض خاصة!
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <EnhancedProductCard 
              key={dish.dish_id || dish.id} 
              dish={dish} 
            />
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