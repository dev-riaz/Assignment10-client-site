"use client";

import { useState, useRef } from "react";
import Link from "next/link";
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
import Image from "next/image";

const initialRecipes = [
  {
    id: 1,
    name: "Spicy Chicken Wings",
    status: "Published",
    likes: 120,
    date: "May 20, 2024",
    image: null,
  },
];

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

const MyRecipePage = () => {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null); // preview URL
  const [editImageFile, setEditImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  /* ── Open modal ── */
  const openEdit = (recipe) => {
    setEditingRecipe(recipe);
    setEditName(recipe.name);
    setEditImage(recipe.image || null);
    setEditImageFile(null);
  };

  /* ── Close modal ── */
  const closeEdit = () => {
    setEditingRecipe(null);
    setEditName("");
    setEditImage(null);
    setEditImageFile(null);
    setIsDragging(false);
  };

  /* ── Handle file selection ── */
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setEditImageFile(file);
    const url = URL.createObjectURL(file);
    setEditImage(url);
  };

  const onFileChange = (e) => handleFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  /* ── Save ── */
  const handleSave = () => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === editingRecipe.id
          ? { ...r, name: editName.trim() || r.name, image: editImage }
          : r,
      ),
    );
    closeEdit();
  };

  const ActionButtons = ({ recipe }) => (
    <div className="flex gap-2">
      <button
        className="btn btn-sm btn-square btn-outline"
        title="Edit"
        onClick={() => openEdit(recipe)}
      >
        <FiEdit2 size={14} />
      </button>
      <button
        className="btn btn-sm btn-square btn-outline btn-error"
        title="Delete"
        onClick={() =>
          setRecipes((prev) => prev.filter((r) => r.id !== recipe.id))
        }
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  );

  return (
    <>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">My Recipes</h2>
          <Link href="/dashboard/add-recipe" className="w-full sm:w-auto">
            <button className="btn btn-outline btn-success w-full sm:w-auto rounded-xl">
              <FiPlus />
              Add New Recipe
            </button>
          </Link>
        </div>

        {/* ── MOBILE: Card List ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-start justify-between gap-3 border border-gray-100 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col gap-2 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {recipe.name}
                </p>
                <StatusBadge status={recipe.status} />
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <FiHeart size={11} /> {recipe.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={11} /> {recipe.date}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <ActionButtons recipe={recipe} />
              </div>
            </div>
          ))}
        </div>

        {/* ── DESKTOP: Card List ── */}
        <div className="hidden md:flex flex-col gap-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between gap-4 bg-white border border-gray-100 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.name}
                      height={50}
                      width={50}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiFeather className="text-orange-400" size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {recipe.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={recipe.status} />
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FiHeart size={11} /> {recipe.likes}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FiCalendar size={11} /> {recipe.date}
                    </span>
                  </div>
                </div>
              </div>
              <ActionButtons recipe={recipe} />
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════ EDIT MODAL ════════════════ */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeEdit}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            {/* Close */}
            <button
              onClick={closeEdit}
              className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost text-gray-500"
            >
              <FiX size={16} />
            </button>

            {/* Title */}
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

              {/* Preview */}
              {editImage ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 mb-2">
                  <Image
                    src={editImage}
                    alt="preview"
                    width={50}
                    height={50}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setEditImage(null);
                      setEditImageFile(null);
                    }}
                    className="absolute top-2 right-2 btn btn-xs btn-circle bg-white/80 hover:bg-white border-0 shadow"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ) : (
                /* Drop Zone */
                <div
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

              {/* Upload button when no preview */}
              {!editImage && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline btn-sm w-full mt-2 rounded-xl border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                >
                  <FiUpload size={14} />
                  Upload from device
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeEdit}
                className="btn btn-outline flex-1 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editName.trim()}
                className="btn btn-success flex-1 rounded-xl text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyRecipePage;
