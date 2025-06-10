import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductDetailModal from './ProductDetailModal';

export default function ProductCard({ dish }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e, dish) => {
    e.stopPropagation(); // Prevent modal from opening when clicking add to cart
    addItem({
      id: dish.id,
      name: dish.name,
      price: parseFloat(dish.price),
      image: dish.image || '/placeholder-dish.png',
      quantity: 1
    });
  };

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-48">
          <Image
            src={`http://localhost:3000/${dish.image_path}` || "/placeholder-dish.png"}
            alt={dish.name}
            fill
            className="object-cover"
          />
          {dish.isSpicy && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              حار 🌶️
            </span>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-dark-shade">
              {dish.name}
            </h3>
            <div className="text-primary font-bold">
              {dish.price} جنيه
            </div>
          </div>
          <p className="text-dark-shade/70 mb-4">{dish.description}</p>
          <Button
            className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
            onClick={(e) => handleAddToCart(e, dish)}
          >
            أضف إلى السلة
          </Button>
        </CardContent>
      </Card>

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dish={dish}
      />
    </>
  );
}
