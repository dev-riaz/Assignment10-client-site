"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaCarrot, FaLeaf } from "react-icons/fa";
import { GiCirclingFish, GiTomato } from "react-icons/gi";

const Banner = () => {
  return (
    <section className="py-6 bg-gradient-to-r from-white via-[#FFFDFB] to-[#FFF8F0]">
      <div className="relative overflow-hidden  py-12 w-11/12 mx-auto">
        {/* Background Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -left-16 top-10 w-32 h-32 sm:w-44 sm:h-44 md:-left-24 md:w-60 md:h-60 bg-orange-100 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="absolute right-4 top-8 w-28 h-28 sm:w-40 sm:h-40 md:right-10 md:w-52 md:h-52 bg-orange-100 rounded-full blur-3xl"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute -right-16 -bottom-16 w-[260px] h-[180px] sm:w-[380px] sm:h-[250px] md:-right-24 md:-bottom-28 md:w-[520px] md:h-[340px] bg-[#FFE8D4] rounded-[55%] rotate-[-15deg]"
        ></motion.div>

        {/* Icons */}
        <motion.div
          initial={{ opacity: 0, y: -20, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 12 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.2, rotate: 0 }}
          className="absolute top-2 right-3 sm:top-4 sm:right-[19%] text-red-500 text-lg sm:text-3xl md:text-4xl"
        >
          <GiTomato />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 12 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.2, rotate: 0 }}
          className="absolute top-9 right-7 sm:top-12 sm:right-[30%] text-orange-500 text-lg sm:text-3xl md:text-4xl"
        >
          <FaCarrot />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -12 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.2, rotate: 0 }}
          className="absolute right-3 bottom-6 sm:right-20 sm:bottom-20 text-green-600 text-2xl sm:text-4xl md:text-5xl"
        >
          <FaLeaf />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 45 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.2, rotate: 0 }}
          className="absolute right-9 top-2 sm:right-24 sm:top-5 text-green-600 text-xl sm:text-4xl md:text-5xl"
        >
          <FaLeaf />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -12 }}
          transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
          whileHover={{ scale: 1.2, rotate: 0 }}
          className="absolute left-[6%] top-24 sm:left-[55%] sm:top-[180px] text-green-600 text-base sm:text-2xl md:text-3xl"
        >
          <FaLeaf />
        </motion.div>

        <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 ">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 "
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-gray-900"
            >
              Discover Amazing <br />
              <span className="text-orange-500">Recipes</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
              className="mt-6 text-gray-500 text-lg max-w-md leading-8"
            >
              Explore thousands of delicious recipes shared by food lovers
              around the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="mt-10 flex flex-wrap gap-5"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-semibold px-7 py-2 rounded-xl shadow-lg hover:shadow-xl"
              >
                Explore Recipes
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-emerald-400 text-emerald-500 hover:bg-emerald-400 hover:text-white transition-all duration-300 px-5 py-2 rounded-xl font-semibold shadow"
              >
                Become Premium
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right */}
          <div className="flex-1 flex justify-center relative">
            {/* Image Shadow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute w-[220px] sm:w-[280px] md:w-[340px] h-[70px] bg-black/20 blur-3xl rounded-full bottom-6"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 8 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src="/assets/image-banner-dish (2).png"
                alt="Food"
                width={650}
                height={650}
                priority
                className="relative z-10 w-[240px] sm:w-[330px] md:w-[430px] lg:w-[560px] object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,.35)] transition duration-500"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
