"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { getFeaturedRecipes } from "@/lib/api/getRecipe";

export default function FeaturedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedRecipes();
        setRecipes(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (!loading && recipes.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Recipes
            </h2>
            <p className="text-gray-500 mt-1">
              Hand-picked delicious recipes for you.
            </p>
          </div>
          <Link
            href="/allRecipes"
            className="border rounded-lg px-5 py-2 font-medium hover:bg-orange-500 hover:text-white transition"
          >
            View All
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border bg-white shadow-sm overflow-hidden"
                >
                  <div className="h-52 bg-gray-200 animate-pulse" />
                  <div className="p-5">
                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mt-4" />
                  </div>
                </div>
              ))
            : recipes.map((recipe) => (
                <Link
                  key={recipe._id}
                  href={`/allRecipes/${recipe._id}`}
                  className="rounded-2xl border bg-white shadow-sm overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative h-52">
                    <Image
                      src={recipe.image || "/images/placeholder.jpg"}
                      alt={recipe.recipeName}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white shadow flex items-center justify-center"
                    >
                      ❤️
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg">{recipe.recipeName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {recipe.category}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm">
                      <Clock3 size={16} />
                      {recipe.preparationTime}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
