"use client"
import { FaSearch, FaUtensils, FaShareAlt, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "Discover",
    description: "Browse recipes from different categories.",
    icon: FaSearch,
  },
  {
    id: "02",
    title: "Cook",
    description: "Follow simple steps and cook delicious meals.",
    icon: FaUtensils,
  },
  {
    id: "03",
    title: "Share",
    description: "Share your recipes with the community and inspire others.",
    icon: FaShareAlt,
  },
  {
    id: "04",
    title: "Enjoy",
    description: "Save favorites and enjoy cooking every day.",
    icon: FaHeart,
  },
];

const RecipeHubWorks = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-11/12">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            How It Works
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            How RecipeHub Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Discover delicious recipes, cook with confidence, share your
            creations and enjoy your favorite meals.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
              >
                {/* Arrow */}
                {index !== steps.length - 1 && (
                  <motion.div
                    className="absolute left-[65%] top-10 hidden w-[70%] border-t-2 border-dashed border-orange-200 lg:block"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.15 + 0.3,
                      ease: "easeOut",
                    }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  className="z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 transition duration-300 hover:bg-orange-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="text-4xl text-orange-500" />
                </motion.div>

                {/* Number */}
                <motion.span
                  className="text-sm font-bold text-orange-500"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                >
                  {step.id}
                </motion.span>

                {/* Title */}
                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecipeHubWorks;
