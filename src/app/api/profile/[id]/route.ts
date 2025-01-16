import { NextResponse,NextRequest } from "next/server";
import {connect} from '@/dbConfig/dbConfig'
import User from "@/models/userModel";
import Blog from "@/models/blogModel";
connect();

export async function GET(request:NextRequest) {
    try {
        const url=new URL(request.url);
        const userId=url.pathname.split('/').pop();

        if(!userId)
            return NextResponse.json({message:"User id not found"},{status:404});

        const user=await User.findById(userId);
        if(!user)
            return NextResponse.json({message:"Invalid User"},{status:404});
        const blogs=await Blog.find({createdBy:userId});

        return NextResponse.json({message:"User and blogs fetched",user,blogs},{status:200})


    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500});
    }
}