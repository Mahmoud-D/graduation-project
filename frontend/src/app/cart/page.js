"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, X, Plus, Minus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Cart() {
  const {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative">
      {/* Cart Icon Button */}
      <button
        onClick={toggleCart}
        className="fixed top-4 left-4 bg-orange-500 text-white p-2 rounded-full shadow-lg z-50 flex items-center justify-center cursor-pointer"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}

      {isOpen && (
  <div onClick={toggleCart} className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-xs z-40 transition-opacity duration-300"></div>
)}
 

      <div
        className={`fixed top-0 left-0 w-full md:w-96 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >



        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">سلة المشتريات</h2>
            <button
              onClick={toggleCart}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-4">
            {items?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-16 w-16 mb-4" />
                <p className="text-lg">السلة فارغة</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex border-b pb-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                      {item.image ? (
                        <Image
                          src={
                            `${process.env.NEXT_PUBLIC_API_URL}/${item.image}` ||
                            "/placeholder-dish.png"
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          لا توجد صورة
                        </div>
                      )}
                    </div>
                    <div className="mr-4 flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="font-medium">
                          {item.price * item.quantity} جنيه
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {item.price} جنيه للقطعة
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => removeItem(item)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => addItem({ ...item, quantity: 1 })}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateQuantity(item.id, 0)}
                          className="mr-4 p-1 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">المجموع</span>
              <span className="font-bold">{totalPrice} جنيه</span>
            </div>
            <button
              disabled={items.length === 0}
              className={`w-full py-3 rounded-md text-center text-white font-medium cursor-pointer ${
                items.length === 0
                  ? "bg-gray-300"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
              onClick={() => {
                toggleCart();
                router.push("/confirm-order");
              }}
            >
              تابع للدفع
            </button>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="w-full mt-2 py-2 rounded-md text-center text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                إفراغ السلة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
