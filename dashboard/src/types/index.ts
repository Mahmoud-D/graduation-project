// Category Types matching API schema
export type CategoryResponse = {
  category_id: string;
  category_name: string;
  description: string;
  dish_count: number;
  created_at?: string; // Assuming this field exists in the response
};

export type CategoryCreate = {
  name: string;
  description: string;
};

export type CategoryUpdate = {
  category_id: string;
  name: string;
  description: string;
};

// type for display purposes (maps API data to display format)
export type Category = {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  createdAt: string;
};

// Dish interfaces matching API schema
export type DishResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  image_path: string;
  created_at: string;
  average_rating: number;
  categories: string[]; // Array of category IDs or objects
};

export type DishCategory = {
  category_id: string;
  category_name: string;
};

export type DishCreate = {
  name: string;
  description: string;
  price: number;
  category: string; // Category ID for POST request
};

export type DishUpdate = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

// type for display purposes (maps API data to display format)
export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  imagePath: string;
  createdAt: string;
  averageRating: number;
  categories: string[];
};
