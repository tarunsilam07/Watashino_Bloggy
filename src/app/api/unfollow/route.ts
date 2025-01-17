import { connect } from '@/dbConfig/dbConfig';
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { userId, myId } = reqBody;

    if (!userId || !myId) {
        return NextResponse.json({ message: "User IDs are required." }, { status: 400 });
    }

    try {
        console.log("Request Body:", reqBody); // Log the request body for debugging

        const userToUnfollow = await User.findById(userId);
        const currentUser = await User.findById(myId);

        if (!userToUnfollow || !currentUser) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // Ensure followers and following are arrays
        if (!Array.isArray(userToUnfollow.followers)) {
            userToUnfollow.followers = []; // Initialize as empty array if not set
        }
        if (!Array.isArray(currentUser.following)) {
            currentUser.following = []; // Initialize as empty array if not set
        }

        // Check if not following
        if (!userToUnfollow.followers.includes(myId)) {
            return NextResponse.json({ message: "Not following this user." }, { status: 400 });
        }

        // Directly update the arrays in the database using updateOne
        await User.updateOne(
            { _id: userId },
            { $pull: { followers: myId } }
        );

        await User.updateOne(
            { _id: myId },
            { $pull: { following: userId } }
        );

        console.log("Unfollowed successfully:", { userId, myId }); // Log successful unfollow operation

        return NextResponse.json({ message: "Unfollowed successfully." }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error); // Log the error for debugging
        return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
    }
}
