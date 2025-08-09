import fs from "fs"
import imagekit from "../config/imagekit.js"
import { Message } from "../models/message.model.js"



//!server side events (sse) for real time chat
const connections = {}

//!controller function for sse endpoints

export const sseController =  (req, res) => {
    const {userId} = req.params
    console.log("New Client Connected", userId)

    //! set sse headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    //! add the client's response to the connection object 
    connections[userId] = res

    /*
    connections[userId] = "Hello";  // key: "abc123", value: "Hello"
    connections["userId"] = "Hi";   // key: "userId", value: "Hi"

    */

    //! send an initial event to the client                                     
    res.write('log: Connected to SSE stream\n\n')

    //! handle client disconnection
    req.on('close', ()=>{
        //! remove client's response from the connection array
        delete connections[userId]
        console.log("Client disconnected")
    })
}

//! send messages

export const sendMessages = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {to_user_id, text} = req.body
        const image = req.file
    
        let media_url = ""
        let message_type = image ? "image" : "text"
    
        if(message_type === "image"){
            const fileBuffer = fs.readFileSync(image.path)
    
            const response = await imagekit.upload({
                file : fileBuffer,
                fileName : image.originalname
            })
            media_url = imagekit.url({
                path : response.filePath,
                transformation : [
                    {quality : "auto"},
                    {format : "webp"},
                    {width : '1280'}
                ]
            })
        }
    
        const message = await Message.create({
            from_user_id : userId,
            to_user_id,
            text,
            message_type,
            media_url
            //! problem can happen here
        })
    
        res.status(200).json({
            success : true,
            message
        })
    
        //! send message to to_user_id using sse
    
        const messageWithUserData = await Message.findById(message._id).populate('from_user_id')
    
        if(connections[to_user_id]){
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
}

//! get chat messages

export const getChatMessages = async (req, res) => {
    try {
        const {userId} = req.auth()
        const { to_user_id } = req.body

        const messages = await Message.find({
            $or : [
                {from_user_id : userId,
                to_user_id},
                {from_user_id : to_user_id,
                    to_user_id : userId
                }
            ]
        }).sort({createdAt : -1})
        //! mark messages as seen
        
        await Message.updateMany({from_user_id : to_user_id, to_user_id : userId},
            {seen : true}
        )
        return res.status(200).json({
            success : true,
            messages
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
}

export const getRecentMessages = async (req, res) => {
    try {
        const {userId} = req.auth()
        const messages = await Message.find({to_user_id : userId}).populate('from_user_id to_user_id').sort({createdAt : -1})

        return res.status(200).json({
            success : true,
            messages
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
}