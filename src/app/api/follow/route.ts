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
  
      const userToFollow = await User.findById(userId);
      const currentUser = await User.findById(myId);
  
      if (!userToFollow || !currentUser) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }
  
      // Ensure followers and following are arrays
      if (!Array.isArray(userToFollow.followers)) {
        userToFollow.followers = []; // Initialize as empty array if not set
      }
      if (!Array.isArray(currentUser.following)) {
        currentUser.following = []; // Initialize as empty array if not set
      }
  
      // Log data before changes
      console.log("User to follow's followers before update:", userToFollow.followers);
      console.log("Current user's following before update:", currentUser.following);
  
      // Check if already following
      if (userToFollow.followers.includes(myId)) {
        return NextResponse.json({ message: "Already following this user." }, { status: 400 });
      }
  
      // Add myId to the user's followers and userId to my following
      userToFollow.followers.push(myId);
      currentUser.following.push(userId);
  
      // Log data after changes
      console.log("User to follow's followers after update:", userToFollow.followers);
      console.log("Current user's following after update:", currentUser.following);
  
      await userToFollow.save();
      await currentUser.save();
  
      // Check if changes were successfully applied
      if (userToFollow.isModified()) {
        console.log("User to follow's followers array was updated");
      }
      if (currentUser.isModified()) {
        console.log("Current user's following array was updated");
      }
  
      console.log("Followed successfully:", { userId, myId }); // Log successful follow operation
  
      return NextResponse.json({ message: "Followed successfully." }, { status: 200 });
    } catch (error: any) {
      console.error("Error:", error); // Log the error for debugging
      return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
    }
  }
  