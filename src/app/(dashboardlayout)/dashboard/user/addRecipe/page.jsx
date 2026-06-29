"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiImage, FiX } from "react-icons/fi";
import { useSession } from "@/lib/auth-client";
import { RxCross2 } from "react-icons/rx";
import { addRecipe } from "@/lib/api/addRecipe/action";

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const errorVariants = {
  hidden: { opacity: 0, y: -6, height: 0 },
  visible: { opacity: 1, y: 0, height: "auto", transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, height: 0, transition: { duration: 0.15 } },
};

const AddRecipePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

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
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage({ url: URL.createObjectURL(file), file });
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const onFileChange = (e) => handleFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Recipe name is required.";
    if (!form.category) newErrors.category = "Please select a category.";
    if (!form.cuisineType)
      newErrors.cuisineType = "Please select a cuisine type.";
    if (!form.difficultyLevel)
      newErrors.difficultyLevel = "Please select a difficulty level.";
    if (!form.preparationTime)
      newErrors.preparationTime = "Preparation time is required.";
    if (!image) newErrors.image = "Please upload a recipe image.";
    if (!form.ingredients.trim())
      newErrors.ingredients = "Ingredients are required.";
    if (!form.instructions.trim())
      newErrors.instructions = "Instructions are required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setUploading(true);

      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(image.file);

      const submittedData = {
        recipeName: form.name,
        recipeImage: imageUrl,
        category: form.category,
        cuisineType: form.cuisineType,
        difficultyLevel: form.difficultyLevel,
        preparationTime: form.preparationTime,
        ingredients: form.ingredients,
        instructions: form.instructions,

        authorId: session.user.id,
        authorName: session.user.name,
        authorEmail: session.user.email,

        likesCount: 0,
        isFeatured: false,
        status: "Published",
      };
      const resData = await addRecipe(submittedData);
      console.log("Response:", resData);

      if (!resData.success) {
        throw new Error(resData.message || "Failed to save recipe");
      }
      console.log("✅ Full Data:", resData);

      setForm({
        name: "",
        category: "",
        cuisineType: "",
        difficultyLevel: "",
        preparationTime: "",
        ingredients: "",
        instructions: "",
      });
      setImage(null);
      setErrors({});

      toast.success("Recipe published successfully!");
      setTimeout(() => {
        router.push("/dashboard/user/myRecipe");
      }, 1500);
    } catch (err) {
      console.error(`${(<RxCross2 />)}Image upload failed:`, err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const renderError = (field) => (
    <AnimatePresence>
      {errors[field] && (
        <motion.p
          key={field}
          variants={errorVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="text-xs text-red-500 overflow-hidden"
        >
          {errors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  const borderClass = (key) =>
    errors[key]
      ? "border-red-400 focus:border-red-400"
      : "focus:border-orange-400";

  return (
    <div className="w-full">
      <motion.form
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="border border-gray-200 rounded-2xl p-5 md:p-7 bg-white"
      >
        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="text-xl md:text-2xl font-bold text-gray-800 mb-6"
        >
          Add New Recipe
        </motion.h2>

        {/* Row 1: Name + Category */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          {/* Recipe Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Recipe Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter recipe name"
              className={`input input-bordered w-full rounded-xl text-sm focus:outline-none ${borderClass("name")}`}
            />
            {renderError("name")}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`select select-bordered w-full rounded-xl text-sm focus:outline-none ${borderClass("category")}`}
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
            {renderError("category")}
          </div>
        </motion.div>

        {/* Row 2: Cuisine + Difficulty */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          {/* Cuisine Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Cuisine Type <span className="text-red-500">*</span>
            </label>
            <select
              name="cuisineType"
              value={form.cuisineType}
              onChange={handleChange}
              className={`select select-bordered w-full rounded-xl text-sm focus:outline-none ${borderClass("cuisineType")}`}
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
            {renderError("cuisineType")}
          </div>

          {/* Difficulty Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Difficulty Level <span className="text-red-500">*</span>
            </label>
            <select
              name="difficultyLevel"
              value={form.difficultyLevel}
              onChange={handleChange}
              className={`select select-bordered w-full rounded-xl text-sm focus:outline-none ${borderClass("difficultyLevel")}`}
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
            {renderError("difficultyLevel")}
          </div>
        </motion.div>

        {/* Row 3: Prep Time + Image */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          {/* Preparation Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Preparation Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="preparationTime"
                value={form.preparationTime}
                onChange={handleChange}
                placeholder="e.g. 30"
                min={1}
                className={`input input-bordered w-full rounded-xl text-sm pr-14 focus:outline-none ${borderClass("preparationTime")}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none select-none">
                mins
              </span>
            </div>
            {renderError("preparationTime")}
          </div>

          {/* Recipe Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Recipe Image <span className="text-red-500">*</span>
            </label>

            <AnimatePresence mode="wait">
              {image ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full h-[106px] rounded-xl overflow-hidden border border-gray-200"
                >
                  <Image
                    src={image.url}
                    alt="recipe preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 btn btn-xs btn-circle bg-white/80 hover:bg-white border-0 shadow"
                  >
                    <FiX size={12} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-[106px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                    errors.image
                      ? "border-red-400 bg-red-50/30"
                      : isDragging
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-300 hover:border-orange-300 hover:bg-orange-50/40"
                  }`}
                >
                  <div
                    className={`flex gap-1 ${errors.image ? "text-red-300" : "text-gray-300"}`}
                  >
                    <FiUploadCloud size={26} />
                    <FiImage size={26} />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    Upload Image
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
            {renderError("image")}
          </div>
        </motion.div>

        {/* Ingredients */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-1.5 mb-4"
        >
          <label className="text-sm font-semibold text-gray-700">
            Ingredients <span className="text-red-500">*</span>
          </label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            rows={3}
            placeholder="Enter ingredients (one per line)"
            className={`textarea textarea-bordered w-full rounded-xl text-sm resize-none focus:outline-none ${borderClass("ingredients")}`}
          />
          {renderError("ingredients")}
        </motion.div>

        {/* Instructions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-1.5 mb-6"
        >
          <label className="text-sm font-semibold text-gray-700">
            Instructions <span className="text-red-500">*</span>
          </label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows={4}
            placeholder="Write cooking instructions step by step..."
            className={`textarea textarea-bordered w-full rounded-xl text-sm resize-none focus:outline-none ${borderClass("instructions")}`}
          />
          {renderError("instructions")}
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={uploading}
            whileHover={{ scale: uploading ? 1 : 1.01 }}
            whileTap={{ scale: uploading ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="btn w-full rounded-xl text-white font-semibold text-base"
            style={{
              backgroundColor: uploading ? "#fdba74" : "#f97316",
              borderColor: uploading ? "#fdba74" : "#f97316",
            }}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm" />
                Uploading...
              </span>
            ) : (
              "Publish Recipe"
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default AddRecipePage;


