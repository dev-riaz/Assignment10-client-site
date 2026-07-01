"use client";

import { useEffect, useState, useCallback } from "react";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllRecipesAdmin,
  updateRecipeStatus,
  deleteRecipeAdmin,
} from "@/lib/api/getRecipe"; 
const STATUS_OPTIONS = ["Published", "Pending", "Rejected"];

const statusColor = (status) => {
  switch (status) {
    case "Published":
      return "text-green-600";
    case "Pending":
      return "text-yellow-600";
    case "Rejected":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export default function ManageRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingRecipe, setEditingRecipe] = useState(null); // recipe being status-edited
  const [pendingStatus, setPendingStatus] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingRecipe, setDeletingRecipe] = useState(null); // recipe being delete-confirmed

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllRecipesAdmin({ search, status: statusFilter });
      if (res?.success) {
        setRecipes(res.data || []);
      } else {
        setError(res?.message || "Failed to load recipes");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(fetchRecipes, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchRecipes]);

  const openDeleteModal = (recipe) => {
    setDeletingRecipe(recipe);
  };

  const closeDeleteModal = () => {
    setDeletingRecipe(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRecipe) return;
    const id = deletingRecipe._id;

    setDeletingId(id);
    try {
      const res = await deleteRecipeAdmin(id);
      if (res?.success) {
        setRecipes((prev) => prev.filter((r) => r._id !== id));
        closeDeleteModal();
      } else {
        alert(res?.message || "Failed to delete recipe");
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const openStatusEditor = (recipe) => {
    setEditingRecipe(recipe);
    setPendingStatus(recipe.status || "Pending");
  };

  const closeStatusEditor = () => {
    setEditingRecipe(null);
    setPendingStatus("");
  };

  const handleStatusSave = async () => {
    if (!editingRecipe) return;
    setSavingId(editingRecipe._id);
    try {
      const res = await updateRecipeStatus(editingRecipe._id, pendingStatus);
      if (res?.success) {
        setRecipes((prev) =>
          prev.map((r) =>
            r._id === editingRecipe._id ? { ...r, status: pendingStatus } : r,
          ),
        );
        closeStatusEditor();
      } else {
        alert(res?.message || "Failed to update status");
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow border border-gray-200 p-4 sm:p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-gray-800"
        >
          Manage Recipes
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <label className="input input-bordered flex items-center gap-2 w-full sm:w-auto">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              className="grow"
              placeholder="Search by recipe name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <select
            className="select select-bordered w-full sm:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-orange-500" />
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-red-500"
        >
          {error}
        </motion.div>
      ) : recipes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-gray-500"
        >
          No recipes found{search || statusFilter ? " for this filter" : ""}.
        </motion.div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[700px] px-4 sm:px-0 sm:min-w-0">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th>Recipe</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {recipes.map((recipe, index) => (
                    <motion.tr
                      key={recipe._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                    >
                      <td className="font-medium whitespace-nowrap">
                        {recipe.recipeName}
                      </td>
                      <td className="whitespace-nowrap">
                        {recipe.authorName || recipe.authorEmail}
                      </td>
                      <td className="whitespace-nowrap">{recipe.category}</td>
                      <td>
                        <motion.span
                          key={recipe.status}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`font-semibold ${statusColor(recipe.status)}`}
                        >
                          {recipe.status || "Pending"}
                        </motion.span>
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-sm btn-outline border-orange-300 text-orange-500 hover:bg-orange-500 hover:text-white"
                            onClick={() => openStatusEditor(recipe)}
                          >
                            <FiEdit2 />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-sm btn-outline border-red-300 text-red-500 hover:bg-red-500 hover:text-white whitespace-nowrap"
                            onClick={() => openDeleteModal(recipe)}
                          >
                            <FiTrash2 />
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status edit modal */}
      <AnimatePresence>
        {editingRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                Update status
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {editingRecipe.recipeName}
              </p>

              <select
                className="select select-bordered w-full mb-6"
                value={pendingStatus}
                onChange={(e) => setPendingStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={closeStatusEditor}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white border-none"
                  onClick={handleStatusSave}
                  disabled={savingId === editingRecipe._id}
                >
                  {savingId === editingRecipe._id ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deletingRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                Delete recipe
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-700">
                  {deletingRecipe.recipeName}
                </span>
                ? This can&apos;t be undone.
              </p>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={closeDeleteModal}
                  disabled={deletingId === deletingRecipe._id}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none"
                  onClick={handleDeleteConfirm}
                  disabled={deletingId === deletingRecipe._id}
                >
                  {deletingId === deletingRecipe._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
