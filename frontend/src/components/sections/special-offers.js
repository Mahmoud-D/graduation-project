"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Tag } from "lucide-react";

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
  return { text: `ينتهي في ${diffDays} أيام`, status: "active" };
};

export default function SpecialOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/offers");
        if (!response.ok) {
          throw new Error("فشل في جلب العروض");
        }
        const data = await response.json();
        setOffers(data);
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
              // Skip rendering expired offers that are not active
              if (expiry.status === "expired" && !offer.is_active) return null;

              return (
                <Card
                  key={offer.id}
                  className={`overflow-hidden hover:shadow-lg transition-shadow group ${
                    expiry.status === "expired" ? "opacity-60 bg-gray-50" : ""
                  }`}
                >
                  <div className="relative h-48">
                    {/* Placeholder image, as the API does not provide one */}
                    <Image
                      src={`https://placehold.co/600x400/FFF4E6/333333?text=${encodeURIComponent(
                        offer.title
                      )}`}
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
                  <CardContent className="p-6 flex flex-col h-[220px]">
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-dark-shade mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-dark-shade/70 mb-4">
                        {offer.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="bg-primary/10 text-primary px-4 py-2 rounded-full flex items-center font-semibold">
                        <Tag className="w-4 h-4 ml-2" />
                        <span>خصم {offer.discount_percentage}%</span>
                      </div>
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
