import express from "express"
import { getChatMessages, sendMessages, sseController } from "../controllers/message.controller.js"
import { protect } from "../middlewares/auth.js"
import { upload } from "../config/multer.js"

const messageRouter = express.Router()

messageRouter.get("/:userId", sseController)
messageRouter.post("/send", protect, upload.single('image'), sendMessages)
messageRouter.post("/get", protect, getChatMessages)



export default messageRouter