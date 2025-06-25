"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTestimonials();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurantReviews`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      const sortedReviews = (data.reviews || []).sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setTestimonials(sortedReviews);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    router.push("/leave-review");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "قبل يوم واحد";
    if (diffDays < 7) return `قبل ${diffDays} أيام`;
    if (diffDays < 14) return "قبل أسبوع";
    if (diffDays < 30) return `قبل ${Math.ceil(diffDays / 7)} أسابيع`;
    return `قبل ${Math.ceil(diffDays / 30)} شهر`;
  };

  if (loading) {
    return (
      <section className="py-24 bg-light-shade relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white">
                  <CardContent className="p-8">
                    <div className="animate-pulse">
                      <div className="flex gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="h-4 w-4 bg-gray-300 rounded"></div>
                        ))}
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                        <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-light-shade relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-dark-shade mb-4">آراء عملائنا</h2>
          <p className="text-red-500 mb-4">حدث خطأ في تحميل التقييمات</p>
          <Button onClick={fetchTestimonials} variant="outline">
            إعادة المحاولة
          </Button>
        </div>
      </section>
    );
  }

  if (!testimonials.length) {
    return (
      <section className="py-24 bg-light-shade relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-light-shade/30 pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-dark-shade mb-4 tracking-tight">
              آراء عملائنا
            </h2>
            <p className="text-lg text-dark-shade/70 max-w-2xl mx-auto mb-12">
              كن أول من يشارك تجربته معنا
            </p>
            <Button
              onClick={handleReviewClick}
              size="lg"
              className={`px-8 py-6 h-auto text-lg group cursor-pointer ${
                isLoggedIn 
                  ? "bg-primary hover:bg-primary/90 text-white" 
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              {isLoggedIn ? (
                <>
                  <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  شارك تجربتك معنا
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  سجل دخولك لمشاركة تجربتك
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
          {testimonials.slice(0, 3).map((testimonial) => (
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

                <p className="text-dark-shade/80 mb-6 text-lg leading-relaxed">
                  {testimonial.comment || "تجربة رائعة!"}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="relative w-14 h-14">
                    <Image
                      src={testimonial.user_image || "/profile-photo-fallback-1.jpg"}
                      alt={testimonial.user_name || "مستخدم"}
                      fill
                      className="object-cover rounded-full ring-2 ring-primary/10"
                      onError={(e) => {
                        e.target.src = "/profile-photo-fallback-1.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-shade text-lg">
                      {testimonial.user_name || "مستخدم مجهول"}
                    </h3>
                    <span className="text-sm text-dark-shade/50">
                      {testimonial.created_at ? formatDate(testimonial.created_at) : "منذ فترة"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {testimonials.length > 3 && (
          <div className="text-center mb-8">
            <Link href="/reviews" className="inline-block">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                عرض جميع التقييمات ({testimonials.length})
              </Button>
            </Link>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={handleReviewClick}
            size="lg"
            className={`px-8 py-6 h-auto text-lg group cursor-pointer ${
              isLoggedIn 
                ? "bg-primary hover:bg-primary/90 text-white" 
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
          >
            {isLoggedIn ? (
              <>
                <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                شارك تجربتك معنا
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                سجل دخولك لمشاركة تجربتك
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}