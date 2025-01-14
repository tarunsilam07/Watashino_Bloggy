"use client"
import axios from "axios";
import Navbar from "@/components/NavBar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
  profileImageURL: string;
  bio: string;
  postCount: number;
  followers: number;
  following: number;
}

interface Post {
  id: string;
  title: string;
  coverImageURL: string;
  body: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    username: "Jane Blogger",
    email: "janeblogger@example.com",
    profileImageURL: "/profile.webp",
    bio: "Passionate writer exploring the art of storytelling.",
    postCount: 25,
    followers: 1200,
    following: 300,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<{ user: User }>("api/users/me");
        setUser(response.data.user || user);
      } catch (error:any) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();

    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blog/myBlogs", {
          withCredentials: true,
        });
        setRecentPosts(response.data?.blogs || []);
      } catch (err:any) {
        console.log("Failed to load blogs",err);
      } finally {
        console.log(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleLogOut = async () => {
    try {
      const response = await axios.get('/api/users/logout');
      router.push('/login');
      console.log(response);
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleCreateNewPost = () => {
    router.push('/addBlog');
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result);
        try {
          setUploading(true);
          const response = await axios.post("api/image/profile", { image: reader.result });
          setUser((prevUser) => ({
            ...prevUser,
            profileImageURL: response.data.secure_url,
          }));
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-100 to-blue-50'}`}>
      <Navbar />
      <div className={`max-w-6xl mx-auto mt-10 p-8 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-xl rounded-lg`}>
        <div className="flex items-center space-x-8">
          <div className="relative">
            <img
              src={typeof imagePreview === 'string' ? imagePreview : user.profileImageURL}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg transition-transform duration-300 transform hover:scale-110"
            />
            <label
              htmlFor="imageUpload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-500 transition duration-300"
            >
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {uploading ? "⏳" : "📸"}
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-lg">{user.email}</p>
            <p className="mt-2">{user.bio}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className={`p-6 ${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white rounded-lg shadow-md hover:scale-105 transition duration-300`}>
            <h2 className="text-xl font-semibold">Posts</h2>
            <p className="mt-2 text-lg">{user.postCount} published articles</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold">Recent Posts</h2>
          {recentPosts.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.slice(0, 3).map((post) => (
                <div key={`${post.id}-${post.title}`} className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg shadow-lg hover:scale-105 transition duration-300`}>
                  <img
                    src={post.coverImageURL}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm mt-2 text-gray-600">{post.body.slice(0, 100)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No recent posts available.</p>
          )}
        </div>

        <div className="mt-12 flex justify-end space-x-4">
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 transition duration-300" onClick={handleCreateNewPost}>
            Create New Post
          </button>
          <button className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300">
            Edit Profile
          </button>
          <button className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 transition duration-300"
          onClick={handleLogOut}>
            Logout
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'} transition duration-300`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
