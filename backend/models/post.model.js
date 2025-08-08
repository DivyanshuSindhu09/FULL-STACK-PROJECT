import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    user : {
        type : String,
        ref : 'User',
        required : true
    },
    content : {
        type : String,
        required : true,
        default : ""
    },
    image_urls : [
        {type : String}
    ],
    post_type : {
        type : String,
        enum : ['text', 'image', 'text_with_image'],
        required : true
    },
    likes_count : [
        {type : String,
        ref : "User"}
    ]
},{timestamps:true, minimize:false})

export const Post = mongoose.model("Post", postSchema)