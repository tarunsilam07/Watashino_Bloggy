import { connect } from '@/dbConfig/dbConfig'
import Blog from '@/models/blogModel'
import { NextResponse, NextRequest } from 'next/server'
import User from '@/models/userModel';

connect();

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const { id } = params;

        // Find the blog by ID
        const blog = await Blog.findById(id);

        // Check if the blog exists
        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        // Find the user who created the blog
        const user = await User.findById(blog.createdBy);

        // Return the response with blog and user data
        return NextResponse.json({ message: "Blog fetched successfully", blog, user }, { status: 200 });
        
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
