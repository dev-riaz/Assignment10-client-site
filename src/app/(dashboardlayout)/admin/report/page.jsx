"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllReportsAdmin,
  updateReportStatus,
  deleteReportAdmin,
} from "@/lib/api/getRecipe";

const StatusBadge = ({ status }) => {
  const colorMap = {
    Pending: "bg-yellow-100 text-yellow-700",
    Reviewed: "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700",
    Dismissed: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

const ActionButtons = ({
  report,
  actionLoadingId,
  onRemove,
  onDismiss,
  onResolve,
}) => (
  <div className="flex flex-wrap justify-center gap-2">
    <button
      onClick={() => onRemove(report._id)}
      disabled={actionLoadingId === report._id}
      className="btn btn-sm btn-outline border-red-300 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-60"
    >
      Remove
    </button>

    {report.status !== "Dismissed" && (
      <button
        onClick={() => onDismiss(report._id)}
        disabled={actionLoadingId === report._id}
        className="btn btn-sm btn-outline border-gray-300 text-gray-600 hover:bg-gray-500 hover:text-white disabled:opacity-60"
      >
        Dismiss
      </button>
    )}

    {report.status !== "Resolved" && (
      <button
        onClick={() => onResolve(report._id)}
        disabled={actionLoadingId === report._id}
        className="btn btn-sm btn-outline border-green-300 text-green-600 hover:bg-green-500 hover:text-white disabled:opacity-60"
      >
        Resolve
      </button>
    )}
  </div>
);

export default function RecipeReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /* ── Fetch reports directly inside useEffect (async IIFE) ── */
  useEffect(() => {
    const controller = new AbortController();

    const loadReports = async () => {
      setLoading(true);
      try {
        const res = await getAllReportsAdmin();
        if (controller.signal.aborted) return;

        if (res.success) {
          setReports(res.data || []);
        } else {
          toast.error(res.message || "Failed to load reports");
          setReports([]);
        }
      } catch {
        if (!controller.signal.aborted) {
          toast.error("Something went wrong while loading reports");
          setReports([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadReports();

    return () => controller.abort();
  }, [refreshKey]);

  /* ── Client-side filtering (search + status) ── */
  const filteredReports = reports.filter((report) => {
    const matchesStatus = statusFilter ? report.status === statusFilter : true;

    const term = search.toLowerCase();
    const matchesSearch = term
      ? report.recipeName?.toLowerCase().includes(term) ||
        report.reportedByEmail?.toLowerCase().includes(term) ||
        report.message?.toLowerCase().includes(term)
      : true;

    return matchesStatus && matchesSearch;
  });

  /* ── Dismiss report (status update) ── */
  const handleDismiss = async (id) => {
    if (actionLoadingId) return;
    setActionLoadingId(id);
    try {
      const res = await updateReportStatus(id, "Dismissed");
      if (res.success) {
        toast.success("Report dismissed");
        setReports((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "Dismissed" } : r)),
        );
      } else {
        toast.error(res.message || "Failed to dismiss report");
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ── Mark as resolved ── */
  const handleResolve = async (id) => {
    if (actionLoadingId) return;
    setActionLoadingId(id);
    try {
      const res = await updateReportStatus(id, "Resolved");
      if (res.success) {
        toast.success("Report marked as resolved");
        setReports((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "Resolved" } : r)),
        );
      } else {
        toast.error(res.message || "Failed to update report");
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ── Remove report (delete) ── */
  const handleRemove = async (id) => {
    if (actionLoadingId) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this report? This cannot be undone.",
    );
    if (!confirmed) return;

    setActionLoadingId(id);
    try {
      const res = await deleteReportAdmin(id);
      if (res.success) {
        toast.success("Report removed");
        setReports((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(res.message || "Failed to remove report");
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow border border-gray-200 p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Recipe Reports
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipe, email, message..."
            className="input input-bordered input-sm rounded-lg w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered select-sm rounded-lg"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setRefreshKey((k) => k + 1)}
            className="btn btn-sm rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-gray-400"
          >
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-md text-green-500" />
        </div>
      ) : filteredReports.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 italic py-10"
        >
          No reports found.
        </motion.p>
      ) : (
        <>
          {/* ── Desktop / tablet: table view ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th>Recipe</th>
                  <th>Reporter</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence initial={false}>
                  {filteredReports.map((report) => (
                    <motion.tr
                      key={report._id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.25 }}
                    >
                      <td className="font-medium">
                        {report.recipeName || "Unknown Recipe"}
                      </td>
                      <td>{report.reportedByEmail}</td>
                      <td className="max-w-xs truncate" title={report.message}>
                        {report.message}
                      </td>
                      <td>
                        <StatusBadge status={report.status} />
                      </td>
                      <td>
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td>
                        <ActionButtons
                          report={report}
                          actionLoadingId={actionLoadingId}
                          onRemove={handleRemove}
                          onDismiss={handleDismiss}
                          onResolve={handleResolve}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ── Mobile: card view ── */}
          <div className="md:hidden flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {filteredReports.map((report) => (
                <motion.div
                  key={report._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.25 }}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {report.recipeName || "Unknown Recipe"}
                    </h3>
                    <StatusBadge status={report.status} />
                  </div>

                  <p className="text-sm text-gray-500 mb-1">
                    {report.reportedByEmail}
                  </p>

                  <p className="text-sm text-gray-600 mb-2">{report.message}</p>

                  <p className="text-xs text-gray-400 mb-3">
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </p>

                  <ActionButtons
                    report={report}
                    actionLoadingId={actionLoadingId}
                    onRemove={handleRemove}
                    onDismiss={handleDismiss}
                    onResolve={handleResolve}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
}
