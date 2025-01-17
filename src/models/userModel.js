import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profileImageURL: {
    type: String,
    default: "/profile.webp",
  },
  bio: {
    type: String,
    default: "",
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  hashedEmail: String,
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:[]
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:[]
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
