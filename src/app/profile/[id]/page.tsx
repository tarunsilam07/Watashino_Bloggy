"use client";
import axios from "axios";
import Navbar from "@/components/NavBar";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface User {
  username: string;
  email: string;
  profileImageURL: string;
  bio: string;
  postCount: number;
  followers: number;
  following: number;
}

interface Post {
  _id: string;
  title: string;
  coverImageURL: string;
  body: string;
}

const UserProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState<User | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("Invalid User ID.");
      setLoading(false);
      toast.error("User ID is missing or invalid.");
      return;
    }

    const fetchUserAndBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/profile/${userId}`);
        const { user, blogs } = response.data;

        if (!user) {
          setError("User not found.");
          toast.error("User not found.");
          return;
        }

        setUser(user);
        setRecentPosts(blogs);
        toast.success("User data loaded successfully.");
      } catch (error: any) {
        setError(error.response?.data?.message || "Error fetching user data.");
        toast.error(error.response?.data?.message || "Error loading user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBlogs();

    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, [userId]);

  const toggleDarkMode = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    localStorage.setItem("darkMode", String(newDarkModeState));
    toast.success(`Switched to ${newDarkModeState ? "dark" : "light"} mode.`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-red-600">{error}</h1>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => router.push("/")}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-100 to-blue-50"}`}>
      <Navbar />
      <div
        className={`max-w-6xl mx-auto mt-10 p-8 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } shadow-xl rounded-lg`}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg font-semibold text-blue-500">Loading user data...</p>
          </div>
        ) : (
          user && (
            <>
              <div className="flex items-center space-x-8">
                <img
                  src={user.profileImageURL}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
                <div>
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <p className="text-lg">{user.email}</p>
                  <p className="mt-2">{user.bio}</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div
                  className={`p-6 ${
                    darkMode
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  } text-white rounded-lg shadow-md`}
                >
                  <Link href={`/userBlogs/${userId}`}>
                    <h2 className="text-xl font-semibold underline hover:text-gray-200 transition duration-300">
                      Posts
                    </h2>
                  </Link>
                  <p className="mt-2 text-lg">{recentPosts.length} published articles</p>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold">Recent Posts</h2>
                {recentPosts.length > 0 ? (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentPosts.slice(0, 3).map((post) => (
                      <Link href={`/blog/${post._id}`} key={`${post._id}-${post.title}`} className="group">
                        <div
                          className={`p-6 ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          } rounded-lg shadow-lg transition-transform transform hover:scale-105`}
                        >
                          <img
                            src={post.coverImageURL}
                            alt={post.title}
                            className="w-full h-48 object-cover rounded-t-lg mb-4"
                          />
                          <h3 className="text-lg font-semibold group-hover:underline">
                            {post.title}
                          </h3>
                          <p className="text-sm mt-2 text-gray-600">
                            {post.body.slice(0, 100)}...
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-gray-500">No recent posts available.</p>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={toggleDarkMode}
                  className={`px-4 py-2 rounded-full ${
                    darkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-white"
                  } transition duration-300`}
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
