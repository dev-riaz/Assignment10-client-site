"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  getMyFavorites,
  deleteFavorite,
} from "../../../../../lib/api/getRecipe";
import { removeFromLS, LS_FAV } from "@/lib/favoriteUtils";
import Link from "next/link";
import Image from "next/image";
import { FaTrash, FaHeart, FaUserCircle } from "react-icons/fa";

const MyFavoritesPage = () => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const loadFavorites = async () => {
      setLoading(true);
      const res = await getMyFavorites(session.user.email);
      if (res.success) {
        setFavorites(res.data);
      }
      setLoading(false);
    };

    loadFavorites();
  }, [session?.user?.email]);

  const handleRemove = async (favoriteId, recipeId) => {
    setRemovingId(favoriteId);
    const res = await deleteFavorite(favoriteId);
    if (res.success) {
      setFavorites((prev) => prev.filter((f) => f._id !== favoriteId));
      removeFromLS(LS_FAV, recipeId);
    }
    setRemovingId(null);
  };

  if (!session) {
    return (
      <div className="p-6 text-gray-500">
        Please log in to see your favorite recipes.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-gray-50 rounded-2xl p-5">
        <h1 className="text-xl font-bold mb-4">My Favorites</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-2xl bg-white">
            <p className="text-gray-500 mb-3">No favorites found</p>
            <Link
              href="/browse"
              className="inline-block px-5 py-2 bg-amber-500 text-white rounded-full text-sm font-medium hover:bg-amber-600"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {favorites.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 flex items-center gap-3"
              >
                {/* Thumbnail */}
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={item.recipeImage}
                    alt={item.recipeName}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name + author */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">
                    {item.recipeName}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                    <FaUserCircle size={11} />
                    by {item.authorName || "Unknown"}
                  </p>
                </div>

                {/* Likes */}
                <div className="flex items-center gap-1 text-sm text-red-500 flex-shrink-0">
                  <FaHeart size={13} />
                  <span>{item.likesCount ?? 0}</span>
                </div>

                {/* View button */}
                <Link
                  href={`/browse/${item.recipeId}`}
                  className="text-xs font-medium border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-gray-400 transition flex-shrink-0"
                >
                  View
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item._id, item.recipeId)}
                  disabled={removingId === item._id}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-50 transition flex-shrink-0"
                  title="Remove from favorites"
                >
                  <FaTrash size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavoritesPage;
