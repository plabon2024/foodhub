"use client";

import { useState, ChangeEvent } from "react";

/* ---------------- Types ---------------- */
type UploadImageProps = {
  onUpload: (url: string) => void;
};

type CloudinaryResponse = {
  secure_url: string;
};

/* ---------------- Component ---------------- */
export default function UploadImage({ onUpload }: UploadImageProps) {
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data: CloudinaryResponse = await res.json();
      onUpload(data.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="cursor-pointer text-sm"
      />

      {uploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
    </div>
  );
}
