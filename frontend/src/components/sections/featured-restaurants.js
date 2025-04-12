import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Sample data - replace with real data later
const restaurants = [
  {
    id: 1,
    name: "مطعم الشرق",
    cuisine: "شرقي",
    rating: 4.8,
    image: "/restaurant1.jpg",
    deliveryTime: "30-45",
  },
  {
    id: 2,
    name: "برجر كينج",
    cuisine: "برجر",
    rating: 4.5,
    image: "/restaurant2.jpg",
    deliveryTime: "25-40",
  },
  {
    id: 3,
    name: "بيتزا هت",
    cuisine: "بيتزا",
    rating: 4.6,
    image: "/restaurant3.jpg",
    deliveryTime: "35-50",
  },
  {
    id: 4,
    name: "سوشي واي",
    cuisine: "ياباني",
    rating: 4.7,
    image: "/restaurant4.jpg",
    deliveryTime: "40-55",
  },
];

const cuisineTypes = ["الكل", "شرقي", "برجر", "بيتزا", "ياباني", "هندي", "صيني"];

export default function FeaturedRestaurants() {
  return (
    <section className="py-20 bg-light-shade">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-dark-shade mb-4">
            مطاعم مميزة
          </h2>
          <p className="text-lg text-dark-shade/70">
            اكتشف أفضل المطاعم في مدينتك
          </p>
        </div>

        {/* Cuisine Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {cuisineTypes.map((cuisine) => (
            <Button
              key={cuisine}
              variant={cuisine === "الكل" ? "default" : "outline"}
              className="rounded-full"
            >
              {cuisine}
            </Button>
          ))}
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-dark-shade">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center bg-primary/10 px-2 py-1 rounded-full">
                    <span className="text-primary font-semibold">
                      {restaurant.rating}
                    </span>
                    <span className="text-primary mr-1">★</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-dark-shade/70">
                  <span>{restaurant.cuisine}</span>
                  <span>{restaurant.deliveryTime} دقيقة</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            عرض المزيد من المطاعم
          </Button>
        </div>
      </div>
    </section>
  );
} 