"use client";

const stats = [
  {
    id: 1,
    title: "Total Users",
    value: 250,
    change: "+ 10 this month",
    positive: true,
  },
  {
    id: 2,
    title: "Total Recipes",
    value: 500,
    change: "+ 25 this month",
    positive: true,
  },
  {
    id: 3,
    title: "Premium Members",
    value: 35,
    change: "+ 5 this month",
    positive: true,
  },
  {
    id: 4,
    title: "Total Reports",
    value: 12,
    change: "- 3 this month",
    positive: false,
  },
];

const reports = [
  {
    id: 1,
    recipe: "Chocolate Cake",
    reporter: "john@example.com",
    reason: "Spam",
    status: "Pending",
  },
  {
    id: 2,
    recipe: "Beef Burger",
    reporter: "sarah@example.com",
    reason: "Offensive Content",
    status: "Pending",
  },
  {
    id: 3,
    recipe: "Pasta Alfredo",
    reporter: "mike@example.com",
    reason: "Copyright Issue",
    status: "Resolved",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Title */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
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

          <button className="btn btn-outline rounded-xl">View All</button>
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
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="font-medium text-gray-800">{report.recipe}</td>

                  <td className="text-gray-600">{report.reporter}</td>

                  <td className="text-gray-600">{report.reason}</td>

                  <td>
                    <span
                      className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold ${
                        report.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
