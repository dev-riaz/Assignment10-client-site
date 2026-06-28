"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { FiUploadCloud, FiImage, FiX } from "react-icons/fi";

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Drink",
];
const CUISINES = [
  "Bangladeshi",
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Thai",
  "American",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const AddRecipePage = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    cuisineType: "",
    difficultyLevel: "",
    preparationTime: "",
    ingredients: "",
    instructions: "",
  });
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage({ url: URL.createObjectURL(file), file });
  };

  const onFileChange = (e) => handleFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recipe submitted:", { ...form, image: image?.file });
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="border border-gray-200 rounded-2xl p-5 md:p-7 bg-white"
      >
        {/* ── Title ── */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          Add New Recipe
        </h2>

        {/* ── Row 1: Name + Category ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Recipe Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Recipe Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter recipe name"
              className="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-orange-400"
            >
              <option value="" disabled>
                Select category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Row 2: Cuisine + Difficulty ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Cuisine Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Cuisine Type
            </label>
            <select
              name="cuisineType"
              value={form.cuisineType}
              onChange={handleChange}
              className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-orange-400"
            >
              <option value="" disabled>
                Select cuisine
              </option>
              {CUISINES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Difficulty Level
            </label>
            <select
              name="difficultyLevel"
              value={form.difficultyLevel}
              onChange={handleChange}
              className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-orange-400"
            >
              <option value="" disabled>
                Select difficulty
              </option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Row 3: Prep Time + Image Upload ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Preparation Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Preparation Time
            </label>
            <div className="relative">
              <input
                type="number"
                name="preparationTime"
                value={form.preparationTime}
                onChange={handleChange}
                placeholder="e.g. 30"
                min={1}
                className="input input-bordered w-full rounded-xl text-sm pr-14 focus:outline-none focus:border-orange-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none select-none">
                mins
              </span>
            </div>
          </div>

          {/* Recipe Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Recipe Image
            </label>

            {image ? (
              /* ── Preview ── */
              <div className="relative w-full h-[106px] rounded-xl overflow-hidden border border-gray-200">
                <Image
                width={50}
                height={50}
                  src={image.url}
                  alt="recipe preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 btn btn-xs btn-circle bg-white/80 hover:bg-white border-0 shadow"
                >
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              /* ── Drop Zone ── */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-[106px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                  isDragging
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-300 hover:border-orange-300 hover:bg-orange-50/40"
                }`}
              >
                <div className="flex gap-1 text-gray-300">
                  <FiUploadCloud size={26} />
                  <FiImage size={26} />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Upload Image
                </p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        </div>

        {/* ── Ingredients ── */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-semibold text-gray-700">
            Ingredients
          </label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            rows={3}
            placeholder="Enter ingredients (one per line)"
            className="textarea textarea-bordered w-full rounded-xl text-sm resize-none focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* ── Instructions ── */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm font-semibold text-gray-700">
            Instructions
          </label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows={4}
            placeholder="Write cooking instructions step by step..."
            className="textarea textarea-bordered w-full rounded-xl text-sm resize-none focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          className="btn w-full rounded-xl text-white font-semibold text-base"
          style={{ backgroundColor: "#f97316", borderColor: "#f97316" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#ea6c0a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#f97316")
          }
        >
          Publish Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipePage;
