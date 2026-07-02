"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllRecipesAdmin,
  getAllReportsAdmin,
  getAllTransactionsAdmin,
} from "@/lib/api/getRecipe"; 

// ── Month range helper ──
function getMonthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return { start, end };
}

function countInRange(items, dateField, start, end) {
  return items.filter((item) => {
    const raw = item?.[dateField];
    if (!raw) return false;
    const d = new Date(raw);
    return d >= start && d < end;
  }).length;
}


function buildChange(items, dateField, { biggerIsBad = false } = {}) {
  const thisMonth = getMonthRange(0);
  const lastMonth = getMonthRange(-1);

  const current = countInRange(
    items,
    dateField,
    thisMonth.start,
    thisMonth.end,
  );
  const previous = countInRange(
    items,
    dateField,
    lastMonth.start,
    lastMonth.end,
  );
  const diff = current - previous;

  const isGrowth = diff >= 0;
  const positive = biggerIsBad ? !isGrowth : isGrowth;
  const sign = diff > 0 ? "+" : diff < 0 ? "-" : "+";

  return {
    change: `${sign}${Math.abs(diff)} this month`,
    positive,
  };
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersRes, recipesRes, reportsRes, paymentsRes] =
          await Promise.all([
            getAllUsers(),
            getAllRecipesAdmin(),
            getAllReportsAdmin(),
            getAllTransactionsAdmin(),
          ]);

        const users = usersRes?.data || [];
        const recipes = recipesRes?.data || [];
        const allReports = reportsRes?.data || [];
        const payments = paymentsRes?.data || [];

        const successfulPayments = payments.filter(
          (p) => p.paymentStatus === "Success",
        );
        const premiumEmails = new Set(
          successfulPayments.map((p) => p.userEmail),
        );

        const usersChange = buildChange(users, "createdAt");
        const recipesChange = buildChange(recipes, "createdAt");
        const premiumChange = buildChange(successfulPayments, "paidAt");
        const reportsChange = buildChange(allReports, "createdAt", {
          biggerIsBad: true,
        });

        setStats([
          {
            id: 1,
            title: "Total Users",
            value: usersRes?.total ?? users.length,
            ...usersChange,
          },
          {
            id: 2,
            title: "Total Recipes",
            value: recipesRes?.total ?? recipes.length,
            ...recipesChange,
          },
          {
            id: 3,
            title: "Premium Members",
            value: premiumEmails.size,
            ...premiumChange,
          },
          {
            id: 4,
            title: "Total Reports",
            value: reportsRes?.total ?? allReports.length,
            ...reportsChange,
          },
        ]);

        setReports(allReports.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError("Dashboard data load korte problem hocche");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
      </div>

      {error && (
        <div className="alert alert-error rounded-xl">
          <span>{error}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-10 w-20 bg-gray-200 rounded mt-3" />
                <div className="h-3 w-28 bg-gray-200 rounded mt-4" />
              </div>
            ))
          : stats.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
              >
                <h3 className="text-gray-500 font-medium">{item.title}</h3>

                <h2 className="text-5xl font-bold mt-3 text-gray-900">
                  {item.value}
                </h2>

                <p
                  className={`mt-4 text-sm font-semibold ${
                    item.positive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.change}
                </p>
              </div>
            ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Reports</h2>

          <a href="/admin/report" className="btn btn-outline rounded-xl">
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th>Recipe</th>
                <th>Reporter</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4}>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse my-1" />
                    </td>
                  </tr>
                ))
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-6">
                    Kono report pawa jayni
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id}>
                    <td className="font-medium text-gray-800">
                      {report.recipeName}
                    </td>
                    <td className="text-gray-600">{report.reportedByEmail}</td>
                    <td className="text-gray-600">{report.reason}</td>
                    <td>
                      <span
                        className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold ${
                          report.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : report.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : report.status === "Reviewed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
