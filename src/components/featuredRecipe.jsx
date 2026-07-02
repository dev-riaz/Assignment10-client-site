"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiClock, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import { getFeaturedRecipes } from "@/lib/api/getRecipe";

const FeaturedRecipe = () => {
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
      <div className="w-11/12 mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Recipes
            </h2>
            <p className="text-gray-500 mt-1">
              Hand-picked delicious recipes for you.
            </p>
          </div>
          <Link
            href="/browse"
            className="border rounded-lg px-5 py-2 font-medium hover:bg-orange-500 hover:text-white transition"
          >
            View All
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-full flex flex-col rounded-2xl bg-white shadow-sm overflow-hidden"
                >
                  <div className="h-52 shrink-0 bg-gray-200 animate-pulse" />
                  <div className="p-5 flex-1">
                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mt-4" />
                  </div>
                </div>
              ))
            : recipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -6 }}
                  className="h-full"
                >
                  <Link
                    href={`/browse/${recipe._id}`}
                    className="h-full flex flex-col rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-xl transition"
                  >
                    <div className="relative h-52 shrink-0">
                      <Image
                        src={recipe.recipeImage || "/images/placeholder.jpg"}
                        alt={recipe.recipeName}
                        fill
                        className="object-cover"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50 transition"
                      >
                        <FiHeart size={18} className="text-red-500" />
                      </motion.button>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg line-clamp-1">
                        {recipe.recipeName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {recipe.category}
                      </p>
                      <div className="flex items-center gap-2 mt-auto pt-4 text-gray-500 text-sm">
                        <FiClock size={16} />
                        {recipe.preparationTime} mins
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipe;
