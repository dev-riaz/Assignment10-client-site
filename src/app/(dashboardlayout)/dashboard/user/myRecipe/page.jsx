"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiHeart,
  FiCalendar,
  FiImage,
  FiX,
  FiFeather,
} from "react-icons/fi";

import toast from "react-hot-toast";

import { useSession } from "@/lib/auth-client";
import { getMyRecipe } from "@/lib/api/getRecipe";
import { updateRecipe } from "@/lib/api/updateRecipe";
import { deleteRecipe } from "@/lib/api/deleteRecipe";
import { uploadImageToCloudinary } from "@/lib/api/uploadImage";

const formatDate = (date) => {
  if (!date) return "--";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      status === "Published"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {status}
  </span>
);

export default function MyRecipePage() {
  const { data: session, isPending } = useSession();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingRecipe, setEditingRecipe] = useState(null);

  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [deletingRecipe, setDeletingRecipe] = useState(null);

  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  /* ============================
      LOAD RECIPES + LIKE SYNC
  ============================= */

  useEffect(() => {
    if (isPending) return;
    if (!session?.user?.email) return;

    const loadRecipes = async () => {
      try {
        setLoading(true);

        const res = await getMyRecipe(session.user.email);

        if (res.success) {
          setRecipes(res.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();

    // Tab e abar focus fire ashle recipes re-fetch hobe
    // (ex: details page e like kore back ashle fresh data pawa jabe)
    const handleFocus = () => loadRecipes();
    window.addEventListener("focus", handleFocus);

    // Details page theke like/unlike korle ei custom event dispatch hobe
    // ekhane shei event shune shudhu shei recipe-r likesCount update kora hoy,
    // pura list re-fetch korar dorkar hoy na
    const handleLikeUpdate = (e) => {
      const { recipeId, likesCount } = e.detail || {};
      if (!recipeId) return;

      setRecipes((prev) =>
        prev.map((r) => (r._id === recipeId ? { ...r, likesCount } : r)),
      );
    };
    window.addEventListener("recipeLikeUpdated", handleLikeUpdate);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("recipeLikeUpdated", handleLikeUpdate);
    };
  }, [session, isPending]);

  /* ============================
      EDIT MODAL OPEN / CLOSE
  ============================= */

  const openEdit = (recipe) => {
    setEditingRecipe(recipe);
    setEditName(recipe.recipeName);
    setEditImage(recipe.recipeImage);
    setEditImageFile(null);
  };

  const closeEdit = () => {
    setEditingRecipe(null);
    setEditName("");
    setEditImage("");
    setEditImageFile(null);
    setIsDragging(false);
  };

  /* ============================
      DELETE RECIPE
  ============================= */

  const openDeleteConfirm = (recipe) => {
    setDeletingRecipe(recipe);
  };

  const closeDeleteConfirm = () => {
    setDeletingRecipe(null);
  };

  const handleDelete = async () => {
    if (!deletingRecipe) return;

    const id = deletingRecipe._id;
    const previousRecipes = recipes;

    setDeletingId(id);
    setRecipes((prev) => prev.filter((item) => item._id !== id));
    setDeletingRecipe(null);

    try {
      const res = await deleteRecipe(id);

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success("Recipe deleted successfully");
    } catch (error) {
      console.log(error);
      setRecipes(previousRecipes);
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  /* ============================
      IMAGE SELECT
  ============================= */

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    setEditImageFile(file);
    setEditImage(URL.createObjectURL(file));
  };

  const onFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  /* ============================
      SAVE UPDATE
  ============================= */

  const handleSave = async () => {
    if (!editingRecipe) return;

    setSaving(true);

    try {
      const payload = {
        recipeName: editName,
      };

      if (editImageFile) {
        setUploadingImage(true);

        const imageUrl = await uploadImageToCloudinary(editImageFile);

        payload.recipeImage = imageUrl;

        setUploadingImage(false);
      }

      const res = await updateRecipe(editingRecipe._id, payload);

      if (!res.success) {
        throw new Error(res.message);
      }

      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe._id === editingRecipe._id ? { ...recipe, ...payload } : recipe,
        ),
      );

      toast.success("Recipe Updated");
      closeEdit();
    } catch (error) {
      console.log(error);
      toast.error("Update Failed");
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  if (loading || isPending) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-success"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
          <p className="text-gray-500 mt-1">Manage your uploaded recipes</p>
        </div>

        <Link href="/dashboard/user/addRecipe">
          <button className="btn bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
            <FiPlus />
            Add Recipe
          </button>
        </Link>
      </motion.div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="table">
          <thead className="bg-orange-50">
            <tr>
              <th>Recipe</th>
              <th>Status</th>
              <th>Likes</th>
              <th>Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <FiFeather size={45} className="text-orange-300 mb-4" />

                    <h2 className="text-xl font-bold text-gray-700">
                      No Recipes Found
                    </h2>

                    <p className="text-sm text-gray-400 mt-2">
                      You haven&apos;t added any recipe yet.
                    </p>

                    <Link href="/dashboard/user/addRecipe">
                      <button className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white rounded-xl mt-5">
                        <FiPlus />
                        Add Recipe
                      </button>
                    </Link>
                  </motion.div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {recipes.map((recipe, index) => (
                  <motion.tr
                    key={recipe._id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="hover:bg-orange-50 transition-all"
                  >
                    {/* Recipe */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                          {recipe.recipeImage ? (
                            <Image
                              src={recipe.recipeImage}
                              alt={recipe.recipeName}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex justify-center items-center">
                              <FiImage size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {recipe.recipeName}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {recipe.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={recipe.status} />
                    </td>

                    {/* Likes */}
                    <td>
                      <div className="flex items-center gap-2">
                        <FiHeart className="text-red-500" />
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={recipe.likesCount || 0}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.2 }}
                          >
                            {recipe.likesCount || 0}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <div className="flex items-center gap-2">
                        <FiCalendar />
                        {formatDate(recipe.createdAt)}
                      </div>
                    </td>

                    {/* Action */}
                    <td>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEdit(recipe)}
                          className="btn btn-sm btn-square bg-orange-500 hover:bg-orange-600 text-white border-0"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => openDeleteConfirm(recipe)}
                          disabled={deletingId === recipe._id}
                          className="btn btn-sm btn-square btn-error text-white"
                        >
                          {deletingId === recipe._id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <FiTrash2 />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">Edit Recipe</h2>
                <button onClick={closeEdit} className="btn btn-circle btn-sm">
                  <FiX />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="font-medium">Recipe Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input input-bordered w-full mt-2"
                  />
                </div>

                {/* Recipe Image */}
                <div>
                  <label className="font-medium block mb-2">Recipe Image</label>

                  {editImage ? (
                    <div className="relative rounded-xl overflow-hidden border">
                      <Image
                        src={editImage}
                        alt="Preview"
                        width={600}
                        height={300}
                        className="w-full h-56 object-cover"
                        unoptimized
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setEditImage("");
                          setEditImageFile(null);
                        }}
                        className="absolute top-3 right-3 btn btn-circle btn-sm bg-white"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl h-56 flex flex-col justify-center items-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-300"
                      }`}
                    >
                      <FiImage size={45} className="text-orange-400 mb-3" />
                      <h3 className="font-semibold">Drag & Drop Image</h3>
                      <p className="text-sm text-gray-500">
                        অথবা Click করে Image Select করুন
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button onClick={closeEdit} className="btn btn-outline">
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {saving ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        {uploadingImage ? "Uploading..." : "Saving..."}
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deletingRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl w-full max-w-sm p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Delete Recipe
                </h2>
                <button
                  onClick={closeDeleteConfirm}
                  className="btn btn-circle btn-sm"
                >
                  <FiX />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-700">
                  {deletingRecipe.recipeName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deletingId === deletingRecipe._id}
                  className="btn btn-error text-white"
                >
                  {deletingId === deletingRecipe._id ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
