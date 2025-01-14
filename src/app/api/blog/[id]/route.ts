import { NextResponse, NextRequest } from 'next/server';
import Blog from '@/models/blogModel';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';

connect();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Find the blog by ID
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    // Find the user who created the blog
    const user = await User.findById(blog.createdBy);

    return NextResponse.json(
      { message: 'Blog fetched successfully', blog, user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
