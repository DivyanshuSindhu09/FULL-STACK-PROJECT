import express from 'express'
import { upload } from '../config/multer.js'
import { protect } from '../middlewares/auth.js'
import { addPost, getPost, likePost } from '../controllers/post.controller.js'

const postRouter = express.Router()

postRouter.post('/add', upload.array('images', 4), protect, addPost)
postRouter.get('/feed',  protect, getPost)
postRouter.post('/like', protect, likePost)

export default postRouter