import React, { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";
import Link from "next/link";
import Image from "next/image";

export default function DishSearchDropdown() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced fetch for search
  const fetchDishes = useMemo(
    () =>
      debounce(async (q) => {
        if (!q) {
          setResults([]);
          return;
        }
        setLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/dishes?q=${encodeURIComponent(q)}`
          );
          if (!res.ok) throw new Error("Network response was not ok");
          const data = await res.json();
          setResults(data);
        } catch (err) {
          console.error(err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  // Trigger search when query changes
  useEffect(() => {
    fetchDishes(query);
    return () => fetchDishes.cancel();
  }, [query, fetchDishes]);

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث عن طبق..."
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {query && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
          {loading && (
            <li className="px-4 py-2 text-center text-gray-500">جاري البحث…</li>
          )}

          {!loading && results.length === 0 && (
            <li className="px-4 py-2 text-center text-gray-500">
              لا توجد نتائج.
            </li>
          )}

          {!loading &&
            results.map((dish) => (
              <li key={dish.id}>
                <Link
                  href={`/menu/${dish.id}`}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
                >
                  <div className="h-10 w-10 relative flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    <Image
                      src={
                        `${process.env.NEXT_PUBLIC_API_URL}/${dish.image_path}` ||
                        "/placeholder-dish.png"
                      }
                      alt={dish.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="mr-3 flex-1">
                    <p className="text-sm text-gray-500 font-medium">{dish.name}</p>
                    <p className="text-xs text-gray-500">{dish.price} جنيه</p>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
