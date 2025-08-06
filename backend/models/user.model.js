import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{
        type : String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        default: "Hello, I am using Axora",
    },
    profile_picture: {
        type: String,
        default: "",
    },
    cover_picture: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    followers: [
        {
            type:String,
            ref: "User"
        }
    ],
    following: [
        {
            type:String,
            ref: "User"
        }
    ],
    connections: [
        {
            type:String,
            ref: "User"
        }
    ],
},{timestamps: true,
    minimize: false,
});

export const User = mongoose.model("User", userSchema);