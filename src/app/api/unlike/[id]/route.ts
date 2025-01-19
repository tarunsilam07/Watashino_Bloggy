import { connect } from '@/dbConfig/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import Blog from '@/models/blogModel';

connect();

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const blogId = url.pathname.split('/').pop();
    const reqBody = await request.json();
    const { userId } = reqBody;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // Ensure likedBy is an array
    if (!Array.isArray(blog.likedBy)) {
      blog.likedBy = [];
    }

    // Check if the user has liked the blog
    if (!blog.likedBy.includes(userId)) {
      return NextResponse.json(
        { message: "You have not liked this blog" },
        { status: 400 }
      );
    }

    // Update the blog using updateOne to remove userId from likedBy and decrement likes
    const result = await Blog.updateOne(
      { _id: blogId },
      {
        $pull: { likedBy: userId },  // Remove userId from likedBy array
        $inc: { likes: -1 }           // Decrement likes by 1
      }
    );

    // If no document was modified, return an error
    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Failed to unlike the blog" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Blog unliked", blogLikes: blog.likes - 1 },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
