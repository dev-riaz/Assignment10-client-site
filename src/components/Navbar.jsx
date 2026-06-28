"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PiChefHat } from "react-icons/pi";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";

const Navbar = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully!");
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  const activeClass =
    "text-[#FF6B35] underline decoration-[#FF6B35] underline-offset-4 bg-transparent";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-sm"
    >
      <div className="navbar w-11/12 mx-auto">
        {/* Left */}
        <div className="navbar-start">
          {/* Mobile Menu */}
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] w-56 rounded-box bg-white shadow"
            >
              <li>
                <Link
                  href="/"
                  className={
                    pathname === "/" ? "text-[#FF6B35] font-semibold" : ""
                  }
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/browse"
                  className={
                    pathname === "/browse" ? "text-[#FF6B35] font-semibold" : ""
                  }
                >
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className={
                    pathname === "/dashboard"
                      ? "text-[#FF6B35] font-semibold"
                      : ""
                  }
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/premium"
                  className={
                    pathname === "/premium"
                      ? "text-[#FF6B35] font-semibold"
                      : ""
                  }
                >
                  Become Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ rotate: -8, scale: 1.1 }}
            >
              <PiChefHat size={34} className="text-[#FF6B35]" />
            </motion.div>
            <h1 className="text-2xl font-bold">
              Recipe<span className="text-[#FF6B35]">Hub</span>
            </h1>
          </div>
        </div>

        {/* Center Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2 font-semibold text-gray-600 [&_a:hover]:bg-transparent [&_a:hover]:text-gray-600">
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/" className={pathname === "/" ? activeClass : ""}>
                Home
              </Link>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/browse"
                className={pathname === "/browse" ? activeClass : ""}
              >
                Browse Recipes
              </Link>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/dashboard"
                className={pathname === "/dashboard" ? activeClass : ""}
              >
                Dashboard
              </Link>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.34, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/premium"
                className={pathname === "/premium" ? activeClass : ""}
              >
                Become Premium
              </Link>
            </motion.li>
          </ul>
        </div>

        {/* Right */}
        <div className="navbar-end gap-3">
          {/* Search (design only) */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Icon-only on small screens */}
            <button
              type="button"
              className="btn btn-ghost btn-circle md:hidden"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </button>

            {/* Full input on medium+ screens */}
            <div className="hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search recipes..."
                className="input input-bordered input-sm rounded-full pl-9 w-44 lg:w-56 bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-shadow"
              />
            </div>
          </motion.div>

          {isPending ? (
            <div className="w-24" />
          ) : session ? (
            <>
              {/* Profile */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="dropdown dropdown-end"
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="avatar">
                    <div className="w-9 rounded-full ring ring-orange-400 ring-offset-2">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-orange-500 text-white flex items-center justify-center w-full h-full text-sm font-semibold">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] w-48 rounded-box bg-white shadow p-2"
                >
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-red-500">
                      Logout
                    </button>
                  </li>
                </ul>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="btn bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-semibold border-none rounded-lg"
                >
                  Login
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="border-2 border-emerald-400 text-emerald-500 hover:bg-emerald-400 hover:text-white transition-all duration-300 btn-outline btn rounded-lg font-semibold shadow-none cursor-pointer"
                >
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
