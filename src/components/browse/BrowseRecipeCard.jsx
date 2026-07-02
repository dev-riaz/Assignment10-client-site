"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock,
  FiHeart,
  FiEye,
  FiFlag,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import { PiChefHat } from "react-icons/pi";
import toast from "react-hot-toast";

import { useSession } from "@/lib/auth-client";
import { submitReport } from "@/lib/api/getRecipe";

const REPORT_REASONS = [
  "Inappropriate content",
  "Copyright / stolen recipe",
  "Misleading information",
  "Spam",
  "Other",
];

const BrowseRecipeCard = ({ recipe }) => {
  const { data: session } = useSession();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReportClick = (e) => {
    // Card ta Link diye wrapped, tai navigation atkate hobe
    e.preventDefault();
    e.stopPropagation();
    setIsReportOpen(true);
  };

  const resetAndClose = () => {
    setReason(REPORT_REASONS[0]);
    setMessage("");
    setIsReportOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!message.trim()) {
      toast.error("Please describe the issue.");
      return;
    }

    if (!session?.user?.email) {
      toast.error("You must be logged in to report a recipe.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await submitReport({
        recipeId: recipe?._id,
        recipeName: recipe?.recipeName,
        reportedByEmail: session.user.email,
        reportedByName: session.user.name || "",
        reason,
        message: message.trim(),
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success("Report submitted. Our team will review it.");
      resetAndClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit report. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Link href={`/browse/${recipe._id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          {/* ── Image ── */}
          <div className="relative w-full h-66 bg-orange-50">
            {recipe.recipeImage ? (
              <div className="relative w-full h-full overflow-hidden bg-orange-50">
                <Image
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                  fill
                  className="object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="object-cover flex items-center justify-center">
                <PiChefHat size={36} className="text-orange-200" />
              </div>
            )}

            {/* View Details overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
                <FiEye size={16} />
                Click View Details
              </span>
            </div>

            {/* Report button */}
            <button
              type="button"
              onClick={handleReportClick}
              title="Report this recipe"
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors z-10"
            >
              <FiFlag size={14} className="text-gray-500 hover:text-red-500" />
            </button>

            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <FiHeart size={14} className="text-red-400 fill-red-400" />
            </div>
          </div>

          {/* ── Content ── */}
          <div className="p-3 pb-4">
            <h3 className="font-bold text-gray-900 text-2xl leading-snug mb-0.5 truncate">
              {recipe.recipeName}
            </h3>
            <p className="text-gray-400 text-xs mb-3 truncate">
              {recipe.cuisineType}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <FiClock size={13} />
                {recipe.preparationTime ?? "—"} mins
              </span>
              <span className="flex items-center gap-1">
                <FiHeart size={13} className="text-red-500 fill-red-500" />
                <span className="text-gray-500">{recipe.likesCount ?? 0}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* ── Report Modal (inline, same file) ── */}
      <AnimatePresence>
        {isReportOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end sm:items-center p-0 sm:p-5"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              resetAndClose();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 40, opacity: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 sm:p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                    <FiFlag className="text-red-500" size={16} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Report Recipe
                  </h2>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resetAndClose();
                  }}
                  className="btn btn-circle btn-sm"
                  type="button"
                >
                  <FiX />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-5 flex items-start gap-2">
                <FiAlertTriangle
                  className="text-orange-400 flex-shrink-0 mt-0.5"
                  size={14}
                />
                Reporting{" "}
                <span className="font-semibold text-gray-700">
                  {recipe?.recipeName || "this recipe"}
                </span>
                . Our admin team will review your report.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    {REPORT_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Details
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Describe the issue..."
                    className="textarea textarea-bordered w-full resize-none"
                    required
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      resetAndClose();
                    }}
                    className="btn btn-outline w-full sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white border-0"
                  >
                    {submitting ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BrowseRecipeCard;
