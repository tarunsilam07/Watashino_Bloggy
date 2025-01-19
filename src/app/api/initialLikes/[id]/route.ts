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


    const likedByUser=(blog.likedBy.includes(userId))
    const likes=blog.likes;

    return NextResponse.json(
      { message: "Blog likes fetched",likedByUser:likedByUser,likes:likes},
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
