"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";

import { useSession, authClient } from "@/lib/auth-client";

import { FaCamera } from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineCloudUpload,
} from "react-icons/hi";

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/* ---------------- Join Date ---------------- */

const formatJoinDate = (dateStr) => {
  if (!dateStr) return "—";

  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/* ---------------- Upload Image ---------------- */

async function uploadToCloudinary(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error?.message || "Upload failed"
    );
  }

  return data.secure_url;
}

export default function ProfilePage() {
  const {
    data: session,
    isPending,
    refetch,
  } = useSession();

  /* ---------------- States ---------------- */

  const [isSaving, setIsSaving] =
    useState(false);

  const [isUploading, setIsUploading] =
    useState(false);

  const [
    isAvatarUploading,
    setIsAvatarUploading,
  ] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [image, setImage] =
    useState("");

  const [previewImage, setPreviewImage] =
    useState("");

  const [email, setEmail] =
    useState("");

  /* ---------------- Refs ---------------- */

  const fullNameRef = useRef(null);

  const photoInputRef = useRef(null);

  const avatarInputRef = useRef(null);

  /* ---------------- Prefill ---------------- */

  useEffect(() => {
    if (session?.user) {
      setImage(session.user.image || "");
      setPreviewImage(
        session.user.image || ""
      );
      setEmail(session.user.email || "");
    }
  }, [session]);  /* ---------------- Validate Image ---------------- */

  const validateImageFile = (file) => {
    if (!file) return false;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return false;
    }

    return true;
  };

  /* ---------------- Choose Photo (Preview Only) ---------------- */

  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!validateImageFile(file)) return;

    setSelectedFile(file);

    const preview = URL.createObjectURL(file);

    setPreviewImage(preview);

    e.target.value = "";
  };

  /* ---------------- Camera Upload (Instant) ---------------- */

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!validateImageFile(file)) return;

    setIsAvatarUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);

      const { error } = await authClient.updateUser({
        image: imageUrl,
      });

      if (error) {
        throw new Error(error.message);
      }

      setImage(imageUrl);
      setPreviewImage(imageUrl);

      await refetch();

      toast.success("Profile photo updated!");
    } catch (err) {
      console.error(err);

      toast.error(
        err.message || "Image upload failed."
      );
    } finally {
      setIsAvatarUploading(false);

      e.target.value = "";
    }
  };

  /* ---------------- Update Profile ---------------- */

  const handleUpdate = async (e) => {
    e.preventDefault();

    const nameValue =
      fullNameRef.current?.value.trim();

    if (!nameValue) {
      toast.error("Name can't be empty.");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = image;

      if (selectedFile) {
        setIsUploading(true);

        imageUrl =
          await uploadToCloudinary(selectedFile);

        setIsUploading(false);
      }

      const { error } =
        await authClient.updateUser({
          name: nameValue,
          image: imageUrl,
        });

      if (error) {
        throw new Error(error.message);
      }

      setImage(imageUrl);
      setPreviewImage(imageUrl);
      setSelectedFile(null);

      await refetch();

      toast.success(
        "Profile updated successfully!"
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.message || "Update failed."
      );
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };  /* ---------------- Loading ---------------- */

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-orange-500" />
      </div>
    );
  }

  /* ---------------- Not Logged In ---------------- */

  if (!session) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <p className="text-gray-500">
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }

  const { user } = session;

  const role =
    user?.role === "admin"
      ? "Admin"
      : "User";

  const isPremium =
    Boolean(user?.isPremium) ||
    user?.membership === "premium";

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-8">

      {/* Header */}

      <motion.div
        className="mb-8"
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
      >
        <h1 className="text-3xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your profile information and account settings.
        </p>
      </motion.div>

      {/* Main Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Card */}

        <motion.div
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >

          {/* Avatar & Info */}

          <div className="flex gap-6">

            {/* Avatar */}

            <div className="relative flex-shrink-0">

              {previewImage ? (
                <Image
                  src={previewImage}
                  alt={user.name || "User"}
                  width={130}
                  height={130}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-orange-500 text-white flex items-center justify-center text-4xl font-bold uppercase">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}

              {/* Camera Upload */}

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={isAvatarUploading}
                onClick={() =>
                  avatarInputRef.current?.click()
                }
                className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg transition disabled:opacity-60"
              >
                {isAvatarUploading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <FaCamera size={15} />
                )}
              </button>

            </div>

            {/* User Details */}

            <div className="flex-1">

              <h2 className="text-3xl font-bold text-gray-900">
                {user.name || "User"}
              </h2>

              <div className="mt-5 space-y-3 text-gray-700">

                <div className="flex items-center gap-2">
                  <HiOutlineMail size={18} />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <HiOutlineCalendar size={18} />
                  <span>
                    Joined on{" "}
                    {formatJoinDate(
                      user.createdAt
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <HiOutlineShieldCheck size={18} />

                  <span>
                    Role:
                  </span>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {role}
                  </span>
                </div>

                <div className="flex items-center gap-2">

                  <span>Status:</span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isPremium
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {isPremium
                      ? "Premium Member"
                      : "Free Member"}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* Update Form */}

          <div className="border-t mt-8 pt-6">

            <h3 className="text-lg font-bold text-gray-800 mb-5">
              Update Profile
            </h3>            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >
              {/* Name + Photo */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Full Name */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    ref={fullNameRef}
                    type="text"
                    defaultValue={user.name || ""}
                    key={user.name}
                    required
                    placeholder="Enter your full name"
                    className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  />

                </div>

                {/* Choose Photo */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoFileChange}
                  />

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() =>
                      photoInputRef.current?.click()
                    }
                    className="w-full h-11 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition flex items-center justify-center gap-2 text-gray-700 font-medium disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <HiOutlineCloudUpload size={18} />
                        Choose Photo
                      </>
                    )}
                  </button>

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  disabled
                  className="input input-bordered w-full rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                />

              </div>

              {/* Info */}

              <p className="text-xs text-gray-500 leading-6">
                Choose Photo এ ছবি নির্বাচন করলে শুধু preview
                দেখাবে। Update Profile বাটনে ক্লিক করলে
                নাম ও ছবি একসাথে update হবে।
              </p>

              {/* Button */}

              <button
                type="submit"
                disabled={isSaving}
                className="btn w-full bg-orange-500 hover:bg-orange-600 border-none text-white rounded-xl shadow-lg shadow-orange-200"
              >
                {isSaving
                  ? "Saving..."
                  : "Update Profile"}
              </button>

            </form>

          </div>

        </motion.div>        {/* ================= RIGHT CARD ================= */}

        <motion.div
          className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFE8B5] via-[#FFD88A] to-[#FFF4D8] shadow-md border border-orange-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: "easeOut",
          }}
        >
          <div className="p-8 h-full flex flex-col">

            {/* Crown */}

            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center shadow">
                <span className="text-5xl">👑</span>
              </div>
            </div>

            {/* Title */}

            <div className="text-center mt-5">

              <h2 className="text-3xl font-bold text-gray-800">
                Premium Membership
              </h2>

              <p className="text-gray-700 mt-3 leading-7">
                Unlock premium features and
                <br />
                take your cooking journey
                <br />
                to the next level.
              </p>

            </div>

            {/* Features */}

            <div className="mt-8 space-y-4">

              {[
                "Unlimited Recipe Upload",
                "Premium Profile Badge",
                "Priority Support",
                "Early Access to New Features",
              ].map((feature) => (

                <div
                  key={feature}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>

                  <span className="text-gray-800 font-medium">
                    {feature}
                  </span>
                </div>

              ))}

            </div>

            {/* Price */}

            <div className="mt-10 border-t border-orange-300 pt-8 text-center">

              <p className="text-gray-700">
                One Time Payment
              </p>

              <h1 className="text-5xl font-bold text-orange-600 mt-2">
                $10
              </h1>

            </div>            {/* Premium Button */}

            {isPremium ? (
              <button
                disabled
                className="mt-8 w-full py-4 rounded-xl bg-white/70 text-orange-700 text-lg font-semibold cursor-not-allowed"
              >
                👑 You are not a Premium Member
              </button>
            ) : (
              <button
                type="button"
                className="mt-8 w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold transition-all duration-300 shadow-lg shadow-orange-200"
              >
                👑 Become Premium
              </button>
            )}

            {/* Footer */}

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-600">
                🔒 Secure payment powered by Stripe
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  )

}