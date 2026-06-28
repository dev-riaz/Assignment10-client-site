"use client";

import Image from "next/image";
import { FaClock, FaHeart } from "react-icons/fa";

const stats = [
  {
    title: "Total Recipes",
    value: "12",
    sub: "+2 This Month",
    color: "text-emerald-500",
  },
  {
    title: "Total Favorites",
    value: "34",
    sub: "+6 This Month",
    color: "text-emerald-500",
  },
  {
    title: "Total Likes Received",
    value: "560",
    sub: "+120 This Month",
    color: "text-emerald-500",
  },
  {
    title: "Premium Member",
    value: "Yes",
    sub: "● Active",
    color: "text-emerald-500",
  },
];

const recipes = [
  {
    id: 1,
    name: "Spicy Chicken Wings",
    image: "https://res.cloudinary.com/dmakhtoif/image/upload/v1782283592/samples/breakfast.jpg",
    time: "25 mins",
    likes: 130,
    status: "Published",
  },
  {
    id: 2,
    name: "Veggie Pizza",
    image: "/assets/recipe2.jpg",
    time: "30 mins",
    likes: 98,
    status: "Published",
  },
  {
    id: 3,
    name: "Beef Tacos",
    image: "/assets/recipe3.jpg",
    time: "35 mins",
    likes: 76,
    status: "Draft",
  },
];

const Overview = () => {
  return (
    <section className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard Overview
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 text-center gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200  bg-white p-6 shadow-md transition duration-300 hover:shadow-lg"
          >
            <h4 className="text-sm font-medium text-slate-500">{item.title}</h4>

            <h2 className="mt-2 text-4xl font-bold text-slate-900">
              {item.value}
            </h2>

            <p className={`mt-3 text-sm font-semibold ${item.color}`}>
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Recipes */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Recent Recipes</h3>

          <button className="btn btn-outline btn-sm rounded-xl">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex flex-col md:flex-row gap-4 rounded-xl border-gray-200 bg-white shadow-md p-4  justify-between"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  width={60}
                  height={60}
                  className="rounded-xl object-cover"
                />

                <h4 className="font-semibold text-slate-800">{recipe.name}</h4>
              </div>

              {/* Right */}
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2 text-md text-slate-500">
                  <FaClock />
                  {recipe.time}
                </div>

                <div className="flex items-center gap-2 text-md text-slate-500">
                  <FaHeart />
                  {recipe.likes}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Overview;
