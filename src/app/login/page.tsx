"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const onLogin = async () => {
    setLoading(true);  // Start loading
    try {
      const response = await axios.post("/api/users/login", user);
      console.log(response);
      toast.success("Login successful");
      router.push("/profile");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to get started</p>
        <form className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none text-black"
              placeholder="Enter your email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none text-black"
              placeholder="Enter your password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full font-medium py-2 px-4 rounded-lg transition ${
              buttonDisabled || loading
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={buttonDisabled || loading}  // Disable button when loading
            onClick={(e) => {
              e.preventDefault();
              if (!buttonDisabled && !loading) onLogin();  // Proceed with login
            }}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                {/* Spinner */}
                <div className="w-6 h-6 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              </div>
            ) : buttonDisabled ? (
              "Enter details"
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          <Link href="/forgotpassword" className="text-blue-500 hover:underline">
          Forgot Password?
          </Link>
          </p>
        {/* Link to Sign up page */}
        <p className="text-center text-gray-600 mt-6">
          Create a new account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
