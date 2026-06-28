"use client";

import { useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { FaCheckCircle, FaEye } from "react-icons/fa";
import { GiCoffeeCup, GiCupcake } from "react-icons/gi";
import { IoLeafOutline } from "react-icons/io5";

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

const recipes = [
  {
    id: 1,
    name: "Creamy Chicken Pasta",
    description: "A rich and creamy pasta with grilled chicken and parmesan.",
    category: "Dinner",
    price: "$4.99",
    purchasedOn: "May 20, 2024",
    purchasedTime: "10:30 AM",
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=160&h=130&fit=crop",
  },
  {
    id: 2,
    name: "Fluffy Pancakes",
    description: "Soft and fluffy pancakes perfect for a healthy breakfast.",
    category: "Breakfast",
    price: "$3.49",
    purchasedOn: "May 18, 2024",
    purchasedTime: "09:15 AM",
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=160&h=130&fit=crop",
  },
];

const CategoryBadge = ({ category }) => {
  const style = categoryStyles[category] || {
    bg: "bg-gray-100",
    text: "text-gray-500",
    icon: null,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {style.icon}
      {category}
    </span>
  );
};

const MyPurchasedRecipesPage = () => {
  const [page, setPage] = useState(1);
  const totalPages = 3;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            My Purchased Recipes
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Show all purchased recipes of the logged in user.
          </p>
        </div>

        {/* Total Purchased */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <FiShoppingBag className="text-green-500" size={22} />
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">Total Purchased</p>
            <p className="text-lg font-bold text-green-500">12 Recipes</p>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
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
            {recipes.map((recipe) => (
              <tr
                key={recipe.id}
                className="border-b border-gray-100 last:border-0"
              >
                {/* Recipe */}
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {recipe.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] leading-relaxed">
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
                  <button className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-orange-400 text-orange-500 text-xs font-semibold hover:bg-orange-50 transition-colors">
                    <FaEye size={12} />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-center gap-2 mt-6">
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
      </div>
    </div>
  );
};

export default MyPurchasedRecipesPage;
