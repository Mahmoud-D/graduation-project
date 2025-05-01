"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function LeaveReviewPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    rating: "1",
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm({ rating: "5", comment: "" });
        toast.success('تم إرسال التقييم', {
          description: 'شكراً على مشاركة رأيك معنا'
        });
      } else {
        toast.error('حدث خطأ', {
          description: 'فشل في إرسال التقييم. حاول مرة أخرى.'
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ', {
        description: 'حدث خطأ غير متوقع. حاول مرة أخرى.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const maxCommentLength = 500;

  return (
    <div dir="rtl" className="container mx-auto px-4 py-8 sm:py-12 lg:py-10 xl:py-8">
      <Toaster position="top-center" expand={true} richColors />
      <Card className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center p-6 sm:p-8 lg:p-6">
          <CardTitle className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-2">
            اترك تقييمًا
          </CardTitle>
          <CardDescription className="text-base sm:text-lg lg:text-lg mt-2">
            نقدّر ملاحظاتك. شاركنا تجربتك!
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 sm:space-y-8 lg:space-y-6 p-4 sm:p-6 lg:p-6">
            <div className="space-y-4">
              <Label 
                htmlFor="rating" 
                className="text-sm sm:text-base font-medium text-center block"
              >
                التقييم
              </Label>
              <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center p-2 sm:p-4">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'rating', value: star.toString() } })}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`text-3xl sm:text-4xl md:text-5xl transition-all duration-200 
                      ${hoveredRating > 0 
                        ? hoveredRating >= star 
                          ? 'text-yellow-400' 
                          : 'text-gray-200'
                        : parseInt(form.rating) >= star 
                          ? 'text-yellow-400' 
                          : 'text-gray-200'
                      }
                      hover:scale-110
                    `}
                    disabled={isLoading}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="comment" 
                className="text-sm sm:text-base font-medium"
              >
                مراجعتك
              </Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="شاركنا رأيك..."
                rows={6}
                required
                maxLength={maxCommentLength}
                value={form.comment}
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 text-sm sm:text-base
                  min-h-[150px] sm:min-h-[180px] md:min-h-[200px] lg:min-h-[160px] xl:min-h-[140px]
                  w-full resize-none"
                disabled={isLoading}
              />
              <div className="text-xs sm:text-sm text-gray-500 text-left">
                {form.comment.length}/{maxCommentLength}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 sm:p-6 lg:p-5">
            <Button 
              type="submit" 
              className="w-full h-12 sm:h-14 lg:h-12 text-base sm:text-lg lg:text-lg
                font-medium transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                'إرسال التقييم'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
