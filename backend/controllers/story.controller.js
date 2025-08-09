import fs from 'fs'
import imagekit from '../config/imagekit.js'
import Story from '../models/story.model.js'
import { User } from '../models/user.model.js'
import { inngest } from '../inngest/index.js'

export const createStory = async (req, res) => {
    try {
        const {userId} = req.auth()
        
        const {media_type, content, background_color} = req.body
        
        const media = req.file
        let media_url=''
        
        //! upload media to imagekit
        
        if(media_type === 'image' || media_type === 'video'){
            const fileBuffer = fs.readFileSync(media.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName : media.originalname
            })
            
            media_url = response.url
        }
    
        const story = await Story.create({
            user : userId,
            content,
            background_color,
            media_url,
            media_type
        })
        
        //! triggering the function to delete story after 24 hours

        await inngest.send({
            name : "app/story.delete",
            data : {
                storyId : story._id
            }
        })

        return res.status(200).json({
            success : true,
            message : "Story Created Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
} 

//! get user stories

export const getFriendsStories = async (req, res) => {
    try {
        const {userId} = req.auth()
    
        const user = await User.findById(userId)
    
        const userFriends = [userId, ...user.connections, ...user.following]
    
        const friendsStories = await Story.find({
            user : {
                $in : userFriends 
            }
        }).populate('user').sort({createdAt : -1})
    
        return res.status(200).json({
            success : true, friendsStories
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            message: error.message
        })
    }
}
