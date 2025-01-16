import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { user, bio } = reqBody;

    if (!user || !bio) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const updatedUser = await User.findById(user._id);
    
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    updatedUser.bio=bio;
    await updatedUser.save()

    return NextResponse.json({ message: "Bio updated successfully", updatedUser });
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
