import { NextResponse,NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import User from "@/models/userModel";
import {connect} from '@/dbConfig/dbConfig'
import { getDataFromToken } from "@/helpers/getDataFromToken";
connect();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { success: false, error: "Invalid or unsupported file format." },
        { status: 400 }
      );
    }

    console.log("Uploading image to Cloudinary...");
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "uploads",
    });

    const userId=getDataFromToken(req);
    const update = await User.findOneAndUpdate(
        { _id: userId }, 
        { profileImageURL: uploadResponse.secure_url }, 
        { new: true } 
      );
      

    return NextResponse.json({
      success: true,
      secure_url: uploadResponse.secure_url,
      update
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
