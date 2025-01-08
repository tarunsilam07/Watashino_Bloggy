"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignUp = async () => {
    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post("/api/users/signup", user);
      console.log(response.data);
      router.push('/login');
    } catch (error: any) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false once the request is done
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
        <p className="text-center text-gray-600 mb-6">Sign up to get started</p>
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              id="username"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none text-black"
              placeholder="Enter your username"
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none text-black"
              placeholder="Enter your email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none text-black"
              placeholder="Enter your password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className={`w-full font-medium py-2 px-4 rounded-lg transition ${buttonDisabled ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            disabled={buttonDisabled || loading} // Disable button when loading
            onClick={(e) => {
              e.preventDefault();
              if (!buttonDisabled && !loading) onSignUp();
            }}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-6 h-6 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              </div>
            ) : buttonDisabled ? (
              "Enter details"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
