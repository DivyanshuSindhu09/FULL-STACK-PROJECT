//! add post 
import fs from 'fs'
import imagekit from '../config/imagekit.js'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'

export const addPost = async (req, res) => {
    try {
        
        const {userId} = req.auth
        const {content, post_type} = req.body   

        const images = req.files //! ye dekhio again

        let image_urls = []

        if (images.length){
            image_urls = await Promise.all(
                images.map(async (image)=> {
                    const fileBuffer = fs.readFileSync(image.path)
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder : "posts"
                    })

                    const url = imagekit.url({
                        path: response.filePath,
                        transformation:[
                            {quality: 'auto'},
                            {format : 'webp'},
                            {width:'512'}
                        ]
                    })
                    return url
                    //! storing url in database
                    updatedData.profile_picture = profileUrl 
                        })
                    )
        }

        await Post.create({
            user : userId,
            content,
            image_urls,
            post_type
        })

        return res.status(200).json({
            success : true,
            message : "Post Created Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
}

//! get post

export const getPost = async (req, res) => {
    try {
        
        const {userId} = req.auth()

        const user = await User.findById(userId)

        //! finding connected users and following 

        const userFriends = [ userId, ...user.connections, ...user.following ]

        const posts  = await Post.find({
            user : {
                $in : userFriends
            }
        }).populate('user').sort({createdAt : -1})

        return res.status(200).json({
            success : true,
            posts
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            succcess : false,
            message : error.message
        })
    }
}

/*
Post.find({ user: { $in: [...] } }): sirf un users ke posts fetch ho rahe hain jo userFriends mein hain.

.populate('user'): har post ke andar user field ke sirf _id ke jagah uska full user object inject ho jaata hai (e.g., name, avatar, etc.)

.sort({ createdAt: -1 }): latest posts sabse pehle.


*/

//! like post

export const likePost = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {postId} = req.body

        const post = await Post.findById(postId)

        if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            return res.status(200).json({
                success : true,
                message : "Post Unliked"
            })
        }else{
            post.likes_count.push(userId)
            await post.save()
            return res.status(200).json({
                success : true,
                message : "Post Liked"
            })
        }
    } catch (error) {
        
    }
}