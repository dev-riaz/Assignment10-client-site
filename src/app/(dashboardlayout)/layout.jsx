import Sidebar from "@/components/dashboard/Sidebar";
import { TiThMenu } from "react-icons/ti";

const DashboardLayout = ({ children }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="navbar bg-base-100 shadow lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost"
            >
              <TiThMenu size={24} />
            </label>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-orange-500">Dashboard</h2>
          </div>
        </div>

        <main className="p-4 md:p-6 lg:p-8 bg-base-200 min-h-screen">
          {children}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <Sidebar />
      </div>
    </div>
  );

};

export default DashboardLayout;
