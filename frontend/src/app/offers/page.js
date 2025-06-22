"use client";
import React, { useState, useEffect } from 'react';
import EnhancedProductCard from '@/components/productCard'; 

export default function Offers() {
  const [offerDishes, setOfferDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfferDishes();
  }, []);

  const fetchOfferDishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/dishes-with-promotions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setOfferDishes(result || []);
      
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل العروض...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>حدث خطأ في تحميل العروض: {error}</p>
          <button 
            onClick={fetchOfferDishes}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">العروض الخاصة</h1>
        <p className="text-gray-600 text-center">اكتشف أفضل العروض والخصومات المتاحة</p>
        {offerDishes.length > 0 && (
          <p className="text-sm text-gray-500 text-center mt-2">
            {offerDishes.length} عرض متاح
          </p>
        )}
      </div>

      {offerDishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerDishes.map((dish) => (
            <EnhancedProductCard 
              key={dish.dish_id} 
              dish={{
                id: dish.dish_id,
                name: dish.name,
                description: dish.description,
                price: dish.original_price,
                discounted_price: dish.discounted_price,
                discount_percentage: dish.discount_percentage,
                discount_amount: dish.discount_amount,
                image_path: dish.image_path,
                average_rating: dish.average_rating,
                isOffer: true
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد عروض متاحة حالياً</h3>
          <p className="text-gray-500">تابعنا للحصول على أحدث العروض والخصومات</p>
        </div>
      )}
    </div>
  );
}