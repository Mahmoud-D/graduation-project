"use client";

import { useState, useEffect, useMemo } from "react";
import MenuSearchBar from "@/components/MenuSearchBar";
import CategoryFilters from "@/components/CategoryFilters";
import EnhancedProductCard from "@/components/productCard";

export default function MenuPage() {
  const [allDishes, setAllDishes] = useState([]);
  const [offerDishes, setOfferDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const [dishesResponse, categoriesResponse, offersResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/dishes`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/dishes-with-promotions`)
        ]);

        if (!dishesResponse.ok) throw new Error("فشل في جلب الأطباق");
        if (!categoriesResponse.ok) throw new Error("فشل في جلب التصنيفات");
        
        const dishesData = await dishesResponse.json();
        const categoriesData = await categoriesResponse.json();
        
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

        const dishesWithOffers = dishesData.map(dish => {
          const offerData = offersMap.get(dish.id);
          if (offerData) {
            return {
              ...dish,
              ...offerData,
              original_price: dish.price 
            };
          }
          return dish;
        });

        setAllDishes(dishesWithOffers);
        setOfferDishes(offersData);
        setCategories([{ category_id: 0, category_name: "الكل" }, ...categoriesData]);
      } catch (err) {
        setError("فشل في تحميل قائمة الطعام. الرجاء المحاولة مرة أخرى.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const filteredDishes = useMemo(() => {
    let dishes = allDishes;

    if (selectedCategory !== "الكل") {
      dishes = dishes.filter((dish) =>
        dish.categories.includes(selectedCategory)
      );
    }

    if (searchQuery.trim() !== "") {
      dishes = dishes.filter((dish) =>
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return dishes;
  }, [allDishes, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-2xl text-primary">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold">قائمة الطعام</h1>
          <p className="text-lg text-gray-500">استكشف أشهى الأطباق لدينا</p>
          <MenuSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </header>

        <div className="mb-12">
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDishes.map((dish) => (
              <EnhancedProductCard 
                key={dish.id} 
                dish={dish} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-2xl font-semibold mb-2">لا توجد أطباق تطابق بحثك</p>
            <p>حاول تغيير فلتر التصنيف أو تعديل كلمة البحث.</p>
          </div>
        )}
      </div>
    </div>
  );
}