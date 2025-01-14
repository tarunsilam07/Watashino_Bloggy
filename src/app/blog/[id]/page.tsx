'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";  // Use useRouter and useParams
import Navbar from "@/components/NavBar";
import { FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import Image from "next/image";  // Import Image for optimization

interface Comment {
    _id: string;
    content: string;
    createdBy: {
        username: string;
        profileImageURL?: string;
    };
    createdAt: string;
}

export default function Blog() {
    const { id } = useParams();
    const [blog, setBlog] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [comments, setComments] = useState<string>("");  // Ensure comments is a string
    const [blogComments, setBlogComments] = useState<Comment[]>([]);  // Using the Comment type

    const onComment = async () => {
        if (!comments.trim()) return;
        try {
            const response = await axios.post('/api/blog/comments', { comments, user, blog });
            console.log(response.data);
            setComments("");  // Clear input after submission
            fetchComments();  // Refresh comments
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

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            try {
                const response = await axios.get(`/api/blog/${id}`);
                setBlog(response.data.blog);
                setUser(response.data.user);
            } catch (err) {
                console.log("Error fetching blog:", err);
            }
        };

        fetchBlog();
        fetchComments();
    }, [id, fetchComments]);  // Add fetchComments as a dependency

    if (!blog || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800">
                <p className="text-xl font-semibold animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                {/* Blog Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                        {blog.title}
                    </h1>
                    <div className="flex justify-center items-center gap-4 text-gray-600 mt-3">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt />
                            <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUserCircle />
                            <p>{user.username}</p>
                        </div>
                    </div>
                </div>

                {/* Blog Cover Image */}
                <div className="relative mb-8 rounded-lg shadow-xl overflow-hidden">
                    <Image
                        src={blog.coverImageURL}
                        alt={blog.title}
                        layout="responsive"
                        width={800}
                        height={500}
                        className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Blog Content */}
                <div className="prose lg:prose-lg text-gray-700 mx-auto leading-relaxed">
                    {blog.body.split("\n").map((paragraph: string, index: number) => (
                        <p key={index} className="mb-6 first-letter:text-4xl first-letter:font-bold first-letter:text-indigo-500">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Author Info */}
                <div className="mt-12 flex items-center p-6 bg-gradient-to-r from-indigo-50 to-gray-100 border border-indigo-200 rounded-xl shadow-lg">
                    {user.profileImageURL && (
                        <Image
                            src={user.profileImageURL}
                            alt={user.username}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full border-4 border-indigo-400 mr-6 shadow-md"
                        />
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-indigo-600">{user.username}</h2>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Comments</h2>
                    <ul className="space-y-6">
                        {blogComments.map((comment: Comment) => (
                            <li key={comment._id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-start gap-4">
                                    {comment.createdBy.profileImageURL ? (
                                        <Image
                                            src={comment.createdBy.profileImageURL}
                                            alt={comment.createdBy.username}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-full border-2 border-indigo-400 shadow-md"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
                                            {comment.createdBy.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-gray-800">{comment.createdBy.username}</h3>
                                            <span className="text-sm text-gray-500">
                                                {new Date(comment.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
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
                            className={`mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md transition ${
                                !comments.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"
                            }`}
                        >
                            Submit Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
