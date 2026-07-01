"use client";

import { useEffect, useState, useCallback } from "react";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import {
  getAllRecipesAdmin,
  updateRecipeStatus,
  deleteRecipeAdmin,
} from "@/lib/api/getRecipe"; // adjust import path to your project

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this recipe? This can't be undone.",
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await deleteRecipeAdmin(id);
      if (res?.success) {
        setRecipes((prev) => prev.filter((r) => r._id !== id));
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
    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Recipes</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="input input-bordered flex items-center gap-2">
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
            className="select select-bordered"
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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-orange-500" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No recipes found{search || statusFilter ? " for this filter" : ""}.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
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
              {recipes.map((recipe) => (
                <tr key={recipe._id}>
                  <td className="font-medium">{recipe.recipeName}</td>
                  <td>{recipe.authorName || recipe.authorEmail}</td>
                  <td>{recipe.category}</td>
                  <td>
                    <span
                      className={`font-semibold ${statusColor(recipe.status)}`}
                    >
                      {recipe.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-sm btn-outline border-orange-300 text-orange-500 hover:bg-orange-500 hover:text-white"
                        onClick={() => openStatusEditor(recipe)}
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        className="btn btn-sm btn-outline border-red-300 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDelete(recipe._id)}
                        disabled={deletingId === recipe._id}
                      >
                        <FiTrash2 />
                        {deletingId === recipe._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status edit modal */}
      {editingRecipe && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
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

            <div className="flex justify-end gap-2">
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
          </div>
        </div>
      )}
    </div>
  );
}
