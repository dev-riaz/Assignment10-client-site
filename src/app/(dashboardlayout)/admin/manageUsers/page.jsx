"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiLock, FiUnlock } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getAllUsers, updateUserStatus } from "@/lib/api/getRecipe";

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        if (res?.success) {
          setUsers(res.data || []);
        } else {
          setError(res?.message || "Failed to load users");
          setUsers([]);
        }
      } catch (err) {
        setError("Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return (users || []).filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "Active" ? "Blocked" : "Active";

    // UI optimistically update
    setUsers((prev) =>
      prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u)),
    );

    try {
      const res = await updateUserStatus(user._id, newStatus);
      if (!res?.success) {
        throw new Error(res?.message || "Update failed");
      }
      toast.success(
        newStatus === "Blocked"
          ? `${user.name} has been blocked`
          : `${user.name} has been unblocked`,
      );
    } catch (err) {
      // fail hole revert
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, status: user.status } : u,
        ),
      );
      toast.error("Status update failed");
    }
  };

  if (loading) return <p className="p-6">Loading users...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-gray-800"
        >
          Manage Users
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full sm:w-72"
        >
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered pl-10 w-full rounded-xl"
          />
        </motion.div>
      </div>

      {/* Empty state */}
      {filteredUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 text-gray-400"
        >
          No users found
        </motion.div>
      ) : (
        <>
          {/* Mobile: Card view */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <motion.span
                      key={user.status}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                        user.status === "Active"
                          ? "text-green-600 bg-green-50"
                          : "text-red-500 bg-red-50"
                      }`}
                    >
                      {user.status || "Active"}
                    </motion.span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Premium:{" "}
                      <span className="font-medium text-gray-700">
                        {user.premium ? "Yes" : "No"}
                      </span>
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleStatus(user)}
                      className={`btn btn-sm rounded-lg ${
                        user.status === "Active"
                          ? "btn-outline border-red-300 text-red-500"
                          : "btn-outline border-gray-300"
                      }`}
                    >
                      {user.status === "Active" ? (
                        <>
                          <FiLock />
                          Block
                        </>
                      ) : (
                        <>
                          <FiUnlock />
                          Unblock
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop: Table view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Premium</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                    >
                      <td className="font-medium">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.premium ? "Yes" : "No"}</td>
                      <td>
                        <motion.span
                          key={user.status}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`font-semibold ${
                            user.status === "Active"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {user.status || "Active"}
                        </motion.span>
                      </td>
                      <td className="text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleStatus(user)}
                          className={`btn btn-sm rounded-lg ${
                            user.status === "Active"
                              ? "btn-outline border-red-300 text-red-500"
                              : "btn-outline border-gray-300"
                          }`}
                        >
                          {user.status === "Active" ? (
                            <>
                              <FiLock />
                              Block
                            </>
                          ) : (
                            <>
                              <FiUnlock />
                              Unblock
                            </>
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </>
      )}
    </motion.div>
  );
}
