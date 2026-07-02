"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

import Sidebar from "@/components/dashboard/Sidebar";
import { TiThMenu } from "react-icons/ti";

const DashboardLayout = ({ children }) => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const drawerRef = useRef(null);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/login");
      return;
    }

    const role = session.user?.role;

    if (role === "admin" && !pathname.startsWith("/admin")) {
      router.push("/admin/overview");
      return;
    }

    if (role !== "admin" && pathname.startsWith("/admin")) {
      router.push("/dashboard/user");
      return;
    }
  }, [session, isPending, pathname, router]);

  const handleSidebarClick = (e) => {
    const target = e.target.closest("a, button");
    if (target && drawerRef.current) {
      drawerRef.current.checked = false;
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerRef}
      />

      {/* Content */}
      <div className="drawer-content flex flex-col">
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
          {isPending ? <DashboardSkeleton /> : children}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50" onClick={handleSidebarClick}>
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <Sidebar />
      </div>
    </div>
  );
};

// Generic skeleton — dashboard-er kono page load howar age placeholder hisebe dekhabe
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
          >
            <div className="h-4 w-28 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse mt-4" />
            <div className="h-3 w-32 bg-gray-200 rounded-md animate-pulse mt-5" />
          </div>
        ))}
      </div>

      {/* Table-like card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-9 w-24 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-full bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
