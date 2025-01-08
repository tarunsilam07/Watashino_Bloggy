"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onResetPassword = async () => {
    setMessage("");
    setErrorMessage("");
    try {
      const response = await axios.post("/api/users/forgotpassword", { email });
      console.log(response);
      setMessage("Email sent to reset password");
      toast.success("Email sent to reset password");
    } catch (error:any) {
      console.log("error", error);
      const errorMsg = error.response?.data?.error || "An error occurred";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email to reset your password
        </p>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
        />
        <button
          onClick={onResetPassword}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Reset Password
        </button>
        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {errorMessage && <p className="mt-4 text-red-600 text-center">{errorMessage}</p>}
      </div>
    </div>
  );
}
