"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");

  const resetUser = async () => {
    try {
      const response = await axios.post("/api/users/resetpassword", { token });
      console.log(response);
      setVerified(true);
    } catch (err: any) {
      setError(true);
      console.log("Error during resetUser:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const emailParam = urlParams.get("id");

    if (urlToken) setToken(urlToken);
    if (emailParam) setEmail(emailParam);

    if (!urlToken || !emailParam) setError(true);
  }, []);

  useEffect(() => {
    if (token) resetUser();
  }, [token]);

  const onResetPassword = () => {
    router.push(`/newpassword?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      {verified ? (
        <div className="bg-green-50 p-8 rounded-lg shadow-lg max-w-md text-center">
          <h1 className="text-3xl font-semibold text-green-600">Email Verified!</h1>
          <p className="mt-2 text-lg text-gray-600">Your email has been successfully verified.</p>
          <button
            className="mt-6 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
            onClick={onResetPassword}
          >
            Reset Password
          </button>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-8 rounded-lg shadow-lg max-w-md text-center">
          <h1 className="text-3xl font-semibold text-red-600">Oops, Something went wrong!</h1>
          <p className="mt-2 text-lg text-gray-600">Please try again later.</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h1 className="text-3xl font-semibold text-blue-600">Verifying...</h1>
          <div className="mt-4 w-12 h-12 border-4 border-t-4 border-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
      )}
    </div>
  );
}