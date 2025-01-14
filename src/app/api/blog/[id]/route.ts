import {connect} from '@/dbConfig/dbConfig'
import Blog from '@/models/blogModel'
import { NextResponse,NextRequest } from 'next/server'
import User from '@/models/userModel';
connect();

export async function GET(request:NextRequest,{params}:{params:{id:string}}) {
    try {
    const {id}=await params;
    const blog=await Blog.findById(id);
    const userId=blog.createdBy;
    const user=await User.findById(userId);
    // console.log(user);
    // console.log("id",userId);

    // console.log(blog)
    if(blog)
        return NextResponse.json({message:"Blog fetched successfully",blog,user},{status:200});
    else 
        return NextResponse.json({message:"failed to fetch the blog"},{status:404});
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500});
    }
}