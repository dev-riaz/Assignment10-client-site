"use client";

const transactions = [
  {
    id: 1,
    user: "Daniel Ahmed",
    amount: "$12.99",
    date: "May 20, 2024",
    status: "Paid",
    transactionId: "TXN-78542136",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    amount: "$8.99",
    date: "May 18, 2024",
    status: "Pending",
    transactionId: "TXN-96325874",
  },
  {
    id: 3,
    user: "John Brown",
    amount: "$20.00",
    date: "May 15, 2024",
    status: "Paid",
    transactionId: "TXN-14523698",
  },
];

export default function TransactionsPage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      <div className="overflow-x-auto">
        <table className="table">
          <thead className="bg-gray-50">
            <tr>
              <th>User</th>

              <th>Amount</th>

              <th>Date</th>

              <th>Payment Status</th>

              <th>Transaction ID</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="font-medium">{item.user}</td>

                <td className="font-semibold text-green-600">{item.amount}</td>

                <td>{item.date}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <span className="font-mono text-sm">
                    {item.transactionId}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
