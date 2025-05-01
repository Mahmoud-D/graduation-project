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
    <div dir="rtl" className="container mx-auto py-12">
      <Toaster position="top-center" expand={true} richColors />
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-2">اترك تقييمًا</CardTitle>
          <CardDescription className="text-xl mt-2">
            نقدّر ملاحظاتك. شاركنا تجربتك!
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="rating" className="text-base font-medium text-center block">التقييم</Label>
              <div className="flex gap-6 justify-center p-4">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'rating', value: star.toString() } })}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`text-5xl transition-all duration-200 
                      ${hoveredRating > 0 
                        ? hoveredRating >= star 
                          ? 'text-yellow-400' 
                          : 'text-gray-200'
                        : parseInt(form.rating) >= star 
                          ? 'text-yellow-400' 
                          : 'text-gray-200'
                      }`}
                    disabled={isLoading}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment" className="text-base font-medium">مراجعتك</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="شاركنا رأيك..."
                rows={8}
                required
                maxLength={maxCommentLength}
                value={form.comment}
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 text-base min-h-[200px]"
                disabled={isLoading}
              />
              <div className="text-base text-gray-500 text-left">
                {form.comment.length}/{maxCommentLength}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full h-14 text-xl font-medium transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
