"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import Image from "next/image";

interface Blog {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  coverImageURL: string;
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blog/myBlogs", {
          withCredentials: true,
        });
        setBlogs(response.data?.blogs || []);
      } catch (err: any) {
        setError("Failed to load blogs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-black text-center">Loading blogs...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <>
      <NavBar />
      <div className="bg-white min-h-screen p-6">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          User Blogs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="card h-full bg-white text-black border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="w-full h-48 relative">
                <Image
                  src={blog.coverImageURL}
                  alt={blog.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
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
};

export default BlogsPage;
