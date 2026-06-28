"use client";

import { useState } from "react";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const initialFavorites = [
  {
    id: 1,
    name: "Chocolate Cake",
    author: "John Doe",
    likes: 430,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&h=120&fit=crop",
    slug: "chocolate-cake",
  },
  {
    id: 2,
    name: "Spicy Chicken Wings",
    author: "Jane Smith",
    likes: 210,
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=120&h=120&fit=crop",
    slug: "spicy-chicken-wings",
  },
];

const MyFavoritePage = () => {
  const [favorites, setFavorites] = useState(initialFavorites);

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-5 md:p-7 bg-white">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
        My Favorites
      </h2>

      {/* List */}
      <div className="flex flex-col gap-3">
        {favorites.length === 0 && (
          <p className="text-sm text-gray-400 py-6 text-center">
            No favorites yet.
          </p>
        )}

        {favorites.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-2">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {item.name}
              </p>
              <p className="text-xs text-orange-500 mt-0.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                by {item.author}
              </p>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <FaHeart className="text-red-500" size={15} />
              <span className="text-sm text-gray-600 font-medium">
                {item.likes}
              </span>
            </div>

            {/* View Button */}
            <Link href={`/recipes/${item.slug}`} className="flex-shrink-0">
              <button className="btn btn-sm btn-outline rounded-lg px-4 text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                View
              </button>
            </Link>

            {/* Delete */}
            <button
              onClick={() => removeFavorite(item.id)}
              className="btn btn-sm btn-square btn-ghost text-gray-400 hover:text-red-500 flex-shrink-0"
              title="Remove from favorites"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFavoritePage;
