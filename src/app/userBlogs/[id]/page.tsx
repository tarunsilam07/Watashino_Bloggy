"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

interface Blog {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  coverImageURL: string;
  createdBy: {
    username: string;
  };
}

const UserBlogsPage = () => {
  const params=useParams();
  const userId=params?.id;
  console.log(userId)
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`/api/userBlogs/${userId}`);
        setBlogs(response.data?.blogs || []);
      } catch (err: any) {
        setError("Failed to load blogs");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
        <motion.div
          className="text-4xl font-bold text-white"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading blogs...
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-br from-blue-100 via-white to-gray-100 min-h-screen p-6">
        <motion.h1
          className="text-4xl font-extrabold text-black mb-12 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {blogs.length > 0 && blogs[0].createdBy.username} Blogs
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              className="card h-full bg-white text-black border border-gray-200 rounded-lg shadow-lg overflow-hidden relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-full h-48">
                <img
                  src={blog.coverImageURL}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity duration-300" />
              </div>
              <div className="p-6 flex flex-col">
                <motion.h5
                  className="text-xl font-bold mb-2 text-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {blog.title}
                </motion.h5>
                <motion.p
                  className="text-sm text-gray-700 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {blog.body.substring(0, 100)}...
                </motion.p>
                <motion.p
                  className="text-sm text-gray-500 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Published on: {new Date(blog.createdAt).toLocaleDateString()}
                </motion.p>
                <motion.a
                  href={`/blog/${blog._id}`}
                  className="btn-primary bg-blue-600 text-white py-2 px-4 rounded-lg text-center mt-auto self-start shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-800"
                  whileTap={{ scale: 0.95 }}
                >
                  View More
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserBlogsPage;
