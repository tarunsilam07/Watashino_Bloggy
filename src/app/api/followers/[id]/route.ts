import { NextResponse, NextRequest } from "next/server";
import { connect } from '@/dbConfig/dbConfig';
import User from "@/models/userModel";

connect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.pathname.split('/').pop();

        if (!userId || userId.length !== 24) {
            return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
        }

        const user = await User.findById(userId).populate('followers', 'username profileImageURL bio');

        if (!user) {
            return NextResponse.json({ message: "User does not exist" }, { status: 404 });
        }

        const followers = user.followers;
        return NextResponse.json({ message: "Followers fetched successfully", followers }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
