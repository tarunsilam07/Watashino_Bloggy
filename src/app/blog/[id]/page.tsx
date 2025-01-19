"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/NavBar";
import {
  FaCalendarAlt,
  FaUserCircle,
  FaQuoteLeft,
  FaThumbsUp,
} from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal"; // Import the modal

export default function Blog() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<string>("");
  const [blogComments, setBlogComments] = useState<any[]>([]);
  const [blogUser, setBlogUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [loading, setLoading] = useState(false); // Loading state for blog deletion
  const [likes, setLikes] = useState<number>(0); // Likes count
  const [hasLiked, setHasLiked] = useState<boolean>(false); // Track if user has liked
  const [blogLikes, setBlogLikes] = useState<number>(0);

  const onComment = async () => {
    if (!comments.trim()) return;
    try {
      await axios.post("/api/blog/comments", { comments, user, blog });
      setComments("");
      fetchComments();
    } catch (error) {
      console.log("Error submitting comment:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/${id}`);
      setBlogComments(response.data.comments);
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  const toggleLike = async () => {
    try {
      if (hasLiked) {
        await axios.post(`/api/unlike/${id}`, { userId: user._id });
        setBlogLikes(blogLikes - 1);
        setLikes(likes - 1);
        setHasLiked(false);
      } else {
        await axios.post(`/api/like/${id}`, { userId: user._id });
        setBlogLikes(blogLikes + 1);
        setLikes(likes + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.log("Error toggling like:", error);
    }
  };

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/blog/${id}`);
      setBlog(response.data.blog);
      setBlogUser(response.data.user);
    } catch (err) {
      console.log("Error fetching blog:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/users/me");
      setUser(response.data.user);
    } catch (err: any) {
      console.log(err);
    }
  };

  const deleteBlog = async () => {
    setLoading(true); // Start loading
    try {
      await axios.delete(`/api/deleteBlog/${id}`);
      window.location.href = "/"; // Redirect to homepage or another page
    } catch (error) {
      console.log("Error deleting blog:", error);
    } finally {
      setLoading(false); // Stop loading once the request is completed
    }
  };

  const calculateReadingTime = () => {
    const words = blog.body.split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // Approx. 200 words per minute reading speed
    return minutes;
  };

  const fetchInitialLikes = async () => {
    if (!user?._id) {
      console.log("User is not available yet.");
      return;
    }
    try {
      const response = await axios.post(`/api/initialLikes/${id}`, {
        userId: user._id,
      });
      console.log(response);
      setBlogLikes(response.data.likes);
      setHasLiked(response.data.likedByUser);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchUser(); // Fetch the user
    fetchBlog(); // Fetch the blog details
    fetchComments(); // Fetch comments
  }, [id]);

  useEffect(() => {
    if (user && id) {
      fetchInitialLikes(); // Only call this when user and id are available
    }
  }, [user, id]);

  if (!blog || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800">
        <p className="text-xl font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-200 text-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        {/* Blog Header */}
        <div className="text-center mb-8 animate__animated animate__fadeInUp">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
            {blog.title}
          </h1>
          <div className="flex justify-center items-center gap-6 text-gray-600 mt-3">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaUserCircle />
              <Link href={`/profile/${blogUser._id}`}>
                <p className="text-indigo-500 hover:underline">
                  {blogUser.username}
                </p>
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              ⏱ {calculateReadingTime()} min read
            </div>
          </div>
        </div>

        {/* Blog Cover Image */}
        <div className="relative mb-8 rounded-lg shadow-xl overflow-hidden group">
          <img
            src={blog.coverImageURL}
            alt={blog.title}
            className="w-full h-auto max-h-[500px] object-cover transform transition-all duration-500 group-hover:scale-105"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 group-hover:opacity-0 transition-opacity duration-300"></div>
        </div>

        {/* Delete Blog Button */}
        {blogUser._id === user._id && (
          <div className="text-center mt-4 mb-8">
            <button
              onClick={() => setShowModal(true)} // Show the modal when the button is clicked
              className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200"
            >
              Delete Blog
            </button>
          </div>
        )}

        {/* Loading Spinner while deleting */}
        {loading && (
          <div className="absolute inset-0 bg-opacity-50 bg-black flex justify-center items-center z-10">
            <div className="w-16 h-16 border-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {/* Like/Unlike Button */}
        <div className="text-center mt-8 mb-10 p-8 bg-gradient-to-r from-indigo-100to-indigo-300 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Give Your Vote!
          </h2>
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-indigo-700">
                {blogLikes}
              </span>
              <span className="text-lg text-gray-600">Likes</span>
            </div>
            <button
              onClick={toggleLike}
              className={`px-8 py-4 text-white rounded-full shadow-md transform transition-all duration-300 ${
                hasLiked
                  ? "bg-red-600 hover:bg-red-700 scale-105"
                  : "bg-indigo-500 hover:bg-indigo-600 scale-100"
              }`}
            >
              <FaThumbsUp className="inline-block mr-2" />
              {hasLiked ? "Unlike" : "Like"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {hasLiked ? "You liked this post" : "Like this post?"}
          </p>
        </div>

        {/* Blog Content */}
        <div className="prose lg:prose-xl mx-auto leading-relaxed space-y-6 mt-8">
          {blog.body.split("\n\n").map((section: any, index: any) => (
            <div
              key={index}
              className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              {index % 2 === 0 ? (
                <p className="text-gray-700">{section}</p>
              ) : (
                <blockquote className="italic border-l-4 pl-4 border-indigo-500 text-indigo-800">
                  <FaQuoteLeft className="inline-block text-indigo-500 mr-2" />
                  {section}
                </blockquote>
              )}
            </div>
          ))}
        </div>

        {/* Author Info */}
        <div className="mt-12 flex items-center p-6 bg-gradient-to-r from-indigo-50 to-gray-100 border border-indigo-200 rounded-xl shadow-lg group hover:bg-indigo-50 transition-colors">
          {blogUser.profileImageURL && (
            <img
              src={blogUser.profileImageURL}
              alt={blogUser.username}
              className="w-20 h-20 rounded-full border-4 border-indigo-400 mr-6 group-hover:scale-110 transition-transform duration-300"
            />
          )}
          <div>
            <Link href={`/profile/${blogUser._id}`}>
              <h2 className="text-xl font-bold text-indigo-600 hover:underline">
                {blogUser.username}
              </h2>
            </Link>
            <p className="text-sm text-gray-600">{blogUser.email}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>
          <ul className="space-y-6">
            {blogComments.map((comment) => (
              <li
                key={comment._id}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  {comment.createdBy.profileImageURL ? (
                    <img
                      src={comment.createdBy.profileImageURL}
                      alt={comment.createdBy.username}
                      className="w-12 h-12 rounded-full border-2 border-indigo-400 shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
                      {comment.createdBy.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Link href={`/profile/${comment.createdBy._id}`}>
                        <h3 className="font-bold text-indigo-600 hover:underline">
                          {comment.createdBy.username}
                        </h3>
                      </Link>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}{" "}
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
            <input
              type="text"
              value={comments}
              placeholder="Add your comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={(e) => setComments(e.target.value)}
            />
            <button
              onClick={onComment}
              disabled={!comments.trim()}
              className={`mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md transition duration-200 ${
                !comments.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-600"
              }`}
            >
              Submit Comment
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        showModal={showModal}
        onConfirm={deleteBlog}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
