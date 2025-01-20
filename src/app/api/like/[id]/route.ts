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

    if (blog.likedBy.includes(userId)) {
      return NextResponse.json(
        { message: "You have already liked this blog" },
        { status: 400 }
      );
    }
    blog.likes += 1;
    blog.likedBy.push(userId);

    await blog.save();

    return NextResponse.json(
      { message: "Blog liked", blogLikes: blog.likes },
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
