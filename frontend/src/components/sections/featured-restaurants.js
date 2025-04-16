import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <section className="py-20 bg-light-shade">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-dark-shade mb-4">
            قائمتنا المميزة
          </h2>
          <p className="text-lg text-dark-shade/70">
            اكتشف تشكيلتنا المتنوعة من الأطباق الشهية
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {filterTypes.map((type) => (
            <Button
              key={type}
              variant={type === "الكل" ? "default" : "outline"}
              className="rounded-full"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuCategories.map((category) => (
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
          ))}
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