"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { useSession, authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

const CLOUDINARY_CLOUD_NAME = "dmakhtoif";
const CLOUDINARY_UPLOAD_PRESET = "recipehub_avatars";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard/user"); // fallback
    }
  };

  const openUpdateModal = () => {
    setFullName(session?.user?.name || "");
    setImage(session?.user?.image || "");
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Upload failed");
      }

      setImage(data.secure_url);
      toast.success("Image uploaded!");
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error("Image upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await authClient.updateUser({
      name: fullName,
      image: image || undefined,
    });

    if (error) {
      toast.error(error.message || "Update failed. Try again.");
      setIsSaving(false);
      return;
    }

    toast.success("Profile updated successfully!");
    await refetch();
    setIsSaving(false);
    setIsModalOpen(false);
  };

  if (isPending) {
    return (
      <section className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Cover banner skeleton */}
          <div className="h-28 bg-gradient-to-br from-orange-200 to-orange-100 animate-pulse" />

          <div className="px-8 pb-8 -mt-12 flex flex-col items-center text-center">
            {/* Avatar skeleton with spinner */}
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-white ring-offset-2 ring-offset-orange-50 bg-orange-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-orange-400" />
              </div>
            </div>

            {/* Text skeletons */}
            <div className="skeleton h-6 w-40 mt-5 bg-orange-100" />
            <div className="skeleton h-4 w-52 mt-3 bg-orange-100" />
            <div className="skeleton h-10 w-36 rounded-xl mt-6 bg-orange-100" />
          </div>
        </motion.div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-gray-500">
          You need to be logged in to view this page.
        </p>
      </section>
    );
  }

  const { user } = session;

  return (
    <section className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Cover banner */}

        <div className="h-28 p-6 text-right bg-gradient-to-br from-orange-500 to-orange-400">
          <button
            onClick={handleBack}
            className="btn btn-circle btn-sm bg-slate-800 hover:bg-slate-900 border-none text-white"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        <div className="px-8 pb-8 -mt-12 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-white ring-offset-2 ring-offset-orange-50">
              {user.image ? (
                <Image
                  height={50}
                  width={50}
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-orange-500 text-white flex items-center justify-center w-full h-full text-3xl font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={openUpdateModal}
            className="btn bg-orange-500 hover:bg-orange-600 border-none text-white rounded-xl font-semibold shadow-lg shadow-orange-200 mt-6 px-8"
          >
            Update Profile
          </motion.button>
        </div>
      </motion.div>

      {/* Update Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
            onClick={() => !isSaving && !isUploading && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Update Profile
              </h2>
              <p className="text-gray-500 text-center mt-1 mb-6">
                Update your name and profile photo
              </p>

              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Preview + Upload */}
                <div className="flex flex-col items-center gap-3 mb-2">
                  <div className="avatar relative">
                    <div className="w-24 rounded-full ring ring-orange-400 ring-offset-2">
                      {image ? (
                        <Image
                          src={image}
                          width={30}
                          height={30}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="bg-orange-500 text-white flex items-center justify-center w-full h-full text-2xl font-semibold">
                          {fullName?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                    </div>

                    {isUploading && (
                      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <span className="loading loading-spinner loading-sm text-white" />
                      </div>
                    )}
                  </div>

                  {/* Hidden file input + trigger button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-sm btn-outline rounded-full font-semibold disabled:opacity-60"
                  >
                    {isUploading ? "Uploading..." : "Choose Photo"}
                  </button>
                  <p className="text-xs text-gray-400">JPG or PNG, up to 5MB</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="input input-bordered w-full btn text-start rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-shadow"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isSaving || isUploading}
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-outline flex-1 rounded-xl font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="btn bg-orange-500 hover:bg-orange-600 border-none text-white flex-1 rounded-xl font-semibold shadow-lg shadow-orange-200 disabled:opacity-70"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
