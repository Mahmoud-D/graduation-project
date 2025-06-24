import { useState, useEffect } from "react";
import { getReviews, addReview } from "@/lib/reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export default function ReviewSection({ dishId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchReviews();
    checkAuthStatus();
  }, [dishId]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  const fetchReviews = async () => {
    try {
      const data = await getReviews(dishId);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0 || !isAuthenticated) return;

    setLoading(true);
    try {
      await addReview({ ...newReview, dish_id: dishId });
      setNewReview({ rating: 0, comment: "" });
      await fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">التقييمات والمراجعات</h3>

      {/* Add Review Form */}
      <form onSubmit={handleSubmitReview} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">التقييم</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setNewReview((prev) => ({ ...prev, rating: star }))
                }
                className="focus:outline-none"
                disabled={!isAuthenticated}
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= newReview.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">تعليقك</label>
          <Textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder={isAuthenticated ? "اكتب تعليقك هنا..." : "يجب تسجيل الدخول أولاً لكتابة تقييم"}
            className="w-full"
            rows={3}
            disabled={!isAuthenticated}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || newReview.rating === 0 || !isAuthenticated}
          className="w-full"
        >
          {loading 
            ? "جاري الإرسال..." 
            : !isAuthenticated 
            ? "يجب تسجيل الدخول لإرسال التقييم" 
            : "إرسال التقييم"
          }
        </Button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.reviews?.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString('ar-EG')}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}