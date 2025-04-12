import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "أحمد محمد",
    image: "/testimonial1.jpg",
    rating: 5,
    comment: "أفضل تطبيق توصيل طعام استخدمته! سريع وموثوق وخيارات متنوعة.",
    date: "قبل 3 أيام",
  },
  {
    id: 2,
    name: "سارة أحمد",
    image: "/testimonial2.jpg",
    rating: 5,
    comment: "خدمة ممتازة وتوصيل سريع. العروض والخصومات رائعة!",
    date: "قبل أسبوع",
  },
  {
    id: 3,
    name: "محمد علي",
    image: "/testimonial3.jpg",
    rating: 4,
    comment: "تطبيق سهل الاستخدام وخيارات متنوعة من المطاعم. أنصح به بشدة.",
    date: "قبل أسبوعين",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-light-shade">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-dark-shade mb-4">
            آراء العملاء
          </h2>
          <p className="text-lg text-dark-shade/70">
            ماذا يقول عملاؤنا عن تجربتهم معنا
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-white hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-shade">
                      {testimonial.name}
                    </h3>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < testimonial.rating
                              ? "text-primary"
                              : "text-neutral"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-dark-shade/70 mb-3">{testimonial.comment}</p>
                <span className="text-sm text-dark-shade/50">
                  {testimonial.date}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 