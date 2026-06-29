"use client";

import { useEffect, useState } from "react";
import { getRecipes } from "../../../lib/api/getRecipe";
import BrowseRecipeCard from "@/components/browse/BrowseRecipeCard";
import {
  FiSearch,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";
import { PiChefHat } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 6;

const CATEGORIES = [
  "All Categories",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
];
const CUISINES = [
  "All Cuisines",
  "Bangladeshi",
  "Chinese",
  "Indian",
  "Italian",
  "Mexican",
  "thai",
  "American",
];
const DIFFICULTIES = ["All Difficulties", "Easy", "Medium", "Hard"];
const SORT_OPTIONS = ["Sort By", "Most Liked", "Newest", "Cook Time"];

/* ── Filter Select ── */
const FilterSelect = ({ options, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="select select-sm bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-orange-300 min-w-[130px]"
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

/* ── Pagination ── */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1, 2, 3];
    if (currentPage > 4) pages.push("...");
    if (currentPage > 3 && currentPage < totalPages - 2)
      pages.push(currentPage);
    pages.push("...", totalPages);
    return [...new Set(pages)];
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FiChevronLeft size={16} />
      </button>

      {getPages().map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-full text-sm font-medium transition ${
              currentPage === page
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

/* ── Main Page ── */
const BrowsePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [cuisine, setCuisine] = useState("All Cuisines");
  const [difficulty, setDifficulty] = useState("All Difficulties");
  const [sortBy, setSortBy] = useState("Sort By");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch ──
  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      try {
        setLoading(true);

        const res = await getRecipes({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: search.trim(),
          category: category !== "All Categories" ? category : "",
          cuisineType: cuisine !== "All Cuisines" ? cuisine : "",
          difficultyLevel: difficulty !== "All Difficulties" ? difficulty : "",
          sortBy: sortBy !== "Sort By" ? sortBy : "",
        });

        if (!cancelled && res.success) {
          setRecipes(res.data);
          console.log(res);
          setTotalPages(res.totalPages ?? 1);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, [currentPage, search, category, cuisine, difficulty, sortBy]);

  // ── Filter change handlers ──
  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };
  const handleCategory = (val) => {
    setCategory(val);
    setCurrentPage(1);
  };
  const handleCuisine = (val) => {
    setCuisine(val);
    setCurrentPage(1);
  };
  const handleDifficulty = (val) => {
    setDifficulty(val);
    setCurrentPage(1);
  };
  const handleSortBy = (val) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-11/12 mx-auto">
        {/* ── Search Bar ── */}
        <div className="relative mb-5">
          <FiSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-12 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 shadow-sm"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition">
            <FiSettings size={17} />
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <FilterSelect
            options={CATEGORIES}
            value={category}
            onChange={handleCategory}
          />
          <FilterSelect
            options={CUISINES}
            value={cuisine}
            onChange={handleCuisine}
          />
          <FilterSelect
            options={DIFFICULTIES}
            value={difficulty}
            onChange={handleDifficulty}
          />
          <FilterSelect
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={handleSortBy}
          />
        </div>

        {/* ── Recipe Grid ── */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-success" />
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
                <PiChefHat className="text-5xl text-orange-500" />
              </div>

              <h2 className="text-3xl font-bold text-gray-800">
                No Recipes Found
              </h2>

              <p className="mt-3 text-gray-500">
                Sorry! We could not find any recipes matching your search. Try
                using different keywords or explore all recipes.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/recipes"
                  className="rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600"
                >
                  Browse Recipes
                </Link>

                <button
                  onClick={() => window.location.reload()}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiSearch />
                    Try Again
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            <AnimatePresence>
              {recipes.map((recipe) => (
                <motion.div
                  key={recipe._id}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
                >
                  <BrowseRecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Pagination ── */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BrowsePage;
