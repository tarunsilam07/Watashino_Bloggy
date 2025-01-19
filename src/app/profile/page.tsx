"use client";
import axios from "axios";
import Navbar from "@/components/NavBar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import FollowModal from "@/components/FollowModal";

interface User {
  _id: string;
  username: string;
  email: string;
  profileImageURL: string;
  bio: string;
  postCount: number;
  followers: [];
  following: [];
}

interface Post {
  _id: string;
  title: string;
  coverImageURL: string;
  body: string;
}

interface Follower {
  _id: string;
  username: string;
  profileImageURL: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    _id: "default_id",
    username: "Jane Blogger",
    email: "janeblogger@example.com",
    profileImageURL: "/profile.webp",
    bio: "Passionate writer exploring the art of storytelling.",
    postCount: 25,
    followers: [],
    following: [],
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [followersList, setFollowersList] = useState<Follower[]>([]);
  const [followingsList, setFollowingList] = useState<Follower[]>([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

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
    console.log(darkMode);
  }, []);

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(`/api/followers/${user._id}`);
      setFollowersList(response.data.followers);
      setIsFollowersModalOpen(true); // Open the followers modal
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to fetch followers.");
    }
  };
  const fetchFollowing = async () => {
    try {
      const response = await axios.get(`/api/following/${user._id}`);
      setFollowingList(response.data.following);
      setIsFollowingModalOpen(true); // Open the following modal
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to fetch following.");
    }
  };

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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result);
        try {
          setUploading(true);
          const response = await axios.post("api/image/profile", {
            image: reader.result,
          });
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
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-gray-100 to-blue-50"
      }`}
    >
      {" "}
      <Navbar />{" "}
      <div
        className={`max-w-6xl mx-auto mt-10 p-8 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } shadow-2xl rounded-2xl`}
      >
        {" "}
        <div className="flex justify-between items-center mb-6">
          {" "}
          <button
            onClick={toggleDarkMode}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition"
          >
            {" "}
            {darkMode ? "Light Mode" : "Dark Mode"}{" "}
          </button>{" "}
        </div>{" "}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            {" "}
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>{" "}
          </div>
        ) : (
          <>
            {" "}
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {" "}
              <div className="relative group">
                {" "}
                <img
                  src={
                    typeof imagePreview === "string"
                      ? imagePreview
                      : user.profileImageURL
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-xl"
                />{" "}
                <label
                  htmlFor="imageUpload"
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full cursor-pointer shadow-lg"
                >
                  {" "}
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />{" "}
                  {uploading ? "⏳" : "📸"}{" "}
                </label>{" "}
              </div>{" "}
              <div className="flex flex-col space-y-4 text-center md:text-left">
                {" "}
                <h1 className="text-4xl font-extrabold">
                  {user.username}
                </h1>{" "}
                <p className="text-lg text-gray-400">{user.email}</p>{" "}
                <div>
                  {" "}
                  {isEditingBio ? (
                    <textarea
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      className="w-full p-3 border-2 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400"
                    />
                  ) : (
                    <p className="text-base">{user.bio}</p>
                  )}{" "}
                  <button
                    onClick={handleBioChange}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full shadow-md hover:scale-105 hover:bg-blue-500"
                  >
                    {" "}
                    {isEditingBio ? "Save Bio" : "Edit Bio"}{" "}
                  </button>{" "}
                </div>{" "}
                <div className="flex justify-center md:justify-start space-x-6">
                  {" "}
                  <div className="flex items-center mt-4 space-x-6">
                    {" "}
                    <div
                      onClick={fetchFollowers}
                      className="cursor-pointer flex items-center justify-center px-6 py-4 bg-blue-100 rounded-lg border border-blue-300 shadow-md hover:shadow-lg hover:bg-blue-200 transition"
                    >
                      {" "}
                      <div className="text-center">
                        {" "}
                        <p className="text-2xl font-bold text-blue-600">
                          {user.followers.length}
                        </p>{" "}
                        <p className="text-sm text-blue-500">Followers</p>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div
                      onClick={fetchFollowing}
                      className="cursor-pointer flex items-center justify-center px-6 py-4 bg-green-100 rounded-lg border border-green-300 shadow-md hover:shadow-lg hover:bg-green-200 transition"
                    >
                      {" "}
                      <div className="text-center">
                        {" "}
                        <p className="text-2xl font-bold text-green-600">
                          {user.following.length}
                        </p>{" "}
                        <p className="text-sm text-green-500">Following</p>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {isFollowersModalOpen && (
              <FollowModal
                title="Followers"
                list={followersList}
                onClose={() => setIsFollowersModalOpen(false)}
              />
            )}{" "}
            {isFollowingModalOpen && (
              <FollowModal
                title="Following"
                list={followingsList}
                onClose={() => setIsFollowingModalOpen(false)}
              />
            )}{" "}
            <div className="mt-12">
              {" "}
              <h2 className="text-3xl font-extrabold">Highlights</h2>{" "}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {" "}
                <div
                  className={`p-6 ${
                    darkMode
                      ? "bg-blue-700"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  } text-white rounded-lg shadow-lg hover:scale-105`}
                >
                  {" "}
                  <Link href={"/myBlogs"}>
                    {" "}
                    <h2 className="text-2xl font-semibold">Posts</h2>{" "}
                  </Link>{" "}
                  <p className="mt-2 text-lg">
                    {recentPosts.length} published articles
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-12 flex justify-end space-x-4">
              {" "}
              <button
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400"
                onClick={handleCreateNewPost}
              >
                {" "}
                Create New Post{" "}
              </button>{" "}
              <button
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-400"
                onClick={handleLogOut}
              >
                {" "}
                Logout{" "}
              </button>{" "}
            </div>{" "}
            <div className="mt-12">
              {" "}
              <h2 className="text-2xl font-bold">Recent Posts</h2>{" "}
              {recentPosts.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {" "}
                  {recentPosts.slice(0, 3).map((post) => (
                    <Link
                      href={`/blog/${post._id}`}
                      key={`${post._id}-${post.title}`}
                      className="group"
                    >
                      {" "}
                      <div
                        className={`p-6 ${
                          darkMode ? "bg-gray-800" : "bg-gray-100"
                        } rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl`}
                      >
                        {" "}
                        <img
                          src={post.coverImageURL}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg mb-4"
                        />{" "}
                        <h3 className="text-lg font-semibold">{post.title}</h3>{" "}
                        <p className="text-sm mt-2 text-gray-400">
                          {post.body.substring(0, 100)}...
                        </p>{" "}
                      </div>{" "}
                    </Link>
                  ))}{" "}
                </div>
              ) : (
                <p className="mt-4 text-gray-600 text-center">
                  No posts to display
                </p>
              )}{" "}
            </div>{" "}
          </>
        )}{" "}
      </div>{" "}
    </div>
  );
};

export default ProfilePage;
