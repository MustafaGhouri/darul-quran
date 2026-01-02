import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

export const UploadButton = generateUploadButton({
  url: import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/uploadthing",
});

export const UploadDropzone = generateUploadDropzone({
  url: import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/uploadthing",
  endpoint: "imageUploader", // must match backend router slug
  onClientUploadComplete: (res) => {
    console.log("Upload complete:", res);
    // get uploaded URLs
    const urls = res.map(f => f.url);

    // send to your backend
    fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/uploadthing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ thumbnails: urls }),
    });
  },
  onUploadError: (err) => {
    console.error("Upload error:", err);
  },
});
