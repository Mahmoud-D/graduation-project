import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Navigation from "./navigation";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-dark-shade">
      {/* Navigation */}
      <Navigation />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="طعام شهي"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center text-white mt-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          اطلب طعامك المفضل
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-neutral/90">
          أسرع خدمة توصيل طعام في مدينتك
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
          <Input
            type="text"
            placeholder="ابحث عن مطعمك المفضل"
            className="bg-white/90 text-dark-shade text-right h-12"
          />
          <Button className="bg-primary hover:bg-primary/90 h-12 px-8">
            ابحث
          </Button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-lg px-8"
          >
            اطلب الآن
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8"
          >
            تصفح المطاعم
          </Button>
        </div>
      </div>
    </section>
  );
} 