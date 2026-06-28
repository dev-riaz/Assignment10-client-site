"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const Subscription = () => {
  return (
    <section className="py-16 px-4">
      <motion.div
        className="mx-auto w-11/12 rounded-3xl bg-orange-50 border border-orange-100 px-8 py-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
          {/* Left Content */}
          <motion.div
            className="max-w-md"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-bold leading-tight text-gray-900">
              Get delicious recipes <br /> in your inbox
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              Subscribe to our newsletter and never miss new recipes and
              updates.
            </p>
          </motion.div>

          {/* Center Form */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          >
            <form className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="h-14 flex-1 rounded-xl border border-gray-200 bg-white px-5 text-gray-700 outline-none focus:border-green-500"
              />

              <motion.button
                type="submit"
                className="h-14 rounded-xl bg-green-600 px-8 font-semibold text-white"
                whileHover={{ scale: 1.05, backgroundColor: "#15803d" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/assets/subscription_image.png"
              alt="Cooking Pot"
              width={260}
              height={220}
              className="object-contain"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Subscription;
