"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PiChefHat } from "react-icons/pi";
import { getRecipes } from "@/lib/api/getRecipe";
import BrowseRecipeCard from "./browse/BrowseRecipeCard";

const UserPopularRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      setLoading(true);
      const res = await getRecipes({ page: 1, limit: 4, sortBy: "Most Liked" });
      if (res.success) {
        setRecipes(res.data || []);
      }
      setLoading(false);
    };

    fetchPopularRecipes();
  }, []);

  return (
    <section className="py-6 bg-white">
      <div className="w-11/12 mx-auto px-4">
        {/* Heading */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Popular Recipes</h2>

          <Link
            href="/browse"
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            View All
          </Link>
        </motion.div>

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <span className="loading loading-spinner loading-lg text-orange-400" />
          </div>
        ) : recipes.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <PiChefHat size={36} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">No recipes available yet.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <BrowseRecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserPopularRecipe;
