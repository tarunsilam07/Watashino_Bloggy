import { connect } from '@/dbConfig/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import Comment from '@/models/commentModel';
connect();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }
        const comments = await Comment.find({ blogId: id }).populate('createdBy');
        console.log(comments);
        if (!comments || comments.length === 0) {
            return NextResponse.json({ message: "No comments found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Comments fetched successfully", comments }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
