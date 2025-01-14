// models/blogModel.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  coverImageURL: {
    type: String,
    required: true,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Updated ref to match the User model
  },
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
