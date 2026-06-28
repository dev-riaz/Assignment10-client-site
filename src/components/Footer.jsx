import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";

export default function Footer() {
  return (
    <footer className=" bg-[#172536] text-white px-8 lg:px-12 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2">
            <GiChefToque className="text-3xl text-orange-500" />
            <h2 className="text-2xl font-bold text-orange-500">RecipeHub</h2>
          </div>

          <p className="text-gray-300 mt-5 leading-8 text-sm">
            Your ultimate destination for discovering, sharing and cooking
            amazing recipes.
          </p>

          <div className="flex gap-3 mt-7">
            <a className="w-10 h-10 rounded-full bg-[#2851A3] flex items-center justify-center hover:scale-110 duration-300">
              <FaFacebookF />
            </a>

            <a className="w-10 h-10 rounded-full bg-[#E4405F] flex items-center justify-center hover:scale-110 duration-300">
              <FaInstagram />
            </a>

            <a className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center hover:scale-110 duration-300">
              <FaTwitter />
            </a>

            <a className="w-10 h-10 rounded-full bg-[#E60023] flex items-center justify-center hover:scale-110 duration-300">
              <FaPinterestP />
            </a>

            <a className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center hover:scale-110 duration-300">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-5">Quick Links</h3>

          <ul className="space-y-4 text-gray-300">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/">Browse Recipes</Link>
            </li>
            <li>
              <Link href="/">About Us</Link>
            </li>
            <li>
              <Link href="/">Contact Us</Link>
            </li>
            <li>
              <Link href="/">FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-5">Categories</h3>

          <ul className="space-y-4 text-gray-300">
            <li>Breakfast</li>
            <li>Lunch</li>
            <li>Dinner</li>
            <li>Desserts</li>
            <li>Drinks</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-5">Support</h3>

          <ul className="space-y-4 text-gray-300">
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-5">Contact Us</h3>

          <div className="space-y-5 text-gray-300">
            <div className="flex items-center gap-3">
              <HiOutlineMail className="text-orange-400 text-xl" />
              <span>hello@recipehub.com</span>
            </div>

            <div className="flex items-center gap-3">
              <HiOutlinePhone className="text-orange-400 text-xl" />
              <span>+880 1234 567890</span>
            </div>

            <div className="flex items-center gap-3">
              <HiOutlineLocationMarker className="text-orange-400 text-xl" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-400 text-sm">
        © 2024 RecipeHub. All rights reserved.
      </div>
    </footer>
  );
}
