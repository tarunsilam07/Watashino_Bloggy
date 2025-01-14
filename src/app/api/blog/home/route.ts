import { NextResponse,NextRequest } from "next/server";
import {connect} from '@/dbConfig/dbConfig'
import Blog from "@/models/blogModel";
connect();

export async function GET(request:NextRequest){
    try {
        const blogs=await Blog.find({});
        return NextResponse.json({message:"Blogs fectched successfully",success:true,blogs},{status:200});
    } catch (error:any) {
        return NextResponse.json({error:error.message,success:false},{status:500});
    }
}