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
            type: mongoose.Schema.Types.String,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.String,
            ref: "User"
        }
    ],
    connections: [
        {
            type: mongoose.Schema.Types.String,
            ref: "User"
        }
    ],
},{timestamps: true});

export const User = mongoose.model("User", userSchema);