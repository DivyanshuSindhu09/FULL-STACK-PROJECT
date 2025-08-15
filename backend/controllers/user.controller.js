import imagekit from "../config/imagekit.js";
import { Connection } from "../models/connection.model.js";
import {User} from "../models/user.model.js";
import {Post} from "../models/post.model.js"
import fs from "fs";
import { inngest } from "../inngest/index.js";
//! get user data using user id

export const getUserData = async (req, res) => {
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId)

        console.log(userId)

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
        const {userId} = req.auth()
        let {username, bio,full_name ,location} = req.body

        const tempUser = await User.findById(userId)

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
        const cover = req.files.cover_photo && req.files.cover_photo[0]

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
        const user = await User.findByIdAndUpdate(userId, updatedData, {new: true})

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

//! send connection request

export const sendConnectionRequest = async (req, res) => {
    try {
        const {userID} = req.auth()
        const {to_user_id} = req.body
        
        //? check if user has sent more than 20 connection requests in 24 hours

        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const connectionRequests = await Connection.find({
            from_user_id: userID,
            created_at : { $gte: last24Hours }
        })

        //! .find query returns an array, so we can check the length

        if(connectionRequests.length >= 20) {
            return res.status(400).json({
                success: false,
                message: "You have sent too many connection requests in the last 24 hours"
            })
        }
        
        //! check if connection request already exists
        
        const connection = await Connection.findOne({
            $or:[
                {from_user_id: userID, to_user_id},
                {from_user_id: to_user_id, to_user_id: userID}
            ]
        })

        if(!connection){
            const newConnection = await Connection.create({
                from_user_id: userID,
                to_user_id,
            })
            //! triggering send connection request reminder function

            await inngest.send({
                name : "app/connection-request",
                data : {
                    connectionId : newConnection._id
                }
            })

            return res.status(200).json({
                success: true,
                message: "Connection request sent successfully"
            })
        } else if (connection && connection.status === 'accepted') {
            return res.status(400).json({
                success: false,
                message: "You are already connected with this user"
            })
        }
        
        return res.status(400).json({
            success: false,
            message: "Connection request pending"
        })

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//! get user connections

export const getUserConnections = async (req, res) => {
    try {
        const {userID} = req.auth()

        const user =  await User.findById(userID).populate('connections', 'followers', 'following')

        const connections = user.connections
        const followers = user.followers
        const following = user.following

        //! for pending connections

        const pendingConnections = ( await Connection.find({to_user_id: userID, status: 'pending'}).populate('from_user_id') ).map((connection)=> connection.from_user_id)

        //! pendingConnections = [userObj1, userObj2, ...]

        //! .populate likhne se pura document copy hojaega, agar koi specific field chahiye to populate('from_user_id', 'field1 field2') likhna padega or kuch exclude karna ho to populate('from_user_id', 'field1 field2 -field3') likhna padega

        return res.status(200).json({
            success: true,
            connections,
            followers,
            following,
            pendingConnections,
            message: "User connections retrieved successfully"
        })

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//! accept connection request

export const acceptConnectionRequest = async (req, res) => {
    try {
        const {userID} = req.auth()
        const {id} = req.body

        const connection = await Connection.findOne({
            from_user_id: id,
            to_user_id: userID,
        })

        if(!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found"
            })
        }

        const user = await User.findById(userID)
        user.connections.push(id)
        await user.save()

        const fromUser = await User.findById(id)
        fromUser.connections.push(userID)
        await fromUser.save()

        connection.status = 'accepted'
        await connection.save()

        return res.status(200).json({
            success: true,
            message: "Connection request accepted successfully"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//! see users post 

export const getPostsByUser = async (req, res) => {
    try {
        const {profileId} = req.body
    
        const profile = await User.findById(profileId)
    
        if(!profile){
            return res.status(200).json({
                success : false,
                message : "Profile Not Found"
            })
        }
    
        const posts = await Post.find({
            user : profileId
        }).populate('user')
    
        return res.status(200).json({
            success : true,
            posts,
            profile,
            message : "Posts fetched successfully"
        })
    } catch (error) {
        console.log(error)
        console.log("Error HEre")
        return res.status(400).json({
            success: false,
            message : error.message
        })
    }
}
