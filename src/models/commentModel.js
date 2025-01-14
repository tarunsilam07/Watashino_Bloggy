import mongoose from 'mongoose'

const CommentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    blogId:{
        type:mongoose.Types.ObjectId,
        ref:"Blog"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});

const Comment=mongoose.models.Comment || mongoose.model("Comment",CommentSchema);

export default Comment;