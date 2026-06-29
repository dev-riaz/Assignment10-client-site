"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiHeart,
  FiCalendar,
  FiFeather,
  FiX,
  FiUpload,
  FiImage,
} from "react-icons/fi";
import { useSession } from "@/lib/auth-client";
import { getMyRecipe } from "@/lib/api/getRecipe";
import { updateRecipe } from "@/lib/api/updateRecipe";
import { deleteRecipe } from "@/lib/api/deleteRecipe";
import { uploadImageToCloudinary } from "@/lib/api/uploadImage";
import toast from "react-hot-toast";

/* ── Status Badge ── */
const StatusBadge = ({ status }) => (
  <span
    className={`badge badge-sm rounded-full font-medium ${
      status === "Published"
        ? "badge-success badge-outline"
        : "badge-warning badge-outline"
    }`}
  >
    {status}
  </span>
);

/* ── Format Date ── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ── Animation Variants ── */
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.18 } },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
  }),
};

const MyRecipePage = () => {
  const { data: session, isPending } = useSession();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const res = await getMyRecipe(session.user.email);

        if (res.success) setRecipes(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [session, isPending]);

  /* ── Modal ── */
  const openEdit = (recipe) => {
    setEditingRecipe(recipe);
    setEditName(recipe.recipeName);
    setEditImage(recipe.recipeImage || null);
    setEditImageFile(null);
  };

  const closeEdit = () => {
    setEditingRecipe(null);
    setEditName("");
    setEditImage(null);
    setEditImageFile(null);
    setIsDragging(false);
  };

  /* ── Image Upload ── */
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setEditImageFile(file);
    setEditImage(URL.createObjectURL(file));
  };

  const onFileChange = (e) => handleFile(e.target.files[0]);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  /* ── Save in db ── */
  const handleSave = async () => {
    if (!editingRecipe) return;

    const trimmedName = editName.trim();
    const previousRecipes = recipes;

    setSaving(true);

    try {
      const payload = {
        recipeName: trimmedName || editingRecipe.recipeName,
      };

      if (editImageFile) {
        setUploadingImage(true);
        try {
          const uploadedUrl = await uploadImageToCloudinary(editImageFile);
          payload.recipeImage = uploadedUrl;
        } finally {
          setUploadingImage(false);
        }
      } else if (editImage && !editImage.startsWith("blob:")) {
        payload.recipeImage = editImage;
      } else if (!editImage) {
        payload.recipeImage = "";
      }

      setRecipes((prev) =>
        prev.map((r) =>
          r._id === editingRecipe._id ? { ...r, ...payload } : r,
        ),
      );

      const res = await updateRecipe(editingRecipe._id, payload);

      if (!res?.success) {
        throw new Error(res?.message || "Update failed");
      }

      toast.success("Update Recipe Successful!");
      closeEdit();
    } catch (error) {
      console.error(error);
      setRecipes(previousRecipes);
      const message = error?.message?.includes("upload")
        ? "Image upload Failed "
        : "Recipe update Failed";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete on db ── */
  const handleDelete = async (id) => {
    const previousRecipes = recipes;

    setDeletingId(id);

    setRecipes((prev) => prev.filter((r) => r._id !== id));

    try {
      const res = await deleteRecipe(id);

      if (!res?.success) {
        throw new Error(res?.message || "Delete failed");
      }

      toast.success("Recipe Delete Successful!");
    } catch (error) {
      console.error(error);
      setRecipes(previousRecipes);
      toast.error("Recipe Delete failed Try Again");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Action Buttons ── */
  const ActionButtons = ({ recipe }) => (
    <div className="flex gap-2">
      <button
        className="btn btn-sm btn-square btn-outline"
        title="Edit"
        onClick={() => openEdit(recipe)}
        disabled={deletingId === recipe._id}
      >
        <FiEdit2 size={14} />
      </button>
      <button
        className="btn btn-sm btn-square btn-outline btn-error"
        title="Delete"
        onClick={() => handleDelete(recipe._id)}
        disabled={deletingId === recipe._id}
      >
        {deletingId === recipe._id ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <FiTrash2 size={14} />
        )}
      </button>
    </div>
  );

  /* ── Loading ── */
  if (isPending || loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-success" />
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">My Recipes</h2>
          <Link href="/dashboard/user/addRecipe" className="w-full sm:w-auto">
            <button className="btn btn-outline btn-success w-full sm:w-auto rounded-xl">
              <FiPlus /> Add New Recipe
            </button>
          </Link>
        </div>

        {/* ── MOBILE ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {recipes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <FiFeather className="text-orange-300" size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-700">
                No Recipes Found
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                You have not added any recipe yet.
              </p>
              <Link href="/dashboard/user/addRecipe">
                <button className="btn btn-outline btn-success rounded-xl mt-4">
                  <FiPlus /> Add Your First Recipe
                </button>
              </Link>
            </div>
          ) : (
            recipes.map((recipe, i) => (
              <motion.div
                key={recipe._id}
                custom={i}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-start justify-between gap-3 border border-gray-100 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl bg-orange-50 flex-shrink-0 overflow-hidden">
                    {recipe.recipeImage ? (
                      <Image
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiFeather className="text-orange-300" size={18} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">
                      {recipe.recipeName}
                    </p>
                    <StatusBadge status={recipe.status} />
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiHeart size={11} /> {recipe.likesCount ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar size={11} /> {formatDate(recipe.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <ActionButtons recipe={recipe} />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* ── DESKTOP ── */}
        <div className="hidden md:flex flex-col gap-3">
          {recipes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <FiFeather className="text-orange-300" size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-700">
                No Recipes Found
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                You have not added any recipe yet.
              </p>
              <Link href="/dashboard/user/addRecipe">
                <button className="btn btn-outline btn-success rounded-xl mt-4">
                  <FiPlus /> Add Your First Recipe
                </button>
              </Link>
            </div>
          ) : (
            recipes.map((recipe, i) => (
              <motion.div
                key={recipe._id}
                custom={i}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-between gap-4 bg-white border border-gray-100 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl bg-orange-50 flex-shrink-0 overflow-hidden">
                    {recipe.recipeImage ? (
                      <Image
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiFeather className="text-orange-400" size={18} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {recipe.recipeName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={recipe.status} />
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiHeart size={11} /> {recipe.likesCount ?? 0}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiCalendar size={11} /> {formatDate(recipe.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <ActionButtons recipe={recipe} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeEdit}
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
            >
              <button
                onClick={closeEdit}
                className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost text-gray-400"
              >
                <FiX size={16} />
              </button>

              <h3 className="text-lg font-bold text-gray-800 mb-5">
                Edit Recipe
              </h3>

              {/* Recipe Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Recipe Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full rounded-xl focus:outline-none focus:border-orange-400"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter recipe name"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Recipe Image
                </label>
                <AnimatePresence mode="wait">
                  {editImage ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 mb-2"
                    >
                      <Image
                        src={editImage}
                        alt="preview"
                        fill
                        sizes="(max-width: 448px) 100vw, 448px"
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() => {
                          setEditImage(null);
                          setEditImageFile(null);
                        }}
                        className="absolute top-2 right-2 btn btn-xs btn-circle bg-white/80 hover:bg-white border-0 shadow"
                      >
                        <FiX size={12} />npm 
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
                      className={`w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                        isDragging
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                        <FiImage className="text-orange-400" size={22} />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        Drag & drop or{" "}
                        <span className="text-orange-500 underline underline-offset-2">
                          browse
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, WEBP — max 5 MB
                      </p>
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

                {!editImage && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline btn-sm w-full mt-2 rounded-xl border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                  >
                    <FiUpload size={14} /> Upload from device
                  </button>
                )}

                {editImageFile && (
                  <p className="text-xs text-gray-400 mt-2">Added New image</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeEdit}
                  className="btn btn-outline flex-1 rounded-xl"
                  disabled={saving}
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSave}
                  disabled={!editName.trim() || saving}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-success flex-1 rounded-xl text-white"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-xs" />
                      {uploadingImage ? "Uploading..." : "Saving..."}
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyRecipePage;
