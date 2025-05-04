import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "أحمد محمد",
    image: "/profile-photo-fallback-1.jpg",
    rating: 5,
    comment: "أفضل مطعم في المنطقة! الأطباق الشرقية لذيذة جداً والتوصيل سريع.",
    date: "قبل 3 أيام",
  },
  {
    id: 2,
    name: "سارة أحمد",
    image: "/profile-photo-fallback-1.jpg",
    rating: 5,
    comment: "البرجر هنا رائع! الطعم مميز والخدمة ممتازة.",
    date: "قبل أسبوع",
  },
  {
    id: 3,
    name: "محمد علي",
    image: "/profile-photo-fallback-1.jpg",
    rating: 4,
    comment: "البيتزا لذيذة والكمية مناسبة. أنصح بتجربة البيتزا الخاصة بهم.",
    date: "قبل أسبوعين",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-light-shade relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-light-shade/30 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark-shade mb-4 tracking-tight">
            آراء عملائنا
          </h2>
          <p className="text-lg text-dark-shade/70 max-w-2xl mx-auto">
            ماذا يقول عملاؤنا عن تجربتهم في مطعمنا - انضم إلى مجتمعنا وشارك تجربتك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-neutral-200"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-dark-shade/80 mb-6 text-lg leading-relaxed">
                  {testimonial.comment}
                </p>

                {/* User info at the bottom */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 hover:cursor-pointer">
                  <div className="relative w-14 h-14">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover rounded-full ring-2 ring-primary/10"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-shade text-lg">
                      {testimonial.name}
                    </h3>
                    <span className="text-sm text-dark-shade/50">
                      {testimonial.date}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link href="/leave-review" className="inline-block">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto text-lg group cursor-pointer"
            >
              <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              شارك تجربتك معنا
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}