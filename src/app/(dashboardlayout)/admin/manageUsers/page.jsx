"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiLock, FiUnlock } from "react-icons/fi";
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
    } catch (err) {
      // fail hole revert
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, status: user.status } : u,
        ),
      );
      alert("Status update failed");
    }
  };

  if (loading) return <p className="p-6">Loading users...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered pl-10 w-72 rounded-xl"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.premium ? "Yes" : "No"}</td>
                  <td>
                    <span
                      className={`font-semibold ${
                        user.status === "Active"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {user.status || "Active"}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
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
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
