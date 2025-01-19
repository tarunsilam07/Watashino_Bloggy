"use client";
import axios from "axios";
import Navbar from "@/components/NavBar";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import FollowModal from "@/components/FollowModal";

interface User {
  username: string;
  email: string;
  profileImageURL: string;
  bio: string;
  postCount: number;
  followers: string[];
  following: string[];
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

const UserProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState<User | null>(null);
  const [followersList, setFollowersList] = useState<Follower[]>([]);
  const [followingsList, setFollowingList] = useState<Follower[]>([]);
  const [myId, setMyId] = useState("");
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

  const fetchUserAndBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/profile/${userId}`);
      const { user, blogs } = response.data;

      if (!user) {
        setError("User not found.");
        toast.error("User not found.");
        return;
      }

      const isCurrentlyFollowing = user.followers.includes(myId);

      setUser(user);
      setIsFollowing(isCurrentlyFollowing);
      setFollowersCount(user.followers.length);
      setFollowingCount(user.following.length);
      setRecentPosts(blogs);
      toast.success("User data loaded successfully.");
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching user data.");
      toast.error(error.response?.data?.message || "Error loading user data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(`/api/followers/${userId}`);
      setFollowersList(response.data.followers);
      setIsFollowersModalOpen(true); // Open the followers modal
    } catch (error: any) {
      console.log(error)
      toast.error("Failed to fetch followers.");
    }
  };
  const fetchFollowing = async () => {
    try {
      const response = await axios.get(`/api/following/${userId}`);
      setFollowingList(response.data.following);
      setIsFollowingModalOpen(true); // Open the following modal
    } catch (error: any) {
      console.log(error)
      toast.error("Failed to fetch following.");
    }
  };
  


  useEffect(() => {
    if (!userId) {
      setError("Invalid User ID.");
      setLoading(false);
      toast.error("User ID is missing or invalid.");
      return;
    }

    const fetchMyId = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setMyId(response.data.user._id);
      } catch (error: any) {
        setError(error.response?.data?.message || "Error fetching user data.");
        toast.error(error.response?.data?.message || "Error loading user data.");
      }
    };

    fetchUserAndBlogs();
    fetchMyId();

    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, [userId, myId]);

  const toggleFollow = async () => {
    try {
      const endpoint = isFollowing ? "/api/unfollow" : "/api/follow";
      await axios.post(endpoint, { userId, myId });

      setIsFollowing(!isFollowing);
      setFollowersCount((prevCount) => (isFollowing ? prevCount - 1 : prevCount + 1));

      toast.success(isFollowing ? "Unfollowed successfully." : "Followed successfully.");
      fetchUserAndBlogs();
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || "Error updating follow status.");
    }
  };

  const toggleDarkMode = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    localStorage.setItem("darkMode", String(newDarkModeState));
    toast.success(`Switched to ${newDarkModeState ? "dark" : "light"} mode.`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-left items-center">
        <h1 className="text-2xl font-bold text-red-600">{error}</h1>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => router.push("/")}>
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div
  className={`min-h-screen ${
    darkMode
      ? "bg-gray-900 text-white"
      : "bg-gradient-to-br from-gray-100 to-blue-50 text-gray-800"
  }`}
>
  <Navbar />
  <div
    className={`max-w-6xl mx-auto mt-10 p-4 sm:p-8 ${
      darkMode ? "bg-gray-800" : "bg-white"
    } shadow-2xl rounded-3xl border ${
      darkMode ? "border-gray-700" : "border-gray-300"
    }`}
  >
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <button
        onClick={toggleDarkMode}
        className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
    {loading ? (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        <p className="ml-4 text-xl font-semibold text-blue-500">
          Loading user data...
        </p>
      </div>
    ) : (
      user && (
        <>
          <div className="flex flex-col items-center sm:flex-row space-y-6 sm:space-y-0 sm:space-x-12">
            <img
              src={user.profileImageURL}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-2xl"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-extrabold">{user.username}</h1>
              <p className="text-lg text-gray-400">{user.email}</p>
              <p className="mt-3 text-gray-400">
                {user.bio || "No bio available."}
              </p>
              <div className="flex flex-col sm:flex-row items-center mt-6 space-x-0 space-y-4 sm:space-y-0 sm:space-x-6">
                <div
                  onClick={fetchFollowers}
                  className="cursor-pointer flex items-center justify-center px-6 py-4 bg-blue-100 rounded-lg border border-blue-300 shadow-md hover:shadow-lg hover:bg-blue-200 transition"
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {followersCount}
                    </p>
                    <p className="text-sm text-blue-500">Followers</p>
                  </div>
                </div>
                <div
                  onClick={fetchFollowing}
                  className="cursor-pointer flex items-center justify-center px-6 py-4 bg-green-100 rounded-lg border border-green-300 shadow-md hover:shadow-lg hover:bg-green-200 transition"
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {followingCount}
                    </p>
                    <p className="text-sm text-green-500">Following</p>
                  </div>
                </div>
                {userId !== myId && (
                  <button
                    onClick={toggleFollow}
                    className={`w-full sm:w-auto px-6 py-2 font-semibold rounded-full shadow-lg ${
                      isFollowing
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white hover:shadow-xl transition-transform transform hover:scale-105`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
            </div>
          </div>
          {isFollowersModalOpen && (
            <FollowModal
              title="Followers"
              list={followersList}
              onClose={() => setIsFollowersModalOpen(false)}
            />
          )}
          {isFollowingModalOpen && (
            <FollowModal
              title="Following"
              list={followingsList}
              onClose={() => setIsFollowingModalOpen(false)}
            />
          )}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className={`p-6 ${
                darkMode
                  ? "bg-gradient-to-br from-blue-600 to-purple-600"
                  : "bg-gradient-to-br from-blue-500 to-purple-500"
              } text-white rounded-lg shadow-md`}
            >
              <Link href={`/userBlogs/${userId}`}>
                <h2 className="text-2xl font-bold underline hover:text-gray-200 transition">
                  Posts
                </h2>
              </Link>
              <p className="mt-2 text-lg">
                {recentPosts.length} published articles
              </p>
            </div>
          </div>
          <div className="mt-16">
          <h2 className="text-3xl font-bold">Recent Posts</h2>
          {recentPosts.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.slice(0, 3).map((post) => (
                <Link
                  href={`/blog/${post._id}`}
                  key={`${post._id}-${post.title}`}
                  className="group"
                >
                  <div
                    className={`p-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <img
                      src={post.coverImageURL}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="mt-2 text-gray-400">
                      {post.body.substring(0, 100)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-600 text-center">
              No posts to display
            </p>
          )}
        </div>

        </>
      )
    )}
  </div>
</div>
  );
};

export default UserProfilePage;
