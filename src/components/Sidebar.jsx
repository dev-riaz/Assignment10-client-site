"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaTachometerAlt,
  FaBookOpen,
  FaPlusCircle,
  FaHeart,
  FaShoppingBag,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { PiChefHat } from "react-icons/pi";

const menus = [
  {
    title: "Overview",
    href: "/dashboard/user",
    icon: <FaTachometerAlt size={18} />,
  },
  {
    title: "My Recipes",
    href: "/dashboard/user/my-recipes",
    icon: <FaBookOpen size={18} />,
  },
  {
    title: "Add Recipe",
    href: "/dashboard/user/add-recipe",
    icon: <FaPlusCircle size={18} />,
  },
  {
    title: "My Favorites",
    href: "/dashboard/user/favorites",
    icon: <FaHeart size={18} />,
  },
  {
    title: "Purchased Recipes",
    href: "/dashboard/user/purchased-recipes",
    icon: <FaShoppingBag size={18} />,
  },
  {
    title: "Profile",
    href: "/dashboard/user/profile",
    icon: <FaUser size={18} />,
  },
  {
    title: "Settings",
    href: "/dashboard/user/settings",
    icon: <FaCog size={18} />,
  },
];

const Sidebar = () => {
  const { data: session, isPending } = useSession();
  const role = session?.user?.role;
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-full bg-slate-900 text-white flex flex-col">
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end p-3">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-sm btn-circle btn-ghost text-white"
        >
          ✕
        </label>
      </div>

      {/* Logo */}
      <div className="border-b border-slate-700 p-6">
        <Link href="/" className="flex items-center gap-3">
          <PiChefHat size={34} className="bg-[#FF6B35] p-1 rounded-xl" />

          <div>
            <h2 className="text-xl font-bold text-orange-400">RecipeHub</h2>
            <p className="text-xs text-gray-400">User Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menus.map((menu) => {
          const active = pathname === menu.href;

          return (
            <li key={menu.href}>
              <Link
                href={menu.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                  active
                    ? "bg-orange-500 text-white shadow-lg"
                    : "hover:bg-slate-800 text-gray-300"
                }`}
              >
                {menu.icon}
                <span>{menu.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      <div className="border-t border-slate-700 p-4">
        <button className="btn btn-error w-full text-white">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
