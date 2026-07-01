"use client";

import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
  FaTachometerAlt,
  FaBookOpen,
  FaPlusCircle,
  FaHeart,
  FaShoppingBag,
  FaUser,
  
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BiDish } from "react-icons/bi";
import { MdOutlineAttachMoney, MdReport } from "react-icons/md";

const userMenus = [
  {
    title: "Overview",
    href: "/dashboard/user",
    icon: <FaTachometerAlt size={18} />,
  },
  {
    title: "My Recipes",
    href: "/dashboard/user/myRecipe",
    icon: <FaBookOpen size={18} />,
  },
  {
    title: "Add Recipe",
    href: "/dashboard/user/addRecipe",
    icon: <FaPlusCircle size={18} />,
  },
  {
    title: "My Favorites",
    href: "/dashboard/user/myFavorite",
    icon: <FaHeart size={18} />,
  },
  {
    title: "Purchased Recipes",
    href: "/dashboard/user/purchaseRecipe",
    icon: <FaShoppingBag size={18} />,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: <FaUser size={18} />,
  },
];
const adminMenus = [
  {
    title: "Overview",
    href: "/admin/overview",
    icon: <FaTachometerAlt size={18} />,
  },
  {
    title: "Manage Users",
    href: "/admin/manageUsers",
    icon: <FaUsers size={18} />,
  },
  {
    title: "Manage Recipes",
    href: "/admin/manageRecipes",
    icon: <BiDish size={18} />,
  },
  {
    title: "Reports",
    href: "/admin/report",
    icon: <MdReport size={18} />,
  },
  {
    title: "Transaction",
    href: "/admin/transaction",
    icon: <MdOutlineAttachMoney size={20} />,
  },
];
const Sidebar = () => {
  const { data: session, isPending } = useSession();
  const role = session?.user?.role;
  const pathname = usePathname();

  const menuItems = role === "admin" ? adminMenus : userMenus;

  return (
    <motion.aside
      className="w-72 min-h-full bg-slate-900 text-white flex flex-col"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end p-3">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-sm btn-circle btn-ghost text-white"
        >
          <ImCross />
        </label>
      </div>

      {/* Profile */}
      <motion.div
        className="border-b border-slate-700 p-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <Link href="/profile" className="flex items-center gap-3">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session?.user?.name || "User"}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-orange-500 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white uppercase">
              {session?.user?.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2) || "U"}
            </div>
          )}

          <div>
            <h2
              className={`text-xl font-bold uppercase ${role === "admin" ? "text-emerald-400" : "text-red-400"}`}
            >
              {session?.user?.name || "User"}
            </h2>

            <p
              className={`text-xs font-medium ${
                role === "admin" ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
            </p>
          </div>
        </Link>
      </motion.div>

      {/* Menu */}
      <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((menu, index) => {
          const active = pathname === menu.href;

          return (
            <motion.li
              key={menu.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.25 + index * 0.07,
                ease: "easeOut",
              }}
            >
              <Link
                href={menu.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2 transition-all duration-300 ${
                  active
                    ? "bg-orange-500 text-white shadow-lg"
                    : "hover:bg-slate-800 text-gray-300"
                }`}
              >
                {menu.icon}
                <span>{menu.title}</span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Footer Buttons */}
      <motion.div
        className="px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <Link
          href={"/"}
          className="btn w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-xl"
        >
          <IoMdArrowRoundBack />
          Back to Home
        </Link>
      </motion.div>

      <motion.div
        className="px-4 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <button className="btn mb-6 w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-xl">
          <FaSignOutAlt />
          Logout
        </button>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
