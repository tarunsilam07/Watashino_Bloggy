"use client";
import axios from "axios";
import Navbar from "@/components/NavBar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

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
  _id: string;
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
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<{ user: User }>("api/users/me");
        setUser(response.data.user || user);
        setNewBio(response.data.user.bio || user.bio);
      } catch (error: any) {
        toast.error("Error fetching user data.");
        console.error("Error fetching user data:", error);
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blog/myBlogs", {
          withCredentials: true,
        });
        setRecentPosts(response.data?.blogs || []);
      } catch (err: any) {
        toast.error("Failed to load blogs.");
        console.log("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchBlogs();

    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  const handleLogOut = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      toast.success("Successfully logged out.");
      router.push("/login");
      console.log(response);
    } catch (error: any) {
      toast.error("Error during logout.");
      console.log(error);
    }
  };

  const handleCreateNewPost = () => {
    toast.success("Redirecting to create a new post.");
    router.push("/addBlog");
  };

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
          toast.success("Profile image uploaded successfully.");
        } catch (error) {
          toast.error("Error uploading image.");
          console.error("Error uploading image:", error);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDarkMode = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    localStorage.setItem("darkMode", String(newDarkModeState));
    toast.success(`Switched to ${newDarkModeState ? "dark" : "light"} mode.`);
  };

  const handleBioChange = () => {
    if (isEditingBio) {
      axios
        .post("/api/users/updateBio", { bio: newBio, user })
        .then(() => {
          setUser((prevUser) => ({ ...prevUser, bio: newBio }));
          toast.success("Bio updated successfully.");
        })
        .catch((err) => {
          toast.error("Failed to update bio.");
          console.error(err);
        });
    }
    setIsEditingBio(!isEditingBio);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-100 to-blue-50"}`}>
      <Navbar />
      <div className={`max-w-6xl mx-auto mt-10 p-8 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} shadow-xl rounded-lg transition-all duration-500`}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <img
                  src={typeof imagePreview === "string" ? imagePreview : user.profileImageURL}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg transition-transform duration-300 transform group-hover:scale-110"
                />
                <label
                  htmlFor="imageUpload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-500 transition duration-300 group-hover:scale-110"
                >
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    aria-label="Upload Profile Image"
                  />
                  {uploading ? "⏳" : "📸"}
                </label>
              </div>
              <div className="flex flex-col justify-center space-y-2">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-lg">{user.email}</p>
                <div className="mt-2 space-y-3">
                  {isEditingBio ? (
                    <textarea
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      className="w-full p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                    />
                  ) : (
                    <p>{user.bio}</p>
                  )}
                  <button
                    onClick={handleBioChange}
                    className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-400 transition duration-300"
                  >
                    {isEditingBio ? (
                      <span className="flex items-center space-x-2">
                        <span>Save Bio</span>
                        {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                      </span>
                    ) : (
                      "Edit Bio"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className={`p-6 ${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300 transform`}>
                <Link href={'/myBlogs'}>
                  <h2 className="text-xl font-semibold group-hover:underline transition duration-300">Posts</h2>
                </Link>
                <p className="mt-2 text-lg">{recentPosts.length} published articles</p>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold">Recent Posts</h2>
              {recentPosts.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentPosts.slice(0, 3).map((post) => (
                    <Link href={`/blog/${post._id}`} key={`${post._id}-${post.title}`} className="group">
                      <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg shadow-lg hover:scale-105 transition duration-300 transform`}>
                        <img
                          src={post.coverImageURL}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg mb-4 transition-transform duration-500 group-hover:scale-105"
                        />
                        <h3 className="text-lg font-semibold group-hover:underline transition duration-300">{post.title}</h3>
                        <p className="text-sm mt-2 text-gray-600">{post.body.slice(0, 100)}...</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-gray-500">No recent posts available.</p>
              )}
            </div>

            <div className="mt-12 flex justify-end space-x-4">
              <button
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 transition duration-300"
                onClick={handleCreateNewPost}
              >
                Create New Post
              </button>
              <button
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 transition duration-300"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={toggleDarkMode}
                className={`px-6 py-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'} transition duration-300`}
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
