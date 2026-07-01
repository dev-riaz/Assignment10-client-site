"use client";

const reports = [
  {
    id: 1,
    recipe: "Chocolate Cake",
    reporter: "john@gmail.com",
    reason: "Spam",
    date: "May 20, 2024",
  },
  {
    id: 2,
    recipe: "Beef Burger",
    reporter: "sara@email.com",
    reason: "Offensive Content",
    date: "May 18, 2024",
  },
  {
    id: 3,
    recipe: "Pasta Alfredo",
    reporter: "mike@gmail.com",
    reason: "Copyright Issue",
    date: "May 15, 2024",
  },
];

export default function RecipeReportsPage() {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Recipe Reports</h2>

      <div className="overflow-x-auto">
        <table className="table">
          <thead className="bg-gray-50">
            <tr>
              <th>Recipe</th>

              <th>Reporter</th>

              <th>Reason</th>

              <th>Date</th>

              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="font-medium">{report.recipe}</td>

                <td>{report.reporter}</td>

                <td>{report.reason}</td>

                <td>{report.date}</td>

                <td>
                  <div className="flex justify-center gap-3">
                    <button
                      className="btn btn-sm btn-outline
                    border-red-300
                    text-red-500
                    hover:bg-red-500
                    hover:text-white"
                    >
                      Remove
                    </button>

                    <button
                      className="btn btn-sm btn-outline
                    border-green-300
                    text-green-600
                    hover:bg-green-500
                    hover:text-white"
                    >
                      Dismiss
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
