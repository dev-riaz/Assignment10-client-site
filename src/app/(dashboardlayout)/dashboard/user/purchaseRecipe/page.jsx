"use client";

import { useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { FaCheckCircle, FaEye } from "react-icons/fa";
import { GiCoffeeCup, GiCupcake } from "react-icons/gi";
import { IoLeafOutline } from "react-icons/io5";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { getMyPayments, getRecipeById } from "@/lib/api/getRecipe";

const categoryStyles = {
  Dinner: {
    bg: "bg-orange-50",
    text: "text-orange-500",
    icon: <GiCoffeeCup size={13} />,
  },
  Breakfast: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    icon: <GiCoffeeCup size={13} />,
  },
  Dessert: {
    bg: "bg-purple-50",
    text: "text-purple-500",
    icon: <GiCupcake size={13} />,
  },
  Salad: {
    bg: "bg-green-50",
    text: "text-green-500",
    icon: <IoLeafOutline size={13} />,
  },
  Lunch: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: <GiCoffeeCup size={13} />,
  },
};

const ITEMS_PER_PAGE = 5;

const CategoryBadge = ({ category }) => {
  const style = categoryStyles[category] || {
    bg: "bg-gray-100",
    text: "text-gray-500",
    icon: null,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${style.bg} ${style.text}`}
    >
      {style.icon}
      {category}
    </span>
  );
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MyPurchasedRecipesPage = () => {
  const { data: session } = useSession();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* ── Fetch payments, then hydrate each with its recipe info ── */
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!session?.user?.email) {
        setPurchases([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const res = await getMyPayments(session.user.email);

      if (!res.success || !res.data?.length) {
        setPurchases([]);
        setLoading(false);
        return;
      }

      const hydrated = await Promise.all(
        res.data.map(async (payment) => {
          const recipeRes = await getRecipeById(payment.recipeId);
          const recipe = recipeRes.success ? recipeRes.data : null;

          return {
            id: payment._id,
            recipeId: payment.recipeId,
            name: recipe?.recipeName || "Recipe unavailable",
            description: recipe?.description || "",
            category: recipe?.category || "Other",
            image: recipe?.recipeImage || null,
            price: `$${Number(payment.amount).toFixed(2)}`,
            purchasedOn: formatDate(payment.paidAt),
            purchasedTime: formatTime(payment.paidAt),
            status: payment.paymentStatus || "Completed",
          };
        }),
      );

      setPurchases(hydrated);
      setLoading(false);
    };

    fetchPurchases();
  }, [session]);

  const totalPages = Math.max(1, Math.ceil(purchases.length / ITEMS_PER_PAGE));
  const paginated = purchases.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 md:p-7"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* ── Header ── */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            My Purchased Recipes
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Show all purchased recipes of the logged in user.
          </p>
        </div>

        {/* Total Purchased */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <FiShoppingBag className="text-green-500" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Purchased</p>
            <p className="text-lg font-bold text-green-500">
              {purchases.length} Recipes
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <span className="loading loading-spinner loading-lg text-orange-400" />
        </div>
      ) : purchases.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <FiShoppingBag size={40} className="mb-3 opacity-50" />
          <p className="text-sm font-medium">No purchased recipes yet.</p>
        </motion.div>
      ) : (
        <>
          {/* ── Mobile Card List (below sm) ── */}

          <div className="grid grid-cols-1 gap-3 sm:hidden">
            <AnimatePresence mode="wait">
              {paginated.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  className="border border-gray-100 rounded-xl p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.06,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {recipe.name}
                      </p>
                      <div className="mt-1">
                        <CategoryBadge category={recipe.category} />
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
                      {recipe.price}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-700 font-medium">
                        {recipe.purchasedOn}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {recipe.purchasedTime}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                      <FaCheckCircle size={11} />
                      {recipe.status}
                    </span>
                  </div>

                  <a
                    href={`/recipe/${recipe.recipeId}`}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-orange-400 text-orange-500 text-xs font-semibold hover:bg-orange-50 transition-colors"
                  >
                    <FaEye size={12} />
                    View Details
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Table (sm and up) ── */}

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              {/* Head */}
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Recipe",
                    "Category",
                    "Price",
                    "Purchased On",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-sm font-semibold text-gray-600 pb-3 pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                <AnimatePresence mode="wait">
                  {paginated.map((recipe, index) => (
                    <motion.tr
                      key={recipe.id}
                      className="border-b border-gray-100 last:border-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.06,
                        ease: "easeOut",
                      }}
                    >
                      {/* Recipe */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            {recipe.image ? (
                              <img
                                src={recipe.image}
                                alt={recipe.name}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {recipe.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] leading-relaxed line-clamp-2">
                              {recipe.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <CategoryBadge category={recipe.category} />
                      </td>

                      {/* Price */}
                      <td className="py-4 pr-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                        {recipe.price}
                      </td>

                      {/* Purchased On */}
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <p className="text-sm text-gray-700 font-medium">
                          {recipe.purchasedOn}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {recipe.purchasedTime}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                          <FaCheckCircle size={11} />
                          {recipe.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 whitespace-nowrap">
                        <a
                          href={`/recipe/${recipe.recipeId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-orange-400 text-orange-500 text-xs font-semibold hover:bg-orange-50 transition-colors"
                        >
                          <FaEye size={12} />
                          View Details
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-center gap-2 mt-6 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-sm btn-circle btn-ghost border border-gray-200 disabled:opacity-40"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`btn btn-sm btn-circle border-0 font-semibold ${
                    page === p
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "btn-ghost text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-sm btn-circle btn-ghost border border-gray-200 disabled:opacity-40"
              >
                →
              </button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default MyPurchasedRecipesPage;
