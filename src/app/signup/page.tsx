"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setButtonDisabled(
      !(user.email && user.password.length > 5 && user.username)
    );
  }, [user]);

  const onSignUp = async () => {
    setLoading(true);
    try {
      await axios.post("/api/users/signup", user);
      toast.success("Verify email sent! Check your inbox.");
      toast.success("Account created successfully! Please verify to log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[100vh] flex items-center justify-center px-4 md:px-6 bg-white"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-4xl bg-white border shadow-xl rounded-lg flex flex-col md:flex-row"
      >
        <div className="hidden md:flex md:w-1/2 bg-blue-900">
          <motion.div
            className="m-8 lg:m-12 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </div>
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-900">
                Join Us
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Create an account to explore more!
              </p>
            </div>
            <div className="w-full mt-6">
              <div className="max-w-xs mx-auto flex flex-col gap-4 text-blue-900">
                <input
                  className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Enter your username"
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
                <input
                  className="text-blue-900 w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <div className="relative">
                  <input
                    className="text-blue-900 w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-400 focus:bg-white"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                  <span
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiFillEye size={20} />
                    ) : (
                      <AiFillEyeInvisible size={20} />
                    )}
                  </span>
                </div>
                <button
                  className={`mt-5 tracking-wide font-semibold w-full py-3 rounded-md transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none ${
                    buttonDisabled || loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-900 text-gray-100 hover:bg-indigo-700"
                  }`}
                  disabled={buttonDisabled || loading}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!buttonDisabled && !loading) onSignUp();
                  }}
                >
                  {loading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    ></motion.div>
                  ) : (
                    <span className="ml-2">Sign Up</span>
                  )}
                </button>
                <p className="mt-4 text-xs text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link href="/login">
                    <span className="text-blue-900 font-semibold">Log In</span>
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
