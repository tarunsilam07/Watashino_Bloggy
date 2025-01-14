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
        const comment = await Comment.create({
            content: comments,
            blogId: blog._id,
            createdBy: user._id
        });
        return NextResponse.json({ message: "Comment has been posted", comment }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
