const API_URL = 'http://localhost:5000/api';

export const getReviews = async (dishId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/dish/${dishId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const addReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add review');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}; 