"use client";
import React, { useState } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function AddBlog() {
  const router=useRouter();
  const [blog, setBlog] = useState({
    title: "",
    body: "",
    coverImageURL: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const handleImageURL = async (): Promise<string | null> => {
    if (!image) {
      console.error("No image selected.");
      return null;
    }

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Image = reader.result;

          const response = await fetch("/api/image/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image }),
          });

          const data = await response.json();
          if (data.success) {
            console.log("Image uploaded successfully:", data.secure_url);
            resolve(data.secure_url);
          } else {
            console.error("Image upload failed:", data.error);
            reject(new Error(data.error));
          }
        } catch (err: any) {
          console.error("Error uploading image:", err.message);
          reject(err);
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
      };

      reader.readAsDataURL(image);
    });
  };

  const onAddBlog = async () => {
    try {
      const url = await handleImageURL();
      if (!url) {
        console.error("Failed to upload image");
        return;
      }

      const updatedBlog = { ...blog, coverImageURL: url };
      const response = await axios.post("/api/blog/addBlog", updatedBlog);
      console.log(response.data);
      const id=response.data.blog._id
       router.push(`blog/${id}`);
    } catch (error: any) {
      console.log("Error", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
        <div className="bg-white shadow-md rounded-lg w-full max-w-lg p-8">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Create a Blog ✍️
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAddBlog();
            }}
          >
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Blog Title
              </label>
              <input
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                type="text"
                id="title"
                name="title"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800"
                placeholder="Enter blog title"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cover Image
              </label>
              <input
                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                type="file"
                id="coverImage"
                name="coverImage"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Blog Content
              </label>
              <textarea
                onChange={(e) => setBlog({ ...blog, body: e.target.value })}
                id="body"
                name="body"
                rows={6}
                className="text-gray-800 w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Write your blog content here..."
              ></textarea>
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-600 to-blue-500 rounded-md shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 transition duration-200 transform hover:scale-105"
              >
                Publish Blog 🚀
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
