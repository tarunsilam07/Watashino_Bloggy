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

    if (!Array.isArray(blog.likedBy)) {
      blog.likedBy = [];
    }

    if (!blog.likedBy.includes(userId)) {
      return NextResponse.json(
        { message: "You have not liked this blog" },
        { status: 400 }
      );
    }

    const result = await Blog.updateOne(
      { _id: blogId },
      {
        $pull: { likedBy: userId }, 
        $inc: { likes: -1 }           
      }
    );

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
