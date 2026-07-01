"use client";

import { useMemo, useState } from "react";
import { FiSearch, FiLock, FiUnlock } from "react-icons/fi";

const users = [
  {
    id: 1,
    name: "Daniel Ahmed",
    email: "daniel@example.com",
    premium: "Yes",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    premium: "No",
    status: "Blocked",
  },
];

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

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
            
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.name}</td>

                <td>{user.email}</td>

                <td>{user.premium}</td>

                <td>
                  <span
                    className={`font-semibold ${
                      user.status === "Active"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="text-center">
                  <button
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
