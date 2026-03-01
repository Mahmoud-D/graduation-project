import React from 'react';
import { Input } from "@/components/ui/input";


export default function MenuSearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <Input
        type="text"
        placeholder="ابحث عن طبقك المفضل..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full text-center text-lg p-6 rounded-full shadow-inner"
      />
    </div>
  );
}