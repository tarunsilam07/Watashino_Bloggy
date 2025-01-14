"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/NavBar";

interface Blog {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  coverImageURL: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blog/home");
        if (response.data.success) {
          setBlogs(response.data.blogs);
        } else {
          console.error("Failed to fetch blogs:", response.data.error);
        }
      } catch (error: any) {
        console.error("Error fetching blogs:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading blogs...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen p-6">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="card h-full bg-white text-black border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="w-full h-48">
                <img
                  src={blog.coverImageURL}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col">
                <h5 className="text-lg font-semibold mb-2">{blog.title}</h5>
                <p className="text-sm text-gray-700 mb-4">
                  {blog.body.substring(0, 100)}...
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Published on: {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <a
                  href={`/blog/${blog._id}`}
                  className="btn-primary bg-blue-600 text-white py-2 px-4 rounded-lg text-center transition-transform transform hover:scale-105 hover:bg-blue-800 mt-auto"
                >
                  View More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
