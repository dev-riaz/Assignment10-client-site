"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { authClient, signUp } from "@/lib/auth-client";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photoURL = form.photoURL.value;
    const password = form.password.value;

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image: photoURL || undefined,
    });

    if (error) {
      const message = error.message || "Registration failed. Try again.";
      setErrorMsg(message);
      toast.error(message);
      setIsLoading(false);
      return;
    }
   

    toast.success("Account created successfully!");
    form.reset();
    router.push("/login");
    setIsLoading(false);
  };

  return (
    <section className="min-h-screen w-11/12 mx-auto bg-orange-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2"
      >
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="hidden lg:flex bg-gradient-to-br from-orange-500 to-orange-400 items-center justify-center "
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <Image
              src="/assets/chif_image-removebg-preview.png"
              alt="Register"
              width={420}
              height={420}
              priority
              className="drop-shadow-2xl"
            />

            <h2 className="text-4xl font-bold text-white">
              Welcome to RecipeHub
            </h2>

            <p className="mt-2 max-w-md text-orange-100 leading-8 text-lg">
              Discover delicious recipes, save your favourite meals and share
              your cooking experience with thousands of food lovers.
            </p>

            <div className="grid grid-cols-3 gap-10 text-white">
              <div>
                <h3 className="text-3xl font-bold">5K+</h3>
                <p className="text-orange-100 text-sm">Recipes</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">12K+</h3>
                <p className="text-orange-100 text-sm">Users</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="text-orange-100 text-sm">Support</p>
              </div>
            </div>
          </motion.div>

          {/* Decorative Circle */}
          <div className="absolute -top-28 -left-28 w-72 h-72 rounded-full bg-white/10"></div>

          <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-white/10"></div>

          <div className="absolute top-10 right-10 w-5 h-5 rounded-full bg-white/40"></div>

          <div className="absolute bottom-20 left-10 w-3 h-3 rounded-full bg-white/40"></div>
        </motion.div>
        {/* Right Side */}
        <div className="p-8 sm:p-10">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-3xl text-center sm:text-4xl font-bold text-gray-900"
          >
            Create Account
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
            className="text-gray-500 mt-2 mb-7 text-center"
          >
            Join our recipe community 🍽️
          </motion.p>

          {/* Google Sign Up */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
            whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn flex items-center justify-center gap-3 border border-gray-200 rounded-xl font-semibold text-gray-700 shadow-sm transition-colors"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 my-6"
          >
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs uppercase tracking-wide text-gray-400">
              or sign up with email
            </span>
            <span className="h-px flex-1 bg-gray-200" />
          </motion.div>

          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3 text-center"
            >
              {errorMsg}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.34, ease: "easeOut" }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter Your Name"
                  className="input input-bordered text-start w-full btn rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-shadow"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4, ease: "easeOut" }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@example.com"
                  className="input input-bordered w-full btn text-start rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-shadow"
                />
              </div>
            </motion.div>

            {/* Photo URL */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.46, ease: "easeOut" }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Photo URL{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="">
                <input
                  type="text"
                  name="photoURL"
                  placeholder="https://example.com/photo.jpg"
                  className="input input-bordered w-full btn text-start rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-shadow"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.52, ease: "easeOut" }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="input input-bordered w-full btn text-start rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Use 8+ characters with a mix of letters and numbers.
              </p>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.58, ease: "easeOut" }}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="btn bg-orange-500 hover:bg-orange-600 border-none text-white w-full rounded-xl font-semibold shadow-lg shadow-orange-200 disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="text-center mt-6 text-gray-500"
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
