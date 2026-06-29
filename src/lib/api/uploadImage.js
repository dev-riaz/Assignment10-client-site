"use client";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (file) => {
    if (!file) throw new Error("No file provided");
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error(
            "Cloudinary cloud name / upload preset env variable missing",
        );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        },
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error?.message || "Image upload failed");
    }

    return data.secure_url;
};