'use client';
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const offers = [
  {
    id: 1,
    title: "خصم 30%",
    description: "على جميع الوجبات الشرقية",
    code: "EAST30",
    expiry: "ينتهي في 3 أيام",
    image: "/offer1.jpg",
    type: "hot",
  },
  {
    id: 2,
    title: "توصيل مجاني",
    description: "للطلبات فوق 100 جنيه",
    code: "FREEDELIVERY",
    expiry: "ينتهي اليوم",
    image: "/offer2.jpg",
    type: "limited",
  },
  {
    id: 3,
    title: "اشترِ 1 واحصل على 1 مجاناً",
    description: "على البرجر والمشروبات",
    code: "BOGO",
    expiry: "ينتهي في 5 أيام",
    image: "/offer3.jpg",
    type: "special",
  },
];







export default function SpecialOffers() {



  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-dark-shade mb-4">
            عروضنا الخاصة
          </h2>
          <p className="text-lg text-dark-shade/70">
            استمتع بأفضل العروض والخصومات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
   


      
           {offers.map((offer) => (
            <Card
              key={offer.id}
              className="overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-48">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={
                      offer.type === "hot"
                        ? "destructive"
                        : offer.type === "limited"
                        ? "secondary"
                        : "default"
                    }
                    className="text-sm"
                  >
                    {offer.type === "hot"
                      ? "عرض ساخن"
                      : offer.type === "limited"
                      ? "لفترة محدودة"
                      : "عرض خاص"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-dark-shade mb-2">
                  {offer.title}
                </h3>
                <p className="text-dark-shade/70 mb-4">{offer.description}</p>
                <div className="flex justify-between items-center">
                  <div className="bg-accent/10 px-3 py-1 rounded-full">
                    <span className="text-dark-shade font-semibold">
                      كود الخصم: {offer.code}
                    </span>
                  </div>
                  <span className="text-sm text-dark-shade/60">
                    {offer.expiry}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}  
        </div>
      </div>
    </section>
  );
} 