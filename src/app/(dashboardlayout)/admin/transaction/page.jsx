"use client";

import { useEffect, useState, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getAllTransactionsAdmin } from "@/lib/api/getRecipe"; // adjust import path to your project

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusBadge = (status) => {
  switch (status) {
    case "Success":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllTransactionsAdmin({ search });
      if (res?.success) {
        setTransactions(res.data || []);
      } else {
        setError(res?.message || "Failed to load transactions");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchTransactions, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchTransactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>

        <label className="input input-bordered flex items-center gap-2 w-full sm:w-auto">
          <FiSearch className="text-gray-400 shrink-0" />
          <input
            type="text"
            className="grow min-w-0"
            placeholder="Search by email or transaction ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-16"
          >
            <span className="loading loading-spinner loading-lg text-orange-500" />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-red-500 px-4"
          >
            {error}
          </motion.div>
        ) : transactions.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-gray-500 px-4"
          >
            No transactions found{search ? " for this search" : ""}.
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Mobile: card list (below sm breakpoint) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3 sm:hidden"
            >
              <AnimatePresence>
                {transactions.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{item.userEmail}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {item.recipeName || "—"}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                          item.paymentStatus,
                        )}`}
                      >
                        {item.paymentStatus || "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-green-600">
                        ${Number(item.amount).toFixed(2)}
                      </span>
                      <span className="text-gray-500">
                        {formatDate(item.paidAt)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <span className="font-mono text-xs text-gray-500 break-all">
                        {item.transactionId}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Desktop: table (sm and up) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th>User</th>
                    <th>Recipe</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Payment Status</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>

                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {transactions.map((item) => (
                      <motion.tr
                        key={item._id}
                        layout
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="hover:bg-gray-50"
                      >
                        <td className="font-medium">{item.userEmail}</td>

                        <td>{item.recipeName || "—"}</td>

                        <td className="font-semibold text-green-600">
                          ${Number(item.amount).toFixed(2)}
                        </td>

                        <td>{formatDate(item.paidAt)}</td>

                        <td>
                          <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                              item.paymentStatus,
                            )}`}
                          >
                            {item.paymentStatus || "Pending"}
                          </motion.span>
                        </td>

                        <td>
                          <span className="font-mono text-sm">
                            {item.transactionId}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
