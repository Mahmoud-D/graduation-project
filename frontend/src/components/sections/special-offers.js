"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Tag, Truck, ShoppingBag } from "lucide-react";
import Link from "next/link";

const getExpiryStatus = (endDateString) => {
  const now = new Date();
  const endDate = new Date(endDateString);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { text: "انتهى العرض", status: "expired" };
  }
  if (diffDays === 1) {
    return { text: "ينتهي اليوم", status: "soon" };
  }
  if (diffDays <= 7) {
    return { text: `ينتهي في ${diffDays} أيام`, status: "soon" };
  }
  return { text: `ينتهي في ${diffDays} يوم`, status: "active" };
};

const getOfferIcon = (title) => {
  if (title.includes("توصيل")) return Truck;
  if (title.includes("أطباق")) return ShoppingBag;
  return Tag;
};

const getOfferImage = (title) => {
  if (title.includes("توصيل")) {
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/free_delivery.png`;
  }
  if (title.includes("أطباق")) {
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/discounts.jpg`;
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/20.png`;
};

export default function SpecialOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers`);
        if (!response.ok) {
          throw new Error("فشل في جلب العروض");
        }
        const data = await response.json();
        const activeOffers = data.filter(offer => offer.is_active);
        setOffers(activeOffers);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-500">جاري تحميل العروض...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-dark-shade mb-4">
            عروضنا الخاصة
          </h2>
          <p className="text-lg text-dark-shade/70">
            استمتع بأفضل العروض والخصومات المتاحة حاليًا
          </p>
        </div>

        {offers.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>
              لا توجد عروض خاصة متاحة في الوقت الحالي. تحقق مرة أخرى قريبًا!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => {
              const expiry = getExpiryStatus(offer.end_date);
              const IconComponent = getOfferIcon(offer.title);
              const isDiscountOffer = offer.discount_percentage !== null;
              const isDishesOffer = offer.title.includes("أطباق");

              return (
                <Card
                  key={offer.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="relative h-48">
                    <Image
                      src={getOfferImage(offer.title)}
                      alt={offer.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant={
                          expiry.status === "soon" ? "destructive" : "default"
                        }
                        className="text-sm shadow-md"
                      >
                        {expiry.status === "expired"
                          ? "منتهي الصلاحية"
                          : expiry.status === "soon"
                          ? "ينتهي قريبًا"
                          : "عرض فعال"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col h-[240px]">
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-dark-shade mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-dark-shade/70 mb-4">
                        {offer.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      {isDiscountOffer ? (
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full flex items-center font-semibold">
                          <IconComponent className="w-4 h-4 ml-2" />
                          <span>خصم {offer.discount_percentage}%</span>
                        </div>
                      ) : isDishesOffer ? (
                        <Link 
                          href="/offers"
                          className="bg-primary text-white px-4 py-2 rounded-full flex items-center font-semibold hover:bg-primary/90 transition-colors"
                        >
                          <IconComponent className="w-4 h-4 ml-2" />
                          <span>عرض الأطباق</span>
                        </Link>
                      ) : (
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center font-semibold">
                          <IconComponent className="w-4 h-4 ml-2" />
                          <span>عرض خاص</span>
                        </div>
                      )}
                      <span
                        className={`text-sm font-medium ${
                          expiry.status === "soon"
                            ? "text-red-600 animate-pulse"
                            : "text-dark-shade/60"
                        }`}
                      >
                        {expiry.text}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}