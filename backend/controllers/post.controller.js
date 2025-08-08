//! add post 
import fs from 'fs'
import imagekit from '../config/imagekit.js'
import { Post } from '../models/post.model.js'

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