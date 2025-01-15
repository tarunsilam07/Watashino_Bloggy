"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password.length > 5 && user.username));
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
      className="h-[100vh] items-center flex justify-center px-5 lg:px-0 bg-white"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-screen-xl bg-white border shadow-xl sm:rounded-lg flex justify-center flex-1"
      >
        <div className="flex-1 bg-blue-900 text-center hidden md:flex">
          <motion.div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                Join Us
              </h1>
              <p className="text-[12px] text-gray-500">
                Create an account to explore more!
              </p>
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  className="text-blue-900 w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-navy-800 text-navy-800 focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Enter your username"
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                />
                <input
                  className="text-blue-900 w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-navy-800 text-navy-800 focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <input
                  className="text-blue-900 w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-navy-800 text-navy-800 focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                <button
                  className={`mt-5 tracking-wide font-semibold w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
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
                      className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    ></motion.div>
                  ) : (
                    <span className="ml-3">Sign Up</span>
                  )}
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link href="/login">
                    <span className="text-blue-900 font-semibold">Log in</span>
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
