"use client"
import axios from "axios";
import Link from "next/link";
import {toast} from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const router=useRouter();  
  const handleLogout = async() => {
    try {
        await axios.get('/api/users/logout');
        toast.success("Logout Successful");
        router.push('/login');

    } catch (error:any) {
        console.log(error.message);
        toast.error(error.message);
    }
  };
  const [name,setName]=useState("");
  const getUserDetails=async()=>{
    const res=await axios.get('/api/users/me')
    console.log(res?.data);
    setName(res?.data?.data?.username);
  }

  useEffect(()=>{
    getUserDetails();
  },[])


  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-lg font-semibold"> {name?`Koninchiwa ${name}`:"Koninchiwa Guest"}</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ProfilePage;
