import Comment from '@/models/commentModel';
import { connect } from '@/dbConfig/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
connect();

export async function POST(request: NextRequest) {
    try {
        const { comments, user, blog } = await request.json();
        if (!comments || !user || !blog) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const blogId=blog._id
        const userId=user._id
        const comment = await Comment.create({
            content: comments,
            blogId:blogId ,
            createdBy: userId
        });
        return NextResponse.json({ message: "Comment has been posted", comment }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
