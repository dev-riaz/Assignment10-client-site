"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaClock, FaHeart, FaUtensils } from "react-icons/fa";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  getMyRecipe,
  getMyFavorites,
  getUserByEmail,
} from "@/lib/api/getRecipe";

/* ── কোনো তারিখ এই মাসে পড়ে কিনা চেক করে ── */
const isThisMonth = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  );
};

const Overview = () => {
  const { data: session } = useSession();

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const email = session.user.email;

      const [recipesRes, favoritesRes, userRes] = await Promise.all([
        getMyRecipe(email),
        getMyFavorites(email),
        getUserByEmail(email),
      ]);

      if (recipesRes?.success) {
        // ── backend array অথবা single object দুটোই পাঠাতে পারে, তাই normalize করা হচ্ছে ──
        const data = recipesRes.data;
        setRecipes(Array.isArray(data) ? data : data ? [data] : []);
      }
      if (favoritesRes?.success) setFavorites(favoritesRes.data || []);
      if (userRes?.success) {
        setIsPremium(
          Boolean(
            userRes.data?.isPremium || userRes.data?.membership === "premium",
          ),
        );
      }

      setLoading(false);
    };

    fetchOverview();
  }, [session]);

  /* ── Derived stats ── */
  const totalRecipes = recipes.length;
  const totalLikesReceived = recipes.reduce(
    (sum, r) => sum + (r.likesCount || 0),
    0,
  );
  const totalFavorites = favorites.length;

  const recipesThisMonth = recipes.filter((r) =>
    isThisMonth(r.createdAt),
  ).length;
  const favoritesThisMonth = favorites.filter((f) =>
    isThisMonth(f.createdAt),
  ).length;

  const stats = [
    {
      title: "Total Recipes",
      value: String(totalRecipes),
      sub: `+${recipesThisMonth} This Month`,
      color: "text-emerald-500",
    },
    {
      title: "Total Favorites",
      value: String(totalFavorites),
      sub: `+${favoritesThisMonth} This Month`,
      color: "text-emerald-500",
    },
    {
      title: "Total Likes Received",
      value: String(totalLikesReceived),
      sub: "Across all recipes",
      color: "text-emerald-500",
    },
    {
      title: "Premium Member",
      value: isPremium ? "Yes" : "No",
      sub: isPremium ? "● Active" : "● Not active",
      color: isPremium ? "text-emerald-500" : "text-slate-400",
    },
  ];

  /* ── সবচেয়ে সাম্প্রতিক ৩টা recipe ── */
  const recentRecipes = [...recipes]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  if (loading) {
    return (
      <section className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-emerald-500" />
      </section>
    );
  }

  return (
    <motion.section
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard Overview
        </h2>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 text-center gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={item.title}
            className="rounded-2xl border border-slate-200  bg-white p-6 shadow-md transition duration-300 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1 + index * 0.08,
              ease: "easeOut",
            }}
            whileHover={{ y: -4 }}
          >
            <h4 className="text-sm font-medium text-slate-500">{item.title}</h4>

            <h2 className="mt-2 text-4xl font-bold text-slate-900">
              {item.value}
            </h2>

            <p className={`mt-3 text-sm font-semibold ${item.color}`}>
              {item.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Recipes */}
      <div>
        <motion.div
          className="mb-6 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        >
          <h3 className="text-xl font-bold text-slate-800">Recent Recipes</h3>

          <a
            href="/dashboard/my-recipes"
            className="btn btn-outline btn-sm rounded-xl"
          >
            View All
          </a>
        </motion.div>

        {recentRecipes.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-14 text-slate-400 rounded-xl border border-dashed border-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <FaUtensils size={30} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">
              You haven&apos;t added any recipes yet.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {recentRecipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                className="flex flex-col md:flex-row gap-4 rounded-xl border-gray-200 bg-white shadow-md p-4  justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.45 + index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div
                    className="relative rounded-xl overflow-hidden bg-slate-100 flex-shrink-0"
                    style={{ width: "60px", height: "60px" }}
                  >
                    {recipe.recipeImage ? (
                      <Image
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FaUtensils size={22} />
                      </div>
                    )}
                  </div>

                  <h4 className="font-semibold text-slate-800">
                    {recipe.recipeName}
                  </h4>
                </div>

                {/* Right */}
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2 text-md text-slate-500">
                    <FaClock />
                    {recipe.preparationTime} mins
                  </div>

                  <div className="flex items-center gap-2 text-md text-slate-500">
                    <FaHeart />
                    {recipe.likesCount || 0}
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-semibold ${
                      recipe.status === "Published"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {recipe.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Overview;
