"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Filter, MessageCircle } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  const reviewsPerPage = 9;

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterAndSortReviews();
  }, [reviews, ratingFilter, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurantReviews`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReviews = () => {
    let filtered = [...reviews];

    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilteredReviews(filtered);
    setCurrentPage(1); 
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

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (counts[review.rating] !== undefined) {
        counts[review.rating]++;
      }
    });
    return counts;
  };

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-shade">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-white">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="h-4 w-4 bg-gray-300 rounded"></div>
                        ))}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-shade flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-shade mb-4">حدث خطأ في تحميل التقييمات</h1>
          <Button onClick={fetchReviews} variant="outline">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  const ratingCounts = getRatingCounts();

  return (
    <div className="min-h-screen bg-light-shade">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-primary hover:text-primary/80">
              <ArrowRight className="h-5 w-5" />
            </Link>
            <span className="text-gray-500">العودة للصفحة الرئيسية</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-shade mb-2">
                تقييمات عملائنا
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(getAverageRating())
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{getAverageRating()}</span>
                  <span className="text-gray-500">({reviews.length} تقييم)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">توزيع التقييمات</h3>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-2">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${reviews.length > 0 ? (ratingCounts[rating] / reviews.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-600 w-8">{ratingCounts[rating]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">تصفية وترتيب التقييمات</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">تصفية حسب التقييم</label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع التقييمات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التقييمات</SelectItem>
                  <SelectItem value="5">5 نجوم</SelectItem>
                  <SelectItem value="4">4 نجوم</SelectItem>
                  <SelectItem value="3">3 نجوم</SelectItem>
                  <SelectItem value="2">2 نجوم</SelectItem>
                  <SelectItem value="1">1 نجمة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">ترتيب حسب</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="الأحدث" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="oldest">الأقدم</SelectItem>
                  <SelectItem value="highest">الأعلى تقييماً</SelectItem>
                  <SelectItem value="lowest">الأقل تقييماً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {currentReviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد تقييمات تطابق الفلاتر المحددة
            </h3>
            <p className="text-gray-500 mb-6">جرب تغيير الفلاتر للعثور على المزيد من التقييمات</p>
            <Button
              onClick={() => {
                setRatingFilter("all");
                setSortBy("newest");
              }}
              variant="outline"
            >
              إعادة تعيين الفلاتر
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentReviews.map((review) => (
                <Card
                  key={review.id}
                  className="bg-white hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-dark-shade/80 mb-4 leading-relaxed">
                      {review.comment || "تجربة رائعة!"}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div>
                        <h3 className="font-medium text-dark-shade">
                          {review.name || "مستخدم مجهول"}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {review.created_at ? formatDate(review.created_at) : "منذ فترة"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  السابق
                </Button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-16">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-dark-shade mb-4">
              شارك تجربتك معنا
            </h3>
            <p className="text-gray-600 mb-6">
              هل جربت أطباقنا؟ نحب أن نسمع رأيك ونتعلم من تجربتك
            </p>
            <Link href="/leave-review" className="inline-block">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 h-auto text-lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                اكتب تقييمك
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}