"use client";

import Image from "next/image";
import Link from "next/link";
import { FiClock, FiHeart, FiEye } from "react-icons/fi";
import { PiChefHat } from "react-icons/pi";

const BrowseRecipeCard = ({ recipe }) => {
  return (
    <Link href={`/browse/${recipe._id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
        {/* ── Image ── */}
        <div className="relative w-full h-66 bg-orange-50">
          {recipe.recipeImage ? (
            <div className="relative w-full h-full overflow-hidden bg-orange-50">
              <Image
                src={recipe.recipeImage}
                alt={recipe.recipeName}
                fill
                className="object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="object-cover flex items-center justify-center">
              <PiChefHat size={36} className="text-orange-200" />
            </div>
          )}

          {/* View Details overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
              <FiEye size={16} />
              Click View Details
            </span>
          </div>

          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <FiHeart size={14} className="text-red-400 fill-red-400" />
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-3 pb-4">
          <h3 className="font-bold text-gray-900 text-2xl leading-snug mb-0.5 truncate">
            {recipe.recipeName}
          </h3>
          <p className="text-gray-400 text-xs mb-3 truncate">
            {recipe.cuisineType}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FiClock size={13} />
              {recipe.preparationTime ?? "—"} mins
            </span>
            <span className="flex items-center gap-1">
              <FiHeart size={13} className="text-red-500 fill-red-500" />
              <span className="text-gray-500">{recipe.likesCount ?? 0}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BrowseRecipeCard;
