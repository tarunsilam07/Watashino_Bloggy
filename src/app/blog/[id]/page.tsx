'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Navbar from "@/components/NavBar";
import { FaCalendarAlt, FaUserCircle } from "react-icons/fa";

export default function Blog() {
    const { id } = useParams();
    const [blog, setBlog] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [comments, setComments] = useState<any>("");
    const [blogComments, setBlogComments] = useState<any>(null);

    const onComment = async () => {
        try {
            if (!comments) return;
            const response = await axios.post('/api/blog/comments', { comments, user, blog });
            console.log(response.data);
            setComments(""); // Clear input after submission
            fetchComments(); // Refresh comments
        } catch (error: any) {
            console.log("error", error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/comments/${id}`);
            setBlogComments(response.data.comments);
        } catch (error: any) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            try {
                const response = await axios.get(`/api/blog/${id}`);
                setBlog(response.data.blog);
                setUser(response.data.user);
            } catch (err: any) {
                console.log(err);
            }
        };

        fetchBlog();
        fetchComments();
    }, [id]);

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
                    <img
                        src={blog.coverImageURL}
                        alt={blog.title}
                        className="w-full h-auto max-h-[500px] object-cover hover:scale-105 transition-transform duration-500"
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
                        <img
                            src={user.profileImageURL}
                            alt={user.username}
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
                        {blogComments?.map((comment: any) => (
                            <li key={comment._id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
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
                            disabled={!comments}
                            className={`mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md transition ${
                                !comments ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"
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
