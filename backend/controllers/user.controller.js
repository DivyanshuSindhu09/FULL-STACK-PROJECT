import imagekit from "../config/imagekit.js";
import {User} from "../models/user.model.js";
import fs from "fs";
//! get user data using user id

export const getUserData = async (req, res) => {
    try {
        const {userID} = req.auth()
        const user = await User.findById(userID)

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user,
            message: "User data retrieved successfully"
        })

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
}

//! update user data

export const updateUserData = async (req, res) => {
    try {
        const {userID} = req.auth()
        let {username, bio,full_name ,location} = req.body

        const tempUser = await User.findById(userID)

        //! if username not provided, use existing username
        !username && (username = tempUser.username)

        //! 
        if(tempUser.username !== username) {
            const user = await User.findOne({username})
            if(user) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                })
            }
        }

        const updatedData = {
            username,
            bio,
            full_name,
            location
        }

        const profile = req.files.profile_picture && req.files.profile_picture[0]
        const cover = req.files.cover_picture && req.files.profile_picture[0]

        //! image kit

        if(profile) {
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
            })

            const profileUrl = imagekit.url({
                path: response.filePath,
                transformation:[
                    {quality: 'auto'},
                    {format : 'webp'},
                    {width:'512'}
                ]
            })
            //! storing url in database
            updatedData.profile_picture = profileUrl 
        }

        if(cover) {
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname,
            })

            const coverUrl = imagekit.url({
                path: response.filePath,
                transformation:[
                    {quality: 'auto'},
                    {format : 'webp'},
                    {width:'1280'}
                ]
            })
            //! storing url in database
            updatedData.cover_picture = coverUrl 
        }

        //! saving in the database
        const user = await User.findByIdAndUpdate(userID, updatedData, {new: true})

        res.status(200).json({
            success: true,
            user,
            message: "User data updated successfully"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


//! find users using username,  email, full_name, location

export const discoverUsers = async (req, res) => {
    try {
        const {userID} = req.auth()
        //!$or: Means any one of the below conditions can be true.

        const {input} = req.body

        const allUsers = await User.find({
            $or:[
                {username : new RegExp(input, 'i')},
                {email : new RegExp(input, 'i')},
                {full_name : new RegExp(input, 'i')},
                {location : new RegExp(input, 'i')}
            ]
        })
        //! removing the current user from the list
        const filteredUsers = allUsers.filter(user => user._id.toString() !== userID.toString())

        return res.status(200).json({
            success: true,
            users: filteredUsers,
            message: "Users discovered successfully"
        })

    } catch (error) {
        console.log(error.message) 
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//! follow user

export const followUser = async (req, res) => {
    try {
        const {userID} = req.auth()
        const {followUserID} = req.body
        //! koi bhi name rkh skte hain variable ka

        const user = await User.findById(userID)

        if(user.following.includes(followUserID)) {
            return res.status(400).json({
                success: false,
                message: "You are already following this user"
            })
        }

        user.following.push(followUserID)
        await user.save()

        const followUser = await User.findById(followUserID)
        //! jis follow kr rhe hain uske followers me bhi add krna hoga
        followUser.followers.push(userID)
        await followUser.save()

        return res.status(200).json({
            success: true,
            message: "User followed successfully"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//! unfollow user

export const unfollowUser = async (req, res) => {
    try {
        const {userID} = req.auth()
        const {unfollowUserID} = req.body

        const user = await User.findById(userID)

        user.following = user.following.filter((user)=> user !== unfollowUserID)
        await user.save()

        const unfollowUser = await User.findById(unfollowUserID)
        unfollowUser.followers = unfollowUser.followers.filter((user)=> user !== userID)
        await unfollowUser.save()

        return res.status(200).json({
            success: true,
            message: "User unfollowed successfully"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}