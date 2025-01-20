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
      console.log("Request Body:", reqBody);
  
      const userToFollow = await User.findById(userId);
      const currentUser = await User.findById(myId);
  
      if (!userToFollow || !currentUser) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }
  
      if (!Array.isArray(userToFollow.followers)) {
        userToFollow.followers = []; 
      }
      if (!Array.isArray(currentUser.following)) {
        currentUser.following = []; 
      }
   
      console.log("User to follow's followers before update:", userToFollow.followers);
      console.log("Current user's following before update:", currentUser.following);
  
      if (userToFollow.followers.includes(myId)) {
        return NextResponse.json({ message: "Already following this user." }, { status: 400 });
      }
  
      userToFollow.followers.push(myId);
      currentUser.following.push(userId);
  
      console.log("User to follow's followers after update:", userToFollow.followers);
      console.log("Current user's following after update:", currentUser.following);
  
      await userToFollow.save();
      await currentUser.save();
  
      if (userToFollow.isModified()) {
        console.log("User to follow's followers array was updated");
      }
      if (currentUser.isModified()) {
        console.log("Current user's following array was updated");
      }
  
      console.log("Followed successfully:", { userId, myId }); 
  
      return NextResponse.json({ message: "Followed successfully." }, { status: 200 });
    } catch (error: any) {
      console.error("Error:", error); 
      return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
    }
  }
  