"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      await axios.post("/api/users/login", user);
      toast.success("Login successful");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen items-center flex justify-center px-5 md:px-10 bg-white"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-screen-lg bg-white border shadow-xl sm:rounded-lg flex flex-col md:flex-row justify-center flex-1"
      >
        <div className="flex-1 bg-blue-900 text-center hidden md:flex">
          <motion.div
            className="m-8 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </div>
        <div className="w-full md:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="text-center">
              <h1 className="text-lg md:text-2xl xl:text-4xl font-extrabold text-blue-900">
                Welcome Back!
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                Please log in to access your account
              </p>
            </div>
            <div className="w-full flex-1 mt-6">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  className="text-blue-900 w-full px-4 py-2 md:px-5 md:py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-navy-800 text-navy-800 focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <div className="relative">
                  <input
                    className="text-blue-900 w-full px-4 py-2 md:px-5 md:py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-navy-800 text-navy-800 focus:outline-none focus:border-gray-400 focus:bg-white"
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
                  className={`mt-5 tracking-wide font-semibold w-full py-3 md:py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                    buttonDisabled || loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-900 text-gray-100 hover:bg-indigo-700"
                  }`}
                  disabled={buttonDisabled || loading}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!buttonDisabled && !loading) onLogin();
                  }}
                >
                  {loading ? (
                    <motion.div
                      className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    ></motion.div>
                  ) : (
                    <span className="ml-3">Login</span>
                  )}
                </button>
                <p className="mt-6 text-xs md:text-sm text-gray-600 text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">
                    <span className="text-blue-900 font-semibold">Sign Up</span>
                  </Link>
                </p>
                <p className="mt-2 text-xs md:text-sm text-gray-600 text-center">
                  <Link href="/forgotpassword">
                    <span className="text-blue-900 font-semibold">
                      Forgot Password?
                    </span>
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
