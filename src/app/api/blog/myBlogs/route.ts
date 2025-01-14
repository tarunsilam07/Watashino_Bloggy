import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Blog from "@/models/blogModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });
    }

    const blogs = await Blog.find({ createdBy: userId }).populate("createdBy");

    return NextResponse.json({
      message: "Blogs of the user fetched",
      success: true,
      blogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Can't load the blogs of the user", error: error.message },
      { status: 500 }
    );
  }
}
